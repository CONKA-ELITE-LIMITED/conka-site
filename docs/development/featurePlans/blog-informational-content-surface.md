# Blog / Informational Content Surface (SEO Phase 6)

**Status:** Scoped, not ticketed. Plan doc only for now.
**Owner:** Rudh
**Part of:** The SEO / AEO programme (`docs/development/featurePlans/seo-aeo-metadata-foundation.md`). This is Phase 6, the only remaining phase.
**Source inputs:** `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md` (Humphrey, keyword research), `docs/analytics/seo-search-console-baseline.md` (pre-change baseline).
**Created:** 2026-07-13
**Updated:** 2026-07-14 — critical review pass. Four adjustments before ticketing: (1) enforced frontmatter shrunk to only the fields Phase 1 renders, clustering fields made optional passthrough; (2) Phase 1 ships one MDX component (`ProductCTA`), not three; (3) MDX library reopened (`next-mdx-remote/rsc` is for out-of-repo content; on Next 16 prefer `@next/mdx`), resolve in task 1; (4) named the strategic tension that the informational-click channel is being disrupted by AI answers, so an AEO citation metric and citeable-content selection are added to the success criteria.

---

## Problem

The site earns roughly 99% of its organic traffic from brand terms ("conka", "conka flow"). Only 17 URLs have drawn any impression in three months. The five commercial money pages are transactional-intent and structurally cannot rank for research-intent queries such as "what are nootropics", "vitamins for brain fog", or "best supplements for menopause brain fog" (the single biggest gap in the keyword dataset). There is no surface on the site that targets non-brand informational demand.

Phases 1 to 5 of the SEO programme fixed the technical foundation (canonicals, per-page metadata, Product + FAQ JSON-LD, sitemap, robots, descriptive H1s). The foundation is sound but it has nothing to point at for informational search. A blog creates that surface.

## Who it serves

Cold, non-brand organic searchers and AI answer engines (AEO) at the top of the funnel. Readers are routed to the PDPs via in-article CTAs. This is the cheapest acquisition channel available and it is currently switched off. Secondary beneficiary: the brand's authority signals, which lift the whole domain.

## Business impact

Opens a net-new, compounding acquisition channel that reduces dependence on paid Meta traffic over time. Success is measured against the captured Search Console baseline: non-brand impressions and clicks, plus a growing count of indexed, ranking URLs. Secondary metric: blog to PDP CTA clicks (content to product conversion).

