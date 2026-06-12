# Persona Landing System + Quiz Engine

**Status:** Active. Scoped 2026-06-12.
**Appetite:** Quiz framework with demo config same day (pre-meeting). Real persona content wired in immediately after. Listicle and third format follow inside the same system.

## Problem

Site conversion on paid traffic is far below viable and there is no feedback loop between ads and landings. The fix is message-matched dedicated landing pages: 3 to 4 ad personas, each with its own landing bucket, each bucket iterated across ~3 formats (quiz, listicle, third format TBD). Target conversion on these landings is 1 to 4 percent, aiming for 3 percent.

## Approach

A tiny content-driven landing system. One route, one config file per landing page, shared format engines built from a small library of generic quiz components.

- **Route:** `app/go/[slug]/page.tsx`. Flat namespace, e.g. `/go/sport-quiz`, `/go/focus-8-reasons`. Persona and format are config fields (and analytics props), not URL segments.
- **Config:** `app/lib/landings/` holds a typed schema, a registry (slug to config), and one TS file per landing page. Adding or iterating a landing page = adding one config file. No CMS, no admin.
- **Quiz format:** copies the flowalarmclock.com/pages/go screen grammar (verified from their shipped config): landing hook screen, then single-choice/slider questions interleaved with interstitials (stats, education, testimonial, comparison, commitment), then an analyzing screen, then a scored results screen with CTA. Answer options carry `scores` toward result buckets.
- **Results CTA destination is a config string** (checkout URL, PDP, or `/funnel`). Deliberately undecided; the team decides per page without code changes.

## Visual direction

Subdued clinical. Less noise, sharp lines, clear and easy to read.

- `.brand-clinical` theme from `app/brand-base.css` (reference: `/app-insights`)
- Neural blue as the accent (`--color-neuro-blue-dark` family), hairline borders, zero/minimal radii, mono data labels
- Mobile is the design target (ad traffic is ~all mobile); desktop centres a column
- Animation is restrained: CSS transitions between screens, count-up stats, chart draw-in. No GSAP choreography. Performance is paramount on ad traffic.
- Known gotcha: `.brand-clinical` zeros hero padding on mobile; the quiz owns the full viewport so standard section padding rules mostly do not apply, but check the first screen at 390px.

## Generic component library

The reusable core, designed plug-and-play so quiz iterations recombine them:

| Component | Purpose |
|-----------|---------|
| `QuizQuestion` | Standard question, multiple answers (single choice with optional icons; slider variant). Options carry `scores`. |
| `QuizProgressBar` | Top progress bar across the viewport. Progress curve is configurable (linear by default; supports a perceived-progress curve like the reference site if wanted later). |
| `AnimatedText` | Staged text reveal for interstitial headlines/body. |
| `AnimatedStat` | Count-up number with label (e.g. "73% of people..."). |
| `ComparisonChart` | Animated with/without-CONKA graph (the "you vs product" interstitial). CSS/SVG draw-in, no chart library unless unavoidable. |
| `QuizEngine` | Orchestrator: full-viewport shell, screen sequencing, back nav, answers map, score tally, results selection. |

Interstitial screens are composed from `AnimatedText` + `AnimatedStat` + `ComparisonChart` via config variants, not bespoke components per screen.

## Screen schema (config-driven)

```
LandingConfig {
  slug, persona, format ("quiz" | "listicle" | ...),
  resultsCta: { label, href },
  screens: Screen[]
}
Screen kinds:
  landing       (hook: title, subtitle, cta)
  question      (type: single | slider; options[{ label, icon?, scores }])
  interstitial  (variant: stat | education | testimonial | comparison | commitment)
  analyzing     (loading beat before results)
  results       (buckets[{ id, title, body, recommendation }])
```

## Tracking

Two requirements: know which quiz and how far people progress in each; Meta tracking wired through correctly.

**Vercel Analytics (granular progression):** extend the existing `trackQuiz*` helpers in `app/lib/analytics.ts` (started, question viewed, answer selected, completed, results viewed) plus a CTA-click event. Every event carries `landing_slug`, `persona`, `format`, and screen index, so per-slug drop-off funnels read directly out of Vercel.

