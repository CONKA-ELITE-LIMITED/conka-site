# CONKA Website – Claude Instructions

Headless Shopify e-commerce site. Next.js App Router + TypeScript, hosted on Vercel.

## Operating efficiency

Speed and token cost matter. On any task that is not large:

- **Edit, don't rewrite.** Use targeted `Edit` calls. Never regenerate a whole file for a small change.
- **Never `npm run lint`** (whole repo). Lint only what you changed: `npm run lint:changed` (or `npx eslint <file>`).
- **Batch independent tool calls** into one turn instead of one per round-trip.
- **Keep prose tight.** Do the work; don't narrate options you won't take.
- **Delegate big reads** (multi-file searches, large docs) to a subagent so the main context stays lean.
- **`/clear` between unrelated tasks** so each reply isn't reprocessing a long history.

## Current strategic direction (March 2026)

**Read `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` before starting any feature work.** The site is undergoing a major simplification:

- **Protocols are being removed.** The 4-protocol system is being replaced with a simple Flow / Clear / Both offering.
- **New ad landing page** — standalone page for paid Meta traffic (not linked from main nav).
- **New funnel page** — minimal friction product selector: 3 cadences × 3 products, straight to Shopify checkout (no cart drawer).
- **Quiz is hidden** — removed from nav, redirected. May be repurposed later.
- **Shop page deleted** — redirected.
- Subscription management may migrate from Loop to Skio (decision pending).

## Git workflow

**Never commit directly to `main`.** Always create a feature branch, make changes there, and open a PR.

```bash
git checkout -b my-feature-branch   # create branch off main
# … make changes …
git push -u origin my-feature-branch
```

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run dev:all    # Dev + any parallel processes
```

## Stack

- **Framework:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Commerce:** Shopify Storefront API (`@shopify/storefront-api-client`) — cart only; checkout is Shopify-hosted via `cart.checkoutUrl`
- **Database:** Convex (see `docs/CONVEX_DEPLOYMENT.md`)
- **Hosting:** Vercel

## Key files

| File | Purpose |
|------|---------|
| `app/context/CartContext.tsx` | Global cart state — `addToCart`, `updateQuantity`, `removeItem`, `clearCart`. Cart ID stored in `localStorage` under `shopify_cart_id`. |
| `app/context/AuthContext.tsx` | Global auth state |
| `app/api/cart/route.ts` | Proxies cart actions to Shopify Storefront API |
| `app/components/CartDrawer.tsx` | Slide-out cart UI; "Checkout" links to `cart.checkoutUrl` |
| `app/lib/productData.ts` | **Barrel export** — always import product data from here, never from sub-modules |
| `app/premium-base.css` | Design system tokens and layout classes |
| `app/layout.tsx` | Root layout — nav, footer, CartDrawer, analytics scripts |

## Product data

Data is split into focused modules; import everything from the barrel:

```typescript
import { FormulaId, formulaContent, getFormulaPricing, formatPrice } from "@/app/lib/productData";
```

Modules (no circular deps): `productTypes` → `productColors`, `productPricing`, `formulaContent`, `protocolContent` → `productHelpers`

Key helpers: `getFormulaPricing(packSize, purchaseType)`, `getProtocolPricing(id, tier, purchaseType)`, `formatPrice(n)`, `getB2BTier(qty)`.

## Design system — Soft-Tech Luxury

Full spec: `docs/branding/DESIGN_SYSTEM.md`. New tokens in `app/brand-base.css` (legacy tokens still in `app/premium-base.css` during migration).

**The pattern — page orchestrates, components are content-only:**

```tsx
// Page (owns section wrapper, background, track)
<section className="premium-section-luxury premium-bg-bone">
  <div className="premium-track">
    <MyComponent />  {/* no <section>, no max-w, no px-* at root */}
  </div>
