"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/app/hooks/useInView";
import {
  COFFEE_PRICE_PER_DAY,
  PRICE_PER_DAY_BOTH,
  MONTHLY_SAVINGS_VS_COFFEE,
} from "@/app/lib/landingPricing";

/* ============================================================================
 * CrashChart
 *
 * "Skip the 2pm crash" comparison: coffee rises then crashes red at 2pm while
 * the CONKA gradient line stays steady, with a cost-comparison table below.
 * Ported from the lander (app/lander/sections/CrashChart) into our patterns:
 * Tailwind + the shared useInView hook + motion-safe inline transitions, no
 * CSS Module. Renders the card only (no section header) so it can drop into a
 * listicle reason's media slot, which already supplies the headline and body.
 *
 * Figures default DRY from app/lib/landingPricing; override per page via config.
 * ========================================================================== */

const NAVY = "#1B2757";
const COFFEE = "#1d1d1d";
const CRASH = "#d9483b";
const END_BLUE = "#5B86C9";

interface CrashChartProps {
  /** Headline saving vs a monthly coffee habit, e.g. "£53". */
  saving?: string;
  coffeePerDay?: string;
  shotsPerDay?: string;
  /** Square the container to match the clinical PDP/start styling */
  sharp?: boolean;
}

export function CoffeeIcon({ stroke = "#1d1d1d" }: { stroke?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px] flex-shrink-0"
      aria-hidden
    >
      <path d="M5 9h11v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z" />
      <path d="M16 10h2.2a2.2 2.2 0 0 1 0 4.4H16" />
      <path d="M8 3c-.5.7-.5 1.5 0 2.2M11.5 3c-.5.7-.5 1.5 0 2.2" />
    </svg>
  );
}

export function BottleIcon({ stroke = "currentColor" }: { stroke?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 flex-shrink-0"
      aria-hidden
    >
      <rect x="9.4" y="2.5" width="5.2" height="2.6" rx="0.6" />
      <path d="M10 5.1h4v1.8l.95 1.05c.67.74 1.05 1.7 1.05 2.7V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-8.35c0-1 .38-1.96 1.05-2.7L10 6.9V5.1Z" />
      <line x1="8.7" y1="13.6" x2="15.3" y2="13.6" />
    </svg>
  );
}

/**
 * One scroll-drawn path: measures its own length on mount, then animates
 * stroke-dashoffset to 0 once in view. The transition is motion-safe only, so
 * reduced-motion users get the fully drawn line with no animation.
 */
export function DrawPath({
  d,
  stroke,
  isInView,
  transitionClass = "motion-safe:[transition:stroke-dashoffset_1.5s_cubic-bezier(0.4,0,0.2,1)]",
}: {
  d: string;
  stroke: string;
  isInView: boolean;
  transitionClass?: string;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    try {
      setLen(Math.ceil(ref.current.getTotalLength()));
    } catch {
      /* getTotalLength unavailable — leave len 0 so the line just shows */
    }
  }, []);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={3.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={transitionClass}
      style={
        len
          ? {
              strokeDasharray: len,
              strokeDashoffset: isInView ? 0 : len,
            }
          : undefined
      }
    />
  );
}

