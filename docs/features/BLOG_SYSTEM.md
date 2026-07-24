# Blog system

How `/blog` works: Notion is the CMS, the site is fully static, and posts are prerendered at build. **This is the canonical reference for current behaviour.** The three `featurePlans/blog-*.md` and `legacy-blog-migration.md` docs are build history and plans; where they disagree with this doc, this doc wins.

## Overview

Posts live in a Notion database ("Blog Hub"). `app/lib/blog.ts` reads it at **build time only**, converts each page to markdown via `notion-to-md`, and Next prerenders every post as static HTML. There is no runtime Notion call, no client-side fetching, and no second CMS.

Publishing is a two-step human action: flip `Status` to `Published` in Notion, **then redeploy**. Nothing reaches the site until a build runs.

The surface: `/blog` (index, page 1), `/blog/page/[page]` (pages 2+), `/blog/topic/[topic]` (10 hubs) and `/blog/[slug]` (post), plus `app/blog/error.tsx`.

## How correctness is enforced (SCRUM-1163)

The blog is static and Notion is read at build only, which once made two failure modes silent: a wrong blog could ship on a green build with no error output. Both are now handled automatically at build. The former manual rules (pause between write and deploy; clear the build cache on every edit) are gone; you do not need them.

**Publishing is still write-then-redeploy.** Flip `Status` to `Published` in Notion, then redeploy. Nothing reaches the site until a build runs.

**1. Stale bodies cannot survive a redeploy (was defect 2).** The Notion SDK calls `fetch`, Next patches it, and a response would otherwise land in `.next/cache/fetch-cache` with `revalidate: 31536000` (one year); Vercel restores that cache between deploys, so an edit could stay invisible for up to a year. `notion.ts` folds the deploy id (`VERCEL_DEPLOYMENT_ID`) into every Notion request via an `x-conka-deploy` header, so each deploy computes a different fetch-cache key and cannot hit the previous deploy's entries. A body edit reaches production on an ordinary redeploy, **build cache left enabled**. (`no-store` would also work but forces dynamic rendering, which the static blog cannot use; a short `revalidate` would turn the blog into runtime ISR. The deploy-keyed cache keeps it build-only and static.)

**2. A racing or thin read fails the build, loudly (was defect 1).** A build running seconds after a Notion write once baked a 404 into a live post on a green build (`generateStaticParams` saw 3 posts while `getPostBySlug` and `sitemap` saw 1, so `/blog/what-are-nootropics` prerendered with `"status": 404` and dropped from the sitemap). `app/lib/blogBuildGuard.ts` now fails the build if two reads disagree about which posts exist, or if the published count falls below a floor (`PUBLISHED_POST_FLOOR`, 40; 58 live today). The `[slug]` route sets `dynamicParams = false` and throws instead of `notFound()` when an enumerated slug goes missing, so the exact 404-baking case cannot ship. If a build fails this way, rebuild once Notion has settled.

**3. The row set is read once per build, so it cannot disagree with itself (SCRUM-1179).** Guard 2 turned the race into a loud failure. It stayed loud: builds began failing on a *different* post each run, because `react.cache` memoises per render scope, not per build, so `generateStaticParams`, each post, each listing page and the sitemap each issued their own Notion query, fanned across 11 worker processes. Roughly 60 independent reads of a set that had to be identical in all of them; one disagreement was enough to fail the build.

`queryBlogRows` (`app/lib/notion.ts`) now resolves the set once and shares it with every worker through a snapshot in the temp dir, named for the build (`VERCEL_DEPLOYMENT_ID` plus the parent pid, so it cannot outlive the build or leak into the next deploy). A lock elects one worker to read; the rest wait for its result, and any that read anyway adopt the winner's rows rather than their own. A build makes **one** Notion row query, verifiable in the build log:

```bash
grep -c "queried Notion for the" build.log   # 1
```

Outside a build this is unchanged, so a dev server still picks up a Notion edit on refresh, and two local `npm run build` runs still read Notion twice.

**Build-speed note (future work).** Because each deploy uses a fresh cache key, every deploy re-reads the whole blog from Notion. The row query is now a single request; the remaining cost is the per-post body fetch. At ~58 short posts that is a couple of seconds. If the archive grows large, build time will scale with it: batch the per-post fetches (`Promise.all`, see Known gaps) before reaching for anything more exotic, such as scoping the deploy key so unchanged posts reuse a prior deploy's cache.

