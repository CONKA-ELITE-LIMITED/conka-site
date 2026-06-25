# Trial Pages — Performance Playbook

> **Scope:** The A/B trial pages under `app/(trial-b)/` — `funnel-c`, `funnel-b`,
> `start-b`, `lander-b` — plus their production siblings (`/funnel`, `/start`,
> `/lander`). They share the same architecture and therefore the same
> performance gaps, so this is **one reusable checklist** rather than three
> one-offs.
>
> **Status:** `funnel-c` is the proving ground. Phase 1 (per-page, design-safe
> levers) is **applied** there; use it as the reference implementation when
> doing `start-b` and `lander-b`.
>
> Parent context: see `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md`
> (item P5 = "Convex out of root", which L1 below depends on).

---

## Why one playbook covers all of them

Every trial page follows the same shape: a thin **server** `page.tsx` that
delegates to a large `"use client"` island, with components colocated under the
page folder. They all share the same gaps:

| Page | Client files | `next/dynamic` | Group layout | Preconnect |
|------|:---:|:---:|:---:|:---:|
| `funnel-c` | 14/16 → **fixed** | ✅ (added) | ❌ (L1 pending) | ✅ (added) |
| `funnel-b` | 11/13 | ❌ | ❌ | ❌ |
| `start-b` | server shell + client islands | ✅ (already) | ❌ (L1 pending) | n/a (internal CTA) |
| `lander-b` | 6/15 → **Phase 1 done** | ✅ (added) | ❌ (L1 pending) | ✅ (added) |
| `/start` (prod) | server shell + client islands | ✅ (already) | ❌ (L1 pending) | n/a (internal CTA) |
| `/lander` (prod) | sections → **Phase 1 done** | ✅ (added) | ❌ (L1 pending) | ✅ (added) |

