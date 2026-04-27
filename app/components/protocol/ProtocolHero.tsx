"use client";

import Image from "next/image";
import {
  ProtocolId,
  ProtocolTier,
  PurchaseType,
  protocolContent,
  protocolPricing,
  formatPrice,
  getProtocolTierTotalShots,
} from "@/app/lib/productData";
import { getProtocolHeroImages } from "@/app/components/navigation/protocolHeroConfig";
import ProductImageSlideshow from "@/app/components/product/ProductImageSlideshow";
import LandingTrustBadges from "@/app/components/landing/LandingTrustBadges";
import ProtocolRatioSelector from "./ProtocolRatioSelector";
import {
  CadenceType,
  getBalanceCadencePricing,
} from "@/app/lib/cadenceData";

interface ProtocolHeroProps {
  protocolId: ProtocolId;
  selectedTier: ProtocolTier;
  onTierSelect: (tier: ProtocolTier) => void;
  purchaseType: PurchaseType;
  onPurchaseTypeChange: (type: PurchaseType) => void;
  onAddToCart: () => void;
  onProtocolChange?: (id: ProtocolId) => void;
  // Cadence mode for Balance (protocol 3) -- replaces tier + purchaseType selectors
  selectedCadence?: CadenceType;
  onCadenceChange?: (cadence: CadenceType) => void;
}

const BALANCE_CADENCE_OPTIONS: {
  cadence: CadenceType;
  label: string;
  badge?: string;
  badgeStyle?: "accent" | "muted";
}[] = [
  { cadence: "monthly-sub", label: "Monthly subscription", badge: "Most Popular", badgeStyle: "accent" },
  { cadence: "quarterly-sub", label: "Quarterly subscription", badge: "Best Value", badgeStyle: "muted" },
  { cadence: "monthly-otp", label: "Buy once" },
];

const BALANCE_DELIVERY_LABEL: Record<CadenceType, string> = {
  "monthly-sub": "56 shots delivered monthly (28 Flow + 28 Clear)",
  "quarterly-sub": "168 shots delivered every 3 months",
  "monthly-otp": "56 shots, single delivery",
};

const BALANCE_SUB_FEATURES = ["Free UK shipping", "Pause, skip, or cancel anytime", "100-day money-back guarantee"];
const BALANCE_OTP_FEATURES = ["100-day money-back guarantee", "Subscribe later and save 25%"];

const TIER_OPTIONS: ProtocolTier[] = ["starter", "pro", "max"];

const TIER_LABELS: Record<ProtocolTier, string> = {
  starter: "4 Shots",
  pro: "12 Shots",
  max: "28 Shots",
};

function getDeliveryDescription(protocolId: ProtocolId, tier: ProtocolTier): string {
  const tierConfig = protocolContent[protocolId].tiers[tier];
  if (!tierConfig) return "";
  const totalShots = getProtocolTierTotalShots(protocolId, tier);
  return `${totalShots} shots (${tierConfig.conkaFlowCount} Flow + ${tierConfig.conkaClarityCount} Clear per week)`;
}

