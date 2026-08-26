"use client";

/**
 * Shared motion layer. Single GSAP entry point plus the deployed animation
 * patterns, so pages animate consistently. Import gsap/ScrollTrigger/useGSAP
 * from here, never from the packages directly, so plugin registration is
 * guaranteed before first use.
 *
 * Rules of the system (full guide: docs/development/MOTION_GUIDE.md):
 * - All motion is gated behind prefers-reduced-motion via withMotion().
 * - Entrances use from-tweens so SSR HTML carries the final, visible state.
 * - Animate transform/opacity/stroke-dash only. At most one pinned section
 *   per page.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Run animation setup only when the user allows motion. Call inside a
 * useGSAP callback; under reduced motion the setup never runs, so initial
 * states (gsap.set) must live inside `setup`, never in JSX styles.
 */
export function withMotion(setup: () => void): gsap.MatchMedia {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, setup);
  return mm;
}

/**
 * Standard entrance: rise + fade, staggered, when `trigger` scrolls into
 * view. The house pattern for revealing copy blocks, cards, and chips.
 */
export function revealUp(
  targets: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  vars: gsap.TweenVars = {},
): gsap.core.Tween {
  const { scrollTrigger, ...rest } = vars;
  return gsap.from(targets, {
    y: 28,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 75%",
      ...(typeof scrollTrigger === "object" ? scrollTrigger : {}),
    },
    ...rest,
  });
}

/**
 * Count an element's textContent from 0 to `target` when it enters view.
 * The element should be server-rendered with the final value so reduced
 * motion and no-JS users see the real number.
 */
export function countUp(
  el: HTMLElement,
  target: number,
  {
    decimals = 0,
    suffix = "",
    duration = 1.4,
    start = "top 85%",
  }: { decimals?: number; suffix?: string; duration?: number; start?: string } = {},
): gsap.core.Tween {
  const counter = { value: 0 };
  return gsap.to(counter, {
    value: target,
    duration,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start },
    onUpdate: () => {
      el.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
    },
  });
}

/**
 * Scroll-scrubbed progress line: scales an element from 0 to 1 along `axis`
 * as `trigger` moves through the viewport. The element must carry its final
 * state in JSX (no inline transform) plus the matching transform-origin
 * class (`origin-top` for y, `origin-left` for x), so reduced-motion and
 * no-JS users see the line fully drawn.
 */
export function drawProgress(
  el: gsap.DOMTarget,
  trigger: gsap.DOMTarget,
  {
    axis = "y",
    start = "top 70%",
    end = "bottom 55%",
    scrub = 0.4,
  }: { axis?: "x" | "y"; start?: string; end?: string; scrub?: boolean | number } = {},
): gsap.core.Tween {
  const from = axis === "y" ? { scaleY: 0 } : { scaleX: 0 };
  const to = axis === "y" ? { scaleY: 1 } : { scaleX: 1 };
  return gsap.fromTo(el, from, {
    ...to,
    ease: "none",
    scrollTrigger: { trigger, start, end, scrub },
  });
}

/**
 * Scroll-scrubbed brighten: each target fades from `dim` to full opacity as
 * it moves through the viewport (its own position drives the scrub). JSX
 * carries full opacity, so reduced-motion and no-JS users see everything lit.
 */
export function scrubBrighten(
  targets: gsap.DOMTarget,
  {
    dim = 0.2,
    start = "top 85%",
    end = "top 55%",
    scrub = true,
  }: { dim?: number; start?: string; end?: string; scrub?: boolean | number } = {},
): gsap.core.Tween[] {
  return gsap.utils.toArray<HTMLElement>(targets).map((el) =>
    gsap.fromTo(
      el,
      { opacity: dim },
      {
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start, end, scrub },
      },
    ),
  );
}

/**
 * Draw stroked SVG paths when `trigger` enters view. Each path must set
 * pathLength={1} in JSX; the dash state is applied here (inside the motion
 * gate) so reduced-motion users see the lines fully drawn.
 */
export function drawLines(
  paths: SVGPathElement[],
  trigger: gsap.DOMTarget,
  { baseDelay = 0.5, step = 0.12, duration = 0.9, start = "top 80%" } = {},
): gsap.core.Tween[] {
  return paths.map((path, i) => {
    gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    return gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      delay: baseDelay + i * step,
      ease: "power2.inOut",
      scrollTrigger: { trigger, start },
    });
  });
}
