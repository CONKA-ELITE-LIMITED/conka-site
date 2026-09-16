import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  FEATURED_TRIAL,
  SUPPORTING_TRIALS,
  IN_PROGRESS_TRIAL,
  RESEARCH_PARTNERS,
  type TrialIcon,
  type TrialTag,
} from "@/app/lib/scienceContent";
import ScienceDisclosure from "./ScienceDisclosure";
import {
  StudyIconRandomised,
  StudyIconBlind,
  StudyIconPlacebo,
  StudyIconPeople,
  StudyIconDuration,
} from "@/app/components/landing/icons";

/* ============================================================================
 * ScienceProof (SCRUM-1351, Simple DTC)
 *
 * Two layers:
 *
 *  - Top layer: the result a visitor can take in at a glance. The one
 *    randomised, double-blind, placebo-controlled trial leads as the featured
 *    card, with a CONKA vs placebo bar; the two measured-but-uncontrolled
 *    trials follow at lower weight, each with an honest note on what its
 *    design can and cannot show.
 *  - Depth layer: how the trial was run, behind a native <details>. Research
 *    partner logos sit below the trials, always visible.
 *    Closed <details> content is still in the server-rendered HTML, so the
 *    detail stays indexable and quotable without any client JS.
 *
 * Study design is shown as icon tags rather than prose, so "how was this run"
 * is scannable before it is readable.
 * ========================================================================== */

const TAG_ICONS: Record<TrialIcon, (props: { className?: string }) => ReactNode> = {
  randomised: StudyIconRandomised,
  blind: StudyIconBlind,
  placebo: StudyIconPlacebo,
  people: StudyIconPeople,
  duration: StudyIconDuration,
};

