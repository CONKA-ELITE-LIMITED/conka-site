"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useInView } from "@/app/hooks/useInView";
import { usePrefersReducedMotion } from "@/app/hooks/usePrefersReducedMotion";

/* ============================================================================
 * AppV2Features (SCRUM-1361, Simple DTC)
 *
 * "More in the app", as an interactive feature list in the Bevel "And that's
 * not all" pattern: pick a feature, the phone shows its screen.
 *
 * - Desktop: a vertical list beside one phone. The active card is full width
 *   and carries a progress ring; the rest are inset and muted with an arrow.
 * - Mobile: the same cards become a swipeable snap row above the phone.
 *   Swiping selects the card that lands on the snap point.
 *
 * It advances on its own every ADVANCE_MS while the section is in view. Any
 * tap, key press or swipe hands control to the visitor and stops that for
 * good, and reduced-motion visitors never get it. Every screen is stacked in
 * the phone and crossfaded, so switching never waits on a download.
 * ========================================================================== */

const ADVANCE_MS = 6000;
const RING_RADIUS = 15;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const FEATURES: {
  id: string;
  title: string;
  body: string;
  src: string;
  alt: string;
}[] = [
  {
    id: "patterns",
    title: "See what moves your score",
    body: "The habits that lift your number and the ones that drag it down.",
    src: "/app/AppPatterns.png",
    alt: "CONKA app patterns screen showing what lifts and lowers the score",
  },
  {
    id: "health",
    title: "Works with Apple Health",
    body: "Steps, HRV, time outdoors and screen time, next to your score.",
    src: "/app/AppConkaRingInt.png",
    alt: "CONKA app home screen with Apple Health and Screen Time data",
  },
  {
    id: "breakdown",
    title: "Every test, broken down",
    body: "Speed and consistency on every response, down to the millisecond.",
    src: "/app/AppSpeedConsistency.png",
    alt: "CONKA app speed consistency breakdown of a test",
  },
  {
    id: "compete",
    title: "Compete with friends",
    body: "Climb the leaderboard and challenge friends to beat your score.",
    src: "/app/AppLeaderboard.png",
    alt: "CONKA app friends leaderboard ranked by score",
  },
  {
    id: "rewards",
    title: "Earn rewards",
    body: "Subscribers earn tokens every test and unlock exclusive merch.",
    src: "/app/AppRewards.png",
    alt: "CONKA app rewards screen with tokens and merch",
  },
];

function ProgressRing({ running }: { running: boolean }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      aria-hidden
      className="shrink-0 text-[var(--brand-navy)]"
    >
      <circle
        cx="18"
        cy="18"
        r={RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="2.5"
      />
      <circle
        cx="18"
        cy="18"
        r={RING_RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={0}
        transform="rotate(-90 18 18)"
        style={
          running
            ? {
                animation: `app-feature-ring ${ADVANCE_MS}ms linear forwards`,
              }
            : undefined
        }
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-black/20"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13 6 19 12 13 18" />
      </svg>
    </span>
  );
}

export default function AppV2Features() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const [viewRef, inView] = useInView({ threshold: 0.4, triggerOnce: false });
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // True while the rail is scrolling because we told it to, so that scroll
  // is not mistaken for a visitor's swipe.
  const programmaticScroll = useRef(false);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const running = autoplay && inView && !reducedMotion;

  // The swipe handler reads the current card without re-subscribing.
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const select = useCallback((index: number) => {
    setAutoplay(false);
    setActive(index);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % FEATURES.length),
      ADVANCE_MS,
    );
    return () => clearTimeout(timer);
  }, [running, active]);

  // Mobile only: keep the active card on the snap point. On desktop the list
  // does not overflow, so there is nothing to scroll.
  useEffect(() => {
    const rail = railRef.current;
    const card = cardRefs.current[active];
    if (!rail || !card || rail.scrollWidth <= rail.clientWidth) return;
    const inset = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const left = card.offsetLeft - inset;
    // Already there (first render, or a swipe that just landed): no scroll
    // event will fire, so do not arm the flag or the next swipe is ignored.
    if (Math.abs(left - rail.scrollLeft) < 2) return;
    programmaticScroll.current = true;
    rail.scrollTo({ left, behavior: reducedMotion ? "auto" : "smooth" });
  }, [active, reducedMotion]);

  // A swipe settles when scroll events stop; select whichever card is nearest
  // the snap point then.
  const handleRailScroll = useCallback(() => {
    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      const rail = railRef.current;
      if (!rail) return;
      if (programmaticScroll.current) {
        programmaticScroll.current = false;
        return;
      }
      const inset = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      let nearest = 0;
      let best = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const distance = Math.abs(card.offsetLeft - inset - rail.scrollLeft);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      });
      if (nearest !== activeRef.current) {
        setAutoplay(false);
        setActive(nearest);
      }
    }, 150);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + FEATURES.length) % FEATURES.length;
    select(next);
    cardRefs.current[next]?.focus();
  };

  const activeFeature = FEATURES[active];

  return (
    <div
      ref={viewRef}
      className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-16"
    >
      <style>{`@keyframes app-feature-ring { from { stroke-dashoffset: ${RING_CIRCUMFERENCE}; } to { stroke-dashoffset: 0; } }`}</style>

      <div>
        <h2
          className="brand-h2 mb-3 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          More in the app.
        </h2>
        <p className="mb-8 text-lg leading-relaxed text-black/75">
          Once you have your baseline, the app keeps it interesting.
        </p>

        <div
          ref={railRef}
          role="tablist"
          aria-label="App features"
          onScroll={handleRailScroll}
          onKeyDown={handleKeyDown}
          className="relative -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:scroll-pl-0 md:px-0 lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        >
          {FEATURES.map((feature, i) => {
            const isActive = i === active;
            return (
              <button
                key={feature.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                id={`app-feature-tab-${feature.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="app-feature-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(i)}
                className={`flex w-[82%] shrink-0 snap-start items-center justify-between gap-4 rounded-lg p-5 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] lg:w-auto ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "bg-white/50 text-black/45 hover:text-black/70 lg:mx-5"
                }`}
              >
                <span>
                  <span
                    className="block text-lg font-semibold leading-tight lg:text-xl"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {feature.title}
                  </span>
                  <span className="mt-1 block text-sm leading-snug lg:text-base">
                    {feature.body}
                  </span>
                </span>
                {isActive ? (
                  // Keyed so the ring restarts on every change of card.
                  <ProgressRing key={active} running={running} />
                ) : (
                  <ArrowIcon />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="app-feature-panel"
        role="tabpanel"
        aria-labelledby={`app-feature-tab-${activeFeature.id}`}
        className="relative mx-auto aspect-[1455/2942] w-[62%] max-w-[300px]"
      >
        {FEATURES.map((feature, i) => (
          <Image
            key={feature.id}
            src={feature.src}
            alt={i === active ? feature.alt : ""}
            aria-hidden={i !== active}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 300px, 62vw"
            className={`object-contain drop-shadow-xl transition-opacity duration-500 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
