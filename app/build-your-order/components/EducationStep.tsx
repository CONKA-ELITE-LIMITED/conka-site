"use client";

/**
 * Build Your Order — Step 1 (Learn).
 *
 * One job: make the two-shot AM/PM system land, fast, so the Build step feels
 * like the obvious next tap. The tall bottle renders carry the story side by
 * side (equal billing, even on mobile); copy stays to one line per formula.
 * Depth deliberately lives on the Build step's disclosures, not here — this
 * step used to carry eight accordion chips that duplicated Build's, and read
 * as homework. One light "how the system works" disclosure remains for the
 * visitor who wants the mechanism before configuring.
 */

import { useState } from "react";
import Image from "next/image";
import { type ByoProduct, getOfferPricing } from "@/app/lib/byoData";
import { formatPrice } from "@/app/lib/productData";

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);

interface Formula {
  product: ByoProduct;
  image: string;
  name: string;
  period: string;
  accentColor: string;
  Icon: () => React.JSX.Element;
  /** The one line this formula gets on this step. */
  job: string;
}

const FORMULAS: Formula[] = [
  {
    product: "flow",
    image: "/formulas/thin/FlowThin.jpg",
    name: "Flow",
    period: "AM",
    accentColor: "#C4892A",
    Icon: SunIcon,
    job: "Calm, sustained focus from the first hour. Zero caffeine.",
  },
  {
    product: "clear",
    image: "/formulas/thin/ClearThin.jpg",
    name: "Clear",
    period: "PM",
    accentColor: "#0369a1",
    Icon: MoonIcon,
    job: "Clears the 2pm fog and holds the afternoon.",
  },
];

/** The mechanism in three beats, for the visitor who wants it before building. */
const HOW_IT_WORKS: { when: string; what: string }[] = [
  { when: "Morning", what: "Flow's six adaptogens lower cortisol, so you reach deep focus without caffeine." },
  { when: "Afternoon", what: "Clear's ten actives flush the oxidative load that builds through the day, the cause of the 2pm dip." },
  { when: "Over weeks", what: "Track the effect in the CONKA app: a 60-second test, a daily score, a visible trend." },
];

const PROOF = [
  "+14.86% sharper thinking vs placebo",
  "Informed Sport certified",
  "622+ reviews · 4.7/5",
];

const ProofCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#1B2757]">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function EducationStep({
  onAccordionOpen,
}: {
  onAccordionOpen?: (id: string) => void;
}) {
  const [howOpen, setHowOpen] = useState(false);
  const toggleHow = () => {
    const next = !howOpen;
    // Report opens only, and from outside the updater: state updaters must be
    // pure, and React double-invokes them under StrictMode.
    if (next) onAccordionOpen?.("learn:how");
    setHowOpen(next);
  };

  return (
    <div>
      {/* The step name already sits in the top chrome, so no eyebrow. */}
      <h2
        className="text-black font-semibold text-[34px] leading-[1.05] mb-3 text-balance"
        style={{ letterSpacing: "-0.02em" }}
      >
        Two shots. All day.
      </h2>

      <p className="text-[15px] leading-snug text-black mb-6">
        Flow sets up your morning. Clear holds your afternoon. Run one, or
        cover the full day.
      </p>

      {/* The pair, side by side on every breakpoint (equal billing). The tall
          renders do the talking; each card carries exactly one line of copy. */}
      <div className="grid grid-cols-2 gap-3">
        {FORMULAS.map((f) => {
          // Lowest per-shot for this formula (its quarterly subscription).
          const fromPrice = formatPrice(getOfferPricing(f.product, "quarterly-sub").perShot);
          return (
            <div key={f.product} className="rounded-md ring-1 ring-black/10 bg-white overflow-hidden flex flex-col">
              <div className="relative aspect-[3/4] w-full bg-[#f1f1f3]">
                <Image
                  src={f.image}
                  alt={`CONKA ${f.name} bottle`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 280px"
                  className="object-cover object-center"
                />
              </div>
              <div className="flex flex-1 flex-col p-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[16px] font-semibold text-black leading-tight">{f.name}</p>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ backgroundColor: `${f.accentColor}1A`, color: f.accentColor }}
                  >
                    <f.Icon />
                    {f.period}
                  </span>
                </div>
                <p className="text-[13px] text-black/70 leading-snug mt-1.5">{f.job}</p>
                <p className="text-[12px] text-black mt-auto pt-2">
                  From <span className="font-bold tabular-nums">{fromPrice}</span>
                  <span className="text-black/50"> per shot</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* One light disclosure for the mechanism. Depth beyond this (full
          ingredient lists, proof stats, athletes) lives on the Build step. */}
      <div className="mt-3 rounded-md ring-1 ring-black/10 bg-white overflow-hidden">
        <button
          type="button"
          onClick={toggleHow}
          aria-expanded={howOpen}
          className="flex w-full min-h-[48px] items-center justify-between gap-2 px-4 text-left text-[14px] font-semibold text-black"
        >
          How the system works
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
            className="shrink-0 text-black/40 transition-transform duration-200"
            style={{ transform: howOpen ? "rotate(180deg)" : "none" }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: howOpen ? "400px" : "0px" }}>
          <div className="px-4 pb-4 flex flex-col gap-2.5">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.when} className="flex items-start gap-3">
                <span className="shrink-0 min-w-[76px] rounded-full bg-black/[0.05] px-2.5 py-1.5 text-center text-[12px] font-bold text-black leading-none">
                  {s.when}
                </span>
                <p className="text-[13px] text-black/75 leading-snug pt-1">{s.what}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proof, in three quiet beats. */}
      <div className="mt-4 flex flex-col gap-2">
        {PROOF.map((item) => (
          <span key={item} className="flex items-center gap-2 text-[12px] font-semibold text-black/60">
            <ProofCheck />
            {item}
          </span>
        ))}
      </div>

      {/* The nudge toward the recommended configuration, in the offer colour. */}
      <div
        className="flex items-start gap-2.5 mt-4 p-3.5 rounded-md"
        style={{ background: "linear-gradient(90deg, #cdeecf, #e9f5c9)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" fill="#14532d" />
          <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-[14px] text-[#14532d] leading-snug">
          <strong className="font-semibold">Most people take both.</strong>{" "}
          Morning to evening cover, at the lowest price per shot.
        </p>
      </div>
    </div>
  );
}
