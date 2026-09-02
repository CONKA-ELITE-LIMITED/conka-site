# Retention pipeline cutover: handoff for Kristian

**For:** Kristian (conka-lab, Render, Convex). Self-contained on purpose, so it can be handed straight to an assistant with no access to the conkaWebsite repo.
**When:** Wednesday 2 September 2026, from roughly 14:30 BST.
**Owner on the other side:** Rudh, who gives the go signal once Skio confirm.

---

## 1. What is happening

CONKA is moving subscriptions from **Loop** to **Skio**.

- **1 Sept, ~12:45 BST:** the website went live on Skio. Every new subscription since then is a Skio contract.
- **2 Sept, 14:00 BST:** Skio migrate the existing Loop contracts (251 regular, 16 prepaid, 11 that failed validation and are handled separately). Josiah at Skio runs it and pings Rudh on completion.
- **After that ping:** the retention pipeline has to stop reading Loop and start reading Skio. That is the work below.

## 2. Why the Klaviyo flag is currently off

conka-lab decides whether someone is a subscriber from the subscription source alone (`hasEverSubscribed = !!subscriptionDate`), with no memory between runs. Between the website going live on Skio and the pipeline switching to Skio, the pipeline reads Loop, which knows nothing about the new Skio subscribers. Those people therefore look like **one-time buyers** and get pulled into OTP and convert-to-subscription flows. conka-lab's own docs call this the **early-flip to OTP** failure mode.

`KLAVIYO_ENABLED=false` on prod Convex (`disciplined-yak-669`) is the mitigation and has been false since 1 Sept. It stays false until step 3 below passes.

Transactional email is unaffected. The subscription welcome comes from Skio's native Klaviyo integration on the order event, not from the retention engine.

## 3. The three steps, in order

Do not start until Rudh confirms Skio have finished. Running these mid-migration reads a half-populated Skio.

### Step 1. Re-run the legacy freeze, inside the window

Run it once more after the migration completes. Upsert-by-key absorbs the delta, so a re-run is safe and idempotent.

This is the last chance to capture Loop-era history while Loop is still the source. Once step 2 lands, the pipeline is pointed at Skio and this data is no longer reachable.

Reference: `conka-api/app/ingest/legacy_coalesce.py` (merged in PR #42, SCRUM-1240).

### Step 2. Flip the source

Set `SUBSCRIPTION_SOURCE=skio` on **prod Render**, then deploy.

Order matters: freeze first, flip second. Never re-run the freeze after this flip, it would be reading Skio.

### Step 3. Verify, then and only then re-enable Klaviyo

Check the segment populations look sane before touching the flag. Specifically:

- **No long-tenured subscriber sits in any `NEW_SUB_*` segment.** This is the single most important check. It is the signal that tenure survived the migration.
- Total population is in the right ballpark: 251 regular plus 16 prepaid contracts migrated, of which **51 are paused** and should stay paused.
- Nobody who is plainly a subscriber is sitting in a one-time-buyer or convert-to-subscription segment.

If that all looks right, set `KLAVIYO_ENABLED=true` on prod Convex (`disciplined-yak-669`).

## 4. Two things that will look wrong but are not

**`CHRONIC_PAUSER` empties out.** Skio does not replay Loop's audit events, so `pauseEventDates` starts empty at migration and the segment drains. This is known and expected. The pause-history half of the legacy coalesce exists precisely because of it. Do not treat an empty `CHRONIC_PAUSER` as a failed migration.

**`cyclesCompleted` is not used anywhere.** It does migrate, but conka-lab derives `completed_renewal_count` from the `order_created` replay instead, so it is irrelevant to the segment logic either way.

By contrast, **`createdAt` does carry through**. Verified against Skio's migration preview on 27 Aug: original Loop start dates spanning 2023 to 2026, oldest 2023-05-03. So the tenure check in step 3 is a real check, not a formality. If long-tenured people are landing in `NEW_SUB_*`, something has genuinely gone wrong.

## 5. If verification fails

**Leave `KLAVIYO_ENABLED` at false and tell Rudh.** Do not press on.

There is no deadline on this. The website serves both Loop and Skio subscribers through the transition flags, so nothing is broken for customers while the segments get sorted out. The only cost of staying in the blackout is another day with no strategic retention email, which is much cheaper than emailing 250 subscribers as though they were one-time buyers.

## 6. Out of scope

Not Kristian's side, listed only so nothing falls between the two of us. Rudh handles all of it:

- Disabling Loop auto-billing and customer notifications, then cancelling Loop.
- Turning `NEXT_PUBLIC_SKIO_TRANSITION` off on Vercel and redeploying.
- Re-pointing the one Klaviyo flow that triggers off a Loop metric (`NEW Cancellation Flow`, currently a draft) onto Skio's cancellation event. The other 14 retention flows fire off list membership and need no change, as long as their lists keep being populated, which is what step 3 protects.
- Enabling Skio's native Triple Whale integration.
- Loop code decommission in conka-lab (`loop.py`, the `raw_loop_*` tables and routes, `LOOP_*` env vars). That waits until a retention window has passed, it is not part of this cutover.

## 7. The permissions issue

Rudh currently gets a 403 writing env vars on prod Convex (`disciplined-yak-669`), which is why Kristian is needed on the line for steps 2 and 3. On 1 Sept the dashboard was also reverting or erroring on writes, though the `KLAVIYO_ENABLED=false` value did stick and was confirmed by read-back. Suspected cause is a stale config file listing a single user after a Convex regeneration.

Worth fixing after the cutover so the next one does not need two people in a window.

---

**Canonical plan:** `docs/development/featurePlans/skio-migration.md` in the conkaWebsite repo. The conka-lab half is `docs/featurePlans/loop-to-skio-ingest-migration.md`.
