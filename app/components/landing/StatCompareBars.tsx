"use client";

import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * StatCompareBars
 *
 * One number, two bars, one source line. The number leads (a skimmer reads
 * "+19.3%" before anything else), the bars are labelled in plain words, and the
 * source says where the figure comes from, because a cold visitor has no reason
 * to trust a bare percentage.
 *
 * Honest proportions: the With bar is the Without bar scaled by the real
 * change, from a fixed baseline. A negative `change` is for measures where
 * lower is better (cortisol): the With bar is shorter and still reads green.
 *
 * Content only: the reason block owns spacing around it.
 * ========================================================================== */

const POSITIVE = "var(--brand-positive, #1a7f4f)";
const MAX_BAR_PX = 150;
const BASELINE_FRAC = 0.62;

export default function StatCompareBars({
  value,
  caption,
  change,
  withoutLabel = "Without CONKA",
  withLabel = "With CONKA",
  source,
}: {
  /** Headline figure exactly as displayed, e.g. "+19.3%" or "-28%" */
  value: string;
  /** What the figure measures, in words, e.g. "higher focus scores" */
  caption: string;
  /** Fractional change applied to the baseline bar, e.g. 0.193 or -0.28 */
  change: number;
  withoutLabel?: string;
  withLabel?: string;
  /** Where the number comes from, e.g. "Trial of professional athletes" */
  source: string;
}) {
  const [ref, isInView] = useInView();
  const bars = [
    { label: withoutLabel, frac: BASELINE_FRAC, conka: false },
    { label: withLabel, frac: BASELINE_FRAC * (1 + change), conka: true },
  ];

  return (
    <div
      ref={ref}
      className="rounded-lg border border-black/10 bg-white p-6 text-black md:p-7"
    >
      <p
        className="font-bold leading-none tabular-nums"
        style={{ color: POSITIVE, fontSize: "clamp(2.75rem, 11vw, 3.5rem)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-base font-semibold">{caption}</p>

      <div className="mx-auto mt-8 flex h-[150px] max-w-[300px] items-end justify-center gap-8">
        {bars.map((b) => (
          <div
            key={b.label}
            className="w-full rounded-t-lg motion-safe:[transition:height_1s_cubic-bezier(0.4,0,0.2,1)]"
            style={{
              height: isInView ? `${Math.round(b.frac * MAX_BAR_PX)}px` : 0,
              background: b.conka ? POSITIVE : "rgba(0,0,0,0.14)",
            }}
          />
        ))}
      </div>
      <div className="mx-auto mt-2.5 flex max-w-[300px] justify-center gap-8">
        {bars.map((b) => (
          <span
            key={b.label}
            className={`flex-1 text-center text-[13px] ${
              b.conka ? "font-semibold text-black" : "text-black/55"
            }`}
          >
            {b.label}
          </span>
        ))}
      </div>

      <p className="mt-6 border-t border-black/10 pt-3 text-[12px] leading-snug text-black/55">
        Source: {source}
      </p>
    </div>
  );
}
