# SEO / AEO Foundation

Canonical reference for the site's organic-search and AI-answer-engine (AEO) foundation: what is live and why. This is the enduring summary. The full build history, keyword-map corrections, and task breakdowns live in the planning archive: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`.

## Overview

A programme that made the CONKA site discoverable and indexable for organic search, and parseable by AI answer engines. Phases 1 to 5 (SEO foundation) and Phase 8 (AEO hygiene) are built.

**The SEO half is done. The AEO half is part-built.** An AEO audit on 2026-07-14 found the site had the structured-data machinery but only two schema types on three routes, and **no entity identity at all**. Phase 8 closed the cheap gaps. What is still missing is the entity identity itself: no `Organization`, no `WebSite`, no `sameAs`, and no social links in the footer to populate one. Three phases remain: 7 (entity identity), 9 (AEO content shape), 6 (blog). See "What is next".

## Why it mattered

A pre-change Google Search Console baseline (`docs/analytics/seo-search-console-baseline.md`) showed roughly 99% of organic traffic was brand ("conka") and only 17 URLs had drawn any impression in three months. The cause was structural, not copy: the site was telling Google every page was a duplicate of the homepage, and the money pages shared one title and description. The organic surface was effectively switched off while the site paid for traffic. This programme fixed that at the infrastructure level.

## What is live

| Phase | What shipped | Why | Ticket |
|-------|--------------|-----|--------|
| 1 | Root canonical made self-referencing (`alternates.canonical: "./"` in `app/layout.tsx`) | Every page previously canonicalised to the homepage, telling Google to drop them from the index. One line repaired the whole site. | SCRUM-1131 |
| 2 | Per-page title, description, OpenGraph and Twitter on the five money pages | All five inherited one generic tag. Unique, keyword-bearing metadata lets each page compete. Also retired the stylised `FL0W` so the Flow H1 reads the real word. | SCRUM-1132 |
| 3 | `Product` and `FAQPage` JSON-LD on the three PDPs | Structured data feeds shopping surfaces and lets AI engines parse price, availability, and Q&A. | SCRUM-1133 |
| 5 | `app/sitemap.ts` and `app/robots.ts` | Gave Google a crawl map (discovery was the measured bottleneck) and deliberately allowed AI crawlers for AEO. | SCRUM-1136 |
| 4 | Descriptive keyword subline inside each PDP `<h1>` (`seoHeading`) | Puts target keywords in the strongest on-page signal without disturbing the product name or bottle alt text. | SCRUM-1138 |
| - | Money-page "From £X/shot" prices derived from `FUNNEL_PRICING` | Removes drift between the meta descriptions and the Product JSON-LD, which already derives from the same source. | SCRUM-1139 |
| 8 | `FAQPage` JSON-LD on `/` and `/professionals`; metadata for `/case-studies` and `/conkaapp-privacy-policy`; `/win` and `/barrys` deleted and 301'd; `lastModified` dropped from the sitemap; `public/llms.txt` added | Both pages already rendered the Q&A and the builder already existed, so the schema was free. The two sitemapped pages were inheriting generic root tags. `/win` and `/barrys` were expired January 2026 contests, still live and indexable, so Google could serve a dead competition as a CONKA result. | SCRUM-1140 |

## Key files

| File | Role |
|------|------|
| `app/layout.tsx` | Root metadata: `metadataBase` (`https://www.conka.io`) and the self-referencing canonical. |
| `app/page.tsx` | Homepage metadata (server component, exported in place) and the homepage `FAQPage` JSON-LD. |
| `app/conka-flow/layout.tsx`, `app/conka-clarity/layout.tsx`, `app/conka-both/layout.tsx`, `app/ingredients/layout.tsx`, `app/case-studies/layout.tsx`, `app/conkaapp-privacy-policy/layout.tsx` | Per-page metadata for the client pages, supplied by a sibling server layout. The PDP layouts also render the JSON-LD. |
| `app/lib/jsonLd.tsx` | JSON-LD builders (`buildProductSchema`, `buildFaqSchema`), the `JsonLd` render component, and `absoluteUrl`. |
| `app/lib/faqContent.ts`, `app/components/b2b/TeamFAQ.tsx` | FAQ sources. `FAQ_ITEMS` feeds `/` and `/conka-both`; `TEAM_FAQS` (exported from the component) feeds `/professionals`. Both the visible accordion and the JSON-LD read the same array, which is what keeps the schema truthful. |
| `app/sitemap.ts` | Hand-maintained list of indexable routes. No `lastModified`. |
| `public/llms.txt` | Plain-text brand and URL map for AI crawlers. |
| `app/robots.ts` | Allows general and AI crawling; disallows only `/api/`, `/account`, `/payment/`; references the sitemap. |
| `app/lib/funnelData.ts` | `FUNNEL_PRICING` (pricing source of truth); `getFunnelPriceRange` feeds the JSON-LD, `getFunnelMinPerShot` feeds the meta "From" price. |
| `app/components/product/ProductBuyPanel.tsx` | Renders the PDP `<h1>` with the optional `seoHeading` subline. Source content in `productHeroHelpers.ts`, `formulaContent.ts`, `cadenceData.ts`. |

