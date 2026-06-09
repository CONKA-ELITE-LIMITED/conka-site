# Clinical Component Upgrades - LabTimeline + Ingredients

> Working doc. Continues the consumability learnings from the /startv2 build onto the home page and product pages. Reduce noise, lead with the takeaway, keep depth one tap away.

## Problem

Two conversion surfaces are not doing their job:

1. **Home page "What to Expect" (Section 7, `LabTimeline`).** The benefits are buried inside scroll choreography. A visitor has to scroll through rail-fill animations, pill states, and header transitions to learn what CONKA actually does for them. It is stylised but slow to consume.
2. **/conka-both has no ingredients section.** The home page CTA routes to /conka-both, and a buyer evaluating the flagship purchase cannot see what is inside the product. Flow and Clarity PDPs have the older `FormulaIngredients` carousel; Both has nothing.

## Who it serves / business impact

Cold and warm traffic on the home page, and anyone evaluating the Both purchase. Faster benefit comprehension on the home page, and closing the "what is actually in it" objection on the highest-value PDP.

## Appetite

1-2 days across both active phases.

## Approach

1. Rebuild `LabTimeline` as a benefits-first clinical section: outcomes scannable instantly, clinical data in an expandable layer.
2. Build a new clinical-themed ingredients component fed by shared `ingredientsData.ts`, designed for both dual-formula (Both) and single-formula (Flow / Clarity) modes. Ship on /conka-both first.

## Design system

brand-base, clinical grammar: `brand-section` + `brand-bg-*` wrappers owned by the page, `brand-clinical` scope, hairline borders, navy `#1B2757` interactive accents, mono eyebrow labels. No shadows, no gradients.

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | LabTimeline benefits-first rebuild (home page Section 7) | Complete |
| 2 | Clinical ingredients section on /conka-both | Complete |
| 3 | Roll ingredients component into /conka-flow + /conka-clarity (replace `FormulaIngredients`) | Complete |

---

## Phase 1: LabTimeline benefits-first rebuild

### Tasks

1. **[Component] Rebuild LabTimeline as benefits-first layout**
   - Replace the scroll-driven structure (IntersectionObserver rail, pill states, header darkening) with an immediately-scannable layout.
   - Three milestones (24h / 14d / 30d), each leading with one outcome statement and stat, visible by default with zero interaction required.
   - Clinical detail (study data, caveats, links) behind an expand interaction. Native `<details>` preferred: zero JS, graceful fallback.
   - Complexity: Medium
   - Files: `app/components/landing/LabTimeline.tsx`, `app/page.tsx`

2. **[Copy] Benefit-led copy pass per milestone**
   - One headline outcome + supporting stat per milestone visible by default.
   - Existing bullet / data-callout content reorganised into the expanded layer, trimmed.
   - Complexity: Small

3. **[Mobile] Mobile-first verification**
   - Single column, tap-to-expand works, no sticky-asset dependency.
   - Decide during build whether the lifestyle asset survives (mobile full-bleed top image) or gets cut for speed.
   - Complexity: Small

---

## Phase 2: Clinical ingredients on /conka-both

### Tasks

4. **[Data] Upgrade `ingredientsData.ts` for scan-optimised display**
   - Pragmatic rule: if an existing field already serves the purpose (e.g. `benefit`, `tags`), upgrade its content in place. Only add a new field where nothing suitable exists.
   - Target shape per ingredient for the new section: short one-liner benefit (scan voice, no em dashes), display tags, key stat.
   - No rewrite of existing long-form clinical descriptions.
   - Complexity: Small
   - Files: `app/lib/ingredientsData.ts`

5. **[Component] New `ClinicalIngredients` component (dual + single formula modes)**
   - Clinical-themed equivalent of the /startv2 `IngredientsGrid`: formula toggle (dual mode only), tile grid using existing renders in `/public/ingredients/renders/`, always-visible detail panel (name, tags, one-liner, key stat).
   - Clinical skin: hairline borders, sharp / small radii, mono eyebrow labels, navy selection state.
   - Single client island. Props-driven for 1 or 2 formulas so Phase 3 can reuse it without rework.
   - Component returns content only: no `<section>`, no max-width, no horizontal padding at root (page owns the wrapper).
   - Complexity: Medium-Large
   - Files: new `app/components/product/ClinicalIngredients.tsx`

6. **[Page] Wire into /conka-both**
   - New section in `app/conka-both/page.tsx`. Placement likely after the timeline section and before the comparison section; confirm placement visually during the build (section-by-section workflow).
   - Page owns the `brand-section` wrapper and background per component rules.
   - Complexity: Small
   - Files: `app/conka-both/page.tsx`

---

## Phase 3: Flow / Clarity rollout (Complete)

Replace `FormulaIngredients` carousels on /conka-flow and /conka-clarity with `ClinicalIngredients` in single-formula mode. Shipped 2026-06-02, see implementation log.

---

## Technical decisions

| Decision | Call | Rationale |
|----------|------|-----------|
| LabTimeline: rework vs rebuild | Rebuild benefits-first | The scroll machinery itself is the noise. Reworking copy inside it would not fix consume speed. |
| Ingredients reuse strategy | Dual + single mode component, Both first | Avoids a third ingredients pattern in the codebase. Flow / Clarity swap is a follow-up once proven. |
| Ingredient copy source | Shared `ingredientsData.ts` | One source of truth across surfaces. Upgrade existing fields where suitable, add new fields only where nothing fits. |
| Expand interaction | Native `<details>` | Zero JS, no hydration cost, consistent with the FAQ pattern already proven on /start and /startv2. |
| /startv2 `IngredientsGrid` | Untouched | Constraint carried from v2.1: never edit components serving another live surface. |

