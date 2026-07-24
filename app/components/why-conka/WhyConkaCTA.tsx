import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import LabTrustBadges from "@/app/components/landing/LabTrustBadges";
import ExploreMoreRow from "@/app/components/landing/ExploreMoreRow";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";

/* Closing offer, restyled to sit on the MM listicle's bone canvas: the mono
   eyebrow and mono guarantee line are gone (MM has no mono), and the card
   picks up the same rounded-[8px] as the reason assets above it. */
export function WhyConkaCTA() {
  return (
    <div>
      <hr className="mb-10 border-0 border-t border-black/10" />

      <div className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
        {/* Product asset leads the card — the two-bottle system the CTA sells.
            Transform crops the source's white space (GPU-only). */}
        <div className="relative aspect-[2/1] overflow-hidden bg-[#f5f5f5]">
          <Image
            src="/formulas/both/BothHero.jpg"
            alt="Two CONKA bottles: Flow with a white cap and Clear with a black cap"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 820px"
            className="object-cover"
            style={{
              transform: "scale(1.4) translateY(-8%)",
              transformOrigin: "center center",
            }}
          />
        </div>

        <div className="flex flex-col gap-5 p-5 lg:p-8">
          <h2 className="text-[28px] font-bold leading-[1.15] text-black">
            Unlock your cognitive potential.
          </h2>
          <p className="max-w-[30rem] text-[15px] font-semibold leading-relaxed text-black">
            The full CONKA range. Flow for morning focus, Clear for afternoon
            clarity. Cognitive performance you can feel and measure.
          </p>
          <p className="text-[14px] leading-relaxed text-black/60">
            {GUARANTEE_LABEL_FULL} · Free UK shipping · Cancel anytime
          </p>
          <div>
            <ConkaCTAButton href="/conka-both" meta={null}>
              Try CONKA now
            </ConkaCTAButton>
          </div>
          <LabTrustBadges />
        </div>
      </div>

      {/* Routing for visitors who want to keep learning instead of buying */}
      <div className="mt-10">
        <ExploreMoreRow />
      </div>
    </div>
  );
}

export default WhyConkaCTA;
