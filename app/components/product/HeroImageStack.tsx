"use client";

import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "./ImageLightbox";

interface HeroImageStackProps {
  images: string[];
  alt: string;
}

export default function HeroImageStack({ images, alt }: HeroImageStackProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images.length) return null;

  const openAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Row 1: full-width hero */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="w-full bg-[#F5F5F5] cursor-zoom-in block text-left"
          aria-label={`View ${alt} full size`}
        >
          <Image
            src={images[0]}
            alt={alt}
            width={0}
            height={0}
            sizes="(max-width: 1024px) 100vw, 742px"
            className="w-full h-auto"
            priority
          />
        </button>

        {/* Rows 2–3: 2×2 square grid */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(1, 5).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => openAt(i + 1)}
              className="relative w-full overflow-hidden bg-[#F5F5F5] cursor-zoom-in"
              style={{ aspectRatio: "1 / 1" }}
              aria-label={`View image ${i + 2} full size`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 371px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          alt={alt}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
