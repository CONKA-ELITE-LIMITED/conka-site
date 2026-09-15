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
    <div className="brand-bg-tint rounded-md px-3.5 py-3 text-black">
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
              <blockquote className="text-[14px] leading-snug">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-2 flex items-center gap-2 text-[13px] font-bold">
                <Image
                  src={review.avatar}
                  alt=""
                  width={48}
                  height={48}
                  className="h-6 w-6 rounded-full object-cover"
                  sizes="24px"
                />
                {review.name}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
