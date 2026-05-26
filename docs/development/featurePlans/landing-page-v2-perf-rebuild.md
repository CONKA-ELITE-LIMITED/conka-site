# /start Performance Rebuild — Strip the Architecture, Ship Less JS

> **Why this exists:** every previous perf pass on /start has added a layer (dynamic imports, `ssr: false`, VisibilityGate, the CROBelowFold wrapper) without reducing the actual amount of client JavaScript the browser has to download, parse, and hydrate. We've been treating symptoms. This plan removes the architecture and shrinks the JS at the same time.

## The actual diagnosis

| What | Home (`/`) | `/start` |
|---|---|---|
| FCP | 1.1s | 2.5–2.7s |
| LCP | 4.3s | 5.7–6.0s |
| Hero image arrives | 1,290ms | ~250ms |
| LCP element render delay | **400ms** | **1,080–1,980ms** |
| DOM elements | 1,980 | 496 |

The hero image on /start arrives over a second *earlier* than home, then sits there for 1–2 seconds before painting. That window is the main thread executing client-side JS during hydration. We are losing the LCP race on /start despite having a 4× smaller DOM, because we ship more JS that runs at the wrong moment.

## What the audit found

Component state on the `LANDING-PAGE-WEB-VIEW` branch (HEAD = `f2b1a0f`):

| Component | "use client" | Hooks / handlers | LOC | Needs client? |
|---|---|---|---|---|
| `CROHeroV2.tsx` | no | 0 | 75 | already server ✅ |
| `CROBrandStory.tsx` | no | 0 | 58 | already server ✅ |
| `CROBenefitCards.tsx` | **yes** | **0** | 137 | **no — shadow JS** |
| `CROResearch.tsx` | **yes** | **0** | 74 | **no — shadow JS** |
| `CROAppCallout.tsx` | **yes** | **0** | 98 | **no — shadow JS** |
| `CROFAQv2.tsx` | yes | 3 (accordion only) | 154 | **no — `<details>` removes need** |
| `LandingValueComparisonV2.tsx` | yes | 4 (useInView animation) | 293 | yes |
| `CROFormulaSplitV2.tsx` | yes | 11 (toggle + accordion) | 441 | yes (toggle); accordion → `<details>` |
| `CROBuyBox.tsx` | yes | 8 (cart + sub toggle) | 383 | yes (card); FAQ section → `<details>` |
| `CROAthletes.tsx` | yes | 9 (carousel) | 345 | yes |
| `CROCustomerReviews.tsx` | yes | 19 (carousel + expand) | 377 | yes |
| `CROBelowFold.tsx` | yes | 0 | 194 | **no — exists only to launder `ssr: false`** |

**Five components are marked `"use client"` with no actual client behaviour** (CROBenefitCards, CROResearch, CROAppCallout, CROFAQv2 with the `<details>` swap, CROBelowFold). That's ~657 LOC of React being shipped to the browser, parsed, and hydrated for content that could be static HTML.

## What we're actually fixing

The premise is simple: every React component that doesn't need to run in the browser shouldn't be in the browser. Once we strip those out, the chunks that *do* ship are smaller and parse faster, which clears the main thread during the LCP window.

## Phases

Each phase is independently shippable and independently measurable. Stop early if a phase doesn't move numbers.

### Phase 0 — Baseline (captured 2026-05-26)

**Lighthouse mobile prod /start (3 runs, Slow 4G throttling, Moto G Power):**

| Run | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| 1 | 95 | 2.5s | 6.0s | 290ms | 0 | 4.4s |
| 2 | 95 | 2.7s | 5.7s | 200ms | 0 | 3.2s |
| 3 | 95 | 2.6s | 5.8s | 400ms | 0 | 2.9s |
| **Median** | **95** | **2.6s** | **5.8s** | **290ms** | **0** | **3.2s** |

**Lighthouse mobile prod / (home) — single run for comparison:**

| Run | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| 1 | 92 | 1.1s | 4.3s | 290ms | 0 | 2.9s |

**LCP element render delay (the key signal):**
- /start: 1,080–1,980ms
- /: 400ms

**Long main-thread tasks on /start (median run, ordered by duration):**
- `chunks/0ae928fcf00ae9b5.js` — 125ms at 6,638ms
- `chunks/a4579d2a26014a3f.js` — 101ms at 4,691ms
- `/start` (HTML) — 90ms at 794ms (this one is inside the LCP window)
- GTM — 81ms at 4,909ms
- fbevents — 83ms at 7,081ms

