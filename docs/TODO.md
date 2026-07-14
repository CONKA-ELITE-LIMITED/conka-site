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

**Status:** DONE (Phase 4, July 2026). The dead protocol code (`protocolPricing`, `PROTOCOL_COLORS`, `getProtocolVariantId` and the unused variant-audit helpers) is deleted. What genuinely still serves existing subscribers is quarantined in `app/lib/legacy/protocolSubscriptions.ts`, and the `productData` barrel no longer exports anything protocol-related.

**Remaining follow-up:** `app/api/auth/subscriptions/[id]/pause/route.ts` carries its own duplicate `PROTOCOL_VARIANTS` table (keyed by numeric variant ID, not GID). Unifying it with the legacy module means touching the renewal path for paying subscribers, so it needs an end-to-end test of a real subscription edit. Left deliberately.

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

## Shop System Cleanup

### 7. ~~Delete orphaned shop components~~

**Status:** Done (May 2026) -- entire `app/components/shop/` directory deleted. Zero consumers confirmed before deletion.

---

## B2B / Professionals Portal

### ~~6. Delete B2B/Professionals feature entirely~~

**Status:** Done (May 2026) -- Full B2B removal complete. TypeScript clean.
- Deleted: `app/professionals/`, `app/components/professionals/`, `app/lib/b2bCartTier.ts`, `docs/features/b2b/`
- Removed: B2B variant maps from `shopifyProductMapping.ts`, B2B helpers from `productHelpers.ts`, B2B constants from `productPricing.ts`, `B2BTier` from `productTypes.ts`
- Removed: B2B state from `CartContext` and `CartDrawer`, `updateMultiple` action from `app/api/cart/route.ts`
- Added: `/professionals/:path*` redirect to `/` in `next.config.ts`

---

## Product Data Accuracy

### 9. Verify the true active grammage for Flow and Clear

**Status:** Blocked on Humphrey
**Files:**
- `docs/product/FORMULATION_SPEC.md` -- states Flow 5,550mg / Clear ~4,965mg total
- `FORMULA_GRAMMAGE` (PDP hero number) -- publishes Flow 3,700mg / Clear 3,142mg
- `app/components/landing/LandingProductShowcase.tsx`, `app/lander/sections/IngredientsSection/ingredients.data.ts` (+ the trial-b clone) -- render the site figures

**The problem:** the two disagree, and the total active load is a **public** figure under the 2026-07-14 disclosure decision (per-ingredient mg and formula percentages are secret; the total is not). It is currently a hero number on the PDP, so it needs to be the right one.

**Working theory (Rudh):** the site figure is the *active nootropics* grammage and the spec total counts more than that. Worth noting the arithmetic does not obviously support this, which is why it needs the formulator rather than a guess:

- **Flow:** the spec's six ingredients sum to exactly 5,550mg, and all six are actives. The 1,850mg gap to the site's 3,700mg maps to no single ingredient or obvious grouping.
- **Clear:** spec actives are ~4,725mg with the vitamins and ~2,223mg without. The site's 3,142mg matches neither.

So the basis for the published number is not recoverable from the spec.

**What unblocks it:** Humphrey confirming (a) which figure is correct, and (b) what basis the published number is computed on, so it can finally be written down in the spec.

**Also verify while he is there:** Ginkgo Biloba is published as 120mg but the spec says 88mg. Understating a dose is embarrassing; overstating one is the direction that carries real risk.

**Why deferred:** not a code problem. Needs the formulator.

---

### 10. Finish the mg disclosure migration

**Status:** Ready to ticket (see `docs/development/featurePlans/faq-answer-surface.md`)

**The rule (confirmed 2026-07-14):** formula-share percentages and per-ingredient mg are **secret** and must never reach client code, rendered or not (data files ship in the JS bundle). Public: the total active mg per shot, study doses from published literature (labelled as the *study's* dose, never "per serving"), and Vitamin C / B12 with %NRV.

**`app/lib/supplementFacts.ts` is the correct reference implementation** (built from the spec in April): no per-ingredient mg to the client, ingredient *order* preserved (supplement-facts convention is descending concentration, so relative quantity is communicated without numbers), only C and B12 carry %NRV. It is used by exactly one component, `IngredientsPanel`. The migration was never finished.

**Still leaking, and the figures are wrong as well as disallowed:**
- `app/components/KeyBenefits.tsx` and `KeyBenefitsDesktop.tsx` -- render "600mg per serving" etc. These are **study doses mislabelled as ours**.
- `app/components/landing/LandingProductShowcase.tsx` -- the 3,700mg / 3,142mg totals (see item 9).
- `app/lib/formulaContent.ts` -- `dosage` and `percentage` fields.
- `app/lander/sections/IngredientsSection/ingredients.data.ts` and the `(trial-b)` clone.

**Why it matters beyond policy:** we currently understate most actives by 2 to 5x (throwing away the "clinically dosed" differentiator) while overstating Ginkgo.

---

## Claude Skills Audit

### 8. Review and tighten `.claude/skills/` to reduce token waste

**Status:** Deferred
**Files:** `.claude/skills/scope/` (all sub-docs), `.claude/skills/implement/` (if exists)

**What to fix:**
- `/scope` fires a research subagent for every B/C task even on familiar codebases -- make it opt-in or skip when context is already loaded
- challenge + shape steps load separate sub-docs sequentially -- collapse into one inline response for known-codebase B-scale tasks
- plan doc + Jira creation add ~3K tokens for tasks that don't need them -- gate behind explicit user request or C-scale only
- Add a `--quick` flag that skips research, skips plan doc, creates one ticket, returns compact scope

**Why deferred:** Not urgent, but a `/scope` on a simple funnel refactor consumed 35K tokens before any code was written. Fix before the next large feature.
