"use client";

import { useInView } from "@/app/hooks/useInView";
import { DrawPath } from "./CrashChart";

/* ============================================================================
 * DayEnergyCurve
 *
 * "Mental energy through the day": the Without line slumps in the afternoon
 * while the With-CONKA line holds steady morning to night. Pays off the
 * brain-ageing "Mental Energy That Defeats Fatigue" reason. Same patterns as
 * CrashChart (useInView + DrawPath, motion-safe) but no caffeine/cost framing,
 * so it reads as its own fatigue story rather than a repeat of the crash chart.
 * ========================================================================== */

const GREEN = "#2FA84F";
const GREY = "#b4b4b4";

export default function DayEnergyCurve() {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[24px] border border-black/[0.09] bg-white text-[#1d1d1d] shadow-[0_4px_24px_rgba(20,30,60,0.06)]"
    >
      <div className="px-4 pb-3 pt-[22px]">
        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 px-1.5 pb-1">
          <span className="flex items-center gap-2 text-[13px] font-medium text-[#3a3a3a]">
            <span
              className="h-[5px] w-6 flex-shrink-0 rounded-[3px]"
              style={{ background: GREEN }}
            />
            With CONKA
          </span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-[#3a3a3a]">
            <span
              className="h-[5px] w-6 flex-shrink-0 rounded-[3px]"
              style={{ background: GREY }}
            />
            Without
          </span>
        </div>
        <p className="px-1.5 pb-2.5 pt-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#aaa]">
          Mental energy through the day
        </p>

        <svg
          className="block h-auto w-full"
          viewBox="0 0 340 250"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Mental energy through the day: without CONKA slumps in the afternoon, with CONKA stays steady"
        >
          <defs>
            <linearGradient id="de-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.18" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          <line x1="30" y1="70" x2="320" y2="70" stroke="#efefef" strokeWidth="1" />
          <line x1="30" y1="135" x2="320" y2="135" stroke="#efefef" strokeWidth="1" />
          <line x1="30" y1="200" x2="320" y2="200" stroke="#e6e6e6" strokeWidth="1" />

          {/* With CONKA area + line (steady high) */}
          <path
            d="M30,118 C58,84 82,72 110,70 C175,66 245,65 320,64 L320,200 L30,200 Z"
            fill="url(#de-fill)"
            className="motion-safe:[transition:opacity_0.8s_ease_0.9s]"
            style={{ opacity: isInView ? 1 : 0 }}
          />
          <DrawPath
            d="M30,118 C58,84 82,72 110,70 C175,66 245,65 320,64"
            stroke={GREEN}
            isInView={isInView}
          />

          {/* Without — slumps in the afternoon */}
          <DrawPath
            d="M30,118 C58,92 82,84 110,86 C142,90 168,150 200,166 C238,184 285,178 320,174"
            stroke={GREY}
            isInView={isInView}
            transitionClass="motion-safe:[transition:stroke-dashoffset_1.4s_cubic-bezier(0.4,0,0.2,1)]"
          />

          {/* afternoon slump marker */}
          <g
            className="motion-safe:[transition:opacity_0.5s_ease_1s]"
            style={{ opacity: isInView ? 1 : 0 }}
          >
            <line
              x1="200"
              y1="44"
              x2="200"
              y2="196"
              stroke={GREY}
              strokeWidth="1.3"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <text
              x="200"
              y="36"
              textAnchor="middle"
              className="fill-[#8a8a8a] text-[12px] font-extrabold uppercase tracking-[0.05em]"
            >
              ↓ afternoon slump
            </text>
          </g>

          {/* steady end-state dot + label */}
          <circle
            cx="320"
            cy="64"
            r="5.5"
            fill={GREEN}
            stroke="#fff"
            strokeWidth="2"
            className="motion-safe:[transition:opacity_0.4s_ease_1.4s]"
            style={{ opacity: isInView ? 1 : 0 }}
          />
          <text
            x="314"
            y="54"
            textAnchor="end"
            className="fill-[#2FA84F] text-[11.5px] font-extrabold uppercase tracking-[0.04em] motion-safe:[transition:opacity_0.4s_ease_1.4s]"
            style={{ opacity: isInView ? 1 : 0 }}
          >
            steady
          </text>

          {/* axis */}
          <g className="fill-[#9a9a9a] text-[11px] font-medium uppercase tracking-[0.04em]">
            <text x="30" y="222" textAnchor="start">
              Morning
            </text>
            <text x="150" y="222" textAnchor="middle">
              Midday
            </text>
            <text x="320" y="222" textAnchor="end">
              Evening
            </text>
          </g>
        </svg>
      </div>

      <div className="border-t border-black/[0.09] bg-[#faf9f6] px-[22px] py-4">
        <p className="text-[15px] font-semibold leading-snug text-[#1d1d1d]">
          Sustained mental energy from morning to night. No midday slump.
        </p>
      </div>
    </div>
  );
}
