import Link from "next/link";
import { BYO_URL } from "@/app/lib/landingConstants";

/* Shape, motion and focus treatment shared by both fills. */
const CTA_SHARED =
  "relative inline-flex items-center justify-center rounded-full transition-all duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-[#1B2757]/25 active:scale-[0.97] motion-safe:active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]";

const CTA_BASE = `${CTA_SHARED} border border-[#1B2757] text-white bg-[#1B2757] hover:bg-white hover:text-[#1B2757]`;

/* Inverted fill — white pill with navy border/text that flips to the navy
   fill on hover (the exact mirror of CTA_BASE), for placements on busy or
   dark-adjacent footage where the solid navy pill is too heavy. */
const CTA_BASE_INVERTED = `${CTA_SHARED} border-2 border-[#1B2757] text-[#1B2757] bg-white hover:bg-[#1B2757] hover:text-white`;

/* Padding is symmetric on both variants so the label sits dead-centre in the
   pill; the arrow is absolutely positioned inside the right gutter rather than
   taking part in the flow, which would push the label off-centre. The gutter is
   wide enough that a label growing to max-w-md never reaches the arrow. */
const OUTER = "min-w-[14rem] max-w-md py-3.5 px-10 lg:px-12";

/* Compact variant — same anatomy at a smaller scale, for dense bars where the
   full pill would dominate (the PDP sticky purchase footer). */
const COMPACT = "w-full py-2.5 lg:py-3 px-9";

export default function ConkaCTAButton({
  children,
  href,
  onClick,
  className = "",
  compact = false,
  inverted = false,
}: {
  children: React.ReactNode;
  href?: string;
  /** Provide an onClick to render as a <button> (e.g. modal triggers). */
  onClick?: () => void;
  className?: string;
  /** Compact variant for dense bars: smaller type and padding. */
  compact?: boolean;
  /** White pill with navy border/text; hover flips to the navy fill. */
  inverted?: boolean;
}) {
  const classes = `${compact ? COMPACT : OUTER} ${
    inverted ? CTA_BASE_INVERTED : CTA_BASE
  } ${className}`;

  const inner = (
    <>
      <span
        className={`font-mono font-bold uppercase whitespace-nowrap ${
          compact ? "text-xs lg:text-sm tracking-[0.14em]" : "text-sm tracking-[0.12em]"
        }`}
      >
        {children}
      </span>

      {/* Arrow — parked in the right gutter, out of flow so it cannot
          shift the centred label. */}
      <svg
        width={compact ? "16" : "18"}
        height={compact ? "16" : "18"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={`absolute ${compact ? "right-3" : "right-4 lg:right-6"}`}
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

  const resolvedHref = href ?? BYO_URL;
  const isExternal = resolvedHref.startsWith("http") || resolvedHref.startsWith("//");
  if (isExternal) {
    return <a href={resolvedHref} className={classes}>{inner}</a>;
  }
  return <Link href={resolvedHref} className={classes}>{inner}</Link>;
}
