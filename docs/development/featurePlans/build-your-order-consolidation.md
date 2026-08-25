# Build Your Order: funnel consolidation

**Status:** Scoped, approved 25 Aug 2026. Phases 1-3 active.
**Branch:** TBD at pickup (off main).
**Owner docs:** this plan + `docs/analytics/BYO_EVENTS.md` (to be rewritten as the byo events doc in Phase 1).

## Problem

Site CVR is ~0.8% against a 2% gate (22,497 sessions, 169 orders, 14 Jul - 24 Aug 2026). Listicle CTA rates are uniform (~12%) but the listicle-to-PDP handoff leaks badly: 793 CTA clickers vs 1,604 total PDP visitors, and PDPs also receive direct/menu traffic. The purpose-built low-friction purchase flow (the "funnel" pages) exists but:

- is fragmented across 3 variants (`/funnel`, `/funnel-b`, `/funnel-c`) with forked, diverged data/checkout libs
- carries stale copy and assets, predating the listicle era
- is invisible to conka-lab: no funnel path in `TRACKED_PAGES`, no `cart:checkout_clicked`, hardcoded `source: "funnel_page"`, upsell events under names the lab does not ingest
- loses `?src=` attribution at the door (listicles append it, PDPs capture it, funnel ignores it)

We cannot point ads at it, and could not measure it if we did. "Funnel" also describes traffic flow, not the surface; the flow is a build-your-order experience.

## Approach

Promote `/funnel-c` (the live, perf-optimised 3-step flow: Learn > Build > Review) to `/build-your-order`. Delete the other two variants and the forked libs. Close the attribution holes to match listicle/PDP standards and wire conka-lab. Then a directed copy/asset pass.

