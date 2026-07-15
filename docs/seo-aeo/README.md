# SEO / AEO Foundation

Canonical reference for the site's organic-search and AI-answer-engine (AEO) foundation: what is live and why. This is the enduring summary. The full build history, keyword-map corrections, and task breakdowns live in the planning archive: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`.

## Overview

A programme that made the CONKA site discoverable and indexable for organic search, and parseable and citable by AI answer engines. **The on-site foundation is complete**: phases 1 to 5 (SEO), 7 (entity identity), 8 (AEO hygiene), 10 (FAQ answer surface) and 9 (AEO content shape) are all built.

What remains is not on-site engineering. **Phase 6** (the blog) is gated on a content engine, and the strongest AEO lever of all, off-site brand mentions, cannot be delivered by any change to this repo. See "What is next".

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
| 8 | `FAQPage` JSON-LD on `/` and `/professionals`; metadata for `/case-studies` and `/conkaapp-privacy-policy`; `/win` and `/barrys` deleted and 301'd; sitemap `lastModified` fixed; `public/llms.txt` added | Both pages already rendered the Q&A and the builder already existed, so the schema was free. The two sitemapped pages were inheriting generic root tags. `/win` and `/barrys` were expired January 2026 contests, still live and indexable, so Google could serve a dead competition as a CONKA result. | SCRUM-1140 |
| 7 | Sitewide `Organization` + `WebSite` JSON-LD with `sameAs`, social links in the footer, and a web manifest | The site had no entity identity: nothing told an answer engine what CONKA *is*, so "CONKA" was a string to disambiguate rather than a verified entity. The Organization carries the Companies House number, VAT ID, registered address and incorporation date, so the identity claim can be corroborated against public record. | SCRUM-1141 |
| 10 | FAQ answer surface: one FAQ source of truth, a `/faq` hub with safety/app/support clusters, per-surface curated subsets, ingredient FAQs on `/ingredients`, Informed Sport surfaced beyond `/professionals` | Our 20 indexed FAQ questions closed objections for someone already on the page but answered almost nothing people search. One dataset, expanded and surfaced per page. | SCRUM-1143 |
| - | Product `brand` references the Organization `@id` rather than a standalone `Brand` node | The graph previously held two "CONKA" concepts (the Product's `Brand` and the `Organization`); one `@id` reference resolves them to a single verifiable entity. | SCRUM-1148 |
| 9 | Answer-first (BLUF) openings and self-contained passages retrofitted onto `/science`, `/why-conka`, `/ingredients`, `/our-story`, `/app` and `/app-insights`; a visible "Reviewed &lt;month year&gt;" freshness line (`ReviewedDate`) on each; the real-world evidence report hosted and linked from `/app-insights` | Answer engines read passages in isolation, so a section that warms up or leans on a cross-paragraph pronoun never gets quoted. The visible review date is an editorial trust signal, distinct from the git-derived sitemap `lastModified`. | SCRUM-1149 |

## Key files

| File | Role |
|------|------|
| `app/layout.tsx` | Root metadata: `metadataBase` (`https://www.conka.io`) and the self-referencing canonical. Also renders the sitewide `Organization` and `WebSite` JSON-LD. |
| `app/lib/site.ts` | `SITE_ORIGIN`, `BRAND_DESCRIPTION`, `COMPANY` (Companies House verified details), and `SOCIAL_PROFILES` / `SAME_AS` / `FOOTER_SOCIALS`. Single source for brand identity; non-secret, so in code rather than env. |
| `app/components/footer/Footer.tsx` | Renders the social row from `FOOTER_SOCIALS`. These outbound links are what corroborate the schema's `sameAs` claim. |
| `app/manifest.ts` | Web app manifest, using the 512x512 `app/icon.png`. |
| `app/page.tsx` | Homepage metadata (server component, exported in place) and the homepage `FAQPage` JSON-LD. |
| `app/conka-flow/layout.tsx`, `app/conka-clarity/layout.tsx`, `app/conka-both/layout.tsx`, `app/ingredients/layout.tsx`, `app/case-studies/layout.tsx`, `app/conkaapp-privacy-policy/layout.tsx` | Per-page metadata for the client pages, supplied by a sibling server layout. The PDP layouts also render the JSON-LD. |
| `app/lib/jsonLd.tsx` | JSON-LD builders (`buildProductSchema`, `buildFaqSchema`), the `JsonLd` render component, and `absoluteUrl`. |
| `app/lib/faqContent.ts`, `app/components/b2b/TeamFAQ.tsx` | FAQ sources. `FAQ_ITEMS` feeds `/` and `/conka-both`; `TEAM_FAQS` (exported from the component) feeds `/professionals`. Both the visible accordion and the JSON-LD read the same array, which is what keeps the schema truthful. |
| `app/sitemap.ts` | Hand-maintained list of indexable routes. Each carries the source paths it renders, and `lastModified` is the git date of the last commit touching them. |
| `public/llms.txt` | Plain-text brand and URL map for AI crawlers. |
| `app/robots.ts` | Allows general and AI crawling; disallows only `/api/`, `/account`, `/payment/`; references the sitemap. |
| `app/lib/funnelData.ts` | `FUNNEL_PRICING` (pricing source of truth); `getFunnelPriceRange` feeds the JSON-LD, `getFunnelMinPerShot` feeds the meta "From" price. |
| `app/components/product/ProductBuyPanel.tsx` | Renders the PDP `<h1>` with the optional `seoHeading` subline. Source content in `productHeroHelpers.ts`, `formulaContent.ts`, `cadenceData.ts`. |
| `app/components/ReviewedDate.tsx` | The visible "Reviewed &lt;month year&gt;" freshness line on the content pages. Machine-readable `<time>`, light/dark tone, optional tone-matched divider. |
| `public/CONKA-Real-World-Evidence-Report.pdf` | Real-world evidence report (712 app users, 7,593 cognitive tests). Hosted for the citation/download link in the `/app-insights` methodology footer. |

## Key decisions and why

- **Relative canonical over per-page entries.** In the App Router, `alternates` is inherited by every child route, so one relative `"./"` in the root layout resolves correctly per route and fixes the whole site. No per-page canonical entries.
- **Sibling server layout for client-page metadata.** Client components cannot export `metadata`. Rather than split each `page.tsx`, a sibling server `layout.tsx` exports the metadata and returns `children`. This also hosts the JSON-LD.
- **Product schema ranked above FAQ.** Google restricted `FAQPage` rich results to government and health sites in 2023, so FAQ markup gives AEO/LLM value, not visible snippets. `Product` schema feeds shopping surfaces and is the higher-value markup. No `aggregateRating` (no per-product rating source; a sitewide figure risks a manual action).
- **robots allows AI crawlers and does not block noindex pages.** AEO citation is an explicit goal, so AI crawlers stay allowed. The noindex ad/funnel pages are not disallowed in robots, because blocking them would stop Google seeing their `noindex` tag.
- **Prices derive from one source.** The Product JSON-LD and the "From £X/shot" meta text both read `FUNNEL_PRICING`, so a price change cannot leave stale figures in the index. "From" means the cheapest cadence (quarterly). See `docs/PRICING_HISTORY.md`.
- **Schema is generated from the same array the page renders.** FAQ markup describing content a user cannot see breaches Google's policy. Every `FAQPage` node on the site is built from the exact array its visible accordion renders, so the two cannot drift apart.
- **Sitemap `lastModified` is derived from git, never hand-maintained.** It used to stamp every URL with the build time, which told Google the whole site changed on every deploy. It is now the date of the last commit touching that route's source files, so it is true by construction and no one has to remember to bump it. This needs `VERCEL_DEEP_CLONE=1` in the Vercel project env: Vercel shallow-clones to depth 10, and without full history `git log` cannot see far enough back. If git returns nothing, the entry ships with no `lastmod`, which is the correct failure mode.
- **One entity, referenced by `@id`.** The `Organization` node carries a stable `@id`; `WebSite.publisher` and each PDP's Product `brand` point at it rather than restating the brand (SCRUM-1148). There is one CONKA entity on the site, not a copy per node.
- **Visible review dates are editorial, not the git sitemap date.** The sitemap's `lastModified` is a machine signal for when a route's source last changed (a CSS tweak bumps it). The visible "Reviewed &lt;month year&gt;" line is a human assertion that someone re-read the page and it is still accurate. They answer different questions and are stamped independently. Only stamp a page actually reviewed: a date on an unread page misleads users and crawlers alike, so the dates are a standing maintenance commitment, not set-and-forget.
- **`sameAs` is an identity claim, so only verified profiles go in it.** Six entries: LinkedIn, Instagram, TikTok, Trustpilot, Facebook and Companies House. No Amazon, YouTube or X, because we do not have them. A `sameAs` pointing at a dead or unowned profile is worse than a shorter list. Companies House is quietly the strongest of the six: a government registry independently confirming the company exists.
- **Footer socials are text, not icons.** Readable anchor text corroborates `sameAs` better than an unlabelled glyph, and it matches the mono footer.
- **Nothing is asserted that cannot be backed.** No `aggregateRating` on the Organization (no queryable source; the Trustpilot `sameAs` gives engines a path to the reviews without us claiming a number). No `telephone` (there is no public line, and omitting beats inventing). No `SearchAction` (no search page to point at).
- **Expired campaign pages get deleted, not noindexed.** `/win` and `/barrys` outlived their January 2026 deadlines while still indexable. Noindex would have left two dead pages on the site; deleting and redirecting removes them and passes any link signal to `/`.

## Gotchas

- **Client components cannot export `metadata`.** Use a sibling server `layout.tsx`.
- **`twitter` is a separate top-level metadata field from `openGraph`.** Next merges metadata shallowly, so per-page Twitter cards must be restated or they inherit the generic root copy.
- **`app/sitemap.ts` is a hand-maintained static list.** Add a `ROUTES` entry when a new indexable page ships, **including its `sources` paths**, or it gets no `lastmod`. Also add the page to `public/llms.txt` if it is worth an AI citation.
- **`VERCEL_DEEP_CLONE=1` must stay set** in the Vercel project env, or the sitemap's git dates silently degrade to "missing" for anything untouched in the last 10 commits.
- **Meta prices and JSON-LD come from `FUNNEL_PRICING`.** When a price changes, append a dated block to `docs/PRICING_HISTORY.md`.
- **Never emit FAQ schema for content the page does not render.** Build it from the array the accordion uses, not a hand-written copy.
- **`convex/winEntries.ts` is dead code.** Deleting `/win` and `/barrys` removed its only callers. The `winEntries` table still holds real entrant emails, so neither the table nor the functions were dropped. Handle in a Convex cleanup pass, not by deleting the data.
- **Visible review dates go stale.** The "Reviewed &lt;month year&gt;" lines are hand-set, not auto-maintained. Bump one only when the page is genuinely re-reviewed, or remove it. An out-of-date review line is worse than none.

## How to verify

- View source on `/`, `/conka-flow`, etc.: each emits its own canonical, title, and description.
- Google Rich Results Test on a PDP: exactly one `Product` and one `FAQPage` node, prices matching `funnelData.ts`.
- PDP `Product` node: `brand` is a reference to the Organization `@id` (`https://www.conka.io/#organization`), not a standalone `Brand` object, so Product and Organization express one CONKA entity.
- Content pages (`/science`, `/why-conka`, `/ingredients`, `/our-story`, `/app`, `/app-insights`): each renders a visible "Reviewed &lt;month year&gt;" line, and the dates reflect a real review rather than a blanket stamp.
- `/` and `/professionals`: exactly one `FAQPage` node each, and every question in it also appears in the rendered HTML.
- Any page: exactly one `Organization` node and one `WebSite` node, and every `sameAs` URL resolves. Trustpilot returns 403 to automated requests (Cloudflare bot-blocking, not a dead link), so check that one in a browser.
- `/manifest.webmanifest` returns HTTP 200 with a resolvable icon.
- `/sitemap.xml`, `/robots.txt` and `/llms.txt` return HTTP 200. Sitemap `lastmod` dates should **differ per page** and match real commit history (`/privacy` old, the PDPs recent). If every page shares one date, or dates are missing, `VERCEL_DEEP_CLONE` is not set.
- `/win` and `/barrys` redirect to `/` (Next emits 308 for `permanent: true`; Google treats it as a 301).
- In Search Console: submit the sitemap, then watch indexed-page count and non-brand impressions move against the baseline.

## What is next

**The engineering is done.** Everything left is content or off-site, and none of it is ticketed. Full breakdowns are in the build archive.

Worth knowing: **no competitor in this category puts FAQPage schema on its product pages** (checked: Magic Mind, IM8, Qualia, TruBrain, Thesis), and the brands brave enough to answer the hard questions bury them off-domain in Zendesk and Gorgias. We are structured and silent; they are loud and unstructured. Phase 10 (shipped) closed that gap.

The only on-site phase still open is the blog, and it is gated on a content engine:

| Phase | What | State |
|-------|------|-------|
| 6 | **Blog.** Informational content surface for research-intent, non-brand keywords. Scoped in `docs/development/featurePlans/blog-informational-content-surface.md` (content model: Notion as a headless CMS). Its content contract already bakes in BLUF, atomic passages and freshness. | Gated on the content engine |

**Not a site problem, but recorded:** the strongest AEO lever is off-site brand mentions (PR, citations, Reddit and Quora discussion). No code change can deliver it, and no workstream currently owns it. With the on-site foundation now complete, this is the highest-value thing the business could start.

## References

- Build archive and full history: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`
- Keyword research (source input): `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`
- Pricing audit log: `docs/PRICING_HISTORY.md`
- Phase 6 plan: `docs/development/featurePlans/blog-informational-content-surface.md`
- Phase 10 (FAQ answer surface), shipped: `docs/features/FAQ_SYSTEM.md`
- Phase 9 (AEO content shape), shipped: `docs/development/featurePlans/aeo-content-shape-phase-9.md`
- Page rules (mandatory SEO and JSON-LD): `.claude/rules/pages.md`
