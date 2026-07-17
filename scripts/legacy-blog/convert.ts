/**
 * Convert legacy Shopify `contentHtml` into native Notion blocks.
 *
 * Usage (inspect one post): npx tsx scripts/legacy-blog/convert.ts <handle>
 *
 * The source is ProseMirror output: span/div soup with junk classes and ids,
 * empty <figure> shells, section titles marked up as <p><strong>Title</strong></p>
 * rather than <h2>, and <meta charset> inline in the body. Everything here is
 * deterministic; the 6 posts with no recoverable structure are listed in the
 * plan doc and get a hand pass instead.
 *
 * The content contract this must satisfy is
 * docs/development/featurePlans/blog-notion-engine-brief.md: real headings,
 * real bullets, real bold, links with an href, and no em dashes.
 */
import { readFileSync } from "node:fs";
import { parse, NodeType, type HTMLElement, type Node, type TextNode } from "node-html-parser";
import { ARTICLES_PATH, type LegacyArticle } from "./fetch";

/** Notion rejects any single rich_text content longer than this. */
const RICH_TEXT_LIMIT = 2000;

/**
 * A fully-bold <p> longer than this reads as emphasised prose, not a section
 * title, so it stays a paragraph. The real titles we are recovering are short
 * (verified: "Basis of Language: Brain Regions" at 32 chars).
 */
const FAKE_HEADING_MAX_CHARS = 120;

/** Relative links in the archive were authored against the live storefront. */
const SITE_ORIGIN = "https://conka.io";

/** Chrome and tracking markup that carries no content. */
const DROP_TAGS = new Set(["script", "style", "meta", "button", "svg", "iframe", "noscript", "link"]);

const CONTAINER_TAGS = new Set([
  "div", "section", "article", "header", "footer", "main", "aside", "html", "body", "tbody", "thead",
]);

const BLOCK_TAGS = new Set([
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "figure", "img",
  "blockquote", "hr", "table", "pre", ...CONTAINER_TAGS, ...DROP_TAGS,
]);

