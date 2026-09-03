# Loop decommission

**Owner:** Rudh
**Branch:** `feature/loop-decommission`
**Scoped:** 2026-09-02, the day the Skio migration completed
**Parent:** [`skio-migration.md`](skio-migration.md) section 12, which lists the decommission set. This doc is the execution plan for the conkaWebsite half of it.

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Close the broken customer paths | Complete (2026-09-02) |
| 2 | Delete the Loop integration | Complete (2026-09-02) |
| 3 | Correct the docs | Complete (2026-09-02) |
| 4 | Delete the duplicate account pages | Complete (2026-09-03) |

Jira: not ticketed. The Atlassian token expired during scoping and the work was tracked here instead.

---

## Problem

Skio owns every subscription contract and **Skio uninstalled Loop on 2 September 2026** as part of their final migration steps. The site still carries the whole Loop integration: a 359-line API client, 16 API routes, 23 components, two hooks and roughly 770 lines of consumer code, all of it now calling an app that no longer exists.

The part that matters is customer-facing. **`/account/subscriptions` is still linked from the site footer on every page**, from both lander footers, and from `/shipping`. Klaviyo templates and historic order emails almost certainly point there too. A subscriber clicking "Manage subscription" today lands on a page backed by routes that call a dead app, instead of their Skio portal at `/account/manage`.

So this is a retention fix first and a cleanup second.

## Approach

Three phases, shipped together. Phase 1 closes the customer-facing paths, Phase 2 deletes the integration behind them, Phase 3 corrects the documentation that describes it.

No new UI. Skio's embedded portal at `/account/manage` already owns the surface, and `/account` already redirects there.

**Design language:** n/a, no new UI.
**Mobile:** no impact. The deleted surface is replaced by an iframe portal that is already live on mobile.
**Analytics:** none. No events fire from the deleted routes or components.

---

## Phase 1: Close the broken customer paths

1. **Re-point the four `/account/subscriptions` links to `/account/manage`.**
   `app/components/footer/Footer.tsx:35`, `app/lander/sections/Footer/Footer.tsx:37`, `app/(trial-b)/lander-b/sections/Footer/Footer.tsx:37`, `app/shipping/page.tsx:63`.

2. **Add a permanent redirect `/account/subscriptions/:path*` to `/account/manage`** in `next.config.ts`.
   Catches bookmarks, Klaviyo templates and old order emails that we do not control from this repo.

## Phase 2: Delete the Loop integration

3. **Delete the Loop route trees.**
   `app/api/auth/subscriptions/**` (12 routes: `route.ts`, `debug/`, `debug-loop/`, `debug-operations/`, `introspect/`, `payment-methods/{route,[id]}`, `[id]/{pause,cancel,resume,reschedule,payment-method}`) and `app/api/subscriptions/**` (4 routes, the only direct importers of `app/lib/loop.ts`).

   `app/api/subscriptions/*` is absent from the parent doc's decommission list and has zero callers in this repo. Decision (Rudh, 2 Sept): **delete it**. Loop is uninstalled, so those routes cannot function regardless of who calls them. If the mobile app hits them it is already broken and needs its own fix.

4. **Delete `app/lib/loop.ts`, the two hooks, and the env var.**
   `app/lib/loop.ts` (359 lines), `app/hooks/useSubscriptions.ts` (658 lines), `app/hooks/usePaymentMethods.ts`, and `LOOP_API_KEY` from `app/lib/env.ts`.

5. **Delete the self-built portal UI.**
   `app/account/subscriptions/**` and all of `app/components/subscriptions/` (23 files, including `CancellationModal.tsx` and its RETENTION15 flow), plus `app/components/account/NextDeliveryHero.tsx`, which imports the deleted utils.

6. **Remove the Loop address-mirror** from `app/api/auth/customer/update/route.ts`: `LOOP_ADMIN_BASE`, `pushAddressToLoopSubscription`, `syncLoopSubscriptionAddresses` and the call site.

   The recorded justification is that Skio writes address and payment changes back to Shopify itself. **That is the Skio to Shopify direction, and it does not establish the reverse**, so whether a Shopify-side edit reaches a Skio contract is unconfirmed. Raised in review, tracked in `docs/TODO.md`, and flagged in `CUSTOMER_PORTAL.md` so nobody assumes it is settled.

