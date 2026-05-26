# Landing Page V2 — Soften /start for DTC Conversion

## Problem

`/start` has been live as our paid-traffic landing page for several months. Conversion is below target. The working hypothesis is that the clinical-grammar aesthetic (zero radius, mono labels, `// SCI-01` eyebrows, hairline borders, "Fig. 01 · Time in effect" framing) reads as too cold and too data-dense for cold paid traffic — particularly cold Meta traffic, where the user has zero brand awareness and is on a phone, comparing against ten other products they just scrolled past.

The clinical grammar works on `/conka-flow`, `/conka-clarity`, and `/conka-both` because those visitors have already shown intent. On `/start`, it's a barrier.

## Who it serves

Cold paid Meta and Google traffic landing on the site for the first time with no prior brand exposure.

## Business impact

Direct conversion improvement on our primary acquisition funnel. With current ad spend behind `/start`, even a small CR uplift compounds significantly. The same uplift also improves blended ROAS and lowers effective CAC.

## Build target

**Figma mockups → Next.js render on `/start`.** Earlier exploration considered Replo on a subdomain; we are not going that route. V2 ships in the codebase as a refactor of the existing `/start` page.

## Appetite

Section-by-section. Each section will be scoped, designed in Figma, and implemented as a separate piece of work rather than one large sprint. Detailed estimates emerge when each section is picked up. The whole rebuild is expected to span several weeks of design + engineering, interleaved with normal work.

## Approach

**Two-stage per section:**
1. Figma mockup + content sign-off (design-led)
2. Next.js implementation on `/start` (engineering-led)

**Design direction:** move `/start` (and only `/start`) away from the clinical aesthetic toward a more conventional DTC visual vocabulary. Other clinical pages — home, `/conka-flow`, `/conka-clarity`, `/conka-both`, `/science`, `/our-story` — are not in scope and must not regress.

**Visual reframe — concrete shifts:**
- Softer geometry — light rounding (8–12px on cards, modest radius on CTAs) instead of clinical 0px
- Warmer typographic hierarchy — fewer mono eyebrows, fewer "FIG. 01 · SECTION-NN" lab labels, larger body text, more whitespace
- More lifestyle and product imagery — including bold, slightly wacky product/ingredient renders (per Section 4)
- Stronger emotional hooks — turn "2pm crash" and "longer afternoons" into visceral, visual arguments rather than chart-led proof
- Less density — fewer claims per viewport, bigger hero stats, more scannable

**Design references** (called out in the section briefs below):
- **Ketone-IQ homepage** — overall design / layout inspiration. Specific patterns called out: floating spinning product bottle (Section 2), "quick purchase" buy box (Section 5), "benefits of daily use" structure (Section 6), university research treatment (Section 8), custom icon system across the page
- **8 Hours** — ingredients panel treatment (Section 4), % increase benefit cards (Section 6)

**Direction confirmed by marketing (2026-05-26):**
- **Colour:** white background, black + grey accents (matches existing brand-base)
- **Typography:** Favorit was the target font, but **deferred** — we use existing Neue Haas Grotesk for now and revisit fonts later (Favorit needs a Dinamo Web License or we swap to a free equivalent like Inter)
- **Imagery direction:** more lifestyle, vibey, aspirational — "buying into the lifestyle they want", not corporate/boring. Action item for marketing to source new shots
- **Custom icon system:** CONKA-specific icons for recurring concepts — brain, bottle, energy, etc. — similar to how Ketone-IQ uses a consistent icon language across their page. Action item for design. These replace the current mono-eyebrow `// SECTION-NN` labels in many places
- **Product carousel imagery:** each image should be annotated — overlay diagrams, callouts, text labels — so visual benefits land without reading body copy. Currently the carousel is bottle photography only
- **Copy direction:** lean into the ad angles that are converting well on Meta. Henry is putting together a synopsis of which angles are working — copy direction is gated on that

**Component strategy** (from the `/start` audit):

| Component | Strategy |
|---|---|
| `CROHero`, `CROFormulaSplit`, `CROTestimonials`, `CROGuarantee`, `CROFAQ`, `CROFinalCTA` | Edit in place — only used on `/start`, zero blast radius |
| `LandingValueComparison` | **Fork** to `CROValueComparison` — shared with 3 other pages, must not regress them |
| `LandingDisclaimer` | Edit in place if visual only; flag for legal review if copy changes |
| `ConkaCTAButton`, `LabTrustBadges`, `IngredientsPanel` | Do not touch — shared primitives across the site. If V2 needs a softer variant, fork to a wrapper |
| `Navigation`, `Footer` | Out of scope |
| **New sections (2, 5, 6, 7, 8, 10)** | New components under `app/components/cro/` |

