"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import { getProductHeroImagesMobile } from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { getHeroContent } from "@/app/lib/productHeroHelpers";
import ProductImageSlideshow from "./ProductImageSlideshow";
import ProductBuyPanel, {
  ProductHeroHeader,
  ProductHeroLede,
  TrustStrip,
} from "./ProductBuyPanel";

interface ProductHeroMobileProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

export default function ProductHeroMobile({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ProductHeroMobileProps) {
  const content = getHeroContent(formulaId);
  const images = getProductHeroImagesMobile(formulaId, selectedCadence).map(
    (src) => ({ src }),
  );

  return (
    <>
      {/* Rating, eyebrow and product name lead above the image so the hero opens
          with identity, not a wall of copy. The keyword subline and description
          drop below the image via ProductHeroLede (SCRUM-1138). */}
      <div className="flex w-full min-w-0 flex-col gap-3 pt-4 text-[#111]">
        <ProductHeroHeader
          formulaId={formulaId}
          showSubline={false}
          showHeadline={false}
        />
      </div>

      {/* Full-bleed product image — cadence drives which image is primary */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#FAFAFA]">
        <ProductImageSlideshow
          key={selectedCadence}
          images={images}
          alt={`${content.name} bottle`}
          fullBleedThumbnails
          hideThumbnails
        />
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3 py-4 text-[#111]">
        <ProductHeroLede formulaId={formulaId} />
        <ProductBuyPanel
          formulaId={formulaId}
          selectedCadence={selectedCadence}
          onCadenceChange={onCadenceChange}
          onAddToCart={onAddToCart}
          onOtpAddToCart={onOtpAddToCart}
          hideHeader
          hideKeyBenefits
        />
      </div>

      <TrustStrip />
    </>
  );
}
