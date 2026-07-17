# Blog / Informational Content Surface (SEO Phase 6)

> **This is the original plan, not a description of current behaviour.**
> For how the blog works today, read [`docs/features/BLOG_SYSTEM.md`](../../features/BLOG_SYSTEM.md), which is canonical and wins any disagreement.
> Known drift in this doc (found 2026-07-17): the status line below and the phase table are stale (Phase 3 is substantially built: JSON-LD, sitemap entries, nav and footer links all exist); the hero-image "falls back to the brand OG image" claim is wrong (a post with no hero renders no hero, and the card shows a mono-wordmark tile, as this doc's own later section says); the schema table omits the `Source` column; and the references still call the old blog redirect "leave untouched" despite SCRUM-1157 adding it.

**Status:** Scoped and finalised. Phase 1 built (SCRUM-1151); Phase 2 built (SCRUM-1152); Phase 3 ready to ticket.
**Owner:** Rudh
**Part of:** The SEO / AEO programme (`docs/development/featurePlans/seo-aeo-metadata-foundation.md`). This is Phase 6, the only remaining phase.
**Source inputs:** `CONKA_SEO_Keyword_Map_v4.md` (Humphrey, keyword research), `docs/analytics/seo-search-console-baseline.md` (baseline), a Magic Mind blog UX teardown (2026-07-15), and a live inspection of the Notion "Blog Hub" API output.
**Created:** 2026-07-13
**Updated:** 2026-07-15. Content model finalised as Notion-as-CMS with **native Notion blocks** as the source and a `notion-to-md` render pipeline; build strategy changed from ISR to **static generation** to solve image-URL expiry; Magic Mind lessons folded in; three-phase structure set.

---

## Problem

The site earns roughly 99% of its organic traffic from brand terms ("conka", "conka flow"). Only 17 URLs have drawn any impression in three months. The five commercial money pages are transactional-intent and structurally cannot rank for research-intent queries such as "what are nootropics", "vitamins for brain fog", or "best supplements for menopause brain fog" (the biggest gap in the keyword dataset). There is no surface on the site that targets non-brand informational demand.

Phases 1 to 5 of the SEO programme fixed the technical foundation (canonicals, per-page metadata, Product + FAQ JSON-LD, sitemap, robots, descriptive H1s). The foundation is sound but has nothing to point at for informational search. A blog creates that surface, and Humphrey's generation engine already writes drafts into a Notion database, so the content pipeline exists.

## Who it serves

Cold, non-brand organic searchers and AI answer engines (AEO) at the top of the funnel. Readers are routed to the PDPs via in-article CTAs. This is the cheapest acquisition channel available and it is currently switched off. Secondary beneficiary: the brand's authority signals, which lift the whole domain.

## Business impact

Opens a net-new, compounding acquisition channel that reduces dependence on paid Meta traffic. Success is measured against the captured Search Console baseline: non-brand impressions and clicks, plus a growing count of indexed, ranking URLs. Secondary metric: blog to PDP CTA clicks (content to product conversion). Because informational queries are increasingly answered by LLMs in-chat, the AEO scaffolding (BlogPosting schema, answer-first openings, FAQ schema) is half the point, not garnish: the goal shifts from "get the click" toward "be the source the answer engine cites".

## Appetite

Roughly 1 to 1.5 weeks across three phases. Phase 4 (content) is an ongoing marketing stream, not a fixed budget.

## Design system

brand-base. Mirror the `/science` and `/case-studies` shell: `brand-clinical` wrapper, `<Navigation/>`, `<main>`, `<Footer/>`. Note the `.brand-clinical` mobile hero gotcha (it zeros the hero top padding on mobile), so blog pages need an explicit `paddingTop` to clear the fixed nav. Reuse the existing `ReviewedDate` component for the freshness stamp.

---

## Approach

Build `/blog` reading from **Notion as a headless CMS**, rendered as **static HTML at build time** so Google and AI engines get full content and there is zero runtime Notion dependency per request.

`/blog` (singular) is used because `/blogs/*` (plural) is the old Shopify blog's URL space.

**Corrected 2026-07-16.** This section previously claimed `/blogs/*` was "already a permanent 301 to `/why-conka` ... left untouched". **That was false**: no `/blogs` rule of any kind existed in `next.config.ts`, so all 82 legacy URLs served a bare 404, including one still ranking at position 12.7 and drawing 464 impressions per quarter. `/blogs/news/*` now redirects to `/blog/*` (SCRUM-1157, `app/lib/legacyBlogRedirects.ts`). `/blogs/ingredients/*` still 404s pending the Phase 5 dedupe decision. Choosing `/blog` was still the right call; the reasoning given for it was not.

### Decision 1: content source and render pipeline

**Native Notion blocks are the source of truth; `notion-to-md` to a styled markdown renderer is the pipeline.** Rationale (long-term):

- The three "format" options are not peers. Markdown is the best *rendering* format but the wrong thing to *store in Notion*. The real fork is where the source of truth lives and where a human reviews.
- Since Notion is the chosen CMS (engine writes there, marketing lives there, the publish gate is a Notion `Status` flip), the content must be **native Notion blocks** so Notion works as a WYSIWYG the reviewer can actually read and edit. Markdown-as-text sitting in Notion paragraphs (the engine's current accidental output) is the worst of both worlds: not a clean WYSIWYG, and not git-versioned.
- If markdown were ever the source of truth instead, its consistent home is the repo (the original MDX-in-repo plan), not Notion. That is the documented fallback if the Notion workflow is ever abandoned.

**Why `notion-to-md`:** it consumes *both* today's messy markdown-in-paragraphs *and* future native blocks, converting either to one markdown document that we render with `react-markdown` plus brand-styled components. So Phase 1 can render today's content (with a few known rough edges) and it improves automatically as the engine moves to native blocks. The engine change is briefed in `blog-notion-engine-brief.md` and is a dependency for content quality, not a blocker for the build.

**Rendering fidelity is low by design.** The Magic Mind teardown showed competitor posts are almost entirely H2s, paragraphs, bullet lists, and bold. So Phase 1 supports headings (H2/H3), paragraphs, bullet and numbered lists, bold/italic, links, and images. Tables, callouts, and embeds are deferred (no post needs them and they add renderer surface for no competitive gain).

### Decision 2: build strategy and image expiry

**Static generation (SSG), not ISR.** `generateStaticParams` builds every published post at deploy time. Notion's image URLs expire after roughly an hour, so **images are downloaded to `public/blog/<slug>/` at build** and references rewritten to the stable local paths. This sidesteps the expiry problem entirely. Publishing is: flip `Status` to `Published` in Notion, then a redeploy (a Vercel deploy hook, or a scheduled daily rebuild) picks it up.

ISR was rejected for Phase 1: it reintroduces the expiring-image problem at runtime (Vercel serverless cannot write to `public/`), which would need Vercel Blob or an image proxy. **ISR + Vercel Blob is noted as a future upgrade** if publish-to-live latency ever needs to drop below a deploy cycle.

### Content model options considered

| Option | Verdict | Reason |
|--------|---------|--------|
| **Notion as CMS, native blocks, SSG** | **Chosen** | Engine already writes to Notion, so zero extra hand-off. Native blocks make Notion a real WYSIWYG for review. Static HTML preserves SEO. Cost: an API data layer, block-to-markdown conversion, and build-time image re-hosting. |
| MDX-in-repo | Fallback | Strong SEO and git review, but reintroduces a manual drag-and-drop step now that the source is Notion. Kept as the fallback if the Notion workflow is dropped. |
| Headless CMS (Sanity/Contentful) | Rejected | A second CMS when Humphrey already uses Notion. Extra vendor, cost, and a workflow migration for no gain. |
| Convex | Rejected | A database, not an authoring tool: no editor, no preview, no media handling. |

**SEO guardrail:** all Notion fetching happens at build / in server components, never from the browser.

---

## The content contract

Humphrey's engine writes each post as one **row (page) in the Blog Hub database**. The row's **columns** carry the structured/SEO data; the Notion **page body** is the article, written as native blocks. The full engine-facing spec is `blog-notion-engine-brief.md`.

### Columns (LIVE as of 2026-07-15)

Kept lean: only fields the site renders or gates on. `Author` defaults to "CONKA" in code; `Date modified` uses Notion's system `last_edited_time`; clustering reuses the existing `Topic`; the FAQ is parsed from the body, not a column.

| Column | Type | Filled by | Notes |
|--------|------|-----------|-------|
| `Blog name` | Title | Engine | H1 and base of the SEO title. |
| `Slug` | Text | Engine | Lowercase-hyphenated URL segment, unique. Post lives at `/blog/<slug>`. |
| `Meta description` | Text | Engine | 150 to 160 chars, no em dashes. |
| `Related products` | Multi-select `flow`/`clear`/`both` | Engine | Drives the auto product CTA. |
| `Hero image` | Files | Engine / owner | Re-hosted at build. Optional; falls back to the brand image. |
| `Hero image alt` | Text | Engine | Required only if a hero is set. |
| `Date published` | Date | Owner / engine | Falls back to created time if empty. |
| `Status` | Select `Draft`/`Ready for review`/`Published` | **Owner** | Only `Published` goes live. The publish gate. |
| `Topic` | Multi-select | Engine | ADHD / Brain Ageing / Productivity. Future clustering. |
| `Angle` | Text | Engine | Internal note. Not rendered. |
| `Source Files` | Files | Engine | Research sources. Ignored by the site. |

### Body rules (enforced by the engine brief)

Native Notion blocks; start at Heading 2 (no repeated title); answer-first opening; H2/H3 hierarchy; no em dashes; FAQ as a `Frequently Asked Questions` H2 with bold `Q:` paragraphs followed by `A:` paragraphs (parsed into visible FAQ plus FAQPage JSON-LD).

---

## What we learned from Magic Mind (reference teardown)

Their blog is SEO-thin, so we adopt their restraint and exceed their depth.

- **Adopt:** minimal card grid (image / clean date / title / excerpt), one newsletter capture at most, an end-of-article **related-posts grid** (internal linking), read-time and a freshness stamp, a soft end-of-post CTA (not a sticky buy bar), numbered pagination (crawlable) once volume warrants it.
- **Beat them (their gaps):** they have no author, no schema, no FAQ, no H3 nesting, and ~3-minute posts. We add author/reviewer byline (E-E-A-T), Article + FAQPage JSON-LD, H2/H3 hierarchy, the parsed FAQ block, deeper cited content, and a TOC on long posts.
- **Fidelity:** their posts are just headings, paragraphs, bullets, and bold, which confirms low render fidelity is enough to compete.

---

## Ingestion pipeline (how content goes live)

1. **Engine writes a row** (native blocks, columns filled) with `Status` blank or `Draft`.
2. **Owner reviews and approves.** Passes quality plus a `/review-claims` gate, then flips `Status` to `Published`. Nothing is live until this flip.
3. **Redeploy** (deploy hook or scheduled rebuild) rebuilds the static blog; the new post appears. Build-time image download makes images permanent.

Automated deploy-on-publish and a `draft` preview deployment are future niceties; neither blocks launch.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Notion data layer + content pipeline (fetch, map, `notion-to-md`, FAQ/callout extraction, build-time image download, SSG wiring) | Ticketed (active) |
| 2 | Blog UI: `/blog` listing + `/blog/[slug]` article, brand markdown renderer, related posts, mobile | Built (SCRUM-1152) |
| 3 | SEO/AEO, discovery, analytics, go-live: BlogPosting + FAQ JSON-LD, sitemap, nav/footer, CTA analytics, seed verify | Ready to ticket |
| 4 | Content stream: engine populates Notion, owner publishes via `Status` | Future / recurring |
| 5 | Scale features: category filters, search, pagination-at-volume, topic-cluster internal linking (~8+ posts) | **Gate cleared. Filters + pagination now scoped as Phase 6 of `legacy-blog-migration.md`. Search is still Future.** |

Phase 1 ships on the SEO integration branch pattern (sub-branch, PR back into the integration branch, not `main`).

---

## Active phase task breakdown

### Phase 1: Notion data layer

1. **[Infra] Notion client + typed `BlogPost` loader**
   - `app/lib/blog.ts` querying the data source filtered to `Status = Published` (a dev preview mode includes Draft/Ready-for-review for local rendering). Map the columns plus system dates to a typed `BlogPost`. Dedupe slugs with a build error on collision (catches the current duplicate). Skip and log a published row missing a required field rather than crashing. One `getAllPosts({ includeUnpublished })` is the single source of truth for the filter, so listing, sitemap, and `generateStaticParams` cannot disagree.
   - Complexity: Medium. Dependencies: the columns (done), the integration token (done, `NOTION_TOKEN` + `NOTION_BLOG_DATABASE_ID`).
   - Files: `app/lib/blog.ts` (new), `app/lib/notion.ts` (new), `package.json`.

2. **[Infra] Body pipeline (blocks to render-ready markdown)**
   - Fetch page blocks (paginated) and convert with `notion-to-md`. Strip the SEO callout block. Parse the `Frequently Asked Questions` section into a structured `faq[]` (bold `Q:` / `A:`). Normalise em dashes. Output a markdown string plus the FAQ array.
   - Complexity: Medium. Dependencies: task 1.
   - Files: `app/lib/blog.ts`, `package.json` (`notion-to-md`).

3. **[Infra] Build-time image download**
   - Download hero and in-body images to `public/blog/<slug>/`, rewrite references to the stable local paths. Hero falls back to the brand OG image when absent. Idempotent so repeated builds do not re-download unchanged images.
   - Complexity: Medium. Dependencies: tasks 1, 2.
   - Files: `app/lib/blog.ts`, image write helper.

### Phase 2: Blog UI

4. **[Frontend] Brand markdown renderer** (`react-markdown` + brand components: h2/h3, p, ul/ol, strong/em, a, img; heading anchor slugs for AEO). `app/components/blog/*`. Medium. Depends on Phase 1.
5. **[Frontend] Article template `/blog/[slug]`** (server, `generateStaticParams` + `generateMetadata`, single H1, byline/date/read-time/`ReviewedDate`, body, FAQ, auto `ProductCTA` from `Related products`, related-posts grid). Medium. Depends on task 4.
6. **[Frontend] Listing `/blog`** (card grid image/date/title/excerpt, newest-first, mobile single-column, own metadata, hero-padding fix). Small. Depends on Phase 1.

### Phase 3: SEO/AEO + go-live

7. **[SEO] `buildArticleSchema` (BlogPosting) + FAQ schema** in `jsonLd.tsx`, reusing `buildFaqSchema`. Small.
8. **[SEO] Sitemap** feeding published posts into `sitemap.ts`; `lastModified` from Notion `last_edited_time`. Small.
9. **[Frontend] Nav + footer "Blog" link** (`navConfig.ts`, `Footer.tsx` DISCOVER). Small.
10. **[Analytics] Blog to PDP CTA click** with `source: 'blog'`, `location: <slug>`. Small.
11. **[Verify] Seed post end-to-end** (owner publishes the Brain Fog fixture; Rich Results Test, sitemap, canonical, 390px mobile, image survives past 1hr, CTA fires).

---

## Target keyword clusters (Phase 4 prioritisation)

| Keyword | KD | Volume | Note |
|---------|----|--------|------|
| memory aid | 6 | 390 | Quick win |
| best supplements for menopause brain fog | 22 | 590 | Biggest gap |
| vitamins for brain fog | 29 | 390 | Winnable |
| vitamins for anxiety | 28 | 720 | |
| supplements for nervousness | 35 | 1000 | |
| what are nootropics | 49 | 590 | Definitional pillar |
| ginkgo biloba benefits | 38 | 5400 | Highest volume; ingredient explainer |

---

## Reusable foundation (SEO Phases 1 to 5)

- Root canonical is self-referencing (`"./"`), so `/blog/*` auto-canonicals.
- `app/lib/jsonLd.tsx` exports `absoluteUrl`, `JsonLd`, `buildProductSchema`, `buildFaqSchema`; `buildArticleSchema` fits alongside.
- `app/robots.ts` already allows AI crawlers.
- `app/components/ReviewedDate.tsx` for the freshness stamp.
- `metadataBase` / `SITE_ORIGIN` in `app/lib/site.ts`.

---

## Rabbit holes

- **Hand-writing a Notion block renderer.** `notion-to-md` does the walking; we only style markdown.
- **Rich-block fidelity** (tables, callouts, embeds). Deferred; no competitive need.
- **Category filters / search / pagination UI** before there is volume. Phase 5. **The volume gate cleared on 2026-07-16 at 55 published posts; filters and pagination moved to Phase 6 of `legacy-blog-migration.md`. Search stays parked.**
- **The `.brand-clinical` mobile hero padding trap.** Needs an explicit `paddingTop`.

## No-gos

- No client-side Notion fetching (ships an empty shell to crawlers).
- No second CMS, no Convex content store.
- No comments.
- No serving content from `/blogs/*`; it is redirect-only. Use `/blog`. (Corrected 2026-07-16: this previously said "the 301 stays", but no such 301 existed. See the note above.)
- No auto-publishing; nothing goes live without the owner's `Status` flip.
- No per-post generated OG images in Phase 1 (hero image or brand image).

## Risks

- **Content quality is the real dependency.** Today's drafts have markdown artefacts and em dashes; the engine's native-blocks change (briefed) fixes them at source. Thin or broken content hurts SEO.
- **Publish-to-live latency.** SSG needs a deploy after a `Status` flip; wire a deploy hook or scheduled rebuild so it is not manual.
- **Claims compliance.** Health copy is higher-risk than product copy; the `Status = Published` flip is where `/review-claims` runs.
- **Malformed rows.** The loader skips and logs an incomplete published row rather than crashing.

## Resolved during scoping

- **Content source:** Notion as CMS, native Notion blocks, `notion-to-md` render pipeline.
- **Build strategy:** static generation with build-time image download (not ISR).
- **Schema:** the seven publishing columns are live (2026-07-15); engine spec in `blog-notion-engine-brief.md`.
- **UI reference:** Magic Mind teardown; adopt restraint, exceed on schema/author/FAQ/depth.
- **Newsletter capture:** deferred (Phase 5 / optional). The PDP CTA is the Phase 1 conversion path.
- **Author byline:** "CONKA" default in Phase 1; named authors/reviewers are a future E-E-A-T upgrade needing an `Author`/`Reviewer` column.
- **Nav label:** "Blog".

## Open questions

1. **Seed post:** publish the Brain Fog fixture first (already metadata-complete), or wait for a cleaner native-blocks post from the engine. Build-time decision, not a blocker.

## References

- Engine-facing spec: `docs/development/featurePlans/blog-notion-engine-brief.md`
- SEO programme master plan: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`
- Keyword research: `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`
- Reused helpers: `app/lib/jsonLd.tsx`, `app/components/ReviewedDate.tsx`
- Sitemap (needs dynamic blog entries): `app/sitemap.ts`
- Old blog redirect (leave untouched): `next.config.ts`
- Page shell to mirror: `app/science/`, `app/case-studies/`
- Nav / footer: `app/components/navigation/navConfig.ts`, `app/components/footer/Footer.tsx`
- Notion client / conversion: `@notionhq/client`, `notion-to-md`

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| [SCRUM-1151](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1151) | [Website & CRO] Blog Phase 6.1: Notion data layer and content pipeline | 1 | Built |
| [SCRUM-1152](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1152) | [Website & CRO] Blog Phase 6.2: /blog listing and article UI | 2 | Done |

Sprint 28, under the Website & CRO epic (SCRUM-763). Phase 3 is scoped and ready to ticket when Phase 2 lands. Phases 4 and 5 stay in this doc until active.

**Phase 2 UI decisions (approved 2026-07-15):** show the Topic label on cards and articles; no table of contents in Phase 2 (deferred to Phase 5); the FAQ renders inline via the markdown body (no separate accordion), with the parsed `faq[]` reserved for Phase 3 JSON-LD; a mono-wordmark placeholder tile stands in for a null hero. Three Draft posts exist in Notion (brain-fog fixture, procrastination, what-are-nootropics) to build and review against via dev preview mode.
