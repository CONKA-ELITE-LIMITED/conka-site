# Duties and DDP

Who pays import tax on an international order, and the rules that decide how much. Why Europe
went DDP and the alternatives rejected: `docs/development/featurePlans/international-duties-and-ddp.md`
(SCRUM-1204).

## DDP vs DAP

| | DDP (delivered duty paid) | DAP (delivered at place) |
|---|---|---|
| Who pays duty and VAT | **Customer at checkout**, we settle with the carrier | **Customer on the doorstep** |
| Doorstep bill | None | Tax plus a courier handling fee (often the larger part) |
| Used for | `European Delivery`, `Express International DHL` (USA) | `Express International` (all other overseas zones) |

Terms of sale are set per method at Synergy ([`SYNERGY_ROUTING.md`](./SYNERGY_ROUTING.md)).

**Under DDP, destination VAT must be collected from the customer at checkout.** We are not
VAT-registered in France or the EU, so VAT paid on the customer's behalf is not reclaimable. If it
is not collected, it is £20 to £60 of dead cost per European order. Shopify's **collect duties and
import taxes at checkout** adds it as its own line (0.85% fee on Shopify Payments).

**Only enable collect-duties for a market once Synergy ship its method as DDP** (`European Delivery`
for the EU, `Express International DHL` for the USA). On while a parcel still ships DAP, the customer
pays at checkout and again at the door. Status: SCRUM-1204.

**Importer of record stays the customer.** DHL's DDP bills the shipper rather than moving the
declarant, and live DDP shipments name the customer as receiver. **We will not register for VAT in
France**: if DDP ever required CONKA as importer, we would revert to DAP or change carrier.

**Not Shopify Managed Markets.** It forces Managed Markets labels (DHL Express or FedEx only),
cannot use Synergy's carrier accounts, and makes Global-e merchant of record, which should be
assumed to break Skio. It is a different product from collect-duties.

## EU rules

| What | Detail |
|---|---|
| €150 duty exemption | **Abolished.** Every parcel attracts duty |
| Replacement flat duty | **€3 per tariff line** on consignments ≤€150 intrinsic value, until normal rates apply from 1 Jul 2028 |
| Item-level declaration | Required on every B2C consignment |
| IOSS | Still covers **VAT** on ≤€150. Does not cover duty |

- **Intrinsic value excludes shipping** when shown separately. **VAT is charged on goods plus
  shipping** (what the customer paid), so raising the shipping price raises the VAT base too.
- **H7 vs H1.** Sub-€150 parcels clear on the simplified H7 declaration, which cannot carry
  preferential origin, so the UK-origin 0% rate cannot be claimed and the €3 flat applies. Only an
  H1 declaration (above €150) can claim 0%.
- **Customs value is the transaction value**, the price actually paid, never list price and never our
  cost. Declaring cost is undervaluation. Synergy's integration reads the value from our data.

### France, on top

A temporary **€2 per HS code** national parcel tax on sub-€150 parcels cleared on H7, until an
EU-wide fee replaces it.

## HS codes and origin

- **One code covers every product: `210690`**, country of origin `GB`. An HS code classifies what the
  product is (a liquid food supplement), not the SKU, so pack size and bundles do not change it. The
  EU extends it to 8 digits at their end. If ever challenged, it will be chapter 21 vs 22 (beverages);
  get a broker's opinion.
- **Set both on every sellable variant**, not just the store default, since Synergy's pull is
  variant-level. They live on `InventoryItem` and need `write_inventory`, which the repo's Admin
  token does not have, so set them in the admin bulk editor.
- HS codes decide the tariff and gate collect-duties. They do **not** reduce VAT, and the €3 flat
  applies regardless of classification.

## UK VAT on EU orders

"Include sales tax in product price and shipping rate" is **on**, at 20%. A French customer pays the
same £39.99 as a UK customer, and the export zero-rating stays with us as margin rather than being
passed on as a lower price. **Leave it on**: dropping EU prices 20% while taking on import costs
would be perverse. Whether EU sales are zero-rated on the UK VAT return is a question for the
accountant.

## USA

**US orders ship DDP on `Express International DHL`**, with duties collected at checkout. The $800 de
minimis is suspended, so every parcel needs a formal or informal entry. DDP settles who pays, but two
US rules apply regardless:

- **FDA Prior Notice.** Supplements are regulated as food. A Prior Notice, including the
  manufacturer's FDA registration number, must be filed for every shipment. No notice means refused
  entry.
- **Tariff.** No UK-US zero-rate deal, and the legal basis for the baseline tariff has been in flux.
  Verify the rate in force before pricing.
