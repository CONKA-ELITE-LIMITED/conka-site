/**
 * Pull the legacy Shopify blog archive to disk so convert/import can run
 * against a stable snapshot.
 *
 * Usage: npx tsx scripts/legacy-blog/fetch.ts
 * Output: scripts/legacy-blog/.data/articles.json (gitignored)
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
 *
 * Two traps, both already paid for once (see the plan doc):
 *
 * 1. Use `contentHtml`, NOT `content`. `content` returns plain text with all
 *    structure stripped; an earlier pass used it and wrongly concluded the
 *    bodies were clean HTML.
 * 2. The Admin API refuses this data without a read_content scope we do not
 *    hold. Storefront needs no new grant and carries everything we need.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv, requireEnv } from "./env";

export const DATA_DIR = path.join(process.cwd(), "scripts", "legacy-blog", ".data");
export const ARTICLES_PATH = path.join(DATA_DIR, "articles.json");

export interface LegacyArticle {
  title: string;
  handle: string;
  publishedAt: string;
  blog: { handle: string };
  contentHtml: string;
  image: { url: string; altText: string | null } | null;
  authorV2: { name: string } | null;
  tags: string[];
  seo: { title: string | null; description: string | null };
}

const ARTICLES_QUERY = `
  query Articles($cursor: String) {
    articles(first: 50, sortKey: PUBLISHED_AT, reverse: true, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          title
          handle
          publishedAt
          blog { handle }
          contentHtml
          image { url altText }
          authorV2 { name }
          tags
          seo { title description }
        }
      }
    }
  }
`;

async function query<T>(graphql: string, variables: Record<string, unknown>): Promise<T> {
  const storeDomain = requireEnv("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN");
  const res = await fetch(`https://${storeDomain}/api/2025-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": requireEnv("NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"),
    },
    body: JSON.stringify({ query: graphql, variables }),
  });
  if (!res.ok) throw new Error(`Storefront API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(`Storefront API: ${JSON.stringify(json.errors)}`);
  return json.data as T;
}

async function main(): Promise<void> {
  loadEnv();
  const articles: LegacyArticle[] = [];
  let cursor: string | null = null;

  do {
    const data: {
      articles: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        edges: { node: LegacyArticle }[];
      };
    } = await query(ARTICLES_QUERY, { cursor });

    articles.push(...data.articles.edges.map((e) => e.node));
    cursor = data.articles.pageInfo.hasNextPage ? data.articles.pageInfo.endCursor : null;
    console.log(`[fetch] ${articles.length} articles so far`);
  } while (cursor);

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ARTICLES_PATH, JSON.stringify(articles, null, 2));

  const byBlog = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.blog.handle] = (acc[a.blog.handle] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`[fetch] wrote ${articles.length} articles to ${ARTICLES_PATH}`);
  console.log(`[fetch] by blog:`, byBlog);
}

// Only pull when run directly: convert.ts and import.ts import the paths and
// types from this module and must not trigger a re-fetch.
if (process.argv[1]?.endsWith("fetch.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
