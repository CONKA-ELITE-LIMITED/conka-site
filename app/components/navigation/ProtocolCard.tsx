"use client";

import { useState } from "react";
import Image from "next/image";
import { protocolContent } from "@/app/lib/productData";
import { protocolSelectorData } from "@/app/lib/protocolSelectorData";
import { getProtocolImage } from "@/app/lib/productImageConfig";
import type { ProtocolCardProps } from "./types";

export default function ProtocolCard({
  protocolId,
  onClick,
  compactHover = false,
}: ProtocolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const protocol = protocolContent[protocolId];
  const selectorData = protocolSelectorData[protocolId];

  // In compact mode (mega menu) show only 1 benefit to avoid clipping on small desktop
  const visibleBenefits = compactHover
    ? selectorData.benefits.slice(0, 1)
    : selectorData.benefits.slice(0, 3);
  
  // Get image based on config
  const imageSrc = getProtocolImage(protocolId) || protocol.image;

  return (
    <a
      href={`/protocol/${protocolId}`}
      className="group block"
      onClick={onClick}
    >
      <div className="flex flex-col border border-[var(--brand-stroke)] rounded-[var(--brand-radius-card)] overflow-hidden bg-white p-3 h-full">
        {/* Image Container with Hover Overlay */}
        <div
          className="relative aspect-square mb-4 rounded-[var(--brand-radius-container)] overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={imageSrc}
            alt={protocol.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-20"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-[var(--background)] flex flex-col justify-center p-4 transition-all duration-300 ${
              isHovered ? "opacity-95" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Situation / Outcome */}
            <p className={`font-bold leading-snug text-center ${compactHover ? "text-sm mb-0" : "text-base mb-3"}`}>
              For those who {selectorData.forPeopleWho}
            </p>

            {/* Key Benefits - hidden in compact mode to avoid clipping */}
            {!compactHover && (
            <ul className="space-y-1.5 mb-4">
              {visibleBenefits.map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 font-mono text-sm"
                >
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
                    className="flex-shrink-0 mt-0.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>

        {/* Content Section (Always Visible) */}
        <div className="flex flex-col flex-1">
          {/* Protocol Name - Small, Above Outcome */}
          <p className="font-primary text-xs uppercase tracking-wide opacity-60 mb-1">
            {protocol.name}
          </p>
          
          {/* Outcome - Always Visible */}
          <h3 className="text-lg font-bold leading-tight mb-3 flex-1">
            {selectorData.outcome}
          </h3>

          {/* CTA */}
          <div className="neo-button px-5 py-2.5 rounded-full font-bold text-sm inline-flex items-center gap-2 w-full justify-center mt-auto">
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
    </a>
  );
}
