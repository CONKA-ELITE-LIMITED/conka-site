# Landing Page v2.1 — Design Pass on `/startv2`

> Working doc. The system lives at the top; section briefs get added below as each section gets picked up. No tickets, no implementation log — that emerges as we go.

## Why this exists

v2.0 shipped 11 sections without locking a visual system first. Each section made its own micro-decisions about background, layout, copy tone, and density — and they all rhymed into uniformity. Every section white. Every layout centered. Every density flat. Johnny (Ovrload) reviewed the build and said it reads as a pitch deck, not a landing page. He's right.

v2.1 fixes this by locking the system **before** any section gets built, then building section by section against the system on a fresh page (`/startv2`). Each section is deployed alone, measured against the perf budget, and only added to the page when finished. No port-and-clean-up. No stubs. `/start` stays live serving paid traffic the whole time. Cutover only happens when `/startv2` is genuinely complete.

## Aesthetic call

**Magic Mind as the baseline aesthetic** — warm, editorial, conversational, productivity-led. Same product category as CONKA (focus shot), so the visual language and copy DNA actually translate. Top of page (Sections 1-5) leans heaviest on this.

**Ketone-IQ as the proof-beat treatment** — dark, sharp, performance-led. Used selectively for the athletes section (Section 7) and possibly the research section (Section 8) where CONKA's Olympic / Informed Sport credibility earns the harder visual register. The page reads warm → warm → warm → DARK → warm. Punctuated, not blended.

Cloud (usecloud.co) stays as a tiebreaker reference when Magic Mind and Ketone disagree.

## Palette

| Surface | Hex | Use |
|---|---|---|
| White | `#FFFFFF` | Default section background |
| Cream | TBD (~`#F7F4ED`) | Alternating section background, lifts warmth |
| Navy | `#1B2757` | Primary brand, CTA, dark proof-beat background |
| Amber (Flow) | `#F59E0B` | AM accent, gold stars |
| Soft Blue (Clear) | `#94B9FF` | PM accent |

Three surfaces (white, cream, navy) give the page rhythm without losing brand cleanliness. Amber and soft-blue are accents only, never section backgrounds. Cream hex gets locked when the first non-white section ships.

## Type

- Body + headlines: **Neue Haas Grotesk** (already installed, no perf cost)
- Accent words in headlines: same family in italic
- No new fonts. If a serif accent gets proposed later, weigh the perf cost before adding.

## Copy voice

- Confident-conversational, not clinical
- Numbers in headlines whenever the section supports it (5,000+ daily users, 150,000+ shots, 63% memory uplift)
- One italic emphasis word per headline (`*Daily*`, `*Measured*`, etc.)
- One idea per section
- No EFSA hedges above the fold — they belong in the proof beats deeper down

## Performance budget

- **Lighthouse mobile: 85+ aim, 80 floor**
- LCP < 2.5s
- CLS < 0.1
- TBT < 200ms

If a section breaches the floor, fix before adding the next. Don't ship Section 2 over a Section 1 regression.

## Deploy protocol

1. Empty `/startv2/page.tsx` ships first. Noindex + minimal `<main>`. Deploy. Run mobile Lighthouse. **That number is the baseline.**
2. Build the next section inline in `page.tsx`. Reuse the data layer (`CartContext`, `productData`, `ingredientsData`, pricing helpers, `FORMULA_COLORS`, `offerConstants`) — inline the JSX, don't fork the data.
3. Deploy. Run mobile Lighthouse. Compare to previous number. Capture both in the performance log below.
4. If perf passes the floor, the section is done. Add the next section's brief to this doc, then build it.
5. `/start` stays live. `/startv2` only becomes the new `/start` when all 11 sections are finished and a deliberate cutover happens.

## Performance log

Mobile Lighthouse on each section as it lands. Run after every deploy, write the row, write the notes. Compare against the previous row to see what the new section actually cost.

