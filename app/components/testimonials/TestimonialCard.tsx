"use client";

import { useState } from "react";
import { getProductAccent } from "@/app/lib/productColors";
import { TestimonialCardProps } from "./types";

/**
 * Star Rating Component
 * Displays 5 stars, filled based on rating value (1-5)
 * Uses amber accent color for filled stars
 */
function StarRating({
  rating,
  isMobile = false,
}: {
  rating: number;
  isMobile?: boolean;
}) {
  const starSize = isMobile ? 12 : 16;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          width={starSize}
          height={starSize}
          viewBox="0 0 24 24"
          fill={star <= rating ? "#f59e0b" : "none"}
          stroke={star <= rating ? "#f59e0b" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={star <= rating ? "" : "opacity-30"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Verified Customer Badge
 * Blue checkmark badge similar to Meta/X verified accounts
 * compact: smaller for product hero cards
 */
function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  const size = compact ? 8 : 12;
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/30 ${
        compact ? "px-1.5 py-0.5" : "px-2 py-0.5"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
      <span
        className={`font-mono text-blue-600 font-medium ${compact ? "text-[9px]" : "text-[10px]"}`}
      >
        Verified Customer
      </span>
    </div>
  );
}

/**
 * Format date string to readable format
 * e.g., "2025-07-29" -> "July 29, 2025"
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Small product badge; uses product accent from productColors (Flow, Clarity, or protocol). */
function ProductBadge({
  productLabel,
  accentHex,
}: {
  productLabel: string;
  accentHex: string;
}) {
  const bgAlpha = "20";
  const borderAlpha = "4d";
  const bg = `${accentHex}${bgAlpha}`;
  const border = `${accentHex}${borderAlpha}`;
  return (
    <span
      className="inline-flex items-center font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border"
      style={{
        backgroundColor: bg,
        color: accentHex,
        borderColor: border,
      }}
    >
      {productLabel}
    </span>
  );
}

/**
 * Reusable testimonial card component
 * Displays name, country, rating, headline, body, and date
 */
const CHAR_LIMIT = 200;

export default function TestimonialCard({
  testimonial,
  showRating = true,
  isMobile = false,
  variant = "default",
  isExpanded: controlledExpanded,
  onToggleExpand,
}: TestimonialCardProps) {
  const {
    name,
    country,
    rating,
    headline,
    body,
    date,
    productLabel,
    productType,
  } = testimonial;
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isProductHero = variant === "productHero";

  // Controlled expand (strip) vs internal (default variant)
  const isControlled = isProductHero && onToggleExpand != null;
  const isExpanded = isControlled
    ? (controlledExpanded ?? false)
    : internalExpanded;
  const setExpanded = isControlled
    ? (onToggleExpand as () => void)
    : () => setInternalExpanded((p) => !p);

  const isLongText = body.length > CHAR_LIMIT;
  const displayText = isExpanded
    ? body
    : isLongText
      ? `${body.slice(0, CHAR_LIMIT)}...`
      : body;

  const cardClassName = isProductHero
    ? "bg-white text-[var(--brand-black)] rounded-xl border border-black/[0.06] shadow-[0_1px_4px_rgba(0,0,0,0.06)] min-h-[300px] flex flex-col p-4 md:p-5"
    : `border-2 ${isMobile ? "p-3" : "p-6"} flex flex-col bg-[var(--background)] text-[var(--brand-black)]`;

  const cardStyle = isProductHero
    ? undefined
    : { borderColor: "rgba(0, 0, 0, 0.7)" };

  const flowAccent = getProductAccent("01")!;
  const clarityAccent = getProductAccent("02")!;
  const singleAccent = productType ? getProductAccent(productType) : undefined;

  const badgeContent =
    singleAccent && productLabel ? (
      <ProductBadge productLabel={productLabel} accentHex={singleAccent} />
    ) : productType === "protocol" ? (
      <>
        <ProductBadge productLabel="CONKA Flow" accentHex={flowAccent} />
        <ProductBadge productLabel="CONKA Clear" accentHex={clarityAccent} />
      </>
    ) : null;

  const badgeBlock = badgeContent && (
    <div
      className={`flex flex-wrap gap-1.5 ${isProductHero ? "mb-2" : isMobile ? "mb-1.5" : "mb-2"}`}
    >
      {badgeContent}
    </div>
  );

  if (isProductHero) {
    return (
      <div className={cardClassName} style={cardStyle}>
        {badgeBlock}
        {/* Review title – large */}
        <h4 className="text-lg md:text-xl font-bold mb-3 leading-snug">
          {headline}
        </h4>

        {/* Body – expandable when long */}
        <div className="flex-grow min-h-0 mb-4">
          <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line">
            {displayText}
          </p>
          {isLongText && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded();
              }}
              className="font-mono text-xs opacity-70 hover:opacity-100 transition-opacity underline mt-1"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>

        {/* Footer: name + location (same line), verified small; stars bottom right */}
        <div className="mt-auto flex justify-between items-end gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">{name}</span>
              {country ? (
                <span className="font-mono text-xs opacity-70">
                  {country}
                </span>
              ) : null}
              <VerifiedBadge compact />
            </div>
            <p className="font-mono text-[10px] opacity-60 mt-0.5">
              {formatDate(date)}
            </p>
          </div>
          {showRating && rating && (
            <div className="flex-shrink-0">
              <StarRating rating={rating} isMobile />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cardClassName} style={cardStyle}>
      {badgeBlock}
      {/* Header: Name, Verified Badge, and Country */}
      <div className={isMobile ? "mb-2" : "mb-3"}>
        <div
          className={`flex items-start justify-between ${isMobile ? "mb-1" : "mb-2"} gap-2`}
        >
          <div className="flex-1 min-w-0">
            <div
              className={`flex items-center gap-1.5 ${isMobile ? "mb-1" : "mb-1.5"}`}
            >
              <h3 className={`font-bold ${isMobile ? "text-sm" : "text-lg"}`}>
                {name}
              </h3>
              {!isMobile && <VerifiedBadge />}
            </div>
            {country ? (
              <span
                className={`font-mono ${isMobile ? "text-[10px]" : "text-xs"} opacity-70`}
              >
                {country}
              </span>
            ) : null}
          </div>
        </div>

        {/* Rating Stars */}
        {showRating && rating && (
          <div className={isMobile ? "mb-2" : "mb-3"}>
            <StarRating rating={rating} isMobile={isMobile} />
          </div>
        )}
      </div>

      {/* Headline */}
      <h4 className={`font-bold ${isMobile ? "text-sm mb-2" : "text-xl mb-3"}`}>
        {headline}
      </h4>

      {/* Body Text - With Read More */}
      <div className={`flex-grow min-h-0 ${isMobile ? "mb-2" : "mb-4"}`}>
        <p
          className={`${isMobile ? "text-xs" : "text-sm"} opacity-80 ${isMobile ? "leading-snug" : "leading-relaxed"} ${isMobile ? "mb-1" : "mb-2"} whitespace-pre-line`}
        >
          {displayText}
        </p>
        {isLongText && (
          <button
            type="button"
            onClick={() => setExpanded()}
            className={`font-mono ${isMobile ? "text-[10px]" : "text-xs"} opacity-70 hover:opacity-100 transition-opacity underline`}
          >
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {/* Date */}
      <div className="mt-auto">
        <p
          className={`font-mono ${isMobile ? "text-[10px]" : "text-xs"} opacity-60`}
        >
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}
