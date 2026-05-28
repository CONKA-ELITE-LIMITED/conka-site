"use client";

import { useState } from "react";
import Image from "next/image";

/* ============================================================================
 * IngredientsGrid — S4 client island for /startv2
 *
 * Owns: AM/PM toggle, bottle card, 2-col tile grid, and the always-visible
 * detail panel. Selected ingredient defaults to the first in the active
 * formula. Toggling formulas resets the selection.
 *
 * Asset layout: Flow renders live in /public/ingredients/renders/ (PascalCase
 * filenames). Clear renders are pending — those tiles fall back to two-letter
 * initials. When Clear assets land, mirror the FLOW_ASSET_FILENAME map.
 * ========================================================================== */

type Formula = "flow" | "clear";

interface GridIngredient {
  id: string;
  name: string;
  // Pipe-separated metadata tags shown in the detail panel,
  // e.g. "Root | Adaptogen" or "Leaf | Nootropic".
  tags: string;
  // Single-sentence benefit. Hierarchy in the panel goes
  // name → tags → benefit, optimised for scan-reading.
  benefit: string;
}

interface FormulaContent {
  name: string;
  tagline: string;
  bottleImage: string;
  bottleAlt: string;
  introLine: string;
  ingredients: GridIngredient[];
}

// Map ingredient id → render filename for Flow only. Delete once renders
// migrate to /public/ingredients/flow/{id}.jpg matching ingredientsData.ts.
const FLOW_ASSET_FILENAME: Record<string, string> = {
  "lemon-balm": "LemonBalm",
  turmeric: "Turmeric",
  ashwagandha: "Ashwagandha",
  rhodiola: "RhodiolaRosea",
  bilberry: "Bilberry",
  "black-pepper": "BlackPepper",
};

