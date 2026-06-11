"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, withMotion } from "@/app/lib/motion";
import { countUpStat } from "./storyMotion";

/* ============================================================================
 * OurStoryHero — cinematic opening for /our-story.
 *
 * Masked-line H1 reveal, staggered fades, count-up credibility stats, and a
 * wide pitchside image that wipes in via clip-path then drifts on a subtle
 * parallax. All content is server-rendered in its final state (from-tweens
 * only); everything is gated behind prefers-reduced-motion. Content-only;
 * the page owns the section wrapper.
 * ========================================================================== */

const HERO_STATS = [
  { value: "£500K+", label: "invested into brain research" },
  { value: "25+", label: "trials with professional teams" },
  { value: "150,000+", label: "shots taken to date" },
];

export function OurStoryHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("[data-hero-line]", {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.14,
        })
          .from(
            "[data-hero-fade]",
            { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.1 },
            "-=0.5",
          )
          .from(
            "[data-hero-frame]",
            {
              clipPath: "inset(0% 0% 100% 0%)",
              duration: 1.2,
              ease: "power4.inOut",
            },
            0.35,
          )
          .from(
            "[data-hero-chip]",
            { autoAlpha: 0, duration: 0.4, stagger: 0.1 },
            "-=0.3",
          );

        // Stats count up as part of the entrance
        gsap.utils
          .toArray<HTMLElement>("[data-hero-stat-value]")
          .forEach((el, i) => {
            countUpStat(el, HERO_STATS[i].value, { duration: 1.4 });
          });

        // Gentle parallax as the hero scrolls away
        gsap.set("[data-hero-parallax]", { scale: 1.08 });
        gsap.fromTo(
          "[data-hero-parallax]",
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero-frame]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <header className="max-w-3xl">
        <p
          data-hero-fade
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-4"
        >
          {"// Our story · STORY-01"}
        </p>
        <h1 className="brand-h1 text-black" style={{ letterSpacing: "-0.02em" }}>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              A concussion
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              changed everything.
            </span>
          </span>
        </h1>
        <p
          data-hero-fade
          className="mt-5 text-base lg:text-lg text-black/75 leading-relaxed max-w-xl"
        >
          The story of how two rugby teammates turned a career-ending brain
          injury into a measurable daily system, built with neuroscientists and
          proven in professional sport.
        </p>

        {/* Credibility stats — count up on entrance */}
        <div className="grid grid-cols-3 gap-4 mt-8 border-t border-black/10 pt-5">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} data-hero-fade>
              <span
                data-hero-stat-value
                className="block text-black font-bold text-xl sm:text-[28px] leading-tight tabular-nums"
                style={{ letterSpacing: "-0.02em" }}
              >
                {stat.value}
              </span>
              <span className="block text-[12px] text-[#1B2757] mt-1 leading-tight font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </header>

      {/* Cinematic opening image — full-bleed on mobile, wide band on desktop */}
      <div
        data-hero-frame
        className="relative mt-10 lg:mt-14 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden border-y md:border border-black/12 bg-black/5 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div data-hero-parallax className="absolute inset-0">
          <Image
            src="/story/Conka_Images_2.webp"
            alt="Two CONKA shots held pitchside before training"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 42%" }}
          />
        </div>
        <span
          data-hero-chip
          className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10"
        >
          Fig. 01 · Where it started
        </span>
        <span
          data-hero-chip
          className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10"
        >
          Scroll · Six chapters ↓
        </span>
      </div>
    </div>
  );
}

export default OurStoryHero;
