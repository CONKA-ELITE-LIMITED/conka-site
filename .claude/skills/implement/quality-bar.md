The quality bar for /implement — the full detail behind the Three Non-Negotiables and the Contextual Personas summarised in SKILL.md. Consult while building in any phase; the gates here are checked at every checkpoint.

---

## Three Non-Negotiables

These gate every piece of work. They are checked at every checkpoint, not optimised for at the end. Nothing ships without passing all three.

### 1. Mobile-first (this is not a preference, it's the reality)

74% of traffic is mobile, arriving from paid social ads on a phone. Mobile is not an adaptation of desktop -- it is the primary experience.

- **Build at 390px first.** Desktop is the adaptation, not the other way around.
- **Review at 390px before anything else.** If it doesn't work on mobile, it doesn't ship.
- **Hero content and primary CTA must be visible without scrolling** on mobile.
- **If mobile and desktop layouts conflict, mobile wins.**
- Split into separate Mobile/Desktop components when layouts differ significantly -- don't force one layout to serve both.
- Every interactive element: minimum 44x44px tap target.

### 2. Performance (speed is premium)

Slow pages kill conversion. A fast site *feels* premium. Performance is not polish -- it is the product.

- **Core Web Vitals targets:** LCP <2.5s, CLS <0.1, FID <100ms.
- **Server Components by default.** Only use `'use client'` for genuine interactivity. Every unnecessary Client Component adds to the JS bundle your mobile user downloads on 4G.
- **Images:** Always `next/image` with explicit dimensions. `priority` on above-the-fold. `loading="lazy"` on below-fold. No unoptimised assets.
- **Scripts and fonts:** Third-party scripts default to `lazyOnload`. Font imports load only the weights actually used. Preconnect to external domains.
- **Animations:** CSS classes over inline styles. Only animate `transform` and `opacity` (compositor-friendly).
- **No waterfall requests.** Parallel data fetching. Fetch only needed fields from Shopify.
- **No layout shift.** Elements must not jump after load. Reserve space for async content.
- **Lighthouse 90+** on all categories for every new page.

### 3. Brand alignment (every pixel communicates)

This is a premium brand. The site must feel intentional, minimal, and confident-clinical. Not a Shopify theme. Not a template.

- **Design system tokens only** -- never hardcode colours, spacing, radii, or font sizes. Use `brand-base.css` (the single stylesheet).
- **Left-aligned text** by default (brand system). No centred headers unless legacy page requires it.
- **Brand voice in all copy:** confident-clinical, specific proof points, no vague language. "+28.96% improvement" not "better performance". See `docs/branding/BRAND_VOICE.md`.
- **Colour is functional, not decorative.** Pages should feel monochrome first. Accent blue (`--brand-accent`) only for CTAs and data emphasis.
- **One idea per viewport on mobile.** Scannable over readable. Numbers beat paragraphs.
- **Every section must pass:** Does it feel layered and dimensional? Can someone understand it in <3 seconds on a phone? Does it look like it belongs next to Seed.com, not a Shopify theme?

---

## Contextual Personas

Adopt the right mindset based on what you're building:

### When working on data layer and API routes
Think like a **senior backend engineer**. Four pillars:
- **Robust** -- Handle errors gracefully, validate inputs, never trust external data
- **Safe** -- No secrets in client code, no Shopify Admin tokens in `NEXT_PUBLIC_` vars, parameterised queries
- **Efficient** -- Fetch only needed fields from Shopify, no waterfall requests, proper caching strategy
- **Maintainable** -- Data fetching in lib/services, not scattered in components. Clear separation of concerns.

### When working on components and pages
Adopt three expert roles simultaneously:
- **Next.js Expert** -- Deep knowledge of App Router, Server vs Client Components, rendering strategies, data fetching patterns. Server Components by default; Client Components only for interactivity, kept as small as possible.
- **D2C Conversion Specialist** -- Every element earns its place by building trust, reducing uncertainty, or moving the customer closer to purchase. If it does none of those, remove it. The customer arriving from a Meta ad has zero brand awareness, limited attention, and is comparing you to 10 other products they scrolled past.
- **Behavioural Designer (Rory Sutherland)** -- UX copy and feature framing should explain *why* something matters, not just *what* it does. Frame value before price. Reduce cognitive load.

Design benchmarks -- build as if shipping alongside: **Seed.com** (layered depth), **Ovrload** (conversion intensity), **Magic Mind** (approachable science).

### When integrating data with UI
Think like a **systems engineer**. Bugs live in the seams between what the API returns and what the UI expects. Every data state (success, empty, error, slow) must have a corresponding UI state. Miss one and the user sees a blank screen or a spinner that never stops.
