"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ProtocolId,
  PurchaseType,
  getProtocolPricing,
  getB2BProtocolPricing,
  formatPrice,
  getBillingLabel,
  FORMULA_COLORS,
} from "@/app/lib/productData";
import type { B2BTier } from "@/app/lib/productData";
import type { B2BNextTierInfo } from "@/app/components/professionals/formulas/types";
import { getProtocolImage } from "@/app/lib/productImageConfig";
import { protocolContent } from "@/app/lib/productData";
import { professionalProtocolCopy } from "./protocolCopy";

interface ProtocolPurchaseCardProps {
  protocolId: ProtocolId;
  selectedPurchaseType: PurchaseType;
  quantity: number;
  onPurchaseTypeChange: (type: PurchaseType) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  /** When set, card uses B2B tier pricing (Starter/Squad/Elite) */
  tier?: B2BTier;
  nextTier?: B2BNextTierInfo | null;
}

export default function ProtocolPurchaseCard({
  protocolId,
  selectedPurchaseType,
  quantity,
  onPurchaseTypeChange,
  onQuantityChange,
  onAddToCart,
  tier,
  nextTier,
}: ProtocolPurchaseCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const copy = professionalProtocolCopy[protocolId];
  const protocolImage =
    getProtocolImage(protocolId) || protocolContent[protocolId]?.image || "";

  const useB2BPricing = tier !== undefined;
  const pricing = useB2BPricing && tier !== undefined
    ? getB2BProtocolPricing(protocolId, tier, selectedPurchaseType)
    : getProtocolPricing(protocolId, "max", selectedPurchaseType);
  const oneTimePricing = useB2BPricing && tier !== undefined
    ? getB2BProtocolPricing(protocolId, tier, "one-time")
    : getProtocolPricing(protocolId, "max", "one-time");
  const pricePerUnit = pricing?.price ?? 0;
  const totalPrice = pricePerUnit * quantity;
  const billingText =
    selectedPurchaseType === "subscription" && pricing && "billing" in pricing
      ? getBillingLabel(pricing.billing)
      : "one-time";
  const oneTimePerBox = oneTimePricing?.price ?? 0;

  // Subscription is always 20% off for protocols; show that on the Subscribe button
  const subscriptionSavePercentage = 20;
  const protocolAccentColor = FORMULA_COLORS["01"].hex;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    onQuantityChange(quantity + 1);
  };

  if (!copy) return null;

  const isUltimate = protocolId === "4";
  const shotsPerBox = isUltimate ? 56 : 28;

  return (
    <div className="flex flex-col h-full border-2 border-black/10 rounded-lg overflow-hidden">
      {/* Image Container - shorter aspect; Ultimate (4) zoomed out to fit full image */}
      <div className="relative aspect-[5/2] overflow-hidden">
        <div
          className={`absolute inset-0 ${isUltimate ? "flex items-center justify-center" : ""}`}
          style={isUltimate ? undefined : { bottom: "-20%" }}
        >
          {protocolImage && (
            <Image
              src={protocolImage}
              alt={copy.name}
              fill
              className={isUltimate ? "object-contain" : "object-cover"}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-2 px-4 md:px-5 flex-1 flex flex-col">
        {/* Protocol Name and Tagline (same line; tagline footer-style) */}
        <div className="flex items-baseline gap-2 mb-2 pb-2 border-b border-black/5">
          <h3 className="text-lg md:text-xl font-bold font-primary opacity-100">
            {copy.name}
          </h3>
          <p className="font-primary text-[10px] md:text-xs text-[var(--foreground)] opacity-90">
            {copy.tagline}
          </p>
        </div>

        {/* Protocol description (from protocolContent) */}
        {protocolContent[protocolId]?.description && (
          <p className="font-primary text-xs md:text-sm text-[var(--foreground)] opacity-80 mb-3">
            {protocolContent[protocolId].description}
          </p>
        )}

        {/* Purchase Controls */}
        <div className="space-y-2 mb-3">
          {/* Purchase Type Toggle */}
          <div>
            <p className="font-mono text-[10px] uppercase opacity-70 mb-1">
              Purchase Type
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onPurchaseTypeChange("subscription")}
                className={`px-3 py-1.5 rounded-full border-2 transition-all flex items-center gap-1.5 text-sm ${
                  selectedPurchaseType === "subscription"
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "bg-transparent border-[var(--foreground)]/30 text-[var(--foreground)] hover:border-[var(--foreground)]/50"
                }`}
              >
                <span className="font-mono text-sm font-medium">
                  Subscribe
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-white font-mono text-xs"
                  style={{ backgroundColor: protocolAccentColor }}
                >
                  SAVE {subscriptionSavePercentage}%
                </span>
              </button>
              <button
                onClick={() => onPurchaseTypeChange("one-time")}
                className={`px-3 py-1.5 rounded-full border-2 transition-all text-sm ${
                  selectedPurchaseType === "one-time"
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "bg-transparent border-[var(--foreground)]/30 text-[var(--foreground)] hover:border-[var(--foreground)]/50"
                }`}
              >
                <span className="font-mono text-sm font-medium">
                  One-off
                </span>
              </button>
            </div>
          </div>

          {useB2BPricing && tier !== undefined && (
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[10px] uppercase opacity-70">
                Tier: <span className="font-semibold opacity-100 capitalize">{tier}</span>
              </p>
              {nextTier && (
                <p className="font-mono text-xs text-[var(--foreground)] opacity-90">
                  Add {nextTier.boxesToNext} more for {nextTier.tierName}: {formatPrice(nextTier.pricePerBoxExVat)}/box ex. VAT
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <p className="font-mono text-[10px] uppercase opacity-70 mb-1">
              Quantity
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-8 h-8 md:w-9 md:h-9 border-2 border-[var(--foreground)] rounded-lg flex items-center justify-center font-bold text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--foreground)]/10 transition-colors"
              >
                −
              </button>
              <div className="flex-1 text-center">
                <p className="text-xl md:text-2xl font-bold">{quantity}</p>
                <p className="font-mono text-[10px] opacity-70">
                  {quantity === 1 ? "box" : "boxes"} ({shotsPerBox} shots per box)
                </p>
              </div>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 md:w-9 md:h-9 border-2 border-[var(--foreground)] rounded-lg flex items-center justify-center font-bold text-base hover:bg-[var(--foreground)]/10 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="pt-2 border-t border-black/5">
            <div className="flex justify-between items-baseline mb-0.5">
              <span className="font-mono text-xs opacity-70">
                Per box ({billingText}
                {selectedPurchaseType === "subscription" && ", delivered monthly"}
                ):
              </span>
              <span className="text-base font-bold">
                {formatPrice(pricePerUnit)}
                {useB2BPricing && <span className="font-mono text-[10px] font-normal opacity-70 ml-1">ex. VAT</span>}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-sm font-semibold">
                Total:
              </span>
              <div className="flex flex-col items-end">
                {selectedPurchaseType === "subscription" && oneTimePerBox > 0 && (
                  <span className="text-sm font-bold line-through opacity-50 mb-0.5">
                    {formatPrice(oneTimePerBox * quantity)}
                  </span>
                )}
                <span
                  className="text-lg font-bold"
                  style={
                    selectedPurchaseType === "subscription"
                      ? { color: protocolAccentColor }
                      : undefined
                  }
                >
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-auto pb-3">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="neo-button px-6 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Adding...
              </>
            ) : (
              <>
                Add {quantity} {quantity === 1 ? "Box" : "Boxes"} to Cart
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
