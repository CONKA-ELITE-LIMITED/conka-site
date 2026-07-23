/**
 * Renders a post's markdown body in the clinical brand system.
 *
 * Server component. Maps markdown to brand typography rather than pulling in a
 * `prose` stylesheet, so the article reads like the rest of the site. Internal
 * conka.io links become SPA `next/link` navigations; external links open in a
 * new tab. Headings get anchor ids for AEO deep-linking.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  return "";
}

function slugify(node: ReactNode): string {
  return nodeText(node)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const linkClass =
  "underline underline-offset-2 decoration-black/30 hover:decoration-black font-medium transition-colors";

/**
 * Legacy posts cite sources as bare URLs, unbroken for up to 342 characters,
 * which blows out the page at 390px. `break-words` is the only thing stopping
 * them scrolling the whole body sideways.
 */
const bodyClass = "brand-body !max-w-none leading-[1.7] text-black/80 break-words";

/**
 * notion-to-md falls back to the file name when an image block has no caption,
 * so imported posts arrive with alt text like
 * "ea1736_841af758b0434bc4ae79ca5f87e2e550_mv2.avif". That is worse than nothing
 * for a screen reader. None of the 100 legacy in-body images carry usable alt
 * (the source is either empty or the literal string "ree"), so a filename-shaped
 * alt is treated as decorative rather than read aloud.
 */
function usableAlt(alt: string | undefined): string {
  const value = (alt ?? "").trim();
  if (!value || value.toLowerCase() === "ree") return "";
  return /\.(png|jpe?g|avif|webp|gif)$/i.test(value) ? "" : value;
}

export default function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 id={slugify(children)} className="brand-h2 mt-14 mb-4 scroll-mt-28">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 id={slugify(children)} className="brand-h3 mt-10 mb-3 scroll-mt-28">
            {children}
          </h3>
        ),
        p: ({ children }) => <p className={`${bodyClass} mb-5`}>{children}</p>,
        ul: ({ children }) => (
          <ul className="mb-6 space-y-2 list-disc pl-5 marker:text-black/30">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-6 space-y-2 list-decimal pl-5 marker:text-black/40">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className={`${bodyClass} pl-1`}>{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-black">{children}</strong>
        ),
        hr: () => <hr className="my-10 border-black/12" />,
        // The persona posts are the first in the archive to use quotes with
        // editorial intent (customer and athlete testimonials), and the
        // react-markdown default is an unstyled browser indent. Square left
        // rule rather than a card: the article renders inside `.brand-clinical`,
        // where every radius token is 0. The inner paragraph keeps the `p`
        // mapping above, so `mb-0` here is what stops a double gap.
        blockquote: ({ children }) => (
          <blockquote className="my-8 border-l-2 border-black/20 pl-5 [&>p:last-child]:mb-0 [&>p]:text-black">
            {children}
          </blockquote>
        ),
        // Rehosted to public/blog/<slug>/ at build, so these are same-origin
        // and already served from our own CDN.
        //
        // Not next/image: it needs width and height (or a sized `fill` parent),
        // and markdown carries no intrinsic dimensions. Guessing them would
        // distort every legacy image to fix a layout shift that lazy loading
        // already keeps off the critical path. Giving these real dimensions
        // means measuring each file during the build rehost and threading the
        // size through to render, which is tracked as follow-up work rather
        // than bodged here. Hero images do use next/image (see the post page).
        img: ({ src, alt }) =>
          typeof src === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={usableAlt(alt)}
              loading="lazy"
              decoding="async"
              className="my-8 h-auto w-full"
            />
          ) : null,
        // Legacy posts carry comparison tables. The wrapper is what keeps a wide
        // table scrolling inside itself instead of widening the page on mobile.
        //
        // `-mx-5` must stay equal to `--brand-gutter-mobile` (1.25rem): it
        // cancels the section gutter so the scroller reaches the viewport edge,
        // and `px-5` puts the padding back inside it. If that token changes,
        // change this with it.
        table: ({ children }) => (
          <div className="my-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[32rem] border-collapse text-left">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border-b border-black/20 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-black/60">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border-b border-black/10 px-3 py-2 align-top text-[0.9375rem] leading-[1.6] text-black/80">
            {children}
          </td>
        ),
        a: ({ href, children }) => {
          const raw = href ?? "";
          const internalPath = raw.replace(/^https?:\/\/(www\.)?conka\.io/i, "");
          const isInternal = internalPath !== raw || raw.startsWith("/");
          if (isInternal) {
            return (
              <Link href={internalPath || "/"} className={linkClass}>
                {children}
              </Link>
            );
          }
          if (/^https?:\/\//i.test(raw)) {
            return (
              <a
                href={raw}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {children}
              </a>
            );
          }
          // Anchor, mailto, tel, etc.: plain in-page link.
          return (
            <a href={raw} className={linkClass}>
              {children}
            </a>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
