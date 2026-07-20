"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import type { ProductGridProps } from "./ProductGrid";
import { getProductGridCopy } from "./productGridCopy";

const ALL_CARDS = [
  { productType: "protocol" as const, label: "Both", number: "03" },
  { productType: "flow" as const, label: "Flow", number: "01" },
  { productType: "clear" as const, label: "Clear", number: "02" },
];

export default function ProductGridMobile(props?: ProductGridProps) {
  const { exclude = [] } = props ?? {};
  const visibleCards = ALL_CARDS.filter(
    (c) => !exclude.includes(c.productType),
  );
  const maxIndex = Math.max(0, visibleCards.length - 1);
  const copy = getProductGridCopy({ exclude });

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
      <div className="mb-8 px-4">
        <h2
          className="brand-h1 text-[#0e1f3f]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {copy.title}
        </h2>
      </div>

      {visibleCards.length > 1 && (
        <div className="px-4 mb-4">
          <div
            className="grid border border-black/12"
            style={{
              gridTemplateColumns: `repeat(${visibleCards.length}, minmax(0, 1fr))`,
            }}
            role="tablist"
            aria-label="Product filter"
          >
            {visibleCards.map((card, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={card.productType}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goToCard(idx)}
                  className={`min-h-[44px] px-3 py-2.5 text-left transition-colors ${
                    idx > 0 ? "border-l border-black/12" : ""
                  } ${
                    isActive
                      ? "bg-[#1B2757] text-white"
                      : "bg-white text-black hover:bg-[var(--brand-tint)]"
                  }`}
                >
                  <span
                    className={`block font-mono text-[8px] font-bold tabular-nums mb-1 leading-none ${
                      isActive ? "text-white/60" : "text-black/40"
                    }`}
                  >
                    {card.number}
                  </span>
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] leading-none">
                    {card.label}
                  </span>
                </button>
              );
            })}
          </div>
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
