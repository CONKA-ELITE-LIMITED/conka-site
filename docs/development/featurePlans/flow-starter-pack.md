# Flow Starter Pack

**Status:** Phases 1, 2 and 4 built (commits `1a14726c`, `1b469044`), Phase 3 not started
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

Quarterly (added Phase 4, confirmed 28 Aug 2026) carries the same three gifts against a bigger box:

| Row | RRP | Displayed as |
|-----|-----|--------------|
| CONKA Flow x3 | £209.94 | £109.99 |
| +20 free shots | £59.99 | Free |
| CONKA Hat | £19.99 | Free |
| Capsule Travel Pack | £28.99 | Free |
| Full CONKA App Access | £9.99 | Free |

Total stated value £328.90 against £109.99.

The 20 free shots are £59.99 because that is a real SKU price, `FLOW-FUNNEL-20-OTP`, so the 20 shots are valued at exactly one free box. The monthly row derives the same way, 8 x £3.00 one-time rate charm-priced to £23.99. The quarterly artwork first shipped with **£59.97**, which is sourceable to nothing. Corrected to £59.99 in the source asset on 28 Aug 2026, so every figure on the quarterly artwork now agrees with `offerData.ts`.

No data edit was needed to make the page agree with the artwork. `ProductBuyPanel` derives the monthly-sub strikethrough from `getChargedPrice(monthly-otp)`, which is the £59.99 one-time price plus £9.99 compulsory postage = **£69.98**, exactly the artwork figure. It never reads `compareAtPrice` for this cadence, so the unused `compareAtPrice: 59.99` was left alone. The artwork's bonus-shot figure was separately corrected to £23.99 to match `freeShotsValue`.

Pattern is struck RRP per row, as IM8 and Graymatter do it, not AG1's unpriced tick list. Prices live in HTML, never burned into the imagery.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Hero image swap | Built, For review (SCRUM-1282) |
| 2 | Gift value-stack component + offer data | Built, For review (SCRUM-1283) |
| 3 | `FLOW-STARTER-28` variant + bundle composition | Not Started (SCRUM-1284) |
| 4 | Full-width PDP starter-pack section, cadence-aware | Built, For review (SCRUM-1287) |

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

### Phase 4 - Full-width PDP section

The in-panel stack from Phase 2 is compact by design and sits low on the buy panel. Phase 4 adds a dedicated full-width section that shows the pack as a kit, the way Graymatter's "Your Starter Kit Includes" section does it: the bundle as one arranged image with the contents priced beside it, not a text list.

**Placement.** Slot 4 of the shared section order in `app/conka-flow/page.tsx`, between `ugcSection` and `ingredientsSection`, on `brand-bg-tint` (both neighbours are white). Everything from `ingredients` down is the argument for the product; the starter pack is the unpack of what arrives, so it belongs with the offer while the offer is still on screen. Both breakpoints render one shared order, so this is a single insertion.

The Phase 2 in-panel `GiftValueStack` **stays as is**. The section is additive.

**Cadence-aware imagery.** The pack differs between monthly (20 shots + 8 free) and quarterly (60 shots + 20 free), and there is approved artwork for each. Add one optional field to `OfferPricing`:

```ts
/** Arranged pack shot for the full-width starter-pack section. Display only. */
starterPackImage?: string;
```

Set on `flow["monthly-sub"]` and `flow["quarterly-sub"]` only. The section renders whatever the selected cadence points at and renders nothing when the field is absent, so the one-time cadences, Clear and Both are all handled by the same absence rather than by a conditional. `selectedCadence` already lives in `page.tsx` and the section sits in the same tree, so it arrives as a prop with no state lifting. `CadencePricing` is a direct alias of `OfferPricing` (`cadenceData.ts:31`), so the field reaches the component with no adapter change.

Both composites are 1200x857, so the swap causes no layout shift.

**Quarterly gains the gift stack.** `flow["quarterly-sub"]` currently has no `gifts`, so the hat, travel pack and app access are attached to monthly only. Confirmed 28 Aug 2026 that quarterly gets the same pack, so it takes `gifts: STARTER_PACK_GIFTS`. Side effect, intended: the Phase 2 in-panel stack now also appears on the quarterly card.

**Prices stay in HTML.** The approved artwork carries burned-in price labels. Those are for the hero slide (Phase 1) and for paid social. The section renders its rows from `OfferPricing`, which keeps the numbers in one place and legible on a phone: the artwork's labels scale to roughly 4px at 390px, which is why the reference site's own mobile section is unreadable. The section therefore wants the **label-free export** of each composite, same render with the annotation layer hidden, same canvas.

Until those exports land, the annotated files sit at the target paths and the label-free pair overwrites them by filename, no code change.

**Structure.** Content-only component, one file for both breakpoints, per MOBILE_OPTIMIZATION.md. Two columns from `lg:`, stacked below it. A 1200x857 shot at the full 1280 track is 913px tall, which buries the rows, so the shot takes half the width on desktop rather than running full bleed.

