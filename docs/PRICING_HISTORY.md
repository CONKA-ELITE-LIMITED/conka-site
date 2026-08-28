# Pricing History

Human-readable audit log of CONKA funnel pricing: what the prices were, and when they changed.

The code source of truth is `OFFER_PRICING` in `app/lib/offerData.ts`. Git history technically records every past price, but it is hard to read at a glance, so this doc is the plain-language trail.

## How to use this

- `OFFER_PRICING` stays the single source of truth in code. The money-page meta descriptions (via `getOfferMinPerShot`) and the Product JSON-LD (via `getOfferPriceRange`) both derive their prices from it, so those stay in sync automatically.
- Whenever a price changes, **append a new dated block at the top of the log below** (newest first). Do not overwrite or delete a previous block; the point is the trail.
- Record the "From £X/shot" figure too. That is the per-shot minimum (the cheapest cadence, currently quarterly) shown in search snippets and returned by `getOfferMinPerShot`.
- A block is a snapshot of all nine funnel offers, even if only one price moved, so each entry is a complete picture on its own.

## Log

### 2026-08-28 (representation correction + anchor audit; no charged price changed)

Not a price change: every checkout total is identical to the 2026-07-14 baseline. Two things are recorded here (SCRUM-1257, Phase 1 of the pricing anchor coherence work):

1. **One-time prices are itemised, not baked in.** The code (`OFFER_PRICING`) has carried one-time pricing as product price + £9.99 compulsory per-order postage since the funnel consolidation; the baseline block below shows the postage-baked totals. The Shopify OTP variants still bake postage in, so the charged totals are unchanged (£69.98 / £69.98 / £99.98).
2. **Quarterly one-time base values now exist in Shopify** (Skio-era variants, read 2026-08-28): FLOW-60 / CLEAR-60 at £189.99, BOTH-120 at £279.99. These become the quarterly discount anchors in SCRUM-1258. Anchor rules: `docs/ops/offerings-and-discounts.md`.

| Product | Cadence | Total | Per-shot | Priced shots | Bonus shots |
|---------|---------|-------|----------|--------------|-------------------|
| Flow | Monthly sub | £39.99 | £2.00 | 20 | +8 free (1st order) |
| Flow | One-time | £59.99 + £9.99 postage | £3.00 | 20 | n/a |
| Flow | Quarterly sub | £109.99 | £1.83 | 60 | +20 free (every cycle) |
| Clear | Monthly sub | £39.99 | £2.00 | 20 | +8 free (1st order) |
| Clear | One-time | £59.99 + £9.99 postage | £3.00 | 20 | n/a |
| Clear | Quarterly sub | £109.99 | £1.83 | 60 | +20 free (every cycle) |
| Both | Monthly sub | £74.99 | £1.87 | 40 | +16 free (1st order) |
| Both | One-time | £89.99 + £9.99 postage | £2.25 | 40 | n/a |
| Both | Quarterly sub | £149.99 | £1.25 | 120 | +20 free (every cycle) |

"From" per-shot figures are unchanged: Flow £1.83, Clear £1.83, Both £1.25.

The savings percentages shown on the site are due to change in SCRUM-1258 (percentages derive from real anchors instead of declared numbers; prices stay identical): Flow/Clear monthly stays 43%, Flow/Clear quarterly 63% -> 42%, Both monthly 46% -> 25%, Both one-time 29% -> 25%, Both quarterly 69% -> 46%.

### 2026-07-14 (baseline)

Prices in GBP. Per-shot is calculated on priced shots. "From" per-shot is the cheapest cadence per product. Free-shot bonuses apply to the first order of a subscription only.

| Product | Cadence | Total | Per-shot | Priced shots | First-order bonus |
|---------|---------|-------|----------|--------------|-------------------|
| Flow | Monthly sub | £39.99 | £2.00 | 20 | +8 free |
| Flow | One-time | £69.98 | £3.50 | 20 | n/a |
| Flow | Quarterly sub | £109.99 | £1.83 | 60 | +20 free |
| Clear | Monthly sub | £39.99 | £2.00 | 20 | +8 free |
| Clear | One-time | £69.98 | £3.50 | 20 | n/a |
| Clear | Quarterly sub | £109.99 | £1.83 | 60 | +20 free |
| Both | Monthly sub | £74.99 | £1.87 | 40 | +16 free |
| Both | One-time | £99.98 | £2.50 | 40 | n/a |
| Both | Quarterly sub | £149.99 | £1.25 | 120 | +20 free |

"From" per-shot (the figure shown in the money-page meta descriptions):

- Flow: From £1.83/shot
- Clear: From £1.83/shot
- Both: From £1.25/shot (also the site-wide cheapest, used on the homepage)

Notes:

- One-time prices include £9.99 compulsory postage, baked into the displayed price.
- This baseline records the prices already live at the time this log was introduced (SCRUM-1139); it is not a price change.

## Related

- Code source of truth: `app/lib/offerData.ts` (`OFFER_PRICING`)
- Derivation helpers: `getOfferMinPerShot` (per-shot "From"), `getOfferPriceRange` (JSON-LD price range)
- `/start` uses a separate monthly-sub source, `app/lib/landingPricing.ts`. It is not yet consolidated into `OFFER_PRICING`; if that changes, record its prices here too.
