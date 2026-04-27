"use client";

import { useState, useEffect, useRef } from "react";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  PackSize,
  PurchaseType,
  ProtocolTier,
  formulaPricing,
  protocolPricing,
  protocolContent,
  formatPrice,
  getBillingLabel,
  getProtocolTierPackLabel,
  FormulaId,
  ProtocolId,
} from "@/app/lib/productData";
import { CadenceType } from "@/app/lib/cadenceData";

const packSizes: PackSize[] = ["4", "8", "12", "28"];
const packLabels: Record<PackSize, string> = {
  "4": "4-pack",
  "8": "8-pack",
  "12": "12-pack",
  "28": "28-pack",
};
interface StickyPurchaseFooterMobileProps {
  formulaId?: FormulaId;
  selectedPack?: PackSize;
  onPackSelect?: (pack: PackSize) => void;
  protocolId?: ProtocolId;
  selectedTier?: ProtocolTier;
  onTierSelect?: (tier: ProtocolTier) => void;
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
  protocolId,
  selectedTier,
  onTierSelect,
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
  let showTierSelector = false;
  let availableTiers: ProtocolTier[] = [];

  if (formulaId && selectedPack) {
    variantLabel = packLabels[selectedPack];
    const pricing = formulaPricing[purchaseType][selectedPack];
    price = pricing.price;
    priceLine = `${formatPrice(pricing.perShot)} / serving`;
    showPackSelector = !!onPackSelect;
  } else if (protocolId && selectedTier) {
    variantLabel = getProtocolTierPackLabel(protocolId, selectedTier);
    const pricingType = protocolId === "4" ? "ultimate" : "standard";
    const tierPricing = protocolPricing[pricingType][purchaseType];
    if (selectedTier in tierPricing) {
      const pricing = tierPricing[selectedTier as keyof typeof tierPricing];
      price = pricing.price;
    }
    priceLine = formatPrice(price);
    const protocol = protocolContent[protocolId];
    availableTiers = protocol?.availableTiers ?? [];
    showTierSelector = !!onTierSelect;
  }

  const hasSelector =
    (showPackSelector && selectedPack) ||
    (showTierSelector && selectedTier && availableTiers.length > 0);

  // Cadence mode: no picker on mobile -- cadence selection lives in the hero widget.
  // Show a single full-width CTA confirming the price.
  if (selectedCadence !== undefined && cadencePrice !== undefined) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/12">
        <div className="px-5 py-3">
          <ConkaCTAButton compact onClick={onAddToCart} className="w-full max-w-none !w-auto">
            Add to Cart · {formatPrice(cadencePrice)}
          </ConkaCTAButton>
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
                      {showTierSelector &&
                        protocolId &&
                        availableTiers.map((tier) => {
                          const pricingType =
                            protocolId === "4" ? "ultimate" : "standard";
                          const tierPricing =
                            protocolPricing[pricingType][purchaseType];
                          const tierData =
                            tierPricing[tier as keyof typeof tierPricing];
                          if (!tierData) return null;
                          const billingText =
                            purchaseType === "subscription" &&
                            "billing" in tierData
                              ? getBillingLabel(tierData.billing)
                              : "One-time";
                          return (
                            <button
                              key={tier}
                              type="button"
                              onClick={() => {
                                onTierSelect?.(tier);
                                setShowDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-black/5 transition-colors flex justify-between items-center gap-3 ${
                                selectedTier === tier
                                  ? "bg-black/5 font-semibold"
                                  : ""
                              }`}
                            >
                              <span className="font-mono tabular-nums">
                                {getProtocolTierPackLabel(protocolId!, tier)} {billingText}
                              </span>
                              <span className="font-mono tabular-nums text-xs opacity-70 whitespace-nowrap">
                                {formatPrice(tierData.price)}
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
