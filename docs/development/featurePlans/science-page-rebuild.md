# Science Page Rebuild - Make the Sceptic a Believer

A full narrative and visual rebuild of `/science`. The page is being rebuilt around a single building argument, restyled into the controlled clinical grammar, anchored visually by ingredient renders, and given a confident, honest evidence story. Goal: turn a credential-flexing wall of repeated stats into the canonical "why it works" hub that converts an interested sceptic into a believer.

> **Design system:** brand-base / `.brand-clinical` (already in use, no migration). Applies the read-vs-scan typography rules in `docs/branding/DESIGN_SYSTEM.md` (Primary sans for everything read; Data mono only for scanned markers).

## Problem

`/science` flexes credentials instead of teaching. The hero and the evidence summary dump the same proof stats (32 studies, 6,000 participants, GBP 500k, patent), the quote is too thin to anchor, the adaptogens section defines the term generically without saying why our dosing differs, and the whole page re-states content that already lives on five other surfaces. There is no thread pulling the reader through, so it reads as filler and fails to teach or convince.

- **Who it serves:** the mid-funnel sceptic, already interested, arriving from a PDP or nav, who needs their doubt dismantled before buying.
- **Traffic source:** not cold paid traffic. This is a believer-maker reached on intent, so depth is good provided the page rewards both the skimmer and the deep reader.
- **Business impact:** converts consideration into purchase on the highest-intent research path, and gives the whole site one credible place to point ("see the science") instead of repeating it weakly everywhere.

## Appetite

Roughly 1.5 weeks, built section by section to a Vercel preview with a visual review per section. Presentational and content work plus light client interactivity (layered disclosure). No backend, no checkout changes.

## Decisions settled at scope

- **Page job:** convince the sceptic (mid-funnel believer-maker), layered disclosure for skim + deep read.
- **`/ingredients` stays separate.** `/science` gets a curated, render-led ingredient section and links out to `/ingredients` for the full interactive dose lookup. We do not absorb or redirect it.
- **Evidence posture: confident transparency** (see the evidence section below). Honest about not having published human RCTs yet; confident about the scale, rigour, and velocity of the evidence engine producing them.

## The narrative spine (the actual fix)

Each section earns the next as one building argument:

1. **Hero - the thesis, not the trophy case.** A sharp claim (the brain is a trainable performance system under daily load; CONKA is engineered around it) plus a one-line "how we prove it." Replaces the stat-dump open.
2. **Why most brain products fail.** The tension: caffeine theatre, proprietary-blend pixie-dusting, no mechanism, no transparency. Sets up our difference honestly.
3. **The two-system model.** CONKA runs adaptogens (resilience to load, over time) and nootropics (acute cognitive performance). The page's organizing idea, and the honest frame for Flow vs Clear without favouring either.
4. **Education, done properly.** What are adaptogens? What are nootropics? Plain definition then mechanism (HPA axis and cortisol for adaptogens; neurotransmitters, cerebral blood flow, and cellular energy for nootropics) then an analogy then why dose and quality matter. This is where we earn "legit." Layered: definition visible, expand for depth.
5. **The ingredients - render-led deep dive.** The visual hero. FigurePlate-framed renders, a curated set of hero actives per system, each with plain mechanism, per-serving dose, and evidence tier. Links to `/ingredients` for the full list. Doses yes, formula-share secret.
6. **How we formulate.** Clinical dosing (not pixie dust), bioavailability (taught before the jargon), transparency (named actives, real doses). The credibility of how we build.
7. **The evidence ladder - confident transparency.** The honest, confident evidence story (detail below). Links to `/app-insights` and `/case-studies`.
8. **Real-world bridge to CTA.** The app measures it on you; invite them in.

## Evidence posture and exposure guide

The posture is **confident transparency**. The narrow honesty: we will not say "clinically proven" until peer-reviewed human results publish. Everything else is a position of strength.

