# Shipping & Courier Services

**Status:** Working draft. Lives alongside the Synergy 3PL plan
(`docs/development/featurePlans/synergy-3pl-integration.md`) during active config;
to be formalised into a standalone feature doc once the Shopify shipping setup is
live and verified.
**Owner:** Rudh (Shopify config) with Humphrey (carrier/ops decisions).
**Last updated:** 2026-06-11.

---

## 1. The model — how Shopify shipping maps to Synergy

Checkout is Shopify-hosted; Synergy fulfils the 3 funnel products. The link between
them is the **shipping method name**.

**Every Shopify shipping rate does two jobs at once:**
- its **name** is the instruction to Synergy — *which carrier/service to ship with*;
- its **price** is what the customer pays.

**Synergy maps purely on the shipping-method NAME.** Not the destination country, not
the price. Country + weight are used only to calculate how Synergy *invoices us*, never
to decide the carrier.

Two rules fall out of this:
1. **A unique carrier/service needs a unique method name.** If two options share a
   name, Synergy can't tell them apart.
2. **Price can vary freely under one name.** The same name (e.g. `Express International`)
   can cost £12 to Europe and £40 to Rest of World — Synergy ignores the price, so one
   name still means one carrier.

---

## 2. Carrier choice at checkout

To offer the customer a choice of carrier/speed, put **two (or more) rates in the same
zone**. Shopify shows every eligible rate at checkout; the customer picks one; the
cheapest is the effective default.

- Each option **must have a unique name** (rule 1 above) so Synergy routes each correctly.
- Customers choose on **speed or price**, so frame the choice that way
  (e.g. "Standard" vs "Express") rather than as two same-speed carriers.

Examples:
- **UK:** `Express` (Evri, free) + `24 Hour Delivery` (DPD, paid) → customer picks.
- **International:** `Express International` (Evri) + `International Priority` (DHL, dearer)
  → customer picks. *(DHL option is a fast-follow — see §4.)*

---

## 3. UK shipping — weight-banded (SCRUM-1079, live 2026-06-11)

Both UK rates are **weight-banded** so freight scales with order size. The flat rates
(Express free, 24 Hour Delivery flat £6.54) were priced for a 1–3 box order and leaked
badly on bulk; the leak is order-size-driven, not channel-driven (a DTC 8-box order
leaks like a 50-box club). Plan + rationale: `docs/development/featurePlans/order-size-shipping-tiers.md`.

**How to read these tables.** 1 box = 28 shots = **2.1 kg = 2,100 g**. Up to 3 boxes case
into **1 outer carton** that ships as a single parcel, so **cartons shipped = ceil(boxes ÷ 3)**.
Carrier cost ≈ cartons × carriage rate (Evri £2.92/parcel, DPD £6.54/parcel; §3 cards below).
Each band is entered in Shopify as a **Weight** rate-type tier (in grams). Shopify treats a
tier's **maximum as exclusive** (a cart exactly on a boundary falls into the higher band), so
every maximum is set **+1,050 g (half a box) above the true boundary** — this keeps exact
box-counts (6/12/24/50) inside the intended band and tolerates a small mixed-cart add-on
without losing the band. Rate **names are unchanged** (`Express`, `24 Hour Delivery`) because
Synergy maps on name only.

### `Express` (Evri) — UK standard

| Weight band (g) | Weight band (kg) | Price | Boxes | Cartons shipped | Our Evri cost |
|---|---|---|---|---|---|
| 0 – 13,650 | 0 – 13.65 | **Free** | 1 to 6 | 1 to 2 | £2.92 – £5.84 |
| 13,650 – 26,250 | 13.65 – 26.25 | **£12** | 7 to 12 | 3 to 4 | £8.76 – £11.68 |
| 26,250 – 51,450 | 26.25 – 51.45 | **£25** | 13 to 24 | 5 to 8 | £14.60 – £23.36 |
| 51,450 – 106,050 | 51.45 – 106.05 | **£50** | 25 to 50 | 9 to 17 | £26.28 – £49.64 |
| 106,050 – No limit | 106.05+ | **£75** | 51+ | 17+ | £49.64+ |

### `24 Hour Delivery` (DPD) — UK next-day

| Weight band (g) | Weight band (kg) | Price | Boxes | Cartons shipped | Our DPD cost |
|---|---|---|---|---|---|
| 0 – 13,650 | 0 – 13.65 | **£6.54** | 1 to 6 | 1 to 2 | £6.54 – £13.08 |
| 13,650 – 26,250 | 13.65 – 26.25 | **£26** | 7 to 12 | 3 to 4 | £19.62 – £26.16 |
| 26,250 – 51,450 | 26.25 – 51.45 | **£52** | 13 to 24 | 5 to 8 | £32.70 – £52.32 |
| 51,450 – No limit | 51.45+ | **£110** | 25+ | 9+ | £58.86+ |

