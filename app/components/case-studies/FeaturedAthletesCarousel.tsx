"use client";

import type { AthleteData } from "@/app/lib/caseStudiesData";
import {
  getCaseStudyPhotoPath,
  SPORT_INFO,
} from "@/app/lib/caseStudiesData";

interface FeaturedAthletesCarouselProps {
  athletes: AthleteData[];
  activeAthleteId: string;
  onSelectAthlete: (id: string) => void;
}

export default function FeaturedAthletesCarousel({
  athletes,
  activeAthleteId,
  onSelectAthlete,
}: FeaturedAthletesCarouselProps) {
  return (
    <div className="flex gap-2 overflow-x-auto overflow-y-visible pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth">
      {athletes.map((athlete, idx) => {
        const improvement = athlete.improvements.find(
          (i) => i.metric === "Total Score",
        );
        const photoSrc =
          getCaseStudyPhotoPath(athlete.id) || athlete.photo || "";
        const focalPoint = athlete.focalPoint ?? { x: 50, y: 50 };
        const isActive = activeAthleteId === athlete.id;

        return (
          <button
            key={athlete.id}
            type="button"
            onClick={() => onSelectAthlete(athlete.id)}
            className={`relative flex-shrink-0 w-[140px] aspect-[3/4] rounded-md overflow-hidden text-left transition-colors focus:outline-none focus:ring-2 focus:ring-[#1B2757] focus:ring-offset-2 bg-white snap-start ${
              isActive
                ? "border-2 border-[#1B2757]"
                : "border border-black/12 hover:border-black/40"
            }`}
            aria-pressed={isActive}
            aria-label={`View case study: ${athlete.name}, ${improvement?.value ?? "+0%"} improvement`}
          >
            {photoSrc ? (
              <img
                src={photoSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  objectPosition: `${focalPoint.x}% ${focalPoint.y}%`,
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-black/[0.03]" />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
              aria-hidden
            />
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
              <span className="text-[9px] font-bold tabular-nums text-white/85 bg-black/45 rounded-full px-2 py-0.5">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/85 bg-black/45 rounded-full px-2 py-0.5">
                {SPORT_INFO[athlete.sport]?.name ?? athlete.sport}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
              <p className="text-[11px] font-semibold truncate leading-tight mb-1">
                {athlete.name}
              </p>
              <p className="text-lg font-bold tabular-nums leading-none">
                {improvement?.value ?? "+0%"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
