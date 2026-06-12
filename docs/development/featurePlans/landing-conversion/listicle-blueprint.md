# Listicle Page Blueprint (IM8 Reference)

Status: FRAMEWORK BUILT + first persona page live in dev. Part of the [landing conversion programme](./README.md).

## Build status (2026-06-12)

**Shipped (branch LISTICLE-LANDING-PAGE):**

- `format: "listicle"` renderer at `/go/[slug]` beside the quiz engine: `app/components/go/listicle/ListicleRenderer.tsx`, config schema in `app/lib/landings/listicle-types.ts`, registered per page in `app/lib/landings/index.ts`.
- Two pages live in dev: `/go/listicle-template` (lorem reference config) and `/go/adhd-listicle` (first persona page, ADHD, supplied reason copy verbatim).
- **Composition shell decision:** the renderer builds only the listicle core (hero, numbered reasons with stats bands and review strips woven in, bridge CTA). The conversion tail reuses existing site components: buy box = `ProductHero`/`ProductHeroMobile` (corners squared, real `addToCart` with `source: "listicle"`), athlete proof = `AthleteCredibilityCarousel`, reviews = `CROTestimonials` + `LandingTrustBadges`, FAQ = `CROFAQv2` (given an optional `items` prop for persona-locked questions). Review quotes map from `customerTestimonials.ts`; stats band uses the four headline trial stats from `docs/conkaAppData/HIGH_LEVEL_STATS.md`.
- Unlike the quiz, listicle pages render the site `Navigation` and `Footer` (user decision, diverges from the IM8 reference).
- Background rhythm (user decision): dark = hero + buy box only; everything else light/bone. Dark colour is `--color-neuro-blue-dark` via one constant in the renderer.
- **Deferred from v1:** comparison table and cost breakdown (optional config zones, render only when configured; need sourced competitor doses / stack prices). Trust ticker, bridge, sticky bar are optional per config.

**Open / next:**

- Six reason assets for the ADHD page are labelled placeholders (lifestyle shots, caffeine-curve stat panel, app screenshot).
- Hero + reasons section polish pass against the IM8 reference; then the mobile pass.
- Analytics wiring (`landing:section_viewed` via IntersectionObserver, Meta ViewContent) not yet added.
- Guarantee mismatch to resolve: ADHD copy says 60 days; embedded `ProductHero` renders the site `GuaranteeRow` label on the same page.
- Drafted-by-Claude copy on the ADHD page needs review: hero headline/subcopy, bridge, FAQ answers, tags, ticker, sticky bar.

Reference: IM8 "Daily Ultimate Essentials Pro" listicle landing pages, structure taken from Luke's Miro board (6 desktop screenshots, digested 2026-06-12). This supersedes the Cloud reference in [listicle-format.md](./listicle-format.md) as the layout we are copying; the Cloud doc remains useful for the *why it converts* principles, which IM8 shares.

**Goal:** build the page as a reusable framework with lorem ipsum copy and placeholder assets first, then wire in real copy/assets per persona as they arrive. Copy swap = config edit, not component work.

**Build order:** desktop first (the Miro board only shows desktop), then a deliberate mobile pass before anything goes live. Paid Meta traffic is overwhelmingly mobile, so mobile is launch-blocking even though it comes second.

---

## Page anatomy (top to bottom, as agreed)

The IM8 page is 8 distinct zones. Background rhythm matters: the listicle core sits on a dark brand canvas, the purchase section is a hard background change to light, trust/comparison/reviews run light, cost breakdown is a dark card, FAQ is a full-bleed brand-colour block.

### 1. Hero — "X reasons why" + hero asset

- Dark brand background (IM8: deep burgundy. CONKA: ink or neuro-blue-dark — see open decisions).
- Two columns: left = eyebrow tag, then an all-caps multi-line headline in the exact "N REASONS [AUDIENCE/PEOPLE] SAY [PRODUCT] [OUTCOME]" formula (IM8: "6 Reasons People Say Essentials Pro Gave Them Back the Energy and Clarity They Thought Were Gone for Good"), short supporting subcopy, a proof/rating line, primary CTA anchoring to the buy section.
- Right = single hero asset (product-in-context lifestyle image).
- Below the hero: a row of small anchor chips/pills (one per reason) acting as in-page nav.

