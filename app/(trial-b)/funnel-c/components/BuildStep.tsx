"use client";

/**
 * funnel-c — Step 2 (Build). Product + plan on one page.
 *
 * Top: a condensed inline formula toggle (Flow / Clear / Both with period in
 * parens) that drives the left media + summary. Then a product summary with
 * progressive-disclosure dropdowns (ingredients, how it works, athletes).
 * Then the plan cards. The sticky footer reflects the live selection + price.
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

const PRODUCT_ORDER: FunnelProduct[] = ["flow", "clear", "both"];
const TOGGLE: Record<FunnelProduct, { name: string; period: string }> = {
  flow: { name: "Flow", period: "Morning" },
  clear: { name: "Clear", period: "Afternoon" },
  both: { name: "Both", period: "AM + PM" },
};

// Punchy descriptor + blurb + proof stats, lifted from the product pages
// (formulaContent.ts / BOTH_HERO_CONTENT) so the funnel carries real weight.
const COPY: Record<FunnelProduct, { descriptor: string; blurb: string; stats: { value: string; label: string }[] }> = {
  flow: {
    descriptor: "Designed for daily cognitive enhancement",
    blurb: "Sharper focus and calmer energy from the first hour — six clinically-dosed adaptogens, zero caffeine, zero crash.",
    stats: [
      { value: "−56%", label: "stress scores" },
      { value: "6", label: "adaptogens" },
      { value: "0", label: "caffeine" },
    ],
  },
  clear: {
    descriptor: "Strategic enhancement for high-stakes moments",
    blurb: "Cut through brain fog and think clearly under pressure — ten clinically-dosed actives, including Alpha-GPC and Ginkgo Biloba.",
    stats: [
      { value: "+96%", label: "attention" },
      { value: "+57%", label: "blood flow" },
      { value: "10", label: "nootropics" },
    ],
  },
  both: {
    descriptor: "The complete daily performance system",
    blurb: "Flow for the morning, Clear for the afternoon — two clinically-dosed shots covering the full cognitive day, no stimulants, no crash.",
    stats: [
      { value: "15", label: "active ingredients" },
      { value: "150k+", label: "shots delivered" },
      { value: "AM+PM", label: "full-day cover" },
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
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

/**
 * Animated count-up for the Impact stats. Parses a value like "−56%", "+96%",
 * "150k+" into prefix / number / suffix and eases the number 0 → target on
 * mount (the Impact panel only mounts when opened). Non-numeric values
 * ("AM+PM") render as-is. Honours reduced-motion.
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
  const toggleInfo = (k: InfoKey) =>
    setOpenInfo((prev) => {
      const next = prev === k ? null : k;
      // Only report opens. A close is not a signal of interest.
      if (next) onAccordionOpen?.(`build:${next}`);
      return next;
    });

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
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 02 · Build
      </p>
      <h2
        className="text-xl lg:text-3xl font-semibold tracking-[var(--brand-h2-tracking)] mb-5"
        style={{ color: "var(--brand-black)" }}
      >
        Build your order
      </h2>

      {/* Formula toggle — condensed inline */}
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 mb-2.5">
        1 · Formula
      </p>
      <div className="flex gap-2">
        {PRODUCT_ORDER.map((p) => {
          const t = TOGGLE[p];
          const active = product === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onProductChange(p)}
              className={`relative flex-1 flex items-baseline justify-center gap-1.5 border py-2.5 px-2 transition-colors ${
                active
                  ? "border-[#1B2757] bg-[#1B2757] text-white"
                  : "border-black/15 bg-white text-[var(--brand-black)] hover:border-black/30"
              }`}
            >
              {p === "both" && (
                <span
                  className={`lab-clip-tr absolute -top-[7px] left-1/2 -translate-x-1/2 font-mono text-[7px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 whitespace-nowrap ${
                    active ? "bg-white text-[#1B2757]" : "bg-[#1B2757] text-white"
                  }`}
                >
                  Recommended
                </span>
              )}
              <span className="text-sm font-semibold leading-none">{t.name}</span>
              <span className={`text-[11px] leading-none ${active ? "text-white/65" : "text-black/40"}`}>
                ({t.period})
              </span>
            </button>
          );
        })}
      </div>

      {/* Product summary + info dropdowns */}
      <div className="mt-3 border border-black/10 bg-white">
        <div className="p-4 flex gap-4">
          {/* Mobile: video on the left, content beside it; the column stretches
              to the content height (desktop uses the sticky left column, so the
              video is hidden and the content takes the full width). */}
          <div className="lg:hidden shrink-0 w-28 self-stretch bg-[var(--brand-tint)] overflow-hidden">
            <FunnelMedia product={product} showCaption={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-semibold text-[var(--brand-black)] leading-tight">{display.label}</p>
                <p className="text-[15px] font-medium text-[#1B2757] mt-1 leading-snug">{copy.descriptor}</p>
              </div>
              <span className="lab-clip-tr font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#1B2757] bg-[#1B2757]/[0.07] px-2.5 py-1 shrink-0">
                {display.timeLabel}
              </span>
            </div>
            <p className="text-sm text-black/60 leading-relaxed mt-2.5">{copy.blurb}</p>
          </div>
        </div>

        {/* Disclosure tabs — three in a row, then a full-width Impact tab */}
        <div className="border-t border-black/8">
          <div className="flex items-stretch">
            {ROW_TABS.map((t, i) => (
              <button
                key={t.key}
                type="button"
                onClick={() => toggleInfo(t.key)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-[13px] transition-colors ${i > 0 ? "border-l border-black/8" : ""} ${
                  openInfo === t.key ? "text-[#1B2757] font-semibold bg-[#1B2757]/[0.04]" : "text-[var(--brand-black)] font-medium hover:text-black"
                }`}
              >
                {t.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-200" style={{ transform: openInfo === t.key ? "rotate(180deg)" : "none" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => toggleInfo("impact")}
            className={`w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-black/8 text-[13px] transition-colors ${
              openInfo === "impact" ? "text-[#1B2757] font-semibold bg-[#1B2757]/[0.04]" : "text-[var(--brand-black)] font-medium hover:text-black"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M3 17l5-5 4 4 8-9" /><path d="M21 7v5h-5" />
            </svg>
            Impact
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-200" style={{ transform: openInfo === "impact" ? "rotate(180deg)" : "none" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Disclosure panels */}
        <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: openInfo ? "1100px" : "0px" }}>
          <div className="px-4 py-4 border-t border-black/8">
            {openInfo === "ingredients" && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40">
                    {ACTIVE_COUNT[product]} active ingredients · 30ml shot
                  </p>
                  {ingPages > 1 && (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIngPage(Math.max(0, ingSafePage - 1))}
                        disabled={ingSafePage === 0}
                        aria-label="Previous ingredients"
                        className="text-black/45 hover:text-black/75 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <span className="font-mono text-[9px] tabular-nums text-black/45">{ingSafePage + 1} / {ingPages}</span>
                      <button
                        type="button"
                        onClick={() => setIngPage(Math.min(ingPages - 1, ingSafePage + 1))}
                        disabled={ingSafePage === ingPages - 1}
                        aria-label="More ingredients"
                        className="text-black/45 hover:text-black/75 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-x-3 gap-y-4">
                  {ingItems.map((ing) => (
                    <div key={ing.name} className="flex flex-col items-center text-center gap-1.5">
                      <div className="w-full aspect-square bg-[var(--brand-tint)] overflow-hidden">
                        <Image src={ing.img} alt={ing.name} width={140} height={140} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-black/70 leading-tight">{ing.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {openInfo === "how" && (
              <div className="flex flex-col gap-3">
                {HOW_STEPS[product].map((s) => (
                  <div key={s.when} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#1B2757] bg-[#1B2757]/[0.07] px-2 py-1.5 shrink-0 min-w-[70px] text-center leading-none">
                      {s.when}
                    </span>
                    <p className="text-[13px] text-black/65 leading-snug pt-1">{s.what}</p>
                  </div>
                ))}
              </div>
            )}
            {openInfo === "athletes" && (
              <>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40 mb-2.5">
                  Informed Sport certified — used by pros
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                  {ATHLETES.map((a) => (
                    <div key={a.name} className="flex items-start gap-2">
                      <CheckIcon />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--brand-black)] leading-tight">{a.name}</p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-black/45 mt-0.5">{a.sport}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {openInfo === "impact" && (
              <>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40 mb-5">
                  Clinically studied actives — measured outcomes
                </p>
                <div className="grid grid-cols-3 divide-x divide-black/[0.08]">
                  {copy.stats.map((s) => (
                    <div key={s.label} className="px-2 text-center first:pl-0 last:pr-0">
                      <p className="text-[2.1rem] lg:text-[2.5rem] font-bold text-[#1B2757] tabular-nums leading-none tracking-tight">
                        <CountUp value={s.value} />
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-black/50 mt-2.5 leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between gap-3 mt-5 pt-3.5 border-t border-black/8">
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--brand-black)] font-semibold">
                    UK Patent · GB2629279
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/45">
                    Informed Sport certified
                  </span>
                </div>
                <p className="text-[11px] text-black/40 mt-3 leading-snug">
                  Figures from peer-reviewed studies on the formula&apos;s active ingredients.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Plan */}
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45 mt-6 mb-2.5">
        2 · Your plan
      </p>
      <CadenceSelector product={product} cadence={cadence} onChange={onCadenceChange} />
    </div>
  );
}
