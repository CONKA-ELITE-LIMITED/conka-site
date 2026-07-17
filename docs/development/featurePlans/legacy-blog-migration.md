# Legacy Blog Migration (Shopify to Notion to /blog)

> **This is a plan and a build record, not a description of current behaviour.**
> For how the blog works today, read [`docs/features/BLOG_SYSTEM.md`](../../features/BLOG_SYSTEM.md), which is canonical and wins any disagreement.
> Findings below are dated and several have since been fixed by the very phases they prompted. Known examples: the Risks section still says `notion.ts` "swallows every error and returns `[]`" (it throws since SCRUM-1157), and correction 7 says the surface "emits no JSON-LD at all" (it emits `BlogPosting` and `FAQPage`).

**Status:** Phases 1 to 3 built and merged (SCRUM-1155/1156/1157); 55 posts live and all 82 legacy URLs redirecting. **Phase 6 scoped 2026-07-16** (SCRUM-1160/1161/1162): underline artifact repair, topic backfill, topic hubs + paginated index.
**Owner:** Rudh.
**Created:** 2026-07-16.
**Design system:** brand-base. No UI work: `/blog` is already built (SCRUM-1152).
**Part of:** The SEO / AEO programme. Feeds `blog-informational-content-surface.md` via the engine contract in `blog-notion-engine-brief.md`. Discovered during the Search Console pass logged in `aeo-free-tool-runbook.md`.

---

## Problem

**82 editorial posts and roughly 440,000 characters of on-brand content are live in Shopify and returning 404 on conka.io.** They were paused during the move to the bespoke Next.js site and never restored. They are not in the sitemap. They still serve at `shop.conka.io`, so nothing is lost, but nothing is reachable.

Google has not caught up. `/blogs/news/visualisation-mental-imagery-and-rehearsal` still ranks at **position 12.7 and drew 464 impressions in the last three months while returning a 404**.

**Honest sizing:** the whole archive earns roughly **127 impressions and 1 click per three months**. This is a prospective bet on what restored and repaired content can earn, not a rescue of live traffic. The case rests on the archive being cheap raw material for lanes we would otherwise pay to author, not on recovering current traffic.

### The doc bug this exposed

`blog-informational-content-surface.md` states `/blogs/*` is "already a permanent 301 to `/why-conka` ... left untouched". **No such redirect exists.** Every `source:` in `next.config.ts` was checked on 2026-07-16, twice, independently: there is no `/blogs` rule of any kind. The 404s are unhandled, not managed. Choosing `/blog` is still correct, but the doc's claim that the old URLs are handled is false and must be corrected when this lands.

## Who it serves

Cold, non-brand organic searchers and AI answer engines at the top of the funnel, routed to the PDPs via in-article CTAs. Pure acquisition.

## Business impact

Takes `/blog` from 6 rows (3 usable drafts, 2 duplicates, 1 blank) to roughly 56 published posts, and recovers the only page on the site with a proven non-brand organic footprint. Measured against `aeo-scorecard.md` (citation share) and the Search Console baseline (non-brand impressions, indexed URL count).

## Appetite

**3 to 4 days engineering** across Phases 1 to 3. The 53-post claims review (Phase 4) is a separate owner-paced stream and does not block the build.

## Why this outranks writing new content

The Phase 1 corpus (`aeo-demographic-query-research.md`) assumed the queue's job was deciding what to write. The archive changes that: **most of it is already written.**

| Lane | Existing posts |
|---|---|
| Sport / concussion / CTE | 20 |
| Focus / productivity | 14 |
| Nootropic / ingredient | 13 |
| Sleep / recovery | 7 |
| Ageing / decline | 5 |
| Brain fog | 3 |
| **Perimenopause** | **0** |
| **ADHD** | **0** |

Phase 2 of the research doc should be reframed from "what should we write" to **"what is missing from the 82"**. On that framing: perimenopause and ADHD, the two highest-intent lanes, have no coverage. Everything else needs restoring, not authoring. There is also a **military / blast-trauma** cluster (2 posts) serving an audience absent from the demographic taxonomy entirely.

## The URL rule (highest-leverage decision here)

**Import each post with `Slug` set to its existing Shopify handle, unchanged.**

Old URLs are `/blogs/news/<handle>`; the new surface is `/blog/<slug>`. Preserve the handles and the whole archive is recovered by one wildcard redirect:

```js
{ source: '/blogs/news/:handle', destination: '/blog/:handle', permanent: true }
```

Re-slug anything and it needs its own hand-written redirect row; anything missed keeps 404ing and loses its ranking. **The slug is a technical constraint, not an editorial choice.** Retitling is free (the H1 comes from `Blog name`).

Confirmed no catch-all interferes: `/pages/:path*` and `/shop/:path*` do not match `/blogs/*`.

---

## Approach

A one-off Node script converts cleaned Shopify HTML into native Notion blocks and writes rows into the existing Blog Hub database as `Draft`. Nothing else changes: the built pipeline (`app/lib/blog.ts` to `notion-to-md` to SSG, with build-time image rehosting) renders them unmodified.

### Source data (verified 2026-07-16)

Pulled via the **Storefront API** (`articles(first:50)` paginated, 130 articles: 82 editorial + 48 ingredient).

- **Use `contentHtml`, not `content`.** `content` returns plain text with all structure stripped. An earlier pass used `content` and wrongly concluded the bodies were clean HTML. This mistake is recorded because it is easy to repeat.
- The **Admin API refused** with `[API] This action requires merchant approval for read_content scope`. Storefront needed no new grant and carries `contentHtml`, `image`, `authorV2`, `tags`, `seo`. Only add the Admin scope if a future need demands it.

### The cleanup, quantified (of the 53 imports)

| Structural state | Count | Handling |
|---|---|---|
| Real `<h2>`/`<h3>` already | 23 | Convert as-is |
| Fake headings (`<p><strong>Title</strong></p>`) | 24 | Automated promotion to `<h2>` |
| **No recoverable structure** | **6** | **Manual pass (listed below)** |
| Empty `<figure><figcaption></figcaption></figure>` shells | 35 | Strip |
| Em dashes (violates the engine contract) | 20 | Normalise to commas |
| `<meta charset>` inside the body | 16 | Strip |
| span (3,799) / div (1,271) ProseMirror junk | all | Strip |
| **SEO meta description present** | **0 of 53** | **Must be authored. Hard gate, see below.** |
| Excerpt present | 0 of 53 | Ignore |
| Hero image present | 52 of 53 | Rehost at build (needs the filter fix below) |
| `authorV2` present | 53 of 53 | Available if an Author column is ever added |
| ~~Over Notion's 100-block API limit~~ **0 of 53** | **0** | **Corrected 2026-07-16, see below** |
| Paragraphs over the 2,000-char `rich_text` limit | 0 | No handling needed |

