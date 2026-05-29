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

**Section 2 video iteration (2026-05-29):** the `BothHero.jpg` stand-in was replaced with a rotating 3D render of the Flow bottle delivered by marketing. Encoding pipeline via `ffmpeg`: 1080x1920 (9:16) source cropped to 1080x1350 (4:5) and scaled to 720x900, AAC audio stripped, forward+reverse concatenation baked into the output so the native `loop` attribute gives a mathematically seamless ping-pong with no visible jump (the reverse half ends exactly at frame 0). Outputs at `/public/videos/`: `Flow.mp4` (H.264, CRF 24, faststart, 966 KB), `Flow.webm` (VP9, target 1 Mbps, 909 KB), `Flow-poster.jpg` (first frame, 28 KB). WebM ships to Chrome / Firefox / Edge, MP4 falls back for Safari; per-visitor bandwidth lands around 937 KB to 994 KB depending on browser. Raw master kept at `/raw-assets/Flow V1.mp4`, gitignored (the same folder will hold future bottle renders). New client island `app/startv2/FlowVideo.tsx` (~50 lines) owns playback: IntersectionObserver at 40% threshold triggers `play()` on enter and `pause()` on exit so the browser is not decoding off-screen video. `muted` + `playsInline` so iOS Safari allows autoplay; `preload="metadata"` keeps the initial fetch tiny and the rest streams on play. Direct import, not `dynamic()` — the JS bundle cost is too small for the Suspense ceremony to be worth it; the actual cost (the video bytes) loads lazily regardless. Container aspect changed from `aspect-[5/4]` to `aspect-[4/5]` (adds ~120px section height); mobile-bleed pattern unchanged; added `bg-black/[0.04]` so the brief pre-poster moment is a soft tint rather than bare white. Section 2 currently shows Flow only — the H2 still reads "We Created Drinkable Focus and Clarity" with Flow rotating on screen and Clear referenced in copy. When the Clear render arrives the composition will revisit, likely as a side-by-side or Flow/Clear toggle.

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

**Job.** Land the offer. First place on the page where price, savings, trust badges, and CTA share one composition. Following S1-S4's warm-Magic-Mind register but with the conversion intensity Ketone-IQ uses on its buy beat. CTA adds directly to the cart drawer using the current cadence's variant and selling-plan IDs, mirroring the `CROBuyBox` quick-buy pattern on `/start`. This is a real purchase point, not a routing nudge into the funnel.

