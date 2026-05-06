"use client";

import { useState } from "react";
import { QuizResult, protocolMatchInfo, ProtocolKey } from "@/app/lib/quizData";
import QuizScoreBreakdown from "./QuizScoreBreakdown";

interface QuizResultsOverviewProps {
  results: QuizResult[];
  onProtocolSelect: (protocolId: ProtocolKey) => void;
  selectedProtocol: ProtocolKey | null;
}

export default function QuizResultsOverview({
  results,
  onProtocolSelect,
  selectedProtocol,
}: QuizResultsOverviewProps) {
  const [expandedProtocol, setExpandedProtocol] = useState<ProtocolKey | null>(null);

  const getProtocolIcon = (iconType: string) => {
    switch (iconType) {
      case "shield":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case "bolt":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        );
      case "balance":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="px-4 md:px-8 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-wide opacity-60 mb-2">
            Quiz Complete
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Your Results</h1>
          <p className="font-mono text-lg opacity-70">
            Here&apos;s how each protocol matches your needs
          </p>
        </div>

        {/* Results Cards */}
        <div className="space-y-4">
          {results.map((result, index) => {
            const matchInfo = protocolMatchInfo[result.protocolId];
            const isRecommended = index === 0;
            const isExpanded = expandedProtocol === result.protocolId;
            const isSelected = selectedProtocol === result.protocolId;

            return (
              <div
                key={result.protocolId}
                className={`neo-box overflow-hidden transition-all ${
                  isRecommended ? "ring-2 ring-amber-500 ring-offset-2" : ""
                } ${isSelected ? "bg-current/5" : ""}`}
              >
                {/* Card Header */}
                <div
                  className="p-4 md:p-6 cursor-pointer"
                  onClick={() => onProtocolSelect(result.protocolId)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isRecommended
                          ? "bg-amber-500 text-white"
                          : "border-2 border-current"
                      }`}
                    >
                      {getProtocolIcon(matchInfo.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-lg">{matchInfo.name}</h3>
                        {isRecommended && (
                          <span className="px-2 py-0.5 bg-amber-500 text-white font-mono text-xs font-bold rounded-full">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm opacity-70 mb-3">
                        {matchInfo.subtitle}
                      </p>

                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-current/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isRecommended ? "bg-amber-500" : "bg-current/40"
                            }`}
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-lg min-w-[3rem] text-right">
                          {result.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown Toggle */}
                <div className="border-t border-current/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedProtocol(isExpanded ? null : result.protocolId);
                    }}
                    className="w-full px-4 md:px-6 py-3 flex items-center justify-center gap-2 font-mono text-sm hover:bg-current/5 transition-colors"
                  >
                    <span>{isExpanded ? "Hide" : "View"} Score Breakdown</span>
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
                      className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <QuizScoreBreakdown
                      result={result}
                      protocolName={matchInfo.name}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scroll Prompt */}
        <div className="text-center mt-8 animate-bounce-slow">
          <p className="font-mono text-sm opacity-60 mb-2">
            scroll down for your personalized recommendation
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto opacity-40"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}



