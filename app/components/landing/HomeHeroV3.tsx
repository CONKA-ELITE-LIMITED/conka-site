import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import TrustMicroRow from "./TrustMicroRow";

/* ============================================================================
 * HomeHeroV3 — simple image-led home hero (Magic Mind structure).
 *
 * Full-bleed: on mobile the asset spans the full width on top, then the copy
 * (padded) below. On desktop it is a 50/50 split — asset filling the LEFT half
 * edge-to-edge and full height, copy + CTA in the padded RIGHT half.
 *
 * Server component (no client JS): the still image is the LCP element, so it is
 * priority + fetchPriority="high" with accurate `sizes`, per the performance
 * guidelines. Replaces the video hero (LandingHeroVideo*), kept for revert.
 * ========================================================================== */

export default function HomeHeroV3() {
  return (
    <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
      {/* Asset — full-bleed. Mobile: fixed 7:5 full-width. Desktop: fills the
          column height (object-cover). */}
      <div className="relative aspect-[7/5] w-full lg:aspect-auto lg:min-h-[34rem]">
        <Image
          src="/formulas/both/BothHeroMm.jpg"
          alt="CONKA Flow and Clear shots held in hand"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Copy — centred on mobile, left-aligned + vertically centred in the
          split on desktop. */}
      <div className="flex flex-col items-center gap-5 px-5 py-10 text-center text-black lg:items-start lg:px-[5vw] lg:py-16 lg:text-left">
        {/* Staggered two-tier title (Magic Mind): a large bold first line, then
            a smaller lighter second line displaced to the right on desktop. */}
        <h1 className="mb-0 text-black" style={{ letterSpacing: "-0.025em" }}>
          <span className="block text-[2.5rem] font-bold leading-[0.98] lg:text-[5rem]">
            A Sharper Mind.
          </span>
          <span className="mt-1 block text-[2rem] font-medium leading-[1.05] lg:ml-28 lg:text-[3.5rem]">
            Morning to Evening.
          </span>
        </h1>
        <p className="max-w-[34ch] text-[1.0625rem] leading-relaxed text-black lg:text-[1.1875rem]">
          For minds that demand more. A patented nootropic shot, clinically
          formulated to support focus, memory, and mental endurance every day.
        </p>
        <ConkaCTAButton href="/conka-both" meta={null}>
          Buy CONKA Today
        </ConkaCTAButton>
        <TrustMicroRow className="mt-1" />
      </div>
    </div>
  );
}