### What already fails loudly (do not re-add these guards)

`queryBlogRows` **throws** rather than returning `[]` (`app/lib/notion.ts`), because `[]` is indistinguishable from "there are genuinely no posts": a rate-limit during a build once generated zero routes, rendered an empty `/blog`, exited 0, and deployed, pointing all 82 legacy redirects at 404s. Also throwing: missing `NOTION_TOKEN` / `NOTION_BLOG_DATABASE_ID` (`notion.ts`), a `notion-to-md` conversion failure, and a duplicate `Slug` (`blog.ts`).

So the residual risk that guard 2 covers is **not** error-swallowing. It is that separate, individually successful queries across one build could disagree (Notion is eventually consistent right after a write). Nothing throws, because nothing failed. Guard 3 removes the opportunity by construction; guard 2 stays as the check that it worked, and now costs nothing.

**If guard 2 or the `[slug]` route does fail,** read the message rather than assuming a race. It reports what was observed: the row counts, and whether the slug was absent from the set or present but failing validation. "Present but failed validation" is a content defect (a post missing its title, slug or Meta description) and a rebuild will not fix it.

## The content contract

A row must have **all** of these or it is silently skipped with a `console.warn` and never renders (`app/lib/blog.ts:121-143`):

| Required | Why it bites |
|---|---|
| `Blog name` | The H1. Never repeat it in the body. |
| `Slug` | Must be unique. A duplicate throws and fails the build. |
| `Meta description` | **The silent-skip trap.** A finished, `Published` post with no meta description never appears in the listing, the sitemap, or `generateStaticParams`. It gates *rendering*, not just SEO. |
| `Status = Published` | Drafts render in local dev preview only. |

Optional, with defaults: `Hero image` (absent renders a mono-wordmark placeholder tile on the card and **no hero at all** on the article; metadata omits `images` so the sitewide OG is inherited), `Hero image alt` (falls back to the title), `Date published` (absent sorts by `dateModified`), `Related products` (falls back to `both`).

### Body rules

Authoring guide: `docs/development/featurePlans/blog-notion-engine-brief.md`. The durable rules:

- **Native Notion blocks only.** Never markdown-as-text.
- **Start at Heading 2.** H2 = sections, H3 = sub-sections. The H1 comes from `Blog name`.
- **No em dashes.** `normaliseEmDashes` (`blogTransform.ts:107-109`) replaces them with commas as a backstop.
- **No SEO callout in the body.** `stripSeoCallout` removes the first blockquote if it matches the Title tag / Meta description / URL slug / Primary keyword shape.

`cleanBody` order matters: stripSeoCallout, stripDuplicateTitle, normaliseEmDashes, collapse blank lines.

### FAQ format

`extractFaq` (`blogTransform.ts:171-191`) parses an `## Frequently Asked Questions` section into `FAQPage` JSON-LD. The contract:

```
## Frequently Asked Questions

**Q: Does creatine help cognition?**
**A: The evidence is strongest for sleep-deprived and vegetarian groups.**
```

Each `Q:` line pairs with the **first following** `A:` line. Any other line is ignored. The FAQ stays visible in the body; the schema is built from the same parsed pairs, so schema and page always agree (the same rule as `docs/features/FAQ_SYSTEM.md`). `FAQPage` is emitted **only when at least one pair parses**: an empty `FAQPage` is a structured-data error.

**The parser is more lenient than the brief** (it accepts H2 or H3, bold or plain), so a brief-violating post can still emit schema. Write to the strict form; do not rely on the parser.

**Reject the `- question:` YAML-ish variant.** It parses to zero pairs, emits no schema, and renders the raw YAML as visible body text.

## Notion schema (Blog Hub)

| Column | Type | Written by |
|---|---|---|
| `Blog name` | Title | Engine / import script |
| `Slug` | Rich text | Engine / import. Legacy = Shopify handle verbatim |
| `Meta description` | Rich text | Engine. Gates rendering |
| `Status` | Select: `Draft` / `Ready for review` / `Published` | **Human only.** The publish gate |
| `Topic` | Multi-select, 11 options | Engine / `backfillTopics.ts` |
| `Related products` | Multi-select: `flow` / `clear` / `both` | Engine |
| `Hero image` / `Hero image alt` | Files / Rich text | Engine / owner |
| `Date published` | Date | Owner / engine. Legacy = Shopify `publishedAt` |
| `Source` | Select: `legacy` / `engine` | Scripts only. Not read by the site |
| `Angle`, `Source Files` | Rich text / Files | Internal. Never rendered |

