# Page Narratives

A living map of the story each page tells, section by section. Use it to see a page's intended arc at a glance and spot the weakest section to improve or replace next.

This is **current-state**, not build history. For why a page was built a certain way, see `docs/development/featurePlans/`. Keep this file lightweight: one table per page, update it whenever a page's section order or a section's job changes.

**Health key**
- Strong: does its job, premium, converts. Leave alone.
- OK: works but could be sharper. Improve when there's time.
- Weak: underperforming, off-thesis, or a spec-sheet dump. Replace or rework.

---

## / (home)

**Audience:** cold, mobile, no brand awareness. 74% of traffic is mobile paid social, so the governing reader is someone who tapped a Meta ad thirty seconds ago and has never heard of CONKA. Secondary: branded search and returning visitors who want the shop.
**Posture:** the whole funnel on one page. Unlike /science or /app, home does not hand the buy downstream, it closes. Confident-clinical, proof-led, and never more than two sections away from a way to buy. Every claim it makes is evidenced by the section after it rather than asserted twice.
**Story arc:** here is the shot -> here are the two formulas and what each is for -> here is why it exists at all -> here is the proof in numbers -> pick yours -> here is what you will actually feel, and when -> here is who relies on it -> here is who validated it -> here is the thing nobody else can offer, measure it yourself -> here is why not just coffee -> here are real people using it -> your questions.

`BrainFuelBand` owns its own full-bleed section and sits outside the `HomeSection` tracking wrapper, so it emits no `home:section_viewed`. Everything else is tracked under its semantic id.

**Two properties of this page are deliberate and easy to break by reordering.**

1. **CTA coverage.** Home once ran seven consecutive sections with no route to purchase. It now never runs more than two. Re-check that gap after any insertion or reorder.
2. **The comparison table must stay on white.** Its CONKA column is marked by an `#eef0f5` panel, and this page is `.brand-clinical`, where `--brand-tint` is `#f5f5f5`. On tint those are near-identical greys and the column marking disappears. `research` is the opposite case: its section colour never shows, because `LabResearch` paints a full-bleed navy band over it.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`HomeHeroStatic`) | Name the product and the promise in one screen | OK | Static metal-tray render, art-directed portrait/landscape. LCP element; the looped video hero is kept in the tree for revert |
| 2 | Product showcase (`LandingProductShowcase`) | Two formulas, what each is for, one price-led CTA | OK | Carries the certification badges under its CTA (compact variant), so reassurance sits at the decision rather than a section away |
| 3 | Why CONKA exists (`HomeWhyAccordion`) | The argument: challenge, solution, how it works | OK | Its lead, "Tackling modern distraction with", is close to Gray Matter's own section headline, and the four-part structure mirrors theirs. Worth a rewrite if the two are ever compared side by side |
| -- | Brain fuel band (`BrainFuelBand`) | Proof in numbers before anything is asked | OK | Desktop is a three-tile bento on one gutter; headline tile is white inside a navy hairline. Full-bleed, own section, untracked |
| 4 | Shop (`ProductGrid`) | Pick yours | OK | The hero CTA's `#product-grid` scroll anchor. Cards use `ConkaCTAButton` ("Try Flow" / "Try Clear") |
| 5 | What to expect (`WhatToExpectV2`) | Answer "when will I feel it", the objection that kills a first subscription | OK | Desktop pairs the scroll-drawn timeline with a sticky product render; mobile has no asset column. GSAP loads only on approach, so it never touches the initial bundle |
| 6 | Athletes (`AthleteCredibilityCarousel`) | Who relies on it when focus cannot fail | OK | Moved up from 11 so it answers "who trusts this" while the shopper is still deciding. Shared with the three PDPs and /start, so changes reach six surfaces |
| 7 | Research (`LabResearch`) | Institutional credibility: Cambridge, Durham, Exeter | OK | Full-bleed navy band that covers its own section background |
| 8 | Measure it yourself (`AppUSPSection`) | The differentiator no competitor has: prove it worked | OK | Was Weak. Now carries two CTAs: a navy `/conka-both?src=home_app` primary ("Put it to the test") and the app as an inverted secondary, so the page's most differentiating moment no longer leads only away from a sale |
| 9 | Comparison (`ProductComparisonTable`) | Why not just coffee, or a prescription | OK | Moved down from 7, so the page argues who trusts it and why it is credible before arguing against alternatives. Keeps its centred heading against home's left-aligned default; reviewed and accepted, not debt. "On the high street" was added 2026-08-27 as the one row coffee wins outright, so it no longer reads as an unbroken run of CONKA ticks |
| 10 | Social proof (`UGCMarquee`) | Volume and faces, real people not actors | OK | Moved to sit immediately before the FAQ: volume-of-people proof lands hardest as the last thing said, where higher up it sat between two argument sections and read as decoration |
| 11 | FAQ (`LabFAQ`) | Clear the last objections, then close | OK | Runs full width (no lifestyle image). Its JSON-LD is serialised from the same subset the section renders, so schema never describes an unshown question |

