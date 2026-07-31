# Listicle Performance Log

> **Living data log for the `/go/*` listicle landing pages.** Append a dated snapshot each time we pull Vercel Web Analytics; the JSON block in each snapshot feeds the dashboard artifact directly. This is the data home — the [2026-07 ad-spend sprint doc](../sprints/2026-07-listicle-ad-spend.md) is the narrative context.

## What we measure and why

Three events, all keyed `{ slug, section }` (the two-property budget — see `app/lib/analytics.ts`):

| Event | Fires | Role |
|-------|-------|------|
| `listicle:section_viewed` | Section scrolls into view (once/section/pageview) | **Denominator** — how far people scroll |
| `listicle:cta_clicked` | CTA click (all CTAs route to a PDP) | **Conversion proxy** — every click is a PDP hand-off |
| `listicle:interaction` | Symptom picked / segment toggled | **Active-intent** — self-identification, added 2026-07-27 |

`section` values: body blocks are `<kind>_<index>` (e.g. `reason_3`, `symptomExplainer_0`); fixed zones are `hero` / `bridge` / `sticky` / `product`; interaction choices fold into `section` as `symptom_<label>` / `segment_<label>`.

**Why CTA-click is the conversion signal (baseline):** every listicle CTA links to a PDP, so a click is the furthest-down-funnel action we could attribute to a persona. This holds for the 24–27 Jul baseline snapshot below.

**First-party purchase attribution is now live (from ~27 Jul).** Listicle CTAs were re-routed to the **funnel** (not the classic PDP). The funnel carries the cart-level `_listicle_origin` attribute (`<slug>-<section>`, set in `CartContext`) straight through Shopify's hosted checkout, so it lands on the **order** as a note attribute — first-party, per persona *and* section. This supersedes the old `?src=` → `purchase:add_to_cart.source` path, which stays ~zero because the funnel skips the cart (no `add_to_cart` event fires). Pull orders by `_listicle_origin` (query 6 below).

> **⚠️ First-party is a FLOOR, not the truth (learned 2026-07-31).** The `_listicle_origin` count only rides the funnel→checkout path, so it captures roughly **1 in 5** of the orders the listicles actually drive. It misses come-back-and-buy-direct, cross-device, and the checkout-cookie split (`myshopify.com`). **Do not read the tagged-order count as "what the listicles sold."** For *volume*, use **store-level incrementality** (query 7) and **Meta Ads Manager** (query 8); use first-party only for *which section closes*. Week 1 proof: 6 tagged vs 25 Meta-attributed vs ~38 store-lift orders — the truth is the high end. Full working in the *Incrementality & attribution reconciliation* subsection of the 24–31 Jul snapshot below.

> **Known gap — `persona:` order tags aren't writing.** The `orders/paid` webhook also calls `tagsAdd` to stamp `listicle` + `persona:<name>` on the order (SCRUM-1180), but the live `SHOPIFY_ADMIN_API_TOKEN` (B2B Invoicing app) lacks `write_orders`, so the tag write silently fails. Orders still carry the `_listicle_origin` note attribute (that comes from the cart, not the webhook) — so attribution works, but you must filter by the note attribute, **not** the tag. Tracked in `docs/TODO.md`.

## How to pull the data

Vercel Web Analytics via the Vercel MCP. Project **`conka-shopify`** (`prj_ngcTTAV2aYQsza3lhOV0TrcMTVzJ`), team **CONKA** (`team_RYAm8UuAbSGDfZz1cn0M4tgr`).

```
# 1. Traffic (denominator) — visits by path
dataset=visits mode=aggregate by=["requestPath"]  since=<start> until=<end>

# 2. Scroll funnel — section views per page
dataset=events mode=aggregate by=["eventData/slug","eventData/section"]
  filter=eventName eq 'listicle:section_viewed'

# 3. CTA clicks per section
dataset=events mode=aggregate by=["eventData/slug","eventData/section"]
  filter=eventName eq 'listicle:cta_clicked'

# 4. Interactions per choice (symptom / segment)
dataset=events mode=aggregate by=["eventData/slug","eventData/section"]
  filter=eventName eq 'listicle:interaction'

# 5. Purchase attribution via add_to_cart (~empty since CTAs route at the funnel — see note above)
dataset=events mode=aggregate by=["eventData/source"]
  filter=eventName eq 'purchase:add_to_cart'
```

