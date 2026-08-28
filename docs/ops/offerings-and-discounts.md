# Offerings & Discount Anchors

The canonical rules for every crossed-out price and savings percentage the site shows, plus the audit of every surface that renders one. Written for SCRUM-1257 (Phase 1 of the pricing anchor coherence work); SCRUM-1258 makes the code obey these rules and SCRUM-1259 fixes the surfaces.

**Status (2026-08-28): all three phases are merged to main; the same day, SCRUM-1285 added the `quarterly-otp` cadence and revised the anchor scheme to the ascending-ladder form.** §1 and §2 describe live behaviour. §3 and §4 are the historical register from the Phase 1 audit: the "today" expressions in §3 and the "before/after" columns in §4 describe the pre-fix state and the first (same-day, superseded) anchor scheme; current anchors and percentages live only in §2. The unresolved leftovers from §4 remain the copy understatements (item 6) and the orphaned `/start-b` BuyBoxCard (item 7).

**The layer these rules govern is the offer catalogue: `OFFER_PRICING` (type `OfferPricing`) in `app/lib/offerData.ts`.** It serves every surface that sells: the PDPs, the cart drawer, the account portal, JSON-LD and meta descriptions, and the legacy Build Your Order and trial landing flows. It is not a Build Your Order module; that flow is just one legacy consumer.

Charged prices are out of scope here and never change as part of this work. Pre-add UI prices come from `offerData.ts`; cart and checkout prices come from Shopify only (`docs/development/CART_PRICING_SOURCE_OF_TRUTH.md`).

---

## 1. The rules

1. **One anchor per product per cadence, derived from a real purchasable price.** An anchor (the crossed-out "was" price) must be a price a customer could actually pay today for the same priced shots. No anchor may be reverse-engineered from a percentage.
2. **Every percentage is derived, never declared.** `Save X%` = `round((anchor - price) / anchor * 100)`. A percentage with no compare-at price behind it is a defect. (`getDisplayDiscount` currently allows a declared `discountPercent` to override the derivation; SCRUM-1258 removes that path.)
3. **Free bonus shots are a gift and never sit inside a discount percentage.** The percentage is price against price on the shots the customer pays for. Free shots appear as a separate gift line ("+8 free shots"), never folded into the maths.
4. **Postage is £9.99 per order, not per box.** One-time orders carry it (baked into both the Shopify OTP variant price and the displayed figure, pending SCRUM-1286); subscriptions ship free. **Every discount comparison is all-in totals**: the entry's charged price (`getChargedPrice`) against an all-in anchor. No ex-postage comparisons; postage consolidation is simply part of the saving it produces.
5. **Both's one-off reference price is £119.98**: one Flow box plus one Clear box (2 x £59.99), not the £89.99 Both one-off box. This is what makes the £3.00 per-shot valuation used across the site sourceable (£119.98 / 40 shots = £3.00) rather than arbitrary.
6. **Gift RRPs in a value stack are display-only and pre-add.** They never reach a cart line or checkout (`docs/development/CART_PRICING_SOURCE_OF_TRUTH.md`).
7. **`freeShotsValue` is a live gift-stack anchor, not dead code.** It is the struck RRP on the bonus-shots tile of the PDP gift grid (`GiftValueStack`, landing with `feature/starter-pack` / SCRUM-1283). Derivation: bonus shots x the £3.00 one-time per-shot value, presented with a .99 ending (8 shots = £23.99, 16 = £47.99, 20 = £59.99). Do not delete it.
8. **The discount ladder ascends.** For the same product, a larger quantity or deeper commitment never shows a smaller badge (the Magic Mind pattern; decided by Rudh 28 Aug 2026). This is achieved structurally, not by declaring numbers: every anchor scales linearly from the monthly-size one-time reference unit (§2), so a quantity-discounted large offering can never be its own anchor and shrink its badge.

## 2. The canonical anchors (one per product per cadence)

