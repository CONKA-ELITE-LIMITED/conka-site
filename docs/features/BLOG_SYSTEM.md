# Blog system

How `/blog` works: Notion is the CMS, the site is fully static, and posts are prerendered at build. **This is the canonical reference for current behaviour.** The three `featurePlans/blog-*.md` and `legacy-blog-migration.md` docs are build history and plans; where they disagree with this doc, this doc wins.

## Overview

Posts live in a Notion database ("Blog Hub"). `app/lib/blog.ts` reads it at **build time only**, converts each page to markdown via `notion-to-md`, and Next prerenders every post as static HTML. There is no runtime Notion call, no client-side fetching, and no second CMS.

Publishing is a two-step human action: flip `Status` to `Published` in Notion, **then redeploy**. Nothing reaches the site until a build runs.

The surface is deliberately thin: `/blog` (index) and `/blog/[slug]` (post), plus `app/blog/error.tsx`. Topic hubs and pagination are scoped but not built (SCRUM-1162).

## The operational rules (read these before touching Notion)

The blog is static and Notion is read at build only, which makes every content change invisible until a deploy, and makes two failure modes silent. Both have bitten us in production.

**1. Sequence every Notion write: write, pause, deploy, verify.**

A build running seconds after a Notion write has baked a 404 into a live post **on a green build with no error output** (observed during SCRUM-1157: `generateStaticParams` saw 3 published posts while `getPostBySlug` and `sitemap` saw 1, so `/blog/what-are-nootropics` prerendered with `"status": 404` and was dropped from the sitemap). A clean rebuild minutes later was correct. Publishing and deploying must not race. If they do, rebuild.

**2. After a Notion body or property edit, redeploy with the build cache cleared.**

The Notion SDK calls `fetch`, Next patches it, and every Notion response lands in `.next/cache/fetch-cache` with **`revalidate: 31536000`** (one year). `react.cache` in `notion.ts` is per-request and does not help. **Vercel restores `.next/cache` between deploys, so an ordinary redeploy can serve a year-old body on a green build.**

- Vercel: Redeploy, then untick **"Use existing Build Cache"**
- Local: `rm -rf .next/cache` before `npm run build`

Reproduced on SCRUM-1160: after an underline repair was confirmed complete in Notion, a full build was still green and still emitted all 191 leaks; clearing the cache produced zero across all 55 posts. A plain redeploy is not a verification.

**Both rules are human steps guarding silent failures. [SCRUM-1163](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1163) replaces them with a build-time assertion and explicit cache control.** Delete these rules from this doc when it lands.

### What already fails loudly (do not re-add these guards)

`queryBlogRows` **throws** rather than returning `[]` (`app/lib/notion.ts:120-136`), because `[]` is indistinguishable from "there are genuinely no posts": a rate-limit during a build once generated zero routes, rendered an empty `/blog`, exited 0, and deployed, pointing all 82 legacy redirects at 404s. Also throwing: missing `NOTION_TOKEN` / `NOTION_BLOG_DATABASE_ID` (`notion.ts:37-47`), a `notion-to-md` conversion failure, and a duplicate `Slug` (`blog.ts:172-176`).

So the residual risk in rule 1 is **not** error-swallowing. It is that separate, individually successful queries across one build can disagree (Notion is eventually consistent right after a write, and `react.cache` dedupes per request, not per build). Nothing throws, because nothing failed.

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
| `app/lib/notion.ts` | Client, data-source resolution, `queryBlogRows`, `pageToMarkdown`. Both `react.cache`d, both throw on failure |
| `app/lib/blog.ts` | `getAllPosts`, `getPostBySlug`, `getRelatedPosts`, image re-hosting |
| `app/lib/blogTransform.ts` | Property readers, `cleanBody`, `extractFaq`, `readingTime` |
| `app/components/blog/MarkdownBody.tsx` | The markdown → JSX mapping |
| `app/components/blog/` | `BlogCard`, `RelatedPosts`, `ProductCTA` |

**SDK v5 queries data sources, not databases** (`databases.query` is removed), so the database id resolves to a data source id first.

**`MarkdownBody` runs without `rehype-raw`,** so any raw HTML in a post body is escaped and printed as visible text. This is deliberate (see No-gos). It maps H2/H3 with slugified anchor ids for AEO, paragraphs, lists, bold, rules, images, GFM tables in a mobile scroll wrapper, and links (conka.io via `next/link`, external with `target=_blank rel=noopener`).

**Images are re-hosted at build**, never hot-linked: Notion URLs expire after about an hour, and the Shopify/Wix hosts are not ours. Matched hosts (amazonaws, notion.so, notion-static, cdn.shopify.com, static.wixstatic.com) are downloaded to `public/blog/<slug>/hero.<ext>` and `public/blog/<slug>/img-N.<ext>`, probing existing extensions first so re-runs are idempotent. A failure degrades to the placeholder and never fails the build. Body images use a plain `<img loading="lazy">`, not `next/image`, because markdown carries no intrinsic dimensions (see Known gaps).

**Related posts** (`getRelatedPosts`) score by shared `Topic` count, newest breaking ties, topping up with newest so a thin topic degrades to "newest" rather than rendering one card. A post never relates to itself.

## Routes and SEO

- `/blog` and `/blog/[slug]`. Fully static via `generateStaticParams`.
- `/blogs/news/*` → `/blog/*` (`app/lib/legacyBlogRedirects.ts`, order is load-bearing). `/blogs/*` is the legacy Shopify space: redirect-only, never a content surface. `/blogs/ingredients/*` is deliberately untouched.
- **Canonical: do nothing.** The root layout sets a *relative* `alternates: { canonical: "./" }`, so every route self-canonicalises. **Never set an absolute canonical in a parent**: children inherit it verbatim and read to Google as duplicates of the homepage. Fixing exactly that was the highest-value change in the SEO programme.
- **Sitemap** (`app/sitemap.ts`): `/blog` unconditionally (weekly, 0.7, dated by its newest post) plus one entry per Published post (monthly, 0.6). The blog is the deliberate exception to the git-date rule: posts are dated from Notion's `last_edited_time`, because git cannot date content it does not hold.
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
| Build-time assertion + explicit cache control (the two silent failures above) | [SCRUM-1163](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1163), `docs/TODO.md` item 10 |
| Topic hubs, paginated index, sitemap entries | [SCRUM-1162](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1162) |
| In-body `<img>` has no dimensions, so bodies shift on load. 100 images across 33 posts, none with usable alt text | `docs/TODO.md` item 11 |
| **Blog → PDP CTA analytics was never built.** `ProductCTA.tsx` says "Analytics (source: 'blog') is wired in Phase 3"; no tracking call exists. The rest of Phase 3 shipped, so this is a dropped task, not a pending one | Untracked as of 2026-07-17 |
| Sequential image downloads and Notion fetches at build (~1m40). `Promise.all` batching is the known fix | Untracked as of 2026-07-17 |
| 6 legacy posts read as walls of text (no recoverable structure) | `legacy-blog-migration.md` |

## References

- `scripts/README.md` — script usage and the deploy rules
- `docs/development/featurePlans/blog-notion-engine-brief.md` — the authoring guide and content contract
- `docs/development/featurePlans/legacy-blog-migration.md` — the Shopify archive recovery, and the corrections behind the operational rules above
- `docs/development/featurePlans/blog-informational-content-surface.md` — the original surface plan
- `docs/seo-aeo/README.md` — canonical policy, sitemap rules, llms.txt
- `docs/features/FAQ_SYSTEM.md` — the schema-equals-visible rule this surface follows
