# Landing Quiz System (/go/[slug])

Persona-aligned ad landing pages with a config-driven quiz engine. Built June 2026 for the conversion push: 3-4 ad personas, each with landing format iterations (quiz live, listicle planned), targeting 1-4% conversion on paid Meta traffic.

These pages are ad destinations only: noindex, no Navigation/Footer (the quiz owns the viewport), never linked from the site. Reference template: `/go/quiz-template`. Programme + plan docs: `docs/development/featurePlans/landing-conversion/` (start at the README).

**Not the old quiz.** The legacy `/quiz` (protocol scoring) is deprecated and unrelated. This system shares nothing with it except some analytics naming conventions. The legacy code is scheduled for removal.

## Architecture

| Path | Role |
|------|------|
| `app/go/[slug]/page.tsx` | Route. Registry lookup, 404 on unknown slug, noindex metadata. `dynamicParams = false` |
| `app/go/[slug]/error.tsx` | Error boundary (reset button) |
| `app/lib/landings/types.ts` | Config schema. Discriminated unions: screen `kind`, question `type`, interstitial `variant`, chart `type` |
| `app/lib/landings/index.ts` | Registry: slug to config map |
| `app/lib/landings/quiz-template.ts` | Reference config with placeholder copy. Copy this to start a new page |
| `app/components/go/QuizEngine.tsx` | Orchestrator: fixed header (logo, back, counter, progress), screen sequencing, answers map, score tally, all analytics |
| `app/components/go/QuizQuestion.tsx` | Single-choice (auto-advance ~240ms after tap) and slider questions |
| `app/components/go/QuizScreens.tsx` | Landing, interstitial, analyzing, results renderers |
| `app/components/go/QuizProgressBar.tsx`, `QuizButton.tsx`, `AnimatedText.tsx`, `AnimatedStat.tsx`, `ComparisonChart.tsx`, `BarChart.tsx`, `PieChart.tsx` | Plug-and-play primitives |

Motion utilities (`go-screen-in`, `go-fade-up`, `go-cascade`, `go-draw`, `go-bar`) live in `app/brand-base.css`. CSS-only by design, all respect `prefers-reduced-motion`. No GSAP, no chart library on these pages. (`go-cascade` is the single-choice option reveal: each tile rises and fades in, staggered by an inline per-index `animationDelay` in `QuizQuestion`.)

## Creating a new landing page

1. Copy `app/lib/landings/quiz-template.ts` to a new file, e.g. `sport-quiz.ts`.
2. Set `slug` (becomes the URL: `/go/sport-quiz`), `persona`, `title`.
3. Write the `screens` array: any number of questions and interstitials, in any order. The engine renders whatever the array describes.
4. Define `buckets` (result profiles) and point every answer's `scores` at bucket ids.
5. Register it in `app/lib/landings/index.ts` (one line).

Nothing else changes. An A/B iteration is a second config file with a different slug; compare slugs in Vercel Analytics.

## Screen schema

Sequence convention (from the flowalarmclock reference): landing hook, questions interleaved with interstitials, analyzing beat, results.

- **landing** - title, subtitle, optional `video` (public path, rendered as a 220px square with the bottom 20% cropped, sized for a 720x900 source), optional `rating` (5 navy stars + text above the CTA), `cta`, optional `footnote`.
- **question, type "single"** - `options[{ label, icon?, scores }]`. Auto-advances on tap. Selected = solid navy, white text.
- **question, type "slider"** - `slider{ min, max, step?, minLabel, maxLabel, unit?, bands }`. `bands` map value ranges to scores (first band where value <= upTo wins). Advances on Continue.
- **interstitial** - `variant: stat | education | testimonial | comparison | commitment`. Variant sets emphasis (commitment = biggest title; stat renders `stat{ value, prefix?, suffix?, label }` as an 8xl navy count-up). `body` paragraphs reveal in sequence. Any variant may carry a `chart`:
  - `{ type: "line", withLabel, withoutLabel, caption? }` - stylised with/without curve (illustrative, not data-driven)
  - `{ type: "bar", items[{ label, value, accent? }], unit?, caption? }` - horizontal bars, real values
  - `{ type: "pie", segments[{ label, value }], caption? }` - donut, first segment gets the accent, values are relative
- **analyzing** - `steps[]` tick through (~700ms each), then auto-advance.
- **results** - renders the winning bucket: `tag` (mono accent label), `title`, `body`, `recommendation` card, CTA.

**Scoring:** every answer contributes points to buckets; highest total wins (ties resolve to the earlier bucket in `buckets`). **Results CTA:** `config.resultsCta.href` is the default destination; `bucket.ctaHref` overrides per result (template: flow bucket goes to `/conka-flow`, clear to `/conka-clarity`, both falls back to `/funnel`). Where the quiz ends is a copy edit, not code.

## Analytics

Every Vercel event carries `slug`, `persona`, `format`, `sessionId`, so per-quiz funnels filter directly in Vercel Analytics.

| Event | Fires |
|-------|-------|
| `landing:started` | Mount (includes UTM + referrer) |
| `landing:screen_viewed` | Every screen change, with `screenIndex`/`screenKind`/`progress` - the drop-off marker |
| `landing:answer_selected` | Each answer, with question number and label |
| `landing:completed` | Reaching results, with `resultBucket` and time spent |
| `landing:results_viewed` | Reaching results |
| `landing:cta_clicked` | Results CTA, with destination |

**Meta:** ViewContent on start (content_name = config title), Lead on results (added to the CAPI allowlist in `app/api/meta/events/route.ts`), both browser+CAPI deduplicated via shared event IDs. Deliberately no InitiateCheckout: the Shopify Facebook channel owns that on the real checkout page. Meta only fires on `www.conka.io` (see `isProductionHost`), so previews stay clean.

**Response storage:** none. Events are aggregate-only; individual answer sets are not persisted anywhere. If response-level data is wanted (personalised follow-up, answer-combination analysis), add a Convex table + one mutation fired on completion. Scoped as a follow-on, not built.

## Gotchas

- `dynamicParams = false`: only registered slugs resolve. New configs need a deploy (config lives in code, by design).
- The quiz canvas is the `QUIZ_BG` constant in `QuizEngine.tsx` (currently white). Header and engine share it.
- Progress bar is hidden on the landing screen and inset (`max-w-sm`), not full-bleed. Linear over all screens; a perceived-progress curve would be applied where the engine computes `progress`.
- Eyebrow/kicker text was deliberately removed from the schema. Do not add it back per-screen; the style is intentionally stripped back.
- Email capture is not built. If the team wants an email gate, it needs a new screen kind plus Klaviyo wiring.
- Run `/review-analytics` after any change to the event wiring, before scaling spend.
