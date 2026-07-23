"use client";

import { useState } from "react";
import Image from "next/image";
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
  testimonial?: {
    quote: string;
    name: string;
    detail?: string;
    image?: string;
  };
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
          <p className="text-[15px] font-semibold leading-relaxed text-black md:text-base">
            {seg.body}
          </p>
          {seg.testimonial ? (
            <figure className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
              <div
                aria-hidden
                className="mb-2 text-[15px] tracking-widest"
                style={{ color: "#F59E0B" }}
              >
                ★★★★★
              </div>
              <blockquote className="text-[15px] font-semibold leading-relaxed text-black">
                <span
                  aria-hidden
                  className="mr-0.5 align-[-0.35em] text-[2.5rem] font-bold leading-[0] text-[#1B2757]"
                >
                  &ldquo;
                </span>
                {seg.testimonial.quote}
                <span
                  aria-hidden
                  className="ml-0.5 align-[-0.5em] text-[2.5rem] font-bold leading-[0] text-[#1B2757]"
                >
                  &rdquo;
                </span>
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {seg.testimonial.image ? (
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={seg.testimonial.image}
                      alt={seg.testimonial.name}
                      fill
                      sizes="56px"
                      className="object-cover object-[center_25%]"
                    />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-black">
                    {seg.testimonial.name}
                  </div>
                  {seg.testimonial.detail ? (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#1a7f4f]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1a7f4f]">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {seg.testimonial.detail}
                    </span>
                  ) : null}
                </div>
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
