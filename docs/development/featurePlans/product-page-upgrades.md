# Product Page Upgrades — /conka-flow

> **Status:** Draft. Not yet ticketed.
> **Created:** 2026-04-27
> **Last updated:** 2026-04-28
> **Appetite:** 5-6 days across 4 phases. Phases 1-3 carry the bulk of conversion lift.
> **Page in scope:** `/conka-flow` only. `/conka-clarity` and `/protocol/3` follow once Flow is validated.

---

## Problem

The Flow PDP is technically well-built (clean code, centralised data, claims-compliant, accessible) but reads like a lab spec sheet, not a product story. Compared to the bar set by Magic Mind, Seed.com, and Suri, it has three core defects:

1. **The hero subheading carries five qualifiers, not one promise.** *"Daily support for your nervous system and focus, so you can stay sharp without the jitters or the crash."* The buying widget is otherwise correctly structured — bottle, stars, name, cadence cards, CTA — but the only narrative real estate inside it (the subheading) is doing too much.
2. **Four parallel proof sections argue overlapping versions of the same case.** `FormulaBenefitsStats`, `FormulaBenefits` (interactive accordion), `FormulaCaseStudies` (athlete carousel), and `LandingTestimonials` all run "here's why it works" in different formats, mostly back-to-back, with the same trio-header rhythm 8+ times across the page.
3. **The page narrates "completeness" instead of an arc.** Reassurance content (`HowItWorks`, `WhatToExpect`) is buried in sections 6-7, the 100-day guarantee is missing entirely from the PDP, and the comparison frame that exists on `/start` (`LandingValueComparison`) is never surfaced — even though it doubles as a Balance/Both upsell.

What we don't have is also instructive. There's no "what's actually in the box" beat — Seed's *Sustainably delivered, monthly* component visualises both first-order contents and the difference between 1-month / 3-month / 6-month cadences, making the cadence upsell visceral rather than abstract. We need our own version.

## Who it serves

Cold paid Meta traffic landing directly on `/conka-flow`, plus warm visitors arriving from `/start` who hit the PDP as their second touch. Both audiences need the page to **commit to one promise and prove it once, hard** — not to layer four parallel proofs.

## Business impact

PDP conversion is the single biggest unleveraged surface in the funnel. Hero subheading rewrite + section reorder + proof consolidation are zero-cost CRO levers that compound. Surfacing the existing `LandingValueComparison` with a `/protocol/3` CTA also turns the PDP into a Both upsell channel — a free move with no new component cost.

## Appetite

| Phase | Description | Effort |
|-------|-------------|--------|
| 1 | Hero subheading + section reorder + reuse existing components | 1-1.5 days |
| 2 | Build `FormulaBenefitsPillars` (replaces Stats + Benefits) | 1.5-2 days |
| 3 | Build `ProductWhatYouGet` (Seed-style) + formula quality badges | 1.5-2 days |
| 4 | Component polish: ingredient flip, FAQ rebuild, sticky trust line, eyebrow variation, mobile QA | 1-1.5 days |

## Approach

Apply the upgrades to `/conka-flow` as the prototype, with every shared component change automatically benefiting `/conka-clarity` and `/protocol/3` once we sweep them later. Each phase is independently shippable and works within the existing brand-clinical scope — no new design tokens.

## Design system

`brand-base.css` (clinical scope). No new tokens introduced. Every change works within `docs/branding/CLINICAL_AESTHETIC.md`.

---

## Section structure — before / after

| # | Today | After |
|---|---|---|
| 1 | `ProductHero` (buying widget) | `ProductHero` — subheading rewritten, mobile compressed |
| 2 | `FormulaBenefitsStats` (3-stat card) | NEW `FormulaBenefitsPillars` — Magic Mind 3-pillar block |
| 3 | `LandingTestimonials` (carousel) | NEW formula quality badges strip (Informed Sport / Vegan / etc.) — check `FunnelAssurance` reuse first |
| 4 | `FormulaIngredients` | `FormulaIngredients` (outcome-led card flip in Phase 4) |
| 5 | `FormulaBenefits` (interactive accordion) | NEW `ProductWhatYouGet` — Seed-style "what ships, how it ships" |
| 6 | `WhatToExpect` (timeline) | `WhatToExpect` — moved up |
| 7 | `HowItWorks` (3 steps) | `AthleteCredibilityCarousel` (reused as anchor proof) |
| 8 | `FormulaCaseStudies` (athlete carousel) | `LandingValueComparison` (reused, CTA → `/protocol/3`) |
| 9 | `FormulaFAQ` | `LabGuarantee` (added — currently absent on PDP) |
| 10 | `ProductGrid` (Explore) | `FormulaFAQ` — left column rebuilt as founder/lab trust block |
| 11 | — | `LandingTestimonials` (closing reviews chorus) |
| 12 | — | `ProductGrid` (Explore) |

