"use client";

import { useRef } from "react";
import { track } from "@vercel/analytics/react";
import { gsap, useGSAP, withMotion, revealUp } from "@/app/lib/motion";
import { APP_INSIGHTS_REPORTS } from "@/app/lib/appInsightsData";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import EvidenceStrengthBadge from "./EvidenceStrengthBadge";

/**
 * Sits above the existing filter on /app-insights. Four cards, one per
 * report, surfacing the headline finding, sample size, and evidence
 * strength so a visitor reads the punchline before drilling in.
 *
 * On click, calls onSelect(reportId). Parent (InsightFilteredSections)
 * clears any active filter and scrolls to the matching section.
 *
 * Component is content-only.
 */

const COUNTERS = ["01.", "02.", "03.", "04."] as const;

export default function InsightTldrStrip({
  onSelect,
}: {
  onSelect: (id: ReportData["id"]) => void;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        revealUp("[data-tldr-header]", root.current);
        revealUp("[data-tldr-card]", root.current, {
          stagger: 0.09,
          scrollTrigger: { start: "top 80%" },
        });
        gsap.from("[data-tldr-rule]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "expo.inOut",
          scrollTrigger: { trigger: root.current, start: "top 80%" },
        });
      });
    },
    { scope: root },
  );

  function handleClick(reportId: ReportData["id"]) {
    try {
      track("insights_tldr_card_click", {
        location: "app-insights-readability",
        report: reportId,
      });
    } catch {
      // analytics fail silently
    }
    onSelect(reportId);
  }

  return (
    <div ref={root}>
      <div data-tldr-header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-3">
          {"// What the data shows · APP-01"}
        </p>
        <h2
          className="brand-h3 text-white max-w-[28ch]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Four patterns the data keeps showing.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 tabular-nums mt-2">
          Tap a pattern for the full report.
        </p>
        <div
          data-tldr-rule
          className="mt-6 mb-6 h-px bg-white/20"
          aria-hidden="true"
        />
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        role="list"
        aria-label="Report headlines"
      >
        {APP_INSIGHTS_REPORTS.map((report, i) => {
          const counter = COUNTERS[i] ?? `0${i + 1}.`;
          return (
            <button
              key={report.id}
              type="button"
              role="listitem"
              data-tldr-card
              onClick={() => handleClick(report.id)}
              aria-label={`Jump to ${report.eyebrowConcept} report`}
              className="text-left bg-white/85 hover:bg-white transition-colors flex flex-col min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#0a0a0a]/10">
                <span className="font-mono text-[11px] font-bold tabular-nums text-[#0a0a0a]/70">
                  {counter}
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a]/60">
                  {report.eyebrowConcept}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-4 lg:p-5">
                <p className="text-sm lg:text-[15px] text-[#0a0a0a] leading-snug font-medium mb-3">
                  {report.headlineFinding}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] tabular-nums text-[#0a0a0a]/60 mb-4">
                  {report.sampleSize}
                </p>
                <div className="mt-auto pt-2">
                  <EvidenceStrengthBadge strength={report.evidenceStrength} tone="light" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
