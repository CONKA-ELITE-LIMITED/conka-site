"use client";

import { useInView } from "@/app/hooks/useInView";
import { CoffeeIcon, BottleIcon } from "./CrashChart";

/* ============================================================================
 * ScoreByGroup
 *
 * "Average cognitive score by group" — the 4-group comparison from the CONKA
 * app data report (Neither / Coffee / CONKA / CONKA + coffee). The two CONKA
 * groups render in green so "with CONKA = higher" reads instantly; the two
 * without-CONKA groups are muted grey. Bars grow on first view (motion-safe).
 *
 * Bars use a tightened baseline (75) so the real difference is visible at a
 * glance; the true average is printed on every bar. Message-first, per the
 * brief: coffee scored no better than nothing, the lift tracks CONKA.
 * ========================================================================== */

const GREEN = "#2FA84F";
const BASE = 75;
const TOP = 88;
const MAX_BAR_PX = 150;

const GREY = "rgba(0,0,0,0.4)";

interface Group {
  label: string;
  value: number;
  conka: boolean;
  icon: "none" | "coffee" | "bottle" | "both";
}

const GROUPS: Group[] = [
  { label: "Nothing", value: 81, conka: false, icon: "none" },
  { label: "Coffee", value: 81, conka: false, icon: "coffee" },
  { label: "CONKA", value: 85, conka: true, icon: "bottle" },
  { label: "CONKA + coffee", value: 86, conka: true, icon: "both" },
];

/** Crash-chart coffee/bottle icons, coloured to match the bars. */
function GroupIcon({ icon }: { icon: Group["icon"] }) {
  if (icon === "none") return <span className="h-5" aria-hidden />;
  if (icon === "coffee") return <CoffeeIcon stroke={GREY} />;
  if (icon === "bottle") return <BottleIcon stroke={GREEN} />;
  return (
    <span className="flex items-center gap-1">
      <BottleIcon stroke={GREEN} />
      <CoffeeIcon stroke={GREY} />
    </span>
  );
}

export default function ScoreByGroup() {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-black/10 bg-white p-6 md:p-7"
    >
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
        Measured in the CONKA app
      </p>
      <h3 className="mb-6 text-lg font-bold text-[#1d1d1d]">
        Average cognitive score by group
      </h3>

      <div className="flex items-end justify-between gap-2 sm:gap-3">
        {GROUPS.map((g) => {
          const frac = Math.max(0, (g.value - BASE) / (TOP - BASE));
          return (
            <div key={g.label} className="flex flex-1 flex-col items-center">
              <span
                className="mb-1.5 text-[15px] font-extrabold tabular-nums"
                style={{ color: g.conka ? GREEN : "rgba(0,0,0,0.45)" }}
              >
                {g.value}
              </span>
              <div
                className="w-full rounded-t-lg motion-safe:[transition:height_1s_cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  height: isInView ? `${Math.round(frac * MAX_BAR_PX)}px` : 0,
                  background: g.conka
                    ? `linear-gradient(180deg, ${GREEN}, #279247)`
                    : "rgba(0,0,0,0.14)",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2.5 flex justify-between gap-2 sm:gap-3">
        {GROUPS.map((g) => (
          <span
            key={g.label}
            className={`flex flex-1 flex-col items-center gap-1.5 text-center text-[11px] leading-tight ${
              g.conka ? "font-semibold text-[#1d1d1d]" : "text-black/45"
            }`}
          >
            <GroupIcon icon={g.icon} />
            {g.label}
          </span>
        ))}
      </div>

      <p className="mt-6 text-[15px] font-semibold leading-snug text-[#1d1d1d]">
        Coffee scored no better than nothing. The lift came from CONKA.
      </p>
    </div>
  );
}
