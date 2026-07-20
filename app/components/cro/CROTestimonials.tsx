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
 * Horizontal carousel of verified customer reviews. Tiles are equal height
 * while collapsed (the scroll row stretches every card to the tallest), and a
 * "Read more" toggle expands the longer reviews in place. Below the CTA a
 * three-item trust row (secure checkout / guarantee / free shipping) closes
 * the section.
 * ========================================================================== */

const TRUNCATE_AT = 200;

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

function HairlineStars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[#C9A24A]" : "text-black/15"}
          style={{ fontSize: "11px", lineHeight: 1 }}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewTile({
  testimonial,
  expanded,
  onToggle,
}: {
  testimonial: Testimonial;
  expanded: boolean;
  onToggle: () => void;
}) {
  const needsTruncation = testimonial.body.length > TRUNCATE_AT;

  return (
    <div className="flex h-full flex-col overflow-hidden border border-black/12 bg-white">
      {testimonial.photo && (
        <div className="relative aspect-[4/3] w-full border-b border-black/12">
          <Image
            src={testimonial.photo}
            alt={`${testimonial.name} with CONKA`}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 1024px) 300px, 340px"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2 border-b border-black/8 pb-2">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Verified · {testimonial.productLabel ?? "CONKA"}
          </span>
          <HairlineStars rating={testimonial.rating} />
        </div>
        <p className="mb-1 text-sm font-semibold text-black">
          {testimonial.name}
        </p>
        <blockquote
          className={`whitespace-pre-line text-sm leading-relaxed text-black/80 ${
            needsTruncation && !expanded ? "line-clamp-4" : ""
          }`}
        >
          {testimonial.body}
        </blockquote>
        {needsTruncation && (
          <button
            type="button"
            onClick={onToggle}
            className="mt-2 self-start font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#1B2757] underline underline-offset-2"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
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
      className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center bg-[#1B2757] text-white opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-90 lab-clip-tr ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <polyline
          points={direction === "prev" ? "15 6 9 12 15 18" : "9 6 15 12 9 18"}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
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
