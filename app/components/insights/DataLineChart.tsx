"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LineChartData } from "@/app/lib/appInsightsTypes";

const NO_CONKA_COLOR = "rgba(255, 255, 255, 0.35)";
const CONKA_COLOR = "rgba(255, 255, 255, 0.95)";

const TICK_STYLE = {
  fill: "rgba(255, 255, 255, 0.4)",
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
  color: "white",
};

const TOOLTIP_LABEL_STYLE = {
  color: "rgba(255, 255, 255, 0.55)",
  fontSize: 10,
  textTransform: "uppercase" as const,
  letterSpacing: "0.18em",
  marginBottom: 4,
};

export default function DataLineChart({ data }: { data: LineChartData }) {
  const chartData = data.points.map((p) => ({
    hour: p.hourLabel,
    "No Conka": p.noConka,
    Conka: p.conka,
  }));

  return (
    <div className="w-full h-[280px] lg:h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 16, left: -8, bottom: 0 }}
        >
          <CartesianGrid
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="2 4"
            vertical={false}
          />
          <XAxis
            dataKey="hour"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={{ stroke: "rgba(255, 255, 255, 0.15)" }}
          />
          <YAxis
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
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
          <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.3)" />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            labelStyle={TOOLTIP_LABEL_STYLE}
            cursor={{ stroke: "rgba(255, 255, 255, 0.2)", strokeDasharray: "2 4" }}
          />
          <Line
            type="monotone"
            dataKey="No Conka"
            stroke={NO_CONKA_COLOR}
            strokeWidth={1.5}
            dot={{ fill: NO_CONKA_COLOR, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Conka"
            stroke={CONKA_COLOR}
            strokeWidth={2}
            dot={{ fill: CONKA_COLOR, r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Inline legend (Recharts default Legend looks dated) */}
      <div className="flex items-center justify-center gap-6 mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 tabular-nums">
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-px"
            style={{ backgroundColor: NO_CONKA_COLOR }}
          />
          No Conka
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-0.5"
            style={{ backgroundColor: CONKA_COLOR }}
          />
          Conka
        </span>
      </div>
    </div>
  );
}
