"use client";

import { useState } from "react";
import { AthleteData, SportCategory, SPORT_INFO, getAllSports, getCaseStudyPhotoPath } from "@/app/lib/caseStudiesData";
import SportIcon from "./SportIcon";

interface AthleteSidebarProps {
  athletes: AthleteData[];
  activeAthleteId: string;
  onSelectAthlete: (id: string) => void;
  selectedSport: SportCategory | "all";
  onSelectSport: (sport: SportCategory | "all") => void;
}

export default function AthleteSidebar({
  athletes,
  activeAthleteId,
  onSelectAthlete,
  selectedSport,
  onSelectSport,
}: AthleteSidebarProps) {
  const [photoErrorIds, setPhotoErrorIds] = useState<Set<string>>(new Set());
  const addPhotoError = (id: string) => setPhotoErrorIds((prev) => new Set(prev).add(id));
  const availableSports = getAllSports();

  const filteredAthletes = selectedSport === "all"
    ? athletes
    : athletes.filter(a => a.sport === selectedSport);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 mb-3">
          Filter by Sport
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectSport("all")}
            className={`px-3 py-1.5 rounded-full border transition-colors text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums ${
              selectedSport === "all"
                ? "bg-[#1B2757] text-white border-[#1B2757]"
                : "bg-white text-black/70 border-black/12 hover:border-black/40"
            }`}
          >
            All · {String(athletes.length).padStart(2, "0")}
          </button>
          {availableSports.map((sport) => {
            const count = athletes.filter(a => a.sport === sport).length;
            const info = SPORT_INFO[sport];
            return (
              <button
                key={sport}
                onClick={() => onSelectSport(sport)}
                className={`px-3 py-1.5 rounded-full border transition-colors text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums flex items-center gap-1.5 ${
                  selectedSport === sport
                    ? "bg-[#1B2757] text-white border-[#1B2757]"
                    : "bg-white text-black/70 border-black/12 hover:border-black/40"
                }`}
              >
                <SportIcon sport={sport} size={12} />
                <span>{info.name}</span>
                <span className="opacity-60">· {String(count).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 mb-3 tabular-nums">
          Athletes · {String(filteredAthletes.length).padStart(2, "0")}
        </p>
        <div className="space-y-1.5 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
          {filteredAthletes.map((athlete, idx) => {
            const isActive = athlete.id === activeAthleteId;
            const topImprovement = athlete.improvements[0];
            const photoSrc = getCaseStudyPhotoPath(athlete.id) || athlete.photo;
            const showPhotoPlaceholder = !photoSrc || photoErrorIds.has(athlete.id);
            return (
              <button
                key={athlete.id}
                onClick={() => onSelectAthlete(athlete.id)}
                className={`w-full text-left p-3 rounded-md border transition-colors ${
                  isActive
                    ? "border-[#1B2757] border-2 bg-white"
                    : "border-black/12 hover:border-black/40 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-md border border-black/8 bg-black/[0.03]">
                    {showPhotoPlaceholder ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <SportIcon sport={athlete.sport} size={20} className="opacity-40" />
                      </div>
                    ) : (
                      <img
                        src={photoSrc}
                        alt={athlete.name}
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition: athlete.focalPoint
                            ? `${athlete.focalPoint.x}% ${athlete.focalPoint.y}%`
                            : "center",
                        }}
                        onError={() => addPhotoError(athlete.id)}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[9px] font-bold tabular-nums text-black/35">
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      {athlete.featured && (
                        <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#1B2757] tabular-nums">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] font-semibold truncate leading-tight ${isActive ? "text-[#1B2757]" : "text-black"}`}>
                      {athlete.name}
                    </p>
                    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-black/50 truncate mt-0.5 tabular-nums">
                      {athlete.profession}
                    </p>
                    {topImprovement && (
                      <div className="mt-1.5 flex items-baseline gap-1.5">
                        <span className="text-sm font-bold tabular-nums text-[#1B2757]">
                          {topImprovement.value}
                        </span>
                        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-black/45 tabular-nums truncate">
                          {topImprovement.metric}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
