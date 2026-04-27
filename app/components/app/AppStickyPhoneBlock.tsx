"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useIsMobile from "@/app/hooks/useIsMobile";
import { AppStickyPhoneBlockMobile } from "./AppStickyPhoneBlockMobile";
import { SECTIONS_DATA, PHONE_SOURCES, SECTION_TAB_LABELS, type SectionData } from "./appStickyPhoneBlockData";

const SCROLL_MULTIPLIER = 0.85;

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

// ─── useScrollTrack hook ──────────────────────────────────────────────────────

function useScrollTrack(
  ref: React.RefObject<HTMLDivElement | null>,
  numSections: number,
  disabled: boolean
): { activeIndex: number; sectionProgress: number } {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const track = ref.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight;
    const viewportH = window.innerHeight;

    const scrolled = -rect.top;
    const scrollable = trackHeight - viewportH;

    if (scrolled < 0 || scrollable <= 0) return;
    if (scrolled > scrollable) {
      setActiveIndex(numSections - 1);
      setSectionProgress(1);
      return;
    }

    const t = scrolled / scrollable;
    const rawIndex = t * numSections;
    const newIndex = Math.min(Math.floor(rawIndex), numSections - 1);
    const newProgress = rawIndex - Math.floor(rawIndex);

    setActiveIndex(newIndex);
    setSectionProgress(newProgress);
  }, [ref, numSections]);

  useEffect(() => {
    if (disabled) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disabled, handleScroll]);

  if (disabled) return { activeIndex: 0, sectionProgress: 0 };
  return { activeIndex, sectionProgress };
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

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
    <div className="bg-white border border-black/12 p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
        {label}
      </p>
      <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
        {value}
      </p>
      {source && (
        <p className="font-mono text-[9px] text-black/45 mt-3 leading-tight tabular-nums">
          {source}
        </p>
      )}
    </div>
  );
}

// ─── SectionContent ───────────────────────────────────────────────────────────

