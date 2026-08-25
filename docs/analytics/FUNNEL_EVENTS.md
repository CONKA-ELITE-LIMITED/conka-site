# Build Your Order Events

Vercel Analytics taxonomy for the Build Your Order flow (`/build-your-order`). Implemented in `app/lib/analytics.ts` (`trackFunnel*` helpers).

> **Consolidation status (SCRUM-1247, Aug 2026):** the three funnel variants (`/funnel`, `/funnel-b`, `/funnel-c`) are collapsed into `/build-your-order`, built from funnel-c. The event NAMES below still use the historic `funnel:*` prefix and the `variant: "c"` property; they rename to `byo:*` in Phase 2 (SCRUM-1248), which also wires the events into the conka-lab dashboard. Do not build new reporting on the `funnel:*` names.

## The variant property

Every event carries a `variant` property. Historically this told the three funnels apart (`a` / `b` / `c`); the live flow still sends `c` (see `BYO_VARIANT` in `app/build-your-order/defaults.ts`) so pre-consolidation history remains comparable. The property slot is kept for future A/B tests rather than baking variants into event names: Vercel's dashboard groups by event name, so per-variant names could never appear on the same drop-off chart. As a property, you drill into one event and break it down by variant, or group on `eventData/variant` via the Web Analytics API.

## The two-property budget

**Every event carries exactly two properties.** This is a hard constraint, not a style preference.

Vercel Web Analytics allows **2 custom properties per event on the Pro plan** (8 only with the Web Analytics Plus add-on, $10/month). The client SDK does **not** enforce this: `parseProperties()` validates value *types* but never counts keys, so extra properties are sent and the limit is applied inside Vercel's ingestion/query layer, where the behaviour is undocumented. Extras may simply be unqueryable.

So product and cadence are packed into a single `config` string rather than sent as two properties. Split on `|` when analysing.

Billing counts events, not properties, so this costs nothing either way.

**Do not add a third property to any event without first confirming the account has the Plus add-on.**

## Events survive navigation (verified 2026-08-24)

Firing a Vercel event immediately before `window.location.href` is safe. Vercel's insights script posts custom events with `fetch(..., { keepalive: true })`, so the request is not cancelled by the navigation. Verified by reading the live script at `va.vercel-scripts.com/v1/script.js`; the keepalive flag sits on the shared options object covering both the pageview and the event endpoint.

This matters wherever we measure a click that leaves the site (`cart:checkout_clicked`, `funnel:checkout`, `listicle:cta_clicked`). Do not add a `setTimeout` before such a redirect to "give analytics time" - it is unnecessary and it slows the path to checkout.

## Events

The flow has 3 steps: Learn > Build (product + plan on one page) > Review.

| Event | Properties | Fires when |
|-------|-----------|------------|
| `funnel:viewed` | `variant`, `config` | Flow mounts. `config` is the pre-selected default offer (`both\|monthly-sub` since SCRUM-1247). |
| `funnel:step1_completed` | `variant`, `config` | User advances past step 1 (Learn). |
| `funnel:step2_completed` | `variant`, `config` | User advances past step 2 (Build). |
| `funnel:step3_completed` | `variant`, `config` | User advances past step 3 (Review) - the Checkout press. |
| `funnel:product_changed` | `variant`, `change` | Formula switched. `change` packs `from>to`. |
| `funnel:cadence_changed` | `variant`, `change` | Plan switched. `change` packs `from>to`. |
| `funnel:cta_clicked` | `variant`, `config` | Checkout button pressed, before any upsell. |
| `funnel:checkout` | `variant`, `config` | Cart created, redirecting to Shopify. |
| `funnel:checkout_failed` | `variant`, `reason` | Checkout errored before redirect. |
| `funnel:upsell_shown` | `variant`, `config` | Upsell sheet opened. `config` is the ORIGINAL offer. |
| `funnel:upsell_accepted` | `variant`, `config` | Upsell taken. `config` is the UPGRADED offer, so it reads as the outcome. |
| `funnel:upsell_declined` | `variant`, `config` | Declined, continuing to checkout with the original offer. |
| `funnel:upsell_dismissed` | `variant`, `config` | Dismissed without choosing. Not a checkout. |
| `funnel:back_nav` | `variant`, `step` | Backward navigation. `step` is the step being LEFT. |
| `funnel:accordion_opened` | `variant`, `id` | A disclosure opened. Opens only, never closes. |

