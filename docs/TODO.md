# Deferred Work Tracker

Global tracker for technical debt, cleanup tasks, and deferred work across the codebase.
Each item includes the relevant files, what unblocks it, and why it was deferred.

---

## Subscriptions / Skio

### Consolidate `/account` onto the Skio portal once cutover is done

**Status:** Deferred (do after Skio is fully wired up / at Phase 4 cutover)
**Files:** `app/account/page.tsx`, `app/account/manage/*`, `app/lib/subscriptionsFlag.ts`

**What:** With Skio on, `/account/manage` (the embedded Skio portal) is the whole account experience, and the header account icon already points there. But `/account` itself still renders the interim "Manage subscription" button (plus the Loop list when the flag is off). Once Skio is fully live and Loop is decommissioned, `/account` should **redirect to `/account/manage`** (when `NEXT_PUBLIC_SKIO_ENABLED` is on) so there is a single account surface and no redundant hop, catching anyone who lands on `/account` directly or via an old link/email.

**What unblocks it:** the Phase 4 cutover (flag flipped on in production, Loop removed). Doing it before cutover would break the live Loop portal that `/account` still serves when the flag is off.

**Why deferred:** left as a harmless fallback for now (Rudh, 18 Aug) so `/account` keeps working for Loop until everything is wired up. See `docs/development/featurePlans/skio-migration.md`.

---

## Analytics / Attribution

### OTP price claims: split presentation needs `getChargedPrice` at every bare-figure site

**Status:** Guarded but structural (recurring foot-gun, caught in the SCRUM-1247 review)
**Files:** `app/lib/byoData.ts` (`getChargedPrice`, `BYO_PRICING`), any surface stating a one-time price

