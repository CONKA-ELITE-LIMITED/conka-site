/**
 * Animated with/without comparison graph for interstitial screens.
 * Stylised illustrative curves, not real data: a hand-drawn SVG with a
 * CSS draw-in on the "with" line (go-draw in brand-base.css). No chart
 * library by design.
 */
export default function ComparisonChart({
  withLabel,
  withoutLabel,
  caption,
}: {
  withLabel: string;
  withoutLabel: string;
  caption?: string;
}) {
  return (
    <figure>
      <svg
        viewBox="0 0 320 180"
        className="w-full"
        role="img"
        aria-label={`${withLabel} versus ${withoutLabel}`}
      >
        {/* hairline frame */}
        <line x1="8" y1="164" x2="312" y2="164" stroke="var(--go-hairline)" strokeWidth="1" />
        <line x1="8" y1="12" x2="8" y2="164" stroke="var(--go-hairline)" strokeWidth="1" />

        {/* without: starts fine, fades through the day */}
        <path
          d="M8,84 C70,64 110,72 160,102 C210,130 262,140 312,144"
          fill="none"
          stroke="var(--go-neutral-strong)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="go-fade-up"
          style={{ animationDelay: "150ms" }}
        />

        {/* with: rises and holds */}
        <path
          d="M8,108 C60,62 120,46 180,42 C230,39 276,38 312,37"
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="2"
          pathLength={1}
          className="go-draw"
        />
        <circle cx="312" cy="37" r="3" fill="var(--brand-accent)" className="go-fade-up" style={{ animationDelay: "1200ms" }} />
      </svg>

      <div
        className="mt-3 flex items-center justify-center gap-5 text-xs uppercase tracking-wide"
        style={{ fontFamily: "var(--font-brand-data)" }}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-5" style={{ backgroundColor: "var(--brand-accent)" }} />
          {withLabel}
        </span>
        <span className="go-text-mid flex items-center gap-2">
          <span className="inline-block h-px w-5 border-t border-dashed" style={{ borderColor: "var(--go-neutral-strong)" }} />
          {withoutLabel}
        </span>
      </div>

      {caption && (
        <figcaption className="go-text-faint mt-2 text-xs">{caption}</figcaption>
      )}
    </figure>
  );
}
