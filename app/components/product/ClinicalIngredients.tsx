"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
 * Ingredients section for the product pages, in the Simple DTC skin (black
 * type, no mono eyebrows/tags, soft cards): every ingredient is a
 * self-contained card whose collapsed face shows name, class tags, render
 * thumbnail, and a one-line benefit. Expanding (native <details>) reveals the
 * longer description and the key study finding.
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

  // Basic scroll-progress indicator for the horizontal ingredient rail: the
  // thumb width is the visible fraction, its offset the scrolled fraction.
  const railRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 1, offset: 0 });

  const updateScroll = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth) {
      setThumb({ width: 1, offset: 0 });
      return;
    }
    setThumb({
      width: clientWidth / scrollWidth,
      offset: scrollLeft / scrollWidth,
    });
  }, []);

  // Recompute on mount and when the active formula (and thus tile count) changes.
  useEffect(() => {
    updateScroll();
  }, [updateScroll, activeFormula]);

  return (
    <div>
      {/* Header row — trio header left, toggle + asset right on desktop */}
      <div className="lg:flex lg:items-start lg:justify-between lg:gap-10 mb-8">
        {/* Simple DTC header — human framing, no mono eyebrow or grammage-led H1 */}
        <div className="mb-8 lg:mb-0 lg:max-w-md">
          <h2 className="brand-h1 mb-3 text-black">
            Clinically-backed ingredients
          </h2>
          <p className="brand-body text-black">
            We source the highest-quality compounds, at proven doses and in
            bioavailable forms. Each ingredient is supported by independent,
            peer-reviewed studies.
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
            <div className="relative w-[140px] lg:w-[180px] aspect-square shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white">
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
              <p className="mb-2 text-sm font-semibold leading-none text-black">
                CONKA {meta.shortName}
              </p>
              <p className="mb-1.5 text-2xl lg:text-3xl font-semibold tabular-nums leading-none text-black">
                {FORMULA_GRAMMAGE[activeFormula].toLocaleString()}
                <span className="text-base lg:text-lg font-semibold">mg</span>
              </p>
              <p className="mb-3 text-xs leading-none text-black/50">
                Active nootropics
              </p>
              <p className="text-sm leading-snug text-black/70">
                {meta.tagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredient cards — Magic Mind pattern, Simple DTC skin. Horizontal
          snap rail so the tiles read as a scannable row on every breakpoint. */}
      <div
        ref={railRef}
        onScroll={updateScroll}
        aria-label={`CONKA ${meta.shortName} ingredients`}
        className="flex gap-3 items-start overflow-x-auto snap-x pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ingredients.map((ing) => (
          <details
            key={ing.id}
            name="clinical-ingredient"
            className="group w-[260px] shrink-0 snap-start rounded-2xl border border-black/10 bg-white"
          >
            {/* Collapsed face — name, tags, render, one-liner */}
            <summary className="p-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-base font-semibold leading-snug text-black">
                  {ing.name}
                </h3>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 shrink-0 text-black/40 transition-transform group-open:rotate-180"
                  aria-hidden
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
              <p className="mb-3 font-mono text-xs text-black">
                {CATEGORY_INFO[ing.category].name} | {ing.functionalCategory}
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
                <p className="text-sm leading-snug text-black">
                  {ing.oneLineClaim}
                </p>
              </div>
            </summary>

            {/* Expanded — description, key finding */}
            <div className="px-4 pb-4">
              <div className="border-t border-black/10 pt-3">
                <p className="mb-4 text-sm leading-relaxed text-black/70">
                  {ing.description}
                </p>

                {ing.keyStats[0] && (
                  <>
                    <p className="mb-1.5 text-xs font-medium text-black/50">
                      Key finding
                    </p>
                    <p className="mb-1.5 text-sm leading-snug text-black">
                      <span
                        className="mr-2 text-xl font-semibold tabular-nums"
                        style={{ color: NAVY }}
                      >
                        {ing.keyStats[0].value}
                      </span>
                      {ing.keyStats[0].label}
                    </p>
                    <p className="text-xs text-black/40">
                      {ing.keyStats[0].source}
                    </p>
                  </>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Scroll indicator — thumb reflects the visible window over the rail */}
      {thumb.width < 1 && (
        <div
          className="mt-4 h-1 w-full max-w-[240px] overflow-hidden rounded-full bg-black/10"
          aria-hidden
        >
          <div
            className="h-full rounded-full bg-black/40"
            style={{
              width: `${thumb.width * 100}%`,
              marginLeft: `${thumb.offset * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
