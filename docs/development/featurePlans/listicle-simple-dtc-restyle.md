# Listicle Simple DTC Restyle (visual only)

**Status:** Phase 1 scoped, not started. Phase 2 on hold (Future).
**Tracking:** Plan doc only (no Jira), matching the sibling Simple DTC programme docs.
**Design language:** Simple DTC (DESIGN_SYSTEM.md §8.5). The listicle uses no `.brand-clinical` scope and consumes no `--go-*` tokens.
**Related:** `docs/development/featurePlans/simple-dtc-design-language.md` (the language + learnings log), `docs/development/featurePlans/listicle-template-upgrade.md` (the content upgrade on the same renderer, Phases 1 to 4 complete).

## Problem

The persona listicles at `/go/[slug]` still render the older clinical grammar (uppercase grey-caps eyebrows, a pervasive `text-black/40` to `/70` opacity ramp, off-palette green and tint) while the cart, nav, and PDP surfaces have moved to Simple DTC. Paid Meta traffic lands on a listicle, then hits the buy box and PDP in a newer, cleaner style, so the journey reads as two brands.

## Who it serves

Paid Meta traffic on persona-matched listicles at `/go/[slug]` (noindex). Part of the persona-landing CRO push.

## Business impact

Coherence lift on the acquisition path (listicle to buy-box), not a direct new conversion mechanism. Velocity and consistency play: it keeps the listicle surface on one system so future persona pages inherit the current look.

## Appetite

A few days (Scale C), front-loaded on Phase 1. Phase 1 is the whole listicle-owned surface plus its exclusive components; Phase 2 is deferred.

## Approach

Restyle the renderer-owned inline blocks and the listicle-only child and helper components to the §8.5 grammar; reconcile the hardcoded palette to the sanctioned tokens. No copy, no config content, no structural refactor, no server-component migration.

The concrete clinical tells to remove (from the codebase audit, not assumptions):
- **Eyebrows:** ~10 uppercase wide-tracking grey-caps eyebrows (`text-[11px] uppercase tracking-[0.08em] opacity-60`) plus one lone `font-mono` "Monthly breakdown" label in `costBreakdown`. Restyle to plain solid-black labels, same text.
- **Text tiers:** a pervasive grey opacity ramp (`text-black/40` to `/70`, `opacity-60/70`) used as the default. Move primary copy to solid `text-black`; keep opacity only for genuinely secondary text.
- **Palette:** green `#10B981` / `#0b7a55` becomes `#1a7f4f` (`--brand-positive`) at `/10` tint on savings; light tint `#eeeff2` becomes `#eef0f5`. Navy `#1B2757` already matches and stays a literal (navy tokenisation is deferred per §8.5).

## What the audit corrected (so the plan is accurate)

- The listicle consumes **none** of the `--go-*` tokens (quiz-only), so no `brand-base.css` edit is needed.
- **`ConkaCTAButton` is not used** here; all CTAs are raw `<a>` / `<button>` with inline `bg-[#1B2757]`. So there is no `meta={null}` change; CTAs are already filled navy and only need radius/hover/shadow polish.
- **No zero-radius or `lab-clip-tr` chamfers exist** in the renderer; it is already rounded (`rounded-[16px]` default). That transformation is moot.
- The renderer is a `'use client'` monolith (~860 lines) with an if-chain dispatch (`BodyBlock`, `AssetBlock`). Only `ReviewStrip` holds client state. Do not refactor the dispatch or migrate to a Server Component.
- Configs are almost pure copy. The only style-bearing field is `statPanel.tone: "dark" | "light"`; **dark tone stays as-is for now** (decision below).

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1a | Restyle the collision-free files: `ListiclePurchase` + the two children + the 5 Tier-1 components | **Done** (commit `2f6ba8ef`) |
| 1b | Restyle the renderer inline blocks + `listicle-types` | Held — being edited in a parallel session; do as a clean pass once that work lands |
| 2 | Restyle Tier 2 shared components (verify-then-convert, host-page check) | On hold (Future) |

### Phase 1 completion note

Phase 1 was split by a live collision: a parallel session is rewriting `ListicleRenderer.tsx`, `listicle-types.ts`, `index.ts` and adding `general-listicle.ts`. To avoid clobbering that uncommitted work, Phase 1a shipped only the files that session is not touching.

**1a shipped:** `ListiclePurchase.tsx` (green `#10B981` to `--brand-positive` `#1a7f4f`, gold Save% badge to green, soft-card lift), `SymptomExplainer.tsx` + `IngredientGrid.tsx` (faded mono eyebrows to solid-black micro-labels, mono formula tag solidified), `AthleteTestimonials.tsx` + `ReviewRail.tsx` + `AppMeasureSection.tsx` (dead `--letter-spacing-premium-title` token replaced with `-0.02em`, headings to solid black, soft-card lift). `CitationLine.tsx` and `SegmentToggle.tsx` were already conformant (no change).

**1b held (renderer inline blocks):** hero, proof ticker, bridge card, `statsBand`, `ReviewStrip`, comparison table, `costBreakdown`, sticky bar. Targets: faded grey uppercase eyebrows to solid navy (a local `SectionEyebrow` helper), `#eeeff2` tint to `#eef0f5`, the lone `font-mono` "Monthly breakdown" label, `costBreakdown` CTA `bg-[#111]` to navy + green savings badge, CTA radii to `rounded-full`, soft-card lift on `ReviewCard`. Dark `statPanel`/`statsBand`/bridge panels stay dark per the decision below.

### Phase 1 (ACTIVE): Listicle-owned surfaces

