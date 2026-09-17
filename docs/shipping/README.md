# Shipping

How CONKA orders get from Synergy's warehouse to the customer: the Shopify shipping methods a
customer can pick, how Synergy turns a method name into a carrier, what happens at customs, and
what it all costs us.

**Status of any open shipping work lives in Jira, not here.** Current ticket: SCRUM-1340
(shipping methods on international subscription contracts).

## Live shipping methods

The method **name** is the routing instruction to Synergy, so these names are exact.

| Method | Zones | Carrier and service | Terms of sale | Customer price |
|---|---|---|---|---|
| `Express` | UK | Evri, 48hr standard | n/a | Free to 6 boxes, then weight-banded |
| `24 Hour Delivery` | UK | DPD Next Day | n/a | £6.54 to 6 boxes, then weight-banded |
| `European Delivery` | `Europe` (11 countries), `france` | DHL Economy Select (road) | **DDP** | 3 to 6 box bands. France £24 / £32, Europe £26 / £41 |
| `Express International DHL` | USA | DHL Express (air) | **DDP** | 3 to 6 box bands. £59 / £112 |
| `Express International` | Middle East, Canada, Australia, New Zealand, Africa, Caribbean, Channel Islands | Evri International | **DAP** | Weight-banded per zone to 6 boxes. Channel Islands flat £4.99 |

Band tables per zone: [`METHODS_AND_ZONES.md`](./METHODS_AND_ZONES.md).

## The docs

| Doc | Read it for |
|---|---|
| [`METHODS_AND_ZONES.md`](./METHODS_AND_ZONES.md) | Shopify zones, weight bands and prices, how bands are entered, which countries we do not ship to |
| [`SYNERGY_ROUTING.md`](./SYNERGY_ROUTING.md) | Why the method name is everything, the Synergy mapping sheet, subscription renewals, connector rules |
| [`DUTIES_AND_DDP.md`](./DUTIES_AND_DDP.md) | DDP vs DAP, who pays import tax, the Shopify markets and duty settings (and how to add a country), EU and France rules, HS codes, the USA blockers |
| [`CARRIERS_AND_COSTS.md`](./CARRIERS_AND_COSTS.md) | Evri, DPD, DHL and EFM costs to us, packing model, bulk and pallet orders |
| [`data/`](./data/) | Source rate cards: Evri international, DHL air and road, EFM pallets |

## Five rules that bite

1. **Synergy routes on the method name only.** Rename a rate and orders are held as "Invalid
   Dispatch Method" until Synergy map the new name.
2. **A subscription renewal ships on the method stored on its contract**, not on a rate picked at
   billing. See [`SYNERGY_ROUTING.md`](./SYNERGY_ROUTING.md).
3. **Europe and the USA are DDP, everywhere else overseas is DAP.** DDP customers pay duty and VAT
   at checkout; a DAP customer pays import tax and a courier fee at the door. Duty collection is
   set per Shopify market, so markets must match the DDP methods
   ([`DUTIES_AND_DDP.md`](./DUTIES_AND_DDP.md#shopify-setup)).
4. **No self-checkout rate above 6 boxes internationally, and a 3-box minimum to Europe and the
   USA.** The minimum is a BoomGate checkout validation rule, not the weight bands
   ([`DUTIES_AND_DDP.md`](./DUTIES_AND_DDP.md#minimum-order-3-boxes)).
5. **Never change a delivery price while fixing a method name** on a subscription contract.

## Related

- The international DDP rationale, options rejected and margins: `docs/development/featurePlans/archive/international-duties-and-ddp.md`
- The UK weight-banding rationale: `docs/development/featurePlans/order-size-shipping-tiers.md`
- B2B invoice orders and their shipping line: `docs/features/b2b/B2B_PORTAL.md`
- Subscriptions (Skio): `docs/features/SUBSCRIPTIONS.md`
- Fulfilment cost in the margin model: `docs/ops/README.md`
