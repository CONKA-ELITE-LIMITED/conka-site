# App Page Rebuild - Show, Don't Tell

A narrative-led restructure of `/app`, the stylised dark page about the CONKA app and its cognitive test. The page keeps its premium dark feeling but gains a spine: everyone tells you how you should feel, we show you. Goal: make it unmistakable what the app is, what the cognitive test is, why it matters, and what is free versus what a CONKA subscription unlocks.

> **Design system:** brand-base / `.brand-clinical` dark theme (DESIGN_SYSTEM.md section 10: `#0a0a0a` canvas, SVG dot grid, hairline `border-white/*`, mono labels, navy `#1B2757` interactive only, no shadows or gradients). No migration. Applies the read-vs-scan typography rules (Primary sans for everything read, Data mono only for scanned markers).

## Problem

`/app` opens on feature tabs with no "why". It never explains what your score means or what improvement looks like (the score is a black box), it scatters its proof like a spec sheet, and it is vague on the free-versus-subscriber model. A first-time visitor does not clearly grasp what the app is, what the test is, or why they should care. Unlike the old science page this one has strong parts already (`AppFeaturePanel` and `AppStickyPhoneBlock` tell a real mechanism story), so this is a targeted restructure, not a teardown.

- **Who it serves:** a considering visitor, often arriving from a PDP, nav, or the science page, deciding whether the measurement layer is real and worth it. The app is CONKA's core differentiator and a retention and LTV driver.
- **Business impact:** converts interest into app installs and CONKA subscriptions by making the "we show you, we do not just tell you" proposition undeniable, and gives subscribers a reason the app is worth staying for.

## Appetite

Roughly 1.5 weeks, built section by section to a Vercel preview with a visual review per section. Presentational and content work plus the existing live-test client island. No new backend.

## Decisions settled at scope

- **Targeted restructure**, keeping the strong components (`AppFeaturePanel`, `AppStickyPhoneBlock`) and upgrading others where they fall short. Not a from-scratch rebuild.
- **Keep the stylised dark feeling.** Work within the dark-canvas clinical grammar.
- **The cognitive test is free for everyone, as a mission.** Access to clinical-grade cognitive testing is offered to anyone, with or without taking CONKA. This is a generous, brand-defining position, not a teaser.
- **`/app-insights` stays separate** (the real-data dashboard). `/app` links to it, does not duplicate the data.
- **Reuse the live cognitive test** (Cognetivity SDK). Improve onboarding and results framing only; do not rebuild the engine.

## The narrative spine (the fix)

Thesis: everyone tells you how you should feel, we show you. Cognitive gains are nuanced and easy to miss day to day, so we built the instrument to make them visible. Each section earns the next:

1. **Hero - the thesis.** "Everyone tells you how you should feel. We show you." What it is (a free app and cognitive test that measure your brain over time) plus instant desire.
2. **The why / origin.** Humphrey's beat (see below): repeated concussions, fMRI and EEG brain scans at Newcastle University, and the realisation that you cannot improve what you cannot measure. Seeing the scans move is the seed of the app.
3. **What the test is.** Plainly: a clinically validated visual-processing test (Cambridge-derived, used in NHS memory clinics, cannot be gamed because it uses natural images). Fix the black box: what your score means, what is good, how it moves, what improvement looks like over time (link to `/app-insights` for the population view).
4. **See it yourself - the live test.** The interactive demo, kept, with a "what your score means" beat after the result. The thesis made literal.
5. **What the app is - features and benefit.** The strong feature sections (your score, the test, tracking sleep, stress, caffeine against your score, progress over time, compete and rewards), each framed as what it is and why it matters.
6. **Proof, consolidated.** Tighten the scattered validation (sensitivity and reliability figures, NHS use, FDA clearance) and athlete data into one proof beat, then link to `/app-insights`.
7. **The model.** The app and the test are free for everyone. A CONKA subscription unlocks the full system.
8. **Download CTA.**

## The origin beat (Humphrey)

Grounded in `docs/branding/BRAND_STORY_FOUNDATION.pdf`, which already states "Brain scans showed positive movement. The trajectory was clear. Not just recovery, progression" and frames the app as letting users "measure brain performance in under two minutes. Not guesswork. Measurable change."

