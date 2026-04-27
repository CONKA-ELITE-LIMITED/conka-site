"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PhoneFrame } from "./AppStickyPhoneBlock";
import {
  SECTIONS_DATA,
  SECTION_TAB_LABELS,
  PHONE_SOURCES,
  type SectionData,
} from "./appStickyPhoneBlockData";

const SWIPE_THRESHOLD_PX = 50;

const PHONE_ALT_LABELS = [
  "Cognitive test screen",
  "Wellness and metrics",
  "Progress graph",
  "Leaderboard",
];

const FIG_LABELS = [
  "Fig. 02 · Cognitive test",
  "Fig. 03 · Wellness log",
  "Fig. 04 · Progress graph",
  "Fig. 05 · Leaderboard",
];

function ChamferNav({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous section" : "Next section"}
      onClick={onClick}
      disabled={disabled}
      className="w-11 h-11 flex items-center justify-center bg-[#1B2757] text-white transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] lab-clip-tr"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <polyline
          points={direction === "prev" ? "15 6 9 12 15 18" : "9 6 15 12 9 18"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  );
}

function StatCard({
  value,
  label,
  source,
}: {
  value: string;
  label: string;
  source?: string;
}) {
  return (
    <div className="bg-white border border-black/12 p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
        {label}
      </p>
      <p className="font-mono text-xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
        {value}
      </p>
      {source && (
        <p className="font-mono text-[8px] text-black/45 mt-2 leading-tight tabular-nums">
          {source}
        </p>
      )}
    </div>
  );
}

function MobileSectionContent({
  data,
  contentVisible,
}: {
  data: SectionData;
  contentVisible: boolean;
}) {
  const headingParts = data.heading.split("<br/>").filter(Boolean);
  return (
    <div
      className="flex flex-col items-start text-left"
      style={{
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      <h3
        className="text-[1.35rem] font-medium text-black leading-tight max-w-[22ch] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        {headingParts.map((line, i) => (
          <span key={i}>
            {line}
            {i < headingParts.length - 1 && <br />}
          </span>
        ))}
      </h3>
      <p className="text-sm text-black/75 leading-relaxed mb-3">{data.body}</p>
      {data.footnote && (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {data.footnote}
        </p>
      )}
      {data.stats && data.stats.length > 0 && (
        <>
          <div className="w-full grid grid-cols-2 gap-2 mt-5">
            {data.stats.map((s, i) => (
              <StatCard key={i} value={s.value} label={s.label} source={s.source} />
            ))}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums mt-4">
            NHS Memory Clinics · Cambridge-derived · FDA cleared
          </p>
        </>
      )}
    </div>
  );
}

export function AppStickyPhoneBlockMobile() {
  const numSections = SECTIONS_DATA.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const prevIndexRef = useRef(0);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevIndexRef.current === activeIndex) return;
    prevIndexRef.current = activeIndex;
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 180);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const handleSwipeStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleSwipeEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartXRef.current;
      touchStartXRef.current = null;
      if (start === null) return;
      const end = e.changedTouches[0].clientX;
      const deltaX = end - start;
      if (deltaX < -SWIPE_THRESHOLD_PX) {
        setActiveIndex((i) => Math.min(i + 1, numSections - 1));
      } else if (deltaX > SWIPE_THRESHOLD_PX) {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    },
    [numSections]
  );

  const counter = `${String(activeIndex + 1).padStart(2, "0")} / ${String(numSections).padStart(2, "0")}`;

  return (
    <section
      className="w-full bg-white"
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      }}
      aria-label="CONKA app feature walkthrough"
    >
      <div className="mx-auto w-full max-w-[var(--brand-max-width)]">
        {/* Trio header */}
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
            {"// Four features · APP-01"}
          </p>
          <h2
            className="brand-h2 text-black mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            Four features. One outcome.
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
            Swipe · Tap arrows · Tap dots
          </p>
        </div>

        {/* Section label + counter */}
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B2757] tabular-nums">
            {SECTION_TAB_LABELS[activeIndex]}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
            {counter}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-px w-full bg-black/10 mb-6 relative overflow-hidden">
          <div
            className="h-full bg-[#1B2757] transition-[width] duration-300 ease-out"
            style={{ width: `${((activeIndex + 1) / numSections) * 100}%` }}
          />
        </div>

        {/* Phone mockup with nav */}
        <div
          className="flex items-center justify-center gap-3 mb-6"
          onTouchStart={handleSwipeStart}
          onTouchEnd={handleSwipeEnd}
          role="region"
          aria-label="Swipe left or right to change section"
        >
          <ChamferNav
            direction="prev"
            onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
            disabled={activeIndex === 0}
          />
          <div className="flex-1 flex justify-center">
            <PhoneFrame
              sources={PHONE_SOURCES}
              activeIndex={activeIndex}
              altLabels={PHONE_ALT_LABELS}
              figLabel={FIG_LABELS[activeIndex]}
              size="mobile"
            />
          </div>
          <ChamferNav
            direction="next"
            onClick={() => setActiveIndex((i) => Math.min(i + 1, numSections - 1))}
            disabled={activeIndex === numSections - 1}
          />
        </div>

        {/* Content */}
        <MobileSectionContent
          data={SECTIONS_DATA[activeIndex]}
          contentVisible={contentVisible}
        />

        {/* Tab roster */}
        <div className="mt-8 grid grid-cols-2 gap-2">
          {SECTION_TAB_LABELS.map((label, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`text-left font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-[#1B2757] text-white"
                    : "bg-white border border-black/12 text-black/55 hover:border-black/25"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AppStickyPhoneBlockMobile;
