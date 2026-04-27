"use client";

import ConkaCTAButton from "./ConkaCTAButton";
import LabTrustBadges from "./LabTrustBadges";
import { useInView } from "@/app/hooks/useInView";
import {
  PRICE_PER_DAY_BOTH,
  PRICE_PER_SHOT_BOTH,
  COFFEE_PRICE_PER_DAY,
  MONTHLY_SAVINGS_VS_COFFEE,
} from "@/app/lib/landingPricing";

/* ============================================================================
 * LandingValueComparison
 *
 * Reframed: leads with the *felt* argument (your coffee covers half your day)
 * before the math. Two cards:
 *
 *   [1] TIME-IN-EFFECT CHART — 06:00–18:00 axis, two rows.
 *       Coffee peaks 08–11 then crashes 11–14. CONKA Flow (06–12, amber)
 *       and Clear (12–18, blue) form a continuous coverage bar across the
 *       whole day. Bars animate left-to-right when the section enters
 *       view, sweeping like a timeline reveal.
 *
 *   [2] PRICE COMPARISON — clean side-by-side: cost/day + active count.
 *       The "cheaper than coffee" line lives here as a footer note,
 *       demoted from its own strip.
 * ========================================================================== */

const RANGE_START = 6;
const RANGE_END = 18;
const RANGE = RANGE_END - RANGE_START;
const HOUR_MARKS = [6, 8, 10, 12, 14, 16, 18];

const CONKA_COLOR = "#1B2757";

function pct(hour: number): string {
  return `${((hour - RANGE_START) / RANGE) * 100}%`;
}

type BandKind = "peak" | "crash" | "conka";

interface Band {
  start: number;
  end: number;
  kind: BandKind;
  /** Stagger order across the whole chart so the reveal sweeps L→R. */
  delayIndex: number;
}

const COFFEE_BANDS: Band[] = [
  { start: 8, end: 11, kind: "peak", delayIndex: 0 },
  { start: 11, end: 14, kind: "crash", delayIndex: 1 },
];

const FLOW_BANDS: Band[] = [
  { start: 6, end: 12, kind: "conka", delayIndex: 2 },
];

const CLEAR_BANDS: Band[] = [
  { start: 12, end: 18, kind: "conka", delayIndex: 3 },
];

export default function LandingValueComparison() {
  const [ref, isInView] = useInView();

  return (
    <div ref={ref}>
      {/* Eyebrow */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Get more for less · VALUE-01"}
      </p>

      {/* Heading */}
      <div className="mb-10">
        <h2
          className="brand-h1 mb-2"
          style={{ letterSpacing: "var(--letter-spacing-premium-title)" }}
        >
          The 2pm crash isn&apos;t you.
        </h2>
        <p className="mt-2 text-black/65 max-w-prose">
          Caffeine peaks at 9, crashes by 2. CONKA Flow and Clear keep you
          covered from morning to evening.
        </p>
      </div>

      {/* ==================================================================
          CARD 1 — TIME-IN-EFFECT CHART
          Two rows, bars sweep L→R when section enters view.
         ================================================================== */}
      <div className="border border-black/12 bg-white p-5 lg:p-8 mb-6">
        {/* Chart header */}
        <div className="mb-6 pb-4 border-b border-black/8">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 mb-1.5 tabular-nums">
            Fig. 01 · Time in effect
          </p>
          <h3 className="text-lg lg:text-xl font-semibold text-black leading-snug">
            Who&apos;s covering you, hour by hour.
          </h3>
        </div>

        {/* Hour axis labels */}
        <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.08em] text-black/40 tabular-nums mb-1.5">
          {HOUR_MARKS.map((h) => (
            <span key={h}>{String(h).padStart(2, "0")}</span>
          ))}
        </div>

        {/* Hairline axis + tick marks */}
        <div className="relative h-px bg-black/15 mb-5">
          {HOUR_MARKS.map((h, i) => (
            <span
              key={h}
              className="absolute top-0 w-px h-1.5 bg-black/25"
              style={{ left: `${(i / (HOUR_MARKS.length - 1)) * 100}%` }}
              aria-hidden
            />
          ))}
        </div>

        {/* Series */}
        <ChartRow
          label="Coffee"
          caption="peak 08–11 · crash 11–14"
          labelColor="text-black/75"
          bands={COFFEE_BANDS}
          isInView={isInView}
        />
        <ChartRow
          label="CONKA Flow"
          caption="Morning focus · 06:00 — 12:00"
          labelColor="text-[#1B2757]"
          bands={FLOW_BANDS}
          isInView={isInView}
        />
        <ChartRow
          label="CONKA Clear"
          caption="Afternoon reset · 12:00 — 18:00"
          labelColor="text-[#1B2757]"
          bands={CLEAR_BANDS}
          isInView={isInView}
          isLast
        />

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-black/8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            <LegendSwatch kind="peak" label="Caffeine peak" />
            <LegendSwatch kind="crash" label="Crash" />
            <LegendSwatch kind="conka" label="CONKA coverage" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/35 tabular-nums">
            Caffeine half-life ~5h
          </span>
        </div>
      </div>

      {/* ==================================================================
          CARD 2 — PRICE COMPARISON
          Savings line promoted to title; daily prices are the evidence.
         ================================================================== */}
      <div className="border border-black/12 bg-white p-5 lg:p-8 mb-8">
        {/* Header — mirrors Fig. 01: mono eyebrow + bold black heading */}
        <div className="mb-6 pb-4 border-b border-black/8">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/50 mb-1.5 tabular-nums">
            Fig. 02 · Monthly saving
          </p>
          <h3 className="text-lg lg:text-xl font-semibold text-black leading-snug">
            £{MONTHLY_SAVINGS_VS_COFFEE}/month less than a daily coffee.
          </h3>
        </div>

        <div className="flex flex-col">
          <PriceRow
            label="Coffee"
            price={`£${COFFEE_PRICE_PER_DAY}/day`}
            tone="muted"
          />
          <div className="h-px bg-black/8 my-4" />
          <PriceRow
            label="CONKA (Both)"
            price={`£${PRICE_PER_DAY_BOTH}/day`}
            tone="active"
          />
        </div>
      </div>

      <div className="flex justify-start">
        <ConkaCTAButton meta={null}>Get Both from £{PRICE_PER_SHOT_BOTH}/shot</ConkaCTAButton>
      </div>
      <div className="mt-6">
        <LabTrustBadges />
      </div>
    </div>
  );
}

