/**
 * Pure transforms for the Notion-sourced blog.
 *
 * No IO, no Notion client, no `server-only` guard, so this module is unit
 * testable in isolation. All network and filesystem work lives in `blog.ts`.
 *
 * See docs/development/featurePlans/blog-informational-content-surface.md.
 */

export type RelatedProduct = "flow" | "clear" | "both";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

/** Listing-level metadata (no body). */
export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  heroImage: string; // resolved local path, or the brand fallback
  heroImageAlt: string;
  datePublished: string | null; // ISO date
  dateModified: string; // ISO datetime, from Notion last_edited_time
  topics: string[];
  readingTime: number; // minutes
}

/** Full post, including the render-ready body. */
export interface BlogPost extends BlogPostSummary {
  bodyMarkdown: string;
  faq: BlogFaqItem[];
  relatedProducts: RelatedProduct[];
}

const RELATED_PRODUCTS: readonly RelatedProduct[] = ["flow", "clear", "both"];

// --- Notion property extraction ---------------------------------------------
// The Notion SDK types these as wide unions; we read them defensively with
// narrow helpers rather than fighting the union at every call site.

type NotionProps = Record<string, unknown>;

function prop(props: NotionProps, name: string): Record<string, unknown> {
  return (props[name] as Record<string, unknown>) ?? {};
}

function plainText(rich: unknown): string {
  if (!Array.isArray(rich)) return "";
  return rich
    .map((t) => (t as { plain_text?: string }).plain_text ?? "")
    .join("")
    .trim();
}

export function readTitle(props: NotionProps, name: string): string {
  return plainText(prop(props, name).title);
}

export function readRichText(props: NotionProps, name: string): string {
  return plainText(prop(props, name).rich_text);
}

export function readSelect(props: NotionProps, name: string): string | null {
  const s = prop(props, name).select as { name?: string } | null;
  return s?.name ?? null;
}

export function readMultiSelect(props: NotionProps, name: string): string[] {
  const ms = prop(props, name).multi_select;
  if (!Array.isArray(ms)) return [];
  return ms.map((o) => (o as { name?: string }).name ?? "").filter(Boolean);
}

export function readDate(props: NotionProps, name: string): string | null {
  const d = prop(props, name).date as { start?: string } | null;
  return d?.start ?? null;
}

/** First file URL on a Files & media property, or null. Notion URLs expire. */
export function readFirstFileUrl(props: NotionProps, name: string): string | null {
  const files = prop(props, name).files;
  if (!Array.isArray(files) || files.length === 0) return null;
  const f = files[0] as {
    file?: { url?: string };
    external?: { url?: string };
  };
  return f.file?.url ?? f.external?.url ?? null;
}

export function normaliseRelatedProducts(names: string[]): RelatedProduct[] {
  return names
    .map((n) => n.toLowerCase().trim())
    .filter((n): n is RelatedProduct =>
      RELATED_PRODUCTS.includes(n as RelatedProduct),
    );
}

// --- Body markdown post-processing ------------------------------------------

/**
 * Replace em dashes (used by the engine as clause separators) with a comma.
 * House copy rule forbids em dashes; the engine brief also asks for this, so
 * this is a safety net until the engine complies.
 */
export function normaliseEmDashes(md: string): string {
  return md.replace(/\s*—\s*/g, ", ");
}

/**
 * Remove the leading "SEO" blockquote the engine puts at the top of the body
 * (Title tag / Meta description / URL slug / Primary keyword). That data now
 * lives in Notion columns, so it must not render. Matches the first blockquote
 * block only, and only if it looks like the SEO block.
 */
export function stripSeoCallout(md: string): string {
  return md.replace(/(?:^[ \t]*>.*\n?)+/m, (block) =>
    /Title tag:|URL slug:|Primary keyword:/i.test(block) ? "" : block,
  );
}

/**
 * Remove a duplicated title at the top of the body: the engine currently emits
 * both a plain-text title line and a `# Title` heading. The template renders
 * the H1 from the `Blog name` column, so both must go.
 */
export function stripDuplicateTitle(md: string, title: string): string {
  const wanted = title.trim().toLowerCase();
  const lines = md.split("\n");
  while (lines.length) {
    const line = lines[0].trim();
    if (line === "") {
      lines.shift();
      continue;
    }
    const bare = line.replace(/^#+\s*/, "").trim().toLowerCase();
    if (bare === wanted) {
      lines.shift();
      continue;
    }
    break;
  }
  return lines.join("\n");
}

/** Full body clean-up pipeline, order matters. */
export function cleanBody(md: string, title: string): string {
  let out = stripSeoCallout(md);
  out = stripDuplicateTitle(out, title);
  out = normaliseEmDashes(out);
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Parse the "Frequently Asked Questions" section into structured Q&A for
 * FAQPage JSON-LD. Non-destructive: the FAQ stays in the rendered body, so the
 * schema always mirrors visible content. Questions are bold `Q:` paragraphs,
 * answers are the following `A:` paragraph. Trailing non-Q/A lines are ignored.
 */
export function extractFaq(md: string): BlogFaqItem[] {
  const heading = md.search(/^#{2,3}\s+Frequently Asked Questions\s*$/im);
  if (heading === -1) return [];
  const section = md.slice(heading);
  const lines = section.split("\n");
  const faq: BlogFaqItem[] = [];
  let current: BlogFaqItem | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    const q = line.match(/^\**Q:\s*(.+?)\**\s*$/i);
    const a = line.match(/^\**A:\s*(.+?)\**\s*$/i);
    if (q) {
      if (current) faq.push(current);
      current = { question: q[1].trim(), answer: "" };
    } else if (a && current) {
      current.answer = current.answer
        ? `${current.answer} ${a[1].trim()}`
        : a[1].trim();
    } else if (current && current.answer && line && !line.startsWith("#")) {
      // continuation of the current answer across a wrapped line
      current.answer += ` ${line}`;
    }
  }
  if (current) faq.push(current);
  return faq.filter((f) => f.question && f.answer);
}

/** Reading time in whole minutes, floored at 1. */
export function readingTime(md: string): number {
  const words = md.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
