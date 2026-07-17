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

/**
 * A token unique to each Vercel deployment, or a fixed local fallback.
 * `VERCEL_DEPLOYMENT_ID` is set per deploy and stable across a build's workers.
 */
const DEPLOY_ID =
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.VERCEL_GIT_COMMIT_SHA ??
  "local";

/**
 * The Notion SDK's `fetch`, made safe to cache across deploys.
 *
 * The SDK calls `fetch`; Next patches it; a statically generated route caches
 * the result with `revalidate: 31536000` (one year). Vercel restores
 * `.next/cache` between deploys, so a Notion body edit could stay invisible on a
 * green redeploy for up to a year, fixable only by a human unticking "Use
 * existing Build Cache" (SCRUM-1163, defect 2).
 *
 * `no-store` would fix it but forces dynamic rendering, which the fully static
 * blog cannot use. Instead we keep the build-time cache (so every route still
 * prerenders) but fold the deploy id into the request, so a new deploy computes
 * a different cache key and cannot hit the previous deploy's restored entries.
 * Within one build the id is constant, so reads are still deduped and shared.
 *
 * The same client instance backs NotionToMarkdown in `pageToMarkdown`, so the
 * block-body reads (68 of the 70 cached entries) are covered too. Notion ignores
 * the extra header.
 */
function notionBuildFetch(
  url: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set("x-conka-deploy", DEPLOY_ID);
  return fetch(url, { ...init, headers });
}

/** The shared Notion client, or null when the blog is not configured. */
export function getNotionClient(): Client | null {
  if (!env.isBlogConfigured) return null;
  if (!client) {
    client = new Client({
      auth: env.notionToken,
      fetch: notionBuildFetch,
    });
  }
  return client;
}

/**
 * The Notion client, or a build failure naming exactly what is missing.
 *
 * A missing or misspelt env var is the likeliest way this blog breaks, and it
 * used to be the quietest: `getNotionClient` returns null when unconfigured,
 * callers turned that into an empty result, and the build shipped a blog with
 * no posts and a clean exit code. Since SCRUM-1157 that also points all 82
 * legacy redirects at 404s.
 *
 * The cost is deliberate: you cannot build this site without Notion
 * credentials any more. That is the correct trade now that 53 posts depend on
 * them, and the message says what to set rather than leaving you to guess.
 */
function requireNotionClient(): Client {
  const notion = getNotionClient();
  if (!notion) {
    throw new Error(
      "[blog] NOTION_TOKEN and NOTION_BLOG_DATABASE_ID must both be set. " +
        "Refusing to build: without them the blog renders empty and every " +
        "/blogs/news/* redirect lands on a 404.",
    );
  }
  return notion;
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

  // Outside the try: a config mistake is not a query failure and must not be
  // reported as one.
  const notion = requireNotionClient();

  const rows: NotionRow[] = [];
  try {
    const ds = await getBlogDataSourceId();
    if (!ds) throw new Error("no data source on the Blog Hub database");

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
  const notion = requireNotionClient();
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