Notes:
- **Free band covers up to the quarterly bundle** (`BOTH-FUNNEL-168` = 6 boxes = 12,600 g),
  so no subscriber or normal order ever pays. The 6-box top of the free band costs us up to
  £5.84 (2 cartons) — eaten deliberately to protect the free-shipping promise.
- **24 Hour Delivery loses a little on 4–6 box orders** (2 cartons = £13.08 DPD, charged
  £6.54): intentional, to keep the common 1–3 box next-day price unchanged at break-even.
- **Both top bands under-recover past ~75 boxes (Express) / the largest next-day orders** by
  design — those belong on the B2B invoice path or a manual pallet line (a pallet only beats
  parcels above ~60 boxes).

**Carrier carriage cards (cost to us, from the Synergy cards):**

*Evri UK ("safe place" / POD):* 48hr 0–3kg (1 box) £2.25/£2.38 · 48hr 3–15kg (2–6 boxes)
£2.92/£3.05 · 24hr 0–15kg £3.48/£3.61 · 48hr Large parcel 15kg+ £8.73/£8.86 · Northern
Ireland 0–15kg £3.17/£3.30 · Scottish H&I / IoM / IoW £4.37/£4.50 · Channel Islands £5.17/£5.30.

*DPD UK:* Two Day Mainland £5.34 · **Next Day Mainland £6.54** · Before 12 £11.11 · Before
10:30 £15.87 · Saturday £11.11 · Sunday £11.11.

**DECIDED (2026-06-10): `24 Hour Delivery` = DPD Next Day** (Evri's own 24hr at £3.48 was
cheaper but DPD chosen for the more premium next-day service). The flat £6.54 became the
1–6 box base band on 2026-06-11.

---

## 4. International shipping

**Approach: keep the existing ~10 Shopify zones and tune the prices** (rather than
collapse to a few). Synergy maps on the rate name, not the zone count, so granular zones
are free — every international rate is just named `Express International` (Evri) and the
price varies per zone. Prices set to cover the Evri cost of a 1–2 box order (the common
case); the rare heavy bundle to a far zone is a knowingly accepted small loss.

| Zone (Shopify) | Covers | Final price | Note |
|---|---|---|---|
| Europe | Germany, Italy, Portugal, Spain, Ireland, Netherlands, Austria, Belgium, Czechia, Denmark, Finland (11) | **£14.40** | keep — all under cost at 1–2 box |
| france | France | **£10.10** | keep |
| Middle East | UAE | **£19.00** | keep (healthy margin) |
| Caribbean | Bahamas, Cayman Islands | **£41.49** | keep |
| USA | United States | **£22.00** | split from Canada |
| Canada | Canada | **£36.00** | **new zone** — split out (cost £35.80/box) |
| Australia | Australia | **£28.00** | raised from £24.97 |
| New Zealand | New Zealand | **£33.94 → £38.00** | raised (cost £37.92/box) |
| Africa | South Africa | **£35.43 → £42.00** | raised (cost £41.67/box) |
| Channel Islands | Jersey | **£4.99** | keep price; **rename rate to `Express International`** |

**Not currently shipped** (in no zone): Cyprus, Greece, Malta, and anywhere not listed
above. Add to a zone if/when wanted.

**Maintenance:** if a zone's cost outgrows its fee, edit the one number.

**DHL upgrade (fast-follow, not at launch):** a second international option,
`International Priority` (DHL), added as a paid upgrade per zone. Needs DHL cost data
(not yet supplied) and the customer-facing name finalising. Not used by the Synergy test
orders, so it does not gate go-live.

