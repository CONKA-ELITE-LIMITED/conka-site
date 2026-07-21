"use client";

import type { ReactNode } from "react";

/* ============================================================================
 * SegmentedToggle
 *
 * Shared rounded segmented-pill control (Simple DTC): a soft cool track with a
 * navy active pill and muted-grey inactive labels. Generic over the value type
 * so callers keep their own identifiers; optional per-option leading icon.
 *
 * Used directly by the home product grid (Both/Flow/Clear) and, via
 * FormulaToggle, by the showcase and clinical ingredient surfaces (Flow/Clear
 * with time-of-day icons). One control, one look, everywhere.
 * ========================================================================== */

const NAVY = "#1B2757";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

interface SegmentedToggleProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
  /** Stretch tabs to equal width. Needs a width-constrained container. */
  fill?: boolean;
}

export default function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
  fill = false,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`${fill ? "flex w-full" : "inline-flex"} gap-1 rounded-full bg-[#eef1f8] p-1 ${className}`.trim()}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`flex ${fill ? "flex-1" : ""} min-h-[44px] items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold leading-none transition-colors cursor-pointer ${
              isActive ? "text-white" : "text-[#6b6b6b] hover:text-black"
            }`}
            style={isActive ? { backgroundColor: NAVY } : undefined}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
