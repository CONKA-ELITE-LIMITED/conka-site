"use client";

import { IngredientStat } from "@/app/lib/ingredientsData";

interface IngredientStatsProps {
  stats: IngredientStat[];
  /** Retained for API compatibility; clinical styling uses a fixed navy accent. */
  accentColor?: string;
  /** Retained for API compatibility. */
  nested?: boolean;
}

export default function IngredientStats({ stats }: IngredientStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 rounded-md border border-black/12 overflow-hidden">
      {stats.map((stat, idx) => {
        const isLastRow = idx >= stats.length - (stats.length % 4 || 4);
        const isLastCol = (idx + 1) % 4 === 0;
        return (
          <div
            key={idx}
            className={`p-4 bg-white ${
              !isLastCol ? "lg:border-r lg:border-black/8" : ""
            } ${!isLastRow ? "border-b border-black/8 lg:border-b-0" : ""} ${
              idx % 2 === 0 ? "border-r border-black/8 lg:border-r" : ""
            }`}
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40 leading-none mb-3">
              {stat.label}
            </p>
            <p className="text-2xl lg:text-3xl font-bold tabular-nums text-[#1B2757] leading-none">
              {stat.value}
            </p>
            <p className="text-[10px] tabular-nums text-black/45 mt-3 leading-snug">
              {stat.source}
            </p>
          </div>
        );
      })}
    </div>
  );
}
