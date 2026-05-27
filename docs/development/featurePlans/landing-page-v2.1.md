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
3. Deploy. Run mobile Lighthouse. Compare to previous number. Capture both in the section brief below.
4. If perf passes the floor, the section is done. Add the next section's brief to this doc, then build it.
5. `/start` stays live. `/startv2` only becomes the new `/start` when all 11 sections are finished and a deliberate cutover happens.

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

- **Lighthouse mobile:** TBD on first deploy
- **What's on the page:** `<main>` + Navigation + Footer. Nothing else.

### Section 1 — Hero

_TBD — design conversation pending._
