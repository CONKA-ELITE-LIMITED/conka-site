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

### Phase 2 — Strip accordion state, promote CROFAQv2 to server

**Correction to the original plan after reading the source files.** CROFormulaSplitV2 cannot become a server component: its ingredient list re-renders based on the AM/PM toggle state, and the toggle is genuine client state. Best Phase 2 can do for that file is replace the two nested accordions (`openIngredient`, `showScience`) with native `<details>`, which trims state but does not change the component's client status. CROBuyBox is the same story: cart logic requires it to stay client, so the `BuyBoxFAQ` sub-component converts to `<details>` in-place. Only CROFAQv2 actually moves from client to server in this phase. The full modulepreload-count reduction only materialises in Phase 3, when these server components get statically imported from `page.tsx`.

**Three targets, single phase (decisions baked in):**

1. **CROFAQv2** → Server Component. Replace `useState<string | null>` + button + `aria-expanded` with `<details>` / `<summary>`. Use `name="faq-still-wondering"` for native single-open (Chromium 120+, Safari 17+; older browsers fall back to multi-open, no broken UX). Drop `"use client"`. ~80 LOC of client state removed.

2. **CROBuyBox** (BuyBoxFAQ section only) → `<details>` swap in place. The parent CROBuyBox keeps `"use client"` for cart logic and the subscription toggle. The internal `FAQRow` component and its `openId` state go away. ~30 LOC of state removed. True server extraction via children-prop is deferred to a Phase 3 follow-up only if measurement justifies it.

3. **CROFormulaSplitV2** (nested accordions only) → `<details>` swap. Keep `formula` useState (AM/PM toggle is genuine state). Replace `openIngredient` with `<details name="ingredient-row">` on each ingredient row. Replace nested `showScience` with a nested `<details>` inside each row's panel. Component stays `"use client"` because of the toggle, but its useState count drops from 3 to 1. ~30 LOC of state removed.

**Research-first note for target 3.** This is the riskiest part of Phase 2 because of (a) the nested `<details>` animation matching the current 200ms `max-height` transition, and (b) `<details name="">` browser-support nuances combined with the toggle re-rendering the list. Before implementing target 3, spend a research pass: build a small isolated prototype of a nested `<details>` row, verify the open/close animation looks acceptable under `interpolate-size: allow-keywords` + a CSS transition, and confirm `name=""` single-open behaviour when the parent re-keys on the formula switch. If the animation is visibly worse than the current `max-height` transition, fall back to keeping the inner state in a small shared `<AccordionRow>` client component used inside the otherwise-cleaner shell.

#### Research findings (2026-05-27, before implementing Target 3)

**Browser support check (early 2026 baseline):**
- `<details name="">` single-open grouping: Chrome 120+ (Dec 2023), Safari 17.2+ (Dec 2023), Firefox 130+ (Sep 2024). All major browsers covered for the /start audience.
- `interpolate-size: allow-keywords`: Chrome 129+ (Sep 2024) only. Safari and Firefox do not support it yet. Without it, `<details>` open/close is instant ("snap").

**Parent re-key behaviour:** ingredient rows are keyed by `ingredient.id`. Flow and Clear have distinct ingredient sets (no shared IDs), so when the AM/PM toggle flips `formula`, React fully unmounts the old `<details>` rows and mounts fresh closed ones. No state preservation problem. The current code's `setOpenIngredient(null)` reset becomes unnecessary.

**Nested `<details>` ("See the science") behaviour:** the current code keeps a per-row `useState` that persists across the parent row's collapse. Native nested `<details>` matches this: the inner `<details>` element stays in DOM with its `[open]` attribute intact when the outer collapses visually. Re-opening the outer reveals the inner in its prior state. UX parity confirmed.

**Animation verdict:** snap-open in Safari and Firefox. Smooth-open in Chrome only with `interpolate-size`. Decision: **skip `interpolate-size` for Phase 2**. The bulk of paid /start traffic is iOS Safari, which would not benefit from the rule anyway, and adding it introduces CSS complexity (block-size transition setup, `::details-content` pseudo-element targeting) for a Chrome-only win. Native snap-open is a familiar pattern across the web and adequate for an ingredient accordion. If marketing flags the snap as too abrupt post-ship, we can revisit by adding the `interpolate-size` rule in a follow-up.

**Implementation path chosen:** the primary `<details>` swap. No fallback to a shared `<AccordionRow>` client component needed.

**Verify after each target:** every accordion opens/closes correctly, single-open behaviour preserved where it existed, no console errors, `npm run build` clean.

**Expected impact:** ~140 LOC of client state code removed total. One component (CROFAQv2) moves to Server. Real modulepreload reduction lands in Phase 3.

### Phase 3 — Inline section list into page.tsx, delete CROBelowFold (the actual win)

**Decision: Option A.** Use plain `next/dynamic()` without `ssr: false` for the remaining client islands. Accept the SSR DOM cost in exchange for deleting the wrapper file entirely. Rationale: the Phase 0 trace showed bandwidth starvation, not hydration, is the bottleneck. SSR'ing 4-5 carousel/cart islands trades a modest DOM increase for cleaner architecture and one fewer file to maintain. Falls back to Option B (tiny client wrapper) only if measurement in Phase 5 shows DOM count blowing past ~700 elements.

