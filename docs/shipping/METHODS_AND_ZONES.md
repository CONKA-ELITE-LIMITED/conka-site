# Methods and zones

Every Shopify shipping rate CONKA offers, by zone. Configured in Shopify Admin, Settings, Shipping.
Nothing in the codebase sets these, except the B2B invoice route, which copies the UK `Express`
bands (`app/lib/b2bShipping.ts`).

## How rates work

**Every rate does two jobs.** Its **name** tells Synergy which carrier to use
([`SYNERGY_ROUTING.md`](./SYNERGY_ROUTING.md)); its **price** is what the customer pays. So:

- A distinct carrier or service needs a distinct name.
- Price can vary freely under one name. `Express International` costs different amounts per zone
  and still means one carrier.

**Offering a choice** means two rates in the same zone, each uniquely named. Shopify shows every
eligible rate and the cheapest is the default. Frame the choice as speed or price, not as two
carriers. Only the UK offers a choice today.

## Weight bands

All banded rates use Shopify's **Weight** rate type, in grams.

- **1 box = 28 shots = 2,100 g.** Bundles: 56 = 4,200 g, 84 = 6,300 g, 168 = 12,600 g.
- **Shopify treats a band's maximum as exclusive**, so a cart exactly on a boundary falls into the
  higher band. Every maximum is set **1,050 g (half a box) above the true boundary**, which keeps
  exact box counts inside the intended band and tolerates a small add-on.
- **Band boundaries:** 1 box ≤3,150 · 2 boxes ≤5,250 · 3 boxes ≤7,350 · 4 to 6 boxes ≤13,650.
- **Variant weights must be set** for the bands to work. Any new variant needs its weight
  (boxes × 2.1 kg), per the variant process in `docs/features/SUBSCRIPTIONS.md`.

## UK

Weight-banded so freight scales with order size. The free band covers the largest normal order
(`BOTH-FUNNEL-168`, 6 boxes), so no subscriber or normal customer ever pays for `Express`.

### `Express` (Evri)

| Band (g) | Boxes | Price |
|---|---|---|
| 0 to 13,650 | 1 to 6 | **Free** |
| 13,650 to 26,250 | 7 to 12 | **£12** |
| 26,250 to 51,450 | 13 to 24 | **£25** |
| 51,450 to 106,050 | 25 to 50 | **£50** |
| 106,050 and up | 51+ | **£75** |

### `24 Hour Delivery` (DPD Next Day)

| Band (g) | Boxes | Price |
|---|---|---|
| 0 to 13,650 | 1 to 6 | **£6.54** |
| 13,650 to 26,250 | 7 to 12 | **£26** |
| 26,250 to 51,450 | 13 to 24 | **£52** |
| 51,450 and up | 25+ | **£110** |

Deliberate losses: the top of the free `Express` band, 4 to 6 box next-day orders, and the very
largest orders on both rates. Those belong on the B2B invoice path or a pallet
([`CARRIERS_AND_COSTS.md`](./CARRIERS_AND_COSTS.md)).

**A paid `24 Hour Delivery` upgrade covers the first order only** on a subscription. The contract
stores `Express`, so renewals revert to standard.

## Europe: `European Delivery`

DHL road, DDP: the customer pays duty and VAT at checkout and nothing on delivery
([`DUTIES_AND_DDP.md`](./DUTIES_AND_DDP.md)).

| Zone | Covers | 3 boxes (5,250 to 7,350 g) | 4 to 6 boxes (7,350 to 13,650 g) |
|---|---|---|---|
| `france` | France | £24 | £32 |
| `Europe` | Austria, Belgium, Czechia, Denmark, Finland, Germany, Ireland, Italy, Netherlands, Portugal, Spain | £26 | £41 |

**The intent is a 3-box minimum, so there is no band below 5,250 g.** DHL road costs the same for
one box as for four, so a single box loses money, and every monthly variant sits under that line.
The bands alone do not block a lighter cart (it still gets the lowest band), so the minimum is
enforced by a checkout validation rule: [`DUTIES_AND_DDP.md`](./DUTIES_AND_DDP.md#minimum-order-3-boxes).
Renewals bypass checkout either way, and a monthly European renewal loses about £20 each time.

`Europe` is one zone priced at a middle band. Cheap countries (Ireland, Netherlands, Germany) are
slightly over-charged and expensive ones (Italy, Spain, Portugal, Nordics) slightly
under-recover. Splitting it into near, mid and far zones is possible if it ever matters.

## USA: `Express International DHL`

DHL Express air, DDP, the same model as Europe.

| Zone | 3 boxes (5,250 to 7,350 g) | 4 to 6 boxes (7,350 to 13,650 g) |
|---|---|---|
| `USA` | £59 | £112 |

**3-box minimum**, enforced the same way as Europe (the checkout validation rule, not the bands).
DHL air costs us
roughly £99 for 3 boxes and £142 for 6 including the duty fee and fuel, so these prices run at
about a 10% margin on quarterly bundles. Evri DDP to the US would be materially cheaper if
Synergy can offer it. US customs and FDA rules: [`DUTIES_AND_DDP.md`](./DUTIES_AND_DDP.md).

## Rest of world: `Express International`

Evri, DAP: the customer pays import tax and a courier fee at the door.

| Zone | Covers | 1 box | 2 boxes | 3 boxes | 4 to 6 boxes |
|---|---|---|---|---|---|
| Middle East | UAE | £13 | £17 | £20 | £36 |
| Canada | Canada | £36 | £52 | £68 | £134 |
| Australia | Australia | £25 | £40 | £56 | £116 |
| New Zealand | New Zealand | £38 | £65 | £91 | £203 |
| Africa | South Africa | £42 | £60 | £77 | £151 |
| Caribbean | Bahamas, Cayman Islands | £57 | £78 | £99 | £188 |

Priced near the worst-country Evri cost per zone, so they never under-recover
(`data/evri-bands-extract.csv`).

**No rate above 13,650 g.** Evri's international parcel limit is 15 kg, so genuine bulk has no
self-checkout rate and is quoted case by case.

**Not banded:**
- **Channel Islands (Jersey):** flat £4.99, its own zone. A Channel Islands address labelled
  "United Kingdom" would pick up the wrong zone.

**Not shipped:** Cyprus, Greece, Malta, and any country without a zone. No zone means no rate, so
checkout fails.

## Verifying rates

Band prices are configured in **GBP**, but the Storefront API and checkout return shipping in the
customer's **presentment currency** where one is enabled (AUD, CAD, USD, BSD). A cart probe for
Australia shows AUD, not the GBP figure above, so convert before comparing. Zones without an
enabled presentment currency (South Africa) read in GBP.
