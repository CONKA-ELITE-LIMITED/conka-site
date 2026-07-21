"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import { FormulaId } from "@/app/lib/productData";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import ConkaCTAButton from "./ConkaCTAButton";
import FormulaToggle from "@/app/components/product/FormulaToggle";
import IngredientBottomSheet from "@/app/components/product/IngredientBottomSheet";
import { TIME_OF_DAY_BADGE, type TimeOfDay } from "@/app/lib/timeOfDayBadge";

/* ============================================================================
 * LandingProductShowcase
 *
 * "Two shots. Built around your day." — the home page's product-system
 * teaching beat. On mobile a rounded AM/PM toggle switches between Flow
 * (morning) and Clear (afternoon) so one formula shows at a time and the page
 * reads cleaner on small screens. On desktop both formulas show side by side
 * as two equal cards with larger assets (no toggle) — neither product is
 * enlarged or staged over the other, so they keep equal billing. The full
 * ingredient list opens in the shared bottom sheet.
 *
 * Earlier prototypes that *enlarged one product over the other* (spotlight
 * layouts, a video stage) were rejected 2026-06 because they implicitly demote
 * the other. Two equal cards (desktop) and the time-of-day toggle (mobile)
 * both preserve that equal-billing rule.
 * ========================================================================== */

type ProductId = "flow" | "clear";

const FORMULA_ID: Record<ProductId, FormulaId> = {
  flow: "01",
  clear: "02",
};

// Copy mirrors the lander's IngredientsSection (morning/afternoon sub-lines and
// the total active-nootropic load per formula) so the home page and the paid
// lander tell the same story.
const PRODUCTS: Record<
  ProductId,
  { name: string; timeOfDay: TimeOfDay; sub: string; mg: string; bottleSrc: string; bottleAlt: string }
> = {
  flow: {
    name: "CONKA Flow",
    timeOfDay: "Morning",
    sub: "Calm focus for your mornings.",
    mg: "3,700mg",
    bottleSrc: "/formulas/conkaFlow/FlowNew.jpg",
    bottleAlt: "CONKA Flow bottle",
  },
  clear: {
    name: "CONKA Clear",
    timeOfDay: "Afternoon",
    sub: "Afternoon clarity & reset",
    mg: "3,142mg",
    bottleSrc: "/formulas/conkaClear/ClearNew.jpg",
    bottleAlt: "CONKA Clear bottle",
  },
};

export default function LandingProductShowcase({ hideCTA = false, ctaHref = "/funnel" }: { hideCTA?: boolean; ctaHref?: string } = {}) {
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

  // Shared "Full ingredient list" CTA — used by both card layouts.
  const ingredientButton = (id: ProductId) => (
    <button
      type="button"
      onClick={() => openIngredients(id)}
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full border-[1.5px] border-black/20 px-4 py-3 text-sm font-medium text-black/70 transition-colors hover:border-black/40 hover:bg-black/[0.04] hover:text-black cursor-pointer"
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
  );

  // Product card: asset on top, then name, a time-of-day badge straddling a
  // divider, sub-line, active-nootropic load and the shared ingredient CTA.
  // One layout for both breakpoints, scaled up at lg. Neither product is
  // enlarged over the other, so they keep equal billing.
  const renderCard = (id: ProductId) => {
    const p = PRODUCTS[id];
    return (
      <div
        key={id}
        className="bg-white rounded-2xl ring-1 ring-black/8 overflow-hidden flex flex-col"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#eef1f8]">
          <Image
            src={p.bottleSrc}
            alt={p.bottleAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover scale-[1.35]"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 text-center lg:p-6">
          <p className="text-xl font-bold text-black leading-none tracking-tight lg:text-2xl">
            {p.name}
          </p>
          {/* Time-of-day badge centred on a divider (mirrors the nav Shop tiles) */}
          <div className="relative my-4 lg:my-5">
            <div className="border-t border-black/10" />
            <span
              className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-semibold leading-none ${TIME_OF_DAY_BADGE[p.timeOfDay]}`}
            >
              {p.timeOfDay}
            </span>
          </div>
          <p className="text-sm text-black mb-4">{p.sub}</p>
          <p className="text-2xl font-bold tabular-nums leading-none text-black lg:text-3xl">
            {p.mg}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-black/45 mt-1.5 mb-5">
            Active nootropics
          </p>
          <div className="mt-auto">{ingredientButton(id)}</div>
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

      {/* Mobile: one formula at a time via the AM/PM toggle (keeps the section
          calm on small screens). Desktop: both formulas as two equal cards with
          larger assets and no toggle (equal billing, neither enlarged). */}
      <div className="mx-auto max-w-[560px] lg:max-w-[720px] mb-8">
        <div className="lg:hidden">
          <FormulaToggle
            value={active}
            flowValue="flow"
            clearValue="clear"
            onChange={setActive}
            variant="time"
            className="mb-4"
          />
          {renderCard(active)}
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
          {renderCard("flow")}
          {renderCard("clear")}
        </div>
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
