"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BenefitIconFocus,
  BenefitIconSleep,
  BenefitIconStress,
} from "./icons";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";
import ConkaCTAButton from "./ConkaCTAButton";
import LabTrustBadges from "./LabTrustBadges";

interface Ingredient {
  name: string;
  imageSrc: string;
  efsaAnchor?: boolean;
}

interface AppInsight {
  stat: string;
  label: string;
  caveat: string;
  anchor: string;
}

interface Pillar {
  id: string;
  icon: React.ReactNode;
  heading: string;
  description: React.ReactNode;
  ingredients: Ingredient[];
  appInsight: AppInsight;
  studyObservation: React.ReactNode;
  pmid: string;
}

const PILLARS: Pillar[] = [
  {
    id: "mental",
    icon: <BenefitIconFocus />,
    heading: "Mental Performance",
    description:
      "Clinically-studied ingredients for your daily focus and clarity routine. Stay locked in past 2pm instead of reaching for another coffee.",
    ingredients: [
      { name: "Lemon Balm", imageSrc: "/ingredients/flow/lemon-balm.webp" },
      { name: "Alpha GPC", imageSrc: "/ingredients/clear/alpha-gpc.webp" },
      { name: "Rhodiola", imageSrc: "/ingredients/flow/rhodiola.webp" },
    ],
    appInsight: {
      stat: "−1.8 pts",
      label: "lost on fatigued days, vs each person's own fresh-day score",
      caveat: "n=260 users · 1,248 fatigued tests ^^",
      anchor: "/app-insights#mental-fatigue",
    },
    studyObservation:
      "In one study, participants taking Lemon Balm showed improvements in calmness and alertness (Kennedy et al. 2003)¶",
    pmid: "PMID: 12888775",
  },
  {
    id: "energy",
    icon: <BenefitIconSleep />,
    heading: "Sustained Energy",
    description:
      "All-day mental energy without caffeine, jitters, or crashes. Adaptogens help your body manage the demands of a full day, not just the first few hours.",
    ingredients: [
      { name: "Ashwagandha", imageSrc: "/ingredients/flow/ashwagandha.webp" },
      { name: "Turmeric", imageSrc: "/ingredients/flow/turmeric.jpg" },
      { name: "Vitamin B12", imageSrc: "/ingredients/clear/vitamin-b12.webp", efsaAnchor: true },
    ],
    appInsight: {
      stat: "+1.09 pts",
      label: "above daily average after 6pm on Conka days, when most users' scores naturally fall",
      caveat: "n=74 Conka tests · 18–21 window ^^",
      anchor: "/app-insights#time-of-day",
    },
    studyObservation:
      "In one study, participants taking Ashwagandha showed a significant reduction in perceived stress (Chandrasekhar et al. 2012)¶",
    pmid: "PMID: 23439798",
  },
  {
    id: "brain",
    icon: <BenefitIconStress />,
    heading: "Brain Health",
    description: (
      <>
        Long-term investment in your brain, not just a quick fix. Vitamin C
        contributes to the protection of cells from oxidative stress.
        <sup className="text-[0.5em] text-black/40 align-super">††</sup> A
        daily routine built for the years ahead.
      </>
    ),
    ingredients: [
      { name: "Glutathione", imageSrc: "/ingredients/clear/glutathione.webp" },
      { name: "NAC", imageSrc: "/ingredients/clear/nac.webp" },
      { name: "Vitamin C", imageSrc: "/ingredients/clear/vitamin-c.webp", efsaAnchor: true },
    ],
    appInsight: {
      stat: "−5.4 pts",
      label: "lost under moderate stress, the largest single-cause drop in the dataset",
      caveat: "n=18 users · 58 tests ^^",
      anchor: "/app-insights#stress",
    },
    studyObservation: (
      <>
        Vitamin C contributes to the protection of cells from oxidative stress
        <sup className="text-[0.5em] text-black/40 align-super">††</sup>. In
        one study, participants showed improvements in antioxidant capacity
        (Sinha et al. 2018)¶
      </>
    ),
    pmid: "PMID: 29559699",
  },
];

