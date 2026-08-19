# Loop to Skio: Klaviyo / Retention-Lab Migration

**Status:** Scoped, not started
**Scale:** C (multi-day, but almost all Klaviyo dashboard config + a segment audit, minimal repo code)
**Tracking:** This plan doc + Jira (Phase 1 ticketed; later phases ticketed at build time)
**Owner:** Rudh
**Created:** 2026-08-19
**Parent:** [`skio-subscription-migration.md`](./skio-subscription-migration.md) - this realises the parent's Phase 4 retention piece and its "retention analytics via Skio webhooks" follow-up.

---

## Problem

Our Klaviyo retention lab (churn winback, dunning, pause/reactivation, replenishment, and the behavioural lifecycle segments) runs on **Loop's subscription data**: 23 "Loop Subscriptions" event metrics plus Loop-synced profile properties. At the Loop to Skio cutover, Loop stops sending events and updating those properties. If every dependent segment and flow is not re-pointed to Skio's equivalents first, the entire retention lab **goes quiet with no error** - lost winbacks, missed dunning (involuntary churn), no replenishment nudges.

This is pure **retention / LTV**, not acquisition. It serves every subscriber and protects churn-recovery revenue through the cutover.

## Key finding (discovery, 2026-08-19)

Pulled from Klaviyo this session:

- **23 "Loop Subscriptions" metrics** feed Klaviyo (the full subscription-event vocabulary, see the mapping table below).
- **No Skio integration is connected yet** - Loop is the only subscription integration in the account.
- **The direct metric-trigger dependency is tiny:** exactly ONE flow triggers straight off a Loop metric - "NEW Cancellation Flow" (draft) off `Loop Subscription Cancelled`.
- **The real dependency is the segment-driven retention lab.** The ~20 behavioural flows (Chronic Pauser, Involuntary Churn, Reactivated from Pause, Won Back from Cancel, Dunning, Payment Recovered, Monthly Stable, Monthly Watchful, Quarterly VIP Stable, Low Frequency, New Sub Converted, Repeat OTP, and more) trigger off **"Added to List"**, and those lists are populated by **segments built on Loop metrics + Loop-synced profile properties**. The breakage lives in the **segment definitions**, not the flow triggers, so it is invisible until you open each segment.

## Resolved: does Skio's Klaviyo integration sync profile properties?

**Yes - both events and profile properties.** Skio's native Klaviyo integration sends subscription events (metrics) AND a set of custom profile properties, all `skio_*` prefixed, e.g. `skio_nextBillingDate`, `skio_cyclesCompleted`, `skio_remainingCyclesUntilRenewal`, `skio_nextRenewalDate`, `skio_hasActiveSubscription` / `skio_activeSubscriptionCount`, `skio_hasPausedSubscription` / `skio_pausedSubscriptionCount`, `skio_hasFailedSubscription` / `skio_failedSubscriptionCount`, `skio_hasCancelledSubscription` / `skio_cancelledSubscriptionCount`, `skio_hasPrepaidSubscription`, `skio_totalItemQuantity`, `skio_hasBackupPaymentMethod`, `skio_membership_tier`, `skio_referralCode`, `skio_storefrontUserId`. The **names differ from Loop's**, so every segment referencing a Loop property must be re-pointed to the `skio_*` equivalent. The full **event-metric** name list is thin in the docs (only `subscriptionCreated` is named) and is best captured live once the integration is connected (Phase 2). Source: help.skio.com/docs/skio-event-and-profile-properties-in-klaviyo.

## Phase 1 findings (2026-08-19, SCRUM-1233)

The audit reshaped the risk picture: **almost none of the Loop coupling lives inside Klaviyo.** The earlier assumption (retention-lab flows fed by Loop-built segments) was wrong.

**Segment audit:** 4 segments exist in the whole account, and **0 reference any Loop metric or subscription property**. They are all `userType` app-audience segments (Athlete / Coach / Everyday) plus one non-Loop exclusion segment. No Loop→Skio risk in segments.

**Flow audit (18 retention / cancellation / replenishment flows):**

