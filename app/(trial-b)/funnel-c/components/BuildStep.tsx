"use client";

/**
 * funnel-c — Step 2 (Build). Product + plan on one page.
 *
 * Formula tiles (Flow pre-selected, Both flagged as the recommended upgrade)
 * drive the left media and the summary card, whose detail sits behind disclosure
 * chips. Then the plan cards. The sticky footer reflects the live selection and
 * price.
 */

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  type FunnelProduct,
  type FunnelCadence,
  FUNNEL_PRODUCTS,
} from "../../lib/funnelData";
import CadenceSelector from "./CadenceSelector";
import FunnelMedia from "./FunnelMedia";

interface BuildStepProps {
  product: FunnelProduct;
  cadence: FunnelCadence;
  onProductChange: (p: FunnelProduct) => void;
  onCadenceChange: (c: FunnelCadence) => void;
  onAccordionOpen?: (id: string) => void;
}

// Flow leads (it is the pre-selected default), then Clear, with Both last as
// the recommended upgrade.
const PRODUCT_ORDER: FunnelProduct[] = ["flow", "clear", "both"];
const TOGGLE: Record<FunnelProduct, { name: string; period: string }> = {
  flow: { name: "Flow", period: "Morning" },
  clear: { name: "Clear", period: "Afternoon" },
  both: { name: "Both", period: "All day" },
};

// Blurb + proof stats, lifted from the product pages (formulaContent.ts /
// BOTH_HERO_CONTENT) so the funnel carries real weight.
//
// The stats panel is "Proof", not "Impact": the numbers are a mix of measured
// outcomes from the ingredient studies and hard product facts, and pretending
// a spec count ("6 adaptogens") is an outcome was what made the old panel read
// as spin. Each label now says plainly which kind of number it is.
const COPY: Record<FunnelProduct, { blurb: string; stats: { value: string; label: string }[] }> = {
  flow: {
    blurb: "Sharper focus and calmer energy from the first hour — six clinically-dosed adaptogens, zero caffeine, zero crash.",
    stats: [
      { value: "−56%", label: "lower stress scores in studies" },
      { value: "6", label: "clinically dosed adaptogens" },
      { value: "0", label: "caffeine, so no crash" },
    ],
  },
  clear: {
    blurb: "Cut through brain fog and think clearly under pressure — ten clinically-dosed actives, including Alpha-GPC and Ginkgo Biloba.",
    stats: [
      { value: "+96%", label: "attention in studies" },
      { value: "+57%", label: "cerebral blood flow in studies" },
      { value: "10", label: "clinically dosed nootropics" },
    ],
  },
  both: {
    blurb: "Flow for the morning, Clear for the afternoon — two clinically-dosed shots covering the full cognitive day, no stimulants, no crash.",
    stats: [
      { value: "15", label: "active ingredients across both" },
      { value: "150k+", label: "shots delivered to date" },
      { value: "622+", label: "reviews, rated 4.7 out of 5" },
    ],
  },
};

// Ingredient renders (same images as the site's ingredients section).
const FLOW_ING = [
  { name: "Lemon Balm", img: "/ingredients/renders/LemonBalm.jpg" },
  { name: "Turmeric", img: "/ingredients/renders/Turmeric.jpg" },
  { name: "Ashwagandha", img: "/ingredients/renders/Ashwagandha.jpg" },
  { name: "Rhodiola rosea", img: "/ingredients/renders/RhodiolaRosea.jpg" },
  { name: "Bilberry", img: "/ingredients/renders/Bilberry.jpg" },
  { name: "Black Pepper", img: "/ingredients/renders/BlackPepper.jpg" },
];
const CLEAR_ING = [
  { name: "Alpha-GPC", img: "/ingredients/renders/AlphaGPC.jpg" },
  { name: "Glutathione", img: "/ingredients/renders/11.jpg" },
  { name: "Ginkgo Biloba", img: "/ingredients/renders/GinkgoBiloba.jpg" },
  { name: "N-Acetyl Cysteine", img: "/ingredients/renders/NAcetylCysteine.jpg" },
  { name: "Acetyl-L-Carnitine", img: "/ingredients/renders/11.jpg" },
  { name: "Vitamin B12", img: "/ingredients/renders/VitaminB12.jpg" },
  { name: "Vitamin C", img: "/ingredients/renders/VitaminC.jpg" },
  { name: "Lecithin", img: "/ingredients/renders/Lecithin.jpg" },
  { name: "Alpha Lipoic Acid", img: "/ingredients/renders/AlphaLipoicAcid.jpg" },
];
const INGREDIENTS_IMG: Record<FunnelProduct, { name: string; img: string }[]> = {
  flow: FLOW_ING,
  clear: CLEAR_ING,
  both: [...FLOW_ING, ...CLEAR_ING],
};
const ACTIVE_COUNT: Record<FunnelProduct, number> = { flow: 6, clear: 10, both: 15 };