> **Production pages too:** `/start` and `/lander` still take live ad traffic, so
> they got the same Phase 1 pass. `/start` mirrors `start-b` (already had
> `dynamic()` + internal CTA → only needed Speed Insights). `/lander` is the page
> `lander-b` was ported from — its section files were byte-identical to
> `lander-b`'s pre-edit baseline, so the same verified changes were applied
> (hero → `next/image priority`, research-bg CSS → `next/image fill`, video
> `preload="auto"→"metadata"`, dynamic below-fold islands, Shopify preconnect,
> Speed Insights). `page.tsx` was edited targeted (its `buildCard` differs from
> `lander-b`'s), not copied.

The biggest single win — **L1** — is shared: none of them has a
`(trial-b)/layout.tsx`, so all four inherit the root layout's
`ConvexClientProvider` + Auth + Cart (~80 KB) that none of them use.

---

## The lessons (L1–L8)

| # | Lesson | Why it matters | How | Risk |
|---|--------|----------------|-----|:----:|
| **L1** | **Scope the heavy providers away from trial pages** | Drops ~80 KB of Convex/Auth/Cart these pages never use | Add `app/(trial-b)/layout.tsx`; move `ConvexClientProvider` out of the root layout into only the routes that use it (audit P5). One change lifts all four pages. | Med |
| **L2** | **Lazy-load downstream / below-fold blocks** | Only first-paint JS ships up front; lower TBT | `const X = dynamic(() => import("./X"))`. Keep first-step + always-visible chrome eager. **Only `"use client"` islands benefit — never `dynamic()` a server component** (it has no hydration cost; you'd just add a chunk boundary). | Low |
| **L3** | **Conditionally render modals/overlays** | Chunk + DOM only exist once opened | `{isOpen && <Modal …/>}`. Safe when the modal already `return null`s while closed and has no exit animation (verify first). | Low |
| **L4** | **Preconnect to the next *direct* origin before checkout** | Terminal redirect to `cart.checkoutUrl` skips a cold DNS+TLS handshake | Render `<link rel="preconnect">` for `conka-6770.myshopify.com` in the server `page.tsx` (React 19 hoists to `<head>`). **Only for pages that go straight to Shopify.** If the CTA is an internal `<Link>` (e.g. landing → funnel), Next already prefetches it — nothing to add. No `crossOrigin` (it's a navigation, not a CORS fetch). | Low |
| **L5** | **Raw `<img>` → `next/image`** | AVIF/WebP + responsive sizing + lazy-load | Add `sizes`; mark the LCP one `priority`. Watch the lander's 1.3 MB CSS `background-image` (`research-bg.jpg`) — move to `<Image fill>` or compress. | Low |
| **L6** | **One `priority` LCP asset per page; posters + `preload="metadata"` on every video** | Fast, non-blank LCP; no layout shift; no multi-MB upfront video download | Exactly one `priority`/`fetchPriority="high"` image. Every `<video>` needs a `poster` and `preload="metadata"` (never `"auto"` — it force-downloads the whole clip even below the fold; lander-b's was a 2.6 MB `preload="auto"`). Ideal: IntersectionObserver-gate playback (see start-b's `BottleVideo`). | Low |
| **L7** | **Maximize the server shell; shrink the client island** | Less JS to hydrate; faster INP | Move static copy/markup to server components; keep only interactive controls `"use client"`. | Med |
| **L8** | **Measure with Speed Insights** | Real-user CWV per variant; A/B on field data | `import { SpeedInsights } from "@vercel/speed-insights/next"` and render it on the page. | Low |

---

## Phase plan

**Phase 1 — per-page, design-safe (L2, L3, L4, L6, L8 + cleanup).**
Low risk, no design change. Done on `funnel-c`; repeat on `start-b`, `lander-b`.

**Phase 2 — lander-specific (L5).** Raw `<img>` + CSS-background conversion;
heaviest on `lander-b`.

**Phase 3 — shared structural (L1, L7).** Add the `(trial-b)/layout.tsx` and
move Convex out of root **once** — lifts all four pages. Do last, after L8 is in
place everywhere so the before/after is measurable.

---

## Reference implementation — `funnel-c` Phase 1 (done)

| Lesson | Change | File |
|--------|--------|------|
| L2 | `BuildStep`, `SummaryStep` → `next/dynamic` with min-height loading fallbacks; modals → `dynamic(..., { ssr: false })` | `funnel-c/FunnelClient.tsx` |
| L3 | `UpsellBottomSheet` + `NutritionInfoModal` wrapped in `{isOpen && …}` (verified both already `return null` when closed, no exit animation) | `funnel-c/FunnelClient.tsx` |
| L4 | `preconnect` to `cdn.shopify.com` + `conka-6770.myshopify.com`, `dns-prefetch` fallback | `funnel-c/page.tsx` |
| L6 | Added the missing `both` video poster (`BothStillWater-poster.jpg`) | `funnel-c/components/FunnelMedia.tsx` |
| L8 | `<SpeedInsights />` on the page | `funnel-c/page.tsx` |
| Cleanup | Deleted orphaned `FunnelHeroAsset.tsx` (unused in funnel-c; funnel-b/funnel keep their own copies) | — |

**Deferred to Phase 3 (shared):** L1 (group layout / Convex-out-of-root) and L7
(server-shell extraction) — these change structure, so they land once across all
trial pages rather than per-page.

### Gotchas captured while doing funnel-c
- **`next/dynamic` requires a client component** — fine here (`FunnelClient` is
  `"use client"`); a server file would need `{ ssr: false }` removed.
- **`ssr: false` only for true overlays** (modals) — keep SSR on step
  components so they prefetch on approach.
- **Verify modal close behavior before L3** — conditional rendering kills any
  exit animation. Both funnel-c modals had none, so it was safe.
- **Confirm "orphans" are page-local** — colocated components often have
  same-named copies under sibling pages (`funnel-b`, `/funnel`); grep the whole
  repo and exclude the file's own path before deleting.

---

## Per-page TODO (Phase 1 application)

**`start-b`** — ✅ **Phase 1 done.** Turned out to be the best-built trial page:
server shell with `dynamic()` already on every *client* island (IngredientsGrid,
BuyBoxCard, CROAthletes, CROCustomerReviews), hero `<Image>` with
`priority`/`fetchPriority`, `BottleVideo` with poster + IntersectionObserver,
and `CrashChart` is hand-rolled SVG (not recharts). Only real gap was **L8**
(Speed Insights, added). Two lessons it surfaced (now generalised below):
  - **Don't `dynamic()` server components.** They render to static HTML with
    zero hydration cost; dynamic-importing them adds a chunk boundary for no
    benefit. Only code-split `"use client"` islands. start-b correctly keeps
    `CROResearch`/`CROAppCallout`/`CROFAQv2` (all server) eager.
  - **L4 is about the *next hop the browser makes directly*.** start-b's CTA is
    an internal `<Link href="/funnel-b">`, which Next auto-prefetches — so there
    is no Shopify origin to preconnect here. Only add the Shopify preconnect on
    pages that redirect *straight* to `cart.checkoutUrl` (the funnels). The
    weak link in the start-b → funnel-b → checkout chain is now **funnel-b**,
    which still needs funnel-c's Phase 1.

**`lander-b`** — ✅ **Phase 1 done.** Sells straight to Shopify (no funnel hop),
so L4 applies here. Changes:
  - **L5 (headline):** hero `/lander/hero.jpg` raw `<img>` → `next/image` +
    `priority` (LCP); the **1.3 MB `research-bg.jpg` CSS background → `next/image fill`**
    (see pattern below).
  - **L6:** `BrainFuel.mp4` (2.6 MB) was `preload="auto"` — forcing a full
    below-the-fold download on every load. Changed to `preload="metadata"`.
  - **L2:** dynamic-imported the below-fold client islands (`BuyBoxes`,
    `CrashChart`, `Measure`) — SSR preserved, hydration deferred.
  - **L4:** Shopify checkout preconnect. **L8:** Speed Insights.
  - **Deliberately left (long tail):** ~13 small raw `<img>` (logos 4–32 KB,
    several already `.webp`; review/athlete photos ~100–124 KB). Low ROI vs.
    CSS-module breakage risk on a finished design. Convert the ~100 KB photos
    (Reviews/Testimonials) if a deeper pass is wanted; skip the tiny logos.

### Pattern: CSS `background-image` → `next/image fill` (L5)
CSS backgrounds can't be optimised (no AVIF/WebP, no responsive srcset). To fix:
1. Remove `background-image` from the section; keep it `position: relative` and
   add `overflow: hidden`.
2. Add `<Image src=… alt="" fill sizes="100vw" className={styles.bg} />` as the
   section's first child (`fill` sets `position:absolute; inset:0` itself).
3. Give `.bg` `object-fit: cover; z-index: 0`, and bump the scrim/content
   z-index above it (here: `::before` 0→1, `.content` 1→2).
`alt=""` because it's decorative. Done in
`sections/ResearchPartners/` — copy it for any other CSS-bg section.

**`funnel-b`** — mirror funnel-c Phase 1 verbatim (near-identical structure).

---

*Apply L8 first on any page you touch so the improvement is measurable, not
assumed.*
