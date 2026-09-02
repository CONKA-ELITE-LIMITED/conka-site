# Customer Portal (Account)

The account area: authentication, profile, orders, and how customers reach their subscriptions.

**Subscriptions are not managed by this codebase.** Skio owns every subscription contract since the Loop migration completed on 2026-09-02, and its embedded portal at `/account/manage` is the whole subscription experience. The self-built Loop portal that used to live here is deleted. For anything subscription-related, the canonical reference is **`docs/development/featurePlans/skio-migration.md` section 8**, which covers the portal, its auth flow, the swap catalogue lockdown and the known gotchas.

---

## Routes

| Route | What it is |
|-------|------------|
| `/account` | Redirects to `/account/manage`. Nothing renders here. |
| `/account/manage` | Skio's Customer Portal v3, embedded in an iframe and auto-logged-in via a server-signed magic link. |
| `/account/login` | Shopify Customer Account API OAuth. |
| `/account/orders` | Order history, from the Customer Account API. |
| `/account/details` | Profile editing. |

Our own login cannot be removed: it is the SSO that powers the Skio portal's auto-login.

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

## Profile

The Edit Profile modal POSTs to `/api/auth/customer/update` with `firstName`, `lastName`, `phone` and `address`. The route reads the `customer_access_token` cookie and calls the Customer Account API.

- Email is read-only. Shopify manages it through its own account flow, not the `customerUpdate` mutation.
- `CustomerUpdateInput` supports only `firstName` and `lastName`. Phone is set via `CustomerAddressInput.phoneNumber` on the address mutation.
- If the customer already has a default address the route uses `customerAddressUpdate`, otherwise `customerAddressCreate`. Both take a `defaultAddress: Boolean`, so there is no separate default-address mutation in this API.
- `CustomerAddressInput` uses `territoryCode` (ISO country, e.g. `GB`) and `zoneCode`. Both are round-tripped from the session query, not derived from the display names the form also posts.

**The subscription address mirror is gone, and this is worth understanding before touching it.** Loop kept a shipping address per contract that never re-read Shopify, so this route used to push every successful write across to every active or paused Loop contract. Without it, a customer who changed their address kept receiving deliveries to the old one.

That mirror was deleted with the rest of the Loop integration, and the recorded justification (Noah at Skio, 2026-08-20) is that **Skio writes address and payment changes back to Shopify automatically**. Note the direction: that establishes Skio to Shopify, not Shopify to Skio. **It has not been confirmed that a Shopify-side address edit propagates to a Skio contract.** Until it is, treat the Skio portal as the authoritative place to change a delivery address. Tracked in `docs/TODO.md`.

## Orders

`GET /api/auth/orders` uses the Customer Account API with the session cookie to fetch the order list and count.

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
| Profile update | [`app/api/auth/customer/update/route.ts`](../../app/api/auth/customer/update/route.ts) |
| Orders | [`app/api/auth/orders/route.ts`](../../app/api/auth/orders/route.ts) |
| Order card | [`app/components/orders/OrderCard.tsx`](../../app/components/orders/OrderCard.tsx) |

## See also

- `docs/development/featurePlans/skio-migration.md` — the portal, its gotchas, the swap catalogue, and the whole migration
- `docs/development/featurePlans/loop-decommission.md` — what was removed and why
