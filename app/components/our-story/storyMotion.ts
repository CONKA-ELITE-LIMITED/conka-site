"use client";

import { gsap } from "@/app/lib/motion";

/* ============================================================================
 * storyMotion — count-up for formatted stat strings ("£500K+", "150,000+",
 * "+16%"). The shared countUp helper in app/lib/motion.ts only supports a
 * numeric suffix; story stats carry prefixes and thousand grouping, so the
 * string is parsed and reassembled on every tick. Server HTML renders the
 * final string, so reduced-motion and no-JS users always see the real value.
 * Promote into motion.ts only if a second page needs it (see MOTION_GUIDE).
 * ========================================================================== */

interface ParsedStat {
  prefix: string;
  target: number;
  suffix: string;
  grouped: boolean;
  decimals: number;
}

function parseStatValue(raw: string): ParsedStat | null {
  const match = raw.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const numeric = match[2].replace(/,/g, "");
  const target = Number(numeric);
  if (!Number.isFinite(target)) return null;
  return {
    prefix: match[1],
    target,
    suffix: match[3],
    grouped: match[2].includes(","),
    decimals: numeric.split(".")[1]?.length ?? 0,
  };
}

/** Count a stat element from 0 to its parsed value when it enters view.
 *  Call inside withMotion(); no-ops for non-numeric or zero values. */
export function countUpStat(
  el: HTMLElement,
  raw: string,
  { duration = 1.6, start = "top 85%" } = {},
): void {
  const parsed = parseStatValue(raw);
  if (!parsed || parsed.target === 0) return;
  const counter = { value: 0 };
  gsap.to(counter, {
    value: parsed.target,
    duration,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start },
    onUpdate: () => {
      const body = parsed.grouped
        ? Math.round(counter.value).toLocaleString("en-GB")
        : counter.value.toFixed(parsed.decimals);
      el.textContent = `${parsed.prefix}${body}${parsed.suffix}`;
    },
  });
}