/* ============================ sub-components ============================== */

const BAND_DURATION_MS = 600;
const BAND_DELAY_STEP_MS = 180;

function bandStyle(b: Band, isInView: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    left: pct(b.start),
    width: `${((b.end - b.start) / RANGE) * 100}%`,
    transform: isInView ? "scaleX(1)" : "scaleX(0)",
    transformOrigin: "left",
    transition: `transform ${BAND_DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1) ${b.delayIndex * BAND_DELAY_STEP_MS}ms`,
  };

  if (b.kind === "crash") {
    return {
      ...base,
      backgroundColor: "rgba(0,0,0,0.04)",
      backgroundImage:
        "repeating-linear-gradient(45deg, rgba(0,0,0,0.22) 0 3px, transparent 3px 7px)",
    };
  }
  if (b.kind === "peak") return { ...base, backgroundColor: "#000" };
  return { ...base, backgroundColor: CONKA_COLOR };
}

function ChartRow({
  label,
  caption,
  labelColor,
  bands,
  isInView,
  isLast = false,
}: {
  label: string;
  caption: string;
  labelColor: string;
  bands: Band[];
  isInView: boolean;
  isLast?: boolean;
}) {
  return (
    <div className={isLast ? "" : "mb-4"}>
      <div className="flex justify-between items-baseline mb-1.5 gap-3">
        <span
          className={`font-mono text-[10px] font-bold uppercase tracking-[0.16em] ${labelColor}`}
        >
          {label}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40 tabular-nums truncate">
          {caption}
        </span>
      </div>
      <div
        className="relative h-6 bg-black/[0.03] overflow-hidden"
        role="img"
        aria-label={`${label} — ${caption}`}
      >
        {bands.map((b, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0"
            style={bandStyle(b, isInView)}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}

function PriceRow({
  label,
  price,
  tone,
}: {
  label: string;
  price: string;
  tone: "muted" | "active";
}) {
  const labelColor = tone === "active" ? "text-[#1B2757]" : "text-black/55";
  const priceColor = tone === "active" ? "text-black" : "text-black/55";
  return (
    <div className="flex items-baseline justify-between gap-3 sm:gap-5">
      <span
        className={`font-mono text-[10px] lg:text-xs font-bold uppercase tracking-[0.14em] truncate ${labelColor}`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-2xl lg:text-3xl font-bold tabular-nums ${priceColor}`}
      >
        {price}
      </span>
    </div>
  );
}

function LegendSwatch({
  kind,
  label,
}: {
  kind: BandKind;
  label: string;
}) {
  const style: React.CSSProperties =
    kind === "peak"
      ? { backgroundColor: "#000" }
      : kind === "crash"
        ? {
            backgroundColor: "rgba(0,0,0,0.04)",
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.35) 0 3px, transparent 3px 7px)",
          }
        : { backgroundColor: CONKA_COLOR };
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block w-5 h-2 border border-black/15"
        style={style}
        aria-hidden
      />
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/55">
        {label}
      </span>
    </span>
  );
}
