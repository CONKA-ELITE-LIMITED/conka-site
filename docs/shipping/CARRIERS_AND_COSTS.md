# Carriers and costs

What each carrier costs us, how orders are packed, and how bulk orders ship. Customer prices are
in [`METHODS_AND_ZONES.md`](./METHODS_AND_ZONES.md). Carrier surcharges (refused parcel, address
change, fuel, peak) pass through from Synergy at cost and cannot be pre-quoted.

## Packing model

- **1 box = 28 shots = 2.1 kg.** Up to **3 boxes case into one outer carton** that ships as one
  parcel, so **cartons = ceil(boxes ÷ 3)**.
- **Retail orders up to 6 boxes** (12.6 kg) ship as one wrapped parcel on one label at the combined
  weight, inside Evri's parcel limit.
- **B2B bulk** ships as multiple master cartons (3 boxes, 6.3 kg each), one label per carton, or on a
  pallet. We charge one shipping fee; Synergy bills us per parcel.
- **Volumetric weight** is the higher of actual and L×W×H cm ÷ 5000. Box dimensions have not been
  checked, so bulky cartons would cost more than these figures.

## Evri (UK `Express`, international `Express International`)

**UK, per parcel:**

| Service | Cost |
|---|---|
| 48hr, 0 to 3 kg (1 box) | £2.25 |
| 48hr, 3 to 15 kg (2 to 6 boxes) | **£2.92** |
| 24hr, 0 to 15 kg | £3.48 |
| 48hr large parcel, 15 kg+ | £8.73 |
| Northern Ireland, 0 to 15 kg | £3.17 |
| Scottish Highlands and Islands, Isle of Man, Isle of Wight | £4.37 |
| Channel Islands | £5.17 |

Proof-of-delivery variants cost about 13p more.

**International:** the Evri international rate card is `data/evri-international-rates-2026.csv`
(225 destinations). `data/evri-bands-extract.csv` pulls out cost at the billed weight for 1, 2, 3 and
6 boxes. We use the **duty-unpaid (DDU) commercial service**, which is the true cost under DAP.
Real weight rounds up to the next rate column:

| Order | Real weight | Billed at |
|---|---|---|
| 1 box | 2.1 kg | 2.5 kg |
| 2 boxes | 4.2 kg | 4.5 kg |
| 3 boxes | 6.3 kg | 6.5 kg |
| 6 boxes | 12.6 kg | 15 kg |

Evri's own DDP to the EU is an IOSS service covering VAT only under €150, so it is not a substitute
for DHL DDP. Evri once failed to produce a label for a France order.

## DPD (UK `24 Hour Delivery`)

| Service | Cost |
|---|---|
| Two Day, mainland | £5.34 |
| **Next Day, mainland** | **£6.54** |
| Before 12 | £11.11 |
| Before 10:30 | £15.87 |
| Saturday or Sunday | £11.11 |

Chosen over Evri's cheaper 24hr service for a more premium next-day experience.

## DHL (`European Delivery`, `Express International DHL`)

Rate card: `data/dhl-air-and-road-rates-2026.xlsx` (Synergy's DHL account).

- **Road is flat to 10 kg.** One box to France costs the same as three, which is why Europe has a
  3-box minimum.
- **Air** improves relatively at 6 boxes.
- **On top of freight:** the **Duty Tax Paid fee**, 2% of fiscal charges with a £16 minimum, so
  effectively £16 per international parcel at our order values; and a **fuel surcharge** set monthly
  (jet fuel index for air, diesel for road) that applies to freight and to the DTP fee. Whether the
  card's freight figures already include fuel is unverified.
- Per-lane freight and the margin maths: `docs/development/featurePlans/archive/international-duties-and-ddp.md`.

## Bulk orders and pallets

**A pallet only pays above about 60 boxes** in the UK. Master-carton parcels at £2.92 each win below
that:

| Order | Cartons | Parcels at £2.92 | UK mainland pallet |
|---|---|---|---|
| 10 boxes | 4 | ~£12 | £61 to £90 |
| 50 boxes | 17 | ~£50 | £61 to £90 |
| 60 boxes | 20 | ~£58 | £61 to £90 |
| 75 boxes | 25 | ~£73 | £61 to £90 |

**EFM** is Synergy's UK pallet carrier (1 to 2 day), priced **per pallet by postcode zone** regardless
of fill: £60.82 nearest the warehouse, £61 to £90 for most of the mainland, £88 to £175 for the
Scottish Highlands and islands (`data/efm-pallet-rate-card.csv`). Beyond 60 boxes it is still a
judgement call: parcel count, damage risk, or a customer wanting one delivery.

**International bulk has no pallet option.** EFM is UK-only and Synergy has no international freight.
The customer arranges their own freight forwarder to collect from Synergy; tell the Synergy Client
Manager the collection date. Quote case by case.

### Manual pallet playbook (UK B2B invoice orders)

Invoice orders arrive with an `Express` line priced from the UK bands (`app/lib/b2bShipping.ts`), so a
51+ box order carries the £75 top band. When a pallet is the better call:

1. **Edit the draft order** in Shopify Admin: replace the shipping line with a custom rate titled
   `Pallet`, priced from the EFM card by postcode zone.
2. **Resend the invoice** so the buyer sees the updated total. The hosted invoice always shows the
   current draft, so a stale total cannot be paid after a resend.
3. **First pallet only:** ask Synergy to map `Pallet` to EFM and add it to the mapping sheet in
   [`SYNERGY_ROUTING.md`](./SYNERGY_ROUTING.md).

**International invoice orders:** the draft is created before the buyer enters an address, so it
always prices on UK bands and Shopify does not recalculate it. For a non-UK buyer, edit the draft:
retitle the line `Express International` at the zone price (6 boxes or fewer) or quote freight for
bulk, then resend. VAT also needs a manual check, since the portal assumes UK 20%.
