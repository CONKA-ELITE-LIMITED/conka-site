/**
 * Write `Topic` onto the 53 legacy Blog Hub rows (SCRUM-1161).
 *
 * Usage:
 *   npx tsx scripts/legacy-blog/backfillTopics.ts --dry-run
 *   npx tsx scripts/legacy-blog/backfillTopics.ts
 *
 * Requires .env.local with NOTION_TOKEN and NOTION_BLOG_DATABASE_ID.
 *
 * Every legacy row imported untagged, because `import.ts` never wrote the field.
 * The tags come from `topics.ts`, which is the plan doc's own triage table. The
 * payoff is `getRelatedPosts`: without topics it shows every reader the same
 * three newest posts.
 *
 * Guarantees this script owes the migration:
 *
 * - `Status` is never written. Only `Topic` is sent, so no run can demote a
 *   reviewed post. Same discipline as `import.ts` and `stripUnderline.ts`.
 * - Idempotent. A row whose tags already match is skipped, so a second run
 *   makes zero writes.
 * - Scoped to `Source = legacy`. The engine rows own their own tags, and
 *   `Productivity` is theirs: it is not renamed to `Focus`.
 * - Refuses to write a tag the schema does not have, rather than letting Notion
 *   silently create an option and invent an eleventh hub.
 */
import { Client } from "@notionhq/client";
import { loadEnv, requireEnv } from "./env";
import {
  fetchAllRows,
  readSlug,
  REQUEST_DELAY_MS,
  resolveDataSourceId,
  sleep,
  type BlogRow,
} from "./notionDb";
import { NEW_TOPIC_OPTION, topicsForHandle } from "./topics";

/** The `Topic` options that exist in Notion, so a typo fails loudly here. */
async function fetchTopicOptions(notion: Client, dataSourceId: string): Promise<Set<string>> {
  const ds = (await notion.dataSources.retrieve({ data_source_id: dataSourceId })) as unknown as {
    properties: { Topic?: { multi_select?: { options?: Array<{ name: string }> } } };
  };
  const options = ds.properties.Topic?.multi_select?.options;
  if (!options) throw new Error("[backfill] the Blog Hub has no Topic multi-select");
  return new Set(options.map((o) => o.name));
}

function currentTopics(row: BlogRow): string[] {
  return (row.properties.Topic?.multi_select ?? []).map((t) => t.name);
}

/** Tag sets are compared unordered: Notion returns options in schema order, not ours. */
function sameTopics(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((t) => set.has(t));
}

async function main(): Promise<void> {
  loadEnv();
  const dryRun = process.argv.includes("--dry-run");

  const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });
  const dataSourceId = await resolveDataSourceId(notion, requireEnv("NOTION_BLOG_DATABASE_ID"));

  const options = await fetchTopicOptions(notion, dataSourceId);
  if (!options.has(NEW_TOPIC_OPTION)) {
    throw new Error(
      `[backfill] the Topic schema has no "${NEW_TOPIC_OPTION}" option. ` +
        `Add it before running: writing it here would have Notion create it implicitly.`,
    );
  }

  const rows = await fetchAllRows(notion, dataSourceId);
  const legacy = rows.filter((r) => r.properties.Source?.select?.name === "legacy");

  console.log(`[backfill] ${legacy.length} legacy row(s)${dryRun ? " (dry run)" : ""}`);

  let written = 0;
  let skipped = 0;
  const untagged: string[] = [];

  for (const row of legacy) {
    const slug = readSlug(row);
    const topics = topicsForHandle(slug);

    if (topics.length === 0) {
      // A legacy row the triage table does not cover. Left alone rather than
      // guessed at: the table is the source, so this is a table bug to fix.
      untagged.push(slug);
      continue;
    }
    const unknown = topics.filter((t) => !options.has(t));
    if (unknown.length > 0) {
      throw new Error(`[backfill] ${slug}: Topic option(s) missing from the schema: ${unknown.join(", ")}`);
    }

    if (sameTopics(currentTopics(row), topics)) {
      skipped += 1;
      continue;
    }

    if (!dryRun) {
      // Topic only. Status is deliberately absent: never demote a reviewed post.
      await notion.pages.update({
        page_id: row.id,
        properties: { Topic: { multi_select: topics.map((name) => ({ name })) } },
      } as never);
      await sleep(REQUEST_DELAY_MS);
    }
    written += 1;
    console.log(`[backfill] ${dryRun ? "would tag" : "tagged"} ${slug}: ${topics.join(" + ")}`);
  }

  console.log(
    `[backfill] ${dryRun ? "would write" : "wrote"} ${written}, already correct ${skipped}, ` +
      `of ${legacy.length} legacy row(s). Status untouched.`,
  );
  if (untagged.length > 0) {
    console.warn(
      `[backfill] ${untagged.length} legacy row(s) are not in the triage table and stay untagged: ` +
        untagged.join(", "),
    );
  }
  if (!dryRun && written > 0) {
    console.log("[backfill] Notion is read at build only: pause, then redeploy (clear the build cache), then verify.");
  }
}

if (process.argv[1]?.endsWith("backfillTopics.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
