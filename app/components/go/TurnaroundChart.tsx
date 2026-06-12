/**
 * Turnaround curve for the brain-age reveal: a line that starts low
 * ("you now") and climbs hard to a dot ("where you could be").
 * Stylised and illustrative, not data-driven; same card grammar as
 * ComparisonChart (gradient card, gridlines, glow, label pills).
 */
const UP_PATH = "M16,168 C90,160 150,120 210,70 C250,38 285,26 304,22";

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
  const pill =
    "absolute rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]";

  return (
    <figure
      className="go-fade-up w-full"
      style={{ animationDelay: `${startDelayMs}ms` }}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl p-3"
        style={{ background: "var(--go-card-bg)" }}
      >
        <svg
          viewBox="0 0 320 200"
          className="w-full"
          role="img"
          aria-label={`${nowLabel} to ${futureLabel}`}
        >
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

          {/* glow underlay, start dot, climbing line, end dot */}
          <path
            d={UP_PATH}
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="9"
            opacity="0.35"
            style={{ filter: "blur(7px)", animationDelay: `${startDelayMs}ms` }}
            className="go-fade-up"
          />
          <circle cx="16" cy="168" r="4" fill="var(--go-text)" />
          <path
            d={UP_PATH}
            fill="none"
            stroke="var(--brand-accent)"
            strokeWidth="3.5"
            pathLength={1}
            className="go-draw"
            style={{ animationDelay: `${startDelayMs + 200}ms` }}
          />
          <circle
            cx="304"
            cy="22"
            r="5"
            fill="var(--brand-accent)"
            className="go-fade-up"
            style={{ animationDelay: `${startDelayMs + 1200}ms` }}
          />
        </svg>

        <span
          className={`${pill} bottom-[10%] left-[4%]`}
          style={{
            ...mono,
            backgroundColor: "var(--go-surface)",
            border: "1px solid var(--go-hairline)",
            color: "var(--go-text-soft)",
          }}
        >
          {nowLabel}
        </span>
        <span
          className={`${pill} go-fade-up right-[3%] top-[4%]`}
          style={{
            ...mono,
            backgroundColor: "var(--go-bg)",
            border: "1px solid var(--brand-accent)",
            color: "var(--brand-accent)",
            animationDelay: `${startDelayMs + 1100}ms`,
          }}
        >
          {futureLabel}
        </span>
      </div>

      {caption && (
        <figcaption className="go-text-faint mt-2 text-xs">{caption}</figcaption>
      )}
    </figure>
  );
}
