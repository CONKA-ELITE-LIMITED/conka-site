# PDP Above-the-Fold Conversion

Raise add-to-cart rate on the three main acquisition PDPs (`/conka-flow`, `/conka-clarity`, `/conka-both`) by making the first screen answer "what does this do for me?" and "what do I get?" before the user reaches the price.

Scoped 2026-09-10. Branch `feature/pdp-add-to-cart-tweaks`.

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Spec pill deleted, offer moved above the gallery (its strapline half was superseded by Phase 3) | Built + reviewed 2026-09-10, pending visual review |
| 2 | Benefit lede above the plan picker on mobile | Built + reviewed 2026-09-10, pending visual review |
| 3 | Offer badge, discount pill to the card corner, benefit headline back at full size and fitted to one line | Built + reviewed 2026-09-10, pending visual review |
| 4 | Sticky purchase footer | Not started, deferred by Rudh |
| 5 | Desktop convergence + PAGE_NARRATIVES entry | Future |

## Problem

The first screen of the Flow / Clear / Both PDPs never answers "what does this do for me?".

Current mobile order (`ProductHeroMobileV3`):

1. `SocialProofBadge` - "112 others exploring better focus"
2. `h1` - "CONKA Flow"
3. `SpecBadge` - "0MG CAFFEINE | MORNING RITUAL"
4. `HeroRating` - 4.7 (622 reviews)
5. Gallery
6. `ProductBuyPanel` - "Select your plan:", 20 shots, 43% OFF, £39.99
7. `IngredientBenefitLede` - "The Daily Morning Brain Shot / for Sharper, Calmer Focus" + description + 2x2 check grid

The benefit line that does the persuading is at position 7, below the buy decision. The spec pill at position 3 occupies the most valuable row on the page and says nothing a buyer weighs.

The strongest offer we have, a free starter kit worth £82.96 on a Flow monthly subscription, is invisible until the user has scrolled past the price entirely (`GiftValueStack`, inside the subscription summary card).

## Who it serves

Cold paid-social traffic landing directly on a PDP. 74% mobile. The 390px viewport is the design target.

## Business impact

Add-to-cart rate on the three PDPs that carry most paid acquisition.

## Approach

Promote the benefit line into the slot the spec pill currently wastes, and add a derived gift-value line beside it. Do not hoist the whole lede block.

**Design language:** Simple DTC (DESIGN_SYSTEM.md section 8.5 authority table governs PDP acquisition surfaces). Green `--brand-positive` `#1a7f4f` is the sanctioned accent for the gift-value figure. `.brand-clinical` on these pages is vestigial token inheritance only.

## The SCRUM-1260 conflict, and how this resolves it

The obvious version of this work - move `IngredientBenefitLede` above `ProductBuyPanel` on mobile, the way Magic Mind orders its PDP - directly reverses SCRUM-1260, which moved that block *below* the buy panel on purpose so price and CTA would land on the first screen. `ProductHeroMobileV3`'s own header comment records the reasoning.

The full lede costs roughly 330px at 390px: a two-line `h2` at 2.25rem/1.5rem, a description paragraph, and a 2x2 check grid. Hoisting all of it pushes the plan selector off screen again.

The resolution is that the lede is three separable things, and only two of them need to move:

- The `h2` moves to the very top, into the slot the deleted spec pill vacates, condensed to a single-weight strapline. Net height cost near zero, because it replaces something.
- The check grid moves above the buy panel, at roughly 90px rather than 330px (Phase 2).
- The description stays where it is.

Magic Mind accepts price below the fold as the cost of its ordering. We do not have to.

**Superseded on the day, 2026-09-10.** Phase 2 as built moved the description too, so the split above never happened and the mobile hero did take most of the 330px. The reasoning is kept because it is still the cheaper retreat if the height turns out to hurt. See the Phase 2 section.

## Why the spec pill is a clean delete

`SPEC_LABEL` in `HeroBadges.tsx` carries two facts per product:

| Product | Pill | Already said by |
|---------|------|-----------------|
| Flow | "0mg caffeine \| morning ritual" | Check grid item 1 ("Zero caffeine, zero crash"); strapline "The Daily **Morning** Brain Shot" |
| Clear | "0mg caffeine \| afternoon clarity" | Check grid item 1; strapline "The **Afternoon** Brain Shot That Cuts Through Brain Fog" |
| Both | "0mg caffeine \| full system" | Check grid item 1; strapline "The Complete Daily Brain Shot **System**" |

