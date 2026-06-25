"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Testimonial } from "@/app/components/testimonials/types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";
import { FUNNEL_URL } from "@/app/lib/landingConstants";

/* ============================================================================
 * CROCustomerReviews
 *
 * V2 Section 9 on /start. Pure visual reskin of LandingTestimonials.tsx
 * with the same data and the same carousel mechanics. Strips all the V1
 * clinical noise: mono PROOF eyebrows, mono date/rating in a SpecHeader,
 * hairline character stars, hanging mono open-quote, chamfered nav, hard
 * black-pixel dots.
 *
 * Mechanics preserved verbatim from V1: 3x render for infinite loop,
 * auto-advance, pause on hover / touch / expanded card, touch swipe with
 * threshold, dot nav. V1 (`LandingTestimonials.tsx`) is untouched because
 * it still serves /conka-flow, /conka-clarity, /conka-both, and the
 * protocol pages.
 * ========================================================================== */

const CARD_WIDTH_MOBILE = 300;
const CARD_WIDTH_DESKTOP = 340;
const GAP = 16;
const AUTO_ADVANCE_MS = 3500;
const TRANSITION_MS = 600;
const RESUME_DELAY_MS = 5000;
const CHAR_LIMIT = 200;
const SWIPE_THRESHOLD = 50;

const STAR_COLOR = "#F59E0B"; // gold, matches the hero trust micro-row

const TRUST_ITEMS = [
  "Secure Checkout",
  "100-Day Guarantee",
  "Free Shipping",
];

