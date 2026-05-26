"use client";

import Link from "next/link";
import { useState } from "react";
import { useInView } from "@/app/hooks/useInView";
import CROPillCTA from "@/app/components/cro/CROPillCTA";

/* ============================================================================
 * LandingValueComparisonV2
 *
 * V2 of the Coffee vs CONKA comparison for the /start landing page.
 * Two horizontal bars that animate fill on scroll-in.
 *
 *   Coffee: short fill (0 - 50% of day), peak then hatched crash tail.
 *   CONKA Flow + Clear: long smooth fill (0 - 90% of day), navy.
 *
 * Track represents the productive day, 9am to 7pm (10 hours).
 * No hour-by-hour ticks; three labelled time markers per bar.
 * ========================================================================== */

const COFFEE_COLOR = "#000";
const COFFEE_CRASH_BG = "rgba(220, 38, 38, 0.18)";
const COFFEE_CRASH_PATTERN =
  "repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.65) 0 3px, transparent 3px 7px)";
const CONKA_COLOR = "#1B2757";

// Track represents 9am-6pm (9 hours). CONKA fills the whole day.
// Coffee: peak 9am-12pm = 33%, crash 12pm-2pm = 56%
const COFFEE_PEAK_END = 33;
const COFFEE_CRASH_END = 56;
const CONKA_END = 100;

interface BarProps {
  isInView: boolean;
  prefersReducedMotion: boolean;
}

function CoffeeBar({ isInView, prefersReducedMotion }: BarProps) {
  const transformVisible = "scaleX(1)";
  const transformHidden = "scaleX(0)";
  const visible = prefersReducedMotion || isInView;

  const peakStyle: React.CSSProperties = {
    left: "0%",
    width: `${COFFEE_PEAK_END}%`,
    backgroundColor: COFFEE_COLOR,
    transform: visible ? transformVisible : transformHidden,
    transformOrigin: "left",
    transition: prefersReducedMotion
      ? "none"
      : "transform 800ms cubic-bezier(0.65, 0, 0.35, 1)",
  };

  const crashStyle: React.CSSProperties = {
    left: `${COFFEE_PEAK_END}%`,
    width: `${COFFEE_CRASH_END - COFFEE_PEAK_END}%`,
    backgroundColor: COFFEE_CRASH_BG,
    backgroundImage: COFFEE_CRASH_PATTERN,
    transform: visible ? transformVisible : transformHidden,
    transformOrigin: "left",
    transition: prefersReducedMotion
      ? "none"
      : "transform 800ms cubic-bezier(0.65, 0, 0.35, 1) 400ms",
  };

  return (
    <>
      <div className="absolute inset-y-0" style={peakStyle} aria-hidden />
      <div className="absolute inset-y-0" style={crashStyle} aria-hidden />
    </>
  );
}

function ConkaBar({ isInView, prefersReducedMotion }: BarProps) {
  const visible = prefersReducedMotion || isInView;

  const style: React.CSSProperties = {
    left: "0%",
    width: `${CONKA_END}%`,
    backgroundColor: CONKA_COLOR,
    transform: visible ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: "left",
    transition: prefersReducedMotion
      ? "none"
      : "transform 1200ms cubic-bezier(0.65, 0, 0.35, 1) 220ms",
  };

  return <div className="absolute inset-y-0" style={style} aria-hidden />;
}

interface Marker {
  pct: number;
  text: string;
}

interface BarRowProps {
  label: string;
  markers: Marker[];
  ariaLabel: string;
  crashLabel?: { pct: number; text: string };
  children: React.ReactNode;
}

function BarRow({
  label,
  markers,
  ariaLabel,
  crashLabel,
  children,
}: BarRowProps) {
  return (
    <div>
      <p className="text-[13px] font-bold text-black/85 mb-2 uppercase tracking-wide">
        {label}
      </p>
      <div
        className="relative h-3.5 rounded-full bg-black/[0.04] overflow-hidden"
        role="img"
        aria-label={ariaLabel}
      >
        {children}
      </div>
      {crashLabel && (
        <div className="relative h-4 mt-1.5" aria-hidden>
          <span
            className="absolute top-0 text-[10px] font-bold uppercase tracking-[0.1em] text-[#dc2626]"
            style={{
              left: `${crashLabel.pct}%`,
              transform: "translateX(-50%)",
            }}
          >
            {crashLabel.text}
          </span>
        </div>
      )}
      <div className="relative h-5 mt-2" aria-hidden>
        {markers.map((m) => (
          <span
            key={m.text}
            className="absolute top-0 text-[12px] text-black/55 tabular-nums"
            style={{
              left: `${m.pct}%`,
              transform:
                m.pct === 0
                  ? "translateX(0)"
                  : m.pct >= 100
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
            }}
          >
            {m.text}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function LandingValueComparisonV2() {
  const [ref, isInView] = useInView();
  // Lazy initializer: dynamic-imported with ssr:false on /start, so this runs
  // client-side on first mount. Falls back to false in any SSR scenario.
  const [prefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  return (
    <div ref={ref} className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        The 2pm crash isn&apos;t you.
      </h2>

      <p className="text-[15px] leading-snug text-black mb-10">
        Coffee gets you started. CONKA gets you through.
      </p>

      <div className="space-y-8 mb-8">
        <BarRow
          label="Coffee"
          markers={[
            { pct: 0, text: "9am" },
            { pct: COFFEE_PEAK_END, text: "12pm" },
            { pct: COFFEE_CRASH_END, text: "2pm" },
          ]}
          crashLabel={{
            pct: (COFFEE_PEAK_END + COFFEE_CRASH_END) / 2,
            text: "↑ Crash",
          }}
          ariaLabel="Coffee provides focus from 9am to noon, then crashes through to 2pm."
        >
          <CoffeeBar
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
          />
        </BarRow>

        <BarRow
          label="CONKA Flow + Clear"
          markers={[
            { pct: 0, text: "9am" },
            { pct: 44, text: "1pm" },
            { pct: CONKA_END, text: "6pm" },
          ]}
          ariaLabel="CONKA Flow and Clear provide steady focus across the whole day, from 9am through to 6pm."
        >
          <ConkaBar
            isInView={isInView}
            prefersReducedMotion={prefersReducedMotion}
          />
        </BarRow>
      </div>

      <CROPillCTA className="w-full">Try from £1.62 per day</CROPillCTA>

      <p className="text-[12px] text-black/55 leading-snug mt-6">
        Based on 7,593 cognitive tests across 712 CONKA app users over 30
        months.{" "}
        <Link
          href="/app-insights#time-of-day"
          className="underline underline-offset-2 text-black/70 hover:text-[#1B2757] transition-colors"
        >
          See the full data
        </Link>
      </p>
    </div>
  );
}
