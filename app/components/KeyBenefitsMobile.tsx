"use client";

import { useState } from "react";
import { Benefit } from "./KeyBenefits";

interface KeyBenefitsMobileProps {
  benefits: Benefit[];
}

interface AccordionRowProps {
  benefit: Benefit;
  isOpen: boolean;
  isLast: boolean;
  onTap: () => void;
}

function AccordionRow({ benefit, isOpen, isLast, onTap }: AccordionRowProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTap();
    }
  };

  return (
    <div>
      {/* Collapsed header (always visible, tappable) */}
      <button
        onClick={onTap}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={`benefit-panel-${benefit.id}`}
        className={`w-full flex flex-col px-5 transition-colors duration-200 ${
          isOpen ? "py-5" : "py-4"
        }`}
        style={{
          background: isOpen ? "black" : "transparent",
          color: isOpen ? "#ffffff" : undefined,
        }}
      >
        {/* Row 1: icon + title + stat inline */}
        <div className="flex items-center gap-2 w-full">
          {benefit.icon && (
            <span
              className={`w-5 h-5 shrink-0 flex items-center justify-center transition-colors duration-200 ${
                isOpen
                  ? "opacity-100 text-white"
                  : "opacity-30 text-black"
              }`}
            >
              {benefit.icon}
            </span>
          )}
          <span
            className={`flex-1 brand-body text-left transition-colors duration-200 ${
              isOpen
                ? "text-white font-semibold"
                : "text-black font-medium"
            }`}
          >
            {benefit.title}
          </span>
          <span
            className={`text-xl font-extrabold shrink-0 transition-colors duration-200 ${
              isOpen ? "text-white" : "text-black"
            }`}
          >
            {benefit.stat}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`shrink-0 transition-all duration-300 ${
              isOpen
                ? "rotate-180 text-white opacity-100"
                : "rotate-0 text-black opacity-30"
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Row 2: struggle text — full width */}
        {benefit.struggle && (
          <p
            className={`w-full text-left brand-caption mt-1 font-normal transition-colors duration-200 ${
              isOpen
                ? "text-white opacity-60"
                : "opacity-50 text-black"
            }`}
          >
            {benefit.struggle}
          </p>
        )}
      </button>

      {/* Expanded panel */}
      {isOpen && (
        <div
          id={`benefit-panel-${benefit.id}`}
          role="region"
          aria-live="polite"
          key={benefit.id}
          className="px-5 pb-6"
          style={{
            background: "black",
            color: "#ffffff",
            animation: "fadeSlideDown 0.3s ease forwards",
          }}
        >
          {/* 1. Outcome headline — first thing read */}
          <h3
            className="text-lg font-bold leading-tight mb-3"
            style={{ color: "white" }}
          >
            {benefit.outcome}
          </h3>

          {/* 2. Hero stat — large, immediate */}
          <div
            className="font-bold font-mono mb-4"
            style={{
              fontSize: "clamp(2.8rem, 14vw, 3.8rem)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "white",
            }}
          >
            {benefit.stat}
          </div>

          {/* 3. One-line mechanism — muted, capped via line clamp */}
          <p
            className="brand-caption leading-relaxed mb-4 line-clamp-3"
            style={{ color: "white", opacity: 0.65 }}
          >
            {benefit.description}
          </p>

          {/* 4. Ingredient pill */}
          {benefit.ingredientAsset && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span
                className="brand-caption font-medium"
                style={{ color: "white", opacity: 0.9 }}
              >
                {benefit.ingredientAsset.name}
              </span>
              <span
                className="brand-caption"
                style={{ color: "white", opacity: 0.4 }}
              >
                ·
              </span>
              <span
                className="brand-caption"
                style={{ color: "white", opacity: 0.5 }}
              >
                {benefit.ingredientAsset.dosage}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Divider between rows (omit on last row) */}
      {!isLast && (
        <div
          style={{
            height: "1px",
            background: "var(--brand-divider-subtle)",
          }}
        />
      )}
    </div>
  );
}

export default function KeyBenefitsMobile({
  benefits,
}: KeyBenefitsMobileProps) {
  const [openBenefit, setOpenBenefit] = useState<number | null>(null);

  const handleTap = (idx: number) => {
    setOpenBenefit(idx === openBenefit ? null : idx);
  };

  return (
    <div>
      {/* Heading block */}
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          Key Benefits · Clinically Backed
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          What you&apos;ll actually feel.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          N={benefits.length} · Tap to view evidence
        </p>
      </div>

      {/* Accordion list */}
      <div
        className="overflow-hidden -mx-5 md:-mx-[5vw]"
        style={{
          border: "1px solid var(--brand-divider-subtle)",
          background: "white",
        }}
      >
        {benefits.map((benefit, index) => (
          <AccordionRow
            key={benefit.id}
            benefit={benefit}
            isOpen={openBenefit === index}
            isLast={index === benefits.length - 1}
            onTap={() => handleTap(index)}
          />
        ))}
      </div>
    </div>
  );
}
