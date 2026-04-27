"use client";

import Image from "next/image";
import type { WhyConkaPoint } from "@/app/lib/whyConkaData";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

interface WhyConkaSectionProps {
  point: WhyConkaPoint;
  totalPoints: number;
  variant?: "desktop" | "mobile";
}

export function WhyConkaSection({
  point,
  totalPoints,
  variant = "desktop",
}: WhyConkaSectionProps) {
  const formattedId = String(point.id).padStart(2, "0");
  const formattedTotal = String(totalPoints).padStart(2, "0");
  const counterLabel = `// Reason ${formattedId}/${formattedTotal} · CONKA-00`;

  const imageBlock = (
    <div className="relative w-full aspect-[4/5] border border-black/12 overflow-hidden bg-[#f5f5f5]">
      {point.image ? (
        <Image
          src={point.image}
          alt={point.headline}
          fill
          sizes={variant === "mobile" ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30 tabular-nums">
            Fig. {formattedId} · placeholder
          </span>
        </div>
      )}
      <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
        Fig. {formattedId}
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
        Reason {formattedId} / {formattedTotal}
      </span>
    </div>
  );

  const textBlock = (
    <div className="flex flex-col">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-4">
        {counterLabel}
      </p>
      <h2
        className={`${
          variant === "mobile" ? "brand-h3" : "brand-h2"
        } text-black mb-3`}
        style={{ letterSpacing: "-0.02em" }}
      >
        {point.headline}.
      </h2>
      <p
        className={`${
          variant === "mobile" ? "text-base" : "text-lg md:text-xl"
        } text-black/80 leading-snug mb-5`}
        style={{ letterSpacing: "-0.01em" }}
      >
        {point.subheading}.
      </p>
      <p className="text-sm md:text-base text-black/75 leading-relaxed mb-5">
        {point.description}
      </p>
      {point.id === 4 && (
        <div className="mt-2">
          <AppInstallButtons variant="clinical" iconSize={16} />
        </div>
      )}
    </div>
  );

  if (variant === "mobile") {
    return (
      <div data-section-id={point.id} className="flex flex-col gap-6">
        {imageBlock}
        {textBlock}
      </div>
    );
  }

  const imageFirst = point.id % 2 === 0;

  return (
    <div
      className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16"
      data-section-id={point.id}
    >
      <div className={`flex-1 w-full ${imageFirst ? "md:order-1" : "md:order-2"}`}>
        {imageBlock}
      </div>
      <div
        className={`flex-1 w-full ${imageFirst ? "md:order-2" : "md:order-1"}`}
      >
        {textBlock}
      </div>
    </div>
  );
}

export default WhyConkaSection;
