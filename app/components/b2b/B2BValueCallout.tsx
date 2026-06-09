"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { B2B_PRODUCTS, B2B_TIERS, getB2BTier } from "@/app/lib/b2bPricing";

/* ============================================================================
 * B2BValueCallout - squad cost estimator
 *
 * The value-framing beat for the /professionals landing. Turns a daunting order
 * total into a number the buyer can act on: the total cost leads (that is what
 * people anchor on), reframed underneath into a figure they can justify
 * internally. Two estimator modes, switched by a toggle (both ex VAT, ex
 * shipping, and always labelled an estimate; both feed the page's apply CTA):
 *
 *   - "By squad & season" (squad): dial in squad size and season length. Assumes
 *     one Flow and one Clear shot per athlete per day (kept equal; no
 *     single-product emphasis). Shots per format = players x dosing days,
 *     rounded UP to whole boxes per format. Reframed as a per-athlete-per-day
 *     figure.
 *   - "By the box" (box): the buyer who already thinks in boxes picks Flow and
 *     Clear box counts directly. Reframed as a per-box figure + total shots.
 *
 * Model (one source of truth, B2B_TIERS + 28 shots/box):
 *   - The combined box total (Flow + Clear) picks the tier; that per-box rate
 *     prices every box, in both modes.
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

type Mode = "squad" | "box";

const MODES = [
  { key: "squad", label: "By squad & season" },
  { key: "box", label: "By the box" },
] as const;

export default function B2BValueCallout() {
  const [mode, setMode] = useState<Mode>("squad");

  // "By squad & season" inputs
  const [players, setPlayers] = useState(16);
  const [weeks, setWeeks] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState<5 | 7>(5);

  // "By the box" inputs
  const [flowBoxes, setFlowBoxes] = useState(12);
  const [clearBoxes, setClearBoxes] = useState(12);

  // Squad-derived boxes: one Flow + one Clear per athlete per day, rounded up
  // to whole boxes per format.
  const days = weeks * daysPerWeek;
  const squadBoxesPerFormat = Math.ceil((players * days) / SHOTS_PER_BOX);
  const squadTotalBoxes = squadBoxesPerFormat * 2;

  // Active figures: the combined box total picks the tier in both modes.
  const totalBoxes = mode === "squad" ? squadTotalBoxes : flowBoxes + clearBoxes;
  const hasOrder = totalBoxes > 0;
  const tier = getB2BTier(totalBoxes);
  const totalExVat = totalBoxes * tier.pricePerBox;
  const totalShots = totalBoxes * SHOTS_PER_BOX;
  const perAthletePerDay = totalExVat / players / days;

  return (
    <div>
      <p className="brand-eyebrow mb-4">{"// Cost estimator"}</p>
      <h2 className="brand-h2" style={{ letterSpacing: "-0.02em" }}>
        {mode === "squad"
          ? "What it costs to run your squad."
          : "Build your estimate by the box."}
      </h2>
      <p className="mt-4 text-base text-black/80 leading-relaxed max-w-[48ch]">
        {mode === "squad"
          ? "Dial in your squad and season. We assume one CONKA Flow and one Clear per athlete, per day. Prices shown ex VAT and ex shipping."
          : "Pick how many boxes of each you need. Your per-box price drops as the combined total grows. Prices shown ex VAT and ex shipping."}
      </p>

      {/* MODE TOGGLE */}
      <div
        className="mt-7 inline-flex border border-black/15"
        role="group"
        aria-label="Estimate mode"
      >
        {MODES.map((m, i) => {
          const active = mode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              aria-pressed={active}
              style={active ? { backgroundColor: ACCENT, color: "#fff" } : undefined}
              className={`min-h-[48px] px-5 sm:px-6 text-sm font-medium transition-colors ${
                i > 0 ? "border-l border-black/15" : ""
              } ${active ? "" : "text-black/70 hover:bg-black/[0.03]"}`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
        {/* CONTROLS */}
        <div className="border border-black/12 bg-white p-6 lg:p-7 flex flex-col gap-9">
          {mode === "squad" ? (
            <>
              <Slider
                label="Squad size"
                value={players}
                min={1}
                max={60}
                unit={players === 1 ? "player" : "players"}
                onChange={setPlayers}
                media={
                  <MediaIcon>
                    <IconSquad />
                  </MediaIcon>
                }
              />
              <Slider
                label="Season length"
                value={weeks}
                min={2}
                max={40}
                unit={weeks === 1 ? "week" : "weeks"}
                onChange={setWeeks}
                media={
                  <MediaIcon>
                    <IconSeason />
                  </MediaIcon>
                }
              />

              <div className="border-t border-black/8 pt-8 flex flex-wrap items-center justify-between gap-4">
                <span className={`${LABEL} inline-flex items-center gap-2`}>
                  <span style={{ color: ACCENT }} aria-hidden="true">
                    <IconDose />
                  </span>
                  Dosing days per week
                </span>
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
            </>
          ) : (
            <>
              <Slider
                label="CONKA Flow boxes"
                value={flowBoxes}
                min={0}
                max={60}
                unit={flowBoxes === 1 ? "box" : "boxes"}
                onChange={setFlowBoxes}
                media={<MediaBox productKey="flow" />}
              />
              <Slider
                label="CONKA Clear boxes"
                value={clearBoxes}
                min={0}
                max={60}
                unit={clearBoxes === 1 ? "box" : "boxes"}
                onChange={setClearBoxes}
                media={<MediaBox productKey="clear" />}
              />
              <p className="border-t border-black/8 pt-8 text-sm text-black/55 leading-relaxed">
                28 shots per box. Your per-box price is set by the combined total
                of Flow and Clear.
              </p>
            </>
          )}
        </div>

        {/* RESULT — total leads (largest), reframed by the active mode below */}
        <div className="border border-black/12 bg-white p-6 lg:p-7 flex flex-col">
          <span className={LABEL}>Total cost, ex VAT</span>
          <span className="mt-1 text-[2.75rem] sm:text-6xl lg:text-7xl font-semibold tabular-nums tracking-[-0.03em] text-black leading-none">
            {hasOrder ? gbp0(totalExVat) : "—"}
          </span>
          {mode === "squad" ? (
            <p className="mt-3 text-base text-black">
              That&apos;s{" "}
              <span className="font-semibold tabular-nums">
                {gbp2(perAthletePerDay)}
              </span>{" "}
              per athlete, per day.
            </p>
          ) : hasOrder ? (
            <p className="mt-3 text-base text-black">
              That&apos;s{" "}
              <span className="font-semibold tabular-nums">
                {gbp0(tier.pricePerBox)}
              </span>{" "}
              per box, for {totalShots.toLocaleString()} shots.
            </p>
          ) : (
            <p className="mt-3 text-base text-black/55">
              Add boxes to see your estimate.
            </p>
          )}

          <dl className="mt-6 border-t border-black/10 pt-5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className={LABEL}>Boxes needed</dt>
              <dd className="tabular-nums whitespace-nowrap text-right text-sm text-black">
                {mode === "squad"
                  ? `${totalBoxes} (${squadBoxesPerFormat} Flow + ${squadBoxesPerFormat} Clear)`
                  : `${totalBoxes} (${flowBoxes} Flow + ${clearBoxes} Clear)`}
              </dd>
            </div>
          </dl>

          {/* Volume tier ladder - active rate highlighted, cheaper rows below
              show what scaling up unlocks. */}
          <div className="mt-6 border border-black/12">
            {B2B_TIERS.map((t, i) => {
              const active = hasOrder && t.label === tier.label;
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
            {mode === "squad"
              ? `Estimate only. Based on one Flow and one Clear per athlete per day over ${weeks} ${
                  weeks === 1 ? "week" : "weeks"
                }. Boxes are rounded up. Shipping and VAT are added at checkout.`
              : "Estimate only. Based on the boxes you select. Shipping and VAT are added at checkout."}
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
  media,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (next: number) => void;
  // Optional 56px leading visual: a product box image (box mode) or an icon
  // (squad mode) that gives the bar immediate intuition.
  media?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      {media}
      <div className="flex-1 min-w-0">
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
    </div>
  );
}

/* Leading visuals for the sliders -------------------------------------------- */

// Bordered 56px square holding an accent-coloured icon (squad mode).
function MediaIcon({ children }: { children: ReactNode }) {
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center border border-black/12 bg-white"
      style={{ color: ACCENT }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

// Single-shot bottle render, contained in a large tile (box mode). Flow carries
// the black cap, Clear the white cap, so the bottle alone reads the format.
const BOX_MEDIA: Record<"flow" | "clear", { src: string; alt: string }> = {
  flow: { src: "/formulas/conkaFlow/FlowNew.jpg", alt: "CONKA Flow shot bottle" },
  clear: { src: "/formulas/conkaClear/ClearNew.jpg", alt: "CONKA Clear shot bottle" },
};

function MediaBox({ productKey }: { productKey: "flow" | "clear" }) {
  const media = BOX_MEDIA[productKey];
  return (
    <span className="relative block h-24 w-24 shrink-0 overflow-hidden border border-black/12 bg-white">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes="96px"
        className="object-contain p-1.5"
      />
    </span>
  );
}

function IconSquad() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3 3 0 0 1 0 5.6" />
      <path d="M17.5 14.2a6 6 0 0 1 3.5 5.8" />
    </svg>
  );
}

function IconSeason() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4.5" width="18" height="16" rx="1.5" />
      <path d="M3 9.5h18" />
      <path d="M8 3v3M16 3v3" />
    </svg>
  );
}

function IconDose() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3z" />
    </svg>
  );
}
