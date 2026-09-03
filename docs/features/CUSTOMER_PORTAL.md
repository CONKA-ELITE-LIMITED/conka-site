# Customer Portal (Account)

The account area: authentication, profile, orders, and how customers reach their subscriptions.

**Subscriptions are not managed by this codebase.** Skio owns every subscription contract since the Loop migration completed on 2026-09-02, and its embedded portal at `/account/manage` is the whole subscription experience. The self-built Loop portal that used to live here is deleted. For anything subscription-related, the canonical reference is **`docs/development/featurePlans/skio-migration.md` section 8**, which covers the portal, its auth flow, the swap catalogue lockdown and the known gotchas.

---

## Routes

| Route | What it is |
|-------|------------|
| `/account` | Redirects to `/account/manage`. Nothing renders here. |
| `/account/manage` | Skio's Customer Portal v3, embedded in an iframe and auto-logged-in via a server-signed magic link. **This is the account.** |
| `/account/login` | Shopify Customer Account API OAuth. |
| `/account/register` | Shopify account creation. |

Our own login cannot be removed: it is the SSO that powers the Skio portal's auto-login.

**There are no other account pages, and that is deliberate.** Skio's portal renders its own
Orders, Account and Logout navigation inside the iframe, and its Orders view shows full order
detail: line items, shipping, summary and a reorder action. We used to run `/account/orders`
and `/account/details` alongside it against the Customer Account API. They duplicated Skio's
own views, and the details page was worse than redundant: its address form wrote to the
Shopify *customer record* while deliveries are governed by the Skio *contract*, so it looked
like it changed where a box shipped and did not. Both were deleted on 2026-09-03 and now
redirect to `/account/manage`.

Do not add account chrome back on top of the iframe. If something is missing from the portal,
it is a Skio portal setting in their dashboard, not a page for us to build.

---

## Authentication

Shopify's **Customer Account API** (OAuth) is the identity layer. The session lives in a `customer_access_token` cookie.

`/account/manage` calls `GET /api/auth/skio-portal`, which reads the authenticated customer server-side, parses the numeric id out of the Shopify GID, computes `md5(numericId + SKIO_STORE_ID_HASH)` and returns the iframe src. `SKIO_STORE_ID_HASH` is server-only and must never be exposed as `NEXT_PUBLIC_`, since it would let anyone forge a login for any customer.

Signed-out visitors hitting `/account/manage` are redirected to `/account/login` by `SkioPortalFrame`.

### Testing Shopify auth on a preview branch

Shopify's Customer Account API rejects `localhost` and `http` callback URIs, so the OAuth flow cannot be tested on a local dev server.

Use the **branch preview URL**, which stays stable for the life of the branch (not the per-deployment URL, which changes on every push):

```
https://{project}-git-{branch-name}-{team}.vercel.app
```

1. Find it in Vercel → Deployments → your branch → Domains.
2. In Shopify → Headless → Customer Account API → Application setup, add `https://{branch-url}/api/auth/callback` as a Callback URI and `https://{branch-url}` as a Javascript origin.
3. In Vercel → Settings → Environment Variables, set `NEXT_PUBLIC_APP_URL` to the branch URL, scoped to Preview, then redeploy.
4. Open `https://{branch-url}/account` and sign in.
5. Remove the callback URI from Shopify when the branch merges.

To exercise the Skio portal specifically, also pin `SHOPIFY_REDIRECT_URI` (Preview scope) to the branch-alias callback so it survives Vercel's per-deploy hosts.

### Dev mock sign-in (UI only)

For account UI work without OAuth: set `DEV_MOCK_AUTH=true` and `NEXT_PUBLIC_DEV_MOCK_AUTH=true` in `.env.local`, restart, then use **Use mock account (dev)** on `/account/login`. Protected routes return mock or empty data.

Only active when `NODE_ENV === 'development'`. **It cannot drive the Skio portal**, which needs a numeric customer id and a real `customer_access_token`, so portal work has to happen on a preview or production login.

---

## Profile, addresses, payment and orders

All four live in the Skio portal. We hold no code for any of them.

This is the part most likely to be re-broken by someone acting on good intentions, so the
history is worth keeping. Loop stored a shipping address per contract and never re-read
Shopify, so we ran a mirror: every profile write was pushed across to each active or paused
Loop contract, because without it a customer who changed their address kept receiving
deliveries to the old one. Skio removes the need for the mirror, but it does **not** make a
Shopify-side edit safe: the recorded vendor statement (Noah at Skio, 2026-08-20) is that Skio
writes changes back *to* Shopify, which is the opposite direction.

Rather than leave that ambiguity sitting behind a form, the form was deleted. The Skio portal
is the single place a customer changes an address, a card or a profile, so there is no second
surface that can disagree with the contract.

---

## Key file reference

| Area | File |
|------|------|
| Auth context | [`app/context/AuthContext.tsx`](../../app/context/AuthContext.tsx) |
| Account entry (redirect) | [`app/account/page.tsx`](../../app/account/page.tsx) |
| Skio portal page | [`app/account/manage/page.tsx`](../../app/account/manage/page.tsx) |
| Skio portal iframe + auth guard | [`app/account/manage/SkioPortalFrame.tsx`](../../app/account/manage/SkioPortalFrame.tsx) |
| Portal magic-link signer | [`app/api/auth/skio-portal/route.ts`](../../app/api/auth/skio-portal/route.ts) |
| Skio API config | [`app/lib/skio.ts`](../../app/lib/skio.ts) |
| Session / customer read | [`app/api/auth/customer/route.ts`](../../app/api/auth/customer/route.ts) |

That is the whole account surface. There is no orders route, no profile route and no account
components directory.

## See also

- `docs/development/featurePlans/skio-migration.md` — the portal, its gotchas, the swap catalogue, and the whole migration
- `docs/development/featurePlans/loop-decommission.md` — what was removed and why
