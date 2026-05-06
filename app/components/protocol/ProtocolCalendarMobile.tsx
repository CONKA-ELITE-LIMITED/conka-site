"use client";

import {
  ProtocolId,
  ProtocolTier,
  protocolContent,
  generateProtocolCalendarDays,
  FORMULA_COLORS,
  getProtocolAccent,
} from "@/app/lib/productData";

const tierLabels: Record<ProtocolTier, string> = {
  starter: "Starter",
  pro: "Pro",
  max: "Max",
};

const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

interface ProtocolCalendarMobileProps {
  protocolId: ProtocolId;
  selectedTier: ProtocolTier;
  onTierSelect: (tier: ProtocolTier) => void;
  availableTiers: ProtocolTier[];
}

export default function ProtocolCalendarMobile({
  protocolId,
  selectedTier,
  onTierSelect,
  availableTiers,
}: ProtocolCalendarMobileProps) {
  const protocol = protocolContent[protocolId];
  const tierConfig = protocol.tiers[selectedTier];
  const calendarDays = generateProtocolCalendarDays(protocolId, selectedTier);
  const protocolAccent = getProtocolAccent(protocolId);

  if (!tierConfig) return null;

  // Calculate totals for the month (4 weeks)
  const conkaFlowTotal = tierConfig.conkaFlowCount * 4;
  const conkaClarityTotal = tierConfig.conkaClarityCount * 4;

  // Render single week (first week only)
  const weekDays = calendarDays.slice(0, 7);

  return (
    <>
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="brand-h2 text-2xl font-bold mb-2">
          How to follow your protocol
        </h2>
        <p className="brand-caption italic text-base opacity-70">
          visualize your journey
        </p>
      </div>

      {/* Inline tier selector */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {availableTiers.map((tier) => {
          const isSelected = selectedTier === tier;
          const conf = protocol.tiers[tier];
          return (
            <button
              key={tier}
              onClick={() => onTierSelect(tier)}
              className={`px-4 py-2 font-mono text-sm font-semibold transition-all ${
                isSelected
                  ? "text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                  : "bg-white border border-black/10 hover:border-black/20 text-current"
              }`}
              style={
                isSelected
                  ? { backgroundColor: protocolAccent, borderRadius: "var(--brand-radius-container)" }
                  : { borderRadius: "var(--brand-radius-container)" }
              }
            >
                {tierLabels[tier]}
                {conf && (
                  <span className="ml-1.5 opacity-80 text-xs font-normal">
                    {conf.shotsPerWeek}/week
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar - white strip */}
        <div className="w-full bg-white rounded-lg p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Weekly View</h3>
            <span className="font-mono text-sm opacity-70">
              {tierConfig.conkaFlowCount}x F01 + {tierConfig.conkaClarityCount}x F02
            </span>
          </div>

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
            {protocolId === "4" && (
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    background: `linear-gradient(135deg, ${FORMULA_COLORS["01"].hex} 50%, ${FORMULA_COLORS["02"].hex} 50%)`,
                  }}
                ></div>
                <span className="font-mono text-xs">Both Daily</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm border-2 border-current opacity-30"></div>
              <span className="font-mono text-xs">Rest Day</span>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center font-mono text-xs opacity-70 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Single Week */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, dayIdx) => {
              if (day.formula === "both") {
                return (
                  <div
                    key={dayIdx}
                    className="aspect-square flex items-center justify-center font-mono text-sm rounded-md transition-all text-white"
                    style={{
                      background: `linear-gradient(135deg, ${FORMULA_COLORS["01"].hex} 50%, ${FORMULA_COLORS["02"].hex} 50%)`,
                    }}
                  >
                    {day.day}
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
                  className={`aspect-square flex items-center justify-center font-mono text-sm rounded-md transition-all ${bgColor} ${textColor}`}
                >
                  {day.day}
                </div>
              );
            })}
          </div>

          {/* Clarifying message */}
          <p className="brand-caption italic text-sm text-center mt-4 opacity-70">
            Repeat this cycle weekly for the month
          </p>
        </div>

        {/* Protocol Info */}
        <div className="mt-6 space-y-4">
          <div className="w-full">
            <h3 className="text-lg font-bold mb-3">
              {tierConfig.name} Plan Details
            </h3>
            <p className="opacity-80 mb-4 text-sm">{tierConfig.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-current border-opacity-10">
                <span className="font-mono text-sm">Shots per Week</span>
                <span className="font-bold">{tierConfig.shotsPerWeek}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-current border-opacity-10">
                <span className="font-mono text-sm">CONKA Flow</span>
                <span className="font-bold">
                  {tierConfig.conkaFlowCount}x weekly
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-mono text-sm">CONKA Clear</span>
                <span className="font-bold">
                  {tierConfig.conkaClarityCount}x weekly
                </span>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
