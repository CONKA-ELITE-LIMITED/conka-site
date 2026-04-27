"use client";

import Link from "next/link";
import Image from "next/image";

const PILLARS = [
  {
    number: "01",
    category: "CERTIFICATION",
    logo: "/logos/InformedSportLogo.png",
    logoAlt: "Informed Sport certified",
    heading: "Certified Safe for Elite Sport",
    body:
      "Every batch of CONKA Flow and CONKA Clear is tested by Informed Sport for over 280 banned substances. Trusted by WADA, Olympic committees, and professional sports leagues worldwide.",
    tags: ["Banned Substance Tested", "Heavy Metal Tested", "Batch Verified"],
    link: {
      href: "https://sport.wetestyoutrust.com/supplement-search/brand/conka",
      label: "View Certificate",
      external: true,
    },
  },
  {
    number: "02",
    category: "RESEARCH",
    logos: [
      { src: "/logos/UniversityOfDurham.png", alt: "Durham University" },
      { src: "/logos/UniversityOfExeter.png", alt: "University of Exeter" },
    ],
    heading: "University-Tested, Clinically Dosed",
    body:
      "Formulated in partnership with Durham and Exeter universities. Every ingredient is dosed at clinically effective levels based on peer-reviewed research. Not pixie-dusted — real science, real results.",
    tags: ["Clinical Dosing", "Peer-Reviewed", "University-Backed"],
  },
  {
    number: "03",
    category: "MANUFACTURING",
    logo: "/logos/MadeInBritain.png",
    logoAlt: "Made in Britain",
    heading: "UK Manufactured to GMP Standards",
    body:
      "Made in England to Good Manufacturing Practice (GMP) standards. Every batch is tested for purity, potency, and consistency. No cutting corners, no outsourcing — just rigorous British quality control.",
    tags: ["GMP Certified", "Batch Tested", "Made in England"],
  },
] as const;

export default function WhyConkaWorksDesktop() {
  return (
    <div>
      {/* Heading trio */}
      <div className="mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Credentials · PROOF-01"}
        </p>
        <h2
          className="brand-h1 mb-2 text-black"
          style={{ letterSpacing: "-0.02em" }}
        >
          Certified for Performance.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Third-party tested · University-trialled · GMP-manufactured
        </p>
      </div>

      {/* Spec strip — lab-asset-frame */}
      <div className="lab-asset-frame bg-white grid grid-cols-3 mb-10">
        <div className="px-4 py-4 lg:px-6 lg:py-5 border-r border-black/8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2 leading-none">
            Substances Tested
          </p>
          <p className="font-mono text-xl lg:text-3xl font-bold tabular-nums text-black leading-none">
            280+
          </p>
        </div>
        <div className="px-4 py-4 lg:px-6 lg:py-5 border-r border-black/8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2 leading-none">
            University Partners
          </p>
          <p className="font-mono text-xl lg:text-3xl font-bold tabular-nums text-black leading-none">
            2
          </p>
        </div>
        <div className="px-4 py-4 lg:px-6 lg:py-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 mb-2 leading-none">
            Batch Verified
          </p>
          <p className="font-mono text-xl lg:text-3xl font-bold tabular-nums text-black leading-none">
            100%
          </p>
        </div>
      </div>

      {/* Pillar grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PILLARS.map((p) => (
          <div
            key={p.number}
            className="flex flex-col bg-white border border-black/12 p-5 lg:p-6"
          >
            {/* Number + category */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/8">
              <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                {p.number}.
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                {p.category}
              </span>
            </div>

            {/* Logo frame */}
            <div className="mb-5 h-24 lg:h-28 flex items-center justify-center bg-[var(--brand-tint)] border border-black/8 p-4">
              {"logos" in p ? (
                <div className="flex items-center justify-center gap-5 lg:gap-6 w-full h-full">
                  {p.logos.map((l) => (
                    <div
                      key={l.src}
                      className="relative h-16 lg:h-20 w-36 lg:w-44"
                    >
                      <Image
                        src={l.src}
                        alt={l.alt}
                        fill
                        loading="lazy"
                        className="object-contain"
                        sizes="(max-width: 1024px) 144px, 176px"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative h-20 lg:h-24 w-full">
                  <Image
                    src={p.logo}
                    alt={p.logoAlt}
                    fill
                    loading="lazy"
                    className="object-contain"
                    sizes="(max-width: 1024px) 30vw, 20vw"
                  />
                </div>
              )}
            </div>

            <h3 className="text-lg lg:text-xl font-semibold text-black leading-snug mb-3">
              {p.heading}
            </h3>

            <p className="text-sm text-black/70 leading-relaxed mb-5">
              {p.body}
            </p>

            {/* Mono tag row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5 pb-5 border-b border-black/8">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/60 tabular-nums"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Optional link — mono, underlined */}
            <div className="mt-auto">
              {"link" in p && p.link ? (
                <Link
                  href={p.link.href}
                  target={p.link.external ? "_blank" : undefined}
                  rel={p.link.external ? "noopener noreferrer" : undefined}
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black underline decoration-black/30 underline-offset-4 hover:decoration-black"
                >
                  {p.link.label} →
                </Link>
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/30 tabular-nums">
                  Verified · Internal Records
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
