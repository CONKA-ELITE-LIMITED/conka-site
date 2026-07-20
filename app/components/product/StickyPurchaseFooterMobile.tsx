"use client";

import { useState, useEffect, useRef } from "react";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  PackSize,
  PurchaseType,
  formulaPricing,
  formatPrice,
  getBillingLabel,
  FormulaId,
} from "@/app/lib/productData";
import { CadenceType } from "@/app/lib/cadenceData";
import type { ProductHeroId } from "@/app/lib/productTypes";
import { GUARANTEE_LABEL } from "@/app/lib/offerConstants";

const packSizes: PackSize[] = ["4", "8", "12", "28"];
const packLabels: Record<PackSize, string> = {
  "4": "4-pack",
  "8": "8-pack",
  "12": "12-pack",
  "28": "28-pack",
};
/**
 * Reassurance under the CTA, lifted from the funnel footer. "Cancel anytime"
 * only shows on a subscription, because it is only true of a subscription, and
 * it is the objection worth answering at the moment of commitment.
 */
function GuaranteeLine({ isSubscription }: { isSubscription: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-black/60">
      <span className="flex items-center gap-1.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
          <circle cx="12" cy="12" r="10" fill="#10B981" />
          <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {GUARANTEE_LABEL}
      </span>

      {isSubscription && (
        <span className="flex items-center gap-1.5">
          <svg
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.7 3L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.7-3L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Cancel anytime
        </span>
      )}
    </div>
  );
}

interface StickyPurchaseFooterMobileProps {
  formulaId?: FormulaId;
  selectedPack?: PackSize;
  onPackSelect?: (pack: PackSize) => void;
  // For the "Both" product
  productHeroId?: ProductHeroId;
  // NOTE: purchaseType drives the old subscribe/one-time toggle display.
  // Pass selectedCadence instead to enter cadence mode, which replaces all
  // selection UI with a single price-confirmed CTA. May be removed once all
  // formula/balance pages have fully migrated to the cadence model.
  purchaseType?: PurchaseType;
  // Cadence mode -- price-only CTA, no picker on mobile
  selectedCadence?: CadenceType;
  cadencePrice?: number;
  onAddToCart: () => void;
}

export default function StickyPurchaseFooterMobile({
  formulaId,
  selectedPack,
  onPackSelect,
  purchaseType = "subscription",
  selectedCadence,
  cadencePrice,
  onAddToCart,
}: StickyPurchaseFooterMobileProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSubscription = purchaseType === "subscription";

  let variantLabel = "";
  let priceLine = "";
  let price = 0;
  let showPackSelector = false;

  if (formulaId && selectedPack) {
    variantLabel = packLabels[selectedPack];
    const pricing = formulaPricing[purchaseType][selectedPack];
    price = pricing.price;
    priceLine = `${formatPrice(pricing.perShot)} / serving`;
    showPackSelector = !!onPackSelect;
  }

  const hasSelector = showPackSelector && selectedPack;

  // Cadence mode: no picker on mobile -- cadence selection lives in the hero widget.
  // Mirrors the funnel footer: one plain CTA carrying its own price, with the
  // risk reversal underneath. No meta line, no badges: at the moment of
  // commitment the button should say one thing.
  if (selectedCadence !== undefined && cadencePrice !== undefined) {
    const frequency =
      selectedCadence === "monthly-sub"
        ? "/mo"
        : selectedCadence === "quarterly-sub"
          ? "/quarter"
          : "";

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-black/8">
        <div
          className="px-4 py-3"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          {/* Same plain CTA as the hero buy panel above, deliberately: the
              icon+meta variant forces its label onto one line, and
              "ADD TO CART · £149.99/QUARTER" is wide enough to overflow a
              small phone. This one wraps instead. */}
          <button
            type="button"
            onClick={onAddToCart}
            className="w-full rounded-full bg-[#1B2757] py-4 text-sm font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 ease-out hover:opacity-95 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:hover:shadow-[#1B2757]/25 active:opacity-90 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]"
          >
            Add to Cart · {formatPrice(cadencePrice)}
            {frequency}
          </button>
          <div className="mt-2.5">
            <GuaranteeLine isSubscription={selectedCadence !== "monthly-otp"} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
          aria-hidden
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t ${
          isSubscription ? "border-[var(--brand-accent)]" : "border-black/12"
        }`}
      >
        <div className="px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0 flex flex-col">
              {hasSelector ? (
                <div className="relative w-full min-w-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full bg-white px-4 py-2 text-left flex items-center gap-2 hover:bg-black/5 transition-colors min-w-0 border border-black/8"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate tabular-nums">
                        {variantLabel}
                        {isSubscription ? " (Save 20%)" : ""}
                      </p>
                      <p
                        className="font-mono text-xs mt-0.5 tabular-nums"
                        style={{
                          color: isSubscription ? "var(--brand-accent)" : undefined,
                          opacity: isSubscription ? undefined : 0.7,
                        }}
                      >
                        {priceLine}
                      </p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`flex-shrink-0 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    >
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-white overflow-hidden max-h-[60vh] overflow-y-auto border border-black/8">
                      {showPackSelector &&
                        packSizes.map((pack) => {
                          const packPricing =
                            formulaPricing[purchaseType][pack];
                          const billingText =
                            purchaseType === "subscription" &&
                            "billing" in packPricing
                              ? getBillingLabel(packPricing.billing)
                              : "One-time";
                          return (
                            <button
                              key={pack}
                              type="button"
                              onClick={() => {
                                onPackSelect?.(pack);
                                setShowDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-black/5 transition-colors flex justify-between items-center gap-3 ${
                                selectedPack === pack
                                  ? "bg-black/5 font-semibold"
                                  : ""
                              }`}
                            >
                              <span className="font-mono tabular-nums">
                                {packLabels[pack]} {billingText}
                              </span>
                              <span className="font-mono tabular-nums text-xs opacity-70 whitespace-nowrap">
                                {formatPrice(packPricing.price)}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="font-mono text-sm font-medium truncate tabular-nums">
                    {variantLabel}
                    {isSubscription ? " (Save 20%)" : ""}
                  </p>
                  <p
                    className="font-mono text-xs mt-0.5 tabular-nums"
                    style={{
                      color: isSubscription ? "var(--brand-accent)" : undefined,
                      opacity: isSubscription ? undefined : 0.7,
                    }}
                  >
                    {priceLine}
                  </p>
                </>
              )}
            </div>
            <ConkaCTAButton compact onClick={onAddToCart} className="!w-auto shrink-0">
              Add · {formatPrice(price)}
            </ConkaCTAButton>
          </div>
        </div>
      </div>
    </>
  );
}
