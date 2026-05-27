"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  target: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function AnimatedStat({
  target,
  prefix = "",
  suffix = "",
  durationMs = 1500,
  className = "",
  style,
}: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setValue(target);
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min((now - start) / durationMs, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(target * eased));
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {value.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}