Every fact survives the deletion. Nothing needs relocating.

## Gift-value line: the data constraints

`offerData.ts` attaches `STARTER_PACK_GIFTS` to `monthly-sub` and `quarterly-sub` only. One-time cadences have no `gifts` and no `freeShotsValue`.

The total is `freeShotsValue + sum(gifts[].rrp)`, which differs per product and cadence. The £82.96 in the reference screenshot is specifically Flow monthly-sub: £23.99 (8 free shots) + £19.99 (hat) + £28.99 (capsule travel pack) + £9.99 (app access).

Two consequences:

- The line must derive from the currently selected cadence, and render nothing when that cadence has no gifts. It sits above the gallery while the selector sits below it, so the figure changes as the user picks a plan and vanishes on one-time.
- `GiftValueStack` already computes this total. Extract it into a shared helper rather than recomputing, so the hero figure and the stack figure cannot diverge.

**Decision:** show the real per-cadence figure, not a fixed monthly headline number. It is derived, so it cannot drift from what the stack shows lower down.

Every figure here is display-only and pre-add. Cart and checkout still price from Shopify alone (CART_PRICING_SOURCE_OF_TRUTH.md).

## Phase 1: Strapline and gift-value line

Target mobile order after Phase 1:

1. `SocialProofBadge`
2. `h1`
3. **`HeroStrapline`** (new, replaces `SpecBadge`)
4. `HeroRating`
5. **`HeroGiftValue`** (new)
6. Gallery
7. `ProductBuyPanel`
8. `IngredientBenefitLede` (description + check grid, `h2` removed)

### Tasks

**1. Delete `SpecBadge`, add `HeroStrapline`** - Small

- Remove `SpecBadge` and `SPEC_LABEL` from `HeroBadges.tsx`.
- New `HeroStrapline` reads `LEDE_SUBLINE[formulaId] ?? getHeroContent(formulaId).seoHeading`. Same source the lede `h2` uses today, so no new copy is authored.
- Renders as plain text at roughly 1.0625rem, not a pill and not a heading element. It is a descriptor under the `h1`.
- Slots into the identity block of both heroes where the pill was.
- Files: `app/components/product/HeroBadges.tsx`, `app/components/product/ProductHeroMobileV3.tsx`, `app/components/product/ProductHeroV3.tsx`

**2. Drop the duplicated `h2` from `IngredientBenefitLede`** - Small

- Depends on task 1. With the strapline at the top, the two-line `h2` repeats the same sentence within one screen.
- Delete the `h2` and the bold/tail split logic (the `" for "` / `" That "` / comma-fallback parsing). Keep `LEDE_DESCRIPTION` and the check grid.
- `LEDE_SUBLINE` stays, since `HeroStrapline` now consumes it.
- Files: `app/components/product/IngredientBenefitLede.tsx`

**3. Gift-value line in the identity block** - Medium

- Extract the gift total from `GiftValueStack` into a shared helper (`getGiftTiles` plus its `totalFreeValue` reduce), exported from `cadenceData.ts` or a small sibling.
- New `HeroGiftValue` takes the selected cadence's pricing, returns `null` when there are no gift tiles.
- Copy as planned: `Free starter kit worth £82.96 on your first box`, figure in green, no box. **Superseded by Phase 3**, which rebuilt this as a count-led pill; see that section for what actually ships.
- `GiftValueStack` refactored to consume the same helper.
- Files: `app/components/product/GiftValueStack.tsx`, `app/lib/cadenceData.ts`, `app/components/product/HeroBadges.tsx`, both heroes

### Verification

- All three PDPs at 390px: strapline wrapping, gift line present on monthly-sub, absent on one-time.
- Flow and Clear straplines are long. "The Afternoon Brain Shot That Cuts Through Brain Fog" wraps to three lines at 390px. Confirm the plan selector has not moved further down the page than it is today.
- `npm run lint:changed`, `npm run build`.

## Phase 2: Benefit lede above the plan picker on mobile

**Built 2026-09-10, SCRUM-1335.** Two things about this phase changed at the point of building, both on Rudh's call after seeing Phase 1 rendered:

- **The whole lede moves, not just the check grid.** The sketch below proposed splitting `HeroBenefitChecks` out so only about 90px went above the picker. Rudh pointed at the rendered description-plus-grid block and asked for that whole thing above the picker, so no split happened and `IngredientBenefitLede` moved intact. The split is superseded, not deferred.
- **The data gate was dropped.** The phase was held until Phase 1 had a week of add-to-cart data. It shipped on the same branch instead.

