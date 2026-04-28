"use client";

// TODO: no longer used on /conka-flow PDP. Check if can be deleted once /conka-clarity and /protocol/3 are swept.

import { useState } from "react";
import { FormulaId, StruggleId } from "@/app/lib/productData";
import BenefitList from "./BenefitList";
import BenefitDetail from "./BenefitDetail";

interface FormulaBenefitsProps {
  formulaId: FormulaId;
}

export default function FormulaBenefits({ formulaId }: FormulaBenefitsProps) {
  const [selectedStruggle, setSelectedStruggle] = useState<StruggleId>("focus");

  return (
    <div>
      {/* Trio header */}
      <div className="mb-10">
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
          Select a benefit · See the evidence
        </p>
      </div>

      {/* Two-column grid layout */}
      <div className="grid lg:grid-cols-[38%_1fr] gap-8 items-start">
        {/* Left: Benefit List (sticky on desktop) */}
        <div className="lg:sticky lg:top-8">
          <BenefitList
            formulaId={formulaId}
            selectedStruggle={selectedStruggle}
            onSelect={setSelectedStruggle}
          />
        </div>

        {/* Right: Benefit Detail (updates in-place) */}
        <div aria-live="polite">
          <BenefitDetail formulaId={formulaId} struggleId={selectedStruggle} />
        </div>
      </div>
    </div>
  );
}
