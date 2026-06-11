"use client";

import { useRef } from "react";
import { gsap, useGSAP, withMotion, revealUp } from "@/app/lib/motion";

/* ============================================================================
 * StoryManifesto — the turn in the story, between The Proof and Beyond Sport.
 *
 * The "Beyond Concussion" beat from the brand foundation: what began as
 * recovery became optimisation. A dark interstitial with a scroll-scrubbed
 * word-brighten headline (each word lifts from dim to full white as you
 * scroll) and the five pillars as staggered chips. Content-only; the page
 * owns the dark section wrapper.
 * ========================================================================== */

const HEADLINE_WORDS =
  "The brain isn't just something to protect. It's something to optimise.".split(
    " ",
  );

const PILLARS = [
  "Focus",
  "Memory",
  "Reaction speed",
  "Energy",
  "Consistency",
];

export function StoryManifesto() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        gsap.fromTo(
          "[data-manifesto-word]",
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-manifesto-heading]",
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            },
          },
        );

        revealUp("[data-manifesto-chip]", "[data-manifesto-chips]", {
          y: 20,
          duration: 0.6,
          stagger: 0.08,
        });

        revealUp("[data-manifesto-close]", "[data-manifesto-close]");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="text-white">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-6">
        {"// The turn · Recovery became optimisation"}
      </p>

      <h2
        data-manifesto-heading
        className="brand-h1 text-white max-w-[20ch] mb-10 lg:mb-14"
        style={{ letterSpacing: "-0.02em" }}
      >
        {HEADLINE_WORDS.map((word, i) => (
          <span key={i}>
            <span data-manifesto-word className="inline-block">
              {word}
            </span>{" "}
          </span>
        ))}
      </h2>

      <div data-manifesto-chips className="flex flex-wrap gap-2 lg:gap-3 mb-8">
        {PILLARS.map((pillar, i) => (
          <span
            data-manifesto-chip
            key={pillar}
            className="inline-flex items-center gap-2.5 border border-white/25 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white"
          >
            <span className="text-white/45 tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {pillar}
          </span>
        ))}
      </div>

      <p
        data-manifesto-close
        className="text-base lg:text-lg text-white/75 leading-relaxed max-w-xl"
      >
        Every high performer depends on these five. Yet no system existed to
        support them in a structured, measurable way. So that became the work.
      </p>
    </div>
  );
}

export default StoryManifesto;
