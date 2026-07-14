"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  AthleteData,
  SportCategory,
  getAthletesForFormula,
  getAthletesForBoth,
  getCaseStudyPhotoPath,
} from "@/app/lib/caseStudiesData";
import type { BothProductId, FormulaId } from "@/app/lib/productData";
import ConkaCTAButton from "./landing/ConkaCTAButton";

interface FormulaCaseStudiesProps {
  formulaId?: FormulaId;
  /** "01" / "02" for a single formula, "03" for Both (/conka-both). */
  productId?: FormulaId | BothProductId;
  athletes?: AthleteData[];
}

/** Resolve the athlete cohort for a formula or for Both. */
function resolveAthletes(
  productId?: FormulaId | BothProductId,
  formulaId?: FormulaId,
): AthleteData[] {
  if (productId) {
    return productId === "03"
      ? getAthletesForBoth()
      : getAthletesForFormula(productId);
  }
  if (formulaId) return getAthletesForFormula(formulaId);
  return [];
}

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

function AthleteSpecCard({
  athlete,
  index,
}: {
  athlete: AthleteData;
  index: number;
}) {
  const [bioOpen, setBioOpen] = useState(false);
  const photoSrc = getCaseStudyPhotoPath(athlete.id) || athlete.photo || "";
  const focal = athlete.focalPoint ?? { x: 50, y: 30 };
  const cardNumber = String(index + 1).padStart(2, "0");
  const sportLine = [
    SPORT_LABELS[athlete.sport],
    athlete.position ? athlete.position.toUpperCase() : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const identitySub = [
    `N=${athlete.testsCompleted} TESTS`,
    productLabel(athlete.productVersion),
  ]
    .filter((s) => s && s !== "—")
    .join(" · ");

  return (
    <article className="flex flex-col bg-white border border-black/12 h-full">
      {/* Card header row — counter + sport category */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-black/8">
        <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
          {cardNumber}.
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
          {sportLine}
        </span>
      </div>

      {/* Photo — portrait aspect, lab-asset-frame treatment */}
      <div className="px-6 pt-6">
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[var(--brand-surface)]">
          {photoSrc ? (
            <Image
              src={photoSrc}
              alt={athlete.name}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 75vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-black/30">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Photo
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Identity — name + mono sub (tests + product) */}
      <div className="px-6 pt-6">
        <p className="text-lg font-semibold text-black leading-tight">
          {athlete.name}
        </p>
        {identitySub ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mt-1.5 leading-tight">
            {identitySub}
          </p>
        ) : null}
      </div>

      {/* Spec strip — 3 metrics inside lab-asset-frame, border-r dividers */}
      <div className="px-6 pt-5">
        <div className="bg-white grid grid-cols-3 border-y border-black/10">
          {STAT_KEYS.map((key, i) => {
            const stat = getStat(athlete, key);
            const isLast = i === STAT_KEYS.length - 1;
            return (
              <div
                key={key}
                className={`flex flex-col items-start gap-1.5 px-3 py-3.5 ${
                  isLast ? "" : "border-r border-black/8"
                }`}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 leading-none">
                  {STAT_ABBR[key]}
                </span>
                <span className="font-mono text-base lg:text-lg font-bold tabular-nums text-black leading-none">
                  {stat?.value ?? "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bio — base of card */}
      {athlete.description ? (
        <div className="mt-auto px-6 pt-5 pb-6">
          <p
            className={`text-xs leading-relaxed text-black/60 ${
              !bioOpen ? "line-clamp-2" : ""
            }`}
          >
            {athlete.description}
          </p>
          <button
            type="button"
            onClick={() => setBioOpen((p) => !p)}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/60 mt-2 underline decoration-black/20 underline-offset-2 hover:decoration-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
          >
            {bioOpen ? "Show less" : "Read more"}
          </button>
        </div>
      ) : (
        <div className="mt-auto pb-6" aria-hidden />
      )}
    </article>
  );
}

export default function FormulaCaseStudies({
  formulaId,
  productId,
}: FormulaCaseStudiesProps) {
  if (!productId && !formulaId) {
    throw new Error(
      "FormulaCaseStudies requires either formulaId or productId",
    );
  }

  const athletes = resolveAthletes(productId, formulaId);

  if (athletes.length === 0) return null;

  return (
    <>
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Verified results · PROOF-01"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          CONKA Case Studies
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {athletes.length} Real People · Real data · Measured improvement
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete, i) => (
          <AthleteSpecCard key={athlete.id} athlete={athlete} index={i} />
        ))}
      </div>

      <div className="mt-10 flex justify-start">
        <ConkaCTAButton href="/case-studies" meta="// all measured outcomes">
          View All Case Studies
        </ConkaCTAButton>
      </div>
    </>
  );
}

export function FormulaCaseStudiesMobile({
  formulaId,
  productId,
  athletes: providedAthletes,
}: FormulaCaseStudiesProps) {
  const athletes =
    providedAthletes ?? resolveAthletes(productId, formulaId);

  const caseStudiesCarouselRef = useRef<HTMLDivElement>(null);
  const [caseStudiesCarouselIndex, setCaseStudiesCarouselIndex] = useState(0);

  if (athletes.length === 0) return null;

  return (
    <>
      <header className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Verified results · PROOF-01"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          CONKA Case Studies
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          {athletes.length} Real People · Real data · Measured improvement
        </p>
      </header>

      {/* Swipeable horizontal carousel */}
      <div
        ref={caseStudiesCarouselRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="region"
        aria-label="CONKA case studies - swipe to view all"
        onScroll={() => {
          const el = caseStudiesCarouselRef.current;
          if (!el) return;
          const cardWidth = el.offsetWidth * 0.75 + 16;
          const index = Math.min(
            athletes.length - 1,
            Math.max(0, Math.round(el.scrollLeft / cardWidth)),
          );
          setCaseStudiesCarouselIndex(index);
        }}
      >
        {athletes.map((athlete, i) => (
          <div
            key={athlete.id}
            className="flex-shrink-0 w-[75vw] max-w-[280px] snap-center"
          >
            <AthleteSpecCard athlete={athlete} index={i} />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {athletes.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 transition-all ${
              caseStudiesCarouselIndex === idx
                ? "bg-black w-6"
                : "bg-black/25 w-1.5"
            }`}
            aria-hidden
          />
        ))}
      </div>

      <div className="mt-10 flex justify-start">
        <ConkaCTAButton href="/case-studies" meta="// all measured outcomes">
          View All Case Studies
        </ConkaCTAButton>
      </div>
    </>
  );
}
