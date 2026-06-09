import Image from "next/image";
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
    label: "Continuous, not before-and-after",
    detail:
      "Wearable-connected cognitive testing, measured every day through the app, not a one-off survey at the end.",
  },
  {
    label: "Scale where it is hardest",
    detail:
      "Live testing across elite sporting and corporate teams. Access to those participants is slow, expensive, and equipment-bound. We built the system that solves it.",
  },
  {
    label: "It compounds",
    detail:
      "Testing at this scale raises the quality of cognitive measurement itself, which feeds straight back into a better product.",
  },
];

const PARTNERS = [
  { name: "University of Durham", logo: "/logos/UniversityOfDurham.png", role: "Neuroscience research" },
  { name: "University of Cambridge", logo: "/logos/UniversityOfCambridge.png", role: "Cognitive testing (ICA)" },
  { name: "University of Exeter", logo: "/logos/UniversityOfExeter.png", role: "Human trial" },
  { name: "Revolut", logo: "/logos/Revolut.png", role: "Real-world trial" },
];

export default function EvidenceLadder() {
  return (
    <div>
      {/* Header — the confident-transparency posture */}
      <div className="mb-8 lg:mb-10 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// The evidence · SCI-07"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          The evidence, without the overclaim.
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          We will not say &ldquo;clinically proven&rdquo; until our human results
          are peer-reviewed and published. Everything beneath that line is a
          position of strength: real research behind every active, and the most
          rigorous evidence engine in the category producing more.
        </p>
      </div>

      {/* The standard — what we won't say, what we will stand behind */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10 lg:mb-12">
        <div className="bg-white border border-black/12 p-5 lg:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
            What we will not say yet
          </p>
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            &ldquo;Clinically proven.&rdquo; Not until our human results clear
            peer review and publish. No exceptions, however good the early signal
            looks.
          </p>
        </div>
        <div className="bg-white border border-black/12 p-5 lg:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1B2757] mb-2">
            What we will stand behind
          </p>
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            Real primary research on the actives, a published preprint, a
            completed human trial in write-up, and live real-world data that
            grows every week.
          </p>
        </div>
      </div>

      {/* The ladder */}
      <p className="brand-eyebrow mb-4">{"// The evidence ladder · 04 rungs"}</p>
      <div className="space-y-3 mb-10 lg:mb-12">
        {/* Rung 01 — literature */}
        <LadderRung
          index={1}
          tier="Established literature"
          title="The research behind the actives"
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

        {/* Rung 02 — Durham preprint */}
        <LadderRung
          index={2}
          tier="Early research · preprint"
          title="Our own formulation research, Durham"
        >
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            Early model-organism work from our initial formula development, led
            by neuroscientists at Durham (Prof. Paul Chazot and Prof. Karen
            Hind). Published as a preprint (manuscript 202411.0241). This is
            early research, not human proof, and we label it exactly that way.
          </p>
        </LadderRung>

        {/* Rung 03 — Exeter trial */}
        <LadderRung
          index={3}
          tier="Human trial · in write-up"
          title="Our human trial, Exeter"
        >
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            An eight-week double-blind, placebo-controlled, randomised crossover
            trial of two CONKA formulae. Power-calculated to 60+ participants
            drawn from professional athletes and defence and security personnel.
            Three validated cognitive domains, attention, processing speed
            (CognICA), and short-term memory, delivered through the CONKA app
            three sessions a week against a matched placebo and a control.
          </p>
          <div className="mt-4 bg-black/[0.03] border border-black/8 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">
              Where we hold the line
            </p>
            <p className="text-sm text-black/75 leading-relaxed">
              Currently in write-up. The results stay sealed until peer review.
              We will not preview them, not even the good ones.
            </p>
          </div>
        </LadderRung>

        {/* Rung 04 — real-world data */}
        <LadderRung
          index={4}
          tier="Real-world data"
          title="Live data at scale"
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
      </div>

      {/* The engine differentiator */}
      <div className="mb-10 lg:mb-12">
        <p className="brand-eyebrow mb-3">{"// The engine · Why this is different"}</p>
        <h3
          className="brand-h3 text-black mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          We are not running before-and-after surveys.
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {ENGINE.map((item, idx) => (
            <div key={item.label} className="bg-white border border-black/12 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-3">
                {String(idx + 1).padStart(2, "0")}
              </p>
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
  tier,
  title,
  children,
}: {
  index: number;
  tier: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-black/12">
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
  );
}
