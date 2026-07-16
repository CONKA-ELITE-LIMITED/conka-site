# Legacy Blog Migration (Shopify to Notion to /blog)

**Status:** Triage complete, awaiting approval to import. Plan-doc only (no Jira yet).
**Owner:** Rudh.
**Created:** 2026-07-16.
**Part of:** The SEO / AEO programme. Feeds the blog surface (`blog-informational-content-surface.md`) via the engine contract (`blog-notion-engine-brief.md`). Discovered during the Search Console pass logged in `aeo-free-tool-runbook.md`.

---

## Problem

**82 editorial posts and roughly 440,000 characters of on-brand content are live in Shopify and returning 404 on conka.io.** They were put on hold during the move to the bespoke Next.js site and never restored. They are not in the sitemap. They still serve at `shop.conka.io`, so nothing is lost, but nothing is reachable either.

Google has not caught up. `/blogs/news/visualisation-mental-imagery-and-rehearsal` still ranks at **position 12.7 and drew 464 impressions in the last three months while returning a 404**. Every impression is a wasted result and the one click it earned hit an error page. That is live authority bleeding away daily.

### The doc bug this exposed

`blog-informational-content-surface.md` states that `/blogs/*` is "already a permanent 301 to `/why-conka` … left untouched". **No such redirect exists.** Every `source:` in `next.config.ts` was checked on 2026-07-16: there is no `/blogs` rule of any kind. The 404s are unhandled, not managed. The plan's rationale for choosing `/blog` over `/blogs` rested on a redirect that was never built. Choosing `/blog` is still correct, but the doc's claim that the old URLs are handled is false and must be corrected.

## Why this outranks writing new content

The Phase 1 corpus (`aeo-demographic-query-research.md`) assumed the queue's job was deciding what to write. The archive changes that: **most of it is already written.**

| Lane | Existing posts |
|---|---|
| Sport / concussion / CTE | 20 |
| Focus / productivity | 14 |
| Nootropic / ingredient | 13 |
| Sleep / recovery | 7 |
| Ageing / decline | 5 |
| Brain fog | 3 |
| **Perimenopause** | **0** |
| **ADHD** | **0** |

So Phase 2 of the research doc should be reframed from "what should we write" to **"what is missing from the 82"**. On that framing the answer is narrow and useful: perimenopause and ADHD, the two highest-intent lanes, have no coverage at all. Everything else needs restoring, not authoring. There is also a **military / blast-trauma** cluster (2 posts) serving an audience absent from the demographic taxonomy entirely.

## The URL rule (the highest-leverage decision here)

**Import each post with `Slug` set to its existing Shopify handle, unchanged.**

Old URLs are `/blogs/news/<handle>`; the new surface is `/blog/<slug>`. If the handles are preserved, the whole archive is recovered by one wildcard redirect:

```
{ source: '/blogs/news/:handle', destination: '/blog/:handle', permanent: true }
```

Every post's accumulated authority transfers to its own replacement. If slugs are "improved" during import, that becomes a hand-maintained 82-row mapping table and anything missed dies silently. **The slug is a technical constraint, not an editorial choice.** Retitling is free (the H1 comes from `Blog name`); re-slugging is not.

Handles for dropped posts still need redirect targets, or they stay 404 (see the not-imported table).

## Approach

Import the triaged set into the existing Blog Hub Notion database so the built pipeline (Notion to `notion-to-md` to SSG) picks them up with no special-case code, and the `Status = Published` gate gives each post a claims review before it goes live.

- **Source:** all 130 articles (82 editorial + 48 ingredient) already pulled via the **Storefront API**. Note the Admin API refused with `[API] This action requires merchant approval for read_content scope` — Storefront was sufficient and needs no new grant. If the engine ever needs Admin content access, that scope must be added.
- **Conversion:** Shopify bodies are HTML using the same narrow subset the engine brief already targets (H2/H3, paragraphs, bullets, bold, links, images), so HTML to native Notion blocks is mechanical.
- **Separation:** the engine writes into this database concurrently. Add a `Source` select (`legacy` / `engine`) so the two streams stay separable, or reuse `Angle`.
- **Columns:** `Slug` = existing handle (above). `Blog name`, `Meta description`, `Related products`, `Topic` per the brief. `Status` left `Draft`; **never set `Published` on import.**

## The real cost is review, not import

The import is automatable in an afternoon. **55 posts means 55 claims reviews**, and these were written in 2022 to 2023, before the current claims posture. Known flags are called out per row below. That queue, not the conversion, is the bottleneck, and it is the reason to import in lane batches rather than all at once.

## Suggested order

