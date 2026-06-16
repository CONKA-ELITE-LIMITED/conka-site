"use client";

import { CadenceType } from "@/app/lib/cadenceData";
import { getProductHeroImages } from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { getHeroContent } from "@/app/lib/productHeroHelpers";
import HeroImageStack from "./HeroImageStack";
import ProductBuyPanel, { TrustStrip } from "./ProductBuyPanel";

interface ProductHeroProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
  /** The OTP text link adds the one-time variant straight to cart */
  onOtpAddToCart: () => void;
}

export default function ProductHero({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
  onOtpAddToCart,
}: ProductHeroProps) {
  const content = getHeroContent(formulaId);
  const images = getProductHeroImages(formulaId, selectedCadence);

  return (
    <div className="flex flex-col gap-[var(--brand-space-m)]">
      <div className="flex flex-col gap-[var(--brand-space-m)] lg:flex-row lg:items-start lg:justify-center">
        {/* Left: image stack — sticky, follows the scroll until the bottom of
            the hero while the taller buy box on the right scrolls past it */}
        <div className="relative z-0 order-1 lg:sticky lg:top-24 lg:w-[58%] lg:flex-shrink-0 lg:self-start">
          <HeroImageStack images={images} alt={`${content.name} bottle`} />
        </div>

        {/* Right: IM8 buy box — scrolls (taller than the image column) */}
        <div className="relative z-10 order-2 min-w-0 flex-1 lg:w-[40%] lg:flex-shrink-0">
          <div
            className="flex flex-col gap-[var(--brand-space-s)]"
            style={{
              paddingTop: "var(--brand-space-s)",
              paddingBottom: "var(--brand-space-m)",
            }}
          >
            <ProductBuyPanel
              formulaId={formulaId}
              selectedCadence={selectedCadence}
              onCadenceChange={onCadenceChange}
              onAddToCart={onAddToCart}
              onOtpAddToCart={onOtpAddToCart}
            />
          </div>
        </div>
      </div>

      {/* Proof strip spans both columns */}
      <TrustStrip />
    </div>
  );
}
