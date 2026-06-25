"use client";

import { useState } from "react";
import Image from "next/image";

type Section = "ingredients" | "does" | "notice";

const FLOW_DATA = {
  accentColor: "#F59E0B",
  image: "/formulas/conkaFlow/FlowNoBackground.png",
  name: "CONKA Flow",
  timeTag: "AM",
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
  image: "/formulas/conkaClear/ClearNoBackground.png",
  name: "CONKA Clear",
  timeTag: "PM",
  timingNote: "Take around 1-2pm",
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
  whatYoullNotice: "The 2-3pm dip becomes noticeably less severe. Most people feel it around day 3-5. By the end of the first week, afternoons feel more like mornings used to.",
};

type FormulaData = typeof FLOW_DATA;

const SECTION_LABELS: Record<Section, string> = {
  ingredients: "Ingredients",
  does: "What it does",
  notice: "What you'll notice",
};

function FormulaCard({ data }: { data: FormulaData }) {
  const [active, setActive] = useState<Section | null>(null);

  const toggle = (section: Section) =>
    setActive((prev) => (prev === section ? null : section));

  return (
    <div className="border border-black/12 bg-white overflow-hidden">
      <div className="h-[3px] w-full" style={{ backgroundColor: data.accentColor }} />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className="shrink-0 w-14 h-14 bg-[var(--brand-tint)] flex items-center justify-center overflow-hidden">
          <Image
            src={data.image}
            alt={data.name}
            width={56}
            height={56}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-[var(--brand-black)] leading-tight">{data.name}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/40 mt-0.5 leading-snug">{data.timingNote}</p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/30 shrink-0 self-start pt-1">
          {data.timeTag}
        </span>
      </div>

      {/* Always-visible tagline */}
      <p className="px-4 pb-3 text-sm text-black/60 leading-relaxed">{data.tagline}</p>

      {/* Section tab row */}
      <div className="flex items-center gap-0 px-4 pb-3 border-t border-black/8 pt-3">
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
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden
                className="transition-transform duration-200 shrink-0"
                style={{ transform: active === section ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      {/* Expanded panel — one section at a time */}
      {/* maxHeight transition hack: "none" can't animate, so cap at 600px (well above any ingredient list) */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: active ? "600px" : "0px" }}
      >
        <div className="px-4 pb-4 border-t border-black/8 pt-3">
          {active === "ingredients" && (
            <div className="space-y-2">
              {data.ingredients.map(({ name, benefit }) => (
                <div key={name} className="flex gap-2.5">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5 text-[#1B2757]" aria-hidden>
                    <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
                  <p className="text-sm">
                    <span className="font-semibold text-[var(--brand-black)]">{name}</span>
                    <span className="text-black/55"> {benefit}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {active === "does" && (
            <p className="text-sm text-black/60 leading-relaxed">{data.whatItDoes}</p>
          )}

          {active === "notice" && (
            <p className="text-sm text-black/60 leading-relaxed">{data.whatYoullNotice}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EducationStep() {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
        Step 01 · Learn
      </p>
      <h2
        className="text-xl lg:text-2xl font-semibold tracking-[var(--brand-h2-tracking)] mb-1"
        style={{ color: "var(--brand-black)" }}
      >
        Your brain does not perform the same way all day.
      </h2>
      <p className="text-sm text-black/50 mb-4">
        Most people take both. Flow handles the morning, Clear handles the afternoon.
      </p>

      <div className="flex flex-col gap-2">
        <FormulaCard data={FLOW_DATA} />
        <FormulaCard data={CLEAR_DATA} />
      </div>
    </div>
  );
}