/** No `underline`: it is never emitted. See the `case "u"` note in inlineNode. */
export interface Annotations {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

export interface RichText {
  type: "text";
  text: { content: string; link: { url: string } | null };
  annotations?: Annotations;
}

// Notion's block shape is a discriminated union far wider than we emit; the
// importer only ever passes these straight to the API.
export type NotionBlock = Record<string, unknown>;

interface InlineCtx {
  annotations: Annotations;
  link: string | null;
}

const EMPTY_CTX: InlineCtx = { annotations: {}, link: null };

function tagOf(node: Node): string {
  return (node as HTMLElement).rawTagName?.toLowerCase() ?? "";
}

function isElement(node: Node): boolean {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

/**
 * Collapse whitespace and normalise em dashes to commas (the content contract
 * forbids them). Entity decoding is done by the parser's `.text`; note &nbsp;
 * decodes to U+00A0, which JS \s matches, so it collapses here too.
 */
function normaliseText(raw: string): string {
  return raw.replace(/\s*—\s*/g, ", ").replace(/\s+/g, " ");
}

/** Absolute http(s)/mailto links pass through; root-relative ones are resolved. */
function normaliseHref(href: string | undefined): string | null {
  const trimmed = href?.trim();
  if (!trimmed) return null;
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${SITE_ORIGIN}${trimmed}`;
  return null;
}

function makeRichText(content: string, ctx: InlineCtx): RichText {
  const item: RichText = {
    type: "text",
    text: { content, link: ctx.link ? { url: ctx.link } : null },
  };
  if (Object.keys(ctx.annotations).length > 0) item.annotations = ctx.annotations;
  return item;
}

function inlineNode(node: Node, ctx: InlineCtx): RichText[] {
  if (node.nodeType === NodeType.TEXT_NODE) {
    const content = normaliseText((node as TextNode).text);
    return content ? [makeRichText(content, ctx)] : [];
  }
  if (!isElement(node)) return [];

  const el = node as HTMLElement;
  const tag = tagOf(el);
  const withAnnotation = (extra: Annotations) =>
    inlineNodes(el.childNodes, { ...ctx, annotations: { ...ctx.annotations, ...extra } });

  switch (tag) {
    case "br":
      return [makeRichText("\n", ctx)];
    case "strong":
    case "b":
      return withAnnotation({ bold: true });
    case "em":
    case "i":
      return withAnnotation({ italic: true });
    case "u":
      // Deliberately unwrapped, not annotated. Notion underline round-trips out
      // of notion-to-md as literal <u> text (SCRUM-1160). The source's only <u>
      // is Wix citation junk, so the digit is kept and the formatting dropped.
      return inlineNodes(el.childNodes, ctx);
    case "s":
    case "del":
    case "strike":
      return withAnnotation({ strikethrough: true });
    case "code":
      return withAnnotation({ code: true });
    case "a": {
      const link = normaliseHref(el.getAttribute("href")) ?? ctx.link;
      return inlineNodes(el.childNodes, { ...ctx, link });
    }
    case "img":
      // Images are block-level; an inline one is dropped rather than inlined.
      return [];
    default:
      if (DROP_TAGS.has(tag)) return [];
      // span, font and any other wrapper: unwrap and keep the text.
      return inlineNodes(el.childNodes, ctx);
  }
}

function inlineNodes(nodes: Node[], ctx: InlineCtx): RichText[] {
  return nodes.flatMap((n) => inlineNode(n, ctx));
}

function sameFormatting(a: RichText, b: RichText): boolean {
  return (
    JSON.stringify(a.annotations ?? {}) === JSON.stringify(b.annotations ?? {}) &&
    JSON.stringify(a.text.link) === JSON.stringify(b.text.link)
  );
}

/**
 * Merge adjacent runs sharing formatting, then split any run over Notion's
 * 2,000-char cap. The span soup produces one run per span otherwise, which
 * would blow the 100-item-per-block limit on long paragraphs.
 */
function mergeRichText(items: RichText[]): RichText[] {
  const merged: RichText[] = [];
  for (const item of items) {
    const prev = merged[merged.length - 1];
    if (prev && sameFormatting(prev, item)) prev.text.content += item.text.content;
    else merged.push({ ...item, text: { ...item.text } });
  }

  return merged.flatMap((item) => {
    if (item.text.content.length <= RICH_TEXT_LIMIT) return [item];
    const chunks: RichText[] = [];
    for (let i = 0; i < item.text.content.length; i += RICH_TEXT_LIMIT) {
      chunks.push({
        ...item,
        text: { ...item.text, content: item.text.content.slice(i, i + RICH_TEXT_LIMIT) },
      });
    }
    return chunks;
  });
}

/** Trim leading/trailing whitespace across the run, dropping empties. */
function finaliseRichText(items: RichText[]): RichText[] {
  const merged = mergeRichText(items);
  if (merged.length > 0) {
    merged[0].text.content = merged[0].text.content.replace(/^\s+/, "");
    const last = merged[merged.length - 1];
    last.text.content = last.text.content.replace(/\s+$/, "");
  }
  return merged.filter((i) => i.text.content.length > 0);
}

function richTextOf(el: HTMLElement): RichText[] {
  return finaliseRichText(inlineNodes(el.childNodes, EMPTY_CTX));
}

function block(type: string, rich_text: RichText[]): NotionBlock {
  // A heading is already emphatic. Legacy titles are marked up as <strong>,
  // and carrying that through would render bold text inside a heading.
  const text = type.startsWith("heading")
    ? rich_text.map(({ annotations, ...rest }) => {
        const { bold: _bold, ...kept } = annotations ?? {};
        return Object.keys(kept).length > 0 ? { ...rest, annotations: kept } : rest;
      })
    : rich_text;
  return { object: "block", type, [type]: { rich_text: text } };
}

/**
 * A <p> whose entire visible text sits inside <strong>/<b> is a section title
 * the old editor never marked up as a heading. 24 of the 53 posts rely on this.
 */
function isFakeHeading(el: HTMLElement): boolean {
  const text = normaliseText(el.text).trim();
  if (!text || text.length > FAKE_HEADING_MAX_CHARS) return false;
  if (/[.,;]$/.test(text)) return false;

  const boldText = el
    .querySelectorAll("strong, b")
    .map((b) => normaliseText(b.text))
    .join(" ");

  const bare = (s: string) => s.replace(/\s+/g, "");
  return bare(boldText).length > 0 && bare(boldText) === bare(text);
}

function imageBlock(url: string, caption: RichText[]): NotionBlock {
  return {
    object: "block",
    type: "image",
    image: { type: "external", external: { url }, caption },
  };
}

/**
 * Image blocks for every <img> descended from these nodes.
 *
 * The old editor buries images inside inline wrappers (<strong>, <span>, <u>)
 * within a <p>, so they cannot be found by looking at direct children alone.
 * Notion has no inline image, so each one is lifted out as its own block.
 */
function imageBlocksWithin(nodes: Node[]): NotionBlock[] {
  return nodes.flatMap((node) => {
    if (!isElement(node)) return [];
    const el = node as HTMLElement;
    const imgs = tagOf(el) === "img" ? [el] : el.querySelectorAll("img");
    return imgs.flatMap((img) => {
      const url = normaliseHref(img.getAttribute("src"));
      // Some <img> tags in the archive carry no src at all.
      return url ? [imageBlock(url, [])] : [];
    });
  });
}

function figureBlocks(el: HTMLElement): NotionBlock[] {
  const images = el.querySelectorAll("img");
  // Empty <figure><figcaption></figcaption></figure> shells: 35 posts carry
  // them and they must not produce an empty block.
  if (images.length === 0) return [];

  const captionEl = el.querySelector("figcaption");
  const caption = captionEl ? richTextOf(captionEl) : [];

  return images.flatMap((img) => {
    const url = normaliseHref(img.getAttribute("src"));
    return url ? [imageBlock(url, caption)] : [];
  });
}

/** Direct element children with the given tag (node-html-parser has no :scope). */
function childrenByTag(el: HTMLElement, tags: string[]): HTMLElement[] {
  return el.childNodes.filter((n) => isElement(n) && tags.includes(tagOf(n))) as HTMLElement[];
}

function listBlocks(el: HTMLElement, type: "bulleted_list_item" | "numbered_list_item"): NotionBlock[] {
  return childrenByTag(el, ["li"]).flatMap((li) => {
    // A nested list inside the <li> becomes that item's children.
    const nested = childrenByTag(li, ["ul", "ol"]).flatMap((sub) =>
      listBlocks(sub, tagOf(sub) === "ol" ? "numbered_list_item" : "bulleted_list_item"),
    );
    const inlineChildren = li.childNodes.filter((n) => !["ul", "ol"].includes(tagOf(n)));
    const own = finaliseRichText(inlineChildren.flatMap((n) => inlineNode(n, EMPTY_CTX)));
    // Notion has no image inside a list item, so one lands after the list.
    const images = imageBlocksWithin(inlineChildren);
    if (own.length === 0 && nested.length === 0) return images;

    const item = block(type, own) as Record<string, Record<string, unknown>>;
    if (nested.length > 0) item[type].children = nested;
    return [item as NotionBlock, ...images];
  });
}

function tableBlocks(el: HTMLElement): NotionBlock[] {
  const rows = el.querySelectorAll("tr");
  if (rows.length === 0) return [];

  const cellsPerRow = rows.map((tr) =>
    tr.querySelectorAll("th, td").map((cell) => richTextOf(cell)),
  );
  const width = Math.max(...cellsPerRow.map((c) => c.length));
  if (width === 0) return [];

  return [
    {
      object: "block",
      type: "table",
      table: {
        table_width: width,
        has_column_header: rows[0].querySelectorAll("th").length > 0,
        has_row_header: false,
        children: cellsPerRow.map((cells) => ({
          object: "block",
          type: "table_row",
          // Notion requires every row to be exactly table_width wide. Ragged
          // rows are padded with distinct empty cells, never a shared one.
          table_row: {
            cells: [...cells, ...Array.from({ length: width - cells.length }, () => [])],
          },
        })),
      },
    },
  ];
}

function blockFromElement(el: HTMLElement): NotionBlock[] {
  const tag = tagOf(el);
  if (DROP_TAGS.has(tag)) return [];
  if (CONTAINER_TAGS.has(tag)) return blocksFromChildren(el.childNodes);

  switch (tag) {
    // The body must start at H2: the site renders the H1 from `Blog name`, so a
    // legacy <h1> is demoted rather than duplicating the title.
    case "h1":
    case "h2":
      return withText(el, "heading_2");
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      return withText(el, "heading_3");
    case "p":
      // withText lifts any images out of the paragraph into their own blocks.
      return isFakeHeading(el) ? withText(el, "heading_2") : withText(el, "paragraph");
    case "blockquote":
      return withText(el, "quote");
    case "ul":
      return listBlocks(el, "bulleted_list_item");
    case "ol":
      return listBlocks(el, "numbered_list_item");
    case "figure":
      return figureBlocks(el);
    case "img": {
      const url = normaliseHref(el.getAttribute("src"));
      return url ? [imageBlock(url, [])] : [];
    }
    case "table":
      return tableBlocks(el);
    case "hr":
      return [{ object: "block", type: "divider", divider: {} }];
    case "pre":
      return withText(el, "paragraph");
    default:
      return blocksFromChildren(el.childNodes);
  }
}

function withText(el: HTMLElement, type: string): NotionBlock[] {
  const rich = richTextOf(el);
  const images = imageBlocksWithin(el.childNodes);
  if (rich.length === 0) return images;

  // Some posts draw a section break by typing dashes into a paragraph. No em
  // dash here: normaliseText has already turned those into commas.
  const plain = rich.map((r) => r.text.content).join("");
  if (type === "paragraph" && /^[-–_*]{3,}$/.test(plain.trim())) {
    return [{ object: "block", type: "divider", divider: {} }, ...images];
  }
  return [block(type, rich), ...images];
}

/**
 * Walk a node list, grouping consecutive inline nodes into paragraphs so that
 * text sitting loose inside a <div> is not lost when the div is unwrapped.
 */
function blocksFromChildren(nodes: Node[]): NotionBlock[] {
  const out: NotionBlock[] = [];
  let inlineRun: Node[] = [];

  const flush = () => {
    if (inlineRun.length === 0) return;
    const rich = finaliseRichText(inlineNodes(inlineRun, EMPTY_CTX));
    if (rich.length > 0) out.push(block("paragraph", rich));
    out.push(...imageBlocksWithin(inlineRun));
    inlineRun = [];
  };

  for (const node of nodes) {
    if (isElement(node) && BLOCK_TAGS.has(tagOf(node))) {
      flush();
      out.push(...blockFromElement(node as HTMLElement));
    } else {
      inlineRun.push(node);
    }
  }
  flush();
  return out;
}

/** Convert one article body into the Notion blocks that represent it. */
export function convertHtmlToBlocks(html: string): NotionBlock[] {
  return blocksFromChildren(parse(html).childNodes);
}

export function loadArticles(): LegacyArticle[] {
  try {
    return JSON.parse(readFileSync(ARTICLES_PATH, "utf-8")) as LegacyArticle[];
  } catch {
    // The snapshot is gitignored, so a fresh checkout has none.
    console.error(
      `No snapshot at ${ARTICLES_PATH}.\nRun: npx tsx scripts/legacy-blog/fetch.ts`,
    );
    process.exit(1);
  }
}

function main(): void {
  const handle = process.argv[2];
  if (!handle) {
    console.error("Usage: npx tsx scripts/legacy-blog/convert.ts <handle>");
    process.exit(1);
  }
  const article = loadArticles().find((a) => a.handle === handle);
  if (!article) {
    console.error(`No article with handle "${handle}"`);
    process.exit(1);
  }
  console.log(JSON.stringify(convertHtmlToBlocks(article.contentHtml), null, 2));
}

if (process.argv[1]?.endsWith("convert.ts")) main();
