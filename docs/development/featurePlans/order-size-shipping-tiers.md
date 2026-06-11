# Order-Size Shipping Tiers + B2B Synergy Consolidation

**Status:** Phase 1 DONE + live-verified (SCRUM-1079, Sprint 27); Phase 2 (B2B invoice shipping line) next
**Created:** 2026-06-10 · **Updated:** 2026-06-11
**Owner:** Rudh (Shopify config + light code) with Humphrey (Evri/DPD actual costs)
**Relates to:** `b2b-consolidated.md` (programme-level B2B status), `b2b-professionals-portal.md` (outstanding items 3 + 4), `synergy-3pl-integration.md`, `docs/shipping/SHIPPING_AND_COURIERS.md`

---

## Pick up here (next session)

Scoped, costed, and the three open questions are now **settled** (11 Jun):

1. **Round-number tuning - RESOLVED: cover worst-case.** Customer charge covers our cost even at the top of each band (Express £12/£25/£50, next-day £26/£52). No band ships at a loss.
2. **Above-top-band behaviour - RESOLVED: high catch-all rate, not a hard block.** Express £75 above 105 kg, next-day £110 above 50.4 kg, so no legitimate buyer is ever blocked at checkout.
3. **Variant weights - CHECKED 11 Jun (Storefront API), and there IS a problem to fix.** The 2 physical boxes (`FLOW-FUNNEL-28`, `CLEAR-FUNNEL-28`) and both B2B Team Boxes correctly read **2.1 kg**, but **all 4 virtual bundles read 0 kg** (`FLOW-FUNNEL-84`, `CLEAR-FUNNEL-84`, `BOTH-FUNNEL-56`, `BOTH-FUNNEL-168`). Bands would misfire (e.g. `BOTH-FUNNEL-168` would land in the free band at 0 kg, which is right by luck, but a `BOTH-FUNNEL-56` + extra boxes cart would under-weigh). **Fixing the bundle weights is now the first Phase 1 task** (see 1.0 below): set 84s → 6.3 kg, `BOTH-56` → 4.2 kg, `BOTH-168` → 12.6 kg.

Then Phase 1 (Shopify Admin config) and Phase 2 (one shippingLine in `app/api/b2b/invoice-order/route.ts`) can both go. Numbers are final - costs are known, no external input needed.

---

## Problem

Our shipping rates are flat and were priced for a **1 to 3 box consumer order**: UK Standard is free (Evri Express) and next-day is a flat £6.54 (DPD). They undercharge badly on any large order, and the leak is **order-size-driven, not channel-driven** - a DTC consumer buying 8 boxes leaks exactly the same way a B2B club buying 50 does. The flat next-day rate is the worst offender: £6.54 on an order that is physically several parcels of DPD next-day freight.

This surfaced while closing the B2B portal's two outstanding shipping items, but the right fix is global, not a B2B carve-out.

**Key physical facts (already confirmed):**
- 1 box of 28 shots = **2.1 kg**.
- 3 boxes case into **one outer carton (~6.3 kg)** that ships as a **single Evri parcel** in the 3 to 15 kg band at **~£3** (Bethany, 10 Jun). So freight cost ≈ `ceil(boxes / 3) × ~£3`.
- Parcels beat a pallet until **~60 boxes** (then a pallet wins, and only on the cheapest postcodes). Pallets are handled manually for now.

## Who it serves / business impact

- **DTC margin:** stops eating freight on the occasional large consumer order (5+ boxes, bulk gifting, stock-ups) and on bulk next-day.
- **B2B:** the same change covers the B2B card path automatically, since B2B is the same physical product (same SKUs) and shares the global rate table.
- This is a **margin/AOV protection** change, not an acquisition change. It must not damage the conversion-critical free-shipping promise on normal orders (see No-Gos).

## Approach

Because B2B and DTC are the **same SKUs**, you cannot give B2B its own shipping profile (Shopify profiles are per-product, and it is the same variant). So the fix is two-pronged:

1. **Weight-band the global Shopify rates** so freight scales with order size for everyone. Box weight (2.1 kg) maps almost 1:1 to box count, so a weight-based rate table is effectively a quantity table. Pure Shopify Admin config, no code.
2. **Add a shipping line to the B2B invoice draft order** in code - draft orders do not auto-pull the rate table, so invoiced bulk orders need freight added explicitly. Small code change.

