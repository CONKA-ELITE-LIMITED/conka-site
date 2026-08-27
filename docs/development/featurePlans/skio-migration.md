# Skio Migration - Single Source of Truth

**This is the only Skio doc.** Status, plan, build reference, vendor answers, cutover runbook and decisions all live here. Nine separate Skio docs were consolidated into this file on 2026-08-26; the originals are in git history.

**Owner:** Rudh
**Branch:** `feature/skio-integration` (sub-branches merge into it, not main)
**Last updated:** 2026-08-26

Cross-repo: the retention pipeline half lives in **conka-lab** (`docs/featurePlans/loop-to-skio-ingest-migration.md`). That is the one deliberate exception, because it is a different repo. See [Retention and conka-lab](#retention-and-conka-lab).

---

## 1. Status at a glance

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Skio setup + selling-plan mapping | Done (18 Aug) |
| 2 | Re-point purchase surfaces | Done (18 Aug), behind flag |
| 3 | Embedded customer portal (`/account/manage`) | Done, auto-login verified end-to-end (19 Aug) |
| 3b | Dual portal for the transition window | Done (26 Aug, SCRUM-1256) |
| 4 | Cutover + Loop decommission | Blocked on Skio: needs a booked migration date |
| 5 | Legacy protocol retirement | Future, ops-gated |

**The build is finished.** Everything sits behind `NEXT_PUBLIC_SKIO_ENABLED` (default off = Loop live). What remains is scheduling, one runbook, and the docs you are reading.

## 2. Current focus and next action

**Blocked on Skio.** Josiah (Migration Engineer, `josiah@skio.com`, team account `aidan@skio.com`) has store access as of 26 Aug. He generates the migration preview within 1-2 days of access, so 27-28 Aug. Migration runs on any Mon-Thu after we approve the preview, never a Friday.

**Not blocked, ours to do:**

1. **Build the Skio cancel flow** in the Skio dashboard: the cancellation reason tree and a recreation of the RETENTION15 15% save offer. **This has a real deadline.** Phase 4 deletes our own RETENTION15 code, so if Skio's flow is not built by cutover we ship a cancel journey with no deflection at all. Ops job, no code.
2. **Cutover runbook** (section 12 is the skeleton; finalise once the date is set).
3. **Preview verification checks** (section 11), gated on the preview landing.

## 3. Order of operations (CORRECTED 2026-08-26)

**We go live BEFORE the migration, not in the same window.** This reverses the original big-bang plan.

Josiah's reason: any contract created in Loop after Skio pulls the data is left out of the migration entirely, so Loop must go static first. He recommends 24-48 hours so in-flight Loop carts also clear.

1. **Go live.** Deploy with `NEXT_PUBLIC_SKIO_ENABLED=true` and `NEXT_PUBLIC_SKIO_TRANSITION=true`. Set `KLAVIYO_ENABLED=false` on conka-lab.
2. **Wait 24-48 hours.** Loop goes static, Loop carts clear.
3. **Skio migrates** the Loop contracts.
4. **Loop auto-billing and customer notifications off.**
5. **Flip the retention source:** `SUBSCRIPTION_SOURCE=skio` on prod Render, deploy. Turn `NEXT_PUBLIC_SKIO_TRANSITION` off (build-time, so redeploy).
6. **Verify** segment populations, then re-enable `KLAVIYO_ENABLED`.

**The cost of this sequencing.** Between steps 1 and 5 the site is on Skio while the retention pipeline still reads Loop. conka-lab derives "is this person a subscriber" from the subscription source alone (`hasEverSubscribed = !!subscriptionDate`), with no memory between runs, so new Skio subscribers would be classified as **one-time buyers** and pulled into OTP and convert-to-subscription flows. conka-lab names this the "early-flip -> OTP" failure mode. `KLAVIYO_ENABLED=false` across the whole window is the mitigation. Expect roughly four days with no strategic retention email. The transactional subscription welcome is unaffected, since it comes from the Skio-native Klaviyo integration on the order event, not the retention engine.

**Open with Skio:** does the final migration re-pull fresh from Loop, or use the preview snapshot? If it re-pulls, go-live is 48h before migration day. If it reuses the preview, we must be live before the preview is generated. Asked 26 Aug.

## 4. Open blockers

| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | Migration date not booked | Josiah (Skio) | Gates everything. Preview first, then any Mon-Thu. |
| 2 | Does the final migration re-pull from Loop or use the preview snapshot? | Josiah (Skio) | Decides exactly when we go live. Asked 26 Aug. |
| 3 | Build the Skio cancel flow (reason tree + RETENTION15 save offer) | Rudh / ops | Pre-cutover deadline. Not blocked on Skio. |
| 4 | Synergy: 6-SKU handoff sent, plus one live routing test on a normally-paid order | Rudh / ops | Section 10. `#3879` was £0 and auto-fulfilled, so it never pulled. |

**Resolved:** billing approval (18 Aug), Skio plan GIDs (18 Aug), offer architecture (staged fulfilment + percentage off), funnel Loop plans carry 0% adjustment (13 Aug), first-order swap feasibility, box mapping, portal version (cpv3), address write-back (yes, so the Loop address-mirror can be dropped), legacy plan handling (26 Aug, section 5).

## 5. Vendor answers

### From Josiah (Migration Engineer, 2026-08-26)

| Question | Answer | Consequence |
|----------|--------|-------------|
| Original start date + cycle count preserved? | **Yes**, Skio migrates both `createdAt` and `cyclesCompleted` | **Contradicts Noah.** See below. |
| Old to new subscription id mapping | Skio ids only exist after the final migration, but the **preview carries the Loop sub id on every contract** | Sufficient. conka-lab's matching heuristic becomes an exact lookup post-migration. |
| Is `migrationIndex` reliable? | Yes, 100%, used for internal operations | Safe to key migrated-contract detection on it. |
| Legacy plans (~5-10 subscribers) | **No Skio mirror plans needed.** They migrate at their existing interval and price and stay there until the customer edits, at which point they are forced onto a current Skio plan | Removes a build item. Note the customer-facing consequence. |
| Timeline | Preview 1-2 days from access; migration any Mon-Thu after approval, never Friday | Preview 27-28 Aug, migration early the following week. |
| Sequencing | **Go live 24-48h BEFORE migration**, run both manage-subs links during the window | Section 3. Reverses the original plan. |

**The `createdAt` contradiction (unresolved).** Noah told us twice (19-20 Aug) that migrated contracts are created fresh: create date = migration date, no prior cycle count, no Loop event replay. Josiah says the opposite. Both are on record. **Verify on the preview** rather than picking a side; this is the single highest-value check on that data. Either way there is no new build, because conka-lab's coalesce already handles the bad branch (section 11).

### From Noah (2026-08-18 to 20)

- **Rebill attribution.** Attributes carry to renewal orders only if they live on the Shopify subscription contract, populated from checkout/cart data. Ours (`_fbp`, `_fbc`, `conka_uid`, `_listicle_origin`) are cart-level at checkout, so they should persist. Confirm on the first real renewal.
- **Rebill `checkout_token`.** Confirmed absent: Skio rebills are created server-side via Shopify's native subscription billing. Our `orders/paid` webhook correctly skips them.
- **Webhooks.** Skio emits subscription-lifecycle events (billed, order created, cancelled, paused, skipped) via webhooks and an event-metrics API.
- **Native integrations.** Native Triple Whale (enable at cutover for recurring visibility). No native Meta CAPI; that would be built off Skio's webhooks if needed.
- **Migrated contracts keep operational history but NOT Loop's attribution or custom fields.** Acceptable: migrated contracts are already-acquired customers.
- **Address and payment changes in the Skio portal write back to Shopify automatically**, so the Loop per-contract address-mirror can be dropped at cutover.
- **Cancel reasons are not on the API**, but they DO arrive on the `subscriptionCancelled` event payload as `cancellationReason` and `finalCancellationReason`. Taking them off the event stream sidesteps the unreliable CSV export path.
- **Test subscription:** run a 100%-off discount through Shopify checkout, or create one in the Skio backend.

## 6. Build reference: plans and variants

Created in the Skio dashboard. Pricing rule is **Percentage off**, never Set price (Skio ignores Set price under Shopify market prices, risking international overcharge). Attached to the base variant only. Base price = the product's full one-time price with postage baked in; the plan takes the discount off, so subscriptions ship free.

| Group | Variants | Base £ | Bill every | % off | Sub price | Skio plan GID |
|-------|----------|--------|-----------|-------|-----------|---------------|
| 20 Shots - Monthly | `FLOW-20` + `CLEAR-20` | 69.98 | 1 month | 42.86% | 39.99 | `712928887158` |
| 60 Shots - Quarterly | `FLOW-60` + `CLEAR-60` | 189.99 | 3 months | 42.11% | 109.99 | `712928919926` |
| 40 Shots - Monthly | `BOTH-40` | 99.98 | 1 month | 25.00% | 74.99 | `712928952694` |
| 120 Shots - Quarterly | `BOTH-120` | 279.99 | 3 months | 46.43% | 149.99 | `712928985462` |

Six net-new base variants, nothing existing touched. Each is a Synergy virtual bundle via `custom.bundlecomposition`, exploded into physical 28-boxes at pick time. `custom.batchexpiry` blank (only physical boxes carry batch/expiry). Weight = boxes x 2.1 kg.

| SKU | Variant GID | Shots | bundlecomposition | Weight |
|-----|-------------|-------|-------------------|--------|
| `FLOW-20` | `58457787040118` | 20 | `1xFLOW-FUNNEL-28` | 2.1 kg |
| `CLEAR-20` | `58457822069110` | 20 | `1xCLEAR-FUNNEL-28` | 2.1 kg |
| `FLOW-60` | `58457811550582` | 60 | `3xFLOW-FUNNEL-28` | 6.3 kg |
| `CLEAR-60` | `58457854411126` | 60 | `3xCLEAR-FUNNEL-28` | 6.3 kg |
| `BOTH-40` | `58457859686774` | 40 | `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28` | 4.2 kg |
| `BOTH-120` | `58457864077686` | 120 | `3xFLOW-FUNNEL-28+2xCLEAR-FUNNEL-28` | 10.5 kg |

**Never delete `FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`.** Every bundle points at them.

### Fulfilment staging

Plans and variants stay constant across stages; only `bundlecomposition` changes as box formats arrive. The customer and Skio never see these stages.

- **Stage 1 (now):** everything ships in 28-boxes, first order and recurring identical, so the free-shots offer is baked in. Just the 6 base variants, no swap. Interim cost: we ship more than we charge for until smaller boxes exist.
- **Stage 2 (20-box live, date TBD):** add the 6 bonus variants (`-28`/`-80`/`-56`/`-140`) plus a Skio swap Journey. First order ships the bigger box, recurring switches to the 20-box.
- **Stage 3 (gift box live):** recurring is the 20-box, first order gets a small gift box attached. Drop the swap Journey.

## 7. Build reference: env vars, flags and code

| Var | Scope | Purpose |
|-----|-------|---------|
| `SKIO_API_TOKEN` | server, all envs | Skio GraphQL API. Header `authorization: API {token}`. |
| `SKIO_STORE_ID_HASH` | server secret | Signs the portal login hash. **Never `NEXT_PUBLIC_`** (would let anyone forge a login for any customer). From `dashboard.skio.com/theme`. |
| `NEXT_PUBLIC_SKIO_ENABLED` | build-time, per env | `true` attaches Skio plans and points `/account` at the portal. Off/unset = Loop. |
| `NEXT_PUBLIC_SKIO_TRANSITION` | build-time, per env | The go-live window (section 3). Keeps the Loop list on `/account` with a link out to Skio. Off after migration. |
| `SKIO_PORTAL_HOSTNAME` | server, optional | Overrides the portal `hostname` param. Defaults to `shop.conka.io`. |

`SKIO_API_TOKEN` and `SKIO_STORE_ID_HASH` are exposed as getters in `app/lib/env.ts` `optionalEnvVars`. The two `NEXT_PUBLIC_` flags deliberately are NOT: `optionalEnvVars` holds server-side names, and the public build-time flags live in `subscriptionsFlag.ts`. Missing means off, which is the correct default.

**Both flags are build-time**, so turning either on or off is a redeploy, not a toggle. Budget roughly ten minutes inside the cutover window. Emergency rollback is Vercel Instant Rollback to the pre-cutover deploy.

### Flag helpers (`app/lib/subscriptionsFlag.ts`)

- `subscriptionsUseSkio()` - raw `NEXT_PUBLIC_SKIO_ENABLED`.
- `subscriptionsInTransition()` - Skio on AND the transition flag on. The Skio check is folded in so no call site can misread it.
- `subscriptionsSkioOnly()` - Skio on AND NOT in transition. **This is the condition every "send them to Skio" branch reads.** Composing it here means a missed call site cannot silently strand a Loop subscriber.

### Code map

| Path | Role |
|------|------|
| `app/lib/skio.ts` | API config + `LOOP_TO_SKIO_SELLING_PLAN` map |
| `app/lib/subscriptionsFlag.ts` | The three flag helpers |
| `app/lib/byoData.ts` | `getOfferVariant`, `BYO_VARIANTS`, `BYO_PRICING` — the live purchase path (`funnelData.ts` was renamed here in SCRUM-1247) |
| _(not built yet)_ | `SKIO_SUBSCRIPTION_VARIANTS` — the flag-gated Skio base variants. **Does not exist in the codebase**; `byoData.ts` has no Skio awareness and nothing imports `app/lib/skio.ts`. It lands in `byoData.ts` when Stage 1 is wired |
| `app/api/auth/skio-portal/route.ts` | Signs the portal iframe src |
| `app/account/manage/*` | The portal page + `SkioPortalFrame` |
| `app/account/page.tsx` | Account entry: Loop list, transition state, or Skio redirect |

Every live subscribe surface routes through `getOfferVariant`, which returns Skio variants and plans when the flag is on. Reverse lookups resolve BOTH Loop and Skio tables, so in-flight and migrated lines still render. `monthly-otp` is untouched (one-time is not a subscription).

### Pulling GIDs from the Skio API

```
POST https://graphql.skio.com/v1/graphql   (header: authorization: API {SKIO_API_TOKEN})
query { SellingPlans { platformId name } }
query { PricingPolicies { percentageOff SellingPlan { platformId } } }
query { SellingPlanGroupResources { SellingPlanGroup { platformId } ProductVariant { platformId sku } } }
```

Match plans to products by `percentageOff` and attached variant SKUs. Limits: depth 4, 100 nodes per request, 2,000 req/min. Shopify GIDs are exposed as `platformId`.

## 8. Customer portal

Skio's Customer Portal v3 (cpv3) embedded at **`/account/manage`**, auto-logged-in via a server-signed magic link. Verified end-to-end 19 Aug: a logged-in customer lands on their subscription with no Skio email-login screen.

**Auth flow.** The customer signs into conka.io once via our Shopify Customer Account API OAuth. `/account/manage` calls `GET /api/auth/skio-portal`, which reads the authenticated customer, parses the numeric id out of the Shopify GID, computes `hash = md5(numericId + SKIO_STORE_ID_HASH)` server-side, and returns the iframe src. The portal loads already logged in, so the customer never sees Skio's own login. Our login cannot be removed: it is the SSO that powers the auto-login.

**Endpoint is `/a/account/shopify-login`**, not `/a/account/login`. The latter is Skio's passwordless email login and renders an "Email does not exist" screen. Host is `cpv3.skio.com` (v3); `storefront-iframe.skio.com` is v2.

**Account routing.** After migration `/account` redirects to `/account/manage` and the nav account icons link there. During the transition window (section 3) `/account` keeps the Loop list with a link out, and a Skio subscriber with no Loop contract gets a transition-specific empty state pointing at the portal rather than "start a subscription".

**CSP.** `next.config.ts` adds `frame-src 'self' https://cpv3.skio.com` scoped to `/account/manage` only.

### Portal gotchas (all hit and resolved during the Phase 3 spike)

- **`hostname` must be `shop.conka.io`.** Skio resolves the store via `get-site-by-domain-or-hostname` and 400s on both a Vercel preview URL and the myshopify domain. Only the Shopify primary domain works.
- **`totalSpent` is sent as `0`.** Display-only, not part of the hash, and the Customer Account API exposes no lifetime-spend field (`amountSpent` is Admin-only).
- **`DEV_MOCK_AUTH` cannot drive the portal** (non-numeric id, no `customer_access_token`). Test on a preview or prod with a real login.
- **Preview login needs setup:** register the preview `/api/auth/callback` as a Callback URI in the Headless Customer Account API app, and pin `SHOPIFY_REDIRECT_URI` (Preview scope) to the branch-alias callback so it survives Vercel's per-deploy hosts.
- **The customer must exist in Skio** for the portal to show anything; otherwise it falls back to Skio's login form.
- **Publish the portal** in `dashboard.skio.com/portal-settings`. A Draft portal renders the shell but hangs on content. Theme: brand/buttons/links navy `#1B2757`, background white, success green `#1A7F4F`. Splash images must be PNG/JPG/SVG/GIF, not WebP; hard-refresh after saving.

## 9. Attribution and fulfilment parity (SCRUM-1223, VERIFIED)

**Phase 1 attribution: PASS.** Skio orders inherit Meta attribution with no code change. The Loop to Skio swap only touches the variant and plan in `getOfferVariant`; attribution (`buildMetaCartAttributes` -> `/api/cart` cart attributes -> order `note_attributes`) and the CAPI webhook (`checkout_token` gate) are variant-agnostic. Proven from live prod orders `#3878`, `#3875`, `#3873`, `#3872`, all carrying `_fbp`, `_fbc`, `conka_uid` and `_listicle_origin`. The Skio test order `#3879` had empty `note_attributes` because it was a cookie-less £0-discount session: a test artifact, not a defect.

**Phase 2 metafield audit: PASS.** All 6 Skio base variants have correct `bundlecomposition` and weights, none marked `SYNERGYIGNORE`.

**Recurring-revenue attribution is acquisition-only today**, matching Loop: rebills send no Meta Purchase. At cutover the cheapest recurring visibility is Skio's native Triple Whale integration (no build). Meta CAPI for rebills would be built off Skio's webhooks and is deferred.

## 10. Synergy fulfilment handoff

Six new subscription SKUs need onboarding on Synergy's side. They are not new physical products: each is a virtual bundle of the existing 28-shot Flow and Clear boxes, defined by `custom.bundlecomposition` in Shopify. A variant without that metafield reaches Synergy as a plain SKU and must be hand-fixed on every order; that was the historic quarterly pain, now resolved for the live quarterly variants too.

**Process for any new or changed subscription variant:** create the variant with SKU `PRODUCT-SHOTS` at base one-time price; set `custom.bundlecomposition` to the physical boxes in single-line `NxSKU+NxSKU` form; leave `custom.batchexpiry` blank; set weight to boxes x 2.1 kg; give Synergy the SKU-to-box mapping; verify on a live order that it exploded into components.

**Cutover rules (Synergy):** the connector pulls only open, paid and unfulfilled orders. Never remove the `IMPORTSYNERGY` tag. Orders cannot be edited after Synergy pulls them.

**Outstanding:** send the 6-SKU mapping to Synergy's help address (the drafted email is in git history at `skio-synergy-sku-handoff.md`), then place one normally-paid Skio test order and confirm it pulls, explodes into 28-boxes, and routes to the Synergy location.

## 11. Retention and conka-lab

**The retention lab is the separate `conka-lab` repo**, not Klaviyo config. A Python pipeline on Render ingests subscription data into Convex, `sanitize.py` merges Shopify plus subscription data into `sanitized_customers`, a retention engine assigns each customer one of ~21 segments every 6h, and a sync drains those into 14 Klaviyo lists. Everything downstream of `sanitized_customers` is platform-agnostic: it consumes fields by meaning, never by "Loop" or "Skio".

**So the migration surface is conka-lab's ingest adapter, not Klaviyo.** Full detail: conka-lab `docs/featurePlans/loop-to-skio-ingest-migration.md`.

**On the conkaWebsite side the Klaviyo work is trivial:** exactly one flow (`NEW Cancellation Flow`, draft) triggers off a Loop metric and needs re-pointing to Skio's cancellation event. A 2026-08-19 audit found 4 segments in the whole account and **zero** referencing any Loop metric or subscription property. The other 14 retention flows fire off list membership and need no change, as long as their lists keep being populated.

**Does conka-lab need code changes for Josiah's news? No.** The legacy-history coalesce (`conka-api/app/ingest/legacy_coalesce.py`, merged via PR #42, SCRUM-1240) stays exactly as built:

- The **tenure half becomes a backstop** rather than the mechanism, if `createdAt` really does carry through.
- The **pause-history and renewal replay halves remain load-bearing.** Josiah said nothing about replaying Loop audit events and Noah explicitly said they are not replayed, so `pauseEventDates` still starts empty at migration and `CHRONIC_PAUSER` still empties without the replay.
- **`cyclesCompleted` migrating is irrelevant to us.** conka-lab's own plan records that it is not consumed anywhere; `completed_renewal_count` derives from the `order_created` replay.

**Deflection decision.** Cancellation deflection and save-offers move into Skio's portal, matching the no-code direction, and Klaviyo keeps only the post-cancel winback re-pointed onto Skio's cancel event. Skio's in-platform reason tree is why this split is right: the reason gets acted on where it is captured.

### Preview verification checks (run when the preview lands)

1. Does `createdAt` carry the original Loop start date? (Settles the Noah/Josiah contradiction.)
2. Is the Loop sub id present on every contract?
3. Do the ~5-10 legacy subscribers appear at their existing interval and price?
4. Run conka-lab's Check 13 tenure guard against the preview population. Any long-tenured subscriber landing in `NEW_SUB_*` means the start-date mapping is wrong and must be fixed before cutover.

## 12. Cutover runbook (Phase 4)

**Prerequisites, all before the window:** migration date booked; the re-pull question answered; Skio cancel flow built in the dashboard; Synergy handoff sent and a live routing test passed; preview approved and the section 11 checks green; the Loop-removal PR written and reviewed but unmerged.

**T-48h, go live.** Merge to main. Set `NEXT_PUBLIC_SKIO_ENABLED=true` and `NEXT_PUBLIC_SKIO_TRANSITION=true` on Vercel production, redeploy. Set `KLAVIYO_ENABLED=false` on conka-lab. Smoke test on production: a subscribe add-to-cart attaches the Skio variant and plan, checkout shows the discounted price, `/account` shows the Loop list with the portal link, `/account/manage` auto-logs in a real customer.

**T-0, migration.** Skio migrates the Loop contracts. Confirm complete. Disable Loop auto-billing **and customer notifications**. Re-run conka-lab's legacy freeze one final time inside the window (upsert-by-key absorbs the delta).

**T+0, switch over.** `SUBSCRIPTION_SOURCE=skio` on prod Render, deploy. Turn `NEXT_PUBLIC_SKIO_TRANSITION` off and redeploy. Merge the Loop-removal PR. Enable Skio's native Triple Whale integration.

**T+1, verify then resume.** Confirm segment populations are sane and no long-tenured subscriber sits in `NEW_SUB_*`. Only then re-enable `KLAVIYO_ENABLED`. Re-point the one Klaviyo cancellation flow.

**Post-cutover.** Archive the now-unused Loop-era Shopify variants. Remove the collaborator and Loop dummy Shopify accounts.

**Abort conditions.** If the preview checks fail, do not go live. If migration stalls partway, keep `KLAVIYO_ENABLED=false` and leave the transition flag on: the dual portal means both populations stay served indefinitely, so there is no forced deadline to resolve it.

### Loop decommission list

`app/lib/loop.ts`; all `app/api/auth/subscriptions/*` Loop routes; the self-built subscription components and modals including the RETENTION15 cancel flow; the Loop per-contract address-mirror in `app/api/auth/customer/update/route.ts` (safe to drop, Skio writes addresses back); Loop env vars; the `useSubscriptions` / `usePaymentMethods` hooks. In conka-lab, after a retention window: `loop.py`, the `raw_loop_*` tables and routes, and `LOOP_*` env vars.

## 13. Decisions log

- **Kept the free-shots offer** (quantity bonus on the first order) delivered via staged fulfilment, rather than switching to a cheaper-first-box price policy. It is a core conversion driver.
- **Percentage-off plans on net-new base variants.** Repricing existing variants was considered and rejected: it cannot be tested pre-cutover and depends on Loop's price-sync behaviour.
- **Twelve net-new variants, nothing existing touched.** Renaming an existing SKU would disrupt Synergy's mapping for live transition-period orders.
- **A flag, not an edit.** Both Loop and Skio ship in the same build and the flag chooses, so Phases 1-3 could be built and verified without disrupting live subscribers.
- **The no-code iframe portal**, not a self-built portal on Skio's GraphQL API.
- **Loop stays primary on `/account` during the transition window**, since the overwhelming majority of customers are still on Loop until migration completes.
- **A third flag state, not platform detection**, for the dual portal. Detection adds an API call and failure modes to the account page during the riskiest week for no real gain over a three-day window.
- **Not deleting the legacy protocol commerce layer.** That is Phase 5, ops-gated on confirming no subscriber still holds a protocol contract.

## 14. Change log

Newest first.

- **2026-08-26** - **Docs consolidated into this file.** Nine Skio docs folded into one source of truth. Originals in git history.
- **2026-08-26** - **Dual portal built (SCRUM-1256).** `NEXT_PUBLIC_SKIO_TRANSITION` plus the composed flag helpers; `/account` keeps the Loop list and links out during the window; a Skio subscriber with no Loop contract gets a transition empty state instead of "start a subscription". Branch `feature/skio-dual-portal`, commit `ab637389`.
- **2026-08-26** - **Sequencing REVERSED and legacy plans resolved.** Josiah confirmed we go live 24-48h BEFORE migration, that `createdAt` and `cyclesCompleted` do migrate (contradicting Noah), that the preview carries Loop sub ids, that `migrationIndex` is reliable, and that legacy plans need no Skio mirrors.
- **2026-08-26** - **Skio access granted.** Collaborator `aidan@skio.com` approved (team account, does not consume a staff seat); `josiah@skio.com` and the Loop dummy `johnhodgkinson213@gmail.com` added as Shopify staff, the latter also `Member_all_access` in Loop. Note for future vendor access: suspended Shopify users free a seat, removal is permanent and irreversible.
- **2026-08-19** - **Portal auto-login verified end-to-end (SCRUM-1227)** after correcting the endpoint to `/a/account/shopify-login`.
- **2026-08-19** - **Retention lab traced to conka-lab.** The migration surface is its Loop ingest adapter, not Klaviyo config.
- **2026-08-18** - **Phase 1 complete.** Billing approval cleared, 4 plans created, GIDs pulled and mapped.
- **2026-08-18** - **Phase 2 complete.** Discovery sweep confirmed every subscribe surface routes through `getOfferVariant`; flag added, lint and tsc clean.
- **2026-08-18** - **Attribution and fulfilment parity verified (SCRUM-1223).** Section 9.
- **2026-08-14** - Fulfilment structured into 3 stages; 12 net-new variants decided; Percentage off chosen over Set price.
- **2026-08-12** - Migration to Skio decided; full iframe portal replacement.

## 15. Jira

| Ticket | Title | Status |
|--------|-------|--------|
| SCRUM-1210 | Skio Phase 1: install app, create selling plans, capture mapping | Done |
| SCRUM-1221 | Skio Phase 3 portal | Done |
| SCRUM-1223 | Skio attribution + fulfilment parity | Verified |
| SCRUM-1227 | Skio portal auto-login fix | Done |
| SCRUM-1233 | Klaviyo retention-lab Loop-dependency audit | Done |
| SCRUM-1240 | conka-lab legacy-history freeze + coalesce | Done |
| SCRUM-1256 | Dual portal for the transition window | For review |

Epic SCRUM-768 (Shopify & Subscriptions). Phase 4 is ticketed once the date is booked.

## 16. References

- **conka-lab** (the retention pipeline half): `docs/featurePlans/loop-to-skio-ingest-migration.md`
- Migration economics: `docs/ops/subscription-platform.md`
- Canonical SKU and selling-plan GIDs: `docs/product/SKU_AND_SHOT_REFERENCE.md`
- The Loop portal Skio replaces: `docs/features/CUSTOMER_PORTAL.md`
- Skio vendor docs: help.skio.com/docs/new-to-skio, code.skio.com, help.skio.com/docs/how-do-i-render-the-skio-logincustomer-portal-in-an-iframe