| Coupling | Flows | Detail |
|----------|-------|--------|
| **Direct Loop-metric trigger** | `NEW Cancellation Flow` (`WQxVrN`, draft) | Triggers on `Loop Subscription Cancelled` (`Uxj4vP`). The ONE hard in-Klaviyo Loop dependency. Re-point to Skio's cancellation event. |
| **List-membership triggered** (no Loop in trigger/filter) | 14 "(TEST)" flows: Chronic Pauser, Dunning, Payment Recovered, Involuntary Churn, Reactivated from Pause, Won Back from Cancel, Cancelled Winback, New Sub Converted, Repeat OTP, Habitual OTP, Low Frequency, Monthly Watchful, Monthly Stable, Quarterly VIP Stable | Each fires off "Added to List" for its own list and filters only on that membership. Lists: `U2Ari5`, `Yj6vh4`, `U7dFDt`, `SiMN8Y`, `XG5sEr`, `TucD2Q`, `S4U36N`, `SLyk4P`, `XsbFCf`, `VDKN7L`, `TVXaWF`, `XwNVXD`, `WTMTm2`, `QTvccW`. |
| **Non-Loop metric trigger** | `Cancellation Flow` (`Vs5RRf`), `Replenishment Reminder - Standard` (`WapsuW`), `Customer Winback - Standard` (`Vj5zYe`), all draft | Trigger on metric `WLjkbP` (not a Loop metric, e.g. a Shopify order metric). Loop-independent. |

**The dependency moved upstream.** Because no segment feeds those 14 lists, the retention lab's real Loop coupling (if any) is **whatever external process populates the 14 lists** - a reverse-ETL / warehouse job / custom sync that classifies subscribers from Loop data and pushes them into Klaviyo lists. That process lives OUTSIDE Klaviyo and is the actual thing that must be re-pointed from Loop to Skio at cutover. Identifying it is the critical next step (Phase 2).

**Revised risk:** far smaller inside Klaviyo than assumed - only 1 draft flow to re-point. The migration weight is (a) tracing + re-pointing the external list-population source, and (b) the cancellation re-point. The 14 flows themselves need no change as long as their lists keep getting populated from Skio data.

**RETENTION15 decision (recommendation):** move cancellation **deflection / save-offers into Skio's portal** (matches the no-code iframe direction; the parent removes the self-built RETENTION15 code flow at Phase 4), and keep a **post-cancel winback** as a Klaviyo flow re-pointed from `NEW Cancellation Flow`'s Loop trigger to Skio's cancellation event. So: deflection = Skio portal; winback = Klaviyo off the Skio cancel event.

## Phase 2 finding (2026-08-19): the retention lab is `conka-lab`, and the migration surface is its Loop ingest adapter

Traced the list-population source (Phase 2 task 1). **The retention lab is the separate `conka-lab` repo** (Convex + a Python pipeline on Render), NOT Klaviyo config, and NOT Loop's native Klaviyo integration. It computes cohorts and pushes profiles into the Klaviyo lists itself.

**How the 14 lists get populated:**
- Python pipeline (`conka-api/app/pipeline/`, daily 12:00 UTC on Render) ingests **Loop REST** (subscriptions, activity logs, orders, billing attempts) into Convex `raw_loop_*` tables; `sanitize.py` merges Shopify + Loop into `sanitized_customers` / `sanitized_orders` (the source of truth).
- The retention engine (`convex/actions/retentionEval.ts`, every 6h) reads only `sanitized_customers`, assigns each customer one of ~21 segments, writes `customer_segment_membership`, and enqueues add/remove ops to `klaviyo_sync_queue`.
- `klaviyoSync.processQueue` (cron every 30 min) drains the queue into the Klaviyo API (add/remove-to-list + `conka_*` profile properties). Cohort to Klaviyo-list mapping lives in Convex `segment_definitions.klaviyoListId`; master kill switch env `KLAVIYO_ENABLED`.

**Where Loop enters (the ONLY migration surface):** the ingest + `sanitize.py` layer of the Python pipeline. Loop-specific fields the engine depends on: `billingFrequency` (Loop `billing_policy`), pause/resume event dates (Loop activity logs), `cancellationReason`/`cancellationComment`, `lastBillingStatus` (Loop billing attempts), `isPrepaid`, and the involuntary-churn signal (Loop `payment_failed_last_retry` -> `subscription_cancelled`).

