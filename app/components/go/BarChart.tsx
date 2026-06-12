/**
 * Animated horizontal bar chart for interstitial screens. Bars grow in
 * with a staggered scaleX (go-bar in brand-base.css). Accent bars use
 * navy; the rest are neutral. Values come straight from the config.
 */
export default function BarChart({
  items,
  unit,
  caption,
}: {
  items: { label: string; value: number; accent?: boolean }[];
  unit?: string;
  caption?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);
  const mono = { fontFamily: "var(--font-brand-data)" } as const;

  return (
    <figure>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={item.label}>
            <div
              className="go-text-mid flex items-baseline justify-between text-xs uppercase tracking-wide"
              style={mono}
            >
              <span>{item.label}</span>
              <span className="tabular-nums">
                {unit ? unit.replace("{value}", String(item.value)) : item.value}
              </span>
            </div>
            <div className="mt-1.5 h-5 w-full" style={{ backgroundColor: "var(--go-track)" }}>
              <div
                className="go-bar h-full"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.accent
                    ? "var(--brand-accent)"
                    : "var(--go-neutral)",
                  animationDelay: `${150 + i * 120}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="go-text-faint mt-3 text-xs">{caption}</figcaption>
      )}
    </figure>
  );
}
