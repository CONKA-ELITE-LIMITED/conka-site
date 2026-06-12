/**
 * Turnaround curve for the brain-age reveal: a line that starts low
 * ("you now") and curves up to a dot ("where you could be").
 * Stylised and illustrative, not data-driven; same SVG grammar as
 * ComparisonChart (go-draw draw-in, hairline frame).
 */
export default function TurnaroundChart({
  nowLabel,
  futureLabel,
  caption,
  startDelayMs = 0,
}: {
  nowLabel: string;
  futureLabel: string;
  caption?: string;
  startDelayMs?: number;
}) {
  const mono = { fontFamily: "var(--font-brand-data)" } as const;

  return (
    <figure className="go-fade-up" style={{ animationDelay: `${startDelayMs}ms` }}>
      <svg
        viewBox="0 0 320 180"
        className="w-full"
        role="img"
        aria-label={`${nowLabel} to ${futureLabel}`}
      >
        {/* hairline frame */}
        <line x1="8" y1="164" x2="312" y2="164" stroke="var(--go-hairline)" strokeWidth="1" />
        <line x1="8" y1="12" x2="8" y2="164" stroke="var(--go-hairline)" strokeWidth="1" />

        {/* low start, rising curve, end dot */}
        <circle cx="16" cy="142" r="3" fill="var(--go-neutral-strong)" />
        <path
          d="M16,142 C80,138 140,116 200,78 C244,50 284,38 308,33"
          fill="none"
          stroke="var(--brand-accent)"
          strokeWidth="2"
          pathLength={1}
          className="go-draw"
          style={{ animationDelay: `${startDelayMs + 200}ms` }}
        />
        <circle
          cx="308"
          cy="33"
          r="4"
          fill="var(--brand-accent)"
          className="go-fade-up"
          style={{ animationDelay: `${startDelayMs + 1200}ms` }}
        />
      </svg>

      <div
        className="mt-3 flex items-center justify-between text-xs uppercase tracking-wide"
        style={mono}
      >
        <span className="go-text-mid">{nowLabel}</span>
        <span style={{ color: "var(--brand-accent)" }}>{futureLabel}</span>
      </div>

      {caption && (
        <figcaption className="go-text-faint mt-2 text-xs">{caption}</figcaption>
      )}
    </figure>
  );
}
