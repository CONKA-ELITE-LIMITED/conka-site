"use client";

import type { CognitiveTestScoresProps } from "./types";

export default function CognitiveTestScores({
  result,
  email,
}: CognitiveTestScoresProps) {
  const cells: { label: string; value: string }[] = [
    { label: "Overall", value: `${result.score}` },
    { label: "Accuracy", value: `${result.accuracy}%` },
    { label: "Speed", value: `${result.speed}%` },
  ];

  return (
    <div className="rounded-lg bg-[#eef0f5] p-5 text-black lg:p-7">
      <h3
        className="mb-4 text-xl font-semibold leading-tight lg:text-2xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        Your baseline
      </h3>

      <dl className="grid grid-cols-3 gap-2 lg:gap-3">
        {cells.map((c) => (
          // dt must precede dd in the markup; column-reverse puts the number
          // on top visually.
          <div
            key={c.label}
            className="flex flex-col-reverse items-center rounded-md bg-white px-2 py-4 text-center"
          >
            <dt className="mt-2 text-sm text-black/70">{c.label}</dt>
            <dd className="text-3xl font-bold leading-none tabular-nums text-[var(--brand-navy)] lg:text-4xl">
              {c.value}
            </dd>
          </div>
        ))}
      </dl>

      {email && (
        <p className="mt-4 text-sm text-black/65">
          Your results are on their way to {email}.
        </p>
      )}
    </div>
  );
}
