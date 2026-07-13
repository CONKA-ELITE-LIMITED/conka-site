"use client";

/**
 * funnel-c — Step 1 (Learn).
 *
 * Frames what the user is about to build: two shots with two distinct jobs —
 * Flow in the MORNING, Clear in the AFTERNOON — with Both as the recommended
 * combination. AM/PM is made unmistakable (coloured period badge + sun/moon),
 * not a tiny corner tag. Each product keeps progressive-disclosure dropdowns.
 */

import { useState } from "react";
import Image from "next/image";
import { type FunnelProduct, getOfferPricing } from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

type Section = "ingredients" | "does" | "notice";

// Ingredient renders (same images as the site's ingredients section).
const ING_IMG: Record<string, string> = {
  Ashwagandha: "/ingredients/renders/Ashwagandha.jpg",
  "Lemon Balm": "/ingredients/renders/LemonBalm.jpg",
  "Rhodiola rosea": "/ingredients/renders/RhodiolaRosea.jpg",
  Turmeric: "/ingredients/renders/Turmeric.jpg",
  Bilberry: "/ingredients/renders/Bilberry.jpg",
  "Black Pepper": "/ingredients/renders/BlackPepper.jpg",
  "Alpha-GPC": "/ingredients/renders/AlphaGPC.jpg",
  Glutathione: "/ingredients/renders/11.jpg",
  "Ginkgo Biloba": "/ingredients/renders/GinkgoBiloba.jpg",
  "N-Acetyl Cysteine": "/ingredients/renders/NAcetylCysteine.jpg",
  "Acetyl-L-Carnitine": "/ingredients/renders/11.jpg",
  "Vitamin B12": "/ingredients/renders/VitaminB12.jpg",
  "Vitamin C": "/ingredients/renders/VitaminC.jpg",
};

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

const FLOW_DATA = {
  accentColor: "#C4892A",
  product: "flow" as FunnelProduct,
  image: "/formulas/conkaFlow/FlowNoBackground.png",
  name: "CONKA Flow",
  period: "Morning",
  timeTag: "AM",
  Icon: SunIcon,
  timingNote: "Take in the morning, with or without breakfast",
  tagline: "Adaptogenic focus and stress resilience from the first hour. Caffeine-free, no crash.",
  ingredients: [
    { name: "Ashwagandha", benefit: "reduces cortisol so stress does not derail your concentration" },
    { name: "Lemon Balm", benefit: "calms the nervous system without sedation, promotes sustained focus" },
    { name: "Rhodiola rosea", benefit: "combats mental fatigue at the source, not with stimulants" },
    { name: "Turmeric", benefit: "supports cerebral blood flow and reduces neuroinflammation" },
    { name: "Bilberry", benefit: "protects microcirculation and sharpens visual processing" },
    { name: "Black Pepper", benefit: "multiplies absorption of the other ingredients" },
  ],
  whatItDoes: "Flow works on the adaptogenic pathway rather than stimulating your nervous system like caffeine does. It buffers your stress response, moderates cortisol, and supports sustained mental energy so you get into focused work faster and hold it longer.",
  whatYoullNotice: "Less of the sluggish warmup period in the morning. Most people notice cleaner, earlier focus within the first week. By day 7, getting into deep work feels less like effort and more like a switch.",
};

const CLEAR_DATA = {
  accentColor: "#0369a1",
  product: "clear" as FunnelProduct,
  image: "/formulas/conkaClear/ClearNoBackground.png",
  name: "CONKA Clear",
  period: "Afternoon",
  timeTag: "PM",
  Icon: MoonIcon,
  timingNote: "Take around 1–2pm",
  tagline: "Cuts through brain fog and keeps sharp thinking going through the second half of your day.",
  ingredients: [
    { name: "Alpha-GPC", benefit: "fuels acetylcholine production, the neurotransmitter behind focus and memory" },
    { name: "Glutathione", benefit: "the brain's master antioxidant, clears the oxidative load that builds through the morning" },
    { name: "Ginkgo Biloba", benefit: "improves cerebral blood flow so oxygen and nutrients reach the neurons that need them" },
    { name: "N-Acetyl Cysteine", benefit: "replenishes glutathione and amplifies antioxidant protection" },
    { name: "Acetyl-L-Carnitine", benefit: "restores cellular energy in neurons, targeting the afternoon dip directly" },
    { name: "Vitamin B12", benefit: "supports neurological function and reduces mental fatigue" },
    { name: "Vitamin C", benefit: "protects neurons from oxidative damage and supports psychological function" },
  ],
  whatItDoes: "Your brain accumulates oxidative stress through the morning. By early afternoon that load is high enough to impair processing speed and working memory. Clear is formulated to flush that load and restore the blood flow and neurotransmitter supply your brain needs to keep performing.",
  whatYoullNotice: "The 2–3pm dip becomes noticeably less severe. Most people feel it around day 3–5. By the end of the first week, afternoons feel more like mornings used to.",
};

type FormulaData = typeof FLOW_DATA;

const SECTION_LABELS: Record<Section, string> = {
  ingredients: "Ingredients",
  does: "What it does",
  notice: "What you'll notice",
};

