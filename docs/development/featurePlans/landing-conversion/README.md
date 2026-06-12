# Landing Conversion Programme

**The one doc orchestrating the persona landing page push. Start here.**

Last updated: 2026-06-12

## Mission

Site conversion on paid traffic is far below viable and there is no ad-to-landing feedback loop. The fix: dedicated, message-matched landing pages so we get a measurable conversion loop at 1-4 percent, aiming for 3 percent. Ads and landings are built as pairs: the ad promise and the landing page say the same thing to the same person.

## The system

Two axes, every page is one cell:

- **Personas (3-4, being locked with the team):** each persona gets its own landing bucket with copy aligned to the ads pointed at it.
- **Formats (~3 per persona):** different consumption structures for the same persona promise.

| Format | Status | Doc |
|--------|--------|-----|
| Quiz | LIVE - engine + template shipped, awaiting persona content | [quiz-format.md](./quiz-format.md) |
| Listicle | BLUEPRINT AGREED - IM8 layout digested, framework build next | [listicle-blueprint.md](./listicle-blueprint.md) |
| Third format | UNDECIDED - to pick with the team | - |

All formats live on one route system: `/go/[slug]`, one config file per page, registered in `app/lib/landings/index.ts`. Pages are ad destinations only: noindex, no nav, never linked from the site. An iteration or A/B test = a new slug. No CMS, no A/B infra.

**Current-state mechanics reference:** `docs/features/LANDING_QUIZ_SYSTEM.md` (architecture, schema, how to add a page). This README is strategy and status; that doc is how the code works.

## Tracking plan

Three layers, all keyed so pages and ads can be compared:

1. **Vercel Analytics (page-level funnel):** every event carries `slug`, `persona`, `format`, `sessionId`. Events: `landing:started`, `screen_viewed` (drop-off), `answer_selected`, `completed`, `results_viewed`, `cta_clicked`. Compare slugs to compare iterations.
2. **Meta (ad-side signal):** ViewContent on start, Lead on completion, pixel + CAPI deduplicated, production host only. Purchase attribution rides the existing headless attribution stack (`docs/analytics/HEADLESS_ATTRIBUTION_FIX.md`): shop.conka.io checkout domain, fbclid capture to `_fbc`, cart attributes, server Purchase webhook.
3. **Ad-to-slug convention (agreement, not code):** each ad set points at exactly one slug and carries UTMs, e.g. `/go/sport-quiz?utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`. Pending code tweak: `landing:started` captures utm_source/medium today; extend to utm_campaign/content for ad-level splits.

**Before scaling spend:** deploy, run `/review-analytics`, verify Lead/ViewContent dedup in Meta Events Manager test tool, click through ad-link to checkout once to confirm UTM/fbclid survival.

## Decision log

| Decision | Status | Notes |
|----------|--------|-------|
| Personas (which 3-4) | OPEN - team session | Drives everything; ads and landings are paired per persona |
| Results CTA destination | OPEN - team session | Per-bucket config string: checkout, PDP, or /funnel. Copy edit, not code |
| Email gate before results | OPEN | If yes: email screen kind + Klaviyo + Convex response storage built together (~1 day) |
| Rating line figure | OPEN | Template shows placeholder "4.9/5"; needs a defensible number |
| Listicle offer mechanics | OPEN | Cloud leans on 49% off + free shipping + bundles; what is CONKA's equivalent offer? See listicle-format.md |
| Third format | OPEN | Decide with team |
| Response storage (Convex) | DECIDED: not yet | Aggregate analytics only; revisit when the email gate is decided (store responses with the email) |
| Format architecture | DECIDED | One /go/[slug] route, config files in code, no CMS/A-B infra |
| Quiz visual language | DECIDED | Flow-style: centered, fixed logo header, inset bar, navy selected, no eyebrows. Theme is now per-config (light or dark, neuro blue accent either way); brain-age runs dark (see brain-age-quiz.md) |

## History / Jira

- SCRUM-1081 - quiz engine + config system + template. SHIPPED 2026-06-12 (PR #302)
- SCRUM-1083 - legacy /quiz purge, redirect to /funnel. SHIPPED 2026-06-12
- SCRUM-1082 - open decisions and follow-ons tracker (live)

## Doc map

- [quiz-format.md](./quiz-format.md) - quiz format plan, phases, what shipped
- [brain-age-quiz.md](./brain-age-quiz.md) - first persona quiz (ageing-brain, /go/brain-age), scoped 2026-06-12, SCRUM-1084
- [listicle-blueprint.md](./listicle-blueprint.md) - **the listicle build plan** - IM8 section-by-section layout, config schema, build phases
- [listicle-format.md](./listicle-format.md) - earlier listicle reference evaluation (usecloud.co); principles still apply, layout superseded by the blueprint
- `docs/features/LANDING_QUIZ_SYSTEM.md` - how the shipped system works (schema, recipes, gotchas)
- `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` - attribution stack the tracking relies on
- `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` - the wider strategy this programme sits inside
