# Home Page Round 2

> **Purpose:** Give the home page a "why" before it sells, and move the three PDP sections that earn their place onto the highest-traffic page. Phased so each phase ships to production on its own.

Scoped 27 Aug 2026. Branch `feature/home-page-upgrades-round2`.

> **Superseded by a structure pass, 27 Aug.** After Phase 2 shipped, home was
> benchmarked against Gray Matter and Magic Mind and reordered: the duplicate
> Jack Willis review deleted, certification badges folded under the showcase
> CTA, the FAQ photo dropped, and three mid-page CTAs added to close a
> seven-section stretch with no route to purchase. Home is now 11 sections plus
> the Brain Fuel band, down from 14. The target order in this doc is history;
> read `app/page.tsx` for the live one, and the PAGE_NARRATIVES home entry
> (SCRUM-1274) once it exists.

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | The why accordion (position 3) | **Done** (SCRUM-1265) |
| 2 | WhatToExpectV2 and ProductComparisonTable drop-ins | **Done** 27 Aug. ProductComparisonTable PR #456; WhatToExpectV2 commit `198bd6d0` (SCRUM-1266). AC5 **closed as accepted, not done**: the comparison table keeps its centred heading on home even though every other home heading is left aligned. Rudh reviewed it on the page and is happy with it, so no `align` prop is needed |
| 3 | Athlete credibility carousel restyle | **Superseded.** Rescoped against the AG1 and IM8 benchmark and moved to its own plan: `athlete-carousel-refactor.md`. Phase 1 shipped 27 Aug |

## Problem

The home page opens with a hero and then goes straight to a product showcase and a benefit-tile grid, neither of which frames a problem. Cold paid traffic gets *what we sell* before it gets *why it exists*, and the page's six proof beats are doing rational work that no emotional setup has earned.

Separately, three arguments the PDPs now make well are either absent from home or presented in a form that undercuts them:

- **What to expect over time** is absent. `WhatToExpectV2` shipped on all three PDPs and answers "when will I feel it", which is the objection that kills a first subscription order.
- **CONKA vs the alternatives** is absent (shipped 27 Aug at position 8, not the 13 planned below: it answers the category objection better straight after the products than as the last beat before the FAQ). `ProductComparisonTable` shipped in PDP Phase 2 and does the positioning work against coffee and prescription stimulants.
- **Athlete credibility** is present but reads, in Rudh's words, "cheap and large". Partly a styling problem, partly that home makes the athlete argument three times (`BrainFuelBand`, `AthleteReviewFeature`, `AthleteSportMarquee` + `AthleteCredibilityCarousel`), so the third instance has to shout.

Reference: the Gray Matter home page (`trygraymatter.com`), whose second section carries four arguments (challenge, solution, mechanism, research) in one numbered accordion.

## Approach

A numbered "why" accordion replaces `ProductBenefitTiles` at position 3. The two PDP components drop in unchanged. The athlete carousel is tightened in place.

**Design language:** Simple DTC (see `docs/branding/DESIGN_SYSTEM.md` section 8.5), borrowing three clinical devices for the accordion only.

## The reference, and what we take from it

The raw Gray Matter markup reads as a two-column `image left / accordion right` layout. **The rendered design is not that.** The desktop screenshot shows:

- A centred serif display headline with a pill-outlined accent word ("PRECISION")
- A small circular fMRI scan tucked into the top-right, overlapping the card corner
- One large soft-shadowed white card holding the accordion
- Numbers in lime circles sitting **outside** the row borders, in their own gutter
- Rows as hairline-bordered rectangles with mono labels and `+` / `-` toggles
- The open row leading with a highlighter-marked lede line, then body copy

Scope the build from the screenshot, not the markup.

### What we take

| Device | Taken | Why |
|--------|-------|-----|
| Numbered circles outside the row | Yes | The thing that makes it read as an argument in sequence rather than an FAQ |
| Hairline row borders | Yes | Cheap, and consistent with `border-black/8` elsewhere on home |
| Highlighted lede line | Yes | Carries the emotional beat before the rational body copy |
| Soft white card with shadow | Yes | Simple DTC explicitly allows shadows and rings |
| Accent word in an outlined pill | Yes | The one piece of headline decoration worth borrowing |
| Centred headline | **No** | Tried and cut. Home is left-aligned by default and the headline looked wrong centred over a card that is itself only 52rem wide |
| Grid-paper background | **No** | Reads as a foreign object between our hero and our showcase |
| Mono body copy | **No** | `.brand-clinical` is reserved for `/science` and the `/app` dark pages |
| Lime accent | **No** | We have no lime. Number circles use a navy tint |

