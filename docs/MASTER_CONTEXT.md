# CONKA Master Context

> Single first-read for scoping work. Dense and specific. For deeper dives, follow the links.

---

## 1. What CONKA Is

CONKA is a UK-based D2C brand selling liquid nootropic brain shots (30ml daily doses, not capsules). Two products: **CONKA Flow** (energy/focus, AM) and **CONKA Clear** (clarity/recovery, PM). Sold primarily as subscriptions through a headless Shopify storefront (Next.js on Vercel). The business goal is converting paid Meta traffic into subscribers, then retaining them. 74% of traffic is mobile from paid social.

---

## 2. Strategic Direction

**Core pivot (March 2026):** The 4-protocol system is being scrapped. Replaced with a simple **Flow / Clear / Both** offering across 3 cadences (Monthly Sub, Monthly OTP, Quarterly Sub). "Both" is the hero product (synergistic compounding effect, highest LTV).

### What's been built
- **Landing page** (`/start`) -- standalone conversion page for paid Meta traffic. 8 sections, noindex, all CTAs point to `/funnel`. Not linked from main nav.
- **Funnel page** (`/funnel`) -- multi-step paginated selector (Plan > Product > Checkout). Pre-selects Both + Monthly Sub. Isolated checkout flow (bypasses CartContext, creates fresh cart, redirects to Shopify). No nav/footer. Noindex.
- **Funnel data layer** (`app/lib/funnelData.ts`) -- standalone types, 3x3 pricing matrix, variant mapping. 4 of 9 combos work end-to-end (Flow/Clear x Monthly Sub/OTP).
- **Phase 1 foundations** -- quiz hidden, protocols removed from nav, redirects in place, shop page deleted.

### What's blocked
- **Assets** -- hero lifestyle photography, customer avatar photos.
- **Landing page copy** -- final headline/offer direction from January Brands.
- **Skio vs Loop** -- subscription management migration decision pending.

### What's being removed
- `/protocol/[id]` -- redirected to homepage
- `/quiz` -- redirected, code kept for potential repurposing
- `/shop` -- redirected

### What's next (Phase 5, lower priority)
Homepage alignment, formula page updates, B2B portal simplification, protocol code cleanup. All wait until the funnel is live and producing data.

**Source:** `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md`

---

## 3. Technical Constraints

### Stack
Next.js App Router, React, TypeScript, Tailwind CSS, Vercel hosting. Shopify Storefront API for cart only; checkout is Shopify-hosted via `cart.checkoutUrl`. Database: Convex.

### Key files
| File | Role |
|------|------|
| `app/context/CartContext.tsx` | Global cart state. Cart ID in localStorage (`shopify_cart_id`). |
| `app/api/cart/route.ts` | Proxies to Shopify Storefront API |
| `app/lib/productData.ts` | **Barrel export** -- always import from here |
| `app/lib/funnelData.ts` | Standalone funnel types/pricing/variants |
| `app/lib/funnelCheckout.ts` | Isolated funnel checkout (no CartContext) |
| `app/brand-base.css` | Design system tokens (the single stylesheet; `premium-base.css` deleted) |
| `app/layout.tsx` | Root layout, nav, footer, analytics scripts |

### Cart/checkout
- No custom checkout. Redirect to `cart.checkoutUrl`.
- `clearCart()` removes localStorage ref only; Shopify cart persists until expiry.
- Funnel uses isolated cart creation (fresh cart per checkout, no drawer).

### Analytics (fires from CartContext after mutations)
| System | Events | File |
|--------|--------|------|
| Vercel Analytics | quiz + add-to-cart with source/location | `app/lib/analytics.ts` |
| Triple Whale | AddToCart | `app/lib/tripleWhale.ts` |
| Meta Pixel | PageView, ViewContent, AddToCart, InitiateCheckout | `app/lib/metaPixel.ts` |
| Meta CAPI | Server-side dedup | `app/api/meta/events/route.ts` |
| GA + Klaviyo | Scripts in layout | `app/layout.tsx` |

Pass `metadata` (location, source, sessionId) to `addToCart` for funnel tagging. Funnel page fires its own events independently.

### Gotchas
- `.premium-pdp` has `overflow-x: hidden` which breaks `position: sticky`. Place sticky sections outside it.
- Product data modules have strict dependency order (no circular deps). Import from barrel only.
- Offer terms (guarantee period, discounts) live in `app/lib/offerConstants.ts` -- never hardcode.

---

## 4. Design System

One stylesheet: **`app/brand-base.css`** (the former `premium-base.css` has been deleted). The forward language is **Simple DTC** (cart/nav/PDP acquisition); **Clinical** (`.brand-clinical`) is retained for evidence-dense and `/app` dark surfaces. See `docs/branding/DESIGN_SYSTEM.md` §8.5.

### The pattern: page orchestrates, components are content-only

```tsx
// Page owns section wrapper, background, track
<section className="brand-section brand-bg-white">
  <div className="brand-track">
    <MyComponent />  {/* no <section>, no max-w, no px at root */}
  </div>
</section>
```

