"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { OfferReview } from "@/app/lib/landings/offer-types";

/**
 * A single short review that cross-fades to the next every few seconds
 * (usecloud.co's hero pattern), built to cost nothing on performance:
 * - one interval, and only an opacity class changes, so the fade runs on the
 *   compositor with no layout work
 * - every review sits in the same grid cell, so the box takes the tallest
 *   review's height from first paint and never jumps
 * - the server renders the first review visible; the rest fade in once hydrated
 * - no rotation at all under prefers-reduced-motion
 *
 * Hidden reviews are aria-hidden so a screen reader reads only the visible one.
 */

const INTERVAL_MS = 6000;

export default function OfferReviewRotator({ reviews }: { reviews: OfferReview[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <div className="brand-bg-tint rounded-md p-4 text-black">
      <div className="grid">
        {reviews.map((review, i) => {
          const active = i === index;
          return (
            <figure
              key={review.name}
              aria-hidden={!active}
              className={`[grid-area:1/1] transition-opacity duration-700 ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              <blockquote className="text-[15px] leading-snug">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 flex items-center gap-2 text-sm font-bold">
                <Image
                  src={review.avatar}
                  alt=""
                  width={64}
                  height={64}
                  className="h-7 w-7 rounded-full object-cover"
                  sizes="28px"
                />
                {review.name}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {reviews.length > 1 && (
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {reviews.map((review, i) => (
            <span
              key={review.name}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${
                i === index ? "w-4 bg-[var(--brand-navy)]" : "w-1.5 bg-black/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
