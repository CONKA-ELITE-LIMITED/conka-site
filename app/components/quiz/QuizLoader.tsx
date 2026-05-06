"use client";

import { useEffect, useState } from "react";

interface QuizLoaderProps {
  onComplete: () => void;
  duration?: number; // in milliseconds
}

export default function QuizLoader({ onComplete, duration = 2500 }: QuizLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  const stages = [
    "Analyzing your responses...",
    "Calculating protocol matches...",
    "Finding your perfect fit...",
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

  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col items-center justify-center px-6">
      {/* Animated Icon */}
      <div className="relative w-24 h-24 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-current/10" />
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.89} 289`}
            className="transition-all duration-100"
          />
        </svg>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-opacity ${progress >= 100 ? "opacity-100" : "opacity-50"}`}
          >
            {progress >= 100 ? (
              // Checkmark when complete
              <polyline points="20 6 9 17 4 12" />
            ) : (
              // Brain icon while loading
              <>
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Stage Text */}
      <p className="font-bold text-xl md:text-2xl mb-2 text-center">{stages[stage]}</p>
      
      {/* Progress Percentage */}
      <p className="font-mono text-sm opacity-60">{progress}%</p>

      {/* Decorative dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 rounded-full transition-colors ${
              stage >= dot ? "bg-amber-500" : "bg-current/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}



