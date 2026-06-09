"use client";

import Image from "next/image";
import { formulaComparison } from "@/app/lib/scienceData";
import useIsMobile from "@/app/hooks/useIsMobile";

const FORMULA_IMAGES: Record<string, { src: string; alt: string }> = {
  "01": {
    src: "/lifestyle/ConkaDesk.jpg",
    alt: "CONKA Flow bottle on a desk beside a keyboard",
  },
  "02": {
    src: "/lifestyle/ConkaJeansHold.jpg",
    alt: "Hand holding a CONKA Clear bottle",
  },
};

export default function FlowVsClear() {
  const isMobile = !!useIsMobile();
  return (
    <div>
      {/* Header */}
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// Formula comparison · CONKA-03"}
        </p>
        <h2
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Flow vs Clear
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Two formulas · Distinct targets · Complete coverage together
        </p>
      </div>

      {/* Formula cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mb-4">
        {formulaComparison.map((formula, idx) => {
          const image = FORMULA_IMAGES[formula.formula];
          return (
            <div
              key={formula.formula}
              className="bg-white border border-black/12 overflow-hidden flex flex-col"
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                  F{String(idx + 1).padStart(2, "0")} · {formula.formula}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                  {formula.name}
                </span>
              </div>

              {/* Image */}
              <div className="relative aspect-[16/9] lg:aspect-[3/2] bg-white overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={isMobile ? "95vw" : "50vw"}
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                  aria-hidden
                />
                <div className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
                  Fig. {String(idx + 3).padStart(2, "0")} · {formula.name}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 lg:p-6 flex-1 flex flex-col">
                <h3 className="text-lg lg:text-xl font-semibold leading-tight text-black mb-1">
                  {formula.name}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/55 tabular-nums mb-4">
                  {formula.tagline}
                </p>

                {/* Primary pillars */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {formula.primaryPillars.map((pillar) => (
                    <span
                      key={pillar}
                      className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-2.5 py-1 border border-black/12 bg-white text-black/70"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-black/75 leading-relaxed">
                  {formula.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Combined banner */}
      <div className="bg-white border border-black/12 p-5 lg:p-6">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: "#1B2757" }}
            aria-hidden
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <line x1="12" y1="5" x2="12" y2="19" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-1 tabular-nums">
              Balance Protocol · F01 + F02
            </p>
            <p className="text-sm lg:text-base text-black leading-relaxed">
              <span className="font-semibold">Take both</span> for complete
              coverage across all five pillars. Circulation is the shared
              foundation in both formulas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