1. **`visualisation-mental-imagery-and-rehearsal` first**, alone. It is the only post still ranking. It proves the pipeline end to end on the one URL where a 404 is actively costing traffic.
2. **Ship the wildcard redirect** as soon as the first batch is published.
3. Then by lane, highest existing coverage first: sport/concussion (20), focus (14), nootropic (13).
4. **Then** commission perimenopause and ADHD from the engine, the only genuine content gaps.

## Ingredient blog (48 posts) — deferred, not triaged

`/blogs/ingredients/*` holds 48 posts, but they are 16 ingredients x 3 near-duplicate variants (`-ip` / `-cd` / `-ms` suffixes, e.g. `ashwagandha-ip`, `ashwagandha-cd`, `ashwagandha-ms`). Publishing three near-identical pages per ingredient is a duplicate-content problem, and `/ingredients` already owns that surface. **Decide the dedupe rule before touching these.** Out of scope for this pass.

## Risks

- **Claims exposure.** 55 posts of 2022-23 health copy through a modern claims gate. Highest-risk titles flagged per row.
- **Slug drift.** Any re-slugging during import silently forfeits that post's authority. See the URL rule.
- **Database pollution.** 55 legacy rows landing in the database the engine writes into. Mitigate with a `Source` field before importing.
- **Thin and overlapping posts.** Several are under 3k chars, and `flow-states` overlaps `the-state-of-flow-part-l`/`-ll`. Merge or differentiate rather than publishing three thin pages on one topic.
- **Doc drift.** The false `/blogs/*` redirect claim shows the blog plan doc has drifted from the code. Correct it when this lands.

## Open questions

1. **Were any posts deliberately dropped?** The premise here is that all 82 were paused for the migration and none were killed on purpose. Confirmed by Rudh 2026-07-16 ("temporarily on hold whilst we moved to the bespoke site"), so the triage is editorial rather than a reversal of an earlier decision.
2. **`Source` field or `Angle` reuse** for legacy/engine separation?
3. **Redirect targets for the 27 dropped posts.** Proposed per row; needs a call on whether athlete stories go to `/case-studies` individually or as a group.

---

## Triage

**82 editorial posts: 55 import, 27 do not.** Every post is accounted for below.

### Import (55)

Ordered by lane. `Slug` = the existing Shopify handle, unchanged (see the URL rule above).

