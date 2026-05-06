"use client";

import { ProtocolKey, protocolMatchInfo } from "@/app/lib/quizData";
import {
  ProtocolId,
  ProtocolTier,
  PurchaseType,
  protocolContent,
  protocolPricing,
  formatPrice,
  getBillingLabel,
  generateProtocolCalendarDays,
  FORMULA_COLORS,
} from "@/app/lib/productData";

interface QuizRecommendedSectionProps {
  protocolKey: ProtocolKey;
  selectedTier: ProtocolTier;
  onTierSelect: (tier: ProtocolTier) => void;
  purchaseType: PurchaseType;
  onPurchaseTypeChange: (type: PurchaseType) => void;
  onAddToCart: () => void;
}

const tierLabels: Record<ProtocolTier, string> = {
  starter: "Starter",
  pro: "Pro",
  max: "Max",
};

const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

export default function QuizRecommendedSection({
  protocolKey,
  selectedTier,
  onTierSelect,
  purchaseType,
  onPurchaseTypeChange,
  onAddToCart,
}: QuizRecommendedSectionProps) {
  const matchInfo = protocolMatchInfo[protocolKey];
  const protocolId = matchInfo.protocolNumber as ProtocolId;
  const protocol = protocolContent[protocolId];
  const tierConfig = protocol.tiers[selectedTier];
  const availableTiers = protocol.availableTiers;
  const calendarDays = generateProtocolCalendarDays(protocolId, selectedTier);

  // Get pricing
  const pricingType = protocolId === "4" ? "ultimate" : "standard";
  const tierPricing = protocolPricing[pricingType][purchaseType];
  const pricing = tierPricing[selectedTier as keyof typeof tierPricing];

  const billingText =
    purchaseType === "subscription" && pricing && "billing" in pricing
      ? getBillingLabel(pricing.billing)
      : "one-time purchase";

  // Render 4-week calendar
  const weeks = [];
  for (let week = 0; week < 4; week++) {
    const weekDays = calendarDays.slice(week * 7, (week + 1) * 7);
    weeks.push(weekDays);
  }

  const getProtocolIcon = (iconType: string, size: number = 32) => {
    switch (iconType) {
      case "shield":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "bolt":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case "balance":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="3" x2="12" y2="21" />
            <path d="M3 12h18" />
            <circle cx="6" cy="8" r="3" />
            <circle cx="18" cy="8" r="3" />
            <circle cx="6" cy="16" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        );
      case "crown":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="px-4 md:px-8 py-12 md:py-16 bg-amber-500/5 border-t-2 border-current/10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500 text-white rounded-full mb-4">
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
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="font-mono text-xs font-bold">
              YOUR TOP MATCH
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            {matchInfo.name}
          </h2>
          <p className="font-commentary text-xl">{matchInfo.subtitle}</p>
        </div>

        {/* Protocol Description */}
        <div className="neo-box p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              {getProtocolIcon(matchInfo.icon)}
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Why this protocol?</h3>
              <p className="text-base opacity-80 leading-relaxed">
                {matchInfo.bestForSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="neo-box p-6 md:p-8 mb-8">
          <h3 className="font-bold text-lg mb-4">Key Benefits</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {matchInfo.keyBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="font-mono text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Calendar */}
        <div className="neo-box overflow-hidden mb-8">
          {/* Tier & Purchase Selection */}
          <div className="p-4 md:p-6 border-b-2 border-current/10">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              {/* Tier Selection */}
              <div className="flex gap-1">
                {(["starter", "pro", "max"] as ProtocolTier[]).map((tier) => {
                  const isAvailable = availableTiers.includes(tier);
                  const isSelected = selectedTier === tier;
                  return (
                    <button
                      key={tier}
                      onClick={() => isAvailable && onTierSelect(tier)}
                      disabled={!isAvailable}
                      className={`px-3 py-1.5 rounded-full font-mono text-xs transition-all ${
                        isSelected
                          ? "bg-amber-500 text-white"
                          : isAvailable
                            ? "border-2 border-black/10 hover:border-black/30"
                            : "border-2 border-black/5 text-black/30 cursor-not-allowed"
                      }`}
                    >
                      {tierLabels[tier]}
                    </button>
                  );
                })}
              </div>

              {/* Purchase Toggle */}
              <div className="flex gap-1">
                <button
                  onClick={() => onPurchaseTypeChange("subscription")}
                  className={`px-2 py-1 rounded font-mono text-xs transition-all ${
                    purchaseType === "subscription"
                      ? "bg-black text-white"
                      : "border border-black/10 hover:border-black/30"
                  }`}
                >
                  Subscribe
                </button>
                <button
                  onClick={() => onPurchaseTypeChange("one-time")}
                  className={`px-2 py-1 rounded font-mono text-xs transition-all ${
                    purchaseType === "one-time"
                      ? "bg-black text-white"
                      : "border border-black/10 hover:border-black/30"
                  }`}
                >
                  One-time
                </button>
              </div>
            </div>

            {/* Tier Description */}
            {tierConfig && (
              <p className="font-commentary text-sm opacity-70">
                {tierConfig.description}
              </p>
            )}
          </div>

          {/* Calendar */}
          <div className="p-4 md:p-6">
            <h3 className="font-bold text-base mb-4">Your Weekly Schedule</h3>

            {/* Legend */}
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-sm ${FORMULA_COLORS["01"].bg}`}
                ></div>
                <span className="font-mono text-xs">CONKA Flow</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-sm ${FORMULA_COLORS["02"].bg}`}
                ></div>
                <span className="font-mono text-xs">CONKA Clear</span>
              </div>
              {protocolId === "4" ? (
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: `linear-gradient(135deg, #f59e0b 50%, #AAB9BC 50%)`,
                    }}
                  ></div>
                  <span className="font-mono text-xs">Both Daily</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
                  <span className="font-mono text-xs">Rest</span>
                </div>
              )}
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day, idx) => (
                <div
                  key={idx}
                  className="text-center font-mono text-xs opacity-50"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Week 1 Only (simplified view) */}
            <div className="grid grid-cols-7 gap-1">
              {weeks[0]?.map((day, dayIdx) => {
                const isUltimate = protocolId === "4";

                if (isUltimate) {
                  return (
                    <div
                      key={dayIdx}
                      className="aspect-square rounded overflow-hidden relative flex items-center justify-center text-xs font-mono text-white"
                      style={{
                        background: `linear-gradient(135deg, #f59e0b 50%, #AAB9BC 50%)`,
                      }}
                    >
                      <span className="relative z-10 drop-shadow-sm">
                        {day.day}
                      </span>
                    </div>
                  );
                }

                const bgColor =
                  day.formula === "01"
                    ? FORMULA_COLORS["01"].bg
                    : day.formula === "02"
                      ? FORMULA_COLORS["02"].bg
                      : "bg-gray-100";
                const textColor =
                  day.formula === "rest" ? "text-black/30" : "text-white";
                return (
                  <div
                    key={dayIdx}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-mono ${bgColor} ${textColor}`}
                  >
                    {day.day}
                  </div>
                );
              })}
            </div>

            {/* Week label */}
            <p className="font-mono text-xs text-center mt-2 opacity-40">
              Week 1 Preview
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="p-4 md:p-6 bg-amber-500/10 border-t-2 border-amber-500/20">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <p className="text-2xl md:text-3xl font-bold">
                  {pricing ? formatPrice(pricing.price) : "—"}
                </p>
                <p className="font-mono text-xs opacity-60">
                  {billingText}
                </p>
              </div>
              {tierConfig && (
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {tierConfig.shotsPerWeek} shots/week
                  </p>
                  <p className="font-mono text-xs opacity-60">
                    {tierConfig.conkaFlowCount}x Flow +{" "}
                    {tierConfig.conkaClarityCount}x Clear
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onAddToCart}
                className="flex-1 neo-button px-6 py-3 font-bold text-base flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
                Add to Cart
              </button>
              <a
                href={`/protocol/${protocolId}`}
                className="flex-1 neo-button-outline px-6 py-3 font-bold text-base flex items-center justify-center gap-2"
              >
                Learn More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>

            <p className="font-mono text-xs text-center mt-3 opacity-50 flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              100-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
