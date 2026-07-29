/**
 * Index pagination.
 *
 * Real anchors to static routes, never `?page=N`: searchParams would force the
 * whole route dynamic and break the static build. Page 1 is `/blog`, so the
 * numbering here maps 1 to the index and 2+ to `/blog/page/N`.
 *
 * Prev/next at the edges render as disabled spans rather than links, because a
 * link to a page that does not exist is a crawlable 404.
 */
import Link from "next/link";

/** Page 1 lives at /blog; it is the index, not /blog/page/1. */
export function blogPageHref(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-between gap-3"
    >
      <Step href={blogPageHref(page - 1)} enabled={hasPrev} rel="prev">
        Previous
      </Step>

      <p className="text-[13px] text-black/50 tabular-nums">
        Page {page} / {totalPages}
      </p>

      <Step href={blogPageHref(page + 1)} enabled={hasNext} rel="next">
        Next
      </Step>
    </nav>
  );
}

function Step({
  href,
  enabled,
  rel,
  children,
}: {
  href: string;
  enabled: boolean;
  rel: "prev" | "next";
  children: string;
}) {
  const base =
    "inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-6 rounded-full text-[13px] font-medium transition-colors";

  if (!enabled) {
    return (
      <span
        aria-disabled="true"
        className={`${base} bg-black/[0.04] text-black/30 cursor-default`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      rel={rel}
      className={`${base} bg-[#1B2757] text-white hover:bg-[#26325f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] focus-visible:ring-offset-2`}
    >
      {children}
    </Link>
  );
}
