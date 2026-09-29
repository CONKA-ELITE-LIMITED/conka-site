# 2026-09 Trial Pack Campaign

**Page live:** Tue 15 Sep 2026 · **Page:** `https://www.conka.io/go/trial-pack` · **Traffic:** cold UK Meta, own campaign · **Tickets:** SCRUM-1343 (page, done), SCRUM-1344 (Klaviyo + conka-lab), SCRUM-1466 / SCRUM-1467 (Both only)
**How it is built:** [GO_LANDING_PAGES.md, Offer format](../features/GO_LANDING_PAGES.md#offer-format) · **Prices:** [PRICING_HISTORY.md](../PRICING_HISTORY.md) · **Skio side:** [SUBSCRIPTIONS.md](../features/SUBSCRIPTIONS.md)

Live status lives on the Jira tickets. This doc holds the what, why and how of the campaign, and the read-out once it lands.

## What this is

A cheap, honestly framed way into a monthly subscription. The visitor picks 1 or 2 boxes of Flow + Clear, pays a trial price, and 7 days after the order Skio moves them onto the Both monthly plan, with the starter pack as the first monthly box. Anyone who will not trial into a subscription can buy the regular one-time box from a link under the CTA.

| Option | Trial pack | Trial price (struck one-time) | Monthly from day 7 | Buy-once link |
|---|---|---|---|---|
| 1 box | `BOTH-BOX-4`, 4 shots (2 Flow, 2 Clear) | £12.99 (£29.98) | `BOTH-STARTER-40`, £74.99 | 40-shot box, £99.98 |
| 2 boxes (preselected, "Best value") | `BOTH-BOX-8`, 8 shots (2 x `BOTH-BOX-4`) | £18.99 (£59.96) | `BOTH-STARTER-40`, £74.99 | 40-shot box, £99.98 |

Until SCRUM-1467 the page sold Flow-only and Clear-only 4-shot packs next to Both. Synergy packs every 4-shot trial box as 2 Flow + 2 Clear, so those options sold something that did not ship, and in the first two weeks they sold none anyway (Read-out below).

Prices are a snapshot from 29 Sep 2026. The config (`app/lib/landings/trial-pack.ts`) and `PRICING_HISTORY.md` are the source of truth.

## Why

We want monthly subscribers, and the listicles were buying them too expensively: **£105 cumulative / £142 marginal per monthly first order** against a £100 target (`docs/analytics/LISTICLE_PERFORMANCE.md`, 21 Aug pull). The bet is that a low entry price lowers the cost of getting someone into the system, and the day-7 conversion turns enough of them into the plan we actually want.

How it got here, all on 14 Sep 2026: a £14.99 weekly Flow trial box (`/go/flow-trial`), renamed the Flow 4 box, then a Clear twin, then collapsed into one trial pack page that converts to monthly. The weekly subscription model was dropped along the way: the goal is monthly subscribers, so the trial now rolls straight into monthly.

## How it works

1. **Ad** to `/go/trial-pack` (noindex, not linked from the site, no nav; a weekly countdown banner sits in its place).
2. **Page:** a PDP-style hero with the trial pack selector, the conversion terms next to the CTA, then Both-version PDP sections and a "How the trial works" FAQ.
3. **Checkout:** straight to Shopify with the trial variant and its Skio plan. Checkout refuses to run if the plan did not apply, so nobody pays the base price by accident.
4. **Day 0 to 7:** the pack ships. A Klaviyo confirmation and a day-5 reminder ("your monthly plan starts in 2 days") cover the conversion (SCRUM-1344).
5. **Day 7:** Skio charges the first monthly order, the starter pack. From there it is an ordinary monthly subscription.

Every order line from the page carries `_source=trial_pack`, `_offer_choice=both_4shot|both_8shot` (`flow|clear|both` before SCRUM-1467) and `_purchase=trial|one_time`. Those are how Klaviyo, conka-lab and any read-out separate trials from one-time buys.

## Key decisions

| Decision | Why |
|---|---|
| Converts to the chosen product's monthly plan, not weekly | Monthly is the plan we want. The trial is the way in, not a product |
| 7 days, not 4 | Delivery eats most of the first days; nobody should be billed for monthly before they have tried the pack |
| 2 boxes preselected with "Best value" | The larger pack has the bigger saving. "Most popular" is a claim we cannot back |
| Both is one bundle variant | Two cart lines would create two contracts at £79.98, not one Both monthly at £74.99 |
| Terms stated next to the CTA | It is a trial into a subscription; hiding that is the chargeback and trust risk |
| Standard 100-day guarantee | They land on monthly, where the site-wide guarantee applies |
| Stays under `/go` | An experiment; a root route reusing PDP sections would compete with the PDPs in search. Promote only if it wins |
| UK only | No EU shipping rate below 5,250g |

## Success metrics

- **Primary:** Meta cost per customer still subscribed after the day-7 charge, against the £105 listicle baseline.
- **Supporting:** visitor to trial order rate, 1 box / 2 boxes split, one-time share, share cancelled before day 7.

| Signal | Source |
|---|---|
| Visits, section depth, CTA clicks, option picks | Vercel Analytics: `listicle:section_viewed` / `listicle:cta_clicked` (slug `trial-pack`), `offer:option_selected`, `purchase:add_to_cart` (`source: trial_pack`) |
| Trial and one-time orders | Shopify orders by `_purchase` and `_offer_choice` |
| Contracts active after day 7 | Skio |
| Spend | Meta Ads Manager |

The Meta Purchase event fires on the checkout order only (trial or one-time), never on the day-7 charge or renewals, so Meta's reported CPA is cost per first order, not cost per subscriber.

## Risks and how to read the data

- **A missed conversion.** A customer who skims the terms is charged on day 7. The disclosure by the CTA and the day-5 reminder are the mitigation, and the reminder must be live before the first cohort converts.
- **Returning subscribers can buy the trial.** One trial per customer is not enforced; filter the read-out by first order.
- **Preview traffic reaches Vercel Analytics** (Meta is host-gated, Vercel is not). Discount internal walkthroughs in the first days.

## Iterations

| Date | Change |
|---|---|
| 15 Sep 2026 | Launched on the Skio trial plans: struck one-time prices on the tiles, "How the trial works" FAQ, countdown banner, partner logos |
| 16 Sep 2026 | Buy box: a line under "Choose your trial pack" restating the selection with its saving; CTA "Checkout - £X" became "Start trial for £X" |
| 29 Sep 2026 | Both only: two tiles, 1 box (`BOTH-BOX-4`, £12.99) and 2 boxes (`BOTH-BOX-8`, £18.99, preselected), both converting to Both monthly. Flow-only and Clear-only removed because Synergy packs every trial box as 2 Flow + 2 Clear (SCRUM-1467) |

## Read-out

**First two weeks (15 to 27 Sep).** Full numbers in the [listicle programme review](../analytics/LISTICLE_PERFORMANCE.md) snapshot and [`data/listicle-review-2026-09-27.json`](../analytics/data/listicle-review-2026-09-27.json).

- Meta: 21 purchases, £1,661 spend, £79 per purchase (£53 the first week, £99 the second).
- 1,406 visitors; add to cart 98, checkouts 95, purchases 21, so 22% of checkouts complete.
- 15 trials traced on Shopify, all the Both box. Flow and Clear were picked by 95 visitors and sold none.
- 4 of the 6 trials from 17 to 18 Sep billed £74.99 at day 7+.

The day-7 conversion read-out (cost per subscriber still paying) is still due once more of the cohort has passed its charge.

## Future, if it wins

- "Skip the trial, start monthly now" using the parked upsell modal
- Below-the-fold content that follows the selection
- One trial per customer
- Promote to a root route
