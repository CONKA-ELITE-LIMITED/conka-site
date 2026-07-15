/**
 * Freshness line for indexable content pages (SCRUM-1149, SEO/AEO Phase 9).
 *
 * Renders a visible "Reviewed <month year>" line with a machine-readable
 * <time> element. Only stamp a page once it has actually been reviewed: a date
 * on a page nobody re-read misleads users and crawlers alike.
 */

interface ReviewedDateProps {
  /** ISO date for the <time dateTime>, e.g. "2026-07" or "2026-07-15". */
  isoDate: string;
  /** Human-readable display, e.g. "July 2026". */
  label: string;
  /** Text tone for the surface the line sits on. */
  tone?: "onLight" | "onDark";
  /** Render a tone-matched top divider + spacing (for a standalone page-foot line). */
  divider?: boolean;
  /** Extra classes on the wrapper, e.g. spacing when nested in an existing stack. */
  className?: string;
}

export default function ReviewedDate({
  isoDate,
  label,
  tone = "onLight",
  divider = false,
  className = "",
}: ReviewedDateProps) {
  const textClass = tone === "onDark" ? "text-white/65" : "text-black/55";
  const dividerClass = divider
    ? `mt-10 border-t pt-6 ${tone === "onDark" ? "border-white/10" : "border-black/10"}`
    : "";
  const wrapperClass = `${dividerClass} ${className}`.trim();

  return (
    <div className={wrapperClass || undefined}>
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums ${textClass}`}
      >
        Reviewed <time dateTime={isoDate}>{label}</time>
      </p>
    </div>
  );
}
