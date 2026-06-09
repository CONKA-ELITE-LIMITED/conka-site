"use client";

import { useState, type ReactNode } from "react";

export interface ExplainerStep {
  label: string;
  detail: string;
}

export interface ExplainerData {
  eyebrow: string;
  heading: string;
  systemTag: string;
  icon: ReactNode;
  definition: string;
  analogy: string;
  mechanism: ExplainerStep[];
  doseNote: string;
  tags: string[];
}

export default function ScienceExplainer({ data }: { data: ExplainerData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-3xl">
      {/* Header — eyebrow + heading + plain definition (always visible) */}
      <div className="mb-6">
        <p className="brand-eyebrow mb-3">{data.eyebrow}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          {data.heading}
        </h2>
        <p className="text-base md:text-lg text-black leading-relaxed">
          {data.definition}
        </p>
      </div>

      {/* Analogy — scannable, always visible */}
      <div className="border-l-2 border-[#1B2757] pl-5 lg:pl-6 mb-6">
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          {data.analogy}
        </p>
      </div>

      {/* Layered disclosure card — mechanism + dose behind a toggle */}
      <div className="bg-white border border-black/12">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
            Mechanism
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
            {data.systemTag}
          </span>
        </div>

        {/* Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          className="w-full text-left hover:bg-black/[0.02] active:bg-black/[0.03] transition-colors"
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 lg:p-5 min-h-[44px]">
            <div
              className="w-11 h-11 flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: "#1B2757" }}
            >
              {data.icon}
            </div>
            <span className="text-sm md:text-base font-semibold text-black">
              {isExpanded ? "How it works in the body" : "See how it works in the body"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className={`transition-transform flex-shrink-0 text-black/45 ${
                isExpanded ? "rotate-180" : ""
              }`}
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {/* Expanded panel */}
        {isExpanded && (
          <div className="border-t border-black/8 p-4 lg:p-6 space-y-6">
            {/* Mechanism steps — hairline numbered rows */}
            <div className="border border-black/12">
              {data.mechanism.map((step, idx) => (
                <div
                  key={step.label}
                  className={`p-4 ${
                    idx < data.mechanism.length - 1
                      ? "border-b border-black/8"
                      : ""
                  }`}
                >
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-[10px] text-black/35 tabular-nums flex-shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                      {step.label}
                    </span>
                  </div>
                  <p className="text-sm text-black/75 leading-relaxed pl-7">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Why dose and quality matter */}
            <div className="bg-[#1B2757]/[0.04] border border-[#1B2757]/15 p-4 lg:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B2757] mb-2">
                Why dose and quality matter
              </p>
              <p className="text-sm text-black/75 leading-relaxed">
                {data.doseNote}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tag strip — scan markers, always visible */}
      <div className="flex flex-wrap gap-1.5 mt-6">
        {data.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-3 py-1 border border-black/12 bg-white text-black/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
