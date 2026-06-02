"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getSupplementFacts } from "@/app/lib/supplementFacts";
import { getIngredientAsset } from "@/app/lib/ingredientsData";
import { FormulaId } from "@/app/lib/productData";

interface IngredientsPanelProps {
  isOpen: boolean;
  product: "flow" | "clear" | null;
  onClose: () => void;
}

const FORMULA_CODE: Record<"flow" | "clear", "F-01" | "F-02"> = {
  flow: "F-01",
  clear: "F-02",
};

const PRODUCT_NAME: Record<"flow" | "clear", string> = {
  flow: "Flow",
  clear: "Clear",
};

const FORMULA_ID: Record<"flow" | "clear", FormulaId> = {
  flow: "01",
  clear: "02",
};

// supplementFacts names that differ from ingredientsData names. Disclosure
// names follow the label spec; the alias bridges to the render lookup.
const RENDER_NAME_ALIASES: Record<string, string> = {
  "L-Alpha-GPC": "Alpha GPC",
};

/**
 * Resolve a supplement-facts ingredient name to its 3D render image.
 * Strips EFSA anchors (††) and parenthetical botanical names before lookup.
 */
function renderImageFor(name: string, formulaId: FormulaId): string | null {
  const clean = name.replace(/†/g, "").split("(")[0].trim();
  const resolved = RENDER_NAME_ALIASES[clean] ?? clean;
  return getIngredientAsset(resolved, formulaId)?.image ?? null;
}

/** Render thumbnail — larger on mobile (visual anchor), compact on desktop.
 *  Empty alt: the ingredient name renders as text directly beside the image,
 *  so announcing it twice would be noise for screen readers. */
function IngredientThumb({ image }: { image: string | null }) {
  if (!image) return null;
  return (
    <div className="relative w-14 h-14 lg:w-10 lg:h-10 shrink-0 border border-black/8 overflow-hidden bg-white">
      <Image
        src={image}
        alt=""
        fill
        loading="lazy"
        sizes="(max-width: 1024px) 56px, 40px"
        className="object-cover"
      />
    </div>
  );
}

export default function IngredientsPanel({
  isOpen,
  product,
  onClose,
}: IngredientsPanelProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
      requestAnimationFrame(() => previouslyFocused?.focus?.());
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const facts = getSupplementFacts(product);
  const hasNutrients = facts.nutrients.length > 0;
  const formulaCode = FORMULA_CODE[product];
  const productName = PRODUCT_NAME[product];
  const formulaId = FORMULA_ID[product];

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50 transition-opacity"
        onClick={onClose}
        role="button"
        aria-label="Close ingredients panel"
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ingredients-panel-title"
        className="brand-clinical fixed z-[70] bg-white border border-black/12 animate-slide-up flex flex-col bottom-0 left-0 right-0 top-[10vh] lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:right-auto lg:w-full lg:max-w-xl lg:max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 lg:px-6 lg:pt-6 border-b border-black/12">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-2">
              {"// Spec · Formulation · Doc-IP-001"}
            </p>
            <h2
              id="ingredients-panel-title"
              className="text-xl lg:text-2xl font-medium text-black leading-tight mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Ingredients panel.
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
              {formulaCode} · CONKA {productName} · Serving {facts.servingSize} · Made in UK
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="lab-clip-tr flex h-11 w-11 items-center justify-center bg-[#1B2757] text-white transition-opacity hover:opacity-85 active:opacity-70 shrink-0"
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6">
          <p className="text-sm lg:text-base text-black/70 leading-relaxed max-w-[60ch]">
            {facts.ingredientsParagraph}
          </p>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums">
            Listed in descending order of concentration
          </p>

          {/* Nutrients (Clear only) */}
          {hasNutrients && (
            <div className="mt-5 flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 border border-black/12 bg-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                  {formulaCode} · Vitamins & nutrients
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                  %NRV
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
                {facts.nutrients.map((n) => (
                  <div
                    key={n.name}
                    className="flex items-center gap-3 p-3 lg:p-2.5 border border-black/12 bg-white"
                  >
                    <IngredientThumb image={renderImageFor(n.name, formulaId)} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-black font-medium">{n.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums mt-1">
                        {n.source}
                      </div>
                    </div>
                    <div className="font-mono text-sm text-[#1B2757] tabular-nums shrink-0">
                      {n.nrv}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actives — render-led cards, 2-up on desktop, full-width on mobile */}
          <div className="mt-5 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2.5 border border-black/12 bg-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                {formulaCode} · Active ingredients
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                {String(facts.actives.length).padStart(2, "0")} actives
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
              {facts.actives.map((a, idx) => {
                const image = renderImageFor(a.name, formulaId);
                return (
                  <div
                    key={a.name}
                    className="flex items-center gap-3 p-3 lg:p-2.5 border border-black/12 bg-white"
                  >
                    {image ? (
                      <IngredientThumb image={image} />
                    ) : (
                      <span className="font-mono text-[10px] text-black/35 tabular-nums shrink-0 w-6 text-center">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-black font-medium">{a.name}</div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums mt-1">
                        {a.source}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {hasNutrients && (
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums leading-relaxed">
              †† EFSA-authorised health claim · NRV = Nutrient Reference Value (EU minimum for labelling)
            </p>
          )}

          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-black/45 tabular-nums">
            Source · FORMULATION_SPEC · Last verified 2026-04
          </p>
        </div>
      </div>
    </>,
    document.body
  );
}
