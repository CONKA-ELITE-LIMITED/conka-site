# PDP Structure Rework

> **Purpose:** Strip the three product pages back to the buy decision plus the arguments only CONKA can make. Phased so each phase ships to production on its own.

Branch: `feature/pdp-structure-rework`

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Slim, reorder, and instrument | Merged (PR #447) |
| 2 | Comparison table | For review (commit `62b94904`) |
| 3 | Ingredients merge | Not Started (scope reduced, see below) |
| 4 | App section and glass slide | Future (asset-gated) |
| 5 | Start pack, and cut Explore | Future (blocked on bundle definition) |

## Problem

All three PDPs (`/conka-flow`, `/conka-clarity`, `/conka-both`) run a dense Magic Mind hero and then a 13 section body that restates the same arguments:

| Argument | Times it appears |
|----------|------------------|
| Ingredients | 3 (hero text list, hero outcome accordions, body `ClinicalIngredients`) |
| Benefits | 3 (hero lede checks, `ProductBenefitTiles`, `FormulaBenefitsPillars`) |
| Risk free | 2 (hero accordion, `LabGuarantee`) |
| Absorption | 2 (hero lede checks, `AbsorptionBioavailability`) |

Three consequences:

1. **The mobile hero is too tall.** `ProductHeroMobileV3` ends with a whole ingredients section (collapsed list, three outcome buckets of accordion cards, who it is for, try risk free). That is the Magic Mind desktop pattern, which works beside a sticky image column and does not translate to a single mobile column. `IngredientBenefitLede` also sits above the buy panel, so a 2.25rem H2 plus a paragraph plus a check grid push price and CTA down the first screen.
2. **You cannot buy below the fold.** Both sticky footers are commented out (SCRUM-1171). `CROTestimonials` and `LabFAQ` are passed `hideCTA`. So a visitor who reads to the bottom has to scroll back to the top.
3. **The real differentiators are absent.** The app appears once, as a subscription bullet in `ProductBuyPanel.tsx:469`. Glass bottles appear nowhere in the component or lib tree. Meanwhile three sections argue absorption, benefits and a coffee comparison, all of which competitors also claim.

Reference for the last point: the Gray Matter PDP (`trygraymatter.com/products/brightmind-1`) runs a buy box plus roughly six blocks, with a three column comparison table doing the positioning work and goal filtered reviews doing the proof.

## Approach

Delete what repeats, raise the buy decision, and add only the sections that say something a competitor cannot copy. Ship in five phases, each independently deployable via Vercel preview.

**Design language:** Simple DTC (Tailwind radii, navy `#1B2757` primary, green `#1a7f4f` savings accent). See DESIGN_SYSTEM.md section 8.5.

Note: all three pages set `brand-clinical` on the root div while every component uses Tailwind radius utilities, which `.brand-clinical` does not affect. The class is effectively vestigial on these pages. Out of scope here, worth a separate cleanup.

## Target section order

Applied identically to all three PDPs, which share one order today.

1. Hero (badge, H1, spec, rating, gallery, buy panel with ingredients pill, lede, trust strip)
2. Certifications band
3. UGC marquee
4. Ingredients
5. What you'll feel (`FormulaBenefitsPillars`, unchanged)
6. What to expect (timeline)
7. Comparison table (Phase 2)
8. The app (Phase 4)
9. Testimonials
10. High performers (athlete marquee and carousel)
11. 100 day risk free
12. Start pack (Phase 5, replaces Explore)
13. FAQ

## Phase 1: Slim, reorder, and instrument

The high confidence work. No new assets required.

### 1. Analytics: section view tracking keyed on semantic ids

**What:** a `pdp:section_viewed` event firing once per section per pageview, carrying exactly two properties, `product` and `section`, respecting the two property budget in `app/lib/analytics.ts`.

`section` is the semantic `id` already present on every `<section>` in the three pages (`hero`, `ingredients`, `guarantee`, `athletes` and so on). It is deliberately **not** positional. `docs/features/LISTICLE_SYSTEM.md` line 42 records the failure mode being avoided: listicle block ids are `${kind}_${index}`, so inserting or reordering a block shifts every id below it and breaks comparability with earlier data. This project reorders the PDP repeatedly, so positional ids would destroy the dataset on the very first phase. A semantic id survives reordering; a deleted section simply stops appearing and a new one appears under a new id.

Ship this first so Phase 1's own before and after is measurable.

**Extraction, and the backward compatibility constraint.** The `IntersectionObserver` machinery in `app/components/go/listicle/listicleAnalytics.tsx` is already exactly what the PDP needs, so it is extracted into a shared provider rather than duplicated. The extraction is **strictly behaviour preserving for the listicle**: the listicle keeps the same event names, the same two properties, the same once per section semantics, the same `threshold: 0` and `rootMargin: "0px 0px -15% 0px"`, the same unobserve on fire, and the same handling of elements that register before the observer exists. Every existing listicle export keeps its signature (`SectionImpressions`, `TrackedSection`, `useListicleCta`, `useListicleInteraction`, `useListicleSrc`, `sectionId`, `SECTION`, `slugifyChoice`) so no listicle call site changes.

Shape: a generic provider owning the observer and taking an `onSeen(section)` callback. `listicleAnalytics.tsx` becomes a thin wrapper passing `(section) => trackListicleSectionViewed({ slug, section })`. The PDP gets its own thin wrapper passing `(section) => trackPdpSectionViewed({ product, section })`.

Verification before merge: a listicle page emits an identical event stream before and after the change.

- Complexity: Medium
- Files: `app/lib/analytics.ts`, new shared observer module, `app/components/go/listicle/listicleAnalytics.tsx`, the three PDP pages

### 2. Cut the mobile hero tail

**What:** remove the collapsed Ingredients `<details>`, `IngredientOutcomeAccordions`, "Who is it for?" and "Try risk free" from `ProductHeroMobileV3`. Surface the existing `IngredientListButton` pill inside the buy panel, which already opens a bottom sheet with the full list, so the label stays one tap away. Move `IngredientBenefitLede` below the buy panel so price and CTA sit higher on the first screen.

No ingredient data is lost: `ClinicalIngredients` in the body already carries name, class tags, render, one line benefit, description and key study, all from the same `ingredientsData`.

Desktop keeps its ingredient column. The sticky two column pattern works there and there is room. Phases 1 to 2 leave `ProductHeroV3` alone; Phase 3 converges them.

- Complexity: Medium
- Files: `app/components/product/ProductHeroMobileV3.tsx`, `app/components/product/ProductBuyPanel.tsx`

### 3. Thin sticky purchase footer

**What:** restore `StickyPurchaseFooterMobile` and `StickyPurchaseFooter` on all three PDPs, restyled to a single row of price plus CTA. The current mobile component carries a plan dropdown and a trust strip, which is what made it heavy. Restoring the footers also means restoring the `cadencePricing` lines currently commented out in each page.

Add to cart from the footer already tags `location: "sticky_footer"`, so funnel attribution needs no new work.

- Complexity: Medium
- Files: `StickyPurchaseFooterMobile.tsx`, `StickyPurchaseFooter.tsx`, the three PDP pages

### 4. Delete the three restating sections

**What:** remove `ProductBenefitTiles`, `AbsorptionBioavailability` and `LandingValueComparison` from all three PDPs.

- `ProductBenefitTiles`' three titles are the same three strings as `OUTCOME_BUCKETS` in `mmPdpData.ts` ("Mental performance", "Sustained energy", "Brain health"). Confirmed duplicate, not a judgement call.
- `AbsorptionBioavailability` argues a category claim rather than a brand one, and competes with the Phase 2 comparison table for the same job.
- `LandingValueComparison` is a landing page component whose CTA points at `/conka-both`, leaking the visitor off the product they came for. The comparison table replaces it and keeps the visitor on the page.

The components stay in the tree. Note after building: only `ProductBenefitTiles` is still rendered elsewhere (`app/page.tsx`). `AbsorptionBioavailability` and `LandingValueComparison` are now fully orphaned, since `CrashChart.tsx:140` mentions the latter only in a comment. They are left in place rather than deleted, but they are dead and a later cleanup should remove them.

- Complexity: Small
- Files: the three PDP pages

### 5. Reorder the body

**What:** ingredients up, what to expect after the ingredients carousel, 100 day risk free after high performers. Same order on all three pages.

- Dependencies: task 4
- Complexity: Small
- Files: the three PDP pages

## Phase 2: Comparison table

Replaces the deleted absorption section. Needs no new assets.

Three columns, following the Gray Matter pattern, where the third column is the sharp one because it addresses the stimulant adjacent buyer without making a claim.

| | CONKA | Coffee and energy drinks | Rx stimulants |
|---|---|---|---|
| Energy duration | 4 to 8 hrs calm | 1 to 3 hrs jittery | Cannot sleep |
| No crash | yes | no | no |
| No jitters | yes | no | no |
| Zero caffeine | yes | no | no |
| Clinically dosed nootropics | yes | no | n/a |
| Adaptogens | yes | no | no |
| Informed Sport certified | yes | no | no |
| Tracks whether it works | yes | no | no |
| Glass, not plastic | yes | no | n/a |
| Money back guarantee | yes | no | no |

Two of those rows carry the differentiators, so both land inside a comparison rather than as bare assertions.

**As built, one row changed.** "Zero caffeine" became "No caffeine or amphetamines". Prescription stimulants contain no caffeine either, so the original row would have handed the third column a tick and undercut the comparison. There is a comment on the row data so it does not get reverted later.

**Open, for a later decision.** Every row except the first is a tick for CONKA and a cross for both others, which reads as marketing rather than comparison. One row where coffee legitimately also wins ("No prescription needed") would make the whole table more credible. Not built, since it is outside the agreed row list.

Mobile: the table scrolls inside its own `overflow-x: auto` container. The page body must never scroll horizontally.

- Complexity: Medium
- Files: new `app/components/product/ProductComparisonTable.tsx`, the three PDP pages

## Phase 3: Ingredients merge

The largest task and the least likely on its own to change an order, which is why it comes third.

**Scope reduced since scoping.** SCRUM-1255 (image-led ingredient cards for the FMC renders) merged in PR #445 before this branch was cut, so `ClinicalIngredients` already has the card face this phase was going to build: a full-bleed 4:3 render band, name, one-line benefit, and the key stat on the collapsed face. There is no collision to resolve and no work to fold. What remains is the merge proper: wrap the existing rail in the `OUTCOME_BUCKETS` grouping (which still lives only in `IngredientOutcomeAccordions`), add the full-list accordion, and remove `IngredientOutcomeAccordions` from the desktop hero. Re-read SCRUM-1262's description before starting it, since it was written assuming three card shapes to reconcile and there are now two.

**What:** one body ingredients section combining the two surfaces. Outcome bucket headings from `OUTCOME_BUCKETS` become the organising principle, since they answer "why is this in here". Under each, a horizontal snap carousel of ingredient cards: render, name and one line benefit on the face, description and PubMed link on expand. A single collapsed "Full ingredients list" at the foot does the supplement facts job, so the written out copy currently in the hero survives.

Must preserve `ClinicalIngredients`' dual formula toggle for `/conka-both`.

Desktop hero converges here: once the body section carries the outcome grouping, `ProductHeroV3`'s inline `IngredientOutcomeAccordions` comes out and desktop matches mobile.

- Complexity: Large
- Files: `ClinicalIngredients.tsx` (285 lines), `IngredientOutcomeAccordions.tsx`, `ProductHeroV3.tsx`, `mmPdpData.ts`, the three PDP pages

## Phase 4: App section and glass slide (Future)

Asset gated. Parked until assets are confirmed.

- **The app.** Its own section, image led. Needs app screens or a short screen recording. One line on measuring the effect rather than trusting it.
- **Glass.** Not a section. One gallery slide in the Functional mushroom layout (full bleed photo, small eyebrow, short headline, two short paragraphs), plus the comparison table row from Phase 2. Angle is preservation, not sustainability: light and oxygen degrade active compounds, amber glass shields them, so what is in the bottle on the last day is what was in it on the first. Confirm with Humphrey that our actives are light sensitive enough for the claim to be true rather than merely conventional.

Gallery note: the Flow gallery already contains `ConkaVsOther.jpg` and `RiskFreeTrial.jpg`, which duplicate the Phase 2 table and the 100 day section. Those two slides should come out to make room for the glass slide.

## Phase 5: Start pack, and cut Explore (Future)

Blocked on the bundle being defined: contents, price, whether it is subscription first, and whether it replaces the current `monthly-sub` default in the buy panel. Those answers decide whether this is a PDP section or a change to the hero buy panel.

`ProductGrid` / Explore is cut **only once the start pack ships**, never before. Explore is currently the only Flow to Both path on the page and Both is the higher AOV, so cutting it early leaves a hole. The start pack does the same cross sell as an offer rather than a directory.

## Rabbit holes

- **The ingredients merge.** Three card shapes, one data source, three pages, and `/conka-both` needs a two formula mode. Circuit breaker: if it runs past two days, ship Phases 1 and 2 and reassess.
- **The observer extraction.** It touches a live, working analytics surface. Keep it mechanical, keep both event senders separate, and verify the listicle event stream is unchanged before merging.

## No-gos

- Not touching `FormulaBenefitsPillars`. It keeps its stats and stays a section.
- Not converting "what you'll feel" into a gallery slide.
- Not making glass its own section.
- Not removing the vestigial `brand-clinical` root class.
- Not diverging the three PDPs. They share one order today and keep sharing one.
- Not changing routes, metadata or URLs.

## Risks

- Deleting sections changes on page H2 hierarchy. Confirm no heading skips and that PDP JSON-LD is unaffected.
- Phase 1 temporarily loses the three outcome bucket subheads until Phase 3 returns them. Reversible, and no ingredient data is lost.
- Phase 1 leaves a gap where absorption was until Phase 2 lands, roughly a day.
- Section view tracking ships in the same phase as the changes, so there is no pre change baseline. Accepted: waiting a fortnight to gather one is worse than shipping.
- The listicle analytics extraction is the only change in this plan that can break something already earning money. Treat its verification as a merge gate.

## References

- `docs/features/LISTICLE_SYSTEM.md` (section tracking precedent, and the positional id flaw being avoided)
- `docs/development/featurePlans/listicle-cta-attribution.md` (SCRUM-1177, the original tracking build)
- `docs/branding/DESIGN_SYSTEM.md` section 8.5 (Simple DTC)
- `docs/PAGE_NARRATIVES.md` (page story map)
- Gray Matter PDP, structural reference: `trygraymatter.com/products/brightmind-1`

## Jira tickets

Sprint 30, epic SCRUM-763 (Website & CRO). Active phases only; Phases 4 and 5 stay in this doc until they are unblocked.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1260 | PDP Phase 1: slim the mobile hero, restore a thin sticky footer, delete duplicate sections, add section tracking | 1 | To Do |
| SCRUM-1261 | PDP Phase 2: three column comparison table (CONKA vs coffee vs Rx stimulants) | 2 | To Do |
| SCRUM-1262 | PDP Phase 3: merge the two ingredient surfaces into one outcome grouped section | 3 | To Do |

SCRUM-1260 blocks both SCRUM-1261 and SCRUM-1262.

SCRUM-1262 relates to **SCRUM-1255** (image led ingredient cards for the FMC renders). That concern is now closed: 1255 merged in PR #445 before Phase 1 branched, so its card design is already the baseline Phase 3 builds on. Nothing to fold or sequence.

Phase 2 was built on `feature/pdp-comparison-table`, branched off main after Phase 1 merged.
