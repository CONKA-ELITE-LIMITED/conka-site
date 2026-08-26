"use client";

import { useState } from "react";
import Image from "next/image";
import {
  getOrderedActiveIngredients,
  type IngredientData,
} from "@/app/lib/ingredientsData";
import { FormulaId } from "@/app/lib/productData";
import { getIngredientBadge } from "@/app/lib/mmPdpData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import FormulaToggle from "@/app/components/product/FormulaToggle";
import IngredientDetailDrawer from "@/app/components/product/IngredientDetailDrawer";
import IngredientDisclosureRows from "@/app/components/product/IngredientDisclosureRows";

/* ============================================================================
 * ClinicalIngredients
 *
 * The PDP ingredient section: a grid of image-led tiles, each carrying a
 * two-line benefit badge, opening a detail drawer on tap (SCRUM-1262).
 *
 * The grid replaced a horizontal snap rail grouped under three outcome
 * headings. The badge now carries per tile what those headings carried per
 * group, which reads faster and removes a layer of structure. Flow has six
 * ingredients and Clear nine, so the grid is 3x2 and 3x3 at three columns.
 *
 * Two columns on mobile, not three: at 390px a three-column grid gives roughly
 * 105px tiles and an outcome like "Sustained energy" will not fit in the badge.
 *
 * Reads everything from the shared ingredientsData.ts (no local copy of
 * ingredient content or ordering); badge copy lives in mmPdpData.ts.
 *
 * Modes:
 *   - Dual (default, formulaIds={["01","02"]}): Morning/Afternoon toggle over
 *     one formula's grid at a time. Used on /conka-both.
 *   - Single (formulaIds={["01"]} or ["02"]): no toggle. Used on /conka-flow
 *     and /conka-clarity.
 * ========================================================================== */

/** Badge tint per formula, reusing the tinted pill language already
 *  established by `rolePillClass` in home/ProductCard.tsx, so the grid speaks
 *  the same visual dialect as the Morning/Afternoon bands. */
const BADGE_TINT: Record<FormulaId, string> = {
  "01": "bg-[#f7edcb] text-[#755b1a]",
  "02": "bg-[#f7ddd0] text-[#9a4526]",
};

export default function ClinicalIngredients({
  formulaIds = ["01", "02"],
}: {
  formulaIds?: FormulaId[];
} = {}) {
  const [activeFormula, setActiveFormula] = useState<FormulaId>(
    formulaIds[0] ?? "01",
  );
  const [openIngredient, setOpenIngredient] = useState<IngredientData | null>(
    null,
  );

  const ingredients = getOrderedActiveIngredients(activeFormula);
  const isDual = formulaIds.length > 1;

  // The disclosure rows describe the whole offering, not the toggled half, so
  // Both gets "03" and its two-line ingredient list regardless of the toggle.
  const heroId: ProductHeroId = isDual ? "03" : (formulaIds[0] ?? "01");

  return (
    <div>
      <div className="mb-8 max-w-2xl">
        <h2 className="brand-h1 mb-3 text-black">
          Clinically-backed ingredients
        </h2>
        <p className="brand-body text-black">
          We source the highest-quality compounds, at proven doses and in
          bioavailable forms. Each ingredient is supported by independent,
          peer-reviewed studies.
        </p>
      </div>

      {/* Time-of-day toggle, dual mode only. It also names the active formula,
          which is why the grid needs no product render above it. */}
      {isDual && (
        <FormulaToggle
          value={activeFormula}
          flowValue="01"
          clearValue="02"
          onChange={setActiveFormula}
          ariaLabel="Choose a time of day"
          className="mb-8"
        />
      )}

      <ul
        aria-label={`CONKA ${activeFormula === "01" ? "Flow" : "Clear"} ingredients`}
        className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4"
      >
        {ingredients.map((ing) => {
          const badge = getIngredientBadge(activeFormula, ing.id);

          return (
            <li key={ing.id}>
              <button
                type="button"
                onClick={() => setOpenIngredient(ing)}
                aria-label={`${ing.name}, read more`}
                className="group w-full text-left"
              >
                {/* 4:3, not square: the badge needs horizontal room more than
                    the render needs height, and it keeps the grid shorter. */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#eef0f5]">
                  {ing.image ? (
                    <Image
                      src={ing.image}
                      alt={ing.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 45vw, 30vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[28px] font-bold text-black/25">
                      {ing.name
                        .replace(/[^a-zA-Z]/g, "")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}

                  {/* Two-line badge: layman outcome, then mechanism. */}
                  {badge.outcome && (
                    <span
                      className={`absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-md px-2 py-1 text-[10px] font-bold leading-tight sm:px-2.5 sm:text-[11px] ${BADGE_TINT[activeFormula]}`}
                    >
                      {badge.outcome}
                      {badge.mechanism && (
                        <span className="block font-medium opacity-70">
                          {badge.mechanism}
                        </span>
                      )}
                    </span>
                  )}

                  {/* Expand affordance, mirroring the reference grids. */}
                  <span
                    aria-hidden
                    className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-sm transition-colors group-hover:bg-[color:var(--brand-navy)] group-hover:text-white"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </div>

                <p className="mt-2.5 text-sm font-semibold leading-snug text-black sm:text-base">
                  {ing.name}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <IngredientDisclosureRows formulaId={heroId} />

      <IngredientDetailDrawer
        open={openIngredient !== null}
        ingredient={openIngredient}
        badge={
          openIngredient
            ? getIngredientBadge(activeFormula, openIngredient.id)
            : undefined
        }
        onClose={() => setOpenIngredient(null)}
      />
    </div>
  );
}
