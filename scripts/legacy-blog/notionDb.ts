/**
 * Shared Notion access for the legacy-blog scripts.
 *
 * `import.ts`, `stripUnderline.ts` and `backfillTopics.ts` all need the same
 * three things: the Blog Hub's data source id, a paged read of every row, and a
 * request delay that keeps a 53-post run under Notion's rate limit. This is
 * those three, extracted at the third copy.
 *
 * Rows are returned raw so each caller derives its own index (slug to page id,
 * slug to topics) rather than this file guessing which shape everyone wants.
 */
import type { Client } from "@notionhq/client";

/** Notion allows ~3 requests/second; stay under it on a 53-post run. */
export const REQUEST_DELAY_MS = 350;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * A Blog Hub row, narrowed to the properties these scripts read. The Notion
 * property union is far wider than we use, so this is a deliberate subset.
 */
export interface BlogRow {
  id: string;
  properties: {
    Slug?: { rich_text?: Array<{ plain_text: string }> };
    Source?: { select?: { name?: string } | null };
    Topic?: { multi_select?: Array<{ name: string }> };
  };
}

/** The Blog Hub database holds a single data source; resolve it once per run. */
export async function resolveDataSourceId(notion: Client, databaseId: string): Promise<string> {
  const db = (await notion.databases.retrieve({ database_id: databaseId })) as unknown as {
    data_sources?: Array<{ id: string }>;
  };
  const id = db.data_sources?.[0]?.id;
  if (!id) throw new Error("No data source on the Blog Hub database");
  return id;
}

/** Every row in the Blog Hub, paged out in full. */
export async function fetchAllRows(notion: Client, dataSourceId: string): Promise<BlogRow[]> {
  const rows: BlogRow[] = [];
  let cursor: string | undefined;
  do {
    const res = (await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
      page_size: 100,
    })) as unknown as { results: BlogRow[]; has_more: boolean; next_cursor: string | null };
    rows.push(...res.results);
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return rows;
}

/** A row's slug, or "" when the row has none (a blank row, or a template). */
export function readSlug(row: BlogRow): string {
  return (row.properties.Slug?.rich_text ?? [])
    .map((r) => r.plain_text)
    .join("")
    .trim();
}

/** Every row's slug mapped to its page id, so writes stay idempotent. */
export function slugIndex(rows: BlogRow[]): Map<string, string> {
  const index = new Map<string, string>();
  for (const row of rows) {
    const slug = readSlug(row);
    if (slug) index.set(slug, row.id);
  }
  return index;
}
