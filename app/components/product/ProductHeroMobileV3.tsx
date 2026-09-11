"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import { getPdpGalleryImages } from "@/app/lib/mmPdpData";
import ProductImageSlideshow from "./ProductImageSlideshow";
import ProductBuyPanel, { TrustStrip } from "./ProductBuyPanel";
import { SocialProofBadge } from "./HeroBadges";
import HeroRating from "./HeroRating";
import IngredientBenefitLede from "./IngredientBenefitLede";
import IngredientDisclosureRows from "./IngredientDisclosureRows";
import Certifications from "@/app/components/Certifications";

interface ProductHeroMobileV3Props {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/**
 * ProductHeroMobileV3 — the mobile counterpart of ProductHeroV3 (Flow, Clear, Both).
 *
 * Single stacked column: identity (viewing → title → rating → gift-value pill)
 * → rectangular asset + thumbnails → subline + description + check grid →
 * pricing widget + subscription box + Ingredients pill → proof strip.
 *
 * The lede sits ABOVE the picker (SCRUM-1335), which is the reference order
 * and a deliberate partial reversal of SCRUM-1260. That ticket had put price
 * and CTA on the first screen by pushing the lede below the widget, on the
 * reasoning that a mobile column cannot afford anything between the gallery
 * and the buy box. The counter-argument won: a cold visitor off paid social
 * has no reason to weigh a plan before anything has told them what the product
 * does. Price now lands roughly 200px lower, and the case for the product
 * lands before it. Desktop keeps the lede below the buy panel, where the right
 * column has room and the buy box is above the fold either way.
 *
 * What SCRUM-1260 cut stays cut: the hero no longer carries a whole ingredients
 * section (written-out list, outcome accordions, who-it's-for, risk-free).
 * Ingredients live in the page body, one tap away via the buy panel's pill;
 * risk-free lives in its own section further down.
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

  // Lead slide follows the selected plan (see getPdpGalleryImages).
  const images = getPdpGalleryImages(formulaId, selectedCadence).map((src) => ({
    src,
  }));

  return (
    <div className="flex flex-col gap-6 text-black">
      {/* Identity — viewing → title → rating → offer pill. The spec pill that
          sat under the title is gone (SCRUM-1334) and the benefit line that
          briefly replaced it now lives in the lede below the gallery, at full
          size (SCRUM-1336). The offer pill closes the block so the strongest
          thing we have lands before the gallery rather than below the price. */}
      <div className="flex flex-col gap-2">
        <SocialProofBadge productType={productType} className="self-start" />
        <h1
          className="brand-h1 !mb-0 !leading-none"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.name}
        </h1>
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

      {/* Subline + description + check grid, between the gallery and the
          picker, the way the reference runs it: the case is made before the
          plan is chosen. */}
      <IngredientBenefitLede formulaId={formulaId} />

      {/* Pricing widget + Add to cart + buy-once + subscription box. The pill
          opens the full ingredient list in a bottom sheet. */}
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
        showIngredientsPill
      />

      {/* The supporting answers, directly under the buy panel, the way the
          reference runs them: still in the buy decision, not a section away. */}
      <IngredientDisclosureRows formulaId={formulaId} />

      {/* See ProductHeroV3: a footnote to the buy decision, not a band. */}
      <Certifications inline />

      <TrustStrip />
    </div>
  );
}
