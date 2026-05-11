"use client";

import { useState } from "react";
import Image from "next/image";
import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_PRODUCTS,
  getOfferPricing,
  getBuySeparatelyPrice,
} from "@/app/lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

interface ProductSelectorProps {
  product: FunnelProduct;
  cadence: FunnelCadence;
  onChange: (product: FunnelProduct) => void;
}

const PRODUCT_ORDER: FunnelProduct[] = ["flow", "both", "clear"];

/** Static per-product "what ships" label — decoupled from cadence */
function getWhatShipsLabel(product: FunnelProduct): string {
  return product === "both" ? "2 Boxes · 28 Shots Each" : "1 Box · 28 Shots";
}

/** Cadence-aware frequency label for price display */
function getPriceFrequency(cadence: FunnelCadence): string {
  switch (cadence) {
    case "monthly-sub":
      return "/mo";
    case "monthly-otp":
      return "";
    case "quarterly-sub":
      return "/quarter";
  }
}

export default function ProductSelector({
  product,
  cadence,
  onChange,
}: ProductSelectorProps) {
  const [pulseKey, setPulseKey] = useState(0);

  const handleChange = (newProduct: FunnelProduct) => {
    setPulseKey((k) => k + 1);
    onChange(newProduct);
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 02 · Product
      </p>
      <h2
        className="text-2xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-5"
        style={{ color: "var(--brand-black)" }}
      >
        Your CONKA plan
      </h2>

      <div className="flex flex-col gap-3">
        {PRODUCT_ORDER.map((productKey, i) => {
          const display = FUNNEL_PRODUCTS[productKey];
          const isActive = product === productKey;
          const pricing = getOfferPricing(productKey, cadence);
          const frequency = getPriceFrequency(cadence);
          const isBoth = productKey === "both";
          const separatePrice = isBoth ? getBuySeparatelyPrice(cadence) : null;
          const savings = separatePrice ? separatePrice - pricing.price : 0;

          return (
            <button
              key={isActive ? `active-${pulseKey}` : productKey}
              type="button"
              onClick={() => handleChange(productKey)}
              className={`relative w-full text-left border-2 bg-white transition-all duration-200 select-none overflow-hidden ${
                isActive
                  ? "card-pulse border-[#1B2757] shadow-md lg:scale-[1.01]"
                  : "border-black/10 hover:border-black/25 shadow-sm"
              }`}
            >
              {/* Top accent bar for Both — solid navy (replaces gradient) */}
              {isBoth && (
                <div className="h-1 w-full bg-[#1B2757]" />
              )}

              {/* Badge banner — navy fill, mono register */}
              {display.badge && (
                <div className="py-1.5 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] leading-none text-white bg-[#1B2757] text-center">
                  {isBoth && savings > 0
                    ? `${display.badge} · Save ${formatPrice(savings)}`
                    : display.badge}
                </div>
              )}

              <div className="p-4">
                {/* Row number — mono spec counter */}
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35 leading-none mb-3 tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {display.timeLabel}
                </p>

                {/* Main card content — thumbnail + details */}
                <div className="flex gap-4">
                  {/* Product thumbnail — square, colored accent strip acts as product identifier */}
                  <div className="flex-shrink-0 relative w-16 h-16 bg-[var(--brand-tint)] flex items-center justify-center overflow-hidden">
                    <Image
                      src={display.thumbnail}
                      alt={display.label}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    {/* Small left accent bar — per-product decision aid */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: display.accent }}
                    />
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold text-[var(--brand-black)]">
                          {display.label}
                        </p>
                        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-black/55 mt-1 leading-tight">
                          {getWhatShipsLabel(productKey)}
                        </p>
                      </div>

                      {/* Per-shot price — primary anchor, tabular-nums */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-semibold text-[var(--brand-black)] tabular-nums">
                          {formatPrice(pricing.perShot)}
                          <span className="font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-black/40">
                            /shot
                          </span>
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/50 mt-0.5 tabular-nums">
                          {formatPrice(pricing.price)}
                          {frequency}
                        </p>
                        {pricing.compareAtPrice && (
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/35 mt-0.5 tabular-nums">
                            <span className="line-through">
                              {formatPrice(pricing.compareAtPrice)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded details for selected product */}
                {isActive && (
                  <div className="mt-4 pt-4 border-t border-black/10">
                    <p className="text-sm text-black/60 leading-relaxed mb-3">
                      {display.description}
                    </p>

                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1B2757] mb-3 tabular-nums">
                      {formatPrice(pricing.perShot)}/shot · {isBoth ? "2" : "1"} shot{isBoth ? "s" : ""} per day
                    </p>

                    {/* Feature bullets — navy checks */}
                    <div className="space-y-1.5">
                      {display.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-[var(--brand-black)]">
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

              {/* Selection indicator — bottom accent bar (solid navy) */}
              {isActive && (
                <div className="h-1 w-full bg-[#1B2757]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
