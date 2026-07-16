# Scripts

## Legacy blog migration (`legacy-blog/`)

One-off migration of the old Shopify blog into the Notion Blog Hub, which `/blog`
renders. Plan: [docs/development/featurePlans/legacy-blog-migration.md](../docs/development/featurePlans/legacy-blog-migration.md).

```bash
npx tsx scripts/legacy-blog/fetch.ts                 # snapshot Shopify -> .data/articles.json
npx tsx scripts/legacy-blog/convert.ts <handle>      # inspect one post's Notion blocks
npx tsx scripts/legacy-blog/import.ts --pilot        # write the pilot post as a Draft
npx tsx scripts/legacy-blog/import.ts --all --dry-run
```

- **Prereq:** `.env.local` with `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `NOTION_TOKEN`, `NOTION_BLOG_DATABASE_ID`.
- **Idempotent:** rows are matched on slug and updated in place. Re-running never duplicates a row (a duplicate slug fails the site build) and never changes `Status` on an existing row, so a reviewed post is not dragged back to `Draft`.
- **`Slug` is the Shopify handle, verbatim.** One wildcard 301 recovers the archive; re-slugging forfeits the post's ranking. Never "clean up" a slug.
- **A meta description is required to render,** not just to publish (`app/lib/blog.ts` skips rows without one). The importer refuses any handle missing from `metaDescriptions.ts` rather than creating an invisible row.
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
