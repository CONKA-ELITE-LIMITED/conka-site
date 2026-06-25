# CONKA — Codebase Audit & Improvement Roadmap

> **Purpose:** A consolidated, client-facing assessment of the current site's
> performance, code quality, and architecture — plus a prioritised roadmap to
> bring it to a strong baseline and future-proof it.
>
> **Context:** The site is a headless Shopify storefront on Next.js 16 (App
> Router) + TypeScript, hosted on Vercel. It is mid-way through a
> "simplification" migration (protocols → Flow/Clear/Both, new funnel), and
> Google PageSpeed Insights is reporting poor mobile performance (first paint
> ~3s) that is likely suppressing paid-ad conversion.
>
> **Overall verdict: C+ — "competent but cluttered."** A solid foundation
> undermined by an unfinished migration, an over-reliance on client-side
> rendering, a few heavy assets, and a complete absence of automated guardrails.
> No rewrite is required. Every item below is incremental.

---

## 1. How to read this document

- **Section 2** — Issues found, what each one *impacts*, and a severity/importance matrix.
- **Section 3** — Standards & future-proofing improvements (beyond just fixing what's broken).
- **Section 4** — Nice-to-haves.
- **Section 5** — An honest note on what "100% performance" really means here.

Severity legend:

| Tag | Meaning |
|-----|---------|
| 🔴 **Critical** | Directly harms conversion, correctness, or blocks future work |
| 🟠 **High** | Meaningful performance or maintainability cost |
| 🟡 **Medium** | Worth doing; lower blast radius |
| 🟢 **Low** | Cleanup / polish |

Effort legend (relative, not time): **S** = small / mechanical · **M** = moderate · **L** = large / judgment-heavy.

---

## 2. Issues surfaced

### 2.1 Performance issues (mapped to PageSpeed Insights)

| # | Issue | What it impacts | Evidence | Severity | Effort |
|---|-------|-----------------|----------|:--------:|:------:|
| P1 | **Primary brand font shipped as uncompressed `.ttf`** (~100 KB × 3 weights) instead of WOFF2 | Render-blocking; slower first paint; flagged as "Render-blocking requests" | `app/layout.tsx:17-30` | 🔴 | S |
| P2 | **2.5 MB animated GIF served `unoptimized`** (`Neurons.gif`) on `/go` listicle pages | Main-thread blocking, huge memory, no AVIF/WebP fallback; "Improve image delivery" | `ListicleRenderer.tsx:241`, `lib/landings/adhd-listicle.ts:58` | 🔴 | S |
| P3 | **1.3 MB JPG used as CSS `background-image`** — bypasses the image optimizer entirely | No format negotiation, no responsive sizing, no lazy-load; "Improve image delivery" | `ResearchPartners.module.css:6` | 🔴 | S |
| P4 | **Lander hero is a raw `<img>`**, not `next/image` with `priority` | This is the LCP element on lander pages; "LCP request discovery" | `app/lander/sections/Hero/Hero.tsx:32` | 🟠 | S |
| P5 | **`ConvexClientProvider` + Auth + Cart wrap *every* page** in the root layout | Convex client (~80 KB) ships on static pages (`/privacy`, `/our-story`, etc.) that never use it; "3rd parties", "Network dependency tree" | `app/layout.tsx:175-182` | 🔴 | M |
| P6 | **69% of components are `"use client"`** (244/355), incl. the three main product pages | Kills SSR/streaming benefits, inflates the client bundle, raises TBT | `conka-flow`, `conka-both`, `conka-clarity` `page.tsx` | 🟠 | L |
| P7 | **`recharts` (~400 KB) not lazy-loaded** on `/ingredients` and `/app-insights` | Full charting library on first paint of those pages | `ingredients/page.tsx`, `app-insights/*` | 🟠 | M |
| P8 | **GSAP imported at module top-level** in components pulled by *server* pages | Animation library loads even when animations are purely client-side; "Forced reflow" | `our-story/*`, `insights/*`, `appv2/*` | 🟠 | M |
| P9 | **Product pages load all below-fold sections eagerly** (no `next/dynamic`) | Larger initial bundle on the highest-intent pages | `conka-both/page.tsx` and siblings | 🟠 | M |
| P10 | **No `<link rel="preload">` for the LCP asset** | Browser discovers the hero late; "LCP request discovery" | `app/layout.tsx`, hero components | 🟡 | S |
| P11 | **28 raw `<img>` tags** bypass automatic AVIF/WebP + responsive sizing | Cumulative wasted bytes across lander/case-study/testimonial UI | `app/lander/sections/*`, `components/case-studies/*` | 🟡 | M |
| P12 | **~7 MB of orphaned source images** in `/public` (e.g. `CONKA_57 [ai].png` 4.8 MB, `CONKA_56` 3.6 MB, `CONKA_24` 2.6 MB, `CONKA_46` 2.4 MB) — confirmed unreferenced | Bloats the repo and every Vercel deploy (not served to users, but pure dead weight) | `public/` | 🟢 | S |
| P13 | **`react-icons` installed with zero imports** | Dead dependency; install/maintenance overhead; "Legacy JavaScript" surface | `package.json` | 🟢 | S |
| P14 | **No image density variants for 2x/3x screens**; `imageSizes` not set | Retina devices may fetch upscaled images | `next.config.ts:36` | 🟢 | S |

### 2.2 Code quality & dead code

| # | Issue | What it impacts | Evidence | Severity | Effort |
|---|-------|-----------------|----------|:--------:|:------:|
| Q1 | **Protocol system still fully present** (~3.3k lines) despite being "removed" — only hidden behind a redirect | Every future change must reason around dead branches; misleads anyone reading the code | `app/protocol/`, `app/components/protocol/`, `app/lib/protocol*.ts` (5 files) | 🔴 | M |
| Q2 | **No automated tests anywhere** (0 `*.test`/`*.spec`/`__tests__`) | No regression safety net; every change needs full manual QA — this is *why* the fix work is slow | entire repo | 🔴 | L |
| Q3 | **B2B code claimed "removed (May 2026)" in docs but fully present** (17 files, functional) | Docs contradict code; nobody can trust either | `app/api/b2b/`, `app/professionals/`, `app/lib/b2b*.ts` | 🟠 | M |
| Q4 | **Orphaned components left in the tree**, several with their own "delete me" TODOs | Confusion, accidental reuse of dead code | `HeroBannerCarousel.tsx`, `LandingProductSplit.tsx`, `LandingCTA.tsx`, `SynergyChart.tsx`, deprecated `FormulaBenefits*` | 🟡 | S |
| Q5 | **Cognitive test links to deprecated `/protocol/*` routes** (masked by redirect) | Broken information architecture; depends on a redirect to not 404 | `components/cognitive-test/CognitiveTestRecommendation.tsx:25,35,44` | 🟡 | S |
| Q6 | **Significant duplication** — ~13 bespoke hero variants with no shared base; mobile/desktop hero pairs duplicate structure; `/lander` and `/funnel` both re-implement buy logic | Changes must be made in many places; drift between variants | `funnelData.ts` consumers, `*Hero*` components | 🟠 | L |
| Q7 | **~29 `any` types**, clustered in subscription/Loop APIs | Weak typing where the integration is most fragile | `api/auth/subscriptions/*`, `BuyBoxes.tsx` | 🟡 | M |
| Q8 | **A few god components** (>600 lines) mixing concerns | Harder to review, test, and refactor | `ListicleRenderer.tsx` (907), `ListicleProductHero.tsx` (674), `ProductBuyPanel.tsx` (626) | 🟡 | M |
| Q9 | **Naming collision** — `/app/app` (the product page) vs `/app/app-insights` | Cognitive overhead navigating the routes | route folders | 🟢 | S |

### 2.3 Resilience & standards gaps

| # | Issue | What it impacts | Evidence | Severity | Effort |
|---|-------|-----------------|----------|:--------:|:------:|
| R1 | **No CI / GitHub Actions** — nothing runs typecheck, lint, or build on a PR | Anything can merge, including code that doesn't compile | no `.github/workflows` | 🔴 | S |
| R2 | **No pre-commit hooks** (husky/lint-staged) | Inconsistent formatting/lint reaches the repo | no `.husky` | 🟡 | S |
| R3 | **No error boundaries** (`error.tsx` / `global-error.tsx`) | A thrown render error = silent white screen for the user | app router | 🟠 | S |
| R4 | **No on-site performance or error telemetry** — only marketing pixels (GA, Meta, Triple Whale) | No real-user Core Web Vitals; errors are invisible; no first-party funnel data | `app/layout.tsx`, deps | 🟠 | M |
| R5 | **No caching/rendering strategy** — no `revalidate`, no `"use cache"`, no PPR | Leaves the framework's biggest perf levers on the table | grep across `app/` | 🟠 | L |
| R6 | **API routes are unprotected** (no rate limiting) | Cart/B2B/webhook/Klaviyo endpoints open to abuse | `app/api/*` | 🟡 | M |
| R7 | **Webhooks lack idempotency handling** | Replayed/duplicate webhooks can double-process | `api/webhooks/*` | 🟡 | M |

---

## 3. Importance matrix (impact × effort)

Use this to sequence the work. **Do the top-left first.**

```
            LOW EFFORT                         HIGH EFFORT
        ┌────────────────────────────┬────────────────────────────┐
  HIGH  │  P1  Fonts → WOFF2         │  P5  Convex out of root    │
 IMPACT │  P2  Kill 2.5MB GIF       │  P6  Reduce client comps   │
        │  P3  Fix CSS bg image     │  Q1  Finish protocol del.  │
        │  P4  Lander hero → Image  │  Q2  Test baseline         │
        │  R1  Add CI               │  R5  Caching / PPR         │
        │  R3  Error boundaries     │  Q6  De-dupe heroes/buy    │
        ├────────────────────────────┼────────────────────────────┤
   LOW  │  P12 Delete dead assets   │  P7  Lazy-load recharts    │
 IMPACT │  P13 Remove react-icons   │  P8  Lazy-load GSAP        │
        │  P10 Preload LCP          │  P11 Raw <img> sweep       │
        │  Q4  Delete orphans       │  Q7  Type subscription API │
        │  R2  Pre-commit hooks     │  R6/R7 Rate-limit + idemp. │
        └────────────────────────────┴────────────────────────────┘
```

### Recommended sequencing

1. **Performance sprint** — P1, P2, P3, P4, P10, P12, P13, P7, P8, P9, P11, P5.
   The direct answer to "ads aren't converting because first paint is 3s."
   Produces a measurable before/after Lighthouse delta quickly.
2. **Standards foundation** — R1, R2, R3, Q2.
   Makes "fast" *stay* fast and "broken" *visible*. The highest-leverage durability work.
3. **Debt cleanup** — Q1, Q3, Q4, Q5, Q8, Q9.
   Finish the migration so future work stops paying interest on it.
4. **Architecture modernization** — P6, R5, Q6.
   The path to top-tier scores and a maintainable component system.
5. **Hardening & observability** — R4, R6, R7, Q7.
   Reliability + first-party data.

---

## 4. Standards & future-proofing improvements

Beyond fixing the issues above, these establish a baseline that prevents
regression and adds capability. Grouped by pillar.

### Pillar 1 — Quality gates (highest-leverage standards win)
- **GitHub Actions CI**: run `tsc --noEmit`, `eslint`, and `next build` on every PR; block merge on failure.
- **husky + lint-staged**: format/lint only changed files pre-commit.
- **Lighthouse CI with a performance budget**: fail the PR if LCP / CLS / TBT or JS bundle size regress past agreed thresholds. *This is the mechanism that keeps the site fast after we leave.*
- **A `CONTRIBUTING.md` / coding standard** codifying the rules the codebase already half-follows: server-first components, "page orchestrates / component is content," import-from-barrel, design-system tokens only.

### Pillar 2 — Observability / telemetry (closes the "no on-site data" gap)
- **`@vercel/speed-insights`** — real-user Core Web Vitals (field data, not just lab), so we can prove improvements against *actual ad traffic*.
- **Error monitoring** (Sentry or Vercel's equivalent) — surface the white-screen errors that are currently invisible.
- **First-party telemetry sink** — a `/api/vitals` route persisting web-vitals + funnel events to a store we own (not locked inside Meta/GA), with a lightweight internal dashboard. This is a sellable deliverable in its own right.

### Pillar 3 — Caching & rendering architecture (raises the real perf ceiling)
> Note: the product/content data is **already static** (compiled TypeScript
> modules — effectively the fastest cache possible). The live data is the
> Shopify cart (per-user, uncacheable) and Convex (reactive, self-caching).
> So the win is the **framework's own caching**, not a bolt-on data cache.
- **Convert client-rendered PDPs to server components** → static generation / streaming instead of client fetch.
- **Next 16 Cache Components / PPR** (`"use cache"`, `cacheLife`, `cacheTag`) — prerender the static shell, stream the dynamic islands.
- **Tag-based revalidation** so content edits purge precisely.

### Pillar 4 — Where a KV / Redis layer genuinely earns its place
> Being explicit so we don't add infrastructure for its own sake. Redis is **not**
> recommended for caching product data (it's already static). It *is* worth it for:
- **Rate-limiting** the API routes (Upstash Ratelimit) — they're currently open.
- **Webhook idempotency** — dedupe replayed Shopify/Revolut webhooks.
- **The first-party telemetry sink** above (KV or Postgres).

### Pillar 5 — Resilience & DX
- `error.tsx`, `global-error.tsx`, `not-found.tsx` boundaries.
- **Test baseline** enforced *by CI* — start with pure logic: pricing, cart, product-data, B2B tier normalization.
- Tighten TypeScript: `strict` is already on; add `noUncheckedIndexedAccess` and lint-ban `any` to stop the 29 existing `any`s from spreading.

---

## 5. Nice-to-haves

These are not required for a strong baseline but add polish, capability, or
future optionality.

- **Bundle analyzer** (`@next/bundle-analyzer`) wired into CI output, so bundle growth is visible per-PR.
- **Storybook (or a `/dev` route)** for the consolidated hero/section/card components — makes the design system reviewable in isolation.
- **Visual regression testing** (Playwright screenshots / Chromatic) — given 74% mobile traffic and no tests, catching unintended layout shifts is high-value.
- **`next/og` dynamic OG images** — per-product social cards instead of one static `opengraph-image.png`.
- **A `sitemap.ts` + `robots.ts`** generated from the route map (verify current state) for cleaner SEO hygiene.
- **Image pipeline discipline** — a documented "max source size + format" rule and a pre-commit check that rejects multi-MB images in `/public`.
- **Consolidate analytics** — six tracking systems (Vercel, Triple Whale, Meta Pixel, Meta CAPI, GA, Klaviyo) is a lot of main-thread cost; audit which are still earning their keep.
- **Accessibility pass** — automated axe checks in CI; meaningful alt text is already a stated rule but unverified at scale.
- **Environment/config validation** — validate required env vars at boot (e.g. with Zod, which is already a dependency) so misconfiguration fails loudly, not silently.
- **Dependency & security automation** — Dependabot/Renovate + `npm audit` in CI.

---

## 6. An honest note on "100% performance"

A perfect 100 Lighthouse score on **mobile** is effectively unreachable while
GA, the Meta Pixel, and Triple Whale all load — third-party marketing tags
structurally cap Total Blocking Time and cache-lifetime scores, and they are
business-critical, so removing them isn't on the table.

The realistic, defensible target is:

- **Green Core Web Vitals in the field** (real-user LCP / INP / CLS), measured continuously via Speed Insights.
- **~90s on mobile / ~100 on desktop** in the lab.
- **A performance budget in CI** so those numbers can't silently erode.

That combination — fast *and* continuously enforced *and* measured against real
ad traffic — is a stronger story than a one-time "100" that quietly decays the
next time someone ships a feature.

---

*Generated as part of a codebase performance & quality review. File references
are accurate as of the audit; line numbers may drift as the code changes.*
