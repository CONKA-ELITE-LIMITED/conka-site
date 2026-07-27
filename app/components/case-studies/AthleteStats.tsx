"use client";

import { AthleteData } from "@/app/lib/caseStudiesData";

const METRIC_TO_IMPROVEMENT_LABEL: Record<string, string> = {
  totalScore: "Total Score",
  accuracy: "Accuracy",
  speed: "Speed",
};

export function ComparisonChart({ athlete }: { athlete: AthleteData }) {
  const metrics = Object.keys(athlete.baseline) as (keyof typeof athlete.baseline)[];

  const formatMetricName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getImprovementForMetric = (metricKey: string): string | null => {
    const label = METRIC_TO_IMPROVEMENT_LABEL[metricKey];
    if (!label) return null;
    const imp = athlete.improvements.find((i) => i.metric === label);
    return imp?.value ?? null;
  };

  return (
    <div className="space-y-3">
      {metrics.map((metric) => {
        const baselineVal = athlete.baseline[metric];
        const resultVal = athlete.results[metric];

        if (baselineVal === undefined || resultVal === undefined) return null;

        const isTimeMetric =
          metric.toLowerCase().includes("time") ||
          metric.toLowerCase().includes("speed");
        const maxVal = isTimeMetric
          ? Math.max(baselineVal, resultVal) * 1.1
          : 100;
        const improvementStr = getImprovementForMetric(metric);

        return (
          <div key={metric} className="space-y-1.5">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/50">
                {formatMetricName(metric)}
              </span>
              <span className="text-[11px] tabular-nums text-black/80 shrink-0">
                {baselineVal}
                {isTimeMetric ? "ms" : ""} → {resultVal}
                {isTimeMetric ? "ms" : ""}
                {improvementStr != null && (
                  <span className="ml-2 text-[#1B2757] font-bold">
                    {improvementStr}
                  </span>
                )}
              </span>
            </div>
            <div className="relative h-3 flex gap-1">
              <div className="flex-1 h-full bg-black/[0.04] rounded-full border border-black/8 overflow-hidden">
                <div
                  className="h-full bg-black/25"
                  style={{ width: `${(baselineVal / maxVal) * 100}%` }}
                />
              </div>
              <div className="flex-1 h-full bg-black/[0.04] rounded-full border border-black/8 overflow-hidden">
                <div
                  className="h-full bg-[#1B2757]"
                  style={{ width: `${(resultVal / maxVal) * 100}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-center gap-6 pt-3 border-t border-black/8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-black/25" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Baseline
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#1B2757]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Results
          </span>
        </div>
      </div>
    </div>
  );
}
