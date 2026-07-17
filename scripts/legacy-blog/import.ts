/**
 * Write converted legacy posts into the Notion "Blog Hub" as Drafts.
 *
 * Usage:
 *   npx tsx scripts/legacy-blog/import.ts --pilot
 *   npx tsx scripts/legacy-blog/import.ts --handle=<shopify-handle>
 *   npx tsx scripts/legacy-blog/import.ts --all
 *   ...add --dry-run to convert and report without writing to Notion.
 *
 * Requires .env.local with NOTION_TOKEN and NOTION_BLOG_DATABASE_ID.
 *
 * Guarantees this script owes the migration:
 *
 * - `Slug` is the Shopify handle, verbatim. One wildcard 301 then recovers the
 *   whole archive (SCRUM-1157). Re-slugging silently forfeits each post's
 *   ranking, so nothing here derives, cleans or regenerates a slug.
 * - `Status` is only ever written as `Draft`, and only when creating a row.
 *   Re-running never drags a reviewed post back to Draft: the publish flip is
 *   human, permanently.
 * - Idempotent. Rows are matched on slug and updated in place, because a
 *   duplicate slug throws and fails the site build (app/lib/blog.ts).
 * - Block appends are chunked: the Notion API rejects more than 100 per call.
 */
import { Client } from "@notionhq/client";
import { convertHtmlToBlocks, loadArticles, type NotionBlock } from "./convert";
import { loadEnv, requireEnv } from "./env";
import { META_DESCRIPTIONS } from "./metaDescriptions";
import { fetchAllRows, REQUEST_DELAY_MS, resolveDataSourceId, sleep, slugIndex } from "./notionDb";
import { topicsForHandle } from "./topics";
import { IMPORT_HANDLES, PILOT_HANDLE } from "./triage";
import type { LegacyArticle } from "./fetch";

/** Hard Notion API cap: a single children.append takes at most 100 blocks. */
const BLOCK_APPEND_LIMIT = 100;

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function buildProperties(article: LegacyArticle, description: string): Record<string, unknown> {
  const props: Record<string, unknown> = {
    "Blog name": { title: [{ type: "text", text: { content: article.title } }] },
    // Verbatim. See the header note.
    Slug: { rich_text: [{ type: "text", text: { content: article.handle } }] },
    "Meta description": { rich_text: [{ type: "text", text: { content: description } }] },
    "Date published": { date: { start: article.publishedAt.slice(0, 10) } },
    Source: { select: { name: "legacy" } },
  };

  // Without this a re-import lands untagged, which is how all 53 arrived that
  // way in the first place (SCRUM-1161). The map is the plan doc's triage table.
  const topics = topicsForHandle(article.handle);
  if (topics.length > 0) {
    props.Topic = { multi_select: topics.map((name) => ({ name })) };
  }

  if (article.image?.url) {
    props["Hero image"] = {
      files: [
        {
          name: `${article.handle}-hero`,
          type: "external",
          external: { url: article.image.url },
        },
      ],
    };
    props["Hero image alt"] = {
      rich_text: [{ type: "text", text: { content: article.image.altText || article.title } }],
    };
  }
  return props;
}

/**
 * Remove a page's existing body so a re-run replaces rather than duplicates it.
 *
 * Not atomic with the re-append that follows: a crash in between leaves the row
 * with an empty body. Recovery is simply re-running the importer for that
 * handle, and the row is a Draft either way, so nothing broken reaches the site.
 */