**As built:** `ProductHeroMobileV3` renders `IngredientBenefitLede` between the gallery and `ProductBuyPanel`. Mobile only; desktop keeps the lede below the buy panel, where the right column has room and the buy box is above the fold either way. Nothing else moved.

**The cost, stated plainly.** Price now sits roughly 200px lower on mobile than before this work started: about 180px of lede plus a 24px flex gap, on top of the roughly 40px Phase 1 added. This is a deliberate partial reversal of SCRUM-1260, which had pushed the lede below the widget precisely to keep price on the first screen. The counter-argument that won: a cold visitor off paid social has no reason to weigh a plan before anything has told them what the product does, which is the order both reference sites use. The docblock at the top of `ProductHeroMobileV3` records the reversal so it does not read as an accident later.

**Superseded sketch, kept for the reasoning:** split `HeroBenefitChecks` (holding `CHECK_ITEMS` and the `CheckMark` svg) out of `IngredientBenefitLede`, leaving the description behind, so only the grid went above the panel at roughly 90px. Worth remembering if the 200px turns out to hurt: it is the cheaper half of this trade, still available as a retreat.

## Phase 3: Offer weight pass

**Built 2026-09-10, SCRUM-1336, commit `355760d2`.**

Reviewing Phases 1 and 2 next to the Graymatter PDP produced one diagnosis: the elements meant to catch a cold visitor were the quietest things on the screen. Graymatter's offer is a filled pill sitting on the price; ours was a sentence in body text.

1. **The starter-kit offer became a filled green badge** with a gift icon, replacing the sentence with a coloured figure. Same derived per-cadence value, same hide-on-one-time behaviour, unchanged data path.
2. **The plan-card discount pill moved to the card's top-right border and grew** from 10px to 12px. Inline it competed with the strike-through and the price for one eye line and made the row read as three numbers. `MOST POPULAR` keeps its centred position, so the two occupy different horizontal space and do not collide at 390px.
3. **The benefit headline went back to the lede at full size**, reverting the strapline half of Phase 1.

### Phase 1's strapline lasted one afternoon, and that is worth recording

Phase 1 moved the subline out of the lede and shrank it to a one-line strapline under the `h1`. Phase 3 put it back as the two-line `h2` it was, and deleted `HeroStrapline`.

This is not churn. Phase 1's reasoning was that the benefit had to sit under the `h1` because that was the only place a buyer would see it before the price. Phase 2 removed that constraint by moving the whole lede above the plan picker. Once the benefit lands before the buy decision anyway, there is no reason to pay the cost Phase 1 paid for the position, which was shrinking the loudest line on the page to fit beside a star rating.

What survives from Phase 1 is the part that mattered: the spec pill is still deleted, and the offer still sits above the gallery.

Side effect: restoring the `h2` closes the heading-structure risk flagged during Phase 1, when the mobile hero briefly had no `h2` at all.

### Phase 3 took four passes at the badge, and the loop is the useful part

The badge went solid green, then spec-pill gradient, then grey-with-gradient-ring, then back to the spec-pill gradient. That looks like churn and mostly was not, because each pass fixed a different fault:

1. **Solid green fill.** Read as a system alert rather than as part of the brand.
2. **Spec-pill gradient, uniform mono line.** Fixed the alert problem. But the figure sat flat inside a uniform sentence, so the badge got noticed and the amount inside it did not.
3. **Grey fill, gradient ring, figure at 1.125rem in green.** The figure now led, and immediately read as *the price of the product*. That is the expensive misread: a large green number beside a product name on a first screen.
4. **Count-led copy, back on the spec-pill gradient.** `+4 free gifts worth over £80`.

The lesson worth keeping: passes 1 to 3 all treated a **copy** problem as a **styling** problem. A lone `£82.96` in that slot cannot be styled into reading as a gift value, because nothing in it says it is one. Leading with a count fixes it at the source, and once fixed, the flat pill that failed at pass 2 works fine, so the slot keeps the shape the rest of the layout was built around.

### Why gifts and not a discount in that slot

Asked directly during Phase 3, and the answer is load-bearing enough to record:

