import type { ReactNode } from "react";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import InsightStatCard from "./InsightStatCard";
import IngredientBridge from "./IngredientBridge";
import ReportHeadlineCallout from "./ReportHeadlineCallout";

/* ============================================================================
 * DataReportSection (SCRUM-1522, Simple DTC)
 *
 * One report, findings first. The glance layer is what a skimmer reads
 * without touching anything: the header (hook, headline finding, evidence
 * line) beside the chart, with the report's one number floating on the chart
 * panel as a stat tile (the /app tile language). Everything else, the
 * everyday comparisons, supporting readings, interpretation, CONKA note,
 * ingredient studies and methodology, sits behind a native "See the full
 * data" disclosure. Nothing from the old dense layout is dropped, only moved.
 *
 * Server component: the chart (client, animates on view) arrives as a slot,
 * and the header is the small client island that reports the view event.
 * Content-only; the page owns the section and its anchor.
 * ========================================================================== */

export default function DataReportSection({
  report,
  chartSlot,
  cta,
}: {
  report: ReportData;
  chartSlot: ReactNode;
  /** Optional action under the evidence line (the Coffee vs CONKA report). */
  cta?: ReactNode;
}) {
  const { glance } = report;

  return (
    <div>
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
        <div>
          <ReportHeadlineCallout report={report} />
          {cta && <div className="mt-6">{cta}</div>}
        </div>

        <figure className="relative mt-4 rounded-lg bg-white px-3 pb-4 pt-14 text-black ring-1 ring-black/5 lg:mt-0 lg:px-5 lg:pb-5">
          <div className="app-tile-shadow-sm absolute -top-4 left-4 rounded-lg bg-white px-3.5 py-2.5 lg:left-5">
            <p
              className={`text-xl font-bold leading-none tracking-tight tabular-nums lg:text-2xl ${
                glance.positive
                  ? "text-[var(--brand-positive)]"
                  : "text-[var(--brand-navy)]"
              }`}
            >
              {glance.value}
            </p>
            <p className="mt-1 text-xs font-medium text-black/60">
              {glance.label}
            </p>
          </div>
          {chartSlot}
          {report.chart.insightNote && (
            <figcaption className="mt-3 px-1 text-sm leading-snug text-black/65">
              {report.chart.insightNote}
            </figcaption>
          )}
        </figure>
      </div>

      <details className="group mt-8 lg:mt-10">
        <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center gap-3 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--brand-navy)] ring-1 ring-black/10 transition-colors hover:ring-[var(--brand-navy)]/40 [&::-webkit-details-marker]:hidden">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eef0f5] text-base leading-none transition-transform group-open:rotate-45"
            aria-hidden="true"
          >
            +
          </span>
          <span className="group-open:hidden">See the full data</span>
          <span className="hidden group-open:inline">Hide the full data</span>
        </summary>

        <div className="mt-6 flex flex-col gap-6">
          {report.laymanAnchors.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {report.laymanAnchors.map((a) => (
                <div
                  key={a.stat}
                  className="rounded-md bg-[#eef0f5] p-4 text-black lg:p-5"
                >
                  <p className="mb-1.5 text-sm font-bold text-[var(--brand-navy)]">
                    {a.stat}
                  </p>
                  <p className="text-sm leading-snug text-black/75">
                    {a.anchor}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.statCards.map((stat) => (
              <InsightStatCard key={stat.counter} stat={stat} />
            ))}
          </div>

          <p className="max-w-[68ch] text-base leading-relaxed text-black/80">
            {report.interpretation}
          </p>

          {report.conkaSubSection && (
            <div className="rounded-md bg-white p-5 text-black ring-1 ring-black/5 lg:p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/50">
                What we see with CONKA
              </p>
              <h3 className="mb-2 text-lg font-bold leading-snug text-[var(--brand-navy)]">
                {report.conkaSubSection.headline}
              </h3>
              <p className="max-w-[64ch] text-sm leading-relaxed text-black/75">
                {report.conkaSubSection.body}
              </p>
              <p className="mt-3 text-xs leading-snug text-black/50">
                {report.conkaSubSection.caveat}
              </p>
            </div>
          )}

          {report.ingredientBridge && (
            <IngredientBridge bridge={report.ingredientBridge} />
          )}

          <div className="border-t border-black/10 pt-4">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-black/50">
              Methodology · {report.topicCode}
            </p>
            <p className="max-w-[68ch] text-sm leading-relaxed text-black/70">
              {report.methodology}
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
