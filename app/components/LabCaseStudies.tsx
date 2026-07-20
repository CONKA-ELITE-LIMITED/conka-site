"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AthleteData,
  SportCategory,
  getAthleteById,
} from "@/app/lib/caseStudiesData";
import ConkaCTAButton from "./landing/ConkaCTAButton";
import GuaranteeRow from "./landing/GuaranteeRow";

/* ============================================================================
 * LabCaseStudies
 *
 * Clinical reskin of CaseStudiesDataDriven. Surfaces more of the dataset than
 * the original teaser: each tile becomes a specimen card with photo + dense
 * mono spec block (3-metric grid + product + testing period).
 *
 * Visual grammar:
 *   - Stats strip: lab-asset-frame (double-border, data surface)
 *   - Tiles: zero-radius, thin black border, photo + spec band
 *   - Mono labels (tabular-nums) for all numerics
 *   - CTA: ConkaCTAButton, trust: GuaranteeRow
 * ========================================================================== */

const SPORT_LABELS: Record<SportCategory, string> = {
  rugby: "RUGBY UNION",
  rugby7s: "RUGBY 7s",
  football: "FOOTBALL",
  motorsport: "MOTORSPORT",
  business: "BUSINESS",
  other: "OTHER",
};

const ATHLETE_IDS = [
  "jack-willis",
  "nimisha-kurup",
  "max-lahiff",
  "josh-stanton",
  "ben-cox",
  "aaron-hope",
  "shane-corstorphine",
  "liz-glover",
];

const PHOTO_PATHS: Record<string, string> = {
  "jack-willis": "/caseStudies/JackWillis.jpg",
  "nimisha-kurup": "/caseStudies/NimishaKurup.jpg",
  "max-lahiff": "/caseStudies/MaxLahiff.jpg",
  "josh-stanton": "/caseStudies/JoshStanton.jpg",
  "aaron-hope": "/caseStudies/AaronHope.jpg",
  "shane-corstorphine": "/caseStudies/ShaneCorstorphine.jpg",
  "liz-glover": "/caseStudies/LizGlover.jpg",
  "ben-cox": "/caseStudies/BenCox.jpg",
};

const STAT_KEYS = ["Total Score", "Accuracy", "Speed"] as const;
const STAT_ABBR: Record<(typeof STAT_KEYS)[number], string> = {
  "Total Score": "TOT",
  Accuracy: "ACC",
  Speed: "SPD",
};

function productLabel(v?: AthleteData["productVersion"]): string {
  if (v === "01") return "FLOW";
  if (v === "02") return "CLEAR";
  if (v === "both") return "FLOW · CLEAR";
  return "—";
}

function getStat(athlete: AthleteData, key: (typeof STAT_KEYS)[number]) {
  return athlete.improvements.find((i) => i.metric === key);
}

function getTeaserAthletes(): AthleteData[] {
  return ATHLETE_IDS.map((id) => getAthleteById(id)).filter(
    (a): a is AthleteData => a !== undefined,
  );
}

/* ------------------------------ Tile ------------------------------------ */