**The accent colour is navy `#1B2757`, not the `#1a7f4f` savings green.** The green is reserved for price savings, and using it decoratively here would muddy that signal.

## Target section order

| # | Section | Change |
|---|---------|--------|
| 1 | Hero (`HomeHeroStatic`) | unchanged |
| 2 | `LandingProductShowcase` | unchanged |
| 3 | **Why accordion (`HomeWhyAccordion`)** | NEW, replaces `ProductBenefitTiles` |
| 4 | `Certifications` | unchanged |
| 5 | `BrainFuelBand` | unchanged |
| 6 | `ProductGrid` | unchanged |
| 7 | **`WhatToExpectV2 productId="both"`** | NEW drop-in |
| 8 | `AthleteReviewFeature` | unchanged |
| 9 | `LabResearch` | unchanged |
| 10 | `UGCMarquee` | unchanged |
| ~~11~~ | ~~`LabGuarantee`~~ | **REMOVED** (see decision 6) |
| 11 | `AppUSPSection` | unchanged |
| 12 | `AthleteSportMarquee` + `AthleteCredibilityCarousel` | RESTYLED |
| 13 | **`ProductComparisonTable product="both"`** | NEW drop-in |
| 14 | `LabFAQ` | unchanged |

Eleven rendered sections becomes thirteen.

## Decisions

Settled during scoping, with the reasoning, so they do not get re-litigated.

### 1. The showcase stays at 2 and the accordion sits at 3

**Reversed once, in build.** The original decision was why-before-what: accordion at 2, showcase down to 3, on the theory that cold paid traffic wants the problem framed before the product reveal.

It shipped that way and was swapped back on 27 Aug 2026 after seeing it rendered. The accordion is a tall block of mostly-closed rows, and sitting it between the hero and the first sight of the product pushed the product too far down the page. At position 3 it reads as the "why" behind a product the visitor has already seen, which is the weaker argument on paper and the better one on the screen.

Recorded rather than quietly rewritten, because the why-before-what case is genuinely arguable and someone will raise it again. The counter-argument is not that it is wrong, it is that this particular section is too tall to carry it.

### 2. `LabResearch` stays, and row 4 stays "Peer reviewed research"

**This is a known, accepted duplication.** The research argument now appears at position 3 (as an accordion teaser) and again at position 9 (as the full `LabResearch` section). The alternatives were folding `LabResearch` into the accordion and cutting the section, or dropping row 4 to three rows. Both were rejected in favour of teaser-then-depth.

Recorded here so a future reader does not "fix" it as an oversight.

### 3. The carousel is restyled in place, on all surfaces

`AthleteCredibilityCarousel` is rendered by `app/page.tsx`, all three PDPs, `app/components/cro/CROAthletes.tsx`, and the listicle system. The restyle propagates to all of them rather than hiding behind a home-only variant prop, so we do not end up maintaining two carousel designs.

This also closes the styling half of **Phase 6 of `pdp-structure-rework.md`**. The other half of that phase, folding `BrainFuelBand`'s four stats into the carousel, is explicitly out of scope here.

### 4. Simple DTC with borrowed devices, not a clinical block

See the reference table above.

### 5. The circular image is the `BothNeuronFloat` poster

No fMRI, EEG or brain-scan still exists in `public/`. The available candidates were `public/videos/both/BothNeuronFloat-poster.jpg` and `public/lander/video/BrainFuel-poster.jpg`. The former is used, circularly cropped. Sourcing a real scan asset from Humphrey was rejected as it blocks Phase 1 on someone else.

### 6. The 100 day guarantee comes off home

Decided 27 Aug 2026, after the initial scope. `LabGuarantee` is removed from the home page.