Cleanup is **87% deterministic**. The fake-heading rule recovers real section titles (verified: "Basis of Language: Brain Regions", "How We Acquire Language").

**The 6 posts needing a manual structure pass:**
`the-neuroscience-behind-a-hangover-what-happens-to-your-brain-after-drinking`, `how-to-build-the-power-to-overcome-challenges`, `how-does-ashwagandha-help-reduce-brain-fog`, `how-can-breathwork-improve-your-physical-and-mental-health`, `what-is-dopamine-signalling-and-what-can-we-learn-from-adhd-paranoid-schizophrenia-psz`, `rice-vs-meat-movement-is-the-panacea-for-injury`.

### Blockers found by re-validating the plan against live code (2026-07-16)

The first draft of this plan and its tickets contained four defects. All are corrected above and in the tickets. Recorded because each is easy to reintroduce.

1. **A meta description is a hard gate on rendering, not on publishing.** `app/lib/blog.ts:118` is `if (!title || !slug || !description) { console.warn(...); return null; }`. Zero of the 53 posts carry one, so **a post imported without a meta description is silently skipped and never renders**. The original tickets claimed meta descriptions "can lag behind the import". They cannot. Every post needs one before it can appear at all.
2. **Image rehosting will not fire on Shopify or Wix URLs.** `rehostBodyImages` filters with `if (!/amazonaws\.com|notion\.so|notion-static/i.test(url)) continue;` because it was written for Notion-hosted files, which expire. Imported posts carry `cdn.shopify.com` and `static.wixstatic.com` URLs, which match none of those, so **all 102 images across 33 posts would be skipped and hot-link to third-party CDNs permanently**. Fix: extend the filter in `app/lib/blog.ts` to include both hosts. This is a code change the original plan did not account for.
3. **The Notion API caps block creation at 100 per request.** The importer chunks appends into batches of 100. **The sizing behind this was wrong and is corrected below** (no post actually exceeds 100 blocks); the chunking is kept as a cheap guard, but it is not load-bearing for these 53.
4. **There are 6 rows in the Blog Hub, not 3.** Both this plan and `blog-informational-content-surface.md` said three drafts. Live: `what-are-nootropics`, `psychology-of-procrastination`, `brain-fog-supplement-what-actually-works`, **two duplicate "Best Nootropics UK" rows**, and **one entirely blank row**. The duplicates and the blank need reconciling before a bulk import lands on top of them.

### Corrections from building Phase 1 (2026-07-16)

Measured against the real converter output for all 53 posts. These supersede the
estimates above, which were made before a converter existed.

1. **No post exceeds 100 blocks.** Actual: max **89** (`brain-health-habits-a-daily-routine-to-optimise-mental-performance`), median **44**, total 2,396 across the 53. The earlier "14 of 53 over, max 138, median 78" does not reproduce and appears to have counted pre-merge inline runs rather than blocks. The named 138-block post, `the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective`, is **80 blocks**. Chunking is implemented and unit-verified at the boundaries (100 → 1 call, 101 → 2, 138 → [100, 38], 250 → [100, 100, 50]) but never fires on this corpus.
2. **Text retention is 100%** on every one of the 53 (whitespace-normalised source text vs emitted block text), so the lower block count is not content loss.
3. **Images: 102 across 33 posts confirmed.** 100 convert; the 2 that do not are `<img>` tags with no `src` attribute at all, which are unrecoverable. Images are buried inside inline wrappers (`<strong>`, `<span>`, `<u>`) inside `<p>`, not just in `<figure>`, so extraction cannot rely on direct children.
4. **The two "Best Nootropics UK" rows were not duplicates.** Same title and angle, entirely different bodies: a general evidence piece (12 Jul) and a corporate-athlete persona rewrite (14 Jul, with its FAQ in a broken `- question:` YAML format rather than the bold `Q:`/`A:` contract). Resolved by differentiating rather than deleting: slugs `best-nootropics-uk` and `nootropics-for-training-and-working`. The base is therefore **5 engine drafts, not 3**. The 14 Jul FAQ still needs reformatting before publish.
5. **`MarkdownBody.tsx` needs three fixes before the bulk import publishes.** Found by inspecting the pilot's prerendered production HTML. None block the pilot; all block SCRUM-1156.
   - **No `break-words` on `p`/`li`, and no `table` mapping.** 13 of the 53 carry bare unbroken reference URLs (longest **342 chars**, `the-power-of-mind`) and 2 carry tables (`cognitive-enhancers-for-athletes-what-the-science-says`, `creatine-for-the-brain-more-than-just-muscle`). Both overflow horizontally at 390px.
   - **No `img` mapping**, so in-body images render as a raw `<img>`: no `next/image`, no width/height (layout shift), no lazy loading. And `notion-to-md` fabricates the alt text from the filename, so the pilot currently ships `alt="ea1736_841af758b0434bc4ae79ca5f87e2e550_mv2.avif"`. **Nothing can be salvaged from the source:** 0 of the 100 in-body images have usable alt text (60 are empty, the other 40 are the literal string `ree`, Wix junk). Map `img` to an empty alt (decorative) or author alts as part of the Phase 2 content pass.
6. **A build run straight after a Notion status change bakes a 404 for a published post.** Observed while building Phase 3, not theorised. Seconds after flipping two rows to `Published`, one build produced: `generateStaticParams` seeing 3 published posts, but `getPostBySlug` and `sitemap` seeing 1. Next then prerendered `/blog/what-are-nootropics` with `"status": 404` in its `.meta`, and the sitemap omitted it, **on a green build with no error output**. A clean rebuild minutes later was correct (all 3 at status 200, all 3 in the sitemap). This is the "Silent Notion failure" risk in the Risks section, and it is worse than recorded: `queryBlogRows` swallowing errors into `[]` means an inconsistent or rate-limited read during a Vercel deploy silently ships a 404 for a live post. **A build-time assertion is no longer a nice-to-have.** Publishing and deploying should not race; if they do, redeploy.
   - **Update (SCRUM-1163, 2026-07-17):** the mechanism stated above is wrong. `queryBlogRows` **throws** (since SCRUM-1157); it does not swallow into `[]`. The real cause is eventual-consistency disagreement between individually *successful* reads. Now resolved: `app/lib/blogBuildGuard.ts` fails the build on an inconsistent or thin read, and the `[slug]` route throws instead of prerendering a 404. Canonical: `docs/features/BLOG_SYSTEM.md`.
7. **The blog surface emits no JSON-LD at all.** `app/blog/[slug]/page.tsx` has no `BlogPosting` and no `FAQPage`, even though `blog.ts` already parses the FAQ via `extractFaq` and the engine brief sells the FAQ format on the grounds that it "lets the site publish structured FAQ data that answer engines read". For a programme whose entire case rests on organic ranking and AI citation, this is a large gap and it exists independent of this migration. Belongs with the sitemap work in SCRUM-1157.

