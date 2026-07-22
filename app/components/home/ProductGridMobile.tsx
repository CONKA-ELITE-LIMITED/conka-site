"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import type { ProductGridProps } from "./ProductGrid";
import ProductGridHeader from "./ProductGridHeader";
import SegmentedToggle from "@/app/components/SegmentedToggle";

const ALL_CARDS = [
  { productType: "protocol" as const, label: "Both" },
  { productType: "flow" as const, label: "Flow" },
  { productType: "clear" as const, label: "Clear" },
];

export default function ProductGridMobile(props?: ProductGridProps) {
  const { exclude = [], hideHeading = false, header } = props ?? {};
  const visibleCards = ALL_CARDS.filter(
    (c) => !exclude.includes(c.productType),
  );
  const maxIndex = Math.max(0, visibleCards.length - 1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammaticallyRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (isScrollingProgrammaticallyRef.current || !carouselRef.current) return;
    const el = carouselRef.current;
    const gapPx = 16;
    const cardWidth = el.offsetWidth * 0.85 + gapPx;
    const index = Math.min(
      maxIndex,
      Math.max(0, Math.round(el.scrollLeft / cardWidth)),
    );
    setCurrentIndex(index);
  }, [maxIndex]);

  const goToCard = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const gapPx = 16;
    const cardWidth = el.offsetWidth * 0.85 + gapPx;
    isScrollingProgrammaticallyRef.current = true;
    setCurrentIndex(index);
    el.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false;
    }, 400);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToCard(Math.max(0, currentIndex - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToCard(Math.min(maxIndex, currentIndex + 1));
      }
    },
    [currentIndex, maxIndex, goToCard],
  );

  useEffect(() => {
    if (carouselRef.current && currentIndex !== 0) {
      const el = carouselRef.current;
      const gapPx = 16;
      const cardWidth = el.offsetWidth * 0.85 + gapPx;
      el.scrollLeft = currentIndex * cardWidth;
    }
  }, [currentIndex]);

  const currentCard = visibleCards[currentIndex] ?? visibleCards[0];

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <>
      {!hideHeading ? <ProductGridHeader {...(header ?? {})} /> : null}

      {visibleCards.length > 1 && (
        <div className="px-4 mb-5 flex justify-center">
          <SegmentedToggle
            ariaLabel="Product filter"
            options={visibleCards.map((card) => ({
              value: card.productType,
              label: card.label,
            }))}
            value={currentCard.productType}
            onChange={(pt) =>
              goToCard(visibleCards.findIndex((c) => c.productType === pt))
            }
          />
        </div>
      )}

      <div
        ref={carouselRef}
        role="region"
        aria-label="Product options"
        className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory py-2 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: "touch" }}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
          key={currentIndex}
        >
          Showing {currentCard?.label}
        </div>

        {visibleCards.map((card) => (
          <div
            key={card.productType}
            className="flex-shrink-0 w-[85vw] max-w-[340px] snap-center"
          >
            <ProductCard
              productType={card.productType}
              imageAspect="wide"
            />
          </div>
        ))}
      </div>
    </>
  );
}
