"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";

export type Athlete = {
  name: string;
  sport: string;
  role: string;
  bio: string;
  achievementMono: string;
  quote: string;
  image: string;
};

const ATHLETES: Athlete[] = [
  {
    name: "Dan Norton",
    sport: "Rugby Sevens",
    role: "Olympic Silver Medallist",
    bio: "Holds the all-time try-scoring record in the World Rugby Sevens Series. Olympic silver, Rio 2016.",
    achievementMono: "RUGBY 7s · OLYMPIC",
    quote:
      "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
    image: "/testimonials/athlete/DanNortonNB.jpg",
  },
  {
    name: "Josh Stanton",
    sport: "Motorsport",
    role: "Professional Racing Driver",
    bio: "British GT racing driver competing on the professional international circuit.",
    achievementMono: "BRITISH GT · PRO",
    quote:
      "When you are sat in a car you need to be in a calm state, but also you need to be aggressive. Really important to have this clarity of thought. The benefits CONKA gives me and knowing I have this edge is fantastic.",
    image: "/testimonials/athlete/JoshStantonNB.jpg",
  },
  {
    name: "Chris Billam-Smith",
    sport: "Boxing",
    role: "WBO Cruiserweight World Champion",
    bio: "Defeated Lawrence Okolie in 2023 to claim the WBO Cruiserweight world title.",
    achievementMono: "WBO · 2023",
    quote:
      "Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.",
    image: "/testimonials/athlete/ChrisBillamSmithNB.jpg",
  },
  {
    name: "Sienna Charles",
    sport: "Showjumping",
    role: "GB Senior Team, European Medallist",
    bio: "Great Britain senior team rider and European Championships medallist.",
    achievementMono: "TEAM GB · EUROPEAN",
    quote:
      "Within a few weeks of taking it I saw huge improvements in energy, my ability to focus and my memory which got me back to competitions.",
    image: "/testimonials/athlete/SiennaCharlesNB.jpg",
  },
  {
    name: "Fraser Dingwall",
    sport: "Rugby Union",
    role: "England International",
    bio: "England international centre and Northampton Saints captain.",
    achievementMono: "ENGLAND · SAINTS",
    quote:
      "I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.",
    image: "/testimonials/athlete/FraserDingwallNB.jpg",
  },
  {
    name: "Adam Azim",
    sport: "Boxing",
    role: "IBO Super Lightweight World Champion",
    bio: "Undefeated IBO Super Lightweight World Champion and European title holder.",
    achievementMono: "IBO · UNDEFEATED",
    quote:
      "My reflexes were on point for my fights. CONKA is a daily thing I take especially in camp before fights.",
    image: "/testimonials/athlete/AdamAzimNB.jpg",
  },
  {
    name: "Jack Willis",
    sport: "Rugby Union",
    role: "England International, Stade Toulousain",
    bio: "England international flanker and Top 14 champion with Stade Toulousain.",
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
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous athlete" : "Next athlete"}
      onClick={onClick}
      className="w-11 h-11 flex items-center justify-center bg-[#1B2757] text-white transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] lab-clip-tr"
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

export default function AthleteCredibilityCarousel() {
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
      {/* Trio header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Athlete roster · PROOF-01"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Why High Performers Trust CONKA
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          N=7 · Olympic · WBO · IBO · Team GB · England
        </p>
      </div>

      {/* Feature slot */}
      <div className="bg-white border border-black/12 overflow-hidden mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] items-stretch">
          {/* Portrait — crossfades */}
          <div
            className="relative aspect-square lg:aspect-auto lg:min-h-[480px] bg-[var(--brand-tint)] border-b lg:border-b-0 lg:border-r border-black/8 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {ATHLETES.map((a, i) => (
              <div
                key={a.name}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  i === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                aria-hidden={i !== activeIndex}
              >
                <Image
                  src={a.image}
                  alt={`${a.name} — ${a.role}`}
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  priority={i === 0}
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            ))}
          </div>

          {/* Text column */}
          <div className="flex flex-col">
            {/* Mobile-only nav strip — sits directly under the portrait */}
            <div className="flex lg:hidden items-center justify-between gap-3 px-4 py-3 border-b border-black/8">
              <ChamferNav direction="prev" onClick={goPrev} />
              <div className="flex-1 flex flex-col items-center min-w-0">
                <span className="font-mono text-[11px] font-bold tabular-nums text-black/50 leading-none">
                  {currentLabel}
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/60 leading-none mt-1 truncate max-w-full">
                  {active.achievementMono}
                </span>
              </div>
              <ChamferNav direction="next" onClick={goNext} />
            </div>

            {/* Content block */}
            <div className="p-6 lg:p-8 flex flex-col flex-1">
              {/* Desktop spec row */}
              <div className="hidden lg:flex items-center justify-between mb-5 pb-3 border-b border-black/8">
                <span className="font-mono text-[11px] font-bold tabular-nums text-black/50 leading-none">
                  {currentLabel}
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/60 leading-none">
                  {active.achievementMono}
                </span>
              </div>

              {/* Crossfade on text block */}
              <div key={activeIndex} className="flex flex-col flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 mb-2 leading-none">
                  {active.sport}
                </p>
                <h3 className="text-3xl lg:text-4xl font-semibold text-black leading-tight mb-2">
                  {active.name}
                </h3>
                <p className="text-sm text-black/60 leading-relaxed mb-5">
                  {active.bio}
                </p>

                <blockquote className="relative pl-5 mb-6 lg:mb-8">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 font-mono text-3xl font-bold text-black/25 leading-none select-none"
                  >
                    &ldquo;
                  </span>
                  <p className="text-base lg:text-lg text-black leading-relaxed">
                    {active.quote}
                  </p>
                </blockquote>
              </div>

              {/* Desktop-only bottom nav */}
              <div className="hidden lg:flex items-center justify-between gap-3 mt-auto pt-4 border-t border-black/8">
                <ChamferNav direction="prev" onClick={goPrev} />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 tabular-nums">
                  Browse Roster
                </span>
                <ChamferNav direction="next" onClick={goNext} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Showing {active.name}, {active.role}.
      </div>

      {/* Roster strip — all 7 always visible */}
      <div
        role="tablist"
        aria-label="Athlete roster"
        onKeyDown={handleKeyDown}
        className="flex lg:grid lg:grid-cols-7 gap-2 lg:gap-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none -mx-5 px-5 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              className={`group shrink-0 w-[38vw] max-w-[150px] lg:w-auto lg:max-w-none snap-start text-left bg-white transition-colors ${
                isActive
                  ? "border-2 border-[#1B2757]"
                  : "border border-black/12 hover:border-black/40"
              }`}
            >
              <div className="relative aspect-square bg-[var(--brand-tint)] overflow-hidden">
                <Image
                  src={a.image}
                  alt=""
                  fill
                  loading="lazy"
                  className="object-contain"
                  sizes="(max-width: 1024px) 150px, 140px"
                />
                <span
                  className={`absolute top-1.5 left-1.5 font-mono text-[9px] font-bold tabular-nums leading-none ${
                    isActive ? "text-[#1B2757]" : "text-black/40"
                  }`}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}.
                </span>
              </div>
              <div
                className={`px-2 py-2 border-t ${
                  isActive ? "border-[#1B2757]/20" : "border-black/8"
                }`}
              >
                <p className="text-xs font-semibold text-black truncate leading-tight">
                  {a.name}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/50 truncate mt-0.5">
                  {a.sport}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
