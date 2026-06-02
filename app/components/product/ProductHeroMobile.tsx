"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import FunnelAssurance from "@/app/components/funnel/FunnelAssurance";
import { formatPrice } from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  FUNNEL_CADENCES,
} from "@/app/lib/cadenceData";
import { getProductHeroImagesMobile } from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
  getPriceFrequency,
  getTileChecklist,
  getCTAMeta,
} from "@/app/lib/productHeroHelpers";
import ProductImageSlideshow from "./ProductImageSlideshow";
import HeroAccordions from "./HeroAccordions";
import TileChecklist from "./TileChecklist";

interface ProductHeroMobileProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
}

const CADENCE_ORDER: CadenceType[] = ["quarterly-sub", "monthly-sub", "monthly-otp"];

export default function ProductHeroMobile({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
}: ProductHeroMobileProps) {
  const content = getHeroContent(formulaId);
  const pricing = getCadencePricingByProductHeroId(formulaId, selectedCadence);
  const images = getProductHeroImagesMobile(formulaId, selectedCadence).map((src) => ({ src }));

  return (
    <>
      {/* Product Image — cadence drives which image is primary */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#FAFAFA]">
        <ProductImageSlideshow
          key={selectedCadence}
          images={images}
          alt={`${content.name} bottle`}
          fullBleedThumbnails
          hideThumbnails
        />
      </div>

      {/* Header */}
      <div
        className="w-full min-w-0 pt-2 pb-0"
        style={{ paddingLeft: "var(--brand-space-xs)", paddingRight: "var(--brand-space-xs)" }}
      >
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <div className="flex" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#1B2757]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="brand-data text-black/60 text-xs">
            {content.soldCount}
          </span>
        </div>
        <h1 className="brand-h2 leading-tight" style={{ letterSpacing: "-0.02em" }}>
          {content.name}
        </h1>
        <p className="text-base text-black/65 leading-snug mt-0 mb-3" style={{ letterSpacing: "-0.01em" }}>
          {content.tagline}
        </p>
      </div>

      {/* Content */}
      <div
        className="pt-1 pb-4 space-y-3"
        style={{ paddingLeft: "var(--brand-space-xs)", paddingRight: "var(--brand-space-xs)" }}
      >
        <p className="text-sm text-black/75 leading-relaxed">
          {content.headline}
        </p>

        {/* Cadence selector */}
        <div className="flex flex-col gap-2.5">
          {CADENCE_ORDER.map((cadence) => {
            const display = FUNNEL_CADENCES[cadence];
            const isSelected = selectedCadence === cadence;
            const cadencePricing = getCadencePricingByProductHeroId(formulaId, cadence);
            const frequency = getPriceFrequency(cadence);
            const bannerLabel = display.badge;

            return (
              <button
                key={isSelected ? `active-${cadence}` : cadence}
                type="button"
                onClick={() => onCadenceChange(cadence)}
                className={`relative w-full text-left border-2 bg-white transition-all duration-200 select-none overflow-hidden ${
                  isSelected
                    ? "card-pulse border-[#1B2757] shadow-md"
                    : "border-black/10 hover:border-black/25 shadow-sm"
                }`}
              >
                {/* Badge banner */}
                {bannerLabel && (
                  <div className="py-1.5 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] leading-none text-white bg-[#1B2757] text-center">
                    {bannerLabel}
                  </div>
                )}

                <div className={isSelected ? "p-3.5" : "px-3.5 py-3"}>
                  {/* Header row: radio + name + per-shot */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all duration-200 ${
                          isSelected ? "border-[#1B2757] bg-[#1B2757]" : "border-black/30 bg-white"
                        }`}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 16 16"
                          fill="none"
                          className={`transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
                        >
                          <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                        </svg>
                      </div>
                      <div>
                        <p className={`font-semibold ${isSelected ? "text-base text-[var(--brand-black)]" : "text-base text-black/65"}`}>
                          {display.label}
                        </p>
                        <span
                          className={`inline-flex items-center mt-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] tabular-nums ${
                            isSelected
                              ? "bg-[#1B2757]/10 text-[#1B2757]"
                              : "bg-black/[0.05] text-black/55"
                          }`}
                        >
                          {cadencePricing.shotCount} shots · 1/day
                        </span>
                      </div>
                    </div>

                    {/* Per-shot price */}
                    <div className="text-right flex-shrink-0">
                      <p className={`font-semibold tabular-nums ${isSelected ? "text-sm text-[var(--brand-black)]" : "text-sm text-black/60"}`}>
                        {formatPrice(cadencePricing.perShot)}
                        <span className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">/shot</span>
                      </p>
                      {!isSelected && (
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40 mt-0.5 tabular-nums">
                          {formatPrice(cadencePricing.price)}{frequency}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Expanded details — what you pay, then what you get */}
                  {isSelected && (
                    <div className="mt-3.5 pt-3.5 ml-8 border-t border-black/10 space-y-2.5">
                      {/* What you pay */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl font-bold text-[var(--brand-black)] tabular-nums">
                          {formatPrice(cadencePricing.price)}
                          <span className="text-sm font-semibold">{frequency}</span>
                        </span>
                        {cadencePricing.compareAtPrice && (
                          <>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40 line-through tabular-nums">
                              {formatPrice(cadencePricing.compareAtPrice)}
                            </span>
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1B2757] tabular-nums">
                              Save {formatPrice(cadencePricing.compareAtPrice - cadencePricing.price)}
                            </span>
                          </>
                        )}
                      </div>

                      {/* What ships, when, and the cadence's terms — one checklist */}
                      <TileChecklist items={getTileChecklist(cadence, cadencePricing.shotCount)} />
                    </div>
                  )}
                </div>

              </button>
            );
          })}
        </div>

        <ConkaCTAButton onClick={onAddToCart} meta={getCTAMeta(selectedCadence, pricing)} className="w-full max-w-none">
          Add to Cart
        </ConkaCTAButton>

        <FunnelAssurance />

        <HeroAccordions productType={getHeroProductType(formulaId)} />
      </div>
    </>
  );
}