**What survives unchanged:** everything downstream of `sanitized_customers` - the retention engine, all ~21 segment rules, the `conka_*` properties, and the entire Klaviyo sync layer - is platform-agnostic (consumes fields by meaning, not Loop identity). The 14 Klaviyo lists and their flows need no change as long as `sanitized_customers` keeps being populated with equivalent fields.

**So the real migration is a `conka-lab` ingest-adapter rewrite** (Loop REST -> Skio API/webhooks), repopulating the same sanitized fields - NOT a Klaviyo re-point. Key fields Skio must supply: billing frequency, last-billing-status (FAILED/SUCCESS), pause/resume dates, and a voluntary-vs-involuntary cancellation distinction (Skio's status model differs from Loop's 3-state machine, so the involuntary-churn derivation needs re-validation). All the Loop-payload workarounds in conka-lab's `KNOWN_DATA_DISCREPANCIES.md` get re-solved or made moot against Skio's schema.

**Boundary:** this work belongs in the **`conka-lab` repo** (its own docs + tickets), not conkaWebsite. This plan records the finding and the boundary; the conka-lab ingest-adapter migration is scoped there. The conkaWebsite-side Klaviyo work stays trivial (re-point the 1 draft cancellation flow, or replace it with a `conka_*`-driven signal).

## Approach

Build the Skio-fed replacements **alongside** the live Loop-fed retention lab (draft / off), then switch at the same coordinated moment as the parent's Phase 4 code cutover. Same "build in parallel, flip at cutover" pattern the whole Skio migration uses, so live subscribers are never disrupted.

**Design language:** N/A - Klaviyo dashboard + segment/flow config; no storefront UI.

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Dependency audit + Loop to Skio mapping table | **Done (2026-08-19, SCRUM-1233) - see Phase 1 findings** |
| 2 | Connect Skio to Klaviyo + trace the retention-lab list-population source | Not Started (Active) |
| 3 | Rebuild segments + flows in parallel (draft) | Future (unblocks after 1+2) |
| 4 | Cutover switch (synced with parent Phase 4) | Future |
| 5 | Verify + decommission Loop metrics/segments | Future |

---

## Active phase task breakdown

### Phase 1 - Dependency audit + mapping table (DONE, SCRUM-1233)

1. ~~**[Klaviyo] Segment audit.**~~ **DONE** - 4 segments, 0 Loop-dependent (see Phase 1 findings).
2. ~~**[Klaviyo] Flow audit.**~~ **DONE** - 18 flows audited; only `NEW Cancellation Flow` (draft) couples to a Loop metric; 14 fire off list membership; 3 use a non-Loop metric.
3. ~~**[Docs] Loop to Skio mapping table.**~~ **DONE** - seeded below; event column fills in Phase 2 from live Skio events.
4. ~~**[Decision] RETENTION15 cancellation handling.**~~ **DECIDED** (recommendation recorded in Phase 1 findings): deflection in Skio portal, winback as a Klaviyo flow off the Skio cancel event.

### Phase 2 - Connect Skio to Klaviyo + trace list population (ACTIVE)

1. ~~**[Investigate] Trace the retention-lab list-population source.**~~ **DONE** - it is the `conka-lab` repo's pipeline (see Phase 2 finding). The real migration surface is conka-lab's Loop ingest adapter, not Klaviyo.
2. **[conka-lab] Scope + build the Loop -> Skio ingest-adapter rewrite.** In the `conka-lab` repo (its own ticket): swap the Python pipeline's Loop REST ingest for Skio, repopulate `raw_*` -> `sanitized_customers` with the same fields the retention engine depends on, and re-validate the voluntary-vs-involuntary churn derivation against Skio's status model. Everything downstream is untouched. Complexity: Large (but isolated to the ingest/sanitize layer).
3. **[conkaWebsite/Klaviyo] Re-point the one cancellation flow.** Either connect Skio's native Klaviyo integration for the cancel event, or replace `NEW Cancellation Flow`'s Loop trigger with a `conka_*`-driven signal from conka-lab. Trivial. Complexity: Small.
4. **[Verify] End-to-end** - after the conka-lab adapter is live on Skio data, confirm a test subscriber flows through sanitize -> segment -> Klaviyo list correctly.

