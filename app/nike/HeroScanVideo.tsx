"use client";

import { useEffect, useRef } from "react";

/**
 * The BothShots scan video, used as the Nike hero asset. Seamless boomerang
 * loop, muted and playsInline so iOS allows autoplay. Plays via
 * IntersectionObserver (paused off-screen) and only when motion is allowed;
 * under reduced motion the poster frame stands in.
 *
 * `className` is applied to the <video> so the page can control the crop
 * (object-fit / object-position) the same way it did for the still image.
 */
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export default function HeroScanVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(REDUCED_MOTION).matches) return; // poster only

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.paused) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      playsInline
      loop
      preload="metadata"
      poster="/videos/nike/BothShotsScan-poster.jpg"
      aria-label="Both CONKA shots lit by a scanning light against a dark backdrop"
      className={className}
    >
      <source src="/videos/nike/BothShotsScan.webm" type="video/webm" />
      <source src="/videos/nike/BothShotsScan.mp4" type="video/mp4" />
    </video>
  );
}