### 2. Reasons breakdown — numbered items with assets, reviews woven in

The core listicle. Each reason has identical anatomy:

- Number marker (01–06) + short category tag
- All-caps benefit headline written as a *felt outcome*, not a feature ("The 3pm crash stops killing your afternoon", "Sleep gets deeper without anything that makes you groggy")
- Body copy: problem-validate paragraph first, then the solution paragraph mapping named ingredients/mechanisms to that exact pain
- One asset per reason, alternating sides. Asset kinds seen on the board:
  - **Stat callout card** — big number + label + small bar/chart (IM8 uses "40%", "200mcg", "270+", "16K+" strips)
  - **Dark lifestyle photo**
  - **Mini data table / comparison snippet**
  - **App or product UI screenshot**
- **Static review cards woven between reasons** — a row of 3–4 short quote cards with name + verified badge + Trustpilot-style strip, appearing roughly mid-list. Not a carousel, no JS.
- The final reason rolls into a dark CTA card that bridges into the purchase section.

### 3. Purchase product section — distinct background change

Hard switch to a light band. This is the `#product` anchor that ads and all page CTAs deep-link to.

- Centered headline ("Start Your Upgrade Today") + subline carrying a big customer count.
- Two columns:
  - **Left — offer + gallery:** a welcome-offer card ("$X in welcome gifts, on us" with each gift named and its price struck through), certification badges (IM8: Informed Choice + NSF Certified Sport; CONKA: Informed Sport), product imagery, and a thumbnail gallery row.
  - **Right — buy box:** star rating + review count, product name, one-line description, variant selector, an inline named testimonial, purchase-option radio cards (Subscribe & Save with "SAVE X%" badge, price, and a perks checklist vs one-time at higher price), big CTA button, reassurance strip (free shipping / money-back guarantee / cancel anytime), payment icons, then tabs or accordions: Overview, Ingredients, How to Enjoy (3 illustrated steps), What's Inside, Third-Party Tested.
- Purchase is on-page via `funnelCheckout()` — no cart drawer, no navigation between conviction and checkout.

### 4. High-performer trust carousel

- Light background. Tag ("Real Results") + headline ("Trusted by Athletes, Doctors & Everyday Performers") + subline.
- Horizontally scrolling row of portrait video-testimonial cards (video thumb with play button), each with stars, short quote, name, role/handle.
- "Rated Excellent" badge floating top-right of the section.
- CONKA equivalent assets: athlete/ambassador clips if we have them; static portrait cards as fallback if video isn't ready (placeholder kind supports both).

### 5. Them vs us — clinical comparison table

- Light background. Tag ("Clinical Comparison") + headline ("The New Gold Standard") + subline.
- Table: ingredient rows; our column shows a check + "+X% MORE" in brand colour + the clinical dose, competitor column ("Leading Greens Powder" — generic, unnamed) shows the plain dose.
- "See more ingredients" expand link, footnote about clinical dosing.
- CONKA note: per-serving doses are fine to show; formula-share percentages are NOT (composition is secret). The "+X% more than the leading X" framing compares to a competitor's dose, which is fine.

### 6. Review wall

- Light background. Tag ("Verified Reviews") + huge review-count headline ("16,255 Reviews") + subline + rating strip.
- Masonry/grid of static review cards (stars, quote, name, verified badge), ~3–4 columns desktop.
- "Show more reviews" button revealing more rows (client-side, no fetch).

### 7. Cost breakdown

- A large dark rounded card on a light section background.
- Left: stacked claim ("One sachet. 16 supplements. Save over $2,500/yr."), CTA button, product render, circular badge showing the annual savings range.
- Right: "Monthly Breakdown" — an itemised list of supplement categories the product replaces, each with its standalone monthly price, closing with a two-row total: "Your traditional supplements: $XXX" vs "[Product]: $79".
- CONKA equivalent: the shot vs buying citicoline, omega-3, etc. separately. Numbers need sourcing (open decision).

### 8. FAQ + minimal footer

