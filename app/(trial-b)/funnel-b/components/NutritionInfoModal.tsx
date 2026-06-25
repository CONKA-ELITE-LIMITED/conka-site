"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { type FunnelProduct } from "../../lib/funnelData";

interface NutritionInfoModalProps {
  isOpen: boolean;
  product: FunnelProduct;
  onClose: () => void;
}

interface NutritionEntry {
  heading: string;
  formulaCode: "F-01" | "F-02";
  src: string;
  alt: string;
}

const NUTRITION_FLOW: NutritionEntry = {
  heading: "Flow",
  formulaCode: "F-01",
  src: "/formulas/conkaFlow/FlowNutrition.jpg",
  alt: "CONKA Flow nutritional information and ingredients",
};

const NUTRITION_CLEAR: NutritionEntry = {
  heading: "Clear",
  formulaCode: "F-02",
  src: "/formulas/conkaClear/ClearNutrition.jpg",
  alt: "CONKA Clear nutritional information and ingredients",
};

function getEntries(product: FunnelProduct): NutritionEntry[] {
  if (product === "flow") return [NUTRITION_FLOW];
  if (product === "clear") return [NUTRITION_CLEAR];
  return [NUTRITION_FLOW, NUTRITION_CLEAR];
}

export default function NutritionInfoModal({
  isOpen,
  product,
  onClose,
}: NutritionInfoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const entries = getEntries(product);

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 transition-opacity"
        onClick={onClose}
        role="button"
        aria-label="Close nutritional information"
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nutrition-modal-heading"
        className="brand-clinical fixed z-[70] bg-white border border-black/12 animate-slide-up flex flex-col bottom-0 left-0 right-0 top-[10vh] lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:right-auto lg:w-full lg:max-w-xl lg:max-h-[85vh]"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 lg:px-6 lg:pt-6 border-b border-black/12">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-2">
              {"// Spec · Formulation · Doc-NI-001"}
            </p>
            <h3
              id="nutrition-modal-heading"
              className="text-xl lg:text-2xl font-medium text-black leading-tight mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Nutritional facts & ingredients.
            </h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
              Per 30ml shot · Alcohol-free extract · Made in UK
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="lab-clip-tr flex h-11 w-11 items-center justify-center border border-black/12 bg-white text-black/70 hover:bg-[#1B2757] hover:text-white hover:border-[#1B2757] transition-colors shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6">
          <div className="flex flex-col gap-6">
            {entries.map((entry, i) => {
              const figureLabel = `Fig. ${String(i + 1).padStart(2, "0")}`;
              return (
                <div key={entry.heading} className="flex flex-col">
                  <div className="flex items-center justify-between px-4 py-2.5 border border-black/12 border-b-0 bg-white">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                      {entry.formulaCode} · Nutrition panel
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                      CONKA {entry.heading}
                    </span>
                  </div>
                  <div className="relative border border-black/12 bg-[#f5f5f5] overflow-hidden">
                    <Image
                      src={entry.src}
                      alt={entry.alt}
                      width={1200}
                      height={800}
                      sizes="(max-width: 1024px) 100vw, 560px"
                      loading="eager"
                      className="block w-full h-auto"
                    />
                    <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
                      {figureLabel}
                    </span>
                    <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
                      {entry.formulaCode}
                    </span>
                  </div>
                </div>
              );
            })}

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums">
              Source · FORMULATION_SPEC · Last verified 2026-04
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
