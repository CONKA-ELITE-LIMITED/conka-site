"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import FunnelAssurance from "@/app/components/funnel/FunnelAssurance";
import {
  FormulaId,
  formulaContent,
  formatPrice,
} from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByFormula,
  FUNNEL_CADENCES,
  getSavingsPercent,
} from "@/app/lib/cadenceData";
import { getFormulaHeroImagesMobile } from "@/app/lib/heroImageConfig";
import ProductImageSlideshow from "./ProductImageSlideshow";
import HeroAccordions from "./HeroAccordions";

interface ProductHeroMobileProps {
  formulaId: FormulaId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
}

const CADENCE_ORDER: CadenceType[] = ["quarterly-sub", "monthly-sub", "monthly-otp"];

function getDeliveryLabel(cadence: CadenceType): string {
  switch (cadence) {
    case "monthly-sub": return "Delivered Monthly";
    case "monthly-otp": return "One-Time Delivery";
    case "quarterly-sub": return "Delivered Quarterly";
  }
}

function getPriceFrequency(cadence: CadenceType): string {
  switch (cadence) {
    case "monthly-sub": return "/mo";
    case "monthly-otp": return "";
    case "quarterly-sub": return "/quarter";
  }
}

function getWhatShips(cadence: CadenceType, shotCount: number): string {
  const boxes = shotCount / 28;
  switch (cadence) {
    case "monthly-sub":
      return `${boxes} box (${shotCount} shots) delivered every month`;
    case "monthly-otp":
      return `${boxes} box (${shotCount} shots), one-time delivery`;
    case "quarterly-sub":
      return `${boxes} boxes (${shotCount} shots total) delivered every 3 months`;
  }
}

function getCTAMeta(cadence: CadenceType, price: number): string {
  switch (cadence) {
    case "monthly-sub": return `${formatPrice(price)}/mo · save 25%`;
    case "quarterly-sub": return `${formatPrice(price)}/quarter · best value`;
    case "monthly-otp": return `${formatPrice(price)} · one-time`;
  }
}

export default function ProductHeroMobile({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
}: ProductHeroMobileProps) {
  const formula = formulaContent[formulaId];
  const pricing = getCadencePricingByFormula(formulaId, selectedCadence);
  const images = getFormulaHeroImagesMobile(formulaId, selectedCadence).map((src) => ({ src }));

  return (
    <>
      {/* Product Image — cadence drives which image is primary */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#FAFAFA]">
        <ProductImageSlideshow
          key={selectedCadence}
          images={images}
          alt={`${formula.name} bottle`}
          fullBleedThumbnails
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
            {formulaId === "01" ? "Over 90,000 bottles sold" : "Over 60,000 bottles sold"}
          </span>
        </div>
        <h1 className="brand-h2 leading-tight" style={{ letterSpacing: "-0.02em" }}>
          {formulaId === "01" ? "CONKA FL0W" : formula.name}
        </h1>
      </div>

      {/* Content */}
      <div
        className="pt-1 pb-4 space-y-3"
        style={{ paddingLeft: "var(--brand-space-xs)", paddingRight: "var(--brand-space-xs)" }}
      >
        <div>
          <span
            className="inline-block py-1 rounded-none brand-data text-black/60 text-sm"
            style={{ paddingLeft: "var(--brand-space-m)", paddingRight: "var(--brand-space-m)", background: "rgba(0,0,0,0.04)" }}
          >
            Liquid · 1 shot (30ml) daily · 28-pack
          </span>
        </div>

        <p className="text-sm text-black/75 leading-relaxed">
          {formula.headline}
        </p>

        {/* Cadence selector */}
        <div className="flex flex-col gap-2.5">
          {CADENCE_ORDER.map((cadence, i) => {
            const display = FUNNEL_CADENCES[cadence];
            const isSelected = selectedCadence === cadence;
            const cadencePricing = getCadencePricingByFormula(formulaId, cadence);
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
                  {/* Row number + delivery label */}
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35 leading-none mb-2.5 tabular-nums">
                    {String(i + 1).padStart(2, "0")} · {getDeliveryLabel(cadence)}
                  </p>

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
                        <p className={`font-semibold ${isSelected ? "text-sm text-[var(--brand-black)]" : "text-sm text-black/60"}`}>
                          {display.label}
                        </p>
                        {!isSelected && (
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/40 mt-0.5 tabular-nums">
                            {cadencePricing.shotCount} shots
                          </p>
                        )}
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

                  {/* Expanded details */}
                  {isSelected && (
                    <div className="mt-3.5 pt-3.5 ml-8 border-t border-black/10 space-y-2.5">
                      {/* Big per-shot anchor */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[var(--brand-black)] tabular-nums">
                          {formatPrice(cadencePricing.perShot)}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/50">
                          per shot · 1 shot per day
                        </span>
                      </div>

                      {/* Total with compare-at + savings % */}
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-base font-semibold text-[var(--brand-black)] tabular-nums">
                          {formatPrice(cadencePricing.price)}{frequency}
                        </span>
                        {cadencePricing.compareAtPrice && (
                          <>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-black/40 line-through tabular-nums">
                              {formatPrice(cadencePricing.compareAtPrice)}
                            </span>
                            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1B2757] tabular-nums">
                              {getSavingsPercent(cadencePricing.price, cadencePricing.compareAtPrice)}% off
                            </span>
                          </>
                        )}
                      </div>

                      {/* What ships */}
                      <div className="flex items-start gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55 mt-0.5 shrink-0">
                          Ships
                        </span>
                        <p className="text-sm text-black/60">
                          {getWhatShips(cadence, cadencePricing.shotCount)}
                        </p>
                      </div>

                      {display.shippingCallout && (
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55 mt-0.5 shrink-0">
                            Note
                          </span>
                          <p className="text-sm text-black/60">{display.shippingCallout}</p>
                        </div>
                      )}

                      {/* Feature bullets */}
                      <div className="space-y-1.5">
                        {display.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-black/70">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 text-[#1B2757]">
                              <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </button>
            );
          })}
        </div>

        <ConkaCTAButton onClick={onAddToCart} meta={getCTAMeta(selectedCadence, pricing.price)} className="w-full max-w-none">
          Add to Cart
        </ConkaCTAButton>

        <FunnelAssurance />

        <HeroAccordions productType={formulaId === "01" ? "flow" : "clear"} />
      </div>
    </>
  );
}