Folded into Phase 1 rather than raised as its own ticket, because Phase 1 already owns the `app/page.tsx` section ordering and two separate page reorders in one sprint is needless churn.

**It is not orphaned.** `LabGuarantee` still renders on `app/conka-flow/page.tsx`, `app/conka-clarity/page.tsx`, `app/conka-both/page.tsx` and `app/case-studies/page.tsx`. The component file stays and no `docs/TODO.md` entry is needed, which is the opposite of the `ProductBenefitTiles` case.

**The home metadata keeps its guarantee references.** `app/page.tsx` lines 52, 58 and 67 name the 100 day guarantee in the description, OG and Twitter cards. The guarantee is still a real offer, it is simply no longer a home page section, so the claim stays true and the metadata is left alone.

This offsets one of the two sections the round adds, so the page nets to thirteen rather than fourteen.

### 7. Native `<details>`, copied not invented

`app/components/home/AppUSPSection.tsx` lines 62 to 88 already hold the house accordion recipe: native `<details>` with a shared `name` for single-open behaviour, `open={idx === 0}`, `border-t border-black/8 first:border-t-0`, a chevron rotating on `group-open`, and `[&::-webkit-details-marker]:hidden`. `HomeWhyAccordion` copies it. No new accordion primitive, no client-side state.

There is no shared `<Accordion>` primitive in the repo. The other candidates, `product/IngredientDisclosureRows.tsx` and `product/HeroAccordions.tsx`, are both PDP copy-coupled.

## Phase 1: The why accordion

### 1. Copy: the four rows

Title, italic lede, body per row. Rows follow the Gray Matter shape:

| # | Title | Carries |
|---|-------|---------|
| 1 | The Challenge | Problem agitation. Modern attention load, and the stimulant response that makes it worse |
| 2 | The Solution | What CONKA is, in one beat |
| 3 | How CONKA Works | Mechanism, the AM/PM system |
| 4 | Peer Reviewed Research | Research teaser, links deeper |

**The copy is the quality bottleneck, not the component.** Written in brand voice per `docs/branding/BRAND_VOICE.md`.

- Complexity: Small (in code), Medium (in effort)
- Files: new `app/lib/homeWhyContent.ts`

### 2. Build `HomeWhyAccordion`

Server component. Content-only: no `<section>`, no `max-w-*`, no `px-*` at root, no background of its own.

Desktop: centred headline with the pill-outlined accent word, circular image top-right overlapping the card corner, four rows in a soft white card, numbers in navy-tinted circles in their own gutter column, first row open.

**Mobile:** the number moves inline into the row header. A dedicated gutter column costs roughly 44px of a 390px viewport, which the row titles cannot afford. The decorative circle shrinks or drops, and the headline left-aligns to match the rest of home.

- Dependencies: task 1
- Complexity: Medium
- Files: new `app/components/home/HomeWhyAccordion.tsx`

### 3. Reorder and wire

Accordion in at 3 in place of `ProductBenefitTiles`, whose import and render are removed, `LabGuarantee` and its wrapping section removed along with its now-unused import (decision 6).

- Dependencies: task 2
- Complexity: Small
- Files: `app/page.tsx`

### 4. Home section impressions

`home:section_viewed` firing once per section per pageview, carrying one property, `section`, using the semantic `id` already on each section wrapper. Reuses the existing shared provider at `app/components/analytics/sectionImpressions.tsx`, extracted during PDP Phase 1.

Ids are semantic, never positional. `docs/features/LISTICLE_SYSTEM.md` line 42 records why: positional ids shift when a section is inserted, which destroys comparability with earlier data. This plan reorders the page, so positional ids would break the dataset on the first phase.

Ship this in the same phase as the reorder so the change has an after, even though it will not have a before.

- Complexity: Small
- Files: `app/lib/analytics.ts`, `app/page.tsx`

### As built (Phase 1)

Shipped 27 Aug 2026 on `feature/home-page-upgrades-round2`, commit `7a6afae5`. Four things landed differently from, or in addition to, the plan above.

**The section background is tint, which the plan did not specify.** It takes the first background break out of the white hero, and it is what makes the accordion's white card read as a raised surface instead of dissolving into the section. The card device does not survive a white-on-white section, so this is load-bearing rather than decorative.

