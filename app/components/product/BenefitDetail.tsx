"use client";

import {
  FormulaId,
  StruggleId,
  formulaContent,
  FORMULA_COLORS,
  RadarDataPoint,
} from "@/app/lib/productData";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface BenefitDetailProps {
  formulaId: FormulaId;
  struggleId: StruggleId;
}

// Custom tick component for better label positioning
const CustomTick = ({
  x,
  y,
  payload,
  isDark,
}: {
  x: number;
  y: number;
  payload: { value: string };
  isDark: boolean;
}) => {
  const shortLabels: Record<string, string> = {
    Concentration: "Focus",
    "Processing Speed": "Speed",
    "Attention Span": "Attention",
    "Mental Clarity": "Clarity",
    "Working Memory": "Memory",
    "Task Switching": "Switching",
    "Sleep Quality": "Sleep",
    "REM Duration": "REM",
    "Sleep Onset": "Onset",
    "Night Waking": "Waking",
    "Morning Energy": "Morning",
    Recovery: "Recovery",
    "Energy Levels": "Energy",
    Endurance: "Endurance",
    Motivation: "Motivation",
    Stamina: "Stamina",
    Vitality: "Vitality",
    "Energy Stability": "Stability",
    "Afternoon Focus": "Afternoon",
    "Blood Sugar": "Sugar",
    "Cortisol Balance": "Cortisol",
    "Mood Stability": "Mood",
    "Stress Response": "Stress",
    "Cortisol Levels": "Cortisol",
    Resilience: "Resilience",
    "Calm Focus": "Calm",
    "Recovery Speed": "Recovery",
    "Emotional Balance": "Emotion",
    "Calm State": "Calm",
    "Social Ease": "Social",
    "Physical Calm": "Physical",
    "Focus Intensity": "Intensity",
    "Reaction Time": "Reaction",
    "Neural Speed": "Neural",
    "Mental Acuity": "Acuity",
  };

  const shortLabel = shortLabels[payload.value] || payload.value;

  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"}
      fontSize={10}
      fontFamily="var(--font-jetbrains-mono)"
      letterSpacing="0.06em"
    >
      {shortLabel.toUpperCase()}
    </text>
  );
};

function MiniRadarChart({
  data,
  dataKey,
  label,
  sub,
  color,
  isDark,
}: {
  data: RadarDataPoint[];
  dataKey: "before" | "after";
  label: string;
  sub: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center overflow-visible w-full"
      aria-hidden="true"
    >
      <div className="w-full min-w-[180px] min-h-[180px] aspect-square max-w-[280px] mx-auto overflow-visible">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={180}
          minHeight={180}
        >
          <RechartsRadarChart
            data={data}
            outerRadius="60%"
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid
              stroke={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"}
              strokeWidth={1}
            />
            <PolarAngleAxis
              dataKey="category"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              tick={(props: any) => {
                if (
                  typeof props.x === "number" &&
                  typeof props.y === "number" &&
                  props.payload
                ) {
                  return (
                    <CustomTick
                      x={props.x}
                      y={props.y}
                      payload={props.payload}
                      isDark={isDark}
                    />
                  );
                }
                return <g />;
              }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 50]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name={label}
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.22}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/70 -mt-4">
        {label}
      </p>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 tabular-nums mt-1">
        {sub}
      </p>
    </div>
  );
}

