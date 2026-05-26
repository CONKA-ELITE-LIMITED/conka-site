"use client";

import { useState } from "react";
import Image from "next/image";
import {
  flowIngredients,
  clarityIngredients,
  type IngredientData,
} from "@/app/lib/ingredientsData";

/* ============================================================================
 * CROFormulaSplitV2
 *
 * V2 of Section 4 on /start. Replaces the V1 CROFormulaSplit (side-by-side
 * cards + drawer). One focused product at a time via an AM/PM toggle, with
 * an inline 8 Hours-style ingredient list underneath.
 * ========================================================================== */

type Formula = "flow" | "clear";

interface ProductContent {
  name: string;
  bottleImage: string;
  bottleAlt: string;
  cardCopy: string;
  ingredientsIntro: string;
}

const PRODUCT_CONTENT: Record<Formula, ProductContent> = {
  flow: {
    name: "CONKA Flow",
    bottleImage: "/formulas/conkaFlow/FlowNoBackground.png",
    bottleAlt: "CONKA Flow bottle",
    cardCopy: "Calm, drinkable focus designed for your mornings.",
    ingredientsIntro:
      "Adaptogens and antioxidants tuned for steady morning focus.",
  },
  clear: {
    name: "CONKA Clear",
    bottleImage: "/formulas/conkaClear/ClearNoBackground.png",
    bottleAlt: "CONKA Clear bottle",
    cardCopy: "Afternoon clarity, without the coffee.",
    ingredientsIntro:
      "Nootropics and antioxidants for the afternoon reset.",
  },
};

const INGREDIENTS_BY_FORMULA: Record<Formula, IngredientData[]> = {
  flow: flowIngredients,
  clear: clarityIngredients,
};

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function FormulaToggle({
  formula,
  onChange,
}: {
  formula: Formula;
  onChange: (f: Formula) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Choose a formula"
      className="inline-flex items-center bg-black/[0.05] rounded-full p-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={formula === "flow"}
        aria-controls="formula-panel"
        onClick={() => onChange("flow")}
        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
          formula === "flow"
            ? "bg-white text-black shadow-sm"
            : "text-black/55 hover:text-black/75"
        }`}
      >
        <SunIcon className="w-4 h-4" />
        AM
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={formula === "clear"}
        aria-controls="formula-panel"
        onClick={() => onChange("clear")}
        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-semibold transition-colors ${
          formula === "clear"
            ? "bg-white text-black shadow-sm"
            : "text-black/55 hover:text-black/75"
        }`}
      >
        <MoonIcon className="w-4 h-4" />
        PM
      </button>
    </div>
  );
}

function IngredientImageFallback({ name }: { name: string }) {
  const initials = name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1B2757] text-white text-[12px] font-bold tracking-wide">
      {initials}
    </div>
  );
}

function IngredientRow({
  ingredient,
  isOpen,
  onToggle,
}: {
  ingredient: IngredientData;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `ingredient-panel-${ingredient.id}`;
  const buttonId = `ingredient-button-${ingredient.id}`;
  const topStats = ingredient.keyStats.slice(0, 2);
  const study = ingredient.clinicalStudies[0];

  return (
    <div className="bg-black/[0.04] rounded-[16px] overflow-hidden">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex items-center w-full p-3 text-left hover:bg-black/[0.02] transition-colors"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white">
          {ingredient.image ? (
            <Image
              src={ingredient.image}
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <IngredientImageFallback name={ingredient.name} />
          )}
        </div>
        <div className="flex-1 ml-3 min-w-0">
          <p className="text-[14px] font-semibold text-black leading-tight truncate">
            {ingredient.name}
          </p>
        </div>
        <span
          className="text-[22px] text-black/40 leading-none w-6 flex-shrink-0 text-center"
          aria-hidden
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-[max-height] duration-200 ease-out"
        style={{ maxHeight: isOpen ? "400px" : "0px" }}
      >
        <div className="px-4 pb-4 pt-1">
          <p className="text-[12px] text-black/45 mb-3 tabular-nums">
            {ingredient.percentage} of formula
          </p>
          <p className="text-[13.5px] text-black/85 leading-snug mb-4">
            {ingredient.oneLineClaim}
          </p>
          {topStats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {topStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-[20px] font-bold text-[#1B2757] tabular-nums leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-black/55 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
          {study && (
            <p className="text-[11px] text-black/45 leading-snug">
              Source: {study.authors} ({study.year}), {study.journal}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CROFormulaSplitV2() {
  const [formula, setFormula] = useState<Formula>("flow");
  const [openIngredient, setOpenIngredient] = useState<string | null>(null);

  const content = PRODUCT_CONTENT[formula];
  const ingredients = INGREDIENTS_BY_FORMULA[formula];

  const handleFormulaChange = (next: Formula) => {
    setFormula(next);
    setOpenIngredient(null);
  };

  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        Flow for your mornings.
        <br />
        Clear for your afternoons.
      </h2>

      {/* ===== Product card ===== */}
      <div
        id="formula-panel"
        role="tabpanel"
        className="bg-white rounded-[var(--brand-radius-container)] p-6 mb-6 flex flex-col items-center"
      >
        <div className="relative w-24 h-52 mb-4">
          <Image
            src={content.bottleImage}
            alt={content.bottleAlt}
            fill
            sizes="96px"
            className="object-contain scale-150"
          />
        </div>
        <h3 className="text-[20px] font-semibold text-black mb-2">
          {content.name}
        </h3>
        <p className="text-[14px] text-black/70 text-center leading-snug mb-5 max-w-[320px]">
          {content.cardCopy}
        </p>
        <FormulaToggle formula={formula} onChange={handleFormulaChange} />
      </div>

      {/* ===== Ingredient list ===== */}
      <p className="text-[18px] text-black font-medium leading-snug mb-4">
        {content.ingredientsIntro}
      </p>
      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <IngredientRow
            key={ingredient.id}
            ingredient={ingredient}
            isOpen={openIngredient === ingredient.id}
            onToggle={() =>
              setOpenIngredient(
                openIngredient === ingredient.id ? null : ingredient.id,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