**The decorative circle sits behind the card, not above it.** The first version gave it `z-10` and a `-top-14 right-0` offset, which put it directly over the first row's chevron. Row one is open by default, so that shipped as a covered control. It now carries no z-raise and the card is `relative`, so the card paints over it and the circle can only peek above the top-right corner. Do not re-raise it.

**`docs/TODO.md` needed correcting, not appending.** Its orphan table asserted `ProductBenefitTiles` was "still rendered by `app/page.tsx`". That was true when written and this phase makes it false. The row is corrected and a real orphan entry added, carrying a warning not to follow the thread into `OUTCOME_BUCKETS`, which still feeds the PDP ingredient badges.

**The `#product-grid` anchor moved onto the section.** It was a wrapper `div` around the section; now one element carries both the hero CTA's scroll anchor and the tracked section id.

**The section was rebuilt after first render.** The initial version read as an underwhelming stack of empty bars. Six causes, all structural rather than decorative: rows were rules inside one card instead of individually bordered boxes; the card spanned the full 1280px track so four short titles sat in empty space; the headline was centred against a full-width card; the numbers were 32px; every row could be closed at once leaving the section blank; and a subline restated what the four titles already said.

The fixes changed the component's nature. It is now a **client component**, because the two behaviours the reference actually depends on cannot be had from a native `<details>`: one row is always open (the button selects rather than toggles, so pressing the open row is a no-op) and the close animates. The expand reuses the `grid-template-rows: 0fr -> 1fr` technique and the `inert` collapse from `IngredientDisclosureRows` rather than inventing a second pattern.

**Desktop and mobile diverge structurally, deliberately.** Desktop has the white card and per-row bordered boxes. Mobile has neither: rows are separated by a rule running the full width across the number gutter, matching the reference. At 390px a card border inside a section inside a row border is three nested containers competing for width the copy needs.

**The lede highlight is a soft `#eef0f5` tint.** A solid navy fill with white text was tried and cut the same day: it read as a UI chip rather than a marker pen and fought the row for attention.

**There is a CTA** ("Try the solution", to `/conka-both`) below the rows, centred against the card. It was first placed inside the row list and aligned to the row titles, which read as off-centre because the number gutter offset it.

**Desktop is two columns: a tall asset, then the accordion.** The asset column widens from 20rem at `lg` to 26rem at `xl`, deliberately taking width off the accordion, whose rows are short and were sitting in too much empty space. It steps rather than jumping straight to 26rem because at exactly 1024px the track is only about 920px.

The asset is `FlowShotSide.jpg`. `BothShotSide.jpg` was used first on the reasoning that a brand-level section should not spotlight one formula, and was overridden by Rudh. Worth knowing if `project_no_single_product_emphasis` comes up: this was a deliberate call, not an oversight.

**The decorative circle is gone.** Three versions were tried: a circular crop overlapping the card's top-right corner (covered the first row's chevron), the same crop pushed behind the card (read as a sticker), and finally the tall asset column. The circle was cutting a busy neuron-and-bottles photo badly at any size.

**The number circles and the lede highlight share `#dbe2f0`.** One step darker than the `#eef0f5` used by the site's tint strips, which was too faint to register against a white card.

**The component is code-split.** It became a client component during the rebuild, so a direct import would have put its JS in the initial bundle for a section that sits below the fold. `dynamic()` with SSR left on: the copy is still server-rendered for crawlers, only hydration defers. `/` still prerenders as static.

### A copy defect fixed on the way past

The app's cognitive test is **two minutes**. Two files said five and were the outliers against six `faqContent.ts` entries, `CaseStudiesHero`, `PilotProgramme` and two listicles:

- `app/components/insights/HowThisIsPossibleModule.tsx`
- `app/lib/whyConkaData.ts`

Both corrected. Row 5 of the accordion states the figure now that it is unambiguous.

### A consequence worth watching

Removing the guarantee leaves **two adjacent white sections**, UGC then App USP. Consistent with the "white is the default canvas, no forced alternation" direction, so it was left alone, but it is a visible result of the removal rather than a considered rhythm choice. If it reads flat, the fix is to tint App USP, with the caveat that App USP drops its mobile bottom padding to sit flush against the tint athletes section below, so tinting it would visually merge the two.

