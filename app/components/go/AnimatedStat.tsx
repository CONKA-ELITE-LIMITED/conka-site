"use client";

import { useEffect, useState } from "react";

/**
 * Count-up stat for interstitial screens. Eases out over ~900ms;
 * jumps straight to the final value under reduced motion.
 */
export default function AnimatedStat({
  value,
  prefix,
  suffix,
  label,
  durationMs = 900,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return (
    <div>
      <div
        className="text-8xl font-medium tabular-nums tracking-[-0.02em]"
        style={{ color: "var(--brand-accent)" }}
      >
        {prefix}
        {display}
        {suffix}
      </div>
      <p className="mx-auto mt-3 max-w-xs text-lg leading-snug text-black/70">
        {label}
      </p>
    </div>
  );
}
