"use client";

import { useState } from "react";
import { ProtocolId, protocolContent } from "@/app/lib/productData";

interface ProtocolStruggleMobileProps {
  protocolId: ProtocolId;
}

// Protocol-specific struggle options with solutions
const PROTOCOL_STRUGGLES = [
  {
    id: "performance",
    label: "Performance",
    icon: "bolt",
    title: "Maximize Your Output",
    stat: "+38%",
    statLabel: "mental endurance",
    description:
      "Combining both formulas creates a synergistic effect that sustains peak cognitive performance longer than either alone.",
    keyBenefits: ["Sustained focus", "Faster processing", "Better recall"],
  },
  {
    id: "stress",
    label: "Stress",
    icon: "heart-pulse",
    title: "Build Resilience",
    stat: "-24%",
    statLabel: "cortisol levels",
    description:
      "Adaptogens from CONKA Flow combined with cognitive enhancers from CONKA Clear create a balanced stress response system.",
    keyBenefits: ["Calmer under pressure", "Faster recovery", "Better sleep"],
  },
  {
    id: "energy",
    label: "Energy",
    icon: "battery-low",
    title: "Sustained Vitality",
    stat: "8+ hrs",
    statLabel: "sustained energy",
    description:
      "No crashes or jitters. The protocol provides steady, clean energy throughout your day without the afternoon slump.",
    keyBenefits: ["No crashes", "Steady alertness", "Natural boost"],
  },
  {
    id: "focus",
    label: "Focus",
    icon: "target",
    title: "Razor-Sharp Clarity",
    stat: "+47%",
    statLabel: "concentration",
    description:
      "Enhanced neurotransmitter production supports deep focus states and reduces mental fatigue during demanding tasks.",
    keyBenefits: ["Deep work ready", "Less distraction", "Clearer thinking"],
  },
  {
    id: "recovery",
    label: "Recovery",
    icon: "moon",
    title: "Optimize Rest",
    stat: "+31%",
    statLabel: "sleep quality",
    description:
      "Better cognitive recovery overnight means you wake up sharp and ready. The protocol supports your natural recovery cycles.",
    keyBenefits: ["Better sleep", "Morning clarity", "Reduced fog"],
  },
  {
    id: "consistency",
    label: "Consistency",
    icon: "brain",
    title: "Daily Excellence",
    stat: "2.3x",
    statLabel: "more consistent days",
    description:
      "The structured protocol removes guesswork and builds habits that compound over time for reliable cognitive support.",
    keyBenefits: ["Predictable results", "Easy routine", "Long-term gains"],
  },
];

// Icon component
const StruggleIcon = ({
  icon,
  className = "",
}: {
  icon: string;
  className?: string;
}) => {
  switch (icon) {
    case "bolt":
      return (
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
          className={className}
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "heart-pulse":
      return (
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
          className={className}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
        </svg>
      );
    case "battery-low":
      return (
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
          className={className}
        >
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
          <line x1="6" y1="11" x2="6" y2="13" />
        </svg>
      );
    case "target":
      return (
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
          className={className}
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "moon":
      return (
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
          className={className}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case "brain":
      return (
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
          className={className}
        >
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        </svg>
      );
    default:
      return null;
  }
};

export default function ProtocolStruggleMobile({
  protocolId,
}: ProtocolStruggleMobileProps) {
  const [selectedStruggle, setSelectedStruggle] = useState<string | null>(null);
  const protocol = protocolContent[protocolId];

  const currentSolution = selectedStruggle
    ? PROTOCOL_STRUGGLES.find((s) => s.id === selectedStruggle)
    : null;

  return (
    <section className="px-4 pt-6 pb-8">
      {/* Header */}
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-bold mb-1">What do you struggle with?</h2>
        <p className="font-commentary text-base opacity-70">
          see how {protocol.name} helps
        </p>
      </div>

      {/* Struggle Selector - 2x3 Grid */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {PROTOCOL_STRUGGLES.map((struggle) => {
          const isSelected = selectedStruggle === struggle.id;
          return (
            <button
              key={struggle.id}
              onClick={() =>
                setSelectedStruggle(isSelected ? null : struggle.id)
              }
              className={`py-3 px-2 rounded-lg flex flex-col items-center gap-1 transition-all ${
                isSelected
                  ? "bg-amber-500 text-white"
                  : "border-2 border-black/10 hover:border-black/30"
              }`}
            >
              <StruggleIcon icon={struggle.icon} />
              <span className="font-mono text-xs">{struggle.label}</span>
            </button>
          );
        })}
      </div>

      {/* Solution Card - Shows when struggle selected */}
      {currentSolution && (
        <div className="neo-box overflow-hidden animate-slide-up">
          {/* Solution Header */}
          <div className="p-4 bg-amber-500 text-white">
            <div className="flex items-center gap-2 mb-2">
              <StruggleIcon icon={currentSolution.icon} />
              <span className="font-mono text-xs uppercase opacity-80">
                {protocol.name} Solution
              </span>
            </div>
            <h3 className="text-lg font-bold">{currentSolution.title}</h3>
          </div>

          {/* Solution Content */}
          <div className="p-4 space-y-4">
            {/* Primary Stat */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-amber-500">
                {currentSolution.stat}
              </span>
              <span className="font-mono text-sm opacity-70">
                {currentSolution.statLabel}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm opacity-80">{currentSolution.description}</p>

            {/* Key Benefits */}
            <div>
              <p className="font-mono text-xs uppercase opacity-50 mb-2">
                Key Benefits
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSolution.keyBenefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-amber-500/10 rounded-full font-mono text-xs"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Protocol Benefits from data */}
            <div className="border-t border-current/10 pt-4">
              <p className="font-mono text-xs uppercase opacity-50 mb-2">
                {protocol.name} Benefits
              </p>
              <ul className="space-y-1">
                {protocol.benefits.slice(0, 3).map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-500 mt-0.5 flex-shrink-0"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="opacity-80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Helper text when nothing selected */}
      {!selectedStruggle && (
        <p className="text-center font-mono text-sm opacity-50 mt-4">
          Tap a challenge above to see how we can help
        </p>
      )}
    </section>
  );
}