`Topic` options: ADHD, Brain Ageing, Brain Fog, Concussion, Focus, Military, Neuroscience, Nootropics, Productivity, Recovery, Sport. `Productivity` belongs to the engine rows and is **not** renamed to `Focus`. ADHD has no published posts.

`Author` is hardcoded "CONKA" in the template. `dateModified` is Notion's system `last_edited_time`.

## Render pipeline

Notion → `notion-to-md` → markdown → `react-markdown`.

| File | Purpose |
|---|---|
| `app/lib/notion.ts` | Client, data-source resolution, `queryBlogRows` (one read per build, shared by every worker), `pageToMarkdown` (`react.cache`d). Both throw on failure |
| `app/lib/blog.ts` | `getAllPosts`, `getPostBySlug`, `getRelatedPosts`, `diagnoseMissingPost`, image re-hosting |
| `app/lib/blogTransform.ts` | Property readers, `cleanBody`, `extractFaq`, `readingTime` |
| `app/components/blog/MarkdownBody.tsx` | The markdown → JSX mapping |
| `app/components/blog/` | `BlogCard`, `RelatedPosts`, `ProductCTA` |

**SDK v5 queries data sources, not databases** (`databases.query` is removed), so the database id resolves to a data source id first.

**`MarkdownBody` runs without `rehype-raw`,** so any raw HTML in a post body is escaped and printed as visible text. This is deliberate (see No-gos). It maps H2/H3 with slugified anchor ids for AEO, paragraphs, lists, bold, rules, images, GFM tables in a mobile scroll wrapper, and links (conka.io via `next/link`, external with `target=_blank rel=noopener`).

**Images are re-hosted at build**, never hot-linked: Notion URLs expire after about an hour, and the Shopify/Wix hosts are not ours. Matched hosts (amazonaws, notion.so, notion-static, cdn.shopify.com, static.wixstatic.com) are downloaded to `public/blog/<slug>/hero.<ext>` and `public/blog/<slug>/img-N.<ext>`, probing existing extensions first so re-runs are idempotent. A failure degrades to the placeholder and never fails the build. Body images use a plain `<img loading="lazy">`, not `next/image`, because markdown carries no intrinsic dimensions (see Known gaps).

**Related posts** (`getRelatedPosts`) score by shared `Topic` count, newest breaking ties, topping up with newest so a thin topic degrades to "newest" rather than rendering one card. A post never relates to itself.

## Routes and SEO

- `/blog`, `/blog/page/[page]`, `/blog/topic/[topic]`, `/blog/[slug]`. Fully static via `generateStaticParams`.
- **Hubs are derived, never hardcoded.** `app/lib/blogTopics.ts` builds them from the topics published posts actually carry, so a `Topic` option with no published post generates no hub (ADHD today). Membership is `includes`, so a post tagged Sport and Concussion appears on both hubs.
- **`/blog` is page 1**, so pagination starts at `/blog/page/2`. `/blog/page/1` does not exist: two URLs listing the same posts would be a self-inflicted duplicate. `/blog/page/01` and any non-integer 404 for the same reason.
- **Page size 12.** Hubs do not paginate: the largest is 11. That margin is one post, so if a retag or the ingredient archive pushes a hub to 12 it needs `Pagination` at `/blog/topic/[topic]/page/[page]` (Phase 6.4).
- **`getAllPosts` re-probes every hero image on each call, so fetch once per render and derive.** Use the pure `topicsOf` / `postsForTopic` / `paginate` helpers rather than calling the async wrappers per hub, which turns one build step into twelve.
- `/blogs/news/*` → `/blog/*` (`app/lib/legacyBlogRedirects.ts`, order is load-bearing). `/blogs/*` is the legacy Shopify space: redirect-only, never a content surface. `/blogs/ingredients/*` is deliberately untouched.
- **Canonical: do nothing.** The root layout sets a *relative* `alternates: { canonical: "./" }`, so every route self-canonicalises. **Never set an absolute canonical in a parent**: children inherit it verbatim and read to Google as duplicates of the homepage. Fixing exactly that was the highest-value change in the SEO programme.
- **Sitemap** (`app/sitemap.ts`): `/blog` unconditionally (weekly, 0.7, dated by its newest post), each hub (weekly, 0.65, dated by its own newest post), each paginated page (weekly, 0.5) and one entry per Published post (monthly, 0.6). All inside `blogEntries()`, never `ROUTES`: Notion-derived routes have no source file, so the git-date rule cannot date them. The blog is the deliberate exception to the git-date rule: posts are dated from Notion's `last_edited_time`, because git cannot date content it does not hold.
- **JSON-LD** (`app/blog/[slug]/page.tsx`): `BlogPosting` always, `FAQPage` only when the post has parsed FAQ pairs.

