import type { ReactNode } from "react";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import InsightStatCard from "./InsightStatCard";
import IngredientBridge from "./IngredientBridge";

export default function DataReportSection({
  report,
  chartSlot,
}: {
  report: ReportData;
  chartSlot: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      {/* ── Trio header ──────────────────────────────────────────── */}
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-3">
          {`// ${report.eyebrowConcept} · ${report.topicCode}`}
        </p>
        <h2
          className="brand-h2 text-white mb-3 max-w-[24ch]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {report.hook}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/80 tabular-nums">
          {report.subline}
        </p>
      </header>

      {/* ── Hero chart ───────────────────────────────────────────── */}
      <div className="border border-white/20 bg-white/[0.08] p-4 lg:p-6">
        {chartSlot}
      </div>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {report.statCards.map((stat) => (
          <InsightStatCard key={stat.counter} stat={stat} />
        ))}
      </div>

      {/* ── Interpretation ───────────────────────────────────────── */}
      <p className="text-base lg:text-lg text-white leading-relaxed max-w-[68ch]">
        {report.interpretation}
      </p>

      {/* ── Conka sub-section (optional) ─────────────────────────── */}
      {report.conkaSubSection ? (
        <div className="border border-white/20 bg-white/[0.12] p-5 lg:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-3">
            {"// Conka observation · APP-01"}
          </p>
          <h3
            className="brand-h3 text-white mb-3 max-w-[28ch]"
            style={{ letterSpacing: "-0.02em" }}
          >
            {report.conkaSubSection.headline}
          </h3>
          <p className="text-sm text-white/90 leading-relaxed max-w-[64ch]">
            {report.conkaSubSection.body}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/65 tabular-nums mt-4">
            {report.conkaSubSection.caveat}
          </p>
        </div>
      ) : null}

      {/* ── Ingredient bridge (optional) ─────────────────────────── */}
      {report.ingredientBridge ? (
        <IngredientBridge bridge={report.ingredientBridge} />
      ) : null}

      {/* ── Methodology footnote ─────────────────────────────────── */}
      <div className="border-t border-white/10 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-2">
          {"// Methodology · APP-01"}
        </p>
        <p className="text-sm text-white/85 leading-relaxed max-w-[68ch]">
          {report.methodology}
        </p>
      </div>
    </div>
  );
}
