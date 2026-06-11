"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the prefers-reduced-motion media query. Defaults to false (motion
 * allowed) on the server and first render; components that need a static
 * layout for reduced motion should render it when this returns true.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export default usePrefersReducedMotion;