Then, on aligned timing, **consolidate B2B onto the funnel SKUs** so B2B fulfils from Synergy (inheriting the confirmed Evri/DPD economics) instead of Burnside.

**Design system:** no impact (Shopify Admin config + one API route; no UI).

---

## Weight-band tables (UK) - derived from real carrier costs

Costs are known, not estimated - from the Synergy Evri/DPD carriage cards (transcribed in
`SHIPPING_AND_COURIERS.md` §3): **Evri standard parcel £2.92**, **DPD next-day £6.54**, both
**per parcel**. A bulk order ships as `ceil(boxes / 3)` master-carton parcels (3 boxes / 6.3kg
each); a retail order up to 6 boxes (12.6kg) ships as a single wrapped parcel.

Free band deliberately covers **every normal order including the largest quarterly bundle**
(`BOTH-FUNNEL-168` = 6 boxes = 12.6 kg), so no subscriber or typical DTC order ever sees a
charge. Charges begin only at genuine bulk (7+ boxes).

**These are the live Shopify values (entered as `Weight` rate-type tiers, in grams).** Canonical
copy with full cost columns: `docs/shipping/SHIPPING_AND_COURIERS.md` §3.

### `Express` (Evri standard) - £2.92/parcel

| Weight band (g) | Weight band (kg) | Price | Boxes | Cartons shipped | Our Evri cost |
|---|---|---|---|---|---|
| 0 – 13,650 | 0 – 13.65 | **Free** | 1 to 6 | 1 to 2 | £2.92 – £5.84 |
| 13,650 – 26,250 | 13.65 – 26.25 | **£12** | 7 to 12 | 3 to 4 | £8.76 – £11.68 |
| 26,250 – 51,450 | 26.25 – 51.45 | **£25** | 13 to 24 | 5 to 8 | £14.60 – £23.36 |
| 51,450 – 106,050 | 51.45 – 106.05 | **£50** | 25 to 50 | 9 to 17 | £26.28 – £49.64 |
| 106,050 – No limit | 106.05+ | **£75** | 51+ | 17+ | £49.64+ |

### `24 Hour Delivery` (DPD next-day) - £6.54/parcel (kills the flat-rate leak)

The old flat **£6.54** was correct only for a single-parcel order (1 to 6 boxes). Above that
it bled badly: a 50-box next-day order is ~17 parcels = ~£111 of DPD, charged £6.54.

| Weight band (g) | Weight band (kg) | Price | Boxes | Cartons shipped | Our DPD cost |
|---|---|---|---|---|---|
| 0 – 13,650 | 0 – 13.65 | **£6.54** | 1 to 6 | 1 to 2 | £6.54 – £13.08 |
| 13,650 – 26,250 | 13.65 – 26.25 | **£26** | 7 to 12 | 3 to 4 | £19.62 – £26.16 |
| 26,250 – 51,450 | 26.25 – 51.45 | **£52** | 13 to 24 | 5 to 8 | £32.70 – £52.32 |
| 51,450 – No limit | 51.45+ | **£110** | 25+ | 9+ | £58.86+ |

Notes:
- Customer charges **cover the worst-case cost** in each band (decision locked 11 Jun:
  cover-cost, not absorb-some). 1 box = 2,100 g; cartons shipped = ceil(boxes ÷ 3).
- **Boundary finding (11 Jun, live-verified):** Shopify's `Weight` tier treats the **maximum as
  exclusive** - a cart exactly on a boundary falls into the *higher* band. So every maximum is set
  **+1,050 g (half a box) above the true box boundary** (12,600 → 13,650, etc.). This keeps the
  exact box-counts (6/12/24/50) inside the intended band - without it, the quarterly bundle (6
  boxes = 12,600 g) was charged £12 instead of Free.
- The **top band uses a high catch-all rate** (Express £75, next-day £110), decided 11 Jun over a
  hard block, so no legitimate buyer is ever blocked at checkout. The catch-all under-recovers on
  genuinely huge orders (>~75 boxes standard), which is acceptable: orders that size should be on
  the B2B invoice path, where freight or a pallet is set per order. A pallet (~£60+) only starts
  winning past ~60 boxes and stays a manual draft-order line.