| Lane | Handle (= new slug) | Chars | Published | Note |
|---|---|---|---|---|
| Ageing | `cognitive-function-age` | 6,085 | 2023-05 |  |
| Ageing | `decoding-language` | 5,998 | 2025-11 |  |
| Ageing/performance | `visualisation-mental-imagery-and-rehearsal` | 5,751 | 2023-05 | **STILL RANKING pos 12.7 / 464 impr while 404ing. Import first.** |
| Brain fog | `the-link-between-brain-fog-and-inflammation` | 7,925 | 2025-07 |  |
| Brain fog | `how-to-reduce-brain-fog-with-nootropics` | 4,406 | 2025-06 |  |
| Brain fog | `how-does-ashwagandha-help-reduce-brain-fog` | 2,749 | 2023-12 | Claims-check the title: ingredient + benefit. |
| Comparison | `conka-vs-energy-drinks-what-s-better-for-focus-and-brain-health` | 5,795 | 2025-06 | Brand-vs-category; keep the angle distinct from the PDP. |
| Focus | `brain-health-habits-a-daily-routine-to-optimise-mental-performance` | 8,615 | 2025-07 |  |
| Focus | `the-power-of-mindfulness-how-habits-shape-the-brain-through-neuroplasticity` | 6,827 | 2025-08 |  |
| Focus | `the-power-of-consistency-why-small-daily-habits-drive-big-brain-gains` | 6,737 | 2025-07 |  |
| Focus | `10-daily-habits-to-naturally-detoxify-the-brain-and-improve-cognitive-health` | 6,678 | 2025-07 | "Detoxify" is a claims-check word. |
| Focus | `how-to-build-a-brain-boosting-morning-routine` | 6,255 | 2025-07 |  |
| Focus | `the-power-of-mind` | 6,105 | 2024-05 | Vague title; rewrite for a query. |
| Focus | `the-neuroscience-of-procrastination-why-your-brain-delays-and-how-to-overcome-it` | 5,955 | 2025-07 |  |
| Focus | `the-state-of-flow-part-ll` | 5,397 | 2024-01 | Two-parter; consider merging with Part l and flow-states. |
| Focus | `how-to-build-the-power-to-overcome-challenges` | 5,050 | 2024-01 | Vague/motivational; rewrite for a query. |
| Focus | `the-state-of-flow-part-l` | 5,003 | 2023-12 | Two-parter. |
| Focus | `flow-states` | 4,916 | 2023-07 | Overlaps The State of Flow I/II. Merge or differentiate. |
| Military | `the-link-between-gut-health-and-blast-induced-trauma-a-cognitive-perspective` | 7,327 | 2025-06 | Audience absent from the taxonomy. |
| Military | `the-hidden-impact-of-blast-induced-trauma-on-military-brain-health` | 6,405 | 2025-06 | Audience absent from the demographic taxonomy. |
| Neuro | `how-can-neurofeedback-devices-enhance-brain-activity` | 7,520 | 2025-02 |  |
| Neuro | `the-vagus-nerve-gut-brain-axis` | 7,047 | 2023-05 |  |
| Neuro | `the-mesolimbic-dopamine-system-unveiling-the-pathway-to-pleasure-and-reward` | 7,029 | 2023-05 |  |
| Neuro | `the-neural-basis-of-emotions` | 6,971 | 2023-06 |  |
| Neuro | `the-social-brain` | 6,925 | 2023-07 |  |
| Neuro | `how-the-brain-learns-and-stores-information` | 6,681 | 2024-06 |  |
| Neuro | `decision-making` | 5,824 | 2023-06 |  |
| Neuro | `the-brain-and-creativity` | 5,227 | 2023-07 |  |
| Neuro | `what-is-dopamine-signalling-and-what-can-we-learn-from-adhd-paranoid-schizophrenia-psz` | 4,323 | 2023-07 | Only ADHD-adjacent post. Title mentions schizophrenia: claims-check. |
| Neuro | `mirror-neurons-emotional-copycats` | 3,321 | 2023-04 |  |
| Nootropic | `caffeine-everything-you-need-to-know` | 9,302 | 2022-10 | 9.3k, strong. |
| Nootropic | `creatine-for-the-brain-more-than-just-muscle` | 7,269 | 2025-06 |  |
| Nootropic | `adaptogens-stress-relieving-powerhouses` | 5,330 | 2023-04 |  |
| Nootropic | `what-are-nootropics-and-how-do-they-work` | 4,659 | 2025-06 | **Keyword-map definitional pillar (KD 49, vol 590).** |
| Recovery | `the-hidden-cost-of-dehydration-how-it-impacts-your-brain` | 7,097 | 2025-06 |  |
| Recovery | `what-actually-happens-to-your-brain-in-the-sauna` | 6,888 | 2025-06 |  |
| Recovery | `the-neuroscience-behind-a-hangover-what-happens-to-your-brain-after-drinking` | 6,237 | 2025-06 |  |
| Recovery | `rice-vs-meat-movement-is-the-panacea-for-injury` | 6,234 | 2023-03 |  |
| Recovery | `brrrr-embrace-the-cold-cold-water` | 5,174 | 2023-04 |  |
| Recovery | `ketosis-the-ketogenic-diet` | 5,110 | 2023-04 |  |
| Recovery | `hope-molecules-exercise-myokines` | 4,220 | 2023-03 |  |
| Recovery | `how-can-breathwork-improve-your-physical-and-mental-health` | 3,284 | 2023-11 |  |
| Sleep | `zzzz-a-primer-on-sleep-stages` | 5,541 | 2023-03 |  |
| Sleep/recovery | `intermittent-fasting-for-brain-health` | 5,544 | 2023-04 |  |
| Sport | `cognitive-enhancers-for-athletes-what-the-science-says` | 8,078 | 2025-07 |  |
| Sport | `how-to-optimise-athletic-performance-in-extreme-weather-conditions` | 7,563 | 2024-02 |  |
| Sport | `tennis-and-brain-health-how-the-game-sharpens-focus-memory-and-resilience` | 6,838 | 2025-07 |  |
| Sport | `the-weight-of-success-navigating-the-challenges-of-making-weight-in-boxing` | 6,604 | 2024-05 | Borderline: athlete-adjacent but topic-led. |
| Sport | `can-supplements-improve-reaction-time-in-sport` | 4,542 | 2025-06 |  |
| Sport | `informed-sport-and-what-that-means` | 2,867 | 2023-10 | Matches corpus batch-testing question. Thin at 2.9k; expand. |
| Sport/concussion | `5-groundbreaking-discoveries-in-concussion-neuroscience` | 12,162 | 2023-07 | Longest post at 12.2k. |
| Sport/concussion | `10-ways-to-support-someone-with-post-concussion-syndrome` | 3,333 | 2023-07 |  |
| Sport/concussion | `the-header-the-facts-so-what` | 2,019 | 2022-02 | Thin at 2k; matches corpus "does heading a football cause brain damage?". |
| Sport/concussion | `women-sport-is-worse-for-concussion` | 1,610 | 2022-09 | Thin at 1.6k; rewrite/expand. |
| Trend | `how-chatgpt-may-be-rewiring-the-human-brain-what-the-latest-research-reveals` | 6,658 | 2025-07 |  |

