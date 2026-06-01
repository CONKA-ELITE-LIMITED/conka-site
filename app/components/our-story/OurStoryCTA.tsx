import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import ExploreMoreRow from "@/app/components/landing/ExploreMoreRow";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";

export function OurStoryCTA() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Chapter 07 · You"}
      </p>
      <h2
        className="brand-h1 text-black mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        The next chapter is yours to test.
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
        {GUARANTEE_LABEL_FULL} · Free UK shipping · Cancel anytime
      </p>

      <div className="bg-white border border-black/12 mb-10">
        <div className="grid grid-cols-3 border-b border-black/8">
          <div className="p-4 lg:p-5 border-r border-black/8">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Research
            </p>
            <p className="font-mono text-xl lg:text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
              £500K+
            </p>
          </div>
          <div className="p-4 lg:p-5 border-r border-black/8">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Clinical trials
            </p>
            <p className="font-mono text-xl lg:text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
              25+
            </p>
          </div>
          <div className="p-4 lg:p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Formula
            </p>
            <p className="font-mono text-xl lg:text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
              Patented
            </p>
          </div>
        </div>

        <div className="p-5 lg:p-6">
          <ConkaCTAButton href="/conka-both" meta={null}>
            Try CONKA now
          </ConkaCTAButton>
        </div>
      </div>

      {/* Routing for visitors who want to keep learning instead of buying */}
      <ExploreMoreRow />
    </div>
  );
}

export default OurStoryCTA;
