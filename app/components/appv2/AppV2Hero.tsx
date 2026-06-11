"use client";

import { useRef } from "react";
import Image from "next/image";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";
import { gsap, useGSAP } from "./gsapClient";

const RING_RADIUS = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SCORE_TARGET = 92;

/**
 * Interactive thesis hero for /appv2. Same copy and asset as AppHero, with a
 * GSAP entrance: masked line reveals on the H1, a clip-path reveal on the
 * device card, and a live score ring that draws and counts up to 92. Content
 * is fully visible without JS (animations use `from` tweens) and all motion
 * is gated behind prefers-reduced-motion. Content-only; the page owns the
 * section wrapper.
 */
export default function AppV2Hero() {
  const root = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
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
            "[data-hero-card]",
            {
              clipPath: "inset(0% 0% 100% 0%)",
              duration: 1.1,
              ease: "power4.inOut",
            },
            0.2,
          )
          .from(
            "[data-hero-chip]",
            { autoAlpha: 0, duration: 0.4, stagger: 0.1 },
            "-=0.3",
          );

        // Score ring: draw the arc and count 0 -> 92 in sync
        gsap.set(ringRef.current, {
          strokeDasharray: RING_CIRCUMFERENCE,
          strokeDashoffset: RING_CIRCUMFERENCE,
        });
        const score = { value: 0 };
        tl.to(
          ringRef.current,
          {
            strokeDashoffset: RING_CIRCUMFERENCE * (1 - SCORE_TARGET / 100),
            duration: 1.6,
            ease: "power2.inOut",
          },
          0.7,
        ).to(
          score,
          {
            value: SCORE_TARGET,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (scoreRef.current) {
                scoreRef.current.textContent = String(Math.round(score.value));
              }
            },
          },
          0.7,
        );

        // Gentle parallax as the hero scrolls away
        gsap.to("[data-hero-card]", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="flex flex-col lg:flex-row lg:items-center lg:gap-16"
    >
      {/* Copy — leads on mobile so the thesis is the first thing read */}
      <div className="order-1 lg:flex-1">
        <p
          data-hero-fade
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4"
        >
          {"// The app · APP-01"}
        </p>
        <h1
          className="brand-h1 text-white mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Everyone tells you how
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              you should feel.
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              We show you.
            </span>
          </span>
        </h1>
        <p
          data-hero-fade
          className="text-base md:text-lg text-white leading-relaxed max-w-xl mb-8"
        >
          A free app and a clinically validated cognitive test that measure how
          your brain actually performs, day after day.
        </p>

        <div data-hero-fade className="flex flex-col items-start gap-3">
          <AppInstallButtons variant="clinical-dark" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums">
            Free to use
          </p>
        </div>
      </div>

      {/* Hero asset — light device-card; the phone floats from the top so the
          live score ring leads. The HUD chip counts the score up live. */}
      <div className="relative order-2 w-full mt-12 lg:mt-0 lg:flex-1">
        <div
          data-hero-card
          className="relative aspect-square w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto border border-black/12 bg-[#f5f5f5] overflow-hidden"
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
          <div
            data-hero-chip
            className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10"
          >
            Fig. 01 · CONKA App
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[25%] w-[60%] lg:w-[58%] aspect-[1/2]">
            <Image
              src="/app/AppConkaRing.png"
              alt="The CONKA app showing a live cognitive score ring"
              fill
              priority
              sizes="(max-width: 1024px) 60vw, 300px"
              className="object-contain"
            />
          </div>
          <div
            data-hero-chip
            className="absolute bottom-3 left-3 z-10 flex items-center gap-2.5 bg-black/70 px-3 py-2"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
              <circle
                cx="20"
                cy="20"
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="3"
              />
              <circle
                ref={ringRef}
                cx="20"
                cy="20"
                r={RING_RADIUS}
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                transform="rotate(-90 20 20)"
              />
            </svg>
            <div>
              <span
                ref={scoreRef}
                className="block font-mono text-lg font-bold text-white tabular-nums leading-none"
              >
                {SCORE_TARGET}
              </span>
              <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-white/65 mt-1">
                Live score
              </span>
            </div>
          </div>
          <div
            data-hero-chip
            className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10"
          >
            iOS · Android
          </div>
        </div>
      </div>
    </div>
  );
}
