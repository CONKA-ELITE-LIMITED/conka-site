"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import { FormulaId } from "@/app/lib/productData";
import { getOrderedActiveIngredients } from "@/app/lib/ingredientsData";
import ConkaCTAButton from "./ConkaCTAButton";
import GuaranteeRow from "./GuaranteeRow";
import FormulaToggle from "@/app/components/product/FormulaToggle";
import IngredientBottomSheet from "@/app/components/product/IngredientBottomSheet";

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
  { name: string; timeOfDay: string; sub: string; mg: string; bottleSrc: string; bottleAlt: string }
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

// Certification strip — Magic Mind-style proof icons above the CTA.
// Same assets /start renders above its ingredients CTA.
const CERTS = [
  { src: "/icons/VeganFriendlyIcon.avif", label: "Vegan" },
  { src: "/icons/KosherCertifiedIcon.avif", label: "Kosher" },
  { src: "/icons/BpaFreeIcon.avif", label: "BPA Free" },
  { src: "/icons/ThirdPartyTestedIcon.avif", label: "Third party tested" },
];

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
      className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full border-[1.5px] border-[#1B2757] px-4 py-3 text-sm font-medium text-[#1B2757] transition-colors hover:bg-[#1B2757] hover:text-white cursor-pointer"
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

  // Product card. Mobile: horizontal (image beside details). Desktop: a dark
  // neural-blue header (white name + asset) over a light body (stats + CTA) so
  // the card reads as two clear zones.
  const renderCard = (id: ProductId) => {
    const p = PRODUCTS[id];
    return (
      <div key={id} className="bg-white border border-black/8 overflow-hidden">
        {/* Mobile: horizontal */}
        <div className="lg:hidden p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-[120px] h-[120px] shrink-0 border border-black/8 overflow-hidden bg-white">
              <Image
                src={p.bottleSrc}
                alt={p.bottleAlt}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-black leading-tight mb-1">
                {p.name}
              </p>
              <p className="text-sm text-black/55 mb-3">{p.sub}</p>
              <p className="text-2xl font-semibold tabular-nums leading-none text-black">
                {p.mg}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/45 mt-1.5">
                Active nootropics
              </p>
            </div>
          </div>
          {ingredientButton(id)}
        </div>

        {/* Desktop: slim blue title bar over an all-white card body */}
        <div className="hidden lg:block">
          <div className="bg-[var(--color-neuro-blue-dark,#0e1f3f)] px-6 py-3">
            <p className="flex items-center justify-center gap-2 text-lg font-semibold text-white leading-tight">
              {p.name}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/60" aria-hidden />
              <span className="text-sm font-normal text-white/70">{p.timeOfDay}</span>
            </p>
          </div>
          <div className="p-6 text-center">
            <div className="relative w-[260px] h-[260px] mx-auto overflow-hidden border border-black/8 bg-white mb-5">
              <Image
                src={p.bottleSrc}
                alt={p.bottleAlt}
                fill
                sizes="260px"
                className="object-cover"
              />
            </div>
            <p className="text-sm text-black/55 mb-3">{p.sub}</p>
            <p className="text-3xl font-semibold tabular-nums leading-none text-black">
              {p.mg}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/45 mt-1.5 mb-5">
              Active nootropics
            </p>
            {ingredientButton(id)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2
        className="brand-h1 mb-4 text-[#0e1f3f]"
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
            className="mb-4"
            inactiveClassName="bg-white"
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

      {/* Proof + conversion group: CTA → cert icons → guarantee, stacked and
          centred as one block on every breakpoint. The cert icons sit under
          the CTA so they reinforce the click rather than delay it. */}
      <div className="flex flex-col items-center">
        {!hideCTA && (
          <ConkaCTAButton href={ctaHref} meta={null}>
            Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
          </ConkaCTAButton>
        )}

        <div className="flex items-center justify-center gap-2 mt-5">
          {CERTS.map((cert) => (
            <Image
              key={cert.label}
              src={cert.src}
              width={56}
              height={56}
              alt={cert.label}
            />
          ))}
        </div>

        {/* Guarantee closes the section with reassurance (renders even when the
            CTA is hidden on /conka-both and protocol pages). */}
        <GuaranteeRow />
      </div>
    </div>
  );
}