const FORMULAS: Record<Formula, FormulaContent> = {
  flow: {
    name: "CONKA Flow",
    tagline: "Calm focus for your mornings.",
    bottleImage: "/formulas/conkaFlow/FlowNoBackground.png",
    bottleAlt: "CONKA Flow bottle",
    introLine: "Six active ingredients, tuned for steady morning focus.",
    ingredients: [
      {
        id: "lemon-balm",
        name: "Lemon Balm",
        tags: "Leaf | Adaptogen",
        benefit:
          "Calms anxiety and sharpens focus without sedation or next-day grogginess.",
      },
      {
        id: "turmeric",
        name: "Turmeric",
        tags: "Root | Antioxidant",
        benefit:
          "Protects neurons and supports memory by reducing inflammation in the brain.",
      },
      {
        id: "ashwagandha",
        name: "Ashwagandha",
        tags: "Root | Adaptogen",
        benefit:
          "Lowers cortisol and helps your body handle stress, building long-term resilience.",
      },
      {
        id: "rhodiola",
        name: "Rhodiola rosea",
        tags: "Root | Adaptogen",
        benefit:
          "Fights mental fatigue and burnout when work demands keep going.",
      },
      {
        id: "bilberry",
        name: "Bilberry",
        tags: "Berry | Antioxidant",
        benefit:
          "Anthocyanins cross the blood-brain barrier to support memory and circulation.",
      },
      {
        id: "black-pepper",
        name: "Black Pepper",
        tags: "Fruit | Bioavailability",
        benefit:
          "Multiplies the absorption of curcumin and other ingredients by 2,000%.",
      },
    ],
  },
  clear: {
    name: "CONKA Clear",
    tagline: "Afternoon clarity, without the coffee.",
    bottleImage: "/formulas/conkaClear/ClearNoBackground.png",
    bottleAlt: "CONKA Clear bottle",
    introLine:
      "Nine active ingredients for the afternoon reset.",
    ingredients: [
      {
        id: "vitamin-c",
        name: "Vitamin C",
        tags: "Vitamin | Neuroprotection",
        benefit:
          "Cofactor for dopamine synthesis and the brain's primary water-soluble antioxidant.",
      },
      {
        id: "alpha-gpc",
        name: "Alpha GPC",
        tags: "Nootropic | Mental Energy",
        benefit:
          "Raises acetylcholine, the brain's focus and memory messenger.",
      },
      {
        id: "glutathione",
        name: "Glutathione",
        tags: "Antioxidant | Neuroprotection",
        benefit:
          "The body's master antioxidant, protecting cells from everyday oxidative stress.",
      },
      {
        id: "nac",
        name: "N-Acetyl Cysteine",
        tags: "Amino acid | Neuroprotection",
        benefit:
          "Replenishes cysteine to rebuild glutathione and calm brain glutamate.",
      },
      {
        id: "alcar",
        name: "Acetyl-L-Carnitine",
        tags: "Amino acid | Mental Energy",
        benefit:
          "Moves fatty acids into mitochondria to fuel the energy your brain runs on.",
      },
      {
        id: "ginkgo",
        name: "Ginkgo Biloba",
        tags: "Leaf | Nootropic",
        benefit:
          "Improves cerebral circulation so oxygen and glucose reach neurons efficiently.",
      },
      {
        id: "lecithin",
        name: "Lecithin",
        tags: "Phospholipid | Nootropic",
        benefit:
          "Supplies phosphatidylcholine to keep neuronal membranes fluid and active.",
      },
      {
        id: "ala",
        name: "Alpha Lipoic Acid",
        tags: "Antioxidant | Neuroprotection",
        benefit:
          "Universal antioxidant that recycles vitamin C, vitamin E, and glutathione across the body.",
      },
      {
        id: "vitamin-b12",
        name: "Vitamin B12",
        tags: "Vitamin | Brain Health",
        benefit:
          "Methylcobalamin supports myelin synthesis and slowed brain atrophy in Oxford trials.",
      },
    ],
  },
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

function FallbackTile({ name }: { name: string }) {
  const initials = name.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
  return (
    <div className="w-full h-full flex items-center justify-center text-[30px] font-bold text-black/25 tracking-wide">
      {initials}
    </div>
  );
}

export default function IngredientsGrid() {
  const [formula, setFormula] = useState<Formula>("flow");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const content = FORMULAS[formula];
  const selected =
    content.ingredients.find((i) => i.id === selectedId) ??
    content.ingredients[0];
  const isFlow = formula === "flow";

  const handleToggle = (next: Formula) => {
    setFormula(next);
    setSelectedId(null);
  };

  return (
    <div>
      {/* AM/PM toggle */}
      <div className="flex justify-center mb-6">
        <div
          role="tablist"
          aria-label="Choose a formula"
          className="inline-flex items-center bg-black/[0.06] rounded-full p-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={isFlow}
            onClick={() => handleToggle("flow")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold transition-colors ${
              isFlow
                ? "bg-[#F59E0B] text-white shadow-sm"
                : "text-black/55 hover:text-black/75"
            }`}
          >
            <SunIcon className="w-5 h-5" />
            Morning
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isFlow}
            onClick={() => handleToggle("clear")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold transition-colors ${
              !isFlow
                ? "bg-[#94B9FF] text-black shadow-sm"
                : "text-black/55 hover:text-black/75"
            }`}
          >
            <SunHorizonIcon className="w-5 h-5" />
            Afternoon
          </button>
        </div>
      </div>

      {/* Bottle card */}
      <div className="relative bg-white rounded-[16px] overflow-hidden mb-6 aspect-[5/4] border border-black/10">
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
          <h3 className="text-[18px] font-semibold text-black leading-tight">
            {content.name}
          </h3>
          <p className="text-[13px] text-black/65 leading-snug mt-0.5 max-w-[78%]">
            {content.tagline}
          </p>
        </div>
      </div>

      {/* Per-formula intro */}
      <p className="text-[15px] leading-snug text-black/75 mb-4">
        {content.introLine}
      </p>

      {/* Detail panel — always rendered above the grid, content swaps on
          selection. Hierarchy: name (large), tags (small caps), benefit (body).
          Defaults to the first ingredient when nothing is tapped. */}
      <div className="mb-6 p-5 bg-black/[0.04] rounded-[16px]">
        <h4
          className="text-[24px] font-semibold text-black leading-tight mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          {selected.name}
        </h4>
        <p className="text-[11px] uppercase tracking-[0.14em] font-semibold text-black/55 mb-4">
          {selected.tags}
        </p>
        <p className="text-[15px] text-black leading-relaxed">
          {selected.benefit}
        </p>
      </div>

      {/* Tile grid */}
      <div
        role="tabpanel"
        aria-label={`${content.name} ingredients`}
        className="grid grid-cols-3 gap-3"
      >
        {content.ingredients.map((ing) => {
          const isSelected = selected.id === ing.id;
          const assetFilename = isFlow
            ? FLOW_ASSET_FILENAME[ing.id]
            : undefined;
          return (
            <button
              key={ing.id}
              type="button"
              onClick={() => setSelectedId(ing.id)}
              className="text-left bg-white rounded-[14px] overflow-hidden transition-all focus:outline-none border border-black/10"
              style={{
                outline: isSelected
                  ? "2px solid #1a1a1a"
                  : "2px solid transparent",
                outlineOffset: "0",
              }}
              aria-pressed={isSelected}
            >
              <div className="relative aspect-square">
                {assetFilename ? (
                  <Image
                    src={`/ingredients/renders/${assetFilename}.jpg`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 30vw, 180px"
                    className="object-contain"
                  />
                ) : (
                  <FallbackTile name={ing.name} />
                )}
              </div>
              <div className="px-2.5 pb-2.5 pt-0.5">
                <p className="text-[12.5px] font-semibold text-black leading-tight">
                  {ing.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