- Full-bleed brand-colour background, heading left, single-column accordion (~7 questions), "Explore all FAQs" button.
- FAQ questions on IM8 are persona-locked (GLP-1 questions on a GLP-1 page) — ours should be persona-specific per config, not generic.
- Minimal footer: logo, tagline, 3–4 links, legal. No site nav anywhere on the page.

---

## How it fits the existing system

Same architecture as the quiz format (`docs/features/LANDING_QUIZ_SYSTEM.md`):

- Route: `/go/[slug]`, registered in `app/lib/landings/index.ts`, `format: "listicle"` selects the renderer.
- Noindex, no site nav, never linked internally. New iteration = new slug.
- Reuse: `funnelCheckout()` + pricing/variant data from `app/lib/funnelData.ts` for the buy box; stat/chart components (AnimatedStat, BarChart) for reason assets; clinical visual language from the quiz template.
- Unlike the quiz it is a normal scrolling page: drop-off tracking is `landing:section_viewed` via IntersectionObserver (one event per zone + per reason), not screen index.

### Config shape (draft v2, supersedes the sketch in listicle-format.md)

Fixed top-level zones (the order above is locked); the listicle core is an ordered array so review strips can be woven between reasons at any position:

```ts
interface ListicleConfig {
  slug: string;
  persona: string;
  format: "listicle";
  meta: { title: string; description: string };
  hero: { tag: string; headline: string; subcopy: string; proofLine: string; cta: string; asset: Asset };
  body: Array<
    | { kind: "reason"; n: number; tag: string; headline: string; problem: string; solution: string; asset: Asset }
    | { kind: "reviewStrip"; reviews: Review[] }
  >;
  bridgeCta: { headline: string; cta: string };
  product: {
    headline: string; subline: string;
    offerCard: { headline: string; gifts: Gift[] };
    badges: string[];
    gallery: Asset[];
    buyBox: BuyBoxConfig; // variant ids resolve via funnelData
  };
  trustCarousel: { tag: string; headline: string; subline: string; items: TrustItem[] };
  comparison: { tag: string; headline: string; subline: string; competitorLabel: string; rows: ComparisonRow[]; footnote: string };
  reviewWall: { count: string; subline: string; reviews: Review[]; pageSize: number };
  costBreakdown: { claim: string[]; savingsBadge: string; lineItems: LineItem[]; totals: { them: string; us: string } };
  faq: { items: Array<{ q: string; a: string }> };
}

type Asset =
  | { kind: "image"; src: string; alt: string; aspect: string }
  | { kind: "stat"; value: string; label: string; chart?: "bar" | "none" }
  | { kind: "placeholder"; aspect: string; note: string }; // framework phase
```

The `placeholder` asset kind renders a labelled grey block at the right aspect ratio, so the framework page is reviewable before any real asset exists.

## Build plan

1. **Framework page (this scope):** all 8 zone components + listicle renderer + one dev config (`/go/listicle-dev`) filled with lorem ipsum, placeholder assets, and real funnel pricing in the buy box (pricing is the one thing we already have for real). Desktop layout matching the board.
2. **Mobile pass:** collapse rules per zone (two-col → stacked, carousel → swipe with `scroll-pl-*`, comparison table → condensed two-column, review wall → single column with fewer visible cards). Reviewed on device before any spend.
3. **Content wiring (per persona, repeatable):** new config file per slug with real copy/assets, analytics verified via `/review-analytics`.

Estimate: framework ~1.5–2 days (8 zones, buy box is the heavy one), mobile pass ~0.5 day, then content wiring is config-only per page.

## Open decisions

Carried over from [listicle-format.md](./listicle-format.md), still open, none block the framework build (placeholders cover them):

1. **Offer mechanics** — IM8 leans on welcome gifts + subscribe-and-save 35% + guarantee. CONKA's equivalent offer needs deciding before real content.
2. **Colour mapping** — IM8's burgundy canvas → CONKA ink vs neuro-blue-dark for the dark zones. Decide at framework review (lorem page makes this easy to eyeball).
3. **Stats and review sourcing** — review count, ratings, survey-style stats, cost-breakdown line-item prices all need defensible numbers.
4. **Trust carousel media** — do we have ambassador/athlete video clips, or launch with static portrait cards?
5. **Reason count default** — IM8 uses 6; config supports any N. Per-persona content decision.
