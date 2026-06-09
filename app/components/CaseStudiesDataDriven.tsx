"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/app/components/Button";
import {
  AthleteData,
  SportCategory,
  getAthleteById,
} from "@/app/lib/caseStudiesData";
import LandingTrustBadges from "./landing/LandingTrustBadges";

// Helper to get readable sport labels
function getSportLabel(sport: SportCategory): string {
  const labels: Record<SportCategory, string> = {
    rugby: "Rugby Union",
    rugby7s: "Rugby 7s",
    football: "Football",
    motorsport: "Motorsport",
    business: "Business",
    other: "Other",
  };
  return labels[sport] || sport;
}

// Human-readable label for the test metric being rendered.
// Labels describe what the Cognetivity CognICA test measures — the percentage
// shows the change in that measurement, not a product-driven improvement claim.
// CognICA Total Score is peer-reviewed as a proxy for cognitive function
// (Modarres et al., Front Aging Neurosci 2023; FDA 21 CFR 882.1470).
function getMetricLabel(metric: string | undefined): string {
  switch (metric) {
    case "Total Score":
      return "Cognitive function";
    case "Speed":
      return "Cognitive speed";
    case "Accuracy":
      return "Cognitive accuracy";
    default:
      return "Change in test score";
  }
}

// Get the 8 hardcoded athletes for the teaser
function getTeaserAthletes(): AthleteData[] {
  const athleteIds = [
    "jack-willis",
    "nimisha-kurup",
    "max-lahiff",
    "josh-stanton",
    "ben-cox",
    "aaron-hope",
    "shane-corstorphine",
    "liz-glover",
    // "millie-hammond",
  ];

  return athleteIds
    .map((id) => getAthleteById(id))
    .filter((athlete): athlete is AthleteData => athlete !== undefined);
}

// Map athlete ID to new asset path
function getTeaserPhotoPath(athleteId: string): string {
  const pathMap: Record<string, string> = {
    "jack-willis": "/caseStudies/JackWillis.jpg",
    "nimisha-kurup": "/caseStudies/NimishaKurup.jpg",
    "max-lahiff": "/caseStudies/MaxLahiff.jpg",
    "josh-stanton": "/caseStudies/JoshStanton.jpg",
    "aaron-hope": "/caseStudies/AaronHope.jpg",
    "shane-corstorphine": "/caseStudies/ShaneCorstorphine.jpg",
    "liz-glover": "/caseStudies/LizGlover.jpg",
    "millie-hammond": "/caseStudies/MillieHammond.jpg",
    "ben-cox": "/caseStudies/BenCox.jpg",
  };
  return pathMap[athleteId] || "/placeholder.jpg";
}

// Photo tile component (non-interactive)
function AthletePhotoTile({ athlete }: { athlete: AthleteData }) {
  const totalImprovement = athlete.improvements.find(
    (i) => i.metric === "Total Score",
  );
  const photoPath = getTeaserPhotoPath(athlete.id);
  const focalPoint = athlete.focalPoint || { x: 50, y: 50 };

  return (
    <div className="relative aspect-[3/4] rounded-[var(--brand-radius-card)] overflow-hidden group">
      <Image
        src={photoPath}
        alt={athlete.name}
        width={600}
        height={800}
        loading="lazy"
        sizes="(max-width: 768px) 70vw, (max-width: 1024px) 33vw, 25vw"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        style={{
          objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
        }}
      />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-sm font-semibold mb-1">{athlete.name}</p>
        <p className="text-3xl font-bold font-mono mb-0.5">
          {totalImprovement?.value || "+0%"}
        </p>
        <p className="text-[10px] uppercase tracking-wide opacity-80 mb-1">
          {getMetricLabel(totalImprovement?.metric)}
        </p>
        <p className="text-xs opacity-80">{getSportLabel(athlete.sport)}</p>
      </div>
    </div>
  );
}

export default function CaseStudiesDataDriven({
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
    const tileWidth = 280 + 16; // max-w + gap
    const index = Math.round(scrollLeft / tileWidth);
    setCurrentIndex(Math.min(7, Math.max(0, index)));
  };

  return (
    <>
      {/* Section Header */}
      <div className="mb-10">
        <h2 className="brand-h1 mb-0">
          Athletes, Founders, Corporates.
          <br />
          They all take CONKA.
          <sup className="text-[0.5em] text-black/30 align-super">^^</sup>
        </h2>
      </div>

      {/* Hero Stats Block -- desktop/tablet only */}
        <div className="hidden md:grid grid-cols-2 gap-1 sm:gap-2 md:gap-6 mb-6 max-w-2xl">
          <div className="brand-card px-2 py-3 sm:px-3 sm:py-4 md:px-6 md:py-8 text-center min-w-0">
            <p className="text-base sm:text-2xl md:text-5xl lg:text-6xl font-bold font-mono text-black leading-tight">
              5,000+
            </p>
            <p className="text-[10px] sm:text-xs brand-caption text-black/60 uppercase mt-1 sm:mt-2">
              Total Tests
            </p>
          </div>
          <div className="brand-card px-2 py-3 sm:px-3 sm:py-4 md:px-6 md:py-8 text-center min-w-0">
            <p className="text-base sm:text-2xl md:text-5xl lg:text-6xl font-bold font-mono text-black leading-tight">
              150+
            </p>
            <p className="text-[10px] sm:text-xs brand-caption text-black/60 uppercase mt-1 sm:mt-2">
              Participants
            </p>
          </div>
        </div>

        {/* Desktop/Tablet: Photo Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {teaserAthletes.map((athlete) => (
            <AthletePhotoTile key={athlete.id} athlete={athlete} />
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden mb-8">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-2 -mx-4 px-4 scrollbar-hide"
            onScroll={handleDotUpdate}
          >
            {teaserAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex-shrink-0 w-[70vw] max-w-[280px] snap-center"
              >
                <AthletePhotoTile athlete={athlete} />
              </div>
            ))}
          </div>
          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {teaserAthletes.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx
                    ? "bg-black w-6"
                    : "bg-black opacity-30 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footnote -- moved to page-level disclaimer section */}

        {/* CTA Button */}
        {!hideCTA && (
          <div className="flex flex-col items-center">
            <Button href={ctaHref ?? "/case-studies"}>
              {ctaLabel ?? "View All CONKA App Case Studies"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="ml-2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Button>
            <div className="mt-4 w-full">
              <LandingTrustBadges />
            </div>
          </div>
        )}
    </>
  );
}
