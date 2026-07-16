# Meta Attribution — Full State, Issues, and Plan (2026-07-16)

**Purpose:** one self-contained document. What is wired, what is broken (with evidence), what to do, which files, and how to verify. A new chat should be able to execute from this without re-deriving anything.

**Scope of this doc:** the tracking/signal we send to Meta. It does NOT prescribe media-buying (ad-set structure, budgets) — that is the marketing team's domain and explicitly out of scope.

---

## 0. TL;DR (read this first)

Three separate problems. They are often confused for each other. Keep them separate.

| # | Problem | One-line cause | Status |
|---|---------|----------------|--------|
| **A. Upper-funnel QUALITY** | AddToCart 3.2/10, InitiateCheckout 3.0/10, ViewContent 4.5/10 in Meta ("update recommended") | Events arrive but carry almost no identity for logged-out visitors (no email, no external_id, patchy fbp/fbc) | **Not started — this is the priority** |
| **B. Upper-funnel COVERAGE** | Blocked-pixel sessions used to send nothing above Purchase ("purchase with no add-to-cart") | Shared helper suppressed browser AND server event when the pixel was blocked | **Phase 1 fix MERGED. Deployed. Needs verification.** |
| **C. Purchase SIGNAL contamination** | Meta sees ~110 Purchases/month but only ~12 are real new customers | Loop rebills are reported to Meta as Purchases (server-side, likely the Shopify Facebook channel) | Deferred — do after A + B |

**The decision made 2026-07-16:** fix the upper funnel (A + B) robustly first, then C.

**What A actually is:** Purchase scores 6.6/10 because the Shopify order hands us email + name + address. AddToCart scores 3.2 because a logged-out ad visitor's AddToCart goes to Meta with only IP + user-agent + maybe a cookie. The gap is identity.

**Honest constraint (important):** we CANNOT send email for cold ad traffic. The Klaviyo popup is currently OFF, so a logged-out ad visitor never gives us an email before checkout. Email (`em`) therefore only applies to logged-in users (already handled in Phase 1) and possibly the quiz. So the realistic upper-funnel levers for cold ad traffic are, in order: **`_fbc` (the ad-click id), `_fbp`, and `external_id`** — NOT email. This caps the achievable EMQ: expect ~3 to rise to roughly **4-5**, not 6+. The more important gain is not the score but that reliably capturing `_fbc` makes the events **attributable to the ad**, which is what feeds Meta's learning. Unlocking email for cold traffic requires re-enabling the Klaviyo popup or collecting email earlier in the funnel — a marketing/CRO decision, not a code change.

---

## 1. Current analytics state (as-built, verified against code + Meta 2026-07-16)

### 1.1 How each Meta event is sent, and the identity it carries

| Event | Fired from (file) | Transport | Identity carried today | Meta EMQ | Volume (28d) |
|-------|-------------------|-----------|------------------------|----------|--------------|
| PageView | `MetaPageViewTracker.tsx` | pixel + client CAPI | fbp (often missing at fire time), fbc (only if ad-click captured), email (only if logged in), + server-added IP/UA | 6.1 | 26.4K |
| ViewContent | `conka-flow/page.tsx:57`, clarity, both, `QuizEngine.tsx:141`. **NOT fired on /go listicle** | pixel + client CAPI | same as above | 4.5 ⚠️ | 12.7K |
| AddToCart | `CartContext.tsx:248` (+ landers) | pixel + client CAPI | same as above | 3.2 ⚠️ | 419 |
| InitiateCheckout | `CartDrawer.tsx:423`, `funnelCheckout.ts:132` (+ landers) | pixel + client CAPI | same as above | 3.0 ⚠️ | 275 |
| Purchase | `app/api/webhooks/shopify/orders/route.ts` | **server webhook -> CAPI** (browser <25%) | em, fn, ln, ct, st, zp, country (from order), + fbp/fbc from order note_attributes | 6.6 | 110 |

Meta confirms Purchase is 96% covered on email+name+address; the browser pixel sends <25% of Purchase events (it is a server event). Purchase is used by 29 ad sets.

### 1.2 The client CAPI payload (the thing to change for problem A)

`sendToCAPI()` in `app/lib/metaPixel.ts` sends, per event:
```
user_data: { fbp, fbc, email }   // email only when a customer is logged in (AuthContext -> setMetaUserData)
```
`app/api/meta/events/route.ts` then adds `client_ip_address`, `client_user_agent`, and SHA-256-hashes email into `em` + `external_id`.

