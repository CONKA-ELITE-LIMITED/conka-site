"use client";

import type { CognitiveTestScoresProps } from "./types";

export default function CognitiveTestScores({
  result,
  email,
}: CognitiveTestScoresProps) {
  const cells: { label: string; value: string; note: string }[] = [
    { label: "Overall", value: `${result.score}`, note: "Score index" },
    { label: "Accuracy", value: `${result.accuracy}%`, note: "Correct taps" },
    { label: "Speed", value: `${result.speed}%`, note: "Reaction time" },
  ];

  return (
    <div className="bg-white/10 border border-white/12">
      {/* Top spec bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 tabular-nums">
          Fig. 08 · Speed of Processing
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 tabular-nums">
          Results
        </p>
      </div>

      {/* Score grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {cells.map((c, i) => (
          <div
            key={c.label}
            className={`p-5 lg:p-6 ${i < cells.length - 1 ? "border-b lg:border-b-0 lg:border-r border-white/10" : ""}`}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 leading-none">
              {c.label}
            </p>
            <p className="font-mono text-3xl lg:text-4xl font-bold tabular-nums text-white mt-3 leading-none">
              {c.value}
            </p>
            <p className="font-mono text-[9px] text-white/50 mt-3 leading-tight tabular-nums">
              {c.note}
            </p>
          </div>
        ))}
      </div>

      {email && (
        <div className="border-t border-white/10 px-4 py-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 tabular-nums">
            Detailed breakdown sent to {email}
          </p>
        </div>
      )}
    </div>
  );
}
