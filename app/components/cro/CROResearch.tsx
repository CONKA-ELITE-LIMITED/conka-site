"use client";

import Image from "next/image";

/* ============================================================================
 * CROResearch
 *
 * V2 Section 8 on /start. Academic / institutional proof beat after the
 * athlete + Informed Sport beat of Section 7. Hero card carries the
 * Cambridge cognitive test story (the test that underpins every in-app
 * metric we cite on /start). Supporting credentials row below ties in
 * Durham + Exeter (formulation) and Made in Britain (manufacturing).
 *
 * All copy lifted verbatim from existing site components so no new claims
 * are introduced:
 *  - Cambridge story: HowThisIsPossibleModule.tsx + AppResearchModal.tsx
 *  - Durham/Exeter line: WhyConkaWorksDesktop.tsx
 * ========================================================================== */

const SUPPORTING_CREDENTIALS = [
  {
    src: "/logos/UniversityOfDurham.png",
    alt: "Durham University",
  },
  {
    src: "/logos/UniversityOfExeter.png",
    alt: "Exeter University",
  },
  {
    src: "/logos/MadeInBritain.png",
    alt: "Made in Britain",
  },
];

export default function CROResearch() {
  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Built on Cambridge research.
      </h2>

      <p className="text-[15px] leading-snug text-black/75 mb-8">
        The cognitive test behind every in-app metric on this page comes from
        Cambridge University research. FDA-cleared. Used in NHS Memory
        Clinics.
      </p>

      {/* ===== Cambridge hero card ===== */}
      <div className="border border-black/12 rounded-[var(--brand-radius-container)] overflow-hidden bg-white">
        <div className="relative aspect-[4/3] bg-black/[0.04]">
          <Image
            src="/UniversityOfCambridge.png"
            alt="The University of Cambridge"
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover"
          />
        </div>
        <div className="p-6 sm:p-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#1B2757] mb-3">
            Research Backing
          </p>

          <h3
            className="text-[24px] sm:text-[26px] font-semibold text-black leading-tight mb-4"
            style={{ letterSpacing: "-0.01em" }}
          >
            The Cambridge cognitive test.
          </h3>

          <p className="text-[14.5px] text-black/80 leading-relaxed max-w-[44ch] mx-auto mb-5">
            A five-minute cognitive test built into the CONKA app, derived
            from{" "}
            <strong className="text-black font-semibold">
              Cambridge University research
            </strong>{" "}
            via Cognetivity Neurosciences. The same assessment used in{" "}
            <strong className="text-black font-semibold">
              NHS Memory Clinics
            </strong>
            , and{" "}
            <strong className="text-black font-semibold">FDA-cleared</strong>{" "}
            as a medical device.
          </p>

          <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-[#1B2757]">
            Cambridge-derived &middot; FDA cleared &middot; NHS validated
          </p>
        </div>
      </div>

      {/* ===== Supporting credentials ===== */}
      <div className="mt-6 bg-black/[0.04] rounded-[var(--brand-radius-container)] p-6">
        <p className="text-center text-[13.5px] text-black/75 leading-snug mb-4 max-w-[44ch] mx-auto">
          Formulated in partnership with{" "}
          <strong className="text-black font-semibold">
            Durham and Exeter universities
          </strong>
          . Made in Britain.
        </p>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {SUPPORTING_CREDENTIALS.map((cred) => (
            <div
              key={cred.src}
              className="relative w-[72px] h-[56px] sm:w-[88px] sm:h-[64px]"
            >
              <Image
                src={cred.src}
                alt={cred.alt}
                fill
                sizes="88px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
