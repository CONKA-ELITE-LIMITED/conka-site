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

interface ProtocolCalendarProps {
  protocolId: ProtocolId;
  selectedTier: ProtocolTier;
  onTierSelect: (tier: ProtocolTier) => void;
  availableTiers: ProtocolTier[];
}

export default function ProtocolCalendar({
  protocolId,
  selectedTier,
  onTierSelect,
  availableTiers,
}: ProtocolCalendarProps) {
  const protocol = protocolContent[protocolId];
  const tierConfig = protocol.tiers[selectedTier];
  const calendarDays = generateProtocolCalendarDays(protocolId, selectedTier);
  const protocolAccent = getProtocolAccent(protocolId);

  if (!tierConfig) return null;

  // Calculate totals for the month (4 weeks)
  const conkaFlowTotal = tierConfig.conkaFlowCount * 4;
  const conkaClarityTotal = tierConfig.conkaClarityCount * 4;

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="brand-h2 text-3xl md:text-4xl font-bold mb-2">
          How to follow your protocol
        </h2>
        <p className="brand-caption italic text-xl">visualize your journey</p>
      </div>

      {/* Inline tier selector */}
      <div className="flex justify-center gap-2 mb-8 flex-wrap">
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar */}
          <div className="lg:w-2/3">
            <div className="brand-card-bordered p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">4-Week View</h3>
                <span className="font-mono text-sm opacity-70">
                  {conkaFlowTotal}x F01 + {conkaClarityTotal}x F02
                </span>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-mono text-xs opacity-70 py-1"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, idx) => {
                  if (day.formula === "both") {
                    return (
                      <div
                        key={idx}
                        className="aspect-square flex items-center justify-center font-mono text-sm rounded-md transition-all text-white"
                        style={{
                          background: `linear-gradient(135deg, ${FORMULA_COLORS["01"].hex} 50%, ${FORMULA_COLORS["02"].hex} 50%)`,
                        }}
                      >
                        {day.day}
                      </div>
                    );
                  }
                  
                  return (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center font-mono text-sm rounded-md transition-all ${
                        day.formula === "01"
                          ? `${FORMULA_COLORS["01"].bg} text-white`
                          : day.formula === "02"
                            ? `${FORMULA_COLORS["02"].bg} text-white`
                            : "border-2 border-current opacity-20"
                      }`}
                    >
                      {day.day}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-6 mt-6 pt-4 border-t border-current border-opacity-20 flex-wrap justify-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-sm ${FORMULA_COLORS["01"].bg}`}
                  ></div>
                  <span className="font-mono text-xs">
                    CONKA Flow - Energy
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-sm ${FORMULA_COLORS["02"].bg}`}
                  ></div>
                  <span className="font-mono text-xs">
                    CONKA Clear - Clarity
                  </span>
                </div>
                {protocolId === "4" && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm"
                      style={{
                        background: `linear-gradient(135deg, ${FORMULA_COLORS["01"].hex} 50%, ${FORMULA_COLORS["02"].hex} 50%)`,
                      }}
                    ></div>
                    <span className="font-mono text-xs">Both Daily</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm border-2 border-current opacity-30"></div>
                  <span className="font-mono text-xs">Rest Day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Protocol Info Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Tier Info */}
            <div className="brand-card-bordered p-6">
              <h3 className="text-lg font-bold mb-4">
                {tierConfig.name} Plan Details
              </h3>
              <p className="opacity-80 mb-4">{tierConfig.description}</p>

              <div className="space-y-3">
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

            {/* Quick Tips */}
            <div className="brand-card-bordered p-6">
              <h3 className="text-lg font-bold mb-4">Pro Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full ${FORMULA_COLORS["01"].bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <span className="text-white text-xs font-bold">01</span>
                  </div>
                  <p className="font-mono text-sm">
                    Take CONKA Flow in the morning for all-day energy
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full ${FORMULA_COLORS["02"].bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <span className="text-white text-xs font-bold">02</span>
                  </div>
                  <p className="font-mono text-sm">
                    Take CONKA Clear before demanding tasks or in the afternoon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
