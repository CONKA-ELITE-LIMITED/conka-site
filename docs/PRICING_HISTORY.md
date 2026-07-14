# Pricing History

Human-readable audit log of CONKA funnel pricing: what the prices were, and when they changed.

The code source of truth is `FUNNEL_PRICING` in `app/lib/funnelData.ts`. Git history technically records every past price, but it is hard to read at a glance, so this doc is the plain-language trail.

## How to use this

- `FUNNEL_PRICING` stays the single source of truth in code. The money-page meta descriptions (via `getFunnelMinPerShot`) and the Product JSON-LD (via `getFunnelPriceRange`) both derive their prices from it, so those stay in sync automatically.
- Whenever a price changes, **append a new dated block at the top of the log below** (newest first). Do not overwrite or delete a previous block; the point is the trail.
- Record the "From £X/shot" figure too. That is the per-shot minimum (the cheapest cadence, currently quarterly) shown in search snippets and returned by `getFunnelMinPerShot`.
- A block is a snapshot of all nine funnel offers, even if only one price moved, so each entry is a complete picture on its own.

## Log

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

- Code source of truth: `app/lib/funnelData.ts` (`FUNNEL_PRICING`)
- Derivation helpers: `getFunnelMinPerShot` (per-shot "From"), `getFunnelPriceRange` (JSON-LD price range)
- `/start` uses a separate monthly-sub source, `app/lib/landingPricing.ts`. It is not yet consolidated into `FUNNEL_PRICING`; if that changes, record its prices here too.
