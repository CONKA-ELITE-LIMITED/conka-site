"use client";

import { useState } from "react";
import { FormulaId, formulaContent, FORMULA_COLORS } from "@/app/lib/productData";

type TabType = "info" | "benefits" | "ingredients" | "taste";

interface ProductTabsProps {
  formulaId: FormulaId;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  {
    id: "info",
    label: "Info",
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    id: "benefits",
    label: "Benefits",
    icon: (
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    id: "ingredients",
    label: "Ingredients",
    icon: (
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
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "taste",
    label: "Taste",
    icon: (
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
        <path d="M12 2a10 10 0 1 0 10 10A4 4 0 0 1 12 2Z" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

export default function ProductTabs({ formulaId }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const formula = formulaContent[formulaId];
  const accentColor = FORMULA_COLORS[formulaId];

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        // Different icons for each key point
        const infoIcons = [
          // No caffeine - sleep icon
          <svg
            key="sleep"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>,
          // Adaptogen - shield/defense icon
          <svg
            key="shield"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>,
          // Sustained energy - battery/energy icon
          <svg
            key="energy"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
            <line x1="6" y1="7" x2="6" y2="5" />
            <line x1="10" y1="7" x2="10" y2="5" />
            <line x1="14" y1="7" x2="14" y2="5" />
            <line x1="18" y1="7" x2="18" y2="5" />
            <line x1="6" y1="11" x2="18" y2="11" />
          </svg>,
          // Motivation - arrow up icon
          <svg
            key="motivation"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>,
        ];

        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3">{formula.headline}</h3>
              <p className="font-mono text-xl opacity-80">{formula.subheadline}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formula.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`${accentColor.text} flex-shrink-0 mt-0.5`}>
                    {infoIcons[idx] || (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    )}
                  </div>
                  <span className="font-primary text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
            {/* 100-day guarantee - centered below */}
            <div className="flex justify-center pt-4">
              <span className="font-primary text-sm leading-relaxed text-center max-w-2xl">
                <span className="font-bold">100-day guarantee</span>: No results? We'll give you your money back.
              </span>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Key Benefits</h3>
            <div className="space-y-4">
              {formula.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className={`${accentColor.text} text-2xl font-bold font-mono flex-shrink-0`}>
                    {benefit.stat}
                  </div>
                  <div>
                    <p className="font-bold">{benefit.title}</p>
                    <p className="font-mono text-xs opacity-70 mt-1">
                      {benefit.annotation}
                    </p>
                    <p className="text-sm opacity-80 mt-1">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "ingredients":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Formula Breakdown</h3>
            <div className="space-y-2">
              {formula.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-current border-opacity-10 last:border-0"
                >
                  <div>
                    <span className="font-medium">{ing.name}</span>
                    {ing.part && (
                      <span className="font-mono text-sm opacity-70 ml-2">
                        – {ing.part}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-medium">{ing.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "taste":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Taste Profile</h3>
            <div className="flex items-center justify-between p-4 bg-current/5 rounded-lg">
              <p className="font-mono text-sm opacity-70">Tastes Like:</p>
              <p className="font-mono text-2xl">{formula.taste}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="font-mono text-xs font-medium">Antioxidant Heavy</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <p className="font-mono text-xs font-medium">Zero Calories</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                    <line x1="2" y1="8" x2="22" y2="8" />
                  </svg>
                </div>
                <p className="font-mono text-xs font-medium">No Caffeine</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 mb-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                </div>
                <p className="font-mono text-xs font-medium">Vegan Friendly</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex justify-between mb-6 border-b-2 border-current border-opacity-10 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full transition-all font-mono text-xs ${
                isActive
                  ? "bg-[var(--foreground)] text-[var(--background)]"
                  : "hover:bg-current/10"
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {tab.icon}
              </span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">{renderContent()}</div>
    </div>
  );
}

