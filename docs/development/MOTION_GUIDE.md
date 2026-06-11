# Motion Guide — GSAP on the CONKA site

How we animate. The shared layer lives in `app/lib/motion.ts`; this doc is the contract for using it. The goal is a consistent, premium motion feel across pages without re-inventing patterns per page. Everything documented here is deployed on `/app`; treat that page as the living reference.

**Scope discipline:** this guide grows only when a pattern actually ships. Do not add speculative helpers.

---

## The rules (non-negotiable)

1. **Gate all motion behind reduced-motion.** Every animation setup runs inside `withMotion(() => { ... })`. Under `prefers-reduced-motion: reduce` the setup never runs and the page must look complete and final.
2. **SSR carries the final state.** Use `gsap.from()` (never `gsap.to()` toward visibility) so server HTML is fully visible without JS. Initial hidden/dash states are applied by GSAP inside the motion gate, never via JSX styles.
3. **Animate cheap properties only:** transform, opacity, stroke-dash, clip-path. Never width/height/top/left/margin.
4. **At most one pinned section per page.** Pinning is the most device-sensitive and scroll-fatiguing pattern. Everything else is entrance-triggered.
5. **Import from `@/app/lib/motion`,** never from `gsap` or `@gsap/react` directly. The module registers plugins exactly once and SSR-safely.
6. **Mobile gets a designed fallback,** not a broken desktop layout. Pinned/scrubbed sections need a stacked variant (split via `useIsMobile(1024)`); decorative geometry (connector fans) hides below `lg`.

## Standard setup in a component

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP, withMotion, revealUp } from "@/app/lib/motion";

export default function MySection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      withMotion(() => {
        revealUp("[data-my-reveal]", root.current);
      });
    },
    { scope: root }, // scopes selector strings to this component + auto-cleanup
  );

  return <div ref={root}>...</div>;
}
```

Mark animated elements with `data-*` attributes (one per group, e.g. `data-engine-a1`), not classes. The `scope` option means selectors never leak into other components.

## Helpers in `app/lib/motion.ts`

| Helper | What it does | Reference usage |
|--------|--------------|-----------------|
| `withMotion(setup)` | Runs setup only when motion is allowed (`MOTION_OK` matchMedia) | Every appv2 component |
| `revealUp(targets, trigger, vars?)` | House entrance: rise 28px + fade, stagger 0.12, at `top 75%` | `AppV2Proof`, `AppV2Engine`, `AppV2BeyondTest` |
| `countUp(el, target, {decimals, suffix})` | Counts `textContent` 0 → target on entry. Server-render the final value as the element's text | `AppV2Proof` research stats |
| `drawLines(paths, trigger, opts?)` | Draws stroked SVG paths (each needs `pathLength={1}` in JSX) with staggered delay | `AppV2Engine` act 1 connector fan |

Override defaults via the `vars` argument (`y`, `stagger`, `duration`, nested `scrollTrigger.start`). If you override the same values everywhere, change the default in the helper instead.

There is also `usePrefersReducedMotion()` (`app/hooks/usePrefersReducedMotion.ts`) for components that need to *render different JSX* under reduced motion (e.g. the journey renders its stacked layout instead of the pinned one).

## Bespoke patterns (copy from the reference, don't abstract yet)

These shipped once; promote them into `motion.ts` only when a second page needs them.

| Pattern | What it looks like | Reference |
|---------|-------------------|-----------|
| Masked line reveal | H1 lines slide up from behind `overflow-hidden` wrappers (`yPercent: 110`) | `AppV2Hero` |
| Clip-path image reveal | Image wipes in from an edge via `clipPath: inset(...)`; element carries `style={{ clipPath: "inset(0% 0% 0% 0%)" }}` so `from()` can interpolate | `AppV2Hero` card, `AppV2Origin` photo |
| Scroll-scrubbed word brighten | Headline words go 0.2 → 1 opacity, scrubbed between `top 80%` and `top 30%` | `AppV2Origin` |
| Score ring draw + count | SVG circle stroke-dash draw synced with a number count-up in one timeline | `AppV2Hero` HUD chip |
| Pinned scrub journey | `ScrollTrigger.create({ pin: true, end: "+=N%" })`, progress drives an active index via React state (guard with a ref, only setState on change) + a scaleX progress bar set directly on the DOM | `AppV2TestJourney` desktop |
| Scroll progress rail | Fixed 2px top bar, `scaleX` scrubbed over `end: "max"` | `AppV2ProgressRail` |
| Subtle parallax | `yPercent: 6-8` scrubbed while a hero scrolls away | `AppV2Hero` card |

## Pinned sections: extra rules

- Desktop only; mobile and reduced-motion render a stacked variant.
- Pin distance scales with content: `end: \`+=${beats * 85}%\``.
- Never inside a container with `overflow-x: hidden` (breaks pinning; see the sticky gotchas in CLAUDE.md).
- Tab/jump controls compute a scroll target from the ScrollTrigger instance (`st.start + fraction * (st.end - st.start)`) and use `window.scrollTo({ behavior: "smooth" })`.

## Performance checklist before shipping a new animated section

- [ ] Section is fully readable with JS disabled (check the SSR HTML)
- [ ] Reduced motion: page complete, nothing hidden, nothing pinned
- [ ] Only transform/opacity/dash/clip animated
- [ ] Images below the fold are `loading="lazy"`; animation triggers don't force layout
- [ ] One pin per page maximum (count the existing ones first)
- [ ] Real-device check on a phone for any scrubbed/pinned behaviour
