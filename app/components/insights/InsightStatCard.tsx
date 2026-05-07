import type { StatCard as StatCardData } from "@/app/lib/appInsightsTypes";

export default function InsightStatCard({ stat }: { stat: StatCardData }) {
  return (
    <div className="border border-white/15 bg-white/[0.07] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-mono text-[11px] font-bold tabular-nums text-white/40">
          {stat.counter}
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
          {stat.topic}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4 lg:p-5">
        <p className="font-mono text-3xl lg:text-4xl font-bold tabular-nums text-white leading-none">
          {stat.value}
        </p>
        <p className="text-sm text-white/75 leading-snug mt-3">
          {stat.context}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] tabular-nums text-white/35 mt-auto pt-4">
          {stat.caveat}
        </p>
      </div>
    </div>
  );
}
