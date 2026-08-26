# CONKA Documentation Index

The single entry point to the `docs/` tree. Skim this to find the canonical doc for a topic instead of grepping. Each row links the doc and states what it is the source of truth for.

> **Also load `CLAUDE.md`** (repo root) for the working agreement: operating efficiency, git workflow, stack, key files, design-system rules, and the strategic direction (protocol removal, funnel/landing build).

---

## Start here

| Doc | What it is |
|-----|-----------|
| [`MASTER_CONTEXT.md`](./MASTER_CONTEXT.md) | High-level architecture + business context. Read first on any unfamiliar area. |
| [`development/CODEBASE_AUDIT_AND_ROADMAP.md`](./development/CODEBASE_AUDIT_AND_ROADMAP.md) | Current state + prioritised roadmap (performance, code quality, architecture). Read before feature work. |
| [`TODO.md`](./TODO.md) | Deferred-work / tech-debt tracker. Each item lists files, what unblocks it, and why it was deferred. |
| [`PAGE_NARRATIVES.md`](./PAGE_NARRATIVES.md) | Page-by-page story map + health rating. Find the weakest section to improve next. |
| [`CHANGELOG.md`](./CHANGELOG.md) | Human-readable change log. |

---

## Product / SKU / Pricing

The most important cluster for anything touching products, variants, or money.

| Doc | Source of truth for |
|-----|--------------------|
| [`product/SKU_AND_SHOT_REFERENCE.md`](./product/SKU_AND_SHOT_REFERENCE.md) | **Canonical SKU + shot-count map** across all three product generations (funnel / legacy protocol / main-site formula). Reconciles the conflicting shot-count numbers and documents the account-portal shot/per-shot display history (why the tiles were removed). Start here for "which SKU / how many shots / what price". |
| [`product/PRODUCT_DATA.md`](./product/PRODUCT_DATA.md) | How the product-data **code** is organised: the two systems (main site barrel vs funnel), module dependency graph, where Shopify GIDs live. |
| [`product/FORMULATION_SPEC.md`](./product/FORMULATION_SPEC.md) | Physical formulation: per-shot doses, ingredients, %NRV, nutrition-label data for Flow (01) and Clear (02). |
| [`product/LOOX_PRODUCT_IDS_AND_SHOPIFY.md`](./product/LOOX_PRODUCT_IDS_AND_SHOPIFY.md) | Loox → Shopify product-ID mapping for reviews. |
| [`PRICING_HISTORY.md`](./PRICING_HISTORY.md) | Dated audit log of funnel price changes. Append a block on every price change. |
| [`development/CART_PRICING_SOURCE_OF_TRUTH.md`](./development/CART_PRICING_SOURCE_OF_TRUTH.md) | Rule: pre-add UI prices from `productPricing.ts`; cart/checkout prices from Shopify only. |
| [`development/GO_LIVE_PRICING_AUDIT.md`](./development/GO_LIVE_PRICING_AUDIT.md) | Variant/price reconciliation audit. |

**Code source of truth:** `app/lib/byoData.ts` (Build Your Order offer catalogue), `app/lib/shopifyProductMapping.ts` + `app/lib/productData.ts` barrel (main site), `app/lib/legacy/protocolSubscriptions.ts` (retired protocols, live for existing subscribers).

---

## Features & surfaces

