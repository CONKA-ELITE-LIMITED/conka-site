"use client";

import { useEffect, useRef } from "react";
import ConkaCTAButton from "./ConkaCTAButton";
import LaurelBadge from "./LaurelBadge";
import TrustMicroRow from "./TrustMicroRow";

/* Brain-project credibility badge — generic (non-persona) copy for home. */
const HOME_LAUREL = {
  eyebrow: "World's Largest",
  body: "Consumer brain-research project. 1,000+ brains tested regularly through our app.",
};

/* ============================================================================
 * LandingHeroVideoDesktop — desktop (lg+) home hero, Magic Mind structure
 *
 * Landscape companion to LandingHeroVideo. The BothStillWaterDesktop shot has
 * the two shots centred with wide pale negative space either side, so the copy
 * sits in the left space (left-aligned, brand rule) over a full-bleed
 * background video, with the bottles staying centred on screen.
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
    <div className="relative w-full overflow-hidden">
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="metadata"
        poster="/videos/both/BothStillWaterDesktop-poster.jpg"
        aria-label="CONKA Flow and Clear shots resting in still water"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/both/BothStillWaterDesktop.webm" type="video/webm" />
        <source src="/videos/both/BothStillWaterDesktop.mp4" type="video/mp4" />
      </video>

      {/* Left wash — keeps brand-black copy readable over the pale footage
          without darkening the centred shots. */}
      <div
        className="absolute inset-y-0 left-0 w-3/5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(249,249,249,0.92) 0%, rgba(249,249,249,0.55) 45%, rgba(249,249,249,0) 100%)",
        }}
      />

      {/* Bottom fade — the video melts into the tinted section below rather than
          ending on a hard edge. Kept short so it only softens the very base. */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/5 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(244,245,248,1) 0%, rgba(244,245,248,1) 18%, rgba(244,245,248,0) 100%)",
        }}
      />

      {/* Content — left-aligned in the negative space, vertically centred. */}
      <div className="relative z-10 flex min-h-[72vh] items-center">
        <div className="px-[5vw] max-w-[40rem]">
          <LaurelBadge
            eyebrow={HOME_LAUREL.eyebrow}
            body={HOME_LAUREL.body}
            className="mb-6"
          />
          <h1
            className="text-black font-semibold text-5xl xl:text-6xl leading-[1.05]"
            style={{ letterSpacing: "-0.02em" }}
          >
            A Sharper Mind.
            <br />
            Morning to Evening.
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-snug text-black/70">
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
