# App Widget Grid

## Problem

The `/app` page lacks a credibility and exploration layer between the hero and the sticky phone block. Cold paid-social traffic gets the feature overview but nothing that communicates scientific legitimacy, real-world proof, or a direct path to download before scrolling 80% of the page. The existing quick-links strip (three small chip buttons) is too lightweight to carry that weight.

## Who it serves

Cold paid-social traffic landing on `/app` -- primarily mobile, zero brand awareness.

## Business impact

Increases scroll depth and conversion to app download by surfacing three trust signals (research, real athlete data, visual asset) and one hard CTA (install) in a single scannable section. Replaces the quick-links strip which duplicates two of these CTAs at too low a visual weight.

## Appetite

1.5-2 days

## Approach

A dark-theme CSS grid of 4 variable-span tiles. Each tile has a resting state (label + hook line) and an active state triggered by tap/click:

- **Research tile** -- inline expand, shows 4 clinical stats with PubMed links (reuses AppResearchModal data, laid out narratively)
- **Install tile** -- inline expand, reveals AppInstallButtons (iOS + Android)
- **Case Study tile** -- tapping opens a lightbox modal that pages through dark-theme athlete cards (same data as LabCaseStudies, new dark-native card variant)
- **Asset tile** -- thumbnail of `/public/app/NothingAppRing.jpg`, tapping opens image in lightbox

The quick-links strip in `app/app/page.tsx` is removed and replaced by this section.

**Design system:** `brand-base.css` Layer 2.5 (app-dark) -- square edges enforced, white/opacity surfaces throughout, zero border-radius.

---

## Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Widget grid - all 4 tiles with expand interactions | Not Started |

---

## Phase 1 Task Breakdown

**1. Grid shell and tile base component -- Medium**
- CSS grid: 2-col mobile, variable-span 3-col desktop (asset tile spans 2 cols or is tall)
- Resting tile: `border border-white/12 bg-white/10`, mono label, hook line, expand chevron
- Expand/collapse via `max-height` + `opacity` transition (compositor-friendly, same pattern as LabFAQ)
- On mobile: expanded tile uses `col-span-full` to avoid sibling reflow
- Files: `app/components/app/AppWidgetGrid.tsx` (new)

**2. Research tile -- Small**
- Resting: "Research" label + "Cambridge-derived. NHS-validated. FDA-cleared."
- Expanded inline: 4 stats in a narrative vertical flow (value, label, source with PMC/ISRCTN link)
- Stats from AppResearchModal: 93% sensitivity (PMC10533908), 87.5% reliability (PMC10533908), 14 NHS Trusts (ISRCTN95636074), 16% improvement in 30 days
- PubMed links open in new tab
- Files: within `AppWidgetGrid.tsx`

**3. Install tile -- Small**
- Resting: "Get the App" label + iOS/Android platform icons
- Expanded inline: renders `<AppInstallButtons variant="clinical-dark" />`
- Files: within `AppWidgetGrid.tsx`

**4. Case Study tile -- Medium**
- Resting: single dark-theme athlete card (first in array) -- photo, name, sport, 3 metrics
- Expanded: opens `AppWidgetGridModal` lightbox, pages through all 8 athletes
- Dark-native card: `bg-white/10 border-white/12`, `text-white`, `text-white/50` labels -- mirrors AthleteSpecCard structure but inverted
- Athlete data from existing `caseStudiesData` + `PHOTO_PATHS`
- Files: `AppWidgetGrid.tsx`, `AppWidgetGridModal.tsx` (new)

**5. Asset tile -- Small**
- Resting: `/public/app/NothingAppRing.jpg` fills tile as thumbnail (no label)
- Expanded: opens same `AppWidgetGridModal` lightbox with full image
- Files: within `AppWidgetGrid.tsx`, reuses `AppWidgetGridModal`

**6. Shared lightbox modal -- Small**
- Reusable modal shell: dark overlay (`bg-black/90`), close button, optional pagination (prev/next) for case studies
- Used by both Case Study tile (paginated athlete cards) and Asset tile (single image)
- Files: `app/components/app/AppWidgetGridModal.tsx` (new)

**7. Page integration + quick-links strip removal -- Small**
- Add `<AppWidgetGrid />` between hero section and `AppStickyPhoneBlock` in `app/app/page.tsx`
- Remove the existing quick-links strip (Research + iOS App + Android App chip buttons) and `AppResearchModal` state/handler -- replaced by this grid
- Export `AppWidgetGrid` from `app/components/app/index.ts`
- Files: `app/app/page.tsx`, `app/components/app/index.ts`

---

## Rabbit Holes

- **Inline expand reflow.** On CSS grid, expanding a tile can shift siblings. Mitigation: expanded tiles use `col-span-full` on mobile so nothing adjacent moves. On desktop, tile expansion pushes content below rather than beside (place expanding tiles in their own grid row if needed).
- **Case study modal data volume.** Capped at the existing 8 athletes from `ATHLETE_IDS` in LabCaseStudies. No CMS integration.
- **AppResearchModal.** After this grid is live, `AppResearchModal` and its open/close state in `app/app/page.tsx` become orphaned. Remove them as part of Task 7.

## No-Gos

- No dark-theme rewrite of `LabCaseStudies` -- new minimal dark card only, inside the modal
- No CMS or Convex integration -- all static data
- No animations beyond `opacity` + `max-height` (compositor-friendly)
- No replacement of the full `LabCaseStudies` section lower on the page -- it stays

## Risks

- Asset tile image (`NothingAppRing.jpg`) is already in `/public/app/` -- confirmed available
- Research stats are hardcoded in `AppResearchModal` -- no separate data file, will inline into grid component
- Dark card photo contrast depends on the existing athlete photos (dark-enough subjects) -- may need `brightness-75` filter on some

---

## Technical Decisions

- **Expand pattern:** `max-height` transition from `0` to a fixed large value (e.g. `500px`), same as LabFAQ. Avoids JS measurement of content height.
- **Grid layout:** Tailwind `grid grid-cols-2 lg:grid-cols-3` with `lg:col-span-2` on the asset tile for a Tetris feel. No CSS custom properties needed.
- **Modal shell:** Single `AppWidgetGridModal` component accepts `children` + `isOpen` + `onClose` + optional `onPrev`/`onNext` props. Case Study tile passes athlete cards as children with pagination; Asset tile passes a single image.
- **Dark athlete card:** New internal component `DarkAthleteCard` inside `AppWidgetGridModal.tsx`. Mirrors `AthleteSpecCard` prop interface (`athlete: AthleteData`) but uses white/opacity palette.

---

## Jira Tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| TBD | [Website & CRO] App page - interactive widget grid section | 1 | To Do |

---

## References

- `app/components/app/AppResearchModal.tsx` -- research stats source
- `app/components/app/AppFeaturePanel.tsx` -- dark tile / tab pattern reference
- `app/components/LabCaseStudies.tsx` -- athlete card structure reference
- `app/lib/caseStudiesData.ts` -- athlete data source
- `public/app/NothingAppRing.jpg` -- asset tile image
- `app/components/landing/LabFAQ.tsx` -- expand/collapse pattern reference
- `docs/branding/DESIGN_SYSTEM.md` Layer 2.5 -- app-dark token reference