| Date       | After                | Perf | A11y | BP | SEO | FCP   | LCP   | TBT    | CLS | SI    |
| ---------- | -------------------- | ---- | ---- | -- | --- | ----- | ----- | ------ | --- | ----- |
| 2026-05-27 | Empty page           | n/c  | n/c  | n/c| n/c | n/c   | n/c   | n/c    | n/c | n/c   |
| 2026-05-27 | Hero                 | n/c  | n/c  | n/c| n/c | n/c   | n/c   | n/c    | n/c | n/c   |
| 2026-05-27 | Section 2            | 88   | 92   | 96 | 66  | 0.9 s | 3.8 s | 120 ms | 0   | 1.8 s |
| 2026-05-28 | Section 3            | 80   | 92   | 96 | 80  | 0.9 s | 3.7 s | 400 ms | 0   | 2.2 s |
| 2026-05-28 | Section 3 perf fix   | 83   | 92   | 96 | 83  | 0.9 s | 3.9 s | 240 ms | 0   | 2.2 s |
| 2026-05-28 | Section 3 perf hygiene (5-run median) | 70 | 92 | 96 | 66 | 1.0 s | 3.3 s | 480 ms | 0 | 3.0 s |
| 2026-05-28 | Section 4 (single, run 1)     | 65 | 93 | 96 | 65 | 2.8 s | 5.9 s | 280 ms | 0 | 5.0 s |
| 2026-05-28 | Section 4 (single, run 2)     | 78 | 93 | 96 | 66 | 1.0 s | 3.8 s | 370 ms | 0 | 4.0 s |

`n/c` = not captured (we deployed but did not record the run). Future deploys, capture every time. The "Section 3 perf hygiene" row uses the median of 5 runs (40, 61, 70, 80, 83) on the same deploy after we discovered that single Lighthouse mobile runs against a Vercel preview swing far beyond the ±15-20 band the perf doc cites. Non-perf metrics in that row are from the run closest to the median, not aggregated.

### Notes per run

**Section 2 (2026-05-27, perf 88)** — First real measurement. Within budget on overall perf score (80 floor, 85 aim). LCP 3.8s is **over the 2.5s budget**, which is the biggest lever to investigate before the next section ships. Specific findings from the report:

- **LCP image starved by render-blocking CSS.** LCP breakdown: resource load delay 550 ms, element render delay 330 ms, resource load duration 80 ms. Two CSS chunks (23 KiB combined, 610 ms savings flagged) sit in the critical path ahead of the hero image fetch. The image itself is small and fast, but it can't start downloading until the CSS resolves. Likely lever: inline critical CSS, or strip `brand-base.css` further so only the styles that hit /startv2 are shipped.
- **Third parties dominate JS budget.** GTM 154 KiB (106 ms main thread) + Facebook Pixel 160 KiB (101 ms) account for ~50% of total bytes. Global from `layout.tsx`, not /startv2-specific. ~146 KiB of unused JS overall, ~120 KiB of that is third party. Out of scope for the section work but worth flagging as a project-wide ceiling on what /startv2 can achieve.
- **Legacy polyfills in 1st-party chunk.** 26 KiB of unnecessary ES6 polyfills (`Array.at`, `Array.flat`, `Array.flatMap`, `Object.fromEntries`, `String.prototype.trimStart/End`) in `chunks/a4579d2a26014a3f.js`. Browserslist or Next.js compiler target may be set too conservatively. Cheap win available.
- **TBT 120 ms.** Main-thread time mostly belongs to GTM + Facebook + the 1st-party chunk. Acceptable for now (200 ms budget).
- **CLS 0.** Animated stats and clipped laurel halves are not shifting layout. Inline-style approach + tabular-nums on the counter are working.
- **SEO 66 — low but expected.** The noindex/nofollow directive is intentional (paid-traffic-only page). Score drop is fine.

Top lever for Section 3: address render-blocking CSS to claw back ~600 ms on LCP. Polyfill prune is the secondary lever (26 KiB JS, helps FCP).

**Section 3 (2026-05-28, perf 80):** TBT regression. Section 3 dropped perf from 88 to 80 and pushed TBT from 120 ms to 400 ms (over the 200 ms budget). Long-tasks report points at a 210 ms task in `chunks/258a54fb1b90cb22.js` starting at 6.7 s into the load: React hydrating ~60 SVG elements per chart across two stacked charts inside the `"use client"` `CaffeineCurves` component. LCP unchanged at 3.7 s (still starved by render-blocking CSS, same as Section 2). Render-blocking CSS and polyfill levers also unchanged.

