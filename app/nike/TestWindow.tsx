"use client";

import { useState } from "react";

/* An 8am-8pm day split into six two-hour windows. The reader taps the one that
 * suits them; it is illustrative (they set the real window in the app), so no
 * state is persisted. Client component for the tap-to-select interaction. */

const WINDOWS = [
  { start: "8am", range: "8 to 10am" },
  { start: "10am", range: "10am to 12pm" },
  { start: "12pm", range: "12 to 2pm" },
  { start: "2pm", range: "2 to 4pm" },
  { start: "4pm", range: "4 to 6pm" },
  { start: "6pm", range: "6 to 8pm" },
];

const BellIcon = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export default function TestWindow() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <div className="mt-5 flex gap-1.5">
        {WINDOWS.map((w, i) => {
          const isSelected = i === selected;
          return (
            <button
              key={w.start}
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={isSelected}
              aria-label={`Test window ${w.range}`}
              className={`flex min-h-[52px] flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border transition-colors ${
                isSelected
                  ? "border-[#6478e0] bg-[#6478e0]/25 text-[#8f9fe8]"
                  : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30"
              }`}
            >
              {isSelected && <BellIcon />}
              <span
                className={`text-[12px] ${isSelected ? "font-semibold text-white" : ""}`}
              >
                {w.start}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[12px] text-white/60">
        <span>8am</span>
        <span className="font-medium text-[#8f9fe8]">
          Your window: {WINDOWS[selected].range}
        </span>
        <span>8pm</span>
      </div>
    </div>
  );
}
