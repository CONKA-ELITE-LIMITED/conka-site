import Image from "next/image";
import type { ReactNode } from "react";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

interface Reference {
  authors: string;
  year: string;
  topic: string;
}

const REFERENCES: Reference[] = [
  { authors: "Kennedy et al.", year: "2003", topic: "Lemon balm, mood and cognition" },
  { authors: "Mix & Crews", year: "2002", topic: "Ginkgo biloba, cognitive function" },
  { authors: "Whyte & Williams", year: "2015", topic: "Bilberry, cognitive performance" },
  { authors: "Bowtell et al.", year: "2017", topic: "Cerebral blood flow" },
  { authors: "Dodd et al.", year: "2015", topic: "Cerebral blood flow" },
  { authors: "Kennedy", year: "2019", topic: "Phytochemicals for cognition and sport" },
];

const REVOLUT_STATS = [
  { value: "9", label: "Participants" },
  { value: "129", label: "Valid tests" },
  { value: "75%", label: "Improved (6 of 8)" },
  { value: "+3.1", label: "Avg. points" },
];

const ENGINE = [
  {
    label: "Measured every day",
    detail:
      "Wearable-connected cognitive testing through the app, not a one-off survey at the end of a study.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        <rect x="3" y="4" width="18" height="18" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="16" y1="2" x2="16" y2="6" />
      </svg>
    ),
  },
  {
    label: "At real-world scale",
    detail:
      "Live testing across sporting and corporate teams, the participants most research struggles to reach.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "It improves itself",
    detail:
      "Testing at this scale sharpens the measurement itself, which feeds back into a better product.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
  },
];

const PARTNERS = [
  { name: "University of Durham", logo: "/logos/UniversityOfDurham.png", role: "Neuroscience research" },
  { name: "University of Cambridge", logo: "/logos/UniversityOfCambridge.png", role: "Cognitive testing (ICA)" },
  { name: "University of Exeter", logo: "/logos/UniversityOfExeter.png", role: "Human trial" },
  { name: "Revolut", logo: "/logos/Revolut.png", role: "Real-world trial" },
];

