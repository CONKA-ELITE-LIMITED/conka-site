# Scripts

## Legacy blog migration (`legacy-blog/`)

One-off migration of the old Shopify blog into the Notion Blog Hub, which `/blog`
renders. Plan: [docs/development/featurePlans/legacy-blog-migration.md](../docs/development/featurePlans/legacy-blog-migration.md).

```bash
npx tsx scripts/legacy-blog/fetch.ts                 # snapshot Shopify -> .data/articles.json
npx tsx scripts/legacy-blog/convert.ts <handle>      # inspect one post's Notion blocks
npx tsx scripts/legacy-blog/import.ts --pilot        # write the pilot post as a Draft
npx tsx scripts/legacy-blog/import.ts --all --dry-run
npx tsx scripts/legacy-blog/stripUnderline.ts --dry-run   # report underline leaks, write nothing
npx tsx scripts/legacy-blog/stripUnderline.ts             # clear them, then pause/deploy/verify
npx tsx scripts/legacy-blog/backfillTopics.ts --dry-run   # report Topic changes, write nothing
npx tsx scripts/legacy-blog/backfillTopics.ts             # tag the 53 legacy rows
```

- **Prereq:** `.env.local` with `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `NOTION_TOKEN`, `NOTION_BLOG_DATABASE_ID`.
- **Idempotent:** rows are matched on slug and updated in place. Re-running never duplicates a row (a duplicate slug fails the site build) and never changes `Status` on an existing row, so a reviewed post is not dragged back to `Draft`.
- **`Slug` is the Shopify handle, verbatim.** One wildcard 301 recovers the archive; re-slugging forfeits the post's ranking. Never "clean up" a slug.
- **A meta description is required to render,** not just to publish (`app/lib/blog.ts` skips rows without one). The importer refuses any handle missing from `metaDescriptions.ts` rather than creating an invisible row.
- **`stripUnderline.ts` clears the `underline` annotation from every legacy post body** (SCRUM-1160). Notion underline has no markdown form, so `notion-to-md` emits raw `<u>` and `MarkdownBody` (no `rehype-raw`) escapes it into visible text. It only calls `blocks.update`, never `pages.update`, so it cannot touch `Status`; it writes only blocks still carrying an underline, so a second run is a no-op. `convert.ts` no longer emits the annotation, so a re-import cannot reintroduce it, and the two must stay in step.
- **`backfillTopics.ts` writes `Topic` on the 53 legacy rows** (SCRUM-1161), from `topics.ts`, which is the plan doc's triage table plus its reconciliation rules as data. The doc stays the source: a wrong lane is a one-row edit in Notion, not a re-read of the posts. It writes `Topic` only (never `Status`), skips rows already correct, is scoped to `Source = legacy` so the engine rows keep `Productivity`, and refuses a tag the schema lacks rather than letting Notion invent an option. `import.ts` writes `Topic` too, so a re-import no longer lands untagged.
- **`notionDb.ts` holds the shared Notion access** (data-source id, paged row read, rate-limit delay). Extracted at the third copy; add new legacy-blog scripts on top of it rather than pasting the query loop again.
- **The blog is static: Notion is read at build only.** A Notion write is invisible until a redeploy, and a build racing a write has baked a 404 into a live post on a green build. Sequence every write: **write, pause, deploy, verify.**
- **After a Notion *body* write, the redeploy must clear the build cache.** Next caches every Notion response in `.next/cache/fetch-cache` with `revalidate: 31536000` (one year), and Vercel restores that cache between deploys, so a plain redeploy can ship a green build that still serves the old body. On Vercel untick "Use existing Build Cache"; locally `rm -rf .next/cache` before `npm run build`. Verified in anger on SCRUM-1160 (see correction 8 in the plan doc).
- `.data/` is a gitignored, re-pullable snapshot, not source.

## Review data (Loox)

**Single command to format Loox review data for the app:**

```bash
npm run build:reviews
```

- **Prereq:** Run `npm install` once so the `csv-parse` devDependency is available.
- **Input:** `app/lib/reviews.ly_TolaWV6.csv` (export from Loox).
- **Output:**
  - `app/lib/testimonialsFromLoox.ts` – curated only (3×30 reviews), used by the Testimonials component.
  - `docs/loox-product-ids.json` – product ID counts for Shopify lookup.

**Idempotent:** Safe to run repeatedly. Each run overwrites the two output files from the current CSV; No leftover state. If you have an old full-array testimonialsFromLoox.ts, run `node scripts/migrate-loox-to-curated.mjs` once to shrink it (no CSV needed). Replacing the CSV and running again is the only way to “update” review data.

See [docs/LOOX_TESTIMONIALS_PLAN.md](../docs/LOOX_TESTIMONIALS_PLAN.md) for the full flow.
