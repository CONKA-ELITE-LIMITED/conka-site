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
  ZERO_LINE_LABEL_STYLE,
  ZERO_LINE_STROKE,
} from "./chartTheme";

const WITHOUT_CONKA_COLOR = NAVY_MUTED;
const WITH_CONKA_COLOR = NAVY;

/**
 * Both curves draw left-to-right when the chart scrolls into view: the
 * muted without-CONKA curve first, the navy with-CONKA curve chasing it.
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
      <p className={Y_LABEL_CLASS}>{data.yLabel}</p>
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
                stroke={GRID_STROKE}
                strokeDasharray="2 4"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={{ stroke: AXIS_STROKE }}
              />
              <YAxis
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <ReferenceLine
                y={0}
                stroke={ZERO_LINE_STROKE}
                label={{
                  value: "Your typical day",
                  position: "insideTopRight",
                  style: ZERO_LINE_LABEL_STYLE,
                }}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL_STYLE}
                itemStyle={TOOLTIP_ITEM_STYLE}
                cursor={{
                  stroke: AXIS_STROKE,
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
      <div className="mt-3 flex items-center justify-center gap-6 text-xs font-medium text-black/60">
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-0.5 w-4 rounded-full"
            style={{ backgroundColor: WITHOUT_CONKA_COLOR }}
          />
          Without CONKA
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-1 w-4 rounded-full"
            style={{ backgroundColor: WITH_CONKA_COLOR }}
          />
          With CONKA
        </span>
      </div>

      {/* Dosing key card — only when dosing bands are present */}
      {data.dosingBands && data.dosingBands.length > 0 && (
        <div className="mt-4 rounded-md bg-[#eef0f5] p-4 lg:p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-black/50">
            When to take each shot
          </p>
          <div className="grid grid-cols-2 gap-3 lg:gap-5">
            {data.dosingBands.map((band) => (
              <div key={band.label} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-8 shrink-0 rounded-full"
                    style={{ backgroundColor: band.swatchColor }}
                  />
                  <span className="text-sm font-bold text-[var(--brand-navy)]">
                    {band.label}
                  </span>
                </div>
                <p className="text-xs font-medium tabular-nums text-black/70">
                  {band.window}
                </p>
                <p className="text-xs leading-snug text-black/60">
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
