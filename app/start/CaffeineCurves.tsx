import CaffeineCurvesReveal from "./CaffeineCurvesReveal";
import styles from "./CaffeineCurves.module.css";

/**
 * Two stacked charts comparing coffee's volatile energy curve with
 * CONKA's sustained one. All SVG markup is server-rendered — only a
 * tiny client wrapper (CaffeineCurvesReveal) hydrates to trigger the
 * left-to-right reveal animation via a CSS class change.
 *
 * The reveal works by sliding a white `<rect>` off the right side of
 * each plot area. Both charts share the same cover width + transition,
 * so the horizontal velocity is identical — the eye reads them as
 * moving through the same day at the same pace.
 */
export default function CaffeineCurves() {
  const xTicks = [
    { x: 30, label: "8AM" },
    { x: 146, label: "11AM" },
    { x: 262, label: "2PM" },
    { x: 378, label: "5PM" },
    { x: 494, label: "8PM" },
    { x: 610, label: "11PM" },
  ];

  // Reference baseline — where each curve starts at 8AM.
  const baselineY = 115;

  return (
    <CaffeineCurvesReveal>
      <div className="bg-white rounded-[12px] p-5 md:p-6">
        <h3 className="text-[15px] font-semibold text-black text-center mb-5 leading-snug">
          Cognitive Energy levels on coffee vs CONKA
        </h3>

        {/* COFFEE CHART */}
        <svg
          viewBox="0 0 640 200"
          className="block w-full h-auto"
          role="img"
          aria-label="Coffee energy: peaks, mild crash, second peak, deep crash below baseline, third spike tapering back to baseline by bedtime."
        >
          {/* grid */}
          <g stroke="#1B2757" strokeWidth="1" opacity="0.05">
            {xTicks.map((t) => (
              <line key={t.x} x1={t.x} y1="20" x2={t.x} y2="170" />
            ))}
          </g>

          {/* dashed baseline reference */}
          <line
            x1="30"
            y1={baselineY}
            x2="610"
            y2={baselineY}
            stroke="#1B2757"
            strokeWidth="1.25"
            opacity="0.35"
            strokeDasharray="5 4"
          />

          {/* Coffee curve — halo + stroke. Three spikes through the day:
              first peak high, mild dip; second peak slightly lower, then
              a deep crash below baseline; third peak smaller (diminishing
              returns) tapering back to baseline by bedtime. */}
          <path
            d="M 30 115 C 60 110, 85 65, 110 50 C 145 45, 175 120, 200 125 C 225 130, 245 132, 260 128 C 285 115, 295 70, 320 65 C 350 65, 380 150, 400 160 C 420 158, 440 150, 460 145 C 480 130, 505 95, 530 85 C 560 90, 590 105, 610 115"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="10"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 30 115 C 60 110, 85 65, 110 50 C 145 45, 175 120, 200 125 C 225 130, 245 132, 260 128 C 285 115, 295 70, 320 65 C 350 65, 380 150, 400 160 C 420 158, 440 150, 460 145 C 480 130, 505 95, 530 85 C 560 90, 590 105, 610 115"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* annotations */}
          <text
            x="400"
            y="178"
            fontSize="13"
            fill="#1B2757"
            opacity="0.75"
            textAnchor="middle"
            fontStyle="italic"
            fontWeight="600"
          >
            crash
          </text>
          <text
            x="530"
            y="70"
            fontSize="13"
            fill="#1B2757"
            opacity="0.75"
            textAnchor="middle"
            fontStyle="italic"
            fontWeight="600"
          >
            wrecks sleep
          </text>

          {/* drink markers — three cups: morning, lunchtime, late afternoon */}
          <circle
            cx="30"
            cy="115"
            r="7"
            fill="#F59E0B"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="260"
            cy="128"
            r="7"
            fill="#F59E0B"
            stroke="white"
            strokeWidth="2"
          />
          <circle
            cx="460"
            cy="145"
            r="7"
            fill="#F59E0B"
            stroke="white"
            strokeWidth="2"
          />

          {/* cover rect — slides right to reveal the curve and annotations.
              Animation handled by CSS module (see CaffeineCurves.module.css). */}
          <rect
            x="20"
            y="15"
            width="605"
            height="165"
            fill="white"
            className={styles.cover}
          />

          {/* x-axis labels (outside the cover, always visible) */}
          <g
            fill="#1B2757"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
            style={{ letterSpacing: "0.08em" }}
          >
            {xTicks.map((t) => (
              <text key={t.x} x={t.x} y="195">
                {t.label}
              </text>
            ))}
          </g>
        </svg>

        <div className="h-4" />

        {/* CONKA CHART */}
        <svg
          viewBox="0 0 640 200"
          className="block w-full h-auto"
          role="img"
          aria-label="CONKA energy: rises into a sustained plateau, holds all day, gentle taper to just above baseline by bedtime."
        >
          {/* grid */}
          <g stroke="#1B2757" strokeWidth="1" opacity="0.05">
            {xTicks.map((t) => (
              <line key={t.x} x1={t.x} y1="20" x2={t.x} y2="170" />
            ))}
          </g>

          {/* dashed baseline reference */}
          <line
            x1="30"
            y1={baselineY}
            x2="610"
            y2={baselineY}
            stroke="#1B2757"
            strokeWidth="1.25"
            opacity="0.35"
            strokeDasharray="5 4"
          />

          {/* CONKA curve — smooth climb, plateau through afternoon,
              graceful taper landing just above baseline at bedtime. */}
          <path
            d="M 30 115 C 70 110, 105 60, 145 40 C 200 32, 235 32, 260 35 C 310 35, 350 35, 378 38 C 420 43, 460 58, 495 70 C 540 83, 580 95, 610 105"
            fill="none"
            stroke="#1B2757"
            strokeWidth="10"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 30 115 C 70 110, 105 60, 145 40 C 200 32, 235 32, 260 35 C 310 35, 350 35, 378 38 C 420 43, 460 58, 495 70 C 540 83, 580 95, 610 105"
            fill="none"
            stroke="#1B2757"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* drink markers — Flow (amber) in the morning, Clear (soft
              blue) in the afternoon. Brand colours per CLAUDE.md design
              system: Flow #F59E0B, Clear #94B9FF. The product labels
              carry the "all day" story without needing a separate
              annotation. */}
          <circle
            cx="30"
            cy="115"
            r="7"
            fill="#F59E0B"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x="30"
            y="134"
            fontSize="12"
            fill="#1B2757"
            opacity="0.85"
            textAnchor="middle"
            fontWeight="700"
          >
            Flow
          </text>

          <circle
            cx="262"
            cy="35"
            r="7"
            fill="#94B9FF"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x="262"
            y="22"
            fontSize="12"
            fill="#1B2757"
            opacity="0.85"
            textAnchor="middle"
            fontWeight="700"
          >
            Clear
          </text>

          {/* cover rect */}
          <rect
            x="20"
            y="15"
            width="605"
            height="165"
            fill="white"
            className={styles.cover}
          />

          {/* x-axis labels */}
          <g
            fill="#1B2757"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
            style={{ letterSpacing: "0.08em" }}
          >
            {xTicks.map((t) => (
              <text key={t.x} x={t.x} y="195">
                {t.label}
              </text>
            ))}
          </g>
        </svg>

        <p className="text-[12px] text-black/60 italic text-center mt-4 leading-snug">
          All day focus. Into the evening. Without the crash.
        </p>
      </div>
    </CaffeineCurvesReveal>
  );
}
