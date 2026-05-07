"use client";

import { useState } from "react";
import TimeOfDaySection from "@/app/app-insights/sections/TimeOfDaySection";
import MentalFatigueSection from "@/app/app-insights/sections/MentalFatigueSection";
import StressSection from "@/app/app-insights/sections/StressSection";
import AlcoholSection from "@/app/app-insights/sections/AlcoholSection";

const FILTERS = [
  {
    id: "time-of-day",
    label: "How does performance change through the day?",
    shortLabel: "Time of day",
    ariaLabel: "Time of day report",
  },
  {
    id: "mental-fatigue",
    label: "What does fatigue actually cost you?",
    shortLabel: "Fatigue",
    ariaLabel: "Mental fatigue and readiness report",
  },
  {
    id: "stress",
    label: "How much is stress taking a toll on you?",
    shortLabel: "Stress",
    ariaLabel: "Stress report",
  },
  {
    id: "alcohol",
    label: "What does a hangover do to your brain?",
    shortLabel: "Alcohol",
    ariaLabel: "Alcohol and hangover report",
  },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

function XIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1L11 11M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function InsightFilteredSections() {
  const [active, setActive] = useState<FilterId | null>(null);

  function select(id: FilterId) {
    setActive((prev) => (prev === id ? null : id));
  }

  const show = (id: FilterId) => active === null || active === id;

  return (
    <>
      {/* Filter bar */}
      <section className="pt-2 pb-8 lg:pb-10" aria-label="Filter reports by question">
        <div className="brand-track flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 tabular-nums">
            {"// Filter by question"}
          </p>

          {/* 4-col equal-width grid — short labels on mobile, full labels on sm+ */}
          <div className="grid grid-cols-4 gap-2">
            {FILTERS.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => select(f.id)}
                  aria-pressed={isActive}
                  className={[
                    "px-2 sm:px-4 py-3 font-mono tracking-wide border text-left transition-colors min-h-[44px]",
                    "text-[10px] sm:text-[12px]",
                    isActive
                      ? "border-white bg-white/[0.12] text-white"
                      : "border-white/[0.12] text-white/25 hover:border-white/30 hover:text-white/55",
                  ].join(" ")}
                >
                  <span className="block sm:hidden">{f.shortLabel}</span>
                  <span className="hidden sm:block leading-snug">{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Clear filter — only visible when a filter is active */}
          {active !== null && (
            <button
              onClick={() => setActive(null)}
              className="flex items-center gap-2.5 w-full px-4 py-3 border border-white text-white font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-white/10 transition-colors min-h-[44px]"
            >
              <XIcon />
              Clear filter
            </button>
          )}
        </div>
      </section>

      {/* Report sections — unmount hidden ones so charts don't render offscreen */}
      {show("time-of-day") && (
        <section className="brand-section" aria-label="Time of day report">
          <div className="brand-track">
            <TimeOfDaySection />
          </div>
        </section>
      )}

      {show("mental-fatigue") && (
        <section className="brand-section" aria-label="Mental fatigue and readiness report">
          <div className="brand-track">
            <MentalFatigueSection />
          </div>
        </section>
      )}

      {show("stress") && (
        <section className="brand-section" aria-label="Stress report">
          <div className="brand-track">
            <StressSection />
          </div>
        </section>
      )}

      {show("alcohol") && (
        <section className="brand-section" aria-label="Alcohol and hangover report">
          <div className="brand-track">
            <AlcoholSection />
          </div>
        </section>
      )}
    </>
  );
}
