"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PhoneFrame } from "./AppStickyPhoneBlock";
import {
  SECTIONS_DATA,
  SECTION_TAB_LABELS,
  PHONE_SOURCES,
  PHONE_ALT_LABELS,
  FIG_LABELS,
} from "./appStickyPhoneBlockData";

const SWIPE_THRESHOLD_PX = 50;

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
      className="w-11 h-11 flex items-center justify-center bg-white/10 border border-white/15 text-white transition-opacity hover:opacity-85 active:opacity-70 disabled:opacity-25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/30 lab-clip-tr"
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

function MobileSectionContent({
  data,
  contentVisible,
}: {
  data: { heading: string; body: string };
  contentVisible: boolean;
}) {
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
        className="text-[1.35rem] font-medium text-white leading-tight max-w-[22ch] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        {data.heading}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed">{data.body}</p>
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
      className="w-full"
      style={{
        paddingTop: "5rem",
        paddingBottom: "5rem",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      }}
      aria-label="CONKA app feature walkthrough"
    >
      <div className="mx-auto w-full max-w-[var(--brand-max-width)]">
        {/* Header */}
        <div className="mb-6">
          <h2
            className="brand-h2 text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Four features. One outcome.
          </h2>
        </div>

        {/* Section label + counter */}
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/75 tabular-nums">
            {SECTION_TAB_LABELS[activeIndex]}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 tabular-nums">
            {counter}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-px w-full bg-white/12 mb-6 relative overflow-hidden">
          <div
            className="h-full bg-white transition-[width] duration-300 ease-out"
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
        <div className="mt-8 grid grid-cols-3 gap-2">
          {SECTION_TAB_LABELS.map((label, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`text-center font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "border border-white/15 text-white/45 hover:border-white/30"
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
