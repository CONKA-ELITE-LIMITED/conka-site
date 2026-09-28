"use client";

import { useInView } from "@/app/hooks/useInView";
import { BottleIcon } from "./CrashChart";

/* ============================================================================
 * FocusBars
 *
 * Simple two-bar comparison: focus off CONKA vs on CONKA. The On-CONKA bar is
 * the verified +19.3% taller (honest proportions, no tightened baseline) with
 * the delta called out in green. Matches ScoreByGroup's bar language so the
 * green = with-CONKA = higher reading stays consistent across the page.
 * ========================================================================== */

// Listicle palette: navy is CONKA, grey the baseline, green only on the delta.
const NAVY = "#1B2757";
const GREEN = "var(--brand-positive, #1a7f4f)";
const MAX_BAR_PX = 150;
// Honest proportions: On CONKA is +19.3% over the Off baseline.
const OFF_FRAC = 0.62;
const ON_FRAC = OFF_FRAC * 1.193;

const BARS = [
  { label: "Off CONKA", frac: OFF_FRAC, conka: false },
  { label: "On CONKA", frac: ON_FRAC, conka: true },
];

export default function FocusBars() {
  const [ref, isInView] = useInView();

  return (
    // No card chrome: the listicle frame supplies border, radius and padding.
    <div ref={ref}>
      <p className="mb-1 text-[12px] font-semibold text-black/50">
        Measured focus
      </p>
      <h3 className="mb-6 text-lg font-bold text-[#1d1d1d]">
        Sharper focus on CONKA
      </h3>

      <div className="mx-auto flex max-w-[320px] items-end justify-center gap-8">
        {BARS.map((b) => (
          <div key={b.label} className="flex flex-1 flex-col items-center">
            {b.conka ? (
              <span
                className="mb-1.5 rounded-full px-2 py-0.5 text-[12px] font-extrabold text-white"
                style={{ background: GREEN }}
              >
                +19.3%
              </span>
            ) : (
              <span className="mb-1.5 h-[22px]" aria-hidden />
            )}
            <div
              className="w-full rounded-t-lg motion-safe:[transition:height_1s_cubic-bezier(0.4,0,0.2,1)]"
              style={{
                height: isInView ? `${Math.round(b.frac * MAX_BAR_PX)}px` : 0,
                background: b.conka ? NAVY : "rgba(0,0,0,0.14)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-2.5 flex max-w-[320px] justify-center gap-8">
        {BARS.map((b) => (
          <span
            key={b.label}
            className={`flex flex-1 flex-col items-center gap-1.5 text-center text-[12px] ${
              b.conka ? "font-semibold text-[#1d1d1d]" : "text-black/45"
            }`}
          >
            {b.conka ? (
              <span className="flex items-center gap-1">
                <BottleIcon stroke={NAVY} />
                <BottleIcon stroke={NAVY} />
              </span>
            ) : (
              <span className="h-5" aria-hidden />
            )}
            {b.label}
          </span>
        ))}
      </div>

      <p className="mt-6 text-[12px] leading-snug text-black/50">
        *+19.3% sharper focus vs baseline, from a trial of professional athletes.
      </p>
    </div>
  );
}
