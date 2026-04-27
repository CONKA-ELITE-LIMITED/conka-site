"use client";

import { useState } from "react";
import Image from "next/image";
import FormulaToggle from "@/app/components/FormulaToggle";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  timelineFlow,
  timelineClear,
  type TimelineStage,
} from "@/app/lib/whatToExpectLanding";

interface WhatToExpectDesktopProps {
  /** When set (PDP), show single product only and hide the toggle. */
  productId?: "01" | "02";
}

export default function WhatToExpectDesktop({
  productId,
}: WhatToExpectDesktopProps) {
  const [toggleFormula, setToggleFormula] = useState<"01" | "02">("01");
  const selectedFormula = productId ?? toggleFormula;
  const timeline: TimelineStage[] =
    selectedFormula === "01" ? timelineFlow : timelineClear;
  const showToggle = productId == null;

  return (
    <div className="[animation:none] [&_*]:!animate-none">
      {/* Section Header (+ Toggle only when landing) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// Protocol timeline · SCI-01"}
          </p>
          <h2
            className="brand-h1 mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            What to Expect with CONKA
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
            {timeline.length} Stages · Compounds over time · Not overnight
          </p>
        </div>

        {showToggle && (
          <FormulaToggle
            value={selectedFormula}
            onChange={setToggleFormula}
            ariaLabel="What to expect timeline formula"
          />
        )}
      </div>

      {/* Main 2-column layout: timeline left, visual right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Timeline */}
        <div className="relative">
          {timeline.map((stage, index) => (
            <div
              key={index}
              className="relative flex gap-4 lg:gap-6 pb-8 lg:pb-12 last:pb-0"
            >
              {/* Dot + connecting line (neuro blue accent) */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-[var(--brand-accent)] flex-shrink-0"
                  aria-hidden
                />
                <div
                  className="w-0.5 flex-1 min-h-[1rem] bg-[var(--brand-accent)] mt-2"
                  aria-hidden
                />
              </div>

              {/* Content */}
              <div className="flex-1 -mt-1 min-w-0">
                <span
                  className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-2.5 py-1 bg-[var(--brand-accent)] text-white mb-2"
                  aria-hidden
                >
                  {stage.subheading}
                </span>
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-black">
                  {stage.heading}
                </h3>
                <p className="brand-caption text-black/60 leading-relaxed">
                  {stage.body}
                </p>
              </div>
            </div>
          ))}

          {/* How to Use — under last step, left column */}
          <div className="mt-8 bg-white border border-black/8 p-6">
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 relative bg-[var(--brand-tint)] border border-black/8 overflow-hidden flex items-center justify-center p-1">
                <Image
                  src={
                    selectedFormula === "01"
                      ? "/formulas/conkaFlow/FlowNoBackground.png"
                      : "/formulas/conkaClear/ClearNoBackground.png"
                  }
                  alt=""
                  fill
                  loading="lazy"
                  className="object-contain object-center"
                  sizes="80px"
                  aria-hidden
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-2 text-black">
                  How to Use
                </h3>
                <p
                  className={
                    showToggle
                      ? "brand-caption text-black/60 mb-4"
                      : "brand-caption text-black/60"
                  }
                >
                  {selectedFormula === "01"
                    ? "Take one 30ml shot of CONKA Flow in the morning with or without food. Best as part of your morning routine for sustained energy throughout the day."
                    : "Take one 30ml shot of CONKA Clear in the afternoon to support recovery and sleep quality."}
                </p>
                {showToggle && (
                  <ConkaCTAButton
                    href={
                      selectedFormula === "01"
                        ? "/conka-flow"
                        : "/conka-clarity"
                    }
                    meta={
                      selectedFormula === "01"
                        ? "// morning formula"
                        : "// afternoon formula"
                    }
                  >
                    {selectedFormula === "01"
                      ? "View CONKA Flow"
                      : "View CONKA Clear"}
                  </ConkaCTAButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visual assets (sticky on desktop) */}
        <div className="lg:sticky lg:top-24">
          <div className="space-y-4">
            {/* Main lifestyle image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--brand-tint)] border border-black/8">
              <Image
                src={
                  selectedFormula === "01"
                    ? "/lifestyle/flow/FlowBoxOpen.jpg"
                    : "/lifestyle/clear/ClearLaugh.jpg"
                }
                alt={
                  selectedFormula === "01"
                    ? "Morning routine with CONKA Flow"
                    : "Peak performance with CONKA Clear"
                }
                fill
                loading="lazy"
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Two supporting images */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="relative aspect-square overflow-hidden bg-[var(--brand-tint)] border border-black/8">
                <Image
                  src={
                    selectedFormula === "01"
                      ? "/science/NeuronsConnection.jpg"
                      : "/science/OxidativeStress.webp"
                  }
                  alt={
                    selectedFormula === "01"
                      ? "Neural connections and synaptic activity"
                      : "Oxidative stress and cellular protection"
                  }
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square overflow-hidden bg-[var(--brand-tint)] border border-black/8">
                <Image
                  src={
                    selectedFormula === "01"
                      ? "/vibe/water.jpg"
                      : "/vibe/sky.jpg"
                  }
                  alt={selectedFormula === "01" ? "Water flow" : "Clear sky"}
                  fill
                  loading="lazy"
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mt-4">
            {selectedFormula === "01"
              ? "CONKA Flow for clean sustained energy"
              : "CONKA Clear for peak performance"}
          </p>
        </div>
      </div>
    </div>
  );
}