// Rung icons
const ICON_BOOK = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const ICON_FLASK = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M9 3h6" />
    <path d="M10 3v7L4.8 19a1 1 0 0 0 .9 1.5h12.6a1 1 0 0 0 .9-1.5L14 10V3" />
  </svg>
);
const ICON_TRIAL = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M8 4H6a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-2" />
    <path d="M9 3h6v3H9z" />
    <path d="M9 13l2 2 4-4" />
  </svg>
);
const ICON_PULSE = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export default function EvidenceLadder() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 lg:mb-12 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// The evidence · SCI-07"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          The evidence, from literature to live data.
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          Four kinds of evidence sit behind CONKA: the published research on each
          active, our own early studies, a completed human trial, and live
          cognitive data from real teams. Here is each one, and how far it goes.
        </p>
      </div>

      {/* The ladder — connected rail with navy nodes */}
      <ol className="mb-12 lg:mb-16">
        <LadderRung
          index={1}
          last={false}
          tier="Established literature"
          title="The research behind the actives"
          icon={ICON_BOOK}
        >
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            Every active earns its place from primary, peer-reviewed research,
            not a marketing trend. These are real, citable papers, already in
            hand.
          </p>
          <div className="mt-4 border border-black/12">
            {REFERENCES.map((ref, idx) => (
              <div
                key={`${ref.authors}-${ref.year}`}
                className={`flex items-baseline justify-between gap-4 px-4 py-2.5 ${
                  idx < REFERENCES.length - 1 ? "border-b border-black/8" : ""
                }`}
              >
                <span className="text-sm text-black">
                  {ref.authors}{" "}
                  <span className="font-mono text-[11px] tabular-nums text-black/45">
                    {ref.year}
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums text-right">
                  {ref.topic}
                </span>
              </div>
            ))}
          </div>
        </LadderRung>

        <LadderRung
          index={2}
          last={false}
          tier="Early research · preprint"
          title="Our own formulation research, Durham"
          icon={ICON_FLASK}
        >
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            Early model-organism work from our initial formula development, led
            by neuroscientists at Durham (Prof. Paul Chazot and Prof. Karen
            Hind), published as a preprint (manuscript 202411.0241).
          </p>
        </LadderRung>

        <LadderRung
          index={3}
          last={false}
          tier="Human trial · in write-up"
          title="Our human trial, Exeter"
          icon={ICON_TRIAL}
        >
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            An eight-week double-blind, placebo-controlled, randomised crossover
            trial of two CONKA formulae. Power-calculated to 60+ participants
            drawn from professional athletes and defence and security personnel.
            Three validated cognitive domains, attention, processing speed
            (CognICA), and short-term memory, delivered through the CONKA app
            three sessions a week against a matched placebo and a control.
          </p>
          <p className="text-sm md:text-base text-black/75 leading-relaxed mt-3">
            It is currently in write-up. We will share the results once they are
            peer-reviewed and published.
          </p>
        </LadderRung>

        <LadderRung
          index={4}
          last={true}
          tier="Real-world data"
          title="Live data at scale"
          icon={ICON_PULSE}
        >
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            Continuous, app-measured cognitive data from live trials with
            sporting and corporate teams. Most recently, a cohort at Revolut.
          </p>

          <div className="mt-4 bg-white border border-black/12">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                Revolut · March 2026
              </span>
              <span className="relative h-4 w-16">
                <Image
                  src="/logos/Revolut.png"
                  alt="Revolut"
                  fill
                  loading="lazy"
                  sizes="64px"
                  className="object-contain object-right"
                />
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {REVOLUT_STATS.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`p-4 ${idx % 2 === 0 ? "border-r border-black/8" : ""} ${
                    idx < 2 ? "border-b border-black/8 lg:border-b-0" : ""
                  } ${idx === 2 ? "lg:border-r lg:border-black/8" : ""}`}
                >
                  <p className="font-mono text-2xl lg:text-3xl font-bold tabular-nums text-[#1B2757] leading-none">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums mt-2 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-black/60 leading-relaxed mt-3">
            Early validation, growing every week. A real-world signal, not proof.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">
            <a
              href="/case-studies"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums inline-flex items-center min-h-[44px]"
            >
              Read the case studies ↗
            </a>
            <a
              href="/app-insights"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums inline-flex items-center min-h-[44px]"
            >
              See the live data ↗
            </a>
          </div>
        </LadderRung>
      </ol>

      {/* The engine */}
      <div className="mb-10 lg:mb-12">
        <p className="brand-eyebrow mb-3">{"// The engine · How we keep proving it"}</p>
        <h3
          className="brand-h3 text-black mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          The evidence above is not a one-off.
        </h3>
        <p className="text-sm md:text-base text-black/75 leading-relaxed max-w-2xl mb-6">
          It is a system that keeps running. Every day of testing adds to the
          picture and feeds the next formula.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {ENGINE.map((item) => (
            <div key={item.label} className="bg-white border border-black/12 p-5">
              <div
                className="w-11 h-11 flex items-center justify-center text-white mb-4"
                style={{ backgroundColor: "#1B2757" }}
              >
                {item.icon}
              </div>
              <p className="text-base font-semibold text-black leading-tight mb-1.5">
                {item.label}
              </p>
              <p className="text-sm text-black/70 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Partners + patent strip */}
      <div className="bg-white border border-black/12 mb-10 lg:mb-12">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
            Research partners
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
            Patent GB2620279
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {PARTNERS.map((partner, idx) => (
            <div
              key={partner.name}
              className={`p-5 flex flex-col items-center text-center gap-3 ${
                idx % 2 === 0 ? "border-r border-black/8" : ""
              } ${idx < 2 ? "border-b border-black/8 lg:border-b-0" : ""} ${
                idx === 2 ? "lg:border-r lg:border-black/8" : ""
              }`}
            >
              <div className="relative h-8 w-full max-w-[120px]">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  loading="lazy"
                  sizes="120px"
                  className="object-contain grayscale opacity-70"
                />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums leading-tight">
                {partner.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bridge — to shop */}
      <div className="bg-white border border-black/12 p-5 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          Put it to the test
        </p>
        <h3
          className="brand-h3 text-black mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          The science is the easy part to read. The proof is in the doing.
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
          100-day money-back guarantee · Free UK shipping · Cancel anytime
        </p>
        <ConkaCTAButton href="/conka-both" meta="// both systems · flow + clear">
          Shop CONKA
        </ConkaCTAButton>
      </div>
    </div>
  );
}

function LadderRung({
  index,
  last,
  tier,
  title,
  icon,
  children,
}: {
  index: number;
  last: boolean;
  tier: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[2.75rem_1fr] gap-4 lg:gap-6">
      {/* Rail — navy node + connecting line */}
      <div className="flex flex-col items-center">
        <div
          className="w-11 h-11 flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: "#1B2757" }}
        >
          {icon}
        </div>
        {!last && <div className="w-px flex-1 bg-[#1B2757]/20 my-2" />}
      </div>

      {/* Content card */}
      <div className={`bg-white border border-black/12 ${last ? "" : "mb-3"}`}>
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
            Rung {String(index).padStart(2, "0")} / 04
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
            {tier}
          </span>
        </div>
        <div className="p-5 lg:p-6">
          <h3 className="text-lg lg:text-xl font-semibold leading-tight text-black mb-3">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </li>
  );
}
