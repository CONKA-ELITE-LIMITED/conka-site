# Funnel Events

Vercel Analytics taxonomy for the three funnels. Implemented in `app/lib/analytics.ts` (`trackFunnel*`).

Supersedes the ad-hoc `funnelc:*` events and the two duplicate local `safeTrack` helpers that previously lived inside the funnel clients.

## The variant property

All three funnels fire the **same event names** and are told apart by a `variant` property:

| Variant | Route | File |
|---------|-------|------|
| `a` | `/funnel` | `app/funnel/FunnelClient.tsx` |
| `b` | `/funnel-b` | `app/(trial-b)/funnel-b/FunnelClient.tsx` |
| `c` | `/funnel-c` | `app/(trial-b)/funnel-c/FunnelClient.tsx` |

The variant is deliberately **not** baked into the event name. Vercel's dashboard groups by event name, so `funnelc:step2_completed` would be a different row from `funnelb:step2_completed` and the two could never appear on the same drop-off chart. As a property, you drill into one event and break it down by variant, or group on `eventData/variant` via the Web Analytics API.

Before this change `/funnel` and `/funnel-b` both fired identical `funnel:*` names with no variant, so they were indistinguishable in Vercel.

## The two-property budget

**Every event carries exactly two properties.** This is a hard constraint, not a style preference.

Vercel Web Analytics allows **2 custom properties per event on the Pro plan** (8 only with the Web Analytics Plus add-on, $10/month). The client SDK does **not** enforce this: `parseProperties()` validates value *types* but never counts keys, so extra properties are sent and the limit is applied inside Vercel's ingestion/query layer, where the behaviour is undocumented. Extras may simply be unqueryable.

So product and cadence are packed into a single `config` string rather than sent as two properties. Split on `|` when analysing.

Billing counts events, not properties, so this costs nothing either way.

**Do not add a third property to any funnel event without first confirming the account has the Plus add-on.**

## Events

| Event | Properties | Fires when |
|-------|-----------|------------|
| `funnel:viewed` | `variant`, `config` | Funnel mounts. `config` is the pre-selected default offer. |
| `funnel:step1_completed` | `variant`, `config` | User advances past step 1. |
| `funnel:step2_completed` | `variant`, `config` | User advances past step 2. |
| `funnel:step3_completed` | `variant`, `config` | User advances past step 3. In funnel-c (3 steps) this is the Checkout press. |
| `funnel:product_changed` | `variant`, `change` | Formula switched. `change` packs `from>to`. |
| `funnel:cadence_changed` | `variant`, `change` | Plan switched. `change` packs `from>to`. |
| `funnel:cta_clicked` | `variant`, `config` | Checkout button pressed, before any upsell. |
| `funnel:checkout` | `variant`, `config` | Cart created, redirecting to Shopify. |
| `funnel:checkout_failed` | `variant`, `reason` | Checkout errored before redirect. |
| `funnel:upsell_shown` | `variant`, `config` | Upsell sheet opened. `config` is the ORIGINAL offer. |
| `funnel:upsell_accepted` | `variant`, `config` | Upsell taken. `config` is the UPGRADED offer, so it reads as the outcome. |
| `funnel:upsell_declined` | `variant`, `config` | Declined, continuing to checkout with the original offer. |
| `funnel:upsell_dismissed` | `variant`, `config` | Dismissed without choosing. Not a checkout. |
| `funnel:nutrition_viewed` | `variant`, `config` | Spec modal opened. Variants a/b only: funnel-c's modal is unreachable. |
| `funnel:back_nav` | `variant`, `step` | Backward navigation. `step` is the step being LEFT. |
| `funnel:accordion_opened` | `variant`, `id` | A disclosure opened. Opens only, never closes. Variant c only. |

`config` format: `"<product>|<cadence>"`, e.g. `"flow|monthly-sub"`.

## Step completions: the double-fire trap

Step completion is the drop-off signal, so inflating it destroys the only number the instrumentation exists to produce.

All three funnels drive steps through `history.pushState`, with a `popstate` listener that calls `setStep`. That makes two obvious implementations **wrong**:

- **A `useEffect` on the step value.** Browser back or forward fires popstate, which calls `setStep`, which re-runs the effect. A user oscillating back and forward inflates completions without limit.
- **Tracking inside `goToStep`.** `goToStep` is also the **backward** handler: the nav arrow and the step-indicator jumps both route through it. Clicking back to step 2 would fire `step2_completed`.

The correct pattern, used by all three:

1. Fire **only** from explicit forward-intent handlers (`handleForward` / `advanceFrom`).
2. Guard with a `useRef<Set<Step>>` so each step's completion fires **at most once per session**.
3. `goToStep` and the popstate listener stay untracked.

## Order attribution

The funnel checkout tags the Shopify cart with a `_source` attribute, which flows into Shopify and Triple Whale.

| Funnel | `_source` | Helper |
|--------|-----------|--------|
| `/funnel` | `funnel_page` | `app/lib/funnelCheckout.ts` |
| `/funnel-b` | `funnel_page_b` | `app/(trial-b)/lib/funnelCheckout.ts` (default) |
| `/funnel-c` | `funnel_page_c` | same helper, `source` param |

`app/(trial-b)/lib/funnelCheckout.ts` is shared by funnel-b and funnel-c and previously hardcoded `funnel_page_b`, so **every funnel-c order was tagged as funnel-b** and no revenue could be attributed to funnel-c. It now takes a `source` param, defaulting to funnel-b's tag so its history stays continuous.

## Reading the data

There is **no native funnel or drop-off chart in Vercel Web Analytics.** Step-to-step conversion means either reading the three step-completion counts off the Events panel, or computing it from the API:

```
GET /v1/query/web-analytics/events/aggregate
  ?by=eventName,eventData/variant
  &filter=eventName eq 'funnel:step2_completed'
```

Grouped queries return at most 100 distinct values and bucket the rest into `Others`, which is not a concern here: `variant` has 3 values and `config` has 9.

## Open: the property probe

`trackFunnelPropertyProbe()` fires a single `funnel:probe` event carrying **four** properties (`variant`, `probeB`, `probeC`, `probeD`) from funnel-c on mount. It exists to settle empirically what Vercel does with over-limit properties, which is documented nowhere and has no first-hand account online.

Once funnel-c has live traffic, query `funnel:probe` grouped by `eventData/probeC` and `eventData/probeD`:

- **All four queryable**: the limit is display/query-side only. The two-property budget above can be relaxed.
- **Only two return**: extras are dropped at ingestion. Keep the budget, and note which two survived (insertion order vs alphabetical).
- **Event missing entirely**: over-limit events are rejected outright. Keep the budget, and audit anything else in the codebase sending more than two.

**Delete `trackFunnelPropertyProbe` and its call site once the answer is recorded here.**