// "How it works" as a when → what action list (timings referenced across the site).
const HOW_STEPS: Record<FunnelProduct, { when: string; what: string }[]> = {
  flow: [
    { when: "Morning", what: "Take with or without breakfast — no caffeine, no jitters." },
    { when: "~45 min", what: "Calm, focused energy sets in as the adaptogens take hold." },
    { when: "Day 7", what: "Cleaner, earlier focus becomes the norm — less morning warm-up." },
  ],
  clear: [
    { when: "1–2pm", what: "Take as the afternoon dip approaches." },
    { when: "~45 min", what: "Brain fog lifts and thinking sharpens." },
    { when: "Day 3–5", what: "The 2–3pm dip noticeably eases; afternoons hold." },
  ],
  both: [
    { when: "AM", what: "Flow in the morning for calm, sustained focus." },
    { when: "1–2pm", what: "Clear in the afternoon for precision and output." },
    { when: "Week 1", what: "Full morning-to-evening cognitive cover, no crash." },
  ],
};

const ATHLETES = [
  { name: "Dan Norton", sport: "Rugby Sevens · Olympic Silver" },
  { name: "Chris Billam-Smith", sport: "Boxing · WBO World Champion" },
  { name: "Fraser Dingwall", sport: "Rugby Union · England" },
  { name: "Sienna Charles", sport: "Showjumping · Team GB" },
  { name: "Josh Stanton", sport: "Motorsport · British GT" },
  { name: "Adam Azim", sport: "Boxing · Undefeated Pro" },
];

