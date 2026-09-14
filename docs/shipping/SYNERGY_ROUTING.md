# Synergy routing

Synergy is the 3PL that fulfils the funnel products. Checkout is Shopify-hosted; the only link
between an order and the courier Synergy uses is the **shipping method name** on the order.

## The name is the instruction

**Synergy maps purely on the shipping method name.** Not the destination country, not the price.
Country and weight only affect how Synergy invoices us.

- A method name Synergy does not recognise is held as **"Invalid Dispatch Method"** and ships late.
- **Terms of sale (DDP or DAP) are hard-coded per method** on Synergy's side, not read off the
  order. Shopify carries no incoterm field unless duties are collected at checkout, and having
  Synergy read one per order is chargeable project work. So changing a method's terms is a request
  to Synergy, not a Shopify change.
- **Rename order matters.** Renaming a rate before Synergy map the new name holds orders (safe,
  late). Leaving a European rate on a DAP name ships it DAP (the customer gets a doorstep bill). When
  in doubt, rename first.

## Mapping sheet

Synergy's portal has no view of the agreed list. **This table is the record.**

```
Shipping Method           | Carrier | Service        | Market | Terms of sale
Express                   | Evri    | Standard       | UK     | n/a
24 Hour Delivery          | DPD     | Next Day       | UK     | n/a
European Delivery         | DHL     | Economy Select | EU     | DDP
Express International     | Evri    | International  | ROW    | DAP
Express International DHL | DHL     | Express (Air)  | ROW    | DDP
```

- **`Express International DHL` is the USA method**, DHL air on DDP. It is also the likely
  vehicle for any other rest-of-world zone that moves to DDP.
- **Do not retire `Express International`.** Every other non-European zone and the Channel Islands
  rate use it.
- **Adding a method** (for example a `Pallet` method for bulk B2B): add the Shopify rate, then ask
  Synergy to map it, then update this table.
- **Royal Mail International is not available** through Synergy.

## Subscription renewals use the method stored on the contract

A renewal order's shipping line comes from the **delivery method stored on the Shopify subscription
contract**, not from a rate picked at billing time. A contract with a null title prints
`Subscription shipping`, which is not a configured rate, so Synergy holds it. Contracts created
through checkout store the name the customer chose; contracts imported from Loop stored null. Loop
renewals behaved the same way, so this is an import gap, not a Skio fault. Fix status: SCRUM-1311
(UK), SCRUM-1340 (international).

- **The fix** is Skio's per-contract **"Re-sync with Shopify"** (Update delivery method dialog), or
  `changeSubscriptionDeliveryMethod` on the Skio API. It pulls the rate name from our Shopify
  profile for the contract's address.
- **Never disturb the price while setting a title.** Leave `setOverride` false and omit
  `deliveryPrice`. Imported international contracts carry Loop-era delivery prices that do not
  match current bands, so a re-rate changes what real customers pay.
- **Mapping:** UK contracts resolve to `Express`, European contracts to `European Delivery`, USA
  contracts to `Express International DHL`, the rest of the world to `Express International`.
- **A re-sync can match nothing.** It picks the rate whose weight band fits, so a contract below a
  zone's minimum (Europe and the USA have one) gets no rate. Check the weight before re-syncing an international
  contract.
- **A UK subscription always stores `Express`**, even when the customer paid for next-day.
- **Our own Shopify apps cannot read subscription contracts.** `read_own_subscription_contracts`
  only covers contracts the calling app created, and Skio owns ours. Read contract state through
  Skio's API (`getCurrentSubscriptionDeliveryMethod`).

## Connector rules

- Synergy pulls only **open, paid, unfulfilled** orders. A £0 order that auto-fulfils is never pulled.
- **Never remove the `IMPORTSYNERGY` tag.** Synergy writes it and it is the only load-bearing order
  tag (`docs/development/CART_ATTRIBUTES.md`).
- **Orders cannot be edited once Synergy has pulled them.**
- Subscription variants are **Synergy virtual bundles**, exploded at pick time from the
  `custom.bundlecomposition` metafield. How to set one up: `docs/features/SUBSCRIPTIONS.md`.
- Multi-parcel orders: Synergy packs into cartons and prints one label per carton, all under the
  single method name on the order. We set one method; they decide the parcel count.
