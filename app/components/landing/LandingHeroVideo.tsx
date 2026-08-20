"use client";

import { useEffect, useRef } from "react";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * LandingHeroVideo — mobile-only home hero (Magic Mind structure)
 *
 * A full-bleed background video of the Flow + Clear shots floating through a
 * glass neuron network, with the existing hero title and supporting copy
 * overlaid near the top and a single CTA near the bottom. Copy is reused
 * verbatim from LandingHero; this is a structural homage to the Magic Mind
 * hero, not a messaging change.
 *
 * Footage is bright and airy, so text stays brand-black (monochrome-first)
 * with a light wash top and bottom for guaranteed legibility rather than a
 * dark scrim with white text.
 *
 * Video: BothNeuronFloat is encoded as a forward+reverse concatenation, so the
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

    // Respect reduced-motion: leave the still background poster visible, no autoplay loop.
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

  // The still poster is painted as a background-image (cover) on the container
  // rather than via the <video poster> attribute: iOS Safari ignores object-fit
  // on a video poster during the metadata-load window and stretches it to the
  // box, so it warps until the video decodes. background-size: cover always
  // crops correctly, so there is no warp during load.
  return (
    <div
      className="relative -mx-5 w-[calc(100%+2.5rem)] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/videos/both/BothNeuronFloat-poster.jpg')" }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label="CONKA Flow and Clear shots floating through a glass neuron network"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/both/BothNeuronFloat.webm" type="video/webm" />
        <source src="/videos/both/BothNeuronFloat.mp4" type="video/mp4" />
      </video>

      {/* Bottom fade — the video melts into the white section below rather than
          ending on a hard edge. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 14%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Content — title/copy at the top, CTA at the bottom (Magic Mind layout).
          min-h drives the container height; the absolute video fills it. */}
      <div className="relative z-10 flex min-h-[86svh] flex-col justify-between px-5 pt-4 pb-10">
        {/* Staggered two-tier title (HomeHeroV3 style): large bold first line
            that must never wrap, smaller lighter second line. */}
        <header className="text-center">
          <h1 className="text-black" style={{ letterSpacing: "-0.025em" }}>
            <span className="block whitespace-nowrap text-[2.5rem] font-bold leading-[0.98]">
              A Sharper Mind.
            </span>
            <span className="mt-1 block text-[2rem] font-medium leading-[1.05]">
              Morning to Evening.
            </span>
          </h1>
        </header>

        <div className="flex flex-col items-center">
          <ConkaCTAButton href="/conka-both" meta={null}>
            Buy CONKA Today
          </ConkaCTAButton>
          <TrustMicroRow className="mt-4" />
          <p className="mt-4 max-w-[34ch] text-center text-[15px] leading-snug text-black">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>
        </div>
      </div>
    </div>
  );
}
