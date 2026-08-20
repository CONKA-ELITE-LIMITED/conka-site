"use client";

import { useEffect, useRef } from "react";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * LandingHeroVideoDesktop — desktop (lg+) home hero, Magic Mind structure
 *
 * Landscape companion to LandingHeroVideo. A 50/50 split (mirror of the
 * HomeHeroV3 layout): copy + CTA in the padded LEFT half, the landscape video
 * in the RIGHT half at its native 16:9. Half-width keeps the 1280x720 encode
 * at or below native resolution, so it stays sharp (full-bleed stretched it).
 *
 * Copy is reused verbatim from LandingHero with the HomeHeroV3 staggered
 * two-tier title. Video is a forward+reverse ping-pong (seamless native
 * loop), WebM first then MP4. IntersectionObserver play/pause,
 * reduced-motion respected.
 *
 * Rendered only at lg+; below lg the page renders LandingHeroVideo.
 * ========================================================================== */

export default function LandingHeroVideoDesktop() {
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

  // See LandingHeroVideo: the poster is painted as a background-image (cover)
  // rather than the <video poster> attribute, which iOS Safari stretches to the
  // box during the metadata-load window before the video decodes.
  return (
    <div className="grid grid-cols-2 items-center">
      {/* Copy — left half. Staggered two-tier title (HomeHeroV3 style): large
          bold first line, smaller lighter second line displaced right. */}
      <div className="flex flex-col items-start gap-5 px-[5vw] py-16 text-left text-black">
        <h1 className="mb-0 text-black" style={{ letterSpacing: "-0.025em" }}>
          <span className="block text-[4rem] font-bold leading-[0.98] xl:text-[5rem]">
            A Sharper Mind.
          </span>
          <span className="mt-1 block text-[2.75rem] font-medium leading-[1.05] xl:ml-28 xl:text-[3.5rem]">
            Morning to Evening.
          </span>
        </h1>
        <p className="max-w-[42ch] text-lg leading-snug text-black xl:text-[1.1875rem]">
          For minds that demand more. A patented nootropic shot, clinically
          formulated to support focus, memory, and mental endurance every day.
        </p>
        <ConkaCTAButton href="/conka-both" meta={null}>
          Buy CONKA Today
        </ConkaCTAButton>
        <TrustMicroRow className="mt-1" />
      </div>

      {/* Video — right half at its native 16:9, so the 1280x720 encode is
          never upscaled past ~1:1 and stays sharp. */}
      <div
        className="relative aspect-video w-full overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/videos/both/BothNeuronFloatDesktop-poster.jpg')",
        }}
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
          <source src="/videos/both/BothNeuronFloatDesktop.webm" type="video/webm" />
          <source src="/videos/both/BothNeuronFloatDesktop.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
