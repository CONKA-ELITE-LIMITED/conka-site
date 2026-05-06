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
  { loading: () => <div className="h-[400px]" /> },
);
```

The skeleton `h-[Xpx]` value should approximate the section height to prevent CLS when the component loads.

**`"use client"` minimisation:** Keep page-level components as server components. Only add `"use client"` at the leaf component that actually needs interactivity (carousel state, accordion state, etc.). A `"use client"` at a page level pulls the entire component tree into the client bundle.

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
- Neue Haas Grotesk — local, brand primary, preloads normally (local fonts have no external chain)
- JetBrains Mono — local, data/mono, preloads normally
- Poppins — Google, `preload: false` — site-wide default body font (`globals.css`), used by all legacy pages
- Caveat — Google, `preload: false` — handwriting accent on professionals/quiz/win
- IBM Plex Mono — Google, `preload: false` — clinical mono on home (`KeyBenefitsMobile`, `FoundingMemberCounter`)

**Removed (May 2026):** Syne and DM_Sans were declared in `layout.tsx` but the CSS rules using them (`.premium-pdp .premium-display-hero`, `.premium-pdp .premium-body-hero`) had zero JSX consumers — the `.premium-pdp` scope was deleted during the brand-base migration. Both fonts removed from imports and CSS rules.

**Audit fonts before adding:** every Google font in the root layout adds bytes to every page even with `preload: false`. Before declaring a new `next/font/google` import, search the codebase for an existing variable that fits.

Font weights were already trimmed in April 2026 to only the weights actually used. Do not add new weight variants without checking actual usage.

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

The 76 vs. 80 gap is caused by: (a) the Google Fonts critical CSS chain (`fonts.googleapis.com` appearing at 1,999ms in the dependency tree), addressed by `preload: false` on all Google fonts; (b) legacy JS polyfills (13.8 KiB) from missing browserslist config, addressed by adding modern browserslist to `package.json`.

**Always run Lighthouse against the production Vercel deployment, not `localhost`.** Dev server results are not representative: Google Fonts makes external requests in dev, hot-reload scripts add weight, and server-rendering differences affect FCP.

---

## Pre-commit checklist for performance-sensitive pages

Before committing new components to `/start` or any paid traffic page:

- [ ] No `transition-all` — replaced with specific property (`transition-colors`, `transition-transform`, `transition-opacity`)
- [ ] No `width` / `height` / `max-height` in transitions
- [ ] Hero image has `priority` + `fetchPriority="high"` + accurate `sizes`
- [ ] All below-fold images have `loading="lazy"` + accurate `sizes`
- [ ] New below-fold sections are `dynamic()`-imported with skeleton fallback
- [ ] Page-level component is a server component (no `"use client"` at page root)
- [ ] No new third-party scripts added without a Lighthouse before/after test
- [ ] Lighthouse test run against Vercel preview deployment, not localhost
