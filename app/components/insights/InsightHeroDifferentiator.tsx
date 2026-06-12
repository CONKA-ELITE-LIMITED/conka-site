"use client";

import { useRef } from "react";
import { gsap, useGSAP, withMotion } from "@/app/lib/motion";
import { HERO_DURATION, HERO_EASE, resolveReading } from "./insightMotion";
import { APP_INSIGHTS_TOTALS } from "@/app/lib/appInsightsData";

/**
 * /app-insights hero. Lands the differentiation: this isn't third-party
 * literature, it's measured cognitive performance from real CONKA app
 * users. Page wraps this in brand-section.brand-hero-first + brand-track.
 * Component is content-only.
 *
 * Load sequence (motion-gated, SSR carries the final state): eyebrow fades,
 * H1 lines rise out of masks, dek fades up, the dataset plate's baseline
 * draws across, then the four readings resolve from zero in sequence.
 */
export default function InsightHeroDifferentiator() {
  const root = useRef<HTMLDivElement>(null);

  const stats = [
    {
      value: APP_INSIGHTS_TOTALS.users.toLocaleString(),
      label: "Users tracked",
    },
    {
      value: APP_INSIGHTS_TOTALS.tests.toLocaleString(),
      label: "Cognitive tests",
    },
    { value: `${APP_INSIGHTS_TOTALS.monthsSpan}`, label: "Months of data" },
    { value: `${APP_INSIGHTS_TOTALS.reportCount}`, label: "Public reports" },
  ];

  useGSAP(
    () => {
      withMotion(() => {
        const tl = gsap.timeline({ defaults: { ease: HERO_EASE } });
        tl.from("[data-hero-eyebrow]", { autoAlpha: 0, duration: 0.6 }, 0)
          .from(
            "[data-hero-line]",
            { yPercent: 110, duration: HERO_DURATION, stagger: 0.14 },
            0.1,
          )
          .from(
            "[data-hero-dek]",
            { autoAlpha: 0, y: 18, duration: 0.9 },
            0.55,
          )
          .from("[data-hero-plate]", { autoAlpha: 0, duration: 0.6 }, 0.85)
          .from(
            "[data-hero-baseline]",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: HERO_DURATION,
              ease: "expo.inOut",
            },
            0.9,
          )
          .from(
            "[data-hero-cell]",
            { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.08 },
            1.05,
          );
        gsap.utils
          .toArray<HTMLElement>("[data-hero-value]")
          .forEach((el, i) => {
            resolveReading(el, {
              immediate: true,
              delay: 1.15 + i * 0.1,
              duration: 1.0,
            });
          });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <p
        data-hero-eyebrow
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-4"
      >
        {"// Real cognitive data · APP-01"}
      </p>

      <h1
        id="app-insights-hero"
        className="brand-h1 text-white mb-6 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        <span className="block overflow-hidden">
          <span data-hero-line className="block">
            We don&apos;t ask if CONKA works.
          </span>
        </span>
        <span className="block overflow-hidden">
          <span data-hero-line className="block">
            We measure it.
          </span>
        </span>
      </h1>

      <p
        data-hero-dek
        className="text-base lg:text-lg text-white/90 leading-relaxed max-w-[64ch] mb-10"
      >
        Every chart below comes from real users running an FDA-cleared
        cognitive test inside the CONKA app, on days they take CONKA and days
        they don&apos;t. Where the signal is strong, we say so. Where it&apos;s
        too thin to call, we say that too.
      </p>

      {/* Dataset plate. Header row, drawn baseline, four readings. */}
      <div
        data-hero-plate
        className="border border-white/15"
        role="list"
        aria-label="Dataset totals"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 tabular-nums">
            {"// Dataset · APP-01"}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/55 tabular-nums">
            Nov 2023 – May 2026
          </span>
        </div>
        <div data-hero-baseline className="h-px bg-white/25" aria-hidden="true" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/15">
          {stats.map((s) => (
            <div
              key={s.label}
              role="listitem"
              data-hero-cell
              className="bg-[#0a0a0a] px-4 py-5 lg:px-5 lg:py-6 flex flex-col gap-2"
            >
              <p
                data-hero-value
                className="font-mono text-2xl lg:text-[2rem] font-bold text-white tabular-nums leading-none"
              >
                {s.value}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/60 tabular-nums leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
