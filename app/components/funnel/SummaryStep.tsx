"use client";

import Image from "next/image";
import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_PRODUCTS,
  FUNNEL_CADENCES,
  FUNNEL_HERO_IMAGES,
  getOfferPricing,
} from "@/app/lib/funnelData";
import { formatPrice } from "@/app/lib/productData";
import { GUARANTEE_DAYS } from "@/app/lib/offerConstants";

interface SummaryStepProps {
  product: FunnelProduct;
  cadence: FunnelCadence;
}

function getWhatShips(product: FunnelProduct, cadence: FunnelCadence, shotCount: number): string {
  const boxes = product === "both" ? 2 : 1;
  const boxLabel = boxes === 1 ? "1 box" : "2 boxes";
  switch (cadence) {
    case "monthly-sub":
      return `${boxLabel} · ${shotCount} shots · delivered every month`;
    case "quarterly-sub":
      return `${boxLabel} · ${shotCount} shots · delivered every 3 months`;
    case "monthly-otp":
      return `${boxLabel} · ${shotCount} shots · one-off delivery`;
  }
}

function formatTotal(price: number, cadence: FunnelCadence): string {
  if (cadence === "monthly-sub") return `${formatPrice(price)}/mo`;
  if (cadence === "quarterly-sub") return `${formatPrice(price)}/quarter`;
  return formatPrice(price);
}

const APP_BULLETS = [
  "Daily brain performance score, tracked over time",
  "Personalised insights from your shots and test results",
  `${GUARANTEE_DAYS}-day money-back guarantee, no questions asked`,
];

export default function SummaryStep({ product, cadence }: SummaryStepProps) {
  const display = FUNNEL_PRODUCTS[product];
  const cadenceDisplay = FUNNEL_CADENCES[cadence];
  const pricing = getOfferPricing(product, cadence);
  const heroImage = FUNNEL_HERO_IMAGES[product];
  const savings = pricing.compareAtPrice ? pricing.compareAtPrice - pricing.price : 0;
  const isSub = cadence !== "monthly-otp";

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 04 · Review
      </p>
      <h2
        className="text-2xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-5"
        style={{ color: "var(--brand-black)" }}
      >
        Your order
      </h2>

      {/* Product hero image */}
      <div className="w-full h-40 bg-[var(--brand-tint)] flex items-center justify-center overflow-hidden mb-4">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          width={320}
          height={160}
          className="h-full w-full object-contain"
        />
      </div>

      {/* What / When / How much */}
      <div className="border border-black/10 divide-y divide-black/8 mb-4">

        {/* WHAT */}
        <div className="px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/35 mb-1">What</p>
          <p className="text-sm font-semibold text-[var(--brand-black)]">{display.label}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/50 mt-0.5">
            {getWhatShips(product, cadence, pricing.shotCount)}
          </p>
        </div>

        {/* WHEN */}
        <div className="px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/35 mb-1">When</p>
          <p className="text-sm font-semibold text-[var(--brand-black)]">2-3 days</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/50 mt-0.5">
            UK delivery
          </p>
        </div>

        {/* HOW MUCH */}
        <div className="px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/35 mb-1">How much</p>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-[var(--brand-black)] tabular-nums">
              {formatTotal(pricing.price, cadence)}
            </p>
            {isSub && (
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white bg-[#1B2757] px-2 py-1 shrink-0">
                {cadence === "quarterly-sub" ? "Best Value" : "Save 25%"}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#1B2757] font-semibold mt-1">
              Save {formatPrice(savings)} vs trial pack price
            </p>
          )}
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40 mt-0.5">
            {cadenceDisplay.subtitle}
          </p>
        </div>
      </div>

      {/* App section */}
      <div className="border border-black/10 overflow-hidden mb-5">
        <div className="px-4 py-2 border-b border-black/8 bg-[var(--brand-tint)]">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Also included — the CONKA app
          </p>
        </div>

        <div className="flex gap-4 p-4">
          {/* App screenshot — scaled down */}
          <div className="shrink-0 w-16 overflow-hidden rounded-[6px] shadow-sm border border-black/8">
            <Image
              src="/app/AppConkaRing.png"
              alt="CONKA app showing daily brain performance score"
              width={64}
              height={138}
              className="w-full h-auto"
            />
          </div>

          {/* Bullets */}
          <div className="flex-1 min-w-0 space-y-2.5 pt-1">
            {APP_BULLETS.map((bullet) => (
              <div key={bullet} className="flex gap-2">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
                  <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                </svg>
                <p className="text-sm text-[var(--brand-black)] leading-snug">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
