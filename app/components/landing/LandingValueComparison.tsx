"use client";

import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import { useInView } from "@/app/hooks/useInView";
import {
  PRICE_PER_SHOT_BOTH,
  MONTHLY_SAVINGS_VS_COFFEE,
} from "@/app/lib/landingPricing";

/* ============================================================================
 * LandingValueComparison
 *
 * Caffeine vs CONKA, told as the "borrowed energy" argument (adapted from the
 * /start caffeine section, reskinned clinical):
 *
 *   1. Headline: caffeine doesn't give you energy, it borrows it.
 *   2. Mechanism paragraph — why the 11am crash is the system working
 *      as designed.
 *   3. Fig. 01 — two stacked energy curves (coffee: spike/crash cycles;
 *      CONKA: sustained plateau). Cover rects sweep left-to-right on scroll
 *      into view so both curves read as the same day moving in parallel.
 *   4. CONKA paragraph + price-per-month closer.
 *   5. CTA + Nootropics/Adaptogens ingredient-class strip.
 *
 * Replaced the earlier two-card layout (hour-band time-in-effect chart +
 * price table) which was information-dense but slow to consume. The
 * Flow=morning / Clear=afternoon coverage teaching now lives in the product
 * showcase time bands and the ingredients toggle.
 *
 * Desktop: copy column left, chart right (grid). Mobile: narrative order,
 * chart between the two paragraphs.
 * ========================================================================== */

const NAVY = "#1B2757";
const COFFEE = "#111111";
const FLOW_ACCENT = "#F59E0B";
const CLEAR_ACCENT = "#94B9FF";

const X_TICKS = [
  { x: 30, label: "8AM" },
  { x: 146, label: "11AM" },
  { x: 262, label: "2PM" },
  { x: 378, label: "5PM" },
  { x: 494, label: "8PM" },
  { x: 610, label: "11PM" },
];

const BASELINE_Y = 115;

// Coffee: three spikes through the day. First peak high then a dip, second
// peak then a deep crash below baseline, third smaller peak (diminishing
// returns) tapering back to baseline by bedtime.
const COFFEE_PATH =
  "M 30 115 C 60 110, 85 65, 110 50 C 145 45, 175 120, 200 125 C 225 130, 245 132, 260 128 C 285 115, 295 70, 320 65 C 350 65, 380 150, 400 160 C 420 158, 440 150, 460 145 C 480 130, 505 95, 530 85 C 560 90, 590 105, 610 115";

// CONKA: smooth climb, plateau through the afternoon, graceful taper landing
// just above baseline at bedtime.
const CONKA_PATH =
  "M 30 115 C 70 110, 105 60, 145 40 C 200 32, 235 32, 260 35 C 310 35, 350 35, 378 38 C 420 43, 460 58, 495 70 C 540 83, 580 95, 610 105";

