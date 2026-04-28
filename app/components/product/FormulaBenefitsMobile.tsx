"use client";

// TODO: no longer used on /conka-flow PDP. Check if can be deleted once /conka-clarity and /protocol/3 are swept.

import { useState } from "react";
import {
  FormulaId,
  StruggleId,
  STRUGGLE_OPTIONS,
  formulaContent,
  FORMULA_COLORS,
} from "@/app/lib/productData";
import { StruggleIcon } from "./StruggleIcons";

interface FormulaBenefitsMobileProps {
  formulaId: FormulaId;
}

type StruggleSolution =
  (typeof formulaContent)[FormulaId]["struggleSolutions"][StruggleId];

interface AccordionRowProps {
  struggle: (typeof STRUGGLE_OPTIONS)[number];
  index: number;
  formulaId: FormulaId;
  solution: StruggleSolution;
  accentColor: (typeof FORMULA_COLORS)[FormulaId];
  isOpen: boolean;
  isLast: boolean;
  onTap: () => void;
}

function AccordionRow({
  struggle,
  index,
  solution,
  accentColor,
  isOpen,
  isLast,
  onTap,
}: AccordionRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap();
    }
  };

  const rowNumber = String(index + 1).padStart(2, "0");

  return (
    <div>
      {/* Collapsed header — tappable */}
      <button
        onClick={onTap}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`benefit-panel-${struggle.id}`}
        className={`w-full flex flex-col px-5 transition-colors duration-200 ${
          isOpen
            ? "py-5 bg-[var(--brand-accent)] text-white"
            : "py-4 bg-white text-black"
        }`}
      >
        {/* Row 1: counter + icon + title + stat + chevron */}
        <div className="flex items-center gap-3 w-full">
          <span
            className={`font-mono text-[10px] font-bold tabular-nums leading-none shrink-0 ${
              isOpen ? "text-white/70" : "text-black/35"
            }`}
          >
            {rowNumber}
          </span>

          <StruggleIcon
            icon={struggle.icon}
            className={`w-5 h-5 shrink-0 flex items-center justify-center ${
              isOpen ? "text-white" : "text-black/60"
            }`}
          />

          <span
            className={`flex-1 brand-body text-left font-medium ${
              isOpen ? "text-white" : "text-black"
            }`}
          >
            {struggle.label}
          </span>

          <span
            className={`font-mono text-base font-bold tabular-nums shrink-0 ${
              isOpen ? "text-white" : "text-black"
            }`}
          >
            {solution.stat}
          </span>

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-transform duration-300 ${
              isOpen
                ? "rotate-180 text-white/90"
                : "rotate-0 text-black/40"
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Row 2: struggle sub-text */}
        {solution.struggle && (
          <p
            className={`w-full text-left font-mono text-[10px] uppercase tracking-[0.16em] mt-1.5 leading-tight ${
              isOpen ? "text-white/60" : "text-black/45"
            }`}
          >
            {solution.struggle}
          </p>
        )}
      </button>

      {/* Expanded panel — navy background */}
      {isOpen && (
        <div
          id={`benefit-panel-${struggle.id}`}
          role="region"
          aria-live="polite"
          key={struggle.id}
          className="px-5 pb-6 bg-[var(--brand-accent)] text-white"
          style={{ animation: "fadeSlideDown 0.3s ease forwards" }}
        >
          {/* Outcome headline */}
          <h3 className="text-lg font-bold leading-tight mb-3 text-white">
            {solution.outcome}
          </h3>

          {/* Hero stat — mono tabular-nums */}
          <div
            className="font-mono font-bold tabular-nums mb-5 text-white"
            style={{
              fontSize: "clamp(2.8rem, 14vw, 3.8rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {solution.stat}
          </div>

          {/* Mechanism line */}
          <p className="text-sm leading-relaxed mb-5 text-white/75 line-clamp-3">
            {solution.description}
          </p>

          {/* Ingredient pill — squared */}
          {solution.ingredientAsset && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums bg-white/8 border border-white/20">
              <span className="text-white font-medium">
                {solution.ingredientAsset.name}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-white/70">
                {solution.ingredientAsset.dosage}
              </span>
            </div>
          )}

          {/* Two-stat strip — squared hairline on navy */}
          {solution.clinicalStudy.results.length >= 2 && (
            <div className="grid grid-cols-2 border-y border-white/15 mb-5">
              {solution.clinicalStudy.results.slice(0, 2).map((result, idx) => {
                const isLastCell = idx === 1;
                return (
                  <div
                    key={idx}
                    className={`px-4 py-4 flex flex-col items-start gap-1.5 ${
                      isLastCell ? "" : "border-r border-white/15"
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 leading-none">
                      {result.metric}
                    </span>
                    <span
                      className={`font-mono text-xl font-bold tabular-nums leading-none ${accentColor.text}`}
                    >
                      {result.value}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 tabular-nums">
                      {result.pValue}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Study footnote */}
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 tabular-nums">
            {solution.clinicalStudy.name} · {solution.clinicalStudy.university}{" "}
            · {solution.clinicalStudy.year}
          </p>
        </div>
      )}

      {/* Divider between rows */}
      {!isLast && <div className="h-px bg-black/8" />}
    </div>
  );
}

export default function FormulaBenefitsMobile({
  formulaId,
}: FormulaBenefitsMobileProps) {
  const [openStruggle, setOpenStruggle] = useState<StruggleId | null>(null);

  const formula = formulaContent[formulaId];
  const accentColor = FORMULA_COLORS[formulaId];

  const handleTap = (id: StruggleId) => {
    setOpenStruggle(id === openStruggle ? null : id);
  };

  return (
    <div>
      {/* Trio header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Outcome profile · SCI-02"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          What you&apos;ll actually feel.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Tap a benefit · See the evidence
        </p>
      </div>

      {/* Accordion list — full bleed, hairline border */}
      <div className="overflow-hidden -mx-5 md:-mx-[5vw] border-y border-black/12 bg-white">
        {STRUGGLE_OPTIONS.map((struggle, index) => (
          <AccordionRow
            key={struggle.id}
            struggle={struggle}
            index={index}
            formulaId={formulaId}
            solution={formula.struggleSolutions[struggle.id]}
            accentColor={accentColor}
            isOpen={openStruggle === struggle.id}
            isLast={index === STRUGGLE_OPTIONS.length - 1}
            onTap={() => handleTap(struggle.id)}
          />
        ))}
      </div>
    </div>
  );
}
