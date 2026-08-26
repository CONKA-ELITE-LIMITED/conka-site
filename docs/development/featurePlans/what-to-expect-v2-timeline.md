# WhatToExpect V2: scroll-drawn timeline (PDPs)

**Status:** Phase 1 active
**Scoped:** 2026-08-26
**Design language:** Simple DTC (Tailwind `rounded-*` utilities; they survive the PDPs' `.brand-clinical` wrapper)

## Problem

The current `WhatToExpect` section is a static banner whose headline is baked into a JPG: nothing product-specific, no pull down the page. The Gray Matters pattern (scroll-drawn vertical line, milestone blocks that brighten as the line reaches them) turns the same content into a scroll-consumed narrative that answers "will I feel it?" beat by beat. Serves acquisition/CRO on the three money pages.

## Approach

New client-leaf `WhatToExpectV2`: scroll-scrubbed line (`scaleY` on a div, transform-origin top) plus per-block brighten (opacity 0.2 to 1), both via helpers promoted into `app/lib/motion.ts` from the existing bespoke patterns (`StoryRail` rail, `AppV2Origin` brighten - second use, so promotion is sanctioned by MOTION_GUIDE). Desktop: 2-col with CSS-sticky product render (no ScrollTrigger pin). Mobile: header, then stacked timeline. Real text header (the old one was baked into the asset). Reduced motion renders the fully-lit static timeline; SSR HTML is final-state via `gsap.from`.

Replaces V1 on all three PDPs at once (one shared component; per-product differences are copy + asset). Gray Matters copy verbatim as Phase 1 placeholder.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Build V2 + replace on all 3 PDPs, delete V1 | In review (branch feature/what-to-expect-v2) |
| 2 | CONKA copy + asset pass per product | Future |

## Phase 1 tasks

1. **[Data] `app/lib/whatToExpectV2.ts`** - milestone arrays per product (`01`/`02`/`both`, 5 beats, GM copy) + sticky-asset map (placeholders below). Small.
2. **[Motion] Promote helpers into `app/lib/motion.ts`** - `drawProgress` (scrubbed scaleY) + `scrubBrighten` (opacity scrub); update `docs/development/MOTION_GUIDE.md`. Small.
3. **[Component] `app/components/home/WhatToExpectV2.tsx`** - client leaf, `withMotion` + `useGSAP({scope})` per instance, mobile-first, desktop sticky column, reduced-motion fallback. Medium. Depends on 1, 2.
4. **[Pages] Swap into `/conka-flow`, `/conka-clarity`, `/conka-both`** - both mobile and desktop trees on each page; delete `WhatToExpect.tsx` + `whatToExpectLanding.ts`; flag `public/formulas/whatToExpect/*.jpg` in `asset-and-protocol-cleanup.md`. Small. Depends on 3.

## Phase 2: copy + asset decision table (draft directions, not final)

Placeholder copy in Phase 1 is Gray Matters verbatim ("First 15 Mins / Next 4-8 Hours / No Crash Ever / Week 1 / Week 2+"). The CONKA pass swaps the data file only - no component changes.

| Product | Copy direction (5 beats) | Sticky asset candidates |
|---------|--------------------------|-------------------------|
| Flow (01) | Onset (first shot, alertness without jitters) -> session flow state -> no crash (vs caffeine spike) -> week 1 (afternoon fatigue gone) -> week 2+ (cognitive stamina, training consistency). Anchor with proof points from BRAND_VOICE proof assets where they fit | `public/formulas/conkaFlow/FlowNoBackground.png` (placeholder), `FlowHold`, `FlowLiquid` |
| Clear (02) | Morning clarity -> calm focus through the day -> no crash -> week 1 (brain fog lifting) -> week 2+ (consistent mental freshness) | `public/formulas/conkaClear/ClearNoBackground.png` (placeholder), `ClearHold` |
| Both | AM/PM system arc: Flow primes the day, Clear consolidates -> full-day coverage -> week 1 rhythm -> week 2+ compounding | `public/formulas/both/BothHold.jpg`, `BothShots`, `BothMetalTray` |

Copy owner: Rudh (with the claims pass handled separately per current policy).

**Asset call RESOLVED (2026-08-26):** desktop sticky column uses the FMC-style side-profile shots, exactly 4:5 at 810x1013: `conkaFlow/FlowShotSide.jpg`, `conkaClear/ClearShotSide.jpg`, `both/BothShotSide.jpg`. Only the copy remains for Phase 2.

## Rabbit holes

- **Double render:** each PDP mounts the section twice (separate mobile/desktop trees). Scope triggers per instance via `useGSAP({scope})`; verify the hidden tree's triggers behave.
- **Sticky death:** any `overflow-x: hidden` ancestor kills `position: sticky`. Check each PDP wrapper before building the desktop column.
- **Mobile scrub feel:** transform/opacity only. If low-end jank appears, drop to in-view brighten on mobile rather than fighting the scrub.

## No-gos

- No ScrollTrigger pin (CSS sticky only, preserves the one-pin-per-page budget)
- No new photography or crops in Phase 1
- No copy finalisation in Phase 1
- No changes to any other PDP section

## Risks

- 5 beats vs the old 3 makes the mobile section taller; acceptable, the scroll interaction is the point.
- No new analytics events (passive section).

## References

- Motion: `docs/development/MOTION_GUIDE.md`, `app/lib/motion.ts`, patterns in `AppV2Origin.tsx`, `our-story/StoryRail.tsx`
- Performance: `docs/development/PERFORMANCE_OPTIMISATION.md` (no width/height transitions, lazy below-fold images)
- Component rules: `.claude/rules/components.md` (content-only root, page owns section wrapper)
- Current V1: `app/components/home/WhatToExpect.tsx`, `app/lib/whatToExpectLanding.ts` (only importer is V1)
- Asset cleanup tracker: `docs/development/featurePlans/asset-and-protocol-cleanup.md`

## Jira tickets

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1253 | WhatToExpect V2: scroll-drawn timeline section on all 3 PDPs | 1 | For review |