### Corrections from building Phase 6.1 (2026-07-17)

8. **Correction 6 is worse than recorded, and "redeploy" is not sufficient on its own: Next's data cache holds every Notion response for a year.** Found while verifying SCRUM-1160. After the underline strip was confirmed complete in Notion, a full production build was **still green and still emitted all 191 leaks**. Cause: the Notion SDK calls `fetch`, Next patches it, and all 70 cached entries (68 of them `GET /v1/blocks/{id}/children`, i.e. the post bodies) are written to `.next/cache/fetch-cache` with **`revalidate: 31536000`**. `react.cache` in `app/lib/notion.ts` is per-request and does nothing here. `rm -rf .next/cache` then rebuilding produced **zero leaks across all 55**, which is how the repair was verified.
   - **Consequence:** Vercel restores `.next/cache` between deploys, so **a body edit in Notion can be invisible on a green redeploy for up to a year.** Correction 6's "if they race, redeploy" only reliably fixes a *row/status* race; it does not fix a *body* edit.
   - **Rule: after any Notion body write, redeploy with the build cache cleared** (Vercel: Redeploy → untick "Use existing Build Cache"). A plain redeploy is not a verification.
   - This is a live constraint on the whole blog surface, not a one-off migration quirk, and it strengthens the case for the build-time assertion correction 6 already asked for. Tracked in `docs/TODO.md`.

### Cannibalisation: the engine already covers two legacy topics

No slug collides, so nothing breaks the build. But two engine drafts target queries the archive also covers:

| Engine draft (keep) | Legacy post (drop) |
|---|---|
| `what-are-nootropics` | `what-are-nootropics-and-how-do-they-work` |
| `psychology-of-procrastination` | `the-neuroscience-of-procrastination-why-your-brain-delays-and-how-to-overcome-it` |

**Decision: keep the engine versions, drop the legacy pair.** The engine's are written to the current content contract; the legacy ones are not, and the procrastination post is also one of the unstructured six, so dropping it removes a manual pass. Import count moves from 55 to **53**; drops from 27 to **29**.

**These two handles need explicit redirects placed BEFORE the wildcard**, since `/blogs/news/:handle` to `/blog/:handle` would send them to slugs that do not exist:

```js
{ source: '/blogs/news/what-are-nootropics-and-how-do-they-work', destination: '/blog/what-are-nootropics', permanent: true },
{ source: '/blogs/news/the-neuroscience-of-procrastination-why-your-brain-delays-and-how-to-overcome-it', destination: '/blog/psychology-of-procrastination', permanent: true },
```

### Verified state of the pipeline (do not re-derive)

- `app/lib/blog.ts` is **fully built**. `getAllPosts({includeUnpublished})`, `getPostBySlug(slug)`. Reads exactly: `Blog name`, `Slug`, `Meta description`, `Hero image`, `Hero image alt`, `Date published`, `Topic`, `Related products`. Malformed rows are skipped with `console.warn`; **a duplicate slug throws and fails the build** (so the 3 existing drafts must not collide).
- `app/lib/notion.ts` uses `@notionhq/client` v5, resolves a data source id, queries paginated at 100/page, filtering `Status select equals Published`. **Status is confirmed a `select`, so the filter is correct.**
- **Image rehosting is implemented, not planned.** `rehostImage()` / `rehostBodyImages()` download to `public/blog/<slug>/`. `public/blog/` does not exist yet: nothing has ever been published.
- `notion-to-md ^3.1.9` and `@notionhq/client ^5.23.2` are installed.
- **`app/sitemap.ts` has no blog entries at all**, despite the blog doc listing this as Phase 3 work.

### Live Notion schema (fetched 2026-07-16)

Blog Hub properties: `Blog name` (title), `Slug`, `Meta description`, `Related products` (multi-select: flow/clear/both), `Hero image`, `Hero image alt`, `Date published`, `Status` (select: Draft / Ready for review / Published), `Topic` (multi-select: **ADHD / Brain Ageing / Productivity only**), `Angle`, `Source Files`.

Two gaps: there is **no `Source` field** to separate legacy from engine rows, and **`Topic` cannot express the real lanes** (sport, concussion, brain fog, recovery, neuroscience, nootropics, military). Both are Phase 1 task 3.

**Both closed 2026-07-16.** `Source` (select: `legacy` / `engine`) added; `Topic` extended to ADHD / Brain Ageing / Productivity / Sport / Concussion / Brain Fog / Recovery / Neuroscience / Nootropics / Military (existing row values survived the change). The 5 real rows are tagged `Source = engine` and are all `Draft` with unique slugs and meta descriptions; the blank template row was trashed.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Converter + Notion schema prep + pilot the one ranking post | **Done** |
| 2 | Bulk convert and import the remaining 52 as Draft; hand-structure the 6; author 53 meta descriptions | **Done** |
| 3 | Redirects, sitemap, go-live | **Done** |
| 4 | Review and publish queue (owner, `/review-claims`) | Recurring |
| 5 | Ingredient blog (48 posts) | Future, gated |
| 6 | Underline artifact repair, topic backfill, topic hubs + paginated index | **Active** |

### Phase 1: Converter + pilot

**Built 2026-07-16 (SCRUM-1155).** Tasks 1 to 4 are done; task 5 is imported as
`Draft` and verified rendering in dev preview, awaiting the human `Status` flip.
Scripts: `scripts/legacy-blog/{fetch,convert,import,triage,metaDescriptions,env}.ts`.
Run `npx tsx scripts/legacy-blog/fetch.ts` to re-pull the snapshot (gitignored),
then `npx tsx scripts/legacy-blog/import.ts --pilot [--dry-run]`.

1. **[Infra] HTML to Notion block converter**
   - What: `scripts/legacy-blog/convert.ts`. Sanitise (strip span/div/meta/class/id, drop empty figures, promote `<p><strong>` to `heading_2`, normalise em dashes), then emit Notion block JSON: `heading_2`/`heading_3`, `paragraph`, `bulleted_list_item`, `numbered_list_item`, rich-text annotations for bold/italic, links with `href`, `image` blocks.
   - Dependencies: none. Source JSON already pulled.
   - Complexity: Medium.
   - Files: `scripts/legacy-blog/convert.ts` (new).

2. **[Infra] Notion writer + column mapping**
   - What: `scripts/legacy-blog/import.ts`. `Slug` = Shopify handle verbatim. `Blog name` = title. `Date published` = Shopify `publishedAt`. `Status` = `Draft`, never `Published`. `Source` = `legacy`. Idempotent: match on slug and update rather than duplicate, so re-runs are safe. **Must chunk block appends into batches of 100** (Notion API limit; 14 of 53 posts exceed it).
   - Dependencies: tasks 1 and 3.
   - Complexity: Medium.
   - Files: `scripts/legacy-blog/import.ts` (new).

