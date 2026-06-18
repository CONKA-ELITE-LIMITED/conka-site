"use client";

import { useState } from "react";
import Image from "next/image";
import {
  getOrderedActiveIngredients,
  CATEGORY_INFO,
} from "@/app/lib/ingredientsData";
import { FormulaId } from "@/app/lib/productData";
import FormulaToggle from "@/app/components/product/FormulaToggle";

/* ============================================================================
 * ClinicalIngredients
 *
 * Clinical-grammar ingredients section for the product pages. Magic Mind card
 * pattern in the clinical skin: every ingredient is a self-contained card
 * whose collapsed face shows name, class tags, render thumbnail, and a
 * one-line benefit. Expanding (native <details>) reveals the longer
 * description and the key study finding.
 *
 * Reads everything from the shared ingredientsData.ts (no local copy of
 * ingredient content or ordering).
 *
 * Modes:
 *   - Dual (default, formulaIds={["01","02"]}): Morning/Afternoon toggle +
 *     single asset of the active formula. Used on /conka-both.
 *   - Single (formulaIds={["01"]} or ["02"]): no toggle, asset block + one
 *     formula's cards. Used on /conka-flow and /conka-clarity.
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
  timeOfDay: string;
  tagline: string;
  bottleImage: string;
  bottleAlt: string;
}

const FORMULA_META: Record<FormulaId, FormulaMeta> = {
  "01": {
    shortName: "Flow",
    time: "AM",
    timeOfDay: "Morning",
    tagline: "Calm focus for your mornings.",
    bottleImage: "/formulas/conkaFlow/FlowNew.jpg",
    bottleAlt: "CONKA Flow bottle",
  },
  "02": {
    shortName: "Clear",
    time: "PM",
    timeOfDay: "Afternoon",
    tagline: "Afternoon clarity & reset",
    bottleImage: "/formulas/conkaClear/ClearNew.jpg",
    bottleAlt: "CONKA Clear bottle",
  },
};

export default function ClinicalIngredients({
  formulaIds = ["01", "02"],
}: {
  formulaIds?: FormulaId[];
} = {}) {
  const [activeFormula, setActiveFormula] = useState<FormulaId>(
    formulaIds[0] ?? "01",
  );

  const ingredients = getOrderedActiveIngredients(activeFormula);
  const meta = FORMULA_META[activeFormula];
  const isDual = formulaIds.length > 1;

  const totalGrammage = formulaIds.reduce(
    (sum, id) => sum + FORMULA_GRAMMAGE[id],
    0,
  );
  const totalActives = formulaIds.reduce(
    (sum, id) => sum + getOrderedActiveIngredients(id).length,
    0,
  );

  return (
    <div>
      {/* Header row — trio header left, toggle + asset right on desktop */}
      <div className="lg:flex lg:items-start lg:justify-between lg:gap-10 mb-8">
        {/* Trio header — grammage-led */}
        <div className="mb-8 lg:mb-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// What's inside · ING-01"}
          </p>
          <h2 className="brand-h1 mb-2" style={{ letterSpacing: "-0.02em" }}>
            {totalGrammage.toLocaleString()}mg of Active
            <br />
            Nootropics.
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
            {totalActives} science-backed ingredients · 0 caffeine · 0 filler
          </p>
        </div>

        {/* Toggle + active formula asset */}
        <div className="lg:shrink-0">
          {/* Time-of-day toggle — dual mode only */}
          {isDual && (
            <FormulaToggle
              value={activeFormula}
              flowValue="01"
              clearValue="02"
              onChange={setActiveFormula}
              ariaLabel="Choose a time of day"
              className="mb-5"
            />
          )}

          {/* Active formula — single asset + identity block */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative w-[140px] lg:w-[180px] aspect-square shrink-0 border border-black/10 bg-white overflow-hidden lab-clip-tr">
              <Image
                key={meta.bottleImage}
                src={meta.bottleImage}
                alt={meta.bottleAlt}
                fill
                sizes="(max-width: 1024px) 280px, 360px"
                className="object-cover"
              />
            </div>
            <div>
              <p
                className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] leading-none mb-2"
                style={{ color: NAVY }}
              >
                CONKA {meta.shortName} · {meta.time}
              </p>
              <p className="text-2xl lg:text-3xl font-semibold tabular-nums leading-none text-black mb-1.5">
                {FORMULA_GRAMMAGE[activeFormula].toLocaleString()}
                <span className="text-base lg:text-lg font-semibold">mg</span>
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/45 leading-none mb-3">
                Active nootropics
              </p>
              <p className="text-sm text-black/60 leading-snug">
                {meta.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient cards — Magic Mind pattern, clinical skin. Horizontal
          snap rail so the tiles read as a scannable row on every breakpoint. */}
      <div
        id="clinical-ingredients-panel"
        role="tabpanel"
        aria-label={`CONKA ${meta.shortName} ingredients`}
        className="flex gap-3 items-start overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ingredients.map((ing) => (
          <details
            key={ing.id}
            name="clinical-ingredient"
            className="group bg-white border border-black/12 lab-clip-tr w-[260px] shrink-0 snap-start"
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

            {/* Expanded — description, key finding */}
            <div className="px-4 pb-4">
              <div className="border-t border-black/8 pt-3">
                <p className="text-sm text-black/75 leading-relaxed mb-4">
                  {ing.description}
                </p>

                {ing.keyStats[0] && (
                  <>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 mb-1.5">
                      Key finding
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