**6. First-party order attribution (Shopify Admin API).** The real per-persona purchase signal since ~27 Jul. The read-only **attribution-audit** app (`read_orders`) mints a 24h token via a client-credentials grant against `SHOPIFY_CLIENT_ID`/`SHOPIFY_CLIENT_SECRET` in `.env.local`; then GraphQL `orders(query:"created_at:>=<start>")` returning `customAttributes` + `tags`. Filter to orders where `_listicle_origin` is set (or a `persona:`/`listicle` tag exists, once the tag write is fixed). The origin token is `<slug>-<section>`, so persona = everything before the last hyphen (minus any `-listicle` suffix) and section = the last segment. Run it as a throwaway `node` script (reads a secret + hits Shopify) rather than committing it — the classifier gates that call, so run it yourself via the `!` prefix.

**7. Store-level incrementality (Shopify Admin API) — the real volume signal.** Because first-party undercounts ~5×, the honest volume measure is the store-wide lift. Same client-credentials token as query 6; pull all orders `created_at:>=<4+ weeks ago>`, bucket by week, and count **new-demand orders** = new subscriptions + one-time, *excluding* recurring renewals (renewal = tag `subscription_order` without `first_subscription_order`, or `Billing cycle #2`+). Compare the trial week to the pre-trial baseline (~3 new customers / week); the delta ≈ incremental orders the ad spend drove. `new-customer` proxy = `customer.numberOfOrders == 1`. Assumes the listicles are the dominant new paid spend in the window — confirm before attributing the lift to them.

**8. Meta Ads Manager (per-campaign) — best per-persona signal.** The tag is too sparse to split by page, so read the three `Conka | TOF UK | * Listicle` campaigns directly: **Purchases**, **Cost per purchase (CPA)**, **Amount spent**, and always capture the **date range** + **attribution setting** (7-day-click / 1-day-view inflates the purchase count). Meta CVR = Meta purchases ÷ matched-window page visitors (a proxy — the numerator includes view-through / cross-device, so it runs a touch high).

**Always match the window.** Section events first fired **2026-07-24**; use same-window pageviews as the denominator or every rate is understated. Confirm the live window by grouping `section_viewed` `by=["day"]`. Meta windows and Vercel windows must be aligned before computing any CVR (e.g. Meta 24–30 ⇒ subtract 31 Jul from Vercel visitors).

## How to regenerate the dashboard artifact

The artifact is `listicle-dashboard.html` (built in the scratchpad). Its `<script>` holds two arrays — `funnels` and `cta` — that are a direct transcription of a snapshot's JSON block below. To refresh: pull the queries above, append a new snapshot here, paste its `funnels`/`cta` values into the artifact script, update the window/caveat copy, and re-publish the same file to keep the URL.

Latest published: <https://claude.ai/code/artifact/b69a0128-2f0f-4078-a91f-b58d5f8196c4>

---

## Snapshot — 2026-07-24 → 2026-07-27 (baseline, ~3.5 days)

First data of the £300/day trial. Section tracking went live 24 Jul, so this is the first window with funnel data. `listicle:interaction` not yet deployed (added end of this window). Absolute counts are small — directional, not conclusive.

### Headline

| Persona | Visitors | Pageviews | CTA clicks | CTA rate | Reach 1st section | Reach product |
|---------|---------:|----------:|-----------:|---------:|------------------:|--------------:|
| ADHD | 713 | 796 | 51 | **7.2%** | 45% | 16% |
| Brain-ageing | 226 | 247 | 26 | **11.5%** | 35% | 10% |
| Productivity | 545 | 580 | 13 | **2.4%** | 17% | 5.5% |

- **ADHD** — volume leader (48% of traffic) at a healthy rate. The workhorse.
- **Brain-ageing** — best rate, starved of traffic (15%). Underfed; scale it.
- **Productivity** — 37% of traffic at the worst rate; 83% bounce before reason 1. Hero not earning the scroll.

### CTA clicks by section (visitors)

| Section | ADHD | Brain-ageing | Productivity |
|---------|-----:|-------------:|-------------:|
| hero | 21 | 10 | 4 |
| sticky | 21 | 12 | 5 |
| bridge | 6 | 3 | 1 |
| product | 3 | 1 | 3 |

Clicks concentrate in **hero + sticky** on all three pages. Body reasons drive scroll, not clicks.

### Scroll funnel — `section_viewed` visitors

