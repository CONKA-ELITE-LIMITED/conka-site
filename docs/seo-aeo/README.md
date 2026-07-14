# SEO / AEO Foundation

Canonical reference for the site's organic-search and AI-answer-engine (AEO) foundation: what is live and why. This is the enduring summary. The full build history, keyword-map corrections, and task breakdowns live in the planning archive: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`.

## Overview

A five-phase programme that made the CONKA site discoverable and indexable for organic search. All five phases are built and merged to `main`.

**The SEO half is done. The AEO half is not.** An AEO audit on 2026-07-14 found the site has the structured-data machinery but only two schema types on three routes, and **no entity identity at all**: no `Organization`, no `WebSite`, no `sameAs`, and no social links in the footer to populate one. Four phases remain, all scoped, none ticketed: 6 (blog), 7 (entity identity), 8 (schema and indexation hygiene), 9 (AEO content shape). See "What is next".

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

## Key files

| File | Role |
|------|------|
| `app/layout.tsx` | Root metadata: `metadataBase` (`https://www.conka.io`) and the self-referencing canonical. |
| `app/page.tsx` | Homepage metadata (server component, exported in place). |
| `app/conka-flow/layout.tsx`, `app/conka-clarity/layout.tsx`, `app/conka-both/layout.tsx`, `app/ingredients/layout.tsx` | Per-page metadata for the client PDPs, supplied by a sibling server layout. The PDP layouts also render the JSON-LD. |
| `app/lib/jsonLd.tsx` | JSON-LD builders (`buildProductSchema`, `buildFaqSchema`), the `JsonLd` render component, and `absoluteUrl`. |
| `app/sitemap.ts` | Hand-maintained list of indexable routes. |
| `app/robots.ts` | Allows general and AI crawling; disallows only `/api/`, `/account`, `/payment/`; references the sitemap. |
| `app/lib/funnelData.ts` | `FUNNEL_PRICING` (pricing source of truth); `getFunnelPriceRange` feeds the JSON-LD, `getFunnelMinPerShot` feeds the meta "From" price. |
| `app/components/product/ProductBuyPanel.tsx` | Renders the PDP `<h1>` with the optional `seoHeading` subline. Source content in `productHeroHelpers.ts`, `formulaContent.ts`, `cadenceData.ts`. |

## Key decisions and why

- **Relative canonical over per-page entries.** In the App Router, `alternates` is inherited by every child route, so one relative `"./"` in the root layout resolves correctly per route and fixes the whole site. No per-page canonical entries.
- **Sibling server layout for client-page metadata.** Client components cannot export `metadata`. Rather than split each `page.tsx`, a sibling server `layout.tsx` exports the metadata and returns `children`. This also hosts the JSON-LD.
- **Product schema ranked above FAQ.** Google restricted `FAQPage` rich results to government and health sites in 2023, so FAQ markup gives AEO/LLM value, not visible snippets. `Product` schema feeds shopping surfaces and is the higher-value markup. No `aggregateRating` (no per-product rating source; a sitewide figure risks a manual action).
- **robots allows AI crawlers and does not block noindex pages.** AEO citation is an explicit goal, so AI crawlers stay allowed. The noindex ad/funnel pages are not disallowed in robots, because blocking them would stop Google seeing their `noindex` tag.
- **Prices derive from one source.** The Product JSON-LD and the "From £X/shot" meta text both read `FUNNEL_PRICING`, so a price change cannot leave stale figures in the index. "From" means the cheapest cadence (quarterly). See `docs/PRICING_HISTORY.md`.

## Gotchas

- **Client components cannot export `metadata`.** Use a sibling server `layout.tsx`.
- **`twitter` is a separate top-level metadata field from `openGraph`.** Next merges metadata shallowly, so per-page Twitter cards must be restated or they inherit the generic root copy.
- **`app/sitemap.ts` is a hand-maintained static list.** Add a line when a new indexable page ships.
- **Meta prices and JSON-LD come from `FUNNEL_PRICING`.** When a price changes, append a dated block to `docs/PRICING_HISTORY.md`.

## How to verify

- View source on `/`, `/conka-flow`, etc.: each emits its own canonical, title, and description.
- Google Rich Results Test on a PDP: exactly one `Product` and one `FAQPage` node, prices matching `funnelData.ts`.
- `/sitemap.xml` and `/robots.txt` return HTTP 200.
- In Search Console: submit the sitemap, then watch indexed-page count and non-brand impressions move against the baseline.

## What is next

Four phases are scoped and none is ticketed. Full breakdowns, and the AEO gap audit that produced 7 to 9, are in the build archive.

| Phase | What | State |
|-------|------|-------|
| 8 | **Schema and indexation hygiene.** `FAQPage` schema on `/` and `/professionals` (the content already renders and the builder already exists, it is simply not called); metadata for `/case-studies` and `/conkaapp-privacy-policy`, both in the sitemap with generic root tags; a real `noindex` on `/barrys` and `/win`, which are indexable today despite a sitemap comment claiming otherwise; drop the fabricated `lastModified`; add `llms.txt`. | Unblocked. Cheapest, ship first |
| 7 | **Entity identity.** `Organization` + `WebSite` JSON-LD with `sameAs`, plus the footer social links to corroborate it, plus a web manifest. The highest-leverage AEO work available, and none of it exists. | **Blocked** on a list of real profile URLs |
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