type InfoKey = "ingredients" | "how" | "athletes" | "impact";
const ROW_TABS: { key: InfoKey; label: string }[] = [
  { key: "ingredients", label: "Ingredients" },
  { key: "how", label: "How it works" },
  { key: "athletes", label: "Used by" },
  { key: "impact", label: "Proof" },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

/**
 * Animated count-up for the Proof stats. Parses a value like "−56%", "+96%",
 * "150k+" into prefix / number / suffix and eases the number 0 → target on
 * mount (the panel only mounts when opened). Values with no digits render
 * as-is. Honours reduced-motion.
 */
function CountUp({ value }: { value: string }) {
  const m = value.match(/^(\D*)(\d[\d.]*)(\D*)$/);
  const [n, setN] = useState(0);

  useEffect(() => {
    const mm = value.match(/^(\D*)(\d[\d.]*)(\D*)$/);
    if (!mm) return;
    const target = Math.round(parseFloat(mm[2]));
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const dur = 1100;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  if (!m) return <>{value}</>;
  return (
    <>
      {m[1]}
      {n}
      {m[3]}
    </>
  );
}

export default function BuildStep({
  product,
  cadence,
  onProductChange,
  onCadenceChange,
  onAccordionOpen,
}: BuildStepProps) {
  const display = FUNNEL_PRODUCTS[product];
  const copy = COPY[product];
  const [openInfo, setOpenInfo] = useState<InfoKey | null>(null);
  const toggleInfo = (k: InfoKey) => {
    const next = openInfo === k ? null : k;
    // Report opens only, and from outside the updater: state updaters must be
    // pure, and React double-invokes them under StrictMode.
    if (next) onAccordionOpen?.(`build:${next}`);
    setOpenInfo(next);
  };

  // Ingredients pagination — always 6 per page (Both has 15, so it pages).
  const [ingPage, setIngPage] = useState(0);
  useEffect(() => setIngPage(0), [product]);
  const ingList = INGREDIENTS_IMG[product];
  const ING_PAGE_SIZE = 6;
  const ingPages = Math.max(1, Math.ceil(ingList.length / ING_PAGE_SIZE));
  const ingSafePage = Math.min(ingPage, ingPages - 1);
  const ingItems = ingList.slice(ingSafePage * ING_PAGE_SIZE, ingSafePage * ING_PAGE_SIZE + ING_PAGE_SIZE);

  return (
    <div>
      <h2
        className="text-black font-semibold text-[34px] leading-[1.05] mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        Build your order.
      </h2>

      {/* 1. Formula */}
      <p className="text-[15px] font-semibold text-black mb-3">
        <span className="text-black/40 tabular-nums mr-1.5">1</span>
        Choose your formula
      </p>
      <div className="flex gap-2.5">
        {PRODUCT_ORDER.map((p) => {
          const t = TOGGLE[p];
          const active = product === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onProductChange(p)}
              aria-pressed={active}
              className={`relative flex-1 flex flex-col items-center justify-center rounded-[14px] border-2 px-2 py-4 transition-colors ${
                active
                  ? "border-[#1B2757] bg-[#1B2757] text-white"
                  : "border-black/10 bg-white text-black hover:border-black/25"
              }`}
            >
              {p === "both" && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${
                    active ? "bg-[#10B981] text-white" : "bg-black text-white"
                  }`}
                >
                  Recommended
                </span>
              )}
              <span className="text-[16px] font-semibold leading-tight">{t.name}</span>
              <span className={`text-[12px] leading-tight mt-1 ${active ? "text-white/70" : "text-black/50"}`}>
                {t.period}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product summary + info dropdowns */}
      <div className="mt-3.5 rounded-[16px] border-2 border-black/85 bg-white overflow-hidden">
        <div className="p-4 flex gap-4">
          {/* Mobile: video on the left, content beside it; the column stretches
              to the content height (desktop uses the sticky left column, so the
              video is hidden and the content takes the full width). */}
          <div className="lg:hidden shrink-0 w-24 self-stretch rounded-[12px] bg-black/[0.04] overflow-hidden">
            <FunnelMedia product={product} showCaption={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[17px] font-semibold text-black leading-tight">{display.label}</p>
              <span className="shrink-0 rounded-full bg-[#1B2757]/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#1B2757]">
                {display.timeLabel}
              </span>
            </div>
            <p className="text-[14px] text-black/70 leading-snug mt-2">{copy.blurb}</p>
          </div>
        </div>

        {/* Disclosure chips — same language as the Learn step's cards. A 2x2
            grid rather than flex-wrap: four equal tiles fill the row instead of
            leaving a ragged gap where the last chip does not reach. */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-4">
          {ROW_TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => toggleInfo(t.key)}
              className={`flex items-center justify-between gap-1.5 min-h-[44px] w-full rounded-full px-4 text-[13px] font-medium transition-colors ${
                openInfo === t.key
                  ? "bg-[#1B2757] text-white"
                  : "bg-black/[0.05] text-black/70 hover:bg-black/[0.09] hover:text-black"
              }`}
            >
              {t.label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-200 shrink-0" style={{ transform: openInfo === t.key ? "rotate(180deg)" : "none" }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Disclosure panels */}
        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openInfo ? "1100px" : "0px" }}>
          <div className="mx-4 mb-4 rounded-[12px] bg-black/[0.03] p-4">
            {openInfo === "ingredients" && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[13px] font-semibold text-black">
                    {ACTIVE_COUNT[product]} actives · 30ml shot
                  </p>
                  {ingPages > 1 && (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIngPage(Math.max(0, ingSafePage - 1))}
                        disabled={ingSafePage === 0}
                        aria-label="Previous ingredients"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-black/50 hover:bg-black/[0.06] hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <span className="text-[12px] tabular-nums text-black/50">{ingSafePage + 1} / {ingPages}</span>
                      <button
                        type="button"
                        onClick={() => setIngPage(Math.min(ingPages - 1, ingSafePage + 1))}
                        disabled={ingSafePage === ingPages - 1}
                        aria-label="More ingredients"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-black/50 hover:bg-black/[0.06] hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                  {ingItems.map((ing) => (
                    <div key={ing.name} className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-full aspect-square rounded-[10px] bg-white overflow-hidden">
                        <Image src={ing.img} alt={ing.name} width={140} height={140} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-black leading-tight">{ing.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {openInfo === "how" && (
              <div className="flex flex-col gap-2.5">
                {HOW_STEPS[product].map((s) => (
                  <div key={s.when} className="flex items-start gap-3">
                    <span className="shrink-0 min-w-[72px] rounded-full bg-white px-2.5 py-1.5 text-center text-[12px] font-bold text-[#1B2757] leading-none">
                      {s.when}
                    </span>
                    <p className="text-[14px] text-black leading-snug pt-1">{s.what}</p>
                  </div>
                ))}
              </div>
            )}
            {openInfo === "athletes" && (
              <>
                <p className="text-[13px] font-semibold text-black mb-3">
                  Informed Sport certified. Used by pros.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                  {ATHLETES.map((a) => (
                    <div key={a.name} className="flex items-start gap-2">
                      <CheckIcon />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-black leading-tight">{a.name}</p>
                        <p className="text-[12px] text-black/55 mt-0.5 leading-tight">{a.sport}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {openInfo === "impact" && (
              <>
                {/* Stacked rows, not a 3-across grid: the labels are sentences
                    now, and three columns of wrapped sentence fragments at
                    390px was the other half of why this panel read badly. */}
                <div className="flex flex-col gap-2">
                  {copy.stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 rounded-[10px] bg-white px-3 py-2.5">
                      <span className="min-w-[68px] shrink-0 text-[24px] font-bold text-[#1B2757] tabular-nums leading-none tracking-tight">
                        <CountUp value={s.value} />
                      </span>
                      <span className="text-[13px] text-black leading-snug">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-black">
                    UK Patent GB2629279
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-black">
                    Informed Sport certified
                  </span>
                </div>

                <p className="text-[11px] text-black/45 mt-2.5 leading-snug">
                  Study figures come from peer-reviewed research on the active
                  ingredients, not on the finished drink.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Plan */}
      <p className="text-[15px] font-semibold text-black mt-8 mb-3">
        <span className="text-black/40 tabular-nums mr-1.5">2</span>
        Choose your plan
      </p>
      <CadenceSelector product={product} cadence={cadence} onChange={onCadenceChange} />
    </div>
  );
}
