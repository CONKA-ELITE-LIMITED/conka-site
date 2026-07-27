"use client";

import { useState } from "react";
import { ClinicalStudyData } from "@/app/lib/ingredientsData";
import StudyBarChart from "./StudyBarChart";

interface IngredientStudiesProps {
  studies: ClinicalStudyData[];
  /** Retained for API compatibility; clinical styling uses a fixed navy accent. */
  accentColor?: string;
}

export default function IngredientStudies({ studies }: IngredientStudiesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {studies.map((study, idx) => {
        const expanded = expandedIndex === idx;
        return (
          <div
            key={idx}
            className="bg-white rounded-md border border-black/12 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandedIndex(expanded ? null : idx)}
              aria-expanded={expanded}
              className="w-full p-4 text-left hover:bg-[var(--brand-tint)] transition-colors text-black"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/45 tabular-nums leading-none mb-2">
                    Study {String(idx + 1).padStart(2, "0")} · {study.university} · {study.year}
                  </p>
                  <h4 className="font-semibold text-sm text-black leading-snug">
                    {study.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-bold tabular-nums text-[#1B2757] bg-[#eef0f5] rounded-full px-2.5 py-1">
                    {study.pValue}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className={`transition-transform text-black/40 ${expanded ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </button>

            {expanded && (
              <div className="px-4 pb-4 border-t border-black/8">
                <div className="py-3 border-b border-black/8">
                  <p className="text-sm text-black/70 leading-snug">
                    {study.authors}
                  </p>
                  <p className="text-[11px] italic text-black/55 mt-1 tabular-nums">
                    {study.journal} ({study.year})
                  </p>
                </div>

                <div className="grid grid-cols-3 border-b border-black/8">
                  <div className="py-3 pr-3 border-r border-black/8">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40 leading-none">
                      Participants
                    </p>
                    <p className="text-lg font-bold tabular-nums text-black mt-2 leading-none">
                      {study.participants.toLocaleString()}
                    </p>
                  </div>
                  <div className="py-3 px-3 border-r border-black/8">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40 leading-none">
                      Duration
                    </p>
                    <p className="text-lg font-bold tabular-nums text-black mt-2 leading-none">
                      {study.duration}
                    </p>
                  </div>
                  <div className="py-3 pl-3">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40 leading-none">
                      Significance
                    </p>
                    <p className="text-lg font-bold tabular-nums text-[#1B2757] mt-2 leading-none">
                      {study.pValue}
                    </p>
                  </div>
                </div>

                <div className="py-4 border-b border-black/8">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40 leading-none mb-2">
                    Key Finding
                  </p>
                  <p className="text-sm font-medium text-black leading-snug">
                    {study.keyFinding}
                  </p>
                </div>

                {study.chartData && study.chartData.length > 0 && (
                  <div className="pt-4 pb-4 border-b border-black/8">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/40 leading-none mb-3">
                      Results
                    </p>
                    <div className="h-48">
                      <StudyBarChart data={study.chartData} />
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center gap-2">
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums text-[#1B2757] rounded-full border border-black/12 hover:border-[#1B2757] hover:bg-[var(--brand-tint)] px-3 py-1.5 transition-colors"
                  >
                    PMID · {study.pmid}
                  </a>
                  <a
                    href={`https://doi.org/${study.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] tabular-nums text-black/60 rounded-full border border-black/12 hover:border-black/40 hover:bg-[var(--brand-tint)] px-3 py-1.5 transition-colors"
                  >
                    DOI · {study.doi}
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
