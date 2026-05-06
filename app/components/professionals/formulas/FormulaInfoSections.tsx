"use client";

import Link from "next/link";
import {
  FormulaId,
  formulaContent,
  FORMULA_COLORS,
} from "@/app/lib/productData";

// Info icons
const infoIcons = [
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

// Info Section Component
export function InfoSection({
  selectedFormula,
}: {
  selectedFormula: FormulaId;
}) {
  const flowFormula = formulaContent["01"];
  const clearFormula = formulaContent["02"];
  const flowColor = FORMULA_COLORS["01"];
  const clearColor = FORMULA_COLORS["02"];

  // Get the currently selected formula's data
  const currentFormula = selectedFormula === "01" ? flowFormula : clearFormula;
  const currentColor = selectedFormula === "01" ? flowColor : clearColor;

  return (
    <section className="px-6 md:px-16 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--foreground)] text-[var(--background)] py-4 md:py-5 px-6 md:px-8 mb-6 md:mb-8 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Info</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
          {/* Mobile: Show only selected formula */}
          <div className="md:hidden space-y-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">
                {currentFormula.headline}
              </h3>
              <p className="font-commentary text-lg opacity-80">
                {currentFormula.subheadline}
              </p>
            </div>
            <div className="space-y-3">
              {currentFormula.keyPoints.map((point, idx) => (
                <div key={idx} className="neo-box p-4 flex items-start gap-3">
                  <div className={`${currentColor.text} flex-shrink-0 mt-0.5`}>
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
                  <span className="font-primary text-sm leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Flow Column - Desktop only */}
          <div className="hidden md:block space-y-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">{flowFormula.headline}</h3>
              <p className="font-commentary text-lg opacity-80">
                {flowFormula.subheadline}
              </p>
            </div>
            <div className="space-y-3">
              {flowFormula.keyPoints.map((point, idx) => (
                <div key={idx} className="neo-box p-4 flex items-start gap-3">
                  <div className={`${flowColor.text} flex-shrink-0 mt-0.5`}>
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
                  <span className="font-primary text-sm leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-current/10 -translate-x-1/2" />

          {/* Clear Column - Desktop only */}
          <div className="hidden md:block space-y-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">
                {clearFormula.headline}
              </h3>
              <p className="font-commentary text-lg opacity-80">
                {clearFormula.subheadline}
              </p>
            </div>
            <div className="space-y-3">
              {clearFormula.keyPoints.map((point, idx) => (
                <div key={idx} className="neo-box p-4 flex items-start gap-3">
                  <div className={`${clearColor.text} flex-shrink-0 mt-0.5`}>
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
                  <span className="font-primary text-sm leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Benefits Section Component
export function BenefitsSection({
  selectedFormula,
}: {
  selectedFormula: FormulaId;
}) {
  const flowFormula = formulaContent["01"];
  const clearFormula = formulaContent["02"];
  const flowColor = FORMULA_COLORS["01"];
  const clearColor = FORMULA_COLORS["02"];

  // Get the currently selected formula's data
  const currentFormula = selectedFormula === "01" ? flowFormula : clearFormula;
  const currentColor = selectedFormula === "01" ? flowColor : clearColor;

  return (
    <section className="px-6 md:px-16 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--foreground)] text-[var(--background)] py-4 md:py-5 px-6 md:px-8 mb-6 md:mb-8 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center">
            Benefits
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
          {/* Mobile: Show only selected formula */}
          <div className="md:hidden space-y-4">
            {currentFormula.benefits.map((benefit, idx) => (
              <div key={idx} className="neo-box p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`${currentColor.text} text-3xl font-bold font-mono flex-shrink-0`}
                  >
                    {benefit.stat}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base mb-1">{benefit.title}</p>
                    <p className="font-mono text-xs opacity-70 mb-2">
                      {benefit.annotation}
                    </p>
                    <p className="text-sm opacity-80">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flow Column - Desktop only */}
          <div className="hidden md:block space-y-4">
            {flowFormula.benefits.map((benefit, idx) => (
              <div key={idx} className="neo-box p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`${flowColor.text} text-3xl font-bold font-mono flex-shrink-0`}
                  >
                    {benefit.stat}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base mb-1">{benefit.title}</p>
                    <p className="font-mono text-xs opacity-70 mb-2">
                      {benefit.annotation}
                    </p>
                    <p className="text-sm opacity-80">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-current/10 -translate-x-1/2" />

          {/* Clear Column - Desktop only */}
          <div className="hidden md:block space-y-4">
            {clearFormula.benefits.map((benefit, idx) => (
              <div key={idx} className="neo-box p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`${clearColor.text} text-3xl font-bold font-mono flex-shrink-0`}
                  >
                    {benefit.stat}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base mb-1">{benefit.title}</p>
                    <p className="font-mono text-xs opacity-70 mb-2">
                      {benefit.annotation}
                    </p>
                    <p className="text-sm opacity-80">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Ingredients Section Component
export function IngredientsSection({
  selectedFormula,
}: {
  selectedFormula: FormulaId;
}) {
  const flowFormula = formulaContent["01"];
  const clearFormula = formulaContent["02"];

  // Get the currently selected formula's data
  const currentFormula = selectedFormula === "01" ? flowFormula : clearFormula;

  return (
    <section className="px-6 md:px-16 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--foreground)] text-[var(--background)] py-4 md:py-5 px-6 md:px-8 mb-6 md:mb-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              Ingredients
            </h2>
            <Link
              href="/ingredients"
              className="text-sm md:text-base font-mono underline opacity-90 hover:opacity-100 transition-opacity"
            >
              View full ingredients breakdown →
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
          {/* Mobile: Show only selected formula */}
          <div className="md:hidden">
            <div className="neo-box p-4 md:p-5">
              <div className="space-y-2">
                {currentFormula.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center py-2 ${
                      idx !== currentFormula.ingredients.length - 1
                        ? "border-b border-current/10"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="font-medium text-sm">{ing.name}</span>
                      {ing.part && (
                        <span className="font-mono text-xs opacity-70 ml-2">
                          – {ing.part}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-medium text-sm">
                      {ing.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flow Column - Desktop only */}
          <div className="hidden md:block">
            <div className="neo-box p-4 md:p-5">
              <div className="space-y-2">
                {flowFormula.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center py-2 ${
                      idx !== flowFormula.ingredients.length - 1
                        ? "border-b border-current/10"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="font-medium text-sm">{ing.name}</span>
                      {ing.part && (
                        <span className="font-mono text-xs opacity-70 ml-2">
                          – {ing.part}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-medium text-sm">
                      {ing.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-current/10 -translate-x-1/2" />

          {/* Clear Column - Desktop only */}
          <div className="hidden md:block">
            <div className="neo-box p-4 md:p-5">
              <div className="space-y-2">
                {clearFormula.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className={`flex justify-between items-center py-2 ${
                      idx !== clearFormula.ingredients.length - 1
                        ? "border-b border-current/10"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="font-medium text-sm">{ing.name}</span>
                      {ing.part && (
                        <span className="font-mono text-xs opacity-70 ml-2">
                          – {ing.part}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-medium text-sm">
                      {ing.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Taste Section Component
export function TasteSection({
  selectedFormula,
}: {
  selectedFormula: FormulaId;
}) {
  const flowFormula = formulaContent["01"];
  const clearFormula = formulaContent["02"];

  // Get the currently selected formula's data
  const currentFormula = selectedFormula === "01" ? flowFormula : clearFormula;

  const characteristics = [
    {
      icon: (
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
      ),
      label: "Antioxidant Heavy",
    },
    {
      icon: (
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
      ),
      label: "Zero Calories",
    },
    {
      icon: (
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
      ),
      label: "No Caffeine",
    },
    {
      icon: (
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
      ),
      label: "Vegan Friendly",
    },
  ];

  return (
    <section className="px-6 md:px-16 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[var(--foreground)] text-[var(--background)] py-4 md:py-5 px-6 md:px-8 mb-6 md:mb-8 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-center">Taste</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative">
          {/* Mobile: Show only selected formula */}
          <div className="md:hidden space-y-4">
            <div className="neo-box p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-sm opacity-70">Tastes Like:</p>
                <p className="font-commentary text-xl md:text-2xl">
                  {currentFormula.taste}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {characteristics.map((char, idx) => (
                <div
                  key={idx}
                  className="neo-box p-3 flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 mb-2 flex items-center justify-center opacity-60">
                    {char.icon}
                  </div>
                  <p className="font-mono text-xs font-medium">
                    {char.label}
                  </p>
                </div>
              ))}
               
            </div>
          </div>

          {/* Flow Column - Desktop only */}
          <div className="hidden md:block space-y-4">
            <div className="neo-box p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-sm opacity-70">Tastes Like:</p>
                <p className="font-commentary text-xl md:text-2xl">
                  {flowFormula.taste}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {characteristics.map((char, idx) => (
                <div
                  key={idx}
                  className="neo-box p-3 flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 mb-2 flex items-center justify-center opacity-60">
                    {char.icon}
                  </div>
                  <p className="font-mono text-xs font-medium">
                    {char.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-current/10 -translate-x-1/2" />

          {/* Clear Column - Desktop only */}
          <div className="hidden md:block space-y-4">
            <div className="neo-box p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-sm opacity-70">Tastes Like:</p>
                <p className="font-commentary text-xl md:text-2xl">
                  {clearFormula.taste}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {characteristics.map((char, idx) => (
                <div
                  key={idx}
                  className="neo-box p-3 flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 mb-2 flex items-center justify-center opacity-60">
                    {char.icon}
                  </div>
                  <p className="font-mono text-xs font-medium">
                    {char.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Legacy export for backwards compatibility (will be removed)
export default function FormulaInfoSections({
  formulaId,
}: {
  formulaId: FormulaId;
}) {
  // This is kept temporarily but should not be used
  return null;
}