```
Desktop (lg+)                                    Mobile (390)

  FOR NEW SUBSCRIBERS                              FOR NEW SUBSCRIBERS
  Your starter kit includes:                       Your starter kit
  Everything you need to kickstart focus,          includes:
  energy and cognitive performance.

┌───────────────────┐  ✓ CONKA Flow, 20 shots    ┌──────────────────┐
│                   │            £69.98  £39.99  │  [pack shot]     │
│   [pack shot,     │  ✓ +8 free shots           └──────────────────┘
│    swaps by       │            £23.99   Free
│    cadence]       │  ✓ CONKA Hat                 ✓ CONKA Flow
│                   │            £19.99   Free       £69.98  £39.99
│                   │  ✓ Capsule Travel Pack       ✓ +8 shots
│                   │            £28.99   Free       £23.99   Free
└───────────────────┘  ✓ Full CONKA app access     ✓ CONKA Hat
                                  £9.99   Free       £19.99   Free
                       ┌────────────────────────┐  ✓ Travel Pack
                       │ £152.94 of value       │    £28.99   Free
                       │      Yours for £39.99  │  ✓ App access
                       └────────────────────────┘    £9.99   Free

                                                  ┌──────────────────┐
                                                  │ £152.94 of value │
                                                  │ Yours for £39.99 │
                                                  └──────────────────┘
```

Copy note: the heading follows the Graymatter reference, which Rudh preferred to the drafted "What you get in your first box" (28 Aug 2026). "Welcome kit" was considered and dropped: the pack is the starter pack everywhere else, from the plan to the `FLOW-STARTER-28` SKU, and a second name for one thing costs more than it buys. The eyebrow carries the "new subscribers" half of that idea instead.

The subhead deliberately avoids "free with your first order". On quarterly the bonus shots repeat every cycle, so a first-order claim understates the offer.

The paid row derives from `price` and `compareAtPrice`, the free rows from `freeShots` / `freeShotsValue` and `gifts`, exactly as `GiftValueStack` does, so the two surfaces cannot drift. Totals: £152.94 against £39.99 monthly, £328.90 against £109.99 quarterly.

No CTA. `StickyPurchaseFooter` and `StickyPurchaseFooterMobile` are present on both breakpoints.

- Complexity: Medium
- Files: `app/lib/offerData.ts`, `app/conka-flow/page.tsx`, new `app/components/product/StarterPackContents.tsx`, `public/formulas/starterPack/`

**Hero lead slide, folded in.** Phase 1 made the starter-pack shot the first gallery slide, and that artwork carries its own prices, so selecting quarterly left hero artwork reading £39.99 above a panel reading £109.99. `getPdpGalleryImages(formulaId, cadence)` in `mmPdpData.ts` now substitutes slide 1 for the cadence's own `starterPackImage`, so the hero and the section read one field. Cadences with no pack keep the array as authored. `ByoGallery` still reads `MM_GALLERY_ASSETS` directly and is unaffected.

Note on reachability: the Flow PDP's plan cards are the two subscription cadences, and the one-time offer is a link rather than a card, so `selectedCadence` on this page is only ever `monthly-sub` or `quarterly-sub`. The no-pack branch is defensive, not a path the PDP takes.

## Sequencing gate

Phases 1, 2 and 4 make the page advertise gifts that the Shopify variant does not yet ship. They are safe on a Vercel preview and unsafe in production. Merge Phase 3 first, or ship all of them in a single PR. No preview-only phase reaches `main` ahead of the variant.

Phase 4 confirms quarterly gets the same pack, so Phase 3 now needs a **quarterly sibling variant** as well as `FLOW-STARTER-28`, or the quarterly cadence promises a pack the variant does not ship.

## Assets

All committed, no conversion needed. The source folder was re-exported at web sizes after this plan was first written, which removed the 4.2MB PNG problem.

| Asset | Committed path | Size |
|-------|----------------|------|
| Bundle hero (1200x857) | `public/formulas/starterPack/FlowStarterPack.jpg` | 66KB |
| Hat thumb (750x750) | `public/formulas/starterPack/ConkaHat.jpg` | 20KB |
| Bonus shots thumb (750x750) | `public/formulas/starterPack/EightFlow.jpg` | 37KB |
| Travel pack thumb (750x750) | `public/formulas/starterPack/TravelPack.jpg` | 14KB |
| Quarterly pack shot (1200x857) | `public/formulas/starterPack/FlowQuarterlyStarterPack.jpg` | 66KB |
| Monthly pack shot (1200x857) | `public/formulas/starterPack/FlowStarterPack.jpg` | 66KB |

The app-access row has no thumbnail and falls back to a tick glyph, which is why `OfferGift.image` is optional.

Phase 4 notes on the pack shots:

