# Clinical trio-header sweep audit

Status: audit complete. Edits not started.
Authoritative spec: `docs/branding/CLINICAL_AESTHETIC.md` (sections: Trio header, Topic codes, Typography rules, Do not).
Branch: `product-page-and-home-page-improvement`.

## Summary

Total clinical-scoped pages audited: 12.
- `/funnel` (`app/funnel/FunnelClient.tsx`) is a 2-step checkout UI with no trio-header sections — no section-level components to audit.
- All other 11 pages have trio-header sections in scope.

Total unique section-level components found: 39 (includes the five previously reviewed "landing" components — `LandingHero`, `LandingProductShowcase`, `LandingDailyBenefits`, `LandingTestimonials`, `LandingValueComparison` — plus labelled sections from every other surface).

| Status | Count |
|--------|-------|
| Already conforming | 1 (`AppUSPSection`) |
| Needs eyebrow change only (add `//` + topic code) | 22 |
| Needs heading color fix only (remove accent span / navy) | 0 |
| Needs sub-line change only | 0 |
| Needs multiple changes (eyebrow + heading and/or sub-line) | 7 |
| Missing trio entirely — needs rebuild | 3 (`TestimonialsAutoScrollStrip`, `ProtocolCalendar`, `ProtocolCalendarMobile`) |
| Hero components (product / protocol PDP heros) — no trio pattern, out of scope for this sweep | 4 (`ProductHero`, `ProductHeroMobile`, `ProtocolHero`, `ProtocolHeroMobile`) |
| Other content-only non-trio sections — out of scope for this sweep | 2 (`LandingDisclaimer` legal footnote, `ScienceQuote` quote block with valid document-code eyebrow) |

Everything else either has no trio and is a card/carousel primitive used inside another section, or has been flagged below.

## Components at a glance

