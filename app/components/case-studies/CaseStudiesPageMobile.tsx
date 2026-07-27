"use client";

import { useState, useEffect } from "react";
import {
  SportCategory,
  SPORT_INFO,
  athletes,
  getCaseStudyPhotoPath,
  getAllSports,
  getFormulaPresentation,
} from "@/app/lib/caseStudiesData";
import SportIcon from "./SportIcon";
import WhatTheyTook from "./WhatTheyTook";

const STAT_LABELS = ["Total", "Acc.", "Speed"];

function ProductBadge({ version }: { version?: "01" | "02" | "both" }) {
  if (!version) return null;
  const product = getFormulaPresentation(version);
  return (
    <span
      className={`text-[9px] font-semibold uppercase tracking-[0.12em] tabular-nums rounded-full px-2 py-0.5 ${product.badgeClass}`}
    >
      {product.label}
    </span>
  );
}

function shortenMetric(metric: string): string {
  const m = metric.toLowerCase();
  if (m.includes("total")) return "Total";
  if (m.includes("accuracy") || m.includes("acc")) return "Acc.";
  if (m.includes("speed")) return "Speed";
  return metric;
}

function CircleNav({
  direction,
  onClick,
  ariaLabel,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-11 h-11 bg-[#1B2757] text-white hover:opacity-85 active:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757] rounded-full"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {direction === "prev" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </button>
  );
}

export default function CaseStudiesPageMobile() {
  const [selectedSport, setSelectedSport] = useState<SportCategory | "all">(
    "all",
  );
  const [activeAthleteIndex, setActiveAthleteIndex] = useState(0);
  const [photoErrorIds, setPhotoErrorIds] = useState<Set<string>>(new Set());
  const addPhotoError = (id: string) =>
    setPhotoErrorIds((prev) => new Set(prev).add(id));

  const availableSports = getAllSports();
  const filteredAthletes = (
    selectedSport === "all"
      ? athletes
      : athletes.filter((a) => a.sport === selectedSport)
  ).toSorted((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
  const activeAthlete = filteredAthletes[activeAthleteIndex];
  useEffect(() => {
    setActiveAthleteIndex(0);
  }, [selectedSport]);

  const handlePrev = () => {
    setActiveAthleteIndex((prev) =>
      prev === 0 ? filteredAthletes.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveAthleteIndex((prev) =>
      prev === filteredAthletes.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="pb-8 min-h-screen">
      <div className="sticky top-0 z-10 -mx-[var(--brand-gutter-mobile,1.25rem)] px-[var(--brand-gutter-mobile,1.25rem)] py-3 mb-5 bg-white border-y border-black/12 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 pb-0.5">
          <button
            onClick={() => setSelectedSport("all")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full border transition-colors text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums ${
              selectedSport === "all"
                ? "bg-[#1B2757] text-white border-[#1B2757]"
                : "bg-white text-black/70 border-black/12"
            }`}
          >
            All
          </button>
          {availableSports.map((sport) => {
            const info = SPORT_INFO[sport];
            return (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full border transition-colors text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums flex items-center gap-1.5 ${
                  selectedSport === sport
                    ? "bg-[#1B2757] text-white border-[#1B2757]"
                    : "bg-white text-black/70 border-black/12"
                }`}
              >
                <SportIcon sport={sport} size={12} />
                <span>{info.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeAthlete ? (
        <>
          <div className="relative w-full aspect-[3/4] overflow-hidden rounded-md border border-black/12 bg-white">
            {(() => {
              const photoSrc =
                getCaseStudyPhotoPath(activeAthlete.id) || activeAthlete.photo;
              const showPlaceholder =
                !photoSrc || photoErrorIds.has(activeAthlete.id);
              if (showPlaceholder) {
                return (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/[0.03]">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                      {activeAthlete.name || "Photo"}
                    </span>
                  </div>
                );
              }
              return (
                <img
                  src={photoSrc}
                  alt={activeAthlete.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    objectPosition: activeAthlete.focalPoint
                      ? `${activeAthlete.focalPoint.x}% ${activeAthlete.focalPoint.y}%`
                      : "center",
                  }}
                  onError={() => addPhotoError(activeAthlete.id)}
                />
              );
            })()}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
              aria-hidden
            />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] font-bold tabular-nums text-white bg-black/50 rounded-full px-2 py-1 uppercase tracking-[0.12em]">
                {String(activeAthleteIndex + 1).padStart(2, "0")} / {String(filteredAthletes.length).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white bg-black/50 rounded-full px-2 py-1 tabular-nums">
                {SPORT_INFO[activeAthlete.sport].name}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base leading-tight">
                  {activeAthlete.name}
                </span>
                <ProductBadge version={activeAthlete.productVersion} />
              </div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/80 line-clamp-1 tabular-nums mt-1">
                {activeAthlete.achievement ?? activeAthlete.profession}
              </p>
            </div>
          </div>

          {/* Stats pulled off the photo into a clean card so the hero image can breathe. */}
          <div className="mt-4 rounded-md border border-black/12 bg-white p-4 shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => {
                const stat = activeAthlete.improvements[i];
                const label = stat ? shortenMetric(stat.metric) : STAT_LABELS[i];
                const value = stat?.value ?? "—";
                return (
                  <div key={i} className={i < 2 ? "border-r border-black/8 pr-2" : ""}>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/45 leading-none">
                      {label}
                    </p>
                    <p className="text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/45 tabular-nums mt-4 pt-3 border-t border-black/8">
              {activeAthlete.testingPeriod} · {activeAthlete.testsCompleted} Tests
            </p>
          </div>

          <div className="mt-6">
            <WhatTheyTook
              version={activeAthlete.productVersion}
              variant="mobile"
            />
          </div>

          <div className="flex items-center justify-between gap-4 mt-6">
            <CircleNav
              direction="prev"
              onClick={handlePrev}
              ariaLabel="Previous athlete"
            />
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {filteredAthletes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveAthleteIndex(i)}
                  aria-label={`Go to athlete ${i + 1}`}
                  aria-current={i === activeAthleteIndex}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === activeAthleteIndex
                      ? "bg-[#1B2757]"
                      : "bg-black/20 hover:bg-black/35"
                  }`}
                />
              ))}
            </div>
            <CircleNav
              direction="next"
              onClick={handleNext}
              ariaLabel="Next athlete"
            />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-md border border-black/12 p-6 text-center shadow-[0_4px_24px_rgba(20,30,60,0.06)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
            No athletes found for this filter
          </p>
        </div>
      )}

    </div>
  );
}