**Design language:** Simple DTC (funnel surfaces are Simple DTC authority per DESIGN_SYSTEM.md 8.5).

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| URL | `/build-your-order` | Customer-visible on ads and browser bar; `byo-v1` leaks versioning. Stays noindex. |
| Internal prefix | `byo` | `BYO_URL`, `byoData.ts`, `byoCheckout.ts`, events `byo:*`, cart `_source: "byo_page"`. |
| Base variant | funnel-c | Live paid path (via /start > /start-b), only variant with perf work + server-side MetaViewContent. |
| Pricing presentation | funnel-c / trial-b model verbatim | The "20 + 8 free" offer with postage separate is what is live. Charged prices, GIDs and selling plans do not change. |
| Default selection | **Both + monthly-sub** | Both outsells Flow (98 vs 66 orders over 6 weeks) on less traffic. Was Flow in funnel-c `defaults.ts`. MetaViewContent derives from defaults so it follows automatically. |
| Event taxonomy rename | Rename now to `byo:*` | Free moment: conka-lab ingests no `funnel:*` names; cutover gets a milestone entry. `purchase:add_to_cart` and `cart:checkout_clicked` are dashboard contracts and keep their names. |
| Variant prop | Keep, fixed `"v1"` | Cheap future-proofing for the parked A/B testing MVP. |
| Work order in Phase 1 | Delete dead code first, then merge, then rename | Avoids renaming files that are about to be deleted. All of Phase 1 ships as one deploy so nothing 404s mid-sequence. |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Consolidate and rename (delete first, then merge libs, promote funnel-c, redirects, docs) | Done (SCRUM-1247, merged PR #436) |
| 2 | Attribution and measurability (src capture, checkout event, byo taxonomy, conka-lab wiring, verification) | Built (SCRUM-1248), pending review + 9-combo checkout verification |
| 3 | Copy and asset alignment (section-by-section, user-directed) | Not Started |
| 4 | Route traffic at the flow (listicle CTAs and/or ad sets) | Future. Marketing call; trigger criteria decided at pickup. |
| 5 | Collapse the rest of `(trial-b)` (promote start-b/lander-b, delete the group) | Future |

## Phase 1: Consolidate and rename

Order matters: deletions first so the merge/rename never touches doomed files.

1. **Delete dead variants and dead components.** Remove `app/funnel/` (variant a), `app/(trial-b)/funnel-b/` (never approved, linked from nothing), `app/components/funnel/` (only consumed by variant a), and `scripts/fetch-funnel-products.ts` if stale. Small/Medium.
2. **Merge the forked libs into one `byo` data layer.** `app/(trial-b)/lib/funnelData.ts` (live funnel-c presentation) becomes `app/lib/byoData.ts`; `app/(trial-b)/lib/funnelCheckout.ts` (keeps its `source` param) becomes `app/lib/byoCheckout.ts`; keep the `seoHeading` field from the main `cadenceData`. Delete `app/(trial-b)/lib/` copies and the old `app/lib/funnelData.ts` / `funnelCheckout.ts`. Rename exported identifiers (`FUNNEL_VARIANTS` > `BYO_VARIANTS` etc.) across all ~30 consumer files (CartDrawer, jsonLd, productMetadata, cartUpsell, landingPricing, PDP buy panels, subscriptions/swap, listicle components, lander BuyBoxes). GIDs, selling plans and charged prices must not change; diff the variant table before/after. Large, mechanical; `npm run build` is the safety net (no test suite exists).
3. **Promote funnel-c to `app/build-your-order/`.** Move page, client, `defaults.ts`, 7 components out of `(trial-b)`. Keep noindex, MetaViewContent, Shopify preconnects, SpeedInsights, code-splitting. Rename `FUNNEL_C_*` constants to `BYO_*`. **Change defaults to `both` + `monthly-sub`.** Medium.
4. **Repoint CTAs.** `FUNNEL_URL` becomes `BYO_URL = "/build-your-order"` in `app/lib/landingConstants.ts` and the `(trial-b)` copy (start-b CTAs and the ConkaCTAButton default across ~33 files follow automatically). Small.
5. **Redirects and metadata.** `next.config.ts`: permanent redirects `/funnel`, `/funnel-b`, `/funnel-c` > `/build-your-order`; retarget the existing `/quiz/:path*` redirect directly at the new route (no chains). Update `app/sitemap.ts` `lastModified` source path and `app/robots.ts` comment. Small.
6. **Docs.** Rewrite `docs/analytics/BYO_EVENTS.md` as the byo events doc; fix stale `TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md` (describes a start-b > funnel-b chain that no longer exists), `MASTER_CONTEXT.md` (describes the deleted 4-step flow and "4 of 9 combos"), CLAUDE.md routes table, CHANGELOG entry. Small.

## Phase 2: Attribution and measurability

1. **Capture and thread `?src=`.** Call `captureListicleSrc()` on the byo page; `byoCheckout` reads the captured src for the cart `_source` attribute and the `purchase:add_to_cart` `source` prop, falling back to `byo_page`. `productId` stays a friendly id, never a raw GID. Small.
2. **Fire the events conka-lab already ingests.** `cart:checkout_clicked` on the checkout press (helper at `app/lib/analytics.ts:243`); move upsell tracking onto `cart:upsell_shown` / `cart:upsell_accepted` with `{type, product}` props. Small.
3. **Rename the step taxonomy.** `byo:viewed`, `byo:step1_completed` through `step3_completed`, `byo:cta_clicked`, `byo:checkout`, `byo:checkout_failed`, `byo:product_changed`, `byo:cadence_changed`, `byo:back_nav`, `byo:accordion_opened`. Keep the 2-prop budget (`variant` + packed field) and the forward-intent double-fire guards. Delete `trackFunnelPropertyProbe` and its call site. Small/Medium.
4. **conka-lab wiring** (work in the conka-lab repo). Add `/build-your-order` to `TRACKED_PAGES` (`src/lib/website-pages.ts`); add `byo:viewed` + the three step events to `TRACKED_EVENTS` (`convex/lib/vercelClient.ts`); add a milestone entry for the cutover date; run the sync. Small.
5. **Verification pass.** Run `/review-analytics` across all 4 systems: Vercel events, Meta Pixel AddToCart + InitiateCheckout content_ids against the merged data layer, CAPI dedup, Triple Whale, cart attributes (`_fbp`, `_fbc`, `_source`). Manual checkout click-through on all 9 combos (Flow/Clear/Both x monthly-sub/OTP/quarterly). Medium, not optional: this is the real-money path.

## Phase 3: Copy and asset alignment

Section-by-section conversion pass on the Learn, Build, Review steps: current headline ("A Sharper Mind. Morning to Evening."), proof assets and social proof in line with listicles/PDPs, refresh `FunnelMedia` video/imagery if newer assets exist. Built one section at a time with the user directing specifics, visual review then commit per section. Two-equal-cards rule respected (no spotlighting Flow or Clear over the other). Medium/Large, timeboxed.

## Rabbit holes

- **Identifier rename ripple.** ~30 importer files, zero tests. Contain: one mechanical commit, no logic changes mixed in, `npm run build` gate, diff the GID table before/after.
- **Pricing merge.** The forks present price differently (postage baked vs separate, different per-shot maths). Do not reconcile creatively: adopt the live funnel-c presentation verbatim.
- **Copy pass becoming a redesign.** Timebox; one section at a time; user directs.
- **Loop swap logic.** `getFunnelSwapSellingPlanId` and the resolved swap-pricing fix (see memory/PRICING_HISTORY) ride along in the rename untouched.

## No-gos

- No changes to Shopify variants, selling plans, or charged prices.
- No cart drawer integration; the flow stays isolated direct-to-checkout by design.
- No renaming `purchase:add_to_cart` or `cart:checkout_clicked` (dashboard contract).
- No A/B testing infrastructure (ab-testing-mvp stays parked; not enough traffic).
- No touching the legacy protocol/subscription commerce layer.
- Not repurposing the quiz.

## Risks

- No test suite: regressions surface via build, lint and the manual 9-combo checkout pass only.
- Vercel event history gets a naming discontinuity at cutover; mitigated by the conka-lab milestone entry and the fact nothing ingests `funnel:*` today.
- `/start` ad traffic transits `/start` > `/start-b` and its CTAs must land on the new route in the same deploy as the deletions.

## References

- Research basis: session funnel-system map (25 Aug 2026); conversion context doc (conka-lab scratchpad, 14 Jul - 24 Aug data).
- `docs/analytics/BYO_EVENTS.md`, `docs/product/SKU_AND_SHOT_REFERENCE.md`, `docs/development/TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md`, `docs/sprints/2026-07-listicle-ad-spend.md`, `docs/development/featurePlans/ab-testing-mvp.md`.
- conka-lab: `src/lib/website-pages.ts`, `convex/lib/vercelClient.ts`, `src/app/(dashboard)/acquisition/funnel/page.tsx`.

## Jira tickets

| Ticket | Title | Phase | Status |
|---|---|---|---|
| SCRUM-1247 | [Website & CRO] Build Your Order Phase 1: consolidate the 3 funnel variants into /build-your-order | 1 | To Do |
| SCRUM-1248 | [Analytics & Data] Build Your Order Phase 2: attribution passthrough + conka-lab measurability | 2 | To Do |
| SCRUM-1249 | [Website & CRO] Build Your Order Phase 3: copy, social proof and asset alignment | 3 | To Do |

SCRUM-1247 blocks 1248 and 1249; 1248 and 1249 relate and can run in parallel after Phase 1. Phases 4 and 5 get tickets when activated.
