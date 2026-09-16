import Image from "next/image";
import { SCIENCE_HERO } from "@/app/lib/scienceContent";
import {
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
 * Mobile order is heading, image, then the proof and CTA, so the product shows
 * in the first screen. Desktop puts the image in its own column: the grid
 * places the heading and the copy block in column one, rows one and two, and
 * the image spans both rows of column two.
 * ========================================================================== */

// Informed Sport uses its real certification mark: a recognised logo carries
// more weight than a drawn shield. The other two have no mark to show.
const TRUST_ICONS = [
  { label: "Zero caffeine", Icon: TrustIconNoCaffeine },
  { label: "Durham, Cambridge and Exeter research", Icon: TrustIconUniversity },
];

export default function ScienceHero() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-x-16 lg:gap-y-0">
      <h1
        className="brand-h1 text-black lg:col-start-1 lg:row-start-1 lg:mb-5 lg:self-end lg:text-[3.25rem]"
        style={{ letterSpacing: "-0.02em" }}
      >
        {SCIENCE_HERO.headingLead}{" "}
        <span className="inline-block rounded-full border border-[var(--brand-navy)] px-4 py-0.5 text-[var(--brand-navy)]">
          {SCIENCE_HERO.headingAccent}
        </span>
      </h1>

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[#eef0f5] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-square lg:self-center">
        <Image
          src="/formulas/labelV2/BothV5.webp"
          alt="CONKA Flow and CONKA Clear bottles side by side"
          fill
          // Now inside the first mobile screen as well as on desktop, so it
          // is a likely LCP element on both.
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
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
              className="flex flex-col-reverse justify-center rounded-md bg-[#eef0f5] px-3 py-4 text-center"
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

        <div className="mb-6 flex flex-col items-center gap-3 lg:flex-row lg:gap-x-6">
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

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <li className="flex items-center gap-2 text-sm text-black">
            <Image
              src="/science/logos/InformedSport.png"
              alt=""
              width={257}
              height={316}
              className="h-7 w-auto shrink-0"
            />
            Informed Sport certified
          </li>
          {TRUST_ICONS.map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-2 text-sm text-black">
              <Icon className="h-[18px] w-[18px] shrink-0 text-[var(--brand-navy)]" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
