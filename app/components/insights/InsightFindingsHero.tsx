"use client";

import { track } from "@vercel/analytics/react";
import {
  APP_INSIGHTS_REPORTS,
  APP_INSIGHTS_TOTALS,
} from "@/app/lib/appInsightsData";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import EvidenceStrengthBadge from "./EvidenceStrengthBadge";
import InsightIcon from "./insightIcons";

/* ============================================================================
 * InsightFindingsHero (SCRUM-1522, Simple DTC)
 *
 * The findings are the hero and the navigation. Each report is one tile:
 * icon, its one number, what it means, and the evidence line, so a skimmer
 * gets every finding in the first screen and how sure we are of each. A tap
 * jumps to that report. Replaces the old dataset-plate hero, the TL;DR strip
 * and the filter bar.
 *
 * Tiles are plain anchor links, so the jump works without JavaScript; the
 * click handler only reports `insights_tldr_card_click` (kept from the TL;DR
 * strip so the event history stays continuous). Content-only.
 * ========================================================================== */

function onTileClick(id: ReportData["id"]) {
  try {
    track("insights_tldr_card_click", {
      location: "app-insights-readability",
      report: id,
    });
  } catch {
    // analytics fail silently
  }
}

export default function InsightFindingsHero() {
  const tests = APP_INSIGHTS_TOTALS.tests.toLocaleString("en-GB");

  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[5fr_7fr] lg:gap-14">
      <div>
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--brand-navy)] ring-1 ring-black/5">
          <span
            className="h-2 w-2 rounded-full bg-[var(--brand-accent)]"
            aria-hidden="true"
          />
          Real data from the CONKA app
        </span>
        <h1
          id="app-insights-hero"
          className="brand-h1 mb-5 text-[var(--brand-navy)]"
          style={{ letterSpacing: "-0.03em", lineHeight: 1.04 }}
        >
          What {tests} brain tests
          <br />
          <span className="text-[var(--brand-accent)]">tell us.</span>
        </h1>
        <p className="max-w-[44ch] text-lg leading-relaxed text-black/75">
          {APP_INSIGHTS_TOTALS.users} people tested in the CONKA app over{" "}
          {APP_INSIGHTS_TOTALS.monthsSpan} months. Here is what moves a score,
          and how sure we are. Tap a finding for the data.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {APP_INSIGHTS_REPORTS.map((report, i) => {
          const isLast = i === APP_INSIGHTS_REPORTS.length - 1;
          return (
            <li key={report.id} className={isLast ? "sm:col-span-2" : ""}>
              <a
                href={`#${report.id}`}
                onClick={() => onTileClick(report.id)}
                className="app-tile-shadow-sm group flex h-full min-h-[44px] items-center gap-3.5 rounded-lg bg-white p-4 text-black ring-1 ring-black/5 transition-transform motion-safe:hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef0f5] text-[var(--brand-navy)]">
                  <InsightIcon id={report.id} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-xl font-bold leading-none tracking-tight tabular-nums ${
                      report.glance.positive
                        ? "text-[var(--brand-positive)]"
                        : "text-[var(--brand-navy)]"
                    }`}
                  >
                    {report.glance.value}
                  </span>
                  <span className="mt-1 block text-sm font-medium leading-snug text-black/75">
                    {report.glance.label}
                  </span>
                  <span className="mt-2 block">
                    <EvidenceStrengthBadge
                      strength={report.evidenceStrength}
                      earlySignal={report.earlySignal}
                      sample={report.sampleShort}
                    />
                  </span>
                </span>
                <span
                  className="shrink-0 text-lg text-black/30 transition-colors group-hover:text-[var(--brand-navy)]"
                  aria-hidden="true"
                >
                  &darr;
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
