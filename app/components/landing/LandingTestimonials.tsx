"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Testimonial } from "@/app/components/testimonials/types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";
import ConkaCTAButton from "./ConkaCTAButton";
import LabTrustBadges from "./LabTrustBadges";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";

/* ============================================================================
 * LandingTestimonials
 *
 * Clinical reskin carousel: mono spec header, hairline stars, hanging
 * open-quote, zero-radius cards, chamfered navy carousel controls.
 *
 * Carousel logic: auto-advance, infinite loop via 3x render, touch swipe,
 * dot nav.
 * ========================================================================== */

const CARD_WIDTH_MOBILE = 300;
const CARD_WIDTH_DESKTOP = 340;
const GAP = 16;
const AUTO_ADVANCE_MS = 3500;
const TRANSITION_MS = 600;
const RESUME_DELAY_MS = 5000;
const CHAR_LIMIT = 200;
const SWIPE_THRESHOLD = 50;

/* ------------------------------ Sub-components --------------------------- */

function HairlineStars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-black"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-black" : "text-black/15"}
          style={{ fontSize: "11px", lineHeight: 1 }}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}

function SpecHeader({ testimonial }: { testimonial: Testimonial }) {
  const product = (testimonial.productLabel ?? "—").toUpperCase();
  const rating = testimonial.rating.toFixed(1);

  return (
    <div className="flex flex-col gap-1 pb-3 border-b border-black/8">
      {/* Row 1: verified · date */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex w-3 h-3 items-center justify-center bg-black text-white text-[8px] font-bold leading-none"
          aria-hidden
        >
          ✓
        </span>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black/60 tabular-nums">
          Verified · {testimonial.date}
        </span>
      </div>
      {/* Row 2: rating + product */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold tabular-nums text-black leading-none">
            {rating}/5
          </span>
          <HairlineStars rating={testimonial.rating} />
        </div>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black/50 truncate">
          {product}
        </span>
      </div>
    </div>
  );
}

function TestimonialCard({
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
      : `${testimonial.body.slice(0, CHAR_LIMIT)}...`;

  return (
    <div
      className="flex-shrink-0 self-start bg-white border border-black/12 flex flex-col overflow-hidden"
      style={{ width: cardWidth }}
    >
      <div className="p-5 flex flex-col gap-3">
        <SpecHeader testimonial={testimonial} />

        {/* Name */}
        <p className="text-sm font-semibold text-black">{testimonial.name}</p>

        {/* Headline */}
        {testimonial.headline && (
          <p className="text-sm font-semibold text-black leading-snug">
            {testimonial.headline}
          </p>
        )}

        {/* Body with hanging mono open-quote */}
        <div className="relative pl-5">
          <span
            className="absolute left-0 top-0 font-mono text-2xl font-bold text-black/25 leading-none select-none"
            aria-hidden
          >
            &ldquo;
          </span>
          <p className="text-sm text-black/80 leading-relaxed whitespace-pre-line">
            {displayBody}
            {needsTruncation && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className="ml-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-black underline underline-offset-2"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Lifestyle photo */}
      {testimonial.photo && (
        <div className="relative w-full aspect-[4/3] border-t border-black/12">
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
      aria-label={direction === "prev" ? "Previous review" : "Next review"}
      onClick={onClick}
      className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center bg-[#1B2757] text-white opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-90 lab-clip-tr ${className}`}
    >
      {direction === "prev" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <polyline
            points="15 6 9 12 15 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <polyline
            points="9 6 15 12 9 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
      )}
    </button>
  );
}

/* ------------------------------ Main ------------------------------------- */

export default function LandingTestimonials({
  testimonials = CURATED_TESTIMONIALS,
  hideCTA = false,
  ctaHref = "/funnel",
}: {
  testimonials?: Testimonial[];
  hideCTA?: boolean;
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
    <div>
      {/* Eyebrow */}
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Field observations · PROOF-03"}
      </p>

      {/* Header */}
      <div className="mb-8">
        <h2
          className="brand-h2 mb-2"
          style={{ letterSpacing: "var(--tracking-tight)" }}
        >
          Real people. Real results.
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums">
          N=500+ · Verified reviews
        </p>
      </div>

      {/* Carousel */}
      <div className="relative group">
        <NavButton
          direction="prev"
          onClick={() => navigate(-1)}
          className="left-0 -translate-x-1/2"
        />
        <NavButton
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
                <TestimonialCard
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

      {/* Dots */}
      <div
        className="flex justify-center gap-1.5 mt-5"
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
            className="flex items-center justify-center w-6 h-6"
          >
            <span
              className={`block transition-all ${
                i === realIndex
                  ? "bg-black w-4 h-1.5"
                  : "bg-black/20 hover:bg-black/40 w-1.5 h-1.5"
              }`}
            />
          </button>
        ))}
      </div>

      {/* CTA */}
      {!hideCTA && (
        <>
          <div className="mt-10 flex justify-start">
            <ConkaCTAButton href={ctaHref} meta={null}>
              Get Both from £{PRICE_PER_SHOT_BOTH}/shot
            </ConkaCTAButton>
          </div>
          <div className="mt-6">
            <LabTrustBadges />
          </div>
        </>
      )}
    </div>
  );
}
