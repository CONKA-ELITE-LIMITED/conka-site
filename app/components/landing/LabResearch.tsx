import Image from "next/image";
import Link from "next/link";

/* ============================================================================
 * LabResearch
 *
 * Research credibility band for the home page. A full-bleed university
 * photograph under a navy scrim carries the heading and supporting copy, with
 * the partner universities as white tiles on top (modelled on the lander's
 * ResearchPartners). Sharp corners keep it in the clinical grammar of the
 * surrounding page; the band runs full-width edge-to-edge on mobile and
 * desktop (the home section drops its gutter and track for this block) with
 * the inner content capped at 1280px so the copy stays readable.
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
    <div className="relative overflow-hidden border-y border-black/12 bg-[#0e1f3f] px-6 py-10 md:px-10 md:py-14">
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

      {/* Content capped + centred so the band can bleed full-width while the
          copy stays readable on wide monitors. */}
      <div className="relative z-10 mx-auto max-w-[1280px]">
        {/* Header */}
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
              className="flex h-[88px] items-center justify-center bg-white p-2.5"
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

        {/* CTA to the full science page. White-outline pill so it reads on the
            dark band; flips to a white fill on hover like the other CTAs. */}
        <Link
          href="/science"
          className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:border-white hover:bg-white hover:text-[#0e1f3f] motion-safe:hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0e1f3f]"
        >
          See the research
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