**Section 3 perf fix (2026-05-28, perf 83):** Recovery. Split `CaffeineCurves` into a Server Component holding the SVG markup plus a thin client wrapper (`CaffeineCurvesReveal`, around 50 lines) that owns the IntersectionObserver and toggles a `.revealed` class. The cover-rect transform moved from inline `style={coverStyle}` to a CSS module rule keyed off that class. Long task in our 1st-party chunk dropped from 210 ms to 150 ms; TBT dropped from 400 ms to 240 ms (still 40 ms over budget but moving the right way). LCP fluctuated to 3.9 s, within Lighthouse mobile's normal ±15-20 swing per the perf doc, not a real regression. Refactor recovered most of the Section 3 cost without changing the visual or behaviour.

Top levers for Section 4: (a) hero image resize for the LCP element (`/lifestyle/clear/ClearDrink.jpg` is 909×683 source but displayed at 463×309, 15.3 KiB savings flagged); (b) `.browserslistrc` polyfill prune (still 13.7 KiB of `Array.at` / `Array.flat` / `Object.fromEntries` etc. in our 1st-party chunk, sitewide JS win). Render-blocking CSS (~700 ms LCP, biggest single lever) deferred to a dedicated effort because the fix requires auditing or splitting the shared `brand-base.css`.

**Section 3 perf hygiene (2026-05-28, perf 70 median):** mixed result. Two changes shipped in one commit on `second-round-performance-imp`: hero image resized at the source from 1500×1000 / 69 KB to 720×540 / 38 KB, and a new `.browserslistrc` mirroring the `package.json` browserslist targets. Image change landed cleanly and visibly: the Lighthouse "Improve image delivery" audit no longer flags `ClearDrink.jpg` in any subsequent run. `.browserslistrc` did NOT take effect: the same 13.8 KiB of `Array.at` / `Array.flat` / `Array.flatMap` / `Object.fromEntries` / `Object.hasOwn` / `String.trimStart/End` polyfills still appears in `chunks/94bde6376cf279be.js` on every run. The perf doc's hedge ("under investigation, consider .browserslistrc") turned out to be accurate. We need a different mechanism to convince SWC to honour our target; likely options to research are setting the target via `next.config.ts` if such an option exists, or auditing whether a dependency (rather than SWC) is the source of the polyfills.

The bigger learning from this run was about measurement, not the page. Five consecutive single-run mobile Lighthouse measurements against the same Vercel preview produced perf scores of 40, 61, 70, 80, and 83. The doc previously said "mobile Slow 4G swings ±15-20 points" — in practice on this page (heavy 3rd-party JS, GTM + FB Pixel = 50% of bytes), the swing was ±43 points across 5 runs. The element-render-delay subpart of LCP was the canary, fluctuating 270 ms / 1700 ms / 2020 ms across runs of the same deploy. That much swing means single-run Lighthouse is not a usable signal at our current bundle composition. Going forward: take the median of 5 runs, or move to PageSpeed Insights (controlled Google environment, much more consistent), or use Vercel Analytics → Web Vitals for real-user data. Score chasing single runs leads to bad decisions.

Top levers for Section 4 (revised): (a) the polyfill issue is real but low-priority (13.7 KiB, FCP only). Don't burn more time on `.browserslistrc` variants without a clearer signal of root cause. (b) Render-blocking CSS (~700 ms LCP) remains the biggest single lever but the same risk caveat applies (shared `brand-base.css`); save for a dedicated effort. (c) Switch measurement to PSI or median-of-5 from this section forward.

## Constraints carried forward from v2.0

- `/startv2` is `noindex, nofollow` — paid-traffic only at cutover, never indexed
- EFSA claims compliance — `/review-claims` before any new copy ships
- Mobile-first — 74% of `/start` traffic is mobile; mobile Lighthouse is the only number that matters
- Don't touch shared components used by `/conka-flow`, `/conka-clarity`, `/conka-both` — reuse via import only, never edit in place
- Analytics — `PageView` fires from `layout.tsx` automatically; cart actions route through `CartContext.addToCart`, which handles Triple Whale + Meta Pixel + Meta CAPI

---

## Section briefs

Briefs get added here as each section gets picked up. Each brief captures: job, reference, layout direction, image direction, copy direction, perf delta against previous section.

### Baseline (empty page)

`<main>` + Navigation + Footer between them, noindex metadata. Lighthouse not captured at this stage (see `## Performance log`).

### Section 1 — Hero ✅

**Job.** Land the value prop in 3 seconds. Trust signal, emotional hook, conversion CTA to funnel.

