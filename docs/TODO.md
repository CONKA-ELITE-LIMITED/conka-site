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

**Status:** DONE. `app/protocol/` and `app/components/protocol/` are deleted; `/protocol/:path*` permanently redirects to `/conka-both`. The commerce layer that serves existing subscribers stays quarantined in `app/lib/legacy/protocolSubscriptions.ts` — see item 3.

---

### 2. Update `CognitiveTestRecommendation.tsx` -- non-Balance protocol links

**Status:** DONE. `app/components/cognitive-test/CognitiveTestRecommendation.tsx` no longer links to `/protocol/*`; it points at the live product routes.

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

### Do not delete these, they only look orphaned

**Status:** Live reference. The deletions this table guarded are DONE (2026-08-26, SCRUM-1264, branch `chore/pdp-orphan-cleanup`); the table stays because each entry still reads as dead at a glance.
**Plan:** `docs/development/featurePlans/pdp-structure-rework.md`

| Looks dead | Actually |
|------------|----------|
| `getPdpIngredientList` (`mmPdpData.ts`) | Live. The Ingredients disclosure row uses it. |
| `OUTCOME_BUCKETS` (`mmPdpData.ts`) | Live, and more load-bearing than before. The grid badge derives its first line from it. |
| `WHO_ITS_FOR` (`HeroAccordions.tsx`) | Live. The Who-is-it-for row uses it. |
| `DotIndicator` | Live. The grid stopped using it but `CROTestimonials` still does. |
| ~~`ProductBenefitTiles.tsx`~~ | **No longer true. Now genuinely orphaned** as of 2026-08-27 (SCRUM-1265): the home why-accordion replaced it and `app/page.tsx` was its last consumer. See the entry below. |
| `FlowLiquid` / `ClearLiquid` **videos** under `public/videos/` | Live in `BottleVideo`, the quiz template and the ADHD listicle. Only the same-named `.jpg` statics were the orphans, and those are gone. |
| `BrainFuelBand` (`app/lander/sections/`) | Live on `app/page.tsx`, `/lander` and `/lander-b`. Phase 6 removes only the `/conka-both` reference. |

Phase 1 and 2 removed `AbsorptionBioavailability` and `LandingValueComparison`; both are deleted. The absorption angle was cut on judgement ("a category claim any competitor also makes"), so it is the one most likely to be asked for back: it is in git history at `chore/pdp-orphan-cleanup`.

---

## Home Page Round 2 Cleanup

### Delete `ProductBenefitTiles.tsx`

**Status:** Open. Genuinely orphaned as of 2026-08-27 (SCRUM-1265).
**Plan:** `docs/development/featurePlans/home-page-round-2.md`

`app/components/product/ProductBenefitTiles.tsx` has no consumers. PDP Phase 1 took it off the three product pages, and the home why-accordion has now replaced it at `app/page.tsx` position 2, which was its last render site.

Left in the tree rather than deleted in the same commit, following the pattern SCRUM-1264 used: prove the replacement holds in production first, then sweep.

Worth knowing before deleting: its three titles were the same three strings as `OUTCOME_BUCKETS` in `mmPdpData.ts` ("Mental performance", "Sustained energy", "Brain health"), which is why it was replaceable. `OUTCOME_BUCKETS` itself is still live and feeds the PDP ingredient grid badges, so do not follow the thread through and delete that too.

**Unblocks:** nothing. This is a tidy-up, safe to do whenever.

### `LabGuarantee` is NOT orphaned

The 100 day guarantee section came off the home page in the same ticket. `app/components/landing/LabGuarantee.tsx` stays live on `/conka-flow`, `/conka-clarity`, `/conka-both` and `/case-studies`. Nothing to clean up, recorded here only because "we removed the guarantee section" reads like a deletion.

---

## Design System Debt

### Define `--tracking-tight`, or delete the four references to it

**Status:** Open. Found 2026-08-27 while building the home why-accordion (SCRUM-1265).

Four components tighten their headline letter-spacing with `style={{ letterSpacing: "var(--tracking-tight)" }}`:

- `app/components/home/AppUSPSection.tsx`
- `app/components/landing/LandingProductShowcase.tsx`
- `app/components/landing/LandingDailyBenefits.tsx`
- `app/components/landing/LandingTestimonials.tsx`

**The token is defined nowhere.** It is in neither `app/brand-base.css` nor `app/globals.css`. A CSS custom property with no definition and no fallback makes the browser drop the whole declaration silently, so all four headlines render at normal tracking while the code reads as though they are tightened.

`app/components/landing/LabResearch.tsx` writes the literal `-0.02em` instead and does get the tightening, which is why some headlines on the site are subtly tighter than others. `HomeWhyAccordion` copied the literal for the same reason.

**Two ways to fix it, and the choice is a visual one:**

1. Define `--tracking-tight: -0.02em` in `brand-base.css`. One line, and it makes all four headlines tighter than they render today. That is a change to four live surfaces, so it wants eyes on a preview, not a drive-by commit.
2. Replace the four `var(--tracking-tight)` references with the literal `-0.02em`, matching `LabResearch`. Same visual outcome as option 1.

Either way the end state should be one approach, not both. A third option, deleting the property from the four components so they keep rendering exactly as they do now, is the only genuinely no-op fix.

**Unblocks:** nothing. Purely cosmetic, nobody has reported it.

---

### ~~Cognitive test duration said five minutes in two places~~

**Status:** Done 2026-08-27, in the SCRUM-1265 branch.

The app's cognitive test is **two minutes**. That is what `faqContent.ts` says in six answers, plus `CaseStudiesHero`, `PilotProgramme`, `productivity-listicle`, `adhd-listicle` and `brain-age`.

Two files disagreed and have been corrected:

- `app/components/insights/HowThisIsPossibleModule.tsx` said "a five-minute cognitive test" (renders on `/app-insights`)
- `app/lib/whyConkaData.ts` said "a 5-minute Cambridge-built cognitive test" (renders on `/why-conka`)

Recorded rather than dropped because the number is scattered across a dozen files with no single source. **If it ever changes, it is a repo-wide find and replace, not a one-line edit.** Worth pulling into a shared constant if a third value ever appears.

---

### Orphaned FAQ lifestyle image

**Status:** Open, one-line cleanup
**File:** `public/lifestyle/clear/ClearDrink.jpg`

Dropping the sticky FAQ image from the three PDPs (Phase 6) left this static with no consumer in `app/`. `FlowDrink.jpg` is still live in `app/lib/landings/general-listicle.ts`, and `LabFAQ`'s `DEFAULT_IMAGE` (`FlowDeskClutter.jpg`) is still served on the home page, so neither of those goes.

**Why deferred:** grouped with the other asset deletions rather than deleted inside a feature branch.

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
