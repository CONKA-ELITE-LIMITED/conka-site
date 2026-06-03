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
import BottleVideo from "./BottleVideo";

/* ============================================================================
 * LandingDailyBenefits
 *
 * Quick-to-consume benefit pillars next to the rotating Flow render.
 * Collapsed cards carry an outcome-led title + one line; the [+] Learn more
 * expander reveals 3D ingredient renders, real app data, and the study
 * citation for people who want the depth.
 * ========================================================================== */

interface Ingredient {
  name: string;
  // 3D renders live in /public/ingredients/renders/ as PascalCase JPGs.
  imageSrc: string;
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
  description: string;
  ingredients: Ingredient[];
  appInsight: AppInsight;
  // Prose that weaves the bolded ingredient names into the claim, so the
  // stat, the story, and the renders below read as one narrative. Same
  // pattern as the PDP FormulaBenefitsPillars story field.
  story: React.ReactNode;
  pmid: string;
}

const PILLARS: Pillar[] = [
  {
    id: "mental",
    icon: <BenefitIconFocus />,
    heading: "Improves Focus & Memory",
    description:
      "Stay locked in past 2pm instead of reaching for another coffee.",
    ingredients: [
      { name: "Lemon Balm", imageSrc: "/ingredients/renders/LemonBalm.jpg" },
      { name: "Alpha GPC", imageSrc: "/ingredients/renders/AlphaGPC.jpg" },
      { name: "Rhodiola", imageSrc: "/ingredients/renders/RhodiolaRosea.jpg" },
    ],
    appInsight: {
      stat: "−1.8 pts",
      label: "lost on fatigued days, vs each person's own fresh-day score",
      caveat: "n=260 users · 1,248 fatigued tests ^^",
      anchor: "/app-insights#mental-fatigue",
    },
    story: (
      <>
        In one study, participants taking{" "}
        <strong className="font-semibold text-black">Lemon Balm</strong>{" "}
        showed improvements in calmness and alertness (Kennedy et al. 2003)¶.{" "}
        <strong className="font-semibold text-black">Alpha GPC</strong> raises
        acetylcholine, the brain&apos;s memory messenger, and{" "}
        <strong className="font-semibold text-black">Rhodiola</strong> keeps
        stress from stealing your focus.
      </>
    ),
    pmid: "PMID: 12888775",
  },
  {
    id: "energy",
    icon: <BenefitIconSleep />,
    heading: "Reduces Fatigue & Crashes",
    description:
      "All-day mental energy without caffeine, jitters, or the 3pm slump.",
    ingredients: [
      {
        name: "Ashwagandha",
        imageSrc: "/ingredients/renders/Ashwagandha.jpg",
      },
      { name: "Turmeric", imageSrc: "/ingredients/renders/Turmeric.jpg" },
      {
        name: "Vitamin B12",
        imageSrc: "/ingredients/renders/VitaminB12.jpg",
      },
    ],
    appInsight: {
      stat: "+1.09 pts",
      label: "above daily average after 6pm on Conka days, when most users' scores naturally fall",
      caveat: "n=74 Conka tests · 18–21 window ^^",
      anchor: "/app-insights#time-of-day",
    },
    story: (
      <>
        In one study, participants taking{" "}
        <strong className="font-semibold text-black">Ashwagandha</strong>{" "}
        showed a significant reduction in perceived stress (Chandrasekhar et
        al. 2012)¶.{" "}
        <strong className="font-semibold text-black">Turmeric</strong> keeps
        inflammation in check while{" "}
        <strong className="font-semibold text-black">Vitamin B12</strong>{" "}
        supports your body&apos;s own energy release.
      </>
    ),
    pmid: "PMID: 23439798",
  },
  {
    id: "brain",
    icon: <BenefitIconStress />,
    heading: "Protects Long-Term Brain Health",
    description:
      "A daily routine that invests in your brain for the years ahead.",
    ingredients: [
      { name: "Glutathione", imageSrc: "/ingredients/renders/11.jpg" },
      { name: "NAC", imageSrc: "/ingredients/renders/NAcetylCysteine.jpg" },
      { name: "Vitamin C", imageSrc: "/ingredients/renders/VitaminC.jpg" },
    ],
    appInsight: {
      stat: "−5.4 pts",
      label: "lost under moderate stress, the largest single-cause drop in the dataset",
      caveat: "n=18 users · 58 tests ^^",
      anchor: "/app-insights#stress",
    },
    story: (
      <>
        <strong className="font-semibold text-black">Vitamin C</strong>{" "}
        contributes to the protection of cells from oxidative stress
        <sup className="text-[0.5em] text-black/40 align-super">††</sup>.{" "}
        <strong className="font-semibold text-black">Glutathione</strong> is
        the body&apos;s master antioxidant, and{" "}
        <strong className="font-semibold text-black">NAC</strong> is what
        your body uses to rebuild it. In one study, participants showed
        improvements in antioxidant capacity (Sinha et al. 2018)¶.
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
        {/* Rotating Flow render — replaces the static lifestyle photo.
            4:5 portrait, full-bleed on mobile, sticky on desktop so it
            tracks the cards. Fig. chip keeps the clinical texture. */}
        <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[4/5] mb-8 md:mx-0 md:w-full lg:mb-0 lg:flex-[2] lg:sticky lg:top-24 lg:self-start bg-black/[0.04] border-y md:border border-black/12">
          <BottleVideo formula="flow" />
          <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 02 · CONKA Flow · 3D Render
          </span>
        </div>

        <div className="lg:flex-[3]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            {"// Daily benefits · SCI-01"}
          </p>
          <h2
            className="brand-h1 mb-6"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            Daily habit. Lifelong benefits.
          </h2>

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
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl lg:text-3xl font-semibold text-black">
                      {pillar.heading}
                    </h3>
                    <div className="w-10 h-10 flex items-center justify-center bg-black/5 text-black flex-shrink-0 ml-3">
                      {pillar.icon}
                    </div>
                  </div>

                  <p className="text-sm text-black/60 leading-snug mb-4">
                    {pillar.description}
                  </p>

                  {/* Footer row — ingredient render thumbnails (collapsed only)
                      on the left, compact mono expander on the right. One row
                      keeps the card short while still showing what's inside
                      without a tap. */}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      {!isOpen &&
                        pillar.ingredients.map((ingredient) => (
                          <div
                            key={ingredient.name}
                            className="relative w-11 h-11 border border-black/8 overflow-hidden bg-white"
                          >
                            <Image
                              src={ingredient.imageSrc}
                              alt={ingredient.name}
                              fill
                              loading="lazy"
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : pillar.id)}
                      aria-expanded={isOpen}
                      aria-controls={`pillar-evidence-${pillar.id}`}
                      className="inline-flex items-center gap-1.5 min-h-[44px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50 hover:text-black text-left cursor-pointer transition-colors shrink-0"
                    >
                      <span className="tabular-nums">
                        {isOpen ? "[−]" : "[+]"}
                      </span>
                      <span>{isOpen ? "Show less" : "Learn more"}</span>
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      id={`pillar-evidence-${pillar.id}`}
                      className="mt-2 pt-4 border-t border-black/8"
                    >
                      {/* App data — the headline stat from real users */}
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

                      {/* Story — prose weaving the ingredient names into the claim */}
                      <p className="text-sm leading-relaxed text-black/75 mb-4">
                        {pillar.story}
                      </p>

                      {/* Ingredient tiles — the renders the story just referenced */}
                      <div className="grid grid-cols-3 gap-2 mb-4 lg:justify-items-center">
                        {pillar.ingredients.map((ingredient) => (
                          <div
                            key={ingredient.name}
                            className="w-full lg:w-[70%] bg-white border border-black/8 overflow-hidden"
                          >
                            <div className="relative w-full aspect-square bg-white">
                              <Image
                                src={ingredient.imageSrc}
                                alt={ingredient.name}
                                fill
                                loading="lazy"
                                sizes="(max-width: 1024px) 30vw, 90px"
                                className="object-cover"
                              />
                            </div>
                            <div className="px-2 py-2 flex items-center justify-center">
                              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-black/80 text-center leading-tight">
                                {ingredient.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Source — small print at the very bottom */}
                      <p className="text-xs brand-data-label text-black/40">
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

      <div className="mt-8 flex justify-center lg:justify-start">
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
