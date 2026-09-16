"use client";

import ConkaCTAButton from "@/app/components/landing/ConkaCTAButton";
import type { CognitiveTestIdleCardProps } from "./types";

export default function CognitiveTestIdleCard({
  onStart,
}: CognitiveTestIdleCardProps) {
  return (
    <div className="flex flex-col items-start rounded-lg bg-[#eef0f5] p-6 text-left text-black lg:p-10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--brand-navy)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        </svg>
      </div>

      <h3
        className="mb-2 text-2xl font-semibold leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        How sharp are you today?
      </h3>
      <p className="mb-7 max-w-xl text-base leading-relaxed text-black/70">
        A 30-second snapshot of how quickly and accurately you take in what you
        see. The full test in the app tracks it over time.
      </p>

      <ConkaCTAButton onClick={onStart}>Start the test</ConkaCTAButton>
    </div>
  );
}
