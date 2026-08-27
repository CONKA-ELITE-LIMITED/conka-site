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

## Current strategic direction (updated Aug 2026)

**Read `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md` (current state + prioritised roadmap) and `docs/TODO.md` (deferred work and tech debt tracker) before starting any feature work.** The simplification started in March 2026 has now largely landed:

- **Protocols: presentation layer is deleted, commerce layer is live.** The 4-protocol system was replaced by a simple Flow / Clear / Both offering. `app/protocol/`, `app/components/protocol/` and the `app/lib/protocol*.ts` modules are **gone**. `ProtocolId`, `PROTOCOL_VARIANTS` and `app/lib/legacy/protocolSubscriptions.ts` remain as **live legacy support for existing subscribers** — do not delete them. See `docs/development/featurePlans/asset-and-protocol-cleanup.md`.
- **Ad landing pages — shipped.** `/go/[slug]` serves paid Meta traffic as listicles and landing quizzes (noindex, not in main nav). See `docs/features/LISTICLE_SYSTEM.md` and `docs/features/LANDING_QUIZ_SYSTEM.md`.
- **Funnel — shipped and consolidated.** The three funnel variants collapsed into `/build-your-order` (SCRUM-1247): 3 cadences × 3 products, straight to Shopify checkout, no cart drawer. `/funnel`, `/funnel-b` and `/funnel-c` are deleted and redirect there.
- **Quiz — deleted**, not hidden. `/quiz/:path*` permanently redirects to `/build-your-order`. The `/go/[slug]` landing quizzes are a separate, unrelated system.
- **Shop page — deleted.** `/shop` and `/shop/:path*` permanently redirect to `/conka-both`.
- **Subscriptions are migrating from Loop to Skio** — decided Aug 2026, plan in `docs/development/featurePlans/skio-migration.md` (the single source of truth; nine Skio docs were consolidated into it).

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
- **Database:** Convex (see `docs/deployment/CONVEX_DEPLOYMENT.md`)
- **Hosting:** Vercel

## Key files

| File | Purpose |
|------|---------|
| `app/context/CartContext.tsx` | Global cart state — `addToCart`, `updateQuantity`, `removeItem`, `clearCart`. Cart ID stored in `localStorage` under `shopify_cart_id`. |
| `app/context/AuthContext.tsx` | Global auth state |
| `app/api/cart/route.ts` | Proxies cart actions to Shopify Storefront API |
| `app/components/CartDrawer.tsx` | Slide-out cart UI; "Checkout" links to `cart.checkoutUrl` |
| `app/lib/productData.ts` | **Barrel export** — always import product data from here, never from sub-modules |
| `app/brand-base.css` | Design system tokens and layout classes (the only stylesheet; `premium-base.css` is deleted) |
| `app/layout.tsx` | Root layout — nav, footer, CartDrawer, analytics scripts |

## Product data

Data is split into focused modules; import everything from the barrel:

```typescript
import { FormulaId, formulaContent, getFormulaPricing, formatPrice } from "@/app/lib/productData";
```

Modules (no circular deps): `productTypes` → `productColors`, `productPricing`, `formulaContent`, `protocolContent` → `productHelpers`

Key helpers: `getFormulaPricing(packSize, purchaseType)`, `getProtocolPricing(id, tier, purchaseType)`, `formatPrice(n)`, `getB2BTier(qty)`.

## Design system

Full spec: `docs/branding/DESIGN_SYSTEM.md`. All tokens and classes live in `app/brand-base.css` — the single stylesheet. The old `app/premium-base.css` ("Soft-Tech Luxury") has been **deleted**; its still-referenced tokens are folded into `brand-base.css` Layer 3 as `@deprecated`. Do not reference `premium-*` classes or `--premium-radius-*` tokens — they no longer exist.

**Direction.** The visual system has evolved premium → clinical → **Simple DTC**. Simple DTC is the forward language (rounded pills/cards, filled navy `#1B2757` as primary/decorative, green `#1a7f4f` savings accent, light-navy `#eef0f5` tint strips, shadows/rings allowed, sans by default) and governs cart / nav / PDP acquisition surfaces. **Clinical** (`.brand-clinical`: zero radii, mono data labels, navy interactive-only) is retained for evidence-dense surfaces (`/science`) and the `/app` dark pages, not the default for new work. See DESIGN_SYSTEM.md §8.5 for the full Simple DTC spec and per-surface authority table.

**The pattern — page orchestrates, components are content-only:**

```tsx
// Page (owns section wrapper, background, track)
<section className="brand-section brand-bg-white" aria-label="Benefits">
  <div className="brand-track">
    <MyComponent />  {/* no <section>, no max-w, no px-* at root */}
  </div>
</section>
```

