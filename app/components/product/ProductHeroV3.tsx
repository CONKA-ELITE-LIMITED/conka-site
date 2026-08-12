"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import type { FormulaId } from "@/app/lib/productData";
import {
  getHeroContent,
  getHeroProductType,
} from "@/app/lib/productHeroHelpers";
import { getSupplementFacts } from "@/app/lib/supplementFacts";
import { MM_GALLERY_ASSETS } from "@/app/lib/mmPdpData";
import ProductImageSlideshow from "./ProductImageSlideshow";
import ProductBuyPanel, { TrustStrip } from "./ProductBuyPanel";
import { SpecBadge, SocialProofBadge } from "./HeroBadges";
import HeroRating from "./HeroRating";
import IngredientOutcomeAccordions from "./IngredientOutcomeAccordions";

interface ProductHeroV3Props {
  formulaId: FormulaId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

/**
 * ProductHeroV3 — Magic Mind two-column PDP hero (Flow + Clear).
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

  // Written-out ingredient list for the left column (Magic Mind "Ingredients"
  // block). Both has no single supplement-facts record, so it is skipped there.
  const facts = productType !== "both" ? getSupplementFacts(productType) : null;
  const ingredientsList = facts
    ? [...facts.actives, ...facts.base].map((i) => i.name).join(", ")
    : null;

  // Rectangular (7:5) Magic Mind-style gallery, independent of the selected plan.
  const images = MM_GALLERY_ASSETS[formulaId].map((src) => ({ src }));

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      {/* Fixed-width, centred two-column block (Magic Mind alignment): the asset
          column is sized to the asset, the buy column sits right beside it with a
          small gap, and the whole block centres within the track so the side
          gutters grow. Drop a 7:5 landscape asset in and it fills the column. */}
      <div className="grid grid-cols-1 gap-[var(--brand-space-m)] lg:grid-cols-[minmax(0,760px)_minmax(0,400px)] lg:items-start lg:justify-center lg:gap-x-12">
        {/* LEFT: sticky gallery + the written-out Ingredients list beneath it
            (Magic Mind pattern). The image and list are ONE sticky unit so the
            list never slides under the pinned thumbnail rail. */}
        <div className="order-2 lg:sticky lg:top-24 lg:order-1 lg:self-start">
          <ProductImageSlideshow
            images={images}
            alt={content.name}
            noFrame
            smallThumbnails
            aspectRatio="landscape"
            hideArrows
          />

          {ingredientsList && (
            <div className="mt-10">
              <h2 className="mb-3 border-b border-black/15 pb-3 text-2xl font-bold text-black">
                Ingredients
              </h2>
              <p className="text-sm leading-relaxed text-black">
                {ingredientsList}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT (35%): identity + buy box + inline ingredient-benefit section.
            Order mirrors Magic Mind: viewing → title → spec → rating. */}
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
            />
          </div>

          {/* Ingredient-benefit section, inline in the second column (MM layout).
              The component renders the moved subline + description + check grid on
              desktop, then the outcome accordions. */}
          <IngredientOutcomeAccordions formulaId={formulaId} />
        </div>
      </div>

      {/* Proof strip spans both columns */}
      <TrustStrip />
    </div>
  );
}