**Meta Pixel + CAPI (ad feedback loop):**
- PageView fires via existing layout wiring; ViewContent on quiz start with the slug as content identifier
- Lead (or custom QuizComplete) on results viewed
- CTA click into checkout fires InitiateCheckout (existing pattern)
- Keep browser/CAPI dedup intact via the existing `app/api/meta/events/route.ts` pattern with shared event IDs
- UTM/fbclid passthrough must survive the quiz (no params dropped between ad click and checkout URL)

Run `/review-analytics` after Phase 1 ships.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Quiz engine + component library + config system + template config + analytics | Complete (2026-06-12, commits b1a1de38 + 4b4ca20f). Extras beyond scope: bar/pie chart variants, landing video + rating line, Flow-style centered layout. Feature doc: `docs/features/LANDING_QUIZ_SYSTEM.md` |
| 2 | Real persona content: 3 quiz configs from team session, results mapped to Flow/Clear/Both pricing | Not Started |
| 3 | Listicle format renderer in the same config system | Future |
| 4 | Third format + per-slug conversion readout loop | Future |

Follow-ons surfaced during build: purge legacy /quiz code and docs (avoid two quiz systems); decide on Convex response storage (see feature doc, Analytics section).

## Phase 1 tasks

1. **[Data] Config schema + registry** - `app/lib/landings/types.ts`, `app/lib/landings/index.ts`. Complexity: Small.
2. **[Data] Demo config** - `app/lib/landings/demo-quiz.ts` placeholder mirroring the reference sequence so the format is reviewable live. Complexity: Small.
3. **[Frontend] Component library** - `app/components/go/`: QuizQuestion, QuizProgressBar, AnimatedText, AnimatedStat, ComparisonChart. Complexity: Medium.
4. **[Frontend] QuizEngine + screen renderers** - client component, full viewport, sequencing, scoring. Depends on 1 and 3. Complexity: Large.
5. **[Frontend] Route** - `app/go/[slug]/page.tsx`: server shell, registry lookup, 404 on unknown slug, `robots: noindex`. Complexity: Small.
6. **[Analytics] Events** - Vercel props + Meta Pixel/CAPI events per the Tracking section. Complexity: Medium.

## Rabbit holes

- **No CMS, no admin, no A/B testing infra.** An iteration is a new slug. Vercel Analytics filtered by slug is the whole testing system.
- **Email capture needs Klaviyo wiring.** Stub as an optional screen kind; do not build the integration until the team confirms they want an email gate.
- **Animation polish.** Cap at simple transitions and draw-ins. If a screen needs choreography, it is out of appetite.
- **Chart library temptation.** ComparisonChart is a styled SVG, not Recharts.

## No-gos

- No Shopify changes; reuse funnel variant IDs and pricing from `app/lib/funnelData.ts`
- No nav links, no SEO investment beyond noindex (these pages are ad destinations only)
- Old `/quiz` stays untouched and deprecated; only its analytics helper names are reused
- Not deciding the results CTA destination in code; it is per-config

## Risks

- Funnel education-first plan (SCRUM-966) overlaps with quiz interstitials; it should wait for data from this system.
- Dishonest/perceived progress bars (reference site shows near-complete early, then keeps going) can lift completion but note it for later; default linear and honest.
- Meta event dedup is easy to break when adding new events; verify with `/review-analytics` before scaling spend.

## References

- Format reference: https://flowalarmclock.com/pages/go (screen grammar extracted from its shipped JS config)
- Design system: `docs/branding/DESIGN_SYSTEM.md`, clinical reference page `/app-insights`
- Analytics: `app/lib/analytics.ts`, `app/lib/metaPixel.ts`, `app/api/meta/events/route.ts`, `docs/analytics/`
- Funnel pricing/variants: `app/lib/funnelData.ts`
- Strategy context: `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md`

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1081 | [Website & CRO] Persona landing system: quiz engine, generic component library and config framework at /go/[slug] | 1 | To Do |

Phase 2 is ticketed after the content session.