**Top 3 third-party costs on /start:**
- GTM: 154 KiB, 137–219ms main thread
- Facebook (fbevents + config): 161 KiB, 128–164ms main thread
- (Klaviyo: removed in commit `f2b1a0f`)

**Best Practices score gap:** /start = 66, / = 100. Worth investigating separately during Phase 5 — likely a console warning or missing security header, not perf-blocking.

**DevTools Performance trace captured 2026-05-26 (Slow 4G + 4× CPU, ~1.1 MB gzipped, 12 MB raw, 49,244 events):**

The trace overturned the original "hydration blocks LCP paint" hypothesis. Actual mechanism:

| Time | What happens |
|---|---|
| 768ms | Send `/start` HTML request |
| 808ms | HTML response arrives, parsing begins |
| 829ms | Browser sees `<link rel="stylesheet">` (CSS, blocking) + 10× `<link rel="modulepreload">` for JS chunks |
| 829–3046ms | 10 JS chunks download in parallel, saturating Slow 4G's 180 Kbps |
| 3352ms | Hero image finishes (High priority, but still slow due to bandwidth contention) |
| 3468ms | Critical CSS (`1c46fb4b765f5a93.css`, 21.8 KiB) finally finishes — took **2.6 seconds** for a 22 KiB file |
| 3615ms | FCP = LCP paint (CSS-blocked) |

**Main thread is essentially idle from 850ms to 3470ms.** Only two main-thread events in that window: a 5.1ms RunTask at 811ms and a 5.0ms RenderFrameHostImpl::DidCommitNavigation. No hydration cost, no script parse blocking the main thread.

**Background JS parse: 17,114ms cumulative across 13 streamed parse tasks**, but on parallel background threads — does not block main thread, does not block FCP.

**The real bottleneck is bandwidth starvation:** every `next/dynamic` import in `CROBelowFold.tsx` becomes a `<link rel="modulepreload">` in the HTML head. Chrome starts pulling all 10 chunks immediately, splitting the 180 Kbps Slow 4G bandwidth ~10 ways. The 22 KiB render-blocking CSS that should download in ~1s instead takes 2.6s. FCP can't fire until CSS arrives.