**Why this phase delivers the modulepreload reduction:** server components imported statically from a Server Component page do not generate modulepreload links. After Phase 2, five components are Server Components (CROBrandStory already, CROBenefitCards / CROResearch / CROAppCallout from Phase 1, CROFAQv2 from Phase 2). Static-importing all five in `page.tsx` removes their modulepreloads. The 4-5 remaining client islands (LandingValueComparisonV2, CROFormulaSplitV2, CROBuyBox, CROAthletes, CROCustomerReviews) keep their `dynamic()` modulepreloads. Expected count: 10 → ~5.

**Tasks:**

1. **Audit LandingDisclaimer** — check whether it's safe as a Server Component. If yes, static-import. If no, dynamic.
2. **Move the section list** from `CROBelowFold.tsx` into `app/start/page.tsx`. Page stays a Server Component (owns `metadata` export). Static imports for the server components. `next/dynamic()` calls (no `ssr: false`) for the client islands.
3. **Delete `app/start/CROBelowFold.tsx`** once the page renders correctly.
4. **Verify** `npm run build` passes and `/start` still lists as `○ (Static)`. The page-level prerender should still work because all dynamic imports default to SSR.

**Risk and fallback:** if Option A SSRs the client islands and DOM count rebounds above ~700 elements, revert to Option B — extract just the `dynamic()` import block (4-5 imports, ~30 LOC) into a thin `"use client"` wrapper. The rest of the section list stays in `page.tsx` with static server imports. This is materially better than the current 194-LOC CROBelowFold because all the server components are no longer routed through it.

### Phase 4 — Remove VisibilityGate usage on /start (cleanup)

**Important context:** `VisibilityGate` does not suppress modulepreloads. Those are injected into the HTML head by `next/dynamic()` regardless of whether the gate ever mounts the component. The gate only defers the React mount itself. After Phase 3, most of the previously-gated sections are server components (CROResearch, CROAppCallout) where gating is meaningless, and the remaining client islands (CROAthletes, CROCustomerReviews, CROFormulaSplitV2) are small enough that the gate overhead exceeds its benefit.

**Tasks:**

1. **Remove `<VisibilityGate>` wrappers** from the section list in `page.tsx` (5 instances currently in CROBelowFold: CROFormulaSplitV2, CROAthletes, CROResearch, CROCustomerReviews, CROAppCallout). After Phase 3 these wrappers will have been carried over to page.tsx; this phase strips them.
2. **Keep `app/components/VisibilityGate.tsx`** on disk. Other pages may still use it. Quick grep before keeping/deleting: `grep -r "VisibilityGate" app/` to confirm.

**Risk:** none. The gate adds JS for no perf benefit on /start after Phase 3.

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

Phase 2 (re-scoped 2026-05-27):
- [ ] CROFAQv2 — convert to `<details>` Server Component (use `name="faq-still-wondering"` for single-open), drop `"use client"` + useState, commit
- [ ] CROBuyBox — convert internal `BuyBoxFAQ` to `<details>` in-place; parent stays client for cart logic, commit
- [ ] **Research first:** prototype nested `<details>` animation behaviour under `interpolate-size`, confirm `<details name="">` works across the formula re-key. Document findings, decide whether to proceed or fall back to a tiny shared `<AccordionRow>` client component.
- [ ] CROFormulaSplitV2 — replace `openIngredient` + `showScience` with `<details>` (or fall back per research); keep AM/PM toggle as client, commit

Phase 3 (Option A committed):
- [ ] Audit LandingDisclaimer for Server Component safety
- [ ] Inline section list into `app/start/page.tsx`: static imports for server components, `next/dynamic()` (no `ssr: false`) for client islands
- [ ] Delete `app/start/CROBelowFold.tsx`
- [ ] `npm run build` clean, `/start` still `○ (Static)`, commit
- [ ] DOM-count sanity check on prod preview: if >700 elements, fall back to Option B

Phase 4:
- [ ] Remove `<VisibilityGate>` wrappers from /start sections in `page.tsx`
- [ ] `grep -r "VisibilityGate" app/` to confirm no other consumers before deciding to keep the component on disk, commit

Phase 5:
- [ ] Lighthouse × 3, record median
- [ ] DevTools trace, compare to Phase 0 (focus: modulepreload count, FCP, LCP render delay)
- [ ] Update CHANGELOG with before/after numbers
- [ ] Update PERFORMANCE_OPTIMISATION.md
- [ ] Open PR

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 0     | Baseline (Lighthouse + DevTools trace) | Done 2026-05-26 |
| 1     | Drop `"use client"` from no-interactivity sections | Done 2026-05-26 (commit `f4e5e51`) |
| 2     | Strip accordion state, promote CROFAQv2 to server | Done 2026-05-27 |
| 3     | Inline section list into page.tsx, delete CROBelowFold | Done 2026-05-27 |
| 4     | Remove VisibilityGate usage on /start | Done 2026-05-27 |
| 5     | Re-measure and document | Not started |
| 6     | Modulepreload audit + critical CSS inline (contingency) | Future |

## Jira tickets

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| [SCRUM-1039](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1039) | [Website & CRO] /start perf Phase 2: accordion `<details>` swap + CROFAQv2 to server | 2 | To Do |
| [SCRUM-1040](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1040) | [Website & CRO] /start perf Phase 3: inline section list, delete CROBelowFold | 3 | To Do |
| [SCRUM-1041](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1041) | [Website & CRO] /start perf Phase 4: remove VisibilityGate from /start | 4 | To Do |

Dependencies: SCRUM-1039 blocks SCRUM-1040, SCRUM-1040 blocks SCRUM-1041.