**Key classes:**
- `.brand-section` — section padding + gutters (5vw desktop, 1.25rem mobile)
- `.brand-track` — max-width 1280px, centred; no own padding
- `.brand-bg-white` / `.brand-bg-tint` / `.brand-bg-black` — section backgrounds
- `.brand-h1` / `.brand-h2` / `.brand-h3` / `.brand-body` — typography (left-aligned by default)
- Radius tokens: `--brand-radius-interactive` (16px) / `--brand-radius-container` (24px) / `--brand-radius-card` (32px); `.brand-clinical` forces all three to `0px`

**Component rules:**
- Components return content only — no `<section>`, no `max-w-*`, no `px-*` at root
- Components do not set their own background
- Cards/surfaces that differ from the section background must set their own text color explicitly
- Use design tokens from `app/brand-base.css` — never hard-code colours, spacing, radii, or font sizes

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
- **B2B tier pricing:** volume tiers live in `app/lib/b2bPricing.ts` (`getB2BTier(boxes)`, `B2B_TIERS`); there is no automatic cart-mutation tier normalization
- `clearCart()` removes localStorage reference only; the Shopify cart still exists until it expires

## Routes

**Active:** `/` home · `/conka-flow` · `/conka-clarity` · `/conka-both` · `/build-your-order` (Build Your Order flow, noindex; data layer `app/lib/byoData.ts` + `byoCheckout.ts`) · `/professionals` · `/account` · `/go/[slug]` (ad landing quizzes + listicles, noindex) · `/start`/`/lander` (redirect to `-b` trial variants) · static content pages (`/science`, `/our-story`, `/why-conka`, `/ingredients`, `/app`, `/case-studies`)
**Being removed:** `/protocol/[id]` (redirect) · `/quiz` (redirect) · `/shop` (redirect) · `/funnel`, `/funnel-b`, `/funnel-c` (redirect to `/build-your-order`, SCRUM-1247)

## Docs index

