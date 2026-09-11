# Creating a New Product or Variant

> **Purpose:** the end-to-end checklist for adding anything sellable to Shopify, so nothing
> that another system depends on gets missed. Written after the Sept 2026 France customs
> incident, where 15 live variants turned out to have no HS code or country of origin and
> customers were billed surprise import charges.
>
> **This is a checklist, not a reference.** The actual SKU, GID, price and shot-count data
> lives in [`../product/SKU_AND_SHOT_REFERENCE.md`](../product/SKU_AND_SHOT_REFERENCE.md).
> Do not duplicate it here.

---

## When to use this document

- Adding a new product to Shopify
- Adding a variant to an existing product (a new pack size, cadence or bundle)
- Creating a gift or component SKU that ships inside a kit
- Auditing an existing product for missing fields

---

## Step 0: Decide what you are creating

Four different things, with different requirements. Get this right first.

| Type | What it is | Published? | Needs `bundlecomposition`? | Example |
|---|---|---|---|---|
| **Sellable SKU** | A thing a customer buys directly | Yes | No | `FLOW-FUNNEL-20-OTP` |
| **Kit / starter variant** | A sellable SKU that explodes into components at pick time | Yes | **Yes** | `BOTH-STARTER-56` |
| **Component / gift SKU** | A leaf item that only ever ships inside a kit | **No, deliberately unpublished** | No | `CONKA-HAT`, `CONKA-TRAVEL-PACK-28` |
| **Legacy variant** | Kept alive only for existing subscribers | Usually yes, unlinked | No | the superseded `-FUNNEL-` subscription variants |

A kit's components must exist as their own products before the kit can reference them.

---

## Step 1: Shopify product fields

### Identity

- [ ] **Title** and handle. The handle becomes the URL, so it is effectively permanent.
- [ ] **SKU**, following the convention below.
- [ ] **Barcode** if this is a physical box Synergy scans. Code 128. Existing funnel boxes use
      `FLOWFUNNEL28` / `CLEARFUNNEL28`.

**SKU convention.** `<FORMULA>-<ROLE>-<SHOTS>[-OTP]`

- Formula: `FLOW`, `CLEAR`, `BOTH`
- Role: `FUNNEL` (plain sellable), `STARTER` (kit with gifts), `SUB` (Skio recurring), or
  omitted for the Skio-era base variants (`FLOW-20`, `BOTH-120`)
- Shots: the **actual shot count in the box**, not the priced count
- `-OTP` suffix for one-time-purchase variants

Put the count in the SKU on purpose, so a future different-sized pack takes its own SKU and
stock line rather than silently redefining an existing one.

### Pricing

- [ ] **Price.**
- [ ] **Compare-at price**, if used. It must reference a **real purchasable price**, not
      ex-postage arithmetic no customer is ever charged. This was corrected across the
      catalogue in SCRUM-1287.
- [ ] If the price is sellable on the site, add it to
      [`../PRICING_HISTORY.md`](../PRICING_HISTORY.md). Every price change gets a dated block.

### Shipping and customs — the section that gets forgotten

- [ ] **Weight in grams.** Load-bearing: every UK and international shipping rate is a
      weight band, so a wrong weight puts the order in the wrong price tier. Reference
      figures: **1 box = 28 shots = 2,100 g**. `CONKA-HAT` is 250 g,
      `CONKA-TRAVEL-PACK-28` is 100 g. A kit's weight is the sum of its components.
- [ ] **HS code: `210690`.** Classifies the goods for customs. Without it, destination
      customs classifies for us and we cannot claim the UK-EU trade agreement 0% duty rate.
- [ ] **Country of origin: United Kingdom.** A store-level default exists
      (Settings → Taxes and duties → Customs information), but **set it explicitly on the
      variant anyway** — it is not certain a store default reaches Synergy's variant-level
      data pull.
- [ ] **Dimensions**, if known. DHL charges the higher of actual and volumetric weight
      (L×W×H cm ÷ 5000).

`210690` covers every CONKA consumable. An HS code classifies what the product *is*, not the
SKU, so formula, pack size and bundling are all irrelevant to it. **Merch is different**
(chapter 61/62 for clothing) and must not inherit the food code or a UK origin it does not
have. See [`../development/featurePlans/international-duties-and-ddp.md`](../development/featurePlans/international-duties-and-ddp.md).

### Inventory

- [ ] Inventory tracking on, at the correct location.
- [ ] Component SKUs need their own stock line. Synergy decrements components, not kits.

### Sales channels

