"use client";

import { useEffect, useState } from "react";

/**
 * The "vicious cycle" diagram: four nodes in a diamond around an
 * accent-filled centre, connected by arc arrows. Nodes appear one at
 * a time, then the active ring (plus a dashed accent arrow to the
 * next node) steps round the loop on a timer. Pure CSS/SVG, no
 * library; static under prefers-reduced-motion.
 */

const NODE_DELAY_MS = 450;
const STEP_MS = 1400;

// Node centres on a 340x340 canvas (radius-122 circle, cardinal points)
const POSITIONS = [
  { left: "50%", top: "14.1%" }, // top (170, 48)
  { left: "85.9%", top: "50%" }, // right (292, 170)
  { left: "50%", top: "85.9%" }, // bottom (170, 292)
  { left: "14.1%", top: "50%" }, // left (48, 170)
];

// Arc segments between consecutive nodes (clockwise, gaps at the nodes)
const ARCS = [
  "M227 62 A122 122 0 0 1 278 113",
  "M278 227 A122 122 0 0 1 227 278",
  "M113 278 A122 122 0 0 1 62 227",
  "M62 113 A122 122 0 0 1 113 62",
];

export default function CycleLoop({
  nodes,
  center,
}: {
  nodes: { label: string }[];
  center: string;
}) {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    const start = nodes.length * NODE_DELAY_MS + 400;
    let interval: ReturnType<typeof setInterval> | undefined;
    const kickoff = setTimeout(() => {
      interval = setInterval(
        () => setActive((a) => (a + 1) % nodes.length),
        STEP_MS,
      );
    }, start);
    return () => {
      clearTimeout(kickoff);
      if (interval) clearInterval(interval);
    };
  }, [nodes.length]);

  const mono = { fontFamily: "var(--font-brand-data)" } as const;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      <svg
        viewBox="0 0 340 340"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          {/* Two markers instead of context-stroke (patchy Safari support) */}
          <marker
            id="go-cycle-arrow"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--go-neutral)" />
          </marker>
          <marker
            id="go-cycle-arrow-active"
            viewBox="0 0 8 8"
            refX="6"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--brand-accent)" />
          </marker>
        </defs>
        {ARCS.map((d, i) => {
          const isActive = !reduced && i === active % ARCS.length;
          return (
            <path
              key={d}
              d={d}
              fill="none"
              stroke={isActive ? "var(--brand-accent)" : "var(--go-neutral)"}
              strokeWidth={isActive ? 2 : 1.5}
              strokeDasharray={isActive ? "5 5" : undefined}
              markerEnd={
                isActive ? "url(#go-cycle-arrow-active)" : "url(#go-cycle-arrow)"
              }
              className={reduced ? undefined : "go-fade-up"}
              style={
                reduced
                  ? undefined
                  : { animationDelay: `${(i + 1) * NODE_DELAY_MS}ms` }
              }
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => {
        const isActive = !reduced && i === active;
        const pos = POSITIONS[i % POSITIONS.length];
        return (
          <div
            key={node.label}
            className={`absolute flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-2 text-center text-xs leading-snug transition-all duration-300 ${
              reduced ? "" : "go-fade-up"
            }`}
            style={{
              ...pos,
              backgroundColor: "var(--go-surface)",
              borderColor: isActive
                ? "var(--brand-accent)"
                : "var(--go-hairline)",
              borderWidth: isActive ? 2 : 1,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.06 : 1})`,
              animationDelay: reduced ? undefined : `${i * NODE_DELAY_MS}ms`,
            }}
          >
            {node.label}
          </div>
        );
      })}

      <div
        className={`absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-3 text-center text-sm font-medium leading-snug text-white ${
          reduced ? "" : "go-fade-up"
        }`}
        style={{
          backgroundColor: "var(--brand-accent)",
          animationDelay: reduced
            ? undefined
            : `${nodes.length * NODE_DELAY_MS}ms`,
          ...mono,
        }}
      >
        {center}
      </div>
    </div>
  );
}