| Doc | Topic |
|-----|-------|
| `docs/README.md` | **Docs index** — the full, grouped map of the `docs/` tree. Start here to find the canonical doc for a topic |
| `docs/product/PRODUCT_DATA.md` | **Product-data code map** — the two systems (main-site barrel vs BYO), module dependency graph, where Shopify GIDs live |
| `docs/product/FORMULATION_SPEC.md` | **Physical formulation** — per-shot doses, ingredients, %NRV, nutrition-label data. The source of truth for any mg figure |
| `docs/PRICING_HISTORY.md` | Dated audit log of price changes. Append a block on every price change |
| `docs/development/CART_PRICING_SOURCE_OF_TRUTH.md` | The rule: pre-add UI prices from `productPricing.ts`; cart/checkout prices from Shopify only |
| `docs/product/SKU_AND_SHOT_REFERENCE.md` | **Canonical SKU + shot-count map** — funnel / main-site / legacy protocol variant GIDs, selling plans, shot counts, prices, and the account shot/per-shot display history (why the tiles were removed) |
| `docs/development/CODEBASE_AUDIT_AND_ROADMAP.md` | **Current state + roadmap** — performance, code quality, architecture assessment and prioritised improvements |
| `docs/TODO.md` | **Deferred work tracker** — tech debt and cleanup tasks, with what unblocks each |
| `docs/development/featurePlans/landing-conversion/README.md` | **Landing conversion programme** — personas x formats strategy, status, tracking plan, decision log |
| `docs/sprints/README.md` | **Commercial / growth sprints** — time-boxed business pushes (ad-spend trials, launches). Current: the £300/day listicle ad-spend trial. Live data lives in `docs/analytics/LISTICLE_PERFORMANCE.md` |
| `docs/development/featurePlans/asset-and-protocol-cleanup.md` | **Tech debt cleanup** — unreferenced `public/` assets + protocol system removal. Read before touching the product-data layer: the protocol *presentation* layer is dead, but the *commerce* layer (`ProtocolId`, `PROTOCOL_VARIANTS`, subscriptions UI) is live legacy support for existing subscribers |
| `docs/MASTER_CONTEXT.md` | High-level architecture and business context |
| `docs/PAGE_NARRATIVES.md` | **Page story map** — current section-by-section arc + health rating per page; spot the weakest section to improve next |
| `docs/branding/DESIGN_SYSTEM.md` | **Active design system** — typography, colours, radius, layout, migration guide |
| `docs/features/GO_LANDING_PAGES.md` | **`/go/[slug]` ad landings — start here.** The shared contract: route, registry, noindex + never-link rules, new-iteration-is-a-new-slug, shared analytics. Routes to the two format docs below |
| `docs/features/LISTICLE_SYSTEM.md` | The `/go` **listicle** format — the two templates (`mm` / `im8`), config shapes, IM8 zone anatomy, the reason copy standard |
| `docs/features/LANDING_QUIZ_SYSTEM.md` | The `/go` **quiz** format — engine, screen schema, scoring modes, Convex event capture |
| `docs/features/BLOG_SYSTEM.md` | **Blog system** — canonical reference for `/blog`. Notion-as-CMS, the content contract (a missing meta description silently skips a post), the render pipeline, and the deploy rules. **Read before any Notion write or blog change:** the blog is static, so a write is invisible until a redeploy, and Next caches Notion responses for a year, so a body edit needs the build cache cleared |
| `docs/features/FAQ_SYSTEM.md` | **FAQ system** — one source of truth, per-surface subsets, schema == visible rule, claims anchors, disclosure policy |
| `docs/development/featurePlans/skio-migration.md` | **Skio: single source of truth** — the whole Loop to Skio subscription migration in one doc (status, selling plans + variants, env vars and flags, embedded customer portal, cutover runbook, decisions). Read before touching subscriptions, `/account`, or selling plans. The retention-pipeline half lives in the separate `conka-lab` repo |
| `docs/features/CART_LOGIC.md` | Cart actions, persistence, B2B normalization |
| `docs/features/NIKE_TRIAL_PAGE.md` | **Nike trial page** (`/nike`) — private, noindex onboarding page for the corporate cognition trial. Placeholders to fill before sharing, hard-coded trial dates, warm-dark treatment |
| `docs/features/CUSTOMER_PORTAL.md` | Account portal |
| `docs/features/b2b/B2B_PORTAL.md` | B2B professional portal |
| `docs/branding/QUALITY_STANDARDS.md` | **Quality bar** — what premium looks like, reference sites, mobile-first mandate, consumability principle |
| `docs/branding/BRAND_VOICE.md` | **Brand voice, proof assets, copy rules, claims compliance** |
| `docs/branding/MOBILE_OPTIMIZATION.md` | Mobile component patterns, split component architecture |
| `docs/development/PERFORMANCE_OPTIMISATION.md` | **Performance rules** — animation, images, scripts, fonts, Lighthouse benchmarks |
| `docs/development/VIDEO_OPTIMISATION.md` | **Video assets** — ffmpeg recipe for the mp4/webm/poster trio, poster frame selection, size budget |
| `docs/development/MOTION_GUIDE.md` | **GSAP motion system** — shared helpers (`app/lib/motion.ts`), patterns, reduced-motion rules; `/app` is the reference |
| `docs/seo-aeo/README.md` | **SEO / AEO foundation** — canonical reference for what is live (canonical, metadata, JSON-LD, sitemap, robots, keyword H1s) and why |
| `docs/analytics/README.md` | **Analytics & attribution index** — current-state fact-box, ad-click-to-Purchase data-flow diagram, and routing to the Meta CAPI / funnel / verification docs |
| `docs/features/KLAVIYO_FLOWS_AND_INTEGRATION.md` | **Klaviyo** — what this app triggers, what Shopify sends, the Alia popup integration, flow definitions |
| `docs/development/CART_ATTRIBUTES.md` | Cart line attributes sent at add-to-cart (`source`, `plan_frequency`) and how `source` is decided |
| `docs/branding/CLAIMS_COMPLIANCE.md` | EFSA claims rules, prohibited claims, mandatory statements |
| `docs/shipping/SHIPPING_AND_COURIERS.md` | Shipping rates, courier economics, Synergy 3PL rate mapping |
| `docs/ops/README.md` | **Commercial / money layer** — COGS, fees, margin, vendors. Route any cost or margin question here |
| `docs/seo-aeo/AEO_PLAYBOOK.md` | Answer-engine optimisation playbook |
| `docs/workflows/REVIEWS_WORKFLOW.md` | Reviews workflow (Loox → site testimonials) |
| `docs/CHANGELOG.md` | Human-readable change log. Add an entry per shipped change |
| `docs/deployment/CONVEX_DEPLOYMENT.md` | Convex setup |
| `docs/deployment/VERCEL_GIT_CONNECTION.md` | Vercel ↔ git connection and its failure modes |
| `docs/development/featurePlans/archive/` | Retired plans and docs, kept only for the rationale they hold. Never current behaviour |

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
| `docs/workflows/10-figma-decks.md` | Building or editing CONKA slide decks in Figma (visual system, deck file keys, asset porting) |