| Section (ADHD) | v | | Section (Brain-ageing) | v | | Section (Productivity) | v |
|---|--:|---|---|--:|---|---|--:|
| symptomExplainer_0 | 318 | | reason_0 | 78 | | reason_0 | 91 |
| statsBand_1 | 255 | | segmentToggle_1 | 49 | | reason_1 | 60 |
| reason_2 | 219 | | statsBand_2 | 39 | | statsBand_2 | 54 |
| reason_3 | 200 | | reason_3 | 35 | | reason_3 | 51 |
| reason_4 | 191 | | reason_4 | 33 | | reason_4 | 49 |
| reason_5 | 172 | | reason_5 | 28 | | reason_5 | 42 |
| reviewStrip_6 | 152 | | reviewStrip_6 | 27 | | reviewStrip_6 | 39 |
| reason_7 | 146 | | reason_7 | 28 | | reason_7 | 37 |
| reason_8 | 127 | | reason_8 | 24 | | reason_8 | 32 |
| bridge | 117 | | bridge | 22 | | bridge | 30 |
| product | 114 | | product | 23 | | product | 30 |

### Interactions

Not tracked this window (`listicle:interaction` deployed at window close). First data expected next pull: symptom-picker presses (ADHD `symptom_*`) and segment toggles (Brain-ageing `segment_*`). Note the pre-selected default segment is under-counted (only switches fire).

### Artifact data block

```json
{
  "window": "2026-07-24 → 2026-07-27 (~3.5d)",
  "funnels": [
    { "name": "ADHD", "visitors": 713, "pv": 796,
      "steps": [["Hero / entry",713],["Symptom explainer",318],["Stats band",255],["Reason 2",219],["Reason 3",200],["Reason 4",191],["Reason 5",172],["Review strip",152],["Reason 7",146],["Reason 8",127],["Bridge",117],["Product",114]] },
    { "name": "Brain-ageing", "visitors": 226, "pv": 247,
      "steps": [["Hero / entry",226],["Reason 0",78],["Segment toggle",49],["Stats band",39],["Reason 3",35],["Reason 4",33],["Reason 5",28],["Review strip",27],["Reason 7",28],["Reason 8",24],["Bridge",22],["Product",23]] },
    { "name": "Productivity", "visitors": 545, "pv": 580,
      "steps": [["Hero / entry",545],["Reason 0",91],["Reason 1",60],["Stats band",54],["Reason 3",51],["Reason 4",49],["Reason 5",42],["Review strip",39],["Reason 7",37],["Reason 8",32],["Bridge",30],["Product",30]] }
  ],
  "cta": [
    { "section": "hero",    "ADHD": [21,713], "Brain-ageing": [10,226], "Productivity": [4,545] },
    { "section": "sticky",  "ADHD": [21,713], "Brain-ageing": [12,226], "Productivity": [5,545] },
    { "section": "bridge",  "ADHD": [6,713],  "Brain-ageing": [3,226],  "Productivity": [1,545] },
    { "section": "product", "ADHD": [3,713],  "Brain-ageing": [1,226],  "Productivity": [3,545] }
  ]
}
```

---

## Snapshot — 2026-07-28 → 2026-07-29 (first first-party orders)

First pull of **first-party order attribution** (Shopify, query 6). CTAs now route at the funnel, so purchases carry `_listicle_origin` onto the order. Pulled 29 Jul AM; source = Shopify Admin API on prod store (`conka-6770.myshopify.com`), all orders `created_at:>=2026-07-24`, filtered to those with `_listicle_origin`.

### First-party listicle orders

| Order | Created | Value | Persona | Section | Cadence |
|-------|---------|------:|---------|---------|---------|
| #3701 | 2026-07-28 10:02Z | £42.54 | ADHD | sticky | Monthly Single Subscription |
| #3707 | 2026-07-28 16:03Z | £36.00 | ADHD | sticky | Monthly Single Subscription |
| #3711 | 2026-07-29 09:14Z | £135.00 | ADHD | hero | Quarterly Dual Subscription |

**Totals:** 3 orders · £213.54 · 100% ADHD · sticky ×2 / hero ×1 · all funnel subscriptions.

- Of 39 total store orders since 24 Jul, **3** carried `_listicle_origin`; **0** carried a `persona:`/`listicle` tag (tag write is broken — see known gap). No listicle orders dated 24–27 Jul: the funnel-routing + origin capture only went live ~27 Jul, which is exactly why the baseline above is Meta-only.
- **ADHD flips the ranking.** It was the *worst* persona on Meta CVR (0.5%) yet is the only one producing first-party funnel sales so far. n=3 over ~2 days — directional, not conclusive.
- **Section matches the click data.** 2 of 3 came via the sticky bar, 1 via the hero — the two zones that dominate CTA clicks in the baseline (§04). Body reasons still don't close.
- **Not yet computable:** per-persona first-party CVR needs funnel *entries* per persona over the same window (not pulled). Brain-ageing and Productivity had 0 first-party orders this window.

