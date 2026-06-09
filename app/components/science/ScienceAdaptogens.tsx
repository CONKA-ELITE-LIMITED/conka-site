"use client";

import Image from "next/image";
import useIsMobile from "@/app/hooks/useIsMobile";

const TAGS = [
  "HPA Axis Modulation",
  "Cortisol Regulation",
  "Non-Sedating",
];

const ADAPTOGENS = [
  { name: "Ashwagandha", role: "Cortisol modulator" },
  { name: "Rhodiola rosea", role: "Anti-fatigue" },
  { name: "Lemon Balm", role: "Calm without sedation" },
];

export default function ScienceAdaptogens() {
  const isMobile = !!useIsMobile();
  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// The foundation · SCI-01"}
        </p>
        <h2
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          What are adaptogens?
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Natural compounds · HPA-axis modulators · Clinical evidence
        </p>
      </div>

      <div
        className={`grid gap-6 lg:gap-10 ${
          isMobile ? "grid-cols-1" : "lg:grid-cols-2 lg:items-start"
        }`}
      >
        {/* Text */}
        <div className={isMobile ? "order-2" : ""}>
          <div className="space-y-4 max-w-xl">
            <p className="text-sm md:text-base text-black/75 leading-relaxed">
              Adaptogens are natural compounds that help your body adapt to
              stress. Unlike stimulants that force a response, adaptogens work
              by normalizing physiological functions and maintaining
              homeostasis.
            </p>
            <p className="text-sm md:text-base text-black/75 leading-relaxed">
              Your stress response was designed for acute threats — not
              12-hour workdays. Adaptogens modulate the HPA axis to normalize
              cortisol, so you stay sharp under pressure without the crash.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-6">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums px-3 py-1 border border-black/12 bg-white text-black/70"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Adaptogen table */}
          <div className="mt-6 border border-black/12 bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/8">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                Primary adaptogens
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                CONKA Flow
              </p>
            </div>
            {ADAPTOGENS.map((a, idx) => (
              <div
                key={a.name}
                className={`flex items-baseline justify-between gap-4 px-4 py-3 ${
                  idx < ADAPTOGENS.length - 1 ? "border-b border-black/8" : ""
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-black/35 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-black">
                    {a.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/55 tabular-nums text-right">
                  {a.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div
          className={`${isMobile ? "order-1" : ""} relative aspect-[4/3] lg:aspect-[5/6] border border-black/12 bg-white overflow-hidden`}
        >
          <Image
            src="/lifestyle/flow/FlowLeaf.jpg"
            alt="CONKA Flow bottle held among leaves, showing natural ingredient origin"
            fill
            sizes={isMobile ? "95vw" : "50vw"}
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
            aria-hidden
          />
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 02 · Flow adaptogens
          </div>
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 mb-1">
              CONKA Flow contains
            </p>
            <p className="font-mono text-lg lg:text-xl font-bold tabular-nums leading-tight">
              3 research-backed adaptogens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
