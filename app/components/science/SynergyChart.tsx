"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formulaStrengths } from "@/app/lib/scienceData";
import { FORMULA_COLORS } from "@/app/lib/productColors";

// Product accent colours: Flow, Clear. Protocol = brand accent
const FLOW_COLOR = FORMULA_COLORS["01"].hex; // #f59e0b
const CLEAR_COLOR = FORMULA_COLORS["02"].hex; // #94b9ff
const PROTOCOL_COLOR = "#4058bb"; // var(--brand-accent)

interface SynergyChartProps {
  isMobile?: boolean;
}

export default function SynergyChart({ isMobile = false }: SynergyChartProps) {
  return (
    <div className="flex flex-col gap-6 md:gap-10">
      <div className="text-center">
        <p className="brand-caption uppercase tracking-widest opacity-50 mb-2">
          Formula Synergy
        </p>
        <h2
          className={`brand-h2 font-bold ${
            isMobile ? "text-2xl" : "text-3xl lg:text-4xl"
          }`}
          style={{ letterSpacing: "-0.02em" }}
        >
          Better Together
        </h2>
        <p
          className="brand-body opacity-80 mt-2 max-w-xl mx-auto"
          style={{ maxWidth: "var(--brand-body-max-width)" }}
        >
          See how CONKA Flow and CONKA Clear complement each other across all
          five pillars
        </p>
      </div>

      <div
        className="brand-card-bordered p-4 lg:p-8"
        style={{ borderRadius: "var(--brand-radius-card)" }}
      >
        <div className={isMobile ? "h-72" : "h-96"}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={formulaStrengths}
              margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
            >
              <PolarGrid stroke="currentColor" strokeOpacity={0.2} />
              <PolarAngleAxis
                dataKey="pillar"
                tick={{
                  fill: "currentColor",
                  fontSize: isMobile ? 10 : 12,
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{
                  fill: "currentColor",
                  fontSize: 10,
                  fontFamily: "var(--font-jetbrains-mono)",
                }}
                tickCount={5}
              />
              <Radar
                name="CONKA Flow"
                dataKey="flow"
                stroke={FLOW_COLOR}
                fill={FLOW_COLOR}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="CONKA Clear"
                dataKey="clarity"
                stroke={CLEAR_COLOR}
                fill={CLEAR_COLOR}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name="Combined Protocol"
                dataKey="combined"
                stroke={PROTOCOL_COLOR}
                fill={PROTOCOL_COLOR}
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: isMobile ? 10 : 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--brand-tint)",
                  border: "1px solid var(--brand-stroke)",
                  borderRadius: "var(--brand-radius-container)",
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`grid gap-4 mt-6 ${
            isMobile ? "grid-cols-1" : "grid-cols-3"
          }`}
        >
          <div
            className="flex items-center gap-3 p-3 rounded-[var(--brand-radius-container)] border"
            style={{
              borderColor: "rgba(245, 158, 11, 0.4)",
            }}
          >
            <span
              className="w-4 h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: FLOW_COLOR }}
            />
            <div>
              <p className="font-bold text-sm">CONKA Flow</p>
              <p className="brand-caption opacity-70">
                Adaptogenic foundation for stress resilience
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 p-3 rounded-[var(--brand-radius-container)] border"
            style={{ borderColor: "rgba(148, 185, 255, 0.5)" }}
          >
            <span
              className="w-4 h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: CLEAR_COLOR }}
            />
            <div>
              <p className="font-bold text-sm">CONKA Clear</p>
              <p className="brand-caption opacity-70">
                Nootropic power for peak performance
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-3 p-3 rounded-[var(--brand-radius-container)] border border-[var(--brand-stroke)]"
          >
            <span
              className="w-4 h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: PROTOCOL_COLOR }}
            />
            <div>
              <p className="font-bold text-sm">Combined Protocol</p>
              <p className="brand-caption opacity-70">
                Complete cognitive coverage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
