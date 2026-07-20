"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import InformedSportCertification from "./InformedSportCertification";
import AthleteSportMarquee from "./AthleteSportMarquee";

/* ============================================================================
 * AthleteCredibilityCarousel
 *
 * Compact, quote-led athlete proof beat. Structure mirrors what works on
 * /start (CROAthletes): sport-breadth marquee → header → feature card with
 * nav arrows overlaid on the portrait → large quote as the visual hero →
 * image-only thumbnail roster → Informed Sport block as the rational anchor.
 * Styling stays clinical: mono labels, sharp corners, chamfered navy nav.
 *
 * Rendered by the home page and the three PDPs (/conka-flow, /conka-clarity,
 * /conka-both) — changes here propagate to all four.
 *
 * The sport-breadth marquee lives in its own component (AthleteSportMarquee).
 * It renders inside this beat by default; home and the PDPs pass
 * showMarquee={false} and render it full-bleed at the section level instead.
 * ========================================================================== */

export type Athlete = {
  name: string;
  sport: string;
  role: string;
  achievementMono: string;
  quote: string;
  image: string;
};

const ATHLETES: Athlete[] = [
  {
    name: "Dan Norton",
    sport: "Rugby Sevens",
    role: "Olympic Silver Medallist",
    achievementMono: "RUGBY 7s · OLYMPIC",
    quote:
      "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
    image: "/testimonials/athlete/DanNortonNB.jpg",
  },
  {
    name: "Josh Stanton",
    sport: "Motorsport",
    role: "Professional Racing Driver",
    achievementMono: "BRITISH GT · PRO",
    quote:
      "When you are sat in a car you need to be in a calm state, but also you need to be aggressive. Really important to have this clarity of thought. The benefits CONKA gives me and knowing I have this edge is fantastic.",
    image: "/testimonials/athlete/JoshStantonNB.jpg",
  },
  {
    name: "Chris Billam-Smith",
    sport: "Boxing",
    role: "WBO Cruiserweight World Champion",
    achievementMono: "WBO · 2023",
    quote:
      "Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.",
    image: "/testimonials/athlete/ChrisBillamSmithNB.jpg",
  },
  {
    name: "Sienna Charles",
    sport: "Showjumping",
    role: "GB Senior Team, European Medallist",
    achievementMono: "TEAM GB · EUROPEAN",
    quote:
      "Within a few weeks of taking it I saw huge improvements in energy, my ability to focus and my memory which got me back to competitions.",
    image: "/testimonials/athlete/SiennaCharlesNB.jpg",
  },
  {
    name: "Fraser Dingwall",
    sport: "Rugby Union",
    role: "England International",
    achievementMono: "ENGLAND · SAINTS",
    quote:
      "I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.",
    image: "/testimonials/athlete/FraserDingwallNB.jpg",
  },
  {
    name: "Adam Azim",
    sport: "Boxing",
    role: "IBO Super Lightweight World Champion",
    achievementMono: "IBO · UNDEFEATED",
    quote:
      "My reflexes were on point for my fights. CONKA is a daily thing I take especially in camp before fights.",
    image: "/testimonials/athlete/AdamAzimNB.jpg",
  },
  {
    name: "Jack Willis",
    sport: "Rugby Union",
    role: "England International, Stade Toulousain",
    achievementMono: "ENGLAND · TOP 14",
    quote:
      "For me it was about trying to find the small margins and trying to maximise my brain as well as my body was so important.",
    image: "/testimonials/athlete/JackWillisNB.jpg",
  },
];

const SWIPE_THRESHOLD = 50;

