"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";
import CredentialsBadgeBlock from "./CredentialsBadgeBlock";

/**
 * Sits between the hero and the report sections on /app-insights. Answers
 * the question a cold visitor lands with: how does a supplement brand
 * have cognitive performance data on its own users? Three-step flow,
 * the validated test credentials grid, and a verbatim credential note
 * (cited study references kept exact).
 *
 * Client component because it fires a Vercel Analytics event when the
 * module enters the viewport. Page wraps it in brand-section + brand-track.
 * Component is content-only.
 */

const STEPS = [
  {
    counter: "01.",
    title: "Take CONKA.",
    body: "Flow in the morning, Clear in the afternoon, or both. Whatever your day asks for.",
  },
  {
    counter: "02.",
    title: "Test yourself, in the app.",
    body: "A five-minute cognitive test built into the CONKA app. FDA-cleared, derived from Cambridge research, the same assessment used in NHS Memory Clinics.",
  },
  {
    counter: "03.",
    title: "See your data.",
    body: "Every test plots against your own personal baseline. CONKA days, non-CONKA days, sober mornings, hangovers, peak hours, and dips. Your curve, against itself.",
  },
] as const;

export default function HowThisIsPossibleModule() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (firedRef.current) return;

    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            try {
              track("insights_credibility_view", {
                location: "app-insights-credibility",
                module: "how-this-is-possible",
              });
            } catch {
              // analytics fail silently
            }
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sentinelRef}>
      {/* Header */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-4">
        {"// How this is possible · APP-01"}
      </p>
      <h2
        className="brand-h2 text-white mb-4 max-w-[26ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        CONKA isn&apos;t just a supplement. It&apos;s a measurement loop.
      </h2>
      <p className="text-base lg:text-lg text-white/85 leading-relaxed max-w-[68ch] mb-10">
        Most supplement brands point to studies on individual ingredients in
        other people. We do that too, where it matters. But everything below
        also comes from inside our own product, on our own users.
      </p>

      {/* Three-step flow */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-10"
        role="list"
        aria-label="How CONKA captures cognitive data"
      >
        {STEPS.map((step) => (
          <div
            key={step.counter}
            role="listitem"
            className="border border-white/15 bg-white/[0.06] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <span className="font-mono text-[11px] font-bold tabular-nums text-white/70">
                {step.counter}
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Step
              </span>
            </div>
            <div className="flex flex-col flex-1 p-5 lg:p-6">
              <h3
                className="brand-h3 text-white mb-3 max-w-[20ch]"
                style={{ letterSpacing: "-0.01em" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-white/85 leading-relaxed">
                {step.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Validated-test credentials grid */}
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 tabular-nums mb-3">
        Cambridge-derived · FDA cleared · NHS validated
      </p>
      <CredentialsBadgeBlock />

      {/* Verbatim credential note — cited study references kept exact. */}
      <p className="font-mono text-[11px] leading-relaxed text-white/65 tabular-nums mt-6 max-w-[78ch]">
        The CONKA app uses a clinically validated cognitive assessment developed
        by Cognetivity Neurosciences from Cambridge University research. The
        test is FDA cleared as a medical device with 93% sensitivity for
        detecting cognitive change and 87.5% test-retest reliability, validated
        across NHS Memory Clinics (ADePT Study, PMC10533908; HRA
        ISRCTN95636074). Test scores reflect individual cognitive test
        performance and do not constitute health claims about CONKA products.
        Many factors, including lifestyle changes, practice effects, and
        natural variation, may contribute to changes in test scores.
      </p>
    </div>
  );
}