### Not imported (27), and why

| Reason | Handle | Chars | Why it is not coming across | Redirect to |
|---|---|---|---|---|
| **Announcement** | `introducing-conka-v23` | 1,724 | Obsolete product launch. | /blog |
| **Announcement** | `discover-track-and-compete-with-the-all-new-conka-app` | 1,943 | Obsolete. /app owns this. | /blog |
| **BRAND RISK** | `the-nicotinic-effect-preconditioning-the-brain-for-neuroprotection` | 7,588 | Nicotine framed as neuroprotective. Reputationally and claims fraught for a brain-health brand. | /blog |
| **Brand** | `founders-letter` | 4,446 | /our-story owns the founder narrative. | /our-story or /app |
| **Brand** | `what-is-conkas-app-technology` | 4,395 | /app and /app-insights own this. | /our-story or /app |
| **Brand/app** | `how-reliable-is-the-conka-test-a-look-at-the-latest-research` | 4,248 | Route to /app-insights, which owns instrument validation. | /app-insights |
| **Brand/product** | `the-science-behind-conka-1-short-term-and-long-term-benefits` | 5,950 | /science owns this and would compete with it. | /science |
| **Brand/product** | `the-science-behind-conka-2-short-term-and-long-term-benefits` | 3,825 | /science owns this. | /science |
| **CLAIMS RISK** | `chc5-1-conka-formula-component-no1` | 6,171 | Discontinued capsule formula, plus "17% increase in serum testosterone" and "167% increase in total sperm count" fertility claims. Off-brand and high claims exposure. | /blog |
| **Case study** | `the-cost-of-playing-through-pain-barneys-story` | 5,411 | Athlete story. /case-studies owns this surface. | /case-studies |
| **Case study** | `bee-stillman-jones-a-journey-of-resilience-and-rediscovery` | 4,316 | Athlete story. /case-studies. | /case-studies |
| **Case study** | `from-concussions-to-comebacks-sienna-charles-journey-with-show-jumping-and-conka` | 3,901 | Athlete story. /case-studies. | /case-studies |
| **Case study** | `inside-the-brain-of-a-boxing-world-champion-chris-billam-smiths-brain-data` | 7,113 | Strong copy, but athlete profile. /case-studies. | /case-studies |
| **Case study** | `behind-the-gloves-the-human-side-of-chris-billam-smiths-journey-to-becoming-world-champion` | 7,030 | Athlete profile. /case-studies. | /case-studies |
| **Case study** | `racing-driver-josh-stanton-x-conka-16` | 4,527 | Athlete profile. /case-studies. | /case-studies |
| **DATED** | `achieve-your-goals-for-2024` | 8,150 | Year-stamped. Dead as an evergreen asset. | /blog |
| **EMPTY** | `bristol-bears-on-conka-data-insights` | 0 | 0 characters. Image-only post. | /blog |
| **EMPTY** | `harlequins-on-conka-protecting-athletes-from-brain-injuries` | 0 | 0 characters. Image-only post. | /blog |
| **OBSOLETE PRODUCT** | `10-reasons-why-capsules-work` | 2,606 | Sells capsules as a format. Product discontinued; we sell shots. | /blog |
| **OBSOLETE PRODUCT** | `chc5-1-conka-formula-component-no3` | 6,312 | Discontinued ChC5+1 capsule formula. | /blog |
| **OBSOLETE PRODUCT** | `chc5-1-conka-formula-component-no4` | 6,841 | Discontinued ChC5+1 capsule formula. | /blog |
| **OBSOLETE PRODUCT** | `chc5-1-component-no5-vaccinium-myrtillus-boosts-your-genius-and-helps-you-overcome-stress` | 6,695 | Discontinued formula. Title also claims it "boosts your genius". | /blog |
| **PR** | `co-founder-harry-glover-wins-vodafone-business-gain-line-award-for-work-with-conka` | 3,830 | Award announcement. No search demand, dates instantly. | /blog |
| **PR** | `bristol-bears-on-conka-taking-their-performance-to-the-next-level` | 4,297 | Partner announcement. | /blog |
| **PR** | `conka-x-cognica` | 2,263 | Partnership announcement. | /blog |
| **Thin** | `no-brainer-with-telusa-veainu` | 857 | 857 chars. | /blog |
| **Thin PR** | `bristol-bears-on-conka-data-insights-ll` | 725 | 725 chars. Partner announcement. | /blog |