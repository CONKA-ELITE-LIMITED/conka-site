"use client";

/**
 * funnel-c — Step 1 (Learn).
 *
 * Two shots, two jobs: Flow in the morning, Clear in the afternoon, with Both
 * as the recommended routine. Timing rides on a rounded period pill next to the
 * name. Detail stays behind progressive-disclosure chips so the default view is
 * two cards and one line of copy.
 */

import { useState } from "react";
import Image from "next/image";
import { type FunnelProduct, getOfferPricing } from "../../lib/funnelData";
import { formatPrice } from "@/app/lib/productData";

type Section = "ingredients" | "timing" | "does" | "notice";

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
  Icon: SunIcon,
  tagline: "Adaptogenic focus and stress resilience from the first hour. Caffeine-free, no crash.",
  ingredients: [
    { name: "Ashwagandha", benefit: "reduces cortisol so stress does not derail your concentration" },
    { name: "Lemon Balm", benefit: "calms the nervous system without sedation, promotes sustained focus" },
    { name: "Rhodiola rosea", benefit: "combats mental fatigue at the source, not with stimulants" },
    { name: "Turmeric", benefit: "supports cerebral blood flow and reduces neuroinflammation" },
    { name: "Bilberry", benefit: "protects microcirculation and sharpens visual processing" },
    { name: "Black Pepper", benefit: "multiplies absorption of the other ingredients" },
  ],
  whenToTake: [
    "Morning, with or without breakfast.",
    "One shot a day. That is the whole routine.",
  ],
  whatItDoes: [
    "Works on the adaptogenic pathway, not stimulants.",
    "Buffers your stress response and moderates cortisol.",
    "You get into deep work faster, and hold it longer.",
  ],
  whatYoullNotice: [
    "Less of the sluggish morning warmup.",
    "Cleaner, earlier focus inside the first week.",
    "By day 7, deep work feels like a switch, not a slog.",
  ],
};

const CLEAR_DATA = {
  accentColor: "#0369a1",
  product: "clear" as FunnelProduct,
  image: "/formulas/conkaClear/ClearNoBackground.png",
  name: "CONKA Clear",
  period: "Afternoon",
  Icon: MoonIcon,
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
  whenToTake: [
    "Early afternoon, around 1 to 2pm.",
    "One shot a day. Take it before the dip, not after.",
  ],
  whatItDoes: [
    "Your brain builds oxidative load all morning.",
    "By 2pm that load drags on processing speed and memory.",
    "Clear flushes it and restores blood flow to the neurons.",
  ],
  whatYoullNotice: [
    "The 2 to 3pm dip gets noticeably less severe.",
    "Most people feel it around day 3 to 5.",
    "By week one, afternoons feel like mornings used to.",
  ],
};

type FormulaData = typeof FLOW_DATA;

const SECTION_LABELS: Record<Section, string> = {
  ingredients: "Ingredients",
  timing: "When to take",
  does: "How it works",
  notice: "What you'll feel",
};

/** Bulleted list for the disclosure panels. Navy tick, one idea per line. */
function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 mt-[3px] text-[#1B2757]">
            <path d="M5 12.5L10 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[14px] text-black leading-snug">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FormulaCard({
  data,
  onAccordionOpen,
}: {
  data: FormulaData;
  onAccordionOpen?: (id: string) => void;
}) {
  const [active, setActive] = useState<Section | null>(null);
  const toggle = (section: Section) => {
    const next = active === section ? null : section;
    // Report opens only, and from outside the updater: state updaters must be
    // pure, and React double-invokes them under StrictMode.
    if (next) onAccordionOpen?.(`${data.product}:${next}`);
    setActive(next);
  };
  // Lowest per-shot for this formula (its quarterly subscription).
  const fromPrice = formatPrice(getOfferPricing(data.product, "quarterly-sub").perShot);

  return (
    <div className="rounded-[16px] border-2 border-black/85 bg-white overflow-hidden">
      {/* Identity. The AM/PM pill carries the timing, so the old full-width
          coloured band and its mono micro-copy are gone. */}
      <div className="flex items-start gap-3.5 p-4">
        <div
          className="shrink-0 w-[68px] h-[68px] rounded-[12px] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: `${data.accentColor}0F` }}
        >
          <Image src={data.image} alt={data.name} width={68} height={68} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[17px] font-semibold text-black leading-tight">{data.name}</p>
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: `${data.accentColor}1A`, color: data.accentColor }}
            >
              <data.Icon />
              {data.period}
            </span>
          </div>
          <p className="text-[14px] text-black/70 leading-snug mt-1.5">{data.tagline}</p>
          <p className="text-[13px] text-black mt-2">
            From <span className="font-bold tabular-nums">{fromPrice}</span>
            <span className="text-black/50"> per shot</span>
          </p>
        </div>
      </div>

      {/* Progressive disclosure. Rounded chips, not clinical tabs. */}
      <div className="flex items-center gap-2 px-4 pb-4 flex-wrap">
        {(["ingredients", "timing", "does", "notice"] as Section[]).map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => toggle(section)}
            className={`inline-flex items-center gap-1.5 min-h-[44px] rounded-full px-3.5 text-[13px] font-medium transition-colors ${
              active === section
                ? "bg-[#1B2757] text-white"
                : "bg-black/[0.05] text-black/70 hover:bg-black/[0.09] hover:text-black"
            }`}
          >
            {SECTION_LABELS[section]}
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="transition-transform duration-200 shrink-0"
              style={{ transform: active === section ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        ))}
      </div>

      {/* Expanded panel */}
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: active ? "700px" : "0px" }}>
        <div className="mx-4 mb-4 rounded-[12px] bg-black/[0.03] p-4">
          {active === "ingredients" && (
            <div className="space-y-3">
              {data.ingredients.map(({ name, benefit }) => (
                <div key={name} className="flex items-start gap-3">
                  {ING_IMG[name] && (
                    <div className="shrink-0 w-10 h-10 rounded-[8px] overflow-hidden bg-white">
                      <Image src={ING_IMG[name]} alt={name} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-[13px] leading-snug pt-0.5">
                    <span className="font-semibold text-black">{name}</span>
                    <span className="text-black/65"> {benefit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
          {active === "timing" && <Bullets items={data.whenToTake} />}
          {active === "does" && <Bullets items={data.whatItDoes} />}
          {active === "notice" && <Bullets items={data.whatYoullNotice} />}
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
      {/* The step name already sits in the top chrome, so the mono
          "Step 01 · Learn" eyebrow is gone rather than repeated. */}
      <h2
        className="text-black font-semibold text-[34px] leading-[1.05] mb-3 text-balance"
        style={{ letterSpacing: "-0.02em" }}
      >
        Two shots. All day.
      </h2>

      <p className="text-[15px] leading-snug text-black mb-6">
        Flow sets up your morning. Clear holds your afternoon. Take one, or run
        the full day.
      </p>

      <div className="flex flex-col gap-3">
        <FormulaCard data={FLOW_DATA} onAccordionOpen={onAccordionOpen} />
        <FormulaCard data={CLEAR_DATA} onAccordionOpen={onAccordionOpen} />
      </div>

      <div className="flex items-start gap-2.5 mt-4 p-4 rounded-[12px] bg-[#1B2757]/[0.05]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" fill="#10B981" />
          <path d="M8 12.5L10.5 15L16 9.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-[14px] text-black leading-snug">
          <strong className="font-semibold">Most people take both.</strong>{" "}
          Morning to evening cover, at the lowest price per shot.
        </p>
      </div>
    </div>
  );
}
