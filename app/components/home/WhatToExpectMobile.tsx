"use client";

import { useState } from "react";
import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import {
  timelineFlow,
  timelineClear,
  type TimelineStage,
} from "@/app/lib/whatToExpectLanding";

interface WhatToExpectMobileProps {
  /** When set (PDP), show single product only and hide the toggle. */
  productId?: "01" | "02";
}

export default function WhatToExpectMobile({ productId }: WhatToExpectMobileProps) {
  const [toggleFormula, setToggleFormula] = useState<"01" | "02">("01");
  const selectedFormula = productId ?? toggleFormula;
  const timeline: TimelineStage[] =
    selectedFormula === "01" ? timelineFlow : timelineClear;
  const showToggle = productId == null;

  return (
    <div className="[animation:none] [&_*]:!animate-none">
      {/* 1. Section header */}
      <div className="mb-10">
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
          {timeline.length} Stages · Compounds over time
        </p>
      </div>

      {/* 2. Product toggle — image buttons (only when landing) */}
      {showToggle && (
        <div className="flex gap-3 justify-center mb-6">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setToggleFormula("01")}
              className={`flex items-center justify-center w-20 h-20 bg-white border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                selectedFormula === "01"
                  ? "border-black opacity-100"
                  : "border-black/8 opacity-60"
              }`}
              aria-pressed={selectedFormula === "01"}
            >
              <span className="relative w-12 h-14 flex-shrink-0 block">
                <Image
                  src="/formulas/conkaFlow/FlowNoBackground.png"
                  alt=""
                  fill
                  className="object-contain scale-110"
                  sizes="48px"
                  aria-hidden
                />
              </span>
            </button>
            <span className="mt-1.5 text-xs font-semibold text-center text-black">
              Flow
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setToggleFormula("02")}
              className={`flex items-center justify-center w-20 h-20 bg-white border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                selectedFormula === "02"
                  ? "border-black opacity-100"
                  : "border-black/8 opacity-60"
              }`}
              aria-pressed={selectedFormula === "02"}
            >
              <span className="relative w-12 h-14 flex-shrink-0 block">
                <Image
                  src="/formulas/conkaClear/ClearNoBackground.png"
                  alt=""
                  fill
                  className="object-contain scale-110"
                  sizes="48px"
                  aria-hidden
                />
              </span>
            </button>
            <span className="mt-1.5 text-xs font-semibold text-center text-black">
              Clear
            </span>
          </div>
        </div>
      )}

      {/* 3. Main lifestyle image */}
      <div className="mb-8">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--brand-tint)] border border-black/8">
          <Image
            src={
              selectedFormula === "01"
                ? "/lifestyle/FlowBoxOpen.jpg"
                : "/lifestyle/ClearLaugh.jpg"
            }
            alt={
              selectedFormula === "01"
                ? "Morning routine with CONKA Flow"
                : "Peak performance with CONKA Clear"
            }
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mt-3">
          {selectedFormula === "01"
            ? "CONKA Flow for clean sustained energy"
            : "CONKA Clear for peak performance"}
        </p>
      </div>

      {/* 4. Vertical timeline */}
      <div className="mb-8">
        {timeline.map((stage, index) => (
          <div
            key={index}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-2.5 h-2.5 bg-[var(--brand-accent)] flex-shrink-0"
                aria-hidden
              />
              <div
                className="w-0.5 flex-1 min-h-[1rem] bg-[var(--brand-accent)] mt-2"
                aria-hidden
              />
            </div>

            <div className="flex-1 -mt-1 min-w-0">
              <span
                className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-2.5 py-1 bg-[var(--brand-accent)] text-white mb-2"
                aria-hidden
              >
                {stage.subheading}
              </span>
              <h3 className="text-lg font-bold mb-2 text-black">
                {stage.heading}
              </h3>
              <p className="brand-caption text-black/60 leading-relaxed">
                {stage.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 5. How to use card */}
      <div className="mb-8 bg-white border border-black/8 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 relative bg-[var(--brand-tint)] border border-black/8 overflow-hidden flex items-center justify-center p-1">
            <Image
              src={
                selectedFormula === "01"
                  ? "/formulas/conkaFlow/FlowNoBackground.png"
                  : "/formulas/conkaClear/ClearNoBackground.png"
              }
              alt=""
              fill
              className="object-contain object-center"
              sizes="64px"
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
                : "Take one 30ml shot of CONKA Clear 30-60 minutes before peak performance, or in the afternoon to support recovery and sleep quality."}
            </p>

            {showToggle && (
              <ConkaCTAButton
                href={
                  selectedFormula === "01" ? "/conka-flow" : "/conka-clarity"
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

      {/* 6. Supporting images — 2-column grid */}
      <div className="grid grid-cols-2 gap-3">
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
            className="object-cover"
            sizes="50vw"
            loading="lazy"
          />
        </div>
        <div className="relative aspect-square overflow-hidden bg-[var(--brand-tint)] border border-black/8">
          <Image
            src={
              selectedFormula === "01" ? "/vibe/water.jpg" : "/vibe/sky.jpg"
            }
            alt={selectedFormula === "01" ? "Water flow" : "Clear sky"}
            fill
            className="object-cover"
            sizes="50vw"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
