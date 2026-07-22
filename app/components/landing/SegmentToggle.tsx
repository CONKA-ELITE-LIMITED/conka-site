"use client";

import { useState } from "react";
import IngredientGrid, { type IngredientGridItem } from "./IngredientGrid";

/* ============================================================================
 * SegmentToggle
 *
 * Bespoke two-segment switcher for the Brain Ageing listicle (men / women):
 * one control swaps a whole content block, headline, body, its ingredient grid
 * (with citations) and an optional testimonial. Two segments only, not a
 * generic N-segment engine. Reuses IngredientGrid for the per-segment cards.
 * ========================================================================== */

export interface SegmentToggleSegment {
  /** Toggle button label, e.g. "For men" */
  label: string;
  headline: string;
  body: string;
  ingredientsEyebrow?: string;
  ingredients: IngredientGridItem[];
  ingredientsFooter?: string;
  testimonial?: { quote: string; name: string; detail?: string };
}

const INK = "#1B2757";

export default function SegmentToggle({
  segments,
}: {
  segments: SegmentToggleSegment[];
}) {
  const [active, setActive] = useState(0);
  const seg = segments[active];

  return (
    <div>
      <div
        role="group"
        aria-label="Choose your version"
        className="mb-6 inline-flex rounded-full border border-black/10 bg-white p-1"
      >
        {segments.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.label}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(i)}
              className="rounded-full px-5 py-2 text-[13px] font-semibold transition-colors"
              style={{
                background: isActive ? INK : "transparent",
                color: isActive ? "#fff" : "rgba(0,0,0,0.6)",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div>
          <h4 className="mb-3 text-[22px] font-semibold leading-tight text-[#1B2757] md:text-[26px]">
            {seg.headline}
          </h4>
          <p className="text-[15px] leading-relaxed text-black/80 md:text-base">
            {seg.body}
          </p>
          {seg.testimonial ? (
            <figure className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
              <blockquote className="text-[14px] leading-relaxed text-black/80">
                {`"${seg.testimonial.quote}"`}
              </blockquote>
              <figcaption className="mt-2 text-[13px] font-semibold text-black">
                {seg.testimonial.name}
                {seg.testimonial.detail ? (
                  <span className="font-normal text-black/50">
                    {" · "}
                    {seg.testimonial.detail}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ) : null}
        </div>

        <IngredientGrid
          eyebrow={seg.ingredientsEyebrow}
          items={seg.ingredients}
          footer={seg.ingredientsFooter}
        />
      </div>
    </div>
  );
}
