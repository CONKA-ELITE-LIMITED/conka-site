# Skio Migration — Implementation Status (canonical)

**This is the living "where are we" doc for the Loop → Skio migration.** Update it as work progresses. Scope, rationale, and the full phase breakdown live in the plan doc; this doc tracks *state* — what's done, what's in flight, what's blocked, and the plan-GID mapping as it fills.

- **Plan (scope + rationale):** [`skio-subscription-migration.md`](./skio-subscription-migration.md)
- **Migration economics:** [`../../ops/subscription-platform.md`](../../ops/subscription-platform.md)
- **Canonical SKU / selling-plan GIDs:** [`../../product/SKU_AND_SHOT_REFERENCE.md`](../../product/SKU_AND_SHOT_REFERENCE.md) (§1–§3b)
- **Owner:** Rudh

---

## Status at a glance

| Phase | Description | Status | Ticket |
|-------|-------------|--------|--------|
| 1 | Skio setup + selling-plan mapping | ✅ Done — 4 plans created, GIDs pulled + mapped in `skio.ts` | SCRUM-1210 |
| 2 | Re-point purchase surfaces (PDP → funnel → rest) | 🟡 Code complete behind `NEXT_PUBLIC_SKIO_ENABLED` (default off); preview verification pending | — |
| 3 | Embedded Skio customer portal (iframe) | 🟡 Built behind flag at `/account/manage`; preview verification (real login) pending | SCRUM-1221 |
| 4 | Cutover + Loop decommission | ⚪ Not started | — |
| 5 | Legacy protocol retirement | ⚪ Future (ops-gated) | — |

Legend: ✅ done · 🟡 in progress · ⚪ not started · 🔴 blocked

---

## Current focus & next action

