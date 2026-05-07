# Performance Optimisation

Rules and patterns derived from Lighthouse audits across March–May 2026. `/start` is the primary paid traffic page and the reference benchmark — every new section or component added to it must be measured against these standards.

---

## Why this document exists

Lighthouse learnings were previously recorded only in CHANGELOG entries (retrospective). That meant rules like "don't animate width" existed in history but not in any checklist consulted when writing new components. This led to re-introducing the same class of bug multiple times. This document is the forward-looking standard.

---

## Rule 1 — CSS animations: compositor-safe properties only

**Only animate `transform`, `opacity`, and `filter`.** These run on the GPU compositor and do not trigger layout or paint. Everything else forces the browser main thread.

**Never animate:**
- `width`, `height`, `max-height`, `min-height`
- `margin`, `padding`, `top`, `left`, `right`, `bottom`
- `background-color` via `transition-all` (use `transition-colors` explicitly)
- `border-radius`, `font-size`, `line-height`

**The trigger for this rule:** `transition-all` is the most common source of non-composited animation bugs. It catches every property including layout-triggering ones. Never use `transition-all` — always name the specific property you are transitioning.

```tsx
// BAD — Lighthouse flags this: animates width (non-composited)
<span className={`block transition-all ${active ? "w-4 h-1.5" : "w-1.5 h-1.5"}`} />

// GOOD — transition-colors only, fixed width
<span className={`block w-4 h-1.5 transition-colors duration-300 ${active ? "bg-black" : "bg-black/20"}`} />

// GOOD — use transform: scaleX() to animate visual width without layout
<span
  className="block w-4 h-1.5"
  style={{
    transform: isActive ? "scaleX(1)" : "scaleX(0.375)",
    transformOrigin: "left",
    transition: "transform 300ms ease",
  }}
/>
```

**Accordion pattern:** `max-height` transitions (0 → fixed px) are also non-composited. For accordions triggered by user interaction (click), Lighthouse typically does not flag them because the animation is not paint-blocking on load. Automatic / looping / scroll-triggered animations must use `transform` exclusively.

**JS-driven animation timers.** `setInterval`/`setTimeout` that update React state (e.g. autoplay carousels) trigger re-renders during the entire mobile Lighthouse window (~10s). Each tick is a render + reconcile + paint that blocks main thread, contributing to TBT and indirectly inflating LCP element render delay. Two acceptable patterns:

1. Remove the autoplay entirely (manual nav only) — preferred for performance-critical pages.
2. If autoplay is essential for engagement, defer the component mount via `<VisibilityGate>` (see Rule 4) so the interval doesn't start until the user scrolls to it.

May 2026: stripping the 3.5s autoplay from `CROTestimonials` plus viewport-gating its mount eliminated continuous re-renders during the audit window.

---

## Rule 2 — Images

### Hero image (LCP element)
Every page's primary hero image must have:
```tsx
<Image
  src="..."
  priority                    // removes from lazy queue
  fetchPriority="high"        // explicit browser hint — Next.js SSR does not always output this
  sizes="..."                 // accurate sizes prevent oversized image download
/>
```

`priority` alone is not sufficient — add `fetchPriority="high"` explicitly. Lighthouse flagged this in April 2026 even with `priority` set.

### Below-fold images
```tsx
<Image
  src="..."
  loading="lazy"              // explicit (Next.js default for non-priority images)
  sizes="(max-width: 1024px) Xpx, Ypx"   // always provide accurate sizes
/>
```

### Image formats
`next.config.ts` is already configured for AVIF and WebP output. Do not add raw PNG/JPG to `/public` without first checking if a smaller format is available. Logo files must use WebP — the SVG-wrapped PNG issue (593KB nav logo) cost 585KB on every page load.

---

## Rule 3 — Script loading strategy

The `/start` page has four third-party scripts. Changing strategy on any of them has been tested and the current state is intentional:

| Script | Strategy | Rationale |
|--------|----------|-----------|
| CookieYes | Interaction-triggered (scroll/click/touch + 7s failsafe) | LCP fix — banner was claiming LCP element. CSS `translateY(100%)` keeps it off-screen until loaded. |
| Klaviyo | `afterInteractive` | Reverting to `lazyOnload` caused 170KB of chunks within the desktop Lighthouse window, dropping score 90 → 80. |
| Google Analytics | `afterInteractive` | Main thread impact is acceptable post-interactive. |
| Meta Pixel | `lazyOnload` | Browser-side only; CAPI handles server-side deduplication. |
| Triple Pixel | `lazyOnload` | Deferred in April 2026, reduced TBT. |

