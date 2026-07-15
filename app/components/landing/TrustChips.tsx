import { Fragment } from "react";
import type { TrustPillIcon } from "@/app/lib/landings/listicle-types";
import {
  TrustIconNoCaffeine,
  TrustIconInformedSport,
  TrustIconGuarantee,
  TrustIconShipping,
  TrustIconBatchTested,
  TrustIconCancel,
} from "./icons";

/** Maps a trust-chip icon key to its SVG so each item reads distinctly */
const TRUST_CHIP_ICONS: Record<
  TrustPillIcon,
  (props: { className?: string }) => React.ReactElement
> = {
  "no-caffeine": TrustIconNoCaffeine,
  "informed-sport": TrustIconInformedSport,
  guarantee: TrustIconGuarantee,
  shipping: TrustIconShipping,
  "batch-tested": TrustIconBatchTested,
  cancel: TrustIconCancel,
};

export interface TrustChip {
  label: string;
  icon: TrustPillIcon;
}

/**
 * Under-CTA trust row. Two variants, both sharing the per-item glyphs:
 * - "pills" (default): bordered icon + label mini-chips. Used by the home hero.
 * - "inline": a lightweight icon + text row separated by dots, no boxes or
 *   shadow, to sit flat inside the listicle hero's left-aligned column.
 * Alignment is owned by the parent.
 */
export default function TrustChips({
  chips,
  className = "",
  variant = "pills",
}: {
  chips: TrustChip[];
  className?: string;
  variant?: "pills" | "inline";
}) {
  if (variant === "inline") {
    return (
      <div
        className={`flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[12px] font-medium text-black/60 ${className}`}
      >
        {chips.map((chip, i) => {
          const Icon = TRUST_CHIP_ICONS[chip.icon];
          return (
            <Fragment key={i}>
              {i > 0 && (
                <span className="text-black/20" aria-hidden>
                  &middot;
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 flex-shrink-0 text-[#1B2757]" />
                {chip.label}
              </span>
            </Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap justify-center gap-2 ${className}`}>
      {chips.map((chip, i) => {
        const Icon = TRUST_CHIP_ICONS[chip.icon];
        return (
          <span
            key={i}
            className="inline-flex items-center gap-2 rounded-[10px] border border-black/10 bg-white px-3 py-2 text-[11px] font-semibold leading-tight text-black/75 shadow-[0_1px_6px_rgba(0,0,0,0.05)]"
          >
            <Icon className="h-4 w-4 flex-shrink-0 text-[#1B2757]" />
            {chip.label}
          </span>
        );
      })}
    </div>
  );
}
