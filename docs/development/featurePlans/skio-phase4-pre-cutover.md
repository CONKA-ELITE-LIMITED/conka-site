# Skio Phase 4 Pre-Cutover

**Status:** Scoped, Phase 1 not started
**Scale:** B (one to two days)
**Tracking:** This plan doc + Jira (Phase 1 ticketed; Phases 2-3 are docs/verification, no tickets)
**Owner:** Rudh
**Created:** 2026-08-26
**Parent:** [`skio-subscription-migration.md`](./skio-subscription-migration.md) - this is the last work before the parent's Phase 4 cutover.
**State doc:** [`skio-migration-status.md`](./skio-migration-status.md)

---

## Problem

The Skio build is finished (Phases 1-3 done, sitting behind `NEXT_PUBLIC_SKIO_ENABLED`). Three things stand between us and a safe cutover:

1. **Flipping the flag today would orphan every Loop subscriber.** `app/account/page.tsx` redirects every authenticated customer to `/account/manage` (the Skio portal iframe) the moment the flag is on. During the transition window customers exist on both platforms, so a Loop subscriber would land on a Skio portal with no contract for them and be unable to reach their subscription at all.
2. **The documentation carries a contradicted vendor answer** and the wrong cutover sequencing across nine files in two directories.
3. **There is no runbook** for the cutover window.

**Who it serves:** every existing subscriber through the transition, plus us during a high-stakes window.

**Business impact:** retention. A subscriber who cannot reach their subscription for three days cancels or emails support.

## The sequencing correction (2026-08-26)

Josiah (Skio Migration Engineer) confirmed we must **go live with Skio on the frontend BEFORE the migration**, 24 to 48 hours ahead, not in the same window as previously planned. Reason: any contract created in Loop after Skio pulls the data is left out of the migration entirely, so Loop must go static first.

This forces the state the retention plan calls the "early-flip" failure mode: the site is on Skio while the conka-lab pipeline still reads Loop, so new Skio subscribers are classified as one-time buyers and pulled into OTP flows. The documented backstop applies: **`KLAVIYO_ENABLED=false` from go-live until after the post-migration parity check.** Roughly a four-day retention-email blackout. The transactional subscription welcome is unaffected (it comes from the Skio-native Klaviyo integration on the order event, not the retention engine).

**Revised order of operations:**

1. Go live: deploy with `NEXT_PUBLIC_SKIO_ENABLED=true` + `NEXT_PUBLIC_SKIO_TRANSITION=true`, set `KLAVIYO_ENABLED=false`.
2. Wait 24-48 hours so Loop goes static and in-flight Loop carts clear.
3. Skio migrates the Loop contracts.
4. Loop auto-billing and customer notifications off.
5. `SUBSCRIPTION_SOURCE=skio` on prod Render, deploy; turn `NEXT_PUBLIC_SKIO_TRANSITION` off.
6. Verify segment populations, then re-enable `KLAVIYO_ENABLED`.

## Josiah's answers (2026-08-26)

| Question | Answer | Consequence |
|----------|--------|-------------|
| Original start date + cycle count preserved? | **Yes** - Skio migrates both `createdAt` and `cyclesCompleted` | **Contradicts Noah** (19-20 Aug, twice: "created fresh, migration date, no cycle count"). Both are on record. **Verify on the preview**, do not assume. |
| Old to new subscription id mapping | Skio ids only exist after the final migration, but the **preview carries the Loop sub id on every contract** | Sufficient. conka-lab's matching heuristic can become an exact lookup post-migration. |
| Is `migrationIndex` reliable? | Yes, 100%, used for internal operations | Safe to key migrated-contract detection on it. |
| Legacy plans (~5-10 subscribers) | **No Skio mirror plans needed.** They migrate at their existing interval and price and stay there until the customer edits, at which point they are forced onto a current Skio plan | Removes a whole build item. Customer-facing consequence worth noting. |
| Timeline | Preview 1-2 days from access; migration on any Mon-Thu after approval, never Friday | Preview expected 27-28 Aug; migration early the following week. |

**Open with Skio:** does the final migration re-pull fresh from Loop, or use the preview snapshot? If it re-pulls, go-live is 48h before migration day. If it reuses the preview, we must be live before the preview is generated. Asked 26 Aug.

## Does conka-lab retention code need changing?

