"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import { FormulaId } from "@/app/lib/productData";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import ConkaCTAButton from "./ConkaCTAButton";
import IngredientBottomSheet from "@/app/components/product/IngredientBottomSheet";
import { TIME_OF_DAY_BADGE, type TimeOfDay } from "@/app/lib/timeOfDayBadge";

/* ============================================================================
 * LandingProductShowcase
 *
 * "Two shots. Built around your day." — the home page's product-system
 * teaching beat. Both formulas render side by side on every breakpoint as two
 * equal cards — the labelV2 tall renders are narrow enough that the pair fits
 * a 390px viewport (the old square assets forced a mobile AM/PM toggle that
 * showed one formula at a time; retired 2026-08). The 3:5 crop shows the full
 * bottle. The full ingredient list opens in the shared bottom sheet.
 *
 * Earlier prototypes that *enlarged one product over the other* (spotlight
 * layouts, a video stage) were rejected 2026-06 because they implicitly demote
 * the other. Two equal cards on every breakpoint preserves that rule.
 * ========================================================================== */

type ProductId = "flow" | "clear";

const FORMULA_ID: Record<ProductId, FormulaId> = {
  flow: "01",
  clear: "02",
};

// Copy mirrors the lander's IngredientsSection (morning/afternoon sub-lines and
// the total active-nootropic load per formula) so the home page and the paid
// lander tell the same story.
//
// Deliberately NOT the shared bottleRenders map: this side-by-side pair layout
// needs the tall 1:2 *Thin crops to fit two cards on a 390px viewport, while
// the canonical renders are square.
const PRODUCTS: Record<
  ProductId,
  { name: string; timeOfDay: TimeOfDay; sub: string; mg: string; bottleSrc: string; bottleAlt: string }
> = {
  flow: {
    name: "CONKA Flow",
    timeOfDay: "Morning",
    sub: "Calm focus for your mornings.",
    mg: "3,700mg",
    bottleSrc: "/formulas/labelV2/FlowThin.jpg",
    bottleAlt: "CONKA Flow bottle",
  },
  clear: {
    name: "CONKA Clear",
    timeOfDay: "Afternoon",
    sub: "Afternoon clarity & reset.",
    mg: "3,142mg",
    bottleSrc: "/formulas/labelV2/ClearThin.jpg",
    bottleAlt: "CONKA Clear bottle",
  },
};

export default function LandingProductShowcase({ hideCTA = false, ctaHref = "/build-your-order" }: { hideCTA?: boolean; ctaHref?: string } = {}) {
  const [active, setActive] = useState<ProductId>("flow");
  const [sheetOpen, setSheetOpen] = useState(false);

  const product = PRODUCTS[active];
  const formulaId = FORMULA_ID[active];
  const ingredients = getOrderedActiveIngredients(formulaId);

  const openIngredients = (id: ProductId) => {
    setActive(id);
    setSheetOpen(true);
    try {
      track("showcase:ingredients_viewed", { product: id, source: "product_showcase" });
    } catch { /* fail silently */ }
  };

  // Shared ingredient-list CTA — the label shortens on mobile where the card
  // is half the viewport wide.
  const ingredientButton = (id: ProductId) => (
    <button
      type="button"
      onClick={() => openIngredients(id)}
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full border-[1.5px] border-black/10 bg-white px-3 py-3 text-[13px] lg:text-sm font-medium text-black/70 transition-colors hover:border-black/40 hover:text-black cursor-pointer"
    >
      <span className="lg:hidden">Ingredients</span>
      <span className="hidden lg:inline">Full ingredient list</span>
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
  );

  // Product card: a pastel time-of-day bar caps the tile, then the
  // full-bottle render (3:5 crop of the tall labelV2 asset — same treatment
  // as the BYO Learn step), name + sub-line as one unit, the active-nootropic
  // load on a navy-tint accent band, and the shared ingredient CTA. Neither
  // product is enlarged over the other (equal billing).
  const renderCard = (id: ProductId) => {
    const p = PRODUCTS[id];
    return (
      <div
        key={id}
        className="bg-white rounded-md ring-1 ring-black/8 overflow-hidden flex flex-col"
      >
        <div
          className={`py-2 text-center text-[11px] lg:text-xs font-semibold uppercase tracking-[0.14em] leading-none ${TIME_OF_DAY_BADGE[p.timeOfDay]}`}
        >
          {p.timeOfDay}
        </div>
        <div className="relative aspect-[3/5] w-full overflow-hidden bg-[#f1f1f3]">
          <Image
            src={p.bottleSrc}
            alt={p.bottleAlt}
            fill
            sizes="(max-width: 1024px) 50vw, 340px"
            className="object-cover object-center"
          />
        </div>
        {/* Name + sub-line read as one unit under the bottle */}
        <div className="px-3 pt-4 pb-4 lg:px-6 lg:pt-5 text-center">
          <p className="text-lg font-bold text-black leading-none tracking-tight lg:text-2xl">
            {p.name}
          </p>
          <p className="mt-1.5 text-[13px] lg:text-sm text-black/60 leading-snug">
            {p.sub}
          </p>
        </div>
        {/* Active-nootropic load + ingredient CTA share the tinted footer —
            the fill runs to the bottom of the tile so the white pill sits in
            contrast on it. */}
        <div className="mt-auto bg-[#eef0f5] pt-3 lg:pt-4 text-center">
          <p className="text-xl font-bold tabular-nums leading-none text-[#1B2757] lg:text-3xl">
            {p.mg}
          </p>
          <p className="text-[10px] lg:text-[11px] uppercase tracking-wide text-[#1B2757]/60 mt-1.5">
            Active nootropics
          </p>
          <div className="p-3 lg:px-5 lg:pb-5 lg:pt-4">{ingredientButton(id)}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2
        className="brand-h1 mb-4 text-black"
        style={{ letterSpacing: "var(--tracking-tight)" }}
      >
        Two shots. Built around your day.
      </h2>
      <p className="text-base lg:text-lg leading-snug text-black mb-10 max-w-[60ch]">
        Flow for the morning. Clear for the afternoon. Each formulated with
        scientifically-studied ingredients to support sustained focus, memory,
        and mental endurance.
      </p>

      {/* Both formulas side by side on every breakpoint — two equal cards,
          neither enlarged over the other. */}
      <div className="mx-auto max-w-[560px] lg:max-w-[760px] mb-8 grid grid-cols-2 gap-3 lg:gap-6">
        {renderCard("flow")}
        {renderCard("clear")}
      </div>

      <IngredientBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={product.name}
        subtitle={`${ingredients.length} active ingredients · tap any to learn more`}
        ingredients={ingredients}
      />

      {/* CTA — the section's single conversion action. The certification badges
          that used to sit here now render below the home benefit tiles. */}
      <div className="flex flex-col items-center">
        {!hideCTA && (
          <ConkaCTAButton href={ctaHref} meta={null}>
            Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
          </ConkaCTAButton>
        )}
      </div>
    </div>
  );
}
