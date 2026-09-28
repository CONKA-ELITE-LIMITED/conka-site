"use client";

import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * FocusBars
 *
 * Listicle chart tile: a tinted title banner across the top, then the figure
 * large, then the two bars filling the rest of the frame. Focus off CONKA vs on
 * CONKA; the On bar is the verified +19.3% taller (honest proportions, no
 * tightened baseline). Navy is CONKA, grey the baseline, green only on the
 * figure. Copy is black throughout: grey read as unsure.
 *
 * Fills its parent: the listicle frame is a flex column, this is `flex-1`.
 * ========================================================================== */

const NAVY = "#1B2757";
const GREEN = "var(--brand-positive, #1a7f4f)";
// Honest proportions: On CONKA is +19.3% over the Off baseline.
const OFF_FRAC = 0.7;
const ON_FRAC = OFF_FRAC * 1.193;

const BARS = [
  { label: "Off CONKA", frac: OFF_FRAC, conka: false },
  { label: "On CONKA", frac: ON_FRAC, conka: true },
];

export default function FocusBars() {
  const [ref, isInView] = useInView();

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
          style={{ color: GREEN, fontSize: "clamp(3.25rem, 15vw, 4.5rem)" }}
        >
          +19.3%
        </p>
        <p className="mt-1.5 text-[15px] font-semibold">
          focus vs baseline
        </p>

        <div className="mt-6 flex min-h-[140px] flex-1 items-end gap-6">
          {BARS.map((b) => (
            <div
              key={b.label}
              className="w-full rounded-t-lg motion-safe:[transition:height_1s_cubic-bezier(0.4,0,0.2,1)]"
              style={{
                height: isInView ? `${Math.round(b.frac * 100)}%` : 0,
                background: b.conka ? NAVY : "rgba(0,0,0,0.14)",
              }}
            />
          ))}
        </div>
        <div className="mt-2.5 flex gap-6">
          {BARS.map((b) => (
            <span
              key={b.label}
              className={`flex-1 text-center text-[13px] ${
                b.conka ? "font-bold" : "font-medium"
              }`}
            >
              {b.label}
            </span>
          ))}
        </div>

        <p className="mt-4 border-t border-black/10 pt-3 text-[12px] leading-snug">
          From a trial of professional athletes.
        </p>
      </div>
    </div>
  );
}
