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
              className="flex items-baseline justify-between text-xs uppercase tracking-wide text-black/60"
              style={mono}
            >
              <span>{item.label}</span>
              <span className="tabular-nums">
                {unit ? unit.replace("{value}", String(item.value)) : item.value}
              </span>
            </div>
            <div className="mt-1.5 h-5 w-full bg-black/5">
              <div
                className="go-bar h-full"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  backgroundColor: item.accent
                    ? "var(--brand-accent)"
                    : "rgba(0,0,0,0.25)",
                  animationDelay: `${150 + i * 120}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-black/50">{caption}</figcaption>
      )}
    </figure>
  );
}
