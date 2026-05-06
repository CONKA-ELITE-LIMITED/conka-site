"use client";

import type { CognitiveTestIdleCardProps } from "./types";

export default function CognitiveTestIdleCard({
  onStart,
}: CognitiveTestIdleCardProps) {
  return (
    <div className="bg-white/[0.04] border border-white/12 p-6 lg:p-10 flex flex-col items-start text-left">
      {/* Brain icon */}
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
        >
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        </svg>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 tabular-nums">
        01 Assessment · Cognetivity SDK · 2-Min Test
      </p>
      <h3
        className="brand-h3 text-white mb-3 max-w-[22ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        Give it a go. See how your brain is performing.
      </h3>
      <p className="text-sm lg:text-base text-white/70 leading-relaxed mb-8 max-w-xl">
        A short version of the full cognitive test in the CONKA app. About 30
        seconds to get a snapshot of your processing speed. The full test
        tracks how you improve over time.
      </p>

      <button
        onClick={onStart}
        className="inline-flex items-center gap-3 bg-white text-black font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-6 py-4 lab-clip-tr transition-opacity hover:opacity-85 active:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2"
      >
        <span>Start short test</span>
        <span aria-hidden>↗</span>
      </button>

      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 tabular-nums mt-6">
        Full test with personalised insights in the CONKA app
      </p>
    </div>
  );
}
