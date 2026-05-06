"use client";

import Link from "next/link";
import Image from "next/image";
import { FormulaShowcaseData } from "@/app/components/shop/formulasShowcaseData";
import { getFormulaImage } from "@/app/lib/productImageConfig";

interface FormulaCardCompactProps {
  formula: FormulaShowcaseData;
  onNavigate?: () => void;
}

export default function FormulaCardCompact({
  formula,
  onNavigate,
}: FormulaCardCompactProps) {
  // Get image based on config
  const imageSrc = getFormulaImage(formula.id) || formula.image.src;

  return (
    <Link
      href={formula.href}
      onClick={onNavigate}
      className="group block"
    >
      <div className="flex flex-col border border-[var(--color-premium-stroke)] rounded-[var(--premium-radius-card)] overflow-hidden bg-white p-3 h-full">
        {/* Image Container */}
        <div className="relative aspect-[3/2] mb-4 rounded-[var(--premium-radius-nested)] overflow-hidden">
          <Image
            src={imageSrc}
            alt={formula.image.alt}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-20"
            style={{
              objectPosition: `${formula.image.focalX}% ${formula.image.focalY}%`,
            }}
            sizes="50vw"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[var(--background)] opacity-0 group-hover:opacity-95 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-black">
            <h4 className="font-bold text-lg mb-3 text-center">{formula.subtitle}</h4>
            <p className="text-sm font-mono opacity-90 mb-4 text-center leading-relaxed">
              {formula.description}
            </p>
            <ul className="space-y-2 text-sm font-mono">
              {formula.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1">
          {/* Formula Name - Small, Above Headline */}
          <p className="font-primary text-xs uppercase tracking-wide opacity-60 mb-1">
            {formula.name}
          </p>
          
          {/* Subheadline - Always Visible */}
          <h3 className="text-lg font-bold leading-tight mb-3 flex-1">
            {formula.subheadline}
          </h3>

          {/* CTA Button */}
          <div className="neo-button px-5 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2 w-fit mx-auto mt-auto">
            View product
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
      </div>
    </Link>
  );
}