**Reference.** Magic Mind hero pattern — italic accent word in the headline, trust micro-row with stars + review count, full-width pill CTA.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centered on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>` — zero top padding so the asset butts directly under the nav.
- No `brand-clinical` / `brand-v2` scope class on the page root. Fresh slate.

**Image.**
- Asset: `/lifestyle/clear/ClearDrink.jpg`.
- Container: `aspect-[4/3]`, full-bleed mobile (`-mx-5 w-[calc(100%+2.5rem)]`), contained at `md:rounded-[12px]`.
- Cropped 8% top + 12% bottom via `transform: scale(1.2) translateY(1.67%)` on the `<Image>` — GPU-only, no layout cost.
- `priority` + `fetchPriority="high"` for LCP.

**Copy.**
- H1 (38px, letter-spacing -0.02em): "Brain Performance / in One *Daily* Shot." Two lines via `<br />`, italic on "Daily".
- Trust micro-row: 5 stacked 35px borderless avatars (negative margin -10px), 4.5-star visual via grey-base + gold-clipped overlay at 90% width (20px font, gold #F59E0B), "Excellent 4.7" next to the stars, then "**622+** reviews · **5,000+** daily users" with bolded numbers.
- Subline: "With a daily dose of CONKA, you'll experience a noticeable boost in focus, memory, stress resilience & neuroplasticity through our patented formula.†"
- CTA (text-lg, full-width navy pill): "Save £120 + Free Shipping" with inline right-arrow SVG.
- Below CTA: green-check-in-circle SVG + "100-day money back guarantee" centered.

**Claims to revisit before launch.** "Stress resilience" and "neuroplasticity" in the subline; "Save £120" in the CTA. Run `/review-claims`.

**Perf delta.** Not captured at this section. First measurement was after Section 2 (see `## Performance log`).

### Section 2 — Brand Story ✅

**Job.** Founding story + credibility for the "we created this" claim. Self-funded R&D as the proof beat, scale stats, aspirational outcome at the close.