**The framing to land:** the actives are backed by real primary research, so we are sure on the ingredients. On top of that we are building the most rigorous evidence engine in the category: continuous, app-based, wearable-connected cognitive testing at scale across sporting and corporate teams. This deliberately solves the field's biggest bottleneck (access to elite participants is slow, expensive, and equipment-bound), and it raises the quality of cognitive testing itself, which compounds into better product. We are not running before/after surveys. The restraint is the credibility.

**The evidence ladder (four rungs):**

1. **The literature behind the actives.** Plenty of primary peer-reviewed research on the individual ingredients. Real, citable references already in hand: Kennedy et al. 2003 (lemon balm), Mix & Crews 2002 (Ginkgo biloba), Whyte & Williams 2015 (bilberry), Bowtell et al. 2017 and Dodd et al. 2015 (cerebral blood flow), Kennedy 2019 (phytochemicals for cognition and sport).
2. **Our own formulation research - Durham.** Early model-organism (fly-trial) research from initial formula development. Preprint (manuscript 202411.0241). Frame as early research, not human proof.
3. **Our own human trial - Exeter (in write-up).** An eight-week double-blind, placebo-controlled, randomised crossover trial of two CONKA formulae. Power-calculated to 60+ participants drawn from professional athletic and defence/security teams. Three validated cognitive domains (attention, processing speed via CognICA, short-term memory), delivered through the CONKA app, three sessions a week, against a matched placebo and a control. Currently being written up.
4. **Real-world data at scale.** App-measured cognitive data from live trials, most recently Revolut (9 participants, 129 tests, 75% improved over the window). Continuous, growing, instrumented. Frame as real-world validation, not proof.

**Investment figure:** the GBP 500k research investment is woven into the Durham and Exeter rungs as proof of commitment to real science, not shown as a standalone stat-flex.

**Retired:** the old volume stats (32 studies, 6,000 participants) are dropped, not reframed. They are not compelling and read as borrowed authority. The patent (GB2620279) stays only as an IP signal woven into the formulation story, not as a hero stat.

**CAN expose:**
- The four rungs above, with the framing tier shown for each (literature / early research / human trial in write-up / real-world data).
- Exeter trial **design, rigour, and population** (double-blind, placebo-controlled, randomised crossover, power-calculated, professional athletes and defence personnel, validated cognitive tests, app-delivered). Not results.
- The Durham preprint as early model-organism research.
- Revolut real-world signal (participants, tests, % improved) framed as early validation.
- The evidence-engine differentiator: wearable integration, continuous app-based testing at scale, the access bottleneck we solve.
- Patent GB2620279 as an IP signal.

**MUST NOT expose:**
- No "clinically proven" or published-RCT claims. None of our human data is published.
- No Exeter results (not analysed or published; in write-up).
- No formula-share percentages (secret). Per-serving doses are fine.
- No quantified health claims beyond EFSA-authorised (Vitamin C, B12). User owns the final compliance pass.
- Do not present the Durham fly trial as human evidence.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Architecture, narrative spine + clinical restyle | Not Started (ACTIVE) |
| 2 | Education pieces (adaptogens + nootropics) | Not Started (ACTIVE) |
| 3 | Ingredient render section | Not Started (ACTIVE) |
| 4 | Evidence ladder + confident transparency | Not Started (ACTIVE) |
| 5 | Dedup, cross-links, SEO, analytics, cleanup | Future (finishing) |

### Phase 1: Architecture, narrative spine + clinical restyle - ACTIVE

1. **[Page] Rebuild page scaffolding to the new arc.**
   - What: reorder `/science` to the eight-section spine; remove the full-page `isMobile === undefined` gate that blanks the page on load (the "Loading research" flash); make the page server-first with small client islands only where interaction is needed.
   - Dependencies: none.
   - Complexity: Medium.
   - Files: `app/science/page.tsx`.

2. **[Component] Thesis hero.**
   - What: replace `ScienceHero`'s credential dump with a claim-led hero (thesis + one-line "how we prove it"). Clinical grammar, read-vs-scan typography.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: `app/components/science/ScienceHero.tsx` (rework or replace).