3. **[Data] Notion schema prep + reconcile existing rows**
   - What: add a `Source` select (`legacy` / `engine`). Extend `Topic` options to cover Sport, Concussion, Brain Fog, Recovery, Neuroscience, Nootropics, Military. **Reconcile the 6 existing rows**: merge or delete the two duplicate "Best Nootropics UK" rows, and delete the blank row, so a bulk import does not land on an inconsistent base.
   - Dependencies: none. **Blocks task 2.**
   - Complexity: Small.
   - Files: Notion (no code).

4. **[Infra] Extend the image rehost filter**
   - What: `rehostBodyImages` in `app/lib/blog.ts` only rehosts `amazonaws.com|notion.so|notion-static`. Extend it to include `cdn.shopify.com` and `static.wixstatic.com`, otherwise all 102 imported images hot-link to third-party CDNs forever and never reach `public/blog/<slug>/`.
   - Dependencies: none. **Blocks task 5.**
   - Complexity: Small.
   - Files: `app/lib/blog.ts`.

5. **[Verify] Pilot the ranking post**
   - What: import `visualisation-mental-imagery-and-rehearsal` alone **with an authored meta description** (without one `blog.ts` skips the row and it never renders), publish it, confirm it renders, images rehost to `public/blog/<slug>/`, metadata and the product CTA fire. Proves the pipeline on the one URL where a 404 is actively costing traffic.
   - Dependencies: tasks 1, 2, 3, 4.
   - Complexity: Small.

### Phase 2: Bulk import

6. **[Infra] Convert and import the remaining 52** as `Draft`. Depends on Phase 1. Medium.
7. **[Content] Hand-structure the 6 unstructured posts** listed above. Depends on task 6. Medium.
8. **[Content] Author 53 meta descriptions** (0 exist). **This gates rendering, not just publishing** (`blog.ts:118` skips any row without one), so a post is invisible until it has one. It can be done after the rows land, but no post can be verified before it. Medium.

### Phase 3: Redirects, sitemap, go-live

**Built 2026-07-16 (SCRUM-1157).** All 82 legacy handles verified against a
production server: 53 imported 308 to `/blog/<handle>`, 29 dropped 308 to their
triage targets, 0 failures, 0 chains, query strings preserved, and
`/blogs/ingredients/*` correctly untouched. Redirects live in
`app/lib/legacyBlogRedirects.ts` (generated from the triage table, order is
load-bearing). Sitemap now carries `/blog` plus every Published post, dated from
Notion. `BlogPosting` and `FAQPage` JSON-LD added.

Two deviations from the ticket, both deliberate:
- **308, not 301.** Next's `permanent: true` emits 308. Google treats them as
  equivalent for canonicalisation, and every other redirect on the site is
  already 308. Consistency beat the letter of the AC.
- **The 29 dropped rules must precede the wildcard, not follow it.** The ticket
  lists them as work item 2, after the wildcard in item 1. Appended in that order
  they would never match, since `/blogs/news/:handle` catches everything, and all
  29 would 301 into a 404. The module puts every specific rule first.

**52 of the 53 imported handles currently 308 into a 404**, because only the
pilot is published. That is no worse than the bare 404 they serve today and it
self-heals as Phase 2 publishes each post, but it is the cost of running Phase 3
before Phase 2.

9. **[Infra] Redirects.** The **two cannibalisation redirects must be listed before** the wildcard, since Next.js matches in array order and the wildcard would otherwise send them to non-existent slugs. Then `{ source: '/blogs/news/:handle', destination: '/blog/:handle', permanent: true }`. Small. Files: `next.config.ts`.
10. **[Infra] Redirects for the other 27 dropped handles** (29 drops minus the 2 cannibalisation redirects in task 9), per the not-imported table. Small.
11. **[SEO] Blog entries in `app/sitemap.ts`.** Note its `lastModified` is git-derived and a Notion-sourced route has no git file, so use Notion `last_edited_time`. Small.

---

## Phase 6: Taxonomy, artifact repair, topic hubs

**Scoped 2026-07-16.** Appetite: 2 to 3 days. Phase 6.1 is a few hours and ships alone.

Three defects on the same surface, found after go-live:

1. **191 `<u>` artifacts leak as visible text** across 26 of the 55 live posts.
2. **All 53 legacy posts are untagged**, so the archive has no organising structure.
3. **The index is one flat grid of 55**, and `RelatedPosts` shows the same 3 newest
   articles to every reader regardless of subject.

**This is deferred work coming due, not a new idea.** `blog-informational-content-surface.md`
parked "category filters / search / pagination UI" until "~8+ posts". At 55 that gate is cleared.

### The underline artifact: root cause (confirmed, do not re-diagnose)

The source HTML is a Wix citation link whose text is an underlined digit.
`convert.ts:126` correctly maps `<u>` to a Notion `underline` annotation.
**`notion-to-md` emits underline as literal raw HTML** `<u>text</u>`
(`node_modules/notion-to-md/build/utils/md.js:29`), and `MarkdownBody.tsx` runs
react-markdown **without `rehype-raw`**, so the raw HTML is escaped and printed as
visible text.

**Measured blast radius** (swept all 55 live pages 2026-07-16, do not re-measure):
**191 leaks across 26 posts.** Worst offenders: `10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health` (18),
`brain-health-habits-a-daily-routine-to-optimise-mental-performance` (14),
`the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective` (13),
`the-link-between-brain-fog-and-inflammation` (13).

A sweep for **any** escaped tag across all 55 posts returned only `&lt;u` (191 open /
191 close, balanced). **This is a single bug, not a class of them.**

**Decision: strip the annotation at the Notion source, not `rehype-raw`.** Underline is
Wix formatting junk, links already carry their own underline via `linkClass` in
`MarkdownBody`, and `rehype-raw` would widen the parsed surface to all raw HTML in every
post body. The converter must also drop its `case "u"` mapping or the next
`fetch`/`import` run silently undoes the repair.

### Why pagination survived the challenge

The measured case against it: `/blog` is **27 KB gzipped, 145 ms, and all 55 hero images
already carry `loading="lazy"`**, so pagination buys nothing on weight or speed. It was
scoped anyway on the owner's call (editorial control of a long mobile scroll). The SEO
objection is weaker than it first appears because the root layout self-canonicalises via
a relative `alternates: { canonical: "./" }`, so paginated pages get a correct
self-canonical for free.

**Hard constraint on the route shape:** `?page=N` reads `searchParams`, which forces
dynamic rendering and **breaks the fully static build**. It must be `/blog/page/[page]`
as real static routes.

### The taxonomy