Facts to use (confirmed with the user):
- Harry Glover and Humphrey Bodington met at Newcastle University. Humphrey's playing path was stopped by repeated concussions (headaches, light sensitivity, nausea, inconsistent recovery, no clear solution).
- During the concussions he had fMRI and EEG brain scans at Newcastle University. Being able to see his brain measured, not guessed, is the emotional seed of "you cannot improve what you cannot measure".
- The research that became CONKA was with neuroscientists and pharmacologists at Durham University; early self-testing of nootropics showed cognitive baselines improving and brain scans moving positively.

Framing: lead the why-section with a tight version of this. The app exists to give everyone the same ability to see it that the scans gave Humphrey. Keep it honest and human, no new medical claims.

## The free-vs-subscriber model

- **Free, for everyone.** The CONKA app and the cognitive test. Measure your processing speed, get your score, see your trend. We want everyone to have access to this technology, with or without taking CONKA. This is the mission framing, lead with it.
- **CONKA subscribers unlock the full system.** Track any health metric alongside your CONKA and your cognition (sleep, stress, training, whatever you want) to see what actually moves your brain, earn rewards toward merch, and get first access to new features.

Honest framing only. Do not invent free-versus-paid specifics beyond this confirmed model. The full in-app cognitive test is part of the free offering.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Spine: hero thesis + why/origin | Not Started (ACTIVE) |
| 2 | The test, explained + de-blackbox | Not Started (ACTIVE) |
| 3 | What the app is + proof consolidation | Not Started (ACTIVE) |
| 4 | The model + CTA | Not Started (ACTIVE) |
| 5 | Dedup, cross-links, SEO, analytics, cleanup | Future (finishing) |

### Phase 1: Spine - hero thesis + why/origin - ACTIVE

1. **[Page] Reorder to the new arc and isolate client islands.**
   - What: reorder `app/app/page.tsx` to the eight-section spine; make the page server-first where possible, keeping the live cognitive test as an isolated client island (the page is currently a whole `"use client"` file).
   - Dependencies: none.
   - Complexity: Medium.
   - Files: `app/app/page.tsx`.

2. **[Component] Thesis hero.**
   - What: rework the hero to lead with "everyone tells you how you should feel, we show you" plus a one-line what-it-is. Keep the dark stylised treatment.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: `app/components/app/AppFeaturePanel.tsx` (rework) or new hero component.

3. **[Component] Why / origin section.**
   - What: new section weaving Humphrey's origin (concussions, fMRI and EEG scans at Newcastle, "you cannot improve what you cannot measure"). Honest and human, no new claims.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: new `app/components/app/` component.

### Phase 2: The test, explained + de-blackbox - ACTIVE

1. **[Component] "What the test is" explainer.**
   - What: plain explanation of the cognitive test (visual processing, Cambridge-derived, NHS-used, cannot be gamed) plus what the score means, what is good, how it moves, what improvement looks like. Link to `/app-insights` for the population view.
   - Dependencies: Phase 1.
   - Complexity: Medium.
   - Files: new or reworked `app/components/app/` component.

2. **[Component] Live-test results framing.**
   - What: after the live test result, add a "what your score means" beat so the score is not a black box. Reuse the existing test engine.
   - Dependencies: task 1.
   - Complexity: Medium.
   - Files: `app/components/cognitive-test/CognitiveTestSection.tsx`, `CognitiveTestSectionMobile.tsx`.

3. **[Copy] Test copy.**
   - What: final plain-language copy. No new claims.
   - Dependencies: tasks 1-2.
   - Complexity: Small.

### Phase 3: What the app is + proof consolidation - ACTIVE

1. **[Component] Sharpen the feature sections.**
   - What: keep `AppFeaturePanel` and `AppStickyPhoneBlock`, sharpen each feature into a clear what-it-is plus why-it-matters. Upgrade weak spots.
   - Dependencies: Phase 1.
   - Complexity: Medium.
   - Files: `app/components/app/AppFeaturePanel.tsx`, `app/components/app/AppStickyPhoneBlock.tsx`.

