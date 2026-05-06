"use client";

import Image from "next/image";
import Link from "next/link";
import type { ModeSelectionCardProps } from "./types";

export default function ModeSelectionCard({
  heading,
  description,
  ctaText,
  href,
  icon,
  image,
}: ModeSelectionCardProps) {
  return (
    <Link href={href} className="neo-box overflow-hidden flex flex-col h-full block hover:opacity-90 transition-opacity">
      {/* Image – shorter aspect; optional crop via object-position */}
      {image && (
        <div className="relative w-full aspect-[5/3] overflow-hidden">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}

      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Title inline with icon */}
        <div className="flex items-center gap-2 mb-2 md:mb-3 flex-shrink-0">
          {icon}
          <h3 className="text-lg md:text-xl font-bold">{heading}</h3>
        </div>

        {/* Description */}
        <p className="font-mono text-sm opacity-70 mb-3 md:mb-4 flex-1">
          {description}
        </p>

        {/* CTA Button */}
        <div className="neo-button px-6 py-3 font-semibold text-sm inline-flex items-center justify-center gap-2 w-full pointer-events-none">
          {ctaText}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
