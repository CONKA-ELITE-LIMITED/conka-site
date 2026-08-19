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

## Approach

Build the Skio-fed replacements **alongside** the live Loop-fed retention lab (draft / off), then switch at the same coordinated moment as the parent's Phase 4 code cutover. Same "build in parallel, flip at cutover" pattern the whole Skio migration uses, so live subscribers are never disrupted.

**Design language:** N/A - Klaviyo dashboard + segment/flow config; no storefront UI.

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Dependency audit + Loop to Skio mapping table | Not Started (Active) |
| 2 | Connect Skio to Klaviyo (native integration) | Not Started (Active) |
| 3 | Rebuild segments + flows in parallel (draft) | Future (unblocks after 1+2) |
| 4 | Cutover switch (synced with parent Phase 4) | Future |
| 5 | Verify + decommission Loop metrics/segments | Future |

---

## Active phase task breakdown

### Phase 1 - Dependency audit + mapping table (ACTIVE, ticketed)

1. **[Klaviyo] Segment audit.** Pull every segment definition; flag those referencing a `Loop Subscriptions` metric or a Loop-synced profile property; map each flagged segment to the list(s)/flow(s) it feeds. Deliverable: a complete "Loop-dependent segment" inventory. Complexity: Medium.
2. **[Klaviyo] Flow audit.** For each retention-lab flow, record its trigger (metric vs "Added to List") and, for list-triggered ones, the feeding segment. Confirms the full set of retention paths that depend on Loop. Complexity: Small.
3. **[Docs] Loop to Skio mapping table.** The 23 Loop metrics + the Loop profile properties, each mapped to its Skio equivalent (event metric or `skio_*` property). Right-hand column for event metrics is filled in Phase 2 once real Skio events arrive; profile-property column seeded now from the `skio_*` list above. Complexity: Small.
4. **[Decision] RETENTION15 cancellation handling.** Decide: keep cancellation deflection as a Klaviyo flow off Skio's cancel event, or move save-offers into Skio's portal deflection (the parent removes the self-built RETENTION15 flow at Phase 4). Complexity: decision, not build.

### Phase 2 - Connect Skio to Klaviyo (ACTIVE)

1. **[Klaviyo/Skio] Enable Skio's native Klaviyo integration** so Skio events + `skio_*` properties start flowing in as new metrics/properties.
2. **[Docs] Capture the real Skio event-metric names** (fire events via the test subscription) and complete the mapping table's event column.
3. **[Verify] Confirm profile-property sync** - that the `skio_*` properties our segments will rely on actually populate on a real profile.

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
