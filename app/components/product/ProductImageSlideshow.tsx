"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

export interface SlideshowImage {
  src: string;
}

interface ProductImageSlideshowProps {
  images: SlideshowImage[];
  alt: string;
  /** When true, thumbnail strip has no horizontal padding (for full-bleed mobile hero) */
  fullBleedThumbnails?: boolean;
  /** When true, the thumbnail strip is hidden entirely (rely on prev/next nav buttons) */
  hideThumbnails?: boolean;
}

export default function ProductImageSlideshow({
  images,
  alt,
  fullBleedThumbnails = false,
  hideThumbnails = false,
}: ProductImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {/* Main image area */}
      <div className="relative w-full aspect-square">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative w-full h-full overflow-hidden rounded-none shadow-none md:rounded-xl md:shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08),0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] cursor-zoom-in block"
          aria-label={`View ${alt} full size`}
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-300 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={`${alt} - view ${index + 1}`}
                fill
                className="object-cover object-center"
                priority={index === 0}
                sizes="(max-width: 1023px) 100vw, 45vw"
              />
            </div>
          ))}
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full 
                         bg-white/70 hover:bg-white/90 shadow-md
                         transition-all duration-200"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full 
                         bg-white/70 hover:bg-white/90 shadow-md
                         transition-all duration-200"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-700"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images.map((img) => img.src)}
          alt={alt}
          initialIndex={currentIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Horizontal thumbnail strip */}
      {images.length > 1 && !hideThumbnails && (
        <div
          className={`mt-3 min-w-0 flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${!fullBleedThumbnails ? "px-2" : ""}`}
          style={
            fullBleedThumbnails
              ? {
                  paddingLeft: "var(--premium-gutter-mobile-tight)",
                  paddingRight: "var(--premium-gutter-mobile-tight)",
                }
              : undefined
          }
        >
          {images.map((image, index) => (
            <button
              key={image.src}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-14 h-14 md:w-28 md:h-28 snap-center rounded overflow-hidden cursor-pointer
                transition-all duration-200 hover:opacity-90
                ${index === currentIndex ? "ring-2 ring-offset-2 ring-gray-600" : "opacity-70"}`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
            >
              <Image
                src={image.src}
                alt={`${alt} thumbnail ${index + 1}`}
                width={112}
                height={112}
                className="object-cover w-full h-full"
                sizes="(max-width: 768px) 56px, 112px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
