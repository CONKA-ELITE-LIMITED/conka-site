"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import { getProductHeroImagesMobile } from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import ProductImageSlideshow from "./ProductImageSlideshow";
import HeroAccordions from "./HeroAccordions";
import ProductBuyPanel, {
  TrustStrip,
  FeelOutcomesList,
  IngredientListButton,
} from "./ProductBuyPanel";
import { SpecBadge, SocialProofBadge } from "./HeroBadges";

interface ProductHeroMobileV2Props {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/** Rating block (Magic Mind style): subscriber count above, then larger stars
 *  with a parenthetical review count. Moved below the asset in V2. */
function HeroRating() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-black">5,000+ subscribers</span>
      <div className="flex items-center gap-2">
        <div className="flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1B2757]"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-base font-bold text-black">
          4.7 <span className="font-semibold">(622)</span>
        </span>
      </div>
    </div>
  );
}

/**
 * ProductHeroMobileV2 — Simple DTC mobile PDP hero (SCRUM-1171).
 *
 * Order: badges + name + subtitle ABOVE the asset; stars + description BELOW it,
 * then the buy panel. The gallery drops its arrows and shows a thumbnail rail.
 * Legacy ProductHeroMobile stays intact as the fallback.
 */
export default function ProductHeroMobileV2({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ProductHeroMobileV2Props) {
  const content = getHeroContent(formulaId);
  const productType = getHeroProductType(formulaId);
  // Flow test: lead with a lifestyle shot and move the square box asset to
  // second, rather than opening on the box.
  const rawImages = getProductHeroImagesMobile(formulaId, selectedCadence);
  const ordered =
    rawImages.length > 1
      ? [rawImages[1], rawImages[0], ...rawImages.slice(2)]
      : rawImages;
  const images = ordered.map((src) => ({ src }));

  return (
    <>
      {/* Above the asset: badges, product name, subtitle */}
      <div className="flex w-full min-w-0 flex-col items-center gap-3 pt-4 text-center text-black">
        <SocialProofBadge productType={productType} className="mx-auto" />
        <SpecBadge productType={productType} className="mx-auto" />
        <div>
          <h1 className="brand-h1 leading-tight" style={{ letterSpacing: "-0.02em" }}>
            {content.name}
          </h1>
          {content.seoHeading && (
            <h2 className="mt-1 text-lg font-semibold leading-snug text-black">
              {content.seoHeading}
            </h2>
          )}
        </div>
      </div>

      {/* Asset — padded (not full-bleed), thumbnail rail on, arrows off */}
      <div className="mt-4">
        <ProductImageSlideshow
          key={selectedCadence}
          images={images}
          alt={`${content.name} bottle`}
          hideArrows
          smallThumbnails
        />
      </div>

      {/* Below the asset: stars, description (black), then the buy panel */}
      <div className="mt-4 flex w-full min-w-0 flex-col gap-3 text-black">
        <HeroRating />
        <p className="text-base leading-relaxed text-black">
          {content.headline}
        </p>
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
          flatCards
        />

        {/* MM-aligned: plain-label accordions with "What you'll feel" folded in,
            then a full-width Ingredients pill (mirrors ProductHeroV2 desktop). */}
        <HeroAccordions
          productType={productType}
          plainLabels
          whatYouFeel={<FeelOutcomesList />}
          hideIngredients
        />
        <IngredientListButton
          formulas={productType === "both" ? ["flow", "clear"] : [productType]}
          pill
          fullWidth
        />
      </div>

      <TrustStrip />
    </>
  );
}