## Scripts

`scripts/legacy-blog/`. Full usage in `scripts/README.md`.

| Script | Purpose |
|---|---|
| `fetch.ts` | Snapshot the Shopify archive to gitignored `.data/` |
| `convert.ts` | Shopify HTML → Notion blocks |
| `import.ts` | Write rows. Idempotent on slug |
| `stripUnderline.ts` | Clear the Wix underline artifact |
| `backfillTopics.ts` | Write `Topic` from `topics.ts` |
| `notionDb.ts` | Shared data-source id, paged read, rate-limit delay |

**Discipline every script owes:** never write `Status` on an existing row (the publish flip is human, permanently), never write `Topic` on update (a hand-retag in Notion must survive a re-import; `backfillTopics.ts` is the deliberate way to push a table change), be idempotent, and pace requests to about 3/second.

## Permanent policy

- **Slug = the Shopify handle, verbatim. Never re-slug.** One wildcard redirect recovers the archive; re-slugging forfeits a post's ranking. The slug is a technical constraint, not an editorial choice. Retitling is free.
- **No auto-publish.** Scripts write `Draft`. The `Status` flip is human and is where `/review-claims` runs.
- **No `rehype-raw`.** Strip the offending formatting at the Notion source instead. Underline was Wix citation junk with no editorial intent, and parsing raw HTML in every post body to fix it would widen the attack surface for no benefit.
- **No `?page=N`.** `searchParams` forces dynamic rendering and breaks the static build. Pagination must be `/blog/page/[page]` static routes.
- **No hub for a zero-post topic**, no renaming `Productivity`, no per-page canonical.
- **No client-side Notion fetching, no second CMS, no comments, no per-post generated OG images.**
- **Search is parked.**
- **Fail the build over shipping damage.** Missing creds, a failed Notion query, a failed conversion, and a duplicate slug all throw. Only a per-row validation miss degrades to skip-and-log.
- **Render fidelity stays low by design**: H2/H3, paragraphs, lists, bold/italic, links, images, and GFM tables. Anything richer stays deferred.

## Known gaps

| Gap | Tracked |
|---|---|
| Hub pagination, if any hub reaches 12 posts (Sport and Neuroscience sit at 11) | Phase 6.4, no ticket yet |
| In-body `<img>` has no dimensions, so bodies shift on load. 100 images across 33 posts, none with usable alt text | `docs/TODO.md` item 11 |
| **Blog → PDP CTA analytics was never built.** `ProductCTA.tsx` says "Analytics (source: 'blog') is wired in Phase 3"; no tracking call exists. The rest of Phase 3 shipped, so this is a dropped task, not a pending one | Untracked as of 2026-07-17 |
| Sequential image downloads and per-post body fetches at build (~40s since SCRUM-1179 made the row query a single request; was ~1m40). `Promise.all` batching is the known fix for what remains | Untracked as of 2026-07-17 |
| 6 legacy posts read as walls of text (no recoverable structure) | `legacy-blog-migration.md` |

## References

- `scripts/README.md` — script usage and the deploy rules
- `docs/development/featurePlans/blog-notion-engine-brief.md` — the authoring guide and content contract
- `docs/development/featurePlans/legacy-blog-migration.md` — the Shopify archive recovery, and the corrections behind the operational rules above
- `docs/development/featurePlans/blog-informational-content-surface.md` — the original surface plan
- `docs/seo-aeo/README.md` — canonical policy, sitemap rules, llms.txt
- `docs/features/FAQ_SYSTEM.md` — the schema-equals-visible rule this surface follows