So for a **logged-out ad visitor** (the majority of paid traffic), an AddToCart reaches Meta with only: `client_ip_address`, `client_user_agent`, and — if present — `fbp` and `fbc`. No email, no name, no address, no external_id. **That is why EMQ is 3.2.**

### 1.3 Identity capture, and where it leaks (from the code audit)

- `_fbc` (ad-click id): written by `captureFbcFromUrl()` in `metaPixel.ts` from `?fbclid=` on landing. Runs only inside `MetaPageViewTracker` and only when `isProductionHost()` is true, which is a **strict exact match on `www.conka.io`**. Ad traffic that lands on the apex `conka.io` or an in-app-browser host never captures `_fbc`.
- `_fbp` (browser id): written by Meta's `fbevents.js`, which loads async. Our client CAPI events frequently fire **before** the cookie exists, so they ship with no `_fbp`.
- `_fbc`/`_fbp` reach the Purchase via cart `note_attributes` (`buildMetaCartAttributes()` -> `CartContext` -> `api/cart/route.ts` -> order). Confirmed working: of new-customer web checkouts since 2026-06-02, 100% carry `_fbp`, 53% carry `_fbc` (the 53% is the organic/ad mix, not a leak).
- The host gate (`isProductionHost`, exact `www.conka.io`) is enforced in three places: `metaPixel.ts:128`, the CAPI route host check `api/meta/events/route.ts:61`, and the pixel-init guard in `app/layout.tsx`. Its purpose is to keep Vercel preview deploys (`*.vercel.app`) out of the dataset. It is currently too strict (kills the apex too).

### 1.4 What Phase 1 (merged) already changed