**Do not change script strategies on layout.tsx without a Lighthouse before/after.** The interactions between these scripts are non-obvious.

---

## Rule 4 — Code splitting and bundle weight

All below-fold sections on `/start` must be dynamically imported with a skeleton fallback:

```tsx
const HeavySection = dynamic(
  () => import("../components/cro/HeavySection"),
  { ssr: false, loading: () => <div className="h-[400px]" /> },
);
```

The skeleton `h-[Xpx]` value should approximate the section height to prevent CLS when the component loads.

**App Router gotcha — `dynamic()` SSRs by default.** In Next.js App Router, `dynamic()` only defers the *client bundle download*. The component is still server-rendered into the initial HTML. This means hydration still walks the full tree, which dominates LCP on heavy pages. May 2026: /start was shipping 1,217 SSR'd DOM elements with all 7 sections "dynamic-imported" — the dynamic config was only saving on JS download, not on hydration cost.

**For `noindex` paid traffic pages, pass `ssr: false`.** Pages with `robots: { index: false }` (ad landing pages, funnel pages) gain nothing from SSR'd content — Google won't index it. Adding `{ ssr: false, loading: ... }` drops the component from the initial HTML entirely; only the skeleton ships. After this change /start's pre-hydration DOM dropped from 1,217 to ~50 elements.

**For SEO-indexed pages**, `ssr: false` removes content from the initial HTML and harms ranking. Keep SSR enabled and reduce hydration cost a different way: extract heavy interactivity into smaller leaf client components, keep most of the section as server components.

**Viewport-gated mount for the heaviest below-fold components.** Even with `ssr: false`, the dynamic chunk still downloads and the component still mounts on initial client render. For sections with their own continuous effects (autoplay carousels rendering 20+ cards, `IntersectionObserver`-driven animations, large card grids), wrap the dynamic component in `<VisibilityGate minHeight="...">` (`app/components/VisibilityGate.tsx`). The chunk doesn't download or execute until the user scrolls within ~200px of the section. May 2026: applied to `CROTestimonials` on /start.

```tsx
import VisibilityGate from "@/app/components/VisibilityGate";

<VisibilityGate minHeight="500px">
  <CROTestimonials />
</VisibilityGate>
```

**`"use client"` minimisation:** Keep page-level components as server components. Only add `"use client"` at the leaf component that actually needs interactivity (carousel state, accordion state, etc.). A `"use client"` at a page level pulls the entire component tree into the client bundle.

**DOM size budget for paid traffic pages.** Initial SSR'd HTML should target <500 DOM elements. Reference: `/our-story` ships 375 elements (no client interactivity, all static). /start before May 2026 fix shipped 1,217. After `ssr: false`, /start ships ~50 pre-hydration. If your section count and DOM count are growing, audit which sections need to be SSR'd at all on a `noindex` page.

---

## Rule 5 — Font loading

`next/font/google` self-hosts font files at build time. However, it can still generate CSS that creates a dependency on `fonts.googleapis.com` in the critical render path — confirmed in production Lighthouse audits (May 2026: `fonts.googleapis.com/css2?family=` appearing at 1,999ms in the critical chain).

**All Google fonts in `layout.tsx` must have `preload: false`:**
```ts
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,   // prevents this font from entering the critical CSS chain
  display: "swap",
});
```

Without `preload: false`, Next.js includes the font CSS in the preload chain on every page — even pages that never use the font (e.g., `/start` never uses Poppins, Syne, or DM Sans). `preload: false` means the font still loads and is available for pages that need it — it just does not block initial render.

**Current font load on every page** (declared in `app/layout.tsx`):
- Neue Haas Grotesk — local, brand primary
- JetBrains Mono — local, data/mono

No Google fonts are declared in `layout.tsx` as of May 2026 — Poppins, Caveat, Syne, DM_Sans, and IBM Plex Mono have all been removed. One monospace (JetBrains Mono, local) serves the whole site.

**Audit fonts before adding:** every Google font in the root layout adds bytes to every page even with `preload: false`. Before declaring a new `next/font/google` import, search the codebase for an existing variable that fits. Local fonts via `next/font/local` are preferable — they have no external dependency chain.

Font weights were already trimmed in April 2026 to only the weights actually used. Do not add new weight variants without checking actual usage.

**Third-party scripts that auto-load Google Fonts.** Even with a clean `layout.tsx`, `fonts.googleapis.com` can still appear in the critical chain via third-party stylesheet injection. Klaviyo's Brand Library auto-loads every font configured in the Klaviyo dashboard, on every page, regardless of whether a signup form is rendered. If any of those fonts are Google Fonts, they enter the critical chain via Klaviyo's stylesheet injection — bypassing the Next.js font config entirely.

