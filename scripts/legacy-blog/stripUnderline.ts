/**
 * Clear the `underline` annotation from every legacy blog post's body in Notion.
 *
 * Usage:
 *   npx tsx scripts/legacy-blog/stripUnderline.ts --dry-run
 *   npx tsx scripts/legacy-blog/stripUnderline.ts
 *
 * Requires .env.local with NOTION_TOKEN and NOTION_BLOG_DATABASE_ID.
 *
 * Why (SCRUM-1160): Notion underline has no markdown equivalent, so notion-to-md
 * emits it as literal raw HTML (<u>1</u>). MarkdownBody runs react-markdown
 * without rehype-raw, so that HTML is escaped and printed as visible text: 191
 * leaks across 26 live posts. The source's only underline is Wix citation junk,
 * so it is stripped here rather than parsed downstream. convert.ts no longer
 * emits the annotation, so a re-import cannot reintroduce it.
 *
 * Guarantees this script owes the migration:
 *
 * - `Status` is never written. This only ever calls blocks.update, never
 *   pages.update, so no run can demote a reviewed post. Same discipline as
 *   import.ts.
 * - Idempotent. A run writes only blocks that still carry an underline, so a
 *   second run makes zero writes and reports zero changes.
 * - Text-preserving. Only `annotations.underline` is touched; content, links and
 *   every other annotation pass through untouched.
 * - Recursive. Nested children (list items with sub-lists) are walked too.
 */
import { Client } from "@notionhq/client";
import { loadEnv, requireEnv } from "./env";

/** Notion allows ~3 requests/second; stay under it on a 55-post walk. */
const REQUEST_DELAY_MS = 350;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** The rich-text-bearing fields on the block types the archive uses. */
const RICH_TEXT_FIELDS = ["rich_text", "caption"] as const;

interface Annotated {
  annotations?: { underline?: boolean };
}

type Block = { id: string; type: string; has_children?: boolean } & Record<string, unknown>;

async function resolveDataSourceId(notion: Client, databaseId: string): Promise<string> {
  const db = (await notion.databases.retrieve({ database_id: databaseId })) as unknown as {
    data_sources?: Array<{ id: string }>;
  };
  const id = db.data_sources?.[0]?.id;
  if (!id) throw new Error("No data source on the Blog Hub database");
  return id;
}

/** Every legacy row's slug mapped to its page id. Mirrors import.ts. */
async function fetchLegacyPages(notion: Client, dataSourceId: string): Promise<Array<{ slug: string; id: string }>> {
  const pages: Array<{ slug: string; id: string }> = [];
  let cursor: string | undefined;
  do {
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    })) as unknown as {
      results: Array<{
        id: string;
        properties: {
          Slug?: { rich_text?: Array<{ plain_text: string }> };
          Source?: { select?: { name?: string } | null };
        };
      }>;
      has_more: boolean;
      next_cursor: string | null;
    };
    for (const page of res.results) {
      if (page.properties.Source?.select?.name !== "legacy") continue;
      const slug = (page.properties.Slug?.rich_text ?? [])
        .map((r) => r.plain_text)
        .join("")
        .trim();
      if (slug) pages.push({ slug, id: page.id });
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages;
}

/**
 * Clear underline across a block's rich text.
 *
 * Returns the fields that changed and how many runs were cleared, so a block
 * with no underline is never written back.
 */
function stripBlock(block: Block): { payload: Record<string, unknown>; runs: number } {
  const body = block[block.type] as Record<string, unknown> | undefined;
  const payload: Record<string, unknown> = {};
  let runs = 0;
  if (!body) return { payload, runs };

  for (const field of RICH_TEXT_FIELDS) {
    const richText = body[field] as Annotated[] | undefined;
    if (!Array.isArray(richText)) continue;
    if (!richText.some((run) => run.annotations?.underline)) continue;

    payload[field] = richText.map((run) => {
      if (!run.annotations?.underline) return run;
      runs += 1;
      return { ...run, annotations: { ...run.annotations, underline: false } };
    });
  }
  return { payload, runs };
}

/** Walk a page's block tree, clearing underline as it goes. Returns runs cleared. */
async function stripPage(notion: Client, blockId: string, dryRun: boolean): Promise<number> {
  let cleared = 0;
  let cursor: string | undefined;
  const children: Block[] = [];

  do {
    const res = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 });
    children.push(...(res.results as unknown as Block[]));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  for (const block of children) {
    const { payload, runs } = stripBlock(block);
    if (runs > 0) {
      cleared += runs;
      if (!dryRun) {
        await notion.blocks.update({ block_id: block.id, [block.type]: payload } as never);
        await sleep(REQUEST_DELAY_MS);
      }
    }
    if (block.has_children) {
      cleared += await stripPage(notion, block.id, dryRun);
    }
  }
  return cleared;
}

async function main(): Promise<void> {
  loadEnv();
  const dryRun = process.argv.includes("--dry-run");

  const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });
  const dataSourceId = await resolveDataSourceId(notion, requireEnv("NOTION_BLOG_DATABASE_ID"));
  const pages = await fetchLegacyPages(notion, dataSourceId);

  console.log(`[strip-underline] ${pages.length} legacy post(s)${dryRun ? " (dry run)" : ""}`);

  let totalRuns = 0;
  let touchedPosts = 0;
  for (const page of pages) {
    const cleared = await stripPage(notion, page.id, dryRun);
    if (cleared > 0) {
      touchedPosts += 1;
      totalRuns += cleared;
      console.log(`[strip-underline] ${dryRun ? "would clear" : "cleared"} ${cleared} in ${page.slug}`);
    }
  }

  console.log(
    `[strip-underline] ${dryRun ? "would clear" : "cleared"} ${totalRuns} underlined run(s) ` +
      `across ${touchedPosts} post(s). Status untouched on all ${pages.length}.`,
  );
  if (!dryRun && totalRuns > 0) {
    console.log("[strip-underline] Notion is read at build only: pause, then redeploy, then verify.");
  }
}

if (process.argv[1]?.endsWith("stripUnderline.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
