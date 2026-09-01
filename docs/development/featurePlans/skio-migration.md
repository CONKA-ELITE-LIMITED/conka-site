# Skio Migration - Single Source of Truth

**This is the only Skio doc.** Status, plan, build reference, vendor answers, cutover runbook and decisions all live here. Nine separate Skio docs were consolidated into this file on 2026-08-26; the originals are in git history.

**Owner:** Rudh
**Branch:** `feature/skio-integration` (sub-branches merge into it, not main)
**Last updated:** 2026-09-01

Cross-repo: the retention pipeline half lives in **conka-lab** (`docs/featurePlans/loop-to-skio-ingest-migration.md`). That is the one deliberate exception, because it is a different repo. See [Retention and conka-lab](#retention-and-conka-lab).

---

## 1. Status at a glance

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Skio setup + selling-plan mapping | Done (18 Aug) |
| 2 | Re-point purchase surfaces | Done (18 Aug), behind flag |
| 3 | Embedded customer portal (`/account/manage`) | Done, auto-login verified end-to-end (19 Aug) |
| 3b | Dual portal for the transition window | Done (26 Aug, SCRUM-1256) |
| 3c | Starter-pack rewire: Skio starter variants + Journeys + purchase wiring (SCRUM-1288) | **Done (1 Sept)** — variants, wiring (PR #469), 6 live Journeys, live cancel flow |
| 4 | Cutover + Loop decommission | **LIVE ON SKIO 1 Sept ~12:45 BST** (flags on, smoke-tested). Migration Wed 2 Sept 15:00 BST (Josiah). Loop decommission after |
| 5 | Legacy protocol retirement | Future. **Gate now answered: 12 protocol subscribers exist, so the code stays.** |

Everything sits behind `NEXT_PUBLIC_SKIO_ENABLED` (default off = Loop live). The original build finished 26 Aug, but the starter pack (launched on Loop 1 Sept as the primary offer) predates none of the Skio variants, so the Skio side is being rebuilt around it before the flag flips (phase 3c).

## 2. Current focus and next action

**Go-live is now decoupled from the migration date.** Josiah confirmed (31 Aug) the final migration re-pulls fresh from Loop, so nothing sold pre-migration is missed. We go live on Skio as soon as the starter-pack rewire below is done, and the open blockers (section 4) resolve in parallel.

**The starter-pack rewire, in order:**

1. **[Shopify] Create the six Skio starter variants** (table in section 6). **DONE 1 Sept, all six verified via the Admin API** (prices, compositions, weights, plan attachments). The existing `FLOW-20`-style variants are untouched and take a dual role: sold bare they are the OTP at base price; sold with the plan they are the discounted recurring sub — and they are the Journey swap target.
2. **[Skio dashboard] Journeys: DONE, all six LIVE (1 Sept).** One Journey per swap pair, named `Monthly/Quarterly Starter Swap: <STARTER-SKU> to <SKU>`. Each: trigger After order filtered to order number = 1, condition Contains products on the starter variant (recurring products only), Swap product starter → plain variant. Skio's swap retains the plan discount, so renewals charge the sub price off the plain variant's base. Journeys only fire on Skio checkouts; migrated Loop starter subs are handled by Josiah's migration mapper using the same six pairs.
3. **[Skio dashboard] Cancel flow: DONE, LIVE + API-verified (1 Sept).** "Default Cancel Flow", built on Skio's researched template with **native contract discounts — no Shopify code involved**. Tree: Too expensive → tenure condition (>= 3 cycles) → 30% off next order, else 20%; Too much product → skip / change date / edit frequency (no discount); Product issues → two sub-reasons ("don't feel the benefits" / "expected faster results") each with custom CONKA copy (compounding-effects framing + the app as objective measurement) offering swap product or 10% off; Shipping and Other → 10% off. **RETENTION15 (the Shopify code) is not used by this flow** — it survives only for the Loop-era flow until Phase 4 deletes both; any future winback email code should get a customer-worthy name (e.g. STAYSHARP15), never an ops label.
4. **[Code] Skio purchase wiring (SCRUM-1288): DONE, merged to this branch (PR #469).** Flag-gated `SKIO_OFFER_VARIANTS` in `offerData.ts` sells the six starter GIDs + four Skio plans; reverse lookups resolve both platform tables; Loop swap helpers pinned to the Loop table.
5. **[Go live — the current action.]** Order: merge everything to main first (dormant deploy, flag off), THEN set `NEXT_PUBLIC_SKIO_ENABLED=true` + `NEXT_PUBLIC_SKIO_TRANSITION=true` on Vercel prod and hit Redeploy — go-live is the explicit redeploy click, never a merge side effect. `KLAVIYO_ENABLED=false` on conka-lab **at the same moment**, not at migration: the early-flip → OTP misclassification starts with the first Skio subscriber, not with the migration. Note: with no migration date booked the retention-email blackout is open-ended — the strongest lever to get a date out of Skio. Smoke test per section 12.
6. **[Email Josiah]**, all statements, one batch: live on Skio, Loop static from now, book the migration ASAP; Journeys active — copy the logic into the mapper (Loop `*-STARTER-*` subs land on the non-starter swap targets with the plan attached); re-chase 251-vs-259, paused/`remainingUses`, and the runbook.

**In parallel, ours, not gating go-live:**

1. **Verify 251 vs 259 against Loop's own dashboard** — approval of the preview is held on this.
2. **Decide the 9 dead-membership contracts** (section 5): map or lapse.
3. **conka-lab Check 13** against the preview population (section 11).
4. The 51-legacy-subscriber retention call (section 5) before cutover.

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

**RESOLVED (Josiah, 31 Aug): the final migration re-pulls fresh from Loop.** Consequence: go-live does not need to wait for a booked date — anything sold on Loop up to migration day (including the starter pack, live 1 Sept) is picked up. We go live as soon as ready; the 24-48h minimum before migration still applies so in-flight Loop carts clear.

## 4. Open blockers

**Reconciled 2026-09-01.** Josiah answered items 1, 1b, 1c and 1d in the 1 Sept batch (files/251 are the truth, PAUSED migrates paused, discount `remainingUses` decrements, runbook supplied, migration booked **Wed 2 Sept 10:00 EST / 15:00 BST**). What is left is ours.

| # | Item | Owner | Notes |
|---|------|-------|-------|
| 1 | **Send Josiah the variant mapping CSV** | Rudh | **The only thing gating the migration.** Six starter rows are written; the 9 dead-membership old variant ids must be pulled from his `failed-subscription-contracts.csv`. Section 5. |
| 1e | **51 legacy subscribers, not the 5-10 Josiah was told** | Rudh / ops | Section 5. The "no mirror plans needed" decision was taken on the wrong number. Not gating the migration. |
| 3 | Confirm the plan pill on the Flow and Both portal swap targets | Rudh | Section 8. Five minutes in the dashboard. |

**Resolved:** billing approval (18 Aug), Skio plan GIDs (18 Aug), offer architecture (staged fulfilment + percentage off), funnel Loop plans carry 0% adjustment (13 Aug), first-order swap feasibility, box mapping, portal version (cpv3), address write-back (yes, so the Loop address-mirror can be dropped), legacy plan handling (26 Aug, section 5), **final migration re-pulls fresh from Loop** (31 Aug, so go-live is date-independent), **Synergy handoff not needed** (proven live by the 1 Sept starter launch; section 10), **migration date booked** (1 Sept, Wed 2 Sept), **preview count 251 confirmed as truth**, **PAUSED and `remainingUses` both survive**, **cutover runbook received**, **cancel flow built** (1 Sept), **starter-pack rewire complete** (1 Sept, phase 3c), **the 9 dead memberships: map as PAUSED, not lapse** (1 Sept, Josiah).

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

### Migration preview received and reviewed (2026-08-27)

Josiah sent `migration-summary.csv`, `failed-subscription-contracts.csv`, `subscriptions-raw.json` and `prepaid-raw.json` — kept at `~/Desktop/DownloadsForClaude/Skio migration/`, deliberately **not** committed since they carry customer emails and payment-method ids — and asked for a reply of "Approved!". **We did not approve.** What the data actually contains:

| | Josiah's email | The attachments |
|---|---|---|
| Regular subscriptions | 259 | **251** records in `subscriptions-raw.json` |
| Prepaid | 16 | 16, agrees |
| Failed | 11 | 11, agrees |

`migration-summary.csv` is per subscription **line**, not per subscription, and collapses to the same 251 (one customer holds two lines). So two of Skio's artefacts agree with each other and disagree with the covering email by 8. **Do not approve a number that does not reconcile.** The cross-check that settles it is Loop's own dashboard, which is ours to run.

**Population as shipped in the preview (267 total):**

- 205 ACTIVE + 46 PAUSED regular; 11 ACTIVE + 5 PAUSED prepaid. **51 paused in total.**
- Currency: 239 GBP, 8 EUR, 4 USD in regular; 15 GBP, 1 USD in prepaid.
- Every line carries `reChargeId` (the Loop id) and a `paymentMethodId`. No nulls.
- 35 subscriptions carry a discount, several with a `remainingUses` countdown.
- 8 subscriptions have `priceWithoutDiscount` of 0, three of which ALSO carry a discount, including a GBP 40 fixed-amount against a 0 base. **This is Loop-side data quality, not a Skio fault**, and most look like deliberate staff and friends comps.

**The `createdAt` contradiction is RESOLVED: Josiah was right, Noah was wrong.** The preview preserves original Loop start dates, spanning 2023 to 2026 with the oldest at 2023-05-03, and `cyclesCompleted` values from 0 to 58. Contracts are not created fresh at migration date. Consequence for conka-lab in section 11.

**Legacy is 51 subscribers, not 5-10.** Josiah's 26 Aug answer, that legacy plans need no Skio mirrors because there are only 5-10 of them and they can be force-migrated onto a current plan whenever they next edit, was given against an estimate that is out by 5x. The real figure is **51, or 19% of the base**:

| Count | Product |
|-------|---------|
| 17 | Liquid Monthly Plan |
| 12 | Protocol: Balance / Resilience / Ultimate |
| 8 | Liquid CONKA 12 Month Plan |
| 3 | Liquid 6 Month Plan |
| 11 | Capsules plans, Black Friday, BRAIN HEALTH, CONKA 1, CONKA System, SUPERCHARGE |

Many sit on grandfathered pricing (GBP 48.30, GBP 49, GBP 33). Under the agreed behaviour, the first time any of those 51 touches their subscription in the portal they are forced onto a current plan at current pricing. At 5-10 people that is an acceptable rounding error; at 51 it is a retention decision nobody has actually taken. **Revisit before cutover.**

**The 11 failures split cleanly:**

- **2 "No valid payment method"** (`sienna.charles55@hotmail.com`, `alexlundberg@hotmail.co.uk`). Already failing in Loop's dunning. Agreed: migrate with no payment method, they land in Skio Payment Recovery.
- **9 "variant is deleted"**, every one a retired membership product, across only **4 distinct variants** (counts corrected 1 Sept from the source CSV — the doc previously said 5 C68 contracts and so summed to 8, not 9):

| Deleted variant id | Product | Contracts |
|---|---|---|
| `44143089320221` | C68 Monthly Membership | 6 (`aaron.rts@gmail.com`, `humphreybodington@conka.uk`, `bdraycott@googlemail.com`, `celia_boddy@hotmail.com`, `rosafizzyo@live.co.uk`, `danielnorton2@hotmail.co.uk`) |
| `44143172518173` | Capsules 24 Month Upfront | 1 (`ryrobbins@icloud.com`) |
| `46492991750429` | V23 CONKA OURFC Package | 1 (`jamiescarrott@outlook.com`) |
| `46673899684125` | C2 Monthly Membership | 1 (`adidbz@yahoo.co.uk`) |

  **RESOLVED 1 Sept: map all four to `BOTH-40` (`58457859686774`), migrate PAUSED, do not lapse.** Josiah offered to map them PAUSED provided the variants are in the mapping file; nobody is billed, and we call each customer before anything resumes. Rudh's call was Both monthly rather than a like-for-like product match: mapping a capsules subscriber onto the surviving Capsules plans was considered and rejected, since the target is a dormant container, not an offer, and one consistent destination is simpler to work through on the phone. The 4 rows are in `skio-migration-files/skio-variant-mapping.csv`. Because the mapping is per *variant*, 4 rows cover all 9 contracts. None of the 11 failed contracts appear in `subscriptions-raw.json`, so they sit **outside** the 251, not inside it.

**12 protocol subscribers exist** (4 ACTIVE, 8 PAUSED) across Balance, Resilience and Ultimate. This answers the Phase 5 gate that has been open since June: `app/lib/legacy/protocolSubscriptions.ts`, `ProtocolId` and `PROTOCOL_VARIANTS` **stay**. See `docs/TODO.md`.

### From Josiah (2026-08-31, on the starter-pack conflict)

| Question | Answer | Consequence |
|----------|--------|-------------|
| Do starter contracts sold on Loop pre-migration get picked up? | **Yes — the final migration pulls fresh data**, not the preview snapshot | Go-live is decoupled from the migration date. Section 3 resolved. |
| How does the first-order-only starter box work in Skio? | **Skio Journeys**: a variant swap after the checkout order. He built a demo template for the FLOW SKUs — review variants + pricing logic, customize the end notification, duplicate for the other SKUs, activate | Ours to finish. The Journey only fires on Skio checkouts. |
| What about migrated Loop starter subs (no Skio checkout, so no Journey)? | **He maps them during migration**: once our Journeys are set, he copies the swap logic into the migration mapper so starter SKUs land on the correct variant and price | Tell him when the Journeys are active. Migrated starter subs arrive already swapped. |

### From Josiah (2026-09-01, confirming the plan and asking for the mapping)

Replied to the go-live batch. Everything approved; the migration is confirmed.

| Point | Detail |
|-------|--------|
| Migration start | **Wed 2 Sept, 10:00 EST = 15:00 BST.** He pings Rudh the moment it completes, then we flip the account links. |
| Journey pricing | He noticed our Journeys retain price across the swap and will do the same in the migration mapper. Migrated starter subs keep their charged price. |
| **What he needs from us** | **A CSV with `old_variant_id` and `new_variant_id` columns, not SKUs.** Searching our store by SKU returned multiple hits per search and he would not guess. |
| The 9 dead memberships | He will map them **as PAUSED** — settling the map-vs-lapse contradiction in favour of map — provided their variants are in the same mapping file. |

**Nothing else is outstanding on his side.** The migration runs as soon as he has the mapping file.

Deliverable: [`skio-migration-files/skio-variant-mapping.csv`](skio-migration-files/skio-variant-mapping.csv).

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

### Skio starter variants (created 2026-09-01)

The starter pack is now the primary first-order offer, so each cadence needs a Skio starter variant at the **full one-time base price** (the Loop `*-STARTER-*` variants are fixed-priced at the charged amount — attach one to a percentage plan and it under-bills, e.g. £22.85 instead of £39.99). Compositions and weights copied from the live Loop starters. Attach each to the group shown; `custom.batchexpiry` blank.

| New SKU | Variant name | Product | Base £ | Charged £ | Group (plan GID) | bundlecomposition | Weight |
|---------|--------------|---------|--------|-----------|------------------|-------------------|--------|
| `FLOW-STARTER-20` | 20 Shots Starter Pack | Flow | 69.98 | 39.99 | 20 Shots - Monthly (`712928887158`) | `1xFLOW-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` | 2.5 kg |
| `CLEAR-STARTER-20` | 20 Shots Starter Pack | Clear | 69.98 | 39.99 | 20 Shots - Monthly (`712928887158`) | `1xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` | 2.5 kg |
| `FLOW-STARTER-60` | 60 Shots Starter Pack | Flow | 189.99 | 109.99 | 60 Shots - Quarterly (`712928919926`) | `3xFLOW-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` | 6.65 kg |
| `CLEAR-STARTER-60` | 60 Shots Starter Pack | Clear | 189.99 | 109.99 | 60 Shots - Quarterly (`712928919926`) | `3xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` | 6.65 kg |
| `BOTH-STARTER-40` | 40 Shots Starter Pack | Both | 99.98 | 74.99 | 40 Shots - Monthly (`712928952694`) | `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` | 4.55 kg |
| `BOTH-STARTER-120` | 120 Shots Starter Pack | Both | 279.99 | 149.99 | 120 Shots - Quarterly (`712928985462`) | `3xFLOW-FUNNEL-28+2xCLEAR-FUNNEL-28+1xCONKA-HAT+1xCONKA-TRAVEL-PACK-28` | 10.85 kg |

SKUs follow the Skio charged-shots convention (`FLOW-20` charges for 20, ships 28) and stay distinct from the Loop starters (`FLOW-STARTER-28` etc., named by shipped shots).

**The dual role of the existing Skio variants** (`FLOW-20`, `CLEAR-20`, `FLOW-60`, `CLEAR-60`, `BOTH-40`, `BOTH-120`): in Skio's percentage model the variant price IS the one-time price and the plan applies the discount, so one variant serves as both the OTP (sold bare) and the recurring sub (sold with plan). They are the Journey swap targets — renewals ship the plain box, no gifts. The storefront OTP option still sells `FLOW-FUNNEL-20-OTP` etc. for now; consolidating OTP onto the Skio variants is optional cleanup, deliberately deferred.

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
| `app/lib/offerData.ts` | `getOfferVariant`, `OFFER_VARIANTS` (Loop), `SKIO_OFFER_VARIANTS` (Skio starters, SCRUM-1288) — the live purchase path. `activeOfferVariants()` picks the table from the flag |
| `app/api/auth/skio-portal/route.ts` | Signs the portal iframe src |
| `app/account/manage/*` | The portal page + `SkioPortalFrame` |
| `app/account/page.tsx` | Account entry: Loop list, transition state, or Skio redirect |

Every live subscribe surface routes through `getOfferVariant`. **The flag-gated Skio branch inside it is being built in SCRUM-1288** (it did not exist before 1 Sept; only the flag helpers and portal side were wired): `SKIO_OFFER_VARIANTS` returns the starter variants + Skio plans when the flag is on, reverse lookups resolve BOTH tables so in-flight and migrated lines still render, and the Loop swap helpers stay pinned to the Loop table. One-time cadences untouched.

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

### Swap catalogue lockdown (2026-09-01)

Skio's portal lets a subscriber change product from its "edit products" page. Left open, that picker offers **every** variant on the product, the `-STARTER-` kits included — so an existing subscriber could swap themselves onto a starter variant and start a hat-and-travel-pack-per-renewal contract. The order-1 Journeys do not catch this: they fire on the first order only, never on a mid-life swap.

Closed in the Skio dashboard, per product, no code. For each of Flow, Clear and Both: **Product settings → Show in edit products page for customers** ON → **Only allow certain variants to be shown**, ticking only the plain non-starter subscription variants.

| Product | Allowed swap targets | Variant GID (numeric) |
|---------|----------------------|-----------------------|
| Flow | 20 Shots, 60 Shots | 58457787040118, 58457811550582 |
| Clear | 20 Shots, 60 Shots | 58457822069110, 58457854411126 |
| Both | 40 Shots, 120 Shots | 58457859686774, 58457864077686 |

Everything else is left unticked: all six Skio `*-STARTER-*` variants, every legacy Loop-era funnel variant (`Flow - 20 Shots (Monthly)`, `Flow - 28 Shots`, `Flow - 84 Shots`, `Clear - 80 Shots (Quarterly)` and siblings) and the one-time SKUs. **`Product eligible for one-time upsell` left OFF.**

The allowed set is deliberately identical to the six Journey swap targets, so a mid-life swap and an order-1 Journey land a subscriber on the same variant.

**The paired check — selling plans.** Skio variants are based at the *one-time* price and the plan supplies the discount, so a swap target with no plan bound would move a subscriber onto £69.98 rather than £39.99. In **Product variant selling plans**, every allowed target must show its plan pill (`20 SHOTS - MONTHLY` / `60 SHOTS - QUARTERLY`, and the 40/120 equivalents on Both). Verified on the Clear pair 1 Sept; the Flow and Both pairs still need an eyeball. Legacy variants correctly show no pill.

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

## 10. Synergy fulfilment

**No Synergy-side onboarding is needed for the Skio SKUs** (corrected 1 Sept). Each is a virtual bundle of existing physical SKUs, defined by `custom.bundlecomposition` in Shopify, and the composition does the exploding — Synergy needs nothing when the components are SKUs they already carry. Proven in production by the 1 Sept starter-pack launch on Loop (`*-STARTER-*` SKUs, same pattern, no handoff). The earlier plan to send a 6-SKU mapping email (draft in git history at `skio-synergy-sku-handoff.md`) is dropped.

The real risk is the opposite: a variant **without** the metafield reaches Synergy as a plain SKU and must be hand-fixed on every order — the historic quarterly pain. So the composition metafield is mandatory on every new bundle variant.

**Process for any new or changed subscription variant:** create the variant at base one-time price; set `custom.bundlecomposition` to the physical boxes in single-line `NxSKU+NxSKU` form; leave `custom.batchexpiry` blank; set the weight; verify on the first live order that it exploded into components.

**Cutover rules (Synergy):** the connector pulls only open, paid and unfulfilled orders. Never remove the `IMPORTSYNERGY` tag. Orders cannot be edited after Synergy pulls them.

**Outstanding:** after go-live, spot-check the first normally-paid Skio order pulls, explodes into 28-boxes, and routes to the Synergy location (`#3879` was £0 and auto-fulfilled, so it never pulled).

## 11. Retention and conka-lab

**The retention lab is the separate `conka-lab` repo**, not Klaviyo config. A Python pipeline on Render ingests subscription data into Convex, `sanitize.py` merges Shopify plus subscription data into `sanitized_customers`, a retention engine assigns each customer one of ~21 segments every 6h, and a sync drains those into 14 Klaviyo lists. Everything downstream of `sanitized_customers` is platform-agnostic: it consumes fields by meaning, never by "Loop" or "Skio".

**So the migration surface is conka-lab's ingest adapter, not Klaviyo.** Full detail: conka-lab `docs/featurePlans/loop-to-skio-ingest-migration.md`.

**On the conkaWebsite side the Klaviyo work is trivial:** exactly one flow (`NEW Cancellation Flow`, draft) triggers off a Loop metric and needs re-pointing to Skio's cancellation event. A 2026-08-19 audit found 4 segments in the whole account and **zero** referencing any Loop metric or subscription property. The other 14 retention flows fire off list membership and need no change, as long as their lists keep being populated.

**Does conka-lab need code changes for Josiah's news? No.** The legacy-history coalesce (`conka-api/app/ingest/legacy_coalesce.py`, merged via PR #42, SCRUM-1240) stays exactly as built:

- The **tenure half becomes a backstop** rather than the mechanism, if `createdAt` really does carry through.
- The **pause-history and renewal replay halves remain load-bearing.** Josiah said nothing about replaying Loop audit events and Noah explicitly said they are not replayed, so `pauseEventDates` still starts empty at migration and `CHRONIC_PAUSER` still empties without the replay.
- **`cyclesCompleted` migrating is irrelevant to us.** conka-lab's own plan records that it is not consumed anywhere; `completed_renewal_count` derives from the `order_created` replay.

**Deflection decision.** Cancellation deflection and save-offers move into Skio's portal, matching the no-code direction, and Klaviyo keeps only the post-cancel winback re-pointed onto Skio's cancel event. Skio's in-platform reason tree is why this split is right: the reason gets acted on where it is captured.

### Preview verification checks (RUN 2026-08-27, 3 of 4 green)

| # | Check | Result |
|---|-------|--------|
| 1 | Does `createdAt` carry the original Loop start date? | **PASS.** Dates span 2023-2026, oldest 2023-05-03, `cyclesCompleted` 0 to 58. Josiah was right, Noah was wrong. |
| 2 | Is the Loop sub id present on every contract? | **PASS.** Every line carries `reChargeId`, zero nulls. Note the naming: it sits on `SubscriptionLines`, not the subscription, and is called `reChargeId` rather than anything Loop-shaped. |
| 3 | Do the legacy subscribers appear at their existing interval and price? | **PASS on mechanics, FAIL on the estimate.** They carry their old prices and intervals correctly, but there are **51 of them, not 5-10**. Section 5. |
| 4 | conka-lab Check 13 tenure guard against the preview population | **NOT RUN.** Needs the conka-lab repo. Still required before cutover. |

**What check 1 passing means for conka-lab: still no code change, and the coalesce stays.** The tenure half is now confirmed as a backstop rather than the mechanism. The pause-history and renewal-replay halves remain load-bearing, because nothing in the preview suggests Loop audit events are replayed, so `pauseEventDates` still starts empty at migration and `CHRONIC_PAUSER` still empties without the replay. `cyclesCompleted` migrating remains irrelevant to us, as recorded above.

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
- **Not deleting the legacy protocol commerce layer.** That was Phase 5, ops-gated on confirming no subscriber still holds a protocol contract. **The 27 Aug preview answers it: 12 people do** (4 active, 8 paused). The code stays until those contracts end.

## 14. Change log

Newest first.

- **2026-09-01 (late evening)** - **Mapping sent and acknowledged; Klaviyo blackout confirmed live; migration date corrected.** Josiah confirmed receipt of `skio-variant-mapping.csv` and the pause notes, and starts the migration **Wed 2 Sept**. **The date in this doc was wrong**: it read "Wed 3 Sept", but 1 Sept 2026 is a Tuesday, so Wednesday is the **2nd** and the 3rd is a Thursday. Josiah's own "tomorrow" (written 1 Sept) resolves it to the 2nd. Corrected throughout. Go-live 1 Sept ~12:45 BST to migration 2 Sept 15:00 BST is ~26h, which clears the 24h minimum for Loop carts to drain. `KLAVIYO_ENABLED` **verified `false`** on the Convex dashboard by read-back, after Kristian reported writes reverting or erroring — the value stuck, but his env-write permissions issue is unresolved and now needs fixing before Wed afternoon, not Thursday. Ahead of the blackout deadline: conka-lab ingests at 12:00 UTC, today's run pre-dated the first Skio sale, so the first exposed run is 2 Sept and the flag was false well before it. Separately, `ryrobbins@icloud.com` (Loop id `719010`) **paused in Loop** ahead of a £287.99 six-monthly charge due 2 Sept 15:00 UTC against the deleted capsules variant; their last payment had already FAILED. Verified `PAUSED`, `nextBillingDateEpoch` cleared, not marked for cancellation.
- **2026-09-01 (evening)** - **Josiah confirmed everything; one deliverable left.** Migration starts **Wed 2 Sept 10:00 EST / 15:00 BST**, he pings on completion for the account-link flip, and he will mirror our Journeys' price-retention in the mapper. He needs **one CSV, `old_variant_id` + `new_variant_id`** (SKU search hit multiple variants per query — the Loop `FLOW-STARTER-28` vs Skio `FLOW-STARTER-20` naming collision), and will map the 9 dead-membership contracts **as PAUSED** if their variants are in the same file. That resolves the map-vs-lapse contradiction in favour of map. Six starter rows written to `skio-migration-files/skio-variant-mapping.csv`; the 9 old variant ids still need pulling from his own `failed-subscription-contracts.csv`. **The superseded `-FUNNEL-` variants need no mapping row**: migration maps at the selling-plan level (`LOOP_TO_SKIO_SELLING_PLAN`, all four funnel plans populated), and a contract carries its plan directly, so the variant's own Shopify plan-group attachment is irrelevant to an existing contract. Only the starter kits need swapping, because only they ship gifts.
- **2026-09-01 (late)** - **Portal swap catalogue locked down.** Skio's "edit products" picker was offering every variant on each product, so any existing subscriber could swap onto a `-STARTER-` kit and start a gift-per-renewal contract — the mid-life half of the exposure the order-1 Journeys do not cover (flagged in `docs/TODO.md`, 29 Aug review). Fixed dashboard-side on all three products via **Only allow certain variants to be shown**, restricted to the six plain Skio variants that are also the Journey swap targets (section 8). Selling-plan binding confirmed on the Clear pair; Flow and Both pairs outstanding.
- **2026-09-01 afternoon** - **First real Skio-native sale.** First paying customer subscribed through the new stack. Doubles as the outstanding Synergy routing test (first PAID Skio order — verify it pulls, explodes the bundle, routes correctly). Sets a hard deadline on the Klaviyo blackout: conka-lab's pipeline ingests daily at 12:00 UTC and today's run pre-dated the sale, so the customer is first seen tomorrow ~13:00 UK — `KLAVIYO_ENABLED` must be false by then or they enter OTP/convert flows as a misclassified one-time buyer. Kristian's flip still pending at time of writing. The full lifecycle was verified earlier the same day on a staff test order: create → Journey swap to `FLOW-20` (100% success in Journey analytics) → portal manage → cancel flow → CANCELLED, all confirmed via the Skio API.
- **2026-09-01 ~14:20 BST** - **Journey swap VERIFIED on a live test order.** Rudh placed a real storefront subscription (100%-off staff code, £0, the Noah-recommended method): contract landed ACTIVE in Skio on `FLOW-STARTER-20` at £39.99/month, and within ~a minute the Monthly Starter Swap Journey fired — the line swapped to `FLOW-20` with the plan discount retained (renewal still £39.99). Portal showed and managed the sub throughout. That was the last unproven mechanism; the 9-dead-memberships ask to Josiah was also upgraded from "lapse" to "map to closest current variant but migrate PAUSED, we call each customer" (fallback: lapse). Still open from the test: first PAID Skio order pulling into Synergy (£0 auto-fulfils, never pulls), and the test sub needs cancelling (doubles as a live cancel-flow walkthrough).
- **2026-09-01 ~12:45 BST** - **WENT LIVE ON SKIO.** `feature/skio-integration` merged to main (PR #470); `NEXT_PUBLIC_SKIO_ENABLED` + `NEXT_PUBLIC_SKIO_TRANSITION` true on Vercel prod (fresh build, no cache); `SKIO_STORE_ID_HASH` promoted from Preview-only to Production (was missing — would have broken prod portal login). Smoke test 4/4: sub checkout = 20 Shots Starter Pack, Monthly Subscription, £39.99 recurring, `source: product_page` attribute intact; OTP = full price, no plan; `/account` = Loop list + transition banner; `/account/manage` = Skio portal auto-logged-in. Josiah answered everything (files/251 are truth, PAUSED migrates paused, `remainingUses` decrements, runbook, dates): **migration booked Wed 2 Sept**, preview approved, the 9 dead memberships to be lapsed not mapped, no portal lockdown, default billing window; told him we're headless so we flip our own links on his confirmation. **Klaviyo blackout NOT yet active:** `KLAVIYO_ENABLED` lives on prod Convex (`disciplined-yak-669`, NOT Render/Vercel) and Rudh's account lacks env-write (403) — Kristian asked urgently to flip it and grant write access (needed again Wed for `SUBSCRIPTION_SOURCE=skio` + Klaviyo re-enable). Exposure until his flip is small: the Render pipeline only refreshes customer data daily at 12:00 UTC.
- **2026-09-01 (later)** - **Phase 3c COMPLETE: dashboard + code fully go-live ready.** Six starter variants created and API-verified; purchase wiring built and merged (SCRUM-1288, PR #469); six swap Journeys live (order-1 trigger, starter → plain variant, plan discount retained); Default Cancel Flow live and API-verified (tenure-split 30/20% on too-expensive, skip/date/frequency on too-much-product, custom CONKA copy with app mention on the product-issue sub-reasons, native contract discounts so no customer-visible code). Remaining: the flip itself (env vars + redeploy + Klaviyo off) and the Josiah email.
- **2026-09-01** - **Starter-pack rewire planned (phase 3c) and go-live decoupled from the migration date.** The starter pack launched on Loop as the primary offer; the Skio side predates it, so flipping the flag would have silently dropped the kit (and the Loop starter variants under-bill on percentage plans: £22.85 not £39.99). Plan: six Skio starter variants at one-time base price (section 6 table), existing Skio variants take the dual OTP + swap-target role, Journeys per cadence, then `OFFER_VARIANTS` re-point, then go live. Synergy handoff dropped as unnecessary — bundle compositions of existing SKUs need nothing on their side, proven by the starter launch.
- **2026-08-31** - **Josiah answered the starter-pack questions.** Final migration re-pulls fresh from Loop (blocker resolved; go-live is date-independent). First-order swap = Skio Journeys, demo template built for FLOW. Migrated Loop starter subs get mapped to the swapped variant + price by the migration mapper once our Journeys are active.
- **2026-08-27** - **Migration preview received, reviewed, NOT approved.** Josiah sent the four preview files and asked for approval. Held on a count that does not reconcile: his email says 259 regular subscriptions, his own attachments contain 251. Replied asking for that plus confirmation on paused-state and discount `remainingUses` handling, a cutover runbook, and his available dates. Findings in section 5, check results in section 11. Three things the preview settled: `createdAt` does migrate (Josiah right, Noah wrong), legacy is 51 subscribers not 5-10, and 12 protocol subscribers exist so the Phase 5 code stays.
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
| SCRUM-1288 | Skio starter-pack purchase wiring: flag-gated SKIO_OFFER_VARIANTS | For review |

Epic SCRUM-768 (Shopify & Subscriptions). Phase 4 is ticketed once the date is booked.

## 16. References

- **conka-lab** (the retention pipeline half): `docs/featurePlans/loop-to-skio-ingest-migration.md`
- Migration economics: `docs/ops/subscription-platform.md`
- Canonical SKU and selling-plan GIDs: `docs/product/SKU_AND_SHOT_REFERENCE.md`
- The Loop portal Skio replaces: `docs/features/CUSTOMER_PORTAL.md`
- Skio vendor docs: help.skio.com/docs/new-to-skio, code.skio.com, help.skio.com/docs/how-do-i-render-the-skio-logincustomer-portal-in-an-iframe
