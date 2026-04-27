"use client";

import Image from "next/image";

interface HeroImageStackProps {
  images: string[];
  alt: string;
}

export default function HeroImageStack({ images, alt }: HeroImageStackProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Row 1: full-width hero — natural aspect ratio, no crop */}
      <div className="w-full bg-[#F5F5F5]">
        <Image
          src={images[0]}
          alt={alt}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 742px"
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Rows 2–3: 2×2 square grid */}
      <div className="grid grid-cols-2 gap-2">
        {images.slice(1, 5).map((src) => (
          <div
            key={src}
            className="relative w-full overflow-hidden bg-[#F5F5F5]"
            style={{ aspectRatio: "1 / 1" }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 371px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