function SectionContent({
  data,
  sectionNumber,
  totalSections,
}: {
  data: SectionData;
  sectionNumber: number;
  totalSections: number;
}) {
  const headingParts = data.heading.split("<br/>").filter(Boolean);
  const counter = `${String(sectionNumber).padStart(2, "0")} / ${String(totalSections).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-start text-left">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
        {counter} · {data.eyebrow ? data.eyebrow : "App Feature · Measurable"}
      </p>
      <h2
        className="brand-h2 text-black mb-3 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        {headingParts.map((line, i) => (
          <span key={i}>
            {line}
            {i < headingParts.length - 1 && <br />}
          </span>
        ))}
      </h2>
      <p className="text-sm md:text-base text-black/75 leading-relaxed max-w-xl mb-3">
        {data.body}
      </p>
      {data.footnote && (
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums max-w-xl">
          {data.footnote}
        </p>
      )}
      {data.stats && data.stats.length > 0 && (
        <>
          <div className="w-full grid grid-cols-2 gap-3 mt-6 max-w-xl">
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

// ─── PhoneFrame (exported for reuse) ──────────────────────────────────────────

export function PhoneFrame({
  sources,
  activeIndex,
  altLabels,
  figLabel,
  size = "desktop",
}: {
  sources: readonly string[];
  activeIndex: number;
  altLabels?: string[];
  figLabel?: string;
  size?: "desktop" | "mobile";
}) {
  const isMobile = size === "mobile";
  const frameWidth = isMobile
    ? "clamp(280px, 78vw, 360px)"
    : "clamp(380px, 30vw, 480px)";
  const imgInsetClass = isMobile
    ? "top-10 right-3 bottom-10 left-20"
    : "top-16 right-6 bottom-16 left-32";

  return (
    <div className="relative flex justify-center items-center">
      <div
        className="relative bg-[#f5f5f5] border border-black/12 overflow-hidden"
        style={{
          width: frameWidth,
          aspectRatio: "4/5",
        }}
      >
        {/* Fig plate — sits in the empty left zone, clear of the phone */}
        {figLabel && (
          <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-3 py-1.5 tabular-nums z-10">
            {figLabel}
          </div>
        )}

        {/* Phone images, inset from frame edges */}
        {sources.map((src, i) => {
          const isActive = i === activeIndex;
          return (
            <img
              key={src}
              src={src}
              alt={altLabels?.[i] ?? `App screen ${i + 1}`}
              className={`absolute ${imgInsetClass} object-contain object-right`}
              style={{
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AppStickyPhoneBlock() {
  const isMobile = useIsMobile(1024);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const numSections = SECTIONS_DATA.length;

  const { activeIndex, sectionProgress } = useScrollTrack(
    scrollTrackRef,
    numSections,
    isMobile === true
  );

  const [contentVisible, setContentVisible] = useState(true);
  const prevIndexRef = useRef(activeIndex);

  useEffect(() => {
    if (prevIndexRef.current === activeIndex) return;
    prevIndexRef.current = activeIndex;
    setContentVisible(false);
    const t = setTimeout(() => setContentVisible(true), 180);
    return () => clearTimeout(t);
  }, [activeIndex]);

  const trackHeightVh = numSections * SCROLL_MULTIPLIER * 100;
  const overallProgress = numSections > 0 ? ((activeIndex + sectionProgress) / numSections) * 100 : 0;

  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      const track = scrollTrackRef.current;
      if (!track) return;
      const trackHeight = track.offsetHeight;
      const targetTop = track.offsetTop + sectionIndex * (trackHeight / numSections);
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    },
    [numSections]
  );

  // ─── Mobile: separate component ──────────────────────────────────────────────
  if (isMobile === true || isMobile === undefined) {
    return <AppStickyPhoneBlockMobile />;
  }

  // ─── Desktop: scroll track + sticky panel (clinical) ─────────────────────────
  return (
    <div
      ref={scrollTrackRef}
      className="relative w-full bg-white"
      style={{ height: `${trackHeightVh}vh` }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden bg-white flex flex-col"
        style={{ height: "100vh" }}
      >
        {/* Trio header strip */}
        <div className="relative z-[2] w-full px-[5vw] pt-[clamp(3rem,6vw,5rem)] pb-4">
          <div className="mx-auto" style={{ maxWidth: "1280px" }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
              {"// Four features · APP-01"}
            </p>
            <h3
              className="brand-h3 text-black mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Four features. One outcome: measurable brain performance.
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
              Test · Track · Trend · Compete
            </p>
          </div>
        </div>

        <div
          className="relative z-[2] flex-1 mx-auto flex items-center gap-12 px-[5vw] w-full"
          style={{ maxWidth: "1280px" }}
        >
          <div className="flex-1 flex flex-col justify-center pr-4">
            <div
              style={{
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}
            >
              <SectionContent
                data={SECTIONS_DATA[activeIndex]}
                sectionNumber={activeIndex + 1}
                totalSections={numSections}
              />
            </div>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center">
            <PhoneFrame
              sources={PHONE_SOURCES}
              activeIndex={activeIndex}
              altLabels={PHONE_ALT_LABELS}
              figLabel={FIG_LABELS[activeIndex]}
            />
          </div>
        </div>

        {/* Bottom tabs + progress bar — evenly distributed, aligned with scroll */}
        <div className="relative z-[2] w-full px-[5vw] pb-[clamp(2rem,4vw,3rem)]">
          <div className="mx-auto flex flex-col gap-3" style={{ maxWidth: "1280px" }}>
            <div
              className="grid items-center gap-3"
              style={{ gridTemplateColumns: `repeat(${numSections}, minmax(0, 1fr))` }}
            >
              {SECTION_TAB_LABELS.map((label, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToSection(i)}
                    className="text-left font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/60 focus-visible:ring-offset-2 whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      color: isActive ? "#1B2757" : "rgba(0,0,0,0.35)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <div className="h-px w-full bg-black/10 relative overflow-hidden">
                <div
                  className="h-full transition-[width] duration-150 ease-out bg-[#1B2757]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              {/* Section boundary ticks above the bar */}
              {Array.from({ length: numSections + 1 }).map((_, i) => {
                const isActiveOrPast = i <= activeIndex;
                return (
                  <div
                    key={i}
                    className="absolute -top-[3px] w-px h-[7px] transition-colors"
                    style={{
                      left: `calc(${(i / numSections) * 100}% - 0.5px)`,
                      backgroundColor: isActiveOrPast ? "#1B2757" : "rgba(0,0,0,0.25)",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppStickyPhoneBlock;
