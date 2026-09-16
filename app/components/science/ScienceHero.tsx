import Image from "next/image";
import { SCIENCE_HERO } from "@/app/lib/scienceContent";
import {
  TrustIconInformedSport,
  TrustIconNoCaffeine,
  TrustIconUniversity,
} from "@/app/components/landing/icons";
import ScienceCtaButton from "./ScienceCtaButton";

/* ============================================================================
 * ScienceHero (SCRUM-1351, Simple DTC)
 *
 * Answers "does it work?" before anything else: the answer-first passage leads
 * with the placebo-controlled result, and the stat grid repeats it as numbers a
 * visitor can take in at a glance. The H1 pill mirrors the home "why" accordion
 * headline so the two pages read as one voice.
 *
 * Mobile order is copy, stats, CTA, then the image: at 390px the proof has to
 * land in the first screen, and the render is supporting rather than the point.
 * ========================================================================== */

const TRUST_ITEMS = [
  { label: "Informed Sport certified", Icon: TrustIconInformedSport },
  { label: "Zero caffeine", Icon: TrustIconNoCaffeine },
  { label: "Durham, Cambridge and Exeter research", Icon: TrustIconUniversity },
];

export default function ScienceHero() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
      <div>
        <h1
          className="brand-h1 mb-5 text-black lg:text-[3.25rem]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {SCIENCE_HERO.headingLead}{" "}
          <span className="inline-block rounded-full border border-[var(--brand-navy)] px-4 py-0.5 text-[var(--brand-navy)]">
            {SCIENCE_HERO.headingAccent}
          </span>
        </h1>
        <p className="mb-3 max-w-[56ch] text-lg font-medium leading-snug text-black">
          {SCIENCE_HERO.lede}
        </p>
        <p className="mb-7 max-w-[56ch] text-base leading-relaxed text-black/80">
          {SCIENCE_HERO.body}
        </p>

        <dl className="mb-7 grid grid-cols-2 gap-2.5">
          {SCIENCE_HERO.stats.map((stat) => (
            // dt must precede dd in the markup; column-reverse puts the
            // number on top visually.
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end rounded-md bg-[#eef0f5] px-4 py-4"
            >
              <dt className="mt-2 text-sm leading-snug text-black">
                {stat.label}
              </dt>
              <dd className="text-3xl font-bold leading-none tabular-nums text-[var(--brand-navy)] lg:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ScienceCtaButton href="/conka-both" location="hero">
            Try CONKA
          </ScienceCtaButton>
          <a
            href="#proof"
            className="inline-flex min-h-[44px] items-center text-base font-semibold text-[var(--brand-navy)] underline-offset-4 hover:underline"
          >
            See the trials
          </a>
        </div>

        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {TRUST_ITEMS.map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-2 text-sm text-black">
              <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--brand-navy)]" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#eef0f5] lg:aspect-square">
        <Image
          src="/formulas/labelV2/BothV5.webp"
          alt="CONKA Flow and CONKA Clear bottles side by side"
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
