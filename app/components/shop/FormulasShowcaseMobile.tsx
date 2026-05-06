"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formulas, FormulaShowcaseData } from "./formulasShowcaseData";
import type { FormulaId } from "@/app/lib/productData";

// Combined Microcopy
const microcopy: Record<FormulaId, string> = {
  "01": "Supports deep focus without jitters ",
  "02": "Promotes alertness and sustained mental clarity ",
};

// Mobile Formula Card Component
function FormulaCard({ formula }: { formula: FormulaShowcaseData }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col border-2 border-black/10 rounded-[var(--premium-radius-base)] overflow-hidden">
      {/* Hero Image — clickable asset */}
      <Link
        href={formula.href}
        className="relative w-full aspect-[4/3.5] overflow-hidden block cursor-pointer"
      >
        <div
          className="absolute inset-0"
          style={{ top: "-10%", bottom: "-20%" }}
        >
          <Image
            src={formula.image.src}
            alt={formula.image.alt}
            fill
            className="object-cover"
            style={{
              objectPosition: `${formula.image.focalX}% ${formula.image.focalY}%`,
              transform: "scale(1.30)",
            }}
            sizes="100vw"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 bg-white/50">
        {/* Subtitle & Name */}
        <div className="pb-2 border-b border-black/5">
          <h3 className="text-2xl font-bold font-primary opacity-100">
            {formula.subtitle}
          </h3>
          <p className="font-primary text-lg opacity-80 mt-1">{formula.name}</p>
        </div>

        {/* Microcopy */}
        <p className="font-mono text-sm opacity-70">
          {microcopy[formula.id]}
        </p>

        {/* Top 2 Stats */}
        <div className="flex gap-6 pt-2 border-t border-black/5">
          {formula.stats.slice(0, 2).map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span
                className="text-xl font-bold"
                style={{ color: formula.accentColor }}
              >
                {stat.value}
              </span>
              <span className="font-mono text-xs opacity-70">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={formula.href}
          className="neo-button w-full py-3 font-bold text-base rounded-full flex items-center justify-center gap-2 mb-3"
        >
          Shop {formula.name}
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>

        {/* Key Points (collapsible) */}
        <button
          className="text-sm font-mono opacity-70 mb-2 text-left"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide details ▲" : "Show key benefits ▼"}
        </button>
        {expanded && (
          <ul className="space-y-2">
            {formula.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
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
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: formula.accentColor }}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export interface FormulasShowcaseMobileProps {
  excludeFormulaId?: FormulaId;
}

export default function FormulasShowcaseMobile({ excludeFormulaId }: FormulasShowcaseMobileProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const formulasToShow = excludeFormulaId
    ? formulas.filter((f) => f.id !== excludeFormulaId)
    : formulas;

  return (
    <section className="px-4 py-12 bg-white">
      <div className="w-full max-w-full mx-auto">
        {/* Section Header */}
        <div className="text-left mb-6">
          <h2 className="text-3xl font-bold mb-2">Individual Formulas</h2>
          <p className="font-mono text-base opacity-70">
            Start simple. Feel the difference.
          </p>
        </div>

        {/* 2-page carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 pb-4 scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
          onScroll={() => {
            const el = carouselRef.current;
            if (!el) return;
            const cardWidth = el.offsetWidth * 0.85 + 16;
            const index = Math.min(
              formulasToShow.length - 1,
              Math.max(0, Math.round(el.scrollLeft / cardWidth)),
            );
            setCarouselIndex(index);
          }}
        >
          {formulasToShow.map((formula) => (
            <div
              key={formula.id}
              className="flex-shrink-0 w-[85vw] max-w-[400px] snap-center"
            >
              <FormulaCard formula={formula} />
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-4">
          {formulasToShow.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full bg-current transition-opacity ${
                carouselIndex === idx ? "opacity-100" : "opacity-20"
              }`}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </section>
  );
}