**Components killed:** `FormulaBenefitsStats`, `FormulaBenefits`, `FormulaBenefitsMobile`, `HowItWorks`, `FormulaCaseStudies`, `FormulaCaseStudiesMobile` (the last two replaced by `AthleteCredibilityCarousel` for anchor proof + `LandingTestimonials` for closing chorus).
**Components added:** `FormulaBenefitsPillars`, `ProductWhatYouGet`. Possibly a small `FormulaQualityBadges` strip if `FunnelAssurance` doesn't fit.
**Components reused on PDP for the first time:** `AthleteCredibilityCarousel`, `LandingValueComparison`, `LabGuarantee`.

---

## Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Hero + section reorder + reuse existing components | Not Started |
| 2 | `FormulaBenefitsPillars` build | Not Started |
| 3 | `ProductWhatYouGet` build + quality badges | Not Started |
| 4 | Polish: ingredient flip, FAQ, sticky trust, eyebrow, mobile QA | Not Started |

---

## Phase 1 — Hero subheading + section reorder + reuse existing components

**Goal:** Get the structural changes shipped using only components that already exist. The buying widget gets a sharper voice, the page gets a coherent arc, the PDP gains the guarantee + comparison + anchor-athlete moments it was missing.

### Tasks

1. **[Copy] Rewrite `formulaContent["01"].headline` to a single sentence**
   - Current: *"Daily support for your nervous system and focus, so you can stay sharp without the jitters or the crash."* (5 qualifiers)
   - Target: one sentence, one promise, no "and / or / so" clauses.
   - Draft 3 options for review before changing the field.
   - Files: `app/lib/formulaContent.ts`
   - Complexity: Small (decision is the work)

2. **[Mobile] Compress mobile hero so Add to Cart is above the fold at 390px**
   - `ProductHeroMobile` currently includes `FunnelAssurance` + `HeroAccordions` directly under the CTA, pushing it. Investigate deferring the accordions to scroll-reveal or moving them out of the hero card on mobile.
   - Validate on iPhone SE / Pixel 5 widths.
   - Files: `app/components/product/ProductHeroMobile.tsx`
   - Complexity: Small

3. **[Page] Reorder sections in `/conka-flow` per the table above**
   - Apply the new order to both desktop and mobile branches in `app/conka-flow/page.tsx`.
   - Files: `app/conka-flow/page.tsx`
   - Complexity: Small

4. **[Reuse] Surface `AthleteCredibilityCarousel` on PDP as anchor proof**
   - Already lives on `app/page.tsx`. Import into `/conka-flow` in the new section 7 slot.
   - No prop changes needed — use as-is. Roster strip below the featured slot is a feature (visible breadth proof: Olympic, WBO, IBO, Team GB, England).
   - Files: `app/conka-flow/page.tsx`, `app/components/AthleteCredibilityCarousel.tsx` (read-only)
   - Complexity: Small

5. **[Reuse] Surface `LandingValueComparison` on PDP with Balance upsell CTA**
   - Component is currently `/start`-only. Compares **Both vs coffee** by default — keep that framing on PDP. The Both framing turns the comparison into an upsell to `/protocol/3`.
   - Add a `ctaHref` prop (or update the existing CTA target) so `/conka-flow` renders it pointing at `/protocol/3` with copy along the lines of *"Get the full system →"*.
   - Files: `app/components/landing/LandingValueComparison.tsx`, `app/conka-flow/page.tsx`
   - Complexity: Small

6. **[Reuse] Add `LabGuarantee` section to PDP**
   - Already exists; currently absent from `/conka-flow`. Insert in section 9 slot.
   - Files: `app/conka-flow/page.tsx`
   - Complexity: Small

7. **[Move] `LandingTestimonials` repositions to closing chorus**
   - Already on the page in section 3; just moves to section 11 (after FAQ).
   - Keep `hideCTA` behaviour.
   - Files: `app/conka-flow/page.tsx`
   - Complexity: Small

