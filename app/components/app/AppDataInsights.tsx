"use client";

import { useEffect, useRef } from "react";
import { trackAppDataInsightsViewed } from "@/app/lib/analytics";

// ─── Stat cards ────────────────────────────────────────────────────────────────

type StatCard = {
  counter: string;
  topic: string;
  value: string;
  context: string;
  caveat: string;
};

const STAT_CARDS: StatCard[] = [
  {
    counter: "01.",
    topic: "REACTION",
    value: "+29ms",
    context: "Slower reaction times the morning after drinking.",
    caveat: "n=27 users · 113 hangover tests",
  },
  {
    counter: "02.",
    topic: "READINESS",
    value: "-16%",
    context: "Self-reported readiness drop on hangover days.",
    caveat: "n=8 users",
  },
  {
    counter: "03.",
    topic: "COGNITION",
    value: "-5 pts",
    context: "Score drop after 6 or more drinks the night before.",
    caveat: "n=11 users · 24 tests",
  },
  {
    counter: "04.",
    topic: "BEHAVIOUR",
    value: "+8%",
    context: "More caffeine consumed on hangover mornings.",
    caveat: "n=24 users",
  },
];

// ─── Wellness fingerprint ──────────────────────────────────────────────────────

type Factor = {
  code: string;
  label: string;
  delta: string;
  direction: string;
};

const FACTORS: Factor[] = [
  { code: "F-01", label: "Readiness", delta: "-16%", direction: "WORSE" },
  { code: "F-02", label: "Mental fatigue", delta: "-7%", direction: "WORSE" },
  { code: "F-03", label: "Hydration", delta: "-6%", direction: "WORSE" },
  { code: "F-04", label: "Caffeine intake", delta: "+8%", direction: "MORE" },
  { code: "F-05", label: "Sleep duration", delta: "-0.2%", direction: "NEGLIGIBLE" },
  { code: "F-06", label: "Conka intake", delta: "+10%", direction: "MORE" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AppDataInsights() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            trackAppDataInsightsViewed();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef}>
      {/* ── Section header ─────────────────────────────────────────── */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 tabular-nums mb-3">
        {"// Live data · APP-01"}
      </p>
      <h2
        className="brand-h2 text-white mb-3 max-w-[20ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        What our data reveals.
      </h2>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 tabular-nums">
        638 entries · 65 users · 6 months
      </p>

      {/* ── Stat cards grid ────────────────────────────────────────── */}
      <div className="mt-10 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.counter}
            className="border border-white/15 bg-white/[0.07] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-mono text-[11px] font-bold tabular-nums text-white/40">
                {stat.counter}
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                {stat.topic}
              </span>
            </div>
            <div className="flex flex-col flex-1 p-4 lg:p-5">
              <p className="font-mono text-3xl lg:text-4xl font-bold tabular-nums text-white leading-none">
                {stat.value}
              </p>
              <p className="text-sm text-white/75 leading-snug mt-3">
                {stat.context}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] tabular-nums text-white/35 mt-auto pt-4">
                {stat.caveat}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Hangover fingerprint header ───────────────────────────── */}
      <div className="mt-16 lg:mt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 tabular-nums mb-3">
          {"// Hangover fingerprint · APP-01"}
        </p>
        <h3
          className="brand-h3 text-white mb-3 max-w-[24ch]"
          style={{ letterSpacing: "-0.02em" }}
        >
          The shape of a hangover.
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 tabular-nums">
          Self-reported wellness · Per-user delta · Sober baseline
        </p>
      </div>

      {/* ── Wellness factor grid ──────────────────────────────────── */}
      <div className="mt-6 lg:mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
        {FACTORS.map((factor) => (
          <div
            key={factor.code}
            className="border border-white/15 bg-white/[0.07] p-4 lg:p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 tabular-nums">
                {factor.code}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45 tabular-nums">
                {factor.direction}
              </span>
            </div>
            <p className="font-mono text-2xl lg:text-3xl font-bold tabular-nums text-white leading-none">
              {factor.delta}
            </p>
            <p className="text-sm text-white/75 leading-snug">
              {factor.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Methodology ───────────────────────────────────────────── */}
      <div className="mt-12 lg:mt-16 border-t border-white/10 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 tabular-nums mb-3">
          {"// Methodology · APP-01"}
        </p>
        <p className="text-sm text-white/60 leading-relaxed max-w-[68ch]">
          Per-user delta method. Each user is compared against their own sober
          baseline, not group averages. 638 log entries from 65 users between
          December 2025 and May 2026. Observational data, not a clinical trial.
          Patterns are associations, not cause and effect.
        </p>
      </div>
    </div>
  );
}
