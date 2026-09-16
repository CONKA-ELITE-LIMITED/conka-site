# 2026-09 Trial Pack Campaign

**Page live:** Tue 15 Sep 2026 · **Page:** `https://www.conka.io/go/trial-pack` · **Traffic:** cold UK Meta, own campaign · **Tickets:** SCRUM-1343 (page, done), SCRUM-1344 (Klaviyo + conka-lab)
**How it is built:** [GO_LANDING_PAGES.md, Offer format](../features/GO_LANDING_PAGES.md#offer-format) · **Prices:** [PRICING_HISTORY.md](../PRICING_HISTORY.md) · **Skio side:** [SUBSCRIPTIONS.md](../features/SUBSCRIPTIONS.md)

Live status lives on the Jira tickets. This doc holds the what, why and how of the campaign, and the read-out once it lands.

## What this is

A cheap, honestly framed way into a monthly subscription. The visitor picks Flow, Clear or Both, pays a trial price for 4 days of CONKA, and 7 days after the order Skio moves them onto that product's monthly plan, with the starter pack as the first monthly box. Anyone who will not trial into a subscription can buy the regular one-time box from a link under the CTA.

| Option | Trial pack | Trial price (struck one-time) | Monthly from day 7 | Buy-once link |
|---|---|---|---|---|
| Flow | `FLOW-BOX-4`, 4 shots | £12.99 (£29.98) | `FLOW-STARTER-20`, £39.99 | 20-shot box, £69.98 |
| Clear | `CLEAR-BOX-4`, 4 shots | £12.99 (£29.98) | `CLEAR-STARTER-20`, £39.99 | 20-shot box, £69.98 |
| Both (preselected, "Best value") | `BOTH-BOX-8`, 8 shots | £18.99 (£59.96) | `BOTH-STARTER-40`, £74.99 | 40-shot box, £99.98 |

Prices are a snapshot from 15 Sep 2026. The config (`app/lib/landings/trial-pack.ts`) and `PRICING_HISTORY.md` are the source of truth.

## Why

We want monthly subscribers, and the listicles were buying them too expensively: **£105 cumulative / £142 marginal per monthly first order** against a £100 target (`docs/analytics/LISTICLE_PERFORMANCE.md`, 21 Aug pull). The bet is that a low entry price lowers the cost of getting someone into the system, and the day-7 conversion turns enough of them into the plan we actually want.

How it got here, all on 14 Sep 2026: a £14.99 weekly Flow trial box (`/go/flow-trial`), renamed the Flow 4 box, then a Clear twin, then collapsed into one trial pack page that converts to monthly. The weekly subscription model was dropped along the way: the goal is monthly subscribers, so the trial now rolls straight into monthly.

## How it works

1. **Ad** to `/go/trial-pack` (noindex, not linked from the site, no nav; a weekly countdown banner sits in its place).
2. **Page:** a PDP-style hero with the trial pack selector, the conversion terms next to the CTA, then Both-version PDP sections and a "How the trial works" FAQ.
3. **Checkout:** straight to Shopify with the trial variant and its Skio plan. Checkout refuses to run if the plan did not apply, so nobody pays the base price by accident.
4. **Day 0 to 7:** the pack ships. A Klaviyo confirmation and a day-5 reminder ("your monthly plan starts in 2 days") cover the conversion (SCRUM-1344).
5. **Day 7:** Skio charges the first monthly order, the starter pack. From there it is an ordinary monthly subscription.

Every order line from the page carries `_source=trial_pack`, `_offer_choice=flow|clear|both` and `_purchase=trial|one_time`. Those are how Klaviyo, conka-lab and any read-out separate trials from one-time buys.

## Key decisions

| Decision | Why |
|---|---|
| Converts to the chosen product's monthly plan, not weekly | Monthly is the plan we want. The trial is the way in, not a product |
| 7 days, not 4 | Delivery eats most of the first days; nobody should be billed for monthly before they have tried the pack |
| Both preselected with "Best value", Flow and Clear equal tiles | Both is the highest-value plan. "Most popular" is a claim we cannot back |
| Both is one bundle variant | Two cart lines would create two contracts at £79.98, not one Both monthly at £74.99 |
| Terms stated next to the CTA | It is a trial into a subscription; hiding that is the chargeback and trust risk |
| Standard 100-day guarantee | They land on monthly, where the site-wide guarantee applies |
| Stays under `/go` | An experiment; a root route reusing PDP sections would compete with the PDPs in search. Promote only if it wins |
| UK only | No EU shipping rate below 5,250g |

## Success metrics

- **Primary:** Meta cost per customer still subscribed after the day-7 charge, against the £105 listicle baseline.
- **Supporting:** visitor to trial order rate, Flow / Clear / Both split, one-time share, share cancelled before day 7.

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

## Read-out

Not yet. Due once the first cohort has passed its day-7 charge.

## Future, if it wins

- "Skip the trial, start monthly now" using the parked upsell modal
- Below-the-fold content that follows the selection
- One trial per customer
- Promote to a root route
