"use client";

import { useState } from "react";
import { ProtocolId, protocolContent } from "@/app/lib/productData";

type TabType = "info" | "calendar" | "benefits" | "faq";

interface ProtocolTabsProps {
  protocolId: ProtocolId;
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
    id: "calendar",
    label: "Schedule",
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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
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
    id: "faq",
    label: "FAQ",
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
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
];

export default function ProtocolTabs({ protocolId }: ProtocolTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const protocol = protocolContent[protocolId];

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3">{protocol.name}</h3>
              <p className="font-commentary text-xl opacity-80">{protocol.subtitle}</p>
            </div>
            <p className="font-primary text-sm leading-relaxed opacity-90">{protocol.description}</p>
            
            {/* Best For Tags */}
            <div className="flex flex-wrap gap-2">
              {protocol.bestFor.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 border border-current rounded-full font-mono text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 100-day guarantee */}
            <div className="flex justify-center pt-4">
              <span className="font-primary text-sm leading-relaxed text-center max-w-2xl">
                <span className="font-bold">100-day guarantee</span>: No results? We'll give you your money back.
              </span>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Dosage Schedule</h3>
            <p className="font-mono text-sm opacity-70">
              View the calendar visualization below to see when to take each formula.
            </p>
          </div>
        );

      case "benefits":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Key Benefits</h3>
            <div className="space-y-4">
              {protocol.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="text-[#AAB9BC] text-2xl font-bold font-mono flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-primary text-sm leading-relaxed">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
            <p className="font-mono text-sm opacity-70">
              See the FAQ section below for detailed answers.
            </p>
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


