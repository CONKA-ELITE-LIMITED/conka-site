"use client";

/**
 * Build Your Order — Step 1 (Learn).
 *
 * One job: make the two-shot AM/PM system land, fast, so the Build step feels
 * like the obvious next tap. The tall bottle renders carry the story side by
 * side (equal billing, even on mobile); copy stays to one line per formula.
 * Depth deliberately lives on the Build step's disclosures, not here — this
 * step used to carry eight accordion chips that duplicated Build's, and read
 * as homework. A slim "learn more" cluster (when to take / what's inside /
 * what are nootropics) sits below the proof for the visitor who wants depth
 * before configuring.
 */

import Image from "next/image";
import { type ByoProduct } from "@/app/lib/byoData";
import LearnMoreAccordion, { type LearnMoreRow } from "./LearnMoreAccordion";

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

// Deliberately NOT the shared bottleRenders map: this side-by-side pair layout
// needs the tall 1:2 *Thin crops to fit two cards on a 390px viewport, while
// the canonical renders are square.
const FORMULAS: Formula[] = [
  {
    product: "flow",
    image: "/formulas/labelV2/FlowThin.jpg",
    name: "Flow",
    period: "AM",
    accentColor: "#C4892A",
    Icon: SunIcon,
    job: "Calm, sustained focus from the first hour. Zero caffeine.",
  },
  {
    product: "clear",
    image: "/formulas/labelV2/ClearThin.jpg",
    name: "Clear",
    period: "PM",
    accentColor: "#0369a1",
    Icon: MoonIcon,
    job: "Clears the 2pm fog and holds the afternoon.",
  },
];

/** The routine in three beats, for the visitor who wants it before building. */
const WHEN_TO_TAKE: { when: string; what: string }[] = [
  { when: "Morning", what: "Flow, with or without breakfast. Calm, caffeine-free focus for the first half of the day." },
  { when: "1 to 2pm", what: "Clear, before the afternoon dip rather than after it." },
  { when: "Daily", what: "One shot each. That is the whole routine. Track the effect in the CONKA app." },
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
  const LEARN_MORE: LearnMoreRow[] = [
    {
      id: "learn:when",
      label: "When to take CONKA",
      body: (
        <div className="flex flex-col gap-2.5">
          {WHEN_TO_TAKE.map((s) => (
            <div key={s.when} className="flex items-start gap-3">
              <span className="shrink-0 min-w-[76px] rounded-full bg-black/[0.05] px-2.5 py-1.5 text-center text-[12px] font-bold text-black leading-none">
                {s.when}
              </span>
              <p className="text-[13px] text-black/75 leading-snug pt-1">{s.what}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "learn:inside",
      label: "What's inside",
      body: (
        <div className="flex flex-col gap-2 text-[13px] leading-snug">
          <p className="text-black/75">
            <strong className="font-semibold text-black">Flow:</strong> six
            clinically dosed adaptogens, led by Ashwagandha, Lemon Balm and
            Rhodiola rosea. Zero caffeine.
          </p>
          <p className="text-black/75">
            <strong className="font-semibold text-black">Clear:</strong> ten
            clinically dosed actives, led by Alpha-GPC, Ginkgo Biloba and
            Glutathione.
          </p>
          <p className="text-black/55">
            Full ingredient lists, doses and studies sit one tap away on the
            next step.
          </p>
        </div>
      ),
    },
    {
      id: "learn:nootropics",
      label: "What are nootropics?",
      body: (
        <div className="flex flex-col gap-2 text-[13px] text-black/75 leading-snug">
          <p>
            From the Greek <em>nous</em> (mind) and <em>tropein</em> (to turn):
            a term coined by the psychologist Corneliu Giurgea in 1972 for
            compounds that enhance learning and memory, protect the brain, and
            do it with minimal side effects.
          </p>
          <p>
            They work through different pathways. Some increase cerebral blood
            flow, some support neurotransmitters like acetylcholine and
            dopamine, and others protect neurons from the oxidative stress that
            builds through a working day.
          </p>
          <p>
            Nootropics range from natural compounds to prescription stimulants.
            CONKA uses only the natural end of that spectrum, dosed at the
            levels the published studies used. No caffeine, no stimulants: the
            effect comes from the pathway, not a spike.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* The step name already sits in the top chrome, so no eyebrow. */}
      <h2
        className="text-black font-semibold text-[34px] leading-[1.05] mb-6 text-balance"
        style={{ letterSpacing: "-0.02em" }}
      >
        A Sharper Mind. Morning to Evening.
      </h2>

      {/* The pair, side by side on every breakpoint (equal billing). The tall
          renders do the talking; each card carries exactly one line of copy. */}
      <div className="grid grid-cols-2 gap-3">
        {FORMULAS.map((f) => {
          return (
            <div key={f.product} className="rounded-md ring-1 ring-black/10 bg-white overflow-hidden flex flex-col">
              <div className="relative aspect-[3/5] w-full bg-[#f1f1f3]">
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
              </div>
            </div>
          );
        })}
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

      {/* Learn more — the optional depth, lower down so the pitch stays one
          screen. Three slim disclosures; anything past this lives on Build. */}
      <div className="mt-4">
        <LearnMoreAccordion rows={LEARN_MORE} onOpen={onAccordionOpen} />
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
