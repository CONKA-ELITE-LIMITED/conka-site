"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CATEGORY_INFO,
  getIngredientsByFormula,
} from "@/app/lib/ingredientsData";
import { FormulaId } from "@/app/lib/productData";
import FormulaToggle from "@/app/components/FormulaToggle";
import IngredientCarousel from "./IngredientCarousel";
import IngredientStats from "./IngredientStats";
import IngredientBenefits from "./IngredientBenefits";
import IngredientStudies from "./IngredientStudies";
import { MolecularStructure } from "./MolecularStructure";

interface IngredientsPageMobileProps {
  activeFormula: FormulaId;
  setActiveFormula: (formula: FormulaId) => void;
}

export default function IngredientsPageMobile({
  activeFormula,
  setActiveFormula,
}: IngredientsPageMobileProps) {
  const ingredients = getIngredientsByFormula(activeFormula);
  const [activeIngredientId, setActiveIngredientId] = useState(
    ingredients[0]?.id || "",
  );

  const activeIngredient =
    ingredients.find((ing) => ing.id === activeIngredientId) || ingredients[0];
  const categoryInfo = activeIngredient
    ? CATEGORY_INFO[activeIngredient.category]
    : null;
  const activeIndex = ingredients.findIndex(
    (ing) => ing.id === activeIngredientId,
  );

  const handleFormulaChange = (formula: FormulaId) => {
    setActiveFormula(formula);
    const newIngredients = getIngredientsByFormula(formula);
    setActiveIngredientId(newIngredients[0]?.id || "");
  };

  if (!activeIngredient) return null;

  const qualityLine = [
    activeIngredient.functionalCategory,
    ...activeIngredient.qualityTags,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="pt-4 pb-8">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Formula inputs · ING-01"}
        </p>
        <h1
          className="brand-h1 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          The science inside every shot
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {String(ingredients.length).padStart(2, "0")} Ingredients · Clinical doses · Peer-reviewed
        </p>
      </div>

      <div className="mb-6">
        <FormulaToggle
          value={activeFormula}
          onChange={handleFormulaChange}
          ariaLabel="Ingredients formula"
        />
      </div>

      <div className="mb-6">
        <IngredientCarousel
          ingredients={ingredients}
          activeIngredientId={activeIngredientId}
          onSelect={setActiveIngredientId}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-black/12 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
            <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
              {String(activeIndex + 1).padStart(2, "0")}.
            </span>
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
              {categoryInfo?.name}
            </span>
          </div>

          <div className="relative aspect-[4/3]">
            {activeIngredient.image ? (
              <Image
                src={activeIngredient.image}
                alt={activeIngredient.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black/[0.03]">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/40">
                  {activeIngredient.name}
                </span>
              </div>
            )}
          </div>

          <div
            className="p-4 text-white"
            style={{ backgroundColor: "#1B2757" }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 mb-2">
              {qualityLine}
            </p>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-2xl font-semibold leading-tight">
                  {activeIngredient.name}
                </h2>
                <p className="font-mono text-[11px] italic text-white/65 mt-1 tabular-nums">
                  {activeIngredient.scientificName}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50 leading-none">
                  Share
                </p>
                <p className="font-mono text-2xl font-bold tabular-nums mt-1.5 leading-none">
                  {activeIngredient.percentage}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-black/8">
            <p className="text-sm text-black/80 leading-relaxed">
              {activeIngredient.oneLineClaim}
            </p>
            <p className="text-sm text-black/70 leading-relaxed mt-3">
              {activeIngredient.description}
            </p>
          </div>
        </div>

        <section
          className="bg-white border border-black/12 p-4"
          aria-labelledby="mobile-stats-heading"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            Mechanism · Evidence · Outcomes
          </p>
          <h3
            id="mobile-stats-heading"
            className="brand-h3 text-black mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Key statistics
          </h3>
          <IngredientStats stats={activeIngredient.keyStats} />
        </section>

        <section className="bg-white border border-black/12 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            How it works · Mechanism of action
          </p>
          <h3
            className="brand-h3 text-black mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            How it works
          </h3>
          <p className="text-sm text-black/75 leading-relaxed">
            {activeIngredient.mechanismOfAction}
          </p>
        </section>

        <section className="bg-white border border-black/12 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            Key Benefits
          </p>
          <h3
            className="brand-h3 text-black mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            What it does
          </h3>
          <IngredientBenefits benefits={activeIngredient.benefits} nested />
        </section>

        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            Peer-Reviewed · PubMed · DOI
          </p>
          <h3
            className="brand-h3 text-black mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            Clinical studies
          </h3>
          <IngredientStudies studies={activeIngredient.clinicalStudies} />
        </section>

        {activeIngredient.molecularStructure && (
          <MolecularStructure
            structure={activeIngredient.molecularStructure}
            ingredientName={activeIngredient.name}
          />
        )}

        <section className="bg-white border border-black/12 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            Formula Context · Stacking
          </p>
          <h3
            className="brand-h3 text-black mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Works well with
          </h3>
          <ul className="space-y-2">
            {activeIngredient.synergies.map((synergy, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-black/80"
              >
                <span className="font-mono text-black/30 shrink-0">—</span>
                <span>{synergy}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums text-center py-4">
          Scroll up · swipe to explore
        </p>
      </div>
    </div>
  );
}
