"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import LabTrustBadges from "@/app/components/landing/LabTrustBadges";

export function WhyConkaCTA() {
  return (
    <div className="bg-white border border-black/12 p-5 lg:p-8 flex flex-col gap-5 max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
        Recommended start · Balance protocol · F-03
      </p>
      <h2
        className="brand-h2 text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Unlock your cognitive potential.
      </h2>
      <p className="text-sm md:text-base text-black/75 leading-relaxed max-w-xl">
        The full CONKA range. Flow for morning focus, Clear for afternoon recovery.
        Cognitive performance you can feel and measure.
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
        100-day money-back guarantee · Free UK shipping · Cancel anytime
      </p>
      <div>
        <ConkaCTAButton href="/conka-both" meta="// balance protocol · flow + clear">
          Try CONKA now
        </ConkaCTAButton>
      </div>
      <LabTrustBadges />
    </div>
  );
}

export default WhyConkaCTA;
