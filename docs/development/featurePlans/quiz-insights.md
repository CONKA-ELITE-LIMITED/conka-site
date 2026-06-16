# Quiz Insights

Durable, queryable capture of how visitors move through the `/go` landing quizzes, so a dashboard can show per-quiz drop-off and conversion. Part of the [landing conversion programme](./landing-conversion/README.md).

**Status:** Phase 1 scoped 2026-06-16 (branch `quiz-insights-dashboard`). Phase 2 (dashboard) is a separate future scope.
**Appetite:** ~1 day for Phase 1.
**Tracking:** Plan doc only (internal analytics tooling, no Jira).

## Problem

The `/go` quiz engine (`QuizEngine.tsx`) stores nothing queryable. It only fires fire-and-forget Vercel Analytics events, which are aggregate, sampled, short-retention, and cannot be queried per-session. We cannot answer "which quiz, how far did people get, did they convert" without a durable structured store. This is the data foundation a visual dashboard reads.

This work is also part of the wider Convex migration: the backend is moving from Kristian's deployment to Rudh's own (`ceaseless-okapi-577`). See git history / session notes.

## Governing principle

> Capture facts as they happen, in their rawest convenient form. Defer all shaping to the dashboard.

We make zero assumptions about what the dashboard needs. No pre-aggregation, no pre-joins, nothing discarded. The write side stays dumb and unbreakable; the read side does the thinking. This is safe because aggregating a few thousand indexed events is cheap, and raw events are losslessly reversible into any rollup later (the reverse is never true).

This was a deliberate architectural choice. An earlier draft proposed a denormalized mutable session document (one row per attempt, with `furthestIndex` and an embedded answers array). It was rejected as premature optimization: it pushed read-modify-write complexity into the live write path to speed up a dashboard that does not exist yet, and it discarded data (per-screen timing, back-navigation, score contributions) by guessing what the dashboard would not need. The raw event log makes no such guesses.

## Approach

One append-only Convex table, `quizEvents`. One mutation, `record`. A one-function client hook fires it in parallel with the `trackLanding*` Vercel calls the engine already makes, at the same five moments. Vercel and Meta events are untouched; Convex is purely additive.

## The model

```
quizEvents {
  // identity - on every event ("fat event", so reads never need a join)
  sessionId, slug, persona, format,

  // what happened
  type,   // "started" | "screen_viewed" | "answer_selected" | "completed" | "cta_clicked"

  // screen context (screen_viewed)
  screenIndex?, screenId?, screenKind?,

  // answer context (answer_selected)
  questionNumber?, answerValue?, answerLabel?,

  // outcome context (completed)
  resultBucket?, brainAge?, brainAgeGap?,

  // handoff context (cta_clicked)
  destination?,

  // attribution (captured on "started")
  referrer?, utmSource?, utmMedium?,

  ts   // event timestamp
}
indexes:
  by_slug_ts   // [slug, ts]   -> every per-quiz query, time-ordered
  by_session   // [sessionId]  -> reconstruct one person's path
```

Five event types, one table, two indexes. All fields optional except identity, `type`, and `ts`.

## Proof it reads cleanly

Every reference-dashboard widget maps to one straightforward aggregation over `by_slug_ts`:

| Dashboard widget | Query over `quizEvents` |
|---|---|
| Which quiz | filter `slug` (persona/format ride along) |
| Per-step funnel (% of starters still in at step N) | count distinct `sessionId` among `screen_viewed`, grouped by `screenId` |
| Single-step drop ("7% lost") | ratio of distinct sessions between adjacent `screenId`s |
| Answer distribution | filter `answer_selected` for a `screenId`, group by `answerValue` |
| Completion rate | distinct sessions with `completed` / distinct with `started` |
| Handoff / conversion | distinct sessions with `cta_clicked` / `started`, split by `utmSource` |
| 30-day trend | bucket `started`/`completed`/`cta_clicked` by day from `ts` |
| Brain-age outcome | `brainAge`/`brainAgeGap` carried on `completed` |

Duplicate fires do not distort anything: the funnel counts distinct sessions, and answers resolve last-write-wins at read time. No write-side dedup needed.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Event capture: `quizEvents` table + `record` mutation + hook + engine wiring | Not Started |
| 2 | Dashboard page (`/admin/quiz-insights`) reading these events | Future (separate scope) |

## Phase 1 tasks

1. **[Data] `quizEvents` table + `record` mutation** - Small. `convex/schema.ts` (table + 2 indexes), `convex/quizEvents.ts` (single pure-insert mutation, no reads/branching).
2. **[Frontend] One-function persistence hook** - Small. `app/hooks/useQuizEvents.ts` returns `record(type, payload)`, fire-and-forget with silent `.catch` (mirrors `safeTrack`). Delete dead `app/hooks/useQuizAnalytics.ts`.
3. **[Frontend] Wire into the engine** - Medium. `QuizEngine.tsx`: parallel `record(...)` at the 5 points where `trackLanding*` already fires. Persist `sessionId` to `sessionStorage` (keyed by slug) so a reload continues the same session.
4. **[QA] Verify** - Small. Walk `quiz-template` + `brain-age` locally; confirm events land per session in Convex. Back-nav + reduced-motion sanity.

## Design system

N/A for Phase 1 (no UI).

## Rabbit holes

- **Pre-shaping the read side.** No session-state docs, `furthestIndex`, embedded answer arrays, or rollup tables. If the itch appears, the dashboard is teaching us a real query pattern - add a derived rollup then, from the raw events we kept.
- **Write-side dedup/guards.** Not needed; reads handle duplicates. Keep `record` a pure insert.

## No-gos

- No UI / dashboard page (Phase 2).
- No removal of Vercel/Meta events - Convex is additive.
- No touching legacy `quizSessions`/`quizAnswers` tables or their queries.
- No PII - anonymous `sessionId` only. Deliberately supersedes the brain-age plan's old "no Convex response storage" note (that was a v1 shortcut).

## Risks

- Convex reactive queries over a growing log re-run on each new event; negligible at this scale, paginated/rolled-up later if a live dashboard makes it bite. `by_slug_ts` keeps scans bounded.

## Decisions

| Decision | Choice |
|----------|--------|
| Storage shape | Fat raw event log (schema-on-read), not denormalized session state. Dumb writes, smart reads, nothing discarded. |
| Identity denormalization | `slug`/`persona`/`format` on every event so reads never join back to a session table. Storage is cheap; query simplicity is the prize. |
| Conversion definition | Deferred to the dashboard (Phase 2). Storage captures `completed` + `cta_clicked` + UTM; the dashboard decides how to define conversion. True purchase conversion is a later Shopify-order join on `sessionId`/UTM. |
| Session identity | `sessionId` persisted to `sessionStorage` (was per-mount React state) so reloads do not fragment a session. Also improves the existing Vercel events. |
| Legacy code | Old `quizSessions`/`quizAnswers` tables left untouched; dead `useQuizAnalytics.ts` hook deleted. |

## References

- Engine: `app/components/go/QuizEngine.tsx`, schema `app/lib/landings/types.ts`
- Analytics events mirrored: `app/lib/analytics.ts` (`landing:*`, lines 53-135)
- Convex provider: `app/components/ConvexClientProvider.tsx` (wraps all `/go` routes)
- Reference quiz config: `app/lib/landings/quiz-template.ts`; brain-age plan `./landing-conversion/brain-age-quiz.md`
- System mechanics: `docs/features/LANDING_QUIZ_SYSTEM.md`
