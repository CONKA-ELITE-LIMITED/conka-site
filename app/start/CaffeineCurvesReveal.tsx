"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./CaffeineCurves.module.css";

/**
 * Thin client wrapper that owns the IntersectionObserver and toggles
 * `.revealed` on its root div when the chart scrolls into view.
 *
 * The heavy SVG markup lives in <CaffeineCurves /> (a Server
 * Component), so React doesn't walk it during hydration. CSS picks
 * up the class change and animates the cover rect via a transition
 * on `transform`.
 *
 * Respects prefers-reduced-motion (snaps revealed immediately, no
 * transition).
 */
export default function CaffeineCurvesReveal({
  children,
}: {
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={revealed ? styles.revealed : undefined}>
      {children}
    </div>
  );
}
