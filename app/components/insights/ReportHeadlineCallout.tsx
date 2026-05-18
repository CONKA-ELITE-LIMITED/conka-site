"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";
import type { ReportData } from "@/app/lib/appInsightsTypes";
import EvidenceStrengthBadge from "./EvidenceStrengthBadge";

/**
 * Per-report headline-finding callout. Sits between the trio header and
 * the chart inside DataReportSection. Layman framing + sample size +
 * evidence-strength badge + 1-2 layman anchors.
 *
 * Fires `insights_report_callout_view` once per report when the callout
 * enters the viewport. Component is content-only.
 */
export default function ReportHeadlineCallout({
  report,
}: {
  report: ReportData;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firedRef.current) return;

    const node = sentinelRef.current;
    if (!node) return;

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
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [report.id]);

  return (
    <div
      ref={sentinelRef}
      className="bg-white/85 p-5 lg:p-6"
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#0a0a0a]/60 tabular-nums mb-3">
        {"// Headline finding"}
      </p>
      <p className="text-lg lg:text-xl text-[#0a0a0a] leading-snug font-medium max-w-[58ch] mb-5">
        {report.headlineFinding}
      </p>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <EvidenceStrengthBadge strength={report.evidenceStrength} tone="light" />
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] tabular-nums text-[#0a0a0a]/60">
          {report.sampleSize}
        </span>
      </div>
      {report.laymanAnchors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-[#0a0a0a]/10">
          {report.laymanAnchors.map((a) => (
            <div key={a.stat}>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-[#0a0a0a]/70 mb-1.5">
                {a.stat}
              </p>
              <p className="text-sm text-[#0a0a0a]/85 leading-snug">{a.anchor}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
