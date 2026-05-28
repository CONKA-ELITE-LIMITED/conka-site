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

`n/c` = not captured (we deployed but did not record the run). Future deploys, capture every time.

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
