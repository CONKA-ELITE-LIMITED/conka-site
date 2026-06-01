import Link from "next/link";

/* ============================================================================
 * ExploreMoreRow
 *
 * Cross-page routing block for trust/learning pages (/our-story, /why-conka).
 * Sits under the primary CTA so visitors who aren't ready to buy have a
 * next step that keeps them on site instead of bouncing.
 *
 * Clinical grammar: sharp corners, mono labels, hairline borders.
 * ========================================================================== */

interface ExploreLink {
  href: string;
  label: string;
  sub: string;
}

const DEFAULT_LINKS: ExploreLink[] = [
  {
    href: "/conka-both",
    label: "CONKA Flow & Clear",
    sub: "The full system",
  },
  { href: "/ingredients", label: "Ingredients", sub: "What's inside" },
  { href: "/app", label: "The App", sub: "Measure your brain" },
  { href: "/science", label: "The Science", sub: "Research & trials" },
];

export default function ExploreMoreRow({
  links = DEFAULT_LINKS,
  heading = "Keep exploring",
}: {
  links?: ExploreLink[];
  heading?: string;
} = {}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {`// ${heading}`}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col gap-1 px-4 py-4 min-h-[44px] bg-white border border-black/12 hover:border-black/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/40 focus-visible:ring-offset-2"
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-black leading-tight">
                {link.label}
              </span>
              <span
                aria-hidden
                className="font-mono text-sm text-black/30 group-hover:text-black/70 transition-colors"
              >
                ↗
              </span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/45">
              {link.sub}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