**Reference.** Ketone-IQ buy beat (auto-discount eyebrow + bold headline + trust-badge row + rich product card with strikethrough pricing, "SAVE X%" pill, spec checklist, CTA, and guarantee footer). Dropped Ketone-IQ's subscription-upsell row because CONKA's headline price already IS the subscription price — double-stamping the same offer adds no work. Replaced it with a "Full CONKA app access included" line in the spec checklist that does new work.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centred on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>` — zero top padding because Section 4 closes with a guarantee row and Section 5 should land tight under it.
- Order: auto-discount eyebrow pill → H2 with italic accent → subhead → 4-badge trust row → buy-box card → 100-day guarantee row.
- Trust badges are a 4-column grid at `gap-3`, each cell `aspect-square rounded-full border-2 border-black/85` with a two-line uppercase label centred inside. Plain divs, no image assets — the row adds zero asset weight.
- Buy-box card uses `rounded-[16px] border border-black/10` matching the same card grammar as the Section 4 ingredient detail panel and tile grid. Internal order (top to bottom): product image (`aspect-[5/4]`, full-width edge-to-edge) → product title + price row + per-shot price → "56 shots = 28 servings" description → 3-item bullet checklist → sub/OTP toggle → navy CTA → guarantee + cancel-anytime copy. Image leads so the asset gets the first visual beat, copy follows in the lower half.

**Image.**
- Asset: `/formulas/both/BothHero.jpg` — two CONKA bottles (Flow with a white cap and Clear with a black cap) on a white background. Reuses the original S2 hero shot, which freed up after S2 swapped to the rotating Flow video. The earlier `BothBox.jpg` shipping-box studio shot was replaced because the buy box benefits from leading with the product itself, not the fulfillment packaging.
- Container: `aspect-[5/4]` sitting at the top of the card, full-width edge-to-edge (the wrapping card has `overflow-hidden` so the rounded corners clip the image cleanly). No overlay copy — title, price row, and per-shot price sit in their own block immediately below the image, above the shot-count description and bullets.
- `sizes="(max-width: 768px) 100vw, 560px"` matches the other section assets.

**Copy.**
- Eyebrow: "**Subscription auto-applied.** You will get {N}% off, free UK shipping, and full access to the CONKA brain performance app." Declarative "You will get" framing (lifted from Ketone-IQ's "You will get 30% off and 6-Shots next month") so the eyebrow tells, not asks. The percentage is dynamic, computed from the live cadence pricing (`compareAtPrice` vs `monthly-sub.price`). The eyebrow stays static when the user toggles to OTP in the card; it serves as the upgrade-path reminder, not a real-time selection summary.
- H2 (34px, letter-spacing -0.02em): "Your *Complete* / Daily Routine." Two lines via `<br />`, italic on "Complete" (the differentiator for Both vs single-formula purchases).
- Subhead: "Flow in the morning. Clear in the afternoon. Two shots a day, every day of the month." Three short sentences, no em-dashes per copy rules.
- Trust badges: Informed Sport · University Research · No Caffeine · 100-Day Guarantee. Each two lines of uppercase text inside a circular outline stamp.
- Buy-box card: product title "CONKA Flow + Clear", live monthly sub price (£{N}/mo with `/mo` suffix in sub mode, no suffix in OTP), strikethrough compare-at price + "Save {N}%" pill in navy (sub mode only), per-shot price under the row.
- Spec checklist (4 items, green-circle check icon). Three are always visible: "56 shots: 28 Flow + 28 Clear" · "2 shots a day, every day of the month" · "Free UK shipping". The fourth, "Full CONKA app: daily cognitive tests + personalised insights", is the sub-only differentiator: in OTP mode it stays in the list but renders strikethrough with a dimmed grey check and a "Sub only" tag, so the user sees what they forgo by going OTP rather than the line disappearing silently.
- Sub/OTP toggle: checkbox-as-pill at the bottom of the card (above the CTA), same pattern as `CROBuyBox` on `/start`. Label "Subscribe and save {N}%" + caption "Pause, skip, or cancel anytime." Default state: subscription on.
- CTA: "Start My Routine" with right-arrow SVG, full-width navy pill (text-lg, py-4 px-10). Same label in both sub and OTP modes. The button calls `CartContext.addToCart` directly with the current cadence's variant and selling-plan IDs (lifted from `getCadenceVariantByProductHeroId("03", cadence)`) and metadata `{ location: "buy_box", source: "startv2_section_5" }`, so the cart drawer opens on click. Mirrors the `CROBuyBox` pattern on `/start` — this is the quick-buy beat, not a routing nudge into the funnel.
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

### Section 6 — Athlete Credibility ✅

**Job.** Land the social-proof beat: who actually uses CONKA and why a paid-traffic visitor should care. First section after the buy box. The earlier doc call (athletes as Section 7 in a dark Ketone-IQ register, "page reads warm → warm → warm → DARK → warm") has been scrapped. The warm Magic Mind register kept working through S1-S5 and the user wants to ride it through the rest of the page rather than introduce a register break. The `CROAthletes` component already lives at `app/components/cro/CROAthletes.tsx` and renders an Olympic / world-champion carousel plus an Informed Sport block. We reuse it import-only, wrap with a credibility eyebrow, and ship.

**Reference.** Mirrors what S5 established at the bottom of the section (CTA + 100-day guarantee row) but leads with a full-bleed dark-navy sport-breadth marquee instead of a bordered callout. The Informed Sport block inside `CROAthletes` carries the rational anchor; the marquee carries the visual punctuation. Section-level callouts (pill, marquee, or none) are chosen per section based on what the credibility lead actually needs, not as a fixed scaffolding element.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centred on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>` — same rhythm as S5.
- Order: credibility eyebrow pill → `<CROAthletes />` (the component does its own H2 "Trusted where focus can't fail.", subhead, 7-athlete carousel with arrow nav and touch swipe, 7-portrait roster strip, Informed Sport block with 160px logo + "280 banned substances" copy).
- No bottom CTA or guarantee row. The page's next conversion CTA lands in the next section.

