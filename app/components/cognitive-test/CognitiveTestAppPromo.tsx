"use client";

import { AppInstallButtons } from "@/app/components/AppInstallButtons";

const BULLETS = [
  "The full validated test",
  "Your score over time",
  "Sleep and exercise alongside it",
];

export default function CognitiveTestAppPromo() {
  return (
    <div className="rounded-lg bg-[#eef0f5] p-5 text-black lg:p-7">
      <h4
        className="mb-2 max-w-[28ch] text-xl font-semibold leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Keep your baseline in the free app.
      </h4>
      <p className="mb-4 max-w-xl text-base leading-relaxed text-black/70">
        This was a 30-second snapshot. The full test in the CONKA app tracks
        your score and shows what moves it.
      </p>

      <ul className="mb-6 space-y-2">
        {BULLETS.map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-base">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-navy)]"
            />
            {b}
          </li>
        ))}
      </ul>

      <AppInstallButtons
        variant="dtc"
        trackLocation="test_results"
        buttonClassName="min-h-[44px]"
      />
    </div>
  );
}
