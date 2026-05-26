"use client";

import { useState } from "react";
import Image from "next/image";
import {
  flowIngredients,
  clarityIngredients,
  type IngredientCategory,
  type IngredientData,
} from "@/app/lib/ingredientsData";

/* ============================================================================
 * CROFormulaSplitV2
 *
 * V2 Section 4 on /start. Replaces the V1 CROFormulaSplit (side-by-side
 * cards + drawer). One product at a time via AM/PM toggle, with a Magic
 * Mind-style ingredient list underneath that opens to a friendly
 * description rather than a clinical wall.
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

const CATEGORY_LABEL: Record<IngredientCategory, string> = {
  adaptogen: "Adaptogen",
  nootropic: "Nootropic",
  vitamin: "Vitamin",
  "amino-acid": "Amino acid",
  antioxidant: "Antioxidant",
  mineral: "Mineral",
  "essential-oil": "Essential oil",
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
  const [showScience, setShowScience] = useState(false);
  const panelId = `ingredient-panel-${ingredient.id}`;
  const buttonId = `ingredient-button-${ingredient.id}`;
  const sciencePanelId = `ingredient-science-${ingredient.id}`;
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
        style={{ maxHeight: isOpen ? "640px" : "0px" }}
      >
        <div className="px-4 pb-4 pt-1">
          <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#1B2757] mb-2">
            {CATEGORY_LABEL[ingredient.category]}
          </p>
          <p className="text-[13.5px] text-black/85 leading-relaxed mb-3">
            {ingredient.description}
          </p>
          <button
            type="button"
            aria-expanded={showScience}
            aria-controls={sciencePanelId}
            onClick={() => setShowScience((v) => !v)}
            className="text-[12px] font-semibold text-[#1B2757] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {showScience ? "Hide the science" : "Learn more"}
          </button>
          <div
            id={sciencePanelId}
            role="region"
            className="overflow-hidden transition-[max-height] duration-200 ease-out"
            style={{ maxHeight: showScience ? "360px" : "0px" }}
          >
            <div className="pt-4">
              {topStats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
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
        Built for every part of your day.
      </h2>

      {/* ===== Product header (name + subline + toggle, outside the card) ===== */}
      <div className="mb-6">
        <h3 className="text-[22px] font-semibold text-black mb-1">
          {content.name}
        </h3>
        <p className="text-[14px] text-black/70 leading-snug mb-4">
          {content.cardCopy}
        </p>
        <FormulaToggle formula={formula} onChange={handleFormulaChange} />
      </div>

      {/* ===== Card: just the bottle, larger render ===== */}
      <div
        id="formula-panel"
        role="tabpanel"
        className="bg-black/[0.03] rounded-[var(--brand-radius-container)] flex justify-center items-center mb-10"
      >
        <div className="relative w-44 h-96">
          <Image
            src={content.bottleImage}
            alt={content.bottleAlt}
            fill
            sizes="176px"
            className="object-contain scale-150"
          />
        </div>
      </div>

      {/* ===== Ingredients ===== */}
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