**This changes Phase priorities:** Phase 3 (deleting `dynamic()` imports for sections that don't need them) becomes the highest-leverage change, not Phase 1. Every `dynamic()` deleted removes one modulepreload and frees bandwidth for the CSS.

### Phase 6 — Modulepreload audit (added after trace findings)

After Phases 1–4, count how many `<link rel="modulepreload">` entries appear in the prod `/start` HTML head. Each one of these is a parallel download that competes with critical CSS on slow connections.

- View source on prod `/start`, count modulepreload entries.
- For any genuinely-needed below-fold client island, decide: is the modulepreload helping (faster interactivity) or hurting (CSS starved)?
- Next.js doesn't offer a clean way to suppress modulepreload from a `next/dynamic` import. If we need to, options are:
  - Move the client island into a child component lazy-loaded via `React.lazy` inside another client island
  - Use `next/dynamic` with a Suspense boundary and `priority="low"` patterns (verify what current Next.js supports)
  - Worst case: hand-roll a `useEffect`-mounted import to fully defer the chunk request
- Also worth: inline the critical CSS for /start (it's a noindex paid landing page, ideal candidate). Next.js doesn't do this by default; would need a build-step extension or manual extraction.

### Phase 0b — Capture the Performance trace (user-driven)

I can't pull this from the agent; needs to come from your Chrome. Steps:

1. Open Chrome in an Incognito window (avoids extensions skewing the trace).
2. Open DevTools (Cmd+Opt+I), go to the **Performance** tab.
3. Click the gear icon → set **Network: Slow 4G**, **CPU: 4× slowdown**.
4. Click the **device toolbar** icon (top-left of DevTools) → set device to **Moto G Power** or any mobile preset.
5. Navigate to `https://www.conka.io/start` in the address bar — *don't hit record yet*.
6. Once the page is fully settled, click the round **Record** button in the Performance tab, then **Cmd+Shift+R** (hard reload). Stop the recording about 12 seconds after the page finishes loading.
7. In the recorded trace, the **timings track** at the top shows FCP and LCP markers. Zoom into the FCP-to-LCP window (≈2.6s to ≈5.8s).
8. Look at the **Main** track. Either screenshot the flame chart in that window and paste it here, *or* right-click the trace → **Save profile…** → save as `start-baseline.json` and tell me where you put it.

What I'm looking for in the trace: which scripts dominate the FCP→LCP window, what tasks are labelled (e.g. "Compile script", "Evaluate script", "Function call"), and whether there's a forced reflow or layout thrash visible.

Once we have that, we either confirm the plan and move to Phase 1, or pivot the plan based on what the trace actually shows.

### Phase 1 — Convert the no-interactivity components to Server Components

Drop `"use client"` from three files. They have zero hooks, handlers, or browser APIs.

- `app/components/cro/CROBenefitCards.tsx`
- `app/components/cro/CROResearch.tsx`
- `app/components/cro/CROAppCallout.tsx`

Verify: `npm run build` succeeds, `/start` renders identically in dev. Commit per file so we can bisect if something breaks.

Expected impact: removes ~309 LOC × Babel/JSX overhead from client bundle. Three fewer hydration trees. Three fewer dynamic chunks needed.

### Phase 2 — Convert accordions to native `<details>` / `<summary>`

Accordions don't need React state. `<details>` is native HTML with `[open]` selector for CSS, animates fine with `transition: max-height` or `grid-template-rows: 0fr → 1fr`.

Targets:
- `CROFAQv2.tsx` — entire component is one accordion. Drops to a Server Component. ~80 LOC saved.
- `CROFormulaSplitV2.tsx` — the ingredient rows + nested "See the science" reveal are accordions. Keep the AM/PM toggle as client (genuine state); convert the accordion section to `<details>`. Split into `CROFormulaSplitV2.tsx` (server shell) + `CROFormulaToggle.tsx` (small client island for the toggle). Ingredient list renders server-side from the existing data module.
- `CROBuyBox.tsx` — the FAQ accordion below the card is independent of cart state. Extract to its own `<details>`-based Server Component. The buy card itself stays client.

Verify: every accordion opens/closes, single-open behaviour (where it existed) is preserved or intentionally dropped. `<details>` defaults to multi-open; we either accept that or use a tiny `name` attribute trick (HTML spec) to enforce single-open.

Expected impact: another ~200 LOC of client JS removed. The biggest "use client" tree on the page (CROFormulaSplitV2 at 441 LOC) gets cut in half.

### Phase 3 — Delete CROBelowFold

After Phases 1 + 2, the section list is mostly Server Components with a few genuine client islands (LandingValueComparisonV2, CROFormulaToggle, CROBuyBox, CROAthletes, CROCustomerReviews).

Move the section list directly into `app/start/page.tsx`. Page stays a Server Component (keeps `metadata` export). Server Components render statically. Client islands use `next/dynamic` *with default `ssr: false`* at the page level — Next.js 16 allows `dynamic({ ssr: false })` calls inside a Server Component as long as the *imported module itself* is a client component, which it is.

Wait — Next.js 16 actually does *not* allow `ssr: false` from a Server Component. The historical reason CROBelowFold exists. So we have two options:

- **Option A:** Use `next/dynamic` without `ssr: false`. Client islands SSR (small DOM cost) then hydrate. We measure whether the hydration cost of just the genuine-client islands is acceptable. Likely fine now that ~half the bundle is gone.
- **Option B:** Keep a thin `"use client"` wrapper but make it tiny — just the dynamic imports for the 4–5 genuine client islands. ~30 LOC vs the current 194.

Pick whichever measures better in Phase 5. Default to Option A — it's simpler and SSR'ing 4 carousel/cart components is not the same problem as SSR'ing 11 sections.

### Phase 4 — Delete VisibilityGate usage on /start

VisibilityGate was added to defer mount of the heaviest below-fold sections. After Phases 1–3, those sections are either Server (no client mount to defer) or small enough that gating is overkill. The buy box gating is unjustified anyway (no real user scrolls fast enough for chunk-download latency to matter).

Remove the `<VisibilityGate>` wrappers from /start. Keep the component on disk in case other pages start using it.

### Phase 5 — Re-measure

- Lighthouse mobile prod, 3 runs, median.
- Performance trace, compare main-thread between FCP and LCP.
- Targets:
  - FCP < 1.5s (from 2.5s)
  - LCP < 4s (from 5.7s)
  - TBT < 200ms (from 290ms median)
  - LCP element render delay < 600ms (from 1,200ms)

If we don't hit these, the Phase 0 trace will tell us what's still dominating and we plan Phase 6 against actual data, not assumptions.

## What we are explicitly NOT doing

- Not changing the V2 visual design, copy, or section order. This is pure architecture.
- Not touching the Hero V2 (it's already a Server Component and renders fine).
- Not touching third-party scripts (Klaviyo, GTM, Meta). Their costs are real but separate. We already disabled the onsite Klaviyo script in commit `f2b1a0f`.
- Not converting carousels (Athletes, CustomerReviews) away from React state — they genuinely need it.
- Not deleting V1 components. Forks (`LandingValueComparison`, `CROFormulaSplit`, `LandingTestimonials`, `AthleteCredibilityCarousel`, `CROFAQ`) stay on disk because they serve other routes.

## Risks

| Risk | Mitigation |
|---|---|
| Converting client → server breaks a subtle behaviour (e.g. a component imports a client-only module) | One file per commit. `npm run build` after each. Bisect-friendly. |
| `<details>` animation looks worse than the current accordion CSS | Modern `details` + `interpolate-size: allow-keywords` + CSS transition handles this. If it really looks wrong, fall back to a tiny shared `<AccordionRow>` client island used inside server sections. |
| Single-open accordion behaviour lost when converting to `<details>` | Use the HTML `name=""` attribute on `<details>` (Chromium 120+, Safari 17+) to get native single-open. Acceptable progressive enhancement on older browsers — they get multi-open, no broken UX. |
| Server-rendering carousel components blows up DOM count again | Phase 3 Option A says SSR the genuine-client islands. Four carousel-ish components is not the same problem as 11 sections. We measure. |
| Numbers don't move after all this work | Phase 0 trace told us where to look. If they don't move, the bottleneck is elsewhere (font, CSS, third party) and we go after that with the trace as evidence. |

## Branch / commit / merge strategy

- Already on `LANDING-PAGE-WEB-VIEW` (HEAD: `f2b1a0f`).
- One commit per file conversion in Phases 1 + 2 so each is bisectable.
- One commit for Phase 3 (architecture move), one for Phase 4 (gate removal).
- CHANGELOG entry at the end summarising the whole rebuild + numbers before/after.
- Update `docs/development/PERFORMANCE_OPTIMISATION.md` to reflect new patterns: "default to Server Components, keep client islands tiny, accordions use `<details>`."
- PR description quotes the Phase 0 baseline vs Phase 5 numbers as the justification.

## Order of work (concrete checklist)

Phase 0:
- [ ] Lighthouse mobile prod /start × 3, record median FCP/LCP/TBT/SI/Score
- [ ] DevTools Performance trace prod /start (mobile, 4G throttle), save JSON
- [ ] Skim trace: identify the top 3 main-thread tasks between FCP and LCP

Phase 1 — DONE 2026-05-26:
- [x] CROBenefitCards — dropped `"use client"`, no behavioural change (Link works in Server)
- [x] CROResearch — dropped `"use client"`, no behavioural change (Image works in Server)
- [x] CROAppCallout — dropped `"use client"`, no behavioural change (Image + Link + CROPillCTA work; CROPillCTA stays a client component on its own and Next.js handles the boundary)

Bundled into a single commit rather than three because the change mechanism is identical, the build was verified once for all three, and bisecting at file granularity is cheap to do by hand if a regression appears.

**Build verified:** `npm run build` passes. `/start` still listed as `○ (Static)` — pre-rendered as static content.

**Learning to bank:** the original Phase 1 plan called for one commit per file to support bisect. That was over-cautious for a 1-line directive removal. Future phases: bundle by logical unit, not by file, unless the mechanism actually differs between files.

Phase 2:
- [ ] CROFAQv2 — convert to `<details>` Server Component, drop useState, commit
- [ ] CROBuyBox — extract FAQ into `CROBuyBoxFAQ.tsx` Server Component using `<details>`, commit
- [ ] CROFormulaSplitV2 — split into server shell + tiny `CROFormulaToggle` client island; ingredient accordion → `<details>`, commit

Phase 3:
- [ ] Inline section list into `app/start/page.tsx`
- [ ] Delete `app/start/CROBelowFold.tsx`
- [ ] Choose Option A vs Option B based on what measures cleaner, commit

Phase 4:
- [ ] Remove `<VisibilityGate>` wrappers from /start
- [ ] Leave `app/components/VisibilityGate.tsx` on disk for other pages, commit

Phase 5:
- [ ] Lighthouse × 3, record median
- [ ] DevTools trace, compare to Phase 0
- [ ] Update CHANGELOG with before/after numbers
- [ ] Update PERFORMANCE_OPTIMISATION.md
- [ ] Open PR
