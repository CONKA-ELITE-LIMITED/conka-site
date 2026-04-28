"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FigurePlate from "@/app/components/FigurePlate";
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

  const listRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [railState, setRailState] = useState({ activeIndex: 0, railOffsetPx: 0, railTotalPx: 0, railFillPx: 0 });
  const { activeIndex, railOffsetPx, railTotalPx, railFillPx } = railState;
  const [isNearViewport, setIsNearViewport] = useState(false);

  // Reset scroll state when formula switches
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setRailState({ activeIndex: 0, railOffsetPx: 0, railTotalPx: 0, railFillPx: 0 });
    });
    return () => cancelAnimationFrame(id);
  }, [selectedFormula]);

  // Gate: scroll listener only runs while the timeline is near the viewport
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      (entries) => { setIsNearViewport(entries[0].isIntersecting); },
      { rootMargin: "300px 0px 300px 0px" },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // rAF-throttled scroll compute — mirrors LabTimeline exactly
  useEffect(() => {
    if (!isNearViewport) return;
    if (typeof window === "undefined") return;

    let rafId: number | null = null;
    const compute = () => {
      rafId = null;
      const list = listRef.current;
      const dots = dotRefs.current.filter((d): d is HTMLDivElement => d !== null);
      if (!list || dots.length === 0) return;

      const listRect = list.getBoundingClientRect();
      const dotCenters = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return r.top - listRect.top + r.height / 2;
      });

      const firstY = dotCenters[0];
      const lastY = dotCenters[dotCenters.length - 1];
      const totalSpan = Math.max(0, lastY - firstY);
      const vCenterRelToList = window.innerHeight / 2 - listRect.top;

      let active = 0;
      for (let i = 0; i < dotCenters.length; i++) {
        if (vCenterRelToList >= dotCenters[i]) active = i;
      }

      let fillPx = 0;
      if (vCenterRelToList >= lastY) {
        fillPx = totalSpan;
      } else if (vCenterRelToList > firstY) {
        for (let i = 0; i < dotCenters.length - 1; i++) {
          if (
            vCenterRelToList >= dotCenters[i] &&
            vCenterRelToList <= dotCenters[i + 1]
          ) {
            const t =
              (vCenterRelToList - dotCenters[i]) /
              (dotCenters[i + 1] - dotCenters[i]);
            const segStart = dotCenters[i] - firstY;
            const segEnd = dotCenters[i + 1] - firstY;
            fillPx = segStart + (segEnd - segStart) * t;
            break;
          }
        }
      }

      setRailState({ activeIndex: active, railOffsetPx: firstY, railTotalPx: totalSpan, railFillPx: fillPx });
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [isNearViewport]);

  return (
    <div>
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
        <FigurePlate
          n={2}
          subject={selectedFormula === "01" ? "CONKA Flow" : "CONKA Clear"}
          meta={selectedFormula === "01" ? "Morning ritual" : "Afternoon ritual"}
        >
          <div className="relative aspect-[4/3] overflow-hidden border border-black/12">
            <Image
              src={
                selectedFormula === "01"
                  ? "/lifestyle/flow/FlowShadow.jpg"
                  : "/lifestyle/clear/ClearLaugh.jpg"
              }
              alt={
                selectedFormula === "01"
                  ? "CONKA Flow shot"
                  : "CONKA Clear in use"
              }
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </FigurePlate>
      </div>

      {/* 4. Vertical timeline */}
      <div ref={listRef} className="relative mb-8">
        {/* Rail base — spans first-dot-centre to last-dot-centre */}
        <div
          className="absolute left-[5px] w-px bg-black/10"
          style={{ top: `${railOffsetPx}px`, height: `${railTotalPx}px` }}
          aria-hidden
        />
        {/* Rail fill — grows as scroll progresses */}
        <div
          className="absolute left-[5px] w-px bg-[var(--brand-accent)]"
          style={{ top: `${railOffsetPx}px`, height: `${railFillPx}px` }}
          aria-hidden
        />

        {timeline.map((stage, index) => {
          const isPassed = index <= activeIndex;
          return (
            <div
              key={index}
              aria-current={index === activeIndex ? "step" : undefined}
              className={`relative flex gap-4 pb-8 last:pb-0 motion-safe:transition-opacity motion-safe:duration-300 ${
                isPassed ? "opacity-100" : "opacity-50"
              }`}
            >
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  ref={(el) => { dotRefs.current[index] = el; }}
                  className={`w-2.5 h-2.5 flex-shrink-0 motion-safe:transition-colors motion-safe:duration-300 ${
                    isPassed ? "bg-[var(--brand-accent)]" : "bg-black/20"
                  }`}
                  aria-hidden
                />
              </div>

              <div className="flex-1 -mt-1 min-w-0">
                <span
                  className={`inline-block font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums px-2.5 py-1 mb-2 motion-safe:transition-colors motion-safe:duration-300 ${
                    isPassed
                      ? "bg-[var(--brand-accent)] text-white"
                      : "bg-black/8 text-black/50"
                  }`}
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
          );
        })}
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

    </div>
  );
}
