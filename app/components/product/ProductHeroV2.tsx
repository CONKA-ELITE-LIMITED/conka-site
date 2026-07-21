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

interface ProductHeroV2Props {
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
      <div className="flex items-center gap-2">
        <div className="flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#1B2757]"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <span className="text-base font-bold text-black">
          4.7 <span className="font-semibold text-black/70">(622 reviews)</span>
        </span>
      </div>
    </div>
  );
}

/**
 * ProductHeroV2 — Simple DTC PDP hero (SCRUM-1171), Magic Mind aligned.
 *
 * Desktop-only for now (mobile routes to ProductHeroMobileV2). A 3-column layout:
 *   LEFT   — identity: rating → spec pill → name → bold subtitle → social-proof
 *            pill → black description → Ingredients pill.
 *   CENTER — product gallery (sticky), de-carded so the image reads flush; its
 *            small thumbnail rail sits directly under the image.
 *   RIGHT  — buy box (plan cards, CTA, trust) with the accordions below it
 *            (Who it's for / Risk-free / What you'll feel).
 *
 * Uses the mobile (square) box assets so the flush square frame reads correctly,
 * and leads with the lifestyle shot (asset 2), matching ProductHeroMobileV2.
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

  // Square (mobile) box asset + lead with the lifestyle shot, same as mobile V2.
  const rawImages = getProductHeroImagesMobile(formulaId, selectedCadence);
  const ordered =
    rawImages.length > 1
      ? [rawImages[1], rawImages[0], ...rawImages.slice(2)]
      : rawImages;
  const images = ordered.map((src) => ({ src }));

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="grid grid-cols-1 gap-[var(--brand-space-m)] lg:grid-cols-12 lg:items-start">
        {/* LEFT: identity + ingredients */}
        <div className="order-1 flex flex-col gap-4 text-black lg:col-span-4">
          <HeroRating />

          <SpecBadge productType={productType} className="self-start" />

          <div>
            <h1
              className="brand-h1 leading-tight lg:!text-[2.5rem]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {content.name}
            </h1>
            {content.seoHeading && (
              <h2 className="mt-2 text-xl font-bold leading-tight text-black lg:text-2xl">
                {content.seoHeading}
              </h2>
            )}
          </div>

          <SocialProofBadge className="self-start" />

          <p className="text-base leading-relaxed text-black">
            {content.headline}
          </p>

          {/* Ingredients as an MM-style pill + tabbed bottom sheet */}
          <IngredientListButton
            formulas={productType === "both" ? ["flow", "clear"] : [productType]}
            pill
          />
        </div>

        {/* CENTER: gallery — de-carded (no frame/shadow), small thumbnail rail
            under the image; sticky, follows scroll past the buy box */}
        <div className="order-2 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <ProductImageSlideshow
            key={selectedCadence}
            images={images}
            alt={`${content.name} bottle`}
            noFrame
            smallThumbnails
          />
        </div>

        {/* RIGHT: buy box + accordions below it */}
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
              hideWhatYouFeel
              flatCards
            />
            <HeroAccordions
              productType={productType}
              plainLabels
              whatYouFeel={<FeelOutcomesList />}
              hideIngredients
            />
          </div>
        </div>
      </div>

      {/* Proof strip spans all columns */}
      <TrustStrip />
    </div>
  );
}