| Component | Pages | Current eyebrow | Eyebrow status | Heading issues | Sub-line status | Proposed topic code |
|-----------|-------|-----------------|----------------|----------------|-----------------|---------------------|
| `AppUSPSection` (`app/components/home/AppUSPSection.tsx`) | / | `{"// Proof, not promises · APP-01"}` | conforms | single black | conforms (5 words) | `APP-01` |
| `LandingHero` (`app/components/landing/LandingHero.tsx`) | /, /start | `"// A New State Of Mind"` | missing topic code | single black | no sub-line (stats strip used instead) | `CONKA-03` |
| `LandingProductShowcase` (`app/components/landing/LandingProductShowcase.tsx`) | /, /start, /protocol/[id] | `"// The Formulation"` | missing topic code | single black (uses `brand-h1` but no override) | no mono sub-line (uses body paragraph) | `CONKA-03` |
| `AthleteCredibilityCarousel` (`app/components/AthleteCredibilityCarousel.tsx`) | / | `"Athlete Roster · Performance Proof"` | missing `//` + topic code | single black | conforms (7 words) | `PROOF-01` |
| `ProductGrid` (desktop in `app/components/home/ProductGrid.tsx`, mobile in `ProductGridMobile.tsx`; copy in `productGridCopy.tsx`) | /, /conka-flow, /conka-clarity, /protocol/[id] | landing: `"Find Your Formula · Build Your Routine"`; cross-sell: `"More From CONKA · Complete Your Stack"` | missing `//` + topic code | single black | conforms | `CONKA-03` (landing) · `CONKA-03` (cross-sell) |
| `LabCaseStudies` (`app/components/LabCaseStudies.tsx`) | /, /start, /app | `"Clinical Outcomes · Cognitive Function Score"` | missing `//` + topic code | single black; uses `brand-h1 mb-0` | no mono sub-line present (heading is followed directly by dataset strip) | `PROOF-01` |
| `LandingDailyBenefits` (`app/components/landing/LandingDailyBenefits.tsx`) | /, /start | `"Daily Benefits"` | missing `//` + topic code | single black (uses `brand-h1` with legacy tracking var, no override) | no mono sub-line | `SCI-01` |
| `WhyConkaWorksDesktop` (`app/components/WhyConkaWorksDesktop.tsx`) | / | `"Credentials · Testing · Manufacturing"` | missing `//` + topic code | single black | conforms (6 words) | propose `TRUST-01` (new) |
| `WhyConkaWorksMobile` (`app/components/WhyConkaWorksMobile.tsx`) | / | `"Credentials · Testing · Manufacturing"` | missing `//` + topic code | single black | conforms (4 words) | propose `TRUST-01` (new) |
| `LabTimeline` (`app/components/landing/LabTimeline.tsx`) | /, /start, /protocol/[id] | `"Expected Outcomes · Timeline"` | missing `//` + topic code | single black | conforms (8 words) | propose `TIME-01` (new) |
| `LandingTestimonials` (`app/components/landing/LandingTestimonials.tsx`) | /, /start, /protocol/[id] | `"Field Observations"` | missing `//` + topic code | single black; uses `brand-h2` with legacy tracking var, no override | conforms (4 words) | `PROOF-03` |
| `LabFAQ` (`app/components/landing/LabFAQ.tsx`) | /, /start, /protocol/[id] | `"Common Questions"` | missing `//` + topic code | single black (uses `brand-h1 mb-0`) | no mono sub-line (direct `Q&A` table follows) | `FAQ-01` |
| `LandingValueComparison` (`app/components/landing/LandingValueComparison.tsx`) | /start | `"// Get More For Less"` | missing topic code | single black | no mono sub-line (body paragraph used) | propose `VALUE-01` (new) |
| `LabGuarantee` (`app/components/landing/LabGuarantee.tsx`) | /start, /protocol/[id] | `"Trial Terms · Protocol 100"` | missing `//` + topic code | single black | no mono sub-line | `PROOF-02` |
| `ScienceHero` (`app/components/science/ScienceHero.tsx`) | /science | `"The Science · Peer-Reviewed · Measured"` | missing `//` + topic code | single black | conforms (9 words) | `SCI-02` |
| `ScienceAdaptogens` (`app/components/science/ScienceAdaptogens.tsx`) | /science | `"The Foundation · Mechanism · Pre-Stimulant"` | missing `//` + topic code | single black | conforms (7 words) | `SCI-01` |
| `SciencePillars` (`app/components/science/SciencePillars.tsx`) | /science | `"The Five Pillars · 05 Systems · Interconnected"` | missing `//` + topic code | single black | conforms (6 words) | `SCI-01` |
| `FlowVsClear` (`app/components/science/FlowVsClear.tsx`) | /science | `"Formula Comparison · 02 Formulas · 05 Pillars"` | missing `//` + topic code | single black | conforms (8 words) | `CONKA-03` |
| `ScienceDifferent` (`app/components/science/ScienceDifferent.tsx`) | /science | `"Our Approach · 03 Principles · Non-Negotiable"` | missing `//` + topic code | single black | conforms (4 words) | `SCI-01` |
| `EvidenceSummary` (`app/components/science/EvidenceSummary.tsx`) | /science | `"The Evidence · Research-Backed · Patented"` | missing `//` + topic code | single black | conforms (6 words) | `SCI-02` |
| `OurStoryHero` (`app/components/our-story/OurStoryHero.tsx`) | /our-story | `"Our Story · Founders · Research · Mission"` | missing `//` + topic code | single black | conforms (6 words) | `STORY-01` |
| `StorySection` (`app/components/our-story/StorySection.tsx`) | /our-story (×N) | `"{01..N} / {N} · Chapter"` | missing `//` + topic code | single black (subtitle is optional mono sub-line, conforms when present) | conforms when present | `STORY-01` |
| `OurStoryCTA` (`app/components/our-story/OurStoryCTA.tsx`) | /our-story | `"Join the Journey · Balance Protocol · Start here"` | missing `//` + topic code | single black | conforms (10 words — at limit) | `CONKA-03` |
| `CaseStudiesPageDesktop` (`app/components/case-studies/CaseStudiesPageDesktop.tsx`) | /case-studies | `"Research & Results · Peer-Validated · Measured"` (main hero); inner featured-section strip `"Featured · NN Studies"` | missing `//` + topic code | single black | conforms (H1 sub-line 10 words) | `PROOF-01` |
| `CaseStudiesPageMobile` (`app/components/case-studies/CaseStudiesPageMobile.tsx`) | /case-studies | `"Research & Results · Peer-Validated"` | missing `//` + topic code | single black | conforms (8 words) | `PROOF-01` |
| `IngredientsPageDesktop` (`app/components/ingredients/IngredientsPageDesktop.tsx`) | /ingredients | `"Formula Inputs · Sourced · Tested"` | missing `//` + topic code | single black | conforms (6 words) | `ING-01` |
| `IngredientsPageMobile` (`app/components/ingredients/IngredientsPageMobile.tsx`) | /ingredients | `"Formula Inputs · Sourced · Tested"` | missing `//` + topic code | single black | conforms (6 words) | `ING-01` |
| `AppHero` (`app/components/app/AppHero.tsx`) | /app | `"The CONKA App · Measured Brain Performance"` (verbatim — starts without `//`) | missing `//` + topic code | single black | conforms | `APP-01` |
| `AppStickyPhoneBlock` / `AppStickyPhoneBlockMobile` (`app/components/app/AppStickyPhoneBlock.tsx`, `AppStickyPhoneBlockMobile.tsx`) | /app | top eyebrow: `"The App · 04 Features · Measurable"` | missing `//` + topic code | **heading uses `<span className="text-[#1B2757]">` accent** via `data.headingAccent` (desktop + mobile `SectionContent`); top trio heading is plain black | top sub-line on desktop is missing; mobile has `"Swipe · Tap arrows · Tap dots"` (conforms) | `APP-01` |
| `AppSubscribersSection` (`app/components/app/AppSubscribersSection.tsx`) | /app | `"Subscriber Rewards · Points · Perks"` (verbatim — starts without `//`) | missing `//` + topic code | single black | conforms | `APP-01` |
| `AppDownloadSection` (`app/components/app/AppDownloadSection.tsx`) | /app | `"Download · iOS · Android"` (verbatim — starts without `//`) | missing `//` + topic code | single black | conforms | `APP-01` |
| `AppComparisonTable` (`app/components/app/AppComparisonTable.tsx`) | /app | `"Comparison · CONKA vs Generic"` (verbatim — starts without `//`) | missing `//` + topic code | single black | conforms | `APP-01` |
| `CognitiveTestSection` / `CognitiveTestSectionMobile` (`app/components/cognitive-test/…`) | /app | `"Test Your Brain · Cognetivity SDK · 2-Min Assessment"` (desktop) · `"Test Your Brain · Cognetivity SDK · 2-Min"` (mobile) | missing `//` + topic code | single black | conforms (both: 6 words) | `APP-01` |
| `WhyConkaHero` / `WhyConkaHeroMobile` (`app/components/why-conka/…`) | /why-conka | `"// The CONKA framework · 07 reasons"` | missing topic code | single black | conforms (both) | `WHY-01` (new — `STORY-01` fits narrative, but /why-conka is a dedicated surface; see "Proposed new topic codes") |
| `WhyConkaSection` (`app/components/why-conka/WhyConkaSection.tsx`) | /why-conka (×N) | `"R-{NN} · Reason NN / 07"` | missing `//` + topic code | heading itself is single black; but the **large subheading paragraph directly below** uses `text-[#1B2757]` — sits in the heading slot visually and functions as a sub-headline | subheading is navy-coloured paragraph, not mono | `WHY-01` (new) |
| `WhyConkaCTA` (`app/components/why-conka/WhyConkaCTA.tsx`) | /why-conka | `"Recommended start · Balance protocol · F-03"` | missing `//` + topic code | single black | conforms | `CONKA-03` |
| `FormulaBenefitsStats` / `FormulaBenefitsStatsMobile` / `FormulaBenefitsStatsDesktop` (`app/components/product/…`) | /conka-flow, /conka-clarity | `"Measured Outcomes · Clinical Validation"` | missing `//` + topic code | single black | conforms (5 words) | `PROOF-01` |
| `FormulaIngredients` (`app/components/product/FormulaIngredients.tsx`) | /conka-flow, /conka-clarity | `"Formula Inputs · Sourced · Tested"` | missing `//` + topic code | single black | conforms (6 words) | `ING-01` |
| `FormulaBenefits` / `FormulaBenefitsMobile` (`app/components/product/…`) | /conka-flow, /conka-clarity | `"Outcome Profile · Peer-reviewed Evidence"` / `"Outcome Profile · Peer-Reviewed Evidence"` | missing `//` + topic code | single black | conforms (5 words) | `SCI-02` |
| `HowItWorks` (`app/components/product/HowItWorks.tsx`) | /conka-flow, /conka-clarity | `"Protocol · Three Steps · Proven"` | missing `//` + topic code | single black | conforms (5 words) | `SCI-01` |
| `FormulaFAQ` (`app/components/product/FormulaFAQ.tsx`) | /conka-flow, /conka-clarity | `"Common Questions"` | missing `//` + topic code | single black (uses `brand-h1 mb-0`) | no mono sub-line (direct `Q&A` table follows) | `FAQ-01` |
| `WhatToExpectDesktop` / `WhatToExpectMobile` (`app/components/home/…`) | /conka-flow, /conka-clarity | `"Protocol Timeline · Day 1 → Day 90"` | missing `//` + topic code | single black | conforms (6 words) | `SCI-01` |
| `FormulaCaseStudies` / `FormulaCaseStudiesMobile` (`app/components/FormulaCaseStudies.tsx`) | /conka-flow, /conka-clarity, /protocol/[id] | `"Verified Results · Measured Outcomes"` | missing `//` + topic code | single black | conforms (6 words) | `PROOF-01` |
| `TestimonialsAutoScrollStrip` (`app/components/testimonials/TestimonialsAutoScrollStrip.tsx`, invoked via `Testimonials.tsx`) | /conka-flow, /conka-clarity | **no eyebrow at all** | missing | **heading centered** (`text-center`, `brand-h2` with no tracking override) — and subtitle is italic body text, not mono | missing entirely | `PROOF-03` |
| `ProtocolCalendar` / `ProtocolCalendarMobile` (`app/components/protocol/…`) | /protocol/[id] | **no eyebrow** | missing | **centered heading** with italic `brand-caption` subtitle ("visualize your journey") — legacy pre-clinical pattern | missing | `CONKA-03` |

