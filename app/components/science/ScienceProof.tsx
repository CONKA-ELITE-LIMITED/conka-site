import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  FEATURED_TRIAL,
  SUPPORTING_TRIALS,
  IN_PROGRESS_TRIAL,
  RESEARCH_PARTNERS,
  INGREDIENT_REFERENCES,
  LITERATURE_REFERENCES,
  type TrialIcon,
  type TrialTag,
} from "@/app/lib/scienceContent";
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
 * Replaces the clinical EvidenceLadder. Two layers:
 *
 *  - Top layer: the result a visitor can take in at a glance. The one
 *    randomised, double-blind, placebo-controlled trial leads as the featured
 *    card, with a CONKA vs placebo bar; the two measured-but-uncontrolled
 *    trials follow at lower weight, each with an honest note on what its
 *    design can and cannot show.
 *  - Depth layer: method, partners and references behind native <details>.
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

/** Native disclosure with a rotating chevron. 44px minimum tap target. */
function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group border-t border-black/10">
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-semibold text-black [&::-webkit-details-marker]:hidden">
        {summary}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
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
          <Disclosure summary="How the trial was run">
            <ul className="space-y-2.5">
              {FEATURED_TRIAL.method.map((line) => (
                <li key={line} className="flex gap-3 text-base leading-relaxed text-black/80">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-navy)]" />
                  {line}
                </li>
              ))}
            </ul>
          </Disclosure>
        </div>
      </article>

      {/* Supporting: measured, not placebo-controlled */}
      <div className="mb-3 grid grid-cols-1 gap-3 lg:mb-4 lg:grid-cols-2 lg:gap-4">
        {SUPPORTING_TRIALS.map((trial) => (
          <article
            key={trial.id}
            className="flex flex-col rounded-md bg-white p-5 text-black ring-1 ring-black/5 lg:p-6"
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

      {/* Depth layer */}
      <div className="rounded-md bg-white px-5 text-black ring-1 ring-black/5 lg:px-8 [&>details:first-child]:border-t-0">
        <Disclosure summary="Our research partners">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {RESEARCH_PARTNERS.map((partner) => (
              <li key={partner.name} className="rounded-md bg-[#eef0f5] p-4">
                <div className="relative mb-3 h-9 w-full max-w-[140px]">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    loading="lazy"
                    sizes="140px"
                    className="object-contain object-left"
                  />
                </div>
                <p className="text-sm leading-snug text-black">{partner.role}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-black/70">
            The CONKA formulation is protected by UK patent GB2620279.
          </p>
        </Disclosure>

        <Disclosure summary="The published research behind the ingredients">
          <p className="mb-4 text-base leading-relaxed text-black/80">
            Every active earns its place from peer-reviewed research. Six of the
            key studies:
          </p>
          <ul className="mb-6 divide-y divide-black/10">
            {INGREDIENT_REFERENCES.map((ref) => (
              <li key={ref.pmid} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <span className="text-base text-black">
                  <span className="font-semibold">{ref.ingredient}:</span> {ref.finding}
                </span>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] shrink-0 items-center text-sm font-semibold text-[var(--brand-navy)] underline-offset-4 hover:underline"
                >
                  PubMed {ref.pmid} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mb-2 text-sm font-semibold text-black">Further reading</p>
          <ul className="space-y-1.5">
            {LITERATURE_REFERENCES.map((ref) => (
              <li key={`${ref.citation}-${ref.topic}`} className="text-sm text-black/80">
                {ref.citation}. {ref.topic}.
              </li>
            ))}
          </ul>
        </Disclosure>
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
