# /app-insights: findings first, light Simple DTC

**Ticket:** SCRUM-1522. One ticket, one branch (`feature/app-insights-light-clarity`), with a review break at the end of each phase.

## Problem

A visitor has to get through a dataset hero, a long "how this is possible" read, a methodology block and a filter bar before reaching a single finding. Every report then shows its full dense layout, so it is hard to tell what the page has learned. The findings are strong, they are just buried.

**Who it serves:** the sceptic arriving from /science and from /app's "See the app data". It is a credibility page: success is the sceptic leaving convinced, then downloading the app or trying CONKA.

## Approach

The findings become the hero and the navigation. Each report gets a glance layer, with its depth behind "See the full data". The page moves to the light Simple DTC palette and the /app tile language (SCRUM-1520). It stays serious through the evidence rules, not the colours: every tile and card shows its sample size and evidence badge, and thin data is labelled thin.

**Design language:** Simple DTC (`brand-base.css`, DESIGN_SYSTEM.md §8.5). The page leaves App-Dark (§10).

**Appetite:** about 3 to 4 days.

```
HERO (mobile)
  What 7,593 brain tests tell us.
  [5 finding tiles: icon, finding, sample size + badge, tap jumps to the report]
  (desktop: headline left, tiles as a grid right)

REPORT CARD (x5, anchors kept)
  eyebrow                         [badge, sample size]
  hook (h2)
  light chart + one floating stat tile
  headline finding
  [+ See the full data] -> stat cards, caveats, CONKA note, citations, methodology
```

## Phases

| Phase | Description | Ticket |
|-------|-------------|--------|
| 1 | Findings-first core: light shell, finding-tile hero, report card with disclosure, light charts, all 5 reports | SCRUM-1522 |
| 2 | Supporting sections and docs: "How we know" strip + methodology accordion, download close, trials and footer light, docs | SCRUM-1522 |
| 3 | App screens per report (real capture tiles inside reports) | Future |

Review break with Rudh at the end of Phase 1 and Phase 2.

## Phase 1 tasks

1. **Report card plus disclosure** (Large). Replaces the `DataReportSection` layout and `InsightStatCard`. Glance layer from existing data: `eyebrowConcept`, `hook`, `headlineFinding`, the first stat card as the floating tile, `evidenceStrength` + `sampleSize` on one line. Disclosure (native `<details>`): remaining stat cards with caveats, `interpretation`, `conkaSubSection`, `ingredientBridge`, `methodology`. No data shape change.
   - Files: `app/components/insights/DataReportSection.tsx`, `InsightStatCard.tsx`, `ReportHeadlineCallout.tsx`, `EvidenceStrengthBadge.tsx`, `IngredientBridge.tsx`
2. **Light charts** (Medium). `DataLineChart`, `DataBarChart`, `DataComparisonChart` move to light colours. **Keep their GSAP draw-in animation** (curves draw left to right, bars fall from the baseline, readings count up) and the lazy mount via `useInView` + reduced-motion gate. Colours only; no chart-type redesign.
3. **Finding-tile hero** (Medium). New hero replacing `InsightHeroDifferentiator` and `InsightTldrStrip`: headline from `APP_INSIGHTS_TOTALS`, five tiles with an icon each (clock, low battery, stress, glass, coffee), the finding as a short line, sample size + badge; stress and alcohol carry an "Early signal" badge. Tile clicks fire the existing `insights_tldr_card_click` so the event history stays continuous.
4. **Page shell** (Small). `app/app-insights/page.tsx` drops `.brand-clinical`, `#0a0a0a` and the dot grid for white/tint sections. The filter chip bar in `InsightFilteredSections` goes; the report anchors (`#time-of-day`, `#mental-fatigue`, `#stress`, `#alcohol`, `#coffee`) stay because other pages link to them.
5. **Coffee vs CONKA last, with a Try CONKA link** inside its card (tracked `?src=` token, per `docs/development/CART_ATTRIBUTES.md`).

Section-level motion moves to the CSS `Reveal` used on /app; GSAP stays for the charts only.

## Phase 2 tasks

1. **How we know** (Medium). Merge `HowThisIsPossibleModule` and `MethodologyInThirtySeconds` into a three-step icon strip (take CONKA, test, see your delta) with the credentials and the per-user delta method behind an accordion. Keeps `insights_credibility_view` and `insights_methodology_open`. Fix the "two minutes" test length to about 90 seconds.
2. **Download close** (Small). Replace `app/components/app/AppDownloadSection.tsx` with the /app close pattern ("Get your own curve"); delete the old component if nothing else imports it.
3. **Trials and footer** (Small). `ProfessionalTrialsBlock` and the methodology footer (PDF, citation, `ReviewedDate`) to light. Legal anchors stay legible.
4. **Docs** (Small). DESIGN_SYSTEM.md (§8.5 per-surface row, §10, the radius note and clinical-scope list), PAGE_NARRATIVES.md /app-insights (5 reports, new arc), MOTION_GUIDE.md (charts only).
5. **Cleanup** (Small). Delete components the rebuild replaced (`InsightHeroDifferentiator`, `InsightTldrStrip`, filter code, unused `insightMotion` helpers) once nothing imports them.

## Decisions

- **Rebuild the report card, do not reskin 16 components.** Reskinning keeps the density in lighter colours.
- **Keep all five reports.** Stress (n=12) and alcohol (n=27) stay, visibly badged "Early signal".
- **Keep the chart animations** (Rudh, 2026-10-02). They enact the per-user delta and read well.
- **Coffee vs CONKA stays last** as the payoff, and is the one report with a buy link.
- **Analytics continuity:** reuse the four existing `insights_*` events; no new events unless a new interaction needs one.

## Rabbit holes

- Reskinning file by file instead of rebuilding the card once.
- Chart restyling sprawl. Swap the palette; leave chart types and animation logic alone.

## No-gos

- New reports or data, data pipeline changes.
- A copy rewrite of `appInsightsData.ts` beyond small fixes.
- Changes to the professional trials offer.

## Risks

- **Seriousness:** light plus tiles can read as marketing. Guard: the evidence line on every tile and card, thin data labelled.
- **Lost depth:** nothing is deleted, only moved behind disclosure.
- **Anchor links:** other pages deep-link to report anchors; verify each still lands.

## References

- Page narrative: `docs/PAGE_NARRATIVES.md` (/app-insights)
- Data: `app/lib/appInsightsData.ts`, `app/lib/appInsightsTypes.ts`
- Components: `app/components/insights/`, `app/app-insights/`
- Tile language: `app/components/appv2/`, `.app-tile-shadow` in `app/brand-base.css`
- Motion: `docs/development/MOTION_GUIDE.md`, `app/lib/motion.ts`
- Predecessor: SCRUM-1520 (/app clarity upgrade)

## Jira tickets

| Ticket | Title | Phases |
|--------|-------|--------|
| SCRUM-1522 | [Website & CRO] /app-insights findings first: light Simple DTC, finding-tile hero, reports with progressive disclosure | 1 and 2 |
