"use client";

import { useState } from "react";
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
      "Formulated in partnership with Durham and Exeter universities. Every ingredient is dosed at clinically effective levels based on peer-reviewed research.",
    tags: ["Clinical Dosing", "Peer-Reviewed", "University-Backed"],
  },
  {
    number: "03",
    category: "MANUFACTURING",
    logo: "/logos/MadeInBritain.png",
    logoAlt: "Made in Britain",
    heading: "UK Manufactured to GMP Standards",
    body:
      "Made in England to Good Manufacturing Practice (GMP) standards. Every batch is tested for purity, potency, and consistency.",
    tags: ["GMP Certified", "Batch Tested", "Made in England"],
  },
] as const;

export default function WhyConkaWorksDesktop() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div>
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

      <div className="grid grid-cols-3 gap-4">
        {PILLARS.map((p, i) => {
          const isOpen = expandedIdx === i;
          return (
            <div
              key={p.number}
              className="flex flex-col bg-white border border-black/12 p-5 lg:p-6"
            >
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/8">
                <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                  {p.number}.
                </span>
                <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                  {p.category}
                </span>
              </div>

              <div className="mb-5 h-20 flex items-center justify-center bg-[var(--brand-tint)] border border-black/8 p-4">
                {"logos" in p ? (
                  <div className="flex items-center justify-center gap-5 w-full h-full">
                    {p.logos.map((l) => (
                      <div key={l.src} className="relative h-12 w-32">
                        <Image
                          src={l.src}
                          alt={l.alt}
                          fill
                          loading="lazy"
                          className="object-contain scale-125"
                          sizes="128px"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative h-14 w-full">
                    <Image
                      src={p.logo}
                      alt={p.logoAlt}
                      fill
                      loading="lazy"
                      className="object-contain"
                      sizes="20vw"
                    />
                  </div>
                )}
              </div>

              <h3 className="text-base lg:text-lg font-semibold text-black leading-snug mb-3">
                {p.heading}
              </h3>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/60 tabular-nums"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setExpandedIdx(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="mt-auto inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50 hover:text-black text-left cursor-pointer"
              >
                <span className="tabular-nums">{isOpen ? "[−]" : "[+]"}</span>
                <span>{isOpen ? "Less" : "Details"}</span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-out"
                style={{ maxHeight: isOpen ? "300px" : "0px", opacity: isOpen ? 1 : 0 }}
              >
                <div className="pt-4 border-t border-black/8 mt-4">
                  <p className="text-sm text-black/70 leading-relaxed mb-3">
                    {p.body}
                  </p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