**The anchor scheme (revised 2026-08-28, SCRUM-1285 follow-up, decided by Rudh from the Magic Mind pattern):** every anchor derives from one **reference unit** per product, the monthly-size one-time order, all-in (`MONTHLY_OTP_ALL_IN` in `offerData.ts`: £69.98 for a single formula, £129.97 for Both). Anchors scale linearly: a quarterly offering anchors to **three** reference units, each paying its own £9.99 postage, giving one anchor per size (£209.94 / £389.91) shared by the subscription and one-time of that size. The quarterly one-time is itself a discounted offer (postage paid once instead of three times), so it derives a saving and is never used as an anchor. **Everything compares all-in totals**: `getDisplayDiscount` sets the entry's charged price (`getChargedPrice`) against the all-in anchor, so the struck price, the shown price and the badge are always mutually checkable. This is what makes the badge ladder ascend with quantity (rule 8).

**Presentation (decided by Rudh 2026-08-28, superseding the same-day itemised version):** displayed one-time prices are the single all-in figure with postage baked in, matching the Shopify charge; the itemised "£X + £9.99 postage" split wrapped the buy-once link onto two lines and was reverted. The one-time link shows the struck anchor and the all-in price only, with no "save %" text (the strike infers it). The itemised presentation returns when SCRUM-1286 formally moves shipping out of the SKU prices (see `docs/TODO.md`).

| Product | Cadence | Charged price | Anchor | Anchor derivation | Derived % |
|---------|---------|---------------|--------|-------------------|-----------|
| Flow | monthly-otp | £69.98 | none | Is the reference unit (FLOW-FUNNEL-20-OTP) | 0% |
| Flow | quarterly-otp | £189.99 | £209.94 | 3 reference units (3 x £69.98) | 10% |
| Flow | monthly-sub | £39.99 | £69.98 | 1 reference unit | 43% |
| Flow | quarterly-sub | £109.99 | £209.94 | 3 reference units | 48% |
| Clear | monthly-otp | £69.98 | none | Is the reference unit | 0% |
| Clear | quarterly-otp | £189.99 | £209.94 | 3 reference units | 10% |
| Clear | monthly-sub | £39.99 | £69.98 | 1 reference unit | 43% |
| Clear | quarterly-sub | £109.99 | £209.94 | 3 reference units | 48% |
| Both | monthly-otp | £99.98 | £129.97 | 1 reference unit: Flow + Clear value + one order's postage | 23% |
| Both | quarterly-otp | £279.99 | £389.91 | 3 reference units (3 x £129.97) | 28% |
| Both | monthly-sub | £74.99 | £129.97 | 1 reference unit | 42% |
| Both | quarterly-sub | £149.99 | £389.91 | 3 reference units | 62% |

**The ladders, per product, ascending with quantity and commitment (the point of the scheme):** Flow/Clear 0% -> 10% -> 43% -> 48%; Both 23% -> 28% -> 42% -> 62%. (The one-time percentages render nowhere at present: the buy-once link shows only the strike, and one-time cart lines carry no badge.)

### Decision notes (both provisional, adjustable as pure data)

**1. Both references the value of Flow + Clear** bought separately, not the £89.99 Both box (Rudh, 28 Aug: "both is now going to reference the value of flow and clear base price"). `BOTH_REFERENCE_PRICE` = £119.98 feeds the Both reference unit. The rejected alternative (anchor to the Both-box one-time prices £99.98 / £279.99) strikes only single-SKU prices but hides the bundle discount and makes Both look barely discounted next to the singles.