## Per-component detail

Covers only the components that need changes. Components already conforming, or heros/cards/primitives out of scope, are listed in the tables above without further detail.

### `LandingHero` (`app/components/landing/LandingHero.tsx`)

Used on: / · /start

Current eyebrow (`LandingHero.tsx:59` mobile, `:90` desktop): `"// A New State Of Mind"`
Current heading (`:62` mobile, `:94` desktop): single `text-black` — conforms.
Current sub-line: none; a three-cell `StatStrip` fills that slot. Acceptable — the trio spec does not require a mono sub-line when the heading's evidence lives in a strip directly beneath it. However, no change needed here as the stat strip is an established clinical pattern.

Proposed changes:
- Eyebrow (both mobile + desktop) → `{"// A new state of mind · CONKA-03"}` (append topic code; wrap in JSX string literal so `react/jsx-no-comment-textnodes` is quiet).

### `LandingProductShowcase` (`app/components/landing/LandingProductShowcase.tsx`)

Used on: / · /start · /protocol/[id]

Current eyebrow (`:9`): `"// The Formulation"`
Current heading (`:12`): single `text-black`, but uses `style={{ letterSpacing: "var(--letter-spacing-premium-title)" }}` — clinical spec prefers inline `letterSpacing: "-0.02em"`. Low priority but note.
Current sub-line: none (body paragraph in `:18` follows instead). Acceptable.

Proposed changes:
- Eyebrow → `{"// The formulation · CONKA-03"}`.
- Optional: swap heading inline style to `letterSpacing: "-0.02em"` for consistency with other clinical surfaces.

### `AthleteCredibilityCarousel` (`app/components/AthleteCredibilityCarousel.tsx`)

Used on: /

Current eyebrow (`:198`): `"Athlete Roster · Performance Proof"`
Current heading (`:201`): single `text-black` — conforms.
Current sub-line (`:207`): `"N=7 · Olympic · WBO · IBO · Team GB · England"` — conforms (7 words).

Proposed changes:
- Eyebrow → `{"// Athlete roster · PROOF-01"}`.

### `ProductGrid` (desktop, mobile, tablet; copy lives in `productGridCopy.tsx`)

Used on: / (landing copy) · /conka-flow, /conka-clarity, /protocol/[id] (cross-sell copy)

Current landing eyebrow (`productGridCopy.tsx:12`): `"Find Your Formula · Build Your Routine"`
Current cross-sell eyebrow (`productGridCopy.tsx:18`): `"More From CONKA · Complete Your Stack"`
Current heading / sub-line: single black heading; mono sub-line conforms on both variants.

