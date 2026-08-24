# Loop to Skio: Klaviyo / Retention-Lab Migration

**Status:** Scoped, not started
**Scale:** C (multi-day, but almost all Klaviyo dashboard config + a segment audit, minimal repo code)
**Tracking:** This plan doc + Jira (Phase 1 ticketed; later phases ticketed at build time)
**Owner:** Rudh
**Created:** 2026-08-19
**Last updated:** 2026-08-24 (Skio's answers parsed - see "Skio's answers" below)
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

## Skio's answers (2026-08-24): two consequences for the retention lab

Skio (Noah) answered our data-model questions across three emails on 19-20 Aug. Most confirmed what we had already inferred from the docs. Two answers were new, and both are negative:

### 1. Cancel reasons are not available over the API

Skio confirmed cancellation reasons are **not currently retrievable via the API** - it is an approved feature request still in development. They are available only through dashboard exports / Cancel Flow analytics, and Skio added that sub-reasons and free-text entered under "Other" have "historically had limited or inconsistent export support" and are "not a reliable API reporting surface."

This is a **regression against Loop**, which served `cancellationReason` and `cancellationComment` straight off the subscription object.

**What actually breaks - narrower than it first looks, and see the event-layer finding below, which largely closes it.** The retention engine's `isInvoluntaryChurn` derivation tests *cancellation reason is empty* as the involuntary signal. With the reason permanently empty the rule collapses to "cancelled AND last billing attempt FAILED". That still classifies the large majority correctly, because a voluntary cancel from a healthy subscriber has `lastBillingStatus = SUCCESS`. The one population it misreads is **customers who cancel voluntarily while already in dunning** - a case Skio explicitly calls out - who get payment-recovery messaging instead of a winback. Bounded, and arguably not badly wrong for that person.

The apparent loss was **automated reason-breakdown reporting** ("why are people leaving") dropping to a manual CSV export. The event-layer finding below removes that too - reasons arrive on the cancellation event.

**Why the gap exists (and why it is not a defect).** Skio is a no-code platform: you build the cancellation reason tree in their cancel-flow builder and branch save-offers off each reason *inside Skio*, and their own analytics report on it. The reason never has to leave Skio for Skio's purposes. Our previous model was the opposite - capture the reason, ship it to conka-lab, act on it in Klaviyo. The API gap is that difference showing, not a missing feature, which is also why the feature request exists but is not urgent for them.

**This vindicates the deflection decision.** Phase 1 already decided deflection moves into Skio's portal with Klaviyo keeping only the post-cancel winback. Skio's in-platform reason tree is precisely why that is the right split: the reason gets acted on where it is captured, so it never needs to cross the API boundary to drive a save-offer. What crosses the boundary is only the *outcome* (cancelled), which we do get.

**Reasons DO reach us - through the event layer, not the API** (verified against Skio's docs, 2026-08-24). Noah answered narrowly and correctly about the API; the data leaves Skio a different way:

- The **`subscriptionCancelled`** event payload carries **`cancellationReason`** (root reason) and **`finalCancellationReason`** (specific / sub-reason).
- Skio's own guidance for [winback flows in Klaviyo](https://help.skio.com/docs/creating-winback-flows-in-klaviyo-1) is to add a trigger split on dimension `cancellationReason` - so the property is confirmed present in Klaviyo, by their own recommended pattern.
- The same payload is available over Skio's [custom webhook](https://integrate.skio.com/skio/platform-integrations/custom-webhook-integration-for-email-sms-platforms), if we prefer a direct feed to a Klaviyo round-trip.
- `skioSubscriptionCancellationReason` additionally covers merchant-initiated cancellations.

**This is strictly better than the CSV path Skio pointed us at.** `finalCancellationReason` is the sub-reason - precisely the field Noah flagged as having unreliable *export* support. Taking it off the event stream sidesteps that.

**Consequence: the involuntary/voluntary split does not need redesigning.** With the reason present on the event, the original rule (reason empty = involuntary) holds - it just sources from the event stream rather than the subscription object. conka-lab section 6a.2 shrinks from a redesign to a re-plumb. Audit-log status transitions remain the fallback and a useful cross-check, not the primary mechanism.

**Two routes to pick between** (conka-lab decision, not blocking): read the reason back off Klaviyo events via the Klaviyo API, which suits the existing batch pipeline; or receive Skio's custom webhook directly, which is cleaner but needs a receiver conka-lab does not currently have.

**The replacement signal, if the answer is no.** Skio recommends triggering on **status transitions** rather than a current-state snapshot, and their audit log tracks `ACTIVE -> FAILED`, `FAILED -> ACTIVE` and `-> CANCELLED`. A cancellation reached via `FAILED -> CANCELLED` is passive/involuntary. We need a boolean, not the reason text. `cancellationComment` should be treated as gone either way. Detail: conka-lab plan section 6a.2.

### 2. Migrated subscriptions reset their start date and cycle count

Skio confirmed twice that migrated contracts are created as **new** Shopify/Skio contracts at migration time: create date = migration date, no prior cycle count, and no replay of Loop's pauses, skips, cancellations or dunning attempts. Next-charge dates and Shopify order history do carry over.

**What breaks:** subscriber tenure. Tenure is what separates the `NEW_SUB_*` onboarding segments from the steady-state ones, so taken naively the entire back book re-materialises at cutover with tenure ~0 and is pitched the new-subscriber welcome sequence. Pause history goes blank too, so `CHRONIC_PAUSER` empties out (quieter, not wrong-email, but a real behaviour change). This was previously the open branch in the conka-lab plan's section 11 decision tree; Skio's answer collapses it to the bad branch, so it is now **a certainty to build for, not a risk to monitor**.

Note this hits the **native Skio Klaviyo integration too**, not just our pipeline: `skio_cyclesCompleted` and any tenure-flavoured `skio_*` profile property will be reset for migrated subscribers. Any flow we re-point onto those properties inherits the same distortion.

**Mitigations, in order of preference:**

1. **Ask Skio to stamp the original start date and cycle count into each migrated contract** (`metadata` / `note` / `customAttributes`). They already write a `migrationIndex` on migrated subscriptions, so migration-time writes are clearly possible. If they will do this, the problem disappears at source. Raised as open question 2 in the parent plan.
2. **Freeze Loop-derived history before cutover and coalesce it in** (conka-lab, ours, no Skio dependency): snapshot per-customer first-subscription date, completed renewals and pause dates from the `raw_loop_*` tables, then have sanitize take the earlier of the Loop start and the Skio create date. Build this regardless of (1).
3. **Mute the retention sync across the cutover window** - set `KLAVIYO_ENABLED=false` for the duration and re-enable only after a post-migration segment-parity check passes. The migration takes 2-4 days, during which the subscriber population is split across both platforms, so this is cheap insurance against a mass mis-segmentation reaching inboxes. Added as Phase 4 task 1b in the parent plan.

### Confirmed, no action beyond what was planned

- **Status model** - `status` (`ACTIVE` / `FAILED` / `PAUSED` / `CANCELLED` / `UNDER_REVIEW`) plus optional `statusContext` (e.g. `DUNNING`). Dunning subscriptions sit in `FAILED`, never `ACTIVE`. Matches what we had already mapped, and matches the engine's existing dunning/cancelled split.
- **Pause history** - audit log per subscriber, segments for the wide view.
- **Lifecycle events** - the audit-log / event table is confirmed as the right source for a scheduled feed.
- **Historical backfill** - Public REST API (cursor pagination) or the BigQuery integration; not paged GraphQL.

---

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

Cross-cutting: Skio's own answers (19-20 Aug) are parsed in ["Skio's answers"](#skios-answers-2026-08-24-two-consequences-for-the-retention-lab) below - they change *how* Phase 2's ingest work derives churn, and add a cutover safeguard.

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
4. **[Skio dashboard] Build the cancel flow: reason tree + save-offers.** Phase 1 decided deflection moves into Skio's portal, but that is recorded as a *decision* with no task behind it. Someone has to actually build it in the Skio dashboard: the cancellation reason tree, the per-reason branches, and a recreation of the current RETENTION15 15%-off save offer including its discount mechanics. Pre-cutover, because the parent plan deletes our own RETENTION15 code flow at Phase 4 - if Skio's flow is not built by then we ship a cancel journey with no deflection at all. Complexity: Medium (dashboard config, no code), owner Rudh/ops.
5. **[Verify] Cancel-reason event payload on live data.** Skio's docs confirm `cancellationReason` + `finalCancellationReason` ship on `subscriptionCancelled`. Once the integration is connected, confirm on a real event and record the exact reason string vocabulary (needed because Klaviyo's `contains` operator is case-sensitive, and the strings are whatever was configured in Skio's cancel-flow builder). Then decide the ingest route: Klaviyo API read vs direct webhook. Complexity: Small.
6. **[Verify] End-to-end** - after the conka-lab adapter is live on Skio data, confirm a test subscriber flows through sanitize -> segment -> Klaviyo list correctly.

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
- **Mass mis-segmentation at cutover** (new, confirmed 2026-08-24) - migrated contracts reset tenure and cycle count, so without the legacy-history coalesce the back book classifies as brand-new subscribers and receives onboarding email. Mitigated by the three steps in "Skio's answers"; `KLAVIYO_ENABLED=false` across the window is the backstop.
- **Involuntary/voluntary churn misclassification** (new, confirmed 2026-08-24) - cancel reasons are not API-exposed, so a customer who cancels voluntarily while in dunning reads as involuntary churn until the derivation moves to audit-log status transitions.

## Cross-repo tracking

The substantive migration work (the Loop -> Skio ingest-adapter rewrite) lives in the **`conka-lab` repo**, not here. This doc is the conkaWebsite-side record + boundary; the conka-lab pipeline migration is scoped there.

- **conka-lab plan (the ingest-adapter rewrite):** `conka-lab` repo -> `docs/featurePlans/loop-to-skio-ingest-migration.md` (expected path; the conka-lab session creates it and should back-link to this doc).
- **This doc covers:** the Klaviyo-side dependency audit (SCRUM-1233) + the trivial conkaWebsite re-point (1 cancellation flow).
- **conka-lab covers:** rewriting `conka-api/app/pipeline/` ingest + `sanitize.py` from Loop REST to Skio, keeping `sanitized_customers` schema-stable.
- **Cutover is synced** to the parent's Phase 4 (both repos flip together, Loop billing off at the same moment).

## References

- Parent plan: [`skio-subscription-migration.md`](./skio-subscription-migration.md) (Phase 4 + retention-analytics follow-up)
- Canonical Skio reference: [`../../features/skio/migration.md`](../../features/skio/migration.md)
- Attribution/fulfilment parity: [`skio-attribution-fulfilment-parity.md`](./skio-attribution-fulfilment-parity.md)
- Data-pipeline half (the substantive work): **conka-lab repo** `docs/featurePlans/loop-to-skio-ingest-migration.md`
- Skio: help.skio.com/docs/skio-event-and-profile-properties-in-klaviyo ; help.skio.com Klaviyo Integration + "Upgrading to the New Klaviyo Integration"

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1233 | [Shopify & Subscriptions] Klaviyo retention-lab: Loop-dependency audit + Loop to Skio mapping (Phase 1) | 1 | To Do |

Epic SCRUM-768 (Shopify & Subscriptions). Phases 2-5 ticketed at build time.
