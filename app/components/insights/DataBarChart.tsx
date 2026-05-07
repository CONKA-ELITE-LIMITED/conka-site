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

const BAR_COLOR = "rgba(255, 255, 255, 0.9)";
const BAR_COLOR_NOISE = "rgba(255, 255, 255, 0.18)";

const TICK_STYLE = {
  fill: "rgba(255, 255, 255, 0.85)",
  fontSize: 10,
  fontFamily: "var(--font-jetbrains-mono)",
  letterSpacing: "0.18em",
};

const TOOLTIP_STYLE = {
  backgroundColor: "rgba(20, 20, 20, 0.95)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: 0,
  fontFamily: "var(--font-jetbrains-mono)",
  fontSize: 11,
  color: "rgba(255, 255, 255, 0.9)",
};

const TOOLTIP_LABEL_STYLE = {
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: 10,
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  marginBottom: 4,
};

const ZERO_LINE_LABEL_STYLE = {
  fontSize: 9,
  fill: "rgba(255, 255, 255, 0.55)",
  fontFamily: "var(--font-jetbrains-mono)",
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
};

function colorForValue(value: number): string {
  // Near-zero / noise bars rendered very dim so they don't compete with real signal
  if (Math.abs(value) < 0.5) return BAR_COLOR_NOISE;
  return BAR_COLOR;
}

export default function DataBarChart({ data }: { data: BarChartData }) {
  const chartData = data.points.map((p) => ({
    label: p.label,
    value: p.value,
    meta: p.meta ?? "",
  }));

  return (
    <div className="w-full h-[280px] lg:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 16, right: 16, left: -8, bottom: 16 }}
          barCategoryGap="25%"
        >
          <CartesianGrid
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
          />
          <YAxis
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            domain={["auto", 0]}
            label={{
              value: data.yLabel,
              angle: -90,
              position: "insideLeft",
              style: {
                ...TICK_STYLE,
                textAnchor: "middle",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              },
              offset: 24,
            }}
          />
          <ReferenceLine
            y={0}
            stroke="rgba(255, 255, 255, 0.3)"
            label={{
              value: "YOUR TYPICAL DAY",
              position: "insideBottomRight",
              style: ZERO_LINE_LABEL_STYLE,
            }}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
            formatter={(value: number, _name, item) => {
              const meta = item?.payload?.meta;
              return [`${value > 0 ? "+" : ""}${value}${meta ? `  (${meta})` : ""}`, "Score change"];
            }}
          />
          <Bar dataKey="value" radius={0}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorForValue(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
