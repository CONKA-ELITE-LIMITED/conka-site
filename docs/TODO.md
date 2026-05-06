# Deferred Work Tracker

Global tracker for technical debt, cleanup tasks, and deferred work across the codebase.
Each item includes the relevant files, what unblocks it, and why it was deferred.

---

## Protocol System Cleanup

### 1. Delete `app/protocol/[id]/page.tsx` and the protocol route

**Status:** Deferred
**Files:**
- `app/protocol/[id]/page.tsx` -- the old multi-protocol PDP, now superseded by `/conka-both`
- `app/components/protocol/` -- all protocol-specific UI components (ProtocolHero, ProtocolHeroMobile, ProtocolCalendar, ProtocolCalendarMobile, ProtocolRatioSelector, ProtocolTabs, etc.)

**What unblocks it:**
- Confirm no remaining direct links to `/protocol/*` anywhere in the codebase (check analytics for residual traffic before deleting)
- Redirects in `next.config.ts` already handle all incoming traffic (`/protocol/:path*` -> `/conka-both`)
- Review `app/components/product/` components that accept `protocolId` props -- once the protocol page is gone, those code paths become dead weight

**Why deferred:** The old page still exists as a safety net. Once the new `/conka-both` page has been live for a release cycle with no issues, this cleanup can proceed without risk.

---

### 2. Update `CognitiveTestRecommendation.tsx` -- non-Balance protocol links

**Status:** Deferred
**File:** `app/components/cognitive-test/CognitiveTestRecommendation.tsx`
**Lines:** The entries for protocol 1, 2, and 4 still link to `/protocol/1`, `/protocol/2`, `/protocol/4`

**What unblocks it:**
- Decision on what these recommendations should point to now that individual protocols are deprecated
- Options: all redirect to `/conka-both`, or map Flow/Clear recommendations to `/conka-flow` and `/conka-clarity` based on the recommendation logic
- The cognitive test itself is currently hidden from navigation (Phase 1 of simplification plan), so this is low urgency

**Why deferred:** The cognitive test is hidden from nav. The `/protocol/*` catch-all redirect in `next.config.ts` means links still resolve. Proper fix requires a product decision on what the test should recommend now.

---

### 3. Remove protocol exports from shared data modules

**Status:** Deferred -- do after task 1
**Files:**
- `app/lib/productData.ts` -- exports `ProtocolId`, `ProtocolTier`, `protocolContent`, `getProtocolPricing`
- `app/lib/productPricing.ts` -- `protocolPricing` export
- `app/lib/protocolContent.ts` -- entire file
- `app/lib/shopifyProductMapping.ts` -- `getProtocolVariantId` and related protocol variant maps
- `app/lib/productHelpers.ts` -- any protocol-specific helpers
- `app/lib/productMetadata.ts` -- protocol metadata entries

**What unblocks it:** Task 1 (delete protocol page and components) -- once those consumers are gone, these exports become unused and TypeScript will flag them.

**Why deferred:** Still referenced by `app/protocol/[id]/page.tsx` and `app/components/protocol/` components. Removing now would break the existing page.

---

### 4. Simplify `StickyPurchaseFooter` and `StickyPurchaseFooterMobile` -- remove protocol mode

**Status:** Deferred -- do after tasks 1 and 3
**Files:**
- `app/components/product/StickyPurchaseFooter.tsx`
- `app/components/product/StickyPurchaseFooterMobile.tsx`

**What unblocks it:** Tasks 1 and 3. Once the protocol page and data are gone, the `protocolId` / `selectedTier` code paths in these components are dead.

**Why deferred:** Cleanup only; no user-facing impact.

---

### 5. ~~Remove `onTierSelect` / `purchaseType` no-op props from `/conka-both`~~

**Status:** Done -- `/conka-both` now uses `ProductHero` / `ProductHeroMobile` (formulaId="03"). No-op props removed. `ProtocolHero` is no longer used on this page.

---

## B2B / Professionals Portal

### 6. Replace protocol options in `/professionals` with Flow / Clear / Both

**Status:** Deferred
**Files:** `app/professionals/protocol/page.tsx`, `app/components/professionals/protocol/`
**What unblocks it:** Decision on B2B pricing strategy (separate conversation needed per simplification plan)
**Why deferred:** B2B portal is a separate product conversation.
