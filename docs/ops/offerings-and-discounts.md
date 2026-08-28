# Offerings & Discount Anchors

The canonical rules for every crossed-out price and savings percentage the site shows, plus the audit of every surface that renders one. Written for SCRUM-1257 (Phase 1 of the pricing anchor coherence work); SCRUM-1258 makes the code obey these rules and SCRUM-1259 fixes the surfaces.

**The layer these rules govern is the offer catalogue: `OFFER_PRICING` (type `OfferPricing`) in `app/lib/offerData.ts`.** It serves every surface that sells: the PDPs, the cart drawer, the account portal, JSON-LD and meta descriptions, and the legacy Build Your Order and trial landing flows. It is not a Build Your Order module; that flow is just one legacy consumer.

Charged prices are out of scope here and never change as part of this work. Pre-add UI prices come from `offerData.ts`; cart and checkout prices come from Shopify only (`docs/development/CART_PRICING_SOURCE_OF_TRUTH.md`).

---

## 1. The rules

1. **One anchor per product per cadence, derived from a real purchasable price.** An anchor (the crossed-out "was" price) must be a price a customer could actually pay today for the same priced shots. No anchor may be reverse-engineered from a percentage.
2. **Every percentage is derived, never declared.** `Save X%` = `round((anchor - price) / anchor * 100)`. A percentage with no compare-at price behind it is a defect. (`getDisplayDiscount` currently allows a declared `discountPercent` to override the derivation; SCRUM-1258 removes that path.)
3. **Free bonus shots are a gift and never sit inside a discount percentage.** The percentage is price against price on the shots the customer pays for. Free shots appear as a separate gift line ("+8 free shots"), never folded into the maths.
4. **Postage is £9.99 per order, not per box.** One-time orders carry it (itemised in the UI, baked into the Shopify OTP variant price); subscriptions ship free.
   - When the two sides of a comparison carry the **same** postage (one-time vs one-time), the anchor excludes postage: it cancels out.
   - When only one side carries postage (subscription vs one-time), the anchor is the **all-in charged** one-time price (`getChargedPrice`): the postage saving is real.
5. **Both's one-off reference price is £119.98**: one Flow box plus one Clear box (2 x £59.99), not the £89.99 Both one-off box. This is what makes the £3.00 per-shot valuation used across the site sourceable (£119.98 / 40 shots = £3.00) rather than arbitrary.
6. **Gift RRPs in a value stack are display-only and pre-add.** They never reach a cart line or checkout (`docs/development/CART_PRICING_SOURCE_OF_TRUTH.md`).
7. **`freeShotsValue` is a live gift-stack anchor, not dead code.** It is the struck RRP on the bonus-shots tile of the PDP gift grid (`GiftValueStack`, landing with `feature/starter-pack` / SCRUM-1283). Derivation: bonus shots x the £3.00 one-time per-shot value, presented with a .99 ending (8 shots = £23.99, 16 = £47.99, 20 = £59.99). Do not delete it.

## 2. The canonical anchors (one per product per cadence)

Real purchasable prices verified against Shopify Admin on 2026-08-28 (CONKA Read-Only app). The Skio selling-plan work created dedicated one-time variants whose base prices give quarterly its first real one-time anchor: FLOW-60 / CLEAR-60 at £189.99 and BOTH-120 at £279.99 (all ACTIVE and available for sale).

| Product | Cadence | Price | Anchor | Anchor source (real price) | Derived % |
|---------|---------|-------|--------|----------------------------|-----------|
| Flow | monthly-sub | £39.99 | £69.98 | FLOW-FUNNEL-20-OTP all-in charged price (£59.99 + £9.99 postage) | 43% |
| Flow | monthly-otp | £59.99 + £9.99 | none | Is the reference price | 0% |
| Flow | quarterly-sub | £109.99 | £189.99 | FLOW-60 one-time base price (Skio-era variant 58457811550582) | 42% |
| Clear | monthly-sub | £39.99 | £69.98 | CLEAR-FUNNEL-20-OTP all-in charged price | 43% |
| Clear | monthly-otp | £59.99 + £9.99 | none | Is the reference price | 0% |
| Clear | quarterly-sub | £109.99 | £189.99 | CLEAR-60 one-time base price (58457854411126) | 42% |
| Both | monthly-sub | £74.99 | £99.98 | BOTH-FUNNEL-40-OTP all-in charged price (£89.99 + £9.99 postage) | 25% |
| Both | monthly-otp | £89.99 + £9.99 | £119.98 | One Flow box + one Clear box (2 x £59.99, postage cancels) | 25% |
| Both | quarterly-sub | £149.99 | £279.99 | BOTH-120 one-time base price (58457864077686) | 46% |

