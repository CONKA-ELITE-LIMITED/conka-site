"use client";

import { useRef } from "react";
import { useGSAP, withMotion } from "@/app/lib/motion";
import { resolveReading } from "./insightMotion";
import type { StatCard as StatCardData } from "@/app/lib/appInsightsTypes";

/**
 * One measured reading per card. The value is server-rendered final and,
 * when motion is allowed, resolves from zero on entry like an instrument
 * stabilising. Negative readings count downward from the baseline.
 */
export default function InsightStatCard({ stat }: { stat: StatCardData }) {
  const valueRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    withMotion(() => {
      if (valueRef.current) resolveReading(valueRef.current);
    });
  });

  return (
    <div className="w-full border border-white/20 bg-white/[0.12] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/15">
        <span className="font-mono text-[11px] font-bold tabular-nums text-white/70">
          {stat.counter}
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/90">
          {stat.topic}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4 lg:p-5">
        <p
          ref={valueRef}
          className="font-mono text-3xl lg:text-4xl font-bold tabular-nums text-white leading-none"
        >
          {stat.value}
        </p>
        <p className="text-sm text-white/90 leading-snug mt-3">
          {stat.context}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] tabular-nums text-white/65 mt-auto pt-4">
          {stat.caveat}
        </p>
      </div>
    </div>
  );
}
