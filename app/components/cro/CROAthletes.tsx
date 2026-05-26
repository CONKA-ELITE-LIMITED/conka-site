"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

/* ============================================================================
 * CROAthletes
 *
 * V2 Section 7 on /start. Forks the clinical AthleteCredibilityCarousel
 * pattern into the softer V2 grammar. Each slide leads with a square
 * portrait, then the athlete name + sport, then the quote rendered very
 * large as the visual hero. Roster strip stays as a 7-portrait swipeable
 * strip, restyled to V2 (no mono labels, no chamfered nav, no 01. prefix).
 *
 * The Informed Sport certification block sits below the carousel as a
 * rational anchor after the emotional quotes. Vetted copy is lifted
 * verbatim from WhyConkaWorksDesktop.tsx so we are not introducing new
 * Informed Sport claims.
 *
 * The V1 AthleteCredibilityCarousel.tsx is still rendered by the three
 * clinical PDPs (/conka-flow, /conka-clarity, /conka-both) so it is NOT
 * modified by this work.
 * ========================================================================== */

interface Athlete {
  name: string;
  sport: string;
  role: string;
  bio: string;
  quote: string;
  image: string;
}

const ATHLETES: Athlete[] = [
  {
    name: "Dan Norton",
    sport: "Rugby Sevens",
    role: "Olympic Silver Medallist",
    bio: "Holds the all-time try-scoring record in the World Rugby Sevens Series. Olympic silver, Rio 2016.",
    quote:
      "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
    image: "/testimonials/athlete/DanNortonNB.jpg",
  },
  {
    name: "Josh Stanton",
    sport: "Motorsport",
    role: "Professional Racing Driver",
    bio: "British GT racing driver competing on the professional international circuit.",
    quote:
      "When you are sat in a car you need to be in a calm state, but also you need to be aggressive. Really important to have this clarity of thought. The benefits CONKA gives me and knowing I have this edge is fantastic.",
    image: "/testimonials/athlete/JoshStantonNB.jpg",
  },
  {
    name: "Chris Billam-Smith",
    sport: "Boxing",
    role: "WBO Cruiserweight World Champion",
    bio: "Defeated Lawrence Okolie in 2023 to claim the WBO Cruiserweight world title.",
    quote:
      "Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.",
    image: "/testimonials/athlete/ChrisBillamSmithNB.jpg",
  },
  {
    name: "Sienna Charles",
    sport: "Showjumping",
    role: "GB Senior Team, European Medallist",
    bio: "Great Britain senior team rider and European Championships medallist.",
    quote:
      "Within a few weeks of taking it I saw huge improvements in energy, my ability to focus and my memory which got me back to competitions.",
    image: "/testimonials/athlete/SiennaCharlesNB.jpg",
  },
  {
    name: "Fraser Dingwall",
    sport: "Rugby Union",
    role: "England International",
    bio: "England international centre and Northampton Saints captain.",
    quote:
      "I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.",
    image: "/testimonials/athlete/FraserDingwallNB.jpg",
  },
  {
    name: "Adam Azim",
    sport: "Boxing",
    role: "IBO Super Lightweight World Champion",
    bio: "Undefeated IBO Super Lightweight World Champion and European title holder.",
    quote:
      "My reflexes were on point for my fights. CONKA is a daily thing I take especially in camp before fights.",
    image: "/testimonials/athlete/AdamAzimNB.jpg",
  },
  {
    name: "Jack Willis",
    sport: "Rugby Union",
    role: "England International, Stade Toulousain",
    bio: "England international flanker and Top 14 champion with Stade Toulousain.",
    quote:
      "For me it was about trying to find the small margins and trying to maximise my brain as well as my body was so important.",
    image: "/testimonials/athlete/JackWillisNB.jpg",
  },
];

const SWIPE_THRESHOLD = 50;

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous athlete" : "Next athlete"}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === "prev" ? "left-3" : "right-3"} w-10 h-10 flex items-center justify-center bg-white/95 hover:bg-white rounded-full shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] focus-visible:ring-offset-2`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1B2757"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {direction === "prev" ? (
          <polyline points="15 6 9 12 15 18" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

function AthleteSlide({
  athlete,
  onPrev,
  onNext,
}: {
  athlete: Athlete;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="border border-black/12 rounded-[var(--brand-radius-container)] overflow-hidden bg-white">
      <div className="relative aspect-[4/3] bg-black/[0.04]">
        <Image
          key={athlete.name}
          src={athlete.image}
          alt={`${athlete.name}, ${athlete.role}`}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
          priority={false}
        />
        <ArrowButton direction="prev" onClick={onPrev} />
        <ArrowButton direction="next" onClick={onNext} />
      </div>
      <div className="p-5">
        <h3 className="text-[24px] font-semibold text-black leading-tight">
          {athlete.name}
        </h3>
        <p className="text-[13px] text-black/55 leading-snug mb-5">
          {athlete.sport} &middot; {athlete.role}
        </p>
        <blockquote className="text-[22px] sm:text-[24px] font-medium text-black leading-snug">
          &ldquo;{athlete.quote}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

function RosterStrip({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Athlete roster"
      className="flex gap-3 overflow-x-auto px-1 mt-8 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {ATHLETES.map((athlete, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={athlete.name}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`${athlete.name}, ${athlete.role}`}
            onClick={() => onSelect(i)}
            className={`snap-start flex-shrink-0 w-[88px] aspect-square rounded-[14px] overflow-hidden border-2 flex flex-col bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] ${
              isActive
                ? "border-[#1B2757]"
                : "border-black/12 hover:border-black/30 opacity-75 hover:opacity-100"
            }`}
          >
            <div className="relative flex-1 bg-black/[0.04]">
              <Image
                src={athlete.image}
                alt=""
                fill
                sizes="88px"
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div className="px-1.5 py-1.5 flex items-center justify-center">
              <span
                className={`text-[11px] leading-none text-center truncate w-full ${
                  isActive ? "text-black font-semibold" : "text-black/65"
                }`}
              >
                {athlete.name.split(" ")[0]}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function InformedSportBlock() {
  return (
    <div className="mt-12 bg-black/[0.04] rounded-[var(--brand-radius-container)] p-6 flex flex-col items-center text-center">
      <div className="relative w-32 h-32 mb-4">
        <Image
          src="/logos/InformedSportLogo.png"
          alt="Informed Sport certification"
          fill
          sizes="128px"
          className="object-contain"
        />
      </div>
      <h3 className="text-[20px] font-semibold text-black leading-tight mb-3">
        Tested clean. Every batch.
      </h3>
      <p className="text-[14px] text-black/75 leading-relaxed max-w-[44ch]">
        Every batch of CONKA Flow and CONKA Clear is tested by Informed Sport
        for over 280 banned substances. Trusted by WADA, Olympic committees,
        and professional sports leagues worldwide.
      </p>
    </div>
  );
}

export default function CROAthletes() {
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

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

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

  return (
    <div className="mx-auto max-w-[560px]" onKeyDown={handleKeyDown}>
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Trusted where focus can&apos;t fail.
      </h2>

      <p className="text-[15px] leading-snug text-black/75 mb-8">
        Olympic medallists, world champions, and international competitors
        use CONKA on the days that matter most.
      </p>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-live="polite"
        aria-atomic="true"
      >
        <AthleteSlide athlete={active} onPrev={goPrev} onNext={goNext} />
      </div>

      <RosterStrip activeIndex={activeIndex} onSelect={goTo} />

      <InformedSportBlock />
    </div>
  );
}
