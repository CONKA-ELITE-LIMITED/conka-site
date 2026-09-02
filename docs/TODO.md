# Deferred Work Tracker

Global tracker for technical debt, cleanup tasks, and deferred work across the codebase.
Each item includes the relevant files, what unblocks it, and why it was deferred.

---

## Subscriptions (Skio)

### Unconfirmed: does a Shopify-side address edit reach the Skio contract?

**Status:** Open, needs a factual answer from Skio. Low frequency, high impact per occurrence.
**Files:** `app/api/auth/customer/update/route.ts`, `app/account/details`

**The question.** Loop stored a shipping address per contract and never re-read Shopify, so `/api/auth/customer/update` mirrored every successful write across to each active or paused Loop contract. That mirror was deleted in the Loop decommission on the recorded basis that "Skio writes address and payment changes back to Shopify automatically" (Noah at Skio, 2026-08-20).

**The gap.** That statement is the Skio to Shopify direction. It does not establish that a customer editing their address on `/account/details` propagates to their Skio contract. If it does not, that customer's next renewal ships to the old address, silently, exactly the failure the Loop mirror existed to prevent.

**What closes it:** ask Skio directly whether a contract re-reads the Shopify customer default address at billing, or holds its own copy captured at creation. If it holds its own copy, either restore an equivalent mirror against Skio's API or remove the address fields from `/account/details` so the Skio portal is the only place an address can be changed.

**Why deferred:** needs a vendor answer, not a code change. Recorded in `docs/features/CUSTOMER_PORTAL.md` so the next reader does not assume it is settled.

---

### Klaviyo email templates still link to the deleted `/account/subscriptions`

**Status:** Open, low urgency. Covered by a redirect in the meantime.
**Files:** None in this repo. Klaviyo template editor.

**Symptom:** the Loop-era self-built portal at `/account/subscriptions` was deleted in the Loop decommission (`docs/development/featurePlans/loop-decommission.md`). Klaviyo templates and historic order emails, which this repo does not control, still point there.

**Mitigation already shipped:** `next.config.ts` carries a permanent redirect from `/account/subscriptions` and `/account/subscriptions/:path*` to `/account/manage`, so no customer hits a 404. Decision (Rudh, 2026-09-02): rely on the redirect, fix the templates at leisure.

**What closes it:** sweep the Klaviyo templates for `/account/subscriptions` and repoint them at `/account/manage`, then the redirect becomes belt and braces rather than load-bearing.

**Why deferred:** template editing outside the codebase, and the redirect makes it invisible to customers.

---

## Shopify / Pricing

### Formally move one-time shipping out of the SKU prices and into a real Shopify shipping rate

**Status:** Open, ticketed as [SCRUM-1286](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1286) (backlog, ops-gated)
**Files:** `app/lib/offerData.ts` (`OTP_POSTAGE`, `getChargedPrice`, the OTP entries), plus Shopify admin and the Synergy rate mapping (outside the repo)

**Current state (decided by Rudh 2026-08-28):** the £9.99 one-time postage stays baked into the Shopify OTP variant prices AND into the displayed prices. The itemised "£180.00 + £9.99 postage" presentation was built for the quarterly one-time link, shipped, and reverted the same day: it wrapped the link onto two lines and read as clutter ("too ugly"). All one-time surfaces now show the single all-in figure (`getChargedPrice`), and every discount anchor is an all-in total so strike, price and badge stay mutually checkable.

**What the formal fix is (SCRUM-1286):** reprice the OTP variants down by £9.99, put the one-time SKUs in a per-product Shopify shipping profile carrying a £9.99 rate, add the new rate NAME to Synergy's carrier mapping BEFORE go-live (Synergy maps on rate name only; the sheet is locked), then update the site constants. Checkout totals stay identical to the penny; shipping just becomes a visible line Shopify can report on, and the 3p rounding quirk on the quarterly SKUs (£189.99 vs £189.96) disappears.

**Why deferred:** needs Shopify admin repricing + shipping-profile work + written Synergy confirmation, all ops actions outside the codebase, and it must be sequenced with the weight-band plan in `docs/development/featurePlans/order-size-shipping-tiers.md`.

---

### The Skio branch still sells the pre-starter-kit variants, so the kit vanishes when the flag flips

**Status:** Largely resolved 2026-09-01 (see foot of entry). Added 2026-08-28.
**Files:** `app/lib/offerData.ts` (`OFFER_VARIANTS`) on `feature/skio-integration`, plus Shopify admin and the Skio dashboard.
**Reading:** `docs/development/featurePlans/flow-starter-pack.md`, `docs/development/featurePlans/skio-migration.md` (on the Skio branch).

`feature/starter-pack` re-pointed all six subscription cadences at the `-STARTER-` variants, wired to **Loop** selling plans. `feature/skio-integration` re-points the same purchase surfaces at **Skio** selling plans, and it predates the starter kit.

