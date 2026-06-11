"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsapClient";

/**
 * Fixed 2px scroll-progress bar across the top of /appv2. Purely decorative
 * (aria-hidden); stays empty under prefers-reduced-motion.
 */
export default function AppV2ProgressRail() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    });
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-white/80"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