export default function LandingDailyBenefits() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:gap-10">
        <div className="relative overflow-hidden -mt-20 lg:mt-0 -mx-5 w-[calc(100%+2.5rem)] lg:mx-0 lg:w-auto aspect-[5/3] lg:aspect-auto mb-8 lg:mb-0 lg:flex-[2] lg:min-h-[500px] lg:sticky lg:top-24 lg:self-start">
          <Image
            src="/lifestyle/clear/ClearCloseTwoHands.jpg"
            alt="Two hands passing a CONKA bottle"
            fill
            sizes="(max-width: 1024px) 95vw, 500px"
            className="object-cover scale-[1.35]"
            style={{ objectPosition: "center 38%" }}
          />
          <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 02 · Daily Ritual
          </span>
          <span className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Hand-Off · Flow + Clear
          </span>
        </div>

        <div className="lg:flex-[3]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// Daily benefits · SCI-01"}
          </p>
          <h2
            className="brand-h1 mb-2"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            Daily habit. Lifelong benefits.
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
            Mental performance · Sustained energy · Brain health
          </p>

          <div className="grid grid-cols-1 gap-4">
            {PILLARS.map((pillar) => {
              const isOpen = openId === pillar.id;

              return (
                <div
                  key={pillar.id}
                  className={`lab-clip-tr bg-white p-5 lg:p-6 flex flex-col shadow-sm ${
                    isOpen
                      ? "border-l-4 border-l-black border border-black/8"
                      : "border border-black/8"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl lg:text-3xl font-semibold text-black">
                      {pillar.heading}
                    </h3>
                    <div className="w-10 h-10 flex items-center justify-center bg-black/5 text-black flex-shrink-0 ml-3">
                      {pillar.icon}
                    </div>
                  </div>

                  <p className="text-sm text-black/60 leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : pillar.id)}
                    aria-expanded={isOpen}
                    aria-controls={`pillar-evidence-${pillar.id}`}
                    className="mt-auto inline-flex items-center justify-between gap-2 min-h-[44px] text-sm font-mono font-semibold text-black text-left cursor-pointer uppercase tracking-[0.08em]"
                  >
                    <span>{isOpen ? "Hide details" : "See ingredients & research"}</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      id={`pillar-evidence-${pillar.id}`}
                      className="mt-4 pt-4 border-t border-black/8"
                    >
                      <div className="grid grid-cols-3 gap-2 mb-4 lg:justify-items-center">
                        {pillar.ingredients.map((ingredient) => (
                          <div
                            key={ingredient.name}
                            className="w-full lg:w-[70%] bg-[var(--brand-tint)] border border-black/6 overflow-hidden"
                          >
                            <div className="relative w-full aspect-square bg-white">
                              <Image
                                src={ingredient.imageSrc}
                                alt={ingredient.name}
                                fill
                                sizes="(max-width: 1024px) 30vw, 90px"
                                className="object-cover"
                              />
                            </div>
                            <div className="px-2 py-2 flex items-center justify-center gap-1">
                              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-black/80 text-center leading-tight">
                                {ingredient.name}
                              </p>
                              {ingredient.efsaAnchor && (
                                <span className="text-black/30 text-[9px]">††</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4 p-3 bg-black/[0.03] border border-black/8 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/35 mb-1.5">
                            App data · real users
                          </p>
                          <p className="text-2xl font-semibold tabular-nums leading-none mb-1">
                            {pillar.appInsight.stat}
                          </p>
                          <p className="text-xs text-black/60 leading-snug mb-1">
                            {pillar.appInsight.label}
                          </p>
                          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/35">
                            {pillar.appInsight.caveat}
                          </p>
                        </div>
                        <Link
                          href={pillar.appInsight.anchor}
                          className="shrink-0 font-mono text-[9px] uppercase tracking-[0.15em] text-black/50 hover:text-black underline underline-offset-2 whitespace-nowrap"
                        >
                          See data →
                        </Link>
                      </div>

                      <p className="text-xs leading-relaxed text-black/60">
                        {pillar.studyObservation}
                      </p>
                      <p className="text-xs brand-data-label mt-2 text-black/40">
                        {pillar.pmid}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-start">
        <ConkaCTAButton href="/conka-both" meta={null}>
          Get Both from &pound;{PRICE_PER_SHOT_BOTH}/shot
        </ConkaCTAButton>
      </div>
      <div className="mt-6">
        <LabTrustBadges />
      </div>
    </div>
  );
}
