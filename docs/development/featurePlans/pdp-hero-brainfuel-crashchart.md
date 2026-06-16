# PDP hero scroll + conka-both BrainFuel band + /start crash chart

Three contained, mostly-presentational upgrades to core conversion pages.

## Problem
1. PDP desktop hero: the short image column sits still while the long buy box scrolls, leaving the image stranded (reads as unfinished).
2. conka-both section 2 is a generic `LabTimeline` rather than the punchier BrainFuel proof band.
3. `/start`'s dual caffeine curves are a weaker story than the lander's crash chart.

## Approach
- Reverse the sticky column on the shared `ProductHero`: left image column becomes sticky, right buy box scrolls.
- Give `BrainFuelBand` a desktop left/right split (video left, stats + content right); mobile unchanged. Drop it into conka-both as a dark full-bleed band replacing `LabTimeline`.
- Replace `CaffeineCurves` with the ported `CrashChart` (steady-vs-crash curve + cost table) in a sharp clinical container.

## Design system
brand-base / brand-clinical (PDPs + /start); conka-both uses brand-section. Sharp corners on the /start chart and the PDP-side uses.

## Decisions
- `/start` chart includes CrashChart's cost-comparison table (more persuasive; /start has no price comparison today).
- conka-both BrainFuel band stays dark full-bleed (mobile unchanged, deliberate high-impact break).
- CrashChart is the better base than the lander CSS-module version (production-ready Tailwind port); add a `sharp` prop so /start and PDP-side uses get square corners without affecting the rounded landing/listicle uses.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | PDP hero sticky image column (shared ProductHero) | Not Started |
| 2 | BrainFuelBand desktop split + conka-both swap | Not Started |
| 3 | /start CaffeineCurves -> sharp CrashChart | Not Started |

### Phase 1 tasks
- `app/components/product/ProductHero.tsx`: move `lg:sticky lg:top-*` from the right column to the left image column; right column scrolls. Desktop-only; `ProductHeroMobile` untouched.

### Phase 2 tasks
- `app/lander/sections/BrainFuelBand/BrainFuelBand.module.css`: rewrite the desktop media block into a 2-column grid (video left, details right); keep all mobile (base) rules untouched.
- `app/conka-both/page.tsx`: replace the `timelineSection` (LabTimeline) with `<BrainFuelBand />` full-bleed; drop the unused `LabTimeline` import.

### Phase 3 tasks
- `app/components/landing/CrashChart.tsx`: add optional `sharp` prop (square container).
- `app/start/CaffeineCurves.tsx`: render `<CrashChart sharp />`; delete orphaned `CaffeineCurvesReveal.tsx` and `CaffeineCurves.module.css`.

## Rabbit holes
- BrainFuel desktop split: constrain the video so it does not dominate the left column; reuse existing stats markup (the grid split is CSS-only, markup already has two children).
- Sticky clipping behind the `xl:fixed` nav: use a top offset; the image column is shorter than the viewport so it will not clip at the bottom.

## No-gos
- No mobile changes to the PDP hero or BrainFuelBand.
- No copy/content redesign (layout only).
- No /start migration to brand tokens.

## Risks
- Importing a `lander/sections` component into conka-both is a small coupling; acceptable for reuse.
- CrashChart cost figures default from `landingPricing` (Both) — correct for /start; visual check recommended.

## Jira (Sprint 27)
- SCRUM-1089 - PDP hero: sticky left image column on desktop scroll - Phase 1
- SCRUM-1090 - conka-both: replace section 2 with BrainFuelBand (desktop split) - Phase 2
- SCRUM-1091 - /start: replace CaffeineCurves with sharp CrashChart - Phase 3
