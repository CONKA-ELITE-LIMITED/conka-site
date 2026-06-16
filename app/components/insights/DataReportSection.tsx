"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, withMotion, revealUp } from "@/app/lib/motion";
import { drawRule } from "./insightMotion";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import { APP_INSIGHTS_REPORTS } from "@/app/lib/appInsightsData";
import InsightStatCard from "./InsightStatCard";
import IngredientBridge from "./IngredientBridge";
import ReportHeadlineCallout from "./ReportHeadlineCallout";

/**
 * Shared layout for the four data reports. Each block rises in as it
 * enters view; a calibration rule draws under the header trio. The eyebrow
 * carries the report's position in the four-report sequence so the page
 * reads as one continuous investigation.
 */
export default function DataReportSection({
  report,
  chartSlot,
}: {
  report: ReportData;
  chartSlot: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);

  const reportNumber =
    APP_INSIGHTS_REPORTS.findIndex((r) => r.id === report.id) + 1;

  useGSAP(
    () => {
      withMotion(() => {
        gsap.utils
          .toArray<HTMLElement>("[data-report-reveal]")
          .forEach((el) => revealUp(el, el));
        const rule = root.current?.querySelector("[data-report-rule]");
        if (rule) drawRule(rule, rule);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-col gap-10 lg:gap-14">
      {/* ── Trio header ──────────────────────────────────────────── */}
      <header data-report-reveal>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-3">
          {`// Report 0${reportNumber}/0${APP_INSIGHTS_REPORTS.length} · ${report.eyebrowConcept} · ${report.topicCode}`}
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
        <div
          data-report-rule
          className="mt-6 h-px bg-white/20"
          aria-hidden="true"
        />
      </header>

      {/* ── Headline-finding callout (layman framing + rigor signal) */}
      <div data-report-reveal>
        <ReportHeadlineCallout report={report} />
      </div>

      {/* ── Hero chart ───────────────────────────────────────────── */}
      <div data-report-reveal className="border border-white/20 bg-white/[0.08] p-4 lg:p-6">
        {report.chart.insightNote ? (
          <div className="mb-4 pb-4 border-b border-white/10">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 tabular-nums mb-1.5">
              {"// Key finding"}
            </p>
            <p className="text-sm lg:text-base text-white font-medium leading-snug">
              {report.chart.insightNote}
            </p>
          </div>
        ) : null}
        {chartSlot}
      </div>

      {/* ── Stat cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {report.statCards.map((stat) => (
          <div key={stat.counter} data-report-reveal className="flex">
            <InsightStatCard stat={stat} />
          </div>
        ))}
      </div>

      {/* ── Interpretation ───────────────────────────────────────── */}
      <p
        data-report-reveal
        className="text-base lg:text-lg text-white leading-relaxed max-w-[68ch]"
      >
        {report.interpretation}
      </p>

      {/* ── Conka sub-section (optional) ─────────────────────────── */}
      {report.conkaSubSection ? (
        <div
          data-report-reveal
          className="border border-white/20 bg-white/[0.12] p-5 lg:p-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-3">
            {`// CONKA observation · ${report.topicCode}`}
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
        <div data-report-reveal>
          <IngredientBridge bridge={report.ingredientBridge} />
        </div>
      ) : null}

      {/* ── Methodology footnote ─────────────────────────────────── */}
      <div data-report-reveal className="border-t border-white/10 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-2">
          {`// Methodology · ${report.topicCode}`}
        </p>
        <p className="text-sm text-white/85 leading-relaxed max-w-[68ch]">
          {report.methodology}
        </p>
      </div>
    </div>
  );
}