| Doc | Topic |
|-----|-------|
| [`features/CART_LOGIC.md`](./features/CART_LOGIC.md) | Cart actions, persistence, B2B tier normalization. |
| [`features/skio/README.md`](./features/skio/README.md) | **Canonical Skio reference** — subscription platform replacing Loop: setup, migration, embedded customer portal. |
| [`features/CUSTOMER_PORTAL.md`](./features/CUSTOMER_PORTAL.md) | Account portal — the self-built Loop portal Skio replaces (subscription edit rules, pack-size ↔ cadence mapping). |
| [`features/MOBILE_SUBSCRIPTION_INTEGRATION.md`](./features/MOBILE_SUBSCRIPTION_INTEGRATION.md) | Mobile subscription-card display. |
| [`features/b2b/B2B_PORTAL.md`](./features/b2b/B2B_PORTAL.md) | **Canonical B2B reference** — `/professionals`, pricing/VAT, draft orders, Xero, shipping. |
| [`features/BLOG_SYSTEM.md`](./features/BLOG_SYSTEM.md) | Blog (`/blog`) — Notion-as-CMS, content contract, deploy rules. Read before any Notion write. |
| [`features/LISTICLE_SYSTEM.md`](./features/LISTICLE_SYSTEM.md) | Listicle landings (`/go/[slug]`) — templates + config. |
| [`features/LANDING_QUIZ_SYSTEM.md`](./features/LANDING_QUIZ_SYSTEM.md) | Ad landing quiz system (`/go/[slug]`). |
| [`features/FAQ_SYSTEM.md`](./features/FAQ_SYSTEM.md) | FAQ single-source rule, per-surface subsets, claims anchors. |
| [`features/NIKE_TRIAL_PAGE.md`](./features/NIKE_TRIAL_PAGE.md) | Private Nike trial onboarding page (`/nike`). |
| [`features/CASE_STUDIES.md`](./features/CASE_STUDIES.md) · [`features/TESTIMONIALS.md`](./features/TESTIMONIALS.md) · [`features/CROSS_SELL.md`](./features/CROSS_SELL.md) · [`features/BANNER_SYSTEM.md`](./features/BANNER_SYSTEM.md) · [`features/WHAT_TO_EXPECT.md`](./features/WHAT_TO_EXPECT.md) · [`features/KLAVIYO_FLOWS_AND_INTEGRATION.md`](./features/KLAVIYO_FLOWS_AND_INTEGRATION.md) · [`features/PROJECT_OVERVIEW.md`](./features/PROJECT_OVERVIEW.md) | Other feature surfaces. |

---

## Branding & design

| Doc | Topic |
|-----|-------|
| [`branding/DESIGN_SYSTEM.md`](./branding/DESIGN_SYSTEM.md) | **Active design system** — tokens, typography, radius, layout, Simple DTC spec. |
| [`branding/BRAND_VOICE.md`](./branding/BRAND_VOICE.md) | Brand voice, proof assets, copy rules, claims compliance. |
| [`branding/QUALITY_STANDARDS.md`](./branding/QUALITY_STANDARDS.md) | Quality bar, reference sites, mobile-first mandate. |
| [`branding/MOBILE_OPTIMIZATION.md`](./branding/MOBILE_OPTIMIZATION.md) | Mobile component patterns, split-component architecture. |
| [`branding/CLAIMS_COMPLIANCE.md`](./branding/CLAIMS_COMPLIANCE.md) | EFSA claims rules, prohibited claims, mandatory statements. |

---

## Development & performance

| Doc | Topic |
|-----|-------|
| [`development/PERFORMANCE_OPTIMISATION.md`](./development/PERFORMANCE_OPTIMISATION.md) | Performance rules — animation, images, scripts, fonts, Lighthouse benchmarks. |
| [`development/VIDEO_OPTIMISATION.md`](./development/VIDEO_OPTIMISATION.md) | Video asset recipe (mp4/webm/poster). |
| [`development/MOTION_GUIDE.md`](./development/MOTION_GUIDE.md) | GSAP motion system + reduced-motion rules. |
| [`development/CART_ATTRIBUTES.md`](./development/CART_ATTRIBUTES.md) | Cart line attributes for attribution/LTV tagging. |
| [`development/TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md`](./development/TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md) | Trial-page performance playbook. |
| [`development/featurePlans/`](./development/featurePlans/) | Per-feature scoping/plan docs. Notable: [`asset-and-protocol-cleanup.md`](./development/featurePlans/asset-and-protocol-cleanup.md) (protocol retirement), [`order-size-shipping-tiers.md`](./development/featurePlans/order-size-shipping-tiers.md), [`account-portal-simple-dtc.md`](./development/featurePlans/account-portal-simple-dtc.md), [`landing-conversion/README.md`](./development/featurePlans/landing-conversion/README.md). |

