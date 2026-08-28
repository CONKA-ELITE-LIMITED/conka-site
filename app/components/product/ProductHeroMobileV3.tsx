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
import { SpecBadge, SocialProofBadge } from "./HeroBadges";
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
 * Single stacked column, ordered so the buy decision comes first: identity
 * (viewing → title → spec → rating) → rectangular asset + thumbnails → pricing
 * widget + subscription box + Ingredients pill → subline + description + check
 * grid → proof strip.
 *
 * The hero deliberately stops at the buy decision (SCRUM-1260). It used to
 * carry a whole ingredients section below the widget (written-out list, outcome
 * accordions, who-it's-for, risk-free), which is the desktop pattern: it works
 * beside a sticky image column and does not translate to one mobile column,
 * where it just pushed price and CTA off the first screen. Ingredients live in
 * the page body, one tap away via the buy panel's pill; risk-free lives in its
 * own section further down.
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

      {/* Pricing widget + Add to cart + buy-once + subscription box, directly
          under the gallery so price and CTA land on the first screen. The pill
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

      {/* Subline + description + check grid, below the widget */}
      <IngredientBenefitLede formulaId={formulaId} />

      {/* The supporting answers, directly under the check grid, the way the
          reference runs them: still in the buy decision, not a section away. */}
      <IngredientDisclosureRows formulaId={formulaId} />

      {/* See ProductHeroV3: a footnote to the buy decision, not a band. */}
      <Certifications inline />

      <TrustStrip />
    </div>
  );
}