Notes:

- The Both one-off's 25% and the Both subscription's 25% read as consistent by design: the one-off is 25% off buying the two singles, and subscribing saves a further 25% off the one-off. That coherence is the point of rule 5 (see SCRUM-1259's context).
- The quarterly one-time variants bake per-order postage in, the same way the monthly OTP SKUs do: £189.99 sits 3p above 3 x £59.99 + £9.99 (£189.96, rounded up to a .99 ending), and £279.99 likewise above £279.96.
- `OFFER_PRICING`'s stored `compareAtPrice` fields currently disagree with these anchors on several entries (see §4). SCRUM-1258 reconciles the fields; no displayed price changes.

### Worked examples

- **Flow monthly subscription**: £39.99, ships free. Same 20 priced shots bought once: £59.99 + £9.99 postage = £69.98 all-in. Save = (69.98 - 39.99) / 69.98 = 42.9% -> **43%**. The +8 free first-order shots are a gift line, not part of the percentage.
- **Flow quarterly subscription**: £109.99, ships free. Same 60 priced shots bought once: FLOW-60 at £189.99 (a real ACTIVE variant). Save = (189.99 - 109.99) / 189.99 = 42.1% -> **42%**. The +20 free shots per cycle stay out of the maths.
- **Both one-time**: £89.99 + £9.99 postage. Reference: one Flow box + one Clear box = £119.98 (both routes pay the same one order's postage, so it cancels). Save = (119.98 - 89.99) / 119.98 = 25.0% -> **25%**.
- **Both monthly subscription**: £74.99, ships free. Same 40 priced shots bought once: £89.99 + £9.99 = £99.98 all-in. Save = (99.98 - 74.99) / 99.98 = 25.0% -> **25%**.
- **Both quarterly subscription**: £149.99, ships free. Same 120 priced shots bought once: BOTH-120 at £279.99. Save = (279.99 - 149.99) / 279.99 = 46.4% -> **46%**.
- **Gift value stack (Flow PDP)**: 8 bonus shots x £3.00 one-time per-shot = £23.99 struck RRP (`freeShotsValue`). Display-only, pre-add (rules 6 and 7).

## 3. Surface inventory (every price, strike, and percentage)

Every component that renders a price, a crossed-out price, or a savings percentage, the exact expression it uses, and whether the result is sourceable from a real price. **PDP** rows are live commercial surfaces and rank first for Phase 3; **legacy** rows (`/build-your-order`, `/start`, `/start-b`, `/lander`, `/lander-b`) have no live ad traffic and no site nav links but read the same `OFFER_PRICING`.

| # | Surface | Component | Expression | Sourceable? |
|---|---------|-----------|------------|-------------|
| 1 | PDP | `ProductBuyPanel` FlatPlanCard "% off" badge | `getDisplayDiscount(pricing)` = declared `discountPercent` (43 / 63 / 46 / 69) | **No** for quarterly (63, 69) and Both monthly (46): no real price yields them. Flow/Clear monthly 43 happens to equal the £69.98 derivation |
| 2 | PDP | `ProductBuyPanel` FlatPlanCard strike, monthly-sub | `getChargedPrice(monthly-otp)` = £69.98 / £99.98 | **Yes** (real all-in OTP price) |
| 3 | PDP | `ProductBuyPanel` FlatPlanCard strike, quarterly-sub | `pricing.price / (1 - savePct / 100)` = £297.27 (Flow/Clear), £483.84 (Both) | **No**: anchor fabricated backwards from the declared percentage |
| 4 | PDP | `ProductBuyPanel` SubscriptionSummary "Save X% vs buying once" | same `getDisplayDiscount` | Same defects as row 1 |
| 5 | PDP | `ProductBuyPanel` "Buy it once for £X" link | `getChargedPrice(otpPricing)` | **Yes** |
| 6 | PDP | `ProductBuyPanel` per-shot line | `pricing.perShot` | **Yes** (priced shots only) |
| 7 | PDP | `StickyPurchaseFooter` / `StickyPurchaseFooterMobile` | `pricing.price` passed from page | **Yes** (price only, no strike or %) |
| 8 | PDP/Home | `ProductGridHeader` "now {percent}% off" | `getDisplayDiscount(both, monthly-sub)` = declared 46 | **No** (same declared 46 as row 1) |
| 9 | PDP/Cart | `CartDrawer` line discount badge | own derivation: `compareAt = getChargedPrice(otp)` (x3 for quarterly); `pct = round(1 - display/compareAt)` | **Yes** in itself, but a **fourth methodology**: shows 25% where the PDP badge says 46 (Both monthly) and 48/50% where the PDP says 63/69 (quarterly) |
| 10 | Cart | `CartUpsellTile` via `cartUpsell.ts` | £ savings from `getChargedPrice` and `price` differences | **Yes** |
| 11 | Portal | `account/subscriptions/viewModel.ts` `savingsVsOneTime` | `pricing.compareAtPrice - price` | **Partly**: uses the stored `compareAtPrice` fields (59.99 / 89.99 / 179.97 / 269.97), which are ex-postage or 3x maths, not the charged anchors. Self-heals when SCRUM-1258 reconciles the fields |
| 12 | SEO | PDP layouts + home (`getOfferPriceRange`, `getOfferMinPerShot`) | min/max of `price + postage`; min `perShot` | **Yes** (prices only) |
| 13 | PDP copy | `OFFER_CADENCES["monthly-otp"].features`: "Subscribe later and save 25% or more" | hardcoded string in `offerData.ts` | **Yes under the new rules** (post-fix minimum derived saving is 25%); today it contradicts the inflated 43 to 69 badges beside it |
| 14 | PDP (pending) | `GiftValueStack` bonus-shots tile struck RRP (on `feature/starter-pack`) | `pricing.freeShotsValue` (£23.99) | **Yes**: 8 x £3.00 one-time per-shot (rule 7). Display-only, pre-add |
| 15 | legacy | BYO `CadenceSelector` PlanCard badge + strike | identical port of rows 1 to 3 (same declared % and same fabricated quarterly anchor) | Same defects as rows 1 and 3 |
| 16 | legacy | BYO `CadenceSelector` PlanSummaryList | `getDisplayDiscount`, `getChargedPrice` | % as row 1; prices sourceable |
| 17 | legacy | BYO `ByoGallery` gallery badge | `getDisplayDiscount(monthly-sub)` = 43 / 46 | 46 unsourceable (row 1) |
| 18 | legacy | BYO `SummaryStep` "billed today" | `price` or `getChargedPrice(pricing)` | **Yes** |
| 19 | legacy | BYO `UpsellBottomSheet` via `getUpsellOffer` | per-shot strike + `savingsPercent` from real price differences | **Yes** |
| 20 | legacy | `/build-your-order` metadata: "Subscribe and save 25%" | hardcoded string | **Yes under the new rules** (Both monthly derives to 25%) |
| 21 | legacy | `/start` S5 buy box | `compareAtPrice ?? otp.price` (£89.99), `savingsPercent = getDisplayDiscount` (46), "Save 46%" badge | **No** (declared 46) |
| 22 | legacy | `/start-b` S5 | `S5_SAVINGS_PERCENT = getDisplayDiscount(both monthly-sub)` = 46 | **No** (declared 46). Its `BuyBoxCard.tsx` is orphaned (defined, never rendered) |
| 23 | legacy | `/lander`, `/lander-b` OfferCards strike | `subPricing.compareAtPrice` (£59.99 / £89.99) | **Yes** as prices (real ex-postage box prices), but a different anchor from the PDPs, which strike the all-in charged £69.98 / £99.98 |
| 24 | legacy | `/lander`, `/lander-b` hero/nav copy: "43% off", BuyCard aria "Save 31%" | hardcoded strings | 43 matches the Flow/Clear derivation; 31 matches nothing |
| 25 | legacy | `landingPricing.ts` string constants (feed `CROTestimonials`, `LandingProductShowcase`, `LandingProductSplit`, `CrashChart`, `LabFAQ`, `LandingTestimonials`) | duplicated price strings (£74.99, £1.87, etc.) | **Yes** today (match `OFFER_PRICING`) but hand-maintained duplicates; consolidation is Phase 4 scope |
| 26 | ads | `/go/[slug]` listicles and quizzes | per-page config, does not read `OFFER_PRICING` discount fields | Out of scope for this work; governed by `docs/features/GO_LANDING_PAGES.md` |

### The four derivation methods in the codebase today

1. Declared `discountPercent` override via `getDisplayDiscount` (rows 1, 4, 8, 15, 16, 17, 21, 22). The path SCRUM-1258 removes.
2. Derived from `compareAtPrice` (the `getDisplayDiscount` fallback; effectively unused because every subscription entry declares an override).
3. Reverse-derived anchor `price / (1 - pct/100)` (rows 3, 15). Fabricates £297.27 / £483.84 strikes.
4. CartDrawer's own `1 - display / (charged OTP x n)` (row 9). Sound maths, different anchors from every other surface.

## 4. Defect register (before -> after, all nine entries)

What `getDisplayDiscount` returns today (declared override) vs what the canonical anchors derive. "After" is what SCRUM-1258 ships; every `price` stays byte-identical.

| Entry | Price | Stored `compareAtPrice` today | Declared `discountPercent` today | Shown today | Anchor after | Derived after | Change |
|-------|-------|-------------------------------|----------------------------------|-------------|--------------|---------------|--------|
| flow/monthly-sub | 39.99 | 59.99 (read only by the portal savings line, row 11; disagrees with the £69.98 strike the PDP shows) | 43 | 43% | 69.98 | 43% | none visible; field reconciled, portal savings line becomes £29.99 |
| flow/monthly-otp | 59.99 | none | none | 0% | none | 0% | none |
| flow/quarterly-sub | 109.99 | 179.97 (hardcoded) | 63 | 63% + fabricated £297.27 strike | 189.99 | 42% | **63 -> 42**, strike becomes real |
| clear/monthly-sub | 39.99 | 59.99 | 43 | 43% | 69.98 | 43% | none visible; field reconciled |
| clear/monthly-otp | 59.99 | none | none | 0% | none | 0% | none |
| clear/quarterly-sub | 109.99 | 179.97 (hardcoded) | 63 | 63% + fabricated £297.27 strike | 189.99 | 42% | **63 -> 42**, strike becomes real |
| both/monthly-sub | 74.99 | 89.99 (`OTP_PRICE.both`) | 46 | 46% | 99.98 | 25% | **46 -> 25** |
| both/monthly-otp | 89.99 | none | 29 | 29% (renders nowhere today; would surface through `getDisplayDiscount` if any surface read it) | 119.98 | 25% | **29 -> 25**, gains its decided £119.98 strike (SCRUM-1259) |
| both/quarterly-sub | 149.99 | 269.97 (`OTP_PRICE.both * 3`) | 69 | 69% + fabricated £483.84 strike | 279.99 | 46% | **69 -> 46**, strike becomes real |

Additional defects, ranked PDP-first for SCRUM-1259:

1. **PDP quarterly strike is fabricated** (rows 3, 15): replace with the real quarterly one-time anchor once `compareAtPrice` is reconciled.
2. **PDP badge vs cart badge disagree** (row 9 vs row 1): once every surface derives from the same `compareAtPrice`, CartDrawer's private formula should collapse into the shared derivation.
3. **Quarterly anchor spelled two ways** (`OTP_PRICE.both * 3` vs hardcoded `179.97`): unify to one expression (SCRUM-1258).
4. **Portal savings use stale fields** (row 11): fixed automatically by the field reconciliation.
5. **Legacy `/start` and `/start-b` badges show the declared 46** (rows 21, 22): inherit the derived 25% when the override path dies; verify copy still reads sensibly.
6. **Hardcoded copy percentages** (rows 13, 20, 24): re-check each against the derived table after Phase 2; "25% or more" and "Subscribe and save 25%" become exactly right, the lander "43%" stays right for Flow/Clear, "Save 31%" matches nothing and should go.
7. `/start-b/BuyBoxCard.tsx` is orphaned; flagged for the orphan-sweep process, not this work.

## 5. Where this doc sits

- Code source of truth: `OFFER_PRICING` / `OfferPricing` / `getDisplayDiscount` / `getChargedPrice` in `app/lib/offerData.ts`
- Charged-price rule: `docs/development/CART_PRICING_SOURCE_OF_TRUTH.md` (pre-add UI from the offer catalogue, cart/checkout from Shopify only)
- SKUs, GIDs, shot counts: `docs/product/SKU_AND_SHOT_REFERENCE.md`
- Price-change audit trail: `docs/PRICING_HISTORY.md`
- Tickets: SCRUM-1257 (this audit), SCRUM-1258 (single derivation), SCRUM-1259 (surface fixes, PDP first)
