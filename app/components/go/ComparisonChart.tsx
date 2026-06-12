/**
 * Animated with/without comparison graph for interstitial screens.
 * Stylised illustrative curves, not real data: a hand-drawn SVG with a
 * CSS draw-in on the "with" line (go-draw in brand-base.css), framed
 * in a gradient card with faint gridlines, a glow under the accent
 * line and in-chart label pills. No chart library by design.
 */
const WITH_PATH = "M12,150 C70,128 130,72 200,50 C250,36 285,31 308,30";

export default function ComparisonChart({
  withLabel,
  withoutLabel,
  caption,
}: {
  withLabel: string;
  withoutLabel: string;
  caption?: string;
}) {
  const mono = { fontFamily: "var(--font-brand-data)" } as const;
  const pill =
    "absolute rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]";

  return (
    <figure className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-2xl p-3"
        style={{ background: "var(--go-card-bg)" }}
      >
        <svg
          viewBox="0 0 320 200"
          className="w-full"
          role="img"
          aria-label={`${withLabel} versus ${withoutLabel}`}
        >
          {/* faint grid */}
          {[50, 100, 150].map((y) => (
            <line
              key={`h${y}`}
              x1="0"
              y1={y}
              x2="320"
              y2={y}
              stroke="var(--go-hairline-soft)"
              strokeWidth="1"
            />
          ))}
          {[64, 128, 192, 256].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="200"
              stroke="var(--go-hairline-soft)"
              strokeWidth="1"
            />
          ))}

          {/* without: starts fine, drifts down through the day */}
          <path
            d="M12,96 C80,88 140,104 200,132 C250,152 285,162 308,166"
            fill="none"
            stroke="var(--go-neutral-strong)"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            className="go-fade-up"
            style={{ animationDelay: "150ms" }}
          />

          {/* with: glow underlay, then the drawn line */}
          <path
            d={WITH_PATH}
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="9"
            opacity="0.35"
            style={{ filter: "blur(7px)" }}
            className="go-fade-up"
          />
          <circle cx="12" cy="150" r="4" fill="var(--go-text)" />
          <path
            d={WITH_PATH}
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="3.5"
            pathLength={1}
            className="go-draw"
          />
          <circle
            cx="308"
            cy="30"
            r="5"
            fill="var(--brand-accent)"
            className="go-fade-up"
            style={{ animationDelay: "1200ms" }}
          />
        </svg>

        {/* in-chart label pills */}
        <span
          className={`${pill} left-[5%] top-[33%]`}
          style={{
            ...mono,
            backgroundColor: "var(--go-surface)",
            border: "1px solid var(--go-hairline)",
            color: "var(--go-text-soft)",
          }}
        >
          {withoutLabel}
        </span>
        <span
          className={`${pill} go-fade-up right-[4%] top-[5%]`}
          style={{
            ...mono,
            backgroundColor: "var(--go-bg)",
            border: "1px solid var(--brand-accent)",
            color: "var(--brand-accent)",
            animationDelay: "1100ms",
          }}
        >
          {withLabel}
        </span>
      </div>

      {caption && (
        <figcaption className="go-text-faint mt-2 text-xs">{caption}</figcaption>
      )}
    </figure>
  );
}
