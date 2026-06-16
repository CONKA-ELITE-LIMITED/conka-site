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
        {/* Left: image stack — scrolls while the buy panel stays pinned */}
        <div className="relative z-0 order-1 lg:w-[58%] lg:flex-shrink-0">
          <HeroImageStack images={images} alt={`${content.name} bottle`} />
        </div>

        {/* Right: IM8 buy box — sticky, no outer card (plan cards stand alone) */}
        <div className="relative z-10 order-2 min-w-0 flex-1 lg:sticky lg:top-8 lg:w-[40%] lg:flex-shrink-0 lg:self-start">
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
