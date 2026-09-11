"use client";

import { useRef } from "react";
import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import { storyCta } from "@/app/lib/storyData";
import { useGSAP, withMotion, revealUp } from "@/app/lib/motion";

/* ============================================================================
 * OurStoryCTA — the closing beat of /our-story.
 *
 * The one centred block on the page, per the Figma. Everything else is
 * left-aligned; this is the deliberate exception, not a drift.
 *
 * Simple DTC (DESIGN_SYSTEM.md §8.5): rounded CTA with no mono meta line.
 *
 * Content-only; the page owns the section wrapper, background and track.
 * ========================================================================== */

export function OurStoryCTA() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        revealUp("[data-cta-reveal]", root.current);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-col items-center text-center">
      <h2
        data-cta-reveal
        className="brand-h1 text-black mb-5"
        style={{ letterSpacing: "-0.02em" }}
      >
        {storyCta.heading}
      </h2>
      {/* The width cap lives on the wrapper, not the <p>: brand-base.css is
          unlayered, so .brand-body's own max-width beats a Tailwind max-w-*
          utility on the same element. */}
      <div data-cta-reveal className="max-w-xl mb-8 lg:mb-10">
        <p className="brand-body text-black/80">{storyCta.body}</p>
      </div>
      <div data-cta-reveal>
        <ConkaCTAButton>{storyCta.ctaLabel}</ConkaCTAButton>
      </div>
    </div>
  );
}

export default OurStoryCTA;
