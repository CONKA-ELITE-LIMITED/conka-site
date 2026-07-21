"use client";

interface DotIndicatorProps {
  /** Total number of dots */
  total: number;
  /** Current active index (0-based) */
  currentIndex: number;
  /** Callback when a dot is clicked */
  onDotClick: (index: number) => void;
  /** Optional aria-label for the tablist */
  ariaLabel?: string;
  /** Optional function to generate aria-label for each dot */
  getDotAriaLabel?: (index: number) => string;
  /** Optional className for the container */
  className?: string;
}

/**
 * Dot pagination for horizontal carousels and rails. The active dot expands to
 * a navy pill; inactive dots are muted and grow on hover. Shared by the CRO
 * testimonials rail and the PDP ingredients rail so the pattern stays in step.
 *
 * @example
 * <DotIndicator
 *   total={reviews.length}
 *   currentIndex={activeIndex}
 *   onDotClick={goToIndex}
 *   ariaLabel="Review navigation"
 *   getDotAriaLabel={(i) => `Go to review ${i + 1}`}
 * />
 */
export default function DotIndicator({
  total,
  currentIndex,
  onDotClick,
  ariaLabel,
  getDotAriaLabel,
  className = "",
}: DotIndicatorProps) {
  return (
    <div
      className={`flex flex-wrap justify-center gap-2 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === currentIndex}
          aria-label={
            getDotAriaLabel ? getDotAriaLabel(i) : `Go to item ${i + 1}`
          }
          onClick={() => onDotClick(i)}
          className="flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757]"
        >
          <span
            className={`block rounded-full transition-all ${
              i === currentIndex
                ? "h-2 w-5 bg-[#1B2757]"
                : "h-2 w-2 bg-black/15 hover:bg-black/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
