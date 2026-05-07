"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AthleteData,
  SportCategory,
  getAthleteById,
  CASE_STUDY_PHOTO_PATHS,
} from "@/app/lib/caseStudiesData";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";
import AppWidgetGridModal from "./AppWidgetGridModal";

// ─── Research data ─────────────────────────────────────────────────────────────

const RESEARCH_STATS: {
  value: string;
  label: string;
  source: string;
  href: string | null;
  ref: string | null;
}[] = [
  {
    value: "93%",
    label: "Sensitivity detecting cognitive impairment",
    source: "ADePT Study",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10533908/",
    ref: "PMC10533908",
  },
  {
    value: "87.5%",
    label: "Test-retest reliability",
    source: "ADePT Study",
    href: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10533908/",
    ref: "PMC10533908",
  },
  {
    value: "14",
    label: "NHS Trusts in clinical validation trials",
    source: "HRA Clinical Trial",
    href: "https://www.isrctn.com/ISRCTN95636074",
    ref: "ISRCTN95636074",
  },
  {
    value: "16%",
    label: "Cognitive improvement in 30 days",
    source: "Clinical data",
    href: null,
    ref: null,
  },
];

// ─── Athlete data ──────────────────────────────────────────────────────────────

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

const SPORT_LABELS: Record<SportCategory, string> = {
  rugby: "RUGBY UNION",
  rugby7s: "RUGBY 7s",
  football: "FOOTBALL",
  motorsport: "MOTORSPORT",
  business: "BUSINESS",
  other: "OTHER",
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

// ─── Dark athlete card ─────────────────────────────────────────────────────────

function DarkAthleteCard({
  athlete,
  compact = false,
}: {
  athlete: AthleteData;
  compact?: boolean;
}) {
  const photo = CASE_STUDY_PHOTO_PATHS[athlete.id] ?? "";
  const focal = athlete.focalPoint ?? { x: 50, y: 50 };

  if (compact) {
    return (
      <div className="flex flex-col">
        {photo && (
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={photo}
              alt={athlete.name}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover brightness-75"
              style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
            />
          </div>
        )}

        <div className="flex flex-col p-5">
          <div className="mb-4">
            <p className="text-lg font-semibold text-white leading-tight">
              {athlete.name}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 mt-1 leading-tight">
              {SPORT_LABELS[athlete.sport]}
              {athlete.position ? ` · ${athlete.position.toUpperCase()}` : ""}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/10">
            {STAT_KEYS.map((key) => {
              const stat = getStat(athlete, key);
              return (
                <div key={key} className="flex flex-col items-start gap-1.5">
                  <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 leading-none">
                    {STAT_ABBR[key]}
                  </span>
                  <span className="font-mono text-2xl font-bold tabular-nums text-white leading-none">
                    {stat?.value ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-start justify-between gap-3 pt-4">
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 leading-none">
                Product
              </p>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white mt-1 leading-none truncate">
                {productLabel(athlete.productVersion)}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 leading-none">
                Tests
              </p>
              <p className="font-mono text-[11px] font-bold tabular-nums text-white mt-1 leading-none">
                N={athlete.testsCompleted}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white/[0.04] overflow-hidden h-full">
      {photo && (
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image
            src={photo}
            alt={athlete.name}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 90vw, 480px"
            className="object-cover brightness-75"
            style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 lg:p-5">
        <div className="mb-3">
          <p className="text-base font-semibold text-white leading-tight">
            {athlete.name}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 mt-1 leading-tight">
            {SPORT_LABELS[athlete.sport]}
            {athlete.position ? ` · ${athlete.position.toUpperCase()}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1 py-3 border-y border-white/10">
          {STAT_KEYS.map((key) => {
            const stat = getStat(athlete, key);
            return (
              <div key={key} className="flex flex-col items-start gap-1">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 leading-none">
                  {STAT_ABBR[key]}
                </span>
                <span className="font-mono text-sm font-bold tabular-nums text-white leading-none">
                  {stat?.value ?? "—"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto flex items-start justify-between gap-3 pt-3">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 leading-none">
              Product
            </p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white mt-1 leading-none truncate">
              {productLabel(athlete.productVersion)}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35 leading-none">
              Tests
            </p>
            <p className="font-mono text-[10px] font-bold tabular-nums text-white mt-1 leading-none">
              N={athlete.testsCompleted}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chevron ───────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Main grid ─────────────────────────────────────────────────────────────────

export default function AppWidgetGrid() {
  const [researchOpen, setResearchOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [caseStudyModalOpen, setCaseStudyModalOpen] = useState(false);
  const [athleteIndex, setAthleteIndex] = useState(0);

  const athletes = ATHLETE_IDS.map((id) => getAthleteById(id)).filter(
    (a): a is AthleteData => a !== undefined,
  );
  const firstAthlete = athletes[0];
  const total = athletes.length;

  const prevAthlete = () => setAthleteIndex((i) => (i - 1 + total) % total);
  const nextAthlete = () => setAthleteIndex((i) => (i + 1) % total);

  if (!firstAthlete) return null;

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 items-start">

        {/* ── Research tile ─────────────────────────────────────────────── */}
        <div className="border border-white/15 bg-white/[0.07] flex flex-col">
          <button
            type="button"
            onClick={() => setResearchOpen((v) => !v)}
            aria-expanded={researchOpen}
            className="flex items-start justify-between gap-3 p-4 min-h-[44px] text-left w-full"
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2 tabular-nums">
                Research
              </p>
              <p className="text-sm font-medium text-white leading-snug">
                Cambridge-derived. NHS-validated. FDA-cleared.
              </p>
            </div>
            <Chevron open={researchOpen} />
          </button>

          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              researchOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-5 pt-4 border-t border-white/10 space-y-4">
              {RESEARCH_STATS.map((stat) => (
                <div key={stat.value} className="flex flex-col gap-1">
                  <p className="font-mono text-2xl font-bold text-white tabular-nums leading-none">
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 leading-snug">
                    {stat.label}
                  </p>
                  {stat.href ? (
                    <a
                      href={stat.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] text-white/30 hover:text-white/60 transition-colors tabular-nums"
                    >
                      {stat.source} · {stat.ref} ↗
                    </a>
                  ) : (
                    <p className="font-mono text-[9px] text-white/30 tabular-nums">
                      {stat.source}
                    </p>
                  )}
                </div>
              ))}
              <p className="font-mono text-[9px] text-white/20 tabular-nums pt-2 border-t border-white/8 leading-relaxed">
                FDA 510(k) cleared · Cambridge Cognition · ISRCTN95636074
              </p>
            </div>
          </div>
        </div>

        {/* ── Install tile ──────────────────────────────────────────────── */}
        <div className="border border-white/15 bg-white/[0.07] flex flex-col">
          <button
            type="button"
            onClick={() => setInstallOpen((v) => !v)}
            aria-expanded={installOpen}
            className="flex items-start justify-between gap-3 p-4 min-h-[44px] text-left w-full"
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-2 tabular-nums">
                Get the App
              </p>
              <p className="text-sm font-medium text-white leading-snug">
                iOS and Android. Free to download.
              </p>
            </div>
            <Chevron open={installOpen} />
          </button>

          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              installOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-4 pb-5 pt-4 border-t border-white/10">
              <AppInstallButtons variant="clinical-dark" />
            </div>
          </div>
        </div>

        {/* ── Asset tile ────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden col-span-2 lg:col-span-1 min-h-[220px] border border-white/15">
          <Image
            src="/app/NothingAppRing.jpg"
            alt="CONKA app user checking their cognitive score"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* ── Case study tile ───────────────────────────────────────────── */}
        <div className="col-span-2 lg:col-span-1 border border-white/15 bg-white/[0.07] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1 tabular-nums">
                Athlete data · N={total}
              </p>
              <p className="text-sm font-medium text-white leading-snug">
                Real results. Live data.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAthleteIndex(0);
                setCaseStudyModalOpen(true);
              }}
              className="flex-shrink-0 ml-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white border border-white/40 hover:border-white px-3 min-h-[44px] transition-colors tabular-nums"
            >
              View all ↗
            </button>
          </div>
          <DarkAthleteCard athlete={firstAthlete} />
        </div>

      </div>

      {/* Case study lightbox */}
      <AppWidgetGridModal
        isOpen={caseStudyModalOpen}
        onClose={() => setCaseStudyModalOpen(false)}
        onPrev={prevAthlete}
        onNext={nextAthlete}
        currentIndex={athleteIndex}
        total={total}
      >
        {athletes[athleteIndex] && (
          <DarkAthleteCard athlete={athletes[athleteIndex]} compact />
        )}
      </AppWidgetGridModal>

    </>
  );
}