**Design system:** stay on `brand-base.css` tokens but allow `/start` to override radius and accent treatment locally via a scoped class (e.g. `brand-v2`) rather than introducing a new global system.

---

## Section plan

V2 introduces 11 sections (up from 8 on the current `/start`). Reordered and partly new. The new architecture leads with emotional hooks earlier and pushes proof-density deeper into the page rather than front-loading it.

| # | Section | Status | Maps to (current) |
|---|---|---|---|
| 1 | Hero + trust badge | Mockup exists, needs port | `CROHero` |
| 2 | "We created drinkable focus" | New | — |
| 3 | Coffee vs CONKA (simplified) | Existing, needs fork + simplify | `LandingValueComparison` |
| 4 | AM/PM toggle + ingredient close-ups | Existing, needs deeper restyle | `CROFormulaSplit` |
| 5 | First buy box (quick purchase) | New | — |
| 6 | % increase benefit cards | New | — |
| 7 | Athlete + Informed Sport | New (currently scattered as trust signals) | — |
| 8 | University research / Cambridge | New | — |
| 9 | Customer social proof | Existing, restyle | `CROTestimonials` |
| 10 | App callout + data/science | New | (some content currently in `CROGuarantee`) |
| 11 | FAQ | Existing, restyle | `CROFAQ` |
| — | Disclaimer footer | Keep | `LandingDisclaimer` |

Sections will be scoped, ticketed, and built **one at a time**, in whatever order makes most sense at the time. The list below is the brief for each — not a sprint backlog.

### Section 1 — Hero
- Mockup already exists. Engineering scope is small: add a trust badge to the hero image and port the Figma render into the existing `CROHero` component.
- Preserve avatars + ★★★★★ + Informed Sport trust band

### Section 2 — "We created drinkable focus" (NEW)
- Floating product bottle (one or both shots) — Ketone-IQ-style spinning animation if feasible
- Header: **"We created drinkable focus."**
- Copy: investment / trials / development story (TBC with marketing)
- Hero stat: % increase in brain performance metric (TBC — need to choose which metric)
- CTA: "Order now"

### Section 3 — Coffee vs CONKA (simplify)
- Header: **"Two shots, built around your day."**
- Current `LandingValueComparison` chart is directionally right but too dense. Strip labels, friendlier hour ticks, hero stat above the chart, less mono. Reference: brainstorm earlier in the implementation conversation.
- **Fork to `CROValueComparison`** — do not modify the shared `LandingValueComparison`
- CTA: "Try from £1.62 per day"

### Section 4 — AM/PM toggle + ingredient close-ups
- Header: **"Why your afternoons feel longer than your mornings."**
- AM/PM toggle (sun + moon emojis or icons)
- When selected, swap to bold close-up bottle image of Flow or Clear
- Replace the current ingredients drawer with a concise **inline** ingredients panel underneath the bottle:
  - Lead with benefit, not dose
  - "Wacky / unclinical" ingredient imagery — should not feel like a supplement facts panel
  - Reference: 8 Hours ingredients section, replaced with CONKA ingredients
- The tabbed AM/PM layout already exists from the recent `CROFormulaSplit` refactor — this section deepens it visually with the ingredient panel

### Section 5 — First buy box (NEW)
- Header copy: **"Try your first shot today."**
- Quick-purchase widget — sends straight to Shopify checkout (no cart drawer detour)
- Reference: Ketone-IQ "quick purchase" section
- Two FAQ-style dropdowns below the buy box:
  - "What's in it?"
  - "Where do we ship?"

### Section 6 — % increase benefit cards (NEW)
- Lead with % increases in specific cognitive metrics
- Each card expandable into "how this helps someone" detail
- References: 8 Hours benefits cards, Ketone-IQ "benefits of daily use"
- Source of %s: needs alignment with `docs/branding/BRAND_VOICE.md` proof points and the app-insights data

### Section 7 — Athlete + Informed Sport (NEW)
- Athlete imagery — high-volume, lifestyle/action shots
- Inline explanation of Informed Sport certification: what it means, why CONKA has it
- Visual style: matches the new V2 grammar (warmer, more lifestyle)

### Section 8 — University research / Cambridge (NEW)
- Reference: Ketone-IQ university research section
- Cambridge University imagery + logos of partner institutions
- Tie back to the cognitive test credentials currently in `LandingDisclaimer` footnote `^^`

### Section 9 — Customer social proof (restyle)
- Same source data as current `CROTestimonials` (`app/lib/customerTestimonials.ts`)
- Restyle to match V2 grammar — softer cards, more visual weight per review
- Source as many photos as possible of customers holding the product (action item for marketing)