export default function LandingValueComparison({
  ctaHref,
  ctaLabel,
}: {
  ctaHref?: string;
  ctaLabel?: string;
} = {}) {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref}>
      {/* Desktop: copy column (incl. header) left, chart right, vertically
          centred against each other so neither column floats in dead space.
          Mobile: single column in narrative order, chart between the two
          paragraphs. */}
      <div className="lg:flex lg:gap-12 lg:items-center">
        {/* Copy column */}
        <div className="lg:flex-1">
          {/* Trio header */}
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// Caffeine vs CONKA · SCI-03"}
          </p>
          <h2
            className="brand-h1 mb-6"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            Caffeine doesn&apos;t give you energy.
            <br />
            It borrows it.
          </h2>

          {/* 1. Mechanism — why coffee hands the fatigue back */}
          <p className="text-base text-black/75 leading-relaxed max-w-prose mb-6">
            Caffeine blocks the receptors that tell your brain it&apos;s tired.
            It hides the fatigue for a few hours, spikes cortisol, and hands
            both back to you at 11am. The second cup isn&apos;t a habit.
            It&apos;s the system working as designed.
          </p>

          {/* 2. Fig. 01 — mobile position, between the two paragraphs */}
          <div className="mb-6 lg:hidden">
            <ChartCard isInView={isInView} />
          </div>

          {/* 3. CONKA — the counter-mechanism */}
          <p className="text-base text-black/75 leading-relaxed max-w-prose mb-6">
            CONKA works the other way. Fifteen nootropics and adaptogens do
            the heavy lifting: brain-boosting nutrients build the focus,
            stress-mitigating compounds keep cortisol in check. Energy that
            doesn&apos;t have to be paid back.
          </p>

          {/* 4. Price closer */}
          <p className="text-base text-black/75 leading-relaxed max-w-prose mb-8">
            It&apos;s also{" "}
            <strong className="font-semibold text-black">
              £{MONTHLY_SAVINGS_VS_COFFEE} a month less
            </strong>{" "}
            than a daily coffee habit.
          </p>

          <ConkaCTAButton href={ctaHref} meta={null}>
            {ctaLabel ?? `Get Both from £${PRICE_PER_SHOT_BOTH}/shot`}
          </ConkaCTAButton>

          {/* Ingredient-class strip — pays off the "nootropics and
              adaptogens" line above */}
          <div className="flex items-center gap-6 mt-8">
            <IngredientClass
              icon="/icons/NootropicsIcon.avif"
              name="Nootropics"
              role="Brain-boosting"
            />
            <div className="w-px h-12 bg-black/15" aria-hidden />
            <IngredientClass
              icon="/icons/AdaptogensIcon.avif"
              name="Adaptogens"
              role="Stress-mitigating"
            />
          </div>
        </div>

        {/* Chart column — desktop position */}
        <div className="hidden lg:block lg:flex-1">
          <ChartCard isInView={isInView} />
        </div>
      </div>
    </div>
  );
}

/** Standalone Fig. 01 chart card with its own scroll-reveal — for surfaces
 *  that want the graphic without the full section (e.g. listicle reasons). */
export function ValueComparisonChart() {
  const [ref, isInView] = useInView();
  return (
    <div ref={ref}>
      <ChartCard isInView={isInView} />
    </div>
  );
}

/* ============================ sub-components ============================== */

/** Fig. 01 — the stacked coffee/CONKA energy curves in a clinical card.
 *  Rendered twice (mobile + desktop positions); only one is ever displayed,
 *  the other is display:none so it stays out of the accessibility tree. */