3. **[Component] "Why most brain products fail" problem section.**
   - What: reframe `ScienceDifferent` from a defensive feature checklist into the problem/tension that sets up our difference.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: `app/components/science/ScienceDifferent.tsx` (rework or replace).

4. **[Component] Two-system model section.**
   - What: new section introducing adaptogens + nootropics as the page's organizing frame, bridging Flow and Clear equally.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: new `app/components/science/` component.

5. **[Cleanup] Retire `ScienceQuote`.**
   - What: fold the research-philosophy line into the hero or two-system section; remove the thin standalone quote.
   - Dependencies: tasks 2-4.
   - Complexity: Small.
   - Files: `app/components/science/ScienceQuote.tsx`, `app/science/page.tsx`.

### Phase 2: Education pieces - ACTIVE

1. **[Component] Adaptogens explainer.**
   - What: upgrade `ScienceAdaptogens` into a real teaching module: plain definition, mechanism (HPA axis, cortisol), analogy, why dose and quality matter. Layered disclosure (headline visible, expand for depth).
   - Dependencies: Phase 1.
   - Complexity: Medium.
   - Files: `app/components/science/ScienceAdaptogens.tsx`.

2. **[Component] Nootropics explainer.**
   - What: new counterpart module: definition, mechanism (neurotransmitters, cerebral blood flow, cellular energy), analogy, why dose and quality matter.
   - Dependencies: Phase 1.
   - Complexity: Medium.
   - Files: new `app/components/science/` component.

3. **[Copy] Education copy.**
   - What: final plain-language, honest copy for both explainers. No new claims.
   - Dependencies: tasks 1-2 structure.
   - Complexity: Small.

### Phase 3: Ingredient render section - ACTIVE

1. **[Data] Curate hero actives + surface doses.**
   - What: select a curated set of hero actives per system; shape the per-serving dose data (lives in `StruggleSolution.ingredientAsset.dosage`, not on the base `Ingredient` type) into a usable form. No formula-share data.
   - Dependencies: none.
   - Complexity: Medium.
   - Files: `app/lib/formulaContent.ts`, `app/lib/productData.ts`, possibly a small science-specific data shape.

2. **[Component] Render-led ingredient section.**
   - What: the visual hero. FigurePlate-framed ingredient renders from `public/ingredients/renders/`, each active with plain mechanism, per-serving dose, and evidence tier. Mobile carousel or stack.
   - Dependencies: task 1.
   - Complexity: Large.
   - Files: new `app/components/science/` component, `app/components/FigurePlate.tsx` (reuse).

3. **[Link] Link to `/ingredients`.**
   - What: clear path to the full interactive dose lookup. Keep the two pages distinct (science teaches, ingredients looks up).
   - Dependencies: task 2.
   - Complexity: Small.

### Phase 4: Evidence ladder + confident transparency - ACTIVE

1. **[Component] Evidence ladder.**
   - What: the four-rung ladder (literature on actives, Durham preprint, Exeter RCT in write-up, real-world app data) with each rung's framing tier shown. Confident-transparency framing per the exposure guide.
   - Dependencies: Phase 1.
   - Complexity: Large.
   - Files: new `app/components/science/` component (replaces `EvidenceSummary`).

2. **[Component] Real-world data module.**
   - What: the Revolut signal (participants, tests, % improved, speed/archetype beats) framed as early validation. Honest, not overclaimed.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: new `app/components/science/` component; data from `docs/conkaAppData/REVOLUT_TRIAL_MARCH26.md`.

3. **[Copy] The standard + the evidence engine.**
   - What: the "what we will and will not claim yet" beat reframed as standards, plus the "why our approach is on another level" framing (wearables, scale, quality of cognitive testing, access bottleneck solved).
   - Dependencies: task 1.
   - Complexity: Small.

