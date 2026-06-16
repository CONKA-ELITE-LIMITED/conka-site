"use client";

import { useRef, useState } from "react";
import { gsap } from "@/app/lib/motion";
import { usePrefersReducedMotion } from "@/app/hooks/usePrefersReducedMotion";
import TimeOfDaySection from "@/app/app-insights/sections/TimeOfDaySection";
import MentalFatigueSection from "@/app/app-insights/sections/MentalFatigueSection";
import StressSection from "@/app/app-insights/sections/StressSection";
import AlcoholSection from "@/app/app-insights/sections/AlcoholSection";
import CoffeeSection from "@/app/app-insights/sections/CoffeeSection";
import InsightTldrStrip from "./InsightTldrStrip";
import MethodologyInThirtySeconds from "./MethodologyInThirtySeconds";

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
  {
    id: "coffee",
    label: "Coffee, CONKA, or both?",
    shortLabel: "Coffee",
    ariaLabel: "Coffee versus CONKA report",
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
  const canvasRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  /**
   * Switching instruments, not swapping divs: the report canvas reads
   * down briefly, the selection changes, then the new reading rises in.
   */
  function applyFilter(next: FilterId | null) {
    const canvas = canvasRef.current;
    if (prefersReduced || !canvas) {
      setActive(next);
      return;
    }
    gsap.to(canvas, {
      autoAlpha: 0,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActive(next);
        requestAnimationFrame(() => {
          gsap.fromTo(
            canvas,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" },
          );
        });
      },
    });
  }

  function select(id: FilterId) {
    applyFilter(active === id ? null : id);
  }

  function focusReport(id: FilterId) {
    // Clear any active filter so all sections render, then scroll to the
    // requested section once the DOM has updated.
    setActive(null);
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  const show = (id: FilterId) => active === null || active === id;

  return (
    <>
      {/* TL;DR strip + methodology — sits above the filter */}
      <section
        className="pt-2 pb-6 lg:pb-8 px-5 lg:px-[5vw]"
        aria-label="Report summary and methodology"
      >
        <div className="brand-track flex flex-col gap-6">
          <InsightTldrStrip onSelect={focusReport} />
          <MethodologyInThirtySeconds />
        </div>
      </section>

      {/* Filter bar — uses brand gutters so it never sits flush on mobile */}
      <section
        className="pt-2 pb-8 lg:pb-10 px-5 lg:px-[5vw]"
        aria-label="Filter reports by question"
      >
        <div className="brand-track flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 tabular-nums mb-3">
            {"// Filter by question"}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {FILTERS.map((f) => {
              const isActive = active === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => select(f.id)}
                  aria-pressed={isActive}
                  className={[
                    "group px-2 sm:px-4 py-3 font-mono tracking-wide text-left transition-colors min-h-[44px] border",
                    "text-[10px] sm:text-[12px]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
                    isActive
                      ? "bg-white text-[#0a0a0a] border-white"
                      : "bg-transparent text-white/75 border-white/25 hover:border-white/70 hover:text-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mb-1.5 block w-1.5 h-1.5 rounded-full transition-colors",
                      isActive
                        ? "bg-[#0a0a0a]"
                        : "border border-white/55 group-hover:border-white",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="block sm:hidden">{f.shortLabel}</span>
                  <span className="hidden sm:block leading-snug">{f.label}</span>
                </button>
              );
            })}
          </div>

          {active !== null && (
            <button
              onClick={() => applyFilter(null)}
              className="flex items-center gap-2.5 w-full px-4 py-3 border border-white text-white font-mono text-[11px] uppercase tracking-[0.18em] hover:bg-white/10 transition-colors min-h-[44px]"
            >
              <XIcon />
              Clear filter
            </button>
          )}
        </div>
      </section>

      {/* Report sections — unmount hidden ones so charts don't render offscreen */}
      <div ref={canvasRef}>
        {show("time-of-day") && (
          <section id="time-of-day" className="brand-section scroll-mt-24" aria-label="Time of day report">
            <div className="brand-track">
              <TimeOfDaySection />
            </div>
          </section>
        )}

        {show("mental-fatigue") && (
          <section id="mental-fatigue" className="brand-section scroll-mt-24" aria-label="Mental fatigue and readiness report">
            <div className="brand-track">
              <MentalFatigueSection />
            </div>
          </section>
        )}

        {show("stress") && (
          <section id="stress" className="brand-section scroll-mt-24" aria-label="Stress report">
            <div className="brand-track">
              <StressSection />
            </div>
          </section>
        )}

        {show("alcohol") && (
          <section id="alcohol" className="brand-section scroll-mt-24" aria-label="Alcohol and hangover report">
            <div className="brand-track">
              <AlcoholSection />
            </div>
          </section>
        )}

        {show("coffee") && (
          <section id="coffee" className="brand-section scroll-mt-24" aria-label="Coffee versus CONKA report">
            <div className="brand-track">
              <CoffeeSection />
            </div>
          </section>
        )}
      </div>
    </>
  );
}