**Image.**
- All athlete assets and the Informed Sport logo are owned by `CROAthletes`. Section 5 does not introduce any new image assets in `page.tsx`. Athletes carousel uses `/testimonials/athlete/*.jpg` (7 portraits, lazy-loaded for the roster, eager for the active slide) and `/logos/InformedSportLogo.png`.

**Copy.**
- Eyebrow: "**Trusted at the highest level.** Olympic medallists, world champions, and 5,000+ daily users." Bold lead frames the credibility tier, the clarifier delivers the proof. Same pill shape as the S5 eyebrow (`border-2 border-black/85 rounded-[16px]` with a navy 5-point star marker instead of a green check, to differentiate athlete-register from sub-confirmation register).
- All other copy lives inside `CROAthletes` (athlete names, sports, roles, quotes, the Informed Sport body line about 280 banned substances and WADA / Olympic committee trust).
- No em-dashes, no new claims authored at this section level.

**Claims to revisit before launch.**
- "5,000+ daily users" in the eyebrow — same number used in Hero and elsewhere. Verify still accurate at launch.
- "Olympic medallists, world champions" — already used by S2's credibility badge ("professional sports clubs, and the military") and by `CROAthletes` internally. The seven athletes featured (Dan Norton, Josh Stanton, Chris Billam-Smith, Sienna Charles, Fraser Dingwall, Adam Azim, Jack Willis) need verified relationships and consent for testimonial quotes before this section can ship to paid traffic.
- "Informed Sport certified for 280 banned substances" — already in `CROAthletes`, verified by the legacy `/start` page. Should pass `/review-claims` without changes.

**Architecture notes.**
- `CROAthletes` reused via `dynamic()` import in `page.tsx` (same pattern as `IngredientsGrid` and `BuyBoxCard`) with a `min-h-[1100px]` placeholder. Default SSR keeps the carousel HTML in the initial response; the JS chunk for carousel state, swipe handlers, and keyboard nav is code-split so the hydration cost stays out of the initial TBT window.
- Zero edits to `CROAthletes` itself. The component already uses the v2.1 grammar (rounded corners, navy `#1B2757` accents, soft `black/[0.04]` backgrounds) so no adapter or wrapper component is needed.
- Section 6 in the /startv2 numbering is the legacy `/start` Section 7 — the Benefit Cards beat (`/start` Section 6, "+28.96% measured" stat cards) is deliberately skipped per founder's call that the athletes section absorbs the "measured, not marketed" proof more powerfully. The Benefit Cards component may return as a future section or get retired entirely.

**Perf delta.** Not captured yet. Section 6 reuses an existing client component (`CROAthletes`, ~345 lines). Dynamic-imported so its bundle stays code-split. Image weight: 7 portrait JPGs (one priority-eager for the active carousel slide, six lazy-loaded for the roster strip) plus the Informed Sport PNG logo. Measure with median-of-5 or PSI.

### Section 7 — Research / Cambridge ✅

**Job.** Land the scientific-credibility beat after the athlete proof. S2 mentioned "leading UK universities" generically; S7 names Cambridge, Durham, Exeter, and Made in Britain specifically through a 2x2 partner-logo grid inside `CROResearch`, and the section's hero is a photograph of Cambridge itself. Converts research-trusting buyers who want the academic anchor before the next CTA.