/* ----------------------------- Date helper ------------------------------ */

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/* ----------------------------- Sub-components --------------------------- */

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
          width="14"
          height="14"
          fill={i < rating ? STAR_COLOR : "rgba(0,0,0,0.12)"}
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({
  testimonial,
  cardWidth,
  expanded,
  onToggleExpand,
}: {
  testimonial: Testimonial;
  cardWidth: number;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const needsTruncation = testimonial.body.length > CHAR_LIMIT;
  const displayBody =
    expanded || !needsTruncation
      ? testimonial.body
      : `${testimonial.body.slice(0, CHAR_LIMIT).trimEnd()}...`;

  return (
    <div
      className="flex-shrink-0 self-start bg-white border border-black/12 rounded-[var(--brand-radius-container)] flex flex-col overflow-hidden"
      style={{ width: cardWidth }}
    >
      {testimonial.photo && (
        <div className="relative w-full aspect-[4/3] bg-black/[0.04]">
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

      <div className="p-5 flex flex-col gap-3">
        {/* Rating + product label */}
        <div className="flex items-center justify-between gap-2">
          <GoldStars rating={testimonial.rating} />
          {testimonial.productLabel && (
            <span className="text-[11px] font-semibold text-black/55 truncate">
              {testimonial.productLabel}
            </span>
          )}
        </div>

        {/* Headline */}
        {testimonial.headline && (
          <p className="text-[15px] font-semibold text-black leading-snug">
            {testimonial.headline}
          </p>
        )}

        {/* Body */}
        <p className="text-[14px] text-black/80 leading-relaxed whitespace-pre-line">
          {displayBody}
          {needsTruncation && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="ml-1 text-[13px] font-bold text-[#1B2757] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>

        {/* Attribution */}
        <p className="text-[12px] text-black/55 mt-1">
          {testimonial.name} &middot; {formatMonthYear(testimonial.date)}
        </p>
      </div>
    </div>
  );
}

function ArrowButton({
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
      aria-label={direction === "prev" ? "Previous review" : "Next review"}
      onClick={onClick}
      className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center bg-white hover:bg-white rounded-full shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] focus-visible:ring-offset-2 ${className}`}
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

/* ------------------------------- Main ----------------------------------- */

export default function CROCustomerReviews({
  testimonials = CURATED_TESTIMONIALS,
  ctaHref = FUNNEL_URL,
}: {
  testimonials?: Testimonial[];
  /** Funnel the section's CTA links to. Defaults to the main FUNNEL_URL so
   *  production /start is unaffected; trial pages can override (e.g. funnel-c). */
  ctaHref?: string;
} = {}) {
  const totalCards = testimonials.length;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH_MOBILE);
  const step = cardWidth + GAP;

  useEffect(() => {
    const update = () =>
      setCardWidth(
        window.innerWidth >= 1024 ? CARD_WIDTH_DESKTOP : CARD_WIDTH_MOBILE,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const extended = [...testimonials, ...testimonials, ...testimonials];

  const [pos, setPos] = useState(totalCards);
  const [smooth, setSmooth] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<number>(0);

  const realIndex = ((pos % totalCards) + totalCards) % totalCards;
  const offset = -(pos * step);

  const handleTransitionEnd = useCallback(() => {
    if (pos >= totalCards * 2) {
      setSmooth(false);
      setPos(totalCards + (pos % totalCards));
    } else if (pos < totalCards) {
      setSmooth(false);
      setPos(totalCards + (pos % totalCards));
    }
  }, [pos, totalCards]);

  useEffect(() => {
    if (!smooth) {
      let id: number;
      id = requestAnimationFrame(() => {
        id = requestAnimationFrame(() => setSmooth(true));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [smooth]);

  useEffect(() => {
    if (isPaused || expandedIndex !== null || totalCards <= 1) return;
    const interval = setInterval(() => {
      setSmooth(true);
      setPos((p) => p + 1);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(interval);
  }, [isPaused, expandedIndex, totalCards]);

  const pauseAndScheduleResume = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(
      () => setIsPaused(false),
      RESUME_DELAY_MS,
    );
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const goToSlide = (targetReal: number) => {
    const currentReal = ((pos % totalCards) + totalCards) % totalCards;
    const diff = targetReal - currentReal;
    setSmooth(true);
    setPos((p) => p + diff);
    pauseAndScheduleResume();
  };

  const navigate = (direction: 1 | -1) => {
    setSmooth(true);
    setPos((p) => p + direction);
    pauseAndScheduleResume();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    pauseAndScheduleResume();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      setSmooth(true);
      setPos((p) => p + (delta > 0 ? 1 : -1));
    }
  };

  return (
    <div className="mx-auto max-w-[560px]">
      <h2
        className="text-black font-semibold text-[34px] leading-[1.08] mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        Real people. Real results.
      </h2>

      <p className="text-[15px] leading-snug text-black/75 mb-8">
        A few favourites from our 622+ verified reviews.
      </p>

      {/* Carousel */}
      <div className="relative group">
        <ArrowButton
          direction="prev"
          onClick={() => navigate(-1)}
          className="left-0 -translate-x-1/2"
        />
        <ArrowButton
          direction="next"
          onClick={() => navigate(1)}
          className="right-0 translate-x-1/2"
        />

        <div
          className="overflow-hidden -mx-5 px-5 lg:mx-0 lg:px-0"
          onMouseEnter={pauseAndScheduleResume}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex"
            style={{
              gap: GAP,
              transform: `translate3d(${offset}px, 0, 0)`,
              transition: smooth ? `transform ${TRANSITION_MS}ms ease` : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((t, i) => {
              const realIdx = i % totalCards;
              return (
                <ReviewCard
                  key={`slide-${i}`}
                  testimonial={t}
                  cardWidth={cardWidth}
                  expanded={expandedIndex === realIdx}
                  onToggleExpand={() =>
                    setExpandedIndex((prev) =>
                      prev === realIdx ? null : realIdx,
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div
        className="flex justify-center gap-2 mt-6"
        role="tablist"
        aria-label="Review navigation"
      >
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === realIndex}
            aria-label={`Review ${i + 1}`}
            onClick={() => goToSlide(i)}
            className="flex items-center justify-center w-6 h-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] rounded-full"
          >
            <span
              className={`block rounded-full transition-all ${
                i === realIndex
                  ? "bg-[#1B2757] w-5 h-2"
                  : "bg-black/15 hover:bg-black/30 w-2 h-2"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ===== Trust strip + CTA — closes the section with a low-friction
                 conversion nudge after the social-proof beat. 3-bullet
                 reassurance row adapted from Magic Mind's checkout block. ===== */}
      <div className="mt-10">
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center gap-2 w-full bg-[#1B2757] text-white font-semibold text-lg py-4 px-10 rounded-full transition-opacity hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B2757]"
        >
          Order Now
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-5 mt-4">
          {TRUST_ITEMS.map((label) => (
            <span
              key={label}
              className="inline-flex items-center justify-center gap-2 text-[13px] text-black"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" fill="#10B981" />
                <path
                  d="M8 12.5L10.5 15L16 9.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
