// TODO(SCRUM-885 follow-up): Orphaned after homepage hero refactor. No active imports.
// Verify zero references across repo + active A/B tests before deleting.
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const HERO_CAROUSEL_AUTO_PLAY_INTERVAL = 8000;
const HERO_CAROUSEL_FADE_DURATION = 600;

export type HeroBannerImage = { src: string; alt: string };

type HeroBannerCarouselProps = {
  images: HeroBannerImage[];
  isDark: boolean;
  variant: "desktop" | "mobile";
};

export default function HeroBannerCarousel({
  images,
  isDark,
  variant,
}: HeroBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const startAutoPlay = useCallback(() => {
    if (count <= 1) return;
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, HERO_CAROUSEL_AUTO_PLAY_INTERVAL);
  }, [count]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isHovered || count <= 1) {
      stopAutoPlay();
      return;
    }
    startAutoPlay();
    return () => stopAutoPlay();
  }, [isHovered, count, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current) return;
      const rect = carouselRef.current.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + count) % count);
        stopAutoPlay();
        setTimeout(() => { if (!isHovered) startAutoPlay(); }, HERO_CAROUSEL_AUTO_PLAY_INTERVAL);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % count);
        stopAutoPlay();
        setTimeout(() => { if (!isHovered) startAutoPlay(); }, HERO_CAROUSEL_AUTO_PLAY_INTERVAL);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered, count, startAutoPlay, stopAutoPlay]);

  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= count) return;
    setCurrentIndex(index);
    stopAutoPlay();
    setTimeout(() => { if (!isHovered) startAutoPlay(); }, HERO_CAROUSEL_AUTO_PLAY_INTERVAL);
  }, [isHovered, count, startAutoPlay, stopAutoPlay]);

  if (count === 0) return null;

  const isDesktop = variant === "desktop";

  return (
    <div
      ref={carouselRef}
      className={`relative w-full ${isDesktop ? "order-none lg:h-full min-h-0" : "order-first min-h-[35vh] md:min-h-[45vh]"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isDesktop && (
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            // Literal colours, not --color-ink / --color-bone: neither token is
            // defined anywhere, and one invalid custom property invalidates the
            // whole `background`, so this scrim was not rendering at all.
            background: isDark
              ? "linear-gradient(to right, rgb(17, 17, 17) 0%, rgba(17, 17, 17, 0.9) 10%, rgba(17, 17, 17, 0.35) 18%, transparent 28%)"
              : "linear-gradient(to right, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0.75) 10%, rgba(255, 255, 255, 0.2) 20%, transparent 30%)",
          }}
        />
      )}
      {!isDesktop && isDark && (
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, var(--color-ink) 0%, rgba(17, 17, 17, 0.6) 25%, transparent 55%)",
          }}
        />
      )}

      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity ${
              index === currentIndex ? "opacity-100 z-[2]" : "opacity-0 z-[1]"
            }`}
            aria-hidden={index !== currentIndex}
            style={{
              transitionDuration: `${HERO_CAROUSEL_FADE_DURATION}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes={isDesktop ? "(max-width: 1023px) 100vw, 66.67vw" : "(max-width: 767px) 100vw, 66.67vw"}
              className={isDesktop ? "object-cover object-right" : "object-cover"}
              style={isDesktop ? undefined : { objectPosition: "center 45%" }}
            />
          </div>
        ))}

        {count > 1 && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[10] flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(8px)",
            }}
            role="tablist"
            aria-label="Hero banner navigation"
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/70 ${
                  index === currentIndex
                    ? "w-2.5 h-2.5 bg-white shadow-sm"
                    : "w-2 h-2 bg-white/50 active:bg-white/70 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1} of ${count}`}
                aria-selected={index === currentIndex}
                role="tab"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
