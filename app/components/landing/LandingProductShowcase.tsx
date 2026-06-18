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
 * teaching beat. A rounded AM/PM toggle (ported from the lander) switches
 * between Flow (morning) and Clear (afternoon); one formula shows at a time so
 * the page reads cleaner on mobile. The toggle frames the two formulas by time
 * of day, giving them equal billing — neither product is enlarged or staged
 * over the other. The full ingredient list opens in the shared bottom sheet.
 *
 * Earlier prototypes that *enlarged* one product (spotlight layouts, a video
 * stage) were rejected 2026-06 because they implicitly demote the other. The
 * time-of-day toggle keeps both equal while still simplifying the view.
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
  { name: string; sub: string; mg: string; bottleSrc: string; bottleAlt: string }
> = {
  flow: {
    name: "CONKA Flow",
    sub: "Calm focus for your mornings.",
    mg: "3,700mg",
    bottleSrc: "/formulas/conkaFlow/FlowNew.jpg",
    bottleAlt: "CONKA Flow bottle",
  },
  clear: {
    name: "CONKA Clear",
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

  const openIngredients = () => {
    setSheetOpen(true);
    try {
      track("showcase:ingredients_viewed", { product: active, source: "product_showcase" });
    } catch { /* fail silently */ }
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// The formulation · CONKA-03"}
      </p>
      <h2
        className="brand-h1 mb-4"
        style={{ letterSpacing: "var(--tracking-tight)" }}
      >
        Two shots. Built around your day.
      </h2>
      <p className="text-base lg:text-lg leading-snug text-black/70 mb-10 max-w-[60ch]">
        Flow for the morning. Clear for the afternoon. Each formulated with
        scientifically-studied ingredients to support sustained focus, memory,
        and mental endurance.
      </p>

      {/* One formula at a time — the AM/PM toggle keeps Flow and Clear equal
          while the single card keeps the section calm on mobile. */}
      <div className="mx-auto max-w-[560px] mb-8">
        <FormulaToggle
          value={active}
          flowValue="flow"
          clearValue="clear"
          onChange={setActive}
          className="mb-4"
        />

        <div className="bg-white border border-black/8 p-4 lg:p-5">
          <div className="flex items-center gap-4 lg:gap-6 mb-4">
            <div className="relative w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] shrink-0 border border-black/8 overflow-hidden bg-white">
              <Image
                key={product.bottleSrc}
                src={product.bottleSrc}
                alt={product.bottleAlt}
                fill
                sizes="(max-width: 1024px) 120px, 150px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-lg lg:text-2xl font-semibold text-black leading-tight mb-1">
                {product.name}
              </p>
              <p className="text-sm text-black/55 mb-3">{product.sub}</p>
              <p className="text-2xl lg:text-3xl font-semibold tabular-nums leading-none text-black">
                {product.mg}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/45 mt-1.5">
                Active nootropics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openIngredients}
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
        </div>
      </div>

      <IngredientBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={product.name}
        subtitle={`${ingredients.length} active ingredients · tap any to learn more`}
        ingredients={ingredients}
      />

      {/* Proof + conversion group: cert icons → CTA → guarantee, stacked and
          centred as one block on every breakpoint. */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 mb-5">
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

        {!hideCTA && (
          <ConkaCTAButton href={ctaHref} meta={null}>
            Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
          </ConkaCTAButton>
        )}
        {/* Guarantee renders even when the CTA is hidden (/conka-both,
            protocol pages) so the section still closes with reassurance
            rather than ending abruptly on the cert icons. */}
        <GuaranteeRow />
      </div>
    </div>
  );
}
