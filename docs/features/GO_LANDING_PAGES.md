# `/go/[slug]` Landing Pages

The shared contract behind every ad landing page. **Read this first**, then the doc
for the format you are building:

| Format | Doc | What it is |
|---|---|---|
| `listicle` | [`LISTICLE_SYSTEM.md`](./LISTICLE_SYSTEM.md) | "N reasons" pages, two templates (`mm` editorial, `im8` proof-dense) |
| `quiz` | [`LANDING_QUIZ_SYSTEM.md`](./LANDING_QUIZ_SYSTEM.md) | Config-driven quiz engine with screens, scoring and a reveal |

Everything on this page is true of both. Neither format doc repeats it.

---

## What these pages are

Destinations for paid Meta traffic, and nothing else. Built June 2026 for the
conversion push: 3-4 ad personas, each with format iterations, targeting 1-4%
conversion.

The rules that follow from that:

- **`noindex`.** `generateMetadata` sets `robots: { index: false, follow: false }`. These pages must never compete with the money pages in organic search.
- **Never linked from the site.** No nav entry, no footer link, no internal link from any indexed page. Traffic arrives from an ad or not at all.
- **A new iteration is a new slug**, never an edit to a live one. That keeps the comparison clean in Vercel Analytics, where you filter by `slug`.

**Not the old `/quiz`.** The legacy protocol-scoring quiz was deleted and now 308s
to `/build-your-order`. This system shares nothing with it except some analytics
naming conventions.

## The route

```
config (app/lib/landings/*.ts)
  -> registered in app/lib/landings/index.ts
  -> app/go/[slug]/page.tsx: getLandingConfig(slug)
       -> config.format === "quiz" ? QuizEngine : <listicle renderer by template>
```

| Path | Role |
|------|------|
| `app/go/[slug]/page.tsx` | The route. Registry lookup, 404 on unknown slug, noindex metadata |
| `app/go/[slug]/error.tsx` | Error boundary with a reset button |
| `app/lib/landings/index.ts` | **The registry.** Slug to config map. Adding a page is one line here |
| `app/lib/landings/types.ts` | Shared config schema; `format` is the top-level discriminator |

**`dynamicParams = false`.** `generateStaticParams` builds every registered slug and
an unregistered slug 404s. Config lives in code by design, so **a new page needs a
deploy**. There is no CMS and there is not meant to be one.

## Adding a page, in outline

1. Copy the model config for your format (each format doc names it).
2. Set `slug` (becomes the URL), `persona`, `format`, `title`.
3. Write the format-specific body.
4. Register it in `app/lib/landings/index.ts`.
5. Deploy.

Nothing else changes. No route file, no component, no per-page styling.

## Analytics, the shared part

Both formats emit their own event family (`landing:*` for quizzes,
`listicle:*` for listicles) and each doc specifies its own. What is shared:

- **Every event carries `slug`**, so per-page funnels filter directly in Vercel Analytics. Compare within a format, not across: the two engines measure different things under similar-sounding names.
- **The two-property budget** documented in `app/lib/analytics.ts` applies to both. Fold extra dimensions into an existing property rather than adding a third.
- **Section impressions use one shared observer**, `app/components/analytics/sectionImpressions.tsx` (also used by the PDPs). It takes an `onSeen(section)` callback and knows nothing about event names, so each surface keeps its own event shape. **Do not change its `threshold` or `rootMargin`** without accepting that every historical impression count is silently rebased.
- **Meta:** ViewContent on entry. Meta only fires on `www.conka.io` (see `isProductionHost`), so preview deploys stay out of the dataset.
- Run `/review` after any change to event wiring, before scaling spend.

## Gotchas that bite both formats

- **A new config needs a deploy.** Marketing cannot ship a page without one.
- **Unknown ids fail the build**, deliberately, so a page cannot ship with a broken reference. Add the id to its source file first.
- **Preview vs production.** Meta is host-gated, Vercel Analytics is not, so preview traffic does reach Vercel. Discount your own walkthroughs when reading a fresh page's numbers.

## References

- Programme and plan docs: `docs/development/featurePlans/landing-conversion/` (start at its README)
- Live listicle performance data: `docs/analytics/LISTICLE_PERFORMANCE.md`