- **The slot is pre-price.** Since Phase 2 moved the lede above the picker, the first price on the page sits roughly 200px below this badge. A percentage has nothing to anchor to at the moment it is read; a count of free things needs no anchor.
- **The discount is already stated twice** above the fold, on the plan-card corner and the sticky footer. A third instance is the cannibalisation the No-gos section rules out.
- **Graymatter can put a percentage there because their price sits beside it.** Ours does not. Copying the pill without the price copies the look and drops the logic.

This should be revisited if Phase 4 ships: a sticky bar carrying price and discount from page load would give a percentage the anchor it currently lacks.

### Value claim safety

The rounded figure is derived, never written down. `roundedDownValue` floors to the nearest ten so "over £80" is always true of the real total, and a total landing exactly on a ten steps down a bucket, because "over £80" is false at exactly £80. No current cadence does that, but a future price change must not be able to make the badge lie.

Current output: Flow and Clear monthly "over £80" (£82.96), Both monthly "over £100" (£106.96), all quarterly "over £110" (£118.96).

## Post-build review (2026-09-10, commit `f8e44e77`)

Five findings, all fixed on the branch.

- **Major: the one-line headline broke entirely without container queries.** An unknown unit invalidates a whole declaration at parse time, so an inline `clamp(..., 7.58cqi, ...)` was not partially ignored but dropped, and Tailwind preflight sets `h2` to `font-size: inherit`. The headline would have rendered at body size on Safari 15 and earlier. The clamp now lives in `brand-base.css` as `.pdp-lede-headline` behind `@supports (container-type: inline-size)`, with the plain h2 token as the base rule.
- **Minor: the two plan-card badges collided at 320px.** `MOST POPULAR` is centred and the discount pill is pinned right; they clear by about 30px at 390px but overlap by roughly 4px at 320px. The discount pill steps down below 360px only.
- **Minor: the gift tile list was rebuilt four times per render.** Collapsed into one `getCadenceGiftSummary` returning tiles, count and total.
- **Minor: `getCadenceGiftTiles` was exported with no external caller.** Now module-private.
- **Nit: an override variable nothing set.** Removed.

Pricing was verified against `offerData.ts` rather than against the screenshots: the gift count is 4 for every subscription cadence and product, £82.96 is 23.99 + 19.99 + 28.99 + 9.99, and no new pre-add price is computed anywhere, so `CART_PRICING_SOURCE_OF_TRUTH.md` holds.

## Phase 4: Sticky purchase footer (Deferred)

Raised by Rudh alongside Phase 3 and explicitly parked until the visual changes settle. Two options on the table:

- The Graymatter pattern: a sticky bar that scrolls the visitor back up to the purchase options rather than adding to cart directly.
- Reintroducing our own sticky add-to-cart footer, which `StickyPurchaseFooter` / `StickyPurchaseFooterMobile` already implement.

Worth noting this interacts with the roughly 200px of extra scroll depth Phases 1 to 3 put between the top of the page and the plan picker. A sticky route back to the picker is a plausible answer to exactly that cost, so it should be judged against the same add-to-cart number.

## Phase 5: Desktop convergence and narrative entry (Future)

- Reconcile `ProductHeroV3` with whatever mobile settles on, rather than letting the two drift.
- `PAGE_NARRATIVES.md` has no entry for the PDPs at all, so there is no health rating or section arc for the pages carrying most paid traffic. Add one.

## As built (Phase 1, 2026-09-10)

Commit `ba299874` on `feature/pdp-add-to-cart-tweaks`, SCRUM-1334.

Built as planned, with two things the plan did not anticipate.

**AC 8 is not verified.** The criterion asked that the plan selector sit no lower at 390px than it does on main. That needs eyes on a rendered page and was not measured. Static reckoning of the mobile identity block says it grows by roughly 40px: the spec pill (about 36px) comes out, the strapline goes in at two lines (about 50px on Flow and Clear, whose straplines are the long ones), plus the gift line (about 20px) and one extra 8px flex gap. So the selector probably sits about 40px lower rather than level. That is the deliberate cost of putting the benefit and the offer above the gallery, but it is a real deviation from the criterion as written, and it is the first thing to check on the preview.

**Desktop now states the offer twice.** On `ProductHeroV3` the gift line sits immediately above `ProductBuyPanel`, which renders `GiftValueStack`. Within about 300px the same offer is made twice. On mobile the gallery and the panel separate them, which is the point; on desktop the buy panel was already above the fold, so the hero line may be redundant there. Left in rather than decided during the build. Making `HeroGiftValue` mobile-only is a one-line change if it reads badly.

