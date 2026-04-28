"use client";

import { useState } from "react";
import { FormulaId, formulaContent } from "@/app/lib/productData";
import { CURATED_STATS } from "./formulaStatsData";

interface FormulaBenefitsPillarsProps {
  formulaId: FormulaId;
}

// Magic Mind 3-pillar pattern, simplified. Default state is name + one-line
// (Magic Mind / Seed level: scannable in five seconds). The clinical detail
// (stat, anchor, felt translation) appears only when the user taps a card,
// so the lab aesthetic is opt-in rather than the default visual treatment.
//
// Pillar copy lives on CURATED_STATS so the legacy renderers still on
// /conka-clarity keep compiling against the same array shape.

export default function FormulaBenefitsPillars({
  formulaId,
}: FormulaBenefitsPillarsProps) {
  const formula = formulaContent[formulaId];
  const stats = CURATED_STATS[formulaId];
  const total = stats.length;
  const totalPadded = String(total).padStart(2, "0");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div>
      {/* Trio header */}
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Daily benefits · PROOF-01"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          {formula.subheadline}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {total} Pillars · Peer-reviewed · Observed
        </p>
      </div>

      {/* Pillar cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
        {stats.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const number = String(idx + 1).padStart(2, "0");
          const panelId = `pillar-${formulaId}-${idx}`;
          const pillarLabel = item.pillarName ?? item.label;

          return (
            <article
              key={pillarLabel}
              className="bg-white border border-black/12"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedIndex(isExpanded ? null : idx)
                }
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="w-full text-left px-5 py-5 lg:px-6 lg:py-6 flex flex-col gap-3 transition-colors hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/40 focus-visible:ring-offset-2"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
                    {number} / {totalPadded}
                  </span>
                  <span
                    className="font-mono text-base text-black/50 leading-none flex-shrink-0"
                    aria-hidden
                  >
                    {isExpanded ? "−" : "+"}
                  </span>
                </div>
                <h3
                  className="text-xl lg:text-2xl font-semibold text-black leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {pillarLabel}
                </h3>
                {item.oneLine && (
                  <p className="text-sm md:text-base text-black/70 leading-relaxed">
                    {item.oneLine}
                  </p>
                )}
              </button>

              {/* Expanded: lab depth, opt-in */}
              {isExpanded && (
                <div
                  id={panelId}
                  className="px-5 pb-6 lg:px-6 lg:pb-7 border-t border-black/8"
                >
                  <div className="pt-5">
                    <p className="font-mono text-4xl lg:text-5xl font-bold tabular-nums text-black leading-none">
                      {item.stat}
                      <sup className="text-base font-normal opacity-50 ml-1 tabular-nums">
                        {item.anchor}
                      </sup>
                    </p>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55 mt-3 leading-snug">
                      {item.label}
                    </p>
                  </div>

                  {item.feltTranslation && (
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1B2757] leading-snug mt-5 pt-5 border-t border-black/8">
                      {item.feltTranslation}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
