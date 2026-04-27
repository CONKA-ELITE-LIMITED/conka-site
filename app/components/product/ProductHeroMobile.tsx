"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  FormulaId,
  PackSize,
  PurchaseType,
  formulaContent,
  formulaPricing,
  formatPrice,
  formulaImages,
} from "@/app/lib/productData";
import ProductImageSlideshow from "./ProductImageSlideshow";
import PackSelectorPremium from "./PackSelectorPremium";
import LandingTrustBadges from "../landing/LandingTrustBadges";
import { getDeliveryDescription } from "./formulaStatsData";

interface ProductHeroMobileProps {
  formulaId: FormulaId;
  selectedPack: PackSize;
  onPackSelect: (pack: PackSize) => void;
  purchaseType: PurchaseType;
  onPurchaseTypeChange: (type: PurchaseType) => void;
  onAddToCart: () => void;
}

export default function ProductHeroMobile({
  formulaId,
  selectedPack,
  onPackSelect,
  purchaseType,
  onPurchaseTypeChange,
  onAddToCart,
}: ProductHeroMobileProps) {
  const formula = formulaContent[formulaId];
  const pricing = formulaPricing[purchaseType][selectedPack];
  const subscriptionPricing = formulaPricing["subscription"][selectedPack];
  const oneTimePricing = formulaPricing["one-time"][selectedPack];

  return (
    <>
      {/* Product Image + thumbnails */}
      <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#FAFAFA]">
        <ProductImageSlideshow
          images={
            formulaId === "01" ? formulaImages.flow : formulaImages.clear
          }
          alt={`${formula.name} bottle`}
          fullBleedThumbnails
        />
      </div>

      {/* Header — title + assurance, below the asset */}
      <div
        className="w-full min-w-0 pt-2 pb-0"
        style={{
          paddingLeft: "var(--brand-space-xs)",
          paddingRight: "var(--brand-space-xs)",
        }}
      >
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <div className="flex" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#1B2757]"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="brand-data text-black/60 text-xs">
            {formulaId === "01"
              ? "Over 90,000 bottles sold"
              : "Over 60,000 bottles sold"}
          </span>
        </div>
        <h1
          className="brand-h2 leading-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          {formulaId === "01" ? (
            <>
              CONKA FL0W
            </>
          ) : (
            formula.name
          )}
        </h1>
      </div>

      {/* Content */}
      <div
        className="pt-1 pb-4 space-y-2"
        style={{
          paddingLeft: "var(--brand-space-xs)",
          paddingRight: "var(--brand-space-xs)",
        }}
      >
        {/* Meta pill */}
        <div>
          <span
            className="inline-block py-1 rounded-none brand-data text-black/60 text-sm"
            style={{
              paddingLeft: "var(--brand-space-m)",
              paddingRight: "var(--brand-space-m)",
              background: "rgba(0,0,0,0.04)",
            }}
          >
            Liquid · 1 shot (30ml) daily · {selectedPack}-pack
          </span>
        </div>

        <p className="text-sm md:text-base text-black/75 leading-relaxed mb-1.5">
          {formula.headline}
        </p>

        <PackSelectorPremium
          selectedPack={selectedPack}
          onSelect={onPackSelect}
        />

        {/* Purchase type tiles */}
        <div className="space-y-2">
          {/* Subscribe tile - always expanded */}
          <button
            onClick={() => onPurchaseTypeChange("subscription")}
            className={`w-full text-left transition-colors cursor-pointer bg-white overflow-hidden ${
              purchaseType === "subscription"
                ? "border-2 border-[#1B2757]"
                : "border border-black/10"
            }`}
          >
            {/* Badge banner when selected */}
            {purchaseType === "subscription" && (
              <div
                className="py-1.5 pl-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white tabular-nums"
                style={{ backgroundColor: "var(--brand-accent)" }}
              >
                Best Value · Save 20%
              </div>
            )}

            <div className="p-4">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span
                    className={`flex-shrink-0 w-5 h-5 border-2 mt-0.5 flex items-center justify-center ${
                      purchaseType === "subscription"
                        ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]"
                        : "border-black/30"
                    }`}
                  >
                    {purchaseType === "subscription" && (
                      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[var(--brand-black)]">Subscribe</span>
                    <span className="ml-2 inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                      Save 20% · every order
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-mono text-sm tabular-nums line-through text-black/50">
                    {formatPrice(oneTimePricing.price)}
                  </p>
                  <p className="text-xl font-bold tabular-nums text-[var(--brand-black)]">
                    {formatPrice(subscriptionPricing.price)}
                  </p>
                  <p className="font-mono text-xs tabular-nums text-black">
                    {formatPrice(subscriptionPricing.perShot)}/shot
                  </p>
                </div>
              </div>

              {/* Delivery description */}
              <p className="text-sm text-black/80 mt-3 ml-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 mr-1.5">Ships ·</span>
                {getDeliveryDescription(selectedPack)}
              </p>

              {/* Feature bullets - always visible */}
              <ul className="mt-2 ml-8 space-y-1">
                {["Free UK shipping", "Pause, skip, or cancel anytime", "100-day money-back guarantee"].map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-black/80">
                    <span className="font-mono text-black/30 shrink-0" aria-hidden>—</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </button>

          {/* Buy Once tile */}
          <button
            onClick={() => onPurchaseTypeChange("one-time")}
            className={`w-full text-left p-4 transition-colors cursor-pointer bg-white ${
              purchaseType === "one-time"
                ? "border-2 border-[#1B2757]"
                : "border border-black/10"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center ${
                    purchaseType === "one-time"
                      ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]"
                      : "border-black/30"
                  }`}
                >
                  {purchaseType === "one-time" && (
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                      <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="font-bold text-[var(--brand-black)]">Buy Once</span>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold tabular-nums text-[var(--brand-black)]">
                  {formatPrice(oneTimePricing.price)}
                </p>
                <p className="font-mono text-xs tabular-nums text-black">
                  {formatPrice(oneTimePricing.perShot)}/shot
                </p>
              </div>
            </div>
          </button>
        </div>

        <ConkaCTAButton onClick={onAddToCart} meta={formatPrice(pricing.price)} className="w-full max-w-none">
          Add to Cart
        </ConkaCTAButton>

        {/* Trust badges */}
        <LandingTrustBadges />
      </div>
    </>
  );
}
