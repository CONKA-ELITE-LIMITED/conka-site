"use client";

interface ScienceQuoteProps {
  isMobile?: boolean;
}

export default function ScienceQuote({ isMobile = false }: ScienceQuoteProps) {
  return (
    <div className="max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-6">
        {"// Research Philosophy · Doc-RP-001"}
      </p>
      <div className="border-l-2 border-[#1B2757] pl-5 lg:pl-6">
        <p
          className={`text-black leading-tight ${
            isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
          }`}
          style={{ letterSpacing: "-0.02em" }}
        >
          The brain is the most complex organ in the known universe. We believe
          it deserves ingredients backed by rigorous science — not marketing hype.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 tabular-nums mt-5">
          — The CONKA Research Philosophy · Durham, 2023
        </p>
      </div>
    </div>
  );
}
