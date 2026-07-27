import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  getFormulaPresentation,
  type AthleteData,
} from "@/app/lib/caseStudiesData";

type ProductVersion = AthleteData["productVersion"];

export default function WhatTheyTook({
  version,
  variant = "desktop",
}: {
  version: ProductVersion;
  variant?: "desktop" | "mobile";
}) {
  const product = getFormulaPresentation(version);

  return (
    <div className="bg-white rounded-md border border-black/12 overflow-hidden shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
          What they took
        </p>
        <span
          className={`text-[11px] font-semibold uppercase tracking-[0.12em] tabular-nums rounded-full px-2.5 py-0.5 ${product.badgeClass}`}
        >
          {product.label}
        </span>
      </div>

      <div className={`${variant === "desktop" ? "p-5" : "p-4"}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden border border-black/8 bg-[#f3f4f7]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <p className="text-sm font-semibold text-black">{product.label}</p>
        </div>
        <ConkaCTAButton href={product.href} meta={null}>
          Get what they took
        </ConkaCTAButton>
      </div>
    </div>
  );
}
