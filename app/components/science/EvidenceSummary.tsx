"use client";

import {
  clinicalEvidenceSummary,
  researchTeam,
  researchPartnerships,
} from "@/app/lib/scienceData";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";

interface EvidenceSummaryProps {
  isMobile?: boolean;
}

export default function EvidenceSummary({
  isMobile = false,
}: EvidenceSummaryProps) {
  const evidence = clinicalEvidenceSummary;

  const stats = [
    { value: String(evidence.totalStudies), label: "Peer-reviewed studies" },
    { value: `${evidence.totalParticipants.toLocaleString()}+`, label: "Research participants" },
    { value: evidence.researchInvestment, label: "Research investment" },
    { value: evidence.patentNumber, label: "UK patent", small: true },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// The evidence · SCI-02"}
        </p>
        <h2
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Research-backed. University-validated. Patented.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Durham · Cambridge · 32 peer-reviewed studies
        </p>
      </div>

      {/* Spec strip — stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-black/12 bg-white mb-8 lg:mb-10">
        {stats.map((stat, idx) => {
          const col = idx % (isMobile ? 2 : 4);
          const row = Math.floor(idx / (isMobile ? 2 : 4));
          const lastCol = col === (isMobile ? 1 : 3);
          const lastRow = row === Math.floor((stats.length - 1) / (isMobile ? 2 : 4));
          return (
            <div
              key={stat.label}
              className={`p-4 lg:p-5 ${!lastCol ? "border-r border-black/8" : ""} ${!lastRow ? "border-b border-black/8 lg:border-b-0" : ""}`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                {stat.label}
              </p>
              <p
                className={`font-mono font-bold tabular-nums text-[#1B2757] mt-2 leading-none ${
                  stat.small ? "text-base lg:text-lg" : "text-3xl lg:text-4xl"
                }`}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Partners + researchers */}
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          Partners & researchers · {String(researchPartnerships.length + researchTeam.length).padStart(2, "0")} entries
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {researchPartnerships.map((partnership, idx) => (
            <div
              key={partnership.institution}
              className="bg-white border border-black/12"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                  U-{String(idx + 1).padStart(2, "0")} · University partner
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                  Partner
                </span>
              </div>
              <div className="p-4 lg:p-5">
                <p className="text-base font-semibold text-black mb-1">
                  {partnership.institution}
                </p>
                <p className="text-sm text-black/65 leading-relaxed">
                  {partnership.focus}
                </p>
              </div>
            </div>
          ))}
          {researchTeam.map((researcher, idx) => (
            <div
              key={researcher.name}
              className="bg-white border border-black/12"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                  R-{String(idx + 1).padStart(2, "0")} · Researcher
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                  {researcher.affiliation}
                </span>
              </div>
              <div className="p-4 lg:p-5">
                <p className="text-base font-semibold text-black mb-1">
                  {researcher.title} {researcher.name}
                </p>
                <p className="text-sm text-black/65 leading-relaxed">
                  {researcher.contribution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white border border-black/12 p-5 lg:p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          Recommended start · Balance protocol
        </p>
        <h3
          className="brand-h3 text-black mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Put the science to work.
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
  );
}
