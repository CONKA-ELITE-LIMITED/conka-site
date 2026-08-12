"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import { MM_GALLERY_ASSETS, getPdpIngredientList } from "@/app/lib/mmPdpData";
import ProductImageSlideshow from "./ProductImageSlideshow";
import ProductBuyPanel, { TrustStrip } from "./ProductBuyPanel";
import { SpecBadge, SocialProofBadge } from "./HeroBadges";
import HeroRating from "./HeroRating";
import IngredientBenefitLede from "./IngredientBenefitLede";
import IngredientOutcomeAccordions from "./IngredientOutcomeAccordions";

interface ProductHeroMobileV3Props {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/**
 * ProductHeroMobileV3 — the mobile counterpart of ProductHeroV3 (Flow only).
 *
 * Single stacked column in the Magic Mind order: identity (viewing → title →
 * spec → rating) → rectangular asset + thumbnails → subline + description +
 * check grid → pricing widget + subscription box → collapsed Ingredients list →
 * ingredient-benefit outcome accordions → who-it's-for + risk-free. Everything
 * lives in the hero, so the page body drops the separate ingredient section on
 * mobile.
 */
export default function ProductHeroMobileV3({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ProductHeroMobileV3Props) {
  const content = getHeroContent(formulaId);
  const productType = getHeroProductType(formulaId);

  const ingredientLines = getPdpIngredientList(formulaId);
  const images = MM_GALLERY_ASSETS[formulaId].map((src) => ({ src }));

  return (
    <div className="flex flex-col gap-6 text-black">
      {/* Identity — MM order: viewing → title → spec → rating */}
      <div className="flex flex-col gap-2">
        <SocialProofBadge productType={productType} className="self-start" />
        <h1
          className="brand-h1 !mb-0 !leading-none"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.name}
        </h1>
        <SpecBadge productType={productType} className="self-start" />
        <HeroRating />
      </div>

      {/* Rectangular asset + thumbnail rail (arrows on the rail, not the image) */}
      <ProductImageSlideshow
        images={images}
        alt={content.name}
        noFrame
        smallThumbnails
        aspectRatio="landscape"
        hideArrows
      />

      {/* Subline + description + check grid, above the widget */}
      <IngredientBenefitLede formulaId={formulaId} />

      {/* Pricing widget + Add to cart + buy-once + subscription box */}
      <ProductBuyPanel
        formulaId={formulaId}
        selectedCadence={selectedCadence}
        onCadenceChange={onCadenceChange}
        onAddToCart={onAddToCart}
        onOtpAddToCart={onOtpAddToCart}
        hideHeader
        hideKeyBenefits
        hideSecondary
        hideWhatYouFeel
      />

      {/* Written-out Ingredients — collapsed accordion under the subscription box */}
      {ingredientLines.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-black/15 py-2 [&::-webkit-details-marker]:hidden">
            <span className="text-lg font-bold text-black">Ingredients</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 text-black/40 transition-transform group-open:rotate-180"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="flex flex-col gap-2 pt-3">
            {ingredientLines.map((line) => (
              <p
                key={line.label ?? "list"}
                className="text-sm leading-relaxed text-black"
              >
                {line.label && (
                  <strong className="font-bold">{line.label} </strong>
                )}
                {line.text}
              </p>
            ))}
          </div>
        </details>
      )}

      {/* Ingredient-benefit outcome accordions + who-it's-for + risk-free (the
          lede is already rendered above the widget, so suppress it here) */}
      <IngredientOutcomeAccordions formulaId={formulaId} hideLede />

      <TrustStrip />
    </div>
  );
}
