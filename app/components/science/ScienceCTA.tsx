import Image from "next/image";
import { SCIENCE_CTA } from "@/app/lib/scienceContent";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";
import {
  TrustIconInformedSport,
  TrustIconNoCaffeine,
  TrustIconGuarantee,
} from "@/app/components/landing/icons";
import ScienceCtaButton from "./ScienceCtaButton";

/* ============================================================================
 * ScienceCTA (SCRUM-1351, Simple DTC)
 *
 * The close. Flow and Clear together at equal weight (never one spotlighted
 * over the other), pointing at /conka-both, the same destination as the home
 * "why" accordion CTA. The guarantee line comes from offerConstants so the
 * period never drifts from the rest of the site.
 * ========================================================================== */

export default function ScienceCTA() {
  const trust = [
    { label: "Informed Sport certified", Icon: TrustIconInformedSport },
    { label: "Zero caffeine", Icon: TrustIconNoCaffeine },
    { label: GUARANTEE_LABEL_FULL, Icon: TrustIconGuarantee },
  ];

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-md bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5 lg:grid-cols-2">
      <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[26rem]">
        <Image
          src="/formulas/labelV2/BothV5.webp"
          alt="CONKA Flow and CONKA Clear bottles together"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center p-6 lg:p-12">
        <h2 className="brand-h2 mb-4 text-black" style={{ letterSpacing: "-0.02em" }}>
          {SCIENCE_CTA.heading}
        </h2>
        <p className="mb-6 max-w-[48ch] text-base leading-relaxed text-black">
          {SCIENCE_CTA.body}
        </p>
        <ul className="mb-8 space-y-2.5">
          {trust.map(({ label, Icon }) => (
            <li key={label} className="flex items-center gap-2.5 text-base text-black">
              <Icon className="h-5 w-5 shrink-0 text-[var(--brand-navy)]" />
              {label}
            </li>
          ))}
        </ul>
        <div>
          <ScienceCtaButton href="/conka-both" location="final">
            Try Flow + Clear
          </ScienceCtaButton>
        </div>
      </div>
    </div>
  );
}