4. **[Link] Outbound links + CTA bridge.**
   - What: link to `/app-insights` and `/case-studies`; bridge to the app and a clean CTA (rework `AppInsightsCallout`'s function into the page tone).
   - Dependencies: tasks 1-3.
   - Complexity: Small.
   - Files: `app/components/app/AppInsightsCallout.tsx` or replacement.

## Future phases (not ticketed)

- **Phase 5: Dedup, cross-links, SEO, analytics, cleanup.** Wire inbound links (home `LabResearch`/`LabTimeline`/`LabCaseStudies`, PDPs, `/why-conka`) to point at `/science`; finalise outbound links; retire dead components; JSON-LD + metadata + OG; section-engagement analytics following `app/lib/analytics.ts`; final mobile and performance pass.

## Rabbit holes

- **Ingredient CMS.** Do not build a database or per-ingredient engine. Curate hero actives, link to `/ingredients`.
- **New 3D assets.** Use the existing renders in `public/ingredients/renders/` (photographic). Commissioning true-3D assets is a separate production track, not in this scope.
- **Redesigning `/app-insights` or `/case-studies`.** Out of scope. Link to them.
- **Evidence section stalling on trial specifics.** Use what is defensible now per the exposure guide; leave hooks for results when they publish.
- **Claims legality.** We frame honestly; the user owns the final compliance pass. Do not turn this into a legal review.

## No-gos

- No formula-share percentages (secret). Per-serving doses fine.
- No single-product emphasis. Flow and Clear stay equal.
- No "clinically proven" or published-RCT claims, and no Exeter results, until published.
- Not absorbing `/ingredients`.
- No cart or checkout changes.

## Risks

- **Copy is the deliverable.** Content-heavy; each section needs the user's voice and a per-section visual review.
- **Evidence accuracy + founder comfort.** The Durham preprint full text was not accessible during scoping; exact wording to be confirmed with the user. Exeter results must stay out until published.
- **Mobile scannability.** A long teaching page must pass the 3-second-consumable test; layered disclosure is mandatory.
- **Load-flash rework.** Removing the `isMobile` full-page gate touches the shared `Reveal` pattern; verify no regression.
- **Asset reality.** The renders are photographic, not literal 3D. Confirm this meets the visual intent.

## Resolved decisions (from open questions)

- **Old proof stats: retired.** Drop 32 studies / 6,000 participants entirely (not compelling, reads as borrowed authority). Weave the GBP 500k research investment into the Durham and Exeter rungs as commitment to real science. Keep the patent (GB2620279) only as an IP signal inside the formulation story.
- **Durham preprint wording: pragmatic.** Full preprint text was not accessible during scope, so frame it conservatively and defensibly (early model-organism / fly-trial research from initial formula development, preprint) without asserting specific findings. Tighten if the full text becomes available.
- **Renders:** proceed with the existing photographic ingredient renders in `public/ingredients/renders/`. A true-3D asset track is a separate, later effort if wanted.

## References

- Current code: `app/science/page.tsx`, `app/components/science/*`, `app/components/app/AppInsightsCallout.tsx`
- Ingredient data: `app/lib/formulaContent.ts`, `app/lib/productData.ts`, `app/lib/scienceData.ts`
- Render assets: `public/ingredients/renders/`, `app/components/FigurePlate.tsx`
- Real-world data: `docs/conkaAppData/REVOLUT_TRIAL_MARCH26.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md` (clinical grammar, read-vs-scan typography, FigurePlate)
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Reference pages studied: Magic Mind science approach, Ketone science, AG1 research

## Jira tickets

Created in Sprint 27, assigned to Rudh, under the Website & CRO epic (SCRUM-763, drag into place on the board). Active phases (1-4) ticketed; Phase 5 stays in this doc until promoted.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1067 | Science page rebuild Phase 1: architecture, narrative spine + clinical restyle | 1 | To Do |
| SCRUM-1068 | Science page rebuild Phase 2: education pieces (adaptogens + nootropics) | 2 | To Do |
| SCRUM-1069 | Science page rebuild Phase 3: ingredient render section | 3 | To Do |
| SCRUM-1070 | Science page rebuild Phase 4: evidence ladder + confident transparency | 4 | To Do |
