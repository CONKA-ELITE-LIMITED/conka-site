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
    ariaLabel: "Time of day report",
  },
  {
    id: "mental-fatigue",
    label: "What does fatigue actually cost you?",
    ariaLabel: "Mental fatigue and readiness report",
  },
  {
    id: "stress",
    label: "How much is stress taking a toll on you?",
    ariaLabel: "Stress report",
  },
  {
    id: "alcohol",
    label: "What does a hangover do to your brain?",
    ariaLabel: "Alcohol and hangover report",
  },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

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
        <div className="brand-track">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 tabular-nums mb-3">
            {"// Filter by question"}
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => select(f.id)}
                  aria-pressed={isActive}
                  className={[
                    "px-4 py-3 text-[13px] font-mono tracking-wide border text-left transition-colors min-h-[44px]",
                    isActive
                      ? "border-white bg-white/10 text-white"
                      : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80",
                  ].join(" ")}
                >
                  {f.label}
                </button>
              );
            })}
            {active !== null && (
              <button
                onClick={() => setActive(null)}
                className="px-4 py-3 text-[13px] font-mono tracking-wide border border-white/12 text-white/35 hover:text-white/60 hover:border-white/25 transition-colors min-h-[44px]"
              >
                Clear
              </button>
            )}
          </div>
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
