"use client";

import { useEffect, useRef, useState } from "react";
import type {
  QuestionScreen,
  QuizAnswer,
  SliderBand,
} from "@/app/lib/landings/types";
import QuizButton from "./QuizButton";

function bandScores(
  bands: SliderBand[],
  value: number,
): Record<string, number> {
  for (const band of bands) {
    if (value <= band.upTo) return band.scores;
  }
  return bands[bands.length - 1]?.scores ?? {};
}

/**
 * Standard question screen: single-choice (auto-advances shortly after
 * selection) or slider (advances on Continue). Mount with key=screen.id
 * so state resets between questions; `initial` restores the previous
 * answer on back-navigation.
 */
export default function QuizQuestion({
  screen,
  initial,
  onAnswer,
}: {
  screen: QuestionScreen;
  initial?: QuizAnswer;
  onAnswer: (answer: QuizAnswer) => void;
}) {
  const slider = screen.type === "slider" ? screen.slider : undefined;
  const [selected, setSelected] = useState<number | null>(() => {
    if (!initial || screen.type !== "single") return null;
    const i = screen.options.findIndex((o) => o.label === initial.label);
    return i >= 0 ? i : null;
  });
  const [sliderValue, setSliderValue] = useState<number>(() => {
    if (typeof initial?.value === "number") return initial.value;
    if (slider) return Math.round((slider.min + slider.max) / 2);
    return 0;
  });
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handleSelect = (i: number) => {
    if (screen.type !== "single") return;
    const option = screen.options[i];
    if (!option) return;
    setSelected(i);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      onAnswer({ value: option.label, label: option.label, scores: option.scores });
    }, 240);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-8">
        <div>
          <h2 className="text-[1.75rem] font-medium leading-tight tracking-[-0.01em]">
            {screen.question}
          </h2>
          {screen.subtitle && (
            <p className="mt-2 text-base text-black/60">{screen.subtitle}</p>
          )}
        </div>

        {screen.type === "single" && (
          <div className="flex flex-col gap-3">
            {screen.options.map((option, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => handleSelect(i)}
                  className="flex min-h-[3.5rem] w-full items-center gap-3 border px-5 py-4 text-left text-base transition-colors duration-150"
                  style={{
                    borderColor: isSelected
                      ? "var(--brand-accent)"
                      : "rgba(0,0,0,0.12)",
                    backgroundColor: isSelected
                      ? "var(--brand-tint)"
                      : "transparent",
                  }}
                  aria-pressed={isSelected}
                >
                  {option.icon && <span aria-hidden>{option.icon}</span>}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {screen.type === "slider" && slider && (
          <div className="flex flex-col gap-6">
            <div
              className="text-center text-4xl font-medium tabular-nums"
              style={{ fontFamily: "var(--font-brand-data)" }}
            >
              {slider.unit
                ? slider.unit.replace("{value}", String(sliderValue))
                : sliderValue}
            </div>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step ?? 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "var(--brand-accent)" }}
              aria-label={screen.question}
            />
            <div
              className="flex justify-between text-xs text-black/60"
              style={{ fontFamily: "var(--font-brand-data)" }}
            >
              <span>{slider.minLabel}</span>
              <span>{slider.maxLabel}</span>
            </div>
          </div>
        )}
      </div>

      {screen.type === "slider" && slider && (
        <div className="pb-2 pt-6">
          <QuizButton
            label="Continue"
            onClick={() =>
              onAnswer({
                value: sliderValue,
                label: String(sliderValue),
                scores: bandScores(slider.bands, sliderValue),
              })
            }
          />
        </div>
      )}
    </div>
  );
}