Backfilled from this doc's own triage-table lanes. The lanes do not match the `Topic`
options, so they reconcile as: `Neuro` to Neuroscience, `Ageing` to Brain Ageing,
`Nootropic` to Nootropics. **`Focus` is added as a new option**; `Productivity` stays and
is **not** renamed, so the 3 engine rows keep their tag untouched. Thin lanes fold into
the nearest fat topic: `Sleep` to Recovery, `Trend` to Neuroscience, `Comparison` to
Nootropics. Compound lanes (`Sport/concussion`) split into two tags.

| Hub | Published posts | From |
|---|---|---|
| Sport | 11 | `Sport` (6) + `Sport/concussion` (4) + `Ageing/performance` (1) |
| Neuroscience | 11 | `Neuro` (10) + `Trend` (1) |
| Recovery | 10 | `Recovery` (8) + `Sleep` (1) + `Sleep/recovery` (1) |
| Focus | 10 | `Focus` lane |
| Concussion | 4 | `Sport/concussion`, shared with Sport |
| Nootropics | 4 | `Nootropic` (3) + `Comparison` (1) |
| Brain Fog | 4 | `Brain fog` (3) + 1 engine row |
| Brain Ageing | 3 | `Ageing` (2) + `Ageing/performance` (1) |
| Military | 2 | `Military` |
| Productivity | 2 | 2 published engine rows |

Ten hubs, no singletons. **ADHD gets no hub**: the option exists but has zero published
posts. The rule "generate a hub only from topics with published posts" handles that
automatically, and is also the empty-topic answer.

Hub membership uses **`topics.includes()`**, so the 4 `Sport/concussion` posts appear
under both Sport and Concussion. The card eyebrow still shows `topics[0]` as the primary.

### Sub-phases

| Sub-phase | Description | Status |
|---|---|---|
| 6.1 | Underline repair (Notion strip + converter fix) | Active |
| 6.2 | Topic backfill + topic-matched related posts | Active |
| 6.3 | Topic hubs, paginated index, sitemap | Active |
| 6.4 | Hub pagination | Future, see trigger below |

**6.4 trigger:** hubs do not paginate this pass because the largest is 11, under the page
size of 12. That margin is **one post**. If Phase 5's 48 ingredient posts land, or any
retag pushes Sport or Neuroscience to 12, hubs need the same `Pagination` component at
`/blog/topic/[topic]/page/[page]`.

### Phase 6.1: Underline repair

1. **[Infra] Strip the underline annotation at source**
   - What: walk every legacy post's blocks, clear `underline` on each `rich_text` run,
     rewrite the block. Idempotent. **Must never touch `Status`** (same discipline as
     `import.ts`, which omits Status on update so a re-run cannot demote a reviewed post).
   - Dependencies: none. Complexity: Small.
   - Files: `scripts/legacy-blog/stripUnderline.ts` (new), `scripts/README.md`
2. **[Infra] Close the converter hole**
   - What: drop `case "u"` at `convert.ts:126`. Without this, the next `fetch`/`import`
     run silently undoes task 1.
   - Dependencies: none, but pointless without task 1. Complexity: Small.
   - Files: `scripts/legacy-blog/convert.ts`
3. **[Verify] Re-sweep the live pages**
   - What: rerun the sweep that produced 191/26 and confirm zero `&lt;u`. **A deploy is
     required for the Notion write to appear.** Write, pause, deploy, verify.
   - Dependencies: 1, 2. Complexity: Small.

### Phase 6.2: Topic backfill + related-post matching

**Built 2026-07-17 (SCRUM-1161).** `Focus` added (schema now 11 options, the 10
existing preserved by id, engine rows still `Productivity`). All 53 legacy rows
tagged from the triage table: Sport 11, Neuroscience 11, Recovery 10, Focus 10,
Concussion 4, Nootropics 4, Brain Fog 3, Brain Ageing 3, Military 2, and 5 posts
dual-tagged. Scripts: `topics.ts`, `backfillTopics.ts`, plus `notionDb.ts`, which
extracts the data-source and paged-read helpers that `import.ts`,
`stripUnderline.ts` and the backfill had each copied.

Verified on a clean build: 55 posts each show exactly 3 related, no post relates
to itself, no topic-rich post shows an unrelated card, and Military falls back to
newest after its single sibling. **34 distinct related-post sets across the 55,
against 1 before**, which is the actual payoff: every reader previously saw the
same three newest posts.

4. **[Data] Add `Focus` to the `Topic` multi-select**
   - What: `ADD COLUMN` option on data source `39b03d3c-dce2-8037-ab26-000bed4e0a91`.
     An add, not a rename, so no existing row value can be disturbed.
   - Dependencies: none. **Blocks task 6.** Complexity: Small. Files: Notion, no code.
5. **[Infra] Lane-to-topic map**
   - What: the 53 slug-to-lane table from the triage section below, plus the
     reconciliation rules above, as data.
   - Dependencies: none. Complexity: Small. Files: `scripts/legacy-blog/topics.ts` (new)
6. **[Infra] Backfill script**
   - What: idempotent write of `Topic` to all 53 legacy rows, reusing `import.ts`'s
     slug-to-pageId index pattern. Must not touch `Status`.
   - Dependencies: 4, 5. Complexity: Medium.
   - Files: `scripts/legacy-blog/backfillTopics.ts` (new)
7. **[Infra] Write `Topic` on import too**
   - What: `import.ts:83-108` (`buildProperties`) never writes `Topic`, so a future
     re-import leaves new rows untagged. Wire the map in.
   - Dependencies: 5. Complexity: Small. Files: `scripts/legacy-blog/import.ts`
8. **[Frontend] Topic-matched related posts**
   - What: `getRelatedPosts(slug)` scores by shared-topic count and falls back to newest
     when a post has fewer than 3 topic siblings (Military, at 2, always will). Replaces
     the "3 newest" slice at `blog/[slug]/page.tsx:59-61`, which currently ignores topics
     entirely and shows every reader the same three links.
   - Dependencies: 6. Complexity: Medium. Files: `app/lib/blog.ts`, `app/blog/[slug]/page.tsx`

### Phase 6.3: Topic hubs, paginated index, sitemap

9. **[Infra] Topic data layer**
   - What: `slugifyTopic` / `getTopicSlugs` / `getPostsByTopic` using `topics.includes()`.
     Hubs generate only for topics with published posts.
   - Dependencies: 6. Complexity: Small. Files: `app/lib/blogTopics.ts` (new)