async function clearPageBody(notion: Client, pageId: string): Promise<void> {
  let cursor: string | undefined;
  const ids: string[] = [];
  do {
    const res = await notion.blocks.children.list({ block_id: pageId, start_cursor: cursor, page_size: 100 });
    ids.push(...res.results.map((b) => b.id));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  for (const id of ids) {
    await notion.blocks.delete({ block_id: id });
    await sleep(REQUEST_DELAY_MS);
  }
}

export async function appendBlocks(notion: Client, pageId: string, blocks: NotionBlock[]): Promise<number> {
  const batches = chunk(blocks, BLOCK_APPEND_LIMIT);
  for (const batch of batches) {
    await notion.blocks.children.append({ block_id: pageId, children: batch as never });
    await sleep(REQUEST_DELAY_MS);
  }
  return batches.length;
}

async function importArticle(
  notion: Client,
  dataSourceId: string,
  slugToPageId: Map<string, string>,
  article: LegacyArticle,
  dryRun: boolean,
): Promise<void> {
  const description = META_DESCRIPTIONS[article.handle];
  if (!description) {
    // Importing without one creates a row that can never render.
    console.warn(`[import] SKIP ${article.handle}: no meta description authored in metaDescriptions.ts`);
    return;
  }

  const blocks = convertHtmlToBlocks(article.contentHtml);
  const existingId = slugToPageId.get(article.handle);

  if (dryRun) {
    const topics = topicsForHandle(article.handle);
    console.log(
      `[dry-run] ${existingId ? "update" : "create"} ${article.handle}: ` +
        `${blocks.length} blocks in ${Math.ceil(blocks.length / BLOCK_APPEND_LIMIT)} append(s), ` +
        `Topic: ${topics.length > 0 ? topics.join(" + ") : "(none: not in the triage table)"}`,
    );
    return;
  }

  let pageId: string;
  if (existingId) {
    pageId = existingId;
    // Status is deliberately absent: never demote a reviewed post on a re-run.
    await notion.pages.update({ page_id: pageId, properties: buildProperties(article, description) as never });
    await sleep(REQUEST_DELAY_MS);
    await clearPageBody(notion, pageId);
  } else {
    const created = await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: dataSourceId } as never,
      properties: {
        ...buildProperties(article, description),
        Status: { select: { name: "Draft" } },
      } as never,
    });
    pageId = created.id;
    slugToPageId.set(article.handle, pageId);
    await sleep(REQUEST_DELAY_MS);
  }

  const batches = await appendBlocks(notion, pageId, blocks);
  console.log(
    `[import] ${existingId ? "updated" : "created"} ${article.handle} ` +
      `(${blocks.length} blocks, ${batches} append call${batches === 1 ? "" : "s"})`,
  );
}

function selectHandles(): string[] {
  const args = process.argv.slice(2);
  if (args.includes("--pilot")) return [PILOT_HANDLE];
  if (args.includes("--all")) return [...IMPORT_HANDLES];

  const handleArg = args.find((a) => a.startsWith("--handle="));
  if (handleArg) {
    const handle = handleArg.split("=")[1];
    if (!IMPORT_HANDLES.includes(handle)) {
      throw new Error(`"${handle}" is not in the 53 approved for import (see triage.ts)`);
    }
    return [handle];
  }
  throw new Error("Usage: import.ts (--pilot | --all | --handle=<handle>) [--dry-run]");
}

async function main(): Promise<void> {
  loadEnv();
  const dryRun = process.argv.includes("--dry-run");
  const handles = selectHandles();

  const articles = new Map(
    loadArticles()
      .filter((a) => a.blog.handle === "news")
      .map((a) => [a.handle, a]),
  );

  const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });
  const dataSourceId = await resolveDataSourceId(notion, requireEnv("NOTION_BLOG_DATABASE_ID"));
  const index = dryRun
    ? new Map<string, string>()
    : slugIndex(await fetchAllRows(notion, dataSourceId));

  console.log(`[import] ${handles.length} post(s)${dryRun ? " (dry run)" : ""}`);
  for (const handle of handles) {
    const article = articles.get(handle);
    if (!article) {
      console.warn(`[import] SKIP ${handle}: not in the snapshot, re-run fetch.ts`);
      continue;
    }
    await importArticle(notion, dataSourceId, index, article, dryRun);
  }
}

if (process.argv[1]?.endsWith("import.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
