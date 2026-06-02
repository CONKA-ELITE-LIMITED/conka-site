"use client";

import { useState } from "react";
import Image from "next/image";
import {
  getIngredientsByFormula,
  CATEGORY_INFO,
  IngredientData,
} from "@/app/lib/ingredientsData";
import { FormulaId } from "@/app/lib/productData";

/* ============================================================================
 * ClinicalIngredients
 *
 * Clinical-grammar ingredients section for the product pages. Magic Mind card
 * pattern in the clinical skin: every ingredient is a self-contained card
 * whose collapsed face shows name, class tags, render thumbnail, and a
 * one-line benefit. Expanding (native <details>) reveals the longer
 * description, the formula share, and the key study finding.
 *
 * Reads everything from the shared ingredientsData.ts (no local copy of
 * ingredient content).
 *
 * Modes:
 *   - Dual (default, formulaIds={["01","02"]}): Flow/Clear bottle toggle.
 *     Used on /conka-both.
 *   - Single (formulaIds={["01"]} or ["02"]): no toggle, one formula's cards.
 *     Ready for the Flow/Clarity PDP rollout (Phase 3 of the plan).
 *
 * Plan: docs/development/featurePlans/clinical-component-upgrades.md
 * ========================================================================== */

const NAVY = "#1B2757";

// Active nootropic load per formula in mg. Numbers supplied by the founder
// (2026-06); verify against the formulation spec before any external claim.
const FORMULA_GRAMMAGE: Record<FormulaId, number> = {
  "01": 3700,
  "02": 3142,
};

interface FormulaMeta {
  shortName: string;
  time: string;
  tagline: string;
  bottleImage: string;
  bottleAlt: string;
}

const FORMULA_META: Record<FormulaId, FormulaMeta> = {
  "01": {
    shortName: "Flow",
    time: "AM",
    tagline: "Calm focus for your mornings.",
    bottleImage: "/formulas/conkaFlow/FlowNew.jpg",
    bottleAlt: "CONKA Flow bottle",
  },
  "02": {
    shortName: "Clear",
    time: "PM",
    tagline: "Afternoon clarity, without the coffee.",
    bottleImage: "/formulas/conkaClear/ClearNew.jpg",
    bottleAlt: "CONKA Clear bottle",
  },
};

// Product-led display order (founder's call: Glutathione leads Clear, not
// alphabetical or by percentage). Also acts as the actives filter: lemon-oil
// is a flavouring, not an active, so it is deliberately absent.
const DISPLAY_ORDER: Record<FormulaId, string[]> = {
  "01": [
    "lemon-balm",
    "turmeric",
    "ashwagandha",
    "rhodiola",
    "bilberry",
    "black-pepper",
  ],
  "02": [
    "glutathione",
    "alpha-gpc",
    "nac",
    "alcar",
    "ginkgo",
    "lecithin",
    "vitamin-c",
    "ala",
    "vitamin-b12",
  ],
};

function getOrderedIngredients(formulaId: FormulaId): IngredientData[] {
  const all = getIngredientsByFormula(formulaId);
  return DISPLAY_ORDER[formulaId]
    .map((id) => all.find((ing) => ing.id === id))
    .filter((ing): ing is IngredientData => ing !== undefined);
}

