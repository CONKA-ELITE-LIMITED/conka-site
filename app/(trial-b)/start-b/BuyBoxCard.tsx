"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { formatPrice } from "@/app/lib/productData";
import type {
  CadencePricing,
  CadenceVariantConfig,
} from "../lib/cadenceData";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";

interface BuyBoxCardProps {
  subPricing: CadencePricing;
  otpPricing: CadencePricing;
  subVariant: CadenceVariantConfig | null;
  otpVariant: CadenceVariantConfig | null;
  compareAt: number;
  monthlySavings: number;
  savingsPercent: number;
  productImage: string;
  productImageAlt: string;
}

// Brand-safe 4-point sparkle (no emoji) for the free-shots offer badge.
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9z" />
    </svg>
  );
}

function CheckIcon({
  className,
  dimmed = false,
}: {
  className?: string;
  dimmed?: boolean;
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill={dimmed ? "#9CA3AF" : "#10B981"} />
      <path
        d="M8 12.5L10.5 15L16 9.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BuyBoxCard({
  subPricing,
  otpPricing,
  subVariant,
  otpVariant,
  compareAt,
  monthlySavings,
  savingsPercent,
  productImage,
  productImageAlt,
}: BuyBoxCardProps) {
  const { addToCart, loading } = useCart();
  const [isSubscription, setIsSubscription] = useState(true);

  const pricing = isSubscription ? subPricing : otpPricing;
  const variant = isSubscription ? subVariant : otpVariant;
  const showSavings = isSubscription && monthlySavings > 0;

  const handleAddToCart = async () => {
    if (!variant?.variantId) return;
    await addToCart(variant.variantId, 1, variant.sellingPlanId, {
      location: "buy_box",
      source: "startv2_section_5",
    });
  };

  return (
    <div className="bg-white border border-black/10 rounded-[16px] overflow-hidden">
      <div className="relative aspect-[5/4]">
        <Image
          src={productImage}
          alt={productImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="text-[18px] font-semibold text-black leading-tight">
          CONKA Flow + Clear
        </h3>

        <div className="flex items-baseline gap-3 flex-wrap mt-3 mb-1">
          <span className="text-[28px] font-bold text-[#1B2757] tabular-nums leading-none">
            {formatPrice(pricing.price)}
            {isSubscription && (
              <span className="text-[14px] font-semibold text-black/55 ml-1">
                /mo
              </span>
            )}
          </span>
          {showSavings && (
            <>
              <span className="text-[15px] text-black/40 line-through tabular-nums">
                {formatPrice(compareAt)}
              </span>
              <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.1em] text-white bg-[#1B2757] px-2 py-1 rounded-full tabular-nums">
                Save {savingsPercent}%
              </span>
            </>
          )}
        </div>
        <p className="text-[12px] text-black/55 tabular-nums">
          {formatPrice(pricing.perShot)} per shot
        </p>

        {/* Shot-count description, Ketone-IQ pattern. Lives above the bullets
            as a plain line, not as a check item. Offer-trial framing: priced
            box + free first-order shots, not a single combined box. */}
        <p className="text-[14px] text-black/70 font-medium mt-4 mb-3">
          {subPricing.shotCount} shots/month
          {subPricing.freeShots
            ? ` + ${subPricing.freeShots} free on your first order`
            : ""}
        </p>

        <ul className="space-y-2.5 mb-5">
          <li className="flex items-start gap-2.5 text-[14px] text-black leading-snug">
            <CheckIcon className="flex-shrink-0 mt-0.5" />
            <span>One Flow + one Clear, every day</span>
          </li>
          <li className="flex items-start gap-2.5 text-[14px] leading-snug">
            <CheckIcon
              className="flex-shrink-0 mt-0.5"
              dimmed={!isSubscription}
            />
            <span
              className={
                isSubscription ? "text-black" : "text-black/40 line-through"
              }
            >
              Full CONKA app: daily cognitive tests + personalised insights
            </span>
            {!isSubscription && (
              <span className="flex-shrink-0 text-[10px] uppercase tracking-[0.12em] font-bold text-[#1B2757] bg-[#1B2757]/10 px-2 py-0.5 rounded-full mt-1 no-underline">
                Sub only
              </span>
            )}
          </li>
          <li className="flex items-start gap-2.5 text-[14px] text-black leading-snug">
            <CheckIcon className="flex-shrink-0 mt-0.5" />
            <span>Free UK shipping</span>
          </li>
        </ul>

        {/* Sub/OTP toggle. Checkbox-as-pill pattern so the sub/OTP mental
            model stays consistent with the rest of the site's buy flows. */}
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
              Subscribe and save {savingsPercent}%
            </p>
            {isSubscription && subPricing.freeShots ? (
              <p className="text-[12px] text-black/70 mt-1.5 leading-snug">
                <span className="inline-flex items-center gap-1 bg-[#fff4d8] border border-[#C4892A]/40 text-[#8a5a12] font-bold rounded-full px-2 py-0.5 align-middle">
                  <SparkleIcon /> {subPricing.freeShots} FREE shots
                </span>{" "}
                on your first order
              </p>
            ) : null}
            <p className="text-[12px] text-black/60 mt-1 leading-snug">
              Pause, skip, or cancel anytime.
            </p>
          </div>
        </label>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loading || !variant?.variantId}
          className="inline-flex items-center justify-center gap-2 w-full bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
        >
          Start My Routine
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <p className="mt-4 text-center text-[12px] text-black leading-snug">
          {GUARANTEE_LABEL_FULL}
          <br />
          Pause, adjust, or cancel anytime.
        </p>
      </div>
    </div>
  );
}
