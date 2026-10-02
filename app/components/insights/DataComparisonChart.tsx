"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ComparisonChartData } from "@/app/lib/appInsightsTypes";
import { useInView } from "@/app/hooks/useInView";
import { usePrefersReducedMotion } from "@/app/hooks/usePrefersReducedMotion";
import {
  AXIS_STROKE,
  GRID_STROKE,
  NAVY,
  NAVY_MUTED,
  TICK_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
  Y_LABEL_CLASS,
} from "./chartTheme";

const BAR_COLOR_HIGHLIGHT = NAVY;
const BAR_COLOR_BASE = NAVY_MUTED;




const LABEL_STYLE = {
  fill: NAVY,
  fontSize: 12,
  fontWeight: 700,
};

/**
 * Four-group comparison: each consumption group is one bar of an absolute
 * metric, growing up from a floored baseline so small between-group gaps
 * stay legible. The winning group is emphasised; the rest sit dim so the
 * signal reads at a glance. Value labels sit on each bar because the
 * y-axis is floored (the numbers, not the bar ratios, carry the truth).
 * Mounting is deferred until near-visible (reserved height, no CLS);
 * reduced motion renders immediately with no animation.
 */
export default function DataComparisonChart({
  data,
}: {
  data: ComparisonChartData;
}) {
  const [inViewRef, inView] = useInView({ threshold: 0.25 });
  const prefersReduced = usePrefersReducedMotion();

  const suffix = data.valueSuffix ?? "";
  const decimals = data.labelDecimals;

  const formatLabel = (value: number | string) => {
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(n)) return String(value);
    return decimals == null ? String(n) : n.toFixed(decimals);
  };

  const chartData = data.points.map((p) => ({
    label: p.label,
    value: p.value,
    meta: p.meta ?? "",
    highlight: p.highlight ?? false,
  }));

  return (
    <div className="w-full">
      <p className={Y_LABEL_CLASS}>
        {`${data.yLabel}${data.lowerIsBetter ? " · lower is better" : ""}`}
      </p>
      <div ref={inViewRef} className="w-full h-[300px] lg:h-[360px]">
        {inView ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 24, right: 8, left: -8, bottom: 8 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                stroke={GRID_STROKE}
                strokeDasharray="2 4"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={{ stroke: AXIS_STROKE }}
                interval={0}
              />
              <YAxis
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                domain={[data.yMin ?? "auto", "auto"]}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={{ fill: "rgba(27, 39, 87, 0.04)" }}
                formatter={(value: number, _name, item) => {
                  const meta = item?.payload?.meta;
                  return [
                    `${formatLabel(value)}${suffix}${meta ? `  (${meta})` : ""}`,
                    "Group average",
                  ];
                }}
              />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                isAnimationActive={!prefersReduced}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.highlight ? BAR_COLOR_HIGHLIGHT : BAR_COLOR_BASE
                    }
                  />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  style={LABEL_STYLE}
                  formatter={(value) =>
                    value == null ? "" : formatLabel(value as number | string)
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}
