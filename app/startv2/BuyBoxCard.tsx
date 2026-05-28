"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/app/lib/productData";
import type { CadencePricing } from "@/app/lib/cadenceData";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";

interface BuyBoxCardProps {
  subPricing: CadencePricing;
  otpPricing: CadencePricing;
  compareAt: number;
  monthlySavings: number;
  savingsPercent: number;
  funnelUrl: string;
  productImage: string;
  productImageAlt: string;
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
  compareAt,
  monthlySavings,
  savingsPercent,
  funnelUrl,
  productImage,
  productImageAlt,
}: BuyBoxCardProps) {
  const [isSubscription, setIsSubscription] = useState(true);

  const pricing = isSubscription ? subPricing : otpPricing;
  const showSavings = isSubscription && monthlySavings > 0;

  return (
    <div className="bg-white border border-black/10 rounded-[16px] overflow-hidden">
      {/* Image area with title + price overlaid at the top-left. The new
          BothBox.jpg has a clean white photographic background in its upper
          region, so dark text reads cleanly without a scrim. */}
      <div className="relative aspect-[5/4] bg-white">
        <Image
          src={productImage}
          alt={productImageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-5">
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
        </div>
      </div>

      <div className="p-5">
        {/* Shot-count description, Ketone-IQ pattern. Lives above the bullets
            as a plain line, not as a check item. */}
        <p className="text-[14px] text-black/70 font-medium mb-3">
          56 shots = 28 servings
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

        {/* Sub/OTP toggle. Same checkbox-as-pill pattern as CROBuyBox so the
            mental model stays consistent across the two buy-box variants. */}
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
            <p className="text-[12px] text-black/60 mt-0.5 leading-snug">
              Pause, skip, or cancel anytime.
            </p>
          </div>
        </label>

        <Link
          href={funnelUrl}
          className="inline-flex items-center justify-center gap-2 w-full bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
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
        </Link>

        <p className="mt-4 text-center text-[12px] text-black/65 leading-snug">
          {GUARANTEE_LABEL_FULL}
          <br />
          Pause, adjust, or cancel anytime.
        </p>
      </div>
    </div>
  );
}
