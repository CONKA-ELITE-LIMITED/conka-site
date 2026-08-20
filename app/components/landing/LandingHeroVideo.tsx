"use client";

import { useEffect, useRef } from "react";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * LandingHeroVideo — mobile-only home hero (Magic Mind structure)
 *
 * A full-width video of the Flow + Clear shots floating through a glass
 * neuron network at its native 3:4, with the hero title overlaid at the top.
 * The CTA straddles the asset's bottom edge, and the trust row + supporting
 * copy sit below the asset on the section's white background. Copy is reused
 * verbatim from LandingHero; this is a structural change, not a messaging
 * change.
 *
 * Footage is bright and airy, so the overlaid title stays brand-black
 * (monochrome-first) with no scrim.
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

  // The still poster is painted as a background-image (cover) on the asset box
  // rather than via the <video poster> attribute: iOS Safari ignores object-fit
  // on a video poster during the metadata-load window and stretches it to the
  // box, so it warps until the video decodes. background-size: cover always
  // crops correctly, so there is no warp during load.
  //
  // Layout: the asset box is the video's native 3:4, so the full frame shows
  // with no crop and only the title overlays it. The CTA straddles the asset's
  // bottom edge (negative top margin), and the trust row + supporting copy sit
  // below the asset on the white section background.
  return (
    <div className="-mx-5 w-[calc(100%+2.5rem)]">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-cover bg-center"
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

        {/* Staggered two-tier title (HomeHeroV3 style): large bold first line
            that must never wrap, smaller lighter second line. */}
        <header className="relative z-10 px-5 pt-4 text-center">
          <h1 className="text-black" style={{ letterSpacing: "-0.025em" }}>
            <span className="block whitespace-nowrap text-[2.5rem] font-bold leading-[0.98]">
              A Sharper Mind.
            </span>
            <span className="mt-1 block text-[2rem] font-medium leading-[1.05]">
              Morning to Evening.
            </span>
          </h1>
        </header>
      </div>

      {/* CTA overlaps the bottom of the asset; everything after it is in normal
          flow under the asset. */}
      <div className="relative z-10 -mt-7 flex flex-col items-center px-5">
        <ConkaCTAButton href="/conka-both" meta={null} inverted>
          Buy CONKA Today
        </ConkaCTAButton>
        <TrustMicroRow className="mt-4" />
        <p className="mt-4 max-w-[34ch] text-center text-[15px] font-medium leading-snug text-black">
          For minds that demand more. A patented nootropic shot, clinically
          formulated to support focus, memory, and mental endurance every day.
        </p>
      </div>
    </div>
  );
}
