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
        p: ({ children }) => (
          <p className="brand-body !max-w-none mb-5 leading-[1.7] text-black/80">
            {children}
          </p>
        ),
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
        li: ({ children }) => (
          <li className="brand-body !max-w-none leading-[1.7] text-black/80 pl-1">
            {children}
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-black">{children}</strong>
        ),
        hr: () => <hr className="my-10 border-black/12" />,
        a: ({ href, children }) => {
          const raw = href ?? "";
          const internal = raw.replace(/^https?:\/\/(www\.)?conka\.io/i, "");
          const isInternal = internal !== raw || raw.startsWith("/");
          return isInternal ? (
            <Link href={internal || "/"} className={linkClass}>
              {children}
            </Link>
          ) : (
            <a
              href={raw}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
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
