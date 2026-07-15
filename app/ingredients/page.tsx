"use client";

import { useState } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import IngredientsPageDesktop from "@/app/components/ingredients/IngredientsPageDesktop";
import IngredientsPageMobile from "@/app/components/ingredients/IngredientsPageMobile";
import IngredientFAQ from "@/app/components/ingredients/IngredientFAQ";
import ReviewedDate from "@/app/components/ReviewedDate";
import { FormulaId } from "@/app/lib/productData";
import useIsMobile from "@/app/hooks/useIsMobile";

export default function IngredientsPage() {
  const isMobile = useIsMobile();
  const [activeFormula, setActiveFormula] = useState<FormulaId>("01");

  return (
    <div className="brand-clinical min-h-screen bg-white">
      <Navigation />

      {isMobile === undefined ? (
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
            Loading ingredients…
          </p>
        </div>
      ) : (
        <section
          className="brand-section brand-hero-first brand-bg-white"
          aria-label="Ingredients"
        >
          <div className="brand-track">
            {isMobile ? (
              <IngredientsPageMobile
                activeFormula={activeFormula}
                setActiveFormula={setActiveFormula}
              />
            ) : (
              <IngredientsPageDesktop
                activeFormula={activeFormula}
                setActiveFormula={setActiveFormula}
              />
            )}
          </div>
        </section>
      )}

      <section
        className="brand-section brand-bg-neutral"
        aria-label="Ingredient questions"
      >
        <div className="brand-track">
          <IngredientFAQ />
          <ReviewedDate isoDate="2026-07" label="July 2026" tone="onLight" divider />
        </div>
      </section>

      <Footer />
    </div>
  );
}