export default function ProtocolHero({
  protocolId,
  selectedTier,
  onTierSelect,
  purchaseType,
  onPurchaseTypeChange,
  onAddToCart,
  onProtocolChange,
  selectedCadence,
  onCadenceChange,
}: ProtocolHeroProps) {
  const protocol = protocolContent[protocolId];
  const isCadenceMode = protocolId === "3" && selectedCadence !== undefined && onCadenceChange !== undefined;

  const pricingType = protocolId === "4" ? "ultimate" : "standard";
  const tierPricing = protocolPricing[pricingType][purchaseType];
  const pricing = tierPricing[selectedTier as keyof typeof tierPricing];
  const totalShots = getProtocolTierTotalShots(protocolId, selectedTier);

  const subscriptionPricing =
    protocolPricing[pricingType]["subscription"][
      selectedTier as keyof (typeof protocolPricing)[typeof pricingType]["subscription"]
    ];
  const oneTimePricing =
    protocolPricing[pricingType]["one-time"][
      selectedTier as keyof (typeof protocolPricing)[typeof pricingType]["one-time"]
    ];

  const currentPrice = isCadenceMode
    ? getBalanceCadencePricing(selectedCadence!).price
    : pricing?.price ?? 0;
  const subPrice = subscriptionPricing?.price ?? 0;
  const otpPrice = oneTimePricing?.price ?? 0;
  const subPerShot = totalShots > 0 ? subPrice / totalShots : 0;
  const otpPerShot = totalShots > 0 ? otpPrice / totalShots : 0;

  const availableTiers = TIER_OPTIONS.filter((tier) =>
    protocol.availableTiers.includes(tier),
  );

  // Cadence pricing helpers for Balance mode
  const balanceOtpPricing = isCadenceMode ? getBalanceCadencePricing("monthly-otp") : null;
  const balanceMonthlySubPricing = isCadenceMode ? getBalanceCadencePricing("monthly-sub") : null;

  function getBalanceCompareAt(cadence: CadenceType): number | null {
    if (cadence === "monthly-sub") return balanceOtpPricing?.price ?? null;
    if (cadence === "quarterly-sub") return (balanceMonthlySubPricing?.price ?? 0) * 3;
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-center lg:items-start gap-[var(--brand-space-m)]">
      {/* Left: Product Image */}
      <div className="relative z-0 lg:w-[44%] lg:flex-shrink-0 order-1 lg:order-1 lg:sticky lg:top-24 lg:self-start">
        <div className="relative w-full group">
          <ProductImageSlideshow
            images={getProtocolHeroImages(protocolId)}
            alt={`${protocol.name} - Both formulas`}
          />
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col gap-[var(--brand-space-s)] lg:gap-[var(--brand-space-l)] flex-1 lg:w-[48%] lg:flex-shrink-0 min-w-0 order-2 lg:order-2 relative z-10">
        <div
          className="brand-card flex flex-col gap-[var(--brand-space-s)] lg:gap-[var(--brand-space-m)] !border-0 relative z-10"
          style={{
            paddingLeft: "var(--brand-space-m)",
            paddingRight: "var(--brand-space-m)",
            paddingTop: "var(--brand-space-s)",
            paddingBottom: "var(--brand-space-m)",
            backgroundColor: "#fff",
          }}
        >
          {/* Top section: stars + title + meta pill */}
          <div className="mb-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <div className="flex" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-amber-500"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="brand-data text-black/60">
                Over 150,000 bottles sold
              </span>
            </div>
            <h1
              className="brand-h1-bold leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              {protocol.name}
            </h1>
            {protocolId !== "3" && (
              <div className="mt-2">
                <span
                  className="inline-block py-1 brand-data text-black/60 text-sm"
                  style={{
                    paddingLeft: "var(--brand-space-m)",
                    paddingRight: "var(--brand-space-m)",
                    borderRadius: "var(--brand-radius-interactive)",
                    background: "rgba(0,0,0,0.04)",
                  }}
                >
                  {protocol.subtitle} · {totalShots} shots
                </span>
              </div>
            )}
          </div>

          {/* Headline description */}
          <p className="brand-body text-black/80 text-base md:text-lg leading-snug mb-1.5">
            {protocol.description}
          </p>

          {/* Ratio selector for non-Balance protocols */}
          {onProtocolChange && (
            <ProtocolRatioSelector
              value={protocolId}
              onChange={onProtocolChange}
            />
          )}

          {/* Tier selector (non-Balance protocols) or Cadence selector (Balance) */}
          {isCadenceMode ? (
            <div className="space-y-2">
              {BALANCE_CADENCE_OPTIONS.map(({ cadence, label, badge, badgeStyle }) => {
                const isSelected = selectedCadence === cadence;
                const cadencePricing = getBalanceCadencePricing(cadence);
                const compareAt = getBalanceCompareAt(cadence);
                const isSubscription = cadence !== "monthly-otp";
                const features = isSubscription ? BALANCE_SUB_FEATURES : BALANCE_OTP_FEATURES;

                return (
                  <button
                    key={cadence}
                    onClick={() => onCadenceChange!(cadence)}
                    className={`w-full text-left transition-colors cursor-pointer bg-white overflow-hidden ${
                      isSelected ? "border-2 border-[#1B2757]" : "border border-black/10"
                    }`}
                  >
                    {isSelected && badge && (
                      <div
                        className="py-1.5 pl-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white tabular-nums"
                        style={{ backgroundColor: badgeStyle === "accent" ? "var(--brand-accent)" : "#1B2757" }}
                      >
                        {badge}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span
                            className={`flex-shrink-0 w-5 h-5 border-2 mt-0.5 flex items-center justify-center ${
                              isSelected ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]" : "border-black/30"
                            }`}
                          >
                            {isSelected && (
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                <path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-[var(--brand-black)]">{label}</span>
                            {!isSelected && badge && (
                              <span className="ml-2 inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">
                                {badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {compareAt && (
                            <p className="font-mono text-sm tabular-nums line-through text-black/50">
                              {formatPrice(compareAt)}
                            </p>
                          )}
                          <p className="text-2xl font-bold tabular-nums text-[var(--brand-black)]">
                            {formatPrice(cadencePricing.price)}
                          </p>
                          <p className="font-mono text-xs tabular-nums text-black">
                            {formatPrice(cadencePricing.perShot)}/shot
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <>
                          <p className="text-sm text-black/80 mt-3 ml-8">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 mr-1.5">Ships ·</span>
                            {BALANCE_DELIVERY_LABEL[cadence]}
                          </p>
                          <ul className="mt-2 ml-8 space-y-1">
                            {features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-sm text-black/80">
                                <span className="font-mono text-black/30 shrink-0" aria-hidden>—</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <div>
                <div className="grid grid-cols-3 gap-2 pt-3">
                  {availableTiers.map((tier) => {
                    const isSelected = selectedTier === tier;
                    return (
                      <button
                        key={tier}
                        onClick={() => onTierSelect(tier)}
                        className={`
                          relative text-center transition-colors duration-200 w-full
                          border-2 cursor-pointer px-2 py-2.5 font-mono font-bold tracking-[0.08em] uppercase tabular-nums text-[11px]
                          ${isSelected
                            ? "bg-[var(--brand-black)] border-[var(--brand-black)] text-white"
                            : "bg-white border-black/10 text-[var(--brand-black)] hover:border-black/20"
                          }
                        `}
                      >
                        {tier === "pro" && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 pl-2 pr-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] bg-[var(--brand-accent)] text-white whitespace-nowrap leading-none tabular-nums [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]">
                            Most Popular
                          </span>
                        )}
                        {TIER_LABELS[tier]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => onPurchaseTypeChange("subscription")}
                  className={`w-full text-left transition-colors cursor-pointer bg-white overflow-hidden ${
                    purchaseType === "subscription" ? "border-2 border-[#1B2757]" : "border border-black/10"
                  }`}
                >
                  {purchaseType === "subscription" && (
                    <div className="py-1.5 pl-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white tabular-nums" style={{ backgroundColor: "var(--brand-accent)" }}>
                      Best Value · Save 20%
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className={`flex-shrink-0 w-5 h-5 border-2 mt-0.5 flex items-center justify-center ${purchaseType === "subscription" ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]" : "border-black/30"}`}>
                          {purchaseType === "subscription" && (
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-[var(--brand-black)]">Subscribe</span>
                          <span className="ml-2 inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]">Save 20% · every order</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-sm tabular-nums line-through text-black/50">{formatPrice(otpPrice)}</p>
                        <p className="text-2xl font-bold tabular-nums text-[var(--brand-black)]">{formatPrice(subPrice)}</p>
                        <p className="font-mono text-xs tabular-nums text-black">{formatPrice(subPerShot)}/shot</p>
                      </div>
                    </div>
                    <p className="text-sm text-black/80 mt-3 ml-8">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 mr-1.5">Ships ·</span>
                      {getDeliveryDescription(protocolId, selectedTier)}
                    </p>
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

                <button
                  onClick={() => onPurchaseTypeChange("one-time")}
                  className={`w-full text-left p-4 transition-colors cursor-pointer bg-white ${purchaseType === "one-time" ? "border-2 border-[#1B2757]" : "border border-black/10"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center ${purchaseType === "one-time" ? "border-[var(--brand-accent)] bg-[var(--brand-accent)]" : "border-black/30"}`}>
                        {purchaseType === "one-time" && (
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M2.5 8.5L6.5 12L13.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        )}
                      </span>
                      <span className="font-bold text-[var(--brand-black)]">Buy Once</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold tabular-nums text-[var(--brand-black)]">{formatPrice(otpPrice)}</p>
                      <p className="font-mono text-xs tabular-nums text-black">{formatPrice(otpPerShot)}/shot</p>
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* CTA — FunnelCTA replica (handler-based, clinical) */}
          <button
            type="button"
            onClick={onAddToCart}
            className="w-full inline-flex flex-row items-center gap-4 py-3.5 pl-5 pr-8 text-white bg-[#1B2757] transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]"
          >
            <span className="relative w-7 h-7 shrink-0" aria-hidden>
              <Image
                src="/logos/ConkaO.png"
                alt=""
                fill
                sizes="28px"
                className="object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </span>
            <span className="flex flex-col items-start flex-1 min-w-0 text-left">
              <span className="font-mono font-bold text-sm uppercase tracking-[0.12em] flex items-center gap-0.5">
                <span>Add to Cart</span>
                <span
                  className="inline-block ml-0.5"
                  style={{ animation: "lab-blink 1s step-end infinite" }}
                  aria-hidden
                >
                  _
                </span>
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/70 mt-1 leading-none tabular-nums">
                {formatPrice(currentPrice)}
              </span>
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="shrink-0"
              aria-hidden
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </button>

          {/* Trust badges */}
          <LandingTrustBadges />
        </div>
      </div>
    </div>
  );
}
