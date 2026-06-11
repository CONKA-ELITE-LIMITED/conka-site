# Order-Size Shipping Tiers + B2B Synergy Consolidation

**Status:** Scoped, not started
**Created:** 2026-06-10
**Owner:** Rudh (Shopify config + light code) with Humphrey (Evri/DPD actual costs)
**Relates to:** `b2b-professionals-portal.md` (outstanding items 3 + 4), `synergy-3pl-integration.md`, `docs/shipping/SHIPPING_AND_COURIERS.md`

---

## Pick up here (next session)

Scoped and costed; nothing blocking. Before building, settle three things:

1. **Round-number tuning** - charge to cover worst-case cost in each band (as drafted: Express £12/£25/£50, next-day £26/£52) or absorb some to stay customer-friendly?
2. **Above-top-band card behaviour** - hard block (no rate → forces enquiry/invoice) or a high catch-all rate?
3. **Verify variant weights in Shopify** - confirm each funnel box is 2.1 kg and bundles roll up correctly (`BOTH-FUNNEL-168` must read 12.6 kg), or the bands trigger on wrong weights. This is the only real dependency.

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

### `Express` (Evri standard) - £2.92/parcel

| Order (boxes) | Weight band | Parcels | Cost to us | Customer charge |
|---------------|-------------|---------|------------|-----------------|
| 1 to 6        | 0 to 12.6 kg | 1      | £2.25 to £2.92 | **Free**    |
| 7 to 12       | 12.6 to 25.2 kg | 3 to 4 | £8.76 to £11.68 | **£12** |
| 13 to 24      | 25.2 to 50.4 kg | 5 to 8 | £14.60 to £23.36 | **£25** |
| 25 to 50      | 50.4 to 105 kg | 9 to 17 | £26.28 to £49.64 | **£50** |
| 50+           | 105 kg+     | 18+     | £52.56+ / pallet | No rate → invoice/enquiry |

### `24 Hour Delivery` (DPD next-day) - £6.54/parcel (kills the flat-rate leak)

The current flat **£6.54** is correct only for a single-parcel order (1 to 6 boxes). Above that
it bleeds badly: a 50-box next-day order is ~17 parcels = ~£111 of DPD, charged £6.54 today.

| Order (boxes) | Weight band | Parcels | Cost to us | Customer charge |
|---------------|-------------|---------|------------|-----------------|
| 1 to 6        | 0 to 12.6 kg | 1      | £6.54      | **£6.54** (unchanged) |
| 7 to 12       | 12.6 to 25.2 kg | 3 to 4 | £19.62 to £26.16 | **£26** |
| 13 to 24      | 25.2 to 50.4 kg | 5 to 8 | £32.70 to £52.32 | **£52** |
| 25+           | 50.4 kg+    | 9+      | £58.86+    | No next-day rate → use standard or invoice |

Notes:
- Shopify weight bands are entered as ranges (`0 to 12.6 kg`, `12.601 to 25.2 kg`, ...). The
  "boxes" column is just the human reading. Numbers above round customer charge up to roughly
  cover the worst case in each band; tune the round figures to taste (cover-cost vs absorb-some).
- The **top band intentionally has no card rate** so a genuinely huge order cannot self-checkout
  on a mispriced rate - it falls to the B2B enquiry / invoice path where freight (or a pallet) is
  set per order. If a hard block is too blunt, add a high catch-all instead.
- The 25 to 50 standard band covers the B2B card path (B2B tiers start at 25 and 50 boxes), so a
  club paying by card still gets sensible freight.

**International:** deferred by choice, not blocked - we have the full Evri international rate sheet
(`evri-bands-extract.csv`), so international could be banded too. But international bulk is rare and
tends toward customer-arranged freight forwarders (Synergy has no international pallet yet), so the
first pass is UK-only. Revisit once the UK table is proven.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Weight-band the global UK Shopify rates (Standard + next-day) | Not Started - ACTIVE |
| 2 | B2B invoice draft-order shipping line + manual pallet playbook | Not Started - ACTIVE |
| 3 | Consolidate B2B onto the funnel SKUs so it fulfils from Synergy | Future (committed next track) |

### Phase 1 - Weight-band the global UK rates (ACTIVE)

1. **Shopify config - UK Standard (`Express`) weight bands**
   - What: replace the flat free UK "Express" rate with the Evri weight-band table above (free to 12.6 kg, then £12 / £25 / £50, no rate above 105 kg).
   - Dependencies: none - costs are known (Evri £2.92/parcel, §3). Numbers may be tuned to taste.
   - Complexity: Small (Admin config).
   - Files: none (Shopify Settings > Shipping). Document final numbers in `docs/shipping/SHIPPING_AND_COURIERS.md`.

2. **Shopify config - UK next-day (`24 Hour Delivery` / DPD) weight bands**
   - What: replace the flat £6.54 "24 Hour Delivery" with the DPD weight-band table above (£6.54 to 6 boxes, then £26 / £52, no next-day rate above 50.4 kg); kills the bulk next-day leak.
   - Dependencies: none - DPD next-day £6.54/parcel known (§3).
   - Complexity: Small (Admin config).
   - Files: none.

3. **Verify against funnel + subscription SKUs**
   - What: confirm `BOTH-FUNNEL-168` (6 boxes / 12.6 kg) and all quarterly/sub bundles still land in the **free** band; confirm cart weights compute correctly from the 2.1 kg per-box weight on the funnel variants.
   - Dependencies: Phase 1.1.
   - Complexity: Small.
   - Files: check variant weights in Shopify (the 2 physical funnel boxes carry 2.1 kg; bundles must roll up correctly).

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

- **Weight accuracy is the real dependency** (not cost - costs are known). If any funnel/bundle variant has a wrong or missing weight in Shopify, the band assignment is wrong. Phase 1.3 guards this.
- **Card path above the top band blocks checkout** by design (no rate). If that frustrates legitimate buyers, swap the hard block for a high catch-all rate.
- **Banding is never exact.** Within a band the charge over/under-recovers at the edges (e.g. a 7-box order wrapped as one parcel costs £2.92 but sits in the £12 band). Accepted trade-off; these orders are rare.

## Open questions

- Above-top-band card behaviour: hard block (route to enquiry) vs high catch-all rate?
- Round-number tuning: cover worst-case cost in each band (as drafted) vs absorb some to stay customer-friendly?
- Phase 3 timing: when do we want B2B to actually move to Synergy?

## References

- `b2b-professionals-portal.md` - the B2B portal (outstanding items 3 + 4 are superseded by this plan)
- `synergy-3pl-integration.md` - Synergy economics + the funnel SKU fulfilment that Phase 3 consolidates onto
- `docs/shipping/SHIPPING_AND_COURIERS.md` - canonical shipping/courier working doc; final band numbers land here
- `app/api/b2b/invoice-order/route.ts` - draft-order creation (Phase 2.1)
- `app/lib/b2bVariants.ts` - B2B variant GIDs (Phase 3 re-point)
