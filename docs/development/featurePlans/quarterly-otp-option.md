# Quarterly One-Time Purchase Option

Scoped 2026-08-28, immediately after the pricing anchor coherence work (SCRUM-1257/1258/1259) merged. Branch: `feature/quarterly-otp-option`.

## Problem

The quarterly plans have no one-time equivalent on-site: a bulk buyer who will not subscribe has no path to 60/120 shots, and the £189.99 quarterly anchor the site now strikes is a price you can only actually pay off-site. Adding the option captures sub-averse volume buyers (£189.99 to £279.99 orders vs £69.98 today) and makes the quarterly anchor demonstrably purchasable, which is the trust thesis of the anchor work.

**Cannibalisation risk acknowledged:** quarterly sub is the highest-LTV plan. Mitigation is placement: the one-time offer stays a subordinate text link under the CTA with the subscription cards showing their far larger savings (43 to 62%) beside it. Kill-switch is trivial (remove the link, keep the data).

## Approach

A fourth cadence (`quarterly-otp`) in the offer catalogue (`app/lib/offerData.ts`), wired to the Skio-era one-time SKUs, and the existing "Buy it once" link becomes selection-aware: it always offers the one-time equivalent of the currently selected plan card. No new components, no layout changes. Design language: Simple DTC (existing surfaces only).

### Decided

- **Itemised display:** £180.00 + £9.99 postage (Flow/Clear) and £270.00 + £9.99 (Both). Totals match the Shopify variant prices to the penny (£189.99 / £279.99), and per-shot lands at £3.00 / £2.25, identical to the monthly one-time, keeping the per-shot story coherent. This supersedes the earlier all-in-display idea and resolves the 3p rounding wrinkle (3 x £59.99 + £9.99 = £189.96, not £189.99).
- **Anchors (revised same day, the ascending-ladder scheme):** every compare-at derives from the monthly-size one-time reference unit (`MONTHLY_OTP_ALL_IN`: £69.98 single, £129.97 Both) scaled by months, so the badge ladder ascends with quantity (the Magic Mind pattern, decided by Rudh from the MM screenshot: their 60-bottle strike is the 15-bottle price scaled and their badges ascend 50/58/60%). Quarterly one-times carry their own badge (three postages collapse to one): Flow/Clear anchor £199.95 deriving 10%, Both anchor £379.92 deriving 29%. Quarterly subs anchor to three full reference units: £209.94 deriving 48%, Both £389.91 deriving 62%. Full ladders: Flow/Clear 0/10/43/48, Both 25/29/42/62. Canonical statement: `docs/ops/offerings-and-discounts.md` §2. This superseded the first draft of this plan, which had the quarterly SKU base prices as the quarterly-sub anchors (42%) and inverted the ladder against the monthly 43%.
- **Cart attribute `plan_frequency` stays `"one-time"`** for quarterly OTP; the SKU distinguishes size.
- **Upsell:** exactly one new edge, quarterly-otp to quarterly-sub. No cross-size upsells.
- **Synergy:** cleared 2026-08-28 by Rudh. The new variants are compositions of existing products, so no new 3PL SKU setup is needed.

### Variants (Shopify, verified ACTIVE and available for sale 2026-08-28)

| SKU | Variant GID (numeric) | One-time price |
|-----|-----------------------|----------------|
| FLOW-60 | 58457811550582 | £189.99 |
| CLEAR-60 | 58457854411126 | £189.99 |
| BOTH-120 | 58457864077686 | £279.99 |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Data layer: quarterly-otp cadence, pricing, variants, detection, upsell maps | Complete (2026-08-28) |
| 2 | Surfaces: selection-aware one-time link on PDP and BYO, summaries | Complete (2026-08-28) |
| 3 | Shipping on top: un-bake £9.99 from OTP SKUs, Shopify shipping profile, Synergy rate mapping | Future, ops-gated |

### Phase 1: Data layer (`app/lib/offerData.ts`, `app/lib/byoCheckout.ts`)

1. Extend `OfferCadence` with `"quarterly-otp"`; add three `OFFER_PRICING` entries (price 180.00 / 180.00 / 270.00, `postage: OTP_POSTAGE`, shotCount 60/60/120, perShot 3.00/3.00/2.25; compare-at values per the ascending-ladder anchors in the Decided section).
2. `OFFER_VARIANTS` entries for the three SKUs (no selling plan); extend `detectOfferCadence` so a quarterly variant without a selling plan resolves to `quarterly-otp`.
3. Typed ripple (the compiler enumerates it): `getCadenceFrequency` (returns "one-time"), `OFFER_CADENCES` display entry, `getUpsellOffer` (quarterly-otp upgrades to quarterly-sub), `cartUpsell.resolveUpgrade` (same edge), `getOfferPriceRange` (high becomes £189.99, accurate), BYO checkout mapping.

### Phase 2: Surfaces (`ProductBuyPanel.tsx`, `CadenceSelector.tsx`, `SummaryStep.tsx`)

4. PDP: the OTP link resolves `monthly-sub -> monthly-otp`, `quarterly-sub -> quarterly-otp` from `selectedCadence`; `onOtpAddToCart` adds that variant.
5. BYO: the link selects the OTP matching the highlighted plan card; `PlanSummaryList` and `SummaryStep` render its one-time copy and billed-today total.

### Phase 3: Shipping on top (Future)

Reprice OTP variants down (£69.98 to £59.99, £99.98 to £89.99, £189.99 to £179.97, £279.99 to £269.97 or equivalent), put the OTP SKUs in a per-product Shopify shipping profile carrying a £9.99 rate, add the new rate NAME to Synergy's carrier mapping (Synergy maps on rate name only; the sheet is locked), then update the site's display/analytics postage constants. Coordinate with `docs/development/featurePlans/order-size-shipping-tiers.md` so the two shipping plans do not fight. Gated on ops; ticketed but not started.

## Rabbit holes

- The upsell matrix: one new edge only.
- The plan selector: stays two cards + one link; no four-card redesign.
- Account portal: one-time orders never appear there; do not touch it.

## No-gos

- No Shopify price or shipping changes in Phases 1-2 (Phase 3 owns that).
- No lander/start wiring (legacy surfaces).
- No changes to the anchors shipped in SCRUM-1258.

## Risks

- `feature/starter-pack` (SCRUM-1283) is unmerged and touches `offerData.ts` + `ProductBuyPanel.tsx`; whichever merges second reconciles.
- Mobile: the link is one wrapping text line; longest case "Buy it once for £270.00 + £9.99 postage" at 390px.

## References

- Anchor rules: `docs/ops/offerings-and-discounts.md`
- SKUs and Skio-era variants: `docs/product/SKU_AND_SHOT_REFERENCE.md`
- Charged-price rule: `docs/development/CART_PRICING_SOURCE_OF_TRUTH.md`
- Cart attributes: `docs/development/CART_ATTRIBUTES.md`

## Jira tickets

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1285 | [Website & CRO] Quarterly one-time purchase option on the PDPs and Build Your Order | 1 + 2 | For review |
| SCRUM-1286 | [Shopify & Subscriptions] Shipping on top: un-bake postage from one-time SKUs and charge a real shipping rate | 3 (ops-gated, backlog) | To Do |
