"use client";

import { useEffect, useRef } from "react";

/* ============================================================================
 * BottleVideo
 *
 * Rotating 3D bottle render, one encode per formula. Flow and Clear share
 * the same playback behaviour; the `formula` prop selects the sources,
 * poster, and accessible label.
 *
 * The source renders do not loop seamlessly, so each encoded video is a
 * forward+reverse concatenation: rotating forward, then unrotating back to
 * start, then forward again, etc. Because the reversed half ends exactly
 * where the forward half started, the native `loop` attribute gives a
 * mathematically seamless ping-pong with zero JS overhead and no visible
 * jump. Flow is 5s forward + 5s reverse (10s loop); Clear is 2s forward +
 * 2s reverse (4s loop — only the first 2s of its source are usable).
 *
 * IntersectionObserver:
 * - `play()` when 40% of the element enters the viewport.
 * - `pause()` when it leaves, so the browser is not decoding a video
 *   nobody can see (saves battery on mobile and CPU on lower-end devices).
 *
 * Source ordering: WebM/VP9 first (smaller for Chrome / Firefox / Edge),
 * MP4/H.264 fallback for Safari. `muted` + `playsInline` so iOS Safari
 * allows autoplay. `preload="metadata"` keeps the initial fetch tiny.
 * ========================================================================== */

const FORMULA_VIDEOS = {
  flow: {
    webm: "/videos/flow/FlowLiquid.webm",
    mp4: "/videos/flow/FlowLiquid.mp4",
    poster: "/videos/flow/FlowLiquid-poster.jpg",
    label: "CONKA Flow shot being poured",
  },
  clear: {
    webm: "/videos/clear/ClearLiquid.webm",
    mp4: "/videos/clear/ClearLiquid.mp4",
    poster: "/videos/clear/ClearLiquid-poster.jpg",
    label: "CONKA Clear shot being poured",
  },
} as const;

interface BottleVideoProps {
  formula: keyof typeof FORMULA_VIDEOS;
}

export default function BottleVideo({ formula }: BottleVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sources = FORMULA_VIDEOS[formula];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (el.paused) {
            el.play().catch(() => {});
          }
        } else if (!el.paused) {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // `formula` re-runs the effect after the keyed <video> remounts, so the
    // observer attaches to the new element rather than the unmounted one.
  }, [formula]);

  return (
    // key forces a remount if `formula` ever changes on a mounted instance —
    // browsers do not re-read <source> children after the initial load.
    <video
      key={formula}
      ref={videoRef}
      muted
      playsInline
      loop
      preload="metadata"
      poster={sources.poster}
      className="w-full h-full object-cover"
      aria-label={sources.label}
    >
      <source src={sources.webm} type="video/webm" />
      <source src={sources.mp4} type="video/mp4" />
    </video>
  );
}
