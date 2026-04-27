"use client";

import { useState, useEffect } from "react";
import {
  SportCategory,
  athletes,
  getCaseStudyPhotoPath,
  getFeaturedAthletes,
  getTotalTestsCompleted,
  getAverageImprovementAcrossAll,
} from "@/app/lib/caseStudiesData";
import AthleteSidebar from "./AthleteSidebar";
import { ComparisonChart } from "./AthleteStats";
import FeaturedAthletesCarousel from "./FeaturedAthletesCarousel";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import WhatTheyTook from "./WhatTheyTook";

export default function CaseStudiesPageDesktop() {
  const [activeAthleteId, setActiveAthleteId] = useState(athletes[0]?.id || "");
  const [selectedSport, setSelectedSport] = useState<SportCategory | "all">(
    "all",
  );
  const [photoError, setPhotoError] = useState(false);

  const activeAthlete =
    athletes.find((a) => a.id === activeAthleteId) || athletes[0];
  const featuredAthletes = getFeaturedAthletes();

  useEffect(() => {
    setPhotoError(false);
  }, [activeAthleteId]);

  const handleSelectFeaturedAthlete = (id: string) => {
    const athlete = athletes.find((a) => a.id === id);
    if (athlete && selectedSport !== "all" && athlete.sport !== selectedSport) {
      setSelectedSport("all");
    }
    setActiveAthleteId(id);
  };

  const activeIndex = athletes.findIndex((a) => a.id === activeAthleteId);

  return (
    <div className="pb-8 md:pb-6">
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <header>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
              {"// Research & results · PROOF-01"}
            </p>
            <h1
              className="brand-h1 text-black mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Case studies
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
              {String(athletes.length).padStart(2, "0")} Athletes · {getTotalTestsCompleted().toLocaleString()} Cognitive tests · +{getAverageImprovementAcrossAll().toFixed(1)}% Avg. improvement
            </p>
            <p className="text-sm md:text-base text-black/70 mt-4 max-w-xl leading-relaxed">
              Every case is tracked with the same 5-minute cognitive assessment, compared against baseline, and reported without adjustment.
            </p>
          </header>

          <div className="grid grid-cols-3 gap-0 border border-black/12 bg-white">
            <div className="p-4 border-r border-black/8">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                Athletes
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                {athletes.length}
              </p>
            </div>
            <div className="p-4 border-r border-black/8">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                Tests
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                {getTotalTestsCompleted().toLocaleString()}
              </p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                Avg. lift
              </p>
              <p className="font-mono text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                +{getAverageImprovementAcrossAll().toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
            Featured · {String(featuredAthletes.length).padStart(2, "0")} Studies
          </p>
          <FeaturedAthletesCarousel
            athletes={featuredAthletes}
            activeAthleteId={activeAthleteId}
            onSelectAthlete={handleSelectFeaturedAthlete}
          />
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-80 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white border border-black/12 p-4">
            <AthleteSidebar
              athletes={athletes}
              activeAthleteId={activeAthleteId}
              onSelectAthlete={setActiveAthleteId}
              selectedSport={selectedSport}
              onSelectSport={setSelectedSport}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeAthlete ? (
            <div className="bg-white border border-black/12 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-black/8">
                <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                  {String(activeIndex + 1).padStart(2, "0")}.
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                  Case Study · {activeAthlete.sport}
                </span>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mb-8">
                  <div className="relative aspect-square overflow-hidden border border-black/12 bg-black/[0.03]">
                    {(() => {
                      const photoSrc =
                        getCaseStudyPhotoPath(activeAthlete.id) ||
                        activeAthlete.photo;
                      const showPlaceholder = !photoSrc || photoError;
                      if (showPlaceholder) {
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                              {activeAthlete.name || "No photo available"}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <img
                          src={photoSrc}
                          alt={activeAthlete.name}
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: activeAthlete.focalPoint
                              ? `${activeAthlete.focalPoint.x}% ${activeAthlete.focalPoint.y}%`
                              : "center center",
                          }}
                          onError={() => setPhotoError(true)}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex flex-col">
                    <div className="mb-6">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 mb-2 tabular-nums">
                        {[activeAthlete.position, activeAthlete.organization]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      <h2 className="text-3xl font-semibold leading-tight text-black mb-2">
                        {activeAthlete.name}
                      </h2>
                      {activeAthlete.achievement && (
                        <p className="text-sm text-black/70 leading-relaxed">
                          {activeAthlete.achievement}
                        </p>
                      )}
                    </div>
                    <div className="border-t border-black/8 mb-6" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 mb-3">
                        Baseline vs Results
                      </p>
                      <ComparisonChart athlete={activeAthlete} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-0 border border-black/12 mb-8">
                  {[
                    {
                      label: "Total Improvement",
                      value: activeAthlete.improvements[0]?.value || "+0%",
                    },
                    {
                      label: "Accuracy",
                      value: activeAthlete.improvements[1]?.value || "+0%",
                    },
                    {
                      label: "Speed",
                      value: activeAthlete.improvements[2]?.value || "+0%",
                    },
                  ].map((stat, idx) => (
                    <div
                      key={stat.label}
                      className={`py-6 px-5 ${idx < 2 ? "border-r border-black/8" : ""}`}
                    >
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                        {stat.label}
                      </p>
                      <p className="font-mono text-4xl md:text-5xl font-bold tabular-nums text-[#1B2757] mt-3 leading-none">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-8">
                  <span className="px-3 py-1 border border-black/12 bg-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-black/70">
                    {activeAthlete.testsCompleted} Tests
                  </span>
                  <span className="px-3 py-1 border border-black/12 bg-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-black/70">
                    {activeAthlete.testingPeriod}
                  </span>
                  {activeAthlete.protocolUsed && (
                    <span className="px-3 py-1 bg-[#1B2757] text-white font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums">
                      {activeAthlete.protocolUsed}
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
                    Field notes
                  </p>
                  <p className="text-sm text-black/75 leading-relaxed">
                    {activeAthlete.description}
                  </p>
                </div>

                <WhatTheyTook
                  version={activeAthlete.productVersion}
                  variant="desktop"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-black/12 p-12 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
                Select an athlete to view their case study
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 bg-white border border-black/12 p-6 lg:p-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
            Start your journey · Balance Protocol
          </p>
          <h3
            className="brand-h2 text-black mb-3"
            style={{ letterSpacing: "-0.02em" }}
          >
            Ready to start your own journey?
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
            100-Day money-back guarantee · Free UK shipping · Cancel anytime
          </p>
          <ConkaCTAButton
            href="/protocol/3"
            meta="// balance protocol · 14 shots · 7-day cadence"
          >
            Try CONKA now
          </ConkaCTAButton>
        </div>
      </div>
    </div>
  );
}