**Section 8, `AppUSPSection`, was the weakest link and has been addressed.** Measuring your own cognition and proving the product moved the number is the one claim neither Gray Matter, Magic Mind nor AG1 can make. The 27 Aug reorder fixed its reach; the CTA was the remaining problem, since routing only to `/app` made the page's most differentiating moment the one that led away from a sale.

Resolved 2026-08-27 by **adding** a CTA rather than replacing one, which was the open question. The app is free and is the proof, so removing its CTA would have cut the section's own payoff. The buy takes the primary navy fill ("Put it to the test", tying the purchase to the measurement argument) and the app keeps an inverted secondary. Both exits, buy first.

**Do not read this as data-backed.** It is the same judgement as every other rating in this table, and the section-level numbers that could confirm or kill it start being answerable in early September.

**No data has informed any of these ratings.** `home:section_viewed` shipped 27 Aug (SCRUM-1265), so scroll-depth by section starts accumulating from that date and nothing exists before it. The three mid-page CTAs each carry a `home_<section>` `?src=` token (see `docs/development/CART_ATTRIBUTES.md`), so which argument actually drives a click is answerable from roughly early September. Revisit these Health ratings then and replace judgement with numbers.

---

## /science

**Audience:** mid-funnel sceptic. Already interested (arrives mostly from the nav, footer or a PDP, and leans desktop), but doubtful. Needs "does it work, and why?" answered before buying.
**Posture:** proof first, depth on tap. Simple DTC (SCRUM-1351). The top layer is scannable (stats, study-design icon tags, short copy); method, partners and references sit behind native `<details>` so sceptics can check everything without it slowing anyone else down. Tracked CTAs to `/conka-both` (hero and close) and to each PDP (the Flow and Clear cards), no pricing. Figures come from `app/lib/scienceContent.ts`, sourced from `docs/conkaAppData/HIGH_LEVEL_STATS.md`.
**Story arc:** Answer first (the placebo-controlled result) -> the problem -> what nootropics and adaptogens are -> Flow and Clear -> the trials -> measure it yourself -> try it. Mirrors the home "why" accordion (`homeWhyContent.ts`). Plan: `docs/development/featurePlans/science-page-narrative.md`.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`ScienceHero`) | Answer "does it work?" in the first screen: BLUF passage with the Harlequins result, 4-stat grid, Try CONKA CTA, trust icons | Strong | H1 pill echoes the home "why" headline |
| 2 | The Challenge (`ScienceChallenge`) | Fragmented attention, the caffeine crash, unbacked claims; then our coffee vs CONKA app data with its observational caveat | OK | Home "why" row 1 |
| 3 | Nootropics and Adaptogens (`ScienceCategories`) | Answer-first definitions of each, why nature makes them; depth layer of every active with one human study, the study's dose and a PubMed link | Strong | Home "why" row 2. Study doses only: our per-shot amounts are patented and never shown |
| 4 | How CONKA Works (`ScienceHowItWorks`) | Flow (morning) and Clear (afternoon) as equal cards, four named actives each, tracked links to each PDP | OK | Home "why" row 3. No amounts, no per-shot totals |
| 5 | The Proof (`ScienceProof`) | Harlequins featured (CONKA vs placebo bar), Bristol Bears and Revolut with honest design notes, Exeter in progress, research partners in the depth layer | Strong | `#proof` anchor target from the hero |
| 6 | Measure It Yourself (`ScienceMeasure`) | The two-minute app test, test and user counts from `APP_INSIGHTS_TOTALS`, links to /app and /app-insights | OK | Home "why" row 5 |
| 7 | Close (`ScienceCTA`) | Flow + Clear together, trust lines, Try Flow + Clear CTA, `ReviewedDate` | OK | |

