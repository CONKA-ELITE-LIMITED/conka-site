# Changelog

> High-level record of what changed, when, and why. One entry per meaningful change. For implementation details, see git history or the referenced docs/PRs.

---

## April 2026

### 2026-04-29 -- Case studies: three new Revolut athlete entries (Doris Regazi live, two pending assets)

Added three new business professional entries to `app/lib/caseStudiesData.ts` from the March 2026 Revolut cohort. All three used the Balance Protocol (`productVersion: "both"`, `protocolUsed: "Balance Protocol"`, protocol ID 4).

**New entries:**
- **Doris Regazi** (`doris-regazi`) — Account Executive, Revolut. +30.78% total score (61.33 → 80.21), +22.62% accuracy, +8.23% speed. 17 tests (3 baseline + 14 post). Tier 3.
- **Fred Windsor-Lewis** (`fred-windsor-lewis`) — Account Executive, Revolut. +7.64% total score (72.33 → 77.86), +2.89% accuracy, +4.17% speed. 10 tests (3 baseline + 7 post). Tier 3. Commented out pending photo asset.
- **Alessandro Ventura** (`alessandro-ventura`) — Account Executive, Revolut. +2.33% total score (86.0 → 88.0), +1.14% accuracy, +1.57% speed. 8 tests (3 baseline + 5 post). Tier 3. Commented out pending photo asset.

**Photo wiring (Doris only):**
- `DorisRegazi.jpg` added to `/public/caseStudies/`.
- `"doris-regazi"` entry added to `CASE_STUDY_PHOTO_PATHS`.
- `photo` and `focalPoint: { x: 50, y: 30 }` set on her athlete object (face centred in upper third of the square shot).
- Fred and Alessandro wrapped in a `/* ... */` block comment with an "Uncomment when photo assets are available" note. Uncomment and add their `CASE_STUDY_PHOTO_PATHS` entries once images land in `/public/caseStudies/`.

**Why:** Adds the first non-athlete business cohort case studies from a named employer (Revolut), strengthening the professional-user proof story on the case studies page. Doris's result (+30.78%) is among the strongest in the dataset for a business professional and gives the page a high-impact new card immediately.

---

### 2026-04-28 -- PDP Phase B+C: ingredient images on benefit pillars, ProductWhatYouGet section, scroll-driven WhatToExpect timeline

Three feature additions to `/conka-flow` and `/conka-clarity` as part of the ongoing PDP upgrade pass.

**`FormulaBenefitsPillars` -- ingredient images + PMID references:**
- Each expanded pillar now shows a 3-up ingredient grid below the "felt translation" copy. Images are pulled from `/ingredients/{flow,clear}/` and rendered at `aspect-square` with `object-cover`. Grid uses `bg-[var(--brand-tint)]` tiles with an ingredient name label underneath.
- A `sourceRef` field added to each curated stat surfaces the peer-reviewed citation (PMID or regulatory reference) directly below the stat label in the expanded state. Flow pillars cite PMID 12888775, EFSA Reg. No 432/2012, and PMID 32021735. Clarity pillars cite PMID 29246725, PMID 18937015, and PMID 22628390.
- `formulaStatsData.ts` type extended with `ingredients?: { name: string; imageSrc: string }[]` and `sourceRef?: string`.

**`ProductWhatYouGet` (new component):**
- New section on both PDPs between Ingredients and What to Expect: `id="what-you-get"`, `brand-bg-tint`.
- Editorial split layout: `FigurePlate`-wrapped lifestyle image (formula box open) on the left/top, content card on the right/below.
- Content card: "In every box" em-dash bullet list (28 shots, Informed Sport certified, recyclable packaging) + "How it ships" delivery rows with solid navy savings badges (`bg-[#1B2757]`) and `href="#hero"` links scrolling the user back to the cadence widget.
- Heading: "From the lab to your door." Box images: Flow uses `FlowBoxOpen.jpg`, Clarity uses `ClearBoxOpen.jpg`.
- Exported from `app/components/product/index.ts`.

**`WhatToExpect` -- scroll-driven stage activation (desktop + mobile):**
- Ported the LabTimeline scroll pattern to both `WhatToExpectDesktop.tsx` and `WhatToExpectMobile.tsx`.
- IntersectionObserver gates the scroll listener (300px root margin). rAF-throttled scroll compute reads dot positions relative to the list container. As the viewport centre passes each checkpoint, that stage becomes "active".
- Active and passed stages: full opacity, brand accent dot, accent pill. Future stages: `opacity-50`, dimmed dot (`bg-black/20`), dimmed pill (`bg-black/8 text-black/50`).
- Vertical rail: absolute `w-px` base (full height, `bg-black/10`) and fill (`bg-[var(--brand-accent)]`) driven by `railFillPx` state. Both positioned at `left-[5px]` (half of 10px dot width).
- Formula-change reset: on `selectedFormula` change, a `requestAnimationFrame` callback resets all rail state to zero before the next compute fires.
- `motion-safe:transition-opacity` and `motion-safe:transition-colors` on stage rows, dots, and subheading pills for reduced-motion compliance.
- Vibe asset grid (NeuronsConnection, water, sky images) removed. Each formula now shows a single lifestyle image wrapped in `FigurePlate`. Flow uses `FlowShadow.jpg`, Clarity uses `ClearLaugh.jpg`.

**Why:** Ingredient images give users visual confirmation of what they are taking at the moment they are most curious (post-claim read). The "What You Get" section removes uncertainty about what arrives and how, reducing pre-purchase friction. The scroll-driven timeline makes the progression feel earned rather than decorative -- matching the premium feel of LabTimeline already present on the landing page.

**Branch:** `PDP-what-you-get-and-badge-section`

---

### 2026-04-27 -- PDP upgrade pass: Magic Mind pillar pattern, hero copy rewrite, section reorder, Clarity alignment

Full upgrade of `/conka-flow` and `/conka-clarity` product pages benchmarked against Magic Mind, Seed, and Suri. Work split across three areas: (1) hero copy tightened to the Magic Mind 3-part shape (tagline + promise + mechanism + differentiator), (2) page sections reordered to a conversion-optimised 12-step structure, and (3) a new `FormulaBenefitsPillars` component replaces four legacy benefit components with an expand-on-tap accordion. Changes to `ProductHero`, `ProductHeroMobile`, `StickyPurchaseFooterMobile`, and `FormulaIngredients` applied at the component level so both pages benefit automatically.

**Hero copy:**
- `formulaContent["01"]` (Flow) tagline rewritten from a product-feature fragment to a 4-word brand promise: *Sharper focus. Calmer energy.* Headline rewritten to the Magic Mind 3-sentence shape: promise -> mechanism -> differentiator, grounding caffeine-free and 6-ingredient framing explicitly.
- `formulaContent["02"]` (Clarity) tagline: *Sharper recall. Faster thinking.* Headline: *Cut through brain fog on demand. 10 clinically-dosed actives -- including Alpha GPC, Ginkgo, and Vitamin C -- prime cerebral blood flow and key neurotransmitters. One shot, afternoon, whenever clarity matters.*
- Meta pill removed from `ProductHero` and `ProductHeroMobile` (was rendered above the H1, added noise without informational value). Both desktop and mobile components updated.
- Tagline slot added directly below the H1 with reduced gap (`mt-0 mb-3 lg:mb-4`) and increased size (`text-lg lg:text-xl`), matching the visual rhythm Magic Mind uses between product name and sub-description.

**Hero widget polish (savings + per-shot copy):**
- Savings meta in the CTA button now shows absolute pounds (`Save £X`) rather than a percentage, matching the cadence widget's existing price format.
- "1 shot per day" line removed from the non-expanded cadence card (was duplicated with the expanded panel). Expanded panel retains "Observed: peer-reviewed" sub-copy.
- Thumbnail strip in `ProductImageSlideshow` hidden on mobile via `hideThumbnails` prop -- reduces layout height and keeps the hero tighter on small viewports.

**Section reorder (/conka-flow):**
- Previous structure (10 sections, legacy benefit components) replaced with a 12-section arrangement: Hero > Pillars > Ingredients > What to Expect > Anchor Athlete > Comparison > Guarantee > FAQ > Testimonials > Explore.
- `AthleteCredibilityCarousel`, `LandingValueComparison` (with `/protocol/3` upsell CTA), and `LabGuarantee` surfaced for the first time on the Flow product page.
- `LandingTestimonials` moved to the closing pre-Explore slot (previously near the top).
- `FormulaIngredients` gains `hideCTA` prop so the secondary CTA within that section no longer competes with the primary add-to-cart action.
- `FormulaBenefitsStats`, `FormulaBenefits`, `FormulaBenefitsMobile`, `HowItWorks`, `FormulaCaseStudies`, and `FormulaCaseStudiesMobile` removed from both pages; TODO headers added to each component file to flag decommission.
- JSX comment placeholders added for `FormulaQualityBadges` and `ProductWhatYouGet` (Phase 3, not yet built).

**`FormulaBenefitsPillars` (new component):**
- Client Component at `app/components/product/FormulaBenefitsPillars.tsx`, exported from the product barrel.
- Magic Mind's 3-pillar pattern: each pillar shows a counter + name + one-line benefit at rest; tapping expands to reveal the peer-reviewed stat, its anchor study label, and a "felt translation" written in plain language.
- Accordion driven by `useState` + `aria-expanded` / `aria-controls`. Only one pillar open at a time.
- `CURATED_STATS` in `formulaStatsData.ts` extended with optional `pillarName`, `oneLine`, and `feltTranslation` fields. Flow pillars ordered memory -> fatigue -> sleep. Clarity pillars: cerebral blood flow -> memory -> fatigue resistance.
- Stat anchors: Flow uses +40% memory¶, +32% fatigue resistance¶, +19% sleep quality¶; Clarity uses +57% cerebral blood flow¶, +63% memory¶, +30% fatigue resistance¶.
- Accepted pillar copy option A for Flow (performance framing), and options A/B/A for Clarity (recall / sustained output / blood flow).

**Sticky footer redesign (mobile):**
- `StickyPurchaseFooterMobile` cadence-mode branch rebuilt: full `ConkaCTAButton` instead of a bare price strip, trust strip above ("28-shot box · Informed Sport certified · Cancel anytime"), savings meta passed as the button's `meta` prop (shows absolute £ savings), `backdrop-blur-md` container, `cadenceCompareAtPrice` prop plumbing added.
- Desktop `StickyPurchaseFooter` unchanged (already shows pricing + cadence label clearly).

**`LandingValueComparison`:**
- `ctaHref` and `ctaLabel` optional props added so Flow/Clarity can link to `/protocol/3` ("Try the full system") without forking the component. Default behaviour (no props) unchanged for `/start`.

**`ConkaCTAButton`:**
- Center span gains `flex-1 min-w-0` so the right-arrow SVG anchors at the trailing edge of the button regardless of label length. Previously the arrow floated midway when labels were short.

**/conka-clarity alignment:**
- Page fully rewritten to mirror `/conka-flow/page.tsx` with `formulaId="02"` and `exclude={["clear"]}`. Section order, component set, and comment structure are now identical.
- `getSiteTestimonialsClarity` filter dropped; `LandingTestimonials` now renders the full testimonial set on Clarity, matching Flow.
- Meta Pixel `content_name` kept as `"CONKA Clarity"` (not "CONKA Clear") to preserve production tracking history.
- `cadenceCompareAtPrice` plumbed through to `StickyPurchaseFooterMobile` for savings display.

**/protocol/[id] mobile scroll fix:**
- `brand-page` CSS class added to the mobile branch wrapper of `/protocol/[id]/page.tsx` only. Prevents horizontal scroll caused by `FormulaCaseStudiesMobile`'s 75vw card carousel overflowing the viewport. Desktop branch excluded because `overflow-x: hidden` on `.brand-page` would break `position: sticky` on the protocol hero buying widget.

**Why:** The previous product pages passed a functional review but failed a "quick-to-consume" test on mobile: flat section order buried proof points below the fold, legacy benefit components required reading across multiple stat blocks before a single claim landed, and the hero copy described product features rather than making a promise. Magic Mind outperforms on all three -- their pillar pattern, 4-word tagline, and 3-sentence hero description each communicate one idea instantly. The reorder follows the attention arc (promise > proof > trust > decision) rather than the former spec-sheet structure. Aligning Clarity to Flow also makes both pages maintainable as a pair rather than drifting independently.

