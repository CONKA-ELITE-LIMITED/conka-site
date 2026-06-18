"use client";

import { useEffect, useRef } from "react";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * LandingHeroVideo — mobile-only home hero (Magic Mind structure)
 *
 * A full-bleed background video of the Flow + Clear shots resting in still
 * water, with the existing hero title and supporting copy overlaid near the
 * top and a single CTA near the bottom. Copy is reused verbatim from
 * LandingHero; this is a structural homage to the Magic Mind hero, not a
 * messaging change.
 *
 * Footage is bright and airy, so text stays brand-black (monochrome-first)
 * with a light wash top and bottom for guaranteed legibility rather than a
 * dark scrim with white text.
 *
 * Video: BothStillWater is encoded as a forward+reverse concatenation, so the
 * native `loop` attribute gives a seamless ping-pong with no visible jump.
 * WebM/VP9 first (smaller), MP4/H.264 fallback for Safari. `muted` +
 * `playsInline` so iOS Safari autoplays inline; `preload="metadata"` keeps the
 * initial fetch tiny. IntersectionObserver play/pause (40% threshold) so the
 * browser is not decoding the video once it scrolls out of view.
 *
 * Mobile only — the page renders this below `lg` and keeps LandingHero at
 * `lg` and above.
 * ========================================================================== */

export default function LandingHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Respect reduced-motion: leave the still poster in place, no autoplay loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
  }, []);

  return (
    <div className="relative -mx-5 w-[calc(100%+2.5rem)] overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="metadata"
        poster="/videos/both/BothStillWater-poster.jpg"
        aria-label="CONKA Flow and Clear shots resting in still water"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/both/BothStillWater.webm" type="video/webm" />
        <source src="/videos/both/BothStillWater.mp4" type="video/mp4" />
      </video>

      {/* Legibility washes — light gradients top and bottom so brand-black text
          stays readable over the bright footage without flattening the calm. */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(249,249,249,0.85) 0%, rgba(249,249,249,0) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(249,249,249,0.92) 0%, rgba(249,249,249,0) 100%)",
        }}
      />

      {/* Content — title/copy at the top, CTA at the bottom (Magic Mind layout).
          min-h drives the container height; the absolute video fills it. */}
      <div className="relative z-10 flex min-h-[86svh] flex-col justify-between px-5 pt-4 pb-10">
        <header className="text-center">
          <h1
            className="text-black font-semibold text-[38px] leading-[1.08]"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>
          <p className="mt-4 mx-auto max-w-[34ch] text-[15px] leading-snug text-black/70">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>
        </header>

        <div className="flex flex-col items-center">
          <ConkaCTAButton href="/conka-both" meta={null}>
            Buy CONKA Today
          </ConkaCTAButton>
          <TrustMicroRow className="mt-4" />
        </div>
      </div>
    </div>
  );
}
