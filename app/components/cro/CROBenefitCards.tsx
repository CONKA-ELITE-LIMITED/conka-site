"use client";

import { useState } from "react";
import Link from "next/link";

/* ============================================================================
 * CROBenefitCards
 *
 * V2 Section 6 on /start. First "proof density" moment after the soft V2
 * storytelling in Sections 1-5. Four big metrics, hybrid sources: two from
 * in-app CONKA data (^^), two from PMID-backed ingredient studies (¶).
 *
 * The four metrics here are the section's load-bearing claims. They are
 * hardcoded so the surface is predictable; the full reports + chart
 * methodology live at /app-insights for visitors who want the deep dive.
 * ========================================================================== */

type Anchor = "^^" | "¶"; // ¶

interface BenefitCard {
  id: string;
  metric: string;
  label: string;
  anchor: Anchor;
  detail: string;
}

const CARDS: BenefitCard[] = [
  {
    id: "evening-focus",
    metric: "+1.09 pts",
    label: "Evening focus held",
    anchor: "^^",
    detail:
      "On days users took CONKA, scores held above their daily average even during the 6 to 9pm dip where others drop nearly a full point. Per-user delta methodology, n=74 evening tests.",
  },
  {
    id: "faster-tired",
    metric: "−41 ms", // −41 ms
    label: "Faster reaction when tired",
    anchor: "^^",
    detail:
      "When users tested on fatigued days, CONKA-tagged tests showed reaction times 41 ms faster than the same users on fatigued days without. Directional signal at n=15, consistent across the sample.",
  },
  {
    id: "memory",
    metric: "+63%",
    label: "Memory",
    anchor: "¶",
    detail:
      "From a 12-week clinical trial on Bacopa monnieri, one of the active compounds in CONKA Clear. Findings as published; not extrapolated to product-level effect.",
  },
  {
    id: "fatigue-resistance",
    metric: "+30%",
    label: "Fatigue resistance",
    anchor: "¶",
    detail:
      "From a 90-day clinical trial on Acetyl-L-Carnitine, an amino acid in CONKA Clear that helps your cells turn fats into the energy your brain runs on.",
  },
];

function BenefitRow({
  card,
  isOpen,
  onToggle,
}: {
  card: BenefitCard;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = `benefit-panel-${card.id}`;
  const buttonId = `benefit-button-${card.id}`;
  return (
    <div className="bg-black/[0.04] rounded-[16px] overflow-hidden">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex items-center w-full p-4 text-left hover:bg-black/[0.02] transition-colors gap-4"
      >
        <div className="flex-shrink-0 min-w-[88px]">
          <p className="text-[26px] font-bold text-[#1B2757] tabular-nums leading-none">
            {card.metric}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-black leading-tight">
            {card.label}
            <span
              className="ml-1 text-[10px] font-normal text-black/40 align-super tabular-nums"
              aria-hidden
            >
              {card.anchor}
            </span>
          </p>
        </div>
        <span
          className="text-[22px] text-black/40 leading-none w-6 flex-shrink-0 text-center"
          aria-hidden
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-[max-height] duration-200 ease-out"
        style={{ maxHeight: isOpen ? "320px" : "0px" }}
      >
        <p className="px-4 pb-4 pt-1 text-[13px] text-black/75 leading-relaxed">
          {card.detail}
        </p>
      </div>
    </div>
  );
}

export default function CROBenefitCards() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Measured, not marketed.
      </h2>

      <p className="text-[15px] leading-snug text-black/70 mb-8">
        Two sources behind every number: real CONKA app data, plus
        peer-reviewed studies on the active ingredients.
      </p>

      <div className="space-y-2 mb-6">
        {CARDS.map((card) => (
          <BenefitRow
            key={card.id}
            card={card}
            isOpen={openId === card.id}
            onToggle={() =>
              setOpenId(openId === card.id ? null : card.id)
            }
          />
        ))}
      </div>

      <div className="border-t border-black/8 pt-4 space-y-2">
        <p className="text-[11px] text-black/50 leading-snug">
          <span className="font-semibold text-black/65">^^</span> From in-app
          cognitive tests across 712 CONKA users, 7,593 tests, 30 months.
          Per-user delta methodology. Full breakdown at{" "}
          <Link
            href="/app-insights"
            className="underline underline-offset-2 hover:text-[#1B2757] transition-colors"
          >
            /app-insights
          </Link>
          .
        </p>
        <p className="text-[11px] text-black/50 leading-snug">
          <span className="font-semibold text-black/65">&para;</span>{" "}
          Peer-reviewed studies on individual active ingredients. Findings as
          published, not extrapolated to product-level effect.
        </p>
      </div>
    </div>
  );
}