- The 25 to 50 standard band covers the B2B card path (B2B tiers start at 25 and 50 boxes), so a
  club paying by card still gets sensible freight.

**International: DONE (11 Jun 2026).** After UK proved out, all international zones were banded
the same way (driven by the quarterly-order leak in long-haul zones, not bulk). All Evri, DDU
(customer pays duty), priced near worst-country cost per zone, no rate above 6 boxes (forwarder
enquiry). Live + verified: Canada, Australia, New Zealand, South Africa, Caribbean, France, Middle
East (UAE), and Europe (single zone at the "Mid" band as a pragmatic compromise vs a 3-way split).
USA (separate USD/DHL build) and Channel Islands/Jersey (no rate-card data) left flat. Full per-zone
band tables + the DDU decision + the Europe-split option: `docs/shipping/SHIPPING_AND_COURIERS.md` §4.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Weight-band the global UK Shopify rates (Standard + next-day) | **DONE - live-verified 11 Jun** (10-cart Storefront API sweep, all boundaries correct, quarterly bundle Free) |
| 2 | B2B invoice draft-order shipping line + manual pallet playbook | Not Started - ACTIVE |
| 3 | Consolidate B2B onto the funnel SKUs so it fulfils from Synergy | Future (committed next track) |

### Phase 1 - Weight-band the global UK rates (ACTIVE)

0. **Fix the bundle weights (BLOCKING - do first).**
   - What: the 4 virtual bundles read **0 kg** in Shopify today (verified 11 Jun via Storefront API), so the weight bands would misfire. Set each in Products > variant > Shipping > Weight: `FLOW-FUNNEL-84` → **6.3 kg**, `CLEAR-FUNNEL-84` → **6.3 kg**, `BOTH-FUNNEL-56` → **4.2 kg**, `BOTH-FUNNEL-168` → **12.6 kg**. The 2 physical boxes + both B2B Team Boxes already read 2.1 kg (no change).
   - Dependencies: none.
   - Complexity: Small (Admin data entry).
   - Files: none (Shopify Products).

1. **Shopify config - UK Standard (`Express`) weight bands**
   - What: replace the flat free UK "Express" rate with the Evri weight-band table above (free to 12.6 kg, then £12 / £25 / £50, £75 catch-all above 105 kg). Keep the rate name exactly "Express" (Synergy maps on name only).
   - Dependencies: task 0 (weights must be right first).
   - Complexity: Small (Admin config).
   - Files: none (Shopify Settings > Shipping). Document final numbers in `docs/shipping/SHIPPING_AND_COURIERS.md`.

2. **Shopify config - UK next-day (`24 Hour Delivery` / DPD) weight bands**
   - What: replace the flat £6.54 "24 Hour Delivery" with the DPD weight-band table above (£6.54 to 6 boxes, then £26 / £52, £110 catch-all above 50.4 kg); kills the bulk next-day leak. Keep the rate name exactly "24 Hour Delivery".
   - Dependencies: task 0.
   - Complexity: Small (Admin config).
   - Files: none.

3. **Verify against funnel + subscription SKUs**
   - What: with weights fixed, confirm via test carts that `BOTH-FUNNEL-168` (12.6 kg) and all quarterly/sub bundles still land in the **free** band, a 1-box order is free + £6.54, 7 boxes → £12 / £26, and 30 boxes → £50 / £110. If `BOTH-FUNNEL-168` shows a charge, the weight roll-up is still wrong.
   - Dependencies: tasks 0-2.
   - Complexity: Small.

### Phase 2 - B2B invoice shipping line + pallet playbook (ACTIVE)

1. **Code - shipping line on the B2B invoice draft order**
   - What: in `draftOrderCreate`, set a `shippingLine` computed from box count using the same carton math (`ceil(boxes / 3) × carton rate`), so invoiced bulk orders carry freight. Mirror the weight-band prices for consistency.
   - Dependencies: agreed band numbers from Phase 1.
   - Complexity: Small.
   - Files: `app/api/b2b/invoice-order/route.ts` (currently sets **no** shipping line).

