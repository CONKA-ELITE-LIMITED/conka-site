"use client";

import Image from "next/image";

/* ============================================================================
 * CROResearch
 *
 * V2 Section 8 on /start. Academic / institutional proof beat after the
 * athlete + Informed Sport beat of Section 7. Mirrors the Ketone-IQ
 * "World-Class Research." pattern: hero image spread, big two-line title,
 * partner-logo strip, aspirational description.
 *
 * Cambridge is the hero asset (the test in the CONKA app is built on
 * Cambridge research). Durham + Exeter + Made in Britain sit in the logo
 * strip as supporting credibility tiers.
 * ========================================================================== */

const RESEARCH_PARTNERS = [
  { src: "/logos/UniversityOfDurham.png", alt: "Durham University" },
  { src: "/logos/UniversityOfExeter.png", alt: "Exeter University" },
  { src: "/logos/MadeInBritain.png", alt: "Made in Britain" },
];

export default function CROResearch() {
  return (
    <div className="mx-auto max-w-[560px]">
      {/* ===== Hero Cambridge image ===== */}
      <div className="relative aspect-[4/3] rounded-[var(--brand-radius-container)] overflow-hidden bg-black/[0.04] mb-8">
        <Image
          src="/UniversityOfCambridge.png"
          alt="The University of Cambridge"
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-cover"
        />
      </div>

      {/* ===== Title ===== */}
      <h2
        className="text-center text-black font-semibold text-[34px] sm:text-[38px] leading-[1.08] mb-7"
        style={{ letterSpacing: "-0.02em" }}
      >
        World-Class Research.
        <br />
        World-Class Results.
      </h2>

      {/* ===== Partner logo strip ===== */}
      <div className="flex justify-center items-center gap-6 sm:gap-10 mb-7 flex-wrap">
        {RESEARCH_PARTNERS.map((partner) => (
          <div
            key={partner.src}
            className="relative w-[80px] h-[60px] sm:w-[96px] sm:h-[72px]"
          >
            <Image
              src={partner.src}
              alt={partner.alt}
              fill
              sizes="96px"
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* ===== Description ===== */}
      <p className="text-center text-[15px] text-black/75 leading-relaxed max-w-[52ch] mx-auto">
        Our research is led by experts in cognitive science and brain
        performance. We work with leading UK universities and research labs,
        pioneering new ways for anyone to access elite-level focus.
      </p>
    </div>
  );
}
