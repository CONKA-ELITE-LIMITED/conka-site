"use client";

/**
 * /app-insights motion language. Page-local on purpose: MOTION_GUIDE.md says
 * bespoke patterns stay with the page until a second page needs them.
 *
 * The concept: everything on this page is measured against a baseline, so
 * the motion enacts the per-user delta method itself. Calibration rules draw
 * in, readings resolve from zero to their measured value, charts grow from
 * their zero line. One easing system, used everywhere.
 */
import { gsap } from "@/app/lib/motion";

/** Hero load sequence. */
export const HERO_EASE = "expo.out";
export const HERO_DURATION = 1.2;

/** Standard scroll entrances (matches revealUp defaults). */
export const ENTER_EASE = "power3.out";
export const ENTER_DURATION = 0.8;

/** Micro-interactions: filter switches, hovers. */
export const MICRO_EASE = "power2.inOut";
export const MICRO_DURATION = 0.3;

type ParsedReading = {
  /** Explicit sign character to preserve ("+" renders, "-" comes from the number). */
  plus: string;
  target: number;
  decimals: number;
  suffix: string;
  grouped: boolean;
};

/**
 * Parse a display value like "+0.47", "-1.8 pts", "7,593", "53%", "15+"
 * into a countable target plus formatting recipe. Returns null for
 * non-numeric readings (e.g. "510(k)") so callers can leave them static.
 */
export function parseReading(raw: string): ParsedReading | null {
  const m = raw.trim().match(/^([+-]?)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, sign, num, suffix] = m;
  const target = parseFloat(num.replace(/,/g, "")) * (sign === "-" ? -1 : 1);
  if (Number.isNaN(target)) return null;
  return {
    plus: sign === "+" ? "+" : "",
    target,
    decimals: num.includes(".") ? num.split(".")[1].length : 0,
    suffix,
    grouped: num.includes(","),
  };
}

/**
 * Resolve a reading: count the element's textContent from 0 to its
 * server-rendered value, easing into a settle. The element must already
 * contain the final value (SSR), so reduced-motion and no-JS users see the
 * real number. Call inside withMotion().
 *
 * By default the tween is armed by its own ScrollTrigger; pass
 * `immediate: true` to run it as part of a load timeline instead.
 */
export function resolveReading(
  el: HTMLElement,
  {
    duration = 1.1,
    delay = 0,
    start = "top 88%",
    immediate = false,
  }: {
    duration?: number;
    delay?: number;
    start?: string;
    immediate?: boolean;
  } = {},
): gsap.core.Tween | null {
  const parsed = parseReading(el.textContent ?? "");
  if (!parsed) return null;
  const { plus, target, decimals, suffix, grouped } = parsed;
  const counter = { value: 0 };
  const format = (v: number) =>
    `${v > 0 ? plus : ""}${
      grouped ? Math.round(v).toLocaleString("en-GB") : v.toFixed(decimals)
    }${suffix}`;
  return gsap.to(counter, {
    value: target,
    duration,
    delay,
    ease: "power2.out",
    ...(immediate ? {} : { scrollTrigger: { trigger: el, start } }),
    onUpdate: () => {
      el.textContent = format(counter.value);
    },
  });
}

/**
 * Draw a calibration rule: a hairline that scales in from the left when it
 * enters view. The page's recurring baseline motif. SSR shows the rule at
 * full width; the from-tween hides it only when motion is allowed.
 */
export function drawRule(
  el: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  { duration = 1.1, delay = 0 }: { duration?: number; delay?: number } = {},
): gsap.core.Tween {
  return gsap.from(el, {
    scaleX: 0,
    transformOrigin: "left center",
    duration,
    delay,
    ease: "expo.inOut",
    scrollTrigger: { trigger, start: "top 80%" },
  });
}
