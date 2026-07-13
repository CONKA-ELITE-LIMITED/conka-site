"use client";

import { useState } from "react";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";
import IngredientsPanel from "@/app/components/landing/IngredientsPanel";

export type HeroProductType = "flow" | "clear" | "both";

interface HeroAccordionsProps {
  productType: HeroProductType;
  /** Persona-specific "who it's for" copy; falls back to the product default. */
  whoItsFor?: string[];
  /** Drop the Ingredients accordion + panel (listicle uses its own sheet). */
  hideIngredients?: boolean;
}

const WHO_ITS_FOR: Record<HeroProductType, string[]> = {
  flow: [
    "You want sustained energy and sharp focus across a full cognitive day, without the crash. FLOW stacks alongside your coffee to extend its effect and reduce how much you need, or replaces it entirely through cellular energy production rather than stimulant dependency.",
    "Your work demands hours of clean output: deep focus, back-to-back calls, physical training. FLOW supports both cognitive and physical performance through the same mitochondrial pathways.",
  ],
  clear: [
    "Your second half of the day consistently underperforms the first. Slower decisions, reduced concentration, mentally checked out by 3pm. CLEAR is designed specifically for this window, extending afternoon output without relying on more caffeine.",
    "You carry background stress that quietly degrades your focus and physical recovery. CLEAR works at the cortisol level, supporting both cognitive clarity and the adaptogenic recovery that athletes and high performers need.",
  ],
  both: [
    "You need 10+ hours of consistent cognitive performance. FLOW in the morning for sharpness and energy. CLEAR after lunch for afternoon precision and focus. Together they cover the full day without stimulant cycling or a mid-afternoon drop.",
    "You're optimising cognitive and physical performance across a full day, and want to reduce caffeine dependence without reducing output. A timed, sequenced system achieves more than either formula alone.",
  ],
};

const GUARANTEE_TEXT = `Install the app, take your cognitive baseline, and track your improvement daily. If your score doesn't move after ${GUARANTEE_DAYS} days, we'll refund you completely. No return required. First-time customers only.`;

export default function HeroAccordions({
  productType,
  whoItsFor,
  hideIngredients = false,
}: HeroAccordionsProps) {
  const [openSection, setOpenSection] = useState<"who" | "guarantee" | "ingredients-both" | null>(null);
  const [ingredientsProduct, setIngredientsProduct] = useState<"flow" | "clear" | null>(null);

  const toggle = (section: "who" | "guarantee" | "ingredients-both") =>
    setOpenSection((prev) => (prev === section ? null : section));

  const openIngredients = (product: "flow" | "clear") => {
    setIngredientsProduct(product);
  };

  const whoItems = whoItsFor ?? WHO_ITS_FOR[productType];

  return (
    <>
      <div className="border-t border-black/10 mt-1">
        {/* Who it's for */}
        <div className="border-b border-black/10">
          <button
            type="button"
            onClick={() => toggle("who")}
            className="w-full flex items-center justify-between py-3.5 text-left group"
            aria-expanded={openSection === "who"}
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/60 group-hover:text-black/80 transition-colors">
              Who it&apos;s for
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              className={`text-black/40 transition-transform duration-200 flex-shrink-0 ${openSection === "who" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {openSection === "who" && (
            <div className="pb-4 space-y-3">
              {whoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-mono text-[9px] font-bold text-black/30 tabular-nums shrink-0 mt-0.5 w-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-black/70 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 100-Day Guarantee */}
        <div className="border-b border-black/10">
          <button
            type="button"
            onClick={() => toggle("guarantee")}
            className="w-full flex items-center justify-between py-3.5 text-left group"
            aria-expanded={openSection === "guarantee"}
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/60 group-hover:text-black/80 transition-colors">
              {GUARANTEE_DAYS}-Day Risk-Free Trial
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              className={`text-black/40 transition-transform duration-200 flex-shrink-0 ${openSection === "guarantee" ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {openSection === "guarantee" && (
            <div className="pb-4">
              <p className="text-sm text-black/70 leading-relaxed">{GUARANTEE_TEXT}</p>
            </div>
          )}
        </div>

        {/* Ingredients */}
        {hideIngredients ? null : productType === "both" ? (
          <div className="border-b border-black/10">
            <button
              type="button"
              onClick={() => toggle("ingredients-both")}
              className="w-full flex items-center justify-between py-3.5 text-left group"
              aria-expanded={openSection === "ingredients-both"}
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/60 group-hover:text-black/80 transition-colors">
                Ingredients
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                className={`text-black/40 transition-transform duration-200 flex-shrink-0 ${openSection === "ingredients-both" ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openSection === "ingredients-both" && (
              <div className="pb-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => openIngredients("flow")}
                  className="flex-1 py-2.5 border border-black/12 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60 hover:bg-black/4 hover:text-black/80 transition-colors"
                >
                  Flow Ingredients
                </button>
                <button
                  type="button"
                  onClick={() => openIngredients("clear")}
                  className="flex-1 py-2.5 border border-black/12 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60 hover:bg-black/4 hover:text-black/80 transition-colors"
                >
                  Clear Ingredients
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-b border-black/10">
            <button
              type="button"
              onClick={() => openIngredients(productType)}
              className="w-full flex items-center justify-between py-3.5 text-left group"
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/60 group-hover:text-black/80 transition-colors">
                Ingredients
              </span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                className="text-black/40 flex-shrink-0"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {!hideIngredients && (
        <IngredientsPanel
          isOpen={ingredientsProduct !== null}
          product={ingredientsProduct}
          onClose={() => setIngredientsProduct(null)}
        />
      )}
    </>
  );
}