Commit `c1b9ca6b` (SCRUM-1153, merged via PR #361):
- `trackWithDedup` now fires the CAPI relay whenever on the production host with a pixel id, **independent of whether the pixel loaded** (previously it suppressed both). Fixes problem B (coverage on blocked traffic).
- Browser pixel split into `firePixelOnly`, fired under the same `event_id` for dedup.
- `MetaPageViewTracker` fires the CAPI PageView immediately, browser twin once `fbq` loads.
- Added hashed email (`em` + `external_id`) on client CAPI events **for logged-in customers only** (via `setMetaUserData` in `AuthContext`).

Phase 1 does NOT touch problem A's core (identity for logged-out visitors) or problem C (rebills).

---

## 2. The issues, enumerated

### Problem A — Upper-funnel match quality (PRIORITY)

**A1. No `external_id` on anonymous events.** We only set `external_id` when the visitor is logged in (it is the hashed email). A logged-out AddToCart has no stable identifier at all. `external_id` can be any stable unique ID; sending one on every event is an always-available match key we are simply not using.
- Impact: every anonymous event is missing a match key it could always have. Lifts 100% of events.
- Fix effort: low.

**A2. No email (`em`) on anonymous events — but we CANNOT fix this for cold traffic.** Email is the strongest match key (it is why Purchase 6.6 beats AddToCart 3.2), but the Klaviyo popup is OFF, so cold ad visitors give us no email pre-checkout. Email only applies to logged-in users (done in Phase 1) and possibly the quiz.
- Impact: real but LIMITED — only the subset who have already given an email. Not a cold-traffic lever.
- Fix effort: low for the existing sources; the true unlock (popup) is a marketing decision, not code.
- **Priority order for cold ad traffic is therefore A4 (`_fbc`) > A3 (`_fbp`) > A1 (`external_id`) > A2 (email).**

**A3. `_fbp` often missing at fire time.** `fbevents.js` loads async; early client CAPI events ship without `_fbp`.
- Impact: medium; a match key absent on a chunk of events.
- Fix effort: low (generate `_fbp` ourselves on landing).

**A4. `_fbc` dropped on non-`www` hosts.** The exact `www.conka.io` gate throws away the ad-click id (and suppresses events entirely) for apex/in-app-browser traffic.
- Impact: medium; loses the click id on exactly the traffic we care about, and drops whole events.
- Fix effort: low (relax the gate to any CONKA production host).

### Problem B — Upper-funnel coverage

**B1. Blocked-pixel suppression.** FIXED by Phase 1 (merged). **Action: verify in production** (section 4). Not confirmed working yet.

**B2. ViewContent not fired on the `/go` listicle.** The listicle ad landing never calls `trackMetaViewContent`, so listicle-driven journeys miss ViewContent entirely.
- Impact: a coverage hole on a live ad surface.
- Fix effort: low.

### Problem C — Purchase signal contamination (DEFERRED)

**C1. Rebills reported to Meta as Purchases.** Meta shows 110 Purchases/month; real new customers are ~12/month (293 Loop rebills vs 84 web checkouts in the last ~3 months, from Shopify). Purchase is >75% server-side. Our webhook excludes rebills (via `checkout_token`), so the rebills are almost certainly entering through the **Shopify Facebook & Instagram channel's own CAPI**, which fires for every order.
- Impact: Meta optimises toward existing subscribers, not new customers.
- Action needed: one confirmation — open the Purchase event -> "Manage integrations" in Events Manager and see whether the Shopify/Facebook channel is listed as a source. Then disable or filter its rebill Purchases, or move acquisition campaigns onto a new-customer custom conversion.
- Out of scope of A/B; do after.

**C2. Volume + media structure.** ~1-4 new subscriptions/week is below Meta's learning threshold, and Purchase is used by 29 ad sets. This is a media-strategy matter, NOT website code. Flagged for the marketing team; not addressed here.

---

## 3. The plan (what to build, which files, expected effect)

Ordered. Each item says the file(s), the concrete change, and the metric it moves.

### Phase A1 — external_id on every event (do first; highest ratio of impact to effort)
- **File `app/lib/metaPixel.ts`:** add `getOrCreateExternalId()` — read a first-party id from a `conka_uid` cookie/localStorage; if absent, generate a UUID and persist it (scoped `.conka.io`, long-lived). Include it in the `sendToCAPI` `user_data` on every event.
- **File `app/api/meta/events/route.ts`:** accept `user_data.external_id`; if a hashed email already sets `external_id`, keep email's; otherwise hash and send the visitor id as `external_id`.
- **Expected effect:** every event (incl. anonymous) gains a stable match key -> EMQ floor rises across PageView/ViewContent/AddToCart/InitiateCheckout.

### Phase A3 — generate `_fbp` on landing (do with A1)
- **File `app/lib/metaPixel.ts`:** add `ensureFbp()` — if the `_fbp` cookie is absent, write one in Meta's format `fb.1.<ts>.<rand>` scoped `.conka.io`. The pixel adopts an existing `_fbp`, so no split identity (same pattern already used for `_fbc`).
- **File `app/components/MetaPageViewTracker.tsx`:** call `ensureFbp()` alongside `captureFbcFromUrl()` on mount.
- **Expected effect:** `_fbp` present on ~100% of events instead of "often missing."

### Phase A4 — relax the production-host gate (do with A1)
- **Files `app/lib/metaPixel.ts` (`isProductionHost`), `app/api/meta/events/route.ts` (host check), `app/layout.tsx` (pixel-init guard).** Replace exact `=== "www.conka.io"` with: allow any host ending in `conka.io` (apex + subdomains); explicitly exclude `*.vercel.app` and localhost.
- **Expected effect:** ad traffic on the apex / in-app hosts stops being dropped; `_fbc` capture runs there too.
- **Verify first:** check whether Vercel already 308-redirects `conka.io` -> `www.conka.io` preserving the query string. If it does, this is belt-and-suspenders; if not, it is a real coverage fix.

### Phase A2 — attach email ONLY where it already exists (limited; do last)
**Reality check:** the Klaviyo popup is OFF, so cold ad traffic gives us no email before checkout. Email is NOT a lever for the bulk of upper-funnel ad traffic. Do not build cold-traffic email capture in this phase. Only wire the sources that already have an email:
- The `/go` quiz (`QuizEngine`) IF it collects an email — call `setMetaUserData(email)` there.
- A returning visitor whose email was stored on a prior session — persist the email set via `setMetaUserData` to a cookie and read it back on load.
- **File `app/lib/metaPixel.ts`:** persist/rehydrate the email so it survives navigation.
- **Expected effect:** lifts EMQ only for the subset who have given an email. Cold ad traffic is unaffected.
- **Marketing dependency (not code):** the real unlock for cold-traffic email is re-enabling the Klaviyo popup or collecting email earlier in the funnel. Flag to marketing; out of scope here.

### Phase B2 — fire ViewContent on the listicle
- **File `app/components/go/listicle/ListicleRenderer.tsx` (or the `/go/[slug]` page):** call `trackMetaViewContent` on mount with the product content id, matching the PDP pattern.
- **Expected effect:** closes the ViewContent hole on the listicle ad surface.

### Deferred — Problem C (after A + B verified)
Confirm the rebill source (Manage integrations), then stop rebills reaching Meta as Purchase and/or move acquisition optimisation to a new-customer signal. Cross-ref `docs/development/featurePlans/attribution-robustness.md` (Phase 3) and the subscription-tag approach in `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md`.

---

## 4. How to verify (do not trust code review alone)

**Verify Phase 1 (B1) is live and working:**
1. Meta Events Manager -> Test Events. On `www.conka.io`, open DevTools and block `connect.facebook.net` (Network request-blocking) to simulate a blocked pixel.
2. Add to cart. Confirm AddToCart + ViewContent + PageView still appear in Test Events, tagged **Server**. If they do, Phase 1 works. If only Purchase ever appears, Phase 1 is not deployed/working.

**Verify Problem A (identity) before and after:**
1. In Events Manager, open **Add to cart -> View details -> parameter/customer-information coverage**. Today it should show email coverage near 0% and low overall. Record it as the baseline.
2. After shipping A1/A3/A4/A2, the same view should show `external_id` and `fbp` near 100%, and `em` rising in line with how many visitors give an email. EMQ should climb from 3.2 toward 5-7.

**Realistic ceiling:** a truly cold visitor who never gives an email cannot be matched on email. Expect upper-funnel EMQ to land in the ~5-7 range, not 10. `external_id` + `fbp` lift everyone; `em` lifts the (large) subset who give an email.

---

## 5. Files index (everything attribution touches)

| File | Role |
|------|------|
| `app/lib/metaPixel.ts` | Client pixel + CAPI helpers: `trackWithDedup`, `sendToCAPI`, `captureFbcFromUrl`, `getFbp`/`getFbc`, `isProductionHost`, `setMetaUserData`, `firePixelOnly`. **Primary file for Problem A.** |
| `app/api/meta/events/route.ts` | Server CAPI relay for client events. Hashing (`em`/`external_id`), host gate, IP/UA. |
| `app/components/MetaPageViewTracker.tsx` | Fires PageView; runs `captureFbcFromUrl`; host gate. |
| `app/context/CartContext.tsx` | `addToCart` fires AddToCart + attaches `_fbp`/`_fbc` cart attributes. |
| `app/context/AuthContext.tsx` | Calls `setMetaUserData(email)` on login/logout. |
| `app/components/CartDrawer.tsx`, `app/lib/funnelCheckout.ts` | Fire InitiateCheckout at checkout click. |
| `app/api/cart/route.ts` | Applies cart attributes (identity transport to the order). |
| `app/api/webhooks/shopify/orders/route.ts` | Server-side Purchase -> CAPI; excludes rebills via `checkout_token`. |
| `app/lib/metaCapi.ts` | Server-side hashing used by the Purchase webhook. |
| `app/components/DelayedAnalytics.tsx` | Deferred GA + Triple Whale (not Meta). |
| `app/layout.tsx` | Meta pixel init (host-gated), mounts tracker/provider/analytics. |

## 6. Evidence log (2026-07-16)

- **Meta Events Manager (Jun 18 - Jul 15):** PageView 26.4K (EMQ 6.1), ViewContent 12.7K (4.5, update recommended), AddToCart 419 (3.2, update recommended), InitiateCheckout 275 (3.0, update recommended), Purchase 110 (6.6, 29 ad sets), AddPaymentInfo 17, Lead 4. Purchase is >75% server (browser <25%); Purchase 96% covered on email+name+address.
- **Shopify Admin API (attribution-audit app, read-only):** last ~400 orders = 293 Loop rebills, 84 web checkouts, 23 manual/draft. Web checkouts since 2026-06-02: 29 total; new customers (nth=1) 15, of which `_fbp` 15/15, `_fbc` 8/15. Rebills carry `_fbp`/`_fbc` ~0% (expected — no browser checkout).
- **User-confirmed:** ~12 new subscriptions/month (1-4/week).
- **Prior work:** `docs/analytics/HEADLESS_ATTRIBUTION_FIX.md` (domain fix, server Purchase webhook, rebill exclusion), `docs/development/featurePlans/attribution-robustness.md` (Phase 1 shipped; Phases 2-4).

## 7. What NOT to do
- Do not build a custom Shopify checkout pixel that duplicates the Facebook channel (triple-count risk). See attribution-robustness.md Phase 2.
- Do not prescribe ad-set structure, budgets, or optimisation-event changes — that is marketing's call.
- Do not touch the Purchase webhook or rebill logic while doing A/B.
