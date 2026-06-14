# CONKA `/lander` — Developer Handover

**Goal:** add a standalone marketing landing page at **`conka.io/lander`**.
**Package:** `conka-lander-next.zip` (drop-in for this repo — paths mirror the repo 1:1).
**Detailed reference:** `INTEGRATION.md` inside the zip (this doc is the standalone summary).

---

## TL;DR
A self-contained `/lander` route. React + CSS Modules, no new dependencies. It does
**not** touch the site cart drawer — it's a straight-to-checkout funnel: buy button →
creates a Shopify cart → redirects to checkout. Products/prices are pulled **live** from
Shopify (GBP). Everything is scoped (CSS Modules + a `.conka-lander` wrapper), so there's
**zero risk of clashing** with Tailwind or the rest of the site.

Estimated effort: **~1–2 hours** (mostly wiring 4 things + a build).

---

## Stack this was built against (please confirm)
- Next **16.0.7**, React **19.2.0**, TypeScript, **App Router** (`app/`)
- Tailwind v4 primary; **CSS Modules** also enabled (the lander uses Modules)
- Headless Shopify via `app/lib/shopify.ts`; checkout via `app/lib/funnelCheckout.ts` / `POST /api/cart`
- Vercel (auto preview deploys; `next build` type-checks + lints)

---

## What's in the package
```
app/lander/
  page.tsx                 server component — fetches 3 products, renders the page
  lander.css               page-scoped font + smooth-scroll (uses :has() to stay scoped)
  sections/
    Nav, Hero, LogoMarquee, IngredientsSection, BrainFuelBand,
    BuyBoxes/ (BuyBoxes.tsx, BuyCard.tsx, buyboxes.data.ts, lander-checkout.ts, .module.css),
    CrashChart, Testimonials, ResearchPartners, Reviews, Measure, Footer
public/lander/             ~51 images + video/BrainFuel.mp4
app/fonts/ABCFavorit/      6 font files (Regular/Medium/Bold + italics)
```

---

## Integration steps

### 1. Copy the folders in (paths match the repo)
- `app/lander/` → `app/lander/`
- `public/lander/` → `public/lander/`
- `app/fonts/ABCFavorit/` → `app/fonts/ABCFavorit/`

The route will resolve at **`/lander`** (confirmed free — no middleware/i18n/catch-all intercepts it).

### 2. Confirm env vars exist (they should already)
```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
```
(Storefront API version 2025-10 is set inside `app/lib/shopify.ts`.)

### 3. Fix two import aliases to match this repo
1. **`app/lander/page.tsx`**
   ```ts
   import {shopifyFetchCached} from '@/lib/shopify';   // ← change to your alias for app/lib/shopify.ts
   ```
   Also confirm the call shape: the page calls `shopifyFetchCached({query})` and defensively
   unwraps `{data}` / `{body:{data}}` / the data object — adjust if your helper differs.
2. **`app/lander/sections/BuyBoxes/lander-checkout.ts`** — see step 5.

### 4. Add ABC Favorit font (`app/layout.tsx`)
Files are in `app/fonts/ABCFavorit/`. Add alongside the existing `next/font/local` fonts:
```ts
import localFont from 'next/font/local';

const abcFavorit = localFont({
  src: [
    {path: './fonts/ABCFavorit/ABCFavorit-Regular.otf', weight: '100', style: 'normal'},
    {path: './fonts/ABCFavorit/ABCFavorit-Regular.otf', weight: '400', style: 'normal'},
    {path: './fonts/ABCFavorit/ABCFavorit-Medium.otf',  weight: '500', style: 'normal'},
    {path: './fonts/ABCFavorit/ABCFavorit-Bold.otf',    weight: '850', style: 'normal'},
  ],
  variable: '--font-abc-favorit',
  display: 'swap',
});
```
Add `abcFavorit.variable` to the `<body className={...}>`. The lander reads
`var(--font-abc-favorit)` in `app/lander/lander.css` — rename there if you use a different var.
⚠️ **ABC Favorit is a licensed font — confirm web-use coverage before going public.**

### 5. Wire checkout (`app/lander/sections/BuyBoxes/lander-checkout.ts`)
Works out of the box via **`POST /api/cart`** (`{action:'create', variantId, quantity, sellingPlanId?}`
→ redirect to `cart.checkoutUrl`). **Recommended:** switch to **`funnelCheckout()`** (fires analytics) —
uncomment the import (fix its alias) + the funnelCheckout block at the top of the file.

### 6. Confirm product handles (`app/lander/page.tsx`, `BUY_QUERY`)
| Box | Handle | Target variant |
|---|---|---|
| Bundle | `conka-flow-clear` | "Both - 56 Shots" + monthly selling plan |
| Flow | `protocol-conka-balance-copy` | "Flow - 28 Shots" |
| Clear | `conka-flow-copy` | "Clear - 28 Shots" |

All prices, the strikethrough, per-shot maths, and the subscription discount are derived
**live** from these — update products/prices in Shopify admin, not in code.

### 7. Build & lint
```
npm run build          # must pass (Vercel runs this)
npm run lint:changed
```

### 8. Deploy
Push a branch + open a PR → Vercel preview URL for `/lander`. Review, then merge to ship.

---

## How it works (architecture)
- **`page.tsx`** is a server component: fetches the 3 products (ISR, `revalidate = 600`),
  shapes pricing, and renders the sections inside a `.conka-lander` wrapper.
- **Server vs client:** static sections are server components; interactive ones
  (`Nav`, `IngredientsSection`, `CrashChart`, `Measure`, `BuyBoxes`, `BuyCard`) are `'use client'`.
- **Checkout:** `BuyCard` → `landerCheckout()` → cart create → `window.location = checkoutUrl`.
- **Styling:** every class is a hashed CSS Module; the font + smooth-scroll are scoped to
  `.conka-lander` (via `:has()`), so nothing leaks in or out.
- **Nav cart icon + hero CTA + "Join them today"** all smooth-scroll to `#purchase-section`.

---

## Verify on the preview (QA checklist)
- [ ] Page renders at `/lander`, fonts correct (ABC Favorit), no console errors
- [ ] Products load with **live GBP prices**; subscription vs one-time toggle changes price + strikethrough
- [ ] Flow/Clear toggle on the single card swaps image/title/variant
- [ ] **Start Now** (subscription) → Shopify checkout with the right variant **+ selling plan**
- [ ] **Buy Once** (one-time) → checkout, no selling plan
- [ ] Mobile (≈393px) and desktop (≥1000px) layouts both correct
- [ ] Analytics fire on checkout (if using `funnelCheckout`)

---

## Caveats & recommended follow-ups
- **CSP:** the lander uses no third-party scripts/assets (all local, inline SVG, CSS animation).
  It does use a few inline `style` attributes — if `next.config.ts` CSP `style-src` is strict
  (no `'unsafe-inline'`), allow them or they'll be blocked.
- **Images:** currently `<img>` (build-safe). Converting to `next/image` is a recommended
  perf/LCP follow-up — they're local in `public/lander/`, so just add width/height.
- **Compliance:** health/cognitive claims, stats, and athlete quotes need sign-off vs UK
  supplement/ASA rules before public launch (not a code task).

---

## Future changes
The lander is self-contained, so iteration is low-risk: edit files under `app/lander/`,
branch → Vercel preview → review → merge. Products/prices change in **Shopify admin** (no deploy).

Questions on intent/design → product owner. The page was prototyped + tested in a Hydrogen
reference build, then ported to this Next package; behaviour should match that reference.
