"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LineChartData } from "@/app/lib/appInsightsTypes";
import { useInView } from "@/app/hooks/useInView";
import { usePrefersReducedMotion } from "@/app/hooks/usePrefersReducedMotion";

const WITHOUT_CONKA_COLOR = "rgba(255, 255, 255, 0.35)";
const WITH_CONKA_COLOR = "rgba(255, 255, 255, 0.95)";

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

/**
 * Both curves draw left-to-right when the chart scrolls into view: the
 * faint without-CONKA curve first, the bright with-CONKA curve chasing it.
 * Mounting is deferred until near-visible (reserved height, no CLS);
 * reduced motion renders immediately with no animation.
 */
export default function DataLineChart({ data }: { data: LineChartData }) {
  const [inViewRef, inView] = useInView({ threshold: 0.25 });
  const prefersReduced = usePrefersReducedMotion();
  const animate = !prefersReduced;

  const chartData = data.points.map((p) => ({
    hour: p.hourLabel,
    "Without CONKA": p.noConka,
    "With CONKA": p.conka,
  }));

  return (
    <div className="w-full">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 tabular-nums mb-3">
        {`Y · ${data.yLabel}`}
      </p>
      <div ref={inViewRef} className="w-full h-[280px] lg:h-[360px]">
        {inView ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 16, right: 8, left: -14, bottom: 0 }}
            >
              {/* Dosing band fills — rendered before grid so they sit behind everything */}
              {data.dosingBands?.map((band) => (
                <ReferenceArea
                  key={band.label}
                  x1={band.x1}
                  x2={band.x2}
                  fill={band.fillColor}
                  fillOpacity={1}
                  stroke="none"
                />
              ))}

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
              />
              <ReferenceLine
                y={0}
                stroke="rgba(255, 255, 255, 0.3)"
                label={{
                  value: "YOUR TYPICAL DAY",
                  position: "insideTopRight",
                  style: ZERO_LINE_LABEL_STYLE,
                }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={{ color: "rgba(255, 255, 255, 0.9)" }}
                cursor={{
                  stroke: "rgba(255, 255, 255, 0.2)",
                  strokeDasharray: "2 4",
                }}
              />
              <Line
                type="monotone"
                dataKey="Without CONKA"
                stroke={WITHOUT_CONKA_COLOR}
                strokeWidth={1.5}
                dot={{ fill: WITHOUT_CONKA_COLOR, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                isAnimationActive={animate}
                animationBegin={0}
                animationDuration={1100}
                animationEasing="ease-in-out"
              />
              <Line
                type="monotone"
                dataKey="With CONKA"
                stroke={WITH_CONKA_COLOR}
                strokeWidth={2.5}
                dot={{ fill: WITH_CONKA_COLOR, r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                isAnimationActive={animate}
                animationBegin={500}
                animationDuration={1100}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : null}
      </div>

      {/* Performance legend */}
      <div className="flex items-center justify-center gap-6 mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 tabular-nums">
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-px"
            style={{ backgroundColor: WITHOUT_CONKA_COLOR }}
          />
          Without CONKA
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-4 h-0.5"
            style={{ backgroundColor: WITH_CONKA_COLOR }}
          />
          With CONKA
        </span>
      </div>

      {/* Dosing key card — only when dosing bands are present */}
      {data.dosingBands && data.dosingBands.length > 0 && (
        <div className="mt-4 border border-white/15 bg-white/[0.05] p-4 lg:p-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45 tabular-nums mb-4">
            {"// When to take each shot"}
          </p>
          <div className="grid grid-cols-2 gap-3 lg:gap-5">
            {data.dosingBands.map((band) => (
              <div key={band.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-8 h-2 shrink-0"
                    style={{ backgroundColor: band.swatchColor }}
                  />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    {band.label}
                  </span>
                </div>
                <p className="font-mono text-[11px] tabular-nums text-white/80">
                  {band.window}
                </p>
                <p className="text-xs text-white/55 leading-snug">
                  {band.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
