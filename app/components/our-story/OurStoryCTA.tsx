"use client";

import { useRef } from "react";
import Image from "next/image";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import ExploreMoreRow from "@/app/components/landing/ExploreMoreRow";
import { GUARANTEE_LABEL_FULL } from "@/app/lib/offerConstants";
import { gsap, useGSAP, withMotion, revealUp } from "@/app/lib/motion";
import { countUpStat } from "./storyMotion";

/* ============================================================================
 * OurStoryCTA — closing conversion beat of /our-story ("Chapter 07 · You").
 *
 * House revealUp entrances, count-up on the proof strip numbers, and the
 * laurel research badge as the final credibility marker before the button.
 * Content-only; the page owns the section wrapper.
 * ========================================================================== */

const STRIP_STATS = [
  { label: "Research", value: "£500K+" },
  { label: "Clinical trials", value: "25+" },
  { label: "Formula", value: "Patented" },
];

export function OurStoryCTA() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        revealUp("[data-cta-reveal]", root.current);
        gsap.utils
          .toArray<HTMLElement>("[data-cta-stat]")
          .forEach((el, i) => {
            countUpStat(el, STRIP_STATS[i].value, { duration: 1.3 });
          });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <div className="max-w-3xl">
      <p
        data-cta-reveal
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3"
      >
        {"// Chapter 07 · You"}
      </p>
      <h2
        data-cta-reveal
        className="brand-h1 text-black mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        The next chapter is yours to test.
      </h2>
      <p
        data-cta-reveal
        className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-8"
      >
        {GUARANTEE_LABEL_FULL} · Free UK shipping · Cancel anytime
      </p>

      <div data-cta-reveal className="bg-white border border-black/12 mb-6">
        <div className="grid grid-cols-3 border-b border-black/8">
          {STRIP_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-4 lg:p-5 ${
                i < STRIP_STATS.length - 1 ? "border-r border-black/8" : ""
              }`}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/40 leading-none">
                {stat.label}
              </p>
              <p
                data-cta-stat
                className="font-mono text-xl lg:text-2xl font-bold tabular-nums text-[#1B2757] mt-2 leading-none"
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="p-5 lg:p-6">
          <ConkaCTAButton href="/conka-both" meta={null}>
            Try CONKA now
          </ConkaCTAButton>
        </div>
      </div>

      {/* Brain-research credibility badge — laurel-flanked award style. The
          same /LaurelWreath.png renders on each side; each container clips to
          half so the left shows the left branch, right shows the right. */}
      <div
        data-cta-reveal
        className="mb-10 flex items-center gap-3 p-4 bg-black/[0.04]"
      >
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: "30px", height: "64px" }}
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="80px"
            style={{ objectFit: "cover", objectPosition: "left center" }}
          />
        </div>

        <div className="flex-1 text-center leading-snug">
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#1B2757] font-bold mb-1">
            One of the World&apos;s Largest
          </div>
          <div className="text-[13px] text-black font-semibold">
            Consumer brain research project. 1,000+ brains tested regularly
            through our app, unlocking a new level of cognitive performance.
          </div>
        </div>

        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: "30px", height: "64px" }}
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="80px"
            style={{ objectFit: "cover", objectPosition: "right center" }}
          />
        </div>
      </div>

      {/* Routing for visitors who want to keep learning instead of buying */}
      <div data-cta-reveal>
        <ExploreMoreRow />
      </div>
      </div>
    </div>
  );
}

export default OurStoryCTA;
