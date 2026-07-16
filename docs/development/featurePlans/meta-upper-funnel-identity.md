# Meta upper-funnel identity (Problem A)

**Status:** Scoped 2026-07-16. Phase 1 and Phase 2 active.

**Source of truth for the diagnosis:** `docs/analytics/ATTRIBUTION_STATE_AND_PLAN.md`. That document holds the evidence, the Meta numbers, and the three-problem split (A quality, B coverage, C rebills). This plan covers **Problem A only** and does not re-derive the diagnosis. Two corrections this plan makes to that document are recorded under "Corrections to the source doc" below.

---

## Problem

Events from logged-out ad visitors reach Meta carrying almost no identity. An anonymous AddToCart ships with only `client_ip_address`, `client_user_agent`, and a patchy `_fbp`. That is why AddToCart scores 3.2/10 and InitiateCheckout 3.0/10, while Purchase scores 6.6/10: the Shopify order hands the Purchase webhook an email, a name, and an address. The gap is identity, not volume.

**Who it serves:** cold paid traffic from Meta. The majority of paid visitors are logged out and never give an email before checkout.

**Business impact:** Acquisition / CRO. Better-matched upper-funnel events give Meta usable signal to learn from, and make events attributable to the ad click.

**Honest ceiling:** the Klaviyo popup is off, so cold traffic gives us no email pre-checkout. Expect upper-funnel EMQ to move from roughly 3 to roughly 4-5, not 6+. The attribution continuity is the real win, not the score.

**Appetite:** a day or two.

**Design system:** not applicable. No UI surface.

---

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Identity on every client event (`_fbp` + `conka_uid` + `external_id`) | Not Started |
| 2 | `external_id` continuity to Purchase (cart attributes to order to webhook) | Not Started |
| 3 | Email where it already exists (A2): cognitive-test EmailCaptureForm + quiz | Future |
| 4 | ViewContent on the `/go` listicle (B2, a coverage problem not a quality one) | Future |

Phases 3 and 4 are deliberately out of this phase and get their own tickets. Phase 4 belongs to Problem B, not A, and is tracked here only so it is not lost.

---

## Phase 1: Identity on every client event

1. **Cookie helpers plus `ensureFbp()` and `getOrCreateExternalId()`**
   - Shared `readCookie` / `writeCookie` helpers scoped to `.conka.io` so the Shopify-hosted checkout on `shop.conka.io` reads the same ids.
   - `ensureFbp()`: when `_fbp` is absent, write one in Meta's format `fb.1.<timestamp>.<random>`. Meta's pixel adopts an existing `_fbp` rather than replacing it, so there is no split identity. This is the same pattern `captureFbcFromUrl()` already uses for `_fbc`.
   - `getOrCreateExternalId()`: read a `conka_uid` cookie; if absent, mint a UUID and persist it.
   - Complexity: Small. Files: `app/lib/metaPixel.ts`

2. **Wire identity into every event**
   - `trackWithDedup` calls `ensureFbp()` in place of `getFbp()` and adds `external_id`.
   - Extend the `sendToCAPI` `user_data` type to carry `external_id`.
   - Dependencies: task 1. Complexity: Small. Files: `app/lib/metaPixel.ts`

3. **Accept and hash `external_id` server-side**
   - Accept `user_data.external_id` and hash it with the same trim plus lowercase SHA-256 used by `hashNormalized` in `app/lib/metaCapi.ts`.
   - Dependencies: task 2. Complexity: Small. Files: `app/api/meta/events/route.ts`

4. **Mint identity on landing**
   - Call `ensureFbp()` alongside the existing `captureFbcFromUrl()` so the cookie exists before the first cart action and independently of pixel load.
   - Dependencies: task 1. Complexity: Small. Files: `app/components/MetaPageViewTracker.tsx`

## Phase 2: external_id continuity to Purchase

5. **Add `conka_uid` to cart attributes**
   - `buildMetaCartAttributes()` also emits `conka_uid`, riding the same path `_fbp` and `_fbc` already travel: `CartContext` to `app/api/cart/route.ts` to the order's `note_attributes`. That path is proven, with `_fbp` present on 100% of web checkouts since 2026-06-02.
   - Dependencies: Phase 1. Complexity: Small. Files: `app/lib/metaPixel.ts`

6. **Send `conka_uid` as `external_id` on Purchase**
   - Read `conka_uid` from `note_attributes` via the existing `noteAttr(order, ...)` helper and send it alongside the Shopify customer id using the array form `metaCapi.ts` already uses (`ud.external_id = [...]`).
   - Dependencies: task 5. Complexity: Small. Files: `app/api/webhooks/shopify/orders/route.ts`, `app/lib/metaCapi.ts`

---

## Technical decisions and rationale

**`external_id` becomes `conka_uid` on every event.**
Today the client CAPI route sets `external_id` to the hashed email (`app/api/meta/events/route.ts:100`) while the Purchase webhook sets it to the Shopify customer id (`app/api/webhooks/shopify/orders/route.ts:200`). Those are different values for the same person, so they never match, and `external_id` currently does nothing across the funnel. Meta requires `external_id` to be consistent across events for it to function as a match key. Therefore `external_id` is `conka_uid` universally, with `em` still sent separately when we have it. Email loses nothing because it already matches on `em`.