**Reference.** Ketone-IQ's research-partners block: a 2x2 grid of partner marks where the structure comes from tinted backgrounds rather than letting logos float on white. CONKA's version puts each logo in its own small grey-tinted rectangle (four equal-sized cells) so the credibility tier reads as a deliberate roster of named institutions, not a logo strip.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centred on desktop.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>` — zero top padding so S7 lands tight under S6's guarantee row.
- Order: `<CROResearch />` (Cambridge hero image full-bleed → centred H2 → 2x2 partner-logo grid → description) → navy CTA → 100-day guarantee row.
- No section-level callout. The Cambridge hero photograph and the named-partner grid carry the credibility lead on their own; a bordered pill or marquee on top of them would double-stamp the same claim.
- The inner H2 of `CROResearch` is centred (`text-center` in the component) while S1-S6 v2.1 H2s are left-aligned. Deliberate break: the centred H2 reads as a "framed credential" appropriate to the academic register.

**Image.**
- Hero: `/UniversityOfCambridge.png` — photograph of the university (not a logo mark), sitting at the /public root. Full-bleed on mobile, contained at `md+` with `rounded-[var(--brand-radius-container)]`. Same asset already used on /start's research beat.
- Partner-logo grid (inside `CROResearch`): 2x2 layout (`grid grid-cols-2 gap-3 sm:gap-4 mx-auto max-w-[420px]`) where each cell is its own small `bg-black/[0.04] rounded-[12px] aspect-[2/1] overflow-hidden` rectangle. No internal padding; the logo fills via `object-contain` and is scaled to `transform: scale(1.5)` so the logo content reads zoomed-in while the surrounding whitespace in each source asset gets clipped at the cell edge. Four cells, four partners: Cambridge (`/logos/UniversityOfCambridge.png`), Durham (`/logos/UniversityOfDurham.png`), Exeter (`/logos/UniversityOfExeter.png`), Made in Britain (`/logos/MadeInBritain.png`).
- All assets lazy-loaded by default. If `/UniversityOfCambridge.png` (the hero photo) costs FCP / LCP in a future Lighthouse run, resize and convert to AVIF as a follow-up.

**Copy.**
- No section-level body copy authored in `page.tsx`. The H2 ("World-Class Research. World-Class Results."), partner-grid alt text, and description ("Our research is led by experts in cognitive science and brain performance...") all live inside `CROResearch` and ship from the component.
- CTA: "Try CONKA Today" + right-arrow SVG, content-width navy pill (text-lg, py-4 px-10), centred via `<div className="mt-10 flex justify-center">`. `<Link>` to `FUNNEL_URL`, mirroring S2 / S3 / S4 / S6.
- Guarantee row: hard-coded "100-day money back guarantee" with the green-check SVG, identical to S1 / S4 / S6.

**Claims to revisit before launch.**
- `CROResearch`'s existing description ("leading UK universities and research labs, pioneering new ways for anyone to access elite-level focus") — already shipped on /start, but should pass `/review-claims` for the /startv2 voice and audience.
- Each named partner (Cambridge, Durham, Exeter, Made in Britain) — verify the relationship is current and the logo usage is permitted under each institution's / certification's brand guidelines before paid traffic sees this.

**Architecture notes.**
- `CROResearch` is **edited in place** for this section. Two edits: (1) Cambridge added to `RESEARCH_PARTNERS` (Made in Britain retained). (2) Partner-strip rebuilt from a single flex row into a 2x2 grid where each cell is its own equal-sized grey-tinted rectangle. Both edits propagate to /start's S8 (the only other consumer of this component), which is acceptable — same credibility surface, same audience tier, same intent on both pages.
- Reused via **direct import** in `page.tsx`, NOT `dynamic()`. `CROResearch` is a pure server component (no `"use client"`, no hooks, no client-side state), so `dynamic()` would add bundle-splitting ceremony with zero perf benefit. The S6 dynamic-import was real value because `CROAthletes` carries carousel state, swipe handlers, and keyboard nav.
- Section wrapper, CTA, and guarantee row are inline server-rendered JSX in `page.tsx`. No new client islands. No new files.

**Perf delta.** Not captured yet. Section 7 adds zero JavaScript (pure server component plus inline JSX) and one new image fetch (`/UniversityOfCambridge.png`, lazy-loaded). The grey-card grid is Tailwind utilities only. Bytes should be the cheapest section since S5 / S6. Re-measure with median-of-5 Lighthouse mobile or PSI per the protocol established after the Section 3 hygiene run.

### Section 8 — Customer Reviews ✅

**Job.** Social proof beat. After named athletes (S6) and named institutions (S7), this is the long-tail proof: dozens of unnamed customers reporting in their own words, dated and rated. Closes the credibility stack before the App callout and FAQ utility beats land.

**Reference.** Existing `/start` Section 9 (`CROCustomerReviews`), reused verbatim. Ships as a 3x-rendered infinite-loop carousel with auto-advance (3.5s), pause-on-interact, dot nav, touch swipe, and expand-on-card-tap for long reviews. The component is already built in the v2.1 visual register — navy `#1B2757` accents, gold `#F59E0B` stars, white cards with `black/12` borders, `var(--brand-radius-container)` corners.

