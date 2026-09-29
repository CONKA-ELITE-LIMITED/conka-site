# Trial pack: Both only, 1 box or 2 boxes

**Page:** `/go/trial-pack` · **Config:** `app/lib/landings/trial-pack.ts` · **Sprint doc:** [2026-09-trial-pack.md](../../sprints/2026-09-trial-pack.md) · **Scoped:** 25 Sep 2026

## Problem

Synergy packs every 4-shot trial box as 2 Flow + 2 Clear. The page sells Flow-only (`FLOW-BOX-4`) and Clear-only (`CLEAR-BOX-4`) trials, so what we sell does not match what ships. The fix is to sell the box that actually exists.

## Approach

One product, Both, as two tiles in the existing hero buy box:

| Tile | Sells | Shots | Trial price (struck) | Plan | Day 7 |
|---|---|---|---|---|---|
| 1 box | `BOTH-BOX-4` (new) | 4 (2 Flow, 2 Clear) | £12.99 (£29.98) | shared 56.67% trial plan | Both monthly, `BOTH-STARTER-40`, £74.99 |
| 2 boxes, preselected, "Best value" | `BOTH-BOX-8` (existing) | 8 | £18.99 (£59.96) | existing 8-shot plan, 68.33% | Both monthly, `BOTH-STARTER-40`, £74.99 |

The buy-once link under the CTA is unchanged (40-shot Both, £99.98).

**This is mostly a data change on logic we already built.** The only page section that changes is the hero buy box (tiles, gallery lead, explainer slide, terms). The Both-version PDP sections, reviews, countdown banner, checkout guard, attribution and analytics are all reused as they are. Code changes are small widenings so the offer format accepts two options of one product.

## Technical decisions

- **2 boxes is one line of `BOTH-BOX-8`, not quantity 2 of `BOTH-BOX-4`.** Two lines would create two Skio contracts. `BOTH-BOX-8` already has its plan and Journeys; only its bundle composition changes to `2xBOTH-BOX-4` so Synergy picks two mixed boxes.
- **`BOTH-BOX-4` is a foundational SKU**, so it carries no `custom.bundlecomposition`.
- **`BOTH-BOX-4` base price £29.98 on the existing 56.67% plan** (the one Flow and Clear use) nets £12.99, same as the old 4-box. If a Skio Journey cannot tell it apart from the Flow and Clear 4-boxes inside that shared group, give it its own group at 56.67%.
- **`_offer_choice` values become `both_4shot` and `both_8shot`.** This is the hidden tag on each order line saying which tile was picked; Klaviyo and conka-lab (SCRUM-1344) read it. Naming by shot count says what was in the box.
- **Prices stay keyed by product.** Both tiles share the Both monthly and buy-once figures, which is correct, so `buildOptionView` is not refactored.
- **Design language:** Simple DTC, the existing offer page. No new visual language.

## Phases

| Phase | Description | Ticket |
|---|---|---|
| 1 | Shopify + Skio setup for `BOTH-BOX-4` and `BOTH-BOX-8` | SCRUM-1466 |
| 2 | Page refactor, hero buy box only, plus docs | SCRUM-1467 |

### Phase 1: Shopify + Skio setup (admin, no code)

1. **Fix `BOTH-BOX-4`** (variant `gid://shopify/ProductVariant/58818005926262`, product `15899177779574`). Today it is a clone of `BOTH-BOX-8`.
   - Price £59.96 to £29.98
   - Weight 600g to 300g
   - Remove `custom.bundlecomposition` (currently `1xFLOW-BOX-4+1xCLEAR-BOX-4`, which would ship two boxes)
   - Add a barcode, turn on inventory tracking, confirm HS 210690 / origin GB, Headless publication
   - Tell Synergy the SKU
2. **Selling plan:** add `BOTH-BOX-4` to the 56.67% trial group (`100221616502`, plan `712985543030`). Confirm £12.99 after discount.
3. **Skio Journey:** a `BOTH-BOX-4` trial order swaps to `BOTH-STARTER-40` (`58586681999734`) on the Both monthly plan `712928952694` at day 7, then to `BOTH-40` on the second order. Mirror the Both 8-box Journey. Switching only the interval renews at the trial %, so the plan must change too.
4. **`BOTH-BOX-8`:** change `custom.bundlecomposition` to `2xBOTH-BOX-4`.
5. **Test orders** for both tiles: plan applied, day-7 swap correct, Synergy picks the right boxes.

### Phase 2: Page refactor (depends on Phase 1 and the new assets)

1. **Types.** Widen `OfferOptionId` beyond `flow | clear | both` and the inline union in `analytics.ts:374`. Add an optional per-option tile image, because tile images are keyed by product and both tiles are Both. Files: `app/lib/landings/offer-types.ts`, `app/components/go/offer/OfferPurchase.tsx`, `app/components/go/offer/offerCheckout.ts`, `app/lib/analytics.ts`.
2. **Tile row.** `OfferBuyBox.tsx:63` is hard-coded `grid-cols-3`; make it follow the option count.
3. **Config.** `trial-pack.ts`: two options, `defaultOption` the 2-box, new variant GIDs, gallery lead, explainer slide and tile images (assets from Rudh), updated price comment.
4. **FAQ.** `trial-pack-faq.ts` calls `get("flow")` / `get("clear")` and throws without them. Rewrite all six answers for one product, two pack sizes.
5. **Docs.** Sprint doc (options table, What this is, Iterations row), `PRICING_HISTORY.md`, `SUBSCRIPTIONS.md` (plans, Journeys), `SKU_AND_SHOT_REFERENCE.md` (add `BOTH-BOX-4`), `CART_ATTRIBUTES.md` (`_offer_choice` values), `GO_LANDING_PAGES.md` ("three tiles"), `CHANGELOG.md`.

## Mobile

Two tiles side by side at 390px, larger than today's three. Terms line stays next to the CTA.

## Rabbit holes

- Skio Journey conditions inside a shared plan group. Circuit breaker: own group.
- Per-option pricing refactor. Not needed; both tiles convert to the same plan.

## No-gos

- No deleting `FLOW-BOX-4` / `CLEAR-BOX-4` or their Journeys; in-flight trial contracts still need them.
- No new smaller Both monthly plan.
- No remediation for customers who already bought Flow-only or Clear-only trials (SCRUM-1401).
- No investigation of `BOTH-BOX-4`'s -14 inventory here.

## Risks

- Page and Skio disagree on price if the plan % or base price is off. Check the checkout total against the tile before relaunch.
- Klaviyo and conka-lab keyed on `flow|clear|both` miss the new values until SCRUM-1344 is updated.

## References

- `docs/features/GO_LANDING_PAGES.md` (offer format)
- `docs/features/SUBSCRIPTIONS.md` (trial pack Journeys)
- `docs/workflows/11-creating-products.md` (new product checklist)
- SCRUM-1343 (original page), SCRUM-1344 (Klaviyo + conka-lab), SCRUM-1401 (paused trial subs)

## Jira tickets

| Ticket | Title | Phase |
|---|---|---|
| SCRUM-1466 | [Shopify & Subscriptions] Set up BOTH-BOX-4 trial product and Skio Journey | 1 |
| SCRUM-1467 | [Website & CRO] Trial pack page: Both only, 1 box or 2 boxes | 2 |
