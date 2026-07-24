# Listicle CTA and Section Attribution

> **Purpose:** Instrument the `/go/[slug]` listicle landing pages so we can see which page and which section of a page produce clicks and purchases. Today these pages fire no analytics at all.

**Status:** Not started
**Appetite:** 1 to 2 days
**Scale:** B (standard)
**Design language:** Not applicable. No visual surface changes.

---

## Problem

The `/go` listicles are paid-traffic destinations, and they are analytically blind. No listicle component fires a single Vercel event. The only existing signal is `ListicleProductHero` passing `location: "listicle_buybox"` into `addToCart`, which carries no slug and no section, and covers one of roughly six CTA positions.

We are buying traffic to these pages and cannot answer either of the two questions that would change how we spend:

1. Which persona page converts best, so spend can move to it.
2. Which sections earn their place on the page, so weak ones can be cut or reordered.

**Who it serves:** Internal. Paid-acquisition decision-making for cold Meta traffic.

**Business impact:** Acquisition / CRO.

---

## How it works

One visitor lands on `/go/adhd` from a Meta ad:

1. As they scroll, each observed section reports itself once per pageview: section `reason_3` on `go-adhd` was seen.
2. They click a CTA in that section: CTA in `reason_3` on `go-adhd` was clicked.
3. That CTA already points at `/conka-flow`. We append `?src=go-adhd-reason_3`.
4. On the PDP they add to cart. The existing `purchase:add_to_cart` event already carries a `location` field, so we put `go-adhd-reason_3` into it.

That yields, per section and per slug: share of viewers who clicked, and share of clickers who bought.

The impression event is what makes the click data readable. Without it, clicks per section are dominated by how many people reached that section, so a low count cannot be distinguished between a weak section and a rarely reached one.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Instrument the listicle (section ids, impression + click events, both templates) | Not Started |
| 2 | Close the funnel (`?src=` param through to `purchase:add_to_cart`) | Not Started |
| 3 | Reporting view (saved query or dashboard turning raw events into rates) | Future |

A property-budget probe runs alongside Phase 1 but does not block it. See Technical decisions.

---

## Task breakdown

### Phase 1: Instrument the listicle

**1. [Config] Stable section identifier**
- What: body blocks in `listicle-types.ts` are a `kind`-discriminated union with no `id`, and renderers key on array index. Derive `${kind}_${index}` (for example `reason_3`, `buyBox_1`) in one shared helper rather than adding an `id` to every config file.
- Dependencies: none
- Complexity: Small
- Files: `app/lib/landings/listicle-types.ts`, new `app/components/go/listicle/sectionId.ts`

**2. [Analytics] Two new helpers**
- What: `trackListicleSectionViewed` and `trackListicleCtaClicked`, in the existing `safeTrack` style. Send exactly two properties: `slug`, plus a packed `section|cta` string, matching the funnel-event convention. Impression fires once per section per pageview, guarded by a ref set.
- Dependencies: task 1
- Complexity: Small
- Files: `app/lib/analytics.ts`

**3. [Analytics] Fire the property probe (parallel, non-blocking)**
- What: call the existing `trackFunnelPropertyProbe` (`app/lib/analytics.ts:390`) from a funnel mount and read the result in the dashboard grouped by `probeC` / `probeD`. Costs nothing, billing counts events not properties.
- Why: `trackLandingCtaClicked` currently sends six properties against a documented budget of two. Either the comment is wrong or existing landing data is partly unqueryable. Worth settling, but not worth blocking on, because building to the 2-property format is safe under every outcome.
- Dependencies: none
- Complexity: Small
- On result: update the comment block at `analytics.ts:210-228` with the empirical answer and correct or confirm the landing-family events.

**4. [Component] im8 call sites**
- What: wire hero CTA (`ListicleRenderer.tsx:~611`), bridge CTA (`~695`), sticky bar (`~770-790`) and the in-page buy zone (`~726`). Attach the impression observer to each observed body block.
- Dependencies: task 2
- Complexity: Medium
- Files: `app/components/go/listicle/ListicleRenderer.tsx`, `ListicleProductHero.tsx`

**5. [Component] mm call sites**
- What: the harder half. Both mm CTA surfaces are `ProductGrid`, which reaches `app/components/home/ProductCard.tsx`, a component shared with the home page that has no analytics metadata and no callback prop. Add an optional `onCtaClick` / `trackingContext` prop threaded from `ProductGrid` to `ProductCard`, defaulting to undefined so home-page behaviour is unchanged.
- Dependencies: task 2
- Complexity: Medium
- Files: `SimpleListicleRenderer.tsx`, `app/components/home/ProductGrid*.tsx`, `app/components/home/ProductCard.tsx`

### Phase 2: Close the funnel

**6. [Frontend] `?src=` on outbound CTAs**
- What: append a compact origin token to `buyHref` (`PDP_HREF`, `ListicleRenderer.tsx:553`) and to the mm `ProductCard` links, for example `?src=go-adhd-reason_3`.
- Dependencies: tasks 4, 5
- Complexity: Small

**7. [Analytics] PDP reads the param**
- What: on the PDP, read `?src=` and feed it into the `location` / `source` metadata already accepted by `addToCart`, so `purchase:add_to_cart` carries the originating listicle section. Reuse the existing purchase event, do not add a parallel one.
- Dependencies: task 6
- Complexity: Medium
- Files: PDP route(s), possibly `getAddToCartSource()` in `app/lib/analytics.ts`

