// TODO: layout upgrade pending (Phase 3 - product-page-cadence-widget) -- do not add new layout logic here
"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  FormulaId,
  formulaContent,
  formatPrice,
  formulaImages,
} from "@/app/lib/productData";
import {
  CadenceType,
  getCadencePricingByFormula,
} from "@/app/lib/cadenceData";
import ProductImageSlideshow from "./ProductImageSlideshow";
import LandingTrustBadges from "../landing/LandingTrustBadges";

interface ProductHeroProps {
  formulaId: FormulaId;
  selectedCadence: CadenceType;
  onCadenceChange: (cadence: CadenceType) => void;
  onAddToCart: () => void;
}

const CADENCE_OPTIONS: {
  cadence: CadenceType;
  label: string;
  badge?: string;
  badgeStyle?: "accent" | "muted";
}[] = [
  { cadence: "monthly-sub", label: "Monthly subscription", badge: "Most Popular", badgeStyle: "accent" },
  { cadence: "quarterly-sub", label: "Quarterly subscription", badge: "Best Value", badgeStyle: "muted" },
  { cadence: "monthly-otp", label: "Buy once" },
];

const DELIVERY_LABEL: Record<CadenceType, string> = {
  "monthly-sub": "Delivered monthly",
  "quarterly-sub": "Delivered every 3 months",
  "monthly-otp": "Single delivery",
};

const SUB_FEATURES = ["Free UK shipping", "Pause, skip, or cancel anytime", "100-day money-back guarantee"];
const OTP_FEATURES = ["100-day money-back guarantee", "Subscribe later and save 25%"];

export default function ProductHero({
  formulaId,
  selectedCadence,
  onCadenceChange,
  onAddToCart,
}: ProductHeroProps) {
  const formula = formulaContent[formulaId];
  const pricing = getCadencePricingByFormula(formulaId, selectedCadence);
  const otpPricing = getCadencePricingByFormula(formulaId, "monthly-otp");
  const monthlySubPricing = getCadencePricingByFormula(formulaId, "monthly-sub");

  function getCompareAtPrice(cadence: CadenceType): number | null {
    if (cadence === "monthly-sub") return otpPricing.price;
    if (cadence === "quarterly-sub") return monthlySubPricing.price * 3;
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start gap-[var(--brand-space-m)]">
      {/* Left: Product Image - sticky on desktop */}
      <div className="relative z-0 lg:w-[44%] lg:flex-shrink-0 order-1 lg:order-1 lg:sticky lg:top-24 lg:self-start">
        <div className="relative w-full group">
          <ProductImageSlideshow
            images={formulaId === "01" ? formulaImages.flow : formulaImages.clear}
            alt={`${formula.name} bottle`}
          />
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col gap-[var(--brand-space-s)] lg:gap-[var(--brand-space-l)] flex-1 lg:w-[48%] lg:flex-shrink-0 min-w-0 order-2 lg:order-2 relative z-10">
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
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#1B2757]">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="brand-data text-black/60">
                {formulaId === "01" ? "Over 90,000 bottles sold" : "Over 60,000 bottles sold"}
              </span>
            </div>
            <h1 className="brand-h1 leading-tight" style={{ letterSpacing: "-0.02em" }}>
              {formulaId === "01" ? "CONKA FL0W" : formula.name}
            </h1>
            <div className="mt-2">
              <span
                className="inline-block py-1 rounded-none brand-data text-black/60 text-sm"
                style={{ paddingLeft: "var(--brand-space-m)", paddingRight: "var(--brand-space-m)", background: "rgba(0,0,0,0.04)" }}
              >
                Liquid · 1 shot (30ml) daily · 28-pack
              </span>
            </div>
          </div>

          {/* Headline */}
          <p className="text-sm md:text-base text-black/75 leading-relaxed mb-1.5">
            {formula.headline}
          </p>

          {/* Cadence selector */}
          <div className="space-y-2">
            {CADENCE_OPTIONS.map(({ cadence, label, badge, badgeStyle }) => {
              const isSelected = selectedCadence === cadence;
              const cadencePricing = getCadencePricingByFormula(formulaId, cadence);
              const compareAt = getCompareAtPrice(cadence);
              const isSubscription = cadence !== "monthly-otp";
              const features = isSubscription ? SUB_FEATURES : OTP_FEATURES;

              return (
                <button
                  key={cadence}
                  onClick={() => onCadenceChange(cadence)}
                  className={`w-full text-left transition-colors cursor-pointer bg-white overflow-hidden ${
                    isSelected ? "border-2 border-[#1B2757]" : "border border-black/10"
                  }`}
                >
                  {isSelected && badge && (
                    <div
                      className="py-1.5 pl-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white tabular-nums"
                      style={{ backgroundColor: badgeStyle === "accent" ? "var(--brand-accent)" : "#1B2757" }}
                    >
                      {badge}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span
                          className={`flex-shrink-0 w-5 h-5 border-2 mt-0.5 flex items-center justify-center ${
                            isSelected ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]" : "border-black/30"
                          }`}
                        >
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                              <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-[var(--brand-black)]">{label}</span>
                          {!isSelected && badge && (
                            <span className="ml-2 inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                              {badge}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {compareAt && (
                          <p className="font-mono text-sm tabular-nums line-through text-black/50">
                            {formatPrice(compareAt)}
                          </p>
                        )}
                        <p className="text-2xl font-bold tabular-nums text-[var(--brand-black)]">
                          {formatPrice(cadencePricing.price)}
                        </p>
                        <p className="font-mono text-xs tabular-nums text-black">
                          {formatPrice(cadencePricing.perShot)}/shot
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <>
                        <p className="text-sm text-black/80 mt-3 ml-8">
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 mr-1.5">Ships ·</span>
                          {DELIVERY_LABEL[cadence]}
                        </p>
                        <ul className="mt-2 ml-8 space-y-1">
                          {features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-black/80">
                              <span className="font-mono text-black/30 shrink-0" aria-hidden>—</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <ConkaCTAButton onClick={onAddToCart} meta={formatPrice(pricing.price)} className="w-full max-w-none">
            Add to Cart
          </ConkaCTAButton>

          <LandingTrustBadges />
        </div>
      </div>
    </div>
  );
}