**Branch:** `flow-pdp-hero-copy`
**Commits:** `5a2fdfd`, `a0936b4`, `f4fd1eb`, `6f9fe3d`, `2118fd6`, `0fc2c51`, `2ba7d51`, `b58ca88`, `2a044fe`, `3eb695c`, `06f3148`

---

### 2026-04-27 -- Seed/Suri-style image stack on product and protocol hero, mobile layout alignment, shots-per-day label

Upgraded the desktop product and protocol hero image layout to match the editorial pattern used by Seed and Suri: a full-width portrait box shot (cadence-driven) above a 2x2 square grid of lifestyle images. The right-hand purchase widget is now sticky while the image column scrolls, which is the opposite of the previous layout. Mobile heroes were realigned so the image comes first, then the title and stars, matching the existing `ProductHeroMobile` structure throughout.

**Image stack (desktop):**
- New `HeroImageStack` server component: slot 0 renders at natural aspect ratio (no crop), slots 1-4 form a `grid-cols-2` square grid with `object-cover`. No `"use client"` directive needed.
- New `app/lib/heroImageConfig.ts` data layer: all image-path selection (formula/protocol + cadence) centralised here, out of components.
- Flow: box shot + FlowClose, FlowWork, FlowBoxOpen, FlowNutrition. Clear: box shot + ClearPassed, ClearHoldJeans, ClearBoxOpen, ClearNutrition. Balance: box shot + BothHold, FlowBoxOpen, BothJeans, ClearBoxOpen.
- Cadence-driven slot 0: quarterly-sub uses the quarterly box asset, all others use the standard box asset.
- `ProductImageSlideshow` left untouched -- remains the image component for the funnel.

**Mobile:**
- `ProtocolHeroMobile` reordered to image-first (was header-first), matching `ProductHeroMobile`. Stars reduced from 18px to 16px, title from `brand-h1` to `brand-h2`.
- Square mobile box assets added for all six Balance cadence variants (`BothBoxMobile.jpg`, `BothQuarterlyMobile.jpg`, etc.).

**Protocol page (`/protocol/[id]`):**
- Testimonial section updated to use the shared `LandingTestimonials` component (was a protocol-filtered variant).
- Section order updated: Hero > Case Studies > Timeline > Why CONKA Works > Explore > What It Does > Calendar > Testimonials > Guarantee > FAQ.

**Widget copy:**
- Per-shot price label now reads "per shot · 1 shot per day" (Flow/Clear) and "per shot · 2 shots per day" (Balance) in the expanded cadence card, on both desktop and mobile.

**Assets added:** `public/formulas/box/` (12 box shots -- 6 desktop portrait, 6 mobile square), `public/lifestyle/flow/FlowClose.jpg`, `public/lifestyle/flow/FlowWork.jpg`, `public/lifestyle/clear/ClearPassed.jpg`, `public/lifestyle/clear/ClearHoldJeans.jpg`, `public/formulas/both/BothJeans.jpg`.

**Why:** The previous hero used a funnel-style image slideshow on the product PDP, which felt lightweight compared to Seed and Suri's editorial stacked-image treatment. The image stack signals product quality and gives customers more visual context before committing. The sticky widget pattern keeps the purchase action visible as the customer browses the images. The shots-per-day label removes ambiguity on Balance, where two shots daily is a non-obvious usage pattern for new customers.

**Branch:** `seed-style-product-hero`
**Commits:** `be06658`, `ddbec57`, `5213b17`, `a6e9167`, `bf83e59`, `ab4c2be`, `c67dc0b`

### 2026-04-27 -- Product page offering aligned to funnel: cadence model, hero widget upgrade, purchase accordion

Aligned the product pages (Flow, Clear, Balance) to the offering already live on the funnel page. The core change: the old pack-size selector (4/8/12/28 shots) is replaced by a cadence selector (quarterly subscription / monthly subscription / one-time), with a fixed 28-shot box. This brings the product pages into parity with the funnel and eliminates a point of confusion for customers who arrive via ads and then navigate to the product page directly.

**Offering change (cadence model):**
- `ProductHero` and `ProductHeroMobile` now render a 3-option cadence selector (Quarterly Sub, Monthly Sub, One-Time) instead of a pack-size picker. Cadence drives pricing, badge, and feature bullets via `FUNNEL_CADENCES` -- the same data source as the funnel page.
- `ProtocolHero` and `ProtocolHeroMobile` updated identically for the Balance page (protocol 3). Non-Balance protocols are gated behind `isCadenceMode` and unchanged.
- `cadenceData.ts` adapter layer isolates product/protocol pages from `funnelData.ts` internals.

**Sticky purchase footer:**
- `StickyPurchaseFooter` (desktop): cadence mode shows a product thumbnail + cadence label + price strip alongside the CTA. Old pack-size / subscribe toggle preserved with NOTE comments flagging it for future removal once all pages have migrated.
- `StickyPurchaseFooterMobile`: cadence mode collapses to a single full-width "Add to Cart · £X.XX" CTA -- no picker on mobile since cadence selection happens in the hero widget above.

**Hero widget polish:**
- Desktop image/widget split changed to 60:40 (was roughly 44:48) for a more image-led layout on both `ProductHero` and `ProtocolHero`.
- Desktop H1 capped at `2.5rem` (down from `3.5rem` clamp max) and stars reduced from 18px to 14px -- both desktop-only via `lg:` overrides, mobile unchanged.
- `ProductImageSlideshow` keyed on `selectedCadence` so the slide index resets when cadence changes.

**Balance page:**
- H1 conditionally renders "CONKA Flow + Clear" (was "Balance Protocol") on both desktop and mobile heroes.
- Protocol subtitle updated to "Flow in the morning. Clear in the afternoon." Description rewritten to make the morning/afternoon sequencing explicit, with "CONKA Clarity" corrected to "CONKA Clear" throughout.

**Hero accordions (new -- Seed / Magic Mind pattern):**
- New `HeroAccordions` component added below `FunnelAssurance` on all four hero components.
- Three items: "Who it's for" (expand inline, 2 formula-specific bullets per product), "100-Day Risk-Free Trial" (expand inline using `GUARANTEE_DAYS`), and "Ingredients" (opens existing `IngredientsPanel` modal; Balance shows "Flow Ingredients" and "Clear Ingredients" as two separate triggers).

**Why:** Customers arriving from paid Meta ads were landing on a funnel page offering 28-shot cadence options, then navigating to the product page and seeing a pack-size selector with a different set of choices. The two surfaces described the same products with different models, creating friction and eroding trust. Aligning them removes that gap. The accordion section below the CTA matches the pattern used by Magic Mind and Seed -- two of the strongest PDPs in the functional supplement category -- and gives customers ingredient transparency and guarantee detail without leaving the purchase widget.

**Branch:** `product-page-cadence-widget`
**Commits:** `3da47f8`, `cd189b0`, `02e2125`, `0b4328f`, `d63735d`, `62fcda4`

### 2026-04-23 -- Acquisition surface pass: landing hero, value comparison, timeline, product showcase + CTA system

Multi-component tune-up across the `/start` and `/` acquisition flow. Reframed the landing hero's copy + asset, rebuilt `LandingValueComparison` around the 2pm-crash framing, replaced the protocol-style "What it does" section with a Seed-style two-product showcase, rebuilt `LabTimeline` as a scroll-driven progress rail with study-protocol bullets, reshaped the primary CTA, and removed engineering-flavoured detail from the ingredients sheet. Single working branch (`Component-Improvements`); one logical commit per surface.

**`LandingHero`:**
- New eyebrow `// A New State Of Mind` (was `// Daily Brain Performance`). Hero CTA copy `Get Started Today` -> `Try CONKA Today`.
- Aspirational subhead under the H1 with a `†` claim anchor: *"For minds that demand more. A patented nootropic shot, clinically formulated to support focus, memory, and mental endurance every day."* Mirrored on mobile and desktop.
- Mobile asset: dropped the title overlay + bottom-gradient mask; replaced with a clean image plus a short `h-10` white feather at the bottom for a soft hand-off into the page.
- Desktop asset: aspect changed `4/3` -> `3/2` (shorter, less aggressively cropped), single light border added.
- Stat strip collapsed from a separate `dense` desktop variant + 3-col mobile into one responsive 3-col layout with single light border (no more `lab-asset-frame` double-border). Centered cells, value above label, scales up on desktop (`text-2xl` values, `text-[10px]` labels).
- Hero CTA call sites pass `meta={null}` to suppress the `// ...` meta line on the primary action.

**`ConkaCTAButton`:**
- Clip-path now notches the top-left **and** bottom-right corners (was top-right only) for a "cut from a sheet" lab feel.
- Width changed from `w-full lg:w-auto lg:max-w-md` to `min-w-[14rem] max-w-md` -- the button hugs its content at every breakpoint with a sensible floor and ceiling.
- Title span gains `whitespace-nowrap`; inner column drops `flex-1 / min-w-0` so long labels stay on one line instead of wrapping and forcing the button to full width on mobile.
- Tighter mobile gap and padding (`gap-3 lg:gap-4`, `pl-3 pr-5 lg:pl-5 lg:pr-8`) so longer labels comfortably fit within the mobile content column.
- New `onClick` prop renders the button as `<button>` instead of `<a>` / `<Link>` -- needed for modal triggers like the ingredients button.
- New `compact` variant: text + light-up `↗` angle arrow, no O-icon, fills its container, same notched navy shape. Pulled from the `ShopMegaMenu` LEARN_MORE arrow pattern. For in-card / secondary placements where the default treatment would overflow.
- All `/start`-rendered components (`LandingHero`, `LandingWhatItDoes` -> `LandingProductShowcase`, `LandingDailyBenefits`, `LandingValueComparison`, `LandingTestimonials`, `LabTimeline`, `LabGuarantee`, `LabFAQ`, `LabCaseStudies`) now pass `meta={null}` so the `// ...` line is suppressed across the landing experience. `LabGuarantee` drops the now-redundant `sm:w-auto` className override.

**`LandingProductShowcase` (renamed from `LandingWhatItDoes`):**
- New eyebrow `// The Formulation` + H2 *Two shots. Built around your day.* + Seed-style grounded subhead.
- `LabDosingWindows` bar removed; `InfoCard` text tiles inside `LabWhatsInsideMini` removed (the spec rows for ONSET / DURATION / KEY ACTIVES / USE CASE). Section is now just two product cards plus CTA + trust badges.
- Each product card: tag (AM / PM + window), bigger desktop bottle, larger product name, and a one-line tagline (Flow: *Calm morning focus.* / Clear: *Afternoon reset.*).
- Ingredients button swapped from a hand-rolled `<button>` to `<ConkaCTAButton compact onClick={...}>` so the secondary action shares the CTA family while staying in-card.
- Wired into `/`, `/start`, `/protocol/[id]`. `LandingWhatItDoes.tsx` and `LabDosingWindows.tsx` deleted as orphaned.

**`IngredientsPanel`:**
- "Base & carriers" block dropped (carriers / solvents are formulation process detail, not interesting to the average reader).
- Close button now solid navy by default for clearer visibility (was a hairline outline that filled on hover).

**`LabCaseStudies`:**
- Title: *Athletes, Founders, Corporates.* -> *Athletes, Founders, Execs.*
- Stats strip flipped: number now sits **above** the label, content centred, swapped the `lab-asset-frame` double-border for a single light border to match the hero stat strip.

