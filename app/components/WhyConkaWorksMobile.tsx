"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PillarLogo = { src: string; alt: string };

interface Pillar {
  number: string;
  category: string;
  logo?: string;
  logoAlt?: string;
  logos?: PillarLogo[];
  heading: string;
  body: string;
  tags: string[];
  link?: { href: string; label: string; external: boolean };
}

const PILLARS: Pillar[] = [
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
];

export default function WhyConkaWorksMobile() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      {/* Heading trio */}
      <div className="mb-8">
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
          Third-party tested · University-trialled · GMP
        </p>
      </div>

      {/* Spec strip */}
      <div className="lab-asset-frame bg-white grid grid-cols-3 mb-8">
        <div className="px-3 py-3 border-r border-black/8">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 mb-1 leading-none">
            Substances
          </p>
          <p className="font-mono text-lg font-bold tabular-nums text-black leading-none">
            280+
          </p>
        </div>
        <div className="px-3 py-3 border-r border-black/8">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 mb-1 leading-none">
            Universities
          </p>
          <p className="font-mono text-lg font-bold tabular-nums text-black leading-none">
            2
          </p>
        </div>
        <div className="px-3 py-3">
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40 mb-1 leading-none">
            Batch Verified
          </p>
          <p className="font-mono text-lg font-bold tabular-nums text-black leading-none">
            100%
          </p>
        </div>
      </div>

      {/* Pillar cards */}
      <div className="flex flex-col gap-3">
        {PILLARS.map((p, i) => {
          const isOpen = expanded === i;
          return (
            <div
              key={p.number}
              className="bg-white border border-black/12 overflow-hidden"
            >
              <div className="p-5">
                {/* Number + category */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/8">
                  <span className="font-mono text-[11px] font-bold tabular-nums text-black/40">
                    {p.number}.
                  </span>
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/50">
                    {p.category}
                  </span>
                </div>

                {/* Logo frame */}
                <div className="mb-4 h-24 flex items-center justify-center bg-[var(--brand-tint)] border border-black/8 p-3">
                  {p.logos ? (
                    <div className="flex items-center justify-center gap-4 w-full h-full">
                      {p.logos.map((l) => (
                        <div key={l.src} className="relative h-14 w-28">
                          <Image
                            src={l.src}
                            alt={l.alt}
                            fill
                            loading="lazy"
                            className="object-contain"
                            sizes="112px"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative h-16 w-full">
                      <Image
                        src={p.logo!}
                        alt={p.logoAlt!}
                        fill
                        loading="lazy"
                        className="object-contain"
                        sizes="40vw"
                      />
                    </div>
                  )}
                </div>

                <h3 className="text-base font-semibold text-black leading-snug mb-3">
                  {p.heading}
                </h3>

                {/* Mono tag row */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/60 tabular-nums"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Expanded body */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    maxHeight: isOpen ? "400px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="pt-3 border-t border-black/8 mt-3">
                    <p className="text-sm text-black/70 leading-relaxed mb-3">
                      {p.body}
                    </p>
                    {p.link && (
                      <Link
                        href={p.link.href}
                        target={p.link.external ? "_blank" : undefined}
                        rel={p.link.external ? "noopener noreferrer" : undefined}
                        className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black underline decoration-black/30 underline-offset-4"
                      >
                        {p.link.label} →
                      </Link>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="mt-3 w-full font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black underline decoration-black/30 underline-offset-4 text-left"
                >
                  {isOpen ? "[−] Show less" : "[+] Read more"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