**No. The legacy coalesce stays exactly as built** (`conka-api/app/ingest/legacy_coalesce.py`, merged to main via PR #42, SCRUM-1240).

Josiah's answer downgrades it, it does not retire it:

- The **tenure half becomes a backstop** rather than the mechanism, since `createdAt` should now carry through.
- The **pause-history and renewal replay halves remain load-bearing.** Josiah said nothing about replaying Loop audit events and Noah explicitly said they are not replayed, so `pauseEventDates` still starts empty at migration and `CHRONIC_PAUSER` still empties without the replay.
- **`cyclesCompleted` migrating is irrelevant to us.** conka-lab's own plan records that it is not consumed anywhere; `completed_renewal_count` derives from the `order_created` replay.

So the change in conka-lab is documentation and the verification plan, not code.

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Dual portal for the transition window | Not Started (Active) - blocks go-live |
| 2 | Documentation consolidation + correction | Not Started (Active) |
| 3 | Preview verification + cutover runbook | Not Started (Active) - gated on Skio's preview |

**Design language:** Simple DTC (account surfaces), matching the existing `/account` treatment.

---

## Phase 1 - Dual portal for the transition window

**Decision (confirmed with Rudh): Loop stays primary on `/account` during the window**, with a link out to the Skio portal. The overwhelming majority of customers remain on Loop until migration completes.

**Approach: a third flag state, not platform detection.** Today `subscriptionsFlag.ts` is binary. Adding `NEXT_PUBLIC_SKIO_TRANSITION` gives us a window state with no extra API call and no failure modes. Detection was considered and rejected: it buys nothing for a three-day window.

1. **[Frontend] Transition state on the account entry point**
   - What: add `subscriptionsInTransition()` to `subscriptionsFlag.ts` reading `NEXT_PUBLIC_SKIO_TRANSITION`. In `app/account/page.tsx`, suppress the redirect to `/account/manage` while transition is true and render the existing Loop list plus a clear route through to the Skio portal. When transition goes false post-migration, current redirect behaviour resumes untouched.
   - Dependencies: none.
   - Complexity: Small.
   - Files: `app/lib/subscriptionsFlag.ts`, `app/account/page.tsx`.

2. **[Frontend] Navigation account entry**
   - What: the desktop and mobile nav account icons point straight at the Skio portal when the flag is on. Same transition treatment so they land on `/account` during the window.
   - Dependencies: task 1.
   - Complexity: Small.
   - Files: `app/components/navigation/NavigationDesktop.tsx`, `app/components/navigation/NavigationMobile.tsx`.

3. **[Copy] Window messaging**
   - What: one line on `/account` explaining subscriptions are moving, so a customer seeing two routes is not confused. Mobile layout checked at 390px.
   - Dependencies: task 1.
   - Complexity: Small.

4. **[Infra] Env var**
   - What: `NEXT_PUBLIC_SKIO_TRANSITION` added to `app/lib/env.ts` optional vars and set on Vercel production at go-live. Build-time flag, so turning it off post-migration is a redeploy.
   - Complexity: Small.
   - Files: `app/lib/env.ts`.

## Phase 2 - Documentation consolidation + correction

1. **[Docs] Consolidate the conkaWebsite Skio doc set.** Nine files across `docs/features/skio/` and `docs/development/featurePlans/`. Establish the spine: `skio-migration-status.md` is the single living state doc, `skio-subscription-migration.md` holds scope and rationale, everything else folds in behind them. Redo the 26 Aug status update lost in a branch switch.
2. **[Docs] Correct the vendor record.** Write the Noah/Josiah contradiction as a contradiction to verify on the preview, not a silent overwrite. Update the cutover sequencing everywhere it appears: go live before migration, not in the same window.
3. **[Docs] Update conka-lab.** Same corrections in `docs/featurePlans/loop-to-skio-ingest-migration.md`, downgrading section 6a.1 from mechanism to backstop for tenure while keeping the pause and renewal replay unchanged. Separate repo, separate commit.

## Phase 3 - Preview verification + cutover runbook

1. **[Verify] Migration-preview checks.** When the preview lands: confirm `createdAt` carries the original Loop start date, confirm the Loop sub id is present on every contract, spot-check the legacy subscribers migrate at their existing interval and price, and run the conka-lab tenure guard (Check 13) against the preview population.
2. **[Docs] Cutover runbook.** Sequence, owners, smoke tests, abort conditions, and the exact `KLAVIYO_ENABLED=false` window boundaries.

---

## Rabbit holes

- **Doc consolidation eating the day.** Cap it: correct what is wrong and make the spine obvious. Do not rewrite for elegance.
- **Building platform detection for the dual portal.** Tempting, unnecessary for a three-day window, and adds failure modes to the account page during the riskiest week.

## No-gos

- Not changing conka-lab retention code. Assessed above; the coalesce stays as built.
- Not touching the cutover code itself. Phases 1-3 of the parent are built and verified.
- Not re-asking Skio about `createdAt`. Josiah answered; we verify on the preview instead.

## Risks

- **Phase 1 is on the critical path.** Go-live gates the migration date, and the dual portal gates go-live.
- **Retention blackout.** Roughly four days with `KLAVIYO_ENABLED=false`. Known, accepted, forced by Skio's process.
- **The `createdAt` contradiction.** If the preview shows Noah was right, the coalesce is load-bearing for tenure too. No new build either way, but it changes how hard we scrutinise the tenure guard before re-enabling Klaviyo.

## References

- Parent plan: [`skio-subscription-migration.md`](./skio-subscription-migration.md)
- Live state: [`skio-migration-status.md`](./skio-migration-status.md)
- Retention side: [`skio-klaviyo-retention-migration.md`](./skio-klaviyo-retention-migration.md)
- conka-lab: `docs/featurePlans/loop-to-skio-ingest-migration.md` (sections 6a.1, 11, 11.4)

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1256 | [Shopify & Subscriptions] Skio Phase 4 pre-cutover: dual portal for the Loop to Skio transition window | 1 | To Do |

Sprint 30, epic SCRUM-768 (Shopify & Subscriptions). Phases 2-3 are documentation and verification, tracked in this doc only.
