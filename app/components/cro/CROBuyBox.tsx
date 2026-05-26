"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/productData";
import {
  getCadenceVariantByProductHeroId,
  getCadencePricingByProductHeroId,
  type CadenceType,
} from "@/app/lib/cadenceData";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";
import CROPillCTA from "./CROPillCTA";

/* ============================================================================
 * CROBuyBox
 *
 * V2 Section 5 on /start. First inline purchase moment, Ketone-IQ-style
 * single product card for conka-both. Auto-checked subscription toggle;
 * CTA copy + price reflect the toggle. Real CartContext wiring with
 * funnel-attribution metadata.
 * ========================================================================== */

const PRODUCT_HERO_ID = "03";
const PRODUCT_IMAGE = "/formulas/both/BothBox.jpg";
const PRODUCT_IMAGE_ALT =
  "CONKA Flow and Clear boxes side by side with both bottles in front";
const PRODUCT_NAME = "CONKA Both";
const PRODUCT_TAGLINE = "Flow for the morning, Clear for the afternoon.";

const BENEFITS = [
  "Two formulas built around your full day",
  "16 clinical ingredients, UK patented",
  "Calm focus, no caffeine in the morning",
  "Pause, skip, or cancel anytime",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 8.5L6.5 12L13 4.5" />
    </svg>
  );
}

export default function CROBuyBox() {
  const { addToCart, loading } = useCart();
  const [isSubscription, setIsSubscription] = useState(true);

  const cadence: CadenceType = isSubscription ? "monthly-sub" : "monthly-otp";
  const variant = getCadenceVariantByProductHeroId(PRODUCT_HERO_ID, cadence);
  const pricing = getCadencePricingByProductHeroId(PRODUCT_HERO_ID, cadence);
  const otpPricing = getCadencePricingByProductHeroId(
    PRODUCT_HERO_ID,
    "monthly-otp",
  );

  // Compare-at: prefer the cadence's own compareAtPrice, otherwise fall back
  // to the OTP price so the savings calc is always anchored to a real number.
  const subPricing = getCadencePricingByProductHeroId(
    PRODUCT_HERO_ID,
    "monthly-sub",
  );
  const compareAt = subPricing.compareAtPrice ?? otpPricing.price;
  const monthlySavings = Math.max(0, compareAt - subPricing.price);
  const savingsPercent =
    compareAt > 0 ? Math.round((monthlySavings / compareAt) * 100) : 0;

  const handleAddToCart = async () => {
    if (!variant?.variantId) return;
    await addToCart(variant.variantId, 1, variant.sellingPlanId, {
      location: "buy_box",
      source: "v2_quick_purchase",
    });
  };

  const ctaLabel = isSubscription
    ? `Start subscription · ${formatPrice(pricing.price)}/mo`
    : `Order once · ${formatPrice(pricing.price)}`;

  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        Try your first shot today.
      </h2>

      <div className="rounded-[var(--brand-radius-container)] bg-white border border-black/8 overflow-hidden">
        {/* ===== Product image ===== */}
        <div className="relative aspect-[5/4] bg-black/[0.03]">
          <Image
            src={PRODUCT_IMAGE}
            alt={PRODUCT_IMAGE_ALT}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </div>

        <div className="p-5">
          {/* ===== Title + tagline ===== */}
          <h3 className="text-[22px] font-semibold text-black leading-tight">
            {PRODUCT_NAME}
          </h3>
          <p className="text-[14px] text-black/60 leading-snug mt-1 mb-4">
            {PRODUCT_TAGLINE}
          </p>

          {/* ===== Price row ===== */}
          <div className="flex items-baseline gap-3 flex-wrap mb-1">
            <span className="text-[28px] font-bold text-[#1B2757] tabular-nums leading-none">
              {formatPrice(pricing.price)}
              <span className="text-[14px] font-semibold text-black/55 ml-1">
                {isSubscription ? "/mo" : ""}
              </span>
            </span>
            {isSubscription && monthlySavings > 0 && (
              <>
                <span className="text-[15px] text-black/40 line-through tabular-nums">
                  {formatPrice(compareAt)}
                </span>
                <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.1em] text-[#1B2757] bg-[#1B2757]/10 px-2 py-1 rounded-full tabular-nums">
                  Save {savingsPercent}%
                </span>
              </>
            )}
          </div>
          <p className="text-[12px] text-black/55 tabular-nums mb-5">
            {formatPrice(pricing.perShot)} per shot
          </p>

          {/* ===== Benefits ===== */}
          <ul className="space-y-2 mb-5">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2 text-[13.5px] text-black/80 leading-snug"
              >
                <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1B2757]" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          {/* ===== Subscription toggle ===== */}
          <label
            className={`flex items-start gap-3 p-3 rounded-[14px] border-2 transition-colors cursor-pointer mb-5 ${
              isSubscription
                ? "border-[#1B2757] bg-[#1B2757]/[0.04]"
                : "border-black/12 bg-white hover:border-black/25"
            }`}
          >
            <input
              type="checkbox"
              checked={isSubscription}
              onChange={(e) => setIsSubscription(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-[#1B2757] flex-shrink-0"
              aria-label="Subscribe and save"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-black leading-tight">
                Subscribe & Save {savingsPercent}%
              </p>
              <p className="text-[12px] text-black/60 mt-0.5 leading-snug">
                Pause, skip, or cancel anytime.
              </p>
            </div>
          </label>

          {/* ===== CTA ===== */}
          <CROPillCTA
            onClick={handleAddToCart}
            disabled={loading || !variant?.variantId}
            className="w-full"
          >
            {ctaLabel}
          </CROPillCTA>

          {/* ===== Guarantee footer ===== */}
          <div className="mt-4 text-center">
            <p className="text-[12px] font-semibold text-black/70">
              {GUARANTEE_LABEL_FULL}
            </p>
            <p className="text-[11px] text-black/45 mt-1">
              Pause, adjust, or cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
