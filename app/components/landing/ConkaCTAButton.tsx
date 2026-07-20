import Link from "next/link";
import Image from "next/image";
import { FUNNEL_URL } from "@/app/lib/landingConstants";

/* Meta subtitle variants — swap ACTIVE_META to test different directions. */
const META_VARIANTS = {
  aspirational:   "// your brain, optimised.",
  performance:    "// think sharper · every single day",
  measured:       "// peak performance, measured.",
  proof:          "// 28.96% avg. cognitive improvement",
  guarantee:      "// 100-day risk-free · nothing to lose",
} as const;

const ACTIVE_META: string = META_VARIANTS.aspirational;

/* Shared interaction: pill shape, navy fill that flips to a white fill with
   navy text on hover, plus a subtle lift/press (motion-safe only). The `group`
   lets the inner O-mark, arrow and meta line flip colour in step. */
const CTA_BASE =
  "group rounded-full border border-[#1B2757] text-white bg-[#1B2757] transition-all duration-200 ease-out hover:bg-white hover:text-[#1B2757] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-[#1B2757]/25 active:scale-[0.97] motion-safe:active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]";

/* Default variant — full CTA (O-icon + text + meta + horizontal arrow)
   at every viewport. Shrink-to-content with min/max bounds. Mobile has
   tighter gap/padding so longer labels still fit on one line. */
const OUTER =
  `inline-flex flex-row items-center gap-3 lg:gap-4 min-w-[14rem] max-w-md py-3.5 pl-3 pr-5 lg:pl-5 lg:pr-8 ${CTA_BASE}`;

/* Compact variant — forces the compact treatment on every viewport
   (e.g. in-card ingredients button where the full desktop treatment
   would feel too sales-y for a secondary action). */
const COMPACT =
  `inline-flex flex-row items-center justify-between gap-3 w-full py-2.5 lg:py-3 px-4 ${CTA_BASE}`;

export default function ConkaCTAButton({
  children,
  href,
  onClick,
  meta = ACTIVE_META,
  className = "",
  compact = false,
}: {
  children: React.ReactNode;
  href?: string;
  /** Provide an onClick to render as a <button> (e.g. modal triggers). */
  onClick?: () => void;
  /** Pass `null` (or empty string) to hide the meta line entirely. */
  meta?: string | null;
  className?: string;
  /** Compact in-card variant: text + light-up ↗ arrow, no O-icon. */
  compact?: boolean;
}) {
  const classes = `${compact ? COMPACT : OUTER} ${className}`;
  const showMeta = !compact && Boolean(meta);

  const inner = compact ? (
    <>
      <span className="font-mono font-bold text-xs lg:text-sm uppercase tracking-[0.14em] whitespace-nowrap">
        {children}
      </span>
      <span
        aria-hidden
        className="font-mono text-base lg:text-lg leading-none text-white/55 group-hover:text-[#1B2757] transition-colors"
      >
        ↗
      </span>
    </>
  ) : (
    <>
      {/* LEFT — Conka "O" mark, inverted to white for the navy fill */}
      <span className="relative w-7 h-7 shrink-0" aria-hidden>
        <Image
          src="/logos/ConkaO.png"
          alt=""
          fill
          sizes="28px"
          className="object-contain [filter:brightness(0)_invert(1)] transition-[filter] duration-200 group-hover:[filter:brightness(0)]"
        />
      </span>

      {/* CENTER — title, with optional meta line */}
      <span className="flex flex-col items-start flex-1 min-w-0">
        <span className="font-mono font-bold text-sm uppercase tracking-[0.12em] whitespace-nowrap">
          {children}
        </span>
        {showMeta && (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white group-hover:text-[#1B2757] mt-1 leading-none transition-colors">
            {meta}
          </span>
        )}
      </span>

      {/* RIGHT — arrow icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="shrink-0"
        aria-hidden
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13 6 19 12 13 18" />
      </svg>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {inner}
      </button>
    );
  }

  const resolvedHref = href ?? FUNNEL_URL;
  const isExternal = resolvedHref.startsWith("http") || resolvedHref.startsWith("//");
  if (isExternal) {
    return <a href={resolvedHref} className={classes}>{inner}</a>;
  }
  return <Link href={resolvedHref} className={classes}>{inner}</Link>;
}
