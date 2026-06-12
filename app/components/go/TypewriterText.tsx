"use client";

import { useEffect, useMemo, useState } from "react";
import { emphasisStyle, parseEmphasis } from "./AnimatedText";

const CHAR_MS = 26;
const LINE_PAUSE_MS = 450;

/**
 * Types lines out character by character, line by line (the Flow
 * commitment-screen treatment). Untyped characters render invisible so
 * the layout never shifts. Supports the shared *accent* / **strong**
 * emphasis markers; reduced motion shows everything immediately.
 */
export default function TypewriterText({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const parsed = useMemo(() => lines.map(parseEmphasis), [lines]);
  const lineLens = useMemo(
    () => parsed.map((segs) => segs.reduce((n, s) => n + s.text.length, 0)),
    [parsed],
  );
  const lineStarts = useMemo(() => {
    const starts: number[] = [];
    let acc = 0;
    for (const len of lineLens) {
      starts.push(acc);
      acc += len;
    }
    return starts;
  }, [lineLens]);
  const total = useMemo(
    () => lineLens.reduce((a, b) => a + b, 0),
    [lineLens],
  );

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(total);
      return;
    }
    if (count >= total) return;
    // Pause longer at line boundaries, like a beat between sentences
    const atLineStart = count > 0 && lineStarts.includes(count);
    const t = setTimeout(
      () => setCount((c) => c + 1),
      atLineStart ? LINE_PAUSE_MS : CHAR_MS,
    );
    return () => clearTimeout(t);
  }, [count, total, lineStarts]);

  const typing = count < total;

  return (
    <div className={className} aria-label={lines.join(" ")}>
      {parsed.map((segs, li) => {
        const visible = Math.min(
          Math.max(count - lineStarts[li], 0),
          lineLens[li],
        );
        const lineActive = typing && visible > 0 && visible < lineLens[li];
        let used = 0;
        let cursorPlaced = false;
        return (
          <p key={li} aria-hidden>
            {segs.map((seg, si) => {
              const take = Math.min(
                seg.text.length,
                Math.max(visible - used, 0),
              );
              used += seg.text.length;
              const shown = seg.text.slice(0, take);
              const hidden = seg.text.slice(take);
              // Cursor sits at the typing position: inside the first
              // segment that still has hidden characters
              const cursorHere =
                lineActive && !cursorPlaced && take < seg.text.length;
              if (cursorHere) cursorPlaced = true;
              return (
                <span
                  key={si}
                  className={seg.kind !== "plain" ? "font-medium" : undefined}
                  style={emphasisStyle(seg.kind)}
                >
                  {shown}
                  {cursorHere && (
                    <span
                      className="-mb-0.5 inline-block h-[1em] w-[2px] bg-current"
                      style={{ animation: "lab-blink 1s steps(1) infinite" }}
                    />
                  )}
                  {hidden && <span className="opacity-0">{hidden}</span>}
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
