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

The concrete structure to build. **Create new variants; never reprice or delete a variant a live Loop contract sits on.** Loop stays untouched until cutover.

**Base-price convention:** the base variant price = the product's **one-time price** (postage baked in, matching how OTP is sold today, so no Shopify shipping reconfig). The Skio plan discounts off that base to the current live sub price. Quarterly base ≈ 3× the monthly product value + one delivery's postage, rounded (£189.99 single / £279.99 Both) so the plan discount is a clean round number. **Subscriptions must ship free** in Shopify (already true for current Loop subs) — confirm the subscription shipping rate is £0 so the baked-in postage isn't charged twice on subs.

### Variants (per product)

Reuse the existing one-time variant as the monthly base/recurring; create the rest fresh at the base price.

Live variants confirmed from Shopify Admin 2026-08-13 (read-only app). Monthly OTP/base variants already exist; **the quarterly base/OTP variant is missing for all three products** and must be created. `-S` = new Skio-era variant (suffix TBD); every new variant points at a physical box that already ships, so each needs a Synergy SKU mapping.

| Product | Cadence | Role | Shots | Base price | SKU | Action |
|---------|---------|------|-------|-----------|-----|--------|
| Flow / Clear | Monthly | base / recurring / OTP | 20 | £69.98 | `FLOW/CLEAR-FUNNEL-20-OTP` (58153768714614 / 58153768812918) | **Reuse** |
| Flow / Clear | Monthly | first-order bonus | 28 | £69.98 | `FLOW/CLEAR-FUNNEL-28-S` | **Create** |
| Flow / Clear | Quarterly | base / recurring / OTP | 60 | £189.99 | `FLOW/CLEAR-FUNNEL-60-OTP` | **Create** |
| Flow / Clear | Quarterly | first-order bonus | 80 | £189.99 | `FLOW/CLEAR-FUNNEL-80-S` | **Create** |
| Both | Monthly | base / recurring / OTP | 40 | £99.98 | `BOTH-FUNNEL-40-OTP` (58153768911222) | **Reuse** |
| Both | Monthly | first-order bonus | 56 | £99.98 | `BOTH-FUNNEL-56-S` | **Create** |
| Both | Quarterly | base / recurring / OTP | 120 | £279.99 | `BOTH-FUNNEL-120-OTP` | **Create** |
| Both | Quarterly | first-order bonus | 140 | £279.99 | `BOTH-FUNNEL-140-S` | **Create** |

**Synergy:** fulfilment (incl. the existing swap) is already live and agreed — nothing physical changes. The one thing to clarify with Synergy is what the new **quarterly OTP SKUs** (`FLOW/CLEAR-FUNNEL-60-OTP`, `BOTH-FUNNEL-120-OTP`) refer to. Legacy `*-FUNNEL-84/-168` variants: ignore.

### Selling plans (4 — Subscribe & Save)

Flow and Clear share plans (identical pricing); Both has its own (different discount). Discount given as a fixed amount off so the sub price lands exactly on the current live price; the % is the equivalent for reference. Named by recurring quantity + cadence (unambiguous: 20/60 = single formula, 40/120 = Both). Admin-only names.

| # | Plan (group) name | Interval | Attaches to | Base | Discount | Sub price |
|---|-------------------|----------|-------------|------|----------|-----------|
| 1 | 20 Shots - Monthly | every 1 month | Flow+Clear monthly base + bonus (20/28) | £69.98 | −£29.99 (42.86%) | £39.99 |
| 2 | 60 Shots - Quarterly | every 3 months | Flow+Clear quarterly base + bonus (60/80) | £189.99 | −£80.00 (42.1%) | £109.99 |
| 3 | 40 Shots - Monthly | every 1 month | Both monthly base + bonus (40/56) | £99.98 | −£24.99 (25%) | £74.99 |
| 4 | 120 Shots - Quarterly | every 3 months | Both quarterly base + bonus (120/140) | £279.99 | −£130.00 (46.4%) | £149.99 |

Each plan attaches to **both** the base and the first-order-bonus variant (same base price → same sub price), so the subscription starts on the bonus variant and stays priced correctly after the swap.

### First-order swap (Skio Journey, after plans + variants exist)

One per cadence: after order 1, swap the line from the bonus variant to the base variant.
- Monthly: 28-shot → 20-shot
- Quarterly: 80-shot → 60-shot (Both: 56→40, 140→120)

Price is unchanged by the swap (both variants share the base); the swap only shrinks the physical box after the bonus first order.

### Order of operations

1. Skio: create the 4 selling plans (basics + interval + discount). Products can be attached after the variants exist.
2. Shopify: create the new variants at the base prices above (leave Loop-referenced variants alone).
3. Skio: attach each plan to its variants.
4. Skio: build the swap Journeys.
5. Phase 2: re-point `funnelData.ts` (`FUNNEL_VARIANTS`) to the new variant GIDs + Skio plan GIDs, behind the config swap.
6. Cutover: Loop billing off, Skio live. Post-cutover: archive the old Loop-era variants.

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

- **2026-08-13** — Pulled all 3 funnel products' live variants from Shopify Admin (read-only). Confirmed monthly OTP/base variants exist, **quarterly base/OTP variant missing for all three** → must create. Renamed plans to quantity + cadence (`20/40/60/120 Shots - Monthly/Quarterly`). Set quarterly base £189.99/£279.99 with clean −£80/−£130 discounts. Added SKU suggestions + Synergy mapping note (new OTP SKUs = same physical box as existing sub variants; notify Synergy before go-live). `*-FUNNEL-84/-168` confirmed legacy (old standalone-28 era), ignore.
- **2026-08-13** — Skio approach validated by Skio support (base-price + selling-plan discount, per-interval variants, shared plans by equal %, Journey swap). Locked the [target build spec](#target-skio-build-spec-phase-1--2): base = one-time price (postage baked in), quarterly base = 3× monthly, create-not-reprice variants, 4 Subscribe & Save plans (Flow/Clear shared, Both separate) with exact fixed-amount discounts, swap via Journey. Decided to keep current live prices (4 plans, not standardised to 2).

- **2026-08-13** — Confirmed from Loop UI that funnel plans apply **£0.00 discount** (saving is SKU-priced). Skio best-practice guidance says move to **one variant + selling-plan discount**; opens the [offer-architecture decision](#offer-architecture-decision-open--blocks-plan-build) (Option A price policy vs Option B variant-swap Journey). Reframes Phase 1 to "build clean model" and simplifies Phase 2. Awaiting Rudh's Option A/B call.
- **2026-08-13** — Phase 1 code scaffold built + reviewed on branch `feature/skio-phase1-scaffold`: `SKIO_API_TOKEN`/`SKIO_STORE_ID_HASH` getters in `env.ts`; new `app/lib/skio.ts` (GraphQL config + `LOOP_TO_SKIO_SELLING_PLAN`, Skio side null); §3b mapping table added to `SKU_AND_SHOT_REFERENCE.md`. `/review-code`: fixed GID-format normalisation in `loopToSkioSellingPlan` (accepts bare-numeric PDP ids + full GIDs). Cart fragment already selects `sellingPlan { id name }` — no change needed. Nothing wired into a purchase path; Loop fully live.
- **2026-08-12** — Migration decided + scoped. Plan doc created; SCRUM-1210 (Phase 1) raised under epic SCRUM-768.
