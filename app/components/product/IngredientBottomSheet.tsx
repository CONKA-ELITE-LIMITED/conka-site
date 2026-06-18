"use client";

import { useEffect } from "react";
import Image from "next/image";
import { IngredientData } from "@/app/lib/ingredientsData";
import FormulaToggle from "@/app/components/product/FormulaToggle";

/* ============================================================================
 * IngredientBottomSheet
 *
 * Full ingredient list as a bottom-sheet modal, ported from the lander's
 * IngredientsSection so the home showcase and the clinical product pages share
 * one disclosure pattern. Each ingredient is a native <details> row: collapsed
 * face shows thumbnail, name and functional tag; expanding reveals the
 * description and the headline study finding.
 *
 * Presentational and controlled — the caller owns open/close state and passes
 * an already-ordered IngredientData[]. The thin mapper from the shared
 * ingredient model to the row's display fields lives here, in one place, so no
 * caller duplicates it.
 *
 * Rounded treatment is a deliberate exception on the sharp clinical pages: a
 * sheet that slides from the bottom edge reads as a soft, dismissible overlay.
 * ========================================================================== */

interface IngredientBottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** Sheet heading, e.g. "CONKA Flow". */
  title: string;
  /** Optional sub-heading, e.g. "6 active ingredients". */
  subtitle?: string;
  /** Already-ordered ingredients for the active formula. */
  ingredients: IngredientData[];
  /**
   * Optional AM/PM switcher rendered in the sheet header. Provide it on
   * multi-formula surfaces (e.g. the /conka-both hero) so the user can switch
   * formulas without closing the sheet; omit it when the active formula is
   * driven from outside (e.g. the home showcase section toggle).
   */
  switcher?: {
    value: "flow" | "clear";
    onChange: (value: "flow" | "clear") => void;
  };
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function IngredientBottomSheet({
  open,
  onClose,
  title,
  subtitle,
  ingredients,
  switcher,
}: IngredientBottomSheetProps) {
  // Lock body scroll and wire Escape-to-close while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100002] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-[rgba(15,18,28,0.45)]"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full sm:max-w-2xl max-h-[80vh] overflow-y-auto rounded-t-[24px] bg-white px-6 pb-9 pt-6">
        {/* Sticky header so the title and close affordance stay reachable. */}
        <div className="sticky top-0 z-10 mb-2 flex items-start justify-between gap-3 bg-white pb-2">
          <div>
            <p className="text-[20px] font-medium leading-tight text-[#1d1d1d]">
              {title}
            </p>
            {subtitle && (
              <p className="mt-0.5 text-[13px] leading-snug text-[#888]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0efea] text-xl leading-none text-[#1d1d1d] cursor-pointer"
          >
            ×
          </button>
        </div>

        {switcher && (
          <FormulaToggle
            value={switcher.value}
            flowValue="flow"
            clearValue="clear"
            onChange={switcher.onChange}
            className="mb-3"
          />
        )}

        <div>
          {ingredients.map((ing) => {
            const stat = ing.keyStats[0];
            return (
              <details
                key={ing.id}
                className="group border-b border-black/[0.07] last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 py-3.5 [&::-webkit-details-marker]:hidden">
                  <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[10px] bg-[#f0efea]">
                    {ing.image ? (
                      <Image
                        src={ing.image}
                        alt={ing.name}
                        fill
                        loading="lazy"
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-black/30">
                        {ing.name
                          .replace(/[^a-zA-Z]/g, "")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-[15px] font-medium leading-tight text-[#1d1d1d]">
                    {ing.name}
                  </span>
                  <span className="shrink-0 rounded-full bg-[#e9b200]/[0.14] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.06em] text-[#8a6d00]">
                    {ing.functionalCategory}
                  </span>
                  <ChevronDown className="w-[18px] h-[18px] shrink-0 text-[#bbb] transition-transform group-open:rotate-180" />
                </summary>
                <div className="pb-4 pl-[52px]">
                  <p className="mb-2.5 text-sm leading-relaxed text-[#5c5c5c]">
                    {ing.description}
                  </p>
                  {stat && (
                    <p className="text-[12px] font-medium text-[#1d1d1d]">
                      <b className="text-[15px] font-bold">{stat.value}</b>{" "}
                      {stat.label} ·{" "}
                      <span className="text-[11px] font-normal text-[#a3a3a3]">
                        {stat.source}
                      </span>
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}