function AthleteSpecCard({ athlete }: { athlete: AthleteData }) {
  const photo = PHOTO_PATHS[athlete.id] || "/placeholder.jpg";
  const focal = athlete.focalPoint || { x: 50, y: 50 };

  return (
    <div className="flex flex-col bg-white border border-black/12 overflow-hidden h-full">
      {/* Photo */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image
          src={photo}
          alt={athlete.name}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 70vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
        />
      </div>

      {/* Spec band */}
      <div className="flex flex-col flex-1 p-4 lg:p-5">
        {/* Identity */}
        <div className="mb-3">
          <p className="text-base lg:text-lg font-semibold text-black leading-tight">
            {athlete.name}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-black/50 mt-1 leading-tight">
            {SPORT_LABELS[athlete.sport]}
            {athlete.position ? ` · ${athlete.position.toUpperCase()}` : ""}
          </p>
        </div>

        {/* 3-metric grid */}
        <div className="grid grid-cols-3 gap-1 py-3 border-y border-black/8">
          {STAT_KEYS.map((key) => {
            const stat = getStat(athlete, key);
            return (
              <div key={key} className="flex flex-col items-start gap-1">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 leading-none">
                  {STAT_ABBR[key]}
                </span>
                <span className="font-mono text-sm lg:text-base font-bold tabular-nums text-black leading-none">
                  {stat?.value ?? "—"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer: product + tests + period */}
        <div className="mt-auto flex items-start justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Product
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black mt-1 leading-none truncate">
              {productLabel(athlete.productVersion)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 leading-none">
              Tests
            </p>
            <p className="font-mono text-[10px] font-bold tabular-nums text-black mt-1 leading-none">
              N={athlete.testsCompleted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Section --------------------------------- */

export default function LabCaseStudies({
  hideCTA = false,
  ctaLabel,
  ctaHref,
}: {
  hideCTA?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
} = {}) {
  const teaserAthletes = getTeaserAthletes();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotUpdate = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const tileWidth = 280 + 16;
    const index = Math.round(scrollLeft / tileWidth);
    setCurrentIndex(Math.min(teaserAthletes.length - 1, Math.max(0, index)));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="brand-h1 text-[#0e1f3f]">
          Athletes, Founders, Execs.
          <br />
          They all take CONKA.
        </h2>
      </div>

      {/* Dataset summary strip — value on top, label below, centered */}
      <div className="border border-black/12 bg-white grid grid-cols-3 mb-10">
        <div className="flex flex-col items-center justify-center text-center gap-2 px-4 py-4 lg:px-6 lg:py-5 border-r border-black/8">
          <p className="font-mono text-xl lg:text-3xl font-bold tabular-nums text-black leading-none">
            5,000+
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 leading-none">
            Total Tests
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2 px-4 py-4 lg:px-6 lg:py-5 border-r border-black/8">
          <p className="font-mono text-xl lg:text-3xl font-bold tabular-nums text-black leading-none">
            150+
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 leading-none">
            Participants
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-2 px-4 py-4 lg:px-6 lg:py-5">
          <p className="font-mono text-xl lg:text-3xl font-bold tabular-nums text-black leading-none">
            +28.96%
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 leading-none">
            Avg Improvement
          </p>
        </div>
      </div>

      {/* Desktop: 4-col spec-card grid */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {teaserAthletes.map((athlete) => (
          <AthleteSpecCard key={athlete.id} athlete={athlete} />
        ))}
      </div>

      {/* Mobile: horizontal snap-scroll */}
      <div className="md:hidden mb-8">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-5 px-5 scrollbar-hide"
          onScroll={handleDotUpdate}
        >
          {teaserAthletes.map((athlete) => (
            <div
              key={athlete.id}
              className="flex-shrink-0 w-[75vw] max-w-[280px] snap-center"
            >
              <AthleteSpecCard athlete={athlete} />
            </div>
          ))}
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {teaserAthletes.map((_, idx) => {
            const isActive = currentIndex === idx;
            return (
              <div
                key={idx}
                className={`h-1.5 w-6 transition-colors duration-300 ${
                  isActive ? "bg-black" : "bg-black/25"
                }`}
                style={{
                  transform: isActive ? "scaleX(1)" : "scaleX(0.25)",
                  transformOrigin: "left",
                  transition: "transform 300ms ease, background-color 300ms ease",
                }}
                aria-hidden
              />
            );
          })}
        </div>
      </div>

      {/* CTA + guarantee as one block so the row tucks under the button.
          Centred on mobile, left-aligned on desktop. */}
      {!hideCTA && (
        <div className="mt-8 flex flex-col items-center lg:items-start">
          <ConkaCTAButton href={ctaHref ?? "/case-studies"} meta={null}>
            {ctaLabel ?? "View All Case Studies"}
          </ConkaCTAButton>
          <GuaranteeRow />
        </div>
      )}
    </div>
  );
}