7. **Collapse the flags.**
   Delete `subscriptionsInTransition` and `subscriptionsSkioOnly` from `app/lib/subscriptionsFlag.ts` and resolve `subscriptionsUseSkio` to always-Skio at its call sites: `NavigationDesktop.tsx`, `NavigationMobile.tsx`, `offerData.ts`, `app/account/page.tsx`. Rename `OFFER_VARIANTS` to `LEGACY_OFFER_VARIANTS` so its surviving role is explicit.

## Phase 3: Correct the docs

8. **Rewrite `docs/features/CUSTOMER_PORTAL.md`.** 448 lines, entirely Loop-era, including a Key File Reference pointing at files this work deletes.

9. **Fix stale references** in `docs/features/MOBILE_SUBSCRIPTION_INTEGRATION.md`, `docs/workflows/04-shopify-commerce.md`, `docs/workflows/02-implementation-workflow.md`, `docs/development/featurePlans/account-portal-funnel-simplification.md`, `docs/TODO.md` and `CLAUDE.md`. Also `skio-migration.md` sections 1, 7 and 8, which the parent doc's own readers are pointed at.

---

## Technical decisions

**Rolling back to Loop is already impossible**, because the app is uninstalled. `NEXT_PUBLIC_SKIO_ENABLED` is therefore a dead lever and collapsing it costs nothing. Vercel Instant Rollback remains the real rollback path.

**`OFFER_VARIANTS` survives the deletion.** It feeds the both-table reverse maps in `offerData.ts`, which is how migrated Loop-era subscription lines still resolve to a product on orders and in the portal. The whole SUBSCRIPTION SWAP section died with the routes it fed: `getOfferSwapSellingPlanId`, `getOfferVariantNumericId` and `getSwapTargets`. The first two were Loop-mutation-only; `getSwapTargets` is platform-neutral but had zero remaining callers once the portal UI went, so it went too. Renaming the table to `LEGACY_OFFER_VARIANTS` prevents the next reader assuming it is a live sales table.

## Rabbit holes

- **`app/account/subscriptions/utils.ts` and `viewModel.ts` are imported from outside their own directory**, by `PastSubscriptionCard`, `SubscriptionListCard` and `NextDeliveryHero`. Deleting the directory before its consumers breaks the build in three places. Delete consumers first.
- **`app/account/page.tsx` carries seven flag references.** Find-and-replace leaves dead branches behind. Rewrite the file rather than patching it.

## No-gos

- **conka-lab teardown** (`loop.py`, the `raw_loop_*` tables and routes, `LOOP_*` env vars). Separate repo, and it waits for a retention window to pass.
- **The legacy protocol commerce layer.** `app/lib/legacy/protocolSubscriptions.ts`, `ProtocolId` and `PROTOCOL_VARIANTS` stay: 12 customers still hold protocol contracts (4 active, 8 paused). Confirmed it does not import `app/lib/loop.ts`, so it is not a blocker.
- **`LOOP_TO_SKIO_SELLING_PLAN` in `app/lib/skio.ts`.** Loop-named, but it maps migrated contracts. Stays.
- **`FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`.** Every Skio bundle composition points at them.
- **Re-pointing Klaviyo email templates.** Decision (Rudh): rely on the Phase 1 redirect for now. Tracked in `docs/TODO.md`.

## Risks

- Deleting 16 API routes at once means any external consumer we do not know about fails. Mitigated by the fact that they already fail: Loop is gone.
- The flag collapse touches the account entry point, which every logged-in customer hits. Worth eyeballing `/account` and `/account/manage` on the Vercel preview before merging.

## Corrections from review

An independent review after the first two commits found three things the plan missed. All fixed in the same PR.

