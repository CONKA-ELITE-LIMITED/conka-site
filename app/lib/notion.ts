/**
 * Low-level Notion access for the blog. Server-only, read-only.
 *
 * The site reads the Notion "Blog Hub" database at build time (static
 * generation) and never from the browser. All exports here assume a server
 * context. Domain mapping lives in `blog.ts`; pure transforms in
 * `blogTransform.ts`.
 */
import "server-only";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { env } from "./env";

let client: Client | null = null;

/** The shared Notion client, or null when the blog is not configured. */
export function getNotionClient(): Client | null {
  if (!env.isBlogConfigured) return null;
  if (!client) client = new Client({ auth: env.notionToken });
  return client;
}

let dataSourceId: string | null = null;

/**
 * The Blog Hub data source id. SDK v5 queries data sources, not databases, so
 * we resolve the first data source from the configured database id and cache
 * it for the process.
 */
export async function getBlogDataSourceId(): Promise<string | null> {
  const notion = getNotionClient();
  if (!notion || !env.notionBlogDatabaseId) return null;
  if (dataSourceId) return dataSourceId;
  const db = (await notion.databases.retrieve({
    database_id: env.notionBlogDatabaseId,
  })) as unknown as { data_sources?: Array<{ id: string }> };
  dataSourceId = db.data_sources?.[0]?.id ?? null;
  return dataSourceId;
}

export interface NotionRow {
  id: string;
  lastEditedTime: string;
  properties: Record<string, unknown>;
}

/**
 * All rows in the Blog Hub, paginated. When `publishedOnly` is true (production
 * and build), only `Status = Published` rows are returned; the dev preview mode
 * passes false to include drafts locally.
 */
export async function queryBlogRows(publishedOnly: boolean): Promise<NotionRow[]> {
  const notion = getNotionClient();
  const ds = await getBlogDataSourceId();
  if (!notion || !ds) return [];

  const filter = publishedOnly
    ? { property: "Status", select: { equals: "Published" } }
    : undefined;

  const rows: NotionRow[] = [];
  let cursor: string | undefined;
  do {
    // dataSources.query is the SDK v5 entry point (databases.query is removed).
    const res = (await notion.dataSources.query({
      data_source_id: ds,
      filter,
      start_cursor: cursor,
      page_size: 100,
    })) as unknown as {
      results: Array<{
        id: string;
        last_edited_time: string;
        properties: Record<string, unknown>;
      }>;
      has_more: boolean;
      next_cursor: string | null;
    };
    for (const page of res.results) {
      rows.push({
        id: page.id,
        lastEditedTime: page.last_edited_time,
        properties: page.properties,
      });
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return rows;
}

/** Convert a Notion page body to a single markdown string. */
export async function pageToMarkdown(pageId: string): Promise<string> {
  const notion = getNotionClient();
  if (!notion) return "";
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const blocks = await n2m.pageToMarkdown(pageId);
  const md = n2m.toMarkdownString(blocks);
  return md.parent ?? "";
}