**Weakest link right now:** there are no named people behind the research yet, the strongest credibility device on comparable science pages. Scientist photos and roles are being sourced for that section (SCRUM-1353).

---

## /app

**Audience:** top-to-mid-funnel sceptic, plus the existing customer. The app is free, so the page is not selling a supplement, it is selling belief in measurement. It proves CONKA can be trusted by showing you can measure the thing every other brand only claims.
**Posture:** show, don't tell. Earn credibility through a real, can't-be-gamed test and real user and athlete data. The CTA is "download / take the test," not "buy." This is a trust-and-proof engine that feeds the funnel and retains buyers.
**Story arc:** we don't tell you how you feel, we show you -> you cannot improve what you cannot measure -> here is the gold-standard test that can't be gamed -> and around it an engine: everything in (Apple Health, Screen Time), patterns out (what is true for you), down to the millisecond -> try it yourself right now -> here is the clinical and athlete proof, and CONKA moves the number -> the app keeps you testing -> download it free.

The page is GSAP-driven (scroll-scrubbed pinned journey, count-up stats, masked reveals); all motion falls back to static layouts under prefers-reduced-motion and on mobile the journey stacks.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`AppV2Hero`) | State the thesis: "Everyone tells you how you should feel. We show you." Live score ring draws and counts to 92 | OK | The count-up makes the thesis kinetic; same copy as before |
| 2 | Why / Origin (`AppV2Origin`) | "You cannot improve what you cannot measure." Headline brightens word-by-word on scroll; Humphrey's scan story | OK | Founder credibility; lab reference generalised to "a Neuro Lab" |
| 3 | How it works (`AppV2TestJourney`) | "The Gold Standard of Cognitive Testing." Pinned 2-beat trust journey (can't be gamed -> 30-day improvement), scroll scrubs the phone screens | OK | Trimmed to two beats; the tracking story moved to the engine section |
| 4 | The engine (`AppV2Engine`) | "Everything in. Patterns out. Down to the millisecond." Three acts: Apple Health + Screen Time inputs wire into the score, the patterns engine shows what is true for you, per-test forensics and long-term trends | OK | The intelligence/personalisation beat: lab-grade insight without a lab. Connector-line draw on desktop; act 3 uses capability cards (precision, anonymous benchmarks, long-term trends), not personal stats |
| 5 | Try it (`CognitiveTestIsland`) | "Measure your cognitive performance." Live in-page test, instant benchmarked result | Strong | The most on-thesis moment on the page: it shows instead of telling |
| 6 | Proof (`AppV2Proof`) | Count-up research stats, explicit product bridge ("The app shows you the number. CONKA moves it.") with equal Flow/Clear links, athlete strip | OK | Closes the loop the science page opens; athletes stand on their own now |
| 7 | Real-world data (`AppInsightsCallout`) | "Curious what 700+ users actually show?" Bridge to /app-insights | OK | Link-out, should not pull focus |
| 8 | Habit (`AppV2BeyondTest`) | Compete + Rewards: "A test you'll actually keep taking." | OK | Retention beat placed after proof so it doesn't delay it |
| 9 | Download (`AppV2Download`) | "Start measuring your brain today." Free, no subscription | OK | Clean conversion layer with decorative scroll-drawn ring |

**Weakest link right now:** unproven, the rebuild shipped June 2026. Watch the pinned journey (section 3) on real devices: pinned scroll sections are the most device-sensitive pattern on the page, and on mobile it falls back to a plain stacked list that has had less design attention than the desktop scrub.

---

## /app-insights

**Audience:** the data-curious sceptic, 25-45 UK professionals and athletes who clicked through because the measurement angle intrigued them. Sceptics by default, overwhelmingly mobile. Also the B2B browser evaluating whether the trials offer is real.
**Posture:** prove the measurement claim with the data itself, then convert to an app download (primary) or a professional-trials enquiry (B2B exit). Confident-clinical: every claim carries its sample size, evidence-strength badge, and methodology; thin data is labelled thin.
**Story arc:** we don't ask if CONKA works, we measure it (here is the dataset) -> here is how a supplement brand can even have this data (the measurement loop + validated-test credentials) -> four patterns the data keeps showing (skim layer + per-user-delta methodology) -> the four reports: your brain runs on a curve, then the three forces that bend it (fatigue, stress, alcohol), each with a CONKA observation where the sample defends it -> this page is our data, the app gives you yours (download) -> the same instrument runs professional trials (B2B exit) -> how we look at the numbers (methodology + compliance anchors).

The page is GSAP-driven around one idea: everything is measured against a baseline, so the motion enacts the per-user delta method. Calibration rules draw under section headers, readings count from zero to their measured value, bar charts grow downward from the "your typical day" zero line, the two time-of-day curves draw left-to-right, and filtering reports fades the canvas like switching instruments. All motion is entrance-triggered (no pinning), gated behind prefers-reduced-motion, and charts defer mounting until near-visible.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`InsightHeroDifferentiator`) | "We don't ask if CONKA works. We measure it." Masked-line H1, then the dataset plate: a drawn baseline and four readings (712 users, 7,593 tests) resolving on load | OK | The orchestrated load moment; the plate header carries the date range |
| 2 | How this is possible (`HowThisIsPossibleModule`) | Pre-empt the sceptic's first question: take -> test -> see, plus FDA/NHS/Cambridge credentials grid | OK | Credentials stay static by design, a deliberate quiet zone; verbatim citation note is load-bearing |
| 3 | TL;DR strip (`InsightTldrStrip`) | "Four patterns the data keeps showing." Skim layer: one headline card per report with sample size + evidence badge, tap to jump | OK | The narrative pivot from instrument to findings |
| 4 | Methodology in 30s (`MethodologyInThirtySeconds`) | Per-user delta explained before the data, can/can't-do list | Strong | Disclosure pattern; open by default on desktop |
| 5 | Filter bar (`InsightFilteredSections`) | Channel-selector chips, one per question; filtering fades the report canvas out and back like switching instruments | OK | Anchors (#time-of-day etc.) preserved; linked from elsewhere |
| 6 | Reports 01-04 (`DataReportSection` x4) | The findings, numbered as one investigation: the daily curve, then fatigue, stress, alcohol. Readings resolve, bars fall from the baseline, evidence badges and caveats throughout | Strong | Report order is the spine: the map first, then the three forces that bend it |
| 7 | Download (`AppDownloadSection`) | "This page is our data. The app gives you yours." Free, no subscription | OK | The conversion payoff of the whole page |
| 8 | Professional trials (`ProfessionalTrialsBlock`) | 15+ trials, sport tags, NDA note, enquiry CTA | OK | B2B exit ramp; count resolves on entry |
| 9 | Methodology footer | Per-user delta restated + compliance anchors (findings-as-published, food-supplement statement) | OK | Fully static by design; legal anchors must stay legible |

**Weakest link right now:** unproven, the motion upgrade shipped June 2026. Section 2 is the longest unbroken read on the page; watch drop-off there. The four reports share one layout, which is honest but means report fatigue by report 03 on mobile; if analytics show readers bailing mid-reports, tighten the lower two reports before touching anything else.

---

## /our-story

**Audience:** top-of-funnel and brand-curious. Arrives from nav or about-the-brand searches. Not yet sold; deciding whether to trust the people behind the product.
**Posture:** founder credibility through narrative, told plainly. The page sells nothing until the final beat; the story itself is the proof (real research partners, real money invested, real trials). Editorial and calm, in the Cadence / Gray Matter register rather than the clinical spec-sheet voice.
**Story arc:** two athletes who could not accept that brain performance was left to chance -> one question, made personal by concussion -> Durham neuroscientists find that the combination is the point -> tested where a fraction of a percent decides the result -> the lab test put in your pocket with Cambridge -> everyone has a brain, yours is next.

Rebuilt September 2026 to Henry's Figma V1 (SCRUM-1325 to 1327). **Simple DTC, not clinical** (`DESIGN_SYSTEM.md` §8.5): no eyebrows, no mono, no topic codes, solid black type. Motion is deliberately minimal: one shared `revealUp` per section, nothing else. The previous version's masked-line hero, clip-path wipes, parallax, count-ups, tested-environments marquee, fixed chapter rail and dark scrubbed manifesto were all removed, not hidden.

**Layout: full-bleed split bands (deliberate, benchmarked against Gray Matter and Cadence).** The hero and all four chapters are **full-bleed split bands**, the documented §6 exception in `DESIGN_SYSTEM.md` §8.5. Their sections carry only a background and an `aria-label`: no `brand-section`, no `brand-track`. The image owns half the viewport edge to edge and top to bottom; the copy owns the other half and pads its outer edge with `--brand-track-inset` so the text still lines up with the CTA and with tracked sections elsewhere on the site. The CTA is an ordinary tracked section.

On mobile everything stacks image first, then copy. Because these sections have no padding of their own, each image is naturally full bleed and flush with the top of its band, with no negative-margin cancellation anywhere. The hero inverts on mobile so the photo leads flush under the nav; copy still leads in the DOM so the `h1` precedes the image for screen readers and crawlers, and only the visual order flips. The hero stat row is centred per column, because three uneven left-aligned blocks read as ragged at 390px where the labels wrap to different line counts.

> **Known deviation from the mobile rule in `.claude/rules/pages.md`:** because the hero photo leads on mobile, the `h1` sits below the fold at 390px. That is the Gray Matter / Cadence opening and it was an explicit design call. It is defensible here because `/our-story` is a brand-trust page reached from the nav, not a paid-traffic entry point with a conversion job above the fold. Do not copy this to an acquisition surface.

| # | Section (component) | Job in the story | Health | Notes |
|---|---------------------|------------------|--------|-------|
| 1 | Hero (`OurStoryHero`) | "Two athletes. One obsession. Zero shortcuts" with three credibility stats and the founders on site | OK | Copy left, photo right; stats are real markup, not the flattened strip in the Figma |
| 2 | Ch. 1 (`StorySection`) | "It started with one question" — how the pair met and why the brain became the question | OK | Image left on desktop |
| 3 | Ch. 2 (`StorySection`) | "Uncharted territory. Directed by the best." — Durham, and the synergy finding | OK | Image right on desktop |
| 4 | Ch. 3 (`StorySection`) | "Tested where fakes wouldn't survive." — elite sport as the proving ground | OK | Image left on desktop |
| 5 | Ch. 4 (`StorySection`) | "A science-grade test. In your pocket." — the Cambridge-built app and the dataset | OK | Image right on desktop |
| 6 | CTA (`OurStoryCTA`) | "Everyone has a brain." Try CONKA | OK | The only conversion moment, and the page's only centred block |

**Weakest link right now:** the stat figures are Henry's Figma numbers taken verbatim ("25+ trials", "150,000+ shots", "4 clinical studies", "over a million tests") and have not been reconciled against `/science`, the PDPs, or the `BRAND_VOICE.md` proof-assets table. That inconsistency is known and accepted, and is tracked in the plan doc. Second: the page lost its explicit "not just for athletes" beat when Chapters 5 and 6 and the manifesto went; the CTA copy now carries it alone.