- **`/account/orders` and `/account/details` were left unreachable.** The old `/account` rendered `AccountSubNav`, which carried the only links to them. Redirecting `/account` to the portal removed the only route in. Fixed at the time by rendering `AccountSubNav` on `/account/manage`. **Superseded by Phase 4**, which deleted both pages instead: the review and I both assumed the Skio iframe covered subscriptions only, and it does not. The plan's original claim that "Skio's portal already owns the surface" was right after all.
- **Three more orphans.** `app/hooks/useSubscriptionEditor.ts`, `app/lib/subscriptionProduct.ts` and `app/lib/productSizeUtils.ts`, 358 lines, were reachable only from deleted components. Step 4 said "the two hooks"; there was a third.
- **`skio-migration.md` sections 1, 7 and 8 described deleted code as live**, and it is the doc `CLAUDE.md` and `CUSTOMER_PORTAL.md` both point readers at. Phase 3 listed four docs to correct and omitted the parent.

## Phase 4: Delete the duplicate account pages

Added 2026-09-03, after Rudh checked Skio's portal against a live merchant (Magic Mind) and
found the premise of Phases 1 to 3 was too cautious.

**Skio Customer Portal v3 is the account, not a subscription widget.** It renders its own
Orders / Account / Logout navigation inside the frame, and its Orders view carries full order
detail: line items, shipping, summary and reorder. Phases 1 to 3 assumed it covered
subscriptions only and kept our Customer Account API pages beside it. That was wrong, and the
post-ship review reinforced the error rather than catching it.

Deleted, 1,538 lines:

- `app/account/orders/` (page + utils) and `app/components/orders/` (5 components)
- `app/account/details/` and `app/components/account/` (`AccountSubNav`, `EditProfileModal`,
  and `ActiveOrderCard` / `HairlineSpecStrip`, which were already orphaned)
- `app/api/auth/orders/route.ts` and `app/api/auth/customer/update/route.ts`
- The `AccountSubNav` render added to `SkioPortalFrame` earlier the same day

`/account/orders` and `/account/details` redirect to `/account/manage`. Skio's own equivalents
live under its routing inside the frame and are untouched by those rules.

**This also closes the open address question.** `/account/details` wrote to the Shopify
customer record while deliveries are governed by the Skio contract, so it presented a form
that looked like it changed a delivery address and may not have. Whether Skio re-reads Shopify
at billing stopped mattering once the only surface that could disagree was gone. The
`docs/TODO.md` item is marked closed by deletion rather than by a vendor answer.

**Remaining account surface:** `/account` (redirect), `/account/manage` (the portal),
`/account/login`, `/account/register`, and the auth routes that serve them.

### Phase 4 review

**Deleting `AccountSubNav` removed the only way to sign out of conka.io.** Its Logout button
was the sole caller of `AuthContext.logout`. Skio's in-frame Logout cannot substitute: it runs
on `cpv3.skio.com` while our session cookies are first-party and `httpOnly`, so it ends the
Skio session only, and because `/account/manage` mints a fresh magic link on every load the
customer is signed back in on refresh. On a shared device the next visitor would land inside
the previous customer's portal. `SkioPortalFrame` now renders a single "Log out of CONKA" link
to `/api/auth/logout`. That is the one piece of chrome the portal justifies, and it can be
deleted if Skio's own Logout is ever configured to redirect to our logout endpoint.

**URL hygiene.** Internal links pointed at `/account`, which only exists to redirect, so every
sign-in paid an extra round trip. The post-login redirect, the login and register pages now
target `/account/manage` directly, and the footer's "Your account" and "Manage subscription"
entries, which had become two labels for one page, collapsed into one. `/account` and the four
redirect rules remain for bookmarks, Klaviyo templates and historic order emails. The rule is:
**`/account/manage` is canonical, every internal link points at a terminal URL, and no internal
link targets a redirect source.**

## References

- [`skio-migration.md`](skio-migration.md) section 12, the decommission list
- `docs/features/CUSTOMER_PORTAL.md`, rewritten in Phase 3
