"use client";

import { useEffect, useRef } from "react";

/* ============================================================================
 * FlowVideo
 *
 * Section 2 hero. CONKA Flow bottle rotating in space.
 *
 * The source render does not loop seamlessly, so the encoded video is a
 * forward+reverse concatenation: 5s rotating forward, then 5s unrotating
 * back to start, then forward again, etc. Because the reversed half ends
 * exactly where the forward half started, the native `loop` attribute
 * gives a mathematically seamless ping-pong with zero JS overhead and no
 * visible jump.
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

export default function FlowVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(() => {});
          }
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      loop
      preload="metadata"
      poster="/videos/Flow-poster.jpg"
      className="w-full h-full object-cover"
      aria-label="CONKA Flow bottle rotating in space"
    >
      <source src="/videos/Flow.webm" type="video/webm" />
      <source src="/videos/Flow.mp4" type="video/mp4" />
    </video>
  );
}