**Unplanned edit outside the file list.** `ProductHeroV2.tsx` and `ProductHeroMobileV2.tsx` still imported `SpecBadge`. Nothing routes to either file, but `tsc` typechecks them, so deleting the badge broke the build until both lost the import and its one usage. The files are otherwise untouched, and their deletion is logged in `docs/TODO.md` under PDP Structure Rework Cleanup.

## Rabbit holes

- **Rewriting strapline copy per product.** Use what `seoHeading` and `LEDE_SUBLINE` already hold. A copy pass is separate work, and any new benefit claim would need an EFSA check.
- **Reworking `GiftValueStack`.** Only its total is extracted into a helper. Its layout, tiles and struck RRPs are untouched.
- **Reordering the whole mobile hero.** Phase 1 changes one row and adds one. Phase 2 moves one block. That is the whole surface area.

## No-gos

- ~~**No wholesale hoist of the lede above the buy panel.** Re-breaks SCRUM-1260 and pushes price and CTA off the first screen.~~ **Overturned 2026-09-10 (SCRUM-1335), deliberately and by the person who owns the call.** The whole lede now sits above the picker on mobile and price sits roughly 200px lower. Kept visible rather than deleted, because the reasoning behind it is the thing to re-read if add-to-cart rate drops.
- **No discount percentage or price above the gallery.** Decided 2026-09-10: gift-value framing only. Three price anchors on one screen (hero, buy panel, sticky footer) cannibalise each other, and the percentage changes per cadence while sitting above the selector that sets it.
- **No A/B infrastructure.** None exists. `ab-testing-mvp.md` is a settled plan, not a build, and it explicitly rules out reusing `conka_uid` for bucketing. Ship to 100% and read add-to-cart rate against the existing `pdp:section_viewed` instrumentation from PDP rework Phase 1.
- **No new analytics events.** Add-to-cart rate is already measurable on these pages.

## Risks

- The gift line disappearing on a switch to one-time is a layout shift above the gallery. Reserve its height or accept the shift; decide during build with the real measurement.
- Deleting the `h2` removes the only `h2` in the mobile hero. The strapline must not become an `h2` in its place: it sits under the `h1` as a descriptor. Keep the heading structure defensible for SEO.
- Long straplines on Flow and Clear could cost more vertical space than the pill they replace. Check all three at 390px before merging.
- The gift figure now appears twice on one page (hero and `GiftValueStack`). `getCadenceGiftSummary` is what stops them drifting; do not let either recompute independently.
- The hero badge makes a public value claim ("worth over £80") derived from `offerData`. Any price change to `STARTER_PACK_GIFTS` or `freeShotsValue` moves it automatically, which is the point, but it means the claim is only as accurate as that data. `roundedDownValue` is what keeps it from overstating.
- The one-line headline depends on container queries. The `@supports` guard in `brand-base.css` means an unsupported browser gets the plain h2 token rather than a broken declaration; do not inline that clamp again.

## References

- `docs/development/featurePlans/pdp-structure-rework.md` - the prior structural push. Phase 1 (SCRUM-1260) is the decision this plan works around; Phases 4 to 6 remain open and are unrelated to this work.
- `docs/development/featurePlans/ab-testing-mvp.md` - why there is no split test here.
- `docs/branding/DESIGN_SYSTEM.md` section 8.5 - Simple DTC spec and per-surface authority table.
- `docs/development/CART_PRICING_SOURCE_OF_TRUTH.md` - pre-add display prices from `offerData.ts`, cart prices from Shopify.
- `docs/branding/MOBILE_OPTIMIZATION.md` - 390px mobile-first mandate.
- Reference sites: Magic Mind PDP (benefit block above the picker, price below the fold), Graymatter Starter Kit PDP (benefit sub-headline on line 2 of the H1, discount pill above the gallery).

## Jira tickets

| Ticket | Description | Phase | Status |
|--------|-------------|-------|--------|
| SCRUM-1334 | [Website & CRO] PDP above-fold Phase 1: benefit strapline replaces the spec pill, gift-value line in the hero | 1 | For review |
| SCRUM-1335 | [Website & CRO] PDP above-fold Phase 2: move the benefit lede above the plan picker on mobile | 2 | For review |
| SCRUM-1336 | [Website & CRO] PDP above-fold Phase 3: filled offer badge, discount pill to the card corner, benefit headline back at full size | 3 | For review |