function FormulaCard({
  data,
  onAccordionOpen,
}: {
  data: FormulaData;
  onAccordionOpen?: (id: string) => void;
}) {
  const [active, setActive] = useState<Section | null>(null);
  const toggle = (section: Section) =>
    setActive((prev) => {
      const next = prev === section ? null : section;
      // Only report opens. A close is not a signal of interest.
      if (next) onAccordionOpen?.(`${data.product}:${next}`);
      return next;
    });
  // Lowest per-shot for this formula (its quarterly subscription).
  const fromPrice = formatPrice(getOfferPricing(data.product, "quarterly-sub").perShot);

  return (
    <div className="border border-black/12 bg-white overflow-hidden">
      {/* Period band — unmistakable AM vs PM */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: `${data.accentColor}14` }}
      >
        <span
          className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color: data.accentColor }}
        >
          <data.Icon />
          {data.period} · {data.timeTag}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/40">
          {data.timingNote}
        </span>
      </div>

      {/* Identity */}
      <div className="flex items-center gap-3 px-4 pt-3.5">
        <div className="shrink-0 w-16 h-16 bg-[var(--brand-tint)] flex items-center justify-center overflow-hidden">
          <Image src={data.image} alt={data.name} width={64} height={64} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-[var(--brand-black)] leading-tight">{data.name}</p>
          <p className="text-sm text-black/55 leading-snug mt-1">{data.tagline}</p>
        </div>
        <div className="text-right shrink-0 self-start">
          <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-black/40 leading-none">From</p>
          <p className="text-base font-bold text-[var(--brand-black)] tabular-nums leading-none mt-1">
            {fromPrice}
            <span className="text-[10px] font-medium text-black/45">/shot</span>
          </p>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex items-center gap-0 px-4 pb-1 pt-3 mt-3 border-t border-black/8">
        {(["ingredients", "does", "notice"] as Section[]).map((section, i) => (
          <span key={section} className="flex items-center">
            {i > 0 && <span className="text-black/20 mx-2 text-xs" aria-hidden>·</span>}
            <button
              type="button"
              onClick={() => toggle(section)}
              className={`inline-flex items-center gap-1 text-sm transition-colors min-h-[44px] py-1 ${
                active === section
                  ? "text-[#1B2757] font-semibold underline underline-offset-4 decoration-[#1B2757]/40"
                  : "text-black/45 hover:text-black/70"
              }`}
            >
              {SECTION_LABELS[section]}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden className="transition-transform duration-200 shrink-0" style={{ transform: active === section ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      {/* Expanded panel */}
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: active ? "600px" : "0px" }}>
        <div className="px-4 pb-4 border-t border-black/8 pt-3">
          {active === "ingredients" && (
            <div className="space-y-2.5">
              {data.ingredients.map(({ name, benefit }) => (
                <div key={name} className="flex items-start gap-2.5">
                  {ING_IMG[name] ? (
                    <div className="shrink-0 w-9 h-9 bg-[var(--brand-tint)] overflow-hidden">
                      <Image src={ING_IMG[name]} alt={name} width={36} height={36} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
                      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                  )}
                  <p className="text-sm pt-0.5">
                    <span className="font-semibold text-[var(--brand-black)]">{name}</span>
                    <span className="text-black/55"> {benefit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
          {active === "does" && <p className="text-sm text-black/60 leading-relaxed">{data.whatItDoes}</p>}
          {active === "notice" && <p className="text-sm text-black/60 leading-relaxed">{data.whatYoullNotice}</p>}
        </div>
      </div>
    </div>
  );
}

export default function EducationStep({
  onAccordionOpen,
}: {
  onAccordionOpen?: (id: string) => void;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 01 · Learn
      </p>
      <h2
        className="text-2xl lg:text-[2.6rem] font-semibold tracking-[var(--brand-h2-tracking)] leading-[1.05] mb-3"
        style={{ color: "var(--brand-black)" }}
      >
        What does CONKA do?
      </h2>
      <p className="text-lg lg:text-xl font-medium text-[#1B2757] mb-3 leading-snug">
        Two shots. Two jobs. One daily routine.
      </p>
      <p className="text-sm text-black/55 mb-5 leading-relaxed">
        CONKA is a daily system, not a single pill. <strong className="text-[var(--brand-black)] font-semibold">Flow</strong> sets up your
        morning; <strong className="text-[var(--brand-black)] font-semibold">Clear</strong> holds your afternoon. Most people take both —
        you&apos;ll choose how next.
      </p>

      <div className="flex flex-col gap-3">
        <FormulaCard data={FLOW_DATA} onAccordionOpen={onAccordionOpen} />
        <FormulaCard data={CLEAR_DATA} onAccordionOpen={onAccordionOpen} />
      </div>

      <div className="flex items-start gap-2.5 mt-3 px-4 py-3 border border-[#1B2757]/15 bg-[#1B2757]/[0.04]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
          <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
        <p className="text-sm text-black/65 leading-snug">
          <strong className="text-[var(--brand-black)] font-semibold">Both is the recommended routine</strong> — full morning-to-evening
          cover, and the lowest price per shot. You can pick a single formula on the next step.
        </p>
      </div>
    </div>
  );
}
