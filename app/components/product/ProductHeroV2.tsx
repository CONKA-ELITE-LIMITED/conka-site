"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import { getProductHeroImages } from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import ProductImageSlideshow from "./ProductImageSlideshow";
import HeroAccordions from "./HeroAccordions";
import ProductBuyPanel, {
  ProductHeroHeader,
  TrustStrip,
} from "./ProductBuyPanel";

interface ProductHeroV2Props {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/**
 * ProductHeroV2 — Simple DTC PDP hero (SCRUM-1171).
 *
 * Desktop-only for now (mobile still routes to ProductHeroMobile). A 3-column
 * layout that repositions the pieces we already have:
 *   LEFT   — identity (rating, name, subline, description) + accordions/ingredients
 *   CENTER — product gallery (sticky) with a thumbnail rail
 *   RIGHT  — buy box (plan cards, CTA, trust); ingredients/accordions suppressed
 *            via hideSecondary since they now live in the left column.
 *
 * Legacy ProductHero stays intact as the fallback until this is signed off.
 */
export default function ProductHeroV2({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ProductHeroV2Props) {
  const content = getHeroContent(formulaId);
  const productType = getHeroProductType(formulaId);
  const images = getProductHeroImages(formulaId, selectedCadence).map(
    (src) => ({ src }),
  );

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="grid grid-cols-1 gap-[var(--brand-space-m)] lg:grid-cols-12 lg:items-start">
        {/* LEFT: identity + accordions — thinner so the asset column dominates */}
        <div className="order-1 flex flex-col gap-[var(--brand-space-s)] lg:col-span-3">
          <ProductHeroHeader
            formulaId={formulaId}
            showSubline
            showHeadline
            blackText
          />
          {/* Phase 5: product spec badge (caffeine / sugar / servings) goes here */}
          <HeroAccordions productType={productType} />
        </div>

        {/* CENTER: gallery — the widest column (most of the hero); sticky,
            follows scroll while the taller buy box on the right scrolls past */}
        <div className="order-2 lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
          <ProductImageSlideshow
            images={images}
            alt={`${content.name} bottle`}
          />
        </div>

        {/* RIGHT: buy box — flat MM-style cards; scrolls past the sticky gallery */}
        <div className="order-3 min-w-0 lg:col-span-4">
          <div className="flex flex-col gap-[var(--brand-space-s)]">
            <ProductBuyPanel
              formulaId={formulaId}
              selectedCadence={selectedCadence}
              onCadenceChange={onCadenceChange}
              onAddToCart={onAddToCart}
              onOtpAddToCart={onOtpAddToCart}
              hideHeader
              hideKeyBenefits
              hideSecondary
              flatCards
            />
          </div>
        </div>
      </div>

      {/* Proof strip spans all columns */}
      <TrustStrip />
    </div>
  );
}
