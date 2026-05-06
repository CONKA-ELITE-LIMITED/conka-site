"use client";

import { ClinicalStudy, FormulaId, FORMULA_COLORS } from "@/app/lib/productData";

interface ClinicalStudyCardProps {
  study: ClinicalStudy;
  formulaId: FormulaId;
}

// Icon components
const UniversityIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const ProfessorIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ParticipantsIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

export default function ClinicalStudyCard({ study, formulaId }: ClinicalStudyCardProps) {
  const accentColor = FORMULA_COLORS[formulaId];

  return (
    <div className="premium-box overflow-hidden">
      <div className="p-6 border-b-2 bg-black/5 border-black/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/10">
              <DocumentIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase opacity-50 mb-1">
                Clinical Study
              </p>
              <h3 className="text-lg md:text-xl font-bold leading-tight">
                {study.name}
              </h3>
            </div>
          </div>
          <span className="font-mono text-sm opacity-50">{study.year}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6">
        {/* Study Info Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Professor & University */}
          <div className="p-4 rounded-lg bg-black/5">
            <div className="flex items-center gap-2 mb-3">
              <ProfessorIcon className="w-4 h-4 opacity-60" />
              <span className="font-mono text-xs uppercase opacity-60">Lead Researcher</span>
            </div>
            <p className="font-semibold">{study.professor}</p>
            <div className="flex items-center gap-2 mt-2">
              <UniversityIcon className="w-4 h-4 opacity-60" />
              <p className="font-mono text-sm opacity-70">{study.university}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-black/5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-4 h-4 opacity-60" />
              <span className="font-mono text-xs uppercase opacity-60">Study Duration</span>
            </div>
            <p className="font-semibold text-2xl">{study.duration}</p>
            <p className="font-mono text-sm opacity-70 mt-1">
              Randomized, double-blind, placebo-controlled
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-black/5">
          <div className="flex items-center gap-2 mb-4">
            <ParticipantsIcon className="w-4 h-4 opacity-60" />
            <span className="font-mono text-xs uppercase opacity-60">Participant Demographics</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className={`font-mono text-2xl font-bold ${accentColor.text}`}>
                {study.participants.total}
              </p>
              <p className="font-mono text-xs opacity-60">Total Participants</p>
            </div>
            <div>
              <p className="font-semibold">{study.participants.ageRange}</p>
              <p className="font-mono text-xs opacity-60">Age Range</p>
            </div>
            <div>
              <p className="font-semibold">{study.participants.genderSplit}</p>
              <p className="font-mono text-xs opacity-60">Gender Split</p>
            </div>
            {study.participants.conditions && (
              <div className="col-span-2 md:col-span-1">
                <p className="font-semibold text-sm">{study.participants.conditions}</p>
                <p className="font-mono text-xs opacity-60">Selection Criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Abstract */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DocumentIcon className="w-4 h-4 opacity-60" />
            <span className="font-mono text-xs uppercase opacity-60">Abstract</span>
          </div>
          <p className="text-sm leading-relaxed opacity-80 font-commentary">
            {study.abstract}
          </p>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ChartIcon className="w-4 h-4 opacity-60" />
            <span className="font-mono text-xs uppercase opacity-60">Key Results</span>
          </div>
          <div className="grid gap-3">
            {study.results.map((result, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-l-4 flex items-start justify-between gap-4 bg-black/5"
                style={{ borderLeftColor: accentColor.hex }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{result.metric}</p>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-xs ${
                        result.pValue.includes("0.001") || result.pValue.includes("0.01")
                          ? "bg-green-500/20 text-green-700"
                          : "bg-yellow-500/20 text-yellow-700"
                      }`}
                    >
                      {result.pValue}
                    </span>
                  </div>
                  <p className="font-mono text-xs opacity-60">{result.description}</p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-2xl font-bold ${accentColor.text}`}>
                    {result.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg border-2 border-black/20 bg-black/5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircleIcon className={`w-5 h-5 ${accentColor.text}`} />
            <span className="font-mono text-xs uppercase opacity-60">Conclusion</span>
          </div>
          <p className="text-sm leading-relaxed font-medium">
            {study.conclusion}
          </p>
        </div>

        {/* Study ID Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-current border-opacity-10">
          <p className="font-mono text-xs opacity-40">
            Study ID: {study.id}
          </p>
          <p className="font-mono text-xs opacity-40">
            Peer Reviewed • Published {study.year}
          </p>
        </div>
      </div>
    </div>
  );
}