Phases 3-5 (rebuild in parallel, cutover switch, verify + decommission) live here and are ticketed at build time, matching the parent doc's convention.

---

## Loop metric vocabulary (mapping-table seed)

The 23 Loop metrics to map. Skio-equivalent column filled in Phase 2 from live events.

| Group | Loop metric | Skio equivalent |
|-------|-------------|-----------------|
| Lifecycle | Loop Subscription Started | TBD (Phase 2) |
| Lifecycle | Loop Subscription Cancelled | TBD |
| Lifecycle | Loop Subscription Paused | TBD |
| Lifecycle | Loop Subscription Resumed | TBD |
| Lifecycle | Loop Subscription Reactivated | TBD |
| Lifecycle | Loop Subscription Expired | TBD |
| Lifecycle | Loop Subscription Rescheduled | TBD |
| Lifecycle | Loop Subscription Delayed | TBD |
| Lifecycle | Loop Subscription Marked For Cancellation | TBD (may have no exact Skio equivalent) |
| Lifecycle | Loop Subscription Lines Changed | TBD |
| Orders | Loop Upcoming Order | TBD |
| Orders | Loop Order Processed | TBD |
| Orders | Loop Order Skipped | TBD |
| Orders | Loop Order Unskipped | TBD |
| Orders | Loop Order Out Of Stock | TBD |
| Billing | Loop Billing Attempt Failed | TBD |
| Billing | Loop Billing Attempt Failed and will be Retried | TBD |
| Billing | Loop Billing Attempt Failed and Last Retry Left | TBD |
| Billing | Loop Payment Method Expiring | TBD |
| Account | Loop Customer Data Sync | TBD |
| Account | Loop Customer Account Activation | TBD |
| Account | Loop Send Customer Login Link | TBD |
| Account | Loop Flow Completed | TBD |

---

## Rabbit holes

- **Invisible segment dependencies.** The breakage is in segment definitions, not flow triggers. Missing one segment = one silently-dead retention path. The Phase 1 audit is the guard; treat it as blocking.
- **Skio metric-name guessing.** Do not hardcode assumed Skio event names; capture the real ones from live Skio events in Phase 2.
- **Profile properties, not just events.** Loop syncs profile props (next order date, status, pause/failed counts) that segments filter on. These need `skio_*` equivalents too, not only the event metrics - and the names differ.
- **Skio granularity may differ from Loop's** (e.g. no exact "Marked For Cancellation" event). Some flows may need re-logic, not a 1:1 swap. The mapping table surfaces these gaps.

## No-gos

- Not rebuilding flows from scratch - clone and re-point, preserving copy/timing.
- Not touching live Loop segments/flows until the synced cutover.
- Not deleting Loop metrics/segments until Phase 5 (post-cutover, verified).

## Risks

- **Silent retention loss at cutover** - mitigated by build-in-parallel + a switch synced to the parent's Phase 4.
- **Skio event granularity differs from Loop's** - surfaced by the mapping table; budget for some re-logic.

## References

- Parent plan: [`skio-subscription-migration.md`](./skio-subscription-migration.md) (Phase 4 + retention-analytics follow-up)
- Canonical Skio reference: [`../../features/skio/migration.md`](../../features/skio/migration.md) ("Answers from Skio" - native Triple Whale + lifecycle webhooks)
- Attribution/fulfilment parity: [`skio-attribution-fulfilment-parity.md`](./skio-attribution-fulfilment-parity.md)
- Skio: help.skio.com/docs/skio-event-and-profile-properties-in-klaviyo ; help.skio.com Klaviyo Integration + "Upgrading to the New Klaviyo Integration"

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1233 | [Shopify & Subscriptions] Klaviyo retention-lab: Loop-dependency audit + Loop to Skio mapping (Phase 1) | 1 | To Do |

Epic SCRUM-768 (Shopify & Subscriptions). Phases 2-5 ticketed at build time.
