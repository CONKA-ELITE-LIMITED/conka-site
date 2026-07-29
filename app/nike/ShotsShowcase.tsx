"use client";

import { useState } from "react";
import Image from "next/image";
import { FormulaId } from "@/app/lib/productData";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import FormulaToggle from "@/app/components/product/FormulaToggle";
import IngredientBottomSheet from "@/app/components/product/IngredientBottomSheet";

/* ============================================================================
 * ShotsShowcase (Nike trial)
 *
 * The home page's LandingProductShowcase parts (title/description copy, the
 * Flow/Clear toggle, the bottle asset, and the shared ingredient bottom sheet)
 * composed natively for the dark trial page, rather than nested inside that
 * component's white panel. Toggle switches one formula at a time (equal
 * billing, neither product enlarged); "Full ingredient list" opens the sheet.
 * ========================================================================== */

type ProductId = "flow" | "clear";

const FORMULA_ID: Record<ProductId, FormulaId> = { flow: "01", clear: "02" };

const PRODUCTS: Record<
  ProductId,
  { name: string; timeOfDay: string; sub: string; mg: string; src: string; alt: string }
> = {
  flow: {
    name: "CONKA Flow",
    timeOfDay: "Morning",
    sub: "Calm focus for your mornings.",
    mg: "3,700mg",
    src: "/formulas/conkaFlow/FlowLabDark.png",
    alt: "CONKA Flow bottle lit on a panel against a dark backdrop",
  },
  clear: {
    name: "CONKA Clear",
    timeOfDay: "Afternoon",
    sub: "Afternoon clarity & reset.",
    mg: "3,142mg",
    src: "/formulas/conkaClear/ClearLabDark.png",
    alt: "CONKA Clear bottle lit on a panel against a dark backdrop",
  },
};

export default function ShotsShowcase() {
  const [active, setActive] = useState<ProductId>("flow");
  const [sheetOpen, setSheetOpen] = useState(false);

  const product = PRODUCTS[active];
  const ingredients = getOrderedActiveIngredients(FORMULA_ID[active]);

  return (
    <div>
      <h3 className="text-[22px] font-bold sm:text-[28px] lg:text-center">
        Two shots. Built around your day.
      </h3>
      <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-white sm:text-[16px] lg:mx-auto lg:text-center">
        Flow for the morning. Clear for the afternoon. Each formulated with
        scientifically-studied ingredients to support sustained focus, memory,
        and mental endurance.
      </p>

      <div className="mx-auto mt-6 max-w-[440px]">
        <FormulaToggle
          value={active}
          flowValue="flow"
          clearValue="clear"
          onChange={setActive}
          variant="time"
          className="mb-5"
        />

        {/* Asset — lab-dark render, its own dark backdrop blends with the page */}
        <div className="overflow-hidden rounded-2xl bg-white/[0.03]">
          <div className="relative aspect-square w-full">
            <Image
              src={product.src}
              alt={product.alt}
              fill
              sizes="(max-width: 640px) 90vw, 440px"
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 text-center">
          <p className="text-[20px] font-bold leading-none">{product.name}</p>
          <div className="relative my-4">
            <div className="border-t border-white/15" />
            <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1B2757] px-3 py-1 text-[12px] font-semibold leading-none text-white">
              {product.timeOfDay}
            </span>
          </div>
          <p className="text-[14px] text-white/85">{product.sub}</p>
          <p className="mt-4 text-[26px] font-bold leading-none tabular-nums sm:text-[30px]">
            {product.mg}
          </p>
          <p className="mt-1.5 text-[11px] uppercase tracking-wide text-white/60">
            Active nootropics
          </p>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-5 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
          >
            Full ingredient list
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <IngredientBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={product.name}
        subtitle={`${ingredients.length} active ingredients · tap any to learn more`}
        ingredients={ingredients}
      />
    </div>
  );
}
