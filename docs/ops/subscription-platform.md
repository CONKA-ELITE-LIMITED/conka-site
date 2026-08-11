# Subscription Platform: Loop vs Skio

Tracks the subscription-management vendor: current provider, the proposed switch, fees, and contract terms. Snapshot as of **11 Aug 2026**.

## Current: Loop Subscriptions (Pro plan) — LIVE

App is **Loop Subscriptions** (not Loop Returns).

| Term | Value |
|------|-------|
| Plan | Pro |
| Platform fee | **$399 / month** (est. £295.79 GBP) |
| Billing cycle | **Monthly — "every 30 days", plus usage charges** (confirmed in Shopify > Settings > Billing, 11 Aug 2026). NOT annual. No annual commitment on the Shopify side. |
| Transaction fee | **0.75%** (flat) |
| Started | 1 Sep 2025 |
| Next renewal | **2 Sep 2026** = the next 30-day cycle, not a yearly cliff |

> **No Loop lock-in on Shopify's side.** Loop bills every 30 days and can be cancelled any time; each extra month is one more ~£296 + usage charge, not a year. The only 12-month commitment in this whole picture is Skio's contract below. Still verify the *signed Loop agreement* separately for any minimum term or cancellation fee (Shopify billing != contract terms).

## Proposed: Skio — CONTRACT UNSIGNED (as of 11 Aug 2026)

Contract from Skio (contact: aidan@skio.com).

| Term | Value |
|------|-------|
| Service | Subscription for Shopify |
| Initial term | 12 months, auto-renews every 12 months |
| Platform fee | **$199 / month** |
| Transaction fee | **0.7% + $0**, tiered down by monthly sub revenue (see below) |

**Transaction-fee tiers (by monthly subscription revenue, USD):**

| Monthly sub revenue | Rate |
|---------------------|------|
| $0 – $499,999 | 0.7% |
| $500,000 – $999,999 | 0.65% |
| $1,000,000 – $1,999,999 | 0.575% |
| $2,000,000+ | 0.515% |

## The saving

- **Fixed:** $399 - $199 = **$200 / month saved = $2,400 / year.**
- **Variable:** 0.75% - 0.7% = **0.05% of monthly sub revenue** (more as the tiers step down at higher volume).

> To finish this: what is our current monthly subscription revenue (USD)? At $R/month the variable saving is `0.0005 x R` per month. E.g. $100k/mo -> +$50/mo ($600/yr), $200k/mo -> +$100/mo ($1,200/yr). Total annual saving = $2,400 + (0.006 x R).

Caveat before signing: the 12-month term auto-renews for another 12, so there is a lock-in. Weigh the migration effort (Loop -> Skio) and any feature parity gaps against the ~$2.4k+/yr saving.

## Migration timing (no cliff, but the meter runs)

Corrected 11 Aug 2026: Loop bills **monthly (every 30 days)**, so there is **no annual cliff**. The earlier read of a yearly lock-in was wrong. 2 Sep 2026 is just the next 30-day charge.

What actually drives timing: every month left on Loop is another **~£296 + usage**. Migrating sooner saves ~£296/month, full stop. There is no penalty for crossing 2 Sep beyond paying for one more normal month.

Because Loop carries usage charges on top of the recurring fee, expect a **final usage charge** up to the cancellation date whenever you cancel. Confirm any **minimum term / cancellation fee** in the signed Loop agreement (not visible in Shopify billing).

Suggested runway (relaxed, since there is no cliff):

| Window | Work |
|--------|------|
| Now -> 20 Aug | Set up Skio, configure subscription products, test thoroughly |
| 20 -> 28 Aug | Migrate active subscribers across, verify everything runs |
| By ~29 Aug | Cancel Loop to stop the next 30-day charge (~2 Sep). Slipping past it just costs one more month, not a year. |

## Migration status

Loop -> Skio migration is under discussion, not committed. See memory `project_loop_to_skio_phase4_hold.md`: the account-portal cancel flow is deliberately **not** being built because a Skio migration may moot it (Skio does swap/cancel/upsell natively). Phases 0-3 of the portal work are already live.
