"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import GuaranteeRow from "@/app/components/landing/GuaranteeRow";
import { formatPrice } from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByProductHeroId,
  FUNNEL_CADENCES,
} from "@/app/lib/cadenceData";
import { getProductHeroImages } from "@/app/lib/heroImageConfig";
import type { ProductHeroId } from "@/app/lib/productTypes";
import {
  getHeroContent,
  getHeroProductType,
  getPriceFrequency,
  getTileChecklist,
  getCTAMeta,
} from "@/app/lib/productHeroHelpers";
import HeroImageStack from "./HeroImageStack";
import HeroAccordions from "./HeroAccordions";
import TileChecklist from "./TileChecklist";

interface ProductHeroProps {
  formulaId: ProductHeroId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
}

const CADENCE_ORDER: CadenceType[] = ["quarterly-sub", "monthly-sub", "monthly-otp"];

export default function ProductHero({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
}: ProductHeroProps) {
  const content = getHeroContent(formulaId);
  const pricing = getCadencePricingByProductHeroId(formulaId, selectedCadence);
  const images = getProductHeroImages(formulaId, selectedCadence);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start gap-[var(--brand-space-m)]">
      {/* Left: Image stack — scrolls while right widget stays pinned */}
      <div className="relative z-0 lg:w-[58%] lg:flex-shrink-0 order-1 lg:order-1">
        <HeroImageStack images={images} alt={`${content.name} bottle`} />
      </div>

      {/* Right: Product Info — sticky so widget floats as image column scrolls */}
      <div className="flex flex-col gap-[var(--brand-space-s)] lg:gap-[var(--brand-space-l)] flex-1 lg:w-[40%] lg:flex-shrink-0 min-w-0 order-2 lg:order-2 relative z-10 lg:sticky lg:top-8 lg:self-start">
        <div
          className="brand-card flex flex-col gap-[var(--brand-space-s)] lg:gap-[var(--brand-space-m)] !border-0 relative z-10"
          style={{
            paddingLeft: "var(--brand-space-m)",
            paddingRight: "var(--brand-space-m)",
            paddingTop: "var(--brand-space-s)",
            paddingBottom: "var(--brand-space-m)",
            backgroundColor: "#fff",
          }}
        >
          {/* Stars + title + meta pill */}
          <div className="mb-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="flex" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#1B2757] lg:w-[14px] lg:h-[14px]">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="brand-data text-black/60">
                {content.soldCount}
              </span>
            </div>
            <h1 className="brand-h1 leading-tight lg:!text-[2.5rem]" style={{ letterSpacing: "-0.02em" }}>
              {content.name}
            </h1>
            <p className="text-lg lg:text-xl text-black/65 leading-snug mt-0 mb-3 lg:mb-4" style={{ letterSpacing: "-0.01em" }}>
              {content.tagline}
            </p>
          </div>

          {/* Headline */}
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            {content.headline}
          </p>

          {/* Cadence selector */}
          <div className="flex flex-col gap-3">
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

                  <div className={isSelected ? "p-4" : "px-4 py-3"}>
                    {/* Header row: radio + name + per-shot */}
                    <div className="flex items-center justify-between gap-4">
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
                          <p className={`font-semibold ${isSelected ? "text-lg text-[var(--brand-black)]" : "text-base text-black/65"}`}>
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
                        <p className={`font-semibold tabular-nums ${isSelected ? "text-base text-[var(--brand-black)]" : "text-sm text-black/60"}`}>
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
                      <div className="mt-4 pt-4 ml-8 border-t border-black/10 space-y-3">
                        {/* What you pay */}
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-2xl font-bold text-[var(--brand-black)] tabular-nums">
                            {formatPrice(cadencePricing.price)}
                            <span className="text-base font-semibold">{frequency}</span>
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

          {/* CTA + guarantee as one block so the row tucks under the button */}
          <div>
            <ConkaCTAButton onClick={onAddToCart} meta={getCTAMeta(selectedCadence, pricing)} className="w-full max-w-none">
              Add to Cart
            </ConkaCTAButton>
            <GuaranteeRow />
          </div>

          <HeroAccordions productType={getHeroProductType(formulaId)} />
        </div>
      </div>
    </div>
  );
}