- The monthly shot is the same file as the Phase 1 hero slide. Phase 4 review deduplicated the two: `MM_GALLERY_ASSETS["01"][0]` now points at the `starterPack/` copy and the byte-identical `mmPdpAssets/` original is deleted, so the hero, this section and `ByoGallery` request one URL and share its optimised variants.
- Both are the **annotated** exports, with price labels burned in. They are placeholders at these paths: the label-free pair overwrites them by filename when exported, no code change.
- `TwentyFlow.jpg` in the source folder is a byte-identical copy of `EightFlow.jpg`, not a 20-shot render, so it is not committed. Both free-shot counts point at `EightFlow.jpg` until a distinct render exists.

## No-gos

- Flow only for Phases 1 to 4. Clear and Both are **not** in scope for those, but are now expected to follow (see below).
- In place on `/conka-flow`. No new page or route.
- H1 stays "CONKA Flow". The offer layers on; the product is not renamed.
- Price stays £39.99.
- No fork of the data layer to scope the offer to the PDP. One shared entry in `OFFER_VARIANTS.flow["monthly-sub"]`; the offer ships wherever that entry is read.

## Phase 5 (expected) - extend the pack to Both and Clear

Raised by Rudh 28 Aug 2026, not yet scoped or ticketed.

**Both is the one that actually forces this.** The Flow PDP upsells to Both, and its Explore section is currently the only Flow to Both path. Once Flow's first order ships as a kit, a customer who takes that upsell trades down: they pay more and lose the hat, the travel pack and the app access. The upsell argues against itself. Clear then follows for symmetry rather than for its own reason, since a Clear buyer landing beside a Flow page that gives more away reads badly.

Cost is mostly outside the code:

- **Shopify: six starter variants, not two.** Flow, Clear and Both, each monthly and quarterly, each with its own `custom.bundlecomposition`. This is the bulk of the work and it lands on SCRUM-1284.
- **Assets: four more pack shots.** Clear and Both, monthly and quarterly. Same 1200x857 arrangement, and the label-free question applies to all six.
- **Code: small.** `gifts` and `starterPackImage` on the four new subscription cadences, then the same `StarterPackContents` section dropped into slot 4 of `/conka-clarity` and `/conka-both`. The component and `getPdpGalleryImages` are already product-agnostic; only Flow's gallery currently leads with a pack shot, so Clear and Both would need that slide adding to `MM_GALLERY_ASSETS` if they want the hero treatment too.
- **Commercial:** the gift RRPs are the same three items regardless of product, so Both's stack sits against a larger box and reads as a smaller proportional giveaway. Worth checking the value stack still lands before shipping it.

### Gift component SKUs

The two physical gifts are real Shopify products, both correctly unpublished (checked 28 Aug 2026):

| Item | Product | SKU | State |
|---|---|---|---|
| Hat | CONKA Trucker Hat (`8808400159005`) | `25` | Active, 1457 in stock, tracked, 250g, price £0.00, oversells |
| Travel pack | CONKA Travel Pack, 2 Weeks (`15419180056950`) | `CONKA-TRAVEL-PACK-28` | Active, £28.99 (matches the displayed RRP), 100g, **untracked, qty 0** |

Decisions, 28 Aug 2026:

- **Hat SKU stays `25` for now.** Humphrey may already have registered it with Synergy under that string, and the pick keys on whatever Synergy holds, not on what reads well. Blocking question for him: which SKU does Synergy have on file for the hat, and has he sent them anything for the travel pack? Until answered, every `bundlecomposition` uses `1x25`.
- **Travel pack SKU is `CONKA-TRAVEL-PACK-28`** (set 28 Aug 2026), capsule count encoded. A 14-cap pack is a different physical item with different cost, weight and value, so it takes its own SKU (`-14`) rather than silently redefining this one, the same convention as `FLOW-FUNNEL-28` to `-20`. Count, not duration: "2 weeks" is derived from the dose and stops being true when the dose changes.
- The hat needs no count. One hat is one hat.

Consequences to watch:

- Changing either SKU means editing all six `bundlecomposition` strings. Settle both before the variants are built.
- The £28.99 RRP is pinned to 28 capsules. Halving the pack moves that figure in `STARTER_PACK_GIFTS`, in every value-stack total, and in all six pack shots, so the artwork should be commissioned at the final spec.
- The travel pack must be switched to tracked with real stock before it can be a bundle component. Synergy cannot pick what Shopify does not count.
- The hat is £0.00 and oversells. Both are safe while it stays unpublished, and both must be fixed first if it is ever sold standalone.

### Open questions

- Whether Both's kit should hold more than a single formula's, given it is the premium tier and currently gives away the same three items against a larger box.
- ~~Whether the travel pack is Flow-specific.~~ **Closed 28 Aug 2026:** renamed to "CONKA Travel Pack (2 Weeks)", so it is formula-neutral and one item serves all three kits.

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
| SCRUM-1287 | 4 - Full-width PDP section | Story | Website & CRO | To Do |

SCRUM-1284 blocks SCRUM-1282, SCRUM-1283 and SCRUM-1287, which encodes the sequencing gate above.
SCRUM-1283 relates to SCRUM-1259 (crossed-out price logic).