</section>
```

**Key classes:**
- `.premium-section-luxury` — section padding + gutters (5vw desktop, 1.25rem mobile)
- `.premium-track` — max-width 1280px, centred; no own padding
- `.premium-bg-ink` / `.premium-bg-bone` / `.premium-bg-surface` / `.premium-bg-mid` — section backgrounds
- `.premium-card-soft` — 40px radius, soft bg, no border (`--premium-radius-card`)
- `.premium-section-heading` — fluid section title with tight tracking
- `.premium-body` — body copy (1.125rem, line-height 1.6, max-width 65ch)

**Color palette (ink/bone system):**
- `--color-ink` (#111111) — dark sections; use `text-white` for text on ink
- `--color-bone` (#F9F9F9) — light sections
- `--color-neuro-blue-light` (#eeeff2) — readable content sections
- `--color-neuro-blue-dark` (#0e1f3f) — high-impact dark sections (use sparingly, max 2×)
- `--gradient-neuro-blue-accent` — gradient for hero title emphasis spans

**Sticky positioning gotcha:** `.premium-pdp` has `overflow-x: hidden` which breaks `position: sticky`. Place sticky sections *outside* `.premium-pdp`. See `conka-flow/page.tsx` comments.

**Component rules:**
- Components return content only — no `<section>`, no `max-w-*`, no `px-*` at root
- Components do not set their own background
- Cards/surfaces that differ from the section background must set their own text color explicitly
- Use `var(--letter-spacing-premium-title)` (`-0.03em`) on section headings

## Analytics

- **Vercel Analytics** (`app/lib/analytics.ts`) — quiz events + add-to-cart with `source`/`location`
- **Triple Whale** (`app/lib/tripleWhale.ts`) — AddToCart only
- **Meta Pixel** (`app/lib/metaPixel.ts`) — PageView, ViewContent, AddToCart, InitiateCheckout (browser-side)
- **Meta CAPI** (`app/api/meta/events/route.ts`) — server-side deduplication
- **GA + Klaviyo** — scripts in `app/layout.tsx`

All analytics fire from `CartContext` after successful cart mutations. Pass `metadata` (`location`, `source`, `sessionId`) to `addToCart` for funnel tagging.

## Cart — important details

- Cart ID persisted in `localStorage` as `shopify_cart_id`; cart data lives in Shopify
- No custom checkout — redirect to `cart.checkoutUrl`
- **B2B tier normalization:** after any cart mutation, `getB2BCartTierUpdates` (`app/lib/b2bCartTier.ts`) may fire `updateMultiple` to keep the cart on a consistent B2B tier
- `clearCart()` removes localStorage reference only; the Shopify cart still exists until it expires

## Routes

**Active:** `/` home · `/conka-flow` · `/conka-clarity` · `/professionals` · `/account` · `/go/[slug]` (ad landing quizzes, noindex) · static content pages (`/science`, `/our-story`, `/why-conka`, `/ingredients`, `/app`, `/case-studies`)
**Being built:** Landing page (URL TBD) · Funnel page (URL TBD)
**Being removed:** `/protocol/[id]` (redirect) · `/quiz` (redirect) · `/shop` (redirect)

## Docs index

| Doc | Topic |
|-----|-------|
| `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` | **Active plan** — phased simplification + funnel build |
| `docs/development/featurePlans/landing-conversion/README.md` | **Landing conversion programme** — personas x formats strategy, status, tracking plan, decision log |
| `docs/PROJECT_OVERVIEW.md` | High-level architecture |
| `docs/PAGE_NARRATIVES.md` | **Page story map** — current section-by-section arc + health rating per page; spot the weakest section to improve next |
| `docs/PRODUCT_DATA.md` | Product module structure + helper usage |
| `docs/branding/DESIGN_SYSTEM.md` | **Active design system** — typography, colours, radius, layout, migration guide |
| `docs/branding/SOFT_TECH_LUXURY_STYLE_SHEET_GUIDELINES.md` | Legacy design system (until pages are migrated) |
| `docs/features/LANDING_QUIZ_SYSTEM.md` | **Ad landing quiz system** (`/go/[slug]`) — config schema, how to add a page, analytics |
| `docs/features/CART_LOGIC.md` | Cart actions, persistence, B2B normalization |
| `docs/features/CUSTOMER_PORTAL.md` | Account portal |
| `docs/features/b2b/B2B_PORTAL.md` | B2B professional portal |
| `docs/branding/QUALITY_STANDARDS.md` | **Quality bar** — what premium looks like, reference sites, mobile-first mandate, consumability principle |
| `docs/branding/BRAND_VOICE.md` | **Brand voice, proof assets, copy rules, claims compliance** |
| `docs/branding/MOBILE_OPTIMIZATION.md` | Mobile component patterns, split component architecture |
| `docs/development/PERFORMANCE_OPTIMISATION.md` | **Performance rules** — animation, images, scripts, fonts, Lighthouse benchmarks |
| `docs/development/VIDEO_OPTIMISATION.md` | **Video assets** — ffmpeg recipe for the mp4/webm/poster trio, poster frame selection, size budget |
| `docs/development/MOTION_GUIDE.md` | **GSAP motion system** — shared helpers (`app/lib/motion.ts`), patterns, reduced-motion rules; `/app` is the reference |
| `docs/analytics/` | Analytics implementation + verification guides |
| `docs/CONVEX_DEPLOYMENT.md` | Convex setup |

## Workflows

Process docs for how to approach work on this project. Read the relevant workflow before starting a task.

| Doc | When to use |
|-----|-------------|
| `docs/workflows/README.md` | Index and overview of all workflows |
| `docs/workflows/01-scoping-work.md` | Before starting any non-trivial feature — break down scope, identify affected areas |
| `docs/workflows/02-implementation-workflow.md` | Step-by-step implementation process after scoping |
| `docs/workflows/03-nextjs-development.md` | Next.js patterns, rendering strategy, data fetching conventions |
| `docs/workflows/04-shopify-commerce.md` | Working with Shopify APIs, cart, checkout, subscriptions (Loop) |
| `docs/workflows/05-creating-documentation.md` | When creating or updating project documentation |
| `docs/workflows/06-code-review.md` | Self-review checklist before opening a PR |
| `docs/workflows/07-testing-validation.md` | Testing layers and validation checklists |
| `docs/workflows/08-jira-workflow.md` | Ticket creation, status transitions, writing acceptance criteria |
| `docs/workflows/09-ux-iteration.md` | Refining existing pages for conversion, layout, information hierarchy |
