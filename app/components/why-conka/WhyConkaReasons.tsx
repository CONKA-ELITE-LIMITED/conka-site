"use client";

import { useState } from "react";
import Image from "next/image";
import { whyConkaReasons } from "@/app/lib/whyConkaData";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

/* ============================================================================
 * WhyConkaReasons — the 7 proof cards.
 *
 * Collapsed: number, outcome-led headline, one line, asset thumbnail, and a
 * compact mono Learn-more affordance. The whole page reads in ~60 seconds
 * collapsed. Expanded: larger asset, headline stat, and the story prose.
 *
 * Same expandable-card grammar as the PDP benefits pillars.
 * ========================================================================== */

export default function WhyConkaReasons() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const total = whyConkaReasons.length;
  const totalPadded = String(total).padStart(2, "0");

  return (
    <div className="grid grid-cols-1 gap-4 max-w-3xl">
      {whyConkaReasons.map((reason) => {
        const isExpanded = expandedId === reason.id;
        const number = String(reason.id).padStart(2, "0");
        const panelId = `why-conka-reason-${reason.id}`;

        return (
          <article
            key={reason.id}
            className="bg-white border border-black/12"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedId(isExpanded ? null : reason.id)
              }
              aria-expanded={isExpanded}
              aria-controls={panelId}
              className="w-full text-left px-5 py-5 lg:px-6 lg:py-6 flex gap-4 lg:gap-5 transition-colors hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]/40 focus-visible:ring-offset-2"
            >
              {/* Asset thumbnail — collapsed state */}
              {!isExpanded && (
                <span className="relative w-20 h-20 lg:w-24 lg:h-24 shrink-0 border border-black/8 overflow-hidden bg-white block">
                  <Image
                    src={reason.asset}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="96px"
                    className={
                      reason.assetFit === "contain"
                        ? "object-contain p-1"
                        : "object-cover"
                    }
                  />
                </span>
              )}

              <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums">
                  {number} / {totalPadded}
                </span>
                <h2
                  className="text-xl lg:text-2xl font-semibold text-black leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {reason.headline}
                </h2>
                <span className="text-sm lg:text-base text-black/70 leading-snug">
                  {reason.oneLine}
                </span>

                <span className="inline-flex items-center gap-1.5 mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
                  <span className="tabular-nums">
                    {isExpanded ? "[−]" : "[+]"}
                  </span>
                  <span>{isExpanded ? "Show less" : "Learn more"}</span>
                </span>
              </span>
            </button>

            {/* Expanded: asset large → stat → story */}
            {isExpanded && (
              <div
                id={panelId}
                className="px-5 pb-6 lg:px-6 lg:pb-7 border-t border-black/8"
              >
                <div className="relative aspect-[4/3] overflow-hidden border border-black/8 bg-white mt-5">
                  <Image
                    src={reason.asset}
                    alt={reason.assetAlt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className={
                      reason.assetFit === "contain"
                        ? "object-contain p-4"
                        : "object-cover"
                    }
                  />
                </div>

                {reason.stat && (
                  <div className="mt-5 flex items-baseline gap-4">
                    <p className="font-mono text-4xl lg:text-5xl font-bold tabular-nums text-[#1B2757] leading-none shrink-0">
                      {reason.stat.value}
                    </p>
                    <p className="text-sm text-black/65 leading-snug max-w-[36ch]">
                      {reason.stat.caption}
                    </p>
                  </div>
                )}

                <p className="mt-4 text-sm lg:text-base leading-relaxed text-black/75">
                  {reason.story}
                </p>

                {reason.showAppButtons && (
                  <div className="mt-5">
                    <AppInstallButtons variant="clinical" iconSize={16} />
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
