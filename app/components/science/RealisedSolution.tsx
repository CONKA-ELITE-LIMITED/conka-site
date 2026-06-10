import Link from "next/link";
import Image from "next/image";
import { formulaContent } from "@/app/lib/productData";
import { getFormulaImage } from "@/app/lib/productImageConfig";

interface HeroActive {
  name: string;
  scientificName: string;
  render: string;
  mechanism: string;
  pmid: string;
}

interface ProductData {
  number: string;
  name: string;
  categoryTag: string;
  systemLabel: string;
  benefitHeadline: string;
  bodyCopy: string;
  render: string;
  link: string;
  // Total active load per serving, in mg. The total is public (shown on the
  // PDP); the per-ingredient breakdown is patented and deliberately not shown.
  // Mirrors FORMULA_GRAMMAGE in ClinicalIngredients.tsx (founder-supplied,
  // 2026-06) — keep the two in sync.
  activeMg: number;
  actives: HeroActive[];
}

const PRODUCTS: ProductData[] = [
  {
    number: "01",
    name: formulaContent["01"].name,
    categoryTag: "CONKA · FLOW",
    systemLabel: "Resilience system",
    benefitHeadline: "Energy without the crash",
    bodyCopy:
      "Sustained focus for training and work. No caffeine, no crash. The adaptogen side of the model, built to raise the floor you operate from.",
    render: getFormulaImage("01"),
    link: "/conka-flow",
    activeMg: 3700,
    actives: [
      {
        name: "Ashwagandha",
        scientificName: "Withania somnifera",
        render: "/ingredients/renders/Ashwagandha.jpg",
        mechanism:
          "An adaptogen that helps lower cortisol and steady the stress response.",
        pmid: "23439798",
      },
      {
        name: "Rhodiola rosea",
        scientificName: "Rhodiola rosea",
        render: "/ingredients/renders/RhodiolaRosea.jpg",
        mechanism:
          "Pushes back on burnout and mental fatigue under sustained load.",
        pmid: "19016404",
      },
      {
        name: "Lemon balm",
        scientificName: "Melissa officinalis",
        render: "/ingredients/renders/LemonBalm.jpg",
        mechanism:
          "Calming without sedation, it takes the edge off while keeping you clear.",
        pmid: "16444660",
      },
    ],
  },
  {
    number: "02",
    name: formulaContent["02"].name,
    categoryTag: "CONKA · CLEAR",
    systemLabel: "Performance system",
    benefitHeadline: "Mental clarity and complete recovery",
    bodyCopy:
      "Sharpen performance when you need it, support recovery when you're done. The nootropic side of the model, for the demand in front of you.",
    render: getFormulaImage("02"),
    link: "/conka-clarity",
    activeMg: 3142,
    actives: [
      {
        name: "Alpha-GPC",
        scientificName: "L-Alpha-glycerylphosphorylcholine",
        render: "/ingredients/renders/AlphaGPC.jpg",
        mechanism:
          "A bioavailable choline source that raises acetylcholine, behind focus and recall.",
        pmid: "12882463",
      },
      {
        name: "Ginkgo biloba",
        scientificName: "Ginkgo biloba",
        render: "/ingredients/renders/GinkgoBiloba.jpg",
        mechanism:
          "Supports cerebral blood flow, getting more oxygen to working neurons.",
        pmid: "19395013",
      },
      {
        name: "N-acetyl cysteine",
        scientificName: "N-acetyl-L-cysteine",
        render: "/ingredients/renders/NAcetylCysteine.jpg",
        mechanism:
          "Rebuilds glutathione, the brain's master antioxidant, against oxidative stress.",
        pmid: "18436195",
      },
    ],
  },
];

export default function RealisedSolution() {
  return (
    <div>
      {/* Header — the framing beat: model becomes product */}
      <div className="mb-8 lg:mb-10 max-w-2xl">
        <p className="brand-eyebrow mb-3">{"// The solution · SCI-05"}</p>
        <h2
          className="brand-h2 text-black mb-4"
          style={{ letterSpacing: "-0.02em" }}
        >
          From the model to the shot.
        </h2>
        <p className="text-sm md:text-base text-black/75 leading-relaxed">
          The two systems are the theory. Flow and Clear are where it gets made
          real: two formulas drawn from the same model, built over years of
          formulation work, university research, and serious investment. No
          proprietary blends, no under-dosing, no fillers.
        </p>
      </div>

      {/* Two protagonist cards, equal weight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {PRODUCTS.map((product) => (
          <div
            key={product.name}
            className="flex flex-col bg-white border border-black/12 overflow-hidden"
          >
            {/* Category row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
              <span className="font-mono text-[11px] font-bold tabular-nums text-black/40 leading-none">
                {product.number}.
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/60 leading-none">
                {product.categoryTag}
              </span>
            </div>

            {/* Product render leads — shorter crop on desktop to keep the card compact */}
            <Link
              href={product.link}
              className="relative block w-full aspect-[4/3] lg:aspect-[16/9] overflow-hidden border-b border-black/8 group bg-white"
            >
              <Image
                src={product.render}
                alt={`CONKA ${product.name}`}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 90vw, 600px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-0 right-0 bg-[#1B2757] text-white px-3 py-1.5 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] leading-none whitespace-nowrap">
                  {product.systemLabel}
                </span>
              </div>
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50 mb-2 leading-none">
                {product.name}
              </p>
              <h3 className="text-xl lg:text-2xl font-semibold text-black leading-tight mb-3">
                {product.benefitHeadline}
              </h3>
              <p className="text-sm text-black/65 leading-relaxed mb-4">
                {product.bodyCopy}
              </p>

              {/* Total active load — hero number, per-ingredient doses stay private */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-black/12">
                <span className="text-3xl font-semibold tabular-nums text-[#1B2757] leading-none">
                  {product.activeMg.toLocaleString()}
                  <span className="text-lg font-semibold">mg</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/45 tabular-nums leading-tight">
                  Active ingredients
                  <br />
                  per serving
                </span>
              </div>

              {/* Hero actives folded in as proof — render + mechanism, no dose */}
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums mb-3">
                Three of the hero actives
              </p>
              <ul className="space-y-3 mb-5">
                {product.actives.map((active) => (
                  <li key={active.name} className="flex gap-3">
                    <div className="relative w-14 h-14 shrink-0 border border-black/8 overflow-hidden bg-white">
                      <Image
                        src={active.render}
                        alt={`Render of ${active.name}`}
                        fill
                        loading="lazy"
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-black leading-tight">
                        {active.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/45 tabular-nums mt-0.5">
                        {active.scientificName}
                      </span>
                      <p className="text-sm text-black/65 leading-snug mt-1.5">
                        {active.mechanism}
                      </p>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${active.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#1B2757] hover:underline tabular-nums mt-1 inline-flex items-center self-start min-h-[44px]"
                      >
                        Peer-reviewed · PMID {active.pmid} ↗
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Soft CTA — to the PDP, not a buy button */}
              <Link
                href={product.link}
                className="mt-auto font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums text-[#1B2757] border border-[#1B2757]/30 hover:border-[#1B2757] px-4 min-h-[44px] inline-flex items-center justify-center transition-colors"
              >
                See the full {product.name} formula ↗
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bridge to the full catalogue */}
      <div className="mt-8 lg:mt-10 bg-white border border-black/12 p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-base font-semibold text-black leading-tight">
            That is six of them. There are 16 in all.
          </p>
          <p className="text-sm text-black/65 leading-relaxed mt-1">
            Every active across both formulas, with the studies behind it, lives
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