May 2026 audit found Poppins (7 variants), Albert Sans, Cormorant Garamond, and IBM Plex Sans all loaded site-wide via Klaviyo Brand Library, costing 28 KiB and a 2,520ms critical-chain dependency on /start (Lighthouse mobile, prod). Fix: in **Klaviyo dashboard → Brand Library → Fonts**, replace Google Fonts with Klaviyo-hosted equivalents (suffix: `-Klaviyo-Hosted`) or web-safe (Helvetica). Any live signup form referencing a deleted font must be updated to use a remaining font before deletion. This is a marketing-team task, not engineering.

Whenever a new third-party marketing tool is added (review platforms, popup builders, chat widgets), check whether it has its own font-loading mechanism that could re-introduce a Google Fonts dependency.

---

## Lighthouse benchmarks (reference)

| Date | Score | LCP | TBT | Notes |
|------|-------|-----|-----|-------|
| 2026-04-07 | 63 | 9.2s | — | Before optimisation round |
| 2026-04-08 | 65 | — | — | After server component conversion + dynamic imports |
| 2026-04-08 | 69 | — | — | After CookieYes interaction-trigger fix |
| 2026-04-08 | 71 | — | — | After `fetchPriority="high"` on hero |
| 2026-05-06 | 38 | 8.3s | 1,140ms | CRO rebuild — test run against dev server, not comparable |
| 2026-05-06 | 60 | 9.9s | 270ms | After animation + script strategy review |
| 2026-05-06 | 76 | — | — | Production after animation fix. Previous baseline was 80. |
| 2026-05-07 | 40 | 8.5s | 1,200ms | Mobile prod /start regression discovered. LCP element render delay 2,100ms — main thread blocked by SSR'd hydration of 1,217 DOM elements. |
| 2026-05-07 | TBD | TBD | TBD | After Track 1: `ssr: false` on dynamic imports + `CROTestimonials` autoplay strip + `VisibilityGate`. Pending re-measurement. |
| 2026-05-07 | TBD | TBD | TBD | After Track 2: removed Google Fonts (Poppins, Albert Sans, Cormorant Garamond, IBM Plex Sans) from Klaviyo Brand Library. Pending re-measurement. |

The 76 vs. 80 gap (May 2026) was originally attributed to: (a) the Google Fonts critical CSS chain — but later traced to Klaviyo Brand Library auto-loading Google Fonts, not Next.js's font config; (b) legacy JS polyfills (13.8 KiB) from missing browserslist — `package.json` browserslist is present but not always honored by Next.js 16's SWC compiler (under investigation; consider a separate `.browserslistrc`).

The 80 → 40 regression discovered May 7 was driven by structural issues that the original docs missed: App Router `dynamic()` not actually deferring SSR, autoplay carousel re-rendering during the audit window, and 1,217 SSR'd DOM elements. Track 1 + Track 2 fixes target these directly.

**Always run Lighthouse against the production Vercel deployment, not `localhost`.** Dev server results are not representative: Google Fonts makes external requests in dev, hot-reload scripts add weight, and server-rendering differences affect FCP.

---

## Pre-commit checklist for performance-sensitive pages

Before committing new components to `/start` or any paid traffic page:

- [ ] No `transition-all` — replaced with specific property (`transition-colors`, `transition-transform`, `transition-opacity`)
- [ ] No `width` / `height` / `max-height` in transitions
- [ ] No `setInterval`/`setTimeout` autoplay on below-fold components without a `<VisibilityGate>` wrapper
- [ ] Hero image has `priority` + `fetchPriority="high"` + accurate `sizes`
- [ ] All below-fold images have `loading="lazy"` + accurate `sizes`
- [ ] New below-fold sections are `dynamic()`-imported with skeleton fallback
- [ ] For pages with `robots: { index: false }`: dynamic imports also pass `ssr: false`
- [ ] Heaviest below-fold section (carousels, animation-heavy components) wrapped in `<VisibilityGate>`
- [ ] Initial SSR DOM element count under 500 (use DevTools → Elements, count root descendants)
- [ ] Page-level component is a server component (no `"use client"` at page root)
- [ ] No new third-party scripts added without a Lighthouse before/after test
- [ ] No new third-party marketing tool that auto-loads Google Fonts (Klaviyo, Yotpo, etc.) — verify font loading behaviour before integrating
- [ ] Lighthouse test run against Vercel preview deployment, not localhost (run 3× and take median; mobile Slow 4G swings ±15-20 points)