8. **[Cleanup] Decommission `HowItWorks` and `FormulaCaseStudies` on `/conka-flow`**
   - `HowItWorks`: thin content; the timeline + 3-pillar block cover its job.
   - `FormulaCaseStudies` / `FormulaCaseStudiesMobile`: replaced by `AthleteCredibilityCarousel` (anchor) + `LandingTestimonials` (chorus).
   - Remove imports from `app/conka-flow/page.tsx`. Don't delete the component files yet — `/conka-clarity` and `/protocol/3` may still use them. Tag for removal in the eventual sweep.
   - Files: `app/conka-flow/page.tsx`
   - Complexity: Small

---

## Phase 2 — `FormulaBenefitsPillars`

**Goal:** Replace `FormulaBenefitsStats` + `FormulaBenefits` (the accordion) with a single high-impact 3-pillar block, modelled on Magic Mind's *Mental performance / Sustained energy / Brain health* pattern.

This collapses the two heaviest proof sections on the page into one, halves the engineering surface (no more sticky sidebar / mobile navy accordion / accordion expand logic), and gives the user three scannable headlines + sentences + stats — all of the proof load, none of the interaction tax.

### Tasks

1. **[Component] Build `FormulaBenefitsPillars`**
   - 3 cards in a row (mobile: stacked or 2-col scroll). Each card: pillar name, 1-sentence description, big tabular-nums stat with anchor symbol where applicable, optional short PMID/source line.
   - For Flow, candidate pillars (subject to copy review): Mental performance · Sustained energy · Brain health (matching Magic Mind's framing — adjust per CONKA's voice). Stats pulled from `formulaStatsData.ts`.
   - Files: new `app/components/product/FormulaBenefitsPillars.tsx`
   - Complexity: Medium

2. **[Copy] Write pillar content for Flow**
   - Three pillar headlines, three single-sentence descriptions, three stats with translation lines (*"what +18% memory feels like on a Tuesday morning"*).
   - Compliance check via `/review-claims` before shipping.
   - Files: `app/components/product/formulaStatsData.ts` (extend the existing curated stats with pillar metadata) or `app/lib/formulaContent.ts`
   - Complexity: Small (work is in copy + claims review)

3. **[Page] Swap `FormulaBenefitsStats` + `FormulaBenefits` for `FormulaBenefitsPillars`**
   - Remove imports for both old components from `/conka-flow`.
   - Drop the new component into section 2.
   - Don't delete the component files yet; they may still appear on `/conka-clarity` and `/protocol/3`.
   - Files: `app/conka-flow/page.tsx`
   - Complexity: Small

---

## Phase 3 — `ProductWhatYouGet` + formula quality badges

**Goal:** Two new sections that today have no equivalent on the PDP: a visual "what ships, how it ships" beat (Seed pattern), and a tight quality-trust strip surfaced as its own section instead of buried inside the hero.

### Tasks

1. **[Component] Build `ProductWhatYouGet` (Seed-style "Sustainably delivered")**
   - Two side-by-side cards (mobile: stacked):
     - **Card 1 — Your first order:** lifestyle/product image of the Flow box, plus 2-3 callout chips below (e.g. *"28 shots · 30ml each"*, *"Informed Sport batch certificate"*, *"Recyclable packaging"*). Whatever physically arrives.
     - **Card 2 — Refills, your way:** lifestyle/product image, plus 3 callout chips visualising the cadence options — *"1 box · monthly or one-time"*, *"3 boxes · quarterly"*, *"Pause or cancel anytime"*. The visual point is showing 3 boxes vs 1, making the quarterly upsell visceral.
   - No photography upgrades planned — work with existing assets and stock callout iconography.
   - Files: new `app/components/product/ProductWhatYouGet.tsx`
   - Complexity: Medium

2. **[Page] Drop `ProductWhatYouGet` into section 5**
   - Files: `app/conka-flow/page.tsx`
   - Complexity: Small

3. **[Investigate] Determine whether `FunnelAssurance` covers formula quality badges**
   - `FunnelAssurance` already renders inside `ProductHero`. Check whether its content is the right fit for a standalone section 3 strip (vegan / Informed Sport / batch tested / clinical doses) or whether we need a new tiny `FormulaQualityBadges` component.
   - Files: `app/components/funnel/FunnelAssurance.tsx`
   - Complexity: Small (research)

4. **[Component] Build or surface formula quality badges strip**
   - Either reuse `FunnelAssurance` as a standalone section, or build a small new `FormulaQualityBadges` if FunnelAssurance is too tied to the hero card layout.
   - One row, 3-4 badges, mono labels, hairline-bordered cells. Operationally identical to `LabTrustBadges` but with quality signals (Informed Sport, Vegan, Made in UK, etc.) instead of commerce signals (100-day guarantee, free shipping).
   - Files: new `app/components/product/FormulaQualityBadges.tsx` (if needed), `app/conka-flow/page.tsx`
   - Complexity: Small-Medium (depends on FunnelAssurance investigation outcome)