## Rabbit holes

- **Full ingredientsData rewrite.** Only upgrade or add the fields the new section needs. Do not rewrite long-form clinical descriptions or restructure the module.
- **Asset folder migration.** The PascalCase render filenames + `ASSET_FILENAME` mapping cleanup noted in v2.1 stays out of scope. Keep a mapping lookup; do not reorganise `/public/ingredients/`.
- **Home page reshuffle.** Round 2 home page work (S5 Daily Benefits, S6 Research) is a separate stream. This scope touches Section 7 only.

## No-gos

- Not touching `FormulaIngredients` on flow / clarity in active phases.
- Not editing /startv2 `IngredientsGrid`.
- No new image assets; reuse existing ingredient renders and bottle shots.
- No analytics changes (content-only sections, no cart mutations).

## Risks

- The expand interaction on LabTimeline needs to feel premium, not like a FAQ accordion. `<details>` styling needs care inside the clinical skin.
- /conka-both is already a long page (8 sections). Adding ingredients makes placement and section rhythm matter. Confirm placement visually during build.
- Some Clear ingredients still use the generic white-powder fallback render. Acceptable, same as /startv2.

## References

- `app/startv2/IngredientsGrid.tsx` - the /startv2 Ingredients section is the structural + consumability reference pattern
- `app/components/landing/LabTimeline.tsx` - component being rebuilt
- `app/lib/ingredientsData.ts` - shared ingredient data
- `docs/branding/DESIGN_SYSTEM.md` - clinical grammar
- `docs/branding/QUALITY_STANDARDS.md` - consumability principle

## Jira tickets

None. Per scoping decision this work runs from this plan doc only.

## Implementation log

### Phase 1 (2026-06-02): LabTimeline rebuild

Shipped as planned with two iterations of user feedback:

- Collapsed card face = timeframe badge (navy), phase label, outcome headline, one-line benefit. White cards with navy accents (a navy-face variant was tried and reverted).
- Single expander per card ("[+] App data and clinical detail") written in the KeyBenefits narrative style: struggle (italic) → felt outcome (bold) → compact app data tile → "How it works" mechanism with bolded ingredient names.
- Each milestone carries a real measured stat: +1.09 pts (app data, evening focus), -5.4 pts (app data, stress cost), +28.96% (case studies average). Previously only 24h had data.
- Lifestyle asset kept (mobile full-bleed banner + desktop sticky square), per user call.
- Component went from client island (scroll machinery) to pure server component, zero JS. Home page switched from dynamic() to direct import.
- Decision: native details with name attribute for exclusive-open, [+]/[-] mono affordance via group-open variants.

### Phase 2 (2026-06-02): Clinical ingredients on /conka-both

Shipped with three iterations of user feedback. Final shape differs from the original brief in two ways worth recording:

- **No data changes were needed for the core build.** ingredientsData.ts already had oneLineClaim, category, functionalCategory, keyStats, percentage, scientificName, and image (render paths). The only data edit was cleaning em dashes from 7 oneLineClaim entries (propagates to /ingredients and PDP carousels, an improvement there too).
- **The tile grid + detail panel structure was replaced by Magic Mind style cards** after user feedback that the detail panel read as noisy. Every ingredient is a self-contained native details card: collapsed face = name, class tags, 64px render, one-liner; expanded = description, formula share, key study finding. One card open at a time (details name attribute).
- Header is grammage-led: "6,842mg of Active Nootropics." (Flow 3,700mg + Clear 3,142mg, founder-supplied constants in FORMULA_GRAMMAGE pending verification against the formulation spec).
- Formula toggle is asset-dominant: full-width bottle image with a name + grammage strip below, navy active state.
- Clear order is product-led (Glutathione first), lemon-oil excluded as flavouring. Both carried over from the /start grid per the v2.1 doc.
- Placement on /conka-both: Section 6, after What CONKA Does, before Comparison. Downstream backgrounds flipped to preserve white/tint alternation.
- Single-formula mode (formulaIds prop) built and ready for Phase 3.

### Phase 3 (2026-06-02): Flow / Clarity rollout + toggle redesign

Shipped same day as Phase 2, immediately after it was approved:

- **Toggle redesigned around time of day.** The two asset-dominant formula buttons became a Morning/Afternoon segmented control (mono, navy active) with a single bottle render of the active formula next to an identity block: CONKA Flow · AM, the mg load as a large stat, "Active nootropics" label, and the tagline. Desktop puts the toggle + asset to the right of the section title; mobile stacks them below it.
- **Both PDPs swapped to ClinicalIngredients in single-formula mode.** /conka-flow uses formulaIds={["01"]}, /conka-clarity uses ["02"]. Single mode shows no toggle but keeps the asset + grammage block. Section ids (id="ingredients") and aria-labels preserved.
- **Legacy FormulaIngredients deleted.** 339-line accordion carousel removed from the codebase and the product barrel; ClinicalIngredients took its barrel slot. Zero remaining references. Net diff for the phase: minus 334 lines.
- All three product pages now share one ingredients implementation reading from one data source.
