/**
 * Blog domain layer: turns Notion "Blog Hub" rows into typed posts with a
 * render-ready body, and re-hosts Notion's expiring images locally at build.
 *
 * Server-only, read at build time (static generation). This is the single
 * source of truth for the published filter, so the listing, the sitemap, and
 * generateStaticParams cannot disagree.
 *
 * See docs/development/featurePlans/blog-informational-content-surface.md.
 */
import "server-only";
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import {
  queryBlogRows,
  pageToMarkdown,
  type NotionRow,
} from "./notion";
import {
  cleanBody,
  extractFaq,
  normaliseRelatedProducts,
  readDate,
  readFirstFileUrl,
  readingTime,
  readMultiSelect,
  readRichText,
  readTitle,
  type BlogPost,
  type BlogPostSummary,
} from "./blogTransform";

export type {
  BlogPost,
  BlogPostSummary,
  BlogFaqItem,
  RelatedProduct,
} from "./blogTransform";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function isPreview(includeUnpublished: boolean): boolean {
  // Drafts are only ever visible locally; a production build is Published-only.
  return includeUnpublished && process.env.NODE_ENV !== "production";
}

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function extFromUrl(url: string, contentType?: string | null): string {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("avif")) return "avif";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  const m = url.split("?")[0].match(/\.(png|jpe?g|webp|avif|gif)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

/**
 * Download a remote image to public/blog/<slug>/ and return its stable public
 * path. Notion URLs expire after ~1 hour and third-party CDNs can drop an asset
 * at any time, so we cannot serve either directly. Skips the download if the
 * file already exists (idempotent within a
 * build). Returns null on failure so the caller can fall back.
 */
async function rehostImage(
  url: string,
  slug: string,
  basename: string,
): Promise<string | null> {
  try {
    const dir = path.join(PUBLIC_DIR, "blog", slug);
    // Probe existing files with the common extensions before downloading.
    for (const ext of ["webp", "png", "jpg", "avif"]) {
      const candidate = path.join(dir, `${basename}.${ext}`);
      if (await fileExists(candidate)) return `/blog/${slug}/${basename}.${ext}`;
    }
    const res = await fetch(url);
    if (!res.ok) return null;
    const ext = extFromUrl(url, res.headers.get("content-type"));
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, `${basename}.${ext}`), buf);
    return `/blog/${slug}/${basename}.${ext}`;
  } catch (err) {
    console.warn(`[blog] failed to re-host image for ${slug}:`, err);
    return null;
  }
}

/**
 * Hosts we mirror locally at build. Notion's own URLs expire after ~1 hour;
 * the Shopify and Wix hosts carry images on legacy posts imported from the old
 * Shopify blog, which we own no part of and must not hot-link to forever.
 */
const REHOSTABLE_IMAGE_HOSTS =
  /amazonaws\.com|notion\.so|notion-static|cdn\.shopify\.com|static\.wixstatic\.com/i;

/** Download every in-body remote image and rewrite the markdown to local paths. */
async function rehostBodyImages(md: string, slug: string): Promise<string> {
  const imageRe = /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g;
  const matches = [...md.matchAll(imageRe)];
  let out = md;
  let i = 0;
  for (const match of matches) {
    const [full, alt, url] = match;
    if (!REHOSTABLE_IMAGE_HOSTS.test(url)) continue;
    const local = await rehostImage(url, slug, `img-${++i}`);
    if (local) out = out.replace(full, `![${alt}](${local})`);
  }
  return out;
}

/** Map a Notion row to listing-level metadata, or null if it fails validation. */
async function toSummary(row: NotionRow): Promise<BlogPostSummary | null> {
  const props = row.properties;
  const title = readTitle(props, "Blog name");
  const slug = readRichText(props, "Slug");
  const description = readRichText(props, "Meta description");

  if (!title || !slug || !description) {
    console.warn(
      `[blog] skipping row ${row.id}: missing ${[
        !title && "title",
        !slug && "slug",
        !description && "description",
      ]
        .filter(Boolean)
        .join(", ")}`,
    );
    return null;
  }

  // Null when the post has no hero (or the download fails): the UI renders a
  // branded placeholder and metadata inherits the sitewide OG image.
  const heroUrl = readFirstFileUrl(props, "Hero image");
  const heroImage = heroUrl ? await rehostImage(heroUrl, slug, "hero") : null;

  return {
    slug,
    title,
    description,
    heroImage,
    heroImageAlt: readRichText(props, "Hero image alt") || title,
    datePublished: readDate(props, "Date published"),
    dateModified: row.lastEditedTime,
    topics: readMultiSelect(props, "Topic"),
  };
}

/**
 * All posts as listing summaries, newest first. Published-only unless a dev
 * preview is requested. Throws on a duplicate slug so a collision fails the
 * build rather than shipping an ambiguous route.
 */
export async function getAllPosts(
  opts: { includeUnpublished?: boolean } = {},
): Promise<BlogPostSummary[]> {
  const rows = await queryBlogRows(!isPreview(Boolean(opts.includeUnpublished)));
  const summaries: BlogPostSummary[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    const summary = await toSummary(row);
    if (!summary) continue;
    if (seen.has(summary.slug)) {
      throw new Error(
        `[blog] duplicate slug "${summary.slug}" in the Blog Hub. Slugs must be unique.`,
      );
    }
    seen.add(summary.slug);
    summaries.push(summary);
  }

  return summaries.sort((a, b) =>
    (b.datePublished ?? b.dateModified).localeCompare(
      a.datePublished ?? a.dateModified,
    ),
  );
}

/**
 * The posts to show at the end of an article: most shared topics first, newest
 * breaking ties, never the post itself.
 *
 * Posts sharing no topic still fill the grid rather than leaving it short, so a
 * thin topic degrades to "newest" instead of rendering one card. Military, at 2
 * posts, can never fill 3 from siblings alone and always takes that path.
 */
export async function getRelatedPosts(
  slug: string,
  opts: { includeUnpublished?: boolean; limit?: number } = {},
): Promise<BlogPostSummary[]> {
  const limit = opts.limit ?? 3;
  const all = await getAllPosts(opts);
  // getAllPosts is newest-first, so position is the recency tiebreak.
  const others = all
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => post.slug !== slug);

  const topics = new Set(all.find((p) => p.slug === slug)?.topics ?? []);
  if (topics.size === 0) return others.slice(0, limit).map(({ post }) => post);

  return others
    .map((entry) => ({
      ...entry,
      shared: entry.post.topics.filter((t) => topics.has(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared || a.index - b.index)
    .slice(0, limit)
    .map(({ post }) => post);
}

/** A single post with its render-ready body and parsed FAQ, or null. */
export async function getPostBySlug(
  slug: string,
  opts: { includeUnpublished?: boolean } = {},
): Promise<BlogPost | null> {
  const rows = await queryBlogRows(!isPreview(Boolean(opts.includeUnpublished)));
  const row = rows.find((r) => readRichText(r.properties, "Slug") === slug);
  if (!row) return null;

  const summary = await toSummary(row);
  if (!summary) return null;

  const raw = await pageToMarkdown(row.id);
  const cleaned = cleanBody(raw, summary.title);
  const bodyMarkdown = await rehostBodyImages(cleaned, summary.slug);

  return {
    ...summary,
    readingTime: readingTime(bodyMarkdown),
    bodyMarkdown,
    faq: extractFaq(bodyMarkdown),
    relatedProducts: normaliseRelatedProducts(
      readMultiSelect(row.properties, "Related products"),
    ),
  };
}