export default function ClinicalIngredients({
  formulaIds = ["01", "02"],
}: {
  formulaIds?: FormulaId[];
} = {}) {
  const [activeFormula, setActiveFormula] = useState<FormulaId>(formulaIds[0]);

  const ingredients = getOrderedIngredients(activeFormula);
  const meta = FORMULA_META[activeFormula];
  const isDual = formulaIds.length > 1;

  const totalGrammage = formulaIds.reduce(
    (sum, id) => sum + FORMULA_GRAMMAGE[id],
    0,
  );
  const totalActives = formulaIds.reduce(
    (sum, id) => sum + DISPLAY_ORDER[id].length,
    0,
  );

  return (
    <div>
      {/* Trio header — grammage-led */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// What's inside · ING-01"}
      </p>
      <h2 className="brand-h1 mb-2" style={{ letterSpacing: "-0.02em" }}>
        {totalGrammage.toLocaleString()}mg of Active
        <br />
        Nootropics.
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
        {totalActives} science-backed ingredients · 0 caffeine · 0 filler
      </p>

      {/* Formula toggle — bottle assets + per-formula nootropic load */}
      {isDual && (
        <div className="mb-8">
          <div
            role="tablist"
            aria-label="Choose a formula"
            className="grid grid-cols-2 gap-3 max-w-[520px]"
          >
            {formulaIds.map((id) => {
              const isActive = id === activeFormula;
              const m = FORMULA_META[id];
              return (
                <button
                  key={id}
                  id={`clinical-ingredients-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="clinical-ingredients-panel"
                  onClick={() => setActiveFormula(id)}
                  className="text-left bg-white cursor-pointer transition-[outline-color] focus:outline-none border border-black/10 overflow-hidden"
                  style={{
                    outline: isActive
                      ? `2px solid ${NAVY}`
                      : "2px solid transparent",
                    outlineOffset: "0",
                  }}
                >
                  {/* Asset-dominant face — bottle fills the button width */}
                  <div className="relative w-full aspect-square bg-white">
                    <Image
                      src={m.bottleImage}
                      alt={m.bottleAlt}
                      fill
                      sizes="(max-width: 768px) 45vw, 260px"
                      className="object-cover"
                    />
                  </div>
                  <div
                    className={`px-3 py-2.5 border-t transition-colors ${
                      isActive ? "border-transparent" : "border-black/8"
                    }`}
                    style={isActive ? { backgroundColor: NAVY } : undefined}
                  >
                    <p
                      className={`font-mono text-[11px] font-bold uppercase tracking-[0.16em] leading-none mb-1.5 ${
                        isActive ? "text-white" : "text-black/55"
                      }`}
                    >
                      {m.shortName} · {m.time}
                    </p>
                    <p
                      className={`font-mono text-[10px] uppercase tracking-[0.12em] tabular-nums leading-none ${
                        isActive ? "text-white/70" : "text-black/45"
                      }`}
                    >
                      {FORMULA_GRAMMAGE[id].toLocaleString()}mg actives
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-black/60 leading-snug">
            {meta.tagline}
          </p>
        </div>
      )}

      {/* Ingredient cards — Magic Mind pattern, clinical skin */}
      <div
        id="clinical-ingredients-panel"
        role="tabpanel"
        aria-label={`CONKA ${meta.shortName} ingredients`}
        aria-labelledby={
          isDual ? `clinical-ingredients-tab-${activeFormula}` : undefined
        }
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-start"
      >
        {ingredients.map((ing) => (
          <details
            key={ing.id}
            name="clinical-ingredient"
            className="group bg-white border border-black/12 lab-clip-tr"
          >
            {/* Collapsed face — name, tags, render, one-liner */}
            <summary className="p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-base font-semibold leading-snug text-black">
                  {ing.name}
                </h3>
                <span
                  className="font-mono text-[10px] font-bold tabular-nums text-black/40 group-hover:text-black mt-0.5 shrink-0"
                  aria-hidden
                >
                  <span className="group-open:hidden">[+]</span>
                  <span className="hidden group-open:inline">[−]</span>
                </span>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/45 mb-3">
                {CATEGORY_INFO[ing.category].name} |{" "}
                {ing.functionalCategory}
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 shrink-0 border border-black/8 overflow-hidden bg-white">
                  {ing.image ? (
                    <Image
                      src={ing.image}
                      alt={ing.name}
                      fill
                      loading="lazy"
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[20px] font-bold text-black/25">
                      {ing.name
                        .replace(/[^a-zA-Z]/g, "")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-sm text-black/75 leading-snug">
                  {ing.oneLineClaim}
                </p>
              </div>
            </summary>

            {/* Expanded — description, formula share, key finding */}
            <div className="px-4 pb-4">
              <div className="border-t border-black/8 pt-3">
                <p className="text-sm text-black/75 leading-relaxed mb-4">
                  {ing.description}
                </p>

                {ing.keyStats[0] && (
                  <>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 mb-1.5">
                      Key finding · {ing.percentage} of formula
                    </p>
                    <p className="text-sm text-black/75 leading-snug mb-1.5">
                      <span
                        className="text-xl font-semibold tabular-nums mr-2"
                        style={{ color: NAVY }}
                      >
                        {ing.keyStats[0].value}
                      </span>
                      {ing.keyStats[0].label}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/35">
                      {ing.keyStats[0].source}
                    </p>
                  </>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