function ChartCard({ isInView }: { isInView: boolean }) {
  return (
    <div className="border border-black/12 bg-white p-5 lg:p-6">
      <div className="mb-5 pb-4 border-b border-black/8">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 mb-1.5 tabular-nums">
          Fig. 01 · Cognitive energy · 8am to 11pm
        </p>
        <h3 className="text-lg lg:text-xl font-semibold text-black leading-snug">
          One borrows. One builds.
        </h3>
      </div>

      {/* Coffee chart */}
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-black/75 mb-1.5">
        Coffee
      </p>
      <svg
        viewBox="0 0 640 200"
        className="block w-full h-auto"
        role="img"
        aria-label="Coffee energy: peaks, mild crash, second peak, deep crash below baseline, third spike tapering back to baseline by bedtime."
      >
        <ChartGrid />
        <CurveWithHalo path={COFFEE_PATH} color={COFFEE} />

        {/* annotations */}
        <text
          x="400"
          y="178"
          fontSize="13"
          fill={NAVY}
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
          fill={NAVY}
          opacity="0.75"
          textAnchor="middle"
          fontStyle="italic"
          fontWeight="600"
        >
          wrecks sleep
        </text>

        {/* drink markers — three cups: morning, lunchtime, late afternoon */}
        <DrinkMarker cx={30} cy={115} fill={COFFEE} />
        <DrinkMarker cx={260} cy={128} fill={COFFEE} />
        <DrinkMarker cx={460} cy={145} fill={COFFEE} />

        <RevealCover isInView={isInView} />
        <AxisLabels />
      </svg>

      <div className="h-5" />

      {/* CONKA chart */}
      <p
        className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] mb-1.5"
        style={{ color: NAVY }}
      >
        CONKA · Flow + Clear
      </p>
      <svg
        viewBox="0 0 640 200"
        className="block w-full h-auto"
        role="img"
        aria-label="CONKA energy: rises into a sustained plateau, holds all day, gentle taper to just above baseline by bedtime."
      >
        <ChartGrid />
        <CurveWithHalo path={CONKA_PATH} color={NAVY} />

        {/* shot markers — Flow (amber) in the morning, Clear (soft blue)
            in the afternoon. Brand accent colours, dots only. */}
        <DrinkMarker cx={30} cy={115} fill={FLOW_ACCENT} />
        <text
          x="30"
          y="134"
          fontSize="12"
          fill={NAVY}
          opacity="0.85"
          textAnchor="middle"
          fontWeight="700"
        >
          Flow
        </text>
        <DrinkMarker cx={262} cy={35} fill={CLEAR_ACCENT} />
        <text
          x="262"
          y="22"
          fontSize="12"
          fill={NAVY}
          opacity="0.85"
          textAnchor="middle"
          fontWeight="700"
        >
          Clear
        </text>

        <RevealCover isInView={isInView} />
        <AxisLabels />
      </svg>

      {/* Chart footer */}
      <p className="mt-4 pt-4 border-t border-black/8 font-mono text-[9px] uppercase tracking-[0.14em] text-black/45 tabular-nums">
        All day focus · Into the evening · Without the crash
      </p>
    </div>
  );
}

function ChartGrid() {
  return (
    <>
      {/* vertical hour gridlines */}
      <g stroke={NAVY} strokeWidth="1" opacity="0.05">
        {X_TICKS.map((t) => (
          <line key={t.x} x1={t.x} y1="20" x2={t.x} y2="170" />
        ))}
      </g>
      {/* dashed baseline reference */}
      <line
        x1="30"
        y1={BASELINE_Y}
        x2="610"
        y2={BASELINE_Y}
        stroke={NAVY}
        strokeWidth="1.25"
        opacity="0.35"
        strokeDasharray="5 4"
      />
    </>
  );
}

function CurveWithHalo({ path, color }: { path: string; color: string }) {
  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeOpacity="0.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function DrinkMarker({
  cx,
  cy,
  fill,
}: {
  cx: number;
  cy: number;
  fill: string;
}) {
  return <circle cx={cx} cy={cy} r="7" fill={fill} stroke="white" strokeWidth="2" />;
}

/** White cover rect that slides right when the section scrolls into view,
 *  revealing the curve left-to-right. The transition only exists under
 *  motion-safe, so reduced-motion users see the chart snap to revealed
 *  with no animation. */
function RevealCover({ isInView }: { isInView: boolean }) {
  return (
    <rect
      x="20"
      y="15"
      width="605"
      height="165"
      fill="white"
      className="motion-safe:[transition:transform_2.8s_cubic-bezier(0.4,0,0.2,1)]"
      style={{
        transform: isInView ? "translateX(605px)" : "translateX(0)",
      }}
      aria-hidden
    />
  );
}

function AxisLabels() {
  return (
    <g
      fill={NAVY}
      fontSize="10"
      fontWeight="700"
      textAnchor="middle"
      style={{ letterSpacing: "0.08em" }}
    >
      {X_TICKS.map((t) => (
        <text key={t.x} x={t.x} y="195">
          {t.label}
        </text>
      ))}
    </g>
  );
}

function IngredientClass({
  icon,
  name,
  role,
}: {
  icon: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Image src={icon} width={42} height={42} alt="" aria-hidden />
      <div className="leading-tight">
        <div className="text-base font-semibold text-black">{name}</div>
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-black/50 mt-0.5">
          {role}
        </div>
      </div>
    </div>
  );
}
