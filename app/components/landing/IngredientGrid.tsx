"use client";

import { useInView } from "@/app/hooks/useInView";

/* ============================================================================
 * IngredientGrid
 *
 * Reason-slot asset: a tile grid of named actives + a one-line effect each,
 * the honest CONKA answer to IM8's deficiency panel. Used to make a reason
 * concrete by showing the specific ingredients doing the work (e.g. the
 * stress-load stack on "Built for Back-to-Back Days"). Names/doses come from
 * ingredientsData; copy is supplied per page in the config. Our patterns:
 * Tailwind, useInView reveal, gradient icon chips matching "What You'll Feel".
 * ========================================================================== */

export interface IngredientGridItem {
  /** Emoji glyph for the chip */
  icon: string;
  name: string;
  /** Optional per-serving dose, e.g. "576mg" */
  dose?: string;
  /** Short effect line */
  benefit: string;
}

interface IngredientGridProps {
  eyebrow?: string;
  items: IngredientGridItem[];
  footer?: string;
}

// Soft gradient chips, cycled across tiles (matches the buy-box feel panel)
const CHIP_GRADS = [
  "linear-gradient(135deg,#E3F2FD,#BBDEFB)",
  "linear-gradient(135deg,#E8F5E9,#C8E6C9)",
  "linear-gradient(135deg,#FFF8E1,#FFECB3)",
  "linear-gradient(135deg,#EDE7F6,#D1C4E9)",
  "linear-gradient(135deg,#E0F7FA,#B2EBF2)",
  "linear-gradient(135deg,#FCE4EC,#F8BBD0)",
];

export default function IngredientGrid({
  eyebrow,
  items,
  footer,
}: IngredientGridProps) {
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5"
    >
      {eyebrow ? (
        <p className="mb-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
          {eyebrow}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item, i) => (
          <div
            key={item.name}
            className="rounded-xl bg-[#FAFAFA] p-3 transition-all duration-500"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(8px)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px] text-base shadow-sm"
              style={{ background: CHIP_GRADS[i % CHIP_GRADS.length] }}
              aria-hidden
            >
              {item.icon}
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <strong className="text-[13px] font-bold leading-tight text-black">
                {item.name}
              </strong>
              {item.dose ? (
                <span className="font-mono text-[10px] tabular-nums text-black/40">
                  {item.dose}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[12px] leading-snug text-black/60">
              {item.benefit}
            </p>
          </div>
        ))}
      </div>

      {footer ? (
        <p className="mt-3 text-center text-[12px] font-medium text-black/70">
          {footer}
        </p>
      ) : null}
    </div>
  );
}
