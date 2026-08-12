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
} from "./ProductBuyPanel";
import { SpecBadge, SocialProofBadge } from "./HeroBadges";
import IngredientOutcomeAccordions from "./IngredientOutcomeAccordions";

interface ProductHeroV3Props {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/** Desktop rating block (Magic Mind style): subscriber count on top, then stars
 *  with a parenthetical review count. Solid black, left-aligned. */
function HeroRating() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-black">5,000+ subscribers</span>
      <div className="flex items-center gap-2.5">
        <div className="flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1B2757]"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-lg font-bold text-black">
          4.7 <span className="font-semibold text-black/70">(622 reviews)</span>
        </span>
      </div>
    </div>
  );
}

/**
 * ProductHeroV3 — Magic Mind two-column PDP hero (Flow only).
 *
 * A large sticky asset on the LEFT; the RIGHT column holds the whole decision +
 * education scroll: rating, name, badges, buy box, then the ingredient-benefit
 * section (subline + description + check grid + outcome accordions) inline, the
 * way Magic Mind runs it. ProductHeroV2 (3-column) is kept as the fallback and
 * still serves Clear / Both.
 *
 * Desktop-only for now (mobile still routes to ProductHeroMobileV2, with the
 * ingredient section rendered as a normal page section below the hero).
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

  // The hero gallery is independent of the selected cadence, so toggling a plan
  // never rebuilds the slideshow. Square (mobile) box assets, lifestyle shot first.
  const rawImages = getProductHeroImagesMobile(formulaId, "monthly-sub");
  const ordered =
    rawImages.length > 1
      ? [rawImages[1], rawImages[0], ...rawImages.slice(2)]
      : rawImages;
  const images = ordered.map((src) => ({ src }));

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="grid grid-cols-1 gap-[var(--brand-space-m)] lg:grid-cols-[65fr_35fr] lg:items-start">
        {/* LEFT (65%): large gallery — de-carded, small thumbnail rail under the
            image; sticky so it follows the taller right column on scroll */}
        <div className="order-2 lg:order-1 lg:sticky lg:top-24 lg:self-start">
          {/* Cap the asset so the 65% column does not blow the square image up
              to full width; centre it within the column. */}
          <div className="mx-auto w-full lg:max-w-[540px]">
            <ProductImageSlideshow
              images={images}
              alt={`${content.name} bottle`}
              noFrame
              smallThumbnails
            />
          </div>
        </div>

        {/* RIGHT (35%): identity + buy box + inline ingredient-benefit section.
            Order mirrors Magic Mind: viewing → title → spec → rating. */}
        <div className="order-1 flex min-w-0 flex-col gap-6 text-black lg:order-2">
          <div className="flex flex-col gap-4">
            <SocialProofBadge productType={productType} className="self-start" />

            <h1
              className="brand-h1 leading-tight lg:!text-[3.25rem]"
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
            />

            <HeroAccordions
              productType={productType}
              plainLabels
              whatYouFeel={<FeelOutcomesList />}
              hideIngredients
            />
          </div>

          {/* Ingredient-benefit section, inline in the second column (MM layout).
              The component renders the moved subline + description + check grid on
              desktop, then the outcome accordions. */}
          <IngredientOutcomeAccordions />
        </div>
      </div>

      {/* Proof strip spans both columns */}
      <TrustStrip />
    </div>
  );
}
