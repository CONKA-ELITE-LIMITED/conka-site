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
import {
  link,
  mkdir,
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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

/** True while `next build` is collecting page data and prerendering. */
const IS_BUILD = process.env.NEXT_PHASE === "phase-production-build";

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
 *
 * Prefer `queryBlogRows`, which serves a build from one snapshot of this.
 */
async function fetchBlogRows(publishedOnly: boolean): Promise<NotionRow[]> {
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

  if (IS_BUILD) {
    // One line per real query, so `grep -c` on a build log counts them.
    console.log(
      `[blog] queried Notion for the ${
        publishedOnly ? "published" : "full"
      } row set: ${rows.length} rows (pid ${process.pid})`,
    );
  }

  return rows;
}

/**
 * Where a build parks its one read of the Blog Hub.
 *
 * The temp dir, not `.next/cache`: Vercel restores the build cache between
 * deploys, and a snapshot that outlived its build would freeze the blog. A
 * fresh build container has a fresh temp dir, so the file cannot survive a
 * deploy no matter what it is named.
 *
 * `ppid` is the nonce. Every static-generation worker is forked from the same
 * `next build` process, so they agree on it, and it changes on the next build.
 * That keeps a local rebuild honest: `npm run build` twice in a row still reads
 * Notion twice and still picks up a post published in between.
 */
function snapshotPath(publishedOnly: boolean): string {
  const build = `${DEPLOY_ID}-${process.ppid}`.replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(
    os.tmpdir(),
    "conka-blog",
    `rows-${publishedOnly ? "published" : "all"}-${build}.json`,
  );
}

/**
 * How old a snapshot may be before it is treated as belonging to a dead build.
 *
 * The nonce is a pid, and pids are recycled. Two builds days apart on the same
 * machine can draw the same number, and a temp dir keeps files for days, so
 * without an age check a local build could silently adopt a previous build's
 * blog. Silent staleness is the exact failure `notionBuildFetch` above exists to
 * prevent, so it is worth one `stat`. No build runs for an hour.
 */
const SNAPSHOT_MAX_AGE_MS = 60 * 60 * 1000;

/** The file's modification time, or null if it is not there. */
async function modifiedAt(file: string): Promise<number | null> {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return null;
  }
}

/** The snapshot, or null if it is absent, stale, unreadable or half-written. */
async function readSnapshot(file: string): Promise<NotionRow[] | null> {
  const mtime = await modifiedAt(file);
  if (mtime === null || Date.now() - mtime > SNAPSHOT_MAX_AGE_MS) return null;
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    return Array.isArray(parsed) ? (parsed as NotionRow[]) : null;
  } catch {
    return null;
  }
}

/**
 * Publish `rows` as this build's snapshot, or adopt whichever read got there
 * first.
 *
 * Write-then-`link` rather than `writeFile`: `link` is atomic and fails if the
 * destination exists, so a reader never sees a half-written file and exactly one
 * read can win. A loser returns the winner's rows rather than its own, which is
 * the point. Two workers can both miss the snapshot and both query Notion before
 * either has written, and even then every worker ends the build holding the same
 * row set.
 */
async function publishSnapshot(
  file: string,
  rows: NotionRow[],
): Promise<NotionRow[]> {
  const temp = `${file}.${process.pid}.tmp`;
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(temp, JSON.stringify(rows));
    try {
      await link(temp, file);
    } catch {
      const winner = await readSnapshot(file);
      if (winner) return winner;
      // There is a file but `readSnapshot` rejected it, so it is stale or
      // corrupt and belongs to no live build. Replace it rather than adopt it.
      // `rename` is atomic, so a concurrent reader sees the old file or the new
      // one, never a mixture.
      await rename(temp, file);
    }
    return rows;
  } catch {
    return (await readSnapshot(file)) ?? rows;
  } finally {
    // A successful `rename` already consumed the temp file, hence the catch.
    await unlink(temp).catch(() => {});
  }
}

const LOCK_POLL_MS = 50;
const LOCK_TIMEOUT_MS = 30_000;

async function acquireLock(lock: string): Promise<boolean> {
  try {
    await mkdir(path.dirname(lock), { recursive: true });
    await writeFile(lock, String(process.pid), { flag: "wx" });
    return true;
  } catch {
    return false;
  }
}

/** The snapshot once the lock holder publishes it, or null to read it yourself. */
async function awaitSnapshot(
  file: string,
  lock: string,
): Promise<NotionRow[] | null> {
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, LOCK_POLL_MS));
    const rows = await readSnapshot(file);
    if (rows) return rows;
    if ((await modifiedAt(lock)) === null) {
      // The holder released. It publishes before releasing, so the snapshot it
      // wrote can have landed between the two reads above: look once more
      // rather than spend a Notion query on a file that is already there.
      return readSnapshot(file);
    }
  }
  return null;
}

/** Per-process memo, so a worker touches the disk once rather than once a post. */
const buildSnapshots = new Map<string, Promise<NotionRow[]>>();

/**
 * Elect one worker to do the reading.
 *
 * `publishSnapshot` already makes the build consistent without a lock: whoever
 * loses the race adopts the winner's rows. But every worker starts at the same
 * instant and every one of them misses the snapshot, so without a lock the build
 * opens with a burst of identical queries, all but one of them thrown away. That
 * burst is exactly the load that put Notion rate limiting on the suspect list.
 *
 * The lock is advisory and bounded: a waiter gives up as soon as the holder
 * releases without publishing, or after the timeout, and reads Notion itself. A
 * wedged holder therefore costs a slow build, never a hung one, and cannot
 * outlive its build, since the name carries the build's `ppid`.
 */
async function loadBuildSnapshot(publishedOnly: boolean): Promise<NotionRow[]> {
  const file = snapshotPath(publishedOnly);
  const lock = `${file}.lock`;

  const existing = await readSnapshot(file);
  if (existing) return existing;

  const owned = await acquireLock(lock);
  if (!owned) {
    const shared = await awaitSnapshot(file, lock);
    if (shared) return shared;
  }

  try {
    return await publishSnapshot(file, await fetchBlogRows(publishedOnly));
  } finally {
    // Only the holder releases: a waiter that timed out must not hand the lock
    // to a fourth worker while the holder is still using it.
    if (owned) await unlink(lock).catch(() => {});
  }
}

/** Per-request dedupe for dev and any runtime read. */
const queryBlogRowsLive = cache(fetchBlogRows);

/**
 * The Blog Hub rows, read once per build (SCRUM-1179).
 *
 * `react.cache` memoises per render scope, not per build, so this used to run
 * once for `generateStaticParams` and again for every post, sitemap and listing
 * render, fanned across 11 worker processes: roughly 60 independent reads of a
 * set that has to be identical in all of them. It only had to disagree once for
 * a live post to prerender as a 404, and the failure moved to a different post
 * each build because it was a race, not a content defect.
 *
 * A build now resolves the set once and shares it, so there is nothing left to
 * disagree. Outside a build this is the old per-request behaviour, so a dev
 * server still sees a Notion edit on refresh.
 */
export function queryBlogRows(publishedOnly: boolean): Promise<NotionRow[]> {
  if (!IS_BUILD) return queryBlogRowsLive(publishedOnly);

  const key = String(publishedOnly);
  let pending = buildSnapshots.get(key);
  if (!pending) {
    pending = loadBuildSnapshot(publishedOnly);
    buildSnapshots.set(key, pending);
  }
  return pending;
}

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
