"use client";

import { useRef } from "react";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";
import { gsap, useGSAP } from "./gsapClient";

/**
 * Final download CTA for /app, with a
 * masked headline reveal and a decorative score ring that draws as the
 * section enters. Content-only; the page owns the section wrapper.
 */
export default function AppV2Download() {
  const root = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-download-reveal]", {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        const circumference = 2 * Math.PI * 130;
        gsap.set(ringRef.current, {
          strokeDasharray: circumference,
          strokeDashoffset: circumference,
        });
        gsap.to(ringRef.current, {
          strokeDashoffset: circumference * (1 - 0.92),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "center center",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative flex flex-col items-center text-center">
      {/* Decorative ring behind the headline */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.12]"
        width="300"
        height="300"
        viewBox="0 0 300 300"
      >
        <circle
          cx="150"
          cy="150"
          r="130"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
        />
        <circle
          ref={ringRef}
          cx="150"
          cy="150"
          r="130"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          transform="rotate(-90 150 150)"
        />
      </svg>

      <h2
        data-download-reveal
        className="brand-h2 text-white mb-8 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Start measuring your brain today.
      </h2>
      <div data-download-reveal>
        <AppInstallButtons variant="clinical-dark" className="justify-center" />
      </div>
      <p
        data-download-reveal
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums mt-4"
      >
        Free to use · No subscription required · Core features included
      </p>
    </div>
  );
}
