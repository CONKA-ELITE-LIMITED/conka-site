# Ops & Commercial Hub

The single source of truth for the **commercial layer** of CONKA: what things cost, what we charge, what we pay vendors, and whether each offer clears margin. Code and product docs describe *what we sell and how it is built*; this directory describes *the money around it*.

**Why this exists.** The numbers needed to reason about margin, discounts, and vendor decisions were scattered (pricing here, SKUs there, carriage costs elsewhere, COGS nowhere). This hub ties them together so any question of the form "does this offer make money?" or "should we switch vendor X?" can be answered from one place. Keeping it in the repo (not Notion) means it is version-controlled and available in-context every session.

## What lives here

| File | Topic | Status |
|------|-------|--------|
| `subscription-platform.md` | Loop vs Skio: fees, contract terms, migration state | Live |
| `unit-economics.md` | Per-SKU COGS + packaging + fulfilment + fees to contribution margin | **Not built** (needs COGS input) |
| `vendor-costs.md` | Full recurring SaaS / vendor monthly burn | Started — Shopify app subs captured; non-Shopify vendors pending |
| `offerings-and-discounts.md` | Selling plans + discount codes, each checked against margin | **Not built** |

## Related sources (do not duplicate, link)

- `docs/product/SKU_AND_SHOT_REFERENCE.md` — SKUs, selling plans, shot counts, **prices** (canonical)
- `docs/PRICING_HISTORY.md` — how prices changed over time
- `docs/shipping/SHIPPING_AND_COURIERS.md` — carriage costs per carrier / band (the fulfilment cost input)
- `docs/product/FORMULATION_SPEC.md` — formulation (the liquid-cost input)

## The end goal

A complete **contribution-margin picture per unit and per order**:

```
sell price
  - COGS (liquid + bottle/cap)
  - packaging (label + box + outer carton)
  - fulfilment (Synergy pick/pack + carriage)
  - platform fees (Shopify + Skio/Loop + payment processor)
  = contribution margin
```

Once that exists, every downstream question becomes answerable: is a discount code profitable, what is the true margin on a 3-box order, how much does the Loop -> Skio switch actually save at our sub revenue, what is our full monthly vendor burn.

## Data still needed from Rudh (to build the rest)

1. **Monthly subscription revenue (USD)** — completes the Skio transaction-fee saving and fixes the Skio tier.
2. **COGS per unit** — liquid cost + bottle/cap, per formula (Flow / Clear).
3. **Packaging cost** — label + retail box + outer carton, per SKU.
4. **Vendor list + monthly cost** — Shopify plan, Skio/Loop, Klaviyo, Loox, Triple Whale, Vercel, Convex, and anything else recurring.

Fulfilment/carriage costs are already captured in `docs/shipping/SHIPPING_AND_COURIERS.md`.