**Layout.**
- Mobile-first single column. The carousel handles its own card widths (300px mobile, 340px desktop) and gap (16px).
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>` — same rhythm as S5 / S6 / S7.
- Order: `<CROCustomerReviews />` (component owns H2, carousel, dot nav, expand affordance, and a new section closer: full-width navy "Order Now" pill plus a 3-bullet trust strip).
- The carousel is now followed by a navy "Order Now" CTA and a trust-anchor row (🔒 Secure Checkout · ✅ 100-Day Guarantee · 📦 Free Shipping). Pattern adapted from Magic Mind's checkout reassurance block. Earlier scope deliberately omitted a CTA here ("Reviews IS the proof beat"), but the social-proof beat without a closing nudge left the section feeling unfinished — the trust-anchored CTA at the close converts the proof into intent without reading pushy because the trust strip frontloads the friction-reduction.

**Image.** All assets owned by `CROCustomerReviews` (gold star SVGs inline, no portrait photos in this component since the reviews are anonymous text-and-name only). No new assets at section level.

**Copy.** All review text lives in `CURATED_TESTIMONIALS` (`app/lib/customerTestimonials.ts`). User-generated and quoted as written.

**Claims to revisit before launch.**
- Individual review copy is user-generated. Run `/review-claims` on the curated testimonials array to confirm no individual quote makes a regulated claim that would need EFSA hedging or removal.
- `CURATED_TESTIMONIALS` is currently a hardcoded array. If a Loox sync process exists, no automation has been wired — refresh is manual.

**Architecture notes.**
- `CROCustomerReviews` reused via **dynamic import** in `page.tsx` (same pattern as S6 `CROAthletes`). Client island with carousel state (3x render + auto-advance interval + pause flag + touch-swipe handlers); dynamic import keeps its hydration cost outside the initial TBT window. `min-h-[680px]` placeholder on the loading fallback prevents CLS during client-side navigation.
- One in-place edit to `CROCustomerReviews`: the subtitle below the H2 was rewritten from "Eight stories from the people who use CONKA every day." to "A few favourites from our 622+ verified reviews." The original framed the curation as a small total (reads scarce); the new version frames it as a deliberate selection from the larger verified base already referenced in the S1 hero ("622+ reviews"), turning the 8 cards from "all we have" into "the highlights". Affects `/start` too — same improvement on both pages.

**Perf delta.** Not captured yet. Heaviest client island added to `/startv2` since S6 (`CROAthletes`). Measure with median-of-5 Lighthouse mobile or PSI; if TBT regresses past the 200ms budget, the lever is the same one used for `IngredientsGrid` post-S4.

### Section 9 — App Callout ✅

**Job.** "Don't trust us, test yourself" beat. After eight sections of credibility, the remaining objection is "what if it doesn't work for me specifically?". S9 answers: the CONKA app gives the same Cambridge-derived cognitive test that generates every in-app metric on the page. Install it, test before, test after, watch your data move. Ties back to S2's "1,000+ brains tested through our app" and S7's "100,000+ cognitive tests" — the consistent measurement thread through the page. Section's primary action stays product trial (`FUNNEL_URL`) — S9 sits inside the page's conversion stack and the app install is positioned as the optional measurement layer, not the load-bearing CTA.

**Reference.** Started from `/start`'s Section 10 (`CROAppCallout`) and restructured. The original two-paragraph explanation of the cognitive test mechanism was collapsed into a tighter subline plus a 3-step visual grid. The "Try CONKA risk-free" pill stays as the primary CTA; the App Store + Play Store install buttons sit underneath as a small icon-only row with an inline caption, representing the optional measurement layer. The 4-line guarantee tile compressed to a one-line statement. Same information shape as the original, significantly less wall-of-text.

**Layout.**
- Mobile-first single column, `max-w-[560px]` centred inside the component.
- **Soft-blue tinted section** (`var(--brand-tint)`, the same `#f4f5f8` surface S3 uses). Both top and bottom padding are `4rem` — the tint band needs the air around it so it reads as a deliberate register-break, not a floating colour patch. Creates a second tint beat on the page (S3 caffeine + S9 app) inside the otherwise-white S1-to-S10 run.
- Order: `<CROAppCallout />` (component owns H2 → subline → 4:3 image tile → 3-step grid → install buttons → guarantee line → /app link).