Components return content only. No `<section>`, no `max-w-*`, no `px-*` at root. Components do not set their own background. Cards/surfaces that differ from section background set text colour explicitly.

### Colour palette (monochrome canvas first)
| Token | Hex | Role |
|-------|-----|------|
| `--brand-white` | #FFFFFF | Default canvas (~55-60% of sections) |
| `--brand-tint` | #F4F5F8 | Soft zone break (~30-40% of sections) |
| `--brand-neutral` | #CCCCCA | Dividers/borders only. Not for section backgrounds. |
| `--brand-accent` | #4058BB | Primary CTA buttons only. Not decoration. |
| `--brand-black` | #000000 | Primary text, footer |

**Text colour tiers:** `text-black` (headings), `text-black/80` (body), `text-black/60` (captions/subtitles), `text-black/40` (legal/disclaimers).

**Section rhythm:** White > Tint > White > Tint. Never two identical backgrounds adjacent. Dark sections available but max 1 per page.

### Radius (3 tiers, no exceptions)
| Value | Use |
|-------|-----|
| 16px (`--brand-radius-interactive`) | Buttons, inputs, pills |
| 24px (`--brand-radius-container`) | Image containers, content blocks |
| 32px (`--brand-radius-card`) | Cards, major surfaces |

### Typography
- Primary font: Neue Haas Grotesk Display (400/500/700)
- Data font: JetBrains Mono (400/500)
- **Left-align everything.** No centred section headers.
- Body max-width: 65ch. Headings use tight letter-spacing.
- Classes: `.brand-h1` (hero), `.brand-h2` (section), `.brand-h3` (sub), `.brand-body`, `.brand-caption`, `.brand-data`

### Mobile-first (non-negotiable)
- Design at 390px first. Desktop is the adaptation.
- Radii stay the same on mobile.
- One idea per viewport. Scannable over readable.
- If mobile and desktop conflict, mobile wins.

**Source:** `docs/branding/DESIGN_SYSTEM.md`

---

## 5. Brand and Copy Rules

**Voice:** Confident-clinical. Premium but not elitist. Direct, no fluff. Like someone who knows exactly what they're talking about and has the data to back it.

### Copy rules
1. Lead with pain or a counterintuitive truth, never with the product name
2. Back every claim with a specific number ("+28.96%" not "improved performance")
3. Include at least one verifiable proof point per section
4. Reference the 100-day guarantee at every conversion point
5. No vague language ("supports brain health" is weak)

### Key proof assets
150,000+ bottles sold. 500+ five-star reviews (Loox). Durham + Cambridge/Exeter university partnerships. Informed Sport certified. Patent GB2620279. 5,000+ cognitive tests. Finn Russell +28.96%, Patrick Bamford +27.93%, Jade Shekells (Paris 2024) +36.72%. Companion app with measurable scores. 100-day money-back guarantee. Research: 500k+ invested, 25+ clinical trials.

### Claims compliance (UK/EU EFSA 1924/2006)
- No quantified health claims. Use observational framing ("In one study, participants showed...")
- EFSA-authorised claims for Vitamin C and B12 are permitted
- "Detox" is not an authorised claim
- Speed-of-effect claims require careful framing
- Full audit: `docs/development/LANDING_PAGE_CLAIMS_LOG.md`

**Source:** `docs/branding/BRAND_VOICE.md`

---

## 6. Conversion Priorities

Every piece of work filters through two lenses:

**Acquisition/CRO** -- Converting paid Meta traffic into first purchase. Visitors arrive on mobile with zero brand awareness. Every customer-facing page is a conversion surface. Does this reduce friction, build trust, or move someone closer to purchase?

**Retention/LTV** -- Keeping subscribers and increasing lifetime value. Post-purchase experience, customer portal, subscription management. Does this make an existing customer more likely to stay, upgrade, or refer?

If work serves neither, it needs a strong justification. "Nice to have" is not one.

### Quality bar (3-second test)
1. Does it feel layered and dimensional, not flat?
2. Can someone understand it in under 3 seconds on a phone?
3. Does it look like it belongs next to Seed.com's homepage, not a Shopify theme?

### The "quickly consumable" principle
- One idea per viewport
- Scannable over readable (headlines, stats, icons, badges)
- Progressive disclosure over density
- Numbers beat paragraphs
- Remove before you add

**Source:** `docs/branding/QUALITY_STANDARDS.md`

---

## Deeper Reads (conditional)

| If working on... | Also read |
|-------------------|-----------|
| UI / new sections | `docs/branding/DESIGN_SYSTEM.md` (full token reference) |
| Copy / messaging | `docs/branding/BRAND_VOICE.md` (frameworks, awareness stages) |
| Mobile layout | `docs/branding/MOBILE_OPTIMIZATION.md` (split components, patterns) |
| Cart / checkout | `docs/features/CART_LOGIC.md` |
| Analytics | `docs/analytics/` |
| Shopify / commerce | `docs/workflows/04-shopify-commerce.md` |
| Landing or funnel page | `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` (full phase detail) |
| Product data modules | `docs/PRODUCT_DATA.md` |