Proposed changes:
- Update `LANDING.eyebrow` → `"// Build your routine · CONKA-03"`.
- Update `CROSS_SELL.eyebrow` → `"// Complete your stack · CONKA-03"`.
- No changes to headings or sub-lines.
- Note: the eyebrow renders via `{copy.eyebrow}` in JSX — the `//` prefix in the data string does not trigger the lint rule, but verify at build time.

### `LabCaseStudies` (`app/components/LabCaseStudies.tsx`)

Used on: / · /start · /app

Current eyebrow (`:181`): `"Clinical Outcomes · Cognitive Function Score"`
Current heading (`:187`): single black, multi-line.
Current sub-line: none — heading is followed directly by the dataset strip (5,000+ / 150+ / +28.96%).

Proposed changes:
- Eyebrow → `{"// Clinical outcomes · PROOF-01"}`.
- Add a mono sub-line directly under the heading summarising the dataset, e.g. `"N=150+ participants · 5,000+ tests · +28.96% avg lift"` (~8 words, middle-dot separated). This keeps the existing dataset strip below but gives the trio its required third element.

### `LandingDailyBenefits` (`app/components/landing/LandingDailyBenefits.tsx`)

Used on: / · /start

Current eyebrow (`:114`): `"Daily Benefits"` — two words, no topic code, no `//`.
Current heading (`:117`): single black but uses legacy tracking var.
Current sub-line: none (body paragraph inside the card column follows).

Proposed changes:
- Eyebrow → `{"// Daily benefits · SCI-01"}`.
- Add a mono sub-line under the heading, e.g. `"Mental performance · Sustained energy · Brain health"` (6 words).
- Optional: swap heading tracking from `var(--letter-spacing-premium-title)` to `-0.02em` for clinical consistency.

### `WhyConkaWorksDesktop` + `WhyConkaWorksMobile` (`app/components/WhyConkaWorksDesktop.tsx`, `WhyConkaWorksMobile.tsx`)

Used on: /

Current eyebrow (`WhyConkaWorksDesktop.tsx:51`, `WhyConkaWorksMobile.tsx:68`): `"Credentials · Testing · Manufacturing"`
Current heading: single black; `"Certified for Performance."` conforms.
Current sub-line: conforms on both.

Proposed changes:
- Eyebrow → `{"// Credentials · TRUST-01"}` (new topic code — see Proposed new topic codes).
- No heading or sub-line changes.

### `LabTimeline` (`app/components/landing/LabTimeline.tsx`)

Used on: / · /start · /protocol/[id]

Current eyebrow (`:195`): `"Expected Outcomes · Timeline"`
Current heading (`:198`): single black, has a `<sup>` for `^^` footnote — acceptable.
Current sub-line (`:205`): `"Based on N=150+ participants · 5,000+ cognitive tests"` — conforms (8 words).

Proposed changes:
- Eyebrow → `{"// Expected outcomes · TIME-01"}` (new topic code — see Proposed new topic codes).

### `LandingTestimonials` (`app/components/landing/LandingTestimonials.tsx`)

Used on: / · /start · /protocol/[id]

Current eyebrow (`:314`): `"Field Observations"` — two words, no topic code, no `//`.
Current heading (`:320`): single black (uses `brand-h2` with legacy tracking var).
Current sub-line (`:326`): `"N=500+ · Verified reviews"` — conforms.

Proposed changes:
- Eyebrow → `{"// Field observations · PROOF-03"}`.
- Optional: swap heading tracking to `-0.02em`.

### `LabFAQ` (`app/components/landing/LabFAQ.tsx`)

Used on: / · /start · /protocol/[id]

Current eyebrow (`:76`): `"Common Questions"` — two words, no topic code, no `//`.
Current heading (`:80`): single black (uses `brand-h1 mb-0`, no tracking override).
Current sub-line: none — a spec strip (`Section · Entries · Updated`) follows directly.

Proposed changes:
- Eyebrow → `{"// Common questions · FAQ-01"}`.
- Add mono sub-line, e.g. `"05 questions · Updated 2026-04 · 4h response"` (pull from the spec strip below). Optional but recommended — sub-line is required by the trio spec.
- Optional: add inline `letterSpacing: "-0.02em"` to the heading.

### `LandingValueComparison` (`app/components/landing/LandingValueComparison.tsx`)

Used on: /start

Current eyebrow (`:70`): `"// Get More For Less"`
Current heading (`:76`): single black; uses legacy tracking var.
Current sub-line: none (a body paragraph follows the heading).

Proposed changes:
- Eyebrow → `{"// Get more for less · VALUE-01"}` (new topic code — see Proposed new topic codes).
- Optional: swap heading tracking to `-0.02em`.
- Optional: add a mono sub-line, e.g. `"Coffee peaks 09 · Crashes 14 · CONKA 06–18"` (replaces or supplements the body paragraph).

### `LabGuarantee` (`app/components/landing/LabGuarantee.tsx`)

Used on: /start · /protocol/[id]

Current eyebrow (`:23`): `"Trial Terms · Protocol 100"`
Current heading (`:28`): single black, uses legacy tracking var.
Current sub-line: none (body paragraph follows).

Proposed changes:
- Eyebrow → `{"// Trial terms · PROOF-02"}`.
- Add a mono sub-line under the heading, e.g. `"100 days · Refund guaranteed · Install the app"` (8 words).
- Optional: swap heading tracking to `-0.02em`.

### `ScienceHero` (`app/components/science/ScienceHero.tsx`)

Used on: /science

Current eyebrow (`:14`): `"The Science · Peer-Reviewed · Measured"`
Current heading (`:17`): single black, conforms.
Current sub-line (`:23`): `"32 Studies · 6,000+ Participants · 16 Actives · £500K+ Research"` — 9 words, conforms.

Proposed changes:
- Eyebrow → `{"// The science · SCI-02"}`.

