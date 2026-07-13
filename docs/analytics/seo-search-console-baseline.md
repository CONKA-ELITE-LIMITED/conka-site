# SEO Baseline — Google Search Console (pre-Phase-3)

**Purpose:** A fixed "before" snapshot to measure the SEO/AEO programme against. Compare a fresh 3-month export against this in a few weeks.

**Source:** Google Search Console, `https://www.conka.io` property, Web search.
**Range:** Last 3 months, 2026-04-11 to 2026-07-10 (91 days).
**Exported:** 2026-07-13.
**State of the work at snapshot:** Phase 1 (canonical fix) and Phase 2 (per-page metadata) merged to main; Phase 3 (Product + FAQPage JSON-LD) built but not yet deployed. So this baseline mostly reflects the pre-fix site, since Google recrawls and re-ranks over weeks, not days.

Related: [seo-aeo-metadata-foundation.md](../development/featurePlans/seo-aeo-metadata-foundation.md), [CONKA_SEO_Keyword_Map_v4.md](../development/featurePlans/CONKA_SEO_Keyword_Map_v4.md).

---

## Headline totals (91 days)

| Metric | Value |
|--------|-------|
| Clicks | 1,312 |
| Impressions | 10,420 |
| Average CTR | 12.6% |
| Average position | 4.97 |
| Clicks/day | 14.4 |
| Impressions/day | 114.5 |

Trend across the window is roughly flat (620 clicks in the first half, 692 in the second). There is no organic growth trajectory yet, which is the point: the programme is meant to create one.

---

## The single most important finding: traffic is ~99% brand

Of the clicks Google attributes to named queries, **99% come from people searching the brand name** ("conka", "conka shots", "conka flow", "conka uk", "conka reviews", etc.). The site captures existing brand demand well but earns almost nothing from category / non-brand search.

Non-brand generic terms currently earn near-zero, despite being the whole target of the keyword work:

| Query | Clicks | Impressions | Position |
|-------|--------|-------------|----------|
| nootropic shots | 1 | 23 | 5.9 |
| brain shot | 0 | 5 | 1.0 |
| nootropics | 0 | 2 | 15 |
| daily nootropic | 0 | 5 | 13.6 |
| nootropic subscription | 0 | 2 | 51.5 |
| nootropics supplements | 0 | 1 | 27 |

`brain shot` sits at position 1 but with 5 impressions, confirming the keyword doc's note that the category term CONKA "owns" has almost no search volume. The winnable volume is in the terms above that currently rank 15 to 50, not 1.

**Implication for tracking:** the real success metric is non-brand impressions and clicks going from near-zero to something. Brand traffic will stay roughly flat regardless.

---

## Money pages baseline (the pages the programme targets)

| Page | Clicks | Impressions | Position | CTR |
|------|--------|-------------|----------|-----|
| Homepage `/` | 1,220 | 9,023 | 4.47 | 13.5% |
| `/science` | 26 | 3,779 | 5.09 | 0.69% |
| `/our-story` | 32 | 1,088 | 4.73 | 2.94% |
| `/why-conka` | 7 | 1,874 | 4.85 | 0.37% |
| `/ingredients` | 16 | 802 | 4.34 | 2.0% |
| `/conka-flow` | 6 | 279 | 4.07 | 2.15% |
| `/conka-clarity` | not in top pages (≈0) | | | |
| `/conka-both` | not in top pages (≈0) | | | |

Only **17 URLs across the whole site received any impression** in the 3-month window (per the Performance Pages tab, "1-10 of 17"). The homepage takes 93% of all page-clicks. The three product pages are effectively invisible in organic search: Flow scrapes 279 impressions, and Clear and Both do not register at all. That is the exact signature of the canonical bug Phase 1 fixed (every page pointed its canonical at the homepage). **The clearest single proof the fix worked will be Clear and Both appearing in this table at all, and Flow's impressions climbing.**

Note `/science` and `/why-conka` pull big impressions at near-zero CTR: they rank for informational queries that do not click through. Not a priority.

---

## Search appearance: Product snippets already present

| Appearance | Clicks | Impressions | Position | CTR |
|------------|--------|-------------|----------|-----|
| Product snippets | 91 | 389 | 2.92 | 23.4% |
| Translated results | 0 | 62 | 8.29 | 0% |

Google already generates Product snippets for the site (likely via the Shopping/Merchant feed, since the site carried no JSON-LD). These convert strongly (23.4% CTR at position 2.9). **Watch this row after Phase 3 ships:** the new `Product` JSON-LD on the three PDPs should widen and reinforce this, and a `Merchant listings` enhancement may appear in the Enhancements report.

---

## Geography and device

**Geography (clicks):** United Kingdom 975 (74% of clicks, position 3.58) dominates, as expected. United States is second at 75 clicks but weak (2,286 impressions, position 6.56, 3.3% CTR). A large volume of international impressions is junk (see noise below).

**Device (clicks):** Mobile 700 (position 3.49) vs Desktop 607 (position 6.99) vs Tablet 5. Note desktop ranks markedly worse than mobile. This is organic search and is more balanced than the 74%-mobile paid-social traffic the site is usually optimised for.

---

## Noise to filter out when tracking

Impressions are inflated by irrelevant queries that will never convert and should be excluded when judging progress:
- **Brand-name collisions:** "conka ernő" (a Hungarian lawyer), "konka" (an appliance brand), and dozens of misspellings (conkaa, čonka, comka, chonka).
- **An old blog post** ranking for "controlled imagination / mental rehearsal / visualization" academic queries (0 clicks each).
- **Guatemala** alone contributes 826 zero-click impressions.

---

## How to track this going forward

**Keep the 3-month window, do not switch to 7 days.** A benchmark has to be stable; 7 days is too short and noisy (one weekend or one press mention distorts it). Compare 3-month window against 3-month window so it is like-for-like. Use 7- or 28-day views only for a quick "is anything moving yet" glance, never as the benchmark.

**When you re-export in a few weeks, look at these five things, in order:**
1. **Indexed page count** (Indexing → Pages report, not in this export). Should rise as the canonical fix lets the product pages into the index. This is the fastest and clearest signal.
2. **`/conka-clarity` and `/conka-both` appearing in the Pages report at all**, and `/conka-flow` impressions climbing above 279.
3. **Non-brand impressions and clicks** rising from near-zero. Best isolated with a query filter: **Queries → filter → "Custom (regex)" or "does not contain" → `conka`**, plus a **Country = United Kingdom** filter. That view is the true scoreboard for this work.
4. **Product snippets** row in Search appearance growing after Phase 3 deploys.
5. **Average position** on the target terms. Expect blended CTR to *fall* as non-brand impressions grow, because new impressions arrive at lower positions than brand searches. A CTR dip here is success, not regression.

---

## Comparison log

Fill a new row each time you re-export.

| Export date | Range | Clicks | Impressions | CTR | Avg pos | Indexed pages | Non-brand clicks | Notes |
|-------------|-------|--------|-------------|-----|---------|---------------|------------------|-------|
| 2026-07-13 | Apr 11 to Jul 10 | 1,312 | 10,420 | 12.6% | 4.97 | pending (17 URLs got impressions) | ~9 | Baseline. Phase 3 not yet deployed. Indexed count still to be captured from Indexing to Pages report. |
