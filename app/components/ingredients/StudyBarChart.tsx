"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDataPoint {
  label: string;
  baseline: number;
  result: number;
}

interface StudyBarChartProps {
  data: ChartDataPoint[];
}

export default function StudyBarChart({ data }: StudyBarChartProps) {
  // Transform data for grouped bar chart
  const chartData = data.map((item) => ({
    name: item.label,
    Baseline: item.baseline,
    Result: item.result,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
        <XAxis
          dataKey="name"
          tick={{ fill: "currentColor", fontSize: 11, fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
        />
        <YAxis
          tick={{ fill: "currentColor", fontSize: 11, fontFamily: "var(--font-jetbrains-mono)" }}
          tickLine={false}
          axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--background)",
            border: "2px solid var(--foreground)",
            borderRadius: 0,
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: 12,
          }}
          labelStyle={{
            fontWeight: "bold",
            marginBottom: 4,
          }}
        />
        <Bar dataKey="Baseline" fill="currentColor" fillOpacity={0.2} radius={[2, 2, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`baseline-${index}`} />
          ))}
        </Bar>
        <Bar dataKey="Result" fill="currentColor" fillOpacity={0.8} radius={[2, 2, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={`result-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

