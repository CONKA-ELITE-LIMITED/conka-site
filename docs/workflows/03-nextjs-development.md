# Next.js Development

> **Purpose:** This document defines patterns, conventions, and decision logic specific to the Next.js website project. Reference this whenever building or modifying pages, components, or server-side logic.

---

## When to use this document

- Building any new page, component, or feature
- Modifying existing UI or server-side code
- Making decisions about rendering strategy, data fetching, or routing
- Unsure about the right pattern for a task

---

## Project structure

```
├── app/                        # App Router pages and layouts
│   ├── layout.tsx              # Root layout (nav, footer, CartDrawer, analytics)
│   ├── page.tsx                # Homepage
│   ├── brand-base.css          # Design system tokens and layout classes
│   ├── conka-flow/             # Flow product page
│   ├── conka-clarity/          # Clarity product page
│   ├── protocol/[id]/          # Protocol detail pages
│   ├── quiz/                   # Quiz + results
│   ├── shop/                   # Shop page
│   ├── account/                # Account portal (login, subscriptions, orders)
│   ├── api/                    # API route handlers
│   │   ├── cart/               # Cart proxy to Shopify
│   │   ├── auth/               # Auth + subscription actions (Loop)
│   │   └── meta/               # Meta CAPI events
│   ├── components/             # Shared/reusable components
│   ├── context/                # React contexts (CartContext, AuthContext)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core logic, Shopify client, product data, analytics
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── convex/                     # Convex database schema and functions
├── docs/                       # Project documentation
├── middleware.ts                # Edge middleware
└── next.config.js              # Next.js configuration
```

---

## Rendering strategy decision tree

```
Does this page/content change per-request (user-specific, real-time)?
├── YES → Dynamic rendering (no caching, or short revalidation)
│         Example: Cart page, account pages, checkout
│
└── NO → Can the data be cached and revalidated periodically?
         ├── YES → Static with ISR (Incremental Static Regeneration)
         │         Set revalidate time based on how often data changes
         │         Example: Product pages (revalidate: 60-900)
         │         Example: Collection pages (revalidate: 60-900)
         │         Example: Homepage (revalidate: 60-300)
         │
         └── NO → Fully static (built once at deploy time)
                   Example: About page, policies, FAQ
```

### Caching rules
```tsx
// Static page with ISR
export const revalidate = 300; // 5 minutes

// Dynamic page (no caching)
export const dynamic = 'force-dynamic';

// Per-fetch revalidation
const data = await fetch(url, { next: { revalidate: 60 } });
```

> **Document your established revalidation times here so they're consistent across pages.**

---

## Server Components vs Client Components

### Default: Server Components
Every component is a Server Component by default. Keep it that way unless you specifically need client-side behaviour.

**Server Components CAN:**
- Fetch data directly (await in the component body)
- Access backend resources securely
- Keep sensitive logic/tokens server-side
- Reduce client JavaScript bundle

**Server Components CANNOT:**
- Use useState, useEffect, or other React hooks
- Use browser APIs (window, document, localStorage)
- Add event handlers (onClick, onChange, etc.)
- Use context providers/consumers

### When to use Client Components
Add `'use client'` ONLY when the component needs:
- State management (useState, useReducer)
- Effects (useEffect)
- Event handlers (onClick, onChange, onSubmit)
- Browser APIs
- Third-party libraries that require client-side execution

### The pattern: keep Client Components small
```tsx
// ✅ GOOD: Server Component fetches, passes data to small Client Component
// app/products/[handle]/page.tsx (Server Component)
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);
  return (
    <div>
      <ProductInfo product={product} />        {/* Server Component */}
      <AddToCartButton variantId={product.variants[0].id} />  {/* Client Component — small, focused */}
    </div>
  );
}

// components/product/AddToCartButton.tsx
'use client';
export function AddToCartButton({ variantId }: { variantId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  // Only the interactive part is a Client Component
}

// ❌ BAD: Entire page is a Client Component because one button needs state
'use client';
export default function ProductPage() { ... }
```

---

## Routing conventions

### File naming (App Router)
```
app/
├── page.tsx              → /
├── about/page.tsx        → /about
├── products/page.tsx     → /products
├── products/[handle]/
│   ├── page.tsx          → /products/[handle]
│   └── loading.tsx       → Loading UI for this route
├── collections/[slug]/
│   └── page.tsx          → /collections/[slug]
└── api/
    └── webhook/route.ts  → /api/webhook
```

### Every route should have
- `page.tsx` — the page component
- `loading.tsx` — loading skeleton/state (use this for Suspense boundaries)
- `error.tsx` — error boundary for this route segment
- Metadata export (see SEO section in `./02-implementation-workflow.md`)

### Dynamic routes
```tsx
// For pre-building known paths at build time
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}
```

