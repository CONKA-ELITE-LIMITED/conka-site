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

interface ProductHeroV3Props {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/**
 * ProductHeroV3, the two-column PDP hero (Flow, Clear, Both).
 *
 * A large sticky asset on the LEFT; the RIGHT column holds the buy decision:
 * rating, name, badges, buy box, the product lede, then the four disclosure
 * rows (ingredients, who it is for, taste, how to take).
 *
 * The hero stops at the buy decision (SCRUM-1262). It used to carry a
 * written-out ingredient list under the gallery and the outcome accordions
 * under the buy box, which together meant desktop argued ingredients three
 * times once the body grid existed. Both are gone; the buy panel's pill opens
 * the full list, and the grid is the ingredient surface.
 *
 * Desktop only; mobile uses ProductHeroMobileV3, which now mirrors it.
 * ProductHeroV2 (3-column) is retained as the fallback but no longer routed to.
 */
export default function ProductHeroV3({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ProductHeroV3Props) {
  const content = getHeroContent(formulaId);
  const productType = getHeroProductType(formulaId);

  // Rectangular (7:5) Magic Mind-style gallery. The lead slide follows the
  // selected plan so the starter-pack artwork matches the price beside it.
  const images = getPdpGalleryImages(formulaId, selectedCadence).map((src) => ({
    src,
  }));

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      {/* Fixed-width, centred two-column block (Magic Mind alignment): the asset
          column is sized to the asset, the buy column sits right beside it with a
          small gap, and the whole block centres within the track so the side
          gutters grow. Drop a 7:5 landscape asset in and it fills the column. */}
      <div className="grid grid-cols-1 gap-[var(--brand-space-m)] lg:grid-cols-[minmax(0,760px)_minmax(0,400px)] lg:items-start lg:justify-center lg:gap-x-12">
        {/* LEFT: sticky gallery. The written-out Ingredients list that sat
            beneath it is gone (SCRUM-1262). It is now the Ingredients
            disclosure row in the right column, and the buy panel's pill still
            opens the full list too. */}
        <div className="order-2 lg:sticky lg:top-24 lg:order-1 lg:self-start">
          <ProductImageSlideshow
            images={images}
            alt={content.name}
            noFrame
            smallThumbnails
            aspectRatio="landscape"
            hideArrows
          />
        </div>

        {/* RIGHT (35%): identity + buy box + the product lede.
            Order mirrors Magic Mind: viewing, title, spec, rating. */}
        <div className="order-1 flex min-w-0 flex-col gap-6 text-black lg:order-2">
          <div className="flex flex-col gap-3">
            <SocialProofBadge productType={productType} className="self-start" />

            <h1
              className="brand-h1 !mb-0 !leading-none lg:!text-[3.25rem]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {content.name}
            </h1>

            <SpecBadge productType={productType} className="self-start" />

            <HeroRating />

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
          </div>

          {/* Subline + description + check grid. The outcome accordions that
              used to follow are gone (SCRUM-1262): the body's ingredient grid
              covers the same ground, and keeping both meant desktop argued
              ingredients three times. The lede stays because it is the product
              pitch, not an ingredient surface, and mobile renders it too. */}
          <IngredientBenefitLede formulaId={formulaId} />

          {/* The supporting answers, directly under the check grid, the way the
              reference runs them: still in the buy decision, not a section away. */}
          <IngredientDisclosureRows formulaId={formulaId} />
        </div>
      </div>

      {/* Proof strip spans both columns */}
      <TrustStrip />
    </div>
  );
}