10. **[Frontend] Extract `BlogGrid`**
    - What: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3` is already duplicated in
      `blog/page.tsx` and `RelatedPosts.tsx`. A hub would make it a third copy.
    - Dependencies: none. **Do before 12 and 13.** Complexity: Small.
    - Files: `app/components/blog/BlogGrid.tsx` (new), `app/components/blog/RelatedPosts.tsx`
11. **[Frontend] `TopicNav`**
    - What: port the chip geometry from `InsightFilteredSections.tsx:141-172` (44px min
      tap target, square, mono, dot indicator), **inverted to light tones and rendering
      `<Link>` not `<button>`**. Crawlable anchors are the entire SEO point of the route,
      so this is a server component: no `useState`, no GSAP. **`BlogCard` is not touched**
      (its outer `<Link>` wraps the whole card and cannot nest an `<a>`).
    - Dependencies: 9. Complexity: Medium. Files: `app/components/blog/TopicNav.tsx` (new)
12. **[Frontend] Topic hub route**
    - What: `/blog/topic/[topic]`, `generateStaticParams` from task 9, per-hub
      `generateMetadata`, H1 per the `seoHeading` keyword rule. No hub pagination.
    - Dependencies: 9, 10, 11. Complexity: Medium. Files: `app/blog/topic/[topic]/page.tsx` (new)
13. **[Frontend] Paginated index**
    - What: `/blog` is page 1, `/blog/page/[page]` for the rest, `generateStaticParams`.
      **Never `?page=N`** (see the constraint above). Page size 12, so 55 posts gives 5
      pages. Prev/next controls.
    - Dependencies: 10, 11. Complexity: Medium.
    - Files: `app/blog/page.tsx`, `app/blog/page/[page]/page.tsx` (new), `app/components/blog/Pagination.tsx` (new)
14. **[SEO] Sitemap + llms.txt**
    - What: hubs and paginated pages go in `blogEntries()`, **not `ROUTES`**. They are
      Notion-derived with no source file, so the git-derived `lastModified` rule cannot
      date them; date each hub from its newest post, mirroring how `/blog` is dated.
      Priority 0.65 for hubs (between index 0.7 and post 0.6). Add hubs to
      `public/llms.txt` per the SEO README.
    - Dependencies: 12, 13. Complexity: Small. Files: `app/sitemap.ts`, `public/llms.txt`
15. **[Verify] Route collision + build check**
    - What: assert no post slug is literally `topic` or `page` (a static segment would
      shadow a dynamic one), confirm all 55 `/blog/<slug>` URLs still resolve, and check
      build time has not materially regressed: 15 new routes each call `getAllPosts`.
    - Dependencies: 12, 13. Complexity: Small.

### Phase 6 analytics

**No new events.** Vercel Analytics already reports pageviews per route, so
`/blog/topic/sport` traffic **is** the "which topics do people want" data. A click handler
would force `TopicNav` to be a client component and defeat the crawlability that justifies
the route existing.

### Phase 6 no-gos

- **No `rehype-raw`.** Strip at source instead.
- **No `?page=`.** It breaks static generation.
- **No per-page canonical.** The root layout's relative `"./"` self-canonicalises every
  route. An absolute one is inherited verbatim by every child and tells Google they are
  all duplicates. Only the two noindex A/B landers override it.
- **No hub for a topic with zero published posts.**
- **No `BlogCard` restructure** to make its eyebrow clickable.
- **No editorial re-tagging pass.** The triage lanes are the source. Fix a wrong lane as a
  one-row edit in Notion afterwards.
- **No renaming `Productivity`.** Focus and Productivity stay separate options.

### Phase 6 risks

- **Two Notion-write scripts against a static build.** Nothing is live until a redeploy,
  and a build run seconds after a Notion write has been observed to bake a 404 into a
  published post on a green build (see correction 6 above). Every write phase ends with:
  write, pause, deploy, verify.
- **Build time.** ~1m40 today, with the 155 image downloads and 55 Notion fetches running
  sequentially in `app/lib/blog.ts`. Phase 6.3 adds 15 routes that each call
  `getAllPosts`. The Notion query is `react.cache`d; the filesystem probing is not. Task
  15 measures it. If it regresses badly, `Promise.all` batching is the known fix and is
  tracked separately in `docs/TODO.md`.
- **Concussion (4), Military (2) and Productivity (2) are thin hubs.** Acceptable under the
  no-singletons rule, but they are the ones most likely to read as low-value to Google.
  `docs/seo-aeo/README.md` has no explicit thin-content policy; the governing precedent is
  "expired campaign pages get deleted, not noindexed".
- **Hub pagination margin is one post.** Sport and Neuroscience sit at 11 against a page
  size of 12.

### Phase 6 open questions

1. **The 6th engine row.** `cognitive-enhancers-anxiety-natural-alternatives` carries a
   title, slug and `Topic = ADHD`, but **no `Status` and no `Source`**, so it cannot
   publish and it is the only thing standing between ADHD and a hub. Not created by this
   work. **Resolved 2026-07-16: leave it alone.** ADHD therefore gets no hub this pass.

---

## Rabbit holes

- **Hand-rewriting 53 posts.** The converter is deterministic; only the 6 structureless posts get human attention. If the converter starts needing per-post special cases, stop and route those posts to Humphrey's engine for rewrite instead.
- **Rebuilding the renderer.** The pipeline works. This is data-in, nothing else.
- **The 48 ingredient posts.** 16 ingredients x 3 near-duplicate variants (`-ip` / `-cd` / `-ms`, e.g. `ashwagandha-ip`, `ashwagandha-cd`, `ashwagandha-ms`). Publishing three near-identical pages per ingredient is a duplicate-content problem and `/ingredients` already owns that surface. Phase 5, gated on a dedupe rule.
- **Perfecting old copy.** The `Status` gate is where quality is judged, one post at a time. Do not block the import on it.

## No-gos

- **No re-slugging.** Slug = Shopify handle, always.
- **No auto-publish.** Everything imports as `Draft`. The `Status` flip stays human.
- **No importing the 29 dropped posts.**
- **No touching `/blogs/ingredients/*`** this pass.
- **No engine dependency.** The import is self-contained.
- **No new UI.** `/blog` is built.

## Risks

- **`static.wixstatic.com` images.** Some images sit on a third-party host that can vanish independently of Shopify. Build-time rehosting only catches them while the host lives. Mirror during import.
- **Silent Notion failure.** `app/lib/notion.ts` swallows every error and returns `[]`: a failed query renders an empty blog with a clean build. 53 posts makes this worse. Recommend a build-time assertion. **Exists independent of this work.** **Update (SCRUM-1163):** stale on the mechanism — `notion.ts` throws on failure since SCRUM-1157, it does not return `[]`. The build-time assertion recommended here shipped in SCRUM-1163 (`app/lib/blogBuildGuard.ts`).
- **Claims exposure.** 53 posts of 2022-23 health copy through a modern gate. Flagged: `how-does-ashwagandha-help-reduce-brain-fog`, `10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health`, `what-is-dopamine-signalling...psz`.
- **Build time.** 53 posts x hero + in-body downloads. `getAllPosts` is re-invoked per article for related posts; the query is `react.cache`d but the filesystem probing is not.
- **Slug collision** with the existing rows fails the build (by design). Verified 2026-07-16: no legacy handle collides with the 6 live rows.
- **Doc drift.** The false `/blogs/*` redirect claim, and `blog-informational-content-surface.md` saying "Phase 1 built (SCRUM-1151)" while **SCRUM-1151 is still `To Do`**. Correct both when this lands.

## Open questions

1. **`Topic` options:** extend to the real lanes, or leave legacy untagged? Recommend extend (Phase 1 task 3).
2. **Meta descriptions for 53 posts:** engine or owner? Unavoidable either way. **Resolved on timing:** they cannot lag, because `blog.ts` skips any row without one, so a post is invisible until it has a meta description.
3. **Redirect targets for the 29 dropped posts:** athlete stories to `/case-studies` individually, or as a group?

## References

- Triage source data: Storefront API, `contentHtml` (not `content`).
- Blog surface and pipeline: `docs/development/featurePlans/blog-informational-content-surface.md`
- Engine contract: `docs/development/featurePlans/blog-notion-engine-brief.md`
- Demand research this reframes: `docs/development/featurePlans/aeo-demographic-query-research.md`
- Where the 404 was found: `docs/development/featurePlans/aeo-free-tool-runbook.md`
- Code: `app/lib/blog.ts`, `app/lib/notion.ts`, `app/blog/[slug]/page.tsx`, `app/sitemap.ts`, `next.config.ts`

## Jira

Sprint 28, under the Website & CRO epic (SCRUM-763). Chained with `Blocks` links: 1155 to 1156 to 1157.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| [SCRUM-1155](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1155) | [Website & CRO] Legacy blog Phase 1: HTML to Notion converter and pilot import | 1 | To Do |
| [SCRUM-1156](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1156) | [Website & CRO] Legacy blog Phase 2: bulk import the remaining 52 posts as Draft | 2 | To Do |
| [SCRUM-1157](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1157) | [Website & CRO] Legacy blog Phase 3: redirects, sitemap and go-live | 3 | Done |
| [SCRUM-1160](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1160) | [Website & CRO] Blog Phase 6.1: strip the underline artifact leaking as literal text on 26 live posts | 6.1 | Built, awaiting deploy |
| [SCRUM-1161](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1161) | [Website & CRO] Blog Phase 6.2: backfill Topic on all 53 legacy posts and make related posts topic-matched | 6.2 | Built, awaiting deploy |
| [SCRUM-1162](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1162) | [Website & CRO] Blog Phase 6.3: topic hub routes, paginated index and sitemap entries | 6.3 | To Do |

Phase 6 is Sprint 28, chained `Blocks` 1160 to 1161 to 1162.

Phases 4, 5 and 6.4 stay in this doc until active.

**Adjacent tickets worth noting:** SCRUM-1151 (blog Phase 6.1, Notion data layer) is still `To Do` in Jira despite its code being merged and `blog-informational-content-surface.md` claiming "Phase 1 built". SCRUM-1152 (blog UI) is `Done`.

---

## Triage

**82 editorial posts: 53 import, 29 do not.** Every post is accounted for.

### Import (53)

Ordered by lane. `Slug` = the existing Shopify handle, unchanged (see the URL rule above).

| Lane | Handle (= new slug) | Published | Note |
|---|---|---|---|
| Ageing | `cognitive-function-age` | 2023-05 |  |
| Ageing | `decoding-language` | 2025-11 |  |
| Ageing/performance | `visualisation-mental-imagery-and-rehearsal` | 2023-05 | **STILL RANKING pos 12.7 / 464 impr while 404ing. Import first.** |
| Brain fog | `the-link-between-brain-fog-and-inflammation` | 2025-07 |  |
| Brain fog | `how-to-reduce-brain-fog-with-nootropics` | 2025-06 |  |
| Brain fog | `how-does-ashwagandha-help-reduce-brain-fog` | 2023-12 | Claims-check the title: ingredient + benefit. |
| Comparison | `conka-vs-energy-drinks-what-s-better-for-focus-and-brain-health` | 2025-06 | Brand-vs-category; keep the angle distinct from the PDP. |
| Focus | `brain-health-habits-a-daily-routine-to-optimise-mental-performance` | 2025-07 |  |
| Focus | `the-power-of-consistency-why-small-daily-habits-drive-big-brain-gains` | 2025-07 |  |
| Focus | `10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health` | 2025-07 | "Detoxify" is a claims-check word. |
| Focus | `how-to-build-a-brain-boosting-morning-routine` | 2025-07 |  |
| Focus | `the-power-of-mindfulness-how-habits-shape-the-brain-through-neuroplasticity` | 2025-08 |  |
| Focus | `the-state-of-flow-part-l` | 2023-12 | Two-parter. |
| Focus | `the-state-of-flow-part-ll` | 2024-01 | Two-parter; consider merging with Part l and flow-states. |
| Focus | `the-power-of-mind` | 2024-05 | Vague title; rewrite for a query. |
| Focus | `how-to-build-the-power-to-overcome-challenges` | 2024-01 | Vague/motivational; rewrite for a query. |
| Focus | `flow-states` | 2023-07 | Overlaps The State of Flow I/II. Merge or differentiate. |
| Military | `the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective` | 2025-06 | Audience absent from the taxonomy. |
| Military | `the-hidden-impact-of-blast-induced-trauma-on-military-brain-health` | 2025-06 | Audience absent from the demographic taxonomy. |
| Neuro | `how-can-neurofeedback-devices-enhance-brain-activity` | 2025-02 |  |
| Neuro | `the-vagus-nerve-gut-brain-axis` | 2023-05 |  |
| Neuro | `the-mesolimbic-dopamine-system-unveiling-the-pathway-to-pleasure-and-reward` | 2023-05 |  |
| Neuro | `the-neural-basis-of-emotions` | 2023-06 |  |
| Neuro | `how-the-brain-learns-and-stores-information` | 2024-06 |  |
| Neuro | `the-social-brain` | 2023-07 |  |
| Neuro | `decision-making` | 2023-06 |  |
| Neuro | `the-brain-and-creativity` | 2023-07 |  |
| Neuro | `what-is-dopamine-signalling-and-what-can-we-learn-from-adhd-paranoid-schizophrenia-psz` | 2023-07 | Only ADHD-adjacent post. Title mentions schizophrenia: claims-check. |
| Neuro | `mirror-neurons-emotional-copycats` | 2023-04 |  |
| Nootropic | `creatine-for-the-brain-more-than-just-muscle` | 2025-06 |  |
| Nootropic | `caffeine-everything-you-need-to-know` | 2022-10 | 9.3k, strong. |
| Nootropic | `adaptogens-stress-relieving-powerhouses` | 2023-04 |  |
| Recovery | `the-hidden-cost-of-dehydration-how-it-impacts-your-brain` | 2025-06 |  |
| Recovery | `the-neuroscience-behind-a-hangover-what-happens-to-your-brain-after-drinking` | 2025-06 |  |
| Recovery | `what-actually-happens-to-your-brain-in-the-sauna` | 2025-06 |  |
| Recovery | `rice-vs-meat-movement-is-the-panacea-for-injury` | 2023-03 |  |
| Recovery | `ketosis-the-ketogenic-diet` | 2023-04 |  |
| Recovery | `brrrr-embrace-the-cold-cold-water` | 2023-04 |  |
| Recovery | `how-can-breathwork-improve-your-physical-and-mental-health` | 2023-11 |  |
| Recovery | `hope-molecules-exercise-myokines` | 2023-03 |  |
| Sleep | `zzzz-a-primer-on-sleep-stages` | 2023-03 |  |
| Sleep/recovery | `intermittent-fasting-for-brain-health` | 2023-04 |  |
| Sport | `cognitive-enhancers-for-athletes-what-the-science-says` | 2025-07 |  |
| Sport | `tennis-and-brain-health-how-the-game-sharpens-focus-memory-and-resilience` | 2025-07 |  |
| Sport | `how-to-optimise-athletic-performance-in-extreme-weather-conditions` | 2024-02 |  |
| Sport | `the-weight-of-success-navigating-the-challenges-of-making-weight-in-boxing` | 2024-05 | Borderline: athlete-adjacent but topic-led. |
| Sport | `can-supplements-improve-reaction-time-in-sport` | 2025-06 |  |
| Sport | `informed-sport-and-what-that-means` | 2023-10 | Matches corpus batch-testing question. Thin at 2.9k; expand. |
| Sport/concussion | `5-groundbreaking-discoveries-in-concussion-neuroscience` | 2023-07 | Longest post at 12.2k. |
| Sport/concussion | `10-ways-to-support-someone-with-post-concussion-syndrome` | 2023-07 |  |
| Sport/concussion | `the-header-the-facts-so-what` | 2022-02 | Thin at 2k; matches corpus "does heading a football cause brain damage?". |
| Sport/concussion | `women-sport-is-worse-for-concussion` | 2022-09 | Thin at 1.6k; rewrite/expand. |
| Trend | `how-chatgpt-may-be-rewiring-the-human-brain-what-the-latest-research-reveals` | 2025-07 |  |

### Not imported (29), and why

| Reason | Handle | Why it is not coming across | Redirect to |
|---|---|---|---|
| **CANNIBALISATION** | `what-are-nootropics-and-how-do-they-work` | Engine draft `what-are-nootropics` already targets this query and is written to the current content contract. Redirect this handle to /blog/what-are-nootropics. | the engine post (see Why) |
| **CANNIBALISATION** | `the-neuroscience-of-procrastination-why-your-brain-delays-and-how-to-overcome-it` | Engine draft `psychology-of-procrastination` already targets this query. Also one of the unstructured posts, so dropping it removes a manual pass. Redirect to /blog/psychology-of-procrastination. | the engine post (see Why) |
| **Announcement** | `introducing-conka-v23` | Obsolete product launch. | /blog |
| **Announcement** | `discover-track-and-compete-with-the-all-new-conka-app` | Obsolete. /app owns this. | /blog |
| **BRAND RISK** | `the-nicotinic-effect-preconditioning-the-brain-for-neuroprotection` | Nicotine framed as neuroprotective. Reputationally and claims fraught for a brain-health brand. | /blog |
| **Brand** | `founders-letter` | /our-story owns the founder narrative. | /our-story or /app |
| **Brand** | `what-is-conkas-app-technology` | /app and /app-insights own this. | /our-story or /app |
| **Brand/app** | `how-reliable-is-the-conka-test-a-look-at-the-latest-research` | Route to /app-insights, which owns instrument validation. | /app-insights |
| **Brand/product** | `the-science-behind-conka-1-short-term-and-long-term-benefits` | /science owns this and would compete with it. | /science |
| **Brand/product** | `the-science-behind-conka-2-short-term-and-long-term-benefits` | /science owns this. | /science |
| **CLAIMS RISK** | `chc5-1-conka-formula-component-no1` | Discontinued capsule formula, plus "17% increase in serum testosterone" and "167% increase in total sperm count" fertility claims. Off-brand and high claims exposure. | /blog |
| **Case study** | `the-cost-of-playing-through-pain-barneys-story` | Athlete story. /case-studies owns this surface. | /case-studies |
| **Case study** | `bee-stillman-jones-a-journey-of-resilience-and-rediscovery` | Athlete story. /case-studies. | /case-studies |
| **Case study** | `from-concussions-to-comebacks-sienna-charles-journey-with-show-jumping-and-conka` | Athlete story. /case-studies. | /case-studies |
| **Case study** | `inside-the-brain-of-a-boxing-world-champion-chris-billam-smiths-brain-data` | Strong copy, but athlete profile. /case-studies. | /case-studies |
| **Case study** | `behind-the-gloves-the-human-side-of-chris-billam-smiths-journey-to-becoming-world-champion` | Athlete profile. /case-studies. | /case-studies |
| **Case study** | `racing-driver-josh-stanton-x-conka-16` | Athlete profile. /case-studies. | /case-studies |
| **DATED** | `achieve-your-goals-for-2024` | Year-stamped. Dead as an evergreen asset. | /blog |
| **EMPTY** | `bristol-bears-on-conka-data-insights` | 0 characters. Image-only post. | /blog |
| **EMPTY** | `harlequins-on-conka-protecting-athletes-from-brain-injuries` | 0 characters. Image-only post. | /blog |
| **OBSOLETE PRODUCT** | `10-reasons-why-capsules-work` | Sells capsules as a format. Product discontinued; we sell shots. | /blog |
| **OBSOLETE PRODUCT** | `chc5-1-conka-formula-component-no3` | Discontinued ChC5+1 capsule formula. | /blog |
| **OBSOLETE PRODUCT** | `chc5-1-conka-formula-component-no4` | Discontinued ChC5+1 capsule formula. | /blog |
| **OBSOLETE PRODUCT** | `chc5-1-component-no5-vaccinium-myrtillus-boosts-your-genius-and-helps-you-overcome-stress` | Discontinued formula. Title also claims it "boosts your genius". | /blog |
| **PR** | `co-founder-harry-glover-wins-vodafone-business-gain-line-award-for-work-with-conka` | Award announcement. No search demand, dates instantly. | /blog |
| **PR** | `bristol-bears-on-conka-taking-their-performance-to-the-next-level` | Partner announcement. | /blog |
| **PR** | `conka-x-cognica` | Partnership announcement. | /blog |
| **Thin** | `no-brainer-with-telusa-veainu` | 857 chars. | /blog |
| **Thin PR** | `bristol-bears-on-conka-data-insights-ll` | 725 chars. Partner announcement. | /blog |
