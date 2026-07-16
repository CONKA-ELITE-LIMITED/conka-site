/**
 * Low-level Notion access for the blog. Server-only, read-only.
 *
 * The site reads the Notion "Blog Hub" database at build time (static
 * generation) and never from the browser. All exports here assume a server
 * context. Domain mapping lives in `blog.ts`; pure transforms in
 * `blogTransform.ts`.
 */
import "server-only";
import { cache } from "react";
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
export const queryBlogRows = cache(async function queryBlogRows(
  publishedOnly: boolean,
): Promise<NotionRow[]> {
  const filter = publishedOnly
    ? { property: "Status", select: { equals: "Published" } }
    : undefined;

  const rows: NotionRow[] = [];
  try {
    const notion = getNotionClient();
    const ds = await getBlogDataSourceId();
    if (!notion || !ds) return [];

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
  } catch (err) {
    // Fail the build rather than ship a silently empty blog.
    //
    // This used to swallow the error and return [], so that a Notion outage
    // could not take the whole site down with it. That was right when the blog
    // was three drafts and wrong now: [] is indistinguishable from "there are
    // genuinely no posts", so a rate-limit or blip during a Vercel build
    // generated zero post routes, rendered an empty /blog, exited 0, and
    // deployed. Every legacy URL then 308s into a 404 (SCRUM-1157) until a
    // human happens to notice. A deploy that refuses to ship beats a deploy
    // that quietly breaks the archive.
    throw new Error(
      `[blog] Notion query failed, refusing to build a blog with no posts: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }

  return rows;
});

/** Convert a Notion page body to a single markdown string. */
export const pageToMarkdown = cache(async function pageToMarkdown(
  pageId: string,
): Promise<string> {
  const notion = getNotionClient();
  if (!notion) return "";
  try {
    const n2m = new NotionToMarkdown({ notionClient: notion });
    const blocks = await n2m.pageToMarkdown(pageId);
    const md = n2m.toMarkdownString(blocks);
    return md.parent ?? "";
  } catch (err) {
    // Same reasoning as queryBlogRows: fail the build, do not ship the damage.
    // This fetches a post's blocks, a separate call from the row query, so it
    // can fail on its own. Returning "" published the post with its title,
    // hero, metadata and CTA but no article text: live, indexable, and green.
    // An empty page reads as deliberate, so it is worse than a 404.
    throw new Error(
      `[blog] failed to convert page ${pageId} to markdown, refusing to ship an empty post: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
});
