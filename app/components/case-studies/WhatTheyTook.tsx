import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import type { AthleteData } from "@/app/lib/caseStudiesData";

type ProductVersion = AthleteData["productVersion"];

type ProductCfg = {
  label: string;
  href: string;
  bottles: { src: string; alt: string; name: string }[];
};

const FLOW = {
  src: "/formulas/conkaFlow/FlowNoBackground.png",
  alt: "CONKA Flow",
  name: "Flow",
};
const CLEAR = {
  src: "/formulas/conkaClear/ClearNoBackground.png",
  alt: "CONKA Clear",
  name: "Clear",
};

function resolveProduct(version: ProductVersion): ProductCfg {
  if (version === "01") {
    return { label: "CONKA Flow", href: "/conka-flow", bottles: [FLOW] };
  }
  if (version === "02") {
    return { label: "CONKA Clear", href: "/conka-clarity", bottles: [CLEAR] };
  }
  return {
    label: "Flow + Clear",
    href: "/conka-both",
    bottles: [FLOW, CLEAR],
  };
}

export default function WhatTheyTook({
  version,
  variant = "desktop",
}: {
  version: ProductVersion;
  variant?: "desktop" | "mobile";
}) {
  const product = resolveProduct(version);
  const isBoth = product.bottles.length === 2;
  const meta = isBoth
    ? "// balance protocol · flow + clear"
    : `// ${product.label.toLowerCase()} · single formula`;

  return (
    <div className="bg-white border border-black/12">
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
          What they took
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
          {product.label}
        </p>
      </div>

      <div
        className={`grid ${isBoth ? "grid-cols-2" : "grid-cols-1"} border-b border-black/8`}
      >
        {product.bottles.map((bottle, idx) => (
          <div
            key={bottle.name}
            className={`flex items-center justify-center ${idx === 0 && isBoth ? "border-r border-black/8" : ""} ${
              variant === "desktop" ? "py-6" : "py-5"
            } bg-white`}
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className={`relative ${variant === "desktop" ? "w-14 h-20" : "w-12 h-16"} flex-shrink-0`}
              >
                <Image
                  src={bottle.src}
                  alt={bottle.alt}
                  fill
                  sizes={variant === "desktop" ? "56px" : "48px"}
                  className="object-contain object-center"
                />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/70 tabular-nums">
                CONKA {bottle.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={`${variant === "desktop" ? "p-5" : "p-4"}`}>
        <ConkaCTAButton href={product.href} meta={meta}>
          Get what they took
        </ConkaCTAButton>
      </div>
    </div>
  );
}
