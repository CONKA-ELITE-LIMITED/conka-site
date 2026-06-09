"use client";

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface RadarChartProps {
  data: { category: string; baseline: number; improved: number }[];
  mainValue: number;
  accentColor?: string; // Optional accent color for the improved line (defaults to currentColor)
}

export default function RadarChart({ data, mainValue: _mainValue, accentColor }: RadarChartProps) {
  // Use black for grid, labels, and baseline; accent color only for improved line
  const gridColor = "rgba(0, 0, 0, 0.15)";
  const labelColor = "rgba(0, 0, 0, 0.7)";
  const baselineColor = "rgba(0, 0, 0, 0.4)";
  const improvedColor = accentColor || "rgba(0, 0, 0, 0.8)";

  return (
    <div className="w-full overflow-visible">
      <div className="w-full aspect-square overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart
            data={data}
            outerRadius="60%"
            margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
          >
            <PolarGrid
              stroke={gridColor}
              strokeWidth={1}
              strokeOpacity={1}
            />
            <PolarAngleAxis
              dataKey="category"
              tick={{
                fill: labelColor,
                fontSize: 11,
                fontFamily: "var(--font-jetbrains-mono)",
              }}
              className="font-mono"
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 50]}
              tick={false}
              axisLine={false}
            />
            {/* Baseline (human baseline) */}
            <Radar
              name="Baseline"
              dataKey="baseline"
              stroke={baselineColor}
              fill={baselineColor}
              fillOpacity={0.05}
              strokeWidth={1}
              strokeDasharray="5 5"
              strokeOpacity={1}
            />
            {/* Improved (with CONKA) */}
            <Radar
              name="With CONKA"
              dataKey="improved"
              stroke={improvedColor}
              fill={improvedColor}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
