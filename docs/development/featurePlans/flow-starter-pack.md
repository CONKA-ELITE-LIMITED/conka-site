# Flow Starter Pack

**Status:** Phases 1 and 2 built (commit `1a14726c`), Phase 3 not started
**Branch:** `feature/starter-pack`
**Surface:** `/conka-flow` (Flow PDP only)
**Design language:** Simple DTC (DESIGN_SYSTEM.md §8.5)

## Problem

The Flow PDP sells a box of shots at £39.99. The starter pack keeps the price identical and fills the box with a hat, a capsule travel pack, 8 bonus shots and app access, so a first order reads as a kit rather than a carton. Same price, more in the box, is the conversion lever.

## Value stack

Taken from the approved pack artwork. These figures are the source of truth for the on-page stack.

| Row | RRP | Displayed as |
|-----|-----|--------------|
| CONKA Flow | £69.98 | £39.99 |
| +8 free shots | £23.99 | Free |
| CONKA Hat | £19.99 | Free |
| Capsule Travel Pack | £28.99 | Free |
| Full CONKA App Access | £9.99 | Free |

Total stated value £152.94 against £39.99 paid, of which £82.96 is the free extras.

No data edit was needed to make the page agree with the artwork. `ProductBuyPanel` derives the monthly-sub strikethrough from `getChargedPrice(monthly-otp)`, which is the £59.99 one-time price plus £9.99 compulsory postage = **£69.98**, exactly the artwork figure. It never reads `compareAtPrice` for this cadence, so the unused `compareAtPrice: 59.99` was left alone. The artwork's bonus-shot figure was separately corrected to £23.99 to match `freeShotsValue`.

Pattern is struck RRP per row, as IM8 and Graymatter do it, not AG1's unpriced tick list. Prices live in HTML, never burned into the imagery.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Hero image swap | Built, For review (SCRUM-1282) |
| 2 | Gift value-stack component + offer data | Built, For review (SCRUM-1283) |
| 3 | `FLOW-STARTER-28` variant + bundle composition | Not Started (SCRUM-1284) |

### Phase 1 - Hero image

`FlowStartPack.jpg` becomes the first slide of `MM_GALLERY_ASSETS["01"]` in `app/lib/mmPdpData.ts`.

Note: this is a correction to the original brief, which pointed at `formulaImages.flow` in `app/lib/productImages.ts`. That array has exactly one consumer, `FUNNEL_PRODUCT_SLIDESHOW_BASE` in `offerData.ts`, which feeds the BYO slideshow and not the PDP hero. The PDP hero reads `MM_GALLERY_ASSETS`. `productImages.ts` is left untouched.

- Complexity: Small
- Files: `app/lib/mmPdpData.ts`, `public/formulas/conkaFlow/`

### Phase 2 - Gift value stack

Data. Add an optional `gifts` array to `OfferPricing` in `app/lib/offerData.ts`:

```ts
export interface OfferGift {
  id: string;
  label: string;
  /** Struck RRP shown against the row. */
  rrp: number;
  /** Optional thumbnail; omit for rows with no product shot. */
  image?: string;
}
```

`cadenceData.ts` returns the whole `OfferPricing` object from `getCadencePricingByFormula` / `getCadencePricingByProductHeroId`, so the new field reaches the PDP with no adapter change.

UI. A content-only `GiftValueStack` component under `app/components/product/`, rendered by `ProductBuyPanel.tsx`. Not by the heroes: `ProductHeroV3` and `ProductHeroMobileV3` are 125 and 105 lines, render no price and hold no cadence state, taking `selectedCadence` as a prop. The buy panel already owns `compareAtDisplay`, the `+N free shots` gradient footer and the `SubscriptionSummary` line list, which is where struck RRPs belong. One shared child serves both mobile and desktop paths, per the split-component pattern in MOBILE_OPTIMIZATION.md.

Visibility gates on `pricing.gifts?.length`, which is set on subscription cadences only, so one-time purchases never see the stack.

Decision: the stack carries all four free rows including the 8 bonus shots, and the standalone free-shots line in `SubscriptionSummary` is removed so the shots are not claimed twice on one panel. The gradient `+8 free shots on your first order` footer on the selected cadence card stays; it is the cadence-level incentive, not part of the stack.

Design: Simple DTC. Savings accent is `--brand-positive` `#1A7F4F`, left-aligned, radius via Tailwind on this surface. Mobile-first at 390px. No new CTA; `StickyPurchaseFooterMobile` already covers mobile.