**2. The quarterly anchor is three monthly-size orders, not the quarterly one-time SKU** (Rudh, 28 Aug, from the Magic Mind screenshot: MM's 60-bottle strike is the 15-bottle price scaled, its badges ascend 50/58/60%, and its large one-time sits below its own struck value). The earlier same-day scheme anchored quarterly subs to the FLOW-60 / CLEAR-60 base prices (£189.99, yielding 42%), which inverted the ladder: the quarterly badge (42%) sat below the monthly badge (43%) because the quarterly one-time is itself discounted. Superseded within the day; the Skio-era one-time prices are now offerings (the `quarterly-otp` cadence, SCRUM-1285), not anchors.

Notes:

- The quarterly one-time SKUs bake per-order postage in, like the monthly OTP SKUs: FLOW-60 charges £189.99 all-in (3p above 3 x £59.99 + £9.99 = £189.96, rounded up to a .99 ending); BOTH-120 charges £279.99.
- `OFFER_PRICING`'s `compareAtPrice` fields hold exactly these anchors; no displayed `price` has changed at any point in this work.

### Worked examples

- **Flow monthly subscription**: £39.99, ships free. One reference unit: £59.99 + £9.99 = £69.98 all-in. Save = (69.98 - 39.99) / 69.98 = 42.9% -> **43%**. The +8 free first-order shots are a gift line, not part of the percentage.
- **Flow quarterly subscription**: £109.99, ships free. Three reference units: 3 x £69.98 = £209.94 (three separate monthly-size orders, each with postage). Save = (209.94 - 109.99) / 209.94 = 47.6% -> **48%**. The +20 free shots per cycle stay out of the maths.
- **Flow quarterly one-time**: charged £189.99 (FLOW-60, postage baked). Anchor: three reference units, £209.94. Save = (209.94 - 189.99) / 209.94 = 9.5% -> **10%** (the consolidation saving: one postage instead of three, plus 3p of rounding). Rendered as struck £209.94 beside £189.99 on the buy-once link; the percentage itself is not printed.
- **Both one-time**: charged £99.98 (postage baked). Anchor: one reference unit, £119.98 of product + £9.99 = £129.97. Save = (129.97 - 99.98) / 129.97 = 23.1% -> **23%**. Struck £129.97 beside £99.98 on the link.
- **Both monthly subscription**: £74.99, ships free. One reference unit: £129.97 all-in. Save = (129.97 - 74.99) / 129.97 = 42.3% -> **42%**.
- **Both quarterly one-time**: charged £279.99 (BOTH-120). Anchor: three reference units, £389.91. Save = 28.2% -> **28%**. Struck £389.91 beside £279.99 on the link.
- **Both quarterly subscription**: £149.99, ships free. Three reference units: 3 x £129.97 = £389.91. Save = (389.91 - 149.99) / 389.91 = 61.5% -> **62%**.
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
| both/monthly-sub | 74.99 | 89.99 (`OTP_PRICE.both`) | 46 | 46% | 129.97 | 42% | **46 -> 42** |
| both/monthly-otp | 89.99 | none | 29 | 29% (renders nowhere today; would surface through `getDisplayDiscount` if any surface read it) | 119.98 | 25% | **29 -> 25**, gains its decided £119.98 strike (SCRUM-1259) |
| both/quarterly-sub | 149.99 | 269.97 (`OTP_PRICE.both * 3`) | 69 | 69% + fabricated £483.84 strike | 369.93 | 59% | **69 -> 59**, strike becomes a derived component value (see the provisional decision note in §2) |

Additional defects, ranked PDP-first for SCRUM-1259:

1. **PDP quarterly strike is fabricated** (rows 3, 15): replace with the real quarterly one-time anchor once `compareAtPrice` is reconciled.
2. **PDP badge vs cart badge disagree** (row 9 vs row 1): once every surface derives from the same `compareAtPrice`, CartDrawer's private formula should collapse into the shared derivation.
3. **Quarterly anchor spelled two ways** (`OTP_PRICE.both * 3` vs hardcoded `179.97`): unify to one expression (SCRUM-1258).
4. **Portal savings use stale fields** (row 11): fixed automatically by the field reconciliation.
5. **Legacy `/start` and `/start-b` badges show the declared 46** (rows 21, 22): inherit the derived 42% when the override path dies; verify copy still reads sensibly.
6. **Hardcoded copy percentages** (rows 13, 20, 24): with subscriptions deriving 42 to 62%, "Subscribe later and save 25% or more" and BYO's "Subscribe and save 25%" remain true but understate; safe to leave, tighten when copy is next touched. The lander "43%" stays right for Flow/Clear monthly; "Save 31%" matches nothing and should go.
7. `/start-b/BuyBoxCard.tsx` is orphaned; flagged for the orphan-sweep process, not this work.

## 5. Where this doc sits

- Code source of truth: `OFFER_PRICING` / `OfferPricing` / `getDisplayDiscount` / `getChargedPrice` in `app/lib/offerData.ts`
- Charged-price rule: `docs/development/CART_PRICING_SOURCE_OF_TRUTH.md` (pre-add UI from the offer catalogue, cart/checkout from Shopify only)
- SKUs, GIDs, shot counts: `docs/product/SKU_AND_SHOT_REFERENCE.md`
- Price-change audit trail: `docs/PRICING_HISTORY.md`
- Tickets: SCRUM-1257 (this audit), SCRUM-1258 (single derivation), SCRUM-1259 (surface fixes, PDP first)