export default function BenefitDetail({
  formulaId,
  struggleId,
}: BenefitDetailProps) {
  const formula = formulaContent[formulaId];
  const solution = formula.struggleSolutions[struggleId];
  const accentColor = FORMULA_COLORS[formulaId];
  const study = solution.clinicalStudy;

  // Parse clinical results into stats (+18%, -56%) and text-only items
  const parsedResults = (() => {
    const stats: { value: string; label: string }[] = [];

    study.results.forEach((result) => {
      if (result.value.match(/^[+\-]?\d/)) {
        stats.push({ value: result.value, label: result.metric });
      }
    });

    return { stats };
  })();

  return (
    <div aria-live="polite">
      <article
        key={struggleId}
        className="bg-white border border-black/12 [animation:fadeIn_0.3s_ease]"
      >
        {/* Card header row */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-black/8">
          <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
            EVIDENCE
          </span>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
            Peer-Reviewed Study
          </span>
        </div>

        <div className="p-6 lg:p-8">
          {/* Struggle statement */}
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {solution.struggle}
          </p>

          {/* Outcome headline */}
          <h3
            className="text-2xl lg:text-3xl font-bold mb-5 leading-tight text-black"
            style={{ letterSpacing: "-0.02em" }}
          >
            {solution.outcome}
          </h3>

          {/* Mechanism description */}
          <p className="brand-body text-black/70 leading-relaxed mb-8 max-w-[60ch]">
            {solution.description}
          </p>

          {/* Stat tiles — spec-strip pattern */}
          {parsedResults.stats.length > 0 && (
            <div className="bg-white border border-black/12 grid grid-cols-2 mb-8">
              {parsedResults.stats.slice(0, 2).map((stat, idx) => {
                const isLast = idx === Math.min(1, parsedResults.stats.length - 1);
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-start gap-2 px-5 py-5 ${
                      isLast ? "" : "border-r border-black/8"
                    }`}
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 leading-none">
                      {stat.label}
                    </span>
                    <span
                      className={`font-mono text-3xl lg:text-4xl font-bold tabular-nums leading-none ${accentColor.text}`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {stat.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Radar chart — hairline data surface */}
          <div className="bg-white border border-black/12 mb-8">
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/8">
              <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                PERFORMANCE IMPACT
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                Baseline · 90 Days
              </span>
            </div>
            <div
              className="grid grid-cols-2 gap-4 px-4 py-6"
              aria-hidden="true"
            >
              <MiniRadarChart
                data={solution.radarData}
                dataKey="before"
                label="Baseline"
                sub="T=0"
                color="rgba(0,0,0,0.55)"
                isDark={false}
              />
              <MiniRadarChart
                data={solution.radarData}
                dataKey="after"
                label="90 Days"
                sub="T=90D"
                color={accentColor.hex}
                isDark={false}
              />
            </div>
          </div>

          {/* Clinical study block — flat hairline card */}
          <div className="border border-black/12 bg-white">
            {/* Header row */}
            <div className="flex items-center justify-between px-5 py-3 bg-[var(--brand-tint)] border-b border-black/8">
              <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                CLINICAL STUDY
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50 tabular-nums">
                {study.year}
              </span>
            </div>

            {/* Meta rows */}
            <dl className="divide-y divide-black/8">
              <div className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                  Ingredient
                </dt>
                <dd className="text-sm text-black/80">
                  {solution.ingredientAsset?.name}
                  {solution.ingredientAsset?.dosage
                    ? ` · ${solution.ingredientAsset.dosage}`
                    : ""}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                  Study
                </dt>
                <dd className="text-sm text-black/80">{study.name}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                  Participants
                </dt>
                <dd className="text-sm text-black/80 tabular-nums">
                  N={study.participants.total} · {study.participants.ageRange}
                </dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4 px-5 py-3">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/45">
                  Duration
                </dt>
                <dd className="text-sm text-black/80">{study.duration}</dd>
              </div>
            </dl>

            {/* Key findings */}
            {study.results.length > 0 && (
              <div className="px-5 py-4 border-t border-black/8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 mb-3">
                  Key Findings
                </p>
                <ul className="space-y-2 text-sm text-black/80">
                  {study.results.map((result, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="font-mono text-black/30 shrink-0">
                        —
                      </span>
                      <span>
                        <span className="font-semibold">{result.metric}:</span>{" "}
                        <span className="tabular-nums">{result.value}</span>{" "}
                        <span className="font-mono text-xs text-black/45 tabular-nums">
                          ({result.pValue})
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
