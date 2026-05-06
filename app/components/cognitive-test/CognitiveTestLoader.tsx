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
    <div className="bg-white/10 border border-white/12 p-10 flex flex-col items-start">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-6 tabular-nums">
        Processing · Cognetivity SDK · {progress.toString().padStart(3, "0")}%
      </p>

      {/* Icon tile */}
      <div className="w-11 h-11 flex items-center justify-center bg-white/10 text-white mb-6 lab-clip-tr">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
          strokeLinejoin="miter"
          className={isComplete ? "" : "animate-pulse"}
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

      {/* Stage text */}
      <p
        className="brand-h4 text-white mb-6"
        style={{ letterSpacing: "-0.02em" }}
      >
        {stages[stage]}.
      </p>

      {/* Progress bar */}
      <div className="h-px w-full bg-white/15 relative overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-white transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage counter */}
      <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] tabular-nums">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            style={{
              color: stage >= dot ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
            }}
          >
            0{dot + 1}
          </span>
        ))}
      </div>
    </div>
  );
}
