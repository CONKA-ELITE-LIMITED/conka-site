import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import LabTrustBadges from "@/app/components/landing/LabTrustBadges";
import ExploreMoreRow from "@/app/components/landing/ExploreMoreRow";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";

export function WhyConkaCTA() {
  return (
    <div className="max-w-3xl">
      <div className="bg-white border border-black/12 overflow-hidden mb-10">
        {/* Product asset leads the card — the two-bottle system the CTA sells.
            Transform crops the source's white space (GPU-only). */}
        <div className="relative aspect-[2/1] overflow-hidden border-b border-black/8 bg-[#f5f5f5]">
          <Image
            src="/formulas/both/BothHero.jpg"
            alt="Two CONKA bottles: Flow with a white cap and Clear with a black cap"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover"
            style={{
              transform: "scale(1.4) translateY(-8%)",
              transformOrigin: "center center",
            }}
          />
        </div>

        <div className="p-5 lg:p-8 flex flex-col gap-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
            {"// Reason 08 · Yours to find"}
          </p>
          <h2
            className="brand-h2 text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            Unlock your cognitive potential.
          </h2>
          <p className="text-sm md:text-base text-black/75 leading-relaxed max-w-xl">
            The full CONKA range. Flow for morning focus, Clear for afternoon
            clarity. Cognitive performance you can feel and measure.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
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
      <ExploreMoreRow />
    </div>
  );
}

export default WhyConkaCTA;