---

## Technical decisions

**Two properties per event, packed.** `app/lib/analytics.ts:210-228` documents a 2-custom-property limit on Vercel Pro, with extras possibly unqueryable. The funnel events already pack multiple values into one `config` string. New listicle events follow that convention: `slug` plus `section|cta`, split on `|` when analysing. This is safe under every probe outcome, and widening later requires no rebuild.

**Section ids are derived, not authored.** `${kind}_${index}` avoids touching every listicle config. Trade-off: reordering or inserting a section shifts the ids of everything below it, breaking historical comparability for that page. Accepted, and recorded here so a future reader is not confused by a discontinuity in the data.

**URL param, not sessionStorage, for the PDP handoff.** The param survives new tabs, middle-clicks and back-navigation, where sessionStorage is fragile. Cost is minor URL noise on PDPs, which already set canonical tags.

**Impressions, not scroll depth.** Generic scroll depth (25/50/75/100%) measures percentage of a page. Listicles vary in length and section count, so 50% on two different slugs is not comparable and does not divide a section's click count. Section-viewed gives the same drop-off curve labelled by section, comparable across slugs.

**One observer instance, many observed elements.** Not one observer per section. The naive alternative, a scroll listener calling `getBoundingClientRect`, forces layout on every scroll frame and is what makes pages feel sticky.

---

## Performance

Effectively nil, verified against the code:

- **No new script.** Vercel Analytics already loads in `app/layout.tsx`.
- **No server-to-client conversion.** `ListicleRenderer`, `SimpleListicleRenderer`, `ListicleProductHero` and `ProductGrid` are already `"use client"`. `ProductCard` has no directive but sits on a client import chain, so it is already in the client bundle. Confirm at implementation. The expensive failure mode, shipping a previously-server subtree as JS, does not apply.
- **LCP** unaffected, nothing enters the render path. **CLS** unaffected, no layout change.
- **INP:** the click handler must fire and forget. Never `await` a track call before letting the `<Link>` navigate.
- **Network:** roughly 10 small fire-and-forget beacons spread across a scroll, none blocking.

**Event volume.** A 10-section page turns 1 pageview into roughly 11 events, and Vercel bills per event. At current traffic (about 5,000 users across listicles, PDPs and home) listicle events land somewhere around 15k per month, which is comfortably noise. Revisit if `/go` traffic scales by an order of magnitude. Mitigations if it does: observe only sections worth acting on (reason blocks and buy zones, not every ticker and proof band), and if needed sample impressions at 50% while keeping clicks at 100%, which halves cost and keeps rates valid.

---

## Rabbit holes

- **The probe becoming a research project.** It is parallel and non-blocking by design. If the dashboard is ambiguous after 24 hours, keep the 2-property format and move on.
- **`ProductCard` is shared with the home page.** Threading tracking through it invites a refactor of the whole product-grid tree. Add one optional prop, change nothing else.
- **Attribution across sessions.** A user who clicks the listicle, leaves, and buys three days later is not attributed. Accepted.

## No-gos

- No generic scroll-depth event. Superseded by section-viewed.
- No new dashboard in Phase 1 or 2. Raw events first, reporting only if the data proves useful.
- No Meta CAPI or Triple Whale changes. Separate systems with their own dedup rules.
- No changes to listicle visual surface or copy.
- No A/B test harness. This measures what exists, it does not split traffic.

## Risks

- **SCRUM-1176** rebuilds the proof tier and FAQ inside both renderer files. Phase 1 tasks 4 and 5 collide directly. Tasks 1, 2 and 3 are conflict-free, so land those first and do the call sites either before 1176 starts or after it merges, not alongside.
- **Index-derived section ids** break historical comparability when a page is reordered. Documented, not solved.
- **Existing landing events may already be lossy** if the 2-property limit is real at ingestion. The probe settles it. Out of scope to fix here, but it would affect how much trust to place in existing `landing:*` dashboards.

## Open questions

- Which PDP components own the `?src=` read in task 7. Not yet mapped, confirm during Phase 2.
- Whether the Vercel plan carries the Web Analytics Plus add-on. The probe answers this empirically, but the billing page would short-circuit it.

---

## References

- `app/lib/analytics.ts` - `safeTrack`, the funnel 2-property convention (lines 210-228), the dormant probe (line 390), `purchase:add_to_cart` and `getAddToCartSource()`
- `app/components/go/listicle/ListicleRenderer.tsx` - im8 template, CTA positions
- `app/components/go/listicle/SimpleListicleRenderer.tsx` - mm template
- `app/lib/landings/listicle-types.ts` - config union, no section ids today
- `docs/features/LISTICLE_SYSTEM.md` - system reference. Add an event table on completion, mirroring the quiz doc.
- `docs/features/LANDING_QUIZ_SYSTEM.md` - sibling system, event-table precedent

## Jira tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| [SCRUM-1177](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1177) | [Analytics & Data] Instrument /go listicle CTA clicks and section impressions | 1 | To Do |
| [SCRUM-1178](https://conka-team-jr1mzvwm.atlassian.net/browse/SCRUM-1178) | [Analytics & Data] Attribute listicle CTA clicks through to purchase | 2 | To Do |

Both sit under epic SCRUM-766 (Analytics & Data) in Sprint 29. SCRUM-1177 blocks SCRUM-1178.

Phase 3 (reporting view) is deliberately not ticketed. Raise it only if the raw data proves useful.
