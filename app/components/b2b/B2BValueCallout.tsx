"use client";

import { useState } from "react";
import { B2B_PRODUCTS, B2B_TIERS, getB2BTier } from "@/app/lib/b2bPricing";

/* ============================================================================
 * B2BValueCallout - squad cost estimator
 *
 * The value-framing beat for the /professionals landing. Turns a daunting order
 * total into a number the buyer can act on: the total cost leads (that is what
 * people anchor on), reframed underneath as a small per-athlete-per-day figure
 * they can justify internally. Interactive: dial in squad size and season
 * length, watch the cost and the volume tier update live.
 *
 * Model (one source of truth, B2B_TIERS + 28 shots/box):
 *   - Assumes one Flow shot and one Clear shot per athlete per day (kept equal;
 *     no single-product emphasis).
 *   - Shots per format = players x dosing days. Rounded UP to whole boxes per
 *     format, because that is what a club actually orders.
 *   - Combined box total picks the tier; that per-box rate prices every box.
 *   - All ex VAT (B2B budgets ex VAT) and ex shipping. Labelled an estimate.
 *
 * Typography: regular sans for everything the buyer reads (labels, copy, in
 * black for legibility). The mono/clinical font is reserved for the section
 * eyebrow only, not body or control labels.
 *
 * Content-only Client Component (the page owns the section wrapper).
 * ========================================================================== */

const ACCENT = "var(--brand-accent)"; // navy #1B2757 under brand-clinical
const SHOTS_PER_BOX = B2B_PRODUCTS.flow.shotsPerBox; // 28

const gbp0 = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const gbp2 = (n: number) => `£${n.toFixed(2)}`;

// Regular-sans control/result label: black, readable, not the mono micro-label.
const LABEL = "text-sm font-medium text-black";

export default function B2BValueCallout() {
  const [players, setPlayers] = useState(16);
  const [weeks, setWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState<5 | 7>(5);

  const days = weeks * daysPerWeek;
  const shotsPerFormat = players * days; // one Flow + one Clear per athlete per day
  const boxesPerFormat = Math.ceil(shotsPerFormat / SHOTS_PER_BOX);
  const totalBoxes = boxesPerFormat * 2;
  const tier = getB2BTier(totalBoxes);
  const totalExVat = totalBoxes * tier.pricePerBox;
  const perAthletePerDay = totalExVat / players / days;

  return (
    <div>
      <p className="brand-eyebrow mb-4">{"// Cost estimator"}</p>
      <h2 className="brand-h2 max-w-[20ch]" style={{ letterSpacing: "-0.02em" }}>
        What it costs to run your squad.
      </h2>
      <p className="mt-4 text-base text-black/80 leading-relaxed max-w-[48ch]">
        Dial in your squad and season. We assume one CONKA Flow and one Clear per
        athlete, per day. Prices shown ex VAT and ex shipping.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
        {/* CONTROLS */}
        <div className="border border-black/12 bg-white p-6 lg:p-7 flex flex-col gap-9">
          <Slider
            label="Squad size"
            value={players}
            min={1}
            max={60}
            unit={players === 1 ? "player" : "players"}
            onChange={setPlayers}
          />
          <Slider
            label="Season length"
            value={weeks}
            min={2}
            max={40}
            unit={weeks === 1 ? "week" : "weeks"}
            onChange={setWeeks}
          />

          <div className="border-t border-black/8 pt-8 flex flex-wrap items-center justify-between gap-4">
            <span className={LABEL}>Dosing days per week</span>
            <div className="inline-flex border border-black/15">
              {([5, 7] as const).map((d) => {
                const active = daysPerWeek === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDaysPerWeek(d)}
                    aria-pressed={active}
                    style={
                      active ? { backgroundColor: ACCENT, color: "#fff" } : undefined
                    }
                    className={`min-h-[48px] px-6 text-sm font-medium tabular-nums transition-colors ${
                      d === 7 ? "border-l border-black/15" : ""
                    } ${active ? "" : "text-black/70 hover:bg-black/[0.03]"}`}
                  >
                    {d} days
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RESULT — total leads (largest), reframed as per-athlete-per-day below */}
        <div className="border border-black/12 bg-white p-6 lg:p-7 flex flex-col">
          <span className={LABEL}>Total cost, ex VAT</span>
          <span className="mt-1 text-[2.75rem] sm:text-6xl lg:text-7xl font-semibold tabular-nums tracking-[-0.03em] text-black leading-none">
            {gbp0(totalExVat)}
          </span>
          <p className="mt-3 text-base text-black">
            That&apos;s{" "}
            <span className="font-semibold tabular-nums">
              {gbp2(perAthletePerDay)}
            </span>{" "}
            per athlete, per day.
          </p>

          <dl className="mt-6 border-t border-black/10 pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className={LABEL}>Boxes needed</dt>
              <dd className="tabular-nums whitespace-nowrap text-right text-sm text-black">
                {totalBoxes} ({boxesPerFormat} Flow + {boxesPerFormat} Clear)
              </dd>
            </div>
          </dl>

          {/* Volume tier ladder - active rate highlighted, cheaper rows below
              show what scaling up unlocks. */}
          <div className="mt-6 border border-black/12">
            {B2B_TIERS.map((t, i) => {
              const active = t.label === tier.label;
              const range =
                t.maxBoxes === null
                  ? `${t.minBoxes}+ boxes`
                  : `${t.minBoxes}-${t.maxBoxes} boxes`;
              return (
                <div
                  key={t.label}
                  style={
                    active ? { backgroundColor: ACCENT, color: "#fff" } : undefined
                  }
                  className={`flex items-baseline justify-between gap-3 px-3.5 py-2.5 text-sm ${
                    i > 0 ? "border-t border-black/12" : ""
                  } ${active ? "" : "text-black/70"}`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-medium">{t.label}</span>
                    <span className={active ? "opacity-80" : "text-black/45"}>
                      {range}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums whitespace-nowrap">
                    £{t.pricePerBox}
                    <span className="font-normal opacity-60"> / box</span>
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-xs text-black/40 leading-relaxed">
            Estimate only. Based on one Flow and one Clear per athlete per day over{" "}
            {weeks} {weeks === 1 ? "week" : "weeks"}. Boxes are rounded up. Shipping
            and VAT are added at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className={LABEL}>{label}</span>
        <span className="tabular-nums">
          <span className="text-2xl font-semibold text-black">{value}</span>
          <span className="text-sm text-black/60"> {unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-label={label}
        aria-valuetext={`${value} ${unit}`}
        style={{ accentColor: ACCENT }}
        className="mt-3 w-full cursor-pointer"
      />
    </div>
  );
}