Covers the inline blocks in `ListicleRenderer.tsx` (hero, proof ticker, bridge card, `statsBand`, `ReviewStrip`, comparison table, `costBreakdown`, sticky bar), `ListiclePurchase.tsx` (free to edit; the content plan marks the buy box no-go), the two listicle children, and the Tier 1 components that render only inside the listicle tree.

1. **Eyebrows: drop the clinical grammar** (Small)
   - Restyle the ~10 uppercase grey-caps eyebrows and the lone `font-mono` label to plain solid-black labels. Same text.
   - Files: `app/components/go/listicle/ListicleRenderer.tsx`

2. **Text tiers: retire the grey ramp as default** (Medium)
   - Primary copy to solid `text-black`; opacity only for secondary text. Sweep reason chips, statPanel, comparison, costBreakdown, ReviewStrip, and the Purchase plan rows.
   - Files: `ListicleRenderer.tsx`, `ListiclePurchase.tsx`

3. **Palette reconciliation** (Small)
   - Green to `--brand-positive` (`#1a7f4f`) at `/10` tint; light tint `#eeeff2` to `#eef0f5`. Navy stays literal.
   - Files: `ListicleRenderer.tsx`, `ListiclePurchase.tsx`

4. **Surface polish: soft cards** (Medium)
   - Apply the §8.5 soft-card recipe where cards lift (soft shadow + `ring-1 ring-black/5`), confirm `rounded-lg` to `rounded-2xl` consistency, align the raw CTAs (radius, hover, filled navy).
   - Files: `ListicleRenderer.tsx`, `ListiclePurchase.tsx`

5. **Restyle the two listicle-only children** (Medium)
   - `SymptomExplainer` and `SegmentToggle` carry the same clinical eyebrows; apply tasks 1 to 3. Reuse the shared `SegmentedToggle` / `DotIndicator` primitives from the learnings log if they fit.
   - Files: `app/components/landing/SymptomExplainer.tsx`, `app/components/landing/SegmentToggle.tsx`

6. **Tier 1 components + verify** (Medium)
   - Restyle `AthleteTestimonials`, `ReviewRail`, `AppMeasureSection`, `CitationLine`, `IngredientGrid` (all render only inside the listicle tree, zero external blast radius).
   - Verify: mobile at 390px, noindex intact, no GSAP added, build + lint pass, all three persona pages spot-checked, copy diffed to confirm zero text change.
   - Files: `app/components/go/AthleteTestimonials.tsx`, `ReviewRail`, `AppMeasureSection`, `app/components/landing/CitationLine.tsx`, `IngredientGrid.tsx` (confirm exact paths at build time)

### Phase 2 (FUTURE, on hold): Tier 2 shared components

Restyle the shared components that also render on other live surfaces. **Verify-then-convert per component** (some may already be Simple DTC), and spot-check each host page when converting. Directionally aligned: §8.5 already assigns home, PDPs, and `/start` to Simple DTC.

| Component | Also used on | Note |
|-----------|-------------|------|
| `AthleteCredibilityCarousel` | home + `/conka-flow` `/conka-clarity` `/conka-both` + athlete components | Likely already aligned to the Magic Mind soft-card recipe (learnings log); verify before touching |
| `CROFAQv2` | `/start`, `/start-b` | Native `<details>` accordion pattern |
| `LogoMarquee` | `/lander`, `/lander-b` | Trial landers |
| `LandingTrustBadges` | `CaseStudiesDataDriven` | |

## Rabbit holes

- **Refactoring the 860-line monolith.** Restyle in place; do not convert the if-chains to a map or split the file.
- **Server-component migration.** Only `ReviewStrip` needs client state; a restyle must not attempt the server migration.
- **Chasing Tier 2 mid-Phase-1.** Cross-page blast radius; that is Phase 2, on hold.

## No-gos

- No copy, headline, claim, stat-text, or FAQ changes. Persona configs (`adhd-listicle.ts`, `brain-ageing-listicle.ts`, `productivity-listicle.ts`) untouched. `statPanel.tone: "dark"` stays.
- No navy tokenisation, no `brand-base.css` `--go-*` edits, no `ConkaCTAButton` change (not used here).
- No if-chain refactor, no server-component migration.

## Risks

- **Temporary in-page inconsistency:** with Phase 2 on hold, Tier 2 components keep their current look inside a restyled listicle. Most are fairly neutral, so the mismatch should be minor; `AthleteCredibilityCarousel` is likely already Simple DTC, which reduces this.
- `ListiclePurchase` is genuinely free (content plan no-go), so no sequencing needed there.

## Decisions

- **Phase 2 on hold.** Ship the self-contained Phase 1 first; decide Tier 2 later.
- **Dark `statPanel` tone kept.** The `tone:"dark"` panel (`#0e1f3f`) stays for now; not converted to light-navy in this scope.
- **Navy stays a literal** (`#1B2757`), consistent with the rest of the codebase; tokenisation is a separate deferred task per §8.5.

## References

- `docs/branding/DESIGN_SYSTEM.md` §8.5 (Simple DTC grammar + authority table), §3 (palette, `--brand-positive`)
- `docs/development/featurePlans/simple-dtc-design-language.md` (learnings log, shared primitives)
- `docs/development/featurePlans/listicle-template-upgrade.md` (content upgrade on the same renderer)
- `docs/features/LANDING_QUIZ_SYSTEM.md` (the `/go` system)
- `app/components/go/listicle/ListicleRenderer.tsx`, `ListiclePurchase.tsx`
- `app/lib/landings/listicle-types.ts`, `listicle-template.ts`
