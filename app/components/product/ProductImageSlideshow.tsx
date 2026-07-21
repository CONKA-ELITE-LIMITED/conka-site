"use client";

import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

export interface SlideshowImage {
  src: string;
}

type ThumbSize = "responsive" | "sm";

/**
 * Thumbnail rail rendered inside the slideshow. Kept as its own component for
 * readability. Keeps the `mt-3` root class because FunnelHeroAsset hides
 * thumbnails via a `[&_.mt-3]:hidden` selector.
 */
function ProductThumbnailRail({
  images,
  alt,
  currentIndex,
  onSelect,
  leadingVideo,
  size = "responsive",
  fullBleed = false,
}: {
  images: SlideshowImage[];
  alt: string;
  currentIndex: number;
  onSelect: (index: number) => void;
  leadingVideo?: { mp4: string; webm?: string; poster: string };
  size?: ThumbSize;
  fullBleed?: boolean;
}) {
  const videoCount = leadingVideo ? 1 : 0;
  const sizeCls =
    size === "sm" ? "w-14 h-14" : "w-14 h-14 md:w-28 md:h-28";
  const imgSizes =
    size === "responsive" ? "(max-width: 768px) 56px, 112px" : "56px";

  return (
    <div
      className={`mt-3 min-w-0 flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${!fullBleed ? "px-2" : ""}`}
      style={
        fullBleed
          ? { paddingLeft: "0.25rem", paddingRight: "0.25rem" }
          : undefined
      }
    >
      {leadingVideo && (
        <button
          onClick={() => onSelect(0)}
          className={`relative flex-shrink-0 ${sizeCls} snap-center rounded overflow-hidden cursor-pointer
            transition-all duration-200 hover:opacity-90
            ${currentIndex === 0 ? "ring-2 ring-offset-2 ring-gray-600" : "opacity-70"}`}
          aria-label="Play product video"
          aria-current={currentIndex === 0 ? "true" : undefined}
        >
          <Image
            src={leadingVideo.poster}
            alt={`${alt} video`}
            width={112}
            height={112}
            className="object-cover w-full h-full"
            sizes={imgSizes}
          />
          {/* Play glyph marks the slide as video */}
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/50 pl-0.5 text-[10px] text-white">
              ▶
            </span>
          </span>
        </button>
      )}
      {images.map((image, index) => (
        <button
          key={image.src}
          onClick={() => onSelect(index + videoCount)}
          className={`flex-shrink-0 ${sizeCls} snap-center rounded overflow-hidden cursor-pointer
            transition-all duration-200 hover:opacity-90
            ${index + videoCount === currentIndex ? "ring-2 ring-offset-2 ring-gray-600" : "opacity-70"}`}
          aria-label={`Go to image ${index + 1}`}
          aria-current={index + videoCount === currentIndex ? "true" : undefined}
        >
          <Image
            src={image.src}
            alt={`${alt} thumbnail ${index + 1}`}
            width={112}
            height={112}
            className="object-cover w-full h-full"
            sizes={imgSizes}
          />
        </button>
      ))}
    </div>
  );
}

interface ProductImageSlideshowProps {
  images: SlideshowImage[];
  alt: string;
  /** When true, thumbnail strip has no horizontal padding (for full-bleed mobile hero) */
  fullBleedThumbnails?: boolean;
  /** When true, the thumbnail strip is hidden entirely (rely on prev/next nav buttons) */
  hideThumbnails?: boolean;
  /** When true, the prev/next overlay arrows are hidden (rely on thumbnails/swipe) */
  hideArrows?: boolean;
  /** Keep thumbnails at the compact 56px size on all breakpoints */
  smallThumbnails?: boolean;
  /** "contain" letterboxes the full image in the square frame on white
   *  instead of cover-cropping (for wide renders like the Both box) */
  imageFit?: "cover" | "contain";
  /** Optional muted autoplay loop rendered as the first slide; its poster
   *  becomes the first thumbnail (IM8 gallery-video pattern) */
  leadingVideo?: { mp4: string; webm?: string; poster: string };
  /** Drop the rounded card + drop-shadow so the image reads flush and bigger
   *  (Magic Mind style). Used by ProductHeroV2's de-carded centre column. */
  noFrame?: boolean;
}

export default function ProductImageSlideshow({
  images,
  alt,
  fullBleedThumbnails = false,
  hideThumbnails = false,
  hideArrows = false,
  smallThumbnails = false,
  imageFit = "cover",
  leadingVideo,
  noFrame = false,
}: ProductImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Video occupies slide 0 when present; image indices shift up by one
  const videoCount = leadingVideo ? 1 : 0;
  const totalSlides = images.length + videoCount;

  const goToNext = () => setCurrentIndex((currentIndex + 1) % totalSlides);
  const goToPrev = () =>
    setCurrentIndex((currentIndex - 1 + totalSlides) % totalSlides);

  if (totalSlides === 0) return null;

  const isVideoActive = videoCount > 0 && currentIndex === 0;

  return (
    <div className="flex flex-col w-full">
      {/* Main image area */}
      <div className="relative w-full aspect-square">
        <button
          type="button"
          onClick={() => !isVideoActive && setLightboxOpen(true)}
          className={`relative w-full h-full overflow-hidden rounded-none shadow-none block ${noFrame ? "" : "md:rounded-xl md:shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08),0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"} ${isVideoActive ? "cursor-default" : "cursor-zoom-in"} ${imageFit === "contain" ? "bg-white" : ""}`}
          aria-label={isVideoActive ? alt : `View ${alt} full size`}
        >
          {leadingVideo && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isVideoActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={leadingVideo.poster}
                className={`h-full w-full ${imageFit === "contain" ? "object-contain" : "object-cover"} object-center`}
              >
                {leadingVideo.webm && (
                  <source src={leadingVideo.webm} type="video/webm" />
                )}
                <source src={leadingVideo.mp4} type="video/mp4" />
              </video>
            </div>
          )}
          {images.map((image, index) => (
            <div
              key={image.src}
              className={`absolute inset-0 transition-opacity duration-300 ${
                index + videoCount === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={`${alt} - view ${index + 1}`}
                fill
                className={`${imageFit === "contain" ? "object-contain" : "object-cover"} object-center`}
                priority={index === 0 && videoCount === 0}
                sizes="(max-width: 1023px) 100vw, 45vw"
              />
            </div>
          ))}
        </button>

        {/* Navigation arrows */}
        {totalSlides > 1 && !hideArrows && (
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
          initialIndex={Math.max(0, currentIndex - videoCount)}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Horizontal thumbnail strip */}
      {totalSlides > 1 && !hideThumbnails && (
        <ProductThumbnailRail
          images={images}
          alt={alt}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          leadingVideo={leadingVideo}
          size={smallThumbnails ? "sm" : "responsive"}
          fullBleed={fullBleedThumbnails}
        />
      )}
    </div>
  );
}