### `ScienceAdaptogens` (`app/components/science/ScienceAdaptogens.tsx`)

Used on: /science

Current eyebrow (`:27`): `"The Foundation · Mechanism · Pre-Stimulant"`
Current heading (`:30`): single black, conforms.
Current sub-line (`:36`): `"Natural compounds · HPA-axis modulators · Clinical evidence"` — 7 words, conforms.

Proposed changes:
- Eyebrow → `{"// The foundation · SCI-01"}`.

### `SciencePillars` (`app/components/science/SciencePillars.tsx`)

Used on: /science

Current eyebrow (`:27`): `"The Five Pillars · 05 Systems · Interconnected"`
Current heading (`:30`): single black, conforms.
Current sub-line (`:36`): `"Five systems · Mechanism-first · PubMed-linked"` — 6 words, conforms.

Proposed changes:
- Eyebrow → `{"// The five pillars · SCI-01"}`.

### `FlowVsClear` (`app/components/science/FlowVsClear.tsx`)

Used on: /science

Current eyebrow (`:26`): `"Formula Comparison · 02 Formulas · 05 Pillars"`
Current heading (`:29`): single black, conforms.
Current sub-line (`:35`): `"Two formulas · Distinct targets · Complete coverage together"` — 8 words, conforms.

Proposed changes:
- Eyebrow → `{"// Formula comparison · CONKA-03"}`.

### `ScienceDifferent` (`app/components/science/ScienceDifferent.tsx`)

Used on: /science

Current eyebrow (`:64`): `"Our Approach · 03 Principles · Non-Negotiable"`
Current heading (`:67`): single black, conforms.
Current sub-line (`:73`): `"Dose-led · Absorption-led · Verifiable"` — 4 words, conforms.

Proposed changes:
- Eyebrow → `{"// Our approach · SCI-01"}`.

### `EvidenceSummary` (`app/components/science/EvidenceSummary.tsx`)

Used on: /science

Current eyebrow (`:30`): `"The Evidence · Research-Backed · Patented"`
Current heading (`:33`): single black, conforms.
Current sub-line (`:39`): `"Durham · Cambridge · 32 peer-reviewed studies"` — 6 words, conforms.