**`LandingValueComparison` reframe (CRO + Sutherland):**
- Eyebrow `// Get More For Less` + H2 *The 2pm crash isn't you.* (loss frame -- reframes the afternoon dip as the product's fault, not the user's). Subhead grounds the chart that follows.
- Dropped the "cost per active" math frame (engineer's metric) and the standalone savings strip (positioned CONKA as a coffee substitute).
- **Fig. 01 - Time in effect chart:** three rows (Coffee, CONKA Flow, CONKA Clear). Coffee = solid-black peak `08-11` + diagonal-hash crash `11-14`. Flow / Clear = solid navy `#1B2757` bands. Bars animate `scaleX(0 -> 1)` from the left when the section enters view, staggered 180ms so the reveal sweeps L->R like a timeline. Header cleaned: eyebrow + bold heading, no top-right time range.
- **Fig. 02 - Monthly saving card:** header mirrors Fig. 01's eyebrow + bold heading pattern; the bold title IS the headline claim (`£X/month less than a daily coffee`). Two clean price-per-day rows (Coffee vs CONKA Both), prices bumped to `text-2xl` / `text-3xl` for prominence. "Actives" mentions removed throughout; savings line promoted from footer strip to section title.

**`LabTimeline` rebuild (scroll-driven progress rail):**
- Three steps (24h / 14d / 30d), each a navy timeframe pill on a vertical rail with a compact card of bulleted outcomes beneath. Pills simplified from `T+24H · 24 hours` to just `24 hours`.
- Card layout: title sits in the header strip (white text on navy when active, black on white when inactive). Body is just the bullet list; footer carries phase identity (`Phase 01 · Focus stabilisation` with the identity in navy). Cards are noticeably shorter than before -- title and 2-cell footer collapsed.
- Bullets switched from em-dash markers to bracketed mono numbers `[01]` `[02]` `[03]` in IBM Plex Mono. Reads as a study-protocol entry rather than a generic dash list; pulls the brand mono voice into the densest part of the card.
- Section sub-header replaces *"What to expect when taking CONKA"* with the proof-scale line *"Based on N=150+ participants · 5,000+ cognitive tests"*. Caption below the cards removed (de-duplicated).
- **Interaction:** single rAF-throttled scroll handler derives both `activeIndex` and rail fill from pill positions; `IntersectionObserver` removed for one source of truth. Rail base + fill bookended by first-pill-centre and last-pill-centre so the line literally starts at badge 1 and ends at badge 3. Fill grows linearly between adjacent pill centres so it always reaches the active checkpoint rather than stalling early. **Cumulative lit state:** every step at or before the active one stays illuminated.
- Rail visible on every viewport (not just desktop), so the metaphor holds on mobile.
- Desktop sidebar image bumped `450px -> 600px` so the cards lose width and the asset carries more weight. Sidebar gains a `Fig. 03` plate per the clinical aesthetic plates rule (replaces the old corner brackets).
- Copy lifted with more aspirational + sensory language while staying grounded in measurable outcomes:
  - 24h title: *Focus without the noise.* / bullets reference duration + the 2pm-dip framing from the same page's value comparison.
  - 14d title: *Your sharpest weeks yet.* / first bullet hooks directly to the CONKA app's measured data ("Cognitive scores trending consistently higher").
  - 30d title: *A measurably sharper baseline.* / first bullet is the consistency claim ("Less variation in your daily cognitive function") -- harder to dispute than peak-performance claims.
  - Outcome labels: `Momentum` -> `Cognitive momentum`; `Baseline reset` -> `Baseline shift` (more accurate; you're not resetting to a default).
- **Compliance:** section H2 gains a `^^` superscript anchoring to the existing `Cognitive test` footnote in `LandingDisclaimer`, since steps 2 and 3 reference cognitive test data. Resolves on `/start` (matches the pattern `LabCaseStudies` uses on the same page).
- **Perf:** component is dynamic-imported at every call site (`/`, `/start`, `/protocol/[id]`) so JS stays off the initial bundle. Observer + scroll listener ride inside the deferred chunk. Bundle growth ~1 KB inside the existing lazy chunk; zero impact on initial paint. All transitions use `motion-safe:*` so `prefers-reduced-motion` disables them; activation still works, just instantly.

**Why:** Acquisition pages were lifted aesthetically in the prior pass but several surfaces still read as engineering-spec rather than consumer-grade. Hero needed a clearer premise + cleaner asset hand-off; CTA was visually heavy with a distracting meta line; product section was over-explaining with spec text instead of letting the bottles carry the showcase; value comparison was leading with arithmetic when the felt argument (coffee crashes by 2pm) was below the fold; timeline was a stack of generic content cards rather than a visualised progression. Each change tightens message hierarchy and trades clever framing for plainly understood claims, while still earning the clinical aesthetic through the `lab-` grammar (mono labels, hairline borders, bracketed counters, navy interactive). Every cognitive-performance claim that touches the CONKA app's measured data is now anchored to the existing `^^` footnote.

**Branch:** `Component-Improvements`
**Commits:** `786ed8c`, `7b93364`, `d33965c`, `d08e6a4`, `b1dd96e`, `06b48e3`, `5570138`, `c45f8ac`, `af005cf`, `cdb24ba`

### 2026-04-22 -- /app hero unified responsive layout + download section phone asset

Iterated the `/app` hero on an experimentation branch. Replaced the split mobile/desktop implementations with a single responsive layout mirroring `OurStoryHero` (stacked on mobile, 60/40 grid on desktop) and swapped the phone-mockup hero for a landscape lifestyle asset. `AppDownloadSection` got the old phone render added on the left as a separate figure frame, and its outer card wrapper was removed so the asset and copy sit as siblings.

**`AppHero` (`app/components/app/AppHero.tsx`):**
- Collapsed the split mobile/desktop trees into one layout: `flex flex-col` on mobile, `lg:grid lg:grid-cols-[3fr_2fr] lg:items-center` on desktop. Same copy and hierarchy render at every breakpoint, so the two views can no longer drift apart.
- New asset: landscape `/app/NothingAppRing.jpg` inside a `lg:aspect-[3/2]` hairline frame on `bg-[#f5f5f5]`. Plates `Fig. 01` top-left, `The Future In Your Hands` bottom-right.
- Copy refresh: eyebrow `Brain Performance Technology`, H1 `The Gold Standard of Cognitive Testing`, mono sub `3-min test · Wellness log · Measurable progress`, body `This isn't an IQ test. It measures how efficiently your brain processes information, tracked over time. Most brands ask you to trust their claims. We hand you the instrument to see CONKA working for yourself.` Meta line under CTAs trimmed to `Free to use`.
- Install buttons: passed `flex-1 justify-center whitespace-nowrap !text-[10px] !tracking-[0.16em] !px-4 !gap-2` via `buttonClassName` + `iconSize={16}` so iOS and Android share a single row, Play Store cannot wrap, and the pair caps at `max-w-md`.
- Dead code removed: `STATS` array, `appHeroFloat` keyframe, `app-hero-mount-left` / `app-hero-mount-right` / `app-hero-float` classes, `order-1`/`order-2` shuffling.

**`AppDownloadSection` (`app/components/app/AppDownloadSection.tsx`):**
- Outer `bg-white border border-black/12 p-6 lg:p-10` card wrapper dropped. Phone asset and copy now live as siblings inside a `lg:grid-cols-[1fr_1fr]` grid.
- Left cell: `/app/AppConkaRing.png` (the old hero phone render) inside a `bg-[#f5f5f5]` hairline frame, `aspect-[4/5]` on mobile, `lg:aspect-[5/6]` on desktop, with a gentle `appDownloadFloat` animation.
- Plates: `Fig. 07` top-left, `App Interface` bottom-right. Other page assets keep their existing figure numbers for now.

**Assets:**
- `public/app/NothingAppRing.jpg` (new) - landscape hero photo.
- `public/app/AppConkaRing.png` (updated).

**Why:** Previous `/app` hero had mobile and desktop diverging on both copy and structure (different headlines, stats on desktop only, full-bleed image on mobile only). Collapsing to a single layout guarantees message parity and removes a whole branch of conditional rendering. The new "not an IQ test" body positions the app around information-processing efficiency and leads with a show-don't-tell stance ("we give you the instrument, not just claims") that differentiates CONKA from supplement marketing in general. `AppDownloadSection` gained visual weight by bringing the phone render back into the conversion surface rather than leaving it as a text-only closing card.
**Branch:** `app-page-experimentation` (exploratory)
**Commit:** `efb32aa`

### 2026-04-21 -- Navigation, footer, /why-conka clinical refactor + brand-base.css reorganisation

Pulled the last three site-wide surfaces -- desktop + mobile navigation, the global footer, and `/why-conka` -- onto the clinical grammar, then reorganised `app/brand-base.css` around the clinical-vs-legacy split so the next session can see at a glance what is the default and what is legacy carry-over.

**Navigation (`NavigationDesktop`, `NavigationMobile`, `ShopMegaMenu`):**
- Desktop header gets `border-b border-black/12` hairline (was ad-hoc shadow). Shop trigger is now a hairline tag with `lab-clip-tr` chamfer that fills navy on hover. Nav links: `font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-black/65 hover:text-[#1B2757]`. Cart badge flipped from amber pill to navy square (`bg-[#1B2757] text-white font-mono text-[9px] tabular-nums`). All SVG icons standardised on `strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"`.
- Mobile menu reorganised into three doc-code columns -- `// Learn more` (Ingredients / Our Story / Why CONKA), `// Science` (Science / Ingredients / Case Studies), `// Technology` (CONKA App). "What's inside Flow & Clear" copy block removed. Product cards flipped vertical (full-width `aspect-[4/3]` image + stacked info), product names normalised (`Both (Flow + Clear)` / `Flow` / `Clear`).
- Shop mega menu left sidebar simplified back to a single "Learn more" section (Why CONKA works / The CONKA App) after a brief experiment with three grouped sections was rejected as redundant with the main nav. Product card CTA replaced hand-rolled "Explore ↗" with `ConkaCTAButton` (per-product meta lines `// the full daily system`, `// morning focus · energy`, `// afternoon clarity · recovery`, width-forced full via `lg:!w-full lg:!max-w-none`). Overlay badges now read just `Flow + Clear` / `Flow` / `Clear`. Product cards restructured so the image is its own `<Link>` and the CTA is a sibling link -- avoided nested anchors.

**Footer (`Footer.tsx`):**
Kept the black background, rebuilt everything else on the clinical grammar. Newsletter block now a 2-col layout: trio header on the left (`// Newsletter · Dispatch-00` + `brand-h3` "Unlock a new state of mind." + mono sub `Tips · Research · Offers · No spam`), square form on the right with `bg-white/5 border border-white/20` input and a `lab-clip-tr` white-to-navy-on-hover Subscribe button (`Subscribe ↗`). Logo + link columns grid now `auto_1fr` split by a hairline `border-white/12`. Each column header is a mono doc-code (`// Discover` / `// Shop` / `// Company` / `// Support`). Links numbered `01`–`NN` mono with hairline `border-white/8` row dividers. Shop column drops the Quiz link (scheduled for removal) and adds "Flow + Clear". New bottom meta row: `© CONKA {year} · Made in UK · All rights reserved` left, `Doc-FT-001 · Informed Sport · Batch tested` right. Submit button resting state black-on-white flips to `hover:bg-[#1B2757] hover:text-white`. Em-dash opener in the old subcopy ("—sign up for newsletters") removed -- canonical dot separator throughout.

**`/why-conka`:**
- Page root wrapped in `brand-clinical`, loading state re-chromed to mono `// loading`.
- Hero split into two-column desktop (image LEFT, content RIGHT) and stacked mobile. Image is the ring lifestyle shot at `/lifestyle/ClearJeansTwo.jpg` inside a hairline `aspect-[4/5]` frame with `Fig. 00` + `Overview` plates, anchoring the page-wide figure sequence (0 → 7).
- Section backgrounds flipped so the hero (white) alternates cleanly through all seven points (tint → white → tint → white → tint → white → tint) and the closing CTA (`/protocol/3` Balance) lands on white. Theme keys in `whyConkaData` inverted accordingly.
- `WhyConkaSection` rewritten: `R-{id}` researcher counter + `Reason {id} / 07` plates, hairline image frame with `Fig. 0X` top-left + `Reason 0X / 07` bottom-right, navy subheading, alternating image-side by parity. `AppInstallButtons` on point 4 swapped to `variant="clinical"`.
- `WhyConkaCTA` rewritten as the canonical clinical closing card (eyebrow + `brand-h2` "Unlock your cognitive potential." + body + mono guarantee line + `ConkaCTAButton` + `LabTrustBadges`) pointing at `/protocol/3`. The separate Quiz CTA was dropped -- quiz is being redirected per `WEBSITE_SIMPLIFICATION_PLAN.md`.
- Em-dashes purged from every headline / subheading / description in `app/lib/whyConkaData.ts` (7 replacements across 5 points) -- middle-dot / colon / period depending on grammar. Reason 6 image swapped from `/story/clinical-trial.jpg` to `/lifestyle/FlowConkaRing.jpg`. Navy `<span>` around "CONKA" in the hero headline removed on both desktop and mobile -- plain black, accent reserved for interactive.

**`/shop` hero mobile alignment (`ShopHeroMobile.tsx`):**
Stripped the root `<section>` wrapper (page owns it now), converted to the trio header pattern: `01 · Shop · 03 formulas` mono eyebrow + `brand-h1` "Clarity and focus you can feel." + mono sub `Start simple · Feel the difference · 100-day guarantee`. Left-aligned, no centred text.

**`app/brand-base.css` reorganisation (no behaviour change, comments + section markers only):**
- Top-of-file legend now names three explicit layers: Layer 1 base tokens + classes, Layer 2 clinical scope + utilities (the default for new work), Layer 3 legacy compat + deprecation candidates.
- Each layer boundary gets a banner comment (`LAYER 1 — BASE TOKENS`, etc.) so the clinical block is visually separated from the pre-clinical block.
- Moved the compatibility tokens (`--brand-surface`, `--brand-stroke`, `--brand-border-color`), product accent pairs (`--brand-flow-accent`, `--brand-clear-accent`), and gradient accent (`--brand-gradient-accent`) into a dedicated Layer 3 `:root` block, each marked `@deprecated` with the migration rationale and the condition for removal.
- Moved the `.brand-card` / `.brand-card-bordered` / `.brand-container` / `.brand-btn` component classes into Layer 3 with a `@deprecated — do not reach for these on new work` header, pointing clinical consumers at the Tailwind utility pattern (`bg-white border border-black/12 p-5 lg:p-6`) from `CLINICAL_AESTHETIC.md`.
- Marked `brand-bg-neutral` and `brand-bg-deep-grey` as legacy alongside the clinical-active backgrounds (`brand-bg-white`, `brand-bg-tint`, `brand-bg-black`).
- The clinical scope block (`.brand-clinical`) now sits in its own clearly labelled Layer 2 section with a list of every page currently using it, the token overrides, the hero-flush media query, and the three unscoped utilities (`.lab-asset-frame`, `.lab-clip-tr`, `@keyframes lab-blink`).

**Why:** Header, footer, and `/why-conka` were the last three surfaces still running pre-clinical styling -- a user entering the site through the nav saw amber cart badges, pill-radius CTAs, and the old blue-accent "Why CONKA?" hero before any clinical section loaded. The CSS reorg is the first time the file has distinguished default-brand tokens from clinical overrides from deprecation candidates; previously the three were interleaved and the TODOs weren't actionable because there was no structure to point at. With the clinical grammar now dominant across every user-facing surface, Layer 3 becomes the explicit hit-list for future cleanup.
**Spec:** `docs/branding/CLINICAL_AESTHETIC.md`
**Branch:** `header-footer-upgrade`

### 2026-04-21 -- /app page + cognitive test section full clinical refactor

Completed the `/app` page migration started under SCRUM-906. The page-level `brand-clinical` wrapper and a couple of neighbouring components had landed, but the four child components (`AppHero`, `AppStickyPhoneBlock`, `AppSubscribersSection`, `AppDownloadSection`) and the entire cognitive-test section were still on the pre-clinical premium surfaces -- dark ink hero with floating-phone animation, gradient neuro-blue sticky scroll block, premium-card-soft surfaces with 40px radii, gradient-ringed benefit circles, pill-radius CTAs. This pass brings all of it onto the clinical grammar.

**/app child components:**
- `AppHero` consolidated from a 3-file split (`AppHeroDesktop`, `AppHeroMobile`, local `types.ts` all deleted) into a single responsive content-only component. Dark ink background replaced with brand white; trio header (mono eyebrow + `brand-h1` + mono sub-line), 3-col hairline stat strip, `Fig. 01 -- Conka app` figure plate on the phone mockup (`bg-[#f5f5f5] border border-black/12` with `aspect-[4/5] lg:aspect-[5/6]`), clinical `AppInstallButtons`. Float + mount animations renamed (`app-hero-float` / `app-hero-mount`) and retained.
- `AppStickyPhoneBlock` desktop rewritten to the clinical sticky-panel pattern: white background, mono `01 / 04 -- eyebrow -- Measurable` counter per section, hairline `StatCard`s with navy `#1B2757` values, grid-distributed bottom tab strip (`grid-template-columns: repeat(N, 1fr)`) so each tab anchors at the start of its progress segment and lines up with the navy scroll fill, plus 5 boundary tick marks that flip grey -> navy as sections are passed. `useScrollTrack`, `SCROLL_MULTIPLIER = 0.85`, `scrollToSection`, and all swipe/nav behaviour preserved unchanged.
- `AppStickyPhoneBlockMobile` rebuilt on the same vocabulary: mono counter, navy progress bar, `ChamferNav` prev/next (navy + `lab-clip-tr`), 2-col tab roster with active `bg-[#1B2757] text-white` tiles, `SWIPE_THRESHOLD_PX=50` retained.
- `AppSubscribersSection` swapped to hairline 3-col rewards spec strip (Token +10 / Tier up 30 / Redeem Free) with `Fig. 06 -- Rewards interface` + `Subscribers only` plates on the mockup.
- `AppDownloadSection` reduced to a minimal hairline closing CTA card -- trio header, clinical install buttons, mono credibility line.
- `AppInstallButtons` gained a `variant?: "gradient" | "clinical"` prop. Clinical renders navy solid (App Store) + hairline `#1B2757` bordered white (Play Store), `font-mono text-[11px] uppercase tracking-[0.2em]`, `lab-clip-tr`, `↗` arrow. Gradient variant preserved for `/why-conka` which hasn't migrated yet.
- `PhoneFrame` (exported shared primitive) reworked so the phone image sits in an explicit inset box (`top-16 right-6 bottom-16 left-32` desktop, `top-10 right-3 bottom-10 left-20` mobile) with `object-contain object-right`. Result: phone is anchored right, "peeking" into frame at a smaller scale, with a dedicated left zone for the Fig plate. Plate bulked up (`top-4 left-4`, `px-3 py-1.5`, `text-[10px]`, `bg-black/65`) so it reads cleanly without crowding the phone.

**Cognitive-test section (all sub-components):**
- `CognitiveTestSection` + `CognitiveTestSectionMobile` re-chrome: trio header (`Test Your Brain -- Cognetivity SDK -- 2-Min Assessment`), hairline `BenefitsSpecStrip` (Validation / Results / Profile with navy tabular values) replacing the gradient neuro-blue circles, testing-state frame wrapped in a top spec bar (`Fig. 07 -- Cognetivity SDK` + live pulse dot) + hairline frame + bottom 3-col spec strip (J / F / Speed + Accuracy). Play-again CTA flipped to hairline-with-navy-fill-on-hover + `lab-clip-tr` + `↻`.
- `CognitiveTestIdleCard` moved to hairline + navy tile brain icon (44x44, stroke 1.75, `strokeLinecap="square"`, `strokeLinejoin="miter"`) + clinical start CTA.
- `EmailCaptureForm` swapped to square-cornered inputs with navy focus ring, custom square checkbox with navy fill, navy submit button + trio header + mono back link.
- `CognitiveTestLoader` replaced progress ring + premium card with hairline card + navy tile (pulse -> checkmark), mono `XXX%` counter, navy hairline progress bar, `01 02 03` stage counter in mono.
- `CognitiveTestScores` swapped from premium-card-soft + gradient score text to hairline card with `Fig. 08 -- Speed of Processing` top bar + 3-col score grid (navy tabular values) + email footer spec line.
- `CognitiveTestRecommendation` converted to hairline card with navy left edge, navy primary + hairline secondary buttons (both `lab-clip-tr`).
- `CognitiveTestAppPromo` restyled as hairline card with dot-bullet feature strip, navy App Store + hairline Google Play buttons.
- `CognicaSDK` iframe wrapper loading state swapped to the navy-tile + mono "Initialising assessment" shimmer pattern so the boot state matches the rest of the section (heavier chrome like the Fig plate and spec bars moved up to `CognitiveTestSection` where it belongs -- the SDK wrapper just serves the iframe now).

**Section rhythm + nav alignment on `/app`:**
- Section ordering held but backgrounds re-flipped: cognitive-test moved to `brand-bg-tint` and case-studies to `brand-bg-white` so we don't get two adjacent white sections after the download CTA.
- The scroll-hijack bottom nav was previously a wrapping flex row, which put tab 3 and tab 4 mid-line on narrow viewports and left no positional relationship with the progress bar. Now a grid with `numSections` equal columns, text-left per cell, so tab N sits at `((N-1) / N) * 100%` which matches the start of segment N on the fill bar.

**Why:** `/app` was advertised as "migrated" but the four child components still ran the dark ink hero + gradient sticky block + gradient benefit circles + pill CTAs, so the page jumped aesthetic mid-scroll -- clinical header, premium body, clinical footer. The cognitive-test sub-components in particular were the heaviest remaining island of premium styling on the site, and they render on both `/app` and (via embedded SDK) as the primary conversion moment on that page. The phone-frame and nav-alignment fixes came out of the first preview: phone was flush to the frame edge which crowded the Fig plate, and the flex-wrap tabs looked arbitrarily spaced against the continuous scroll bar.
**Plan:** `docs/development/featurePlans/clinical-aesthetic-page-alignment.md` (extends the /app treatment under SCRUM-906)
**Commit:** `cfd1fed`
**Branch:** `full-website-realignment`

### 2026-04-21 -- Full-website clinical aesthetic realignment (SCRUM-906)

Extended the clinical aesthetic from `/start` + `/` into the rest of the site -- product PDPs, ingredients, our story, /protocol/3, /case-studies, /science, and /app -- then reshuffled the Balance PDP and added a per-athlete "what they took" card on case studies.

**PDP alignment (Phase 1 -- /conka-flow + /conka-clarity):**
- `FormulaCaseStudies` elevated to the clinical carousel treatment: hero stat row, spec-sheet `AthleteSpecCard`, hairline borders, navy `#1B2757` focus ring, mono eyebrows, `tabular-nums`, em-dash separators. `FormulaFAQ` tightened to the `LabFAQ` pattern (spec header row, `01.`-`NN.` mono numbering, category tags, `[+]`/`[-]` indicators, left-border accent).
- `FormulaBenefits` desktop + mobile moved onto the clinical surface -- double-border `lab-asset-frame` removed from internal panels, benefit stat scales reduced (`4xl`/`5xl` -> `3xl`/`4xl`) so the data doesn't overshadow the copy.
- `FormulaIngredients` rebuilt as a compact accordion card list (replacing the split desktop/mobile layouts). Most Popular badge clipping fixed on the pack selector (moved from `overflow-hidden` parent to an isolated positioning context).
- Dropped leftover `"use client"` directives from static presentational components (stats, HowItWorks).

**Phase 2 -- /protocol/3 (Balance):**
- `ProtocolHero` / `ProtocolHeroMobile` rewritten to the `ProductHero` pattern: packselect grid (`grid grid-cols-3 gap-2`), navy selected state, `ConkaCTAButton` with inverted-ring ConkaO + blinking underscore + 12px polygon chamfer. Removed `rounded-xl` / `rounded-full` / `shadow-md` / `ring-2` / emoji badge.
- Section components swapped wholesale for their clinical equivalents: `LandingWhatItDoes`, `WhyConkaWorks`, `LabTimeline`, `LabGuarantee`, `LabFAQ`, `LandingTestimonials` (with `hideCTA`), `FormulaCaseStudies` / `FormulaCaseStudiesMobile` routed by `productId={selectedProtocolId}` (Balance has its own athlete set).
- `brand-clinical` wrapper on both mobile + desktop root divs.
- Deprecation sweep: deleted `HomeWhatItDoes`, `LandingFAQ`, `LandingGuarantee`, `LandingTimeline` -- all superseded by the Lab* / shared variants consumed above.
- Post-swap reorder: Hero -> Case Studies -> What It Does -> Why CONKA Works -> Timeline -> Testimonials -> Guarantee -> FAQ -> Explore, mobile and desktop now share an identical sequence. Backgrounds alternate W-T-W-T-W-T-W-T-W. `WhyConkaWorks` added to desktop (previously mobile-only) so the rhythm holds on both breakpoints without forking the sequence.

**Phase 5 -- /case-studies:**
- `CaseStudiesPageDesktop` + `CaseStudiesPageMobile` rewritten with the trio header pattern (mono eyebrow + `brand-h1` + mono sub), hairline borders, `tabular-nums`, em-dash + middle-dot separators. Desktop gets a 3-cell stat strip (Athletes / Tests / Avg. lift) in a bordered grid.
- `AthleteSidebar` given clinical filter chips, hairline-bordered athlete tiles with `SportIcon` thumbnails, navy highlight for active/featured.
- `FeaturedAthletesCarousel` polished: hairline cards, mono labels, navy focus ring, `snap-x snap-mandatory scroll-smooth` for tactile swiping -- kept to visual alignment, no nav-arrow additions.
- `AthleteStats.tsx` trimmed to only export `ComparisonChart` (the sole live consumer); hairline bars + navy fill, em-dash baseline-vs-results labels. Deleted `AthleteCard.tsx`, `FeaturedAthletes.tsx`, `AthleteFilterBar.tsx` (all orphaned after the rewrite); pruned barrel in `index.ts`. Net -500 lines.
- `/case-studies` root: `brand-clinical` wrapper, `brand-section brand-hero-first brand-bg-white`, clinical loading state.

**"What they took" per-athlete card (new):**
`WhatTheyTook` replaces the generic "Try CONKA now" footer on the mobile case study and sits inline on desktop below Field Notes. Reads `athlete.productVersion` and resolves to one of three product configs (Flow / Clear / Both) with matching bottles, label, and destination (`/conka-flow` / `/conka-clarity` / `/protocol/3`). Noah Curtis corrected from `productVersion: "02"` to `"both"` + Balance Protocol to match attribution.

**Static content pages (/ingredients, /our-story, /science, /app):**
Each page migrated onto `brand-clinical` with `brand-section` / `brand-track` composition, hairline borders, navy accent, left-aligned trio headers, em-dash separators, and `tabular-nums` on stat blocks. `/app` carried the cognitive test section across to the same treatment.

**Why:** The clinical aesthetic was contained to `/start` and `/` while the rest of the site still ran the pre-clinical `premium-base` surfaces, dark dramatic sections, and pill CTAs -- jumping from a paid-traffic landing page into a PDP felt like two different sites. /protocol/3 in particular was still running the old ProtocolHero + FAQ pair against the already-elevated /conka-flow and /conka-clarity, which made Balance read as an older product. Reordering Balance to lead with Case Studies puts social proof in front of product education -- same promotion that worked on /start. The per-athlete "what they took" card is a lower-friction hand-off than a generic Balance CTA at the bottom of every case study.
**Plan:** `docs/development/featurePlans/clinical-aesthetic-page-alignment.md` (Phases 1, 2, 5 Done; 3-4 Done via /science + /our-story commits; /app + /ingredients extensions beyond original scope)
**Ticket:** SCRUM-906
**Branch:** `full-website-realignment`

### 2026-04-21 -- Home page clinical aesthetic alignment

Pulled the home page onto the clinical aesthetic established on `/start` and `/funnel`, tightened the section order around earlier social proof, and refreshed the reference doc.

**LabWhatsInsideMini 4-col desktop:**
`grid-cols-2 lg:grid-cols-4` with child order `FLOW product - FLOW info - CLEAR product - CLEAR info` so desktop reads as paired product/info bookends and mobile keeps the product-left/info-right pairing on each row.

**Home section reorder + swaps:**
- Section 6 `KeyBenefits` -> `LandingDailyBenefits` (3 pillars variant matching the clinical section rhythm).
- Section 8 `WhatToExpect` -> `LabTimeline` with `ctaHref="/protocol/3"`; sub-copy simplified from `"Protocol window: T+0 to T+30D - N=150+ participants"` to `"What to expect when taking CONKA"`. Added `ctaHref` + `ctaLabel` props so the same component can be retargeted per page.
- New Section 11 `LabGuarantee` above FAQ with `ctaHref="/protocol/3"`; FAQ flipped to `brand-bg-tint` to preserve white/tint alternation.
- `KeyBenefits` and `WhatToExpect` kept in the repo with a `REVIEW:` banner noting they're no longer on the home but may still be reused on PDPs.

**Cleanup surfaced by `/review-code`:**
Removed `console.log` add-to-cart wrappers in `ProductGrid` / `ProductGridMobile` / `ProductGridTablet`, deleted the now-dead `onAddToCart` prop plumbing, removed the unused `getProductBadge` export, and collapsed `ProductCard.handleAddToCart` into a single-path early-return (replaces the previous silent-failure branch). Dropped orphaned imports from `app/page.tsx` (`useState`, `useEffect`, `keyBenefits`, testimonial helpers).

**`docs/branding/CLINICAL_AESTHETIC.md` rewrite:**
Restructured the doc around patterns actually in use: `brand-clinical` token overrides table, utility list (`lab-clip-tr` / `lab-asset-frame` / `lab-blink` / 10px overlay chamfer), standard patterns (trio header, data card, card header row, spec strip, segmented tabs, em-dash bullets, chamfer nav), typography + colour grammar, `ConkaCTAButton` rules, component prop conventions (`hideCTA`/`ctaHref`/`ctaLabel` + content-only structural contract), responsive patterns, trust grid, corner brackets, and an explicit "do not" list.

**Why:** The home page still leaned on the pre-clinical `KeyBenefits` + `WhatToExpect` components, so the jump from hero to the rest of the scroll felt inconsistent with `/start` and `/funnel`. Cleanup came out of the code review and fixes a real silent-failure path in add-to-cart. Doc rewrite was needed so the next session can extend the aesthetic without re-reading source.
**Branch:** `main-page-and-navigation-alingment`

### 2026-04-21 -- Lab-to-brand-base migration complete + landing polish (SCRUM-901)

Promoted the clinical `/startV1` aesthetic into `/start` and shipped a round of landing-page refinements on top.

**SCRUM-901 migration:**
- Added `.brand-clinical` scope to `app/brand-base.css` (zero radii, navy `#1B2757` accent, light tint, mobile hero flush rule) plus `.lab-asset-frame`, `.lab-clip-tr`, and `lab-blink` keyframe as unscoped utilities.
- New `ConkaCTAButton` (navy, chamfer clip, blinking cursor) used on `/start` only. `LandingCTA` kept untouched on `/` and `/protocol/[id]` with a phase-out TODO.
- Content-swapped `LandingHero`, `LandingWhatItDoes`, `LandingValueComparison`, `LandingTestimonials` to the Lab* bodies; relocated 6 Lab* components into `app/components/landing/` and `LabCaseStudies` into `app/components/`. Deleted `app/startV1/` and `app/start/TestimonialsSection.tsx`. `/start` root now carries `brand-clinical`.

**Landing reorder for earlier social proof:**
- Split `LandingWhatItDoes` (formulation) and `LandingDailyBenefits` (3 pillars) into separate sections with `LabCaseStudies` between them. `LandingWhatItDoes` dropped `"use client"` now that the pillar state lives on DailyBenefits. Section backgrounds re-flipped to preserve white/tint alternation.
- Mobile flush fix on DailyBenefits asset (`-mt-20 lg:mt-0`) to match LabTimeline's edge-to-edge banner pattern.

**LabFAQ clinical elevation (6 changes, one pass):**
Spec header row (`Section Q&A / Entries N=5 / Updated 2026-04`) in `lab-asset-frame`, `01.`-`05.` mono numbering, category tags (`TRIAL`/`PRODUCT`/`SHIPPING`/`SUBSCRIPTION`), mono `[+]`/`[-]` indicators replacing the chevron, left-border accent + `Response` mono label on the open answer, `Still stuck? info@conka.io - Avg response 4h` footer. Asset swapped from `ClearDrink.jpg` to `FlowDeskClutter.jpg`.

**Corner-bracket framing system (new aesthetic primitive):**
Two absolute-positioned L-shaped spans (20% of container width/height, 6px thick, 12px inset from the corners) replace full `lab-asset-frame` double-borders on select assets. Applied to:
- LabFAQ lifestyle asset (black, desktop-only)
- LandingDailyBenefits asset (black, desktop-only; lab-asset-frame removed)
- LabTimeline desktop sidebar (white, always-on; lab-asset-frame removed)

Guarantee phone mockup stays frame-free.

**Why:** `/startV1` was the validated landing direction but paid traffic still hit the older `/start` look. Reordering social proof higher addresses the "proof before product education" concern for cold traffic. Corner brackets give assets an angular, logo-adjacent framing without the heaviness of a full double-border - reads more editorial than catalogue.
**Plan:** `docs/development/featurePlans/lab-to-brand-base-migration.md`
**Ticket:** SCRUM-901
**Branch:** `New-Stylng-extraction-landing-page`

### 2026-04-17 -- Fix account profile update (was completely broken)

The Edit Profile modal on `/account` was returning 200 OK but never actually updating anything in Shopify. Two root causes:

**Wrong API:** The `/api/auth/customer/update` route was calling the **Storefront API** via `shopifyFetch`, but the auth token (`shcat_...`) is a **Customer Account API** OAuth token. The Storefront API silently ignored the invalid token. Rewrote the entire route to use the Customer Account API (`https://shopify.com/{shopId}/account/customer/api/2024-10/graphql`) with the token as the `Authorization` header, matching the session and orders routes.

**Auth not sent:** Before the API rewrite, the route also expected a `Bearer` token in the `Authorization` header, but the frontend never sent one (the token lives in cookies). Fixed by reading from the `customer_access_token` cookie.

**Additional fixes found during code review:**
- Address updates were always creating new addresses (duplicates). Now queries for existing default address ID and uses `customerAddressUpdate` when one exists, `customerAddressCreate` only for first-time addresses. Both use `defaultAddress: true` param (the `customerDefaultAddressUpdate` mutation does not exist in the Customer Account API).
- Email field made read-only with explanation. The Customer Account API `customerUpdate` mutation only supports `firstName` and `lastName` -- no email, no phone.
- Phone number moved to `CustomerAddressInput.phoneNumber` on the address mutation (the only place the Customer Account API accepts it).
- Country names mapped to ISO codes (GB, US, CA, AU, IE) via `territoryCode` field. Province uses `zoneCode` (not `provinceCode`). These are Customer Account API field names, which differ from the Storefront API.
- GraphQL-level errors now checked (previously only HTTP status was checked, so schema mismatches returned silent 200s).
- UI refresh fixed: `checkSession()` now called after save instead of `router.refresh()`, which only refreshes server components while customer data lives in client-side `AuthContext`.

**Why:** Customer reported 401 on profile update. Investigation revealed the entire update flow was non-functional since it was built (wrong API, wrong auth method, address duplication, silent email no-op).
**Branch:** `account-update-details-bug`

### 2026-04-16 -- PDP purchase flow overhaul + ProtocolHero alignment

Complete redesign of the purchase flow on Flow, Clear, and Both (Protocol) product pages, inspired by Magic Mind's PDP pattern.

**Hero declutter (ProductHero + ProductHeroMobile):**
Removed 4-stat benefit grid (data lives in FormulaBenefitsStats further down), removed "Your Selection" summary box, removed "How would you like to purchase?" label, removed "No minimum commitment" (redundant with "Cancel anytime"). Meta pill moved below carousel on mobile.

**PackSelectorPremium simplification:**
Stripped to minimal radio-button style. Labels changed to "4 Shots / 8 Shots / 12 Shots / 28 Shots". Removed prices, billing text, tier labels ("Starter"/"Pro"/"Max"), and accent colors. "Most Popular" badge (brand-accent) on 12-pack. Reduced font size and border radius for cleaner look.

**Purchase tile redesign (Magic Mind-inspired):**
Subscribe tile always expanded with bullet list visible. "Save 20% off every order" badge (light brand-accent) next to "Subscribe" title. Delivery description in plain language ("4 shots delivered every week", "28 shots delivered every month"). Checkmark bullets: Free UK shipping, Pause/skip/cancel, 100-day guarantee. Crossed-out one-time price always visible. Buy Once tile shows price + per-shot only. Selected state uses brand-accent ring + banner (matching funnel pattern).

**FormulaBenefitsStats overhaul (Desktop + Mobile):**
Reduced from 6 stats to 3 per formula for EFSA compliance. Flow: sleep quality (+42% ¶), memory (+18% ¶), tiredness/fatigue (†† EFSA). Clear: memory (+63% ¶), fatigue resistance (+30% ¶), cerebral blood flow (+57% ¶). Dropped stress and anxiety stats (RED claims per CLAIMS_COMPLIANCE.md). Stats enlarged to single-column layout (4xl/5xl desktop, 3xl mobile). Shared `CURATED_STATS` and `getDeliveryDescription` extracted to `formulaStatsData.ts`.

**ProtocolHero alignment:**
Rewrote to match ProductHero pattern. Removed ProtocolRatioSelector (protocols being deprecated). Removed "Your Bundle" shot visualization grid. Meta pill states "A 50:50 split of Flow and Clear". Replaced TierSelectorPremium with inline 3-column selector (4/12/28 Shots). Same subscribe/buy-once tiles, brand-accent CTA, LandingTrustBadges.

**Brand-accent unification:**
Replaced all product-specific colors (Flow amber, Clear blue, protocol gradients) with `var(--brand-accent)` across: CTA buttons (solid, no gradient), subscribe tile badges/ring, HowItWorks step numbers, StickyPurchaseFooter (desktop + mobile) toggle and CTA, star ratings (all amber). Removed `FORMULA_COLORS`, `getProductGradient`, `getProtocolAccent`, `getGradientTextColor` imports from all updated components.

**Font update:**
Removed `font-primary` class (Poppins) from ProductHero and ProductHeroMobile H1 elements. `brand-h1-bold` class now correctly applies Neue Haas Grotesk via `var(--font-brand-primary)`.

**Dead code cleanup:**
Removed `usePremium` prop from StickyPurchaseFooter and StickyPurchaseFooterMobile (+ all 6 call sites). Removed unused imports across 8 files. Zero lint warnings.

**Why:** Purchase flow had too much noise (6 stats, summary box, confusing pack labels, collapsing subscribe tile, product-specific color soup). Magic Mind's PDP is the category benchmark. Stats included non-compliant stress/anxiety claims. Brand-accent unification creates visual consistency across all product pages.
**Branch:** `product-page-improvements`

### 2026-04-16 -- Larger nav tiles, lifestyle asset refresh, homepage hero copy, asset cleanup

**Mobile nav product tiles (NavigationMobile):**
Enlarged "Shop by Product" tile images from 56px (`w-14 h-14`) to 112px (`w-28 h-28`) so product photos are clearly visible on mobile. Tile padding kept at `p-3`, gap bumped to `gap-4`, image border radius to `rounded-xl`.

**Homepage hero copy (Hero):**
Synced homepage hero messaging with landing page (`LandingHero`). Headline now reads "The only brain supplement you can measure." with matching body copy.

**FormulaBenefitsStats asset refresh (Desktop + Mobile):**
Replaced generic product bottle images with lifestyle photography. Primary images: Flow uses `ConkaAtWorkDesk.jpg`, Clear uses `BlurGrab.jpg`. Supporting thumbnails (desktop only) now per-formula: Flow shows `FlowBoxOpen.jpg`, `FlowDrink.jpg`, `FlowLeaf.jpg`; Clear shows `ConkaJeansHold.jpg`, `ClearTable.jpg`, `ClearBag.jpg`.

**HowItWorks asset refresh:**
Primary images: Flow uses `FlowDrink.jpg`, Clear uses `ClearBoxOpen.jpg`. Supporting assets: Flow uses `FlowConkaRing.jpg` + `ConkaDesk.jpg`; Clear uses `ClearJeansTwo.jpg` + `ClearDesk.jpg`.

**Asset cleanup (15 files deleted):**
Removed unused assets after audit: `HoldBoth.jpg`, `FlowTaste.jpg`, `ClearTaste.jpg`, `HoneyTaste.jpg`, `CitrusTaste.jpg`, `WomanPink.jpg`, `SatWoman.jpg`, and 8 unused hero images (`Hero.jpg`, `SamHero.jpg`, `ClearHero.jpg`, `HeroBannerH.jpg`, `HeroBannerW.jpg`, `AppShotsHero.jpg`, `HeroBanner.jpg`, `HeroBannerMobileH.jpg`). Only `ShotsHero.jpg` retained in `/hero/`.

**Why:** Nav tile images were too small to see products. Lifestyle photography from TQBF shoot replaces older product renders across PDP sections. Hero copy aligned for consistency. Unused assets removed to reduce repo size.
**Branch:** `larger-nav-shop-tiles`

### 2026-04-16 -- Visual system migration: product, protocol, and content pages

Migrated 5 pages and ~40 components from `premium-base.css` to `brand-base.css`, completing the visual system alignment started with the homepage upgrade on 2026-04-07.

**Phase 1 -- Product pages (conka-flow + conka-clarity):**
Rewrote both page wrappers from `premium-section-luxury`/`premium-track` to `brand-section`/`brand-track` with white/tint alternation. Migrated 15 shared product components: ProductHero, FormulaIngredients, FormulaBenefits (desktop + mobile + stats), BenefitDetail, BenefitList, HowItWorks, FormulaFAQ, FormulaCaseStudies, StickyPurchaseFooter, PackSelectorPremium. Flattened all dark `neuro-blue-dark` section backgrounds to `brand-bg-tint`. Removed `premium-pdp` overflow wrapper. Replaced `neo-button` with `brand-btn` in FormulaIngredients.

**Phase 2 -- Protocol page (Balance, id=3):**
Migrated 13 protocol components: ProtocolHero, CycleTrap, CycleBreak (desktop + mobile), CycleTransformation, ProtocolCalendar, ProtocolFAQ, TierSelectorPremium, WhatToExpectTimeline (+ desktop/mobile sub-components), ProtocolRatioSelector. CycleBreak hover/tap-to-reveal keeps `brand-black` for expanded state (UI feedback pattern, not section background).

**Phase 3 -- Content pages (science + our-story):**
Migrated 8 science components (ScienceHero, ScienceQuote, ScienceAdaptogens, SciencePillars, PillarCard, SynergyChart, ScienceDifferent, EvidenceSummary) and 4 our-story components (OurStoryHero, OurStoryHeroMobile, StorySection, OurStoryCTA). Replaced `neuro-blue-end` accent references with `brand-accent`. EvidenceSummary data card kept dark (`brand-black`) as a data-emphasis surface. OurStoryCTA fully flipped from dark-on-light to light-on-dark. Our-story page flattened from theme-based dark/light alternation to white/tint rhythm.

**CSS prep:**
Added compatibility tokens (`--brand-surface`, `--brand-stroke`, `--brand-border-color`) to `brand-base.css`. Marked `premium-base.css` header as LEGACY with migration TODO. Both CSS files remain loaded globally; no breaking changes for unmigrated pages.

**Why:** Homepage was migrated to `brand-base.css` on 2026-04-07 but all other pages still used `premium-base.css` with dark dramatic sections, different card radii, and no accent colour. This created visual inconsistency across the site. Flattening to white/tint aligns with the Landing Page Visual System and competitive benchmarks (Headstrong, Overload, AG1, Magic Mind).
**Plan:** `docs/development/featurePlans/visual-system-migration.md`
**Branch:** `other-page-aesthetic-migration`

### 2026-04-16 — TQBF lifestyle assets, navigation simplification, ProductGrid reorder, CTA + trust badge pass

Multi-part update integrating new TQBF lifestyle photography and simplifying the site towards the Flow/Clear/Both offering.

**Hero simplification (LandingHero + Hero):**
Social proof pill restyled to brand-accent badge ("150,000+ bottles sold"). Star rating moved to plain text line below hero image. CTA copy changed to "Try CONKA Today". Tightened vertical spacing between avatars and trust badges. 5% top crop on mobile hero image.

**Product image overhaul (productImageConfig):**
Flow, Clear, and Balance navigation/grid images replaced with TQBF lifestyle hold photos (`FlowHold.jpg`, `ClearHold.jpg`, `BothHold.jpg`). Single config change cascaded to 30+ consumers (ProductGrid, Navigation, subscriptions, account pages, B2B portal).

**Navigation mega-menu simplification:**
Replaced tabbed sidebar (Shop by Bundle / Shop Individual Formula / Help me Choose quiz) with simplified two-column layout: left sidebar has "Shop by Product" label + "Learn More" links (Ingredients, Why CONKA, CONKA App), right side shows 3 product cards (Both, Flow, Clear) with lifestyle images. Mobile menu updated with product cards, learn more section, and full nav links. Removed `HoveredSection` state, deleted `ShopMegaMenuContent.tsx`. Quiz link removed from desktop nav.

**ProductGrid reorder + brand-accent buttons:**
Reordered all three breakpoint variants (Desktop/Tablet/Mobile) to show Both first, then Flow, then Clear. Badge colours replaced from product-specific gradients to `var(--brand-accent)`. Badge labels updated to "Most Popular" / "Morning" / "Afternoon". CTA buttons simplified from product-specific gradients to brand-accent blue. Protocol renamed to "Both (Flow + Clear)" throughout ProductCard with updated copy removing protocol language.

**Lifestyle images in WhatItDoes sections (Landing + Home):**
Added `CreationOfConka.jpg` lifestyle image with desktop split layout (sticky image left, title + pillar cards right; stacked on mobile). Added CTA buttons between bottle visuals and lifestyle image ("Get Both from £X/shot" on landing, "Try CONKA Today" on homepage). LandingTrustBadges placed under each CTA.

**LandingTrustBadges added under CTAs:**
Trust badges (Free UK Shipping, Informed Sport, Every Batch Tested, Cancel Anytime) added beneath CTAs in `CaseStudiesDataDriven` and `LandingValueComparison`.

**Other asset updates:**
LandingTimeline desktop sidebar image swapped to `ConkaAtWorkDesk.jpg`. WhatToExpect (Desktop/Mobile) lifestyle images replaced with `FlowBoxOpen.jpg` (Flow) and `ClearLaugh.jpg` (Clear). Protocol 3 PDP hero image aligned with funnel (`BothBox.jpg`).

**Why:** TQBF lifestyle shoot provided premium photography to replace colour-based product renders. Navigation and ProductGrid simplified ahead of full protocol deprecation. Trust badges and CTAs distributed across more sections to reduce friction.
**Branch:** `lifestyle-asset-intergration`

### 2026-04-14 -- Homepage Phase 3: landing parity + Balance-only ProductGrid (SCRUM-885/886/887/888)
Four-part homepage upgrade that brings the organic entry point into parity with `/start` and locks the product offering to Balance ahead of the protocol deprecation.

**Section composition + reordering (3.1 + 3.2):**

- **`LandingHero` reused on homepage.** Homepage no longer runs a bespoke hero — `LandingHero` now backs both pages via optional `ctaHref` / `ctaLabel` props (defaults preserve `/start` funnel behaviour). Homepage passes a Balance-routed CTA. `Hero` / `HeroDesktop` / `HeroMobile` / `HeroBannerCarousel` flagged as orphaned for a follow-up cleanup pass.
- **CTA copy unified.** Both heroes now read `Get Both from £{PRICE_PER_SHOT_BOTH}/shot →`. Homepage hero keeps the `/protocol/3` destination per the homepage-for-organic-traffic divergence; `/start` keeps the funnel destination.
- **`LandingWhatItDoes` added as homepage section 2.** Replaces the previous "what CONKA does" slot with the same component `/start` uses. Homepage hides the trailing CTA + trust badges (ProductGrid below is the chooser).
- **Athlete carousel renamed + repositioned.** Heading "Why Athletes Trust CONKA" → "Why High Performers Trust CONKA". Case Studies moved above Testimonials, with white/tint alternation re-cascaded so adjacent backgrounds never collide.

**ProductGrid Balance-only + protocol PDP selector removed (3.3):**

- **Protocol variant selector gone from `ProductGrid` (Desktop / Tablet / Mobile) and from the protocol PDP hero.** All three grid variants render Balance imagery unconditionally; `protocolVariant` state and flow-heavy/clear-heavy plumbing removed. `/protocol/1` and `/protocol/2` URLs still route (no deep-link breakage) — just no UI to switch between them.
- **ProductGrid card normalisation.** `FunnelAssurance` swapped for `LandingTrustBadges` across Desktop/Tablet/Mobile. Cards now stretch to cell height (`items-stretch` + `flex-1`), Protocol card got clinical stats (Memory / Stress / Sleep) so every card has the same sections, Best-For rendering unified to the bulleted list across all three products (Protocol's paragraph variant + `BALANCE_PROTOCOL_BEST_FOR` dead-code deleted), and `min-h` reservations on the benefit headline + body copy so shorter copy no longer creates empty whitespace between content and pricing.
- **Cart / pricing / B2B tier logic untouched.**

**Component-level style alignment (3.4):**

- Mechanical token + spacing migration across the remaining homepage-only components (`KeyBenefits` Desktop + Mobile, `WhyConkaWorks`, `WhatToExpect` Desktop + Mobile, `FoundersSection`, home `LandingFAQ`) to match `/start` patterns — left-aligned headings, `text-black/60` subtitles, accent CTAs, `brand-radius-card` radii. No content rewrites, no structural changes.

**Explicit no-gos held:** Navigation (including the Shop mega-menu) and Footer untouched. Quiz untouched. No protocol content / metafield / pricing changes beyond the variant-picker removal. No `/start` page-level code changes (only backwards-compatible prop additions to shared components).

**Why:** The homepage was drifting behind `/start` on both hero pattern and product-education framing, and the homepage ProductGrid was still offering flow-heavy/clear-heavy variants that will never ship. Reusing the landing components via props avoids a fork, and locking ProductGrid to Balance prepares for Phase 4 (full protocol deprecation).
**Plan:** `docs/development/featurePlans/homepage-upgrade.md` (Phase 3)
**Tickets:** SCRUM-885, SCRUM-886, SCRUM-887, SCRUM-888
**Branch:** `home-page-alingment-and-performance-improvement`

### 2026-04-14 -- Landing page Phase E + iteration: merged WhatItDoes, 100-day guarantee, branded timeline, ProductSplit dropped (SCRUM-877)
Three structural fixes shipped as one PR, plus a heavy iteration pass after the first cut.

**Phase E core (SCRUM-877):**

- **Merged `LandingWhatItDoes` + `LandingWhatsInside`.** The two sections covered the same 3 functional pillars twice — once as generic benefits, once as ingredient evidence. Merged into one component: each tile now carries the WhatItDoes heading + body and slots WhatsInside's ingredient pills + tap-to-reveal study observation + PMID beneath it. `LandingWhatsInside.tsx` and `IngredientAccordion.tsx` deleted (consumed only by the deleted WhatsInside). All `††` EFSA anchors and `¶` observational phrasing ported across without regression. Component became a Client Component for the per-tile expand state. After iteration, ingredient pills moved into the reveal panel (default-collapsed) so collapsed cards show only icon + heading + body + trigger — much lower cognitive load.
- **Resurrected `LandingGuarantee` as a dedicated 100-day section.** Previously dead code. Now wired between Timeline and FAQ with Magic Mind copy adapted to CONKA voice: title "100-Day Risk Free Trial", four-bullet refund mechanic (Free UK shipping, Money back guarantee, No return required, Nothing to lose), CTA "Try it 100% Risk Free Now". `GUARANTEE_DAYS` constant templated throughout (no hardcoded "100"). Phone mockup retained as visual proof — the cognitive score is the receipt that the guarantee is meaningful. Mounted via `next/dynamic`.
- **Branded timeline header asset.** `LandingTimeline` text title swapped for `/story/YourBrainOptimised.jpg` (1125x2250 portrait). Mobile renders full-bleed, edge-to-edge — negative margin + `calc()` width cancels the brand-section mobile gutter, `-mt-20` on the component root cancels the section's mobile padding-top so the asset sits flush with the section start, `aspect-[1/1.9]` trims ~5% off the bottom whitespace. Tablet (md+) keeps a contained 16:6 cropped banner with rounded corners. Desktop (lg+) hides the banner entirely and shows the original "Your Brain, Optimised." h2 + subtitle text with SatWoman.jpg lifestyle image as the right-side sticky sidebar (sr-only h2 on mobile/tablet so the asset image doesn't double up the heading).
- **`AmPmConnector` shared component.** Morning ↔ Afternoon connector strip extracted from inline `LandingProductSplit` markup into a reusable component. Used in both `LandingProductSplit` and the merged `LandingWhatItDoes` (above the bottle tiles).
- **`WhatsInsideProductMini` polish.** Bottle tile backgrounds flipped to white (was `bg-black/[0.02]`). Bottle image rendering aligned with `LandingProductSplit` — same `w-20 h-44 lg:w-32 lg:h-64` container + `scale-150` (was `scale-200` on a smaller container which upsampled visibly). Time badges made explicit ("Take in the morning" / "Take in the afternoon" instead of bare "Morning"/"Afternoon"). Ingredient-list line ("Lemon Balm · Ashwagandha · +4 more...") replaced with benefit-led summary sentences ("Calm focus without caffeine." / "Afternoon clarity ritual.") — observational phrasing, no new claim surface.

**Section composition iteration (heavier than originally scoped):**

- **Removed `LandingProductSplit` from `/start`.** Component file kept on disk in case it returns. Section count drops 10 → 9.
- **Reorder.** `vs Coffee` ↔ `ProductSplit` swap (before ProductSplit was dropped). After ProductSplit removal: `Testimonials` moved up into its slot. Then `Testimonials` ↔ `Guarantee` swapped, putting the guarantee earlier in the page where risk reversal can do more work. Cascade-flipped backgrounds for sections 7-9 so white/tint alternation holds end-to-end with no adjacent same-bg breaks.
- **Final flow (9 sections):** Hero (white) → WhatItDoes merged (tint) → Case Studies (white) → vs Coffee (tint) → 100-Day Guarantee (white) → Timeline (tint) → Testimonials (white) → FAQ (tint) → Disclaimer (white).
- **Landing testimonial headlines overridden.** Loox-imported headlines are the customer's own opening sentence, often long, repetitive, or mid-thought. On the landing carousel, overridden via a name-keyed map in `TestimonialsSection.tsx` to short, varied summary titles ("Sharper training, no crash", "Words just flow", "An edge on the pitch", etc.). Body copy unchanged. Source data untouched.

**Why:** Two of the original 10 sections were duplicative (WhatItDoes/WhatsInside) and the 100-day guarantee — a category-leading differentiator — was buried in trust badges and footnotes. Magic Mind landing page was the reference. Iterative tightening through the build dropped ProductSplit, reordered around the guarantee, and gave the timeline a branded full-bleed header.
**Plan:** `docs/development/featurePlans/landing-and-funnel-page.md` (Phase E, marked Done)
**Claims log:** entries 55-64
**Ticket:** SCRUM-877
**Branch:** `feature/landing-merge-whatItDoes-guarantee`

### 2026-04-13 -- Landing page Phase D: product education polish + Ingredients modal
Three connected pieces on `/start` shipped as one Phase D.

**Product education polish (LandingWhatItDoes):** Section title from "What CONKA does." to "Daily habit. Lifelong benefits." (Magic Mind habit framing per Johnny). Tile descriptions tightened to one scannable sentence each, hedging ("help", "not just") dropped. EFSA Vitamin C `††` anchor retained on Brain Health tile.

**Ingredients modal (new):** Native per-product `IngredientsPanel` launched from outlined "Ingredients" buttons on both `LandingProductSplit` and `LandingWhatsInside` ProductMini tiles. New `app/lib/supplementFacts.ts` data module sourced from `FORMULATION_SPEC.md`. Explicit mg amounts deliberately NOT shipped to the client -- ingredient order (descending concentration, per supplement-facts convention) communicates relative quantity without exposing the formula. Only %NRV retained on Clear's Vit C (3,125%) and B12 (60,000%) to substantiate EFSA claims. Modal uses single-column layout (nutritional disclosure, not a benefits document) with focus management, ESC/backdrop close, body-scroll lock, `role="dialog"` + `aria-modal`. `landing:ingredients_viewed` Vercel Analytics event fires with `source: "product_split" | "whats_inside"` for attribution. Shared `IngredientsButton` extracted to avoid markup duplication.

**Bottle image deblur (LandingProductSplit):** Source PNGs are 1000 x 1000 8-bit colormap with transparent padding around the bottle, so large-render upscaling caused visible banding. Reverted to small container + `scale-150` matching the crisp approach used in `WhatToExpectMobile` / `FormulaToggle` / `ProductMini`. Follow-up: re-export source PNGs to 24-bit full-colour tight-crop as a separate asset task.

**Tile height normalisation (LandingWhatsInside):** `mt-auto` on `IngredientsButton` pins it to the bottom of each ProductMini flex column so Flow and Clear CTAs align horizontally regardless of ingredient-preview text wrap.

**CaseStudiesDataDriven metric labels:** Tile label changed from generic "Change in test score" to metric-specific descriptions of what the Cognetivity CognICA test measures -- "Cognitive function" (Total Score), "Cognitive speed" (Speed), "Cognitive accuracy" (Accuracy). Total Score as a proxy for cognitive function is peer-reviewed (Modarres et al., Front Aging Neurosci 2023, doi:10.3389/fnagi.2023.1243316) and the device is FDA-cleared as a cognitive assessment (21 CFR 882.1470). `^^` test-validation anchor and global disclaimer footer remain.

**Why:** Cold traffic landing on `/start` needed a native path to ingredient transparency without leaving the page, and the competitive IP around formulation concentrations needed protecting. CognICA labels replace a meaningless generic label with the metric the published research actually supports.
**Plan:** `docs/development/featurePlans/landing-and-funnel-page.md` (Phase D)
**Claims log:** entries 44-53
**Branch:** `next-stage-improvements`

### 2026-04-10 -- Landing page: What to Expect timeline + product education (SCRUM-870, SCRUM-871)
Two new sections and one major redesign on `/start`, all driven by Johnny's feedback and Magic Mind as reference.

**What to Expect timeline (SCRUM-870):** Redesigned `LandingTimeline` from vertical-line-and-dots to card-style layout (Day 1, 14 Days, 30 Days). Copy rewritten to feeling-first tone. Desktop shows lifestyle image (SatWoman.jpg) on right. Proof point ("5,000+ cognitive tests across 150+ participants") + CTA + trust badges beneath.

**What CONKA Does (SCRUM-871):** New 3-tile section at position 2 (after Hero, before proof). Mental Performance / Sustained Energy / Brain Health. Cards with icons, brand-h1 headings, 2-sentence descriptions. Claims-compliant (EFSA Vitamin C `††` anchor).

**What's Inside (SCRUM-871):** Replaced `LandingBenefits` with `LandingWhatsInside`. 3 functional ingredient groups (Focus & Clarity, Energy & Resilience, Protection & Recovery) with tap-to-reveal studies per group. Ingredient pills with bold names and dosages. Mini product split (Flow + Clear bottles) on mobile and desktop. Old `LandingBenefits.tsx` deleted.

**Cross-cutting:** All section titles bumped from `brand-h2` to `brand-h1`. Trust badges extracted to shared `LandingTrustBadges` component. Page reordered: product education before case studies. Background alternation maintained across 10 sections.
**Why:** Johnny flagged product education as the biggest gap for cold traffic. "They need to understand what CONKA is before seeing proof."
**Tickets:** SCRUM-870, SCRUM-871
**Plan:** `docs/development/featurePlans/landing-and-funnel-page.md` (Phase A.7-A.9, Phase B)
**Branch:** `what-you-will-feel`, `SCRUM-871`

### 2026-04-09 — Case study showcase update (IP-safe list)
Replaced showcased case study athletes to remove those with team logo IP issues. New highlight list: Jack Willis, Nimisha Kurup, Max Lahiff, Josh Stanton, Ben Cox, Aaron Hope, Shane Corstorphine, Liz Glover (Millie Hammond ready but held back). Added data entries and photos for Ben Cox (Revolut) and Liz Glover (Retired Banker). Updated `featured` flags so `/case-studies` page (desktop carousel + mobile sort) aligns with homepage teaser. Deleted 3 unused legacy components (`CaseStudies.tsx`, `CaseStudiesDesktop.tsx`, `CaseStudiesMobile.tsx`).
**Why:** Several original featured athletes had team logos visible in photos, creating IP risk. Also rebalanced the list to better represent business/corporate users alongside athletes.
**Branch:** `updating-showcased-case-study-data`

### 2026-04-08 — /start performance optimisation (65 → 71, ongoing)
Four rounds of performance work on the ad landing page.

**Round 1 (65 → 69):** Moved page composition from a single `"use client"` wrapper (`StartPageClient`) to a server component so HTML is pre-rendered — eliminated ~2.3s LCP element render delay. Dynamic-imported 5 below-fold sections (ProductSplit, ValueComparison, Benefits, FAQ, CaseStudies) to reduce initial JS bundle. Removed `will-change` and 0ms `reveal-cleanup` animations that caused non-composited animation warnings. Added explicit width/height to footer logo. Removed unused Shopify preconnect hints (cart API is server-side proxied).

**Round 2 (logo + script deferral):** Replaced nav logo `conka.svg` (593KB — embedded raster PNG in an SVG wrapper) with a generated `conka-logo.webp` (7.5KB, 440×112 2x retina), saving 585KB on every page load site-wide. Switched footer logo from `conka.png` (48KB) to the same WebP. Tightened hero image `sizes` attribute. Attempted deferring CookieYes/Klaviyo to `lazyOnload` — insufficient, CookieYes banner still claimed LCP.

**Round 3 (CookieYes LCP fix → 71):** Research showed LCP updates until first user interaction and Lighthouse lab tests have no interaction, so script deferral alone can't prevent CookieYes from claiming LCP. Fixed with two-layer approach: (1) interaction-triggered script loading — CookieYes only loads on scroll/click/touch/keypress with 7s failsafe timeout, (2) CSS `translateY(100%)` on `.cky-consent-container` so banner renders off-screen initially (off-screen elements excluded from LCP by spec), then slides in. Also switched CookieYes dashboard from full-width Banner to Box layout (top-left) to reduce rendered area. Result: LCP element correctly became the hero image. FCP dropped from 3.1s to 1.2s, SI from 6.1s to 4.1s.

**Round 4 (hero + Klaviyo revert):** Added explicit `fetchPriority="high"` to hero image — Lighthouse flagged it as missing despite Next.js `priority` prop (not output in SSR for client components). Reverted Klaviyo from `lazyOnload` back to `afterInteractive` — the change caused 170KB of Klaviyo chunks to load within the desktop measurement window, dropping desktop score from 90 to 80. Klaviyo was `afterInteractive` in the original baseline so reverting doesn't affect mobile gains.

**Why:** `/start` is the primary paid traffic landing page (74% mobile). Score started at 65; currently 71 mobile. Key remaining bottleneck is LCP element render delay (1,120ms) caused by render-blocking CSS.
**Note:** GDPR compliance gap discovered — no consent gating exists for GTM, Meta Pixel, Klaviyo, or Triple Pixel despite cookie policy claiming otherwise. Separate issue from performance.
**Branches:** `second-optimisatio-round`, `third-round-optimisation`, `please-please-please`, `fetch-quick-hero-image`

### 2026-04-08 — Funnel P2: product selection, plan page, upsell, and Evening-to-Afternoon audit
Funnel product selection (Step 1): removed feature-bashing caption, header to "Your CONKA plan", product descriptions rewritten to outcome-focused copy, dynamic CTA showing product name + per-shot price with sub-label. Funnel plan page (Step 2): header to "Your delivery plan", mobile hero removed, per-product accent colors on cadence cards (blue/amber/teal), price anchors switched to £3.75/shot trial pack reference with savings %, dynamic CTA per cadence. Upsell bottom sheet (renamed from UpsellModal): per-shot hero block showing price drop, new copy and benefit bullets, social nudge line, backdrop dismiss separated from decline-to-checkout. Global terminology audit: replaced "Evening" with "Afternoon" for CONKA Clear across 10 files (testimonials untouched).
**Why:** P2 priority work before scaling paid spend. Sharper copy, dynamic pricing CTAs, and per-product visual identity reduce decision fatigue in the funnel. "Afternoon" aligns with updated product positioning.
**Tickets:** SCRUM-862, SCRUM-863, SCRUM-864
**Plan:** `docs/development/featurePlans/landing-page-upgrades.md` (Phases 3-5)
**Branch:** `landing-page-upgrades`

### 2026-04-07 — Homepage performance + brand-base migration
Simplified homepage hero from 4-image carousel to single product image (matching `/start` LandingHero pattern). Removed rotating headline words, desktop/mobile split, and carousel JS. Added `loading="lazy"` to all below-fold images across 7 components (~25 images). Converted raw `<img>` tags to `next/image` in LandingFAQ and KeyBenefitsDesktop. Then migrated all 10 homepage sections from `premium-base.css` to `brand-base.css`: replaced section wrappers, applied white/tint alternating backgrounds, updated all component tokens (74 replacements across 11 files), moved WhyConkaWorks from dark to light background, left-aligned all headers, updated radius values (32/24/16px), and applied accent-only CTA buttons.
**Why:** Homepage was visually inconsistent with `/start` landing page (different design system, dark sections, centred headers, pill buttons). Carousel added JS weight and 3 unnecessary image requests. Homepage is the primary organic entry point and needed to match the brand standard.
**Tickets:** SCRUM-855, SCRUM-856
**Plan:** `docs/development/featurePlans/homepage-upgrade.md`
**Migration tracker:** `docs/development/WEBSITE_STYLING_MIGRATION.md`

### 2026-04-07 — /start mobile performance optimization
Lighthouse mobile score was 63/100 with 9.2s LCP. Added AVIF/WebP image formats and cache config to `next.config.ts`. Lazy-loaded below-fold images (FlowHold 658KB, ClearDrink, AppConkaRing). Trimmed legacy Google Font weights (Syne, DM Sans, Caveat, IBM Plex Mono) to only weights actually used. Deferred Triple Pixel from `afterInteractive` to `lazyOnload`. Added preconnect hints for GA and Meta domains. Replaced inline hero animation styles with CSS classes. Updated `/implement` and `/review` skills with performance-conscious defaults.
**Why:** Performance is the highest-leverage CRO fix for the primary paid traffic landing page (74% mobile). Prerequisite for Phase 1 benefits redesign (SCRUM-850).
**Ticket:** SCRUM-852
**Plan:** `docs/development/featurePlans/landing-benefits-redesign.md` (Phase 0)

### 2026-04-02 — Landing page visual system
Replaced the heavy black/neutral section backgrounds with a single subtle tint (`#f4f5f8`). CTA buttons now use brand accent (`#4058bb`). Established 4-tier text colour system (100/80/60/40%), consistent heading spacing (`mb-10`), and killed all inline style opacity. Product split cards now show individual bottle images instead of shared AM/PM lifestyle shot. Footnote anchors styled as muted superscript.
**Why:** Competitive analysis (Headstrong, Overload, AG1, Magic Mind) showed the page was too heavy. Evidence-based approach documented in `docs/branding/LANDING_PAGE_VISUAL_SYSTEM.md`.
**PR:** #150

### 2026-04-01 — Testimonial section on homepage
Testimonial heading/subtitle now inherit text colour from the parent section background.
**PR:** #149

### 2026-04-01 — Funnel CRO optimisation (3 phases)
Reordered funnel to Product > Cadence > Checkout. Reworked upsell logic. Hardened copy across landing and funnel pages. Migrated landing + funnel from `premium-base.css` to `brand-base.css`. Fixed compliance, alt text, and anchor consistency.
**Why:** Conversion rate optimisation following initial funnel build.
**PR:** #148

### 2026-04-01 — Cookie consent banner
Added CookieYes consent banner for GDPR compliance.
**PR:** #146

### 2026-04-01 — Legal pages
Created terms, privacy policy, and cookies pages. Updated contact email to info@conka.io.
**Why:** Legal requirement before running paid traffic.
**PR:** #145

### 2026-04-01 — Landing page code quality
Review-driven cleanup: guarantee mismatch fix, noindex added, server component conversion, code quality pass.
**PR:** #144

---

## March 2026

### 2026-03-31 — Brand guidelines integration
New `brand-base.css` design system tokens. Added Neue Haas Grotesk and JetBrains Mono fonts. Created claims compliance doc, brand voice doc, quality standards. Established local rules for components and pages.
**Why:** New brand direction from marketing. Previous system (`premium-base.css`) was ad-hoc. Needed a single source of truth.
**PR:** #143

### 2026-03-31 — Development workflow improvement
Added quality standards doc. Enforced mobile-first across workflows. Added brand voice, code review, UX iteration, and Jira workflow docs.
**PR:** #142

### 2026-03-30 — Funnel bug fixes (Henry feedback)
Fixed offer constants, icons, copy, and count display issues flagged during internal review.
**PR:** #141

### 2026-03-27 — Funnel page UX iteration
Better styling, layout, pre-selection defaults, copy refinement, upsell improvements. Integrated real Shopify product data for Flow/Clear monthly variants.
**Why:** Iterating toward launch-ready state after initial build.
**PRs:** #137, #138, #139, #140

### 2026-03-25-26 — Funnel page built
Multi-step paginated funnel (Plan > Product > Checkout). Standalone data layer (`funnelData.ts`), isolated checkout flow (`funnelCheckout.ts`), step indicator, upsell modal, analytics events. Mobile-first.
**Why:** January Brands workshop identified frictionless funnel as the primary conversion lever. Overload/Fussy pattern.
**PR:** #137

### 2026-03-25 — Landing page built
8-section landing page at `/start` for paid Meta traffic. Hero, benefits, product split, what's inside, testimonials, guarantee, case studies, FAQ. All CTAs point to `/funnel`. Noindex.
**Why:** Paid traffic needs a dedicated conversion page, not the homepage.
**PR:** #136

### 2026-03-24 — Website simplification plan
Created `WEBSITE_SIMPLIFICATION_PLAN.md` and `CONKA_BUSINESS_CONTEXT.md` documenting the pivot from protocols to Flow/Clear/Both.
**Why:** January Brands workshop. Protocols are too confusing, killing conversion from paid traffic.

### 2026-03-13 — Customer portal aligned to Loop
Added cancellation modal with winback discount, reorder for single products, apply discount code functionality.
**Why:** Aligning the customer portal to Loop's subscription management features.
**PR:** #135

---

## February 2026

### 2026-02-20-27 — Customer portal, app page, abandoned cart
Customer portal with order history, subscription editing, payment methods. Full app page with cognitive test integration. Abandoned cart Klaviyo flow. Our Story page refactor.
**PRs:** #99-119

### 2026-02-16-19 — Homepage refactor
Athlete credibility carousel, product grid, formula benefits with ingredient images, case study redesign, hero banner carousel, what-to-expect timeline, founders section, FAQ.
**Why:** Complete visual overhaul of the homepage after product page work was done.
**PRs:** #81-98

### 2026-02-10-13 — Product and protocol page refactors
Meta Pixel + CAPI analytics. Conka Flow product page redesign. Protocol page full refactor with premium styling.
**PRs:** #61-80

### 2026-02-03-09 — Product page redesign and design system
Created `premium-base.css` design token system. Product page structure, image slideshow, testimonial strip, what-to-expect timeline.
**Why:** Moving from ad-hoc styling to a consistent design system.
**PRs:** #51-60

---

## January 2026

### 2026-01-27-31 — B2B professionals portal
Full B2B purchasing portal with individual/team modes, tier pricing system, cart tier normalisation, VAT pricing.
**PRs:** #39-50

### 2026-01-20-26 — Navigation rebuild and analytics
Navigation refactored into sub-components. Shop mega menu. Add-to-cart source tracking, quiz session ID capture. Barry campaign page.
**PRs:** #25-38

### 2026-01-13-19 — Launch polish
Founding members banner, hero overhaul, buy-now funnel, Trustpilot reviews, shop overview page.
**PRs:** #14-24

### 2026-01-06-12 — Science page and launch
Science page with embedded Cognica cognitive test SDK, email capture, Klaviyo integration. Nike QR campaign pages. Privacy policy, favicon, payment logos.
**PRs:** #1-13
