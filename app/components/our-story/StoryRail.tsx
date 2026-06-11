"use client";

import { useState } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  withMotion,
  MOTION_OK,
} from "@/app/lib/motion";
import { storyChapters } from "@/app/lib/storyData";

/* ============================================================================
 * StoryRail — page-level chrome for /our-story.
 *
 * Two pieces:
 * 1. A fixed 2px scroll-progress bar across the top (decorative, stays empty
 *    under prefers-reduced-motion — same pattern as AppV2ProgressRail).
 * 2. A fixed left-edge chapter index (desktop only) that tracks the chapter
 *    in view and jumps on click. Active tracking runs outside the motion
 *    gate: it is state, not animation, so it works under reduced motion too.
 *
 * Both use mix-blend-difference so they stay legible over the white chapters
 * and the dark manifesto section alike.
 *
 * The page marks each trackable section with data-story-beat={id}.
 * ========================================================================== */

const BEATS = [
  ...storyChapters.map((c) => ({ id: c.id, label: c.label })),
  { id: storyChapters.length + 1, label: "You" },
];

export function StoryRail() {
  const [active, setActive] = useState(1);

  useGSAP(() => {
    // Chapter tracking — functional state, allowed under reduced motion
    const sections = gsap.utils.toArray<HTMLElement>("[data-story-beat]");
    sections.forEach((el) => {
      const id = Number(el.dataset.storyBeat);
      ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActive(id);
        },
      });
    });

    withMotion(() => {
      gsap.to("[data-story-progress]", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    });
  });

  const jump = (id: number) => {
    const el = document.querySelector(`[data-story-beat="${id}"]`);
    el?.scrollIntoView({
      behavior: window.matchMedia(MOTION_OK).matches ? "smooth" : "auto",
      block: "start",
    });
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px] mix-blend-difference"
      >
        <div
          data-story-progress
          className="h-full w-full origin-left bg-white"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Chapter index — desktop only */}
      <nav
        aria-label="Story chapters"
        className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 mix-blend-difference"
      >
        {BEATS.map((beat) => {
          const isActive = active === beat.id;
          return (
            <button
              key={beat.id}
              type="button"
              onClick={() => jump(beat.id)}
              aria-label={`Go to chapter ${beat.id}: ${beat.label}`}
              aria-current={isActive ? "true" : undefined}
              title={beat.label}
              className="group flex items-center gap-2.5 py-1.5 cursor-pointer"
            >
              <span
                aria-hidden
                className={`block h-px transition-all duration-300 ${
                  isActive
                    ? "w-7 bg-white"
                    : "w-3.5 bg-white/35 group-hover:bg-white/70"
                }`}
              />
              <span
                className={`font-mono text-[10px] tabular-nums leading-none transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/75"
                }`}
              >
                {String(beat.id).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default StoryRail;