---

## Snapshot — 2026-07-24 → 2026-07-31 (end of week 1)

End-of-week pull. Source = Shopify Admin API (query 6, all orders `created_at:>=2026-07-24`, filtered to `_listicle_origin`) + Vercel visits by requestPath. **Ad spend doubled to £200/day per listicle** (£600/day total, up from £300) at ~4pm 30 Jul — too fresh to read (only #3726 and #3732 landed after it; 31 Jul is a partial day).

### First-party listicle orders (all 6 to date)

| Order | Created | Value | Persona | Section | Cadence |
|-------|---------|------:|---------|---------|---------|
| #3701 | 2026-07-28 10:02Z | £42.54 | ADHD | sticky | Monthly Single Subscription |
| #3707 | 2026-07-28 16:03Z | £36.00 | ADHD | sticky | Monthly Single Subscription |
| #3711 | 2026-07-29 09:14Z | £135.00 | ADHD | hero | Quarterly Dual Subscription |
| #3722 | 2026-07-30 07:20Z | £149.99 | Productivity | sticky | Quarterly Dual Subscription |
| #3726 | 2026-07-30 18:45Z | £135.00 | Productivity | sticky | Quarterly Dual Subscription |
| #3732 | 2026-07-31 07:00Z | £74.99 | ADHD | sticky | Monthly Dual Subscription |

**Totals:** 6 orders · £573.52 · AOV £95.59 · ADHD ×4 (£288.53) / Productivity ×2 (£284.99) / Brain-ageing ×0 · section sticky ×5 / hero ×1 · all funnel subscriptions.

- Of 61 total store orders since 24 Jul, **6** carried `_listicle_origin`; still **0** carried a `persona:`/`listicle` tag (tag write still broken — see known gap).
- **Productivity broke through** — its first two first-party orders, both high-value quarterly duals off the sticky bar on 30 Jul. Fewest orders, biggest baskets (AOV £142.50).
- **Brain-ageing = 0 *tagged* orders** all week. *[Superseded 31 Jul: this was misread as a red flag. Meta logged ~6 Brain-ageing orders and store incrementality confirms real lift — the tag just missed them. Brain-ageing converts best per visitor (1.10%) but its clicks cost ~3× ADHD's: expensive, not dead. See the reconciliation subsection below.]*
- **Sticky bar closes.** 5 of 6 orders came via the persistent sticky CTA, 1 via the hero. Zero from body reasons or the product block. Matches the baseline CTA-click concentration (§04).

### First-party CVR & revenue-per-visitor (matched 28–31 Jul window)

> **Superseded 31 Jul —** these first-party CVRs are floor values (~1 in 5 of real orders); do **not** quote them as the per-page conversion rate. Use the **Meta CVR + incrementality** in the reconciliation subsection below instead. Kept here as the record of the tagged slice.

Denominator = Vercel visitors 28–31 Jul (funnel-routing live; 31 Jul partial). CVR is a floor — only counts orders that carried the origin all the way through checkout.

| Persona | Visitors (28–31) | Orders | CVR | AOV | Rev/visitor |
|---------|-----------------:|-------:|----:|----:|------------:|
| Productivity | 375 | 2 | 0.53% | £142.50 | **£0.76** |
| ADHD | 889 | 4 | 0.45% | £72.13 | £0.32 |
| Brain-ageing | 299 | 0 | 0.00% | — | £0.00 |
| **All three** | 1,563 | 6 | 0.38% | £95.59 | £0.37 |

CVR is close across all three (0.45–0.53%), but AOV swings 2× — so **revenue-per-visitor** (not CVR) is the honest "which page makes money" number: Productivity earns 2.4× ADHD per visitor on its quarterly-dual buyers (n=2, thin).

### Week-1 traffic (Vercel visits, 24–31 Jul)

| Persona | Visitors | Share |
|---------|---------:|------:|
| ADHD | 1,863 | 54% |
| Productivity | 1,019 | 29% |
| Brain-ageing | 579 | 17% |
| **Total** | 3,461 | 100% |

### Scroll funnel — re-pulled (the Productivity rebuild paid off)

The Productivity listicle was **repositioned to the founder/exec angle on 27 Jul** (commit `2aaba16c`). ADHD and Brain-ageing were not structurally changed. So scroll depth is windowed accordingly: **ADHD/Brain full week (24–31 Jul); Productivity post-rebuild only (28–31 Jul)** for a clean read of the new page. Entry = Vercel visits; sections = `listicle:section_viewed` visitors (undercount vs Vercel, equal on every page).

| Page | Entry→first section | Reach product | Window |
|------|--------------------:|--------------:|--------|
| ADHD | 44% | 16% | 24–31 Jul (full) |
| Brain-ageing | 32% | 9% | 24–31 Jul (full) |
| Productivity **(new)** | **33%** | **18%** | 28–31 Jul (post-rebuild) |
| Productivity (old, 24–27) | 17% | 6% | baseline |

- **The reposition roughly doubled Productivity's entry→first-section retention (17% → 33%) and tripled reach-to-product (6% → 18%)** — it now out-retains ADHD at the deep end. This is the standout on-page win of the week.
- New Productivity section order (post-rebuild): reason_0 125 · reason_1 110 · statsBand_2 99 · reason_3 97 · reason_4 93 · reason_5 85 · reason_6 79 · reviewStrip_7 67 · reason_8 65 · bridge 64 · product 67 (denominator 375).
- **CTA-click matrix (§05) not re-pulled** — still the 24–27 Jul baseline, and it predates the Productivity rebuild. Re-pull if you want post-rebuild click zones.

### Timeline of key changes (now in the artifact)

`24 Jul` trial live £300/day + section tracking + CTA→funnel attribution · `27 Jul` Productivity rebuilt (founder angle) + order-origin capture hardened (attribution reliable) · `30 Jul ~4pm` spend doubled to £600/day (£200/listicle) · `31 Jul` end of week 1 (this snapshot).

### Artifact

Dashboard refreshed to end-of-week-1 (first-party promoted to the headline, revenue-per-visitor added, Meta baseline demoted to a reconciliation section): same URL <https://claude.ai/code/artifact/b69a0128-2f0f-4078-a91f-b58d5f8196c4>. The 6-order table and CVR/traffic tables are transcribed straight from this snapshot; the `funnels`/`cta` script arrays are unchanged (baseline behaviour).

### Incrementality & attribution reconciliation (added — supersedes the "first-party is the truth" framing above)

**Correction:** the first-party `_listicle_origin` count is a severe *undercount*, not the source of truth. It only rides the funnel→checkout path, so it misses come-back-and-buy-direct, cross-device, and the checkout-cookie split (`myshopify.com`). Do **not** read the 6 tagged orders as "what the listicles sold."

**Store-level incrementality** (Shopify orders, new-demand = new subs + one-time, excluding recurring renewals):

| Week | New-customer orders | New-demand revenue | Listicle-tagged | Total orders |
|------|--------------------:|-------------------:|----------------:|-------------:|
| 3–10 Jul | 3 | £532 | 0 | 20 |
| 10–17 Jul | 2 | £197 | 0 | 16 |
| 17–24 Jul | 4 | £274 | 0 | 20 |
| **24–31 Jul (trial)** | **34** | **£3,592** | 6 | 62 |

Pre-trial baseline ≈ 3 new customers / £334 a week; renewals held flat (14–16 → 20). Trial-week jump to 34 new customers coincides exactly with the ad spend. **Incremental ≈ 38 orders / ≈ £3,258** on **£2,202** confirmed Meta spend (24–30) → **CPA ~£58–71, first-order ROAS ~1.5×** (positive before any renewals; subscriptions recur so LTV higher).

**Three lenses on the same week:** tagged **6** (floor, ~1 in 5) · Meta **25** · store lift **~38**. Meta's 25 is *credible* — it sits just under the incrementality, not inflated. Trust Meta + incrementality for volume; use first-party only for *which section closes*.

**Per-listicle (Meta, 24–30, best per-persona signal):** ADHD 1,749 visitors · 10 orders · **0.57% CVR** · £72.77 CPA · £0.42/visitor · Productivity 956 · 9 · **0.94%** · £82.22 · £0.77/visitor · Brain-ageing 547 · 6 · **1.10%** · £122.39 · £1.34/visitor. (Meta CVR = Meta orders ÷ page visitors matched to 24–30; numerator includes view-through so it's a proxy.) **Twist:** Brain-ageing *converts best per visitor* but has the worst CPA because its audience costs ~3× ADHD's per click — an audience-cost problem, not a page problem. So Brain-ageing is *expensive, not dead*, not the "zero" the tag implied.

**Caveat:** incrementality assumes the 3 listicle campaigns are the dominant new paid spend that week (confirmed by Rudh). Pull scripts: `scratchpad/pull-listicle-orders.mjs` (tagged orders) and `scratchpad/weekly-orders.mjs` (weekly new-demand).
