import Image from "next/image";

/* ============================================================================
 * LabResearch
 *
 * Clinical-skinned research credibility section for the home page. Same
 * content as /start's CROResearch (Cambridge hero photograph, 2x2 partner
 * grid, description) rebuilt in the clinical grammar: mono eyebrow, sharp
 * corners, left-aligned title, Fig. chip overlay on the photo.
 *
 * Replaces WhyConkaWorks ("Certified for Performance") on the home page.
 * The Informed Sport pillar it carried now lives in the athlete carousel;
 * the Made in Britain / GMP line folds into the description here, so no
 * credibility content is lost in the swap.
 *
 * Note: /public/UniversityOfCambridge.png (hero photograph) and
 * /public/logos/UniversityOfCambridge.png (logo mark) are distinct assets.
 * ========================================================================== */

const RESEARCH_PARTNERS = [
  { src: "/logos/UniversityOfCambridge.png", alt: "University of Cambridge" },
  { src: "/logos/UniversityOfDurham.png", alt: "Durham University" },
  { src: "/logos/UniversityOfExeter.png", alt: "Exeter University" },
  { src: "/logos/MadeInBritain.png", alt: "Made in Britain" },
];

export default function LabResearch() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Research · PROOF-02"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          World-Class Research.
          <br />
          World-Class Results.
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row-reverse lg:gap-10">
        {/* Cambridge photograph — full-bleed on mobile, right column on desktop.
            Fig. chip overlay matches the clinical pattern used by Daily
            Benefits. */}
        <div className="relative overflow-hidden -mx-5 w-[calc(100%+2.5rem)] aspect-[4/3] mb-8 md:mx-0 md:w-full lg:mb-0 lg:flex-[3] lg:aspect-auto lg:min-h-[420px] border-y md:border border-black/12 bg-[#f5f5f5]">
          <Image
            src="/UniversityOfCambridge.png"
            alt="The University of Cambridge"
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 03 · University of Cambridge
          </span>
        </div>

        {/* Content column — partner grid + description */}
        <div className="lg:flex-[2] flex flex-col">
          {/* Partner grid — 2x2, each logo in its own tint cell. Sharp
              corners, hairline borders. Logos scaled up so the marks read
              zoomed-in rather than floating in whitespace. */}
          <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-6 lg:max-w-[400px]">
            {RESEARCH_PARTNERS.map((partner) => (
              <div
                key={partner.src}
                className="relative bg-[var(--brand-tint)] border border-black/8 overflow-hidden aspect-[2/1]"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 45vw, 250px"
                  className="object-contain"
                  style={{ transform: "scale(1.4)" }}
                />
              </div>
            ))}
          </div>

          <p className="text-[15px] lg:text-base leading-relaxed text-black/70 mb-4">
            Our research is led by experts in cognitive science and brain
            performance. We work with leading UK universities and research
            labs, pioneering new ways for anyone to access elite-level focus.
          </p>

          {/* Manufacturing line — carries the Made in Britain / GMP claim
              forward from the section this component replaced. */}
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mt-auto">
            Made in England · GMP standards · Every batch tested
          </p>
        </div>
      </div>
    </div>
  );
}
