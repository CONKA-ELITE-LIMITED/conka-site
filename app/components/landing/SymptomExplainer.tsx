"use client";

import { useState } from "react";
import CitationLine from "./CitationLine";

/* ============================================================================
 * SymptomExplainer
 *
 * Bespoke interactive block for the ADHD listicle: "What's actually happening
 * in your ADHD brain?". A grid of symptom buttons (primary shown, the rest
 * behind a "see more" toggle); selecting one reveals what is happening in the
 * brain plus the actives that help (first shown, the rest behind a toggle).
 * Data comes from config, so this stays ADHD-specific and is not generalised.
 * Our patterns: Tailwind, useState, CitationLine, light-surface cards.
 * ========================================================================== */

export interface SymptomExplainerIngredient {
  icon: string;
  name: string;
  /** Which shot the active sits in, e.g. "Flow" or "Clear" */
  formula: string;
  detail: string;
  citation?: string;
}

export interface SymptomExplainerSymptom {
  icon: string;
  label: string;
  /** Primary symptoms show by default; the rest sit behind "see more" */
  primary?: boolean;
  /** "What's happening in your brain" explanation */
  brain: string;
  brainCitation?: string;
  ingredients: SymptomExplainerIngredient[];
}

interface SymptomExplainerProps {
  intro: string;
  symptoms: SymptomExplainerSymptom[];
}

// Soft gradient chips cycled across the ingredient cards (matches IngredientGrid)
const CHIP_GRADS = [
  "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
  "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
  "linear-gradient(135deg,#FFF8E1,#FFECB3)",
  "linear-gradient(135deg,#EDE7F6,#D1C4E9)",
  "linear-gradient(135deg,#E0F7FA,#B2EBF2)",
  "linear-gradient(135deg,#FCE4EC,#F8BBD0)",
];

const INK = "#1B2757";

function IngredientCard({
  ing,
  gradIndex,
}: {
  ing: SymptomExplainerIngredient;
  gradIndex: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2.5">
        <span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] text-base shadow-sm"
          style={{ background: CHIP_GRADS[gradIndex % CHIP_GRADS.length] }}
          aria-hidden
        >
          {ing.icon}
        </span>
        <strong className="text-[14px] font-bold text-black">{ing.name}</strong>
        <span className="rounded-full bg-black/[0.06] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-black">
          {ing.formula}
        </span>
      </div>
      <p className="text-[13px] leading-snug text-black/70">{ing.detail}</p>
      {ing.citation ? (
        <CitationLine citation={ing.citation} className="mt-1.5" />
      ) : null}
    </div>
  );
}

export default function SymptomExplainer({
  intro,
  symptoms,
}: SymptomExplainerProps) {
  const [active, setActive] = useState(0);
  const [showAllSymptoms, setShowAllSymptoms] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showBrain, setShowBrain] = useState(false);

  const primaryCount = symptoms.filter((s) => s.primary).length;
  // If no symptom is flagged primary, show them all rather than hiding everything
  const hasPrimary = primaryCount > 0;
  const visible = symptoms
    .map((s, i) => i)
    .filter((i) => showAllSymptoms || !hasPrimary || symptoms[i].primary);
  const hiddenCount = symptoms.length - (hasPrimary ? primaryCount : symptoms.length);

  const current = symptoms[active];
  const primaryIng = current.ingredients[0];
  const restIng = current.ingredients.slice(1);

  function selectSymptom(i: number) {
    setActive(i);
    setShowAllIngredients(false);
    setShowBrain(false);
  }

  function toggleSymptoms() {
    const next = !showAllSymptoms;
    // Collapsing while a secondary symptom is open would leave the panel showing
    // a symptom with no visible button; jump back to the first primary.
    if (!next && hasPrimary && !symptoms[active].primary) {
      const firstPrimary = symptoms.findIndex((s) => s.primary);
      setActive(firstPrimary >= 0 ? firstPrimary : 0);
      setShowAllIngredients(false);
      setShowBrain(false);
    }
    setShowAllSymptoms(next);
  }

  return (
    <div>
      {/* Intro */}
      <div className="mb-4 rounded-2xl border border-black/10 bg-white p-5">
        <p className="text-[14px] leading-relaxed text-black/80">{intro}</p>
      </div>

      {/* Symptom buttons */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {visible.map((i) => {
          const s = symptoms[i];
          const isActive = i === active;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => selectSymptom(i)}
              aria-pressed={isActive}
              className="flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors"
              style={{
                borderColor: isActive ? INK : "rgba(0,0,0,0.1)",
                background: isActive ? "rgba(27,39,87,0.05)" : "#fff",
              }}
            >
              <span className="text-lg leading-none" aria-hidden>
                {s.icon}
              </span>
              <span
                className="text-[13px] font-semibold leading-snug"
                style={{ color: isActive ? INK : "#111" }}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {hasPrimary && hiddenCount > 0 ? (
        <button
          type="button"
          onClick={toggleSymptoms}
          className="mt-2.5 px-1 py-1 text-[12px] font-semibold"
          style={{ color: INK }}
        >
          {showAllSymptoms
            ? "Show fewer symptoms"
            : `See more symptoms (${hiddenCount})`}
        </button>
      ) : null}

      {/* Active panel. "How CONKA helps" leads, directly under the selected
          issue, since that is the answer the reader wants. The brain science is
          demoted to a collapsed row they can expand to learn more. */}
      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-black">
            How CONKA helps
          </p>
          {primaryIng ? <IngredientCard ing={primaryIng} gradIndex={0} /> : null}

          {restIng.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => setShowAllIngredients((v) => !v)}
                className="mt-3 px-1 py-1 text-[12px] font-semibold"
                style={{ color: INK }}
              >
                {showAllIngredients
                  ? "Show fewer ingredients"
                  : `See more ingredients (${restIng.length})`}
              </button>
              {showAllIngredients ? (
                <div className="mt-3 flex flex-col gap-4">
                  {restIng.map((ing, i) => (
                    <IngredientCard key={ing.name} ing={ing} gradIndex={i + 1} />
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        {/* Collapsed brain-science explainer: expand to learn more */}
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <button
            type="button"
            onClick={() => setShowBrain((v) => !v)}
            aria-expanded={showBrain}
            className="flex w-full items-center justify-between gap-3 p-5 text-left"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-black">
              {"What's happening in your brain"}
            </span>
            <span
              className={`text-lg font-light leading-none transition-transform ${
                showBrain ? "rotate-45" : ""
              }`}
              style={{ color: INK }}
              aria-hidden
            >
              +
            </span>
          </button>
          {showBrain ? (
            <div className="px-5 pb-5">
              <p className="text-[14px] leading-relaxed text-black/80">
                {current.brain}
              </p>
              {current.brainCitation ? (
                <CitationLine citation={current.brainCitation} className="mt-2" />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