**Caveat on the success metric (from the parent doc's own AEO audit).** Informational queries, which are exactly what this blog targets, are increasingly answered by LLMs in-chat, which keep the click. So "non-brand clicks" is a metric on a channel that is being disrupted at the same time we build for it. This does not sink the blog: its value shifts from "rank and get the click" toward "be the source the answer engine cites", which is why the AEO scaffolding (BlogPosting schema, answer-first openings, atomic passages) is not optional garnish here, it is half the point. Two consequences: (1) add an AEO success signal alongside the click metrics, even a crude one (tracking whether CONKA is cited in AI answers for the target queries), and (2) weight seed and early-post selection toward genuinely *citeable* definitional content, not raw search volume. It also strengthens the case for the parent doc's parked "tools" pivot (a formula selector or stack checker is the one informational asset an LLM cannot satisfy in-chat); the blog is the lower-ceiling half of that pair and should be understood as such.

## Appetite

- **Phase 1 (infrastructure):** 2 to 3 days. One buildable unit.
- **Phase 2 (content):** ongoing marketing stream, gated on Humphrey's engine. Not a fixed budget.

## Design system

brand-base (new). Mirror the `/science` and `/case-studies` page shell: `brand-clinical` section wrapper, `<Navigation/>`, `<main>`, `<Footer/>`. Note the known `.brand-clinical` mobile hero gotcha (it zeros the hero top padding on mobile), so blog pages need an explicit `paddingTop` to clear the fixed nav.

---

## Approach

Build `/blog` in Next.js with an **MDX-in-repo** content model. Posts are `.mdx` files with typed, validated frontmatter, rendered statically at build time. This gives the strongest possible SEO and AEO (fully static HTML), zero runtime cost, no new vendor, and version-controlled content that is reviewable in PRs.

MDX (not plain markdown) is chosen specifically so articles can embed a `<ProductCTA>` block that links to the PDPs. Every informational post is therefore also a conversion path. Be honest about the size of this need: the engine is expected to emit plain markdown prose plus frontmatter, and the auto-rendered CTA (from `relatedProducts`) does not itself require MDX. The genuine MDX-only capability is placing an *additional* CTA mid-article. That is real but thin, so MDX is a low-cost hedge, not a load-bearing choice. Keep it, but do not over-invest in the component layer (see "Embeddable components" below, which is deliberately cut to one component for Phase 1).

**Library choice is not settled: resolve before task 1.** The prior draft named `next-mdx-remote/rsc`. That library exists for content fetched at runtime from *outside* the repo (a CMS or DB). Our content is in-repo and compiled at build time, and the app is on **Next 16.0.7 + React 19.2** (confirmed in `package.json`). For that shape the grain-aligned options are first-party **`@next/mdx`** or a compile-at-build content layer, not the remote loader. Task 1 must verify compatibility on Next 16 and pick the tool that matches "static files in the repo", most likely `@next/mdx`. This is the one infra decision that can cause real friction; make it deliberately.

`/blog` (singular) is used because `/blogs/*` (plural) is already consumed by a permanent 301 to `/why-conka` (the old Shopify blog, `next.config.ts`). That redirect is left untouched.

### Content model decision (why MDX-in-repo, not CMS or Convex)

| Option | Verdict | Reason |
|--------|---------|--------|
| **MDX-in-repo** | **Chosen** | Best SEO (static HTML), zero cost, no vendor, git-reviewable, engine output drops into a folder. Publishing is a commit + deploy. |
| Headless CMS (Sanity/Contentful) | Rejected for now | Self-serve publishing UI we do not need, since content is engine-generated not hand-typed. Adds vendor, cost, auth, and maintenance surface. Migration path from MDX exists if a live-editing need appears. |
| Convex | Rejected | Convex is a database, not an authoring tool: no editor, no preview, no media handling, and runtime-rendered markdown is weaker for SEO than static. Would mean hand-building a mini-CMS. |

---

## The content contract (what Humphrey's engine MUST produce)

This is the regimented structure. The engine produces to this spec exactly, or the site build rejects the post. Enforcement is a build-time validator in the content loader (`app/lib/blog.ts`): missing or malformed required fields throw and fail the build, so a bad export cannot ship.

**File form: it is markdown.** A `.mdx` file is a `.md` file with two additions: a YAML frontmatter block at the top, and the option (not the requirement) to embed a component tag in the body. The engine only needs to produce standard markdown prose plus the frontmatter block. It does not need to emit any React or JSX. The `.mdx` extension is used purely so a CTA or callout can be dropped in mid-article later without migrating the file. Anything valid in markdown is valid here.

### File and asset layout

One package per post:

```
<slug>.mdx                        # kebab-case, matches the target keyword
assets/                           # images for this post
  hero.webp                       # 1200x630 for OG, WebP or AVIF
  <other-images>.webp
```

On placement into the repo:
- `.mdx` file goes to `app/blog/posts/<slug>.mdx`
- images go to `public/blog/<slug>/` and are referenced by that path in frontmatter and body

### Frontmatter (YAML)

**Enforce only what Phase 1 actually renders.** The build-time validator hard-fails on a missing or malformed *required* field, so the required set must not include fields that only serve features not yet built. Clustering (`category`, `tags`) is Phase 3, gated on 8+ posts; requiring those now would force the engine to emit correct values for a system that does not exist, and reject the post if it does not. So they are **optional passthrough**: parsed and stored, never gated on. Tighten the validator to require them only when Phase 3 gives them a job.

```yaml
---
# --- REQUIRED (validator hard-fails if missing/malformed) ---
title: "What Are Nootropics? A Plain-English Guide"   # H1 + base for the <title> tag
description: "..."                # meta description, 150 to 160 characters, no em dashes
slug: "what-are-nootropics"       # kebab-case, must match the filename
datePublished: "2026-07-20"       # ISO date
dateModified: "2026-07-20"        # ISO date
heroImage: "/blog/what-are-nootropics/hero.webp"
heroImageAlt: "..."               # describes the image
relatedProducts: ["flow"]         # any of flow | clear | both; drives the auto CTA

# --- OPTIONAL (parsed and stored; NOT gated by the validator) ---
targetKeyword: "what are nootropics"        # primary keyword from the map; editorial aid
secondaryKeywords: ["nootropics uk", "cognitive supplements"]
author: "CONKA"                   # byline; defaults to "CONKA" if absent
category: "Nootropics 101"        # reserved for Phase 3 topic clustering; not rendered yet
tags: ["nootropics", "cognition"] # reserved for Phase 3 clustering; not rendered yet
faq:                              # if present, renders + emits FAQPage JSON-LD
  - question: "Are nootropics safe?"
    answer: "..."
readingTime: 6                    # auto-computed from body if absent
draft: false                      # true = excluded from listing, sitemap, and static params
---
```

The required set is exactly the fields the Phase 1 template puts on the page or in schema. Everything a future phase will consume is accepted but optional, so a conforming post today never fails on a field with no consumer.

### Body structure rules (for SEO and AEO)

- **Exactly one H1**, supplied by `title`. The MDX body therefore starts at H2. (The template renders the H1; the body must not contain a second H1.)
- **Answer-first opening.** The first paragraph directly answers the target query in plain language. Answer engines extract this; burying the answer loses the citation.
- **H2 for main sections, H3 for sub-sections.** Clear heading hierarchy is what AEO parsing relies on. Headings get auto-generated anchor links.
- **A link to a relevant PDP.** The template auto-renders a `<ProductCTA>` from the `relatedProducts` frontmatter, so this is satisfied by frontmatter alone. Inline contextual links to the PDP in the prose are encouraged on top. This is the conversion path and passes ranking signal to the money pages.
- **Length guidance:** roughly 800 to 1500 words for a cornerstone post. Not enforced by the build, but the editorial standard.
- **No em dashes** (house copy rule). No unverified efficacy claims (see Risks).

### Embeddable components (Phase 1 ships exactly one)

The body can be 100% plain markdown. Phase 1 provides a single component, because it is the only one with a consumer:

- `<ProductCTA product="flow|clear|both" />` — branded CTA card linking to the PDP, fires analytics. **By default the template auto-renders one CTA from the `relatedProducts` frontmatter field**, so plain-markdown posts still get a conversion path. Use the tag only to place an additional CTA at a specific point mid-article.

Deliberately **not** built in Phase 1 (no post needs them, and building/maintaining the MDX component map plus whitelist-stripping for unused tags is over-build):
- `<Callout>` — a highlighted aside. Add it the first time a post actually wants one.
- `<FAQ>` — an in-body FAQ. Redundant for now: the frontmatter `faq` array already renders the FAQ and emits its JSON-LD.

Any component not registered in the MDX component map is stripped, so an unexpected tag degrades to nothing rather than breaking the build.

---

## Ingestion pipeline (how the engine "posts")

The **contract above is fixed and enforced now.** The **transport** (how the package reaches the repo) starts manual and can graduate without changing the site or the contract.

1. **Launch: manual drag-and-drop with a human gate.** The engine produces the `<slug>.mdx` + `assets/` package and hands it over by any means (email, shared folder; interchangeable, does not affect the build). Rudh drags the files into the repo (`app/blog/posts/` and `public/blog/<slug>/`), reviews for quality and claims compliance, opens a PR, merges. Vercel deploys. The review gate is deliberate: health content carries claims risk and thin content hurts SEO, so a human check before publish is a feature at this stage, not friction.
2. **Graduate: automated PR.** Once the engine's output is trusted and volume rises, wire it to open a GitHub PR automatically (GitHub API or Action). The merge stays the human gate. No site change required.
3. **Future option: draft preview.** A `draft: true` flag already excludes a post from the listing, sitemap, and static params, so drafts can be previewed on a Vercel branch before going live.

The build-time validator is what makes the contract enforceable regardless of transport: non-conforming input fails CI, so it never reaches production.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Blog infrastructure: MDX pipeline, listing, article template, JSON-LD, sitemap, nav/footer, one seed post | Not Started (active, unticketed) |
| 2 | Cornerstone content stream: ingest engine output as MDX, prioritised by the keyword map | Future / recurring |
| 3 | Topic-cluster internal linking: related posts, pillar/cluster structure once ~8+ posts exist | Future |

Phase 1 ships as its own commit stream on the SEO integration branch, consistent with the rest of the programme (`SEO-AND-AEO-WORK`, sub-branch per unit, PR back into the integration branch not `main`).

---

## Phase 1 task breakdown (active, unticketed)

1. **[Infra] MDX content pipeline + typed frontmatter loader**
   - **First, pick the MDX tool for Next 16 (see "Library choice" in Approach).** Content is in-repo and static, so prefer first-party `@next/mdx` or a compile-at-build content layer over the runtime-oriented `next-mdx-remote/rsc`. Verify on Next 16.0.7 + React 19.2 before wiring anything else. Add `gray-matter` for frontmatter (plus `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` for heading anchors that aid AEO).
   - A `app/lib/blog.ts` module reads `app/blog/posts/*.mdx`, parses and **validates** frontmatter against the contract, and exposes `getAllPosts()` / `getPostBySlug()`. Validate only the required set (title, description, slug, dates, heroImage, heroImageAlt, relatedProducts); accept the optional fields as passthrough. Slug = filename. A missing/malformed *required* field throws at build. A single `getAllPosts({ includeDrafts })` is the one source of truth for the draft filter, so listing, sitemap, and `generateStaticParams` cannot disagree.
   - Complexity: Medium. Dependencies: none.
   - Files: `app/lib/blog.ts` (new), `package.json`, `app/blog/posts/` (new).

2. **[Frontend] Article template `/blog/[slug]`**
   - Server component. `generateStaticParams` from posts, `generateMetadata` per post (title/description/OG; canonical auto-resolves via the root `"./"` fix). Renders the single H1, MDX body, published/updated date, author byline, reading time. MDX components map includes `<ProductCTA>`, `<Callout>`, `<FAQ>`.
   - Complexity: Medium. Dependencies: task 1.
   - Files: `app/blog/[slug]/page.tsx` (new), `app/components/blog/*` (new).

3. **[Frontend] Listing page `/blog`**
   - Server component listing published posts newest-first, one card per post (title, description, date, hero image), mobile-first single column. Own metadata.
   - Complexity: Small. Dependencies: task 1.
   - Files: `app/blog/page.tsx` (new).

4. **[SEO] `BlogPosting` JSON-LD + FAQ reuse**
   - Add `buildArticleSchema` to `app/lib/jsonLd.tsx` (headline, description, datePublished, dateModified, author, publisher CONKA, image via `absoluteUrl`). Render via the existing `JsonLd` component. Reuse `buildFaqSchema` for posts carrying an FAQ.
   - Complexity: Small. Dependencies: tasks 1, 2.
   - Files: `app/lib/jsonLd.tsx`, `app/blog/[slug]/page.tsx`.

5. **[SEO] Dynamic sitemap entries**
   - `app/sitemap.ts` is a static hand-maintained list today. Map `getAllPosts()` into entries and spread them in, plus the `/blog` index. Exclude `draft: true`.
   - Complexity: Small. Dependencies: task 1.
   - Files: `app/sitemap.ts`.

6. **[Frontend] Nav + footer entry point**
   - Add a top-level "Learn" link (chosen over "Blog" so it can house future content types). Flat link, not a mega-menu group, given a single destination.
   - Complexity: Small. Dependencies: task 3.
   - Files: `app/components/navigation/navConfig.ts`, `app/components/footer/Footer.tsx`.

7. **[Content] One seed post + [Verify]**
   - Author one real cornerstone post to prove the pipeline end to end. Then validate: build, Rich Results Test on the article (one `BlogPosting`, valid FAQ if present), sitemap includes the post, canonical resolves to `/blog/<slug>`, mobile render at 390px, CTA click fires analytics.
   - Complexity: Small. Dependencies: all above.

8. **[Analytics] Blog to PDP CTA tracking**
   - `<ProductCTA>` fires a tracked click with `source: 'blog'`, `location: <slug>` so content-to-product conversion is measurable, not just rankings. Reuse existing analytics helpers.
   - Complexity: Small. Dependencies: task 2.

**Task ordering:** loader/data layer (1) first, then the shared components and template (2), listing (3), then SEO and analytics alongside (4, 5, 8), nav last (6), then seed + verify (7).

---

## Target keyword clusters (for Phase 2 prioritisation)

From the keyword map's informational targets. Prioritise winnable and high-gap terms first for a faster ranking result.

| Keyword | KD | Volume | Note |
|---------|----|--------|------|
| memory aid | 6 | 390 | Near-zero competition, quick win |
| best supplements for menopause brain fog | 22 | 590 | Biggest gap on the site |
| vitamins for brain fog | 29 | 390 | Winnable |
| vitamins for anxiety | 28 | 720 | |
| brain health foods and supplements | 28 | 390 | |
| supplements for nervousness | 35 | 1000 | |
| brain fog remedies | 41 | 390 | |
| dietary supplements for anxiety | 48 | 1000 | |
| what are nootropics | 49 | 590 | Definitional pillar |
| ginkgo biloba benefits | 38 | 5400 | Highest volume in the dataset; ingredient explainer |
| ashwagandha / alpha gpc / rhodiola / lemon balm benefits | varies | | Ingredient explainer cluster |

---

## Reusable foundation already built (SEO Phases 1 to 5)

- **Root canonical** is self-referencing (`"./"` in `app/layout.tsx`), so `/blog/*` auto-canonicals with no per-page entry.
- **`app/lib/jsonLd.tsx`** exports `absoluteUrl(path)`, `JsonLd` (render component), `buildProductSchema`, `buildFaqSchema`. A `buildArticleSchema` fits alongside; `JsonLd` and `absoluteUrl` are reused as-is.
- **`app/robots.ts`** already allows AI crawlers (deliberate, for AEO). No change needed; the blog inherits it.
- **`metadataBase`** = `https://www.conka.io`; `SITE_ORIGIN` in `app/lib/site.ts`.

---

## Rabbit holes

- **Building a CMS.** MDX-in-repo is the decision. No admin UI, live editing, or media library in Phase 1.
- **Over-designing the article template.** Table of contents, share buttons, author pages, related-post rails: all deferred (related posts land in Phase 3). A clean, fast, readable article beats a feature-rich one for SEO and appetite.
- **Writing content during the infra build.** One seed post only. The stream is Phase 2 and gated on Humphrey's engine.
- **The `brand-clinical` mobile hero padding trap.** `.brand-clinical` zeros the hero top padding on mobile; blog pages need an explicit `paddingTop` or they collide with the fixed nav.

## No-gos

- **No comments.** Deferred indefinitely. Comments need a datastore and moderation, invite spam, add thin low-quality UGC that can hurt the SEO being built, and third-party widgets (Disqus) drag performance and privacy. Near-zero ranking benefit for a brand blog. Revisit only under a deliberate community strategy.
- No headless CMS or Convex content store in this phase.
- No reclaiming the `/blogs/*` URL space; the existing 301 to `/why-conka` stays untouched. Use `/blog`.
- No `robots.ts` change.
- No per-post generated OG images in Phase 1 (use the post hero image, or the sitewide brand image, matching how the PDPs handle OG today).
- No auto-publishing of engine output without a human review gate at launch.

## Risks

- **Content is the real dependency, not the code.** The infra is worth building only if the engine produces a steady stream of publishable, accurate posts. An empty or thin blog is a mild negative SEO signal. Phase 2 must actually happen.
- **Claims compliance on health content.** Posts about nootropics, anxiety, and menopause will make efficacy-adjacent statements. Blog copy is higher-risk than product copy. The content stream should pass a legal review before publish; the manual ingestion gate is where that check lives.
- **Malformed engine input.** The frontmatter validator must fail clearly and skip cleanly so a bad export cannot break the production build.

## Resolved during scoping

- **Nav label:** "Learn".
- **Launch transport:** manual drag-and-drop of the post package into the repo. Email vs shared folder is interchangeable and does not affect the build.
- **File form:** `.mdx` = markdown prose + a YAML frontmatter block. No JSX required from the engine; the product CTA auto-renders from `relatedProducts`.

## Open questions

1. **Seed post:** definitional pillar ("what are nootropics", KD 49) or a faster win ("memory aid" KD 6, or "vitamins for brain fog" KD 29)? A quick win demonstrates ranking sooner. This is the only open call and it is a build-time decision, not a blocker.

## References

- SEO programme master plan: `docs/development/featurePlans/seo-aeo-metadata-foundation.md`
- Keyword research: `docs/development/featurePlans/CONKA_SEO_Keyword_Map_v4.md`
- Search Console baseline: `docs/analytics/seo-search-console-baseline.md`
- Reused JSON-LD helpers: `app/lib/jsonLd.tsx`
- Sitemap (static today, needs dynamic blog entries): `app/sitemap.ts`
- Old blog redirect (leave untouched): `next.config.ts`
- Page shell to mirror: `app/science/`, `app/case-studies/`
- Nav / footer: `app/components/navigation/navConfig.ts`, `app/components/footer/Footer.tsx`

## Jira

No tickets yet. Phase 1 is scoped and ready to ticket as a single unit when the go-ahead is given. Phases 2 and 3 stay in this doc until active.
