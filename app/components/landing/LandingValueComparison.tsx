"use client";

import Image from "next/image";
import ConkaCTAButton from "./ConkaCTAButton";
import CrashChart from "./CrashChart";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";

/* ============================================================================
 * LandingValueComparison
 *
 * Caffeine vs CONKA, told as the "borrowed energy" argument: mechanism copy,
 * the shared CrashChart (steady-vs-crash curve + cost comparison), a CONKA
 * counter-mechanism paragraph, CTA, and the nootropics/adaptogens strip.
 *
 * The chart is the CrashChart (cost table included), so the section no
 * longer carries its own price-closer line.
 *
 * Desktop: copy column left, chart right. Mobile: narrative order, chart
 * between the two paragraphs.
 * ========================================================================== */

export default function LandingValueComparison({
  ctaHref,
  ctaLabel,
}: {
  ctaHref?: string;
  ctaLabel?: string;
} = {}) {
  return (
    <div>
      {/* Desktop: copy column left, chart right, vertically centred. Mobile:
          single column in narrative order, chart between the two paragraphs. */}
      <div className="lg:flex lg:gap-12 lg:items-center">
        {/* Copy column */}
        <div className="lg:flex-1">
          <h2 className="brand-h1 mb-6 text-black">
            Caffeine doesn&apos;t give you energy.
            <br />
            It borrows it.
          </h2>

          {/* Mechanism — why coffee hands the fatigue back */}
          <p className="brand-body text-black mb-6">
            Caffeine blocks the receptors that tell your brain it&apos;s tired.
            It hides the fatigue for a few hours, spikes cortisol, and hands
            both back to you at 11am. The second cup isn&apos;t a habit.
            It&apos;s the system working as designed.
          </p>

          {/* Chart — mobile position, between the two paragraphs */}
          <div className="mb-6 lg:hidden">
            <CrashChart />
          </div>

          {/* CONKA — the counter-mechanism */}
          <p className="brand-body text-black mb-8">
            CONKA works the other way. Fifteen nootropics and adaptogens do
            the heavy lifting: brain-boosting nutrients build the focus,
            stress-mitigating compounds keep cortisol in check. Energy that
            doesn&apos;t have to be paid back.
          </p>

          <div className="flex justify-center lg:justify-start">
            <ConkaCTAButton href={ctaHref} meta={null}>
              {ctaLabel ?? `Get Both from £${PRICE_PER_SHOT_BOTH}/shot`}
            </ConkaCTAButton>
          </div>

          {/* Ingredient-class strip — pays off the "nootropics and
              adaptogens" line above */}
          <div className="flex items-center gap-6 mt-8">
            <IngredientClass
              icon="/icons/NootropicsIcon.avif"
              name="Nootropics"
              role="Brain-boosting"
            />
            <div className="w-px h-12 bg-black/15" aria-hidden />
            <IngredientClass
              icon="/icons/AdaptogensIcon.avif"
              name="Adaptogens"
              role="Stress-mitigating"
            />
          </div>
        </div>

        {/* Chart — desktop position */}
        <div className="hidden lg:block lg:flex-1">
          <CrashChart />
        </div>
      </div>
    </div>
  );
}

function IngredientClass({
  icon,
  name,
  role,
}: {
  icon: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Image src={icon} width={42} height={42} alt="" aria-hidden />
      <div className="leading-tight">
        <div className="text-base font-semibold text-black">{name}</div>
        <div className="text-sm text-black mt-0.5">
          {role}
        </div>
      </div>
    </div>
  );
}
