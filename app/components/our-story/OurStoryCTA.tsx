import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

export function OurStoryCTA() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Join the journey · CONKA-03"}
      </p>
      <h2
        className="brand-h1 text-black mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Ready to experience it yourself?
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
        100-Day money-back guarantee · Free UK shipping · Cancel anytime
      </p>

      <div className="bg-white border border-black/12">
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

        <div className="p-5 lg:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
              Recommended start
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40 tabular-nums">
              Protocol 03 · Balance
            </p>
          </div>
          <ConkaCTAButton
            href="/conka-both"
            meta="// balance protocol · 14 shots · 7-day cadence"
          >
            Try CONKA now
          </ConkaCTAButton>
        </div>
      </div>
    </div>
  );
}

export default OurStoryCTA;
