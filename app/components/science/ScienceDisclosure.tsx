import type { ReactNode } from "react";

/**
 * The /science depth layer: a native <details> with a rotating chevron.
 * Server-rendered, so collapsed content stays in the HTML for crawlers and
 * answer engines, and it opens with no client JS. 44px minimum tap target.
 */
export default function ScienceDisclosure({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-t border-black/10">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-semibold text-black [&::-webkit-details-marker]:hidden">
        {summary}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}
