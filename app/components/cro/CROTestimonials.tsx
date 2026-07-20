import Image from "next/image";
import type { Testimonial } from "@/app/components/testimonials/types";
import { CURATED_TESTIMONIALS } from "@/app/lib/customerTestimonials";
import ConkaCTAButton from "../landing/ConkaCTAButton";
import LabTrustBadges from "../landing/LabTrustBadges";
import { PRICE_PER_SHOT_BOTH } from "@/app/lib/landingPricing";

/* ============================================================================
 * CROTestimonials
 *
 * A responsive grid of verified customer reviews, modelled on the lander-b
 * Testimonials layout (image-top card + author + quote, one navy accent card).
 * Replaces the earlier single-card carousel so desktop shows a full wall of
 * proof (three across) instead of one review at a time. Static — no carousel
 * JS — so it renders as a server component.
 * ========================================================================== */

/* Six reviews keeps two tidy rows of three on desktop while showing far more
   than the old one-at-a-time carousel. */
const MAX_CARDS = 6;
/* Which card renders as the dark navy accent (lander-b visual rhythm). */
const NAVY_INDEX = 1;

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-[#C9A24A]" : "text-current opacity-25"}
          style={{ fontSize: "12px", lineHeight: 1 }}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewCard({
  testimonial,
  navy,
}: {
  testimonial: Testimonial;
  navy: boolean;
}) {
  return (
    <figure
      className={`m-0 flex flex-col overflow-hidden border ${
        navy
          ? "border-[#1B2757] bg-[#1B2757] text-white"
          : "border-[#1B2757]/25 bg-white text-black"
      }`}
    >
      {testimonial.photo && (
        <div className="relative aspect-square w-full">
          <Image
            src={testimonial.photo}
            alt={`${testimonial.name} with CONKA`}
            fill
            loading="lazy"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm font-semibold ${navy ? "text-white" : "text-black"}`}>
            {testimonial.name}
          </p>
          <Stars rating={testimonial.rating} />
        </div>
        <p
          className={`font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${
            navy ? "text-white/60" : "text-black/50"
          }`}
        >
          Verified · {testimonial.productLabel ?? "CONKA"}
        </p>
        <blockquote
          className={`line-clamp-5 whitespace-pre-line text-sm leading-relaxed ${
            navy ? "text-white/90" : "text-black/80"
          }`}
        >
          &ldquo;{testimonial.body}&rdquo;
        </blockquote>
      </div>
    </figure>
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
  const cards = testimonials.slice(0, MAX_CARDS);

  return (
    <div>
      <div className="mb-8">
        <h2
          className="brand-h2 mb-2 text-[#0e1f3f]"
          style={{ letterSpacing: "-0.02em" }}
        >
          Real people. Real results.
        </h2>

        {/* Star aggregate — proof signal above the wall of reviews */}
        <div className="mt-2 inline-flex items-center gap-2 border border-black/8 bg-white px-3 py-1.5">
          <span
            className="text-black leading-none"
            style={{ fontSize: "11px", letterSpacing: "0.05em" }}
          >
            ★★★★★
          </span>
          <span className="font-mono text-[10px] font-bold tabular-nums text-black">
            4.7 / 5
          </span>
          <span className="text-black/15 text-[10px]" aria-hidden>
            ·
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/50 tabular-nums">
            500+ verified reviews
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((t, i) => (
          <ReviewCard key={t.name} testimonial={t} navy={i === NAVY_INDEX} />
        ))}
      </div>

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
