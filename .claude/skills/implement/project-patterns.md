Project-specific patterns and references for /implement (consult while building in any phase — pages, data, design system, analytics, architecture).

---

## Project-Specific Patterns to Follow

### Pages and routing
- **Pages:** `app/[route]/page.tsx` -- App Router file conventions
- **Layouts:** `app/[route]/layout.tsx` -- shared layout per route segment
- **Loading:** `app/[route]/loading.tsx` -- Suspense boundary
- **Error:** `app/[route]/error.tsx` -- error boundary (must be Client Component)
- **Page-specific components:** co-locate with the page or in `app/components/[feature]/`
- **Shared components:** `app/components/`

### Data and commerce
- **Product data barrel:** `app/lib/productData.ts` -- always import from here
- **Shopify queries:** `app/lib/shopifyQueries.ts`
- **Cart context:** `app/context/CartContext.tsx` -- all cart operations
- **Cart API proxy:** `app/api/cart/route.ts`
- **Funnel data:** `app/lib/funnelData.ts` (standalone, does not modify shared product data)
- **Offer constants:** `app/lib/offerConstants.ts` -- never hardcode guarantee periods or offer terms

### Design system
- **Tokens:** `app/brand-base.css` -- the single stylesheet (`premium-base.css` is deleted)
- **Direction:** Simple DTC (cart/nav/PDP) vs Clinical `.brand-clinical` (evidence/app-dark) -- see DESIGN_SYSTEM.md §8.5
- **Design system doc:** `docs/branding/DESIGN_SYSTEM.md`
- **Brand voice:** `docs/branding/BRAND_VOICE.md`

### Analytics
- **Vercel Analytics:** `app/lib/analytics.ts`
- **Triple Whale:** `app/lib/tripleWhale.ts`
- **Meta Pixel:** `app/lib/metaPixel.ts`
- **Meta CAPI:** `app/api/meta/events/route.ts`
- **All analytics fire from `CartContext`** after successful cart mutations

### Key architectural rules
- **Server Components by default.** Only use `'use client'` for interactivity.
- **No custom checkout.** Redirect to `cart.checkoutUrl` (Shopify hosted).
- **Cart ID in localStorage** as `shopify_cart_id`. Cart data lives in Shopify.
- **`clearCart()` removes localStorage ref only** -- Shopify cart still exists.
- **B2B tier normalization** runs after any cart mutation via `getB2BCartTierUpdates`.
- **Sticky positioning gotcha:** `.premium-pdp` has `overflow-x: hidden` which breaks `position: sticky`. Place sticky sections outside `.premium-pdp`.

---

## References

- Implementation workflow: `docs/workflows/02-implementation-workflow.md`
- Next.js patterns: `docs/workflows/03-nextjs-development.md`
- Shopify conventions: `docs/workflows/04-shopify-commerce.md`
- Code review: `docs/workflows/06-code-review.md`
- Testing: `docs/workflows/07-testing-validation.md`
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Brand voice: `docs/branding/BRAND_VOICE.md`
- Quality standards: `docs/branding/QUALITY_STANDARDS.md`
- Feature plans: `docs/development/featurePlans/`
