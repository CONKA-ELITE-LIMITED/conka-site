"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/app/components/testimonials/types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";
import ConkaCTAButton from "../landing/ConkaCTAButton";
import { TrustIconGuarantee, TrustIconShipping } from "../landing/icons";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";

/* ============================================================================
 * CROTestimonials
 *
 * Horizontal carousel of verified customer reviews, styled after the cleaner
 * lander testimonials (CROCustomerReviews): gold stars only, the review as the
 * hero, and the name + date demoted to muted supporting copy at the bottom.
 * Every tile is the same height while collapsed (the scroll row stretches each
 * card to the tallest), and "Read more" expands the longer reviews in place.
 * A three-item trust row closes the section under the CTA.
 * ========================================================================== */

const CHAR_LIMIT = 200;
const STAR_COLOR = "#F59E0B"; // gold, matches the lander review stars

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function GoldStars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill={i < rating ? STAR_COLOR : "rgba(0,0,0,0.12)"}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

/** Padlock — matches the stroke style of the shared trust icons. */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const TRUST_ROW = [
  { Icon: LockIcon, label: "Secure Checkout" },
  { Icon: TrustIconGuarantee, label: "100-Day Guarantee" },
  { Icon: TrustIconShipping, label: "Free Shipping" },
];

function ReviewTile({
  testimonial,
  expanded,
  onToggle,
}: {
  testimonial: Testimonial;
  expanded: boolean;
  onToggle: () => void;
}) {
  const needsTruncation = testimonial.body.length > CHAR_LIMIT;
  const displayBody =
    expanded || !needsTruncation
      ? testimonial.body
      : `${testimonial.body.slice(0, CHAR_LIMIT).trimEnd()}...`;

  return (
    <div className="flex h-full flex-col overflow-hidden border border-black/12 bg-white">
      {testimonial.photo && (
        <div className="relative aspect-[4/3] w-full border-b border-black/12 bg-black/[0.04]">
          <Image
            src={testimonial.photo}
            alt={`${testimonial.name} using CONKA`}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 1024px) 300px, 340px"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Stars (gold, no numeric rating) + product label */}
        <div className="flex items-center justify-between gap-2">
          <GoldStars rating={testimonial.rating} />
          {testimonial.productLabel && (
            <span className="truncate text-[11px] font-semibold text-black/55">
              {testimonial.productLabel}
            </span>
          )}
        </div>

        {testimonial.headline && (
          <p className="text-[15px] font-semibold leading-snug text-black">
            {testimonial.headline}
          </p>
        )}

        <p className="whitespace-pre-line text-[14px] leading-relaxed text-black/80">
          {displayBody}
          {needsTruncation && (
            <button
              type="button"
              onClick={onToggle}
              className="ml-1 text-[13px] font-bold text-[#1B2757] underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* Attribution demoted to the bottom as muted supporting copy */}
        <p className="mt-auto pt-1 text-[12px] text-black/55">
          {testimonial.name} · {formatMonthYear(testimonial.date)}
        </p>
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous reviews" : "Next reviews"}
      onClick={onClick}
      className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] focus-visible:ring-offset-2 ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1B2757"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {direction === "prev" ? (
          <polyline points="15 6 9 12 15 18" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

export default function CROTestimonials({
  testimonials = CURATED_TESTIMONIALS,
  hideCTA = false,
  ctaHref,
}: {
  testimonials?: Testimonial[];
  hideCTA?: boolean;
  ctaHref?: string;
} = {}) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const scrollerRef = useRef<HTMLDivElement>(null);

  const toggle = (i: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const tile = el.querySelector<HTMLElement>("[data-tile]");
    const amount = tile ? tile.offsetWidth + 16 : el.offsetWidth * 0.9;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-8">
        <h2
          className="brand-h2 text-[#0e1f3f]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Real people. Real results.
        </h2>
      </div>

      <div className="relative group">
        <NavButton
          direction="prev"
          onClick={() => scrollByCard(-1)}
          className="left-0 -translate-x-1/2"
        />
        <NavButton
          direction="next"
          onClick={() => scrollByCard(1)}
          className="right-0 translate-x-1/2"
        />

        <div
          ref={scrollerRef}
          role="region"
          aria-label="Customer reviews"
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 pb-2 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              data-tile
              className="w-[300px] shrink-0 snap-start lg:w-[340px]"
            >
              <ReviewTile
                testimonial={t}
                expanded={expanded.has(i)}
                onToggle={() => toggle(i)}
              />
            </div>
          ))}
        </div>
      </div>

      {!hideCTA && (
        <>
          <div className="mt-10 flex justify-start">
            <ConkaCTAButton href={ctaHref} meta={null}>
              Get Both from £{PRICE_PER_SHOT_BOTH}/shot
            </ConkaCTAButton>
          </div>
          <div className="mt-6 grid max-w-md grid-cols-3 gap-2 border-y border-black/10 py-4">
            {TRUST_ROW.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <Icon className="h-5 w-5 text-[#1B2757]" />
                <span className="text-[11px] font-semibold leading-tight text-black/70">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