Proposed changes:
- Eyebrow → `{"// The evidence · SCI-02"}`.
- Note: also contains an inner closing-CTA card with `"Recommended start · Balance protocol"` eyebrow. This matches the template in `docs/branding/CLINICAL_AESTHETIC.md` "Closing CTA card" pattern, which does NOT require a topic code (it's a card, not a section). Leave as-is.

### `OurStoryHero` (`app/components/our-story/OurStoryHero.tsx`)

Used on: /our-story

Current eyebrow (`:25`): `"Our Story · Founders · Research · Mission"`
Current heading (`:28`): single black, conforms.
Current sub-line (`:34`): `"£500,000 Research · Durham & Cambridge · Patented formula"` — 6 words, conforms.

Proposed changes:
- Eyebrow → `{"// Our story · STORY-01"}`.

### `StorySection` (`app/components/our-story/StorySection.tsx`)

Used on: /our-story (rendered once per story section, N=dependent on `storyData`)

Current eyebrow (`:27`): `"{NN} / {NN} · Chapter"`
Current heading (`:33`): single black, conforms.
Current sub-line (`:39`, when `section.subtitle` is set): mono, middle-dot separated; conforms.

Proposed changes:
- Eyebrow → prepend `// ` and append ` · STORY-01`, rendering as `{"// Chapter " + formattedId + "/" + formattedTotal + " · STORY-01"}` (pick a phrasing that flows). Note: keeping the `NN / NN` counter prefix inside a topic-coded eyebrow is legal — the topic code just needs to end the string.
- No heading / sub-line changes.

### `OurStoryCTA` (`app/components/our-story/OurStoryCTA.tsx`)

Used on: /our-story

Current eyebrow (`:6`): `"Join the Journey · Balance Protocol · Start here"`
Current heading (`:9`): single black, conforms.
Current sub-line (`:15`): `"100-Day money-back guarantee · Free UK shipping · Cancel anytime"` — 10 words (at limit), conforms.

Proposed changes:
- Eyebrow → `{"// Join the journey · CONKA-03"}`.

### `CaseStudiesPageDesktop` + `CaseStudiesPageMobile` (`app/components/case-studies/…`)

Used on: /case-studies

Current hero eyebrow (desktop `:48`, mobile `:111`): `"Research & Results · Peer-Validated · Measured"` / `"Research & Results · Peer-Validated"`
Current heading: single black, conforms.
Current sub-line: conforms.
Additional inner eyebrows (desktop `:94`): `"Featured · NN Studies"` — this is a secondary strip header, not a section-level trio. Leave as-is.
Closing CTA card (`desktop :258`): `"Start your journey · Balance Protocol"` — matches `Closing CTA card` pattern in the spec, leave as-is.

Proposed changes:
- Desktop hero eyebrow → `{"// Research & results · PROOF-01"}`.
- Mobile hero eyebrow → `{"// Research & results · PROOF-01"}`.

### `IngredientsPageDesktop` + `IngredientsPageMobile` (`app/components/ingredients/…`)

Used on: /ingredients

Current eyebrow (desktop `:57`, mobile `:58`): `"Formula Inputs · Sourced · Tested"`
Current heading (desktop `:60`, mobile `:61`): single black, conforms.
Current sub-line (desktop `:66`, mobile `:67`): `"NN Ingredients · Clinical doses · Peer-reviewed"` — 6 words, conforms.
Desktop also has two inner section-level trios (`:192` and `:234`, bodied by `brand-h2`) for secondary sections — audit their text at implementation time; they follow the same pattern and need the same treatment. Mobile has 5+ sub-section `h3` headers (`:161`, `:175`, `:190`, `:203`, `:223`) that are likely in-card headings rather than section trios; flag at implementation time.

Proposed changes:
- Desktop eyebrow (hero) → `{"// Formula inputs · ING-01"}`.
- Mobile eyebrow (hero) → `{"// Formula inputs · ING-01"}`.
- Secondary section eyebrows on desktop (lines 192, 234) and any sub-section headers that function as section trios on mobile: apply the same rule — add `//` and the appropriate topic code (`ING-01` for ingredient-lens sections).

### `AppHero` (`app/components/app/AppHero.tsx`)

Used on: /app

Current eyebrow (`:46`): `"The CONKA App · Measured Brain Performance"`
Current heading (`:49`): single black, conforms.
Current sub-line (`:55`): conforms.

Proposed changes:
- Eyebrow → `{"// The CONKA app · APP-01"}`.

### `AppStickyPhoneBlock` + `AppStickyPhoneBlockMobile` (`app/components/app/AppStickyPhoneBlock.tsx`, `AppStickyPhoneBlockMobile.tsx`)

Used on: /app

This is the highest-friction component in the audit. Two issues:

**Issue 1 — Top trio header eyebrow.**
Current eyebrow (desktop `:277`, mobile `:191`): `"The App · 04 Features · Measurable"` — missing `//` and topic code.
Top heading (desktop `:280` `brand-h3`, mobile `:194` `brand-h2`) is single black.
Top sub-line: desktop has no sub-line below the top heading; mobile has `"Swipe · Tap arrows · Tap dots"` (conforms).

**Issue 2 — Inner per-step sub-section headings have navy accent spans.**
Desktop `SectionContent` (`AppStickyPhoneBlock.tsx:119–134`) renders:
```tsx
<h2 className="brand-h2 text-black mb-3 max-w-[22ch]">
  {headingParts.map(...)}
  {data.headingAccent && (<><span className="text-[#1B2757]">{data.headingAccent}</span></>)}
</h2>
```
Mobile `SectionContent` (`AppStickyPhoneBlockMobile.tsx:101–117`) has the same pattern.

`SECTIONS_DATA[0]` in `appStickyPhoneBlockData.ts:22–37` sets `headingAccent: "This one can't."` — this is a violation of "Headings are single `text-black`".

Each inner step also has a mono eyebrow (desktop `SectionContent:116`, mobile `:?`): `"{NN} / {NN} · {eyebrow || 'App Feature · Measurable'}"`. This counter-prefixed eyebrow does not carry `//` + topic code. Per the spec each section eyebrow should — but the per-step eyebrows here are sub-section eyebrows inside a single parent section, not a fresh section. Judgement call: the parent section's trio header carries the topic code; the inner counters serve the element-counter role. **Recommend leaving inner counters as-is** and treating only the top trio as the section trio.

Proposed changes:
- Top trio eyebrow (desktop + mobile) → `{"// Four features · APP-01"}`.
- Top heading (desktop `brand-h3` `"Four features. One outcome: measurable brain performance."`, mobile `brand-h2` `"Four features. One outcome."`) — no change.
- Desktop: add a mono sub-line under the top heading, e.g. `"Test · Track · Trend · Compete"` (4 words) so both mobile and desktop have a complete trio.
- Inner `SectionContent` heading accent — remove the `<span className="text-[#1B2757]">` wrapping for `headingAccent` in **both** files; render `data.headingAccent` inline as plain black (append as continuation of the heading).
- Drop or reword `SECTIONS_DATA[0].headingAccent` in `appStickyPhoneBlockData.ts` — either merge "This one can't." into the main heading (so the heading reads `"Most cognitive tests get easier with practice. This one can't."`) or delete the accent entirely. Data-layer decision; recommend merging into `heading`.
- Once all `headingAccent` values are merged into `heading`, the `headingAccent` field can be removed from the `SectionData` type and both components — cleaner.
- Do not touch the per-step counter eyebrows (element counters, not topic eyebrows).

### `AppSubscribersSection` (`app/components/app/AppSubscribersSection.tsx`)

Used on: /app

Current eyebrow (`:16`): verbatim content starts without `//`.
Current heading (`:19`): single black, conforms.
Current sub-line (`:25`): conforms.

Proposed changes:
- Eyebrow → `{"// Subscriber rewards · APP-01"}` (match current concept).

### `AppDownloadSection` (`app/components/app/AppDownloadSection.tsx`)

Used on: /app

Current eyebrow (`:44`): verbatim content starts without `//`.
Current heading (`:47`): single black, conforms.
Current sub-line (`:53`): conforms.

Proposed changes:
- Eyebrow → `{"// Download · APP-01"}` (or similar concept).

### `AppComparisonTable` (`app/components/app/AppComparisonTable.tsx`)

Used on: /app

Current eyebrow (`:57`): verbatim content starts without `//`.
Current heading (`:60`): single black, conforms.
Current sub-line (`:66`): conforms.

Proposed changes:
- Eyebrow → `{"// Comparison · APP-01"}`.

### `CognitiveTestSection` + `CognitiveTestSectionMobile` (`app/components/cognitive-test/…`)

Used on: /app

Current eyebrow (desktop `:107`, mobile `:107`): `"Test Your Brain · Cognetivity SDK · 2-Min Assessment"` / `"Test Your Brain · Cognetivity SDK · 2-Min"`
Current heading (desktop `:110`, mobile `:110`): single black, conforms.
Current sub-line (desktop `:117`, mobile `:117`): conforms.

Proposed changes:
- Desktop eyebrow → `{"// Test your brain · APP-01"}`.
- Mobile eyebrow → `{"// Test your brain · APP-01"}`.

### `WhyConkaHero` + `WhyConkaHeroMobile` (`app/components/why-conka/…`)

Used on: /why-conka

Current eyebrow (desktop `:27`, mobile `:25`): `"// The CONKA framework · 07 reasons"` — has `//` but no topic code.
Current heading: single black, conforms.
Current sub-line: conforms.

Proposed changes:
- Eyebrow → `{"// The CONKA framework · WHY-01"}` (new topic code — see Proposed new topic codes).

### `WhyConkaSection` (`app/components/why-conka/WhyConkaSection.tsx`)

Used on: /why-conka (rendered once per `whyConkaPoints` entry)

Current eyebrow (`:50`): `"R-NN · Reason NN / 07"` — element-counter-style, missing `//` + topic code.
Current heading (`:53`): single black.
**Issue:** The paragraph immediately under the heading (`:61–68`) is `text-[#1B2757]` — navy-coloured body copy sitting in what reads as the sub-line slot. The spec reserves navy for interactive elements and says "Do not colour headings". This subheading paragraph is not a heading, but colour-wise is decorative navy which reads as the same visual function as an accent heading. Worth flagging for colour fix.
Current sub-line (mono): none — the navy paragraph replaces it.

Proposed changes:
- Eyebrow → `{"// Reason " + formattedId + "/" + formattedTotal + " · WHY-01"}` (keeping counter, new topic code).
- Change the `text-[#1B2757]` subheading paragraph to `text-black` (maybe `text-black/80`). Optionally replace with a proper mono sub-line if the data allows.

### `WhyConkaCTA` (`app/components/why-conka/WhyConkaCTA.tsx`)

Used on: /why-conka

Current eyebrow (`:9`): `"Recommended start · Balance protocol · F-03"` — this is a *closing CTA card* pattern (matches the spec template). It's inside a card, not a section wrapper. Technically the spec's Closing-CTA-card example uses an eyebrow without a topic code. **Judgement call:** leave as-is (closing-CTA card exception), or add topic code for consistency. Recommend leaving, but note.

Proposed changes:
- Optional: eyebrow → `{"// Recommended start · CONKA-03"}` if a unified trio style is preferred across CTA cards too. The spec's closing-CTA-card example does not require it, so this is an optional nicety.

### `FormulaBenefitsStats*` (`app/components/product/FormulaBenefitsStats.tsx`, `FormulaBenefitsStatsDesktop.tsx`, `FormulaBenefitsStatsMobile.tsx`)

Used on: /conka-flow · /conka-clarity

Current eyebrow (desktop `:46`, mobile `:47`): `"Measured Outcomes · Clinical Validation"`
Current heading: single black (formula subheadline).
Current sub-line: conforms.

Proposed changes:
- Eyebrow → `{"// Measured outcomes · PROOF-01"}`.

### `FormulaIngredients` (`app/components/product/FormulaIngredients.tsx`)

Used on: /conka-flow · /conka-clarity

Current eyebrow (`:203`): `"Formula Inputs · Sourced · Tested"`
Current heading (`:206`): single black, conforms.
Current sub-line (`:212`): conforms.

Proposed changes:
- Eyebrow → `{"// Formula inputs · ING-01"}`.

### `FormulaBenefits` + `FormulaBenefitsMobile` (`app/components/product/…`)

Used on: /conka-flow · /conka-clarity

Current eyebrow (desktop `:19`, mobile `:231`): `"Outcome Profile · Peer-reviewed Evidence"` / `"Outcome Profile · Peer-Reviewed Evidence"`
Current heading: single black, conforms.
Current sub-line: conforms.

Proposed changes:
- Eyebrow → `{"// Outcome profile · SCI-02"}` (both).
- Normalise capitalisation in passing.

### `HowItWorks` (`app/components/product/HowItWorks.tsx`)

Used on: /conka-flow · /conka-clarity

Current eyebrow (`:82`): `"Protocol · Three Steps · Proven"`
Current heading (`:85`): single black, conforms.
Current sub-line (`:92`): conforms.

Proposed changes:
- Eyebrow → `{"// Protocol · SCI-01"}`.

### `FormulaFAQ` (`app/components/product/FormulaFAQ.tsx`)

Used on: /conka-flow · /conka-clarity

Same situation as `LabFAQ`.

Proposed changes:
- Eyebrow → `{"// Common questions · FAQ-01"}`.
- Add mono sub-line under heading.
- Optional: add inline `letterSpacing: "-0.02em"` to heading.

### `WhatToExpectDesktop` + `WhatToExpectMobile` (`app/components/home/…`)

Used on: /conka-flow · /conka-clarity

Current eyebrow (desktop `:32`, mobile `:28`): `"Protocol Timeline · Day 1 → Day 90"`
Current heading: single black, conforms.
Current sub-line: conforms.

Proposed changes:
- Eyebrow → `{"// Protocol timeline · SCI-01"}`.

### `FormulaCaseStudies` + `FormulaCaseStudiesMobile` (`app/components/FormulaCaseStudies.tsx`)

Used on: /conka-flow · /conka-clarity · /protocol/[id]

Current eyebrow (desktop `:199`, mobile `:260`): `"Verified Results · Measured Outcomes"`
Current heading: single black, conforms.
Current sub-line: conforms.

Proposed changes:
- Eyebrow → `{"// Verified results · PROOF-01"}`.

### `TestimonialsAutoScrollStrip` (`app/components/testimonials/TestimonialsAutoScrollStrip.tsx`)

Used on: /conka-flow · /conka-clarity (via `Testimonials` wrapper)

**Pre-clinical pattern.** No mono eyebrow. Heading is centered (`text-center`) and uses legacy `brand-h2` with no letter-spacing override. Subtitle is italic body copy via `TestimonialsSubtitle`, not mono.

Proposed changes:
- Add a mono eyebrow above the heading: `{"// Real people, real results · PROOF-03"}` (or move the heading into a left-aligned trio).
- Change the heading container from `text-center` to left-aligned (match other clinical sections). Add inline `letterSpacing: "-0.02em"`.
- Replace the italic `TestimonialsSubtitle` block with a mono, middle-dot-separated sub-line: e.g. `"N=500+ · Verified · 4.7/5"` (or match what `LandingTestimonials` uses).
- This is a bigger rework than the rest — note as "larger edit" for implementation.

### `ProtocolCalendar` + `ProtocolCalendarMobile` (`app/components/protocol/…`)

Used on: /protocol/[id] (only for non-Balance protocols: `selectedProtocolId !== "3"`)

**Pre-clinical pattern.** No mono eyebrow. Heading is centered with an italic `brand-caption` subtitle ("visualize your journey"). No trio.

Proposed changes:
- Add a mono eyebrow: `{"// Protocol cadence · CONKA-03"}`.
- Rebuild the heading block as a trio: left-aligned heading, `letterSpacing: "-0.02em"`, replace italic subtitle with a mono sub-line (e.g. `"4-week view · Flow / Clear / Both · Weekly cadence"`).
- Larger edit — flag for implementation.

## Proposed new topic codes

The following topics do not fit an existing code. Proposing these additions to the `docs/branding/CLINICAL_AESTHETIC.md` Topic codes table before any edits land:

| Proposed code | Topic | Justification |
|---------------|-------|---------------|
| `TRUST-01` | Trust, credentials, manufacturing, certifications | Used by `WhyConkaWorksDesktop` / `WhyConkaWorksMobile`. The section speaks to third-party testing, Informed Sport, GMP manufacturing — not science, not product. Distinct topic. |
| `TIME-01` | Expected-outcome timelines (24h → 14d → 30d) | Used by `LabTimeline`. The content is specifically about "what happens on what timeline". Could squeeze into `SCI-01`, but the surface is positioning ("by day 30 you'll feel X"), not mechanism. |
| `VALUE-01` | Price / value / coffee comparison | Used by `LandingValueComparison`. The section's subject is cost + time-in-effect comparison vs coffee. Not product, not science, not proof — a distinct positioning lens. |
| `WHY-01` | Why CONKA (dedicated framework surface on /why-conka) | Used by `WhyConkaHero*`, `WhyConkaSection`. Overlaps with `STORY-01` but /why-conka is its own page with a 7-reason framework. Alternative: reuse `CONKA-03`. Recommend `WHY-01` to keep per-section eyebrows traceable back to the /why-conka surface. If the user prefers reuse, collapse into `CONKA-03` or `STORY-01`. |

Open judgement call for the user:
- Should `WhyConkaHero*` and `WhyConkaSection` use the new `WHY-01`, or reuse `CONKA-03` / `STORY-01`? Either is defensible.
- Should `LabTimeline` use new `TIME-01` or reuse `SCI-01` (since the timeline is effectively a mechanism-over-time story)? `TIME-01` keeps "what to expect" traceable separately.

## Components deliberately skipped

Skipped because they do not render trio headers, or are not section-level:

- `Navigation`, `Footer` — explicitly out of scope per instructions.
- `FunnelStepIndicator`, `FunnelHeroAsset`, `CadenceSelector`, `ProductSelector`, `FunnelCTA`, `UpsellBottomSheet`, `FunnelAssurance`, `NutritionInfoModal` (all `app/components/funnel/…`) — funnel is a 2-step paginated checkout UI with no trio-header sections.
- `Reveal` (`app/components/landing/Reveal.tsx`) — animation wrapper.
- `LabTrustBadges` (`app/components/landing/LabTrustBadges.tsx`) — trust grid, explicitly skipped per instructions.
- `LabWhatsInsideMini` (`app/components/landing/LabWhatsInsideMini.tsx`) — inline ingredient strip used inside `LandingProductShowcase`; not a section trio.
- `ConkaCTAButton`, `FunnelCTA` — primary CTA primitives.
- `ProductCard`, `PillarCard`, `BenefitList`, `BenefitDetail`, `ClinicalStudyCard`, `AccordionRow`, `TestimonialCard`, `AthleteSpecCard`, `StatCard`, `PackSelector*`, `TierSelector*`, `FormulaToggle`, `PurchaseToggle`, `ProductImageSlideshow`, `ProductTabs`, `ProtocolTabs`, `ProtocolRatioSelector`, `ProtocolStruggleMobile`, `ProtocolBenefits`, `ProtocolFAQ`, `ProtocolBenefitsMobile` — card / selector / tab / carousel primitives used inside section wrappers. Their own `h3`/`h4` headers are card headers, not section trios.
- `AppInstallButtons`, `StickyPurchaseFooter*` — utility.
- `ProductHero`, `ProductHeroMobile`, `ProtocolHero`, `ProtocolHeroMobile` — PDP hero components with product/protocol name as `h1`. Not trio-header pattern (intentional). Out of scope for this sweep — they have their own identity grammar.
- `LandingDisclaimer` (`app/components/landing/LandingDisclaimer.tsx`) — legal footnote block, not a trio section. Heading is `"Important information"`, mono caps small-label style. Leaving as-is.
- `ScienceQuote` (`app/components/science/ScienceQuote.tsx`) — quote block pattern. Eyebrow is `"// Research Philosophy · Doc-RP-001"` — a document-code eyebrow, explicitly allowed by the spec (`Typography rules` bullet on document codes). No changes needed.
- `FeaturedAthletesCarousel`, `AthleteDetail` and other `app/components/case-studies/` inner sub-components — children of the `CaseStudiesPage*` wrappers.
- `FormulaIngredientsWithToggle` — wrapper around `FormulaIngredients` that adds a toggle; the trio lives in `FormulaIngredients`.
