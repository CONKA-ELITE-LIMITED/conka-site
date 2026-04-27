# Product Page Cadence Widget

## Problem

Product pages (Flow, Clear, Balance) show a 4-pack-size selector and a subscribe/buy-once toggle. This contradicts what the funnel has already pre-sold the visitor on: a 28-shot box with cadence (monthly / quarterly / one-off) as the only variable. The mismatch creates friction at the highest-intent moment in the purchase journey.

## Approach

Swap the pack-size selector and purchase-type tiles in the existing `ProductHero` for the cadence widget already built for the funnel. 28-shot is implicit -- no pack selector. One-off / monthly / quarterly is the only choice the user makes. The CTA button becomes `ConkaCTAButton` matching the funnel. Nothing else in the hero or page layout changes.

This is a widget swap, not a redesign. The redesign (Seed/Suri layout, lifestyle imagery) is Phase 2 and is scoped separately once this is stable.

## Design system

`brand-base.css` (clinical) -- already in use on all three pages.

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Cadence data layer | Not Started |
| 2 | Widget swap on Flow, Clear, Balance | Not Started |
| 3 | Hero layout upgrade (Seed/Suri) | Future |
| 4 | Lifestyle asset upgrade | Future |

---

## Phase 1: Cadence data layer

Extract the cadence/pricing/selling-plan logic from `app/lib/funnelData.ts` into a new shared module so both the funnel and product pages consume the same source of truth.

### Tasks

**1. Create `app/lib/cadenceData.ts`**
- Define `CadenceType`: `"monthly-sub" | "quarterly-sub" | "one-off"`
- Map each cadence to `PackSize` ("28"), `PurchaseType`, and `sellingPlanId` for formulaId "01" and "02"
- Verify Balance (protocol 3) variant IDs are mapped for all three cadences in `shopifyProductMapping.ts` -- if missing, add them or stub with a clear TODO
- Export a `getCadencePricing(formulaId, cadence)` helper that returns `{ price, perShot, variantId, sellingPlanId }`
- Files: `app/lib/cadenceData.ts` (new), `app/lib/funnelData.ts` (import from cadenceData to avoid duplication)

---

## Phase 2: Widget swap

Replace pack-size selector and subscribe/buy-once tiles in `ProductHero` with the cadence selector. Keep carousel, hero layout, page sections, and sticky footer untouched.

### Tasks

**2. Update `ProductHero.tsx` and `ProductHeroMobile.tsx`**
- Remove: `PackSelectorPremium`, subscribe/buy-once tile block
- Add: cadence selector (3 tiles -- Monthly subscription / Quarterly subscription / One-off), wired to `CadenceType` state
- Price display updates reactively to selected cadence
- CTA: replace existing button with `ConkaCTAButton` (matches funnel)
- Add top-of-file comment: `// TODO: layout upgrade pending (product-page-cadence-widget Phase 3) -- do not add new layout logic here`
- Files: `app/components/product/ProductHero.tsx`, `app/components/product/ProductHeroMobile.tsx`

**3. Update `conka-flow/page.tsx`**
- Replace `PackSize` + `PurchaseType` state with `CadenceType`
- Update `handleAddToCartFromHero` and `handleAddToCartFromFooter` to derive `variantId` and `sellingPlanId` from `getCadencePricing`
- Files: `app/conka-flow/page.tsx`

**4. Update `conka-clarity/page.tsx`**
- Same as Task 3 for formulaId "02"
- Files: `app/conka-clarity/page.tsx`

**5. Update Balance page (`/protocol/3`)**
- `ProtocolHero` uses tier + protocol selectors -- simplify for Balance: remove tier selector, wire to cadence model using Balance variant IDs
- Verify all three cadences resolve to valid Shopify variant IDs before shipping
- Files: `app/protocol/[id]/page.tsx`

---

## Rabbit holes

- **StickyPurchaseFooter state sync:** The sticky footer still reads `selectedPack` + `purchaseType`. It will be out of sync once pages switch to `CadenceType`. Do not fix this now -- it is Phase 3 scope. The footer can show a fixed 28-shot price as an interim if needed.
- **Balance variant IDs:** The quarterly selling plan for Balance may not be mapped in `shopifyProductMapping.ts`. Check before building Task 5 -- stub clearly rather than guess.
- **Cadence tile styling:** Reuse the exact tile pattern from the funnel rather than redesigning. Consistency across funnel and product page is the goal.

## No-gos

- No changes to hero carousel or image layout
- No changes to page sections below the hero (ingredients, benefits, FAQ, etc.)
- No new lifestyle photography
- No StickyPurchaseFooter refactor
- No changes to funnel page or FunnelClient

## Risks

- Balance product may have incomplete Shopify variant ID mapping for quarterly -- needs verification before wiring
- `funnelData.ts` refactor (extracting to `cadenceData.ts`) must not break the live funnel page -- run funnel end-to-end after Phase 1

---

## Jira tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| SCRUM-916 | [Website & CRO] Product pages - extract cadence data layer | 1 | To Do |
| SCRUM-917 | [Website & CRO] Product pages - swap pack selector for cadence widget | 2 | To Do |

---

## References

- Funnel page: `app/funnel/FunnelClient.tsx`
- Funnel data: `app/lib/funnelData.ts`
- Current hero: `app/components/product/ProductHero.tsx`, `ProductHeroMobile.tsx`
- Shopify mapping: `app/lib/shopifyProductMapping.ts`
- Simplification plan: `docs/development/WEBSITE_SIMPLIFICATION_PLAN.md` (Phase 5C)
- Design system: `docs/branding/DESIGN_SYSTEM.md`
- Clinical aesthetic: `docs/branding/CLINICAL_AESTHETIC.md`
