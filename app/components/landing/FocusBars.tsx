"use client";

import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * FocusBars
 *
 * Listicle chart tile: a tinted title banner across the top, then the figure
 * large, then a proper bar chart filling the rest of the frame. Focus off
 * CONKA vs on CONKA, indexed so the baseline is 100 and CONKA is 119.3 (the
 * verified +19.3%). A labelled 0 to 120 axis, gridlines and a value on each
 * bar make it read as measured data rather than two decorative blocks; bars
 * start at zero, so the proportions are honest.
 *
 * Navy is CONKA, grey the baseline, green only on the headline figure. Copy is
 * black throughout. Fills its parent (`flex-1` in the listicle frame).
 *
 * `zoom` starts the axis at 90 instead of 0, so the 19.3-point gap fills the
 * plot rather than sitting on top of two near-equal columns. The floor is
 * labelled on the axis, so the chart still says what it is showing.
 * ========================================================================== */

const NAVY = "#1B2757";
const GREEN = "var(--brand-positive, #1a7f4f)";
const AXIS_MAX = 120;
const FULL_AXIS = { min: 0, ticks: [0, 40, 80, 120] };
const ZOOM_AXIS = { min: 90, ticks: [90, 100, 110, 120] };

const BARS = [
  { label: "Off CONKA", value: 100, conka: false },
  { label: "On CONKA", value: 119.3, conka: true },
];

export default function FocusBars({
  showSource = true,
  zoom = false,
}: {
  /** Off when the reason's own caption under the tile already names the trial */
  showSource?: boolean;
  /** Start the axis at 90 so the difference reads at a glance */
  zoom?: boolean;
} = {}) {
  const [ref, isInView] = useInView();
  const { min, ticks } = zoom ? ZOOM_AXIS : FULL_AXIS;
  const pct = (v: number) => ((v - min) / (AXIS_MAX - min)) * 100;

  return (
    <div ref={ref} className="flex flex-1 flex-col text-black">
      <div className="rounded-t-lg bg-[#eef1f8] px-5 py-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em]">
          Measured focus
        </p>
        <p className="mt-1 text-lg font-bold leading-snug">
          Sharper focus on CONKA
        </p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <p
          className="font-bold leading-none tabular-nums"
          style={{ color: GREEN, fontSize: "clamp(3rem, 14vw, 4.25rem)" }}
        >
          +19.3%
        </p>

        {/* Plot: y-axis labels on the left, gridlines behind, bars from 0. */}
        <div className="mt-6 flex min-h-[170px] flex-1 gap-2">
          <div className="relative w-7 shrink-0">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute right-0 translate-y-1/2 text-[11px] font-medium tabular-nums text-black/55"
                style={{ bottom: `${pct(t)}%` }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="relative flex-1 border-b border-l border-black/25">
            {ticks.slice(1).map((t) => (
              <span
                key={t}
                aria-hidden
                className="absolute inset-x-0 border-t border-dashed border-black/10"
                style={{ bottom: `${pct(t)}%` }}
              />
            ))}
            <div className="absolute inset-0 flex items-end justify-around px-3">
              {BARS.map((b) => (
                <div
                  key={b.label}
                  className="relative flex h-full w-[36%] items-end"
                >
                  <div
                    className="relative w-full rounded-t-md motion-safe:[transition:height_1s_cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      height: isInView ? `${pct(b.value)}%` : 0,
                      background: b.conka ? NAVY : "rgba(0,0,0,0.16)",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <span className="w-7 shrink-0" aria-hidden />
          <div className="flex flex-1 justify-around px-3">
            {BARS.map((b) => (
              <span
                key={b.label}
                className={`w-[36%] text-center text-[13px] ${
                  b.conka ? "font-bold" : "font-medium"
                }`}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[11.5px] font-medium text-black/60">
          Focus score, baseline indexed to 100
          {showSource ? ". From a trial of professional athletes." : ""}
        </p>
      </div>
    </div>
  );
}