- Complexity: Medium
- Dependencies: none (ships with placeholder imagery if assets lag)
- Files: `app/lib/offerData.ts`, `app/components/product/ProductBuyPanel.tsx`, new `app/components/product/GiftValueStack.tsx`

### Phase 3 - Commerce

Create `FLOW-STARTER-28` as a new variant on the existing funnel product, not a new product. Set `custom.bundlecomposition` to the physical contents so Synergy explodes it at pick time and the pack contents stay editable after launch without a code change. Swap `variantId` in `OFFER_VARIANTS.flow["monthly-sub"]`.

This reuses a mechanism already in production: that slot currently holds `FLOW-FUNNEL-28`, the first-order bonus SKU, and Loop swaps to `FLOW-FUNNEL-20` from order 2. The starter pack is the same pattern with a different GID. The order-2 swap carries into Skio at migration rather than being built in Loop now. Nobody buying at launch renews inside ~28 days, and the Skio cutover deadline is ~26 September.

- Complexity: Medium (mostly Shopify admin)
- Files: `app/lib/offerData.ts`, `docs/product/SKU_AND_SHOT_REFERENCE.md` §1 tables

## Sequencing gate

Phases 1 and 2 make the page advertise gifts that the Shopify variant does not yet ship. They are safe on a Vercel preview and unsafe in production. Merge Phase 3 first, or ship all three in a single PR. No preview-only phase reaches `main` ahead of the variant.

## Assets

All committed, no conversion needed. The source folder was re-exported at web sizes after this plan was first written, which removed the 4.2MB PNG problem.

| Asset | Committed path | Size |
|-------|----------------|------|
| Bundle hero (1800x1286) | `public/formulas/mmPdpAssets/FlowStarterPack.jpg` | 120KB |
| Hat thumb (750x750) | `public/formulas/starterPack/ConkaHat.jpg` | 20KB |
| Bonus shots thumb (750x750) | `public/formulas/starterPack/EightFlow.jpg` | 37KB |
| Travel pack thumb (750x750) | `public/formulas/starterPack/TravelPack.jpg` | 14KB |

The app-access row has no thumbnail and falls back to a tick glyph, which is why `OfferGift.image` is optional.

## No-gos

- Flow only. Clear and Both are not in scope.
- In place on `/conka-flow`. No new page or route.
- H1 stays "CONKA Flow". The offer layers on; the product is not renamed.
- Price stays £39.99.
- No fork of the data layer to scope the offer to the PDP. One shared entry in `OFFER_VARIANTS.flow["monthly-sub"]`; the offer ships wherever that entry is read.

## Risks

- **SCRUM-1259** rewrites crossed-out price and save-percentage logic across BYO and PDP surfaces, which is the same logic Phase 2 extends. Whichever lands second inherits the merge.
- **`pdp-structure-rework.md` Phase 5** covers this same work and is parked as blocked on bundle definition. It should be marked superseded by this plan. It also notes that `ProductGrid` / Explore is currently the only Flow to Both path, so Explore is only cut once the starter pack ships.
- `/start`, `/start-b` and BYO also read `OFFER_VARIANTS`. They are legacy surfaces with no live ad traffic and no direct site links, so this is a note rather than a constraint.

## References

- `docs/development/CART_PRICING_SOURCE_OF_TRUTH.md` - gift RRPs are pre-add display only; cart and checkout prices come from Shopify.
- `docs/product/SKU_AND_SHOT_REFERENCE.md` §1 - first-order versus recurring SKU convention.
- `docs/branding/DESIGN_SYSTEM.md` §8.5 - Simple DTC, per-surface authority table.
- `docs/branding/MOBILE_OPTIMIZATION.md` - split component architecture.
- `docs/development/featurePlans/skio-subscription-migration.md` - where the order-2 swap gets configured.

## Jira

Sprint 30.

| Ticket | Phase | Type | Epic | Status |
|--------|-------|------|------|--------|
| SCRUM-1282 | 1 - Hero image | Task | Website & CRO | To Do |
| SCRUM-1283 | 2 - Gift value stack | Story | Website & CRO | To Do |
| SCRUM-1284 | 3 - FLOW-STARTER-28 variant | Task | Shopify & Subscriptions | To Do |

SCRUM-1284 blocks both SCRUM-1282 and SCRUM-1283, which encodes the sequencing gate above.
SCRUM-1283 relates to SCRUM-1259 (crossed-out price logic).
