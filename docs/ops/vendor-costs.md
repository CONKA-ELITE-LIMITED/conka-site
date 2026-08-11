# Vendor & Recurring Costs

Recurring SaaS / app spend. Goal: one place that shows the full monthly burn. Snapshot **11 Aug 2026**.

## Shopify paid app subscriptions

From Shopify admin > Settings > Billing > Active subscriptions (11 Aug 2026). All billed **every 30 days** in USD; GBP estimates are Shopify's.

| App | Cost / 30 days | GBP est. | Notes |
|-----|----------------|----------|-------|
| **Loop Subscriptions** | $399.00 + usage | £295.79 | Subscription management. **Migrating to Skio** (see `subscription-platform.md`). Next renewal 2 Sep 2026 |
| **Alia** | $100.00 | £74.13 | Renews 16 Aug 2026 |
| **Xero Bridge by Parex** | $15.00 + usage | £11.12 | B2B Xero invoicing connector (see `docs/features/b2b/B2B_PORTAL.md`). Renews 11 Aug 2026 |
| **Section Store** | $10.00 | £7.41 | Theme sections. Renews 3 Sep 2026 |
| **Kaching Bundles** | usage charges only | — | Bundles |

**Fixed app spend: ~$524 / 30 days (~£388)** plus usage (Loop, Xero Bridge, Kaching).

Note: no active Shopify plan subscription showed on this screen ("You don't have any active Shopify subscriptions") — the Shopify plan itself is billed separately; capture it here when confirmed.

## Non-Shopify vendors — TO CAPTURE

Billed outside Shopify, so not on the screen above. Add cost + cycle for each:

- Shopify plan (the base platform fee)
- Klaviyo (email/SMS)
- Loox (reviews)
- Triple Whale (attribution)
- Vercel (hosting)
- Convex (backend)
- Notion, Figma, any others

## Pending change

Loop $399/mo -> Skio $199/mo drops the biggest line by ~$200/mo. See `subscription-platform.md`.
