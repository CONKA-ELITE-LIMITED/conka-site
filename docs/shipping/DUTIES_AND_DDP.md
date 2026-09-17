# Duties and DDP

Who pays import tax on an international order, and the rules that decide how much. Why Europe
went DDP, the margins and the alternatives rejected:
`docs/development/featurePlans/archive/international-duties-and-ddp.md`.

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
import taxes at checkout** adds duty and VAT as their own lines, for a transaction fee. How it is
configured: [Shopify setup](#shopify-setup).

**Only enable collect-duties for a market once Synergy ship its method as DDP** (`European Delivery`
for the EU, `Express International DHL` for the USA). On while a parcel still ships DAP, the customer
pays at checkout and again at the door.

**Importer of record stays the customer.** DHL's DDP bills the shipper rather than moving the
declarant, and live DDP shipments name the customer as receiver. **We will not register for VAT in
France**: if DDP ever required CONKA as importer, we would revert to DAP or change carrier.

**Not Shopify Managed Markets.** It forces Managed Markets labels (DHL Express or FedEx only),
cannot use Synergy's carrier accounts, and makes Global-e merchant of record, which should be
assumed to break Skio. It is a different product from collect-duties.

## Shopify setup

**Duty collection is set per market, not per country or shipping zone** (Settings, Taxes and
duties, Duties and import taxes). So the Markets structure decides which countries pay duty at
checkout, and it must line up exactly with the countries whose shipping rate is a DDP method.

### Markets

| Market | Countries | Parent | Duties at checkout | Catalog |
|---|---|---|---|---|
| `france` | France | Store default | **On** | Its own, `france` |
| `Europe` | The `Europe` shipping zone's countries | `International` | **On**, customised | Inherited from `International` |
| `United States` | USA | Store default | **On** | Inherited, `International` |
| `International` | Every other shipped country, plus Europe's (see below) | Store default | Off | `International` |
| `United Kingdom`, `Caribbean` | | Store default | Off | |

- **Europe's countries are listed in both `Europe` and `International`. This is correct.** A
  sub-market sits inside its parent, and checkout applies the most specific market, so a German
  customer gets Europe's duty setting. Confirmed with Shopify support, Sept 2026. Do not remove
  them from International. Europe's duties setting must show under **Customized**, not Inherited,
  or International's (off) applies.
- **`france` stays standalone** because it has its own catalog. Under Europe it would inherit the
  International catalog as well, which could change French prices or product availability.
- **`United States` is standalone.** A market created with Store default as its parent does not
  take its country out of International automatically; the USA was removed from International by
  hand. Both shapes work; the difference is only how each market was created.

### Settings on every DDP market

| Setting | Value | Why |
|---|---|---|
| Duties and import tax | Collecting | |
| Duty display | Show as line item | |
| Tax display | **Show as line item** | Destination VAT is added **on top** of the price. "Show as included" takes it out of our price instead, and "Dynamic tax display" re-prices by region |
| Sales tax | Not collecting | Collecting sales tax means registering for tax in that country, which we do not do |

At checkout the customer sees the product at its normal price, shipping, a **Duties** line and a
**Taxes** line. Taxes is destination VAT on product, shipping and duty together (20% France, 19%
Germany). The USA shows Duties only. Nothing is charged on delivery.

### Adding a country to DDP

1. **Synergy first.** Its shipping method must ship DDP ([`SYNERGY_ROUTING.md`](./SYNERGY_ROUTING.md)).
   Get confirmation it is live before step 4.
2. **Shipping:** the country sits in a zone whose rate is a DDP method name.
3. **Markets:** add the country to an existing DDP market (for a European country, `Europe`), or
   create one. A new market copies International's currency and catalog so prices do not move; if
   Shopify gives it Store default as parent, remove the country from International by hand.
4. **Taxes and duties** on that market: duties on, both displays Show as line item, sales tax left
   alone. Save.
5. **Test checkout, stopping before payment:** an address in the country shows the DDP method, a
   Duties line and (for VAT countries) a Taxes line. A DAP country (Canada) still shows no Duties.

### Gotchas

- **The Taxes and duties regions list is not duty collection.** Setting up a region there (for
  example "European Union") registers CONKA to collect VAT as the seller and asks for an OSS or
  IOSS number. Leave it alone; import VAT arrives through Duties and import taxes.
- **Subscription renewals collect no duty or VAT.** Shopify calculates duties only at checkout, and
  Skio creates renewal orders outside it. On every DDP renewal the duty and VAT are our cost. The
  checkout's "Recurring subtotal" is the product price only.
- **The duties preview in admin uses dummy figures.** Prove a change with a real test checkout.
- **Weight bands do not enforce the 3-box minimum.** A lighter cart checks out at the lowest band:
  SCRUM-1364.

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

## Prices and VAT outside the UK

"Include sales tax in product price and shipping rate" is **on** store-wide, at 20%. **Leave it on**:
it is what keeps UK prices VAT-inclusive.

- **DDP markets:** the product shows at the same price as in the UK (converted), and destination VAT
  is **added on top** as a Taxes line. A European customer pays more than a UK customer for the same
  cart, and we keep the full product price. This is the Tax display setting in
  [Shopify setup](#shopify-setup).
- **DAP markets:** the same price as the UK at checkout; import VAT is paid at the door.

## USA

**US orders ship DDP on `Express International DHL`**, with duties collected at checkout. The $800 de
minimis is suspended, so every parcel needs a formal or informal entry. DDP settles who pays, but two
US rules apply regardless:

- **FDA Prior Notice.** Supplements are regulated as food. A Prior Notice, including the
  manufacturer's FDA registration number, must be filed for every shipment. No notice means refused
  entry.
- **Tariff.** No UK-US zero-rate deal, and the legal basis for the baseline tariff has been in flux.
  Verify the rate in force before pricing.