- [ ] Publish to the sales channels this SKU should be buyable from.
- [ ] **Component and gift SKUs stay unpublished.** They must exist for the kit to explode
      into, but must never be directly purchasable.

### Metafields

- [ ] `custom.bundlecomposition` on kit variants only. Format:
      `<qty>x<SKU>+<qty>x<SKU>+…`, for example
      `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28`.
      Synergy reads this and explodes the kit at pick time. Every referenced SKU must already
      exist and must not itself carry a `bundlecomposition`.

### Subscriptions

- [ ] Attach the Skio selling plan if this is a subscription cadence.
- [ ] Check the plan's pricing policy. Skio's model is **percentage off** the variant price,
      so the variant price and the plan discount together produce the charged price. Read
      [`../features/SUBSCRIPTIONS.md`](../features/SUBSCRIPTIONS.md) before touching selling
      plans; the pricing model has traps.

---

## Step 2: What Synergy needs

Synergy pull from Shopify, so most of this flows automatically once the fields above are
right. What needs saying explicitly:

- [ ] **Tell them the new SKU exists** before the first order lands. Their WMS needs the
      stock line set up, or the order fails to pick.
- [ ] **Barcode and weight**, so goods-in can receive it.
- [ ] **Bundle composition** for kits, so they know what to explode it into.
- [ ] **Physical stock delivered** to Synergy, with the barcode on the carton.

Two tags to know about, neither of which we write:

- **`IMPORTSYNERGY`** is written by Synergy's connector when they successfully pull an order.
  **Never remove or touch it.** Removing it causes a failed resend; Synergy will not accept
  the same order twice.
- **`SYNERGYIGNORE`** marks legacy SKUs that Synergy should not fulfil.

See [`../development/CART_ATTRIBUTES.md`](../development/CART_ATTRIBUTES.md) for the full
order-tag ownership map.

---

## Step 3: What the codebase needs

Only if the SKU is sellable from the site. A component or gift SKU needs none of this.

- [ ] **Variant GID** into the offer catalogue (`app/lib/offerData.ts`) or the main-site
      product data, depending on which system sells it. The two systems are separate; see
      [`../product/PRODUCT_DATA.md`](../product/PRODUCT_DATA.md).
- [ ] **Selling plan ID** alongside it, for subscription cadences.
- [ ] Import product data from the barrel (`app/lib/productData`), never from sub-modules.
- [ ] Prices you can sell at live in `offerData.ts`, not in the barrel. Pre-add UI prices come
      from there; cart and checkout prices come from Shopify only. See
      [`../development/CART_PRICING_SOURCE_OF_TRUTH.md`](../development/CART_PRICING_SOURCE_OF_TRUTH.md).

---

## Step 4: Update the docs

- [ ] [`../product/SKU_AND_SHOT_REFERENCE.md`](../product/SKU_AND_SHOT_REFERENCE.md) — the
      canonical SKU, GID, selling plan and shot-count map. Every new variant goes in it.
- [ ] [`../PRICING_HISTORY.md`](../PRICING_HISTORY.md) — if a price changed.
- [ ] [`../CHANGELOG.md`](../CHANGELOG.md) — an entry per shipped change.

---

## Step 5: Verify

Check the customs fields actually landed, rather than trusting the admin UI. Mint a token
from the read-only client-credentials app and query:

```graphql
{
  productVariants(first: 250) {
    edges {
      node {
        sku
        product { title status }
        inventoryItem { harmonizedSystemCode countryCodeOfOrigin }
      }
    }
  }
}
```

Anything sellable and international-shippable must have both fields populated.

Then place a test order and confirm Synergy pulls it, picks the right components, and writes
back tracking.

---

## Common traps

**Weight left at zero.** The order falls into the wrong shipping band and we under-recover, or
Shopify offers no rate at all and the customer cannot check out.

**Compare-at price set to ex-postage arithmetic.** Anchors a discount against a price no
customer can ever pay. Use a real purchasable price.

**Component SKU accidentally published.** It becomes directly buyable, usually at a nonsense
price, and stock gets consumed outside the kit.

**Kit referencing a SKU that does not exist yet.** Synergy cannot explode it and the order
sits unfulfilled.

**HS code and country of origin skipped.** Nothing breaks visibly in the UK. It surfaces
months later as a customer in France being billed a surprise import charge, which is exactly
how this document came to exist.

**Assuming a store-level default propagates.** Set customs fields on the variant.

**Adding a variant without updating `SKU_AND_SHOT_REFERENCE.md`.** The next person resolving a
subscriber's shot count from a variant GID gets it wrong.
