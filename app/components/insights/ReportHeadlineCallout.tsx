"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import EvidenceStrengthBadge from "./EvidenceStrengthBadge";
import InsightIcon from "./insightIcons";

/**
 * A report's glance header: icon + topic, the hook, the headline finding
 * in plain English, and the evidence line. Everything a skimmer needs; the
 * rest sits behind the card's "See the full data".
 *
 * Fires `insights_report_callout_view` once per report when the header is
 * half in view. Content-only.
 */
export default function ReportHeadlineCallout({
  report,
}: {
  report: ReportData;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || firedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            try {
              track("insights_report_callout_view", {
                location: "app-insights-readability",
                report: report.id,
              });
            } catch {
              // analytics fail silently
            }
            observer.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [report.id]);

  return (
    <div ref={sentinelRef}>
      <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-navy)]">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef0f5]">
          <InsightIcon id={report.id} className="h-4 w-4" />
        </span>
        {report.eyebrowConcept}
      </p>
      <h2
        className="brand-h2 mb-4 max-w-[22ch] text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        {report.hook}
      </h2>
      <p className="mb-5 max-w-[48ch] text-lg leading-relaxed text-black/80">
        {report.headlineFinding}
      </p>
      <EvidenceStrengthBadge
        strength={report.evidenceStrength}
        earlySignal={report.earlySignal}
        sample={report.sampleSize}
      />
    </div>
  );
}
