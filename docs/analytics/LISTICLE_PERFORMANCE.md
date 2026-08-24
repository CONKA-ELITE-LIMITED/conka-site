# Listicle Performance Log

> **Living data log for the `/go/*` listicle landing pages.** Append a dated snapshot each time we pull Vercel Web Analytics; the JSON block in each snapshot feeds the dashboard artifact directly. This is the data home — the [2026-07 ad-spend sprint doc](../sprints/2026-07-listicle-ad-spend.md) is the narrative context.

> ## ⚠️ 2026-08-24 — routing correction: there was never a funnel epoch
>
> **Checked against git while pinning the CTA routing epoch for SCRUM-1242. The funnel framing below is wrong and was never true.**
>
> **What the code actually says.** Listicle CTAs have pointed at the **PDPs** continuously since **2026-07-24** (`b224d714`, "attribute listicle CTA clicks through to purchase"), which is when `withSrc(buyHref, …)` replaced the in-page anchor. The `PDP_HREF` map itself landed a day earlier in `76ffe504` (2026-07-23). A pickaxe search over the whole history of `app/components/go/`, `app/go/` and `app/lib/landings/` returns **no commit that ever put a `/funnel` href in a listicle**. So the claim below that "listicle CTAs were re-routed to the funnel (not the classic PDP)" from ~27 Jul describes something that never shipped, and there is no re-route date to annotate a chart with.
>
> **Live routing.** CTA → `/conka-flow` · `/conka-clarity` · `/conka-both` (by the buy box's `productHeroId`), with `?src=<slug>-<section>` appended. Hero, bridge and sticky CTAs all use it.
>
> **Attribution is path-independent, which is why it kept working.** `?src=` is read on landing and written through to `sessionStorage` (`getListicleSrc`, `app/lib/analytics.ts`), so `getPurchaseOrigin()` still resolves at add-to-cart time even after in-PDP navigation drops the param. `CartContext` (line ~181) writes it as the `_listicle_origin` cart attribute, which rides Shopify's hosted checkout onto the order. None of that depends on which page the CTA landed on.
>
> **Two knock-on corrections to the text below:**
> - "the old `?src=` → `purchase:add_to_cart.source` path … stays ~zero because the funnel skips the cart" is **wrong twice over**. The funnel was never in the path, and `getPurchaseSource()` returns the literal `"listicle"` whenever a `src` token is present. If that path really is reading ~zero, it is a **bug to investigate**, not expected behaviour.
> - The **~1-in-5 floor is still real data** (6 tagged vs 25 Meta-attributed vs ~38 store-lift in week 1) — but its stated *cause* is wrong. The undercount cannot be "the funnel bypasses the cart". The live candidates are cross-device, come-back-later direct visits, the `myshopify.com` checkout-cookie split, and `sessionStorage` loss between landing and purchase. Treat the ratio as observed, the explanation as open.
>
> **For SCRUM-1242:** no epoch annotation is needed for a funnel-to-PDP re-route. The only routing boundary worth marking is **2026-07-24**, before which listicle CTAs scrolled to the in-page buy zone rather than handing off to a PDP. Trends may be read continuously across everything after that date.

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

> **⚠️ First-party is a FLOOR, not the truth (learned 2026-07-31).** The `_listicle_origin` count only rides the funnel→checkout path, so it captures roughly **half** of the orders the listicles actually drive (~1 in 5 at the start of the trial; 51% by 21 Aug as more buyers rode the funnel→checkout path). It misses come-back-and-buy-direct, cross-device, and the checkout-cookie split (`myshopify.com`). **Do not read the tagged-order count as "what the listicles sold."** For *volume*, use **store-level incrementality** (query 7) and **Meta Ads Manager** (query 8); use first-party only for *which section closes*. Week 1 proof: 6 tagged vs 25 Meta-attributed vs ~38 store-lift orders — the truth is the high end. Full working in the *Incrementality & attribution reconciliation* subsection of the 24–31 Jul snapshot below.

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

`24 Jul` trial live £300/day + section tracking + CTA→funnel attribution · `27 Jul` Productivity rebuilt (founder angle) + order-origin capture hardened (attribution reliable) · `30 Jul ~4pm` spend doubled to £600/day (£200/listicle) · `31 Jul 2:30pm` all 3 listicles aligned to Flow-primary offer — CTA + product hero lead with Flow, not Both (PR #409) · `31 Jul` end of week 1 (this snapshot) · `2 Aug 6:40pm` Productivity listicle: added a "first week free" offer badge to message-match the free-week ad angle (green "+1 week of free brain supplements" pill above the hero CTA, "+8 free shots" sub-line under the sticky CTA); copy/layout only, no tracking change. · `3 Aug 11:30am` Same offer badge extended to the ADHD and Brain-ageing listicles (identical hero pill "+1 week of free brain supplements on your first order" + "+8 free shots" sticky sub-line); copy only, no tracking change.

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

---

## Snapshot — 2026-07-31 → 2026-08-03 (end of first weekend at £600/day)

Pulled **3 Aug PM** (end of Monday, weekend passed). Sources: Vercel Web Analytics (visits + section/CTA events, new window 31 Jul–3 Aug), Shopify Admin API (query 6 tagged + query 7 incrementality, `created_at:>=2026-07-03`), and Meta Ads Manager (all three `Conka | TOF UK | * Listicle` campaigns, **24 Jul – 3 Aug**, screenshot from Rudh). Spend has run at **£600/day (£200/listicle)** since ~4pm 30 Jul — this is the first read of the doubled-spend period. Framed cumulatively (trial to date, 24 Jul – 3 Aug) since Meta reports the full window; 3 Aug is a partial day.

**Headline: volume roughly doubled at flat CPA.** Meta orders 25 → **54**, first-party tagged 6 → **22**, spend £2.2k → **£4.5k** — and blended Meta CPA *held* (~£88 → **£84**). Doubling the budget did not blow up efficiency. First-order ROAS compressed toward ~1.1× on the newest (still-maturing) spend, but subscriptions recur so LTV runs higher.

### Cumulative Meta view (24 Jul – 3 Aug, the volume + per-persona signal)

| Listicle | Visitors | Meta orders | Meta CVR | CPA | Spend | £/visitor |
|----------|---------:|------------:|---------:|----:|------:|----------:|
| ADHD | 3,410 | 21 | 0.62% | **£72.06** | £1,513.25 | £0.44 |
| Productivity | 1,595 | 17 | 1.07% | £89.24 | £1,517.10 | £0.95 |
| Brain-ageing | 1,032 | 16 | **1.55%** | £94.12 | £1,505.86 | £1.46 |
| **All three** | **6,037** | **54** | **0.89%** | **~£84** | **£4,536** | £0.75 |

- **Rankings settled, and the week-1 "twist" strengthened.** Brain-ageing is now the **best converter (1.55%)** and its CPA fell from £122 → **£94** as it accrued volume — *expensive, not dead*, and closing the gap. ADHD stays the cheap-clicks volume play (£72 CPA, lowest CVR). Productivity sits in the middle on rate but leads on first-party revenue (below).
- Meta CVR = Meta orders ÷ matched-window visitors; numerator includes view-through, so read as a proxy.

### First-party tagged orders — 22 to date (up from 6)

| | Orders | Revenue | vs week 1 |
|--|-------:|--------:|-----------|
| **Productivity** | 10 | £800.45 | was 2 — now the leader |
| **ADHD** | 9 | £551.47 | was 4 |
| **Brain-ageing** | 3 | £108.00 | was 0 — broke through |
| **Total** | **22** | **£1,459.92** | was 6 / £573.52 |

The 16 new tagged orders (31 Jul–2 Aug): #3737, #3739, #3740, #3743, #3744, #3746, #3748, #3749, #3753, #3754, #3755, #3757, #3758, #3759, #3760, #3761. Cadence is mostly monthly singles/duals with five quarterly duals (#3711/#3722/#3726/#3753/#3759) and one one-time (#3743).

- **Section split flipped toward the hero.** All 22: **sticky ×11, hero ×10, bridge ×1** (week 1 was sticky ×5 / hero ×1). The hero surge tracks the CTA-click data below and lands right after the **Flow-offer alignment (31 Jul)** + the **hero "first week free" offer badge** (Productivity 2 Aug, all three 3 Aug). Body reasons/product block still close ~nothing.
- **Tag capture improved.** 22 tagged vs 54 Meta ≈ **41%**, up from ~20% in week 1 — more buyers are now riding the funnel→checkout path the tag rides (plausibly the offer badge/Flow alignment). Still a floor, not the truth.

### Store-level incrementality (new-demand orders, excl. renewals; re-pulled 3 Aug)

| Week | New-demand orders | New-customer orders | New-demand rev | Tagged | Renewals |
|------|------------------:|--------------------:|---------------:|-------:|---------:|
| 3–10 Jul | 6 | 3 | £532 | 0 | 14 |
| 10–17 Jul | 2 | 2 | £197 | 0 | 15 |
| 17–24 Jul | 4 | 4 | £274 | 0 | 16 |
| 24–31 Jul (trial) | 38 | 30* | £3,341 | 5 | 19 |
| **31 Jul–3 Aug (4d, partial)** | **29** | **27** | **£1,842** | 17 | 9 |

\* The 24–31 new-*customer* count reads 30 on this re-pull vs the **34** published in the week-1 snapshot: `customer.numberOfOrders==1` is evaluated *now*, so week-1 first-timers who have since reordered drop out. New-demand orders (excl. renewals) is the reproducible metric; new-customer is a decaying floor. Renewals held flat throughout — the lift is genuinely new demand.

- **The doubled spend is sustaining/accelerating acquisition.** 29 new-demand orders in just **4 partial days** already approaches the prior full trial week's 38, i.e. the daily new-demand pace rose with the £600/day.
- **Three lenses (24 Jul – 3 Aug):** tagged **22** · Meta **54** · store lift **~60** (incremental new-demand over the ~4/week baseline). Coherent and ordered as expected (tag ≤ Meta ≤ lift). Trust Meta + lift for volume; first-party for *which section closes*.

### Scroll funnel — refreshed to the current window (31 Jul–3 Aug, post-rebuild + post-Flow-alignment for all three)

Reach-to-product: **ADHD 14% · Brain-ageing 8% · Productivity 7%**. Depth compressed slightly vs the small post-rebuild Productivity window (was 18%) — expected: 2× spend pulled in broader, colder top-of-funnel traffic, so scroll depth normalised down across all pages. Hero + sticky still do all the converting; the body is scroll, not clicks.

### CTA clicks — finally re-pulled post-rebuild (31 Jul–3 Aug)

| Section | ADHD | Brain-ageing | Productivity |
|---------|-----:|-------------:|-------------:|
| hero | **81** | 15 | 18 |
| sticky | 45 | 14 | **40** |
| bridge | 16 | 2 | 2 |
| product | 5 | 0 | 1 |

- **ADHD's clicks moved to the hero** (81 vs 45 sticky — was 21/21 at baseline); **Productivity concentrates on the sticky bar** (40 vs 18). Brain-ageing balanced. Consistent with the tagged-order hero surge.

### Timeline additions

`2 Aug 6:40pm` Productivity offer badge (hero "+1 week free" pill + "+8 free shots" sticky sub-line) · `3 Aug 11:30am` same badge extended to ADHD + Brain-ageing · `3 Aug PM` end of first weekend at £600/day (this snapshot).

### Artifact

Dashboard refreshed to the trial-to-date view (window → 24 Jul–3 Aug; timeline extended; tagged table → 22 orders; Meta table, funnels and CTA matrix repulled). Same URL <https://claude.ai/code/artifact/b69a0128-2f0f-4078-a91f-b58d5f8196c4>.

### Artifact data block

```json
{
  "window": "2026-07-31 → 2026-08-03 (cumulative 24 Jul–3 Aug)",
  "funnels": [
    { "name": "ADHD", "visitors": 1661, "pv": 1859, "window": "31 Jul–3 Aug",
      "steps": [["Hero / entry",1661],["Symptom explainer",690],["Stats band",517],["Reason 2",444],["Reason 3",389],["Reason 4",367],["Reason 5",322],["Review strip",296],["Reason 7",293],["Reason 8",252],["Bridge",229],["Product",229]] },
    { "name": "Brain-ageing", "visitors": 485, "pv": 523, "window": "31 Jul–3 Aug",
      "steps": [["Hero / entry",485],["Reason 0",107],["Segment toggle",80],["Stats band",66],["Reason 3",53],["Reason 4",47],["Reason 5",42],["Review strip",38],["Reason 7",38],["Reason 8",40],["Bridge",37],["Product",37]] },
    { "name": "Productivity", "visitors": 639, "pv": 676, "window": "31 Jul–3 Aug",
      "steps": [["Hero / entry",639],["Reason 0",187],["Reason 1",139],["Stats band",118],["Reason 3",106],["Reason 4",94],["Reason 5",81],["Reason 6",72],["Review strip",59],["Reason 8",55],["Bridge",49],["Product",47]] }
  ],
  "cta": [
    { "section": "hero",    "ADHD": [81,1661], "Brain-ageing": [15,485], "Productivity": [18,639] },
    { "section": "sticky",  "ADHD": [45,1661], "Brain-ageing": [14,485], "Productivity": [40,639] },
    { "section": "bridge",  "ADHD": [16,1661], "Brain-ageing": [2,485],  "Productivity": [2,639] },
    { "section": "product", "ADHD": [5,1661],  "Brain-ageing": [0,485],  "Productivity": [1,639] }
  ]
}
```

---

## Snapshot — 2026-08-03 → 2026-08-10 (trial to date, second full week at £600/day)

Pulled **10 Aug AM**. Sources: Meta Ads Manager (all three `Conka | TOF UK | * Listicle` campaigns, **24 Jul – 10 Aug**, screenshot from Rudh), Shopify Admin API (query 6 tagged + query 7 incrementality, `created_at:>=2026-07-03`), and Vercel Web Analytics (visits + section events). Framed cumulatively (24 Jul – 10 Aug) since Meta reports the full window. Budgets are **no longer split evenly** — ADHD is now £300/day, Brain-ageing £200/day, Productivity £100/day (weighted toward the cheap-clicks workhorse).

**Headline: volume ~doubled again at a slightly looser CPA.** Meta orders 54 → **94**, first-party tagged 22 → **42**, spend £4.5k → **£8.5k** — blended Meta nCPA drifted £84 → **£90**, still under the £100 target. The efficiency spread widened: ADHD holds at **£73**, but Productivity landed **right on £100** and Brain-ageing has crept **just over to £109** as it accrued volume.

### Cumulative Meta view (24 Jul – 10 Aug, the volume + per-persona signal)

| Listicle | Visitors | Meta orders | Meta CVR | nCPA | Spend | £/visitor |
|----------|---------:|------------:|---------:|-----:|------:|----------:|
| ADHD | 6,147 | 43 | 0.70% | **£72.75** | £3,128.27 | £0.51 |
| Productivity | 2,291 | 25 | 1.09% | £100.32 | £2,507.96 | £1.09 |
| Brain-ageing | 1,986 | 26 | **1.31%** | £108.85 | £2,830.01 | £1.42 |
| **All three** | **10,424** | **94** | **0.90%** | **~£90** | **£8,466.24** | £0.81 |

- **ADHD is the efficient engine** — cheapest nCPA (£73) and cheapest clicks (£0.51/visitor), which is why it now carries the biggest budget (£300/day). Lowest CVR (0.70%) but volume more than compensates.
- **Brain-ageing still converts best per visitor (1.31%)** but its clicks cost ~2.8× ADHD's, so its nCPA is the worst and has now nudged over target. Its CVR eased from 1.55% (to 3 Aug) as more/colder volume came in — expected.
- **Productivity sits in the middle** on rate (1.09%) and is exactly on the £100 line; it still leads on first-party AOV/revenue (below).
- Meta CVR = Meta orders ÷ matched-window visitors; numerator includes view-through, so read as a proxy.

### First-party tagged orders — 42 to date (up from 22)

| | Orders | Revenue | AOV | vs 3 Aug |
|--|-------:|--------:|----:|----------|
| **ADHD** | 23 | £1,431.89 | £62.26 | was 9 |
| **Productivity** | 13 | £1,101.95 | £84.77 | was 10 |
| **Brain-ageing** | 6 | £289.99 | £48.33 | was 3 |
| **Total** | **42** | **£2,823.83** | **£67.23** | was 22 / £1,459.92 |

- **Section split:** sticky ×22, hero ×16, bridge ×4, product ×0. Hero + sticky still do essentially all the closing; the two new bridge orders (#3780, #3819, #3820) are the only body-block closes all trial.
- **Cadence (of the 42):** monthly ×31 (£1,476.90), quarterly ×10 (£1,283.94), one-time ×1 (£62.99). Ten quarterly subs carry nearly as much revenue as all 31 monthly ones — the quarterly duals remain the revenue engine.
- **Tag capture ≈ 45%** (42 tagged ÷ 94 Meta), up from ~41%. Still a floor — the `persona:`/`listicle` tag write remains broken (0 orders carry it; filter on the `_listicle_origin` note attribute, not the tag).

### Store-level incrementality (new-demand orders, excl. renewals = billing cycle #2+; re-pulled 10 Aug)

| Week | New-demand orders | New-demand rev | Tagged | Renewals |
|------|------------------:|---------------:|-------:|---------:|
| 3–10 Jul | 6 | £532 | 0 | 16 |
| 10–17 Jul | 3 | £237 | 0 | 16 |
| 17–24 Jul | 5 | £394 | 0 | 20 |
| 24–31 Jul (trial) | 47 | £3,878 | 9 | 23 |
| 31 Jul–7 Aug | 55 | £3,824 | 31 | 21 |
| 7–10 Aug (3d, partial) | 19 | £1,682 | 9 | 6 |

- Pre-trial baseline ≈ **5 new-demand orders / week**; renewals held flat (16–20) throughout, so the lift is genuinely new demand, not churn timing. New-demand pace has held at ~50/week across both full trial weeks — the doubled £600/day spend is **sustaining** acquisition, not decaying.
- **Three lenses (24 Jul – 10 Aug):** tagged **42** (floor) · Meta **94** · store new-demand lift **~110** over the ~5/week baseline. Ordered as expected (tag ≤ Meta ≤ lift) and coherent. Trust Meta + lift for volume; first-party for *which section closes*.
- **Caveat:** the new-demand classifier here is coarse (total orders minus billing-cycle-#2+ renewals), so it runs a touch higher than the whitelisted "new subs + one-time" method used in earlier snapshots. Directionally the lift clearly exceeds Meta's 94; treat ~110 as an upper-ish estimate, not a precise count.

### Scroll funnel — refreshed as a drop-off (31 Jul–10 Aug)

Normalised to a 5-step funnel (% of Vercel page **entries** still on the page at each step). The cliff is the **first scroll** — most visitors leave before reason 1 — after which the taper is gentle and consistent across pages.

| Step | ADHD | Productivity | Brain-ageing |
|------|-----:|-------------:|-------------:|
| Entry | 100% | 100% | 100% |
| 1st section | 43% | 41% | 30% |
| Stats band | 32% | 24% | 18% |
| Reviews | 18% | 13% | 10% |
| **Product** | **13%** | **11%** | **8%** |

- **ADHD retains best at every depth**; Brain-ageing loses 70% on the first scroll (vs ADHD's 57%). Hero + sticky continue to do the converting, so low reach is not itself a problem — the body is scroll, not clicks. Full CTA-by-section not re-pulled this snapshot.
- Entries: ADHD 4,398 · Productivity 1,335 · Brain-ageing 1,440 (Vercel visits, 31 Jul–10 Aug).

### Timeline additions

`3 Aug PM` end of first weekend at £600/day · `8 Aug (Fri)` **upsell flow added / improved** and **budget rebalanced to £300 ADHD · £200 Brain-ageing · £100 Productivity** (off the earlier even split, weighting toward ADHD as the cheapest-nCPA engine) · `10 Aug` end of second full week (this snapshot).

### Artifact

Dashboard refreshed to 24 Jul – 10 Aug (blended nCPA → £90; spend £8,466 / 94 purchases; per-listicle bars now show Brain-ageing over the £100 line; traffic, CVR, cadence, AOV and reach repulled). Same URL <https://claude.ai/code/artifact/b69a0128-2f0f-4078-a91f-b58d5f8196c4>.

---

## Snapshot — 2026-08-10 → 2026-08-21 (week 4; efficiency breaks target)

Pulled **21 Aug AM**. Sources: Meta Ads Manager (screenshot from Rudh, all three campaigns), Shopify Admin API (queries 6 + 7, `created_at:>=2026-07-03`), Vercel Web Analytics (visits + section/CTA events). Cumulative framing 24 Jul – 21 Aug.

**Headline: volume is still incremental, but the money stopped working.** Marginal CPA on spend since 10 Aug is **£141.73** against the £100 target, and first-order ROAS on that spend is **0.88×** (was ~1.5× in week 1). The damage sits in the biggest budget: ADHD is buying purchases at **£169**. Brain-ageing — the *smallest* budget — is the only page under target at **£90**.

> **⚠️ Two corrections in this pull.** (1) A **week-bucketing bug** in `weekly-orders.mjs` counted each boundary day in *both* adjacent weeks, inflating every previously published weekly new-demand figure. Fixed (`< end + "T00:00:00Z"`); corrected weeks now reconcile exactly with the order-level pull (tagged sums to 69). The `weeks` array is now generated rolling from `SINCE` so it no longer needs hand-editing. (2) **Brain-ageing is on £100/day, not the £200 recorded on 8 Aug** — Ads Manager shows £100 and its spend since 10 Aug (~£98/day) confirms it. Total daily is **£500, not £600**.

### Meta — cumulative vs marginal (the number that matters)

Cumulative CPA averages four weeks together and lags a change in efficiency by design. **Marginal** = the spend/purchase delta since the 10 Aug pull.

| Listicle | Daily | Spend | Purchases | Cum. CPA | **Marginal CPA** | Meta CVR | £/visitor |
|----------|------:|------:|----------:|---------:|-----------------:|---------:|----------:|
| ADHD | £300 | £6,666.76 | 64 | £104.17 | **£168.50** | 0.66% | £0.69 |
| Productivity | £100 | £3,557.99 | 32 | £111.19 | **£150.00** | 1.02% | £1.13 |
| Brain-ageing | £100 | £3,910.50 | 38 | £102.91 | **£90.04** | 1.38% | £1.42 |
| **All three** | **£500** | **£14,135.25** | **134** | **£105.49** | **£141.73** | 0.86% | £0.91 |

Screenshot carried no visible date range; per-campaign spend deltas since 10 Aug work out at £322 / £95 / £98 a day against stated budgets of £300 / £100 / £100, which fits a cumulative trial-to-date window. Sanity-check on the next pull.

### Why the cost moved (CPA = click price ÷ conversion)

| Page | £/visitor | CVR | CPA | Driver |
|------|-----------|-----|-----|--------|
| ADHD | £0.51 → £0.97 (**+91%**) | 0.70% → 0.58% (−18%) | £73 → £169 | **Click price** (auction / fatigue) |
| Productivity | £1.09 → £1.20 (+9%) | 1.09% → 0.80% (**−27%**) | £100 → £150 | **Conversion** |
| Brain-ageing | £1.42 → £1.31 (−8%) | 1.31% → 1.45% (+11%) | £109 → £90 | Both improved |

- **ADHD is an auction problem.** 512,903 impressions against 177,163 reach ≈ 2.9 frequency, the highest of the three. Clicks nearly doubled in price; conversion softened but is secondary.
- **Productivity is a conversion problem.** Click price barely moved; conversion fell 27%.
- **Brain-ageing is healthy on both axes** and is the only page worth more budget on current numbers.

> **⚠️ Confound — the purchase path was rebuilt mid-trial.** Per `docs/CHANGELOG.md`, **all three PDP heroes went V3 on 11–12 Aug** (plus new plan-picker + subscription box), and **listicle buy zones moved to the V3 PDP hero on 20 Aug**. Neither was recorded as a trial event or run as a conversion test, and both sit inside the window where ADHD (−18%) and Productivity (−27%) lost conversion. Not proven — Brain-ageing's conversion *rose* 11% over the same window on the same path — but rule it out before blaming the auction alone. The 20 Aug change also **resets the baseline**: everything from 21 Aug measures a different page.

### First-party tagged orders — 69 to date (up from 42)

| | Orders | Revenue | AOV | vs 10 Aug |
|--|-------:|--------:|----:|-----------|
| **ADHD** | 41 | £2,408.25 | £58.74 | was 23 |
| **Productivity** | 15 | £1,276.94 | £85.13 | was 13 |
| **Brain-ageing** | 13 | £769.97 | £59.23 | was 6 |
| **Total** | **69** | **£4,455.16** | **£64.57** | was 42 / £2,823.83 |

- **Section split (all 69):** sticky ×35 · hero ×29 · bridge ×5 · **product ×0**. Hero + sticky close 93%; the end-of-page product block has never closed an order.
- **Cadence (all 69):** monthly ×53 (£2,573.29) · quarterly ×13 (£1,678.92) · one-time ×3 (£202.95). Quarterly is 19% of orders and 38% of revenue.
- **Current window (10–21 Aug), 27 orders / £1,631.33:** ADHD 18 (£976.36, 0.49% CVR, £0.27/visitor) · Brain-ageing 7 (£479.98, **0.85%**, **£0.58**) · Productivity 2 (£174.99, 0.23%, £0.20). Productivity has effectively stalled since its budget cut.
- **Tag capture ≈ 51%** (69 ÷ 134 Meta), up from ~45%. Still a floor. `persona:`/`listicle` tag write **still broken** (0 of 69) — filter on the `_listicle_origin` note attribute.

### Store-level incrementality (corrected buckets)

| Week | Total | New-demand | Renewals | Tagged | New-demand rev |
|------|------:|-----------:|---------:|-------:|---------------:|
| 3–10 Jul | 20 | 6 | 14 | 0 | £532 |
| 10–17 Jul | 17 | 2 | 15 | 0 | £197 |
| 17–24 Jul | 20 | 4 | 16 | 0 | £274 |
| 24–31 Jul (trial) | 58 | 39 | 19 | 5 | £3,391 |
| 31 Jul–7 Aug | 66 | 50 | 16 | 28 | £3,467 |
| 7–14 Aug | 46 | 32 | 14 | 18 | £2,518 |
| 14–21 Aug | 48 | 34 | 14 | 18 | £2,449 |

- Pre-trial baseline ≈ **4 new-demand orders / £334 a week**. Trial total **155 orders / £11,825**; baseline-equivalent ≈ 16 / £1,336 → **incremental ≈ 139 orders / ≈ £10,489**.
- **Shape:** peak in week 2 (50), then a step down to a **plateau at ~33/week** for two weeks. Not a slide, but a third off peak.
- Renewals flat at 14–19 throughout, so the lift is genuinely new demand.
- **Three lenses (24 Jul – 21 Aug):** tagged **69** (floor) · Meta **134** · store lift **~139**. Ordered as expected and tightly clustered.

### Traffic (Vercel, Mon-start weeks; last is ~4 partial days)

| Week of | ADHD | Productivity | Brain-ageing | Total |
|---------|-----:|-------------:|-------------:|------:|
| 27 Jul | 2,394 | 961 | 739 | 4,094 |
| 3 Aug | 2,963 | 783 | 982 | **4,728** |
| 10 Aug | 2,421 | 516 | 496 | 3,433 |
| 17 Aug* | 1,278 | 375 | 344 | 1,997* |

Cumulative 24 Jul – 21 Aug: ADHD 9,663 · Productivity 3,143 · Brain-ageing 2,757 · **15,563 total**.

### Scroll + CTA (10–21 Aug)

Reach-to-product: **ADHD 13% · Productivity 17% · Brain-ageing 10%**. First-section retention: 44% / 39% / 33%.

| Zone | ADHD | Productivity | Brain-ageing |
|------|-----:|-------------:|-------------:|
| hero | **210** | 33 | 45 |
| sticky | 180 | **66** | 30 |
| bridge | 33 | 8 | 11 |
| product | 9 | 5 | 1 |

ADHD now leads with the hero (210 vs 180 sticky); Productivity still closes on the sticky bar.

### Actions

1. **Move budget out of ADHD into Brain-ageing** — £169 vs £90 marginal CPA. The allocation is upside down.
2. **Confirm the Brain-ageing budget** — running £100/day against £200 recorded. The best page has been at half budget for two weeks.
3. **Refresh ADHD creative** — 2.9 frequency, click price +91%.
4. **Rule out the 11–12 Aug PDP rebuild** — compare funnel entry→purchase either side of 12 Aug before blaming the auction.
5. **Productivity: feed it or cut it** — worst CPA (£150), best AOV (£85), 2 tagged orders in 11 days.

### Timeline additions

`11–12 Aug` all three PDPs rebuilt to the V3 hero + new plan-picker/subscription box (not recorded as a trial event) · `~10 Aug` Brain-ageing budget appears to drop to £100/day (total £500/day) · `20 Aug` listicle buy zones upgraded to the V3 PDP hero — **resets the baseline** · `21 Aug` this pull.

### Artifact

Dashboard rebuilt around marginal CPA (verdict, KPI row, cost-per-purchase chart vs £100 target, CPA decomposition, confound panel, actions). Same URL <https://claude.ai/code/artifact/b69a0128-2f0f-4078-a91f-b58d5f8196c4>.
