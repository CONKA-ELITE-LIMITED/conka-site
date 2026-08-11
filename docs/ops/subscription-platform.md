# Subscription Platform: Loop vs Skio

Tracks the subscription-management vendor: current provider, the proposed switch, fees, and contract terms. Snapshot as of **11 Aug 2026**.

## Current: Loop Subscriptions (Pro plan) — LIVE

App is **Loop Subscriptions** (not Loop Returns).

| Term | Value |
|------|-------|
| Plan | Pro |
| Platform fee | **$399 / month** |
| Transaction fee | **0.75%** (flat) |
| Pricing model | Recurring **+ usage-based** |
| Started | 1 Sep 2025 |
| Current billing period ends | **2 Sep 2026** (auto-renews for another year) |

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

## Migration timing (the hard deadline)

**Hard deadline: migrate off Loop before 2 Sep 2026.** Loop auto-renews for another full year on that date, and Shopify processes app renewal charges automatically at period end with no grace period and no guaranteed refund once charged. Cancelling after 2 Sep means eating another year of $399/mo.

Because Loop is usage-based on top of the recurring fee, expect a **final usage charge** billed for usage up to the cancellation date regardless of when you cancel. Also confirm with Loop whether there is any **mid-cycle cancellation fee** in the agreement.

Suggested runway (from the ~11 Aug starting point, ~3 weeks out):

| Window | Work |
|--------|------|
| Now -> 20 Aug | Set up Skio, configure subscription products, test thoroughly |
| 20 -> 28 Aug | Migrate active subscribers across, verify everything runs |
| By 29 Aug | Cancel Loop Subscriptions (a few days buffer before the 2 Sep renewal) |

The buffer before 2 Sep is the point that matters most: cancel with days to spare, not on the deadline.

## Migration status

Loop -> Skio migration is under discussion, not committed. See memory `project_loop_to_skio_phase4_hold.md`: the account-portal cancel flow is deliberately **not** being built because a Skio migration may moot it (Skio does swap/cancel/upsell natively). Phases 0-3 of the portal work are already live.