**✅ Phase 1 complete (18 Aug) — billing approval cleared, 4 plans live, GIDs mapped.** All 4 Skio Subscribe & Save plans created (Percentage off, base variant only); plan + variant GIDs pulled via the Skio API and populated into `app/lib/skio.ts` (`LOOP_TO_SKIO_SELLING_PLAN`, plan-level reference) and the live storefront wiring `SKIO_SUBSCRIPTION_VARIANTS` in `app/lib/funnelData.ts`, plus the [mapping tracker](#plan-gid-mapping-tracker). `SKIO_API_TOKEN` set in `.env.local` + Vercel (prod/preview).

**Done and safe (no rework needed):**
- 6 Stage-1 base variants created + verified — `FLOW-20`/`CLEAR-20`, `FLOW-60`/`CLEAR-60`, `BOTH-40`, `BOTH-120` — correct `bundlecomposition` + weights.
- 4 Skio selling plans created + GIDs mapped (this session).
- All live quarterly variants' `bundlecomposition` fixed → manual quarterly portal work resolved.
- Phase 1 code scaffold (`env.ts` getters, `app/lib/skio.ts`) on `feature/skio-integration`.

**Phase 2 done (18 Aug):** discovery sweep confirmed every live subscribe surface routes through `getOfferVariant`/`getOfferByVariantId`. Added `SKIO_SUBSCRIPTION_VARIANTS` + the build-time flag `NEXT_PUBLIC_SKIO_ENABLED` (default false = Loop). Forward selection flips to Skio when true; reverse lookups resolve both tables; OTP + Loop portal-swap stay on Loop. `monthly-otp` untouched (one-time ≠ subscription). Lint + tsc clean.

**How to test the Skio path (local or preview):** set `NEXT_PUBLIC_SKIO_ENABLED=true` in `.env.local` (or on a Vercel preview env) and restart the dev server / redeploy the preview. Then a subscribe add-to-cart should attach the Skio variant + plan and checkout should show the discounted price. Production stays on Loop (flag absent = false).

**Next — Phase 3 (portal), blocked on two vendor inputs:**
1. **(Rudh)** `SKIO_STORE_ID_HASH` from `dashboard.skio.com/theme`.
2. **(Rudh)** Confirm portal version provisioned: **cpv3 vs v2** (ask Noah).
3. **(Claude)** Then: signed iframe route + `/account` embed + CSP `frame-src`.

---

## Open blockers & decisions pending

| # | Item | Owner | Notes |
|---|------|-------|-------|
| 3 | Portal version provisioned: **cpv3 vs v2** | Rudh | Feeds Phase 3 iframe URL. |
| 4 | Does Skio's portal write address edits back to Shopify? | Rudh / Skio onboarding | Gates dropping the Loop per-contract address-mirror at Phase 4. |

**Resolved:**
- ~~Skio account billing approval~~ — cleared 18 Aug; 4 plans created.
- ~~New Skio selling-plan GIDs~~ — pulled via API 18 Aug, mapped in `skio.ts` + tracker.
- ~~Offer-architecture decision~~ — settled: **3-stage fulfilment model** (28-box launch → 20-box swap → gift box); Skio plans use **Percentage off**; net-new variants, nothing existing touched.
- ~~Confirm funnel Loop plans carry 0% adjustment~~ — CONFIRMED 13 Aug (Loop UI shows £0.00 discount; saving is SKU-priced).
- ~~First-order swap feasibility~~ — Skio supports it (Journey); deferred to Stage 2.
- ~~Box mapping / how current subs fulfil~~ — confirmed: 28-box physical unit, quarterly = 3 boxes at Stage 1, live quarterly `bundlecomposition` now set.

---

## Offer-architecture decision — RESOLVED

**Decision: keep the free-shots offer (Option B), delivered via the [3-stage fulfilment model](#fulfilment-stages--assumptions).** Skio plans apply **Percentage off** on **net-new base variants** (nothing existing touched). Option A (a "cheaper first box" price policy) was rejected because the "+N free shots on your 1st order" offer is a core conversion driver Rudh is keeping.

How the free-shots bonus is delivered per stage:
- **Stage 1 (now):** everyone ships the bigger 28-box (first + recurring the same) — the bonus is baked in, no swap needed.
- **Stage 2 (20-box live):** first order ships the bigger box, recurring switches to the smaller 20-box via a Skio Journey — the true "extra shots on first order" mechanic.
- **Stage 3 (gift box live):** recurring is the 20-box; first order gets a small gift box added.

Applies to NEW subscriptions. Skio migrates EXISTING Loop contracts as-is at cutover, so this does not disturb current subscribers.

_Background (why the fork existed):_ Skio's inherited-Loop critique was that we hand-managed separately-priced SKUs + a £0-discount plan. The clean shape is one variant per product with the plan applying the discount — which we adopted (net-new variants + Percentage off). The only fork was whether to keep the quantity bonus (Option B, chosen) or switch to a price bonus (Option A, rejected).

---

## Target Skio build spec (Phase 1 → 2)

The concrete structure to build. **Create new variants — never touch a variant Loop uses.** We build the whole Skio structure alongside live Loop, then flip at cutover. This keeps existing subscribers completely safe (no variant they're on is ever edited or repriced), and lets us test the new setup before switching. The cost is new SKUs (told to Synergy once); the payoff is zero risk to live customers and a testable build. (Repricing existing variants was considered and rejected: it can't be tested pre-cutover and depends on Loop's price-sync behaviour.)

**Base-price convention:** the base variant price = the product's **one-time price** (postage baked in, matching how OTP is sold today, so no Shopify shipping reconfig). Today's Loop sub variants are priced at the DISCOUNTED value because Loop baked the discount into the SKU (Loop itself applies £0 discount); the new variants carry the full one-time value and the Skio plan takes the discount off. Quarterly base ≈ 3× the monthly product value + one delivery's postage, rounded (£189.99 single / £279.99 Both) so the plan discount is a clean round number. **Subscriptions must ship free** in Shopify (already true for current Loop subs).

### Fulfilment stages & assumptions

The Skio selling variants and plans stay **constant across all stages** — only the fulfilment metafield (`bundlecomposition`) changes as new box formats arrive. The customer and Skio never see these stages; they are purely a warehouse/box-format evolution.

**Assumptions:**
- Today the only physical unit is the **28-shot Flow/Clear box** (`FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`). Both = combinations of these; **Both-quarterly = 3 Flow + 2 Clear** (140 shots).
- We *will* procure a physical **20-shot box** — timing **TBD, this gates Stage 2**. Key dependency: when do the 20-boxes go live?
- We *will* procure a small **gift box (4 or 8 shots)** — timing TBD, gates Stage 3.

**Stage 1 — Launch (now, on 28-box stock):** everyone ships the 28-box (or multiples); first order and recurring are physically identical, so **no swap and no bonus variants — just the 6 base variants**. The free-shots offer is honoured because the box is already the bigger one. `bundlecomposition` → 28-boxes. Interim cost: we ship more than we charge for until smaller boxes exist (8 extra shots/monthly, ~20-24/quarterly). This mirrors what monthly already does today (Loop swap off, shipping the 28 SKU); it also fixes quarterly's missing bundlecomposition so Humphrey stops hand-fixing orders.

**Stage 2 — 20-box live (differentiate first vs recurring):** add the 6 bonus variants + the Skio swap Journey. First order ships the 28 (real bonus), recurring ships the new 20-box. Re-point recurring `bundlecomposition` to the 20-box (clean multiples: 20→`1x`, 60→`3x`, 80→`4x`); first-box variants stay on the 28. Move existing Stage-1 subs onto 20-boxes for recurring. Ends the interim giveaway.

**Stage 3 — Gift box live (clean end state):** recurring and first both use the 20-box; first order additionally gets a small gift box (4/8 shots) attached as a first-order gift line (not a swap). Drop the swap Journey. Cleanest steady state.

### Variants

**Launch (Stage 1) needs only the 6 base variants** (`FLOW-20`, `FLOW-60`, `CLEAR-20`, `CLEAR-60`, `BOTH-40`, `BOTH-120`). The 6 bonus variants (`-28`/`-80`/`-56`/`-140`) + the swap are **Stage 2**. All 12 are listed for completeness.

**Nothing existing is touched — every new variant is a net-new SKU.** No renaming, no repricing any live variant, so one-time and Loop orders during the transition are unaffected, and Synergy gets **one document** with all the new SKUs at once. Existing variants stay as-is until cutover, then get deleted.

**SKU naming:** `PRODUCT-SHOTS` (e.g. `FLOW-28`) — no `FUNNEL`, no type suffix. Shot count is the ID; role (one-time / first box / recurring) is the plan's job.

**New variants to create (12)** — all net-new, at the full one-time price:

| SKU | Shots | Price | Role |
|-----|-------|-------|------|
| `FLOW-20` | 20 | £69.98 | Flow monthly recurring + one-time |
| `FLOW-28` | 28 | £69.98 | Flow monthly first box (+8 free) |
| `FLOW-60` | 60 | £189.99 | Flow quarterly recurring + one-time |
| `FLOW-80` | 80 | £189.99 | Flow quarterly first box (+20 free) |
| `CLEAR-20` | 20 | £69.98 | Clear monthly recurring + one-time |
| `CLEAR-28` | 28 | £69.98 | Clear monthly first box |
| `CLEAR-60` | 60 | £189.99 | Clear quarterly recurring + one-time |
| `CLEAR-80` | 80 | £189.99 | Clear quarterly first box |
| `BOTH-40` | 40 | £99.98 | Both monthly recurring + one-time |
| `BOTH-56` | 56 | £99.98 | Both monthly first box |
| `BOTH-120` | 120 | £279.99 | Both quarterly recurring + one-time |
| `BOTH-140` | 140 | £279.99 | Both quarterly first box |

### Synergy fulfilment — process for any new/changed subscription variant

The only physical unit is the **28-shot box** (`FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`, `BATCHEXPIRY` set). Every other variant is a **virtual bundle** defined by a `custom.bundlecomposition` metafield that Synergy explodes into 28-boxes at pick time (Synergy confirmed the single-line format `NxSKU+NxSKU` explodes into component lines). **A variant without this metafield reaches Synergy as a plain SKU and must be hand-fixed on every order — that was the quarterly pain.**

**Process — adding (or fixing) a Synergy-safe variant:**
1. Create the variant: SKU `PRODUCT-SHOTS` (e.g. `FLOW-60`), price = base one-time price.
2. Set the metafields:
   - `custom.bundlecomposition` = the physical boxes, single-line `NxSKU+NxSKU` (e.g. `3xFLOW-FUNNEL-28`).
   - `custom.batchexpiry` = **blank** (only physical boxes carry batch/expiry; a bundle has none).
   - `custom.disableinvsync` = match the working bundles (blank, per `-84`/`-56`).
3. Weight = (number of 28-boxes) × 2.1 kg (1→2.1, 2→4.2, 3→6.3, 5→10.5).
4. **Never delete** `FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28` — every bundle points at them.
5. Give Synergy the new SKU → box mapping (one document). They explode via the metafield automatically; no manual portal work.
6. Verify on a live/test order it interfaces exploded into components (Synergy's KIT_ID / LINE_ID feed).

**Stage 1 box mapping (confirmed 14 Aug — no first/recurring differentiation; everything in 28-boxes):**

| Variant(s) | `bundlecomposition` | boxes | weight |
|------------|---------------------|-------|--------|
| `FLOW-20`/`CLEAR-20` (+ `-28`) | `1x*-FUNNEL-28` | 1 | 2.1kg |
| `FLOW-60`/`CLEAR-60` (+ `-80`) | `3x*-FUNNEL-28` | 3 | 6.3kg |
| `BOTH-40` (+ `-56`) | `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28` | 2 | 4.2kg |
| `BOTH-120` (+ `-140`) | `3xFLOW-FUNNEL-28+2xCLEAR-FUNNEL-28` | 5 | 10.5kg |

**Live quarterly fix DONE (verified 14 Aug):** the existing active quarterly variants (`FLOW/CLEAR-FUNNEL-60`/`-80`, `BOTH-FUNNEL-120`/`-140`) now carry the Stage-1 `bundlecomposition` + corrected weights above — the manual quarterly portal work is resolved, independent of the Skio cutover. **Remaining gap:** the monthly `-20`/`-40` and their `-OTP` variants still have no `bundlecomposition` (and wrong weights 1.5/3.0kg). Dormant if monthly routes to the physical `-28`/`-56`, but set them for correctness: `FLOW-FUNNEL-20`/`-20-OTP` → `1xFLOW-FUNNEL-28` (2.1kg); `CLEAR-FUNNEL-20`/`-20-OTP` → `1xCLEAR-FUNNEL-28` (2.1kg); `BOTH-FUNNEL-40`/`-40-OTP` → `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28` (4.2kg). Also confirm no legacy monthly sub still renews on them.

**Stage 2 fulfilment work (when the 20-box goes live):** the physical 20-shot box becomes a new physical SKU (`BATCHEXPIRY`, stocked at Synergy, EAN/label). Then re-point and re-weight the recurring "20-increment" bundles: update each recurring variant's `bundlecomposition` to the 20-box (clean multiples — `1x`/`3x`/…) and its weight to (count × 20-box weight). Selling variants and Skio plans don't change; only the fulfilment metafields + weights.

**Cutover rules (Synergy):** Connector pulls only open+paid+unfulfilled; never remove the `IMPORTSYNERGY` tag; orders can't be edited after Synergy pulls them.

### Existing variants + post-migration action

Nothing here is edited during the migration — they keep serving live Loop + one-time orders until cutover, then get deleted once Skio confirms zero contracts remain. (Flow shown; Clear/Both mirror it.)

| Existing SKU | Shots | Price | What it is | Post-migration action |
|--------------|-------|-------|------------|-----------------------|
| `FLOW-FUNNEL-20-OTP` | 20 | £69.98 | one-time | Delete once site points to `FLOW-20` |
| `FLOW-FUNNEL-20` | 20 | £39.99 | Loop monthly recurring | Delete once migrated |
| `FLOW-FUNNEL-28` | 28 | £39.99 | Loop monthly first box | Delete once migrated |
| `FLOW-FUNNEL-60` | 60 | £109.99 | Loop quarterly recurring | Delete once migrated |
| `FLOW-FUNNEL-80` | 80 | £109.99 | Loop quarterly first box | Delete once migrated |
| `FLOW-FUNNEL-84` | 84 | £229.99 | old standalone (dead) | Delete anytime |

**Code:** at cutover, `funnelData.ts` `FUNNEL_VARIANTS` points one-time + subscription attach points at the new variant GIDs + Skio plan GIDs (behind the config swap).

### Selling plans (4 — Subscribe & Save)

**Build status (14 Aug):** Plan 1 (`20 Shots - Monthly`) was attempted but the save appeared to fail and redirected to the Shopify billing-approval screen to accept Skio's first subscription charge. Rudh emailed **Noah (Skio)** to postpone/correct that billing value (as offered); plan creation resumes once resolved. **Plans 1-4 all still to be (re)created.**

**Use % discount, not Set price.** Skio warns Set price is ignored under Shopify market prices (international overcharge risk) — use **Percentage off**. Named by recurring quantity + cadence (admin-only). Attach to the **base variant only** at Stage 1 (no bonus variants / swap yet — that's Stage 2).

**Constants on every plan:** Subscribe & Save · Shipping profile = Managed by Shopify · Pricing rule = Percentage off · Advantages always include **Free UK Shipping** + **Full CONKA app access** + the per-plan free-shots line.

| # | Group name | Products (variant, base £) | Customer-facing label | Bill every | % off | Sub price | Free-shots advantage |
|---|-----------|----------------------------|-----------------------|-----------|-------|-----------|----------------------|
| 1 | `20 Shots - Monthly` | `FLOW-20` + `CLEAR-20` (£69.98) | Monthly subscription | 1 month | 42.86% | £39.99 | +8 Free Shots on your 1st order |
| 2 | `60 Shots - Quarterly` | `FLOW-60` + `CLEAR-60` (£189.99) | Quarterly subscription | 3 months | 42.11% | £109.99 | +20 Free Shots on your 1st order |
| 3 | `40 Shots - Monthly` | `BOTH-40` (£99.98) | Monthly subscription | 1 month | 25.00% | £74.99 | +16 Free Shots on your 1st order |
| 4 | `120 Shots - Quarterly` | `BOTH-120` (£279.99) | Quarterly subscription | 3 months | 46.43% | £149.99 | +20 Free Shots on your 1st order |

Free-shots = first-order shots − recurring (8, 20, 16, 20). **Verify each % preview lands on the target price** (nudge the last decimal if it rounds off by a penny). Once all 4 exist: drop the Skio API key in `.env.local` → Claude pulls the plan GIDs → Phase 2 code re-point.

### First-order swap (Skio Journey, after plans + variants exist)

One per cadence: after order 1, swap the line from the bonus variant to the base variant.
- Monthly: 28-shot → 20-shot
- Quarterly: 80-shot → 60-shot (Both: 56→40, 140→120)

Price is unchanged by the swap (both variants share the base); the swap only shrinks the physical box after the bonus first order.

### Order of operations

**Part 1 — build alongside live Loop (nothing live changes):**
1. Shopify: create the 12 net-new variants at base price. Hand Synergy the one SKU→box document.
2. Skio: create the 4 selling plans (interval + discount).
3. Skio: attach each plan to its new + reused variants (see plans table).
4. Skio: build the swap Journeys (28→20, 80→60, etc.).

**Part 2 — code:**
5. Phase 2: point `funnelData.ts` `FUNNEL_VARIANTS` at the new variant GIDs + Skio plan GIDs, behind the config swap. Deployed at cutover.

**Part 3 — cutover (one coordinated moment):**
6. Skio migrates existing Loop contracts (at their current prices) → Loop billing off → deploy the Part 2 code so new customers go through Skio.
7. Post-cutover: archive the now-unused Loop-era variants.

---

## Plan-GID mapping tracker

Source of truth for the mapping is `app/lib/skio.ts` (`LOOP_TO_SKIO_SELLING_PLAN`) and [`SKU_AND_SHOT_REFERENCE.md` §3b](../../product/SKU_AND_SHOT_REFERENCE.md). This table tracks fill progress.

> **Note (13 Aug):** the "two families" framing below describes the CURRENT Loop setup. Under the [offer-architecture decision](#offer-architecture-decision-open--blocks-plan-build), the funnel Skio plans will be rebuilt to the clean model (selling-plan discount, not SKU-priced), so the Skio side of Family A will not be a like-for-like mirror. Family B (legacy PDP/protocol) is only recreated if anything still sells against it.

**Current Loop mechanics (what we're migrating FROM):**
- **Family A (funnel):** billing-frequency plan, **£0.00 discount** (confirmed). Saving is SKU-priced + first-order swap.
- **Family B (PDP + protocol):** real **−20% Subscribe & Save** plans at three frequencies. The same three plans serve both PDP packs and all legacy protocols.

| Family | Plan | Interval | Discount | Loop GID | Skio GID |
|--------|------|----------|----------|----------|----------|
| A | Flow/Clear — Monthly | every 1 month | 42.86% (Skio) | `712527348086` | `712928887158` ✅ |
| A | Flow/Clear — Quarterly | every 3 months | 42.11% (Skio) | `712527413622` | `712928919926` ✅ |
| A | Both — Monthly | every 1 month | 25.00% (Skio) | `712527479158` | `712928952694` ✅ |
| A | Both — Quarterly | every 3 months | 46.43% (Skio) | `712527446390` | `712928985462` ✅ |
| B | Starter | Weekly (WEEK ×1) | −20% | `711429882230` | — (not recreated) |
| B | Pro | Bi-weekly (WEEK ×2) | −20% | `711429947766` | — (not recreated) |
| B | Max | Monthly (MONTH ×1) | −20% | `711429980534` | — (not recreated) |

**Skio plan → variant attachment (pulled from Skio API 2026-08-18):**

| Skio plan GID | Group GID | % off | Variant SKU → GID |
|---|---|---|---|
| `712928887158` | `100167876982` | 42.86% | `FLOW-20` → `58457787040118`, `CLEAR-20` → `58457822069110` |
| `712928919926` | `100167909750` | 42.11% | `FLOW-60` → `58457811550582`, `CLEAR-60` → `58457854411126` |
| `712928952694` | `100167942518` | 25.00% | `BOTH-40` → `58457859686774` |
| `712928985462` | `100167975286` | 46.43% | `BOTH-120` → `58457864077686` |

Source of truth in code: `app/lib/funnelData.ts` (`SKIO_SUBSCRIPTION_VARIANTS` — live storefront wiring, flag-gated) for variant+plan attachment; `app/lib/skio.ts` (`LOOP_TO_SKIO_SELLING_PLAN`) for the plan-level reference/reconciliation map. Family B left null — no Skio equivalents created (recreate only if a surface still sells against those plans).

---

## Change log

Newest first. One line per meaningful change.

- **2026-08-18** — **Phase 3 built (behind flag), SCRUM-1221.** Skio customer portal at a NEW route `/account/manage` (iframe), branch `feature/skio-account-portal`. New `app/lib/subscriptionsFlag.ts` (shared `subscriptionsUseSkio`, replacing the two inline copies); signed src route `app/api/auth/skio-portal/route.ts` (parses numeric id from the customer GID, `md5(id + STORE_ID_HASH)`, cpv3 `/a/account/login` src, `totalSpent=0`, rejects non-numeric mock-auth ids); `/account/manage` iframe shell (loading/signed-out/error + postMessage resize); `/account` entry point flag-gated to link there; scoped CSP `frame-src https://cpv3.skio.com` on `/account/manage` only. `SKIO_STORE_ID_HASH` (`4e562fa9...`) set in `.env.local`. Build + lint + tsc clean. **Pending: preview spike** with a real Customer Account login (mock auth can't drive it) to confirm the exact URL/params, auto-login, `frame-ancestors`, and resize. Open: `totalSpent=0` ok? address/payment writeback? cpv3 confirmed (default).
- **2026-08-18** — **Cleanup + naming.** Renamed the Skio offer const `SKIO_FUNNEL_VARIANTS` → `SKIO_SUBSCRIPTION_VARIANTS` and `activeFunnelVariants` → `activeOfferVariants` ("funnel" was too narrow). Removed the duplicated `SKIO_SUBSCRIPTION_VARIANT_GID` from `skio.ts` (funnelData is the single live source). Clarified that the flag is locally testable (`NEXT_PUBLIC_SKIO_ENABLED=true` in `.env.local` + restart dev). Separately (not Skio): deleted the dead `funnel-b` trial page and labelled `start-b`/`lander-b`/`funnel-c` as dormant.
- **2026-08-18** — **Phase 2 code complete (behind flag).** Discovery sweep confirmed every live subscribe surface funnels through `getOfferVariant`/`getOfferByVariantId` in `app/lib/funnelData.ts` (+ the trial-b copy). Added `SKIO_SUBSCRIPTION_VARIANTS` + a build-time flag `NEXT_PUBLIC_SKIO_ENABLED` (default false = Loop): forward selection (`getOfferVariant`/`isVariantReady`) switches to Skio when true; reverse lookups (`getOfferByVariantId`, `detectFunnelProduct/Cadence`) resolve BOTH tables so in-flight/Loop lines still render; the Loop portal-swap accessors stay on Loop until Phase 4. **`monthly-otp` is untouched** (one-time, no plan → not a subscription-platform concern), which also sidesteps a shared-variant reverse-lookup ambiguity. Switch mechanism decided: **server-safe flag + Vercel Instant Rollback** (no Edge Config). Pending: preview-deploy verification with the flag on (cart-drawer price display, funnel checkout attaches the Skio plan). Lint + tsc clean.
- **2026-08-18** — **Phase 1 complete.** Billing approval cleared; created all 4 Skio Subscribe & Save plans (Percentage off, base variant only). Generated `SKIO_API_TOKEN` (set in `.env.local` + Vercel prod/preview). Pulled plan + variant GIDs via the Skio GraphQL API and populated `LOOP_TO_SKIO_SELLING_PLAN` + new `SKIO_SUBSCRIPTION_VARIANT_GID` in `app/lib/skio.ts`, plus the mapping-tracker tables. Mapped by discount %: 42.86→`712928887158` (20-Monthly), 42.11→`712928919926` (60-Quarterly), 25.00→`712928952694` (40-Monthly), 46.43→`712928985462` (120-Quarterly); variant attachments verified via SellingPlanGroupResources. Family B (PDP/protocol 20% plans) left unmapped — no Skio equivalents created. Next: Phase 2 discovery sweep + re-point.
- **2026-08-17** — **Paused, blocked on Skio account billing approval** (awaiting Noah). Refreshed the top of the doc to a clean pickup point: status-at-a-glance Phase 1 → blocked, current-focus rewritten with done/safe list + ordered resume steps, blockers table led by the billing gate (stale offer-architecture decision cleared as resolved). No code/config lost; 6 base variants + live quarterly bundlecomposition remain done.

- **2026-08-14** — Started building the Skio plans. **Blocker:** creating plan 1 (`20 Shots - Monthly`) redirected to Shopify's billing-approval screen to accept Skio's first subscription charge; Rudh emailed Noah (Skio) to postpone/correct the value before continuing. Chose **Percentage off** over Set price (Set price is ignored under Shopify market prices = international overcharge risk). Locked the full 4-plan build table (group name, variants, customer-facing label, interval, % off, sub price, per-plan free-shots advantage) into the selling-plans section so the build can resume cleanly. 6 base variants + all live quarterly bundlecomposition already done.

- **2026-08-14** — Verified all 6 live quarterly variants (`FLOW/CLEAR-FUNNEL-60`/`-80`, `BOTH-FUNNEL-120`/`-140`) now carry Stage-1 `bundlecomposition` (3×28 single / 3F+2C Both) + corrected weights — **manual quarterly portal work resolved**. Rewrote the Synergy section into a repeatable **process for adding a Synergy-safe variant** (bundlecomposition + blank batch + weight = boxes×2.1kg + one SKU→box doc to Synergy), added the confirmed Stage-1 box mapping, and documented **Stage 2 fulfilment work** (re-point the 20-increment bundles' composition + weight when the physical 20-box goes live). Mirrored the process into the plan doc. Flagged remaining gap: monthly `-20`/`-40` variants still lack bundlecomposition (dormant — confirm).
- **2026-08-14** — Structured the fulfilment side into **3 stages** (assumptions made explicit): Stage 1 launch on 28-boxes (6 base variants, no swap, bundlecomposition → 28s, mirrors current monthly), Stage 2 when 20-boxes go live (add 6 bonus variants + swap, re-point bundlecomposition to 20-boxes), Stage 3 when a 4/8-shot gift box exists (20-box + first-order gift). Skio plans/variants constant across stages; only `bundlecomposition` changes. **Key dependency = 20-box go-live date.** Corrected Both-quarterly to 3 Flow + 2 Clear (140 shots).
- **2026-08-14** — Read the Synergy 3PL doc + checked live variant metafields. Key finding: only the 28-shot box is physical; other variants are `bundlecomposition` metafield bundles, and the current `-20`/`-60`/`-80` variants have **no** bundle metafields (not Synergy-configured). So each new variant needs a bundle metafield → 28-boxes (SCRUM-1051 pattern), inventory-sync setting, and SKU sync — not just "a SKU". No new physical stock/labels. Two ops questions flagged (does recurring ship the same box as first order; how do current subs fulfil today). Synergy section rewritten.
- **2026-08-14** — **12 net-new variants, nothing existing touched** (3PL-safe): renaming an existing SKU would disrupt Synergy's mapping for live transition-period orders, so `FLOW-20`/`CLEAR-20`/`BOTH-40` are created fresh too (not renamed). All 12 new SKUs handed to Synergy in one SKU→box document before cutover; every existing variant untouched until cutover, then deleted post-migration. Clean SKU naming `PRODUCT-SHOTS` (no `FUNNEL`, no type suffix). Added existing-variants table with post-migration delete actions.
- **2026-08-14** — **Final variant strategy: create 9 new variants, never touch a variant Loop uses** (safety over SKU-count). Build the whole Skio structure alongside live Loop, test, then flip at cutover; existing subscribers untouched until Skio migrates them. Reprice-at-cutover was considered and rejected (untestable pre-cutover, depends on Loop price-sync). New-variant list + reused-variant list + 3-part order of operations locked in the build spec. Supersedes the 13 Aug reprice entry.
- **2026-08-13** — Pulled all 3 funnel products' live variants from Shopify Admin (read-only). Confirmed monthly OTP/base variants exist, **quarterly base/OTP variant missing for all three** → must create. Renamed plans to quantity + cadence (`20/40/60/120 Shots - Monthly/Quarterly`). Set quarterly base £189.99/£279.99 with clean −£80/−£130 discounts. Added SKU suggestions + Synergy mapping note (new OTP SKUs = same physical box as existing sub variants; notify Synergy before go-live). `*-FUNNEL-84/-168` confirmed legacy (old standalone-28 era), ignore.
- **2026-08-13** — Skio approach validated by Skio support (base-price + selling-plan discount, per-interval variants, shared plans by equal %, Journey swap). Locked the [target build spec](#target-skio-build-spec-phase-1--2): base = one-time price (postage baked in), quarterly base = 3× monthly, create-not-reprice variants, 4 Subscribe & Save plans (Flow/Clear shared, Both separate) with exact fixed-amount discounts, swap via Journey. Decided to keep current live prices (4 plans, not standardised to 2).

- **2026-08-13** — Confirmed from Loop UI that funnel plans apply **£0.00 discount** (saving is SKU-priced). Skio best-practice guidance says move to **one variant + selling-plan discount**; opens the [offer-architecture decision](#offer-architecture-decision-open--blocks-plan-build) (Option A price policy vs Option B variant-swap Journey). Reframes Phase 1 to "build clean model" and simplifies Phase 2. Awaiting Rudh's Option A/B call.
- **2026-08-13** — Phase 1 code scaffold built + reviewed on branch `feature/skio-phase1-scaffold`: `SKIO_API_TOKEN`/`SKIO_STORE_ID_HASH` getters in `env.ts`; new `app/lib/skio.ts` (GraphQL config + `LOOP_TO_SKIO_SELLING_PLAN`, Skio side null); §3b mapping table added to `SKU_AND_SHOT_REFERENCE.md`. `/review-code`: fixed GID-format normalisation in `loopToSkioSellingPlan` (accepts bare-numeric PDP ids + full GIDs). Cart fragment already selects `sellingPlan { id name }` — no change needed. Nothing wired into a purchase path; Loop fully live.
- **2026-08-12** — Migration decided + scoped. Plan doc created; SCRUM-1210 (Phase 1) raised under epic SCRUM-768.