2. **[Component] Consolidate proof.**
   - What: tighten the scattered validation and athlete data (`AppWidgetGrid`) into one coherent proof beat; rework `AppInsightsCallout` into a clean link-out to `/app-insights` instead of pulling focus.
   - Dependencies: Phase 1.
   - Complexity: Medium.
   - Files: `app/components/app/AppWidgetGrid.tsx`, `app/components/app/AppInsightsCallout.tsx`.

### Phase 4: The model + CTA - ACTIVE

1. **[Component] Free-vs-subscriber model section.**
   - What: the model, led by the free-for-everyone mission framing, then the CONKA-subscriber unlocks (full health-metric tracking, rewards and merch, first access to new features).
   - Dependencies: Phase 1.
   - Complexity: Medium.
   - Files: `app/components/app/AppDownloadSection.tsx` (rework) or new component.

2. **[Component] Download CTA.**
   - What: clean final CTA to install the app.
   - Dependencies: task 1.
   - Complexity: Small.
   - Files: `app/components/app/AppDownloadSection.tsx`.

## Future phases (not ticketed)

- **Phase 5: Dedup, cross-links, SEO, analytics, cleanup.** Tie the app's measurement role into `/our-story` origin; wire the home `AppUSPSection` and `/app-insights` links; retire any dead components; metadata, OG, and JSON-LD; section-engagement analytics following `app/lib/analytics.ts`; complete the server-first refactor; final dark-theme mobile pass.

## Rabbit holes

- **The live cognitive test (Cognetivity SDK).** Reuse it. Improve onboarding and results framing only; do not rebuild the engine.
- **Inventing free-versus-paid specifics** beyond the confirmed model (free test for all; subscriber gets full tracking, rewards and merch, early access).
- **Brain-scan origin accuracy.** Use the confirmed facts (fMRI and EEG, Newcastle, concussions) and the brand story foundation; no new medical claims.
- **Redesigning `/app-insights`.** Out of scope. Link to it.

## No-gos

- No rebuilding the cognitive test engine.
- No free-versus-paid claims beyond the confirmed model.
- No single-product emphasis; no off-grammar dark styling (no pure black, no new opacity stops outside multiples of 5, no dot-grid variants).
- No duplicating `/app-insights` data.

## Risks

- **Brand-story accuracy.** The origin uses real medical detail (concussion, fMRI, EEG); keep it human and honest, no clinical overclaim.
- **Copy is the deliverable.** Content-heavy; each section needs the user's voice and a per-section visual review.
- **Client-heavy live test on a dark page.** Watch performance and the mobile-versus-desktop test split.

## Resolved decisions (from open questions)

- **Humphrey origin: confirmed.** fMRI and EEG, Newcastle University, during his concussions. Supported by `BRAND_STORY_FOUNDATION.pdf` ("brain scans showed positive movement").
- **The full cognitive test is free for everyone**, intentionally, as access to the technology for all (not gated behind subscription).
- **Subscriber unlocks** full health-metric tracking alongside CONKA and cognition, rewards and merch, and first access to new features (the early-access line is confirmed in scope).

## References

- Current code: `app/app/page.tsx`, `app/components/app/*`, `app/components/cognitive-test/*`
- Overlap: `app/app-insights/page.tsx`, `app/our-story/page.tsx`, `app/components/home/AppUSPSection.tsx`
- App assets: `public/app/` (phone screens, score ring, widgets), `public/TwoFounders.jpg`
- Brand story: `docs/branding/BRAND_STORY_FOUNDATION.pdf`
- Design system: `docs/branding/DESIGN_SYSTEM.md` (sections 8 and 10, dark-canvas grammar, read-vs-scan typography, FigurePlate)
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Sibling plan (structure and tone to mirror): `docs/development/featurePlans/science-page-rebuild.md`

## Jira tickets

Created in Sprint 27, assigned to Rudh, under the Website & CRO epic (SCRUM-763, drag into place on the board). Active phases (1-4) ticketed; Phase 5 stays in this doc until promoted.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1072 | App page rebuild Phase 1: spine - hero thesis + why/origin | 1 | To Do |
| SCRUM-1073 | App page rebuild Phase 2: the test, explained + de-blackbox | 2 | To Do |
| SCRUM-1074 | App page rebuild Phase 3: what the app is + proof consolidation | 3 | To Do |
| SCRUM-1075 | App page rebuild Phase 4: the free-vs-subscriber model + CTA | 4 | To Do |
