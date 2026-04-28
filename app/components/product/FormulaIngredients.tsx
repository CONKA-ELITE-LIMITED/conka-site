"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FormulaId } from "@/app/lib/productData";
import { getIngredientsByFormula } from "@/app/lib/ingredientsData";
import type { IngredientData } from "@/app/lib/ingredientsData";
import ConkaCTAButton from "../landing/ConkaCTAButton";

const HEADING_WORD: Record<FormulaId, string> = {
  "01": "adaptogens",
  "02": "nootropics",
};

const SUBHEADING =
  "Every input is chosen for what it does, dosed to clinical targets, and backed by peer-reviewed research.";

function formatMetaLine(ingredient: IngredientData): string {
  const parts = [ingredient.functionalCategory, ...ingredient.qualityTags];
  return parts.filter(Boolean).join(" · ");
}

interface IngredientCardProps {
  ingredient: IngredientData;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}

function IngredientAccordionCard({
  ingredient,
  index,
  expanded,
  onToggle,
}: IngredientCardProps) {
  const meta = formatMetaLine(ingredient);
  const leadStudy = ingredient.clinicalStudies[0];
  const leadStat = ingredient.keyStats[0];

  return (
    <li
      className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-auto snap-start bg-white border border-black/12"
      style={{ scrollSnapAlign: "start" }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full p-4 text-left hover:bg-[var(--brand-tint)] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="relative w-[82px] h-[82px] shrink-0 border border-black/8 overflow-hidden bg-white">
            {ingredient.image ? (
              <Image
                src={ingredient.image}
                alt={ingredient.name}
                fill
                sizes="82px"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-black/[0.04] flex items-center justify-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 text-center px-1">
                  {ingredient.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span className="font-mono text-[9px] font-bold tabular-nums text-black/35 mb-1 block">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <h3 className="font-semibold text-[15px] text-black leading-tight">
              {ingredient.name}
            </h3>
            {meta && (
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/45 tabular-nums mt-1.5">
                {meta}
              </p>
            )}
            <p className="text-[13px] text-black/75 leading-snug mt-2">
              {ingredient.oneLineClaim}
            </p>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            className={`shrink-0 mt-1 text-black/40 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      <div
        aria-hidden={!expanded}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-3 border-t border-black/8">
            <p className="text-[13px] text-black/75 leading-relaxed">
              {ingredient.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {leadStat && (
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] tabular-nums text-[#1B2757] border border-black/12 bg-[var(--brand-tint)] px-2 py-1">
                  {leadStat.value} · {leadStat.label}
                </span>
              )}
              {leadStudy?.pmid && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${leadStudy.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] tabular-nums text-[#1B2757] border border-black/12 hover:border-[#1B2757] px-2 py-1 transition-colors"
                >
                  PMID · {leadStudy.pmid}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

interface FormulaIngredientsProps {
  formulaId: FormulaId;
  hideCTA?: boolean;
}

const CARD_WIDTH = 300;
const GAP = 12;

export default function FormulaIngredients({
  formulaId,
  hideCTA = false,
}: FormulaIngredientsProps) {
  const ingredients = getIngredientsByFormula(formulaId);
  const headingWord = HEADING_WORD[formulaId];
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      setActiveIndex(Math.round(scrollLeft / (CARD_WIDTH + GAP)));
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [ingredients.length]);

  const scrollByCard = (direction: 1 | -1) => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = (CARD_WIDTH + GAP) * direction;
    container.scrollTo({
      left: container.scrollLeft + amount,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (idx: number) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({
      left: idx * (CARD_WIDTH + GAP),
      behavior: "smooth",
    });
  };

  return (
    <>
      <div id="formula-ingredients-heading" className="mb-8 md:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Formula inputs · ING-01"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Formulated with naturally beneficial {headingWord}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
          {String(ingredients.length).padStart(2, "0")} Ingredients · Clinical doses · Peer-reviewed
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="text-sm md:text-base text-black/70 max-w-lg">
            {SUBHEADING}
          </p>
          {!hideCTA && (
            <div className="hidden lg:flex items-center gap-3">
              <ConkaCTAButton href="/ingredients" meta="// all formula inputs">
                See all ingredients
              </ConkaCTAButton>
            </div>
          )}
        </div>
      </div>

      <ul
        ref={scrollRef}
        className="flex lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-3 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none scroll-smooth items-start"
      >
        {ingredients.map((ingredient, idx) => (
          <IngredientAccordionCard
            key={ingredient.id}
            ingredient={ingredient}
            index={idx}
            expanded={expandedId === ingredient.id}
            onToggle={() =>
              setExpandedId(expandedId === ingredient.id ? null : ingredient.id)
            }
          />
        ))}
      </ul>

      <div className="flex lg:hidden flex-col items-center gap-6 mt-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            className={`w-11 h-11 flex items-center justify-center lab-clip-tr transition-all ${
              canScrollLeft
                ? "bg-[#1B2757] text-white hover:opacity-85 cursor-pointer"
                : "bg-black/10 text-black/30 cursor-not-allowed pointer-events-none"
            }`}
            aria-label="Previous ingredient"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            role="tablist"
            aria-label="Ingredient pagination"
            className="flex items-center gap-1.5"
          >
            {ingredients.map((ing, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={ing.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to ingredient ${idx + 1}`}
                  onClick={() => scrollToIndex(idx)}
                  className={`w-2 h-2 transition-colors ${
                    isActive
                      ? "bg-[#1B2757]"
                      : "bg-transparent border border-black/25 hover:border-black/60"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            className={`w-11 h-11 flex items-center justify-center lab-clip-tr transition-all ${
              canScrollRight
                ? "bg-[#1B2757] text-white hover:opacity-85 cursor-pointer"
                : "bg-black/10 text-black/30 cursor-not-allowed pointer-events-none"
            }`}
            aria-label="Next ingredient"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {!hideCTA && (
          <ConkaCTAButton href="/ingredients" meta="// all formula inputs">
            See all ingredients
          </ConkaCTAButton>
        )}
      </div>
    </>
  );
}