`config` format: `"<product>|<cadence>"`, e.g. `"both|monthly-sub"`.

Retired with the deleted variants: `funnel:nutrition_viewed` (the spec modal only existed on variants a/b; the flow's modal is unreachable and the event can no longer fire).

## Step completions: the double-fire trap

Step completion is the drop-off signal, so inflating it destroys the only number the instrumentation exists to produce.

The flow drives steps through `history.pushState`, with a `popstate` listener that calls `setStep`. That makes two obvious implementations **wrong**:

- **A `useEffect` on the step value.** Browser back or forward fires popstate, which calls `setStep`, which re-runs the effect. A user oscillating back and forward inflates completions without limit.
- **Tracking inside `goToStep`.** `goToStep` is also the **backward** handler: the nav arrow and the step-chip jumps both route through it. Clicking back to step 2 would fire `step2_completed`.

The correct pattern (see `handleForward` in `app/build-your-order/BuildYourOrderClient.tsx`):

1. Fire **only** from explicit forward-intent handlers.
2. Guard with a `useRef<Set<Step>>` so each step's completion fires **at most once per session**.
3. `goToStep` and the popstate listener stay untracked.

## Order attribution

The checkout (`app/lib/byoCheckout.ts`) tags the Shopify cart with a `_source` attribute, which flows into Shopify and Triple Whale. The live flow passes `BYO_SOURCE` (`funnel_page_c` - the historic funnel-c value, kept so revenue attribution stays continuous). Historic values in Shopify/Triple Whale: `funnel_page` (deleted variant a), `funnel_page_b` (deleted variant b, also the helper's default), `funnel_page_c` (funnel-c, now Build Your Order).

Phase 2 (SCRUM-1248) replaces the hardcoded source with the captured listicle `?src=` (falling back to `byo_page`) so listicle-originated orders become distinguishable.

## Reading the data

There is **no native funnel or drop-off chart in Vercel Web Analytics.** Step-to-step conversion means either reading the three step-completion counts off the Events panel, or computing it from the API:

```
GET /v1/query/web-analytics/events/aggregate
  ?by=eventName,eventData/variant
  &filter=eventName eq 'funnel:step2_completed'
```

Grouped queries return at most 100 distinct values and bucket the rest into `Others`, which is not a concern here: `config` has 9 values.

Note the conka-lab dashboard ingests **none** of the `funnel:*` events today; its allowlist (`conka-lab/convex/lib/vercelClient.ts`) picks up the step events when they rename in Phase 2.

## Open: the property probe

`trackFunnelPropertyProbe()` fires a single `funnel:probe` event carrying **four** properties (`variant`, `probeB`, `probeC`, `probeD`) from the flow on mount. It exists to settle empirically what Vercel does with over-limit properties, which is documented nowhere and has no first-hand account online.

Once the flow has live traffic, query `funnel:probe` grouped by `eventData/probeC` and `eventData/probeD`:

- **All four queryable**: the limit is display/query-side only. The two-property budget above can be relaxed.
- **Only two return**: extras are dropped at ingestion. Keep the budget, and note which two survived (insertion order vs alphabetical).
- **Event missing entirely**: over-limit events are rejected outright. Keep the budget, and audit anything else in the codebase sending more than two.

**Delete `trackFunnelPropertyProbe` and its call site once the answer is recorded here** (scheduled with the Phase 2 taxonomy rename, SCRUM-1248).