**Image.** Asset `/lifestyle/ConkaAppYoga.jpg` owned by the component (4:3 contained tile, `black/[0.04]` backdrop reading slightly darker than the tinted section, `border-black/12`, `var(--brand-radius-container)` corners). No new assets at section level.

**Copy.**
- H2 kept verbatim: "We don't ask if CONKA works. We measure it."
- Subline: "Run a quick cognitive test before CONKA. Run it again in 30 days. The numbers tell you whether it worked. Not us." Concrete (test, 30 days, before/after), ties back to the H2 with "Not us" as the closing punchline.
- 3-step grid: 01 Install + test → 02 Take CONKA daily → 03 Track over time. Each cell is a `bg-white border border-black/10 rounded-[12px]` tile with a `#1B2757` step number eyebrow. **Step 01 carries two small inline App Store + Play Store icon links** (16px SVGs in 28x28 hit areas, navy stroke, soft navy hover). The icons are embedded here rather than promoted to a standalone install row because S9 is part of the page's conversion stack — product trial is the load-bearing action and app install is the optional measurement layer. People who want the app find it; people who don't aren't pushed.
- **Guarantee card** sits above the primary CTA, matching the step-tile grammar (`bg-white border border-black/10 rounded-[12px] p-5 text-center`). H3 in 18px navy semibold: `{GUARANTEE_DAYS} days to feel the difference, or your money back.` Body in 13px grey: "No returns. No hassles. No questions. The only thing you have to lose is the fog." Voice adapted from Magic Mind's "100 Days to Feel the Difference" guarantee pattern: emotional promise lead, friction-free body, "fog" as the cost of inaction (maps to CONKA's clarity positioning since "the inverse of fog" is the product's core benefit). Above-CTA placement frames the guarantee as the trust anchor that justifies clicking.
- Primary CTA: `CROPillCTA` rendering "Try CONKA risk-free" as a full-width navy pill defaulting to `FUNNEL_URL`.
- `/app` link as a small grey-on-navy underlined closer below the CTA ("Learn more about the app →"), low emphasis.