---

## Data fetching patterns

### Shopify Storefront API
- Client/helpers location: `app/lib/shopify.ts`
- Queries location: `app/lib/shopifyQueries.ts`
- Types location: `app/types/`

```tsx
// Pattern for fetching in Server Components
// In app/products/[handle]/page.tsx
import { getProduct } from 'app/lib/shopify.ts';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  
  if (!product) return notFound();
  
  return <ProductDetails product={product} />;
}
```

### API route pattern (for mutations / webhooks)
```tsx
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input
    // Process request
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Description' },
      { status: 500 }
    );
  }
}
```

### Server Actions pattern (for form submissions / cart operations)
```tsx
// lib/actions/cart.ts
'use server';

export async function addToCart(variantId: string, quantity: number = 1) {
  // Validate
  // Call Shopify API
  // Revalidate relevant paths
  revalidatePath('/cart');
}
```

---

## Styling

Reference the design system at: `docs/branding/DESIGN_SYSTEM.md`

### Approach
- Primary styling method: Tailwind CSS + CSS custom properties (design tokens)
- Theme/tokens location: `app/brand-base.css` (the single stylesheet)
- Global styles: `app/globals.css`, `app/brand-base.css`

### Key rules
1. **Use design tokens** — never hard-code colours, spacing, or font sizes
2. **Mobile-first is mandatory** — build for 390px first, then adapt upward. 74% of traffic is mobile. Every component must be reviewed on mobile before desktop. See `docs/branding/QUALITY_STANDARDS.md`.
3. **Use `next/image`** for all images — never raw `<img>` tags
4. **Prioritise Core Web Vitals** — avoid layout shift (CLS), keep LCP fast

### Responsive approach
Mobile-first (hard requirement, not preference). Write base styles for mobile, add complexity at breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px (matches `.brand-track` max-width)

---

## Environment variables

- Local: `.env.local` (git-ignored)
- Vercel: configured in project settings (auto-injected at build/runtime)
- Location of env type definitions: `app/lib/env.ts`

### Required variables
```
[LIST YOUR REQUIRED ENV VARS — e.g.:]
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_ADMIN_ACCESS_TOKEN=       # Only in server-side code
NEXT_PUBLIC_SITE_URL=
LOOP_API_KEY=
[OTHERS]
```

### Rules
- `NEXT_PUBLIC_` prefix → exposed to the browser (safe for non-sensitive values only)
- No prefix → server-only (use for API keys, tokens, secrets)
- **NEVER put secret keys in `NEXT_PUBLIC_` variables**
- When adding new env vars: update `.env.local`, `.env.example`, AND Vercel project settings

---

## Deployment model

```
Feature branch → push → Vercel preview deployment (auto)
                                ↓
                        Review on preview URL
                                ↓
                    Merge to main → Vercel production deployment (auto)
```

### Branch conventions
- Feature: `feature/short-description` or `short-description`
- Bugfix: `fix/short-description` or `short-description-bug`
- Hotfix: `hotfix/brief-description`

### Preview deployments
- Every push creates a preview at `[project]-[branch]-[hash].vercel.app`
- Preview deployments use the **same environment variables** as production unless overridden
- Use previews to verify before merging — this is your staging environment
- Share preview URLs in Jira tickets for review

### Production deployment
- Merging to `main` automatically deploys to production
- **There is no separate staging environment** (previews serve this purpose)
- IF a production deploy needs to be rolled back → revert the merge commit and push to `main`

---

## Performance budget

> **Web Vitals targets — check these on every preview deployment:**

| Metric | Target | What it measures |
|--------|--------|-----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Loading speed |
| FID (First Input Delay) | < 100ms | Interactivity |
| CLS (Cumulative Layout Shift) | < 0.1 | Visual stability |
| TTFB (Time to First Byte) | < 800ms | Server response |

### Common performance pitfalls
- Large unoptimised images (use `next/image`)
- Unnecessary Client Components (keep them small)
- Fetching data client-side that could be server-side
- Large third-party scripts blocking render
- Not using `loading.tsx` boundaries for slow data fetches

---

## Common gotchas in this project

> **Fill this section in over time.**

- `.premium-pdp` has `overflow-x: hidden` which breaks `position: sticky`. Place sticky sections *outside* `.premium-pdp`.
- Components return content only — no `<section>`, no `max-w-*`, no `px-*` at root. The page owns section wrappers.
- Import product data from the barrel `app/lib/productData.ts`, never from sub-modules directly.
- Middleware runs on the Edge — can't use Node.js APIs.
- `next/image` requires explicit width/height or a sized parent with `fill`.

---

## References
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Shopify/commerce: `./04-shopify-commerce.md`
- Implementation workflow: `./02-implementation-workflow.md`