## Key decisions and why

- **Relative canonical over per-page entries.** In the App Router, `alternates` is inherited by every child route, so one relative `"./"` in the root layout resolves correctly per route and fixes the whole site. No per-page canonical entries.
- **Sibling server layout for client-page metadata.** Client components cannot export `metadata`. Rather than split each `page.tsx`, a sibling server `layout.tsx` exports the metadata and returns `children`. This also hosts the JSON-LD.
- **Product schema ranked above FAQ.** Google restricted `FAQPage` rich results to government and health sites in 2023, so FAQ markup gives AEO/LLM value, not visible snippets. `Product` schema feeds shopping surfaces and is the higher-value markup. No `aggregateRating` (no per-product rating source; a sitewide figure risks a manual action).
- **robots allows AI crawlers and does not block noindex pages.** AEO citation is an explicit goal, so AI crawlers stay allowed. The noindex ad/funnel pages are not disallowed in robots, because blocking them would stop Google seeing their `noindex` tag.
- **Prices derive from one source.** The Product JSON-LD and the "From £X/shot" meta text both read `FUNNEL_PRICING`, so a price change cannot leave stale figures in the index. "From" means the cheapest cadence (quarterly). See `docs/PRICING_HISTORY.md`.
- **Schema is generated from the same array the page renders.** FAQ markup describing content a user cannot see breaches Google's policy. Every `FAQPage` node on the site is built from the exact array its visible accordion renders, so the two cannot drift apart.
- **No `lastModified` in the sitemap.** It used to stamp every URL with the build time, which told Google the whole site changed on every deploy. A signal that is always wrong is worth less than no signal, so it was removed. Set it per-entry only when a real modification date exists (the blog will have one).
- **Expired campaign pages get deleted, not noindexed.** `/win` and `/barrys` outlived their January 2026 deadlines while still indexable. Noindex would have left two dead pages on the site; deleting and redirecting removes them and passes any link signal to `/`.

## Gotchas

- **Client components cannot export `metadata`.** Use a sibling server `layout.tsx`.
- **`twitter` is a separate top-level metadata field from `openGraph`.** Next merges metadata shallowly, so per-page Twitter cards must be restated or they inherit the generic root copy.
- **`app/sitemap.ts` is a hand-maintained static list.** Add a line when a new indexable page ships. Also add the page to `public/llms.txt` if it is worth an AI citation.
- **Meta prices and JSON-LD come from `FUNNEL_PRICING`.** When a price changes, append a dated block to `docs/PRICING_HISTORY.md`.
- **Never emit FAQ schema for content the page does not render.** Build it from the array the accordion uses, not a hand-written copy.
- **`convex/winEntries.ts` is dead code.** Deleting `/win` and `/barrys` removed its only callers. The `winEntries` table still holds real entrant emails, so neither the table nor the functions were dropped. Handle in a Convex cleanup pass, not by deleting the data.

## How to verify

- View source on `/`, `/conka-flow`, etc.: each emits its own canonical, title, and description.
- Google Rich Results Test on a PDP: exactly one `Product` and one `FAQPage` node, prices matching `funnelData.ts`.
- `/` and `/professionals`: exactly one `FAQPage` node each, and every question in it also appears in the rendered HTML.
- `/sitemap.xml`, `/robots.txt` and `/llms.txt` return HTTP 200. The sitemap carries no `lastmod`.
- `/win` and `/barrys` redirect to `/` (Next emits 308 for `permanent: true`; Google treats it as a 301).
- In Search Console: submit the sitemap, then watch indexed-page count and non-brand impressions move against the baseline.

## What is next

Three phases remain, none ticketed. Full breakdowns, and the AEO gap audit that produced 7 to 9, are in the build archive.

| Phase | What | State |
|-------|------|-------|
| 7 | **Entity identity.** `Organization` + `WebSite` JSON-LD with `sameAs`, plus the footer social links to corroborate it, plus a web manifest. The highest-leverage AEO work available, and none of it exists. With Phase 8 shipped, this is the single biggest remaining gap. | **Blocked** on a list of real profile URLs |
| 9 | **AEO content shape.** Retrofit answer-first (BLUF) openings, self-contained passages, and true freshness dates onto the existing content pages. Editorial, not engineering. | Needs a content owner |
| 6 | **Blog.** Informational content surface for research-intent, non-brand keywords. Scoped in `docs/development/featurePlans/blog-informational-content-surface.md` (content model: Notion as a headless CMS). Its content contract already bakes in BLUF, atomic passages and freshness, so Phase 9 is only the retrofit of existing pages. | Gated on the content engine |

**Not a site problem, but recorded:** the strongest AEO lever is off-site brand mentions (PR, citations, Reddit and Quora discussion). No code change can deliver it, and no workstream currently owns it.

## References

- Build archive and full history: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`
- Keyword research (source input): `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`
- Pricing audit log: `docs/PRICING_HISTORY.md`
- Phase 6 plan: `docs/development/featurePlans/blog-informational-content-surface.md`
- Page rules (mandatory SEO and JSON-LD): `.claude/rules/pages.md`