### Section 10 — App callout (NEW dedicated section)
- Why we have an app + photo of someone using it
- "Data / science behind it" sub-block — granular detail for the buyers who want to understand the measurement methodology
- This block is allowed to be denser / more technical — it serves the analytical buyer, not the cold ad-click
- Link to download (App Store + Play Store)

### Section 11 — FAQ (restyle)
- Same 5 questions as current `CROFAQ`
- Restyle to match V2 grammar
- Confirm question set during section scoping

### Disclaimer footer
- Keep `LandingDisclaimer` as-is unless visual change is needed
- Any copy change to footnotes requires `/review-claims` first

---

## Phase status (by section)

| Item | Status |
|---|---|
| Typography (Favorit vs Inter vs keep Neue Haas) | **Deferred** — keep Neue Haas for V2 v1, revisit later |
| Custom icon system (brain, bottle, energy) | Not started — design action |
| Lifestyle imagery refresh | Not started — marketing action |
| Annotated product carousel imagery | Not started — design + marketing action |
| Ad-angle copy synopsis from Henry | Pending |
| Section 1 — Hero | Mockup ready, port pending |
| 2 — Drinkable focus | Not started — needs Figma + content |
| 3 — Coffee vs CONKA | Not started — needs Figma direction |
| 4 — AM/PM + ingredients | Tab toggle shipped, ingredients panel restyle pending |
| 5 — Buy box | Not started — needs Figma + Shopify checkout wiring |
| 6 — % benefit cards | Not started — needs %s confirmed + Figma |
| 7 — Athlete + Informed Sport | Not started — needs imagery + Figma |
| 8 — University research | Not started — needs imagery + logo permissions |
| 9 — Customer social proof | Not started — needs new customer photos |
| 10 — App callout | Not started — needs imagery + Figma |
| 11 — FAQ | Not started |
| Disclaimer | No change planned |

Each section gets its own Jira ticket when picked up, scoped from this brief.

---

## Constraints (non-negotiable)

- **`/start` remains noindex/nofollow** — paid-traffic only
- **EFSA claims compliance** — all anchor footnotes (`†`, `††`, `‡`, `§`, `¶`, `^^`, `*`) must continue to resolve. Disclaimer block content cannot change without legal review
- **Analytics surface preserved** — every existing event must still fire with the same name and metadata. The new Section 5 buy box must wire AddToCart + InitiateCheckout correctly via `CartContext`
- **Mobile-first** — 74% of `/start` traffic is mobile (per `CLAUDE.md`). Mobile is reviewed before desktop, every section
- **Performance** — Lighthouse 90+ on mobile, LCP < 2.5s. The Section 2 spinning bottle and Section 7 athlete imagery are the biggest risks here
- **No regression to other clinical pages** — home, `/conka-flow`, `/conka-clarity`, `/conka-both`, `/science`, `/our-story` must look unchanged. The fork strategy on `LandingValueComparison` exists specifically for this

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Softer aesthetic reduces perceived credibility, drops CR further | Conversion review window once V2 is live; sections 6 (% benefits) and 8 (Cambridge) intentionally preserve proof density |
| Section 2 spinning animation tanks LCP on mobile | Implement as CSS-only or lightweight Lottie; gate behind `prefers-reduced-motion`; image-only fallback for slow networks |
| Section 5 quick-purchase widget breaks `CartContext` invariants (B2B tier normalization, analytics metadata) | Route through `CartContext.addToCart` like every other CTA — never directly hit `/api/cart`. Pass `location: "buy_box"`, `source: "v2_quick_purchase"` |
| EFSA claims compliance accidentally broken during copy changes | Run `/review-claims` after every section copy update, not just once at the end |
| Performance regresses (new lifestyle imagery is heavy) | Image audit per section — every new asset must be `next/image` with explicit dimensions; LCP image gets `priority`; below-fold gets `loading="lazy"` |
| Shared `LandingValueComparison` accidentally edited | Use the fork (`CROValueComparison`) — never edit the shared file. Code review specifically checks this |
| Sections built piecemeal end up visually inconsistent | The scoped `brand-v2` modifier class (introduced with Section 1) gives every section the same softened token set; review at half-built milestone (~5 sections shipped) to catch drift |

## References

- `docs/development/REPLO_LANDING_BRIEF.md` — full architecture + copy of current `/start` (V1)
- `docs/development/REPLO_STYLE_CHEATSHEET.md` — current clinical design system (the thing V2 moves away from, for `/start` only)
- `docs/branding/QUALITY_STANDARDS.md` — quality bar
- `docs/branding/BRAND_VOICE.md` — copy rules
- `docs/development/LANDING_PAGE_CLAIMS_LOG.md` — EFSA claims log
- **External design references:** Ketone-IQ homepage (sections 2, 5, 6, 8), 8 Hours product page (sections 4, 6)
