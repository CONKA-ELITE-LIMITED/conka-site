import Image from "next/image";

/* ============================================================================
 * LabResearch
 *
 * Research credibility band for the home page. A full-bleed university
 * photograph under a navy scrim carries the heading and supporting copy, with
 * the partner universities as white tiles on top (modelled on the lander's
 * ResearchPartners). Sharp corners keep it in the clinical grammar of the
 * surrounding page; on mobile the band runs full-width (the home section drops
 * its gutter for this block).
 *
 * Replaces WhyConkaWorks ("Certified for Performance") on the home page.
 * ========================================================================== */

const UNIVERSITIES = [
  { src: "/lander/unilogos/UniversityOfCambridge.png", alt: "University of Cambridge" },
  { src: "/lander/unilogos/UniversityOfDurham.png", alt: "Durham University" },
  { src: "/lander/unilogos/UniversityOfExeter.png", alt: "University of Exeter" },
];

export default function LabResearch() {
  return (
    <div className="relative overflow-hidden border-y border-black/12 md:border bg-[#0e1f3f] px-6 py-10 md:px-10 md:py-14">
      {/* Background research photo + navy scrim */}
      <Image
        src="/lander/research-bg.jpg"
        alt=""
        fill
        aria-hidden
        loading="lazy"
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(13,18,32,0.82) 0%, rgba(13,18,32,0.72) 45%, rgba(13,18,32,0.86) 100%)",
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 mb-3">
          {"// Research · PROOF-02"}
        </p>
        <h2 className="brand-h1 mb-4 text-white" style={{ letterSpacing: "-0.02em" }}>
          World-Class Research.
          <br />
          World-Class Results.
        </h2>
        <p className="text-[15px] lg:text-base leading-relaxed text-white max-w-[60ch] mb-8">
          Our research is led by experts in cognitive science and brain
          performance. We work with leading UK universities and research labs,
          pioneering new ways for anyone to access elite-level focus.
        </p>

        {/* University tiles */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[560px]">
          {UNIVERSITIES.map((u) => (
            <div
              key={u.alt}
              className="flex h-[80px] items-center justify-center bg-white px-3 py-4"
            >
              <div className="relative h-full w-full">
                <Image
                  src={u.src}
                  alt={u.alt}
                  fill
                  loading="lazy"
                  className="object-contain"
                  sizes="160px"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
