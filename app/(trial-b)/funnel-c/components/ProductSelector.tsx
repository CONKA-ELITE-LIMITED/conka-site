"use client";

import { useState } from "react";
import Image from "next/image";
import {
  type FunnelProduct,
  FUNNEL_PRODUCTS,
} from "../../lib/funnelData";

interface ProductSelectorProps {
  product: FunnelProduct;
  onChange: (product: FunnelProduct) => void;
}

const PRODUCT_ORDER: FunnelProduct[] = ["flow", "clear", "both"];

function getWhatShipsLabel(product: FunnelProduct): string {
  return product === "both" ? "2 boxes · 28 shots each" : "1 box · 28 shots";
}

export default function ProductSelector({ product, onChange }: ProductSelectorProps) {
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
        Choose your formula
      </h2>

      <div className="flex flex-col gap-3">
        {PRODUCT_ORDER.map((productKey, i) => {
          const display = FUNNEL_PRODUCTS[productKey];
          const isActive = product === productKey;
          const isBoth = productKey === "both";

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
              {isBoth && <div className="h-1 w-full bg-[#1B2757]" />}

              {/* Badge — Recommended + Most Popular for Both */}
              {isBoth && (
                <div className="py-1.5 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] leading-none text-white bg-[#1B2757] text-center">
                  Recommended · Most Popular
                </div>
              )}

              <div className="p-4">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black/35 leading-none mb-3 tabular-nums">
                  {String(i + 1).padStart(2, "0")} · {display.timeLabel}
                </p>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 relative w-16 h-16 bg-[var(--brand-tint)] flex items-center justify-center overflow-hidden">
                    <Image
                      src={display.thumbnail}
                      alt={display.label}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: display.accent }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-[var(--brand-black)]">
                      {display.label}
                    </p>
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-black/55 mt-1 leading-tight">
                      {getWhatShipsLabel(productKey)}
                    </p>
                    <p className="text-sm text-black/55 mt-1.5 leading-snug">
                      {display.tagline}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <div className="mt-4 pt-4 border-t border-black/10">
                    <p className="text-sm text-black/60 leading-relaxed mb-3">
                      {display.description}
                    </p>
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

              {isActive && <div className="h-1 w-full bg-[#1B2757]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
