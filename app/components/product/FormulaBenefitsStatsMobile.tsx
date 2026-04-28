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

interface FormulaBenefitsStatsMobileProps {
  formulaId: FormulaId;
}

export default function FormulaBenefitsStatsMobile({
  formulaId,
}: FormulaBenefitsStatsMobileProps) {
  const formula = formulaContent[formulaId];
  const productImage = PRODUCT_IMAGE[formulaId];
  const stats = CURATED_STATS[formulaId];

  return (
    <div className="flex flex-col">
      {/* Photo */}
      <div className="relative w-full aspect-square overflow-hidden border border-black/8">
        <Image
          src={productImage.src}
          alt={productImage.alt}
          fill
          className="object-cover"
          style={{
            objectPosition: "center center",
            transform: formulaId === "02" ? "scale(1.3)" : "scale(1)",
          }}
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Trio header */}
      <div className="pt-6">
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
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {stats.length} Stats · Peer-reviewed · Observed
        </p>
      </div>

      {/* Lab asset frame — spec strip */}
      <div className="lab-asset-frame bg-white mt-6">
        <div className="flex flex-col">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-baseline justify-between gap-3 p-4 ${
                idx < stats.length - 1 ? "border-b border-black/8" : ""
              }`}
            >
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50 max-w-[55%]">
                {item.label}
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-black leading-none">
                {item.stat}
                <sup className="text-xs font-normal opacity-50 ml-0.5 tabular-nums">
                  {item.anchor}
                </sup>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6 pb-8">
        <ConkaCTAButton href="#proof-and-science" meta={null} className="w-full max-w-none">
          See the science
        </ConkaCTAButton>
      </div>
    </div>
  );
}