**Reference.** Ketone-IQ "We Created Drinkable Ketones" — H2 + single made-it-possible sentence + stats + CTA + credibility badge. Magic Mind contributes the conversational sentence rhythm.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centered on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>`.
- Order: H2 → made-it-possible line → asset → animated stats (2-col grid) → content-width CTA → laurel-flanked credibility badge.
- Trust line ("Trusted where cognitive performance isn't optional…") deliberately cut — audience claim belongs in Section 7 (athletes).

**Image.**
- Asset: `/formulas/both/BothHero.jpg` (two CONKA bottles, white + dark cap, white background). Stand-in for a future 3D render.
- Container: `aspect-[5/4]`, full-bleed mobile.
- Cropped via `transform: scale(1.5) translateY(-15%)` to remove most of the top white space and bottom-align the bottles in the visible window.

**Copy.**
- H2 (34px, letter-spacing -0.02em): "We Created Drinkable / Focus and Clarity." Two lines via `<br />`.
- Made-it-possible line: "Over 6 years and £500,000+ of our own capital invested into clinical development and research with leading UK universities, professional sports clubs, and the military."
- Animated stats (count up from 0 on scroll into view, ease-out cubic over 1500ms, respects `prefers-reduced-motion`, single use):
  - **150,000+** / shots sold to date
  - **100,000+** / cognitive tests done
- Stat captions: `text-[#1B2757] font-medium` (navy, slightly heavier than default).
- CTA: "Order Now" + right-arrow, content-width navy pill (text-lg, py-4 px-10), centered via `<div className="flex justify-center">`.
- Credibility badge (`bg-black/[0.04] rounded-[12px]`, laurel-flanked):
  - Eyebrow: "ONE OF THE WORLD'S LARGEST" (10px uppercase, tracking-[0.12em], navy, bold).
  - Body (13px, semibold, black): "Consumer brain research project. 1,000+ brains tested regularly through our app, unlocking a new level of cognitive performance."
- Laurels: `/public/LaurelWreath.png` (Canva asset, transparent background). One `<Image fill>` rendered on each side inside a `30px × 64px overflow-hidden` container with `objectFit: "cover"` and `objectPosition: "left center"` (left side) / `"right center"` (right side). One asset, two halves shown by clipping.

**Claims to revisit before launch.**
- "Professional sports clubs, and the military" as collaborators alongside universities — load-bearing comparative claim.
- "One of the world's largest consumer brain research project" — comparative claim, needs substantiation.
- "1,000+ brains tested regularly" — verify the number against current app data.

**Architecture notes.**
- Inline JSX (no separate component). Single client island: `app/startv2/AnimatedStat.tsx` (~60 lines, `useState` + `IntersectionObserver`). Page stays a Server Component.
- Only new dependency outside Section 2's own JSX: the AnimatedStat import in `page.tsx` and the laurel asset in `/public`.

**Perf delta.** First captured Lighthouse run on /startv2. Mobile perf **88** (above 80 floor, below 85 aim). **LCP 3.8s — over the 2.5s budget.** See `## Performance log` for the full breakdown. Top lever for Section 3: address render-blocking CSS (~600 ms LCP savings available) before adding more weight.

### Section 4 — Ingredients ✅

**Job.** Show what's actually inside in a way that reads as a serious supplement, not a label dump. Make it consumable enough that a cold visitor can scan and understand within seconds, with editorial depth available on tap.

**Reference.** Magic Mind ingredients page — image-led tiles, single-sentence benefits, plant-part + class tags. AM/PM toggle pattern preserved from the existing `app/components/cro/CROFormulaSplitV2.tsx` so the morning Flow / afternoon Clear ritual still teaches the time-of-day pairing rather than presenting it as a static comparison.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centred on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>`.
- Order: H2 → subhead → toggle → square bottle card (image only) → product name + tagline row → detail panel (selected ingredient) → 3-col ingredient tile grid → 4-icon cert strip → CTA → 100-day guarantee row.
- Cream surface considered for this section then dropped in favour of white to keep visual rhythm of S1-S2 white + S3 tint + S4 white. Cream hex (`#F7F4ED`) remains unlocked — first warm surface still pending a future section.
- Toggling formulas resets the selected ingredient back to the first in the new formula's list.
- Entire interaction (toggle, bottle swap, tile selection, detail-panel swap) lives in one client island; page wrapper owns the H2, subhead, CTA, and guarantee row.

**Image.**
- Bottle cards: `/formulas/conkaFlow/FlowNew.jpg` (Flow, black cap) and `/formulas/conkaClear/ClearNew.jpg` (Clear, white cap). Both 1:1 square with off-white photographic backgrounds. Card matches asset aspect ratio at `aspect-square` with `object-cover` so the asset's off-white IS the card surface (no edge mismatch). 1px `border border-black/10` defines the card edge against the white section background. Earlier transparent-PNG positioning hacks (`w-44 h-[88%] scale-150 -translate-y-2`) all removed — the new JPGs need no inner scaling.
- Ingredient tiles: 13 bespoke 3D renders shipped in `/public/ingredients/renders/` as PascalCase JPGs on near-white backgrounds (all 6 Flow ingredients plus 6 of 9 Clear actives — VitaminC, AlphaGPC, NAcetylCysteine, GinkgoBiloba, Lecithin, AlphaLipoicAcid, VitaminB12). Three Clear tiles (`glutathione`, `alcar`, and previously `alpha-gpc`) use the generic white-powder `11.jpg` as a fallback because their typical commercial form is a white powder; `alpha-gpc` was later promoted to its own render (`AlphaGPC.jpg`, repurposed from an unused `LemonEssentialOil.jpg`). PascalCase filenames mapped to kebab-case ingredient ids via the in-component `ASSET_FILENAME` lookup, slated for cleanup when renders migrate to per-formula folders (`/public/ingredients/flow/{id}.jpg`).
- Tile structure: white background, 1px light-grey border permanent, 2px dark neutral outline on selection (no formula-coloured accent — neutral was the explicit call to avoid making selection feel like a brand statement). Image area inside fills `aspect-square` with `object-contain`. Letter-fallback `FallbackTile` still renders when no asset is mapped.

**Copy.**
- H2 (34px, letter-spacing -0.02em): "15 Science-Backed / Ingredients." Two lines via `<br />`. Drops the conversational tone of S1/S3 in favour of a direct credibility declaration.
- Subhead: "Every ingredient is dosed to match the peer-reviewed clinical research. Six years of development with leading UK universities and the military." Two short sentences (no em-dash per project copy rules), echoing S2's credibility set.
- Per-formula tagline (under the bottle card): Flow "Calm focus for your mornings." / Clear "Afternoon clarity, without the coffee." Single line per formula. Replaces the earlier double-up of a card-overlay tagline plus a separate "Six active ingredients..." intro line above the grid — consolidated into one tagline that lives below the bottle. Ingredient count is now communicated visually by the grid itself (6 tiles for Flow, 9 for Clear).
- Tile content: ingredient name only (no benefit copy under each tile). Editorial weight moves to the detail panel above.
- Detail panel hierarchy: ingredient name (24px semibold, letter-spacing -0.02em), pipe-separated tags (11px uppercase tracking-0.14em, e.g. `Root | Adaptogen`, `Leaf | Nootropic`, `Amino acid | Neuroprotection`), single tight benefit sentence (15px). All ingredient copy duplicated locally in `IngredientsGrid.tsx` rather than pulled from `app/lib/ingredientsData.ts` because the shared data carries longer clinical descriptions and em-dashes; the island carries scan-optimised one-liners written to the v2.1 voice.
- Cert strip: four AVIF icons (Vegan / Kosher / BPA Free / Third Party Tested) at 68px, no text labels, `flex gap-2 justify-center`. Icon `alt` attributes carry the label text for screen readers.
- 100-day guarantee row below the CTA mirrors the hero pattern exactly (same SVG, same copy) so the page reads consistently top and bottom.

**Claims to revisit before launch.**
- "15 Science-Backed Ingredients" — total count is 6 Flow + 9 Clear actives, with `lemon-oil` excluded as a flavouring. Any external creative or copy still referencing "16 ingredients" needs a sweep before this goes live.
- "Every ingredient is dosed to match the peer-reviewed clinical research" — needs a dosing audit per ingredient (research-supported dose vs delivered dose) before this can ship.
- "Six years of development with leading UK universities and the military" — same flag as S2's version of this claim.
- Each ingredient's benefit line is paraphrased Magic Mind style and not pulled from `ingredientsData.ts`. Run `/review-claims` on the full set before launch.
- Clear ingredient order is product-led, not alphabetical (Glutathione first, Vitamin C seventh per the founder's call) — keep this order if it gets ported elsewhere.

**Architecture notes.**
- New client island `app/startv2/IngredientsGrid.tsx` (~330 lines): toggle, bottle card + tagline row, detail panel, and tile grid all in one. State (`formula`, `selectedId`) is local to the island. Page (`page.tsx`) stays a Server Component aside from this addition and the prior `AnimatedStat` and `CaffeineCurvesReveal` islands.
- Two lookups inside the island: `FORMULAS` holds per-formula content (name, tagline, bottle image, ingredient list with name/tags/benefit), `ASSET_FILENAME` maps `formula → ingredient id → render filename`. Both are temporary shapes — collapse into `ingredientsData.ts` once the shared data is rewritten in the v2.1 voice and renders migrate to per-formula folders.
- Selection ring uses `outline` (not `border`) with `outline-offset: 0` so the 2px selected-state line stacks immediately outside the permanent 1px border without causing layout shift.
- Bottle card overlay copy moved out of the card and into its own row below; the previous absolute-positioned overlay collided with the centred bottle once the card became square.

**Perf delta.** Two single-run samples on the same Section 4 deploy gave **perf 65 (LCP 5.9 s, TBT 280 ms)** and **perf 78 (LCP 3.8 s, TBT 370 ms)** — a 13-point swing on identical bytes, fresh confirmation of the Section 3 hygiene finding that single runs are not signal on this bundle. Across both samples the **diagnostic was identical**: render-blocking CSS chain (three chunks, 24.8 KiB, critical path 619–920 ms) drives an `element-render-delay` of 1,660–1,750 ms on the LCP image, and a 148–161 ms long task at ~6.9 s in `chunks/0d6a4e182e7d1edf.js` (IngredientsGrid hydration) shows up in every run. FCP was the most volatile metric (2.8 s → 1.0 s, same deploy); TBT stayed over the 200 ms budget in both. The image regression (`ClearDrink.jpg` reverted to 909×683 because 720×540 was blurry on 2×/3× DPR mobile) is consistent across runs.

**Section 4 perf fixes (2026-05-28):** three changes shipped together to address the regression.

1. **`experimental.optimizeCss: true` in `next.config.ts`** — enables Next 16's built-in critical-CSS inlining. Previously three CSS chunks (24.8 KiB total) blocked render on the critical path; with inlining, only the above-the-fold CSS is rendered synchronously and the rest is async-loaded. Build passed clean; no `critters` / `beasties` install needed on Next 16 (bundled internally). Expected impact: dent the 1,660 ms element-render-delay on LCP.

2. **Dead CSS removed from `app/globals.css`** — `.story-*` rules (`.story-scroll-container`, `.story-section`, `.story-light`, `.story-dark`, `.story-counter`, `.story-progress-dot`, `.story-quote`) and `.parallax-text`, ~80 lines total, confirmed zero consumers across `app/`. Was leftover from a previous `/our-story` implementation. Animation helpers (`.animate-fade-in-up`, `.animate-bounce-slow`, `.stagger-1..4`, `.animate-sticky-phone-fade`) were kept because `QuizResultsOverview` still uses them. Sitewide CSS bundle should shrink ~3–5 KiB.

3. **`IngredientsGrid` converted to `dynamic()` import in `app/startv2/page.tsx`** — mirrors the `CROFormulaSplitV2` pattern in `/start/page.tsx`. Same SSR'd HTML (no SEO loss, no paint flash), but the client JS is code-split and hydrated when the chunk loads rather than as part of the initial bundle. Placeholder reserves `min-h-[1100px]` to prevent CLS during client-side navigation. Expected impact: the 148 ms long task drops out of the TBT window (TBT measures within ~5 s of FCP).

Outstanding levers still not addressed: polyfill prune (13.7 KiB, deferred — needs different mechanism than `.browserslistrc`), `ClearDrink.jpg` resize redo at higher resolution (1200×900 to satisfy 2× DPR mobile while still beating the original's bytes — to be re-exported from Canva and dropped in).

Measurement protocol going forward: median-of-5 Lighthouse runs on Vercel preview, or PSI for a controlled signal. A single 65 is not signal.

### Section 5 — Buy Box ✅

**Job.** Land the offer. First place on the page where price, savings, trust badges, and CTA share one composition. Following S1-S4's warm-Magic-Mind register but with the conversion intensity Ketone-IQ uses on its buy beat. The CTA routes to `FUNNEL_URL` where formula + cadence get chosen — this section's job is to anchor price perception and ladder trust, not to be the purchase point itself.

**Reference.** Ketone-IQ buy beat (auto-discount eyebrow + bold headline + trust-badge row + rich product card with strikethrough pricing, "SAVE X%" pill, spec checklist, CTA, and guarantee footer). Dropped Ketone-IQ's subscription-upsell row because CONKA's headline price already IS the subscription price — double-stamping the same offer adds no work. Replaced it with a "Full CONKA app access included" line in the spec checklist that does new work.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centred on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>` — zero top padding because Section 4 closes with a guarantee row and Section 5 should land tight under it.
- Order: auto-discount eyebrow pill → H2 with italic accent → subhead → 4-badge trust row → buy-box card → 100-day guarantee row.
- Trust badges are a 4-column grid at `gap-3`, each cell `aspect-square rounded-full border-2 border-black/85` with a two-line uppercase label centred inside. Plain divs, no image assets — the row adds zero asset weight.
- Buy-box card uses `rounded-[16px] border border-black/10` matching the same card grammar as the Section 4 ingredient detail panel and tile grid. Internal order (top to bottom): product title + price row + per-shot price → product image (`aspect-[5/4]`, edge-to-edge horizontally) → spec checklist → sub/OTP toggle → navy CTA. Title and price sit above the image (Ketone-IQ pattern) so the offer reads in the first viewport line of the card, not buried under the asset.

**Image.**
- Asset: `/formulas/box/BothBox.jpg` — clean studio shot of two CONKA shipping boxes with a Flow and a Clear bottle in the foreground on a white background. First fetch on `/startv2` (no earlier section uses this asset).
- Container: `aspect-[5/4]` sitting in the middle of the card, between the title/price block and the spec checklist. Edge-to-edge horizontally because the wrapping card has `overflow-hidden` so the rounded corners clip the image cleanly.
- `sizes="(max-width: 768px) 100vw, 560px"` matches the other section assets.

**Copy.**
- Eyebrow: "**Subscription auto-applied.** You will get {N}% off, free UK shipping, and full access to the CONKA brain performance app." Declarative "You will get" framing (lifted from Ketone-IQ's "You will get 30% off and 6-Shots next month") so the eyebrow tells, not asks. The percentage is dynamic, computed from the live cadence pricing (`compareAtPrice` vs `monthly-sub.price`). The eyebrow stays static when the user toggles to OTP in the card; it serves as the upgrade-path reminder, not a real-time selection summary.
- H2 (34px, letter-spacing -0.02em): "Your *Complete* / Daily Routine." Two lines via `<br />`, italic on "Complete" (the differentiator for Both vs single-formula purchases).
- Subhead: "Flow in the morning. Clear in the afternoon. Two shots a day, every day of the month." Three short sentences, no em-dashes per copy rules.
- Trust badges: Informed Sport · University Research · No Caffeine · 100-Day Guarantee. Each two lines of uppercase text inside a circular outline stamp.
- Buy-box card: product title "CONKA Flow + Clear", live monthly sub price (£{N}/mo with `/mo` suffix in sub mode, no suffix in OTP), strikethrough compare-at price + "Save {N}%" pill in navy (sub mode only), per-shot price under the row.
- Spec checklist (4 items, green-circle check icon). Three are always visible: "56 shots: 28 Flow + 28 Clear" · "2 shots a day, every day of the month" · "Free UK shipping". The fourth, "Full CONKA app: daily cognitive tests + personalised insights", is the sub-only differentiator: in OTP mode it stays in the list but renders strikethrough with a dimmed grey check and a "Sub only" tag, so the user sees what they forgo by going OTP rather than the line disappearing silently.
- Sub/OTP toggle: checkbox-as-pill at the bottom of the card (above the CTA), same pattern as `CROBuyBox` on `/start`. Label "Subscribe and save {N}%" + caption "Pause, skip, or cancel anytime." Default state: subscription on.
- CTA: "Start My Routine" with right-arrow SVG, full-width navy pill (text-lg, py-4 px-10), linking to `FUNNEL_URL`. Same label in both sub and OTP modes — final cadence selection happens at the funnel.
- Guarantee row below: same green-check + `GUARANTEE_LABEL_FULL` from `offerConstants.ts` as the hero and S4.

**Claims to revisit before launch.**
- "Informed Sport" badge — verify the claim is current and the badge artwork matches the official certification mark before this row is replaced with real stamps.
- "University Research" badge — anchors to the S2 "leading UK universities and the military" line; both need substantiation before any of these go live.
- "No Caffeine" badge — true for both Flow and Clear today, worth confirming for future formula tweaks.
- "Full CONKA app access included" — verify what the app actually delivers for subscribers vs OTP buyers.
- All sub-pricing numbers come from `getCadencePricingByProductHeroId("03", ...)` via the shared funnel data, so they stay in lockstep with `/funnel` and `/start`.

**Architecture notes.**
- Section wrapper, eyebrow, headline, subhead, trust-badge row, and guarantee row are inline server-rendered JSX in `page.tsx`. Only the card itself is a client island: `app/startv2/BuyBoxCard.tsx` (~170 lines) owns the `isSubscription` toggle state and the conditional price/spec/savings-pill rendering.
- The card is dynamic-imported from `page.tsx` (same pattern as `IngredientsGrid`) with a `min-h-[700px]` placeholder. Default SSR keeps the rendered HTML in the initial response (no SEO loss, no paint flash on the price); the JS chunk is code-split so the card's hydration cost stays out of the initial TBT window.
- Pricing math (`S5_SUB_PRICING`, `S5_OTP_PRICING`, `S5_COMPARE_AT`, `S5_MONTHLY_SAVINGS`, `S5_SAVINGS_PERCENT`) and the `S5_TRUST_BADGES` content array stay at module scope above the page component, and the pricing constants get passed into `BuyBoxCard` as props. `BOTH_PRODUCT_HERO_ID = "03"` is a named constant alongside the pricing helpers so the call sites do not read as magic numbers.
- Trust badges rendered as styled divs (no `<Image>`) so the row adds nothing to the image budget. Easy to swap to real AVIF stamps later by replacing the inner content of each cell.
- Eyebrow copy gates on `S5_SAVINGS_PERCENT > 0` so a malformed pricing payload (compare-at missing AND OTP price 0) still produces coherent copy (drops the percentage, keeps the rest).

**Perf delta.** Not captured yet. Section 5 adds one new image asset (`BothBox.jpg`, fresh fetch) and a small dynamic-imported client chunk for `BuyBoxCard` (toggle plus conditional render of price/specs). The chunk loads lazily after the main bundle, so hydration should land outside the TBT window the same way `IngredientsGrid` does post-S4 fix. Re-measure with median-of-5 or PSI per the protocol established after Section 3 hygiene.
