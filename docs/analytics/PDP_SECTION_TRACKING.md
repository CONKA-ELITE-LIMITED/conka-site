# PDP section tracking

> **Purpose:** The canonical reference for `pdp:section_viewed`, the event that records which parts of a product page people actually reach. Written to be usable from the dashboard repo without reading the website code.

Shipped 26 Aug 2026 (SCRUM-1260, PRs #447 to #449). Plan: `docs/development/featurePlans/pdp-structure-rework.md`.

## The event

**`pdp:section_viewed`** on Vercel Analytics, via `track()` in `app/lib/analytics.ts`.

Fires **once per section, per pageview**, when that section scrolls into view. Exactly two properties:

| Property | Values |
|----------|--------|
| `product` | `flow` \| `clear` \| `both` |
| `section` | the section's semantic id (table below) |

Two properties is a hard budget across this codebase's events. Anything else has to be folded into one of these two strings rather than added as a third.

### Query shape

```
dataset=events
by=["eventData/product","eventData/section"]
filter=eventName eq 'pdp:section_viewed'
```

One query returns the whole reach matrix, no post-processing.

## Section ids, per page

Ids are **semantic, not positional**. This is the design point that matters downstream: the PDP section order changes often, and a semantic id survives a reorder. A removed section stops appearing; a new one appears under a new id. Nothing renumbers, no history breaks.

| Section id | flow | clear | both |
|------------|:----:|:-----:|:----:|
| `hero` | yes | yes | yes |
| `ugc` | yes | yes | yes |
| `ingredients` | yes | yes | yes |
| `benefits` | yes | yes | no |
| `what-to-expect` | yes | yes | yes |
| `comparison` | yes | yes | yes |
| `testimonials` | yes | yes | yes |
| `athletes` | yes | yes | yes |
| `guarantee` | yes | yes | yes |
| `faq` | yes | yes | yes |
| `explore` | yes | yes | no |

**Do not assume a uniform section set.** `/conka-both` has no `benefits` or `explore`, so a "sections seen out of total" completion metric needs a per-product denominator or it will under-report Both.

Two blocks are deliberately untracked: the certifications badge band, and `BrainFuelBand` on Both. Both own their own markup rather than being `PdpSection` wrappers.

## What counts as "seen"

`IntersectionObserver`, `threshold: 0`, `rootMargin: "0px 0px -15% 0px"`.

In plain terms: a section counts once it clears the bottom 15% of the viewport. A percentage threshold would never fire for a section taller than the screen, which is why it is written this way.

The observer unobserves on first fire, so the event is genuinely once per section per pageview. **Event count equals the number of pageviews that reached that section.** No dedup needed dashboard-side.

## The conversion pair

Read alongside **`purchase:add_to_cart`**, which carries:

- `location`: `hero` | `sticky_footer` | `results_page` | `calendar`
- `source`: `quiz` | `menu` | `direct` | `cta`
- plus `origin` and `sessionId`

`sticky_footer` is newly meaningful. The sticky buy bar was commented out before this work and is now live on all three PDPs, held back until the visitor scrolls past the hero. **The hero versus sticky_footer split is the most useful new number here** and answers whether the bar earns its place.

`section_viewed` is the denominator that separates a weak section from a rarely reached one. Reach alone says nothing; reach against add-to-cart does.

## Suggested dashboard views

1. **Reach funnel per product.** Sections in page order, event count each. The drop-off curve is the page's real story, and it settles ordering questions with evidence rather than opinion.
2. **Reach as a share of `hero`.** `hero` is effectively the pageview count, so expressing every other section against it normalises across traffic volume.
3. **Add-to-cart by `location`,** split by product.
4. **Same section across products.** Where does one product lose people that the others do not.

## Caveats to build in

- **No pre-change baseline.** The event shipped in the same release as the section changes it measures. The series starts 26 Aug 2026; there is no "before".
- **The page is still moving.** Phases 4 to 6 will add an app section and a start pack, and the order is expected to change once this data exists. Section ids survive that, but a chart with today's order hard-coded will not. Read order from the data or from config.
- **Sibling event, same machinery, different rules.** `listicle:section_viewed` on `/go/[slug]` uses the same shared observer but carries `{ slug, section }`, and its `section` **is** positional (`reason_3`). Do not merge the two datasets, and do not carry a section-ordering assumption from one to the other. See `docs/features/LISTICLE_SYSTEM.md`.

## Where the code lives

| File | Role |
|------|------|
| `app/lib/analytics.ts` | `trackPdpSectionViewed`, the event definition |
| `app/components/analytics/sectionImpressions.tsx` | The shared observer, one per page |
| `app/components/product/PdpSection.tsx` | The section wrapper. Its `id` is both the DOM anchor and the tracked name, so the two cannot drift |
| `app/conka-flow/page.tsx` and siblings | Where the ids are declared |
