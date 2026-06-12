/**
 * Donut chart for interstitial screens. First segment takes the navy
 * accent, the rest fall back to a neutral ramp; the largest share is
 * shown in the centre. Segments fade in staggered (go-fade-up). Plain
 * SVG, no chart library.
 */
const NEUTRAL_RAMP = [
  "rgba(0,0,0,0.55)",
  "rgba(0,0,0,0.3)",
  "rgba(0,0,0,0.15)",
  "rgba(0,0,0,0.08)",
];

export default function PieChart({
  segments,
  caption,
}: {
  segments: { label: string; value: number }[];
  caption?: string;
}) {
  if (segments.length === 0) return null;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const mono = { fontFamily: "var(--font-brand-data)" } as const;
  const colorFor = (i: number) =>
    i === 0 ? "var(--brand-accent)" : NEUTRAL_RAMP[(i - 1) % NEUTRAL_RAMP.length];

  const lead = segments.reduce(
    (best, s) => (s.value > best.value ? s : best),
    segments[0],
  );

  let cumulative = 0;

  return (
    <figure>
      <div className="flex items-center justify-center gap-6">
        <svg viewBox="0 0 160 160" className="w-36 shrink-0" role="img" aria-label={caption ?? "Breakdown"}>
          {segments.map((segment, i) => {
            const fraction = segment.value / total;
            const startAngle = cumulative * 360 - 90;
            cumulative += fraction;
            return (
              <circle
                key={segment.label}
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke={colorFor(i)}
                strokeWidth="26"
                pathLength={1}
                // tiny gap between segments keeps the hairline grammar
                strokeDasharray={`${Math.max(fraction - 0.008, 0.004)} 1`}
                transform={`rotate(${startAngle} 80 80)`}
                className="go-fade-up"
                style={{ animationDelay: `${150 + i * 140}ms` }}
              />
            );
          })}
          <text
            x="80"
            y="86"
            textAnchor="middle"
            className="tabular-nums"
            style={{ ...mono, fontSize: "1.5rem", fontWeight: 500 }}
            fill="var(--brand-accent)"
          >
            {Math.round((lead.value / total) * 100)}%
          </text>
        </svg>

        <ul className="flex flex-col gap-2.5">
          {segments.map((segment, i) => (
            <li
              key={segment.label}
              className="flex items-center gap-2 text-xs uppercase tracking-wide text-black/70"
              style={mono}
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0"
                style={{ backgroundColor: colorFor(i) }}
                aria-hidden
              />
              {segment.label}
              <span className="tabular-nums text-black/50">
                {Math.round((segment.value / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-black/50">{caption}</figcaption>
      )}
    </figure>
  );
}