### Found while building, not fixed

**`--tracking-tight` is undefined.** ~~`AppUSPSection`, `LandingProductShowcase`, `LandingDailyBenefits` and `LandingTestimonials` all set `letterSpacing: "var(--tracking-tight)"`, and the token exists in neither `brand-base.css` nor `globals.css`. Those four headlines silently render at normal tracking.~~ **Fixed 2026-08-27:** the four inline overrides were deleted, so each headline now takes the tracking its own heading class sets, and `LandingDailyBenefits` was deleted as an orphan. See `docs/TODO.md`, Design System Debt. `LabResearch` and `HomeWhyAccordion` still use a literal `-0.02em`, which renders identically to the `.brand-h1` token but is still an inline override.

## Phase 2: The two drop-ins

Both components are already built, already shipped on the PDPs, and take a `both` variant. Neither has a PDP-only data dependency.

### 5. `WhatToExpectV2` at position 7

`app/components/home/WhatToExpectV2.tsx`, props `{ productId?: "01" | "02" | "both" }`, passed `"both"`. Data from `app/lib/whatToExpectV2.ts` (`expectV2Milestones.both`, asset `expectV2Asset.both`).

Two things to handle:

- It is a client leaf that dynamically imports GSAP on approach. Home needs a `dynamic()` import with a height placeholder, matching the other dynamic home sections.
- **Its own source comment asserts the PDPs are the only routes it ships on**, which is the justification for its GSAP cost. That comment needs updating and the perf assumption re-checking against `docs/development/PERFORMANCE_OPTIMISATION.md`.

Placed directly after `ProductGrid`: it answers "when will I feel it" immediately after "which one do I buy".

- Complexity: Small
- Files: `app/page.tsx`, `app/components/home/WhatToExpectV2.tsx` (comment only)

### 6. `ProductComparisonTable` at position 13

`app/components/product/ProductComparisonTable.tsx`, props `{ product?: "flow" | "clear" | "both" }`, passed `"both"`. Server component. Its only product coupling is `bottleRendersCutout[product]`.

Its heading is a centred `brand-h1`, which breaks home's left-aligned default. Needs either a prop or a wrapper override.

Mobile: the table already scrolls inside its own `overflow-x: auto` container. Confirm the page body still never scrolls horizontally.

Placed after the carousel and before the FAQ, as the last rational objection-handler before the questions.

- Complexity: Small
- Files: `app/page.tsx`, possibly `ProductComparisonTable.tsx`

## Phase 3: Athlete carousel restyle

### 7. Tighten `AthleteCredibilityCarousel`

`app/components/AthleteCredibilityCarousel.tsx`, 315 lines, client component, props `{ showMarquee?: boolean }`. Holds a local `ATHLETES` array, a `NavButton` sub-component, a feature card with overlaid arrows and an oversized quote, a thumbnail roster that doubles as the picker, and `InformedSportCertification`.

The brief is "cheap and large". Concretely: reduce the vertical footprint, bring the quote scale down, tighten the feature card, and make the roster strip read as a deliberate index rather than a row of thumbnails.

The roster answers "how many" and the feature card answers "what do they say". Those two jobs are already correctly separated and should stay separated.

- Complexity: Medium
- Files: `app/components/AthleteCredibilityCarousel.tsx`

### 8. Verify the four other surfaces

`/conka-flow`, `/conka-clarity`, `/conka-both`, the `/start` CRO surface via `CROAthletes`, and a listicle.

**Rebase before touching this.** SCRUM-1260 is For review and SCRUM-1262 is Ready to deploy, both on the PDPs.

- Dependencies: task 7
- Complexity: Small

## Rabbit holes

- **The copy is the real work.** Four rows of problem-agitation copy in brand voice will take longer than the component does. Circuit breaker: if the copy is not settled by mid-Phase-1, ship the component with placeholder rows behind a Vercel preview and iterate the copy separately.
- **The athlete restyle spans five surfaces.** Circuit breaker: if the in-place restyle starts needing per-surface conditionals, stop and fall back to a `variant` prop used by home only, and reopen the question.
- **The circular image.** Settled as the `BothNeuronFloat` poster specifically to stop this becoming an asset-sourcing task. Do not reopen it mid-build.

