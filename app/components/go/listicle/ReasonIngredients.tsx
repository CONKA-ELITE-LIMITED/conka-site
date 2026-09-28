"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  getOrderedActiveIngredients,
  type IngredientData,
} from "@/app/lib/ingredientsData";
import type { FormulaId } from "@/app/lib/productData";
import { getIngredientBadge } from "@/app/lib/mmPdpData";
import { IngredientTile } from "@/app/components/product/ClinicalIngredients";

// Only needed once a tile is tapped, so it stays out of the page's first load.
const IngredientDetailDrawer = dynamic(
  () => import("@/app/components/product/IngredientDetailDrawer"),
  { ssr: false },
);

/**
 * The ingredients a listicle reason names, as the PDP's tiles (IM8 pattern:
 * a reason that credits an ingredient shows it). Tapping one opens the same
 * detail drawer as the PDP. Unknown ids are skipped rather than thrown on, so
 * a config typo drops a tile instead of breaking the page.
 */
export default function ReasonIngredients({
  ids,
  formula = "01",
}: {
  ids: string[];
  formula?: FormulaId;
}) {
  const [open, setOpen] = useState<IngredientData | null>(null);
  const [used, setUsed] = useState(false);
  const all = getOrderedActiveIngredients(formula);
  const ingredients = ids
    .map((id) => all.find((ing) => ing.id === id))
    .filter((ing): ing is IngredientData => Boolean(ing));

  if (!ingredients.length) return null;

  return (
    <div className="mb-5 max-w-[36rem]">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-black">
        What to expect
      </p>
      <ul className="grid grid-cols-2 gap-3">
        {ingredients.map((ing) => (
          <li key={ing.id}>
            <IngredientTile
              ingredient={ing}
              formula={formula}
              onOpen={() => {
                setUsed(true);
                setOpen(ing);
              }}
            />
          </li>
        ))}
      </ul>
      {/* Mounted from the first tap onward (not per open), so the drawer's own
          exit transition still runs on close. */}
      {used ? (
        <IngredientDetailDrawer
          open={open !== null}
          ingredient={open}
          badge={open ? getIngredientBadge(formula, open.id) : undefined}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}
