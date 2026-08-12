import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";

/* ============================================================================
 * HomeHeroV3 — simple image-led home hero (Magic Mind structure).
 *
 * Mobile: stacked top-to-bottom — asset, then title, description, CTA.
 * Desktop (lg+): two-column split — asset on the LEFT, copy + CTA on the RIGHT.
 *
 * Server component (no client JS): the still image is the LCP element, so it is
 * priority + fetchPriority="high" with accurate `sizes`, per the performance
 * guidelines. Replaces the video hero (LandingHeroVideo*), which stays in the
 * codebase for revert.
 * ========================================================================== */

export default function HomeHeroV3() {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Asset — top on mobile, left on desktop */}
      <div className="relative aspect-[7/5] w-full overflow-hidden rounded-md">
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

      {/* Copy — below the asset on mobile, right column on desktop */}
      <div className="flex flex-col items-start gap-5 text-black">
        <h1 className="brand-h1-bold !mb-0" style={{ letterSpacing: "-0.02em" }}>
          A Sharper Mind.
          <br />
          Morning to Evening.
        </h1>
        <p className="brand-body max-w-[46ch] text-black">
          For minds that demand more. A patented nootropic shot, clinically
          formulated to support focus, memory, and mental endurance every day.
        </p>
        <ConkaCTAButton href="/conka-both" meta={null}>
          Buy CONKA Today
        </ConkaCTAButton>
      </div>
    </div>
  );
}
