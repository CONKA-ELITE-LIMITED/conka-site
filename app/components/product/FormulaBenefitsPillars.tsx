"use client";

import { useState } from "react";
import Image from "next/image";
import { FormulaId, formulaContent } from "@/app/lib/productData";
import { CURATED_STATS } from "./formulaStatsData";
import BottleVideo from "../landing/BottleVideo";

interface FormulaBenefitsPillarsProps {
  formulaId: FormulaId;
}

// Magic Mind 3-pillar pattern, upgraded to match the home page Daily
// Benefits treatment. Collapsed cards carry an outcome-led title, one line,
// and a row of 3D ingredient render thumbnails so "what's in it" is visible
// without a tap. The clinical detail (stat, anchor, felt translation, full
// ingredient tiles) appears on expand.
//
// Both formulas get their rotating 3D bottle render in a sticky media
// column, with the cards stacked beside it.
//
// Pillar copy lives on CURATED_STATS so the legacy renderers still compiling
// against the same array shape are unaffected.

export default function FormulaBenefitsPillars({
  formulaId,
}: FormulaBenefitsPillarsProps) {
  const formula = formulaContent[formulaId];
  const stats = CURATED_STATS[formulaId];
  const total = stats.length;
  const totalPadded = String(total).padStart(2, "0");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const header = (
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
  );

  const cards = stats.map((item, idx) => {
    const isExpanded = expandedIndex === idx;
    const number = String(idx + 1).padStart(2, "0");
    const panelId = `pillar-${formulaId}-${idx}`;
    const pillarLabel = item.pillarName ?? item.label;

    return (
      <article key={pillarLabel} className="bg-white border border-black/12">
        <button
          type="button"
          onClick={() => setExpandedIndex(isExpanded ? null : idx)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
          className="w-full text-left px-5 py-5 lg:px-6 lg:py-6 flex flex-col gap-3 transition-colors hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/40 focus-visible:ring-offset-2"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
            {number} / {totalPadded}
          </span>
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

          {/* Footer row — ingredient render thumbnails (collapsed only) on
              the left, mono expander affordance on the right. Spans inside
              the card-wide button, not nested controls. */}
          <span className="flex items-center justify-between gap-3 mt-1">
            <span className="flex items-center gap-1.5">
              {!isExpanded &&
                item.ingredients?.map((ing) => (
                  <span
                    key={ing.name}
                    className="relative w-11 h-11 border border-black/8 overflow-hidden bg-white block"
                  >
                    <Image
                      src={ing.imageSrc}
                      alt={ing.name}
                      fill
                      loading="lazy"
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                ))}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50 shrink-0">
              <span className="tabular-nums">{isExpanded ? "[−]" : "[+]"}</span>
              <span>{isExpanded ? "Show less" : "Learn more"}</span>
            </span>
          </span>
        </button>

        {/* Expanded: stat → story → ingredients → felt closer → source.
            Reads as one narrative: the number, the prose that connects the
            named ingredients to it, the renders the prose just referenced,
            then the punchline. */}
        {isExpanded && (
          <div
            id={panelId}
            className="px-5 pb-6 lg:px-6 lg:pb-7 border-t border-black/8"
          >
            {/* Stat — headline number with a readable label */}
            <div className="pt-5">
              <p className="font-mono text-4xl lg:text-5xl font-bold tabular-nums text-black leading-none">
                {item.stat}
                <sup className="text-base font-normal opacity-50 ml-1 tabular-nums">
                  {item.anchor}
                </sup>
              </p>
              <p className="text-sm text-black/70 leading-snug mt-2">
                {item.label}
              </p>
            </div>

            {/* Story — prose that weaves the ingredient names into the claim */}
            {item.story && (
              <p className="text-sm leading-relaxed text-black/75 mt-4">
                {item.story}
              </p>
            )}

            {/* Ingredient tiles — the renders the story just referenced */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {item.ingredients.map((ing) => (
                  <div
                    key={ing.name}
                    className="bg-white border border-black/8 overflow-hidden"
                  >
                    <div className="relative w-full aspect-square bg-white">
                      <Image
                        src={ing.imageSrc}
                        alt={ing.name}
                        fill
                        sizes="(max-width: 1024px) 30vw, 90px"
                        className="object-cover"
                      />
                    </div>
                    <div className="px-2 py-1.5 flex items-center justify-center">
                      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-black/80 text-center leading-tight">
                        {ing.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Felt translation — the punchy closer */}
            {item.feltTranslation && (
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1B2757] leading-snug mt-5 pt-5 border-t border-black/8">
                {item.feltTranslation}
              </p>
            )}

            {/* Source — small print at the very bottom */}
            {item.sourceRef && (
              <p className="font-mono text-[10px] text-black/35 mt-3 leading-snug tabular-nums">
                {item.sourceRef}
              </p>
            )}
          </div>
        )}
      </article>
    );
  });

  // Rotating 3D render in a sticky media column, cards stacked beside it.
  return (
    <div className="flex flex-col lg:flex-row lg:gap-10">
      <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[4/5] mb-8 md:mx-0 md:w-full lg:mb-0 lg:flex-[2] lg:sticky lg:top-24 lg:self-start bg-black/[0.04] border-y md:border border-black/12">
        <BottleVideo formula={formulaId === "01" ? "flow" : "clear"} />
        <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
          Fig. 01 · {formula.name} · 3D Render
        </span>
      </div>

      <div className="lg:flex-[3]">
        {header}
        <div className="grid grid-cols-1 gap-4 items-start">{cards}</div>
      </div>
    </div>
  );
}
