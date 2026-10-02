"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarChartData } from "@/app/lib/appInsightsTypes";
import { useInView } from "@/app/hooks/useInView";
import { usePrefersReducedMotion } from "@/app/hooks/usePrefersReducedMotion";
import {
  AXIS_STROKE,
  BAR_CURSOR,
  GRID_STROKE,
  NAVY,
  NAVY_FAINT,
  TICK_STYLE,
  TOOLTIP_ITEM_STYLE,
  TOOLTIP_LABEL_STYLE,
  TOOLTIP_STYLE,
  Y_LABEL_CLASS,
  ZERO_LINE_LABEL_STYLE,
  ZERO_LINE_STROKE,
} from "./chartTheme";

const BAR_COLOR = NAVY;
const BAR_COLOR_NOISE = NAVY_FAINT;





function colorForValue(value: number): string {
  // Near-zero / noise bars rendered very dim so they don't compete with real signal
  if (Math.abs(value) < 0.5) return BAR_COLOR_NOISE;
  return BAR_COLOR;
}

/**
 * Bars grow downward from the zero line when the chart scrolls into view:
 * the draw literally enacts "points lost vs. your baseline". Mounting is
 * deferred until the chart is near-visible (reserved height, no CLS);
 * reduced motion renders immediately with no animation.
 */
export default function DataBarChart({ data }: { data: BarChartData }) {
  const [inViewRef, inView] = useInView({ threshold: 0.25 });
  const prefersReduced = usePrefersReducedMotion();

  const chartData = data.points.map((p) => ({
    label: p.label,
    value: p.value,
    meta: p.meta ?? "",
  }));

  return (
    <div className="w-full">
      <p className={Y_LABEL_CLASS}>{data.yLabel}</p>
      <div ref={inViewRef} className="w-full h-[280px] lg:h-[340px]">
        {inView ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 16, right: 8, left: -14, bottom: 8 }}
              barCategoryGap="30%"
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
              />
              <YAxis
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                domain={["auto", 0]}
              />
              <ReferenceLine
                y={0}
                stroke={ZERO_LINE_STROKE}
                label={{
                  value: "Your typical day",
                  position: "insideBottomRight",
                  style: ZERO_LINE_LABEL_STYLE,
                }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={BAR_CURSOR}
                formatter={(value: number, _name, item) => {
                  const meta = item?.payload?.meta;
                  return [
                    `${value > 0 ? "+" : ""}${value}${meta ? `  (${meta})` : ""}`,
                    "Score change",
                  ];
                }}
              />
              <Bar
                dataKey="value"
                // Recharts draws a negative bar as an inverted rect, so its
                // "top" corners land on the tip: this rounds the tip either way.
                radius={[6, 6, 0, 0]}
                isAnimationActive={!prefersReduced}
                animationDuration={900}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colorForValue(entry.value)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </div>
    </div>
  );
}
