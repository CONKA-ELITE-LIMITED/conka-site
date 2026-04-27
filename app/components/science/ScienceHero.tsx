"use client";

import Image from "next/image";

interface ScienceHeroProps {
  isMobile?: boolean;
}

export default function ScienceHero({ isMobile = false }: ScienceHeroProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
      {/* Copy */}
      <div className="order-2 lg:order-1 lg:flex-1 mt-10 lg:mt-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// The science · SCI-02"}
        </p>
        <h1
          className="brand-h1 text-black mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Every ingredient. Clinically dosed. Peer-reviewed.
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
          32 Studies · 6,000+ Participants · 16 Actives · £500K+ Research
        </p>
        <div className="space-y-4 max-w-xl">
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            CONKA&apos;s formulas are built on 32 peer-reviewed studies across
            6,000+ participants. Every ingredient is dosed at the levels proven
            effective in clinical trials — not marketing doses, not pixie dust.
          </p>
          <p className="text-sm md:text-base text-black/75 leading-relaxed">
            We partnered with Durham and Cambridge universities to develop, test,
            and patent our approach to cognitive performance nutrition.
          </p>
        </div>

        {/* Spec strip */}
        <div className="mt-8 grid grid-cols-3 gap-0 border border-black/12 bg-white max-w-lg">
          <div className="p-4 border-r border-black/8">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Studies
            </p>
            <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
              32
            </p>
          </div>
          <div className="p-4 border-r border-black/8">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Participants
            </p>
            <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
              6K+
            </p>
          </div>
          <div className="p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Patent
            </p>
            <p className="font-mono text-sm font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
              GB2620279
            </p>
          </div>
        </div>
      </div>

      {/* Hero image — spec-sheet frame */}
      <div className="relative order-1 lg:order-2 lg:flex-[1.1] w-full">
        <div className="relative aspect-[5/4] lg:aspect-[4/5] border border-black/12 bg-white overflow-hidden">
          <Image
            src="/lifestyle/CreationOfConka.jpg"
            alt="Two hands passing a CONKA bottle in the research lab"
            fill
            priority
            sizes={isMobile ? "95vw" : "50vw"}
            className="object-cover object-center"
          />
          {/* Corner plate + spec ticks */}
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 01 · Research Context
          </div>
          <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Durham · Cambridge
          </div>
        </div>
      </div>
    </div>
  );
}
