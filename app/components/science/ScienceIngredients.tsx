import Image from "next/image";

interface HeroActive {
  name: string;
  scientificName: string;
  render: string;
  dose: string;
  mechanism: string;
  pmid: string;
}

interface ActiveSystem {
  label: string;
  formula: string;
  actives: HeroActive[];
}

const SYSTEMS: ActiveSystem[] = [
  {
    label: "Resilience system",
    formula: "Flow actives",
    actives: [
      {
        name: "Ashwagandha",
        scientificName: "Withania somnifera",
        render: "/ingredients/renders/Ashwagandha.jpg",
        dose: "600mg",
        mechanism:
          "An adaptogen that helps lower cortisol and steady the body's stress response.",
        pmid: "23439798",
      },
      {
        name: "Rhodiola rosea",
        scientificName: "Rhodiola rosea",
        render: "/ingredients/renders/RhodiolaRosea.jpg",
        dose: "576mg",
        mechanism:
          "An adaptogen that pushes back on burnout and mental fatigue under sustained load.",
        pmid: "19016404",
      },
      {
        name: "Lemon balm",
        scientificName: "Melissa officinalis",
        render: "/ingredients/renders/LemonBalm.jpg",
        dose: "300mg",
        mechanism:
          "Calming without sedation, it takes the edge off stress while keeping you clear.",
        pmid: "16444660",
      },
    ],
  },
  {
    label: "Performance system",
    formula: "Clear actives",
    actives: [
      {
        name: "Alpha-GPC",
        scientificName: "L-Alpha-glycerylphosphorylcholine",
        render: "/ingredients/renders/AlphaGPC.jpg",
        dose: "300mg",
        mechanism:
          "A highly bioavailable choline source that raises acetylcholine, the neurotransmitter behind focus and recall.",
        pmid: "12882463",
      },
      {
        name: "Ginkgo biloba",
        scientificName: "Ginkgo biloba",
        render: "/ingredients/renders/GinkgoBiloba.jpg",
        dose: "120mg",
        mechanism:
          "Supports cerebral blood flow, getting more oxygen and glucose to working neurons.",
        pmid: "19395013",
      },
      {
        name: "N-acetyl cysteine",
        scientificName: "N-acetyl-L-cysteine",
        render: "/ingredients/renders/NAcetylCysteine.jpg",
        dose: "2000mg",
        mechanism:
          "Rebuilds glutathione, the brain's master antioxidant, to protect against oxidative stress.",
        pmid: "18436195",
      },
    ],
  },
];

export default function ScienceIngredients() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 lg:mb-12 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// The ingredients · SCI-05"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          Inside the formula.
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          A closer look at the hero actives, at the dose CONKA actually uses per
          serving. Every active named, every amount stated, every claim traceable
          to its research.
        </p>
      </div>

      {/* Two systems, equal */}
      <div className="space-y-10 lg:space-y-12">
        {SYSTEMS.map((system) => (
          <div key={system.label}>
            <div className="flex items-baseline justify-between gap-4 mb-4 pb-3 border-b border-black/12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                {system.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                {system.formula}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {system.actives.map((active) => (
                <div
                  key={active.name}
                  className="bg-white border border-black/12 flex flex-col"
                >
                  {/* Render */}
                  <div className="relative aspect-square bg-white border-b border-black/8 overflow-hidden">
                    <Image
                      src={active.render}
                      alt={`Render of ${active.name}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 380px"
                      className="object-cover"
                    />
                  </div>

                  {/* Detail */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base lg:text-lg font-semibold text-black leading-tight">
                      {active.name}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45 tabular-nums mt-1">
                      {active.scientificName}
                    </p>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] leading-none">
                        {active.dose}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45 tabular-nums">
                        per serving
                      </span>
                    </div>

                    <p className="text-sm text-black/70 leading-relaxed mt-3 flex-1">
                      {active.mechanism}
                    </p>

                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${active.pmid}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums mt-4 inline-flex items-center min-h-[44px]"
                    >
                      Peer-reviewed · PMID {active.pmid} ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Link to the full lookup */}
      <div className="mt-10 lg:mt-12 bg-white border border-black/12 p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-black leading-tight">
            This is the curated set. There are 16 in all.
          </p>
          <p className="text-sm text-black/65 leading-relaxed mt-1">
            The full list, with every dose and the studies behind each one, lives
            on the ingredients page.
          </p>
        </div>
        <a
          href="/ingredients"
          className="font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-[#1B2757] border border-[#1B2757]/30 hover:border-[#1B2757] px-4 min-h-[44px] inline-flex items-center justify-center transition-colors whitespace-nowrap"
        >
          All 16 actives ↗
        </a>
      </div>
    </div>
  );
}