**Incoterms = DAP** (customer pays any import duty on arrival) on the single
`Express International` method. Note: Evri's EU rates above are its *duty-paid (DDP)*
service, which is cheaper and avoids surprise customer duty bills — so a future
refinement is to split Europe into its own DDP-named method (matches Synergy's template).
Optimisation, not a launch blocker.

---

## 5. Target Shopify rate table (launch state)

**UK zone (done):**
| Rate name | Carrier | Price |
|---|---|---|
| `Express` | Evri | Free |
| `24 Hour Delivery` | DPD | £6.54 |

**International zones:** keep the existing ~10 zones, all rates named `Express International`
(Evri), prices per the §4 table. *(Fast-follow: add `International Priority` (DHL) as a
second rate per intl zone for the upgrade option.)*

**Steps in Shopify (Settings → Shipping):**
1. Names: every international rate = `Express International` exactly (rename the Channel
   Islands one). UK = `Express` + `24 Hour Delivery`. This is what drives Synergy routing.
2. Prices: apply the §4 changes — raise Africa (£42), Australia (£28), NZ (£38); split
   Canada into its own zone (£36, USA stays £22); leave the rest.

**Test-order readiness:** the 3 Synergy test orders only use `Express`,
`24 Hour Delivery`, `Express International` — all already exist, so testing is not blocked
by the price/zone work.

---

## 6. Synergy mapping sheet

Synergy maps each method name to a carrier + service. Current sheet (3 rows — covers all
test orders):

```
Shipping Method      | Carrier | Service      | Market | INCOTERMS
Express              | Evri    | Standard     | UK     | n/a
24 Hour Delivery     | DPD     | Next Day     | UK     | n/a
Express International | Evri    | International | ROW    | DAP
```

Added later as features land:
- `International Priority` | DHL | Express | ROW | DAP  — the DHL upgrade.
- `Pallet` (or similar) | [pallet carrier] | [service] | [market] | [incoterm]  — bulk/B2B (see §7).

---

## 7. Large / bulk orders & pallets

**Packing model (confirmed with Synergy):**
- **Retail orders (any funnel SKU, up to 168 = 6 boxes)** ship as **one wrapped parcel,
  one label, at the combined weight** (28=2.1kg, 56=4.2kg, 84=6.3kg, 168=12.6kg). 12.6kg
  is within Evri's parcel limit, so even the biggest retail order is a single parcel — the
  combined-weight Evri rate applies (this is why a 168 to a far zone is genuinely
  expensive; see §4).
- **B2B bulk orders cannot be consolidated into one parcel.** Boxes are cased in a
  **master carton of 3 Conka boxes = 6.3kg**. A large order is therefore either put **on a
  pallet**, or shipped as **multiple parcels — one label per master carton** (each 6.3kg).

| Tier | Size | How it ships |
|---|---|---|
| Retail parcel | 1–6 boxes (≤12.6kg) | single wrapped parcel, one label, combined weight |
| B2B multi-parcel | below the pallet line | N parcels, one label per master carton (3 boxes / 6.3kg) |
| **Pallet / freight** | **~60+ boxes (cost crossover)** | EFM pallet network (UK) — see economics below |

### Pallet economics (EFM rate card, supplied by Synergy 2026-06-10)

EFM is Synergy's UK domestic pallet carrier (1-2 day). Rate is **per pallet, by UK postcode
zone, regardless of how full it is**: cheapest **£60.82** (zone 1, near their Northampton
warehouse), most mainland **£61-90**, Scottish Highlands/islands **£88-175**.
(`docs/shipping/EFMRateCard.xlsx.csv`.)

Compare to shipping the same order as **master-carton parcels** (3 boxes / 6.3kg each, the
3-15kg Evri band = **£2.92/carton**):

| Order | Cartons | Parcel cost @ £2.92 | UK mainland pallet | Cheaper |
|---|---|---|---|---|
| 10 boxes | 4 | ~£12 | £61-90 | **parcels (5×)** |
| 30 boxes | 10 | ~£29 | £61-90 | **parcels** |
| 50 boxes | 17 | ~£50 | £61-90 | **parcels** |
| 60 boxes | 20 | ~£58 | £61-90 | ~level |
| 75 boxes | 25 | ~£73 | £61-90 | pallet |

**Conclusion: a pallet doesn't pay until ~60+ boxes (UK mainland).** These boxes are light
enough that parcels win on cost almost always. The earlier 10-box threshold was far too low
(at 10 boxes a pallet ships ~£12 of parcels for £60). **Revised line: ~60 boxes, or a
judgement call** (too many parcels to handle, damage risk, customer wants one delivery).

**International bulk:** EFM is **UK-only**, so there is **no international pallet rate yet**.
International *parcel* cost per carton is steep and varies hugely (Europe ~£11, USA £32,
Australia £56, Canada £67, NZ £91 — the 6.5kg band of the Evri intl sheet), so a 10-box US
order is ~£115 in parcels. Because intl parcels are so dear, an intl pallet could pay off at
a *lower* box count than the UK — but we lack the freight rate. **Action: ask Synergy if they
do international freight + rates; until then quote international bulk case-by-case.**

**How Synergy handles the multiple labels:** their warehouse packs the order into N cartons
and generates N labels itself, all under the **one shipping method name** on the order. We
set a single method; they decide the parcel count. Consequence: we charge the customer **one**
shipping fee but Synergy bills us **per parcel**, so a multi-carton order costs more than the
fee collected (absorb on B2B, or add a cost on the big ones).

Pallets are therefore **rare** — only genuine bulk B2B (~60+ boxes UK). Mechanism: a
uniquely-named `Pallet` method → mapped to EFM on the Synergy sheet, used only when needed.

**The B2B wrinkle:** B2B orders are created as **draft orders with no shipping line**
(`app/api/b2b/invoice-order/route.ts` sets line items, discount, tags — but no
`shippingLine`). So a pallet order currently reaches Synergy with a *blank* method →
Synergy can't route it. Two ways to add the pallet line:
- **Manual (interim, zero build):** Harry adds a `Pallet` shipping line + cost to the
  draft order before sending the invoice. Works now for low volume.
- **Automated (a build):** the invoice-order route appends
  `shippingLine: { title: "Pallet", price }` when the box count exceeds a threshold.

**Open questions — RESOLVED (Bethany, 2026-06-10):**

For **Synergy / Bethany**:
1. Carton/parcel logic — **CONFIRMED.** 3 × 28-shot boxes per master carton (~6.3kg) → one
   label in the 3-15kg Evri band (~£3), bulk ships cheapest as multiple cartons until ~60 boxes.
2. Per-parcel pick/handling fee — **none from Synergy** beyond standard inbound/picking/contracted
   charges. Carrier surcharges (refused parcel, address change, Middle East fuel, peak) pass
   through **at cost** and can't be pre-quoted.
3. International freight/pallet — **no Synergy international pallet yet.** Customers arrange their
   own freight forwarder (Europa, Kuehne+Nagel) to collect; notify the Client Manager the
   collection date. Khalil is building a solution, nothing live.

For **CONKA / Harry**:
4. Fulfilment of B2B / large orders — **decision: Synergy** (B2B is the same physical box as the
   funnel SKUs, so consolidate B2B onto the funnel SKUs rather than re-onboard). Tracked as Phase 3
   of `order-size-shipping-tiers.md`.
5. What B2B pays for shipping — **resolved via weight-banded tiers**, not a B2B carve-out (the
   mispricing is order-size-driven; a DTC 8-box buyer leaks the same as a 50-box club). See the
   plan + first-pass band table in `docs/development/featurePlans/order-size-shipping-tiers.md`.

**Plan of record (SCOPED 2026-06-10 → `order-size-shipping-tiers.md`):** weight-band the global
Shopify rates so freight scales with order size for everyone (free to 6 boxes / 12.6kg, then
banded), add a shipping line to the B2B invoice draft order in code, keep parcels-by-default with
the pallet only ~60+ boxes UK (manual draft-order line), and consolidate B2B onto the funnel SKUs
so it fulfils from Synergy. International bulk quoted case-by-case until freight rates exist.

---

## 8. Cost reference data

- **Evri international rates 2026:** `docs/shipping/EvriInternationalRates2026.xlsx.csv`
  (full sheet, 225 destinations, weights in 0.25kg steps to 2kg then 0.5kg).
- **Extracted bands** (cost at 1/2/3/6 box billed weights, all destinations):
  `docs/shipping/evri-bands-extract.csv`.
- **Evri UK + DPD UK carriage cards:** in §3 (from Synergy's UK carriage-fee screenshots).
- **DHL international:** not yet supplied (needed for the `International Priority` upgrade).

**Billed-weight bands** (real box weight rounds up to the next rate column):

| Order | Real weight | Billed band |
|---|---|---|
| 1 box (28) | 2.1 kg | 2.50 kg |
| 2 box (Both 56) | 4.2 kg | 4.50 kg |
| 3 box (84) | 6.3 kg | 6.50 kg |
| 6 box (Both 168) | 12.6 kg | 15.00 kg |

---

## 9. Open decisions / TODO

- [x] **Next-day UK carrier:** DECIDED — DPD Next Day at £6.54. §3.
- [x] **UK zone:** Express (free) + 24 Hour Delivery (£6.54) — done.
- [ ] **Apply international price changes in place:** Africa £42, Australia £28, NZ £38,
      split Canada (£36) from USA (£22); rename Channel Islands rate → `Express International`. §4/§5.
- [ ] **DHL upgrade:** obtain DHL intl costs, finalise `International Priority` name + per-zone
      prices, decide launch timing. §4.
- [x] **Pallet tier / B2B shipping:** ops answers received (Bethany 10 Jun); scoped into
      `docs/development/featurePlans/order-size-shipping-tiers.md` (weight-banded global rates +
      B2B invoice shipping line + Synergy consolidation). §7.
- [ ] **EU DDP split** (optimisation): split Europe into its own duty-paid method. §4.
- [ ] **Bundle variant weights** in Shopify (84=6.3kg, 56=4.2kg, 168=12.6kg) — needed if/when
      any rate is weight-banded. (28-box already 2.1kg.)