function DesignTags({ tags }: { tags: readonly TrialTag[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const Icon = TAG_ICONS[tag.icon];
        return (
          <li
            key={tag.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#eef0f5] px-3 py-1.5 text-sm font-medium text-black"
          >
            <Icon className="h-4 w-4 shrink-0 text-[var(--brand-navy)]" />
            {tag.label}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * CONKA vs placebo on a shared zero line. The zero sits a little in from the
 * left so the placebo's small decline has somewhere to go; both bars are
 * scaled against the larger magnitude so their lengths stay honest.
 */
function PlaceboComparison() {
  const { conka, placebo } = FEATURED_TRIAL;
  const zero = 12; // % of track left of the zero line
  const scale = (100 - zero - 6) / Math.max(Math.abs(conka.value), Math.abs(placebo.value));
  const rows = [conka, placebo].map((row) => ({
    ...row,
    width: Math.abs(row.value) * scale,
    display: `${row.value > 0 ? "+" : ""}${row.value.toFixed(2)}%`,
  }));

  return (
    <div className="space-y-4" role="img" aria-label={`Change in cognitive performance: CONKA ${rows[0].display}, placebo ${rows[1].display}`}>
      {rows.map((row) => {
        const isPositive = row.value >= 0;
        return (
          <div key={row.label} aria-hidden>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-black">{row.label}</span>
              <span
                className={`text-lg font-bold tabular-nums ${
                  isPositive ? "text-[var(--brand-navy)]" : "text-black/60"
                }`}
              >
                {row.display}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-black/[0.06]">
              <span
                className="absolute inset-y-[-3px] w-px bg-black/30"
                style={{ left: `${zero}%` }}
              />
              <span
                className={`absolute inset-y-0 rounded-full ${
                  isPositive ? "bg-[var(--brand-navy)]" : "bg-black/35"
                }`}
                style={
                  isPositive
                    ? { left: `${zero}%`, width: `${row.width}%` }
                    : { right: `${100 - zero}%`, width: `${Math.max(row.width, 1.5)}%` }
                }
              />
            </div>
          </div>
        );
      })}
      <p className="text-xs text-black/60">Change in cognitive performance over six weeks</p>
    </div>
  );
}

export default function ScienceProof() {
  return (
    <div>
      <div className="mb-8 max-w-2xl lg:mb-10">
        <h2 className="brand-h2 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          Proven against placebo, not just promised
        </h2>
        <p className="text-base leading-relaxed text-black/80">
          Our lead trial was run the way medicines are tested: randomised,
          double-blind and against a placebo. Here is what each trial found, and
          exactly how it was run.
        </p>
      </div>

      {/* Featured: the placebo-controlled trial */}
      <article className="mb-3 rounded-md bg-white p-5 text-black shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:mb-4 lg:p-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-2xl font-bold leading-tight text-black">
            {FEATURED_TRIAL.name}
          </h3>
          <span className="text-sm text-black/60">{FEATURED_TRIAL.context}</span>
        </div>
        <div className="mb-6">
          <DesignTags tags={FEATURED_TRIAL.tags} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <PlaceboComparison />

          <div>
            <dl className="mb-5 grid grid-cols-3 gap-2">
              {FEATURED_TRIAL.supporting.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse justify-end rounded-md bg-[#eef0f5] px-3 py-3"
                >
                  <dt className="mt-1.5 text-xs leading-snug text-black">{stat.label}</dt>
                  <dd className="text-xl font-bold leading-none tabular-nums text-[var(--brand-navy)] lg:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-base leading-relaxed text-black">
              {FEATURED_TRIAL.callout}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <ScienceDisclosure summary="How the trial was run">
            <ul className="space-y-2.5">
              {FEATURED_TRIAL.method.map((line) => (
                <li key={line} className="flex gap-3 text-base leading-relaxed text-black/80">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-navy)]" />
                  {line}
                </li>
              ))}
            </ul>
          </ScienceDisclosure>
        </div>
      </article>

      {/* Supporting: measured, not placebo-controlled */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:mb-4 lg:grid-cols-2 lg:gap-4">
        {SUPPORTING_TRIALS.map((trial) => (
          <article
            key={trial.id}
            className="flex flex-col rounded-md bg-white p-5 text-black shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:p-6"
          >
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-xl font-bold leading-tight text-black">{trial.name}</h3>
              <span className="text-sm text-black/60">{trial.context}</span>
            </div>
            <div className="mb-5">
              <DesignTags tags={trial.tags} />
            </div>
            <p className="text-4xl font-bold leading-none tabular-nums text-[var(--brand-navy)]">
              {trial.headline.value}
            </p>
            <p className="mb-4 mt-1.5 text-base font-medium text-black">{trial.headline.label}</p>
            <ul className="mb-4 space-y-1">
              {trial.supporting.map((stat) => (
                <li key={stat.label} className="text-sm text-black">
                  <span className="font-bold tabular-nums">{stat.value}</span> {stat.label}
                </li>
              ))}
            </ul>
            <p className="mt-auto border-t border-black/10 pt-4 text-sm leading-relaxed text-black/70">
              {trial.note}
            </p>
          </article>
        ))}
      </div>

      {/* In progress: design only, results unpublished */}
      <article className="mb-8 rounded-md border border-dashed border-black/20 p-5 text-black lg:mb-10 lg:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-full bg-[var(--brand-navy)] px-3 py-1 text-xs font-semibold text-white">
            In progress
          </span>
          <h3 className="text-xl font-bold leading-tight text-black">{IN_PROGRESS_TRIAL.name}</h3>
          <span className="text-sm text-black/60">{IN_PROGRESS_TRIAL.context}</span>
        </div>
        <div className="mb-4">
          <DesignTags tags={IN_PROGRESS_TRIAL.tags} />
        </div>
        <p className="max-w-[70ch] text-base leading-relaxed text-black/80">
          {IN_PROGRESS_TRIAL.body}
        </p>
      </article>

      {/* Research partners: logos only. The logo PNGs carry transparent padding
          (200x150 canvas), so each sits in a 4:3 box sized to the column rather
          than a fixed height, which rendered them tiny. */}
      <div>
        <h3 className="mb-4 text-xl font-bold leading-tight text-black">Our research partners</h3>
        <ul className="grid max-w-[40rem] grid-cols-3 items-center gap-4">
          {RESEARCH_PARTNERS.map((partner) => (
            <li key={partner.name} className="relative aspect-[4/3] w-full">
              <Image
                src={partner.logo}
                alt={partner.name}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 200px, 30vw"
                className="object-contain"
              />
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-base text-black">
        Want the full stories?{" "}
        <Link
          href="/case-studies"
          className="inline-flex min-h-[44px] items-center font-semibold text-[var(--brand-navy)] underline underline-offset-4"
        >
          Read the athlete case studies
        </Link>
      </p>
    </div>
  );
}