## No-gos

- Not touching `BrainFuelBand`, on or off the page. It is rendered by `app/page.tsx`, `app/lander/page.tsx`, `app/(trial-b)/lander-b/page.tsx` and `app/conka-both/page.tsx`.
- Not merging `BrainFuelBand` into the carousel. That is Phase 6 of `pdp-structure-rework.md` and is outside this appetite.
- Not deleting `ProductBenefitTiles`, `LabResearch`, or any component orphaned by this work, in the same commit. `ProductBenefitTiles` gets a `docs/TODO.md` entry instead.
- Not changing `LandingProductShowcase` itself, only its position. The two-equal-cards rule holds (see `project_no_single_product_emphasis`, and the component's own header comment recording the rejected spotlight prototypes).
- Not inventing a new accordion primitive.
- Not adding a grid-paper background or mono body copy to home.
- Not changing routes, metadata or URLs.

## Risks

- **Home will carry two accordions**, at position 3 and position 11 (`AppUSPSection`). Different arguments, same interaction pattern. Accepted, worth watching.
- **The research argument appears twice**, at 3 and at 9. Decision 2 above. Known trade.
- **Eleven sections becomes thirteen.** Mobile scroll depth is the thing to watch, which is what task 4 exists to measure.
- `WhatToExpectV2` **adds GSAP to the home bundle.** Lighthouse check required before merge, against the benchmarks in `docs/development/PERFORMANCE_OPTIMISATION.md`.
- `ProductBenefitTiles` becomes **fully orphaned**. Home is currently its only consumer; PDP Phase 1 removed it from the product pages.
- **No home entry exists in `docs/PAGE_NARRATIVES.md`.** The page has no written arc or health rating. Worth adding as part of this work.

## References

- `docs/branding/DESIGN_SYSTEM.md` section 8.5 (Simple DTC)
- `docs/branding/DESIGN_SYSTEM.md` (the native `<details>` accordion recipe and the running learnings log)
- `docs/features/WHAT_TO_EXPECT.md` (the timeline's build, copy and assets)
- `docs/development/featurePlans/pdp-structure-rework.md` (Phase 2 comparison table, Phase 6 athlete proof beat)
- `docs/features/LISTICLE_SYSTEM.md` line 42 (why section ids are semantic, not positional)
- `docs/branding/BRAND_VOICE.md` (accordion copy)
- `docs/development/PERFORMANCE_OPTIMISATION.md` (the GSAP budget)
- `app/components/home/AppUSPSection.tsx` lines 62 to 88 (the accordion recipe to copy)
- Gray Matter home page, structural reference: `trygraymatter.com`

## Jira tickets

Sprint 30, epic SCRUM-763 (Website & CRO).

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1265 | Home Phase 1: numbered "why" accordion (ticket title says "second section"; it shipped at 3, see decision 1) | 1 | Done |
| SCRUM-1266 | Home Phase 2: what-to-expect timeline and comparison table onto the home page | 2 | To Do (comparison table half shipped) |
| SCRUM-1267 | Tighten the athlete credibility carousel: cut height, lead with the review | 3 | For review. Rewritten, see `athlete-carousel-refactor.md` |

All three sit in Sprint 30 under epic SCRUM-763 (Website & CRO), and are linked to each other with "Relates to".

SCRUM-1266 depends on SCRUM-1265 only for the section-tracking provider. The two drop-ins themselves are independent, so Phase 2 can ship first if a same-day win is wanted.

SCRUM-1267 relates to **SCRUM-1261** (the PDP comparison table) because both touch the same PDP surfaces. The rebase gate noted here is now satisfied: SCRUM-1260 and SCRUM-1262 both merged on 26 Aug.

**Phase 3 has moved.** It was rescoped on 27 Aug against the AG1 and IM8 references and now lives in `athlete-carousel-refactor.md` with its own phases and two subtasks (SCRUM-1273 for the /start fork, SCRUM-1274 for the PAGE_NARRATIVES home entry). The brief below is kept for the reasoning it holds, but three of its decisions were reopened: the roster strip stays (confirmed, not assumed), the arrows stay, and the counter goes. Do not implement from it.