function ChamferNav({
  direction,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous athlete" : "Next athlete"}
      onClick={onClick}
      className={`w-11 h-11 flex items-center justify-center bg-[#1B2757] text-white transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] lab-clip-tr ${className}`}
    >
      {direction === "prev" ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <polyline
            points="15 6 9 12 15 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <polyline
            points="9 6 15 12 9 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )}
    </button>
  );
}

export default function AthleteCredibilityCarousel({
  showMarquee = true,
}: {
  // The sport-breadth marquee is rendered inside the carousel by default. Home
  // and the PDPs pass `showMarquee={false}` and render <AthleteSportMarquee
  // fullBleed /> at the section level instead so the strip runs edge-to-edge.
  showMarquee?: boolean;
} = {}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalCount = ATHLETES.length;
  const active = ATHLETES[activeIndex];
  const touchStartRef = useRef<number>(0);

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % totalCount) + totalCount) % totalCount;
      setActiveIndex(next);
    },
    [totalCount],
  );

  const goPrev = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo],
  );
  const goNext = useCallback(
    () => goTo(activeIndex + 1),
    [activeIndex, goTo],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goPrev, goNext],
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) goNext();
      else goPrev();
    }
  };

  const currentLabel = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    totalCount,
  ).padStart(2, "0")}`;

  return (
    <div>
      {showMarquee && <AthleteSportMarquee />}

      {/* Header */}
      <div className="mb-8">
        <h2
          className="brand-h1 mb-2 text-[#0e1f3f]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Why High Performers Trust CONKA
        </h2>
        <p className="text-[15px] leading-snug text-black max-w-[52ch]">
          Olympic medallists, world champions, and international competitors
          use CONKA on the days that matter most.
        </p>
      </div>

      {/* Feature card — portrait with overlaid nav, quote as the hero */}
      <div className="bg-white border border-black/12 overflow-hidden mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-stretch">
          {/* Portrait — nav arrows + counter overlay directly on the asset.
              self-start on mobile stops the grid's items-stretch from
              overriding aspect-square (all children are absolutely positioned,
              so a stretched row collapses to 0 height and hides the image);
              lg restores stretch so the column matches the text height. */}
          <div
            className="relative self-start lg:self-stretch aspect-square lg:aspect-auto lg:min-h-[480px] bg-[var(--brand-tint)] border-b lg:border-b-0 lg:border-r border-black/8 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              key={active.name}
              src={active.image}
              alt={`${active.name} — ${active.role}`}
              fill
              loading="eager"
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />

            {/* Mono spec overlays — counter top-left, achievement top-right */}
            <span className="absolute top-3 left-3 font-mono text-[10px] font-bold tabular-nums leading-none text-black/60 bg-white/90 px-2 py-1.5">
              {currentLabel}
            </span>
            <span className="absolute top-3 right-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] leading-none text-black/60 bg-white/90 px-2 py-1.5">
              {active.achievementMono}
            </span>

            <ChamferNav
              direction="prev"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
            <ChamferNav
              direction="next"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>

          {/* Text column — compact: name, sport · role, then the quote large */}
          <div className="p-5 lg:p-8 flex flex-col lg:justify-center">
            <div key={activeIndex}>
              <h3 className="text-2xl lg:text-3xl font-semibold text-black leading-tight mb-1">
                {active.name}
              </h3>
              <p className="text-[13px] text-black/55 leading-snug mb-5">
                {active.sport} &middot; {active.role}
              </p>

              <blockquote className="text-xl lg:text-2xl font-medium text-black leading-snug">
                &ldquo;{active.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Showing {active.name}, {active.role}.
      </div>

      {/* Roster strip — image-only thumbnails, small and scannable */}
      <div
        role="tablist"
        aria-label="Athlete roster"
        onKeyDown={handleKeyDown}
        className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 scroll-pl-5 md:mx-0 md:px-0 md:scroll-pl-0 lg:grid lg:grid-cols-7 lg:gap-3 lg:overflow-visible lg:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ATHLETES.map((a, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={a.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${a.name}, ${a.role}`}
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-[72px] lg:w-auto aspect-square snap-start bg-[var(--brand-tint)] overflow-hidden transition-all ${
                isActive
                  ? "border-2 border-[#1B2757]"
                  : "border border-black/12 hover:border-black/40 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={a.image}
                alt=""
                fill
                loading="lazy"
                className="object-contain"
                sizes="(max-width: 1024px) 72px, 170px"
              />
            </button>
          );
        })}
      </div>

      <InformedSportCertification className="mt-8" />
    </div>
  );
}
