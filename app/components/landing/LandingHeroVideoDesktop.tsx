"use client";

import { useEffect, useRef } from "react";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * LandingHeroVideoDesktop — desktop (lg+) home hero, Magic Mind structure
 *
 * Landscape companion to LandingHeroVideo. The BothNeuronFloatDesktop shot
 * keeps the two shots right of centre with pale negative space on the left, so
 * the copy sits in that left space (left-aligned, brand rule) over a
 * full-bleed background video without covering the bottles.
 *
 * Copy is reused verbatim from LandingHero. Footage is bright, so text stays
 * brand-black with a left-to-right wash for legibility rather than a dark
 * scrim. Video is a forward+reverse ping-pong (seamless native loop), WebM
 * first then MP4. IntersectionObserver play/pause, reduced-motion respected.
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
    <div
      className="relative w-full overflow-hidden bg-cover bg-center"
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

      {/* Bottom fade — the video melts into the white section below rather than
          ending on a hard edge. Kept short so it only softens the very base. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[10%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 18%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Content — left-aligned in the negative space, vertically centred.
          min-h close to the video's native 16:9 height at viewport width, so
          object-cover trims as little off the top and bottom as possible. */}
      <div className="relative z-10 flex min-h-[85vh] items-center">
        <div className="px-[5vw] max-w-[40rem]">
          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05]"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-snug text-black">
            For minds that demand more. A patented nootropic shot, clinically
            formulated to support focus, memory, and mental endurance every day.
          </p>

          <div className="mt-7">
            <ConkaCTAButton href="/conka-both" meta={null}>
              Buy CONKA Today
            </ConkaCTAButton>
          </div>

          <TrustMicroRow className="mt-6" />
        </div>
      </div>
    </div>
  );
}