**So the two are not compatible yet.** Merge the starter kit to `main`, merge `main` into the Skio branch, and `OFFER_VARIANTS` carries starter variants with Loop plan IDs while the Skio flag points at Skio plans sitting on `FLOW-20`, `CLEAR-20`, `BOTH-40` and their quarterly siblings, none of which carry the gifts. **Flipping `NEXT_PUBLIC_SKIO_ENABLED` therefore removes the starter kit from the offer**, silently and on the payday weekend it was built for.

**The trap that makes this more than a variant swap:** the two platforms price in opposite directions. Loop's plans apply a **fixed £0.00** adjustment, so the variant price is the charged price, which is why the starter variants are priced at £39.99 / £109.99 / £74.99 / £149.99. Skio's plans discount from the **one-time** price. Read from Shopify 2026-08-28:

| Skio group | Group | Plan | Products | Adjustment |
|---|---|---|---|---|
| 20-shots---monthly | 100167876982 | 712928887158 | Flow, Clear | 42.86% off £69.98 = £39.99 |
| 60-shots---quarterly | 100167909750 | 712928919926 | Flow, Clear | 42.11% off £189.99 = £109.99 |
| 40-shots---monthly | 100167942518 | 712928952694 | Both | 25% off £99.98 = £74.99 |
| 120-shots---quarterly | 100167975286 | 712928985462 | Both | 46.43% off £279.99 = £149.99 |

Attach the existing £39.99 starter variants to the existing Skio monthly plan and it charges **£22.85**. Do not do that.

**What the fix looks like:** a Skio-priced equivalent of each starter variant, based at the one-time price and carrying the same `custom.bundlecomposition`, attached to the four Skio groups above. Then `OFFER_VARIANTS` on the Skio branch points at those six GIDs and the four Skio plan IDs. The existing Skio variants already carry compositions (`FLOW-20` explodes to `1xFLOW-FUNNEL-28`), so they are the right shape to copy from.

**Also unbuilt anywhere:** the order-two swap, turning `FLOW-STARTER-28` into `FLOW-FUNNEL-20`, `CLEAR-STARTER-28` into `CLEAR-FUNNEL-20` and `BOTH-STARTER-56` into `BOTH-FUNNEL-40`. Without it every renewal ships another hat and travel pack.

The exposure is wider than new signups. The account portal's product swap resolves through `getOfferVariantNumericId`, so an **existing** subscriber changing product today also lands on a starter variant and starts a hat-per-renewal contract. **The Skio side of this is now closed (1 Sept):** the portal's swap catalogue is restricted to the six plain non-starter variants, dashboard-side, per product — see `skio-migration.md` section 8. Same fix covers both, but it means the clock is already running on the current subscriber base, not only on orders taken from launch (found in the independent review, 29 Aug 2026). It was deliberately **not** configured in Loop: first renewals are late September and the migration is expected well before that, so a Loop rule would never fire. It has to exist in Skio, and the contracts Skio inherits will still be sitting on starter variants because none will have reached order two. If the migration slips past roughly **20 September**, configure it in Loop after all.

