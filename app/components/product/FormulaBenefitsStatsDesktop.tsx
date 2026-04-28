// TODO: no longer used on /conka-flow PDP. Check if can be deleted once /conka-clarity and /protocol/3 are swept.

import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { FormulaId, formulaContent } from "@/app/lib/productData";
import { CURATED_STATS } from "./formulaStatsData";

const PRODUCT_IMAGE: Record<FormulaId, { src: string; alt: string }> = {
  "01": {
    src: "/lifestyle/ConkaAtWorkDesk.jpg",
    alt: "CONKA Flow at a work desk",
  },
  "02": {
    src: "/lifestyle/BlurGrab.jpg",
    alt: "Reaching for CONKA Clear",
  },
};

/** Per-formula lifestyle assets for the 3 supporting thumbnails */
const SUPPORTING_ASSETS: Record<FormulaId, { src: string; alt: string }[]> = {
  "01": [
    { src: "/lifestyle/flow/FlowBoxOpen.jpg", alt: "Unboxing CONKA Flow" },
    { src: "/lifestyle/flow/FlowDrink.jpg", alt: "Drinking CONKA Flow" },
    { src: "/lifestyle/flow/FlowLeaf.jpg", alt: "Holding CONKA Flow bottle" },
  ],
  "02": [
    { src: "/lifestyle/ConkaJeansHold.jpg", alt: "Holding CONKA Clear casually" },
    { src: "/lifestyle/clear/ClearTable.jpg", alt: "CONKA Clear on a desk" },
    { src: "/lifestyle/clear/ClearBag.jpg", alt: "CONKA Clear in a bag" },
  ],
};

interface FormulaBenefitsStatsDesktopProps {
  formulaId: FormulaId;
}

export default function FormulaBenefitsStatsDesktop({
  formulaId,
}: FormulaBenefitsStatsDesktopProps) {
  const formula = formulaContent[formulaId];
  const productImage = PRODUCT_IMAGE[formulaId];
  const stats = CURATED_STATS[formulaId];

  return (
    <div className="grid grid-cols-2 md:min-h-[480px] gap-12 md:gap-16 lg:gap-20 items-center">
      {/* Left: content */}
      <div className="flex flex-col justify-center pt-6 md:pt-8">
        {/* Trio header */}
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Measured outcomes · PROOF-01"}
        </p>
        <h2
          id="benefits-stats-heading"
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          {formula.subheadline}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8">
          {stats.length} Stats · Peer-reviewed · Observed
        </p>

        {/* Lab asset frame — spec strip */}
        <div className="lab-asset-frame bg-white mb-8">
          <div className="flex flex-col">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-baseline justify-between gap-4 p-5 ${
                  idx < stats.length - 1 ? "border-b border-black/8" : ""
                }`}
              >
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50 max-w-[55%]">
                  {item.label}
                </p>
                <p className="font-mono text-3xl md:text-4xl font-bold tabular-nums text-black leading-none">
                  {item.stat}
                  <sup className="text-sm font-normal opacity-50 ml-0.5 tabular-nums">
                    {item.anchor}
                  </sup>
                </p>
              </div>
            ))}
          </div>
        </div>

        <ConkaCTAButton href="#proof-and-science" meta={null}>
          See the science
        </ConkaCTAButton>
      </div>

      {/* Right: lifestyle imagery */}
      <div className="space-y-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--brand-tint)] border border-black/8">
          <Image
            src={productImage.src}
            alt={productImage.alt}
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority={false}
          />
        </div>
        <div className="grid grid-cols-3 gap-3 w-full">
          {SUPPORTING_ASSETS[formulaId].map((asset, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden bg-[var(--brand-tint)] border border-black/8"
            >
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 33vw, 16vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