export default function CrashChart({
  saving = `£${MONTHLY_SAVINGS_VS_COFFEE}`,
  coffeePerDay = `£${COFFEE_PRICE_PER_DAY}/day`,
  shotsPerDay = `£${PRICE_PER_DAY_BOTH}/day`,
  sharp = false,
}: CrashChartProps) {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`overflow-hidden border border-black/[0.09] bg-white text-[#1d1d1d] shadow-[0_4px_24px_rgba(20,30,60,0.06)] ${
        sharp ? "" : "rounded-[24px]"
      }`}
    >
      <div className="px-4 pb-3 pt-[22px]">
        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 px-1.5 pb-1">
          <span className="flex items-center gap-2 text-[13px] font-medium text-[#3a3a3a]">
            <CoffeeIcon />
            Coffee
          </span>
          <span className="flex items-center gap-2 text-[13px] font-medium text-[#3a3a3a]">
            <span
              className="h-[5px] w-6 flex-shrink-0 rounded-[3px]"
              style={{ background: "linear-gradient(90deg,#E9A23A,#6E97D6)" }}
            />
            CONKA Flow + Clear
          </span>
        </div>
        <p className="px-1.5 pb-2.5 pt-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#aaa]">
          Focus levels through the day
        </p>

        <svg
          className="block h-auto w-full"
          viewBox="0 0 340 250"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Focus through the day: coffee crashes at 2pm, CONKA stays steady all day"
        >
          <defs>
            <linearGradient id="cc-conkaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E9A23A" />
              <stop offset="48%" stopColor="#CF9A78" />
              <stop offset="100%" stopColor="#5B86C9" />
            </linearGradient>
            <linearGradient id="cc-conkaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9DB8E0" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#9DB8E0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="cc-coffeeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D9483B" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#D9483B" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines */}
          <line x1="30" y1="70" x2="320" y2="70" stroke="#efefef" strokeWidth="1" />
          <line x1="30" y1="135" x2="320" y2="135" stroke="#efefef" strokeWidth="1" />
          <line x1="30" y1="200" x2="320" y2="200" stroke="#e6e6e6" strokeWidth="1" />

          {/* CONKA area + line */}
          <path
            d="M30,140 C58,95 75,75 95,72 C150,66 220,64 280,62 C300,61 312,61 320,60 L320,200 L30,200 Z"
            fill="url(#cc-conkaFill)"
            className="motion-safe:[transition:opacity_0.8s_ease_0.9s]"
            style={{ opacity: isInView ? 1 : 0 }}
          />
          <DrawPath
            d="M30,140 C58,95 75,75 95,72 C150,66 220,64 280,62 C300,61 312,61 320,60"
            stroke="url(#cc-conkaGrad)"
            isInView={isInView}
          />

          {/* Coffee area (full) */}
          <path
            d="M30,175 C52,92 62,62 78,60 C110,58 140,64 165,68 C178,70 184,71 191,72 C200,82 205,122 215,152 C224,176 236,188 252,189 C278,191 300,190 320,190 L320,200 L30,200 Z"
            fill="url(#cc-coffeeFill)"
            className="motion-safe:[transition:opacity_0.8s_ease_0.9s]"
            style={{ opacity: isInView ? 1 : 0 }}
          />
          {/* Coffee rise/plateau (black) to 2pm */}
          <DrawPath
            d="M30,175 C52,92 62,62 78,60 C110,58 140,64 165,68 C178,70 184,71 191,72"
            stroke={COFFEE}
            isInView={isInView}
          />
          {/* Coffee crash (red) after 2pm, drawn after the rise */}
          <DrawPath
            d="M191,72 C200,82 205,122 215,152 C224,176 236,188 252,189 C278,191 300,190 320,190"
            stroke={CRASH}
            isInView={isInView}
            transitionClass="motion-safe:[transition:stroke-dashoffset_1.2s_cubic-bezier(0.55,0,0.3,1)_1s]"
          />

          {/* 2pm crash marker */}
          <g
            className="motion-safe:[transition:opacity_0.5s_ease_1s]"
            style={{ opacity: isInView ? 1 : 0 }}
          >
            <line
              x1="191"
              y1="44"
              x2="191"
              y2="196"
              stroke={CRASH}
              strokeWidth="1.3"
              strokeDasharray="4 4"
              opacity="0.5"
            />
            <text
              x="191"
              y="36"
              textAnchor="middle"
              className="fill-[#d9483b] text-[12.5px] font-extrabold uppercase tracking-[0.05em]"
            >
              ↓ 2pm crash
            </text>
          </g>

          {/* end-state dots */}
          <circle
            cx="191"
            cy="72"
            r="5.5"
            fill={CRASH}
            stroke="#fff"
            strokeWidth="2"
            className="motion-safe:[transition:opacity_0.4s_ease_1.1s]"
            style={{ opacity: isInView ? 1 : 0 }}
          />
          <circle
            cx="320"
            cy="60"
            r="5.5"
            fill={END_BLUE}
            stroke="#fff"
            strokeWidth="2"
            className="motion-safe:[transition:opacity_0.4s_ease_1.5s]"
            style={{ opacity: isInView ? 1 : 0 }}
          />
          <text
            x="314"
            y="50"
            textAnchor="end"
            className="fill-[#5B86C9] text-[11.5px] font-extrabold uppercase tracking-[0.04em] motion-safe:[transition:opacity_0.4s_ease_1.5s]"
            style={{ opacity: isInView ? 1 : 0 }}
          >
            steady
          </text>

          {/* axis */}
          <g className="fill-[#9a9a9a] text-[11.5px] font-medium uppercase tracking-[0.05em]">
            <text x="30" y="222" textAnchor="start">
              9am
            </text>
            <text x="126" y="222" textAnchor="middle">
              12pm
            </text>
            <text x="191" y="222" textAnchor="middle">
              2pm
            </text>
            <text x="320" y="222" textAnchor="end">
              6pm
            </text>
          </g>
        </svg>
      </div>

      {/* Cost comparison */}
      <div className="border-t border-black/[0.09] bg-[#faf9f6] px-[22px] pb-[22px] pt-5">
        <p className="mb-3.5 text-[18.5px] font-medium leading-6 text-[#1d1d1d]">
          Costs <b className="font-extrabold text-[#3FA95B]">{saving}</b> less
          than your monthly coffee bill
        </p>
        <div className="flex items-center justify-between py-3">
          <span className="flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.05em] text-[#666]">
            <CoffeeIcon stroke="currentColor" />
            Daily coffee
          </span>
          <span className="text-[19px] font-extrabold tracking-[-0.02em] text-[#9a9a9a]">
            {coffeePerDay}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-black/[0.07] py-3 text-[#1B2757]">
          <span className="flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.05em]">
            <BottleIcon stroke={NAVY} />
            Both shots
          </span>
          <span className="text-[19px] font-extrabold tracking-[-0.02em]">
            {shotsPerDay}
          </span>
        </div>
      </div>
    </div>
  );
}