---

## Analytics & attribution

| Doc | Topic |
|-----|-------|
| [`analytics/README.md`](./analytics/README.md) | **Analytics index** — fact-box, ad-click→Purchase data flow, routing to sub-docs. |
| [`analytics/META_PIXEL_AND_CAPI.md`](./analytics/META_PIXEL_AND_CAPI.md) | Meta Pixel + server-side CAPI dedup. |
| [`analytics/HEADLESS_ATTRIBUTION_FIX.md`](./analytics/HEADLESS_ATTRIBUTION_FIX.md) | Checkout-domain cookie-split root cause + fix. |
| [`analytics/BYO_EVENTS.md`](./analytics/BYO_EVENTS.md) | Funnel event taxonomy. |
| [`analytics/LISTICLE_PERFORMANCE.md`](./analytics/LISTICLE_PERFORMANCE.md) | Live listicle ad-spend performance data. |

---

## SEO / AEO

| Doc | Topic |
|-----|-------|
| [`seo-aeo/README.md`](./seo-aeo/README.md) | **SEO/AEO foundation** — canonical, metadata, JSON-LD, sitemap, robots, keyword H1s. |
| [`seo-aeo/AEO_PLAYBOOK.md`](./seo-aeo/AEO_PLAYBOOK.md) | Answer-engine optimisation playbook. |
| [`seo-aeo/aeo-scorecard.md`](./seo-aeo/aeo-scorecard.md) · [`seo-aeo/seo-search-console-baseline.md`](./seo-aeo/seo-search-console-baseline.md) | Scorecard + baseline. |

---

## Operations

| Doc | Topic |
|-----|-------|
| [`shipping/SHIPPING_AND_COURIERS.md`](./shipping/SHIPPING_AND_COURIERS.md) | Shipping rates, couriers, Synergy 3PL mapping. |
| [`deployment/CONVEX_DEPLOYMENT.md`](./deployment/CONVEX_DEPLOYMENT.md) | Convex backend setup. |
| [`deployment/VERCEL_GIT_CONNECTION.md`](./deployment/VERCEL_GIT_CONNECTION.md) | Vercel ↔ git connection. |
| [`sprints/README.md`](./sprints/README.md) | Commercial/growth sprints (time-boxed ad-spend trials, launches). |
| [`conkaAppData/`](./conkaAppData/) | CONKA app cognition-trial data + reports. |

---

## Workflows (process docs)

Read the relevant one before starting that kind of task. Full index: [`workflows/README.md`](./workflows/README.md).

| Doc | When |
|-----|------|
| [`workflows/01-scoping-work.md`](./workflows/01-scoping-work.md) | Before any non-trivial feature. |
| [`workflows/02-implementation-workflow.md`](./workflows/02-implementation-workflow.md) | Step-by-step build process. |
| [`workflows/03-nextjs-development.md`](./workflows/03-nextjs-development.md) | Next.js patterns, rendering, data fetching. |
| [`workflows/04-shopify-commerce.md`](./workflows/04-shopify-commerce.md) | Shopify APIs, cart, checkout, subscriptions (Loop). |
| [`workflows/05-creating-documentation.md`](./workflows/05-creating-documentation.md) | Creating/updating docs. |
| [`workflows/06-code-review.md`](./workflows/06-code-review.md) | Self-review checklist before a PR. |
| [`workflows/07-testing-validation.md`](./workflows/07-testing-validation.md) | Testing layers + validation. |
| [`workflows/08-jira-workflow.md`](./workflows/08-jira-workflow.md) | Ticket creation, transitions, ACs. |
| [`workflows/09-ux-iteration.md`](./workflows/09-ux-iteration.md) | Refining pages for conversion. |
| [`workflows/REVIEWS_WORKFLOW.md`](./workflows/REVIEWS_WORKFLOW.md) | Reviews workflow. |

---

_Keep this index current: when you add a doc under `docs/`, add one row here in the right section._
