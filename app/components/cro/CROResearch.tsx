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

// Note: /public/UniversityOfCambridge.png (hero photograph) and
// /public/logos/UniversityOfCambridge.png (logo mark) are distinct assets.
const RESEARCH_PARTNERS = [
  { src: "/logos/UniversityOfCambridge.png", alt: "University of Cambridge" },
  { src: "/logos/UniversityOfDurham.png", alt: "Durham University" },
  { src: "/logos/UniversityOfExeter.png", alt: "Exeter University" },
  { src: "/logos/MadeInBritain.png", alt: "Made in Britain" },
];

export default function CROResearch() {
  return (
    <div className="mx-auto max-w-[560px]">
      {/* ===== Hero Cambridge image (full-bleed on mobile, contained on md+) ===== */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.04] mb-8 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full md:rounded-[var(--brand-radius-container)]">
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

      {/* ===== Partner logos — 4 equal-sized grey rectangles in a 2x2 grid =====
           Each cell is its own soft grey card with the logo centred inside,
           rather than one large grey container holding all four. Grid is
           capped to `max-w-[420px]` so the tiles stay compact on desktop;
           internal padding is light so each logo reads as zoomed-in within
           its cell rather than floating in margin. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 mx-auto max-w-[420px]">
        {RESEARCH_PARTNERS.map((partner) => (
          <div
            key={partner.src}
            className="bg-black/[0.04] rounded-[12px] overflow-hidden flex items-center justify-center aspect-[2/1]"
          >
            <div className="relative w-full h-full">
              <Image
                src={partner.src}
                alt={partner.alt}
                fill
                sizes="(max-width: 768px) 38vw, 200px"
                className="object-contain"
                style={{ transform: "scale(1.5)" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== Description ===== */}
      <p className="text-[15px] text-black/75 leading-relaxed">
        Our research is led by experts in cognitive science and brain
        performance. We work with leading UK universities and research labs,
        pioneering new ways for anyone to access elite-level focus.
      </p>
    </div>
  );
}