**Why Phase 2 is not optional.**
A random UUID minted for an anonymous visitor resolves to nobody in Meta's graph. On its own it earns EMQ points for parameter presence and links a visitor's own events together, but it is close to cosmetic. It becomes a real match key only when the same id reaches the Purchase, letting Meta connect the anonymous AddToCart to the identified buyer. Phase 1 without Phase 2 is a scoreboard tweak.

**Reuse over invention.** Hashing follows `hashNormalized` in `app/lib/metaCapi.ts`. Cookie writing follows `captureFbcFromUrl()`. The order transport follows `buildMetaCartAttributes()`. No new patterns are introduced.

---

## Corrections to the source doc

Both were established by investigation on 2026-07-16 and should be treated as superseding `ATTRIBUTION_STATE_AND_PLAN.md`.

1. **A4 (relax the `www.conka.io` host gate) is dropped as moot.** The doc claims ad traffic landing on the apex "never captures `_fbc`". Tested: `https://conka.io/?fbclid=TESTCLICK123` returns a 307 to `https://www.conka.io/?fbclid=TESTCLICK123`, preserving the query string, so `_fbc` is captured and events fire. The doc's related claim about "in-app-browser hosts" is also mistaken: in-app browsers load `www.conka.io` like any other browser. No host is being dropped.

2. **Section 4's Test Events verification cannot work as written.** Meta routes a server event to the Test Events tab only when the payload carries `test_event_code`. `META_TEST_EVENT_CODE` exists in this repo but only in `app/lib/metaCapi.ts:126`, which serves the Purchase webhook. The client CAPI route (`app/api/meta/events/route.ts`) never sends one. Following section 4 today would show **only Purchase**, which the doc names as the signature of "Phase 1 is not deployed/working". That is a false negative: the upper-funnel events fire correctly, straight into the live dataset, invisible to the Test Events tab.

---

## Verification

Decision: no test scaffolding is being built. Verification uses real traffic.

In Events Manager, open **Add to cart, then View details, then the parameter / customer-information coverage panel**. Record the baseline before deploy (email coverage near 0%). Roughly 24 hours after deploy, the same panel should show `external_id` and `fbp` at or near 100% coverage, with EMQ climbing from 3.2 toward 4-5.

Note that the production-host gate means Vercel preview deploys fire no events, so there is no pre-deploy proof available. First real evidence arrives post-deploy.

---

## Rabbit holes

- **The webhook edit.** Phase 2 touches exactly one field (`externalId`) and reads one note attribute. It must not drift into rebill logic or `checkout_token`, which is Problem C.
- **Perfecting identity across login states.** Reconciling Shopify customer id, email, and anonymous visitor into one "correct" id is a swamp. The decision above closes it: `conka_uid` always.
- **Consent tooling.** No CMP exists in the codebase and `_fbc` is already written unconditionally. Not building one here.

## No-gos

- **A4 host gate.** Premise disproven. See corrections above.
- **test_event_code scaffolding.** Verifying via real Events Manager coverage instead.
- **Problem C (rebills)** and anything media-related, including ad-set structure and optimisation-event changes.
- **Cold-traffic email capture / re-enabling the Klaviyo popup.** A marketing decision, not code.
- **Pixel advanced matching** (`fbq('init', ..., { external_id })`). CAPI is where the measured gap is.

## Risks

- **Safari ITP caps JS-written cookies to 7 days.** This affects `conka_uid` and `_fbp`, and already silently affects the existing `_fbc`. A returning Safari visitor gets a fresh `conka_uid`, so the Phase 2 bridge holds within a session or week but not beyond. The proper fix is setting the cookie server-side, which is out of this phase but is a real limitation.
- **A malformed `_fbp` is ignored by Meta.** The format must be exactly `fb.1.<timestamp>.<10-digit random>`.
- **No pre-deploy proof**, per the verification note above.
- **Problem C caps the ceiling.** Meta reports around 110 Purchases per month where roughly 12 are real new customers, so most of the signal Meta optimises on is rebills. Purchase is the event the 29 ad sets optimise on. Problem A's benefit is genuinely limited while C is live. Flagged, deliberately deferred.

---

## References

| Reference | Relevance |
|-----------|-----------|
| `docs/analytics/ATTRIBUTION_STATE_AND_PLAN.md` | Diagnosis, evidence log, the A/B/C split |
| `docs/analytics/META_PIXEL_AND_CAPI.md` | Env vars including `META_TEST_EVENT_CODE` |
| `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` | Domain fix, server Purchase webhook, rebill exclusion |
| `docs/development/featurePlans/attribution-robustness.md` | Phase 1 shipped (SCRUM-1153), later phases |
| `app/lib/metaPixel.ts` | Primary file for Phase 1 |
| `app/lib/metaCapi.ts` | Hashing and array-form `external_id` pattern to reuse |
| `app/api/meta/events/route.ts` | Client CAPI relay, hashing, host gate |
| `app/api/webhooks/shopify/orders/route.ts` | Server Purchase, Phase 2 target |

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1158 | [Analytics & Data] Meta upper-funnel identity: external_id + _fbp on every event, bridged to Purchase | 1 and 2 | To Do |

Phases 1 and 2 share one ticket because they are a single unit of value: Phase 1 without Phase 2 raises the EMQ number without improving matching. Phases 3 (A2) and 4 (B2) get their own tickets when they become active.
