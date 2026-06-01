"use client";

import Image from "next/image";

export type FormulaId = "01" | "02";

interface FormulaToggleProps {
  /** Currently selected formula. */
  value: FormulaId;
  /** Called when the user selects a formula. */
  onChange: (formula: FormulaId) => void;
  /** Optional class name for the wrapper. */
  className?: string;
  /** Accessible label for the toggle group. */
  ariaLabel?: string;
}

export default function FormulaToggle({
  value,
  onChange,
  className = "",
  ariaLabel = "Choose formula",
}: FormulaToggleProps) {
  return (
    <div
      className={`flex gap-3 flex-shrink-0 ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onChange("01")}
          className={`relative w-24 h-24 overflow-hidden bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] transition-colors ${
            value === "01"
              ? "border-2 border-[#1B2757]"
              : "border border-black/12 hover:border-black/40"
          }`}
          aria-pressed={value === "01"}
        >
          {/* Square photographic tile — the asset's off-white background is
              the button surface, no inner scaling needed. */}
          <Image
            src="/formulas/conkaFlow/FlowNew.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            aria-hidden
          />
        </button>
        <span
          className={`mt-2 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums ${
            value === "01" ? "text-[#1B2757]" : "text-black/50"
          }`}
        >
          CONKA Flow
        </span>
      </div>
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onChange("02")}
          className={`relative w-24 h-24 overflow-hidden bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] transition-colors ${
            value === "02"
              ? "border-2 border-[#1B2757]"
              : "border border-black/12 hover:border-black/40"
          }`}
          aria-pressed={value === "02"}
        >
          <Image
            src="/formulas/conkaClear/ClearNew.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="96px"
            aria-hidden
          />
        </button>
        <span
          className={`mt-2 font-mono text-[10px] uppercase tracking-[0.18em] tabular-nums ${
            value === "02" ? "text-[#1B2757]" : "text-black/50"
          }`}
        >
          CONKA Clear
        </span>
      </div>
    </div>
  );
}