**Largely resolved 1 Sept.** Phase 3c built the six Skio starter variants, re-pointed `OFFER_VARIANTS` (PR #469) and shipped six order-1 swap Journeys; the mid-life swap hole is closed by the portal variant restriction above. Migration is booked Wed 3 Sept and Josiah copies the Journey logic into the migration mapper, so migrated Loop starter subs arrive already swapped. **Residual:** confirm the plan pill on the Flow and Both swap targets (section 8).

---

## Analytics / Attribution

### OTP price claims: split presentation needs `getChargedPrice` at every bare-figure site

**Status:** Guarded but structural (recurring foot-gun, caught in the SCRUM-1247 review)
**Files:** `app/lib/offerData.ts` (`getChargedPrice`, `OFFER_PRICING`), any surface stating a one-time price

**The trap:** the merged data layer uses the itemised funnel-c presentation: one-time entries carry `price` EXCLUDING the compulsory GBP 9.99 postage, with `postage` as a separate field. But the Shopify OTP SKUs have postage baked into the variant price, so checkout charges `price + postage`. Any surface that states a single all-in one-time figure without an itemised postage line understates the charge by GBP 9.99. The SCRUM-1247 merge briefly did exactly this on the PDP "Buy it once" link, its compare-at anchor, the cart drawer savings anchor, the cart subscribe-upsell saving, and the start/start-b buy boxes (start-b's was a pre-existing understatement). All fixed with `getChargedPrice(pricing)`.

**The rule:** a bare one-time figure must be `getChargedPrice(pricing)`; `pricing.price` alone is only correct next to a visible postage line (byo flow, lander buy cards).

**Residual:** Meta AddToCart/InitiateCheckout `value` from `byoCheckout` sends the ex-postage price for OTP (pre-existing funnel-c behaviour, not a regression). Consider aligning `value` to the charged price during SCRUM-1248 so Meta's value matches the order total.

**What closes it fully:** either bake postage back into `price` in `OFFER_PRICING` and derive the itemised split the other way round, or add a lint/convention note. Revisit when the Phase 3 copy pass touches pricing surfaces.

**Update 2026-08-28 (SCRUM-1285):** the foot-gun is now smaller in practice: every one-time DISPLAY is all-in via `getChargedPrice` (the itemised link presentation was built and reverted the same day), and `getDisplayDiscount` itself compares charged totals, so a bare `pricing.price` would also produce a visibly wrong badge. The data split (`price` + `postage`) remains, pending the SCRUM-1286 Shopify shipping work above, which closes this properly.

---

### ~~`plan_frequency` cart attribute has never landed (stale selling-plan map)~~

**Status:** DONE 2026-09-02 (SCRUM-1300). Removed rather than repaired, on branch `fix/plan-frequency-cleanup`. `getPlanFrequency` and `SELLING_PLAN_FREQUENCY` are deleted and `buildCartAttributes` now sends `source` only. `byoCheckout.ts` untouched. Kept below for the reasoning.

**Original status:** Open, found 2026-09-02
**Files:** `app/lib/shopifyProductMapping.ts` (`SELLING_PLAN_FREQUENCY`, `getPlanFrequency`), consumed by `app/context/CartContext.tsx` (`buildCartAttributes`)

**Symptom:** `SELLING_PLAN_FREQUENCY` maps only the three retired `FORMULA_SELLING_PLANS` ids (`711429882230`, `711429947766`, `711429980534`). Nothing we sell uses them. The live Loop plans (`712527348086`, `712527479158`) and all four Skio plans (`712928887158`, `712928919926`, `712928952694`, `712928985462`) are absent, so `getPlanFrequency()` returns `undefined` and the attribute is never pushed. Verified against 205 live orders (10 Aug to 2 Sept): **zero carry `plan_frequency`**. `docs/development/CART_ATTRIBUTES.md` documented it as live and has been corrected.

**Impact:** Low, and not urgent. Cadence is recoverable from the line's selling plan on the order, and the Build Your Order path is unaffected (`byoCheckout.ts` derives `_plan_frequency` from the cadence directly, not from the plan id). The cost is that no LTV cut can key on the attribute.

**The fix is not just adding rows.** The Skio plans are monthly and **quarterly**, but `getPlanFrequency`'s return type is `"weekly" | "biweekly" | "monthly"`, so `quarterly` needs adding to the union first. Better still, delete the id map and derive frequency the way BYO already does, from the cadence the call site already knows, so the next platform migration cannot break it again.

**Why deferred:** needs the type widened and a decision on which of the two mechanisms survives; no data is being lost meanwhile.

---

### Listicle `persona:` order tags aren't writing (no `write_orders` on live token)

**Status:** Deferred (needs infra change, not a code fix)
**Files:** `app/api/webhooks/shopify/orders/route.ts` (`listicleOrderTags` → `addOrderTags`), `app/lib/shopifyAdmin.ts` (`addOrderTags`)

**Symptom:** On `orders/paid`, the webhook calls `tagsAdd` to stamp `listicle` + `persona:<name>` on listicle-driven orders (SCRUM-1180). It silently fails: the live `SHOPIFY_ADMIN_API_TOKEN` is the **B2B Invoicing** app's token, which has only draft-order/customer scopes — no `write_orders`. The webhook catches the error and continues, so orders never get the tag. Confirmed 29 Jul: of the 3 first-party listicle orders (#3701/#3707/#3711), all carry the `_listicle_origin` note attribute but none carry a `persona:` tag.

**Impact:** Low — attribution still works via the `_listicle_origin` note attribute (set by the cart, not the webhook). But you can't filter Orders by `persona:adhd` in Shopify admin, and any downstream report keyed on the tag reads empty.

**Assessment (Rudh, 29 Jul):** arguably not a real issue — the `_listicle_origin` note attribute already carries persona + section first-party, so the tag is just redundant convenience. Only worth doing (b) if we actually want tag-based filtering / segments in Shopify admin or Flow; otherwise leave it, or close as won't-fix.

**What unblocks it:** give the webhook a token with `write_orders`. Options: (a) add `write_orders` to the B2B Invoicing app and re-install (broadens that app's blast radius — least preferred); (b) stand up / point at a dedicated app-token that has `write_orders` and read it from a new env var, keeping the B2B token untouched. attribution-audit is read-only, so it can't do this. Then re-verify a live order gets tagged.

**Why deferred:** Requires a Shopify app scope change + prod env var, which is an ops action outside the codebase. See `docs/analytics/LISTICLE_PERFORMANCE.md` (known-gap note).

**Re-confirmed 2026-09-02, with the scale.** Still failing, unchanged by the Skio cutover. Exact error from Vercel prod logs:

```
[Shopify webhook] Failed to tag order 13430014214518
Error: tagsAdd failed: Access denied for tagsAdd field.
```

**79 orders between 10 Aug and 2 Sept carry `_listicle_origin`; zero carry a `listicle` or `persona:` tag.** The 29 Jul assessment above still holds (attribution is intact via the note attribute), but the number is worth knowing before anyone builds a report on the tag: it would read empty across the entire £300/day ad-spend trial. `docs/analytics/LISTICLE_PERFORMANCE.md` query 6 has been corrected to say so outright rather than "once the tag write is fixed".

---

## Listicle Template Upgrade

### ADHD listicle: bespoke FAQ copy pending

**Status:** Deferred (awaiting copy)
**File:** `app/lib/landings/adhd-listicle.ts` (`faqIds`), `app/lib/faqContent.ts`

**What unblocks it:** Humphrey delivering the bespoke ADHD FAQ copy (not finished at rewrite time, he ran out of credits). The ADHD listicle currently reuses existing canonical FAQ ids so the page is complete and shippable.

**How to apply when it lands:** Add each new Q&A to `app/lib/faqContent.ts` (follow the existing `FaqItem` structure and `††` claim-anchor convention), then reference the new ids in the ADHD `faqIds` array. All FAQ copy stays in the canonical source, per the FAQ-system single-source rule.

**Why deferred:** Copy did not exist. No code change is required, only data entry, so it does not block Phase 3. Plan: `docs/development/featurePlans/listicle-template-upgrade.md`.

---

## Protocol System Cleanup

### 1. Delete `app/protocol/[id]/page.tsx` and the protocol route

**Status:** DONE. `app/protocol/` and `app/components/protocol/` are deleted; `/protocol/:path*` permanently redirects to `/conka-both`. The commerce layer that serves existing subscribers stays quarantined in `app/lib/legacy/protocolSubscriptions.ts` — see item 3.

---

### 2. Update `CognitiveTestRecommendation.tsx` -- non-Balance protocol links

**Status:** DONE. `app/components/cognitive-test/CognitiveTestRecommendation.tsx` no longer links to `/protocol/*`; it points at the live product routes.

---

### 3. Remove protocol exports from shared data modules

**Status:** DONE (Phase 4, July 2026). The dead protocol code (`protocolPricing`, `PROTOCOL_COLORS`, `getProtocolVariantId` and the unused variant-audit helpers) is deleted. What genuinely still serves existing subscribers is quarantined in `app/lib/legacy/protocolSubscriptions.ts`, and the `productData` barrel no longer exports anything protocol-related.

**Remaining follow-up: RESOLVED 2026-09-02 by deletion.** `app/api/auth/subscriptions/[id]/pause/route.ts` carried its own duplicate `PROTOCOL_VARIANTS` table (keyed by numeric variant ID, not GID), left alone because unifying it meant touching the renewal path for paying subscribers. The route was deleted in the Loop decommission, so the duplicate is gone and the legacy module is the only copy. Skio manages pausing now.

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

## PDP Structure Rework Cleanup

### Do not delete these, they only look orphaned

**Status:** Live reference. The deletions this table guarded are DONE (2026-08-26, SCRUM-1264, branch `chore/pdp-orphan-cleanup`); the table stays because each entry still reads as dead at a glance.
**Plan:** `docs/development/featurePlans/pdp-structure-rework.md`

| Looks dead | Actually |
|------------|----------|
| `getPdpIngredientList` (`mmPdpData.ts`) | Live. The Ingredients disclosure row uses it. |
| `OUTCOME_BUCKETS` (`mmPdpData.ts`) | Live, and more load-bearing than before. The grid badge derives its first line from it. |
| `WHO_ITS_FOR` (`HeroAccordions.tsx`) | Live. The Who-is-it-for row uses it. |
| `DotIndicator` | Live. The grid stopped using it but `CROTestimonials` still does. |
| ~~`ProductBenefitTiles.tsx`~~ | **Deleted 2026-08-27** in the orphan sweep below, along with fifteen other components nothing imported. |
| `FlowLiquid` / `ClearLiquid` **videos** under `public/videos/` | Live in `BottleVideo`, the quiz template and the ADHD listicle. Only the same-named `.jpg` statics were the orphans, and those are gone. |
| `BrainFuelBand` (`app/lander/sections/`) | Live on `app/page.tsx`, `/lander` and `/lander-b`. Phase 6 removes only the `/conka-both` reference. |

Phase 1 and 2 removed `AbsorptionBioavailability` and `LandingValueComparison`; both are deleted. The absorption angle was cut on judgement ("a category claim any competitor also makes"), so it is the one most likely to be asked for back: it is in git history at `chore/pdp-orphan-cleanup`.

---

## Home Page Round 2 Cleanup

### ~~Delete `ProductBenefitTiles.tsx`~~ and the wider orphan sweep

**Status:** Done 2026-08-27. Sixteen components deleted, not one.

`ProductBenefitTiles.tsx` was the entry that triggered this, but a tree-wide scan
for components no file imports found far more. Deleted in this sweep:

| Area | Files |
|------|-------|
| Home Round 2 leftovers | `product/ProductBenefitTiles.tsx`, `home/FoundersSection.tsx` |
| Dead CRO landing set | `cro/CROHero.tsx`, `cro/CROFinalCTA.tsx`, `cro/CROFormulaSplit.tsx`, `cro/CROGuarantee.tsx` |
| Orphaned by the above | `landing/LabTrustBadges.tsx` (only `CROFormulaSplit` used it; `Certifications` and `LandingTrustBadges` do this job on live surfaces) |
| Pre-existing, zero references | `landing/LabWhatsInsideMini.tsx`, `product/BenefitDetail.tsx`, `product/BenefitList.tsx`, `product/StruggleIcons.tsx`, `FigurePlate.tsx`, `FocalImage.tsx`, `HeroBannerCarousel.tsx`, `HeroShared.tsx`, `premium/PremiumCarouselToggle.tsx` |

`OUTCOME_BUCKETS` in `mmPdpData.ts` was deliberately **not** followed through and
deleted: `ProductBenefitTiles`' three titles were the same three strings, but
`OUTCOME_BUCKETS` still feeds the PDP ingredient grid badges.

**Method, so the next sweep can repeat it.** Name-based grep over-reports, because
a default import can be renamed at the import site. The check that actually holds
is a path grep, `grep -rn "['\"].*/<Basename>['\"]" app/`, plus `npx tsc --noEmit`
after the deletion: if anything still imported the file, the compile fails. Both
were run, and `npm run build` passed.

---

### The orphan sweep is NOT finished, and the rest needs judgement

**Status:** Open. Twenty-one components still have zero importers after the
2026-08-27 sweep. They were left deliberately, not missed.

**Read this before deleting any of them.** The sweep cascades: deleting an orphan
orphans whatever only it imported, so the list regrows each round and has to be
re-scanned rather than worked through once. More importantly, **"nothing imports
it" does not mean "safe to delete" in this repo.**

**Parked on purpose, do NOT delete:**

- `landing/HomeHeroVideo.tsx`, `landing/HomeHeroVideoDesktop.tsx`. `PAGE_NARRATIVES.md`
  states the looped video hero is "kept in the tree for revert" behind the static
  LCP hero. Unimported is the intended state.
- `landing/LandingHero.tsx` is the same family and should be checked against that
  revert path before it goes.

**Needs a decision, not a sweep:**

- `RevolutPayButton.tsx`. Payment-adjacent. Dead, but confirm no reinstatement is
  planned before removing a payment path from the tree.
- The account and subscriptions portal cluster: `subscriptions/PastSubscriptionCard.tsx`,
  `subscriptions/SubscriptionSummaryStats.tsx`, `subscriptions/SubscriptionsHelpCard.tsx`,
  `subscriptions/SubscriptionsPageHeader.tsx`, `subscriptions/EmptySubscriptionsState.tsx`,
  `account/NextDeliveryHero.tsx`, `account/HairlineSpecStrip.tsx`, `account/ActiveOrderCard.tsx`.
  The portal is mid-migration to Skio as a full iframe replacement, so these are
  probably doubly dead, but that is the migration's call to make. See
  `docs/development/featurePlans/skio-subscription-migration.md`.

**Straightforwardly dead, just not swept yet:** `WhyConkaWorks.tsx`,
`CaseStudiesDataDriven.tsx`, `FormulaCaseStudies.tsx`, `product/ProductHeroMobileV2.tsx`,
`product/ProductHeroV2.tsx`, `landing/WhatsInsideProductMini.tsx`,
`landing/LandingProductSplit.tsx`, `landing/LandingTestimonials.tsx`,
`app/AppResearchModal.tsx`.

Note `LandingTestimonials` in that last group: it was one of the four components
in the `--tracking-tight` fix above, so that fix touched a component nothing
renders. Harmless, but it is why "it is in the debt list" is not evidence a
component is live.

**Unblocks:** nothing. Do the "straightforwardly dead" group whenever; the other
two groups want an owner's answer first.

### `LabGuarantee` is NOT orphaned

The 100 day guarantee section came off the home page in the same ticket. `app/components/landing/LabGuarantee.tsx` stays live on `/conka-flow`, `/conka-clarity`, `/conka-both` and `/case-studies`. Nothing to clean up, recorded here only because "we removed the guarantee section" reads like a deletion.

---

## Design System Debt

### ~~Define `--tracking-tight`, or delete the four references to it~~

**Status:** Done 2026-08-27. Resolved as option 3, the no-op fix: the inline overrides are gone and each heading now takes the tracking its own class already sets.

Four components tightened their headline letter-spacing with `style={{ letterSpacing: "var(--tracking-tight)" }}` against a token defined in neither `brand-base.css` nor `globals.css`.

**Correction to the mechanism this entry used to describe.** The browser does not "drop the declaration". An unresolved `var()` makes the declaration *invalid at computed-value time*, which for an inherited property like `letter-spacing` means the element **inherits the parent's value** rather than falling back to what the class set. So the class value was being discarded, not merely overridden by nothing. No ancestor of these four headings sets `letter-spacing`, so the computed value was `normal` either way and the visible outcome matched the old note. The distinction matters if the pattern is ever copied under a parent that does set tracking.

**What shipped:**

- `AppUSPSection` and `LandingProductShowcase` (both `.brand-h1`) now render at `--brand-h1-tracking: -0.02em`.
- `LandingTestimonials` (`.brand-h2`) now renders at `--brand-h2-tracking: -0.01em`. Note this is why defining `--tracking-tight: -0.02em` globally would have been wrong: it would have pushed an h2 tighter than the h2 token.
- `LandingDailyBenefits` was the fourth caller and was deleted outright, see below.

**Correction, 2026-08-27.** An earlier version of this entry named `LabResearch` and `HomeWhyAccordion` as the two stragglers still writing the literal `-0.02em`, implying a two-file tidy. That was wrong and would send whoever picked it up into a far bigger job than advertised: the literal appears **173 times across 113 files**. The inline `style={{ letterSpacing: "-0.02em" }}` is the de facto house style on this codebase, and `.brand-h1` carrying the value as a token is the exception. Converting the site to the token is a real refactor with a real visual diff, not a tidy, and it is not scoped anywhere. Leave it alone until someone wants that job.

---

### `LandingDailyBenefits` deleted (and three icons with it)

**Status:** Done 2026-08-27.

`app/components/landing/LandingDailyBenefits.tsx` (327 lines) had no importer. `BrainFuelBand` replaced it at home Section 4 on 2026-06-18 in SCRUM-1101, and the only remaining mention was the comment in `app/page.tsx` explaining the swap. Two months in production is well past the "prove the replacement holds, then sweep" bar this tracker uses, so it was deleted rather than recorded.

`BenefitIconFocus`, `BenefitIconSleep` and `BenefitIconStress` in `app/components/landing/icons.tsx` were its only consumers and went with it. `BottleVideo`, `LabTrustBadges` and `ConkaCTAButton` were also imported by it but have other live consumers and stay.

---

### ~~Cognitive test duration said five minutes in two places~~

**Status:** Done 2026-08-27, in the SCRUM-1265 branch.

The app's cognitive test is **two minutes**. That is what `faqContent.ts` says in six answers, plus `CaseStudiesHero`, `PilotProgramme`, `productivity-listicle`, `adhd-listicle` and `brain-age`.

Two files disagreed and have been corrected:

- `app/components/insights/HowThisIsPossibleModule.tsx` said "a five-minute cognitive test" (renders on `/app-insights`)
- `app/lib/whyConkaData.ts` said "a 5-minute Cambridge-built cognitive test" (renders on `/why-conka`)

Recorded rather than dropped because the number is scattered across a dozen files with no single source. **If it ever changes, it is a repo-wide find and replace, not a one-line edit.** Worth pulling into a shared constant if a third value ever appears.

---

### ~~Orphaned FAQ lifestyle image~~

**Status:** Done 2026-08-27.
**Files:** `public/lifestyle/clear/ClearDrink.jpg`, `public/lifestyle/flow/FlowDeskClutter.jpg` (both deleted)

Dropping the sticky FAQ image from the three PDPs (Phase 6) left `ClearDrink.jpg` with no consumer in `app/`. The note here used to say `FlowDeskClutter.jpg` survived because it was `LabFAQ`'s `DEFAULT_IMAGE` and still served on the home page. **That stopped being true on 27 Aug**, when the home structure pass dropped the FAQ photo: from that point all six `LabFAQ` call sites passed `image={null}`, so the default was unreachable.

`LabFAQ`'s `image` prop, the `LabFAQImage` type, the sticky image column and the `image ? "lg:w-3/5" : "w-full"` width branch have all been removed along with the two statics. `FlowDrink.jpg` stays: it is still live in `app/lib/landings/general-listicle.ts`.

---

### Refresh the remaining surfaces onto the new cut-out renders

**Status:** Deferred (not a defect, an asset-generation mismatch)
**Files:** `app/lib/productImages.ts` (`bottleRendersCutout`, added SCRUM-1261)

SCRUM-1261 added `public/formulas/labelV2/{Flow,Clear,Both}Transparent.png` and registered them as `bottleRendersCutout`, for bottles sitting on a coloured surface where `bottleRenders`' photographic backdrop would show as a pale rectangle. Only `ProductComparisonTable` uses them.

The **previous** generation of cut-outs is still referenced and shows the old label. The list was five files; the 2026-08-27 orphan sweep deleted two of them (`LabWhatsInsideMini.tsx`, `CROFormulaSplit.tsx`), so three remain:

- `app/components/landing/LandingProductSplit.tsx` (itself orphaned, see the sweep entry)
- `app/components/landing/WhatsInsideProductMini.tsx` (itself orphaned, see the sweep entry)
- `app/lib/offerData.ts` (BYO thumbnails) **, the only live one**

pointing at `public/formulas/conkaFlow/FlowNoBackground.png` and `public/formulas/conkaClear/ClearNoBackground.png` (April 2026).

**What unblocks it:** nothing technical. Each call site swaps its hardcoded path for `bottleRendersCutout[...]`, then the two old PNGs can go. Worth a visual check per surface first, since the new renders have a different crop and aspect, so a straight path swap may need a size tweak. Note there is no `both` variant in the old pair, whereas `bottleRendersCutout.both` is a single paired shot.

**Why deferred:** out of scope on SCRUM-1261, which only needed the bottle in one new component. Doing it properly is a per-surface visual pass, not a find-and-replace.

---

## Asset Cleanup

### Five statics left unreferenced by the 2026-08-27 orphan sweep

**Status:** Open, and deliberately not deleted with the components.
**Files:** `public/CONKA_04.jpg`, `public/ingredients/renders/LecithinTransparent.png`, `public/ingredients/renders/RhodiolaRoseaTransparent.png`, `public/ingredients/renders/TurmericTransparent.png`, `public/ingredients/renders/VitaminCTransparent.png`

These were referenced only by components deleted in the sweep, and a repo grep now returns nothing for any of them.

**Why they were not deleted anyway.** A `public/` file is reachable by URL, so a repo grep is not proof it is unused. Anything served from `public/` can be pointed at by a Klaviyo email template, a Notion blog post body, an OG or social card, or an ad creative, none of which live in this repo. A component reference disappearing is evidence, not a conclusion. The same caution applies to every entry in this section.

**What closes it:** confirm with whoever owns the Klaviyo templates and the Notion blog that none of the five are linked, then delete. The four `*Transparent.png` renders are the lower risk of the two groups, since the live surfaces all use the `.jpg` variants of the same ingredients (`BuildStep.tsx`, both `IngredientsGrid.tsx`, both `ingredients.data.ts`) and the transparent cut-outs were only ever used by the deleted benefit components. `CONKA_04.jpg` sits at the `public/` root with a generic name, which is exactly the shape of a file something external links to.


### Delete superseded `*New.jpg` product statics once the labelV2 rollout is confirmed

**Status:** Deferred (waiting for the labelV2 filenames to be live in prod)
**Files:** `public/formulas/conkaFlow/FlowNew.jpg`, `public/formulas/conkaClear/ClearNew.jpg`, `public/lander/FlowNew.jpg`, `public/lander/ClearNew.jpg`

The Aug 2026 cache-busting rename moved every in-code reference to the `*V3.jpg` basenames; the `*New.jpg` files were kept as byte-identical aliases so cached HTML and external links (ads, emails) kept resolving. On 25 Aug 2026 the site moved again, to the `public/formulas/labelV2/` renders referenced via the `bottleRenders` map in `app/lib/productImages.ts` (square `*V4.jpg` canonical, tall `*Thin.jpg` crops only for the two side-by-side pair layouts): the `*V3.jpg` files and `both/BothNew.jpg` were deleted outright, so anything external still pointing at those paths now 404s once deployed.

**What unblocks it:** the labelV2 branch merged and live in prod for a couple of weeks with no external surface still pointing at the old basenames. Then delete the four files.

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

**Status:** Ready to ticket. Disclosure policy is documented in `docs/features/FAQ_SYSTEM.md` (the FAQ answer-surface work that surfaced it shipped under SCRUM-1143).

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

---

## Listicle Renderer Cleanup

### 9. Delete the dead `costBreakdown` and `appSection` zones from the listicle renderer

**Status:** Deferred
**File:** `app/components/go/listicle/ListicleRenderer.tsx` (the `config.costBreakdown` and `config.appSection` blocks), plus the matching optional fields in `app/lib/landings/listicle-types.ts`.

**What unblocks it:**
- Confirm no live or planned listicle config sets `costBreakdown` or `appSection`. As of the Phase 3 consistency sweep (SCRUM-1146), none of the three live personas (adhd, productivity, brain-ageing) render either zone, so both are dead code paths.
- Once confirmed, remove the two render blocks, their `ListicleConfig` fields, and any now-unused helper types.

**Why deferred:** Left out of the SCRUM-1146 visual sweep deliberately: there was no point restyling zones nothing renders. Flagged here for a clean deletion rather than a silent restyle. These are the only remaining `font-mono` eyebrows and `rounded-3xl` cards left in the renderer.

---

## Blog Surface (`/blog`)

### 10. Assert Notion reads at build, and stop the data cache serving stale post bodies

**Status:** **Done 2026-07-17 ([SCRUM-1163](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1163)).** Deploy-scoped fetch cache key in `app/lib/notion.ts` (a body edit now reaches prod on an ordinary redeploy, build cache enabled) plus consistency + floor guards in `app/lib/blogBuildGuard.ts`, wired through `app/lib/blog.ts`, and `dynamicParams = false` + throw-on-missing on the `[slug]` route. Canonical write-up: `docs/features/BLOG_SYSTEM.md`. Kept below as history.

**Superseded in part, 2026-07-24 ([SCRUM-1179](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1179)).** Defect 1's mechanism below (`react.cache` dedupes per request, so reads across a build can disagree) no longer applies: a build now reads the published set once and shares it with every worker. The guards stayed and became a backstop rather than the only thing standing between the blog and a baked-in 404. The guards being loud is what surfaced the residual race in the first place, which is the argument for keeping them.
**Files:**
- `app/lib/notion.ts` -- `queryBlogRows` throws on failure (since SCRUM-1157, not error-swallowing); `pageToMarkdown` fetches each post's blocks
- `app/lib/blog.ts` -- `getAllPosts`, consumed by `generateStaticParams`, `sitemap` and every post route

**What unblocks it:** nothing. Both halves are known and independently reproduced.

Two separate defects, one fix surface:

1. **A build racing a Notion write bakes a 404 into a live post on a green build.** Observed during Phase 3 (correction 6 in the plan doc): `generateStaticParams` saw 3 published posts while `getPostBySlug` and `sitemap` saw 1, so `/blog/what-are-nootropics` prerendered with `"status": 404` and no error output. **The mechanism is not error-swallowing:** `queryBlogRows` throws since SCRUM-1157, and correction 6 and the plan's Risks section are both stale on this point. It is that separate, individually *successful* queries across one build can disagree, because Notion is eventually consistent right after a write and `react.cache` dedupes per request, not per build. Nothing throws, because nothing failed. Only a consistency assertion catches it.
2. **The Notion data cache holds post bodies for a year.** Reproduced on SCRUM-1160 (correction 8): the Notion SDK calls `fetch`, Next patches it, and all 70 entries land in `.next/cache/fetch-cache` with `revalidate: 31536000`, 68 of them `GET /v1/blocks/{id}/children`. A verified-clean Notion body still built green with all 191 leaks; `rm -rf .next/cache` fixed it. Vercel restores that cache between deploys, so **any Notion body edit can be invisible on a green redeploy.** The interim rule is to redeploy with the build cache cleared, which is a human step guarding a silent failure.

A build-time assertion (post count against a floor, and consistency between `generateStaticParams`, `getPostBySlug` and `sitemap`) turns both into a failed build instead of a silent one. The cache half also wants an explicit `cache`/`revalidate` on the Notion reads so correctness does not depend on remembering to untick a checkbox.

**Why deferred:** correction 6 called this "no longer a nice-to-have" during Phase 3 and it was still not built; SCRUM-1160 then found the second, quieter half. Sizing it needs a decision on where the assertion lives (build-time check vs a `revalidate` on the fetches), which is more than a bug fix.

---

### 11. In-body `<img>` carries no dimensions, so post bodies shift on load

**Status:** Deferred
**Files:** `app/components/blog/MarkdownBody.tsx` (the `img` mapping), `app/lib/blog.ts` (image re-hosting)

**What unblocks it:** the images are already re-hosted locally under `public/blog/<slug>/` at build, so width and height are knowable without a network call. Needs a decision on whether to record dimensions at re-host time and thread them through, or move the mapping to `next/image`.

**Why deferred:** out of scope on SCRUM-1160, which was a text-only repair. **Both that ticket and the plan doc already cite this as "tracked in `docs/TODO.md`" and it was never actually written here** (found 2026-07-17), so this entry exists to make that citation true rather than to propose new work. 100 in-body images across 33 posts; none have usable alt text (correction 3), so an alt pass belongs with it.
