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
 * V2 Section 4 on /start. One product at a time via a coloured AM/PM
 * toggle, with a Magic Mind-style ingredient list underneath. Accordion
 * opens to a friendly "what it is / why it's good" pair; "Learn more"
 * reveals the data-driven study finding + stats + citation.
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

// Per-ingredient plain-language overviews. "whatIs" is the biological
// description (what is the thing). "whyGood" is the high-level benefit.
// Stats and study citations live behind the Learn more reveal so this
// surface stays readable for cold traffic.
const INGREDIENT_OVERVIEW: Record<string, { whatIs: string; whyGood: string }> =
  {
    "lemon-balm": {
      whatIs:
        "A mint-family herb used since the Middle Ages for its calming aroma.",
      whyGood: "Takes the edge off a busy mind without leaving you drowsy.",
    },
    turmeric: {
      whatIs:
        "A bright yellow root used in South Asian cooking and Ayurvedic medicine.",
      whyGood: "Supports recovery and helps keep inflammation in check.",
    },
    ashwagandha: {
      whatIs: "A small woody shrub native to India, prized in Ayurveda.",
      whyGood: "Helps your body handle stress and stay on its feet.",
    },
    rhodiola: {
      whatIs: "An arctic flowering plant that grows in cold, harsh climates.",
      whyGood: "Supports mental endurance when energy is running low.",
    },
    bilberry: {
      whatIs:
        "A wild European cousin of the blueberry, smaller and richer in pigment.",
      whyGood: "A traditional support for eyes and healthy circulation.",
    },
    "black-pepper": {
      whatIs: "A dried fruit, ground into the spice you already know.",
      whyGood: "Helps your body absorb the other ingredients more effectively.",
    },
    "vitamin-c": {
      whatIs: "An essential nutrient your body cannot make on its own.",
      whyGood: "Contributes to normal psychological function and immunity.",
    },
    "alpha-gpc": {
      whatIs:
        "A naturally occurring compound found in the brain and in lecithin.",
      whyGood:
        "A precursor to acetylcholine, the brain's focus and memory messenger.",
    },
    glutathione: {
      whatIs: "The body's master antioxidant, made inside every cell.",
      whyGood:
        "Works to protect your cells from everyday oxidative stress.",
    },
    nac: {
      whatIs: "An amino acid your body uses to make glutathione.",
      whyGood: "Mops up oxidative stress after intense thinking or training.",
    },
    alcar: {
      whatIs:
        "An amino acid your body produces to move fuel into cellular energy.",
      whyGood: "Helps your cells turn fats into the energy your brain runs on.",
    },
    ginkgo: {
      whatIs: "Leaves from one of the oldest living tree species on earth.",
      whyGood: "Traditionally used to support healthy circulation.",
    },
    lecithin: {
      whatIs:
        "A fatty substance found in egg yolks, soybeans, and sunflower seeds.",
      whyGood:
        "Builds the membranes of your brain cells and helps deliver other nutrients.",
    },
  };

// Em-dashes appear throughout the shared ingredient catalogue. Per brand voice
// they should not surface in /start copy. Source data is not modified.
function stripEmDashes(text: string): string {
  return text.replace(/\s*—\s*/g, ", ");
}

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

// Sunset / horizon sun. Reads as "afternoon" (sun lower in the sky)
// without the night connotation of a moon.
function SunHorizonIcon({ className }: { className?: string }) {
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
      <path d="M17 18a5 5 0 0 0 -10 0" />
      <line x1="2" y1="18" x2="22" y2="18" />
      <line x1="12" y1="9" x2="12" y2="6" />
      <line x1="4.93" y1="10.93" x2="6.34" y2="12.34" />
      <line x1="19.07" y1="10.93" x2="17.66" y2="12.34" />
      <line x1="2" y1="13" x2="4" y2="13" />
      <line x1="20" y1="13" x2="22" y2="13" />
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
  const baseBtn =
    "flex items-center justify-center gap-2 px-7 py-3 rounded-full text-[15px] font-semibold transition-colors";
  const amActive = formula === "flow";
  const pmActive = formula === "clear";
  return (
    <div
      role="tablist"
      aria-label="Choose a formula"
      className="inline-flex items-center bg-black/[0.06] rounded-full p-1.5"
    >
      <button
        type="button"
        role="tab"
        aria-selected={amActive}
        aria-controls="formula-panel"
        onClick={() => onChange("flow")}
        className={`${baseBtn} ${
          amActive
            ? "bg-[#F59E0B] text-white shadow-sm"
            : "text-black/55 hover:text-black/75"
        }`}
      >
        <SunIcon className="w-5 h-5" />
        AM
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={pmActive}
        aria-controls="formula-panel"
        onClick={() => onChange("clear")}
        className={`${baseBtn} ${
          pmActive
            ? "bg-[#1B2757] text-white shadow-sm"
            : "text-black/55 hover:text-black/75"
        }`}
      >
        <SunHorizonIcon className="w-5 h-5" />
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

  const overview = INGREDIENT_OVERVIEW[ingredient.id];
  const whatIs = overview?.whatIs ?? stripEmDashes(ingredient.description);
  const whyGood = overview?.whyGood ?? "";

  const topStats = ingredient.keyStats.slice(0, 2);
  const study = ingredient.clinicalStudies[0];
  const studyFinding = study ? stripEmDashes(study.keyFinding) : "";

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
        style={{ maxHeight: isOpen ? "720px" : "0px" }}
      >
        <div className="px-4 pb-4 pt-1">
          <p className="text-[10px] uppercase tracking-[0.12em] font-bold text-[#1B2757] mb-2">
            {CATEGORY_LABEL[ingredient.category]}
          </p>
          <p className="text-[13.5px] text-black/85 leading-relaxed mb-2">
            {whatIs}
          </p>
          {whyGood && (
            <p className="text-[13.5px] text-black/65 leading-relaxed mb-4">
              {whyGood}
            </p>
          )}
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
            style={{ maxHeight: showScience ? "420px" : "0px" }}
          >
            <div className="pt-4 border-t border-black/8 mt-4">
              {studyFinding && (
                <p className="text-[13px] text-black/80 leading-relaxed mb-4">
                  {studyFinding}
                </p>
              )}
              {topStats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {topStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-[22px] font-bold text-[#1B2757] tabular-nums leading-none">
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

      {/* ===== Card: bottle with bottom-left product label overlay ===== */}
      <div
        id="formula-panel"
        role="tabpanel"
        className="relative bg-black/[0.03] rounded-[var(--brand-radius-container)] overflow-hidden mb-6"
        style={{ aspectRatio: "1 / 1" }}
      >
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="relative w-44 h-[88%] -translate-y-2">
            <Image
              src={content.bottleImage}
              alt={content.bottleAlt}
              fill
              sizes="176px"
              className="object-contain scale-150"
            />
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5 pointer-events-none">
          <h3 className="text-[20px] font-semibold text-black leading-tight">
            {content.name}
          </h3>
          <p className="text-[13px] text-black/65 leading-snug mt-0.5 max-w-[78%]">
            {content.cardCopy}
          </p>
        </div>
      </div>

      {/* ===== Centered, larger, coloured AM/PM toggle ===== */}
      <div className="flex justify-center mb-12">
        <FormulaToggle formula={formula} onChange={handleFormulaChange} />
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