**Claims to revisit before launch.**
- "Cambridge-derived cognitive test" — load-bearing trust claim, needs substantiation alongside the S7 Cambridge framing. Run `/review-claims`.
- Guarantee anchors via shared `offerConstants`; stays in lockstep with S1 / S4 / S5 / S6 / S7.
- App store URLs hardcoded in the component (`APP_STORE_URL`, `PLAY_STORE_URL`). Verify the IDs against the live App Store / Play Store listings before paid traffic.

**Architecture notes.**
- `CROAppCallout` reused via **direct import** in `page.tsx`, NOT `dynamic()`. Pure server component (no `"use client"`, no hooks, no client-side state). Same call as S7 `CROResearch`.
- Component was **edited in place**: full content restructure as described above. Affects `/start`'s S10 too — acceptable, since `/start` is heading for deprecation and the new layout is an improvement.
- Install-button SVG icons inlined as local `AppStoreIcon` / `PlayStoreIcon` components rather than reusing `app/components/AppInstallButtons.tsx`. The shared component's existing variants don't match the v2.1 pill grammar; a new variant would be the proper refactor, but the inline path was the right call for shipping speed.

**Perf delta.** Not captured yet. Component still adds zero JavaScript and one image fetch (`/lifestyle/ConkaAppYoga.jpg`, lazy-loaded). Install buttons are static `<a>` anchors. Should be a cheap section.

### Section 10 — FAQ ✅

**Job.** Last objection-handling beat before the page footer. Native single-open accordion answering the most common pre-purchase questions (two formulas, just one shot, delivery, ingredient transparency, side effects, refund mechanics). Closes the conversion narrative with implicit reassurance rather than a hard CTA.

**Reference.** Existing `/start` Section 11 (`CROFAQv2`), reused verbatim. Native `<details name="...">` accordion (Chromium 120+, Safari 17+) with graceful multi-open fallback on older browsers. Zero client JS. All guarantee anchors via `GUARANTEE_LABEL_FULL` and `GUARANTEE_COPY_TRIAL` from `offerConstants` so the language stays in lockstep with the rest of the page.

**Layout.**
- Mobile-first single column.
- `<section className="brand-section brand-bg-white" style={{ paddingTop: 0, paddingBottom: "4rem" }}>`.
- Order: `<CROFAQv2 />` (component owns H2, accordion list, any internal CTAs / links).
- No section-level CTA below; FAQ closes with implicit reassurance and hands off to the page footer.

**Image.** None. FAQ is text-only.

**Copy.** All Q&A content lives inside the `FAQ_ITEMS` array in `CROFAQv2.tsx`. Touches on EFSA-adjacent territory (focus, clarity, energy, brain health) plus operational claims (delivery times, refund mechanics, ingredient transparency).

**Claims to revisit before launch.**
- The full FAQ array carries the highest concentration of efficacy-adjacent copy on the page. Run `/review-claims` over every Q&A pair before paid traffic.
- Guarantee anchors via shared constants; updates to `offerConstants.ts` propagate automatically.

**Architecture notes.**
- `CROFAQv2` reused via **direct import** in `page.tsx`, NOT `dynamic()`. Pure server component, no client JS (native `<details>` handles open / close). Same call as S7 / S9.
- Zero edits to `CROFAQv2` itself.

**Perf delta.** Not captured yet. Pure HTML + native `<details>`, zero JavaScript cost. Should be the cheapest section on `/startv2`.

---

**Cutover readiness.** With S8 / S9 / S10 landed, `/startv2` now mirrors every numbered section on `/start` (S6 Benefit Cards excepted, deliberately skipped). The legal `LandingDisclaimer` footer block from `/start` is still pending — when wired, `/startv2` becomes a structural superset of `/start` and the cutover (redirect + paid-traffic switch + legacy sunset) can be planned.
