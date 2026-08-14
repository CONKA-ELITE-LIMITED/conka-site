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
| 1 | Skio setup + selling-plan mapping | 🟡 In progress (code scaffold done; Skio dashboard + GIDs pending) | SCRUM-1210 |
| 2 | Re-point purchase surfaces (PDP → funnel → rest) | ⚪ Not started | — |
| 3 | Embedded Skio customer portal (iframe) | ⚪ Not started | — |
| 4 | Cutover + Loop decommission | ⚪ Not started | — |
| 5 | Legacy protocol retirement | ⚪ Future (ops-gated) | — |

Legend: ✅ done · 🟡 in progress · ⚪ not started · 🔴 blocked

---

## Current focus & next action

**Phase 1.** Code scaffold is built and reviewed. The remaining Phase 1 work is dashboard-side and depends on Rudh:

1. **(Rudh)** Create the Skio selling plans (see [Plan-GID mapping](#plan-gid-mapping-tracker) below for what to recreate).
2. **(Rudh)** Hand back the new Skio selling-plan GIDs per row.
3. **(Rudh)** Set `SKIO_API_TOKEN` + `SKIO_STORE_ID_HASH` in Vercel env + `.env.local`.
4. **(Claude)** Populate `LOOP_TO_SKIO_SELLING_PLAN` in `app/lib/skio.ts` + the doc table; verify the cart label with a real Skio plan; close SCRUM-1210.

---

## Open blockers & decisions pending

| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | New Skio selling-plan GIDs | Rudh | The one hard input; gates the mapping + cart-label AC. |
| 2 | **Offer-architecture decision (see below)** — Option A price policy vs Option B variant-swap Journey | Rudh (marketing call) | **Blocks the shape of the Skio plans.** Decide before building. |
| 4 | Portal version provisioned: **cpv3 vs v2** | Rudh | Feeds Phase 3 iframe URL. Record on SCRUM-1210. |
| 5 | Does Skio's portal write address edits back to Shopify? | Rudh / Skio onboarding | Gates dropping the Loop per-contract address-mirror at Phase 4. |

**Resolved:**
- ~~#3 Confirm funnel Loop plans carry 0% adjustment~~ — **CONFIRMED 13 Aug** from the Loop UI: plan #712527348086 shows "£0.00 discount". The funnel saving is entirely SKU-priced; Loop applies no discount. The "Save 25%" text is just the plan description field (and is stale/inconsistent with the real ~43%).
- ~~#2-old First-order swap feasibility~~ — Skio **can** do it, two ways (see decision below); superseded by the architecture decision.

---

## Offer-architecture decision (open — blocks plan build)

Skio's AI + best-practice guidance (13 Aug) confirmed our inherited Loop setup is non-ideal: we hand-manage separately-priced SKUs + a first-order SKU swap, with the plan at £0 discount. Skio's recommended shape is **one variant per product, subscription saving applied by the selling plan** (native, analytics-visible), with the first-order bonus done natively. This turns Phase 1 from "recreate Loop's 7 plans like-for-like" into "build the clean Skio model," and simplifies Phase 2 (the "recurring SKU GID not in codebase" rabbit hole disappears under Option A).

Our current bonus is a **quantity** bonus (28 shots first, 20 recurring, flat £39.99) — Skio's price-policy example is a **price** bonus. So there is a fork:

- **Option A — Recurring Price Policy (recommended).** One variant per product+cadence. Base price = one-time price; selling plan carries the recurring discount; first order gets a bigger discount (cheaper first box) that Skio auto-steps down after order 1. Kills SKU sprawl + swap entirely. **Changes the offer** from "extra shots" to "cheaper first box."
- **Option B — Journey variant swap.** Keeps "20 + 8 free" exactly (28-shot variant first, Skio Journey swaps to 20-shot after order 1). Preserves the current offer but keeps two variants + an automation to maintain.

**Recommendation:** Option A unless "8 free shots on first box" is a tested conversion winner. Engineering/maintainability favours A clearly; the offer change is the only reason to hold. **Decision owner: Rudh (marketing).**

Applies to NEW subscriptions going forward. Skio migrates EXISTING Loop contracts as-is at cutover, so this redesign does not disturb current subscribers.

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

Flow and Clear share plans (identical pricing); Both has its own (different discount). Discount given as a fixed amount off so the sub price lands exactly on the current live price; the % is the equivalent for reference. Named by recurring quantity + cadence (unambiguous: 20/60 = single formula, 40/120 = Both). Admin-only names.

| # | Plan (group) name | Interval | Attaches to | Base | Discount | Sub price |
|---|-------------------|----------|-------------|------|----------|-----------|
| 1 | 20 Shots - Monthly | every 1 month | `FLOW-20`+`FLOW-28`, `CLEAR-20`+`CLEAR-28` | £69.98 | −£29.99 (42.86%) | £39.99 |
| 2 | 60 Shots - Quarterly | every 3 months | `FLOW-60`+`FLOW-80`, `CLEAR-60`+`CLEAR-80` | £189.99 | −£80.00 (42.1%) | £109.99 |
| 3 | 40 Shots - Monthly | every 1 month | `BOTH-40`+`BOTH-56` | £99.98 | −£24.99 (25%) | £74.99 |
| 4 | 120 Shots - Quarterly | every 3 months | `BOTH-120`+`BOTH-140` | £279.99 | −£130.00 (46.4%) | £149.99 |

Each plan attaches to **both** the base and the first-order-bonus variant (same base price → same sub price), so the subscription starts on the bonus variant and stays priced correctly after the swap.

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
| A | Flow/Clear — Monthly | every 1 month | 0% (SKU-priced) | `712527348086` | _TBD_ |
| A | Flow/Clear — Quarterly | every 3 months | 0% (SKU-priced) | `712527413622` | _TBD_ |
| A | Both — Monthly | every 1 month | 0% (SKU-priced) | `712527479158` | _TBD_ |
| A | Both — Quarterly | every 3 months | 0% (SKU-priced) | `712527446390` | _TBD_ |
| B | Starter | Weekly (WEEK ×1) | −20% | `711429882230` | _TBD_ |
| B | Pro | Bi-weekly (WEEK ×2) | −20% | `711429947766` | _TBD_ |
| B | Max | Monthly (MONTH ×1) | −20% | `711429980534` | _TBD_ |

---

## Change log

Newest first. One line per meaningful change.

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
