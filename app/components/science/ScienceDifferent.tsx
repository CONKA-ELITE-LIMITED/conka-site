"use client";

import Image from "next/image";

interface ScienceDifferentProps {
  isMobile?: boolean;
}

const CARDS = [
  {
    title: "Clinical dosing",
    description:
      'We use the same doses proven effective in clinical trials — not underdosed "proprietary blends" that hide inadequate amounts.',
    descriptionMobile:
      "Same doses proven effective in clinical trials, not underdosed blends.",
    caption: "Dose-for-dose · Trial-matched",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "Bioavailability first",
    description:
      "Black pepper increases curcumin absorption by 2000%. We include synergistic compounds that ensure maximum nutrient delivery.",
    descriptionMobile:
      "Black pepper increases curcumin absorption by 2000%.",
    caption: "Absorption-led · Synergistic",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Full transparency",
    description:
      "Every statistic links to its PubMed source. No exaggerated claims, just real science you can verify yourself.",
    descriptionMobile:
      "Every stat links to its PubMed source. Real science you can verify.",
    caption: "PMID-linked · Verifiable",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function ScienceDifferent({
  isMobile = false,
}: ScienceDifferentProps) {
  return (
    <div>
      <div className="mb-8 lg:mb-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3 tabular-nums">
          {"// Our approach · SCI-01"}
        </p>
        <h2
          className="brand-h2 text-black mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          What makes CONKA different
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          Dose-led · Absorption-led · Verifiable
        </p>
      </div>

      <div className="lg:flex lg:gap-8 lg:items-start">
        {/* Cards */}
        <div className="flex flex-col gap-3 lg:flex-1">
          {CARDS.map((card, idx) => (
            <div
              key={card.title}
              className="bg-white border border-black/12"
            >
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/8">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 tabular-nums">
                  {String(idx + 1).padStart(2, "0")} · Principle
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1B2757] tabular-nums">
                  {card.caption}
                </span>
              </div>

              {/* Body */}
              <div className="grid grid-cols-[auto_1fr] gap-4 p-5 lg:p-6">
                <div
                  className="w-11 h-11 flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: "#1B2757" }}
                >
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold leading-tight text-black mb-1.5">
                    {card.title}
                  </h3>
                  <p className="text-sm text-black/70 leading-relaxed">
                    {isMobile ? card.descriptionMobile : card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lifestyle image — sticky sidebar on desktop */}
        <div className="mt-6 lg:mt-0 lg:w-[380px] lg:flex-shrink-0 lg:sticky lg:top-24">
          <div className="relative aspect-[4/5] lg:aspect-square border border-black/12 bg-white overflow-hidden">
            <Image
              src="/lifestyle/FlowConkaRing.jpg"
              alt="CONKA bottle with cognitive testing app showing a score of 92, alongside headphones and water bottle"
              fill
              sizes={isMobile ? "95vw" : "380px"}
              className="object-cover"
            />
            <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              Fig. 05 · Field test
            </div>
            <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
              ICA Score · 92
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