2. **Doc - manual pallet playbook for >60-box orders**
   - What: write the interim process - for genuine pallet-scale orders Harry adds a `Pallet` shipping line + cost to the draft order before sending the invoice; international pallets are customer-arranged via their own freight forwarder (Europa / Kuehne+Nagel), notify the Synergy Client Manager the collection date.
   - Dependencies: none.
   - Complexity: Small (documentation).
   - Files: `docs/shipping/SHIPPING_AND_COURIERS.md`.

### Phase 3 - Consolidate B2B onto funnel SKUs → Synergy (FUTURE, committed next)

Goal: B2B fulfils from Synergy on the confirmed Evri/DPD economics, not Burnside. Because B2B is the same physical box as the funnel SKUs, this is a consolidation, not a re-onboarding.

High-level (detail when promoted to active):
- Re-point the B2B portal off its archived legacy variants onto the **funnel variants** (`FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`) - `app/lib/b2bVariants.ts`, `app/api/b2b/cart/route.ts`, `app/api/b2b/invoice-order/route.ts`.
- Rework where the B2B tier discounts target (automatic discounts currently key off the "B2B Products" collection; the FIXED_AMOUNT draft-order discount keys off the gross base).
- Remove `SYNERGYIGNORE` exposure / retire the dead legacy B2B products.
- Stock planning: Synergy must hold enough of the 2 physical SKUs to cover bulk B2B draws (a different inventory profile than funnel DTC).

---

## Rabbit holes

- **Subscription / bundle free-shipping promise.** The free band is set to 12.6 kg specifically so every standard and subscription order (up to the 6-box quarterly bundle) stays free. Do not lower it without a deliberate decision - charging subscribers shipping is a retention risk.
- **Bundle weight roll-up.** Virtual bundles (`*-84`, `*-168`, `BOTH-*`) must report the correct total weight to Shopify or the band logic misfires. Verify before trusting the table.
- **Phase 3 touching a just-shipped feature.** Re-pointing B2B onto funnel SKUs changes a live portal's variant + discount wiring. Do it on aligned timing with care, not under order pressure.

## No-gos

- **Do not lose free shipping on normal DTC orders** (1 to 6 boxes). That free-shipping promise is a conversion lever; the whole table is designed around protecting it.
- **No per-channel shipping profile for B2B** - impossible while B2B and DTC share variants, and unnecessary once rates are weight-banded.
- **No pallet automation** until real bulk volume appears (>60 boxes is the crossover). Manual draft-order line in the interim.
- **No international weight-banding** in this pass.

## Risks

- **Weight accuracy is the real dependency** (not cost - costs are known). Confirmed live (11 Jun): the 4 bundles read 0 kg and must be fixed first (Phase 1 task 0); Phase 1.3 re-guards it after.
- **Catch-all under-recovers on the very largest orders** (>~75 boxes standard, >~50 next-day) by design. Accepted: those orders belong on the B2B invoice path / a manual pallet line.
- **Banding is never exact.** Within a band the charge over/under-recovers at the edges (e.g. a 7-box order wrapped as one parcel costs £2.92 but sits in the £12 band). Accepted trade-off; these orders are rare.

## Open questions

- Phase 3 timing: when do we want B2B to actually move to Synergy? (Only remaining open question; Phase 1/2 decisions all locked 11 Jun.)

## Jira

| Ticket | Title | Phases | Status |
|--------|-------|--------|--------|
| SCRUM-1079 | [Shopify & Subscriptions] Order-size weight-banded UK shipping rates | 1 + 2 | To Do (Sprint 27) |

Phase 3 (B2B → Synergy consolidation) is intentionally not ticketed yet; it lives in this doc until promoted.

## References

- `b2b-professionals-portal.md` - the B2B portal (outstanding items 3 + 4 are superseded by this plan)
- `synergy-3pl-integration.md` - Synergy economics + the funnel SKU fulfilment that Phase 3 consolidates onto
- `docs/shipping/SHIPPING_AND_COURIERS.md` - canonical shipping/courier working doc; final band numbers land here
- `app/api/b2b/invoice-order/route.ts` - draft-order creation (Phase 2.1)
- `app/lib/b2bVariants.ts` - B2B variant GIDs (Phase 3 re-point)
