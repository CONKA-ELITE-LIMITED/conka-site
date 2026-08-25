# Build Your Order Events

Vercel Analytics taxonomy for the Build Your Order flow (`/build-your-order`). Implemented in `app/lib/analytics.ts` (`trackByo*` helpers).

> **Taxonomy cutover (SCRUM-1248, Aug 2026):** the flow fires `byo:*` events with `variant: "v1"`. Pre-consolidation history lives under the retired `funnel:*` names with variants `a`/`b`/`c`; the three funnel pages themselves were collapsed into `/build-your-order` in SCRUM-1247. The conka-lab dashboard ingests `byo:viewed` + the three step events (plus the shared `purchase:add_to_cart`, `cart:checkout_clicked` and `cart:upsell_*`).

## The variant property

Every event carries a `variant` property, fixed at `"v1"` until an A/B variant exists. The slot exists so a future variant shares every event name rather than fragmenting them: Vercel's dashboard groups by event name, so per-variant names could never appear on the same drop-off chart. As a property, you drill into one event and break it down by variant, or group on `eventData/variant` via the Web Analytics API.

## The two-property budget

**Every event carries exactly two properties.** This is a hard constraint, not a style preference.

Vercel Web Analytics allows **2 custom properties per event on the Pro plan** (8 only with the Web Analytics Plus add-on, $10/month). The client SDK does **not** enforce this: `parseProperties()` validates value *types* but never counts keys, so extra properties are sent and the limit is applied inside Vercel's ingestion/query layer, where the behaviour is undocumented. Extras may simply be unqueryable.

So product and cadence are packed into a single `config` string rather than sent as two properties. Split on `|` when analysing.

Billing counts events, not properties, so this costs nothing either way.

**Do not add a third property to any event without first confirming the account has the Plus add-on.**

## Events survive navigation (verified 2026-08-24)

Firing a Vercel event immediately before `window.location.href` is safe. Vercel's insights script posts custom events with `fetch(..., { keepalive: true })`, so the request is not cancelled by the navigation. Verified by reading the live script at `va.vercel-scripts.com/v1/script.js`; the keepalive flag sits on the shared options object covering both the pageview and the event endpoint.

This matters wherever we measure a click that leaves the site (`cart:checkout_clicked`, `byo:checkout`, `listicle:cta_clicked`). Do not add a `setTimeout` before such a redirect to "give analytics time" - it is unnecessary and it slows the path to checkout.

## Events

The flow has 3 steps: Learn > Build (product + plan on one page) > Review.

| Event | Properties | Fires when |
|-------|-----------|------------|
| `byo:viewed` | `variant`, `config` | Flow mounts. `config` is the pre-selected default offer (`both\|monthly-sub`). |
| `byo:step1_completed` | `variant`, `config` | User advances past step 1 (Learn). |
| `byo:step2_completed` | `variant`, `config` | User advances past step 2 (Build). |
| `byo:step3_completed` | `variant`, `config` | User advances past step 3 (Review) - the Checkout press. |
| `byo:product_changed` | `variant`, `change` | Formula switched. `change` packs `from>to`. |
| `byo:cadence_changed` | `variant`, `change` | Plan switched. `change` packs `from>to`. |
| `byo:cta_clicked` | `variant`, `config` | Checkout button pressed, before any upsell. |
| `byo:checkout` | `variant`, `config` | Cart created, redirecting to Shopify. |
| `byo:checkout_failed` | `variant`, `reason` | Checkout errored before redirect. |
| `cart:upsell_shown` | `type`, `product` | Upsell sheet opened. SHARED event with the cart drawer tile; `type` is the upgrade kind (`single_to_both`, `otp_to_sub`, `monthly_to_quarterly`), `product` the FROM product. Ingested by conka-lab. |
| `cart:upsell_accepted` | `type`, `product` | Upsell taken. Same shared shape. |
| `byo:upsell_declined` | `variant`, `config` | Declined, continuing to checkout with the original offer. |
| `byo:upsell_dismissed` | `variant`, `config` | Dismissed without choosing. Not a checkout. |
| `byo:back_nav` | `variant`, `step` | Backward navigation. `step` is the step being LEFT. |
| `byo:accordion_opened` | `variant`, `id` | A disclosure opened. Opens only, never closes. |
| `cart:checkout_clicked` | `items`, `value` | Cart created, immediately before the Shopify redirect. SHARED event; `value` is the all-in charged price. Ingested by conka-lab. |
| `purchase:add_to_cart` | (10 props) | Fired at checkout alongside the Meta events; the dashboard reads `productId` + `source`. |

`config` format: `"<product>|<cadence>"`, e.g. `"both|monthly-sub"`.

Retired: `funnel:nutrition_viewed` (spec modal only existed on deleted variants a/b) and the `funnel:probe` property-limit probe (deleted unread in SCRUM-1248; the 2-property budget stays as documented until someone re-runs the experiment).

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

The checkout (`app/lib/byoCheckout.ts`) tags the Shopify cart with a `_source` attribute, which flows into Shopify and Triple Whale, and passes the same value as the `source` prop on `purchase:add_to_cart`.

Source resolution (SCRUM-1248): the flow calls `captureListicleSrc()` on mount, so a visitor arriving from a listicle CTA (`?src=<slug>-<section>`) carries that token through to `_source` even after in-flow navigation drops the param. Everyone else gets `BYO_SOURCE` (`byo_page`). Historic `_source` values in Shopify/Triple Whale: `funnel_page` (deleted variant a), `funnel_page_b` (deleted variant b), `funnel_page_c` (this flow until the Aug 2026 cutover).

Analytics values (Meta AddToCart/InitiateCheckout `value`, `purchase:add_to_cart` `price`, `cart:checkout_clicked` `value`) all use the ALL-IN charged price via `getChargedPrice`, so reported value matches the order total (OTP SKUs bake postage into the variant price).

## Reading the data

There is **no native funnel or drop-off chart in Vercel Web Analytics.** Step-to-step conversion means either reading the three step-completion counts off the Events panel, or computing it from the API:

```
GET /v1/query/web-analytics/events/aggregate
  ?by=eventName,eventData/variant
  &filter=eventName eq 'byo:step2_completed'
```

Grouped queries return at most 100 distinct values and bucket the rest into `Others`, which is not a concern here: `config` has 9 values.

The conka-lab dashboard (`conka-lab/convex/lib/vercelClient.ts` allowlist + `src/lib/website-pages.ts` tracked pages) ingests `byo:viewed`, the three `byo:stepN_completed` events, `purchase:add_to_cart`, `cart:upsell_shown`/`_accepted` and `cart:checkout_clicked`, and counts `/build-your-order` visitors as a funnel stage.
