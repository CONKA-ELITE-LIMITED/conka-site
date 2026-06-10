"use client";

import { useState } from "react";
import Image from "next/image";
import FormulaToggle from "@/app/components/FormulaToggle";
import {
  CATEGORY_INFO,
  getIngredientsByFormula,
} from "@/app/lib/ingredientsData";
import { FormulaId } from "@/app/lib/productData";
import IngredientSelector from "./IngredientSelector";
import IngredientStats from "./IngredientStats";
import IngredientBenefits from "./IngredientBenefits";
import IngredientStudies from "./IngredientStudies";
import { MolecularStructure } from "./MolecularStructure";

interface IngredientsPageDesktopProps {
  activeFormula: FormulaId;
  setActiveFormula: (formula: FormulaId) => void;
}

export default function IngredientsPageDesktop({
  activeFormula,
  setActiveFormula,
}: IngredientsPageDesktopProps) {
  const ingredients = getIngredientsByFormula(activeFormula);
  const [activeIngredientId, setActiveIngredientId] = useState(
    ingredients[0]?.id || "",
  );

  const activeIngredient =
    ingredients.find((ing) => ing.id === activeIngredientId) || ingredients[0];
  const categoryInfo = activeIngredient
    ? CATEGORY_INFO[activeIngredient.category]
    : null;

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
    <div className="space-y-10">
      <div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
              {"// Formula inputs · ING-01"}
            </p>
            <h1
              className="brand-h1 mb-2 text-black"
              style={{ letterSpacing: "-0.02em" }}
            >
              The science inside every shot
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
              {String(ingredients.length).padStart(2, "0")} Ingredients · Clinical doses · Peer-reviewed
            </p>
            <p className="text-sm md:text-base text-black/70 mt-4 max-w-xl leading-relaxed">
              The whole formula, ingredient by ingredient. What each one does,
              and the published research behind it.
            </p>
          </header>

          <FormulaToggle
            value={activeFormula}
            onChange={handleFormulaChange}
            ariaLabel="Ingredients formula"
          />
        </div>

        <IngredientSelector
          ingredients={ingredients}
          activeIngredientId={activeIngredientId}
          onSelect={setActiveIngredientId}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/5 lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="bg-white border border-black/12 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
              <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                {String(
                  ingredients.findIndex((i) => i.id === activeIngredient.id) + 1,
                ).padStart(2, "0")}
                .
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                {categoryInfo?.name}
              </span>
            </div>

            <div className="relative aspect-square bg-white">
              {activeIngredient.image ? (
                <Image
                  src={activeIngredient.image}
                  alt={activeIngredient.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
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

            <div className="border-t border-black/8">
              <div className="p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                  Category
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] tabular-nums text-black mt-2 leading-none">
                  {activeIngredient.functionalCategory}
                </p>
              </div>
            </div>
          </div>

          {activeIngredient.molecularStructure && (
            <MolecularStructure
              structure={activeIngredient.molecularStructure}
              ingredientName={activeIngredient.name}
            />
          )}
        </div>

        <div className="lg:w-3/5 space-y-6">
          <div className="bg-white border border-black/12 overflow-hidden">
            <div
              className="p-5 text-white"
              style={{ backgroundColor: "#1B2757" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 mb-2">
                    {qualityLine}
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight">
                    {activeIngredient.name}
                  </h2>
                  <p className="font-mono text-[12px] italic text-white/65 mt-1 tabular-nums">
                    {activeIngredient.scientificName}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-black/8">
              <p className="text-base text-black/80 leading-relaxed">
                {activeIngredient.oneLineClaim}
              </p>
              <p className="text-sm text-black/70 leading-relaxed mt-3">
                {activeIngredient.description}
              </p>
            </div>
          </div>

          <section
            className="bg-white border border-black/12 p-5 lg:p-6"
            aria-labelledby="how-it-works-heading"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-4">
              Mechanism · Evidence · Outcomes
            </p>
            <h2
              id="how-it-works-heading"
              className="brand-h2 text-black mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              How it works
            </h2>

            <div className="mb-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/45 mb-3">
                Key statistics
              </p>
              <IngredientStats stats={activeIngredient.keyStats} />
            </div>

            <div className="mb-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/45 mb-2">
                Mechanism
              </p>
              <p className="text-sm text-black/75 leading-relaxed">
                {activeIngredient.mechanismOfAction}
              </p>
            </div>

            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/45 mb-3">
                Key benefits
              </p>
              <IngredientBenefits
                benefits={activeIngredient.benefits}
                nested
              />
            </div>
          </section>

          <section
            className="bg-white border border-black/12 p-5 lg:p-6"
            aria-labelledby="clinical-studies-heading"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-4">
              Peer-Reviewed · PubMed · DOI
            </p>
            <h2
              id="clinical-studies-heading"
              className="brand-h2 text-black mb-6"
              style={{ letterSpacing: "-0.02em" }}
            >
              Clinical studies
            </h2>
            <IngredientStudies studies={activeIngredient.clinicalStudies} />
          </section>

          <section
            className="bg-white border border-black/12 p-5 lg:p-6"
            aria-labelledby="synergies-heading"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
              Formula Context · Stacking
            </p>
            <h2
              id="synergies-heading"
              className="brand-h3 text-black mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Works well with
            </h2>
            <ul className="space-y-2">
              {activeIngredient.synergies.map((synergy, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-black/80">
                  <span className="font-mono text-black/30 shrink-0">—</span>
                  <span>{synergy}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
