"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AthleteData,
  SportCategory,
  getAthleteById,
  CASE_STUDY_PHOTO_PATHS,
} from "@/app/lib/caseStudiesData";
import { gsap, useGSAP } from "./gsapClient";

/**
 * Proof section for /app: research stats with scroll-triggered count-up,
 * an explicit product bridge ("the app measures, CONKA moves the number"),
 * and a compact athlete strip. Content-only; the page owns the section.
 */

// Research figures with numeric parts split out so GSAP can count them up.
const RESEARCH_STATS = [
  {
    target: 93,
    decimals: 0,
    suffix: "%",
    label: "Sensitivity detecting cognitive impairment",
    source: "ADePT Study",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10533908/",
    ref: "PMC10533908",
  },
  {
    target: 87.5,
    decimals: 1,
    suffix: "%",
    label: "Test-retest reliability",
    source: "ADePT Study",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10533908/",
    ref: "PMC10533908",
  },
  {
    target: 14,
    decimals: 0,
    suffix: "",
    label: "NHS Trusts in clinical validation trials",
    source: "HRA Clinical Trial",
    href: "https://www.isrctn.com/ISRCTN95636074",
    ref: "ISRCTN95636074",
  },
  {
    target: 16,
    decimals: 0,
    suffix: "%",
    label: "Cognitive improvement in 30 days",
    source: "Clinical data",
    href: null,
    ref: null,
  },
];

const ATHLETE_IDS = ["jack-willis", "nimisha-kurup", "max-lahiff", "josh-stanton"];

const SPORT_LABELS: Partial<Record<SportCategory, string>> = {
  rugby: "RUGBY UNION",
  rugby7s: "RUGBY 7s",
  football: "FOOTBALL",
  motorsport: "MOTORSPORT",
  business: "BUSINESS",
  other: "OTHER",
};

function formatStat(value: number, decimals: number, suffix: string) {
  return `${value.toFixed(decimals)}${suffix}`;
}

function getTotalScore(athlete: AthleteData) {
  return athlete.improvements.find((i) => i.metric === "Total Score")?.value;
}

export default function AppV2Proof() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Count-up stats when the grid scrolls into view
        gsap.utils
          .toArray<HTMLElement>("[data-proof-value]")
          .forEach((el, i) => {
            const stat = RESEARCH_STATS[i];
            const counter = { value: 0 };
            gsap.to(counter, {
              value: stat.target,
              duration: 1.4,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
              onUpdate: () => {
                el.textContent = formatStat(
                  counter.value,
                  stat.decimals,
                  stat.suffix,
                );
              },
            });
          });

        gsap.from("[data-proof-reveal]", {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        gsap.from("[data-proof-athlete]", {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-proof-athletes]",
            start: "top 80%",
          },
        });
      });
    },
    { scope: root },
  );

  const athletes = ATHLETE_IDS.map((id) => getAthleteById(id)).filter(
    (a): a is AthleteData => a !== undefined,
  );

  return (
    <div ref={root}>
      <p
        data-proof-reveal
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4"
      >
        {"// The proof · APP-04"}
      </p>
      <h2
        data-proof-reveal
        className="brand-h2 text-white mb-10"
        style={{ letterSpacing: "-0.02em" }}
      >
        Validated in the clinic. Proven in the field.
      </h2>

      {/* Research stats — count up on entry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {RESEARCH_STATS.map((stat) => (
          <div
            key={stat.label}
            data-proof-reveal
            className="border border-white/20 bg-white/[0.10] p-5 flex flex-col gap-2"
          >
            <p
              data-proof-value
              className="font-mono text-3xl lg:text-4xl font-bold text-white tabular-nums leading-none"
            >
              {formatStat(stat.target, stat.decimals, stat.suffix)}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 leading-snug">
              {stat.label}
            </p>
            {stat.href ? (
              <a
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] text-white/65 hover:text-white transition-colors tabular-nums mt-auto"
              >
                {stat.source} · {stat.ref} ↗
              </a>
            ) : (
              <p className="font-mono text-[9px] text-white/65 tabular-nums mt-auto">
                {stat.source}
              </p>
            )}
          </div>
        ))}
      </div>
      <p
        data-proof-reveal
        className="font-mono text-[9px] text-white/55 tabular-nums mb-14"
      >
        FDA 510(k) cleared · Cambridge Cognition · ISRCTN95636074
      </p>

      {/* Product bridge — close the loop the science page opens */}
      <div
        data-proof-reveal
        className="border border-white/20 bg-white/[0.10] p-6 lg:p-10 mb-14"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums mb-4">
          {"// Close the loop"}
        </p>
        <h3
          className="text-2xl lg:text-3xl font-medium text-white leading-tight mb-4 max-w-[24ch]"
          style={{ letterSpacing: "-0.02em" }}
        >
          The app shows you the number. CONKA moves it.
        </h3>
        <p className="text-base lg:text-lg text-white/85 leading-relaxed max-w-[58ch] mb-6">
          That 16% is CONKA working, measured on this test. Clinical data
          supports up to 16% improvement in cognitive performance on the
          recommended plan. Take your baseline, start the plan, and watch your
          own trend.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/conka-flow"
            className="inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white border border-white/40 hover:border-white hover:bg-white/5 transition-colors min-h-[44px]"
          >
            CONKA Flow <span aria-hidden className="text-white/50">↗</span>
          </Link>
          <Link
            href="/conka-clarity"
            className="inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white border border-white/40 hover:border-white hover:bg-white/5 transition-colors min-h-[44px]"
          >
            CONKA Clear <span aria-hidden className="text-white/50">↗</span>
          </Link>
        </div>
      </div>

      {/* Athlete strip */}
      <div data-proof-athletes>
        <div data-proof-reveal className="flex items-baseline justify-between gap-4 mb-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums">
            Athlete data · N={athletes.length} · Real results. Live data.
          </p>
          <Link
            href="/case-studies"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 hover:text-white transition-colors tabular-nums whitespace-nowrap"
          >
            View all ↗
          </Link>
        </div>

        <div className="flex lg:grid lg:grid-cols-4 gap-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory -mx-5 px-5 lg:mx-0 lg:px-0 scroll-pl-5 pb-2 lg:pb-0">
          {athletes.map((athlete) => {
            const photo = CASE_STUDY_PHOTO_PATHS[athlete.id] ?? "";
            const focal = athlete.focalPoint ?? { x: 50, y: 50 };
            return (
              <div
                key={athlete.id}
                data-proof-athlete
                className="snap-start flex-shrink-0 w-[220px] lg:w-auto border border-white/20 bg-white/[0.08] flex flex-col"
              >
                {photo && (
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={photo}
                      alt={athlete.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 220px, 300px"
                      className="object-cover brightness-75"
                      style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
                    />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-base font-semibold text-white leading-tight">
                    {athlete.name}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/75 mt-1 mb-3 leading-tight">
                    {SPORT_LABELS[athlete.sport] ?? athlete.sport.toUpperCase()}
                  </p>
                  <div className="flex items-baseline justify-between border-t border-white/10 pt-3">
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/65">
                      Total score
                    </span>
                    <span className="font-mono text-lg font-bold tabular-nums text-white">
                      {getTotalScore(athlete) ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
