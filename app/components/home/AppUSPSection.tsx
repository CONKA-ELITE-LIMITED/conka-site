"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

const ROWS = [
  {
    counter: "01",
    tabLabel: "Difference",
    label: "The difference",
    body: "Other brands tell you it works. CONKA gives you a cognitive test and a daily log so you can watch it happen.",
    asset: "/app/AppConkaRing.png",
    assetAlt: "CONKA app cognitive score ring with daily tracking",
  },
  {
    counter: "02",
    tabLabel: "The app",
    label: "What it is",
    body: "A companion app with a two-minute cognitive test backed by NHS clinical validation, a daily wellness log, and a progress graph you own.",
    asset: "/app/AppTestBreakdown.png",
    assetAlt: "CONKA app cognitive test breakdown and results screen",
  },
  {
    counter: "03",
    tabLabel: "The value",
    label: "Why it matters",
    body: "See processing speed, sleep, stress and training line up on one screen. If it is working, the graph says so. If it is not, you know what to adjust.",
    asset: "/app/AppWellness.png",
    assetAlt: "CONKA app wellness log showing sleep, stress and training trends",
  },
];

export default function AppUSPSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  // Track which tabs have been visited so inactive phone images do not
  // load until the user first clicks into them.
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectTab = useCallback((idx: number) => {
    setActiveIndex(idx);
    setVisited((prev) => {
      if (prev.has(idx)) return prev;
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      let nextIdx: number | null = null;
      if (e.key === "ArrowRight") nextIdx = (idx + 1) % ROWS.length;
      else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + ROWS.length) % ROWS.length;
      else if (e.key === "Home") nextIdx = 0;
      else if (e.key === "End") nextIdx = ROWS.length - 1;
      if (nextIdx !== null) {
        e.preventDefault();
        selectTab(nextIdx);
        tabRefs.current[nextIdx]?.focus();
      }
    },
    [selectTab],
  );

  const active = ROWS[activeIndex];

  return (
    <div className="w-full">
      {/* Trio header */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
        {"// Proof, not promises · APP-01"}
      </p>
      <h2
        className="brand-h1 text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Most brands claim results. We let you measure yours.
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mt-3 mb-8 lg:mb-12">
        Your score · Your data · Your proof
      </p>

      {/* Mobile stacks naturally (asset, tabs, panel). Desktop switches
          to a 2-col grid: tabs span both cols on row 1, panel on row 2
          col 1, asset on row 2 col 2. Panel vertical-centers its content
          so the tall asset does not leave a hollow card next to it. */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
        {/* Phone asset — mobile row 1; desktop row 2 col 2 */}
        <div className="relative aspect-square border border-black/12 bg-[#f5f5f5] overflow-hidden mb-6 lg:mb-0 lg:col-start-2 lg:row-start-2">
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
            Fig. 01 · CONKA App
          </div>
          {ROWS.map((row, idx) => {
            if (!visited.has(idx)) return null;
            const isActive = idx === activeIndex;
            return (
              <div
                key={row.asset}
                aria-hidden={!isActive}
                className={`absolute left-1/2 -translate-x-1/2 top-[25%] w-[60%] lg:w-[55%] aspect-[1/2] transition-opacity duration-300 ease-out ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={row.asset}
                  alt={row.assetAlt}
                  fill
                  sizes="(max-width: 1024px) 60vw, 330px"
                  className="object-contain"
                  priority={false}
                />
              </div>
            );
          })}
          <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
            iOS · Android
          </div>
        </div>

        {/* Tabs — mobile row 2; desktop row 1 spanning both cols */}
        <div
          role="tablist"
          aria-label="CONKA app features"
          aria-orientation="horizontal"
          className="grid grid-cols-3 border border-black/12 lg:col-span-2 lg:row-start-1"
        >
          {ROWS.map((row, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={row.counter}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`app-usp-tab-${idx}`}
                aria-selected={isActive}
                aria-controls={`app-usp-panel-${idx}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`min-h-[56px] lg:min-h-[64px] px-3 py-3 lg:px-6 lg:py-4 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/60 focus-visible:ring-offset-2 flex flex-col items-start lg:flex-row lg:items-baseline lg:gap-3 ${
                  idx < ROWS.length - 1 ? "border-r border-black/12" : ""
                } ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-white text-black/55 hover:text-black"
                }`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] leading-none tabular-nums">
                  {row.counter}
                </span>
                <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.14em] leading-tight mt-1.5 lg:mt-0 whitespace-nowrap">
                  {row.tabLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel — mobile row 3 (connected to tabs above); desktop row 2
            col 1, stretches to asset height with content vertically
            centered so the card reads as intentional whitespace. */}
        <div
          role="tabpanel"
          id={`app-usp-panel-${activeIndex}`}
          aria-labelledby={`app-usp-tab-${activeIndex}`}
          tabIndex={0}
          className="bg-white border border-black/12 border-t-0 px-5 py-6 lg:px-8 lg:py-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/30 lg:border-t lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:justify-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums mb-3">
            {active.counter} · {active.label}
          </p>
          <p className="text-sm md:text-base lg:text-lg text-black/75 leading-relaxed">
            {active.body}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 lg:mt-12">
        <ConkaCTAButton href="/app" meta="// track your own results">
          See the app
        </ConkaCTAButton>
      </div>
    </div>
  );
}
