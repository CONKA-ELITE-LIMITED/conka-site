"use client";

import { useEffect, useState } from "react";
import type { CognitiveTestLoaderProps } from "./types";

export default function CognitiveTestLoader({
  onComplete,
  duration = 2500,
}: CognitiveTestLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    "Processing your results",
    "Analyzing your performance",
    "Generating insights",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return next;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  useEffect(() => {
    if (progress < 33) {
      setStage(0);
    } else if (progress < 66) {
      setStage(1);
    } else {
      setStage(2);
    }
  }, [progress]);

  const isComplete = progress >= 100;

  return (
    <div className="flex flex-col items-start rounded-lg bg-[#eef0f5] p-8 text-black lg:p-10">
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
          className={isComplete ? "" : "animate-pulse"}
          aria-hidden
        >
          {isComplete ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
              <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
              <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            </>
          )}
        </svg>
      </div>

      <p
        role="status"
        className="mb-5 text-xl font-semibold"
        style={{ letterSpacing: "-0.02em" }}
      >
        {stages[stage]}
      </p>

      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--brand-navy)] transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