---

## Phase 4 — Component polish

**Goal:** Last-mile fixes that don't restructure the page but materially improve the quality of every section.

### Tasks

1. **[Component] Flip ingredient cards — lead with felt outcome**
   - Current collapsed state: counter, image, name, *"Anti-inflammatory · Clinically dosed"*, claim.
   - Target collapsed state: counter, image, name, **felt outcome line** (*"2-3 hours of cleaner focus"*), claim.
   - Dosage, PMID, source study move into expanded state (already there).
   - Add `outcomeLine` field to `getIngredientsByFormula` data.
   - Files: `app/lib/ingredientsData.ts`, `app/components/product/FormulaIngredients.tsx`
   - Complexity: Medium

2. **[Component] Replace FAQ left-column lifestyle photo with a final-mile trust block**
   - Options: founder/researcher note + signature photo, lab/manufacturing shot with Informed Sport caption, or a compact trust grid. Pick one for Flow.
   - Files: `app/components/product/FormulaFAQ.tsx`
   - Complexity: Medium

3. **[Component] Add a trust line above the sticky footer CTA**
   - Single mono line: *"100-day guarantee · Free UK shipping · Cancel anytime"*. Costs zero space, runs above the existing CTA button.
   - Files: `app/components/product/StickyPurchaseFooter.tsx`, `app/components/product/StickyPurchaseFooterMobile.tsx`
   - Complexity: Small

4. **[Design] Vary section openers — not every section opens with a trio header**
   - Pick 2-3 sections per page where the opener is replaced by:
     - A giant single stat (no eyebrow, no headline — just the stat + caption)
     - A full-bleed lifestyle photo with overlaid headline
     - A founder/researcher quote (existing `Quote block` pattern from `CLINICAL_AESTHETIC.md`)
   - Reserve variants for sections doing the heaviest emotional lift (pillars, anchor athlete, comparison). Trio header stays as default.
   - Files: section components touched in phases 2-3
   - Complexity: Medium

5. **[Copy] Strip topic codes (`PROOF-01`, `SCI-02`, etc.) from PDP eyebrows**
   - Codes are useful internally but read as filing-system noise to a buyer. Drop them from PDP eyebrows; keep on `/start` where the lab grammar establishes the brand.
   - Files: every component with a trio header on the PDP
   - Complexity: Small

6. **[QA] Verify mobile hero CTA above the fold at 390px after all phases land**
   - iPhone SE, Pixel 5, real device + Chrome devtools.
   - Files: validation only
   - Complexity: Small

---

## Out of scope (tracked separately)

- **Comparison frame revisit.** Today `LandingValueComparison` shows Both vs coffee. We're reusing as-is on PDP with a `/protocol/3` upsell CTA. Whether Flow eventually needs its own single-product comparison (Flow vs caffeine pills, Flow vs DIY nootropic stack) is a future copy/positioning decision, not blocking.
- **`/conka-clarity` and `/protocol/3` parity.** Once `/conka-flow` is validated, sweep both. Component changes (e.g. `FormulaBenefitsPillars`) are formula-aware so the work is mostly page-file reordering + Clear-specific copy.
- **Photography upgrade.** Not needed for these phases; using existing assets. If a shoot does happen later, `ProductWhatYouGet` and the FAQ trust column are the highest-value places to backfill.
- **Pricing / cadence default decisions.** Whether quarterly should become the default cadence on PDP — covered in `cro-value-messaging-and-offer-strategy.md` Phase B. Not duplicated here.
- **Eventual deletion of decommissioned components.** `FormulaBenefitsStats`, `FormulaBenefits`, `HowItWorks`, `FormulaCaseStudies` stay in the codebase until the Clarity/Protocol-3 sweep removes their last usage.

---

## References

- Critique source: 2026-04-27 review of `/conka-flow` against Magic Mind, Seed.com, Suri
- `docs/branding/CLINICAL_AESTHETIC.md` — design system constraints
- `docs/branding/QUALITY_STANDARDS.md` — premium quality bar
- `docs/development/featurePlans/cro-value-messaging-and-offer-strategy.md` — pricing/cadence work this plan does NOT duplicate
- `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` — broader strategic context
- `app/components/AthleteCredibilityCarousel.tsx` — reused as PDP anchor proof
- `app/components/landing/LandingValueComparison.tsx` — reused on PDP as Balance/Both upsell
