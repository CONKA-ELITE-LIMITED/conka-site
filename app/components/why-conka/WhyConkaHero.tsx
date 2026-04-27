"use client";

import Image from "next/image";

export function WhyConkaHero() {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-12 lg:gap-16">
      <div className="flex-1 w-full">
        <div className="relative w-full aspect-[4/5] border border-black/12 overflow-hidden bg-[#f5f5f5]">
          <Image
            src="/lifestyle/clear/ClearJeansTwo.jpg"
            alt="CONKA Clear shot held at the hip"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
          <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
            Fig. 00
          </span>
          <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
            Overview
          </span>
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col items-start text-left justify-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-4">
          {"// The CONKA framework · CONKA-00"}
        </p>
        <h1
          id="why-conka-hero-heading"
          className="brand-h1 text-black mb-4 max-w-[22ch]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Why CONKA?
        </h1>
        <p className="text-base md:text-lg text-black/75 leading-relaxed mb-4 max-w-2xl">
          CONKA could change your life. Below are the seven reasons high-performing
          people choose research-backed cognitive enhancement.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          32 PubMed studies · 25+ clinical trials · Informed Sport certified
        </p>
      </div>
    </div>
  );
}

export default WhyConkaHero;