**The trap:** the merged data layer uses the itemised funnel-c presentation: one-time entries carry `price` EXCLUDING the compulsory GBP 9.99 postage, with `postage` as a separate field. But the Shopify OTP SKUs have postage baked into the variant price, so checkout charges `price + postage`. Any surface that states a single all-in one-time figure without an itemised postage line understates the charge by GBP 9.99. The SCRUM-1247 merge briefly did exactly this on the PDP "Buy it once" link, its compare-at anchor, the cart drawer savings anchor, the cart subscribe-upsell saving, and the start/start-b buy boxes (start-b's was a pre-existing understatement). All fixed with `getChargedPrice(pricing)`.

**The rule:** a bare one-time figure must be `getChargedPrice(pricing)`; `pricing.price` alone is only correct next to a visible postage line (byo flow, lander buy cards).

**Residual:** Meta AddToCart/InitiateCheckout `value` from `byoCheckout` sends the ex-postage price for OTP (pre-existing funnel-c behaviour, not a regression). Consider aligning `value` to the charged price during SCRUM-1248 so Meta's value matches the order total.

**What closes it fully:** either bake postage back into `price` in `BYO_PRICING` and derive the itemised split the other way round, or add a lint/convention note. Revisit when the Phase 3 copy pass touches pricing surfaces.

---

### Listicle `persona:` order tags aren't writing (no `write_orders` on live token)

**Status:** Deferred (needs infra change, not a code fix)
**Files:** `app/api/webhooks/shopify/orders/route.ts` (`listicleOrderTags` → `addOrderTags`), `app/lib/shopifyAdmin.ts` (`addOrderTags`)

**Symptom:** On `orders/paid`, the webhook calls `tagsAdd` to stamp `listicle` + `persona:<name>` on listicle-driven orders (SCRUM-1180). It silently fails: the live `SHOPIFY_ADMIN_API_TOKEN` is the **B2B Invoicing** app's token, which has only draft-order/customer scopes — no `write_orders`. The webhook catches the error and continues, so orders never get the tag. Confirmed 29 Jul: of the 3 first-party listicle orders (#3701/#3707/#3711), all carry the `_listicle_origin` note attribute but none carry a `persona:` tag.

**Impact:** Low — attribution still works via the `_listicle_origin` note attribute (set by the cart, not the webhook). But you can't filter Orders by `persona:adhd` in Shopify admin, and any downstream report keyed on the tag reads empty.

**Assessment (Rudh, 29 Jul):** arguably not a real issue — the `_listicle_origin` note attribute already carries persona + section first-party, so the tag is just redundant convenience. Only worth doing (b) if we actually want tag-based filtering / segments in Shopify admin or Flow; otherwise leave it, or close as won't-fix.

**What unblocks it:** give the webhook a token with `write_orders`. Options: (a) add `write_orders` to the B2B Invoicing app and re-install (broadens that app's blast radius — least preferred); (b) stand up / point at a dedicated app-token that has `write_orders` and read it from a new env var, keeping the B2B token untouched. attribution-audit is read-only, so it can't do this. Then re-verify a live order gets tagged.

**Why deferred:** Requires a Shopify app scope change + prod env var, which is an ops action outside the codebase. See `docs/analytics/LISTICLE_PERFORMANCE.md` (known-gap note).

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

## PDP Structure Rework Cleanup

### ~~Delete the components the PDP rework orphaned~~

**Status:** DONE 2026-08-26 (SCRUM-1264). Verified by route parity: 100 routes before, 100 after
**Plan:** `docs/development/featurePlans/pdp-structure-rework.md` (Phase 1, SCRUM-1260; Phase 2, SCRUM-1261)

Phase 1 took `ProductBenefitTiles`, `AbsorptionBioavailability` and `LandingValueComparison` off the three PDPs, and Phase 2 replaced the last two with `ProductComparisonTable`. The components were deliberately left in the tree at the time. Two of the three now have **zero code consumers** (verified 2026-08-26; the only remaining mentions are docs and one comment):

| File | Status |
|------|--------|
| `app/components/product/AbsorptionBioavailability.tsx` | Orphaned. No references outside docs. |
| `app/components/landing/LandingValueComparison.tsx` | Orphaned. Only mention is a comment in `app/components/landing/CrashChart.tsx:140`. |
| `app/components/product/ProductBenefitTiles.tsx` | **Keep.** Still rendered by `app/page.tsx` (home). |

Deleting the two frees nothing else: `CrashChart`, `ConkaCTAButton` and `PRICE_PER_SHOT_BOTH` all have several other consumers. Two static images go with them, both now unreferenced anywhere in `app/`:

- `public/formulas/conkaFlow/FlowLiquid.jpg`
- `public/formulas/conkaClear/ClearLiquid.jpg`

(The `FlowLiquid` / `ClearLiquid` **videos** under `public/videos/` are a different asset and are still live in `BottleVideo`, the quiz template and the ADHD listicle. Do not delete those.)

**What unblocks it:** the Phase 1 and 2 branches being live in prod for a release cycle with no request to reinstate either section. The absorption angle in particular was cut on judgement ("a category claim any competitor also makes"), so it is the one most likely to be asked for back.

**Why deferred:** cleanup only, no user-facing impact, and keeping them costs nothing but tree noise. Grouped here so the deletion is one deliberate commit rather than a silent tidy inside a feature branch.

---

### ~~Delete what the ingredient grid orphaned~~

**Status:** DONE 2026-08-26 (SCRUM-1264, branch `chore/pdp-orphan-cleanup`). Kept below because the do-not-delete table is still live guidance
**Plan:** `docs/development/featurePlans/pdp-structure-rework.md`, Phase 3

Phase 3a replaced the ingredient rail with a grid and dropped partner folding; 3b removed `IngredientOutcomeAccordions` from the desktop hero. Verified orphaned as of 2026-08-26, no remaining consumers:

- `app/components/product/IngredientOutcomeAccordions.tsx`
- `INGREDIENT_PARTNERS` in `app/lib/mmPdpData.ts`, whose only consumer is that component

**Three things NOT to delete while you are in there**, all of which look orphaned at a glance and are not:

| Looks dead | Actually |
|------------|----------|
| `getPdpIngredientList` (`mmPdpData.ts`) | Live. The Ingredients disclosure row uses it. |
| `OUTCOME_BUCKETS` (`mmPdpData.ts`) | Live, and more load-bearing than before. The grid badge derives its first line from it. |
| `WHO_ITS_FOR` (`HeroAccordions.tsx`) | Live. The Who-is-it-for row uses it. |
| `DotIndicator` | Live. The grid stopped using it but `CROTestimonials` still does. |

**Why deferred:** deleting them in the same commit as the rewrite would have made the diff unreadable. Grouped here so it is one deliberate cleanup.

---

### Refresh the remaining surfaces onto the new cut-out renders

**Status:** Deferred (not a defect, an asset-generation mismatch)
**Files:** `app/lib/productImages.ts` (`bottleRendersCutout`, added SCRUM-1261)

SCRUM-1261 added `public/formulas/labelV2/{Flow,Clear,Both}Transparent.png` and registered them as `bottleRendersCutout`, for bottles sitting on a coloured surface where `bottleRenders`' photographic backdrop would show as a pale rectangle. Only `ProductComparisonTable` uses them.

The **previous** generation of cut-outs is still referenced by five files and shows the old label:

- `app/components/landing/LandingProductSplit.tsx`
- `app/components/landing/WhatsInsideProductMini.tsx`
- `app/components/landing/LabWhatsInsideMini.tsx`
- `app/components/cro/CROFormulaSplit.tsx`
- `app/lib/byoData.ts` (BYO thumbnails)

pointing at `public/formulas/conkaFlow/FlowNoBackground.png` and `public/formulas/conkaClear/ClearNoBackground.png` (April 2026).

**What unblocks it:** nothing technical. Each call site swaps its hardcoded path for `bottleRendersCutout[...]`, then the two old PNGs can go. Worth a visual check per surface first, since the new renders have a different crop and aspect, so a straight path swap may need a size tweak. Note there is no `both` variant in the old pair, whereas `bottleRendersCutout.both` is a single paired shot.

**Why deferred:** out of scope on SCRUM-1261, which only needed the bottle in one new component. Doing it properly is a per-surface visual pass, not a find-and-replace.

---

## Asset Cleanup

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
