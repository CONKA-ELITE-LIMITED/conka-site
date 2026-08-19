import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { env } from "@/app/lib/env";

// Node runtime for crypto.createHash (md5).
export const runtime = "nodejs";

/**
 * Skio customer-portal iframe src signer (Phase 3).
 *
 * Reads the authenticated Shopify customer, computes the Skio magic-link hash
 * server-side, and returns the auto-login iframe src as JSON. The client
 * (`/account/manage`) drops the returned `src` into an iframe.
 *
 * SKIO_STORE_ID_HASH signs `md5(numericCustomerId + STORE_ID_HASH)` and MUST stay
 * server-side. `totalSpent` is display-only in Skio's portal and NOT part of the
 * hash, so it cannot affect auto-login. Skio asked for the real value, but the
 * Customer Account API Customer type exposes no lifetime-spend field (`amountSpent`
 * is Admin-API-only), so we send `0`; a real value would need an orders-aggregate
 * or Admin lookup and isn't worth it for a display value (SCRUM-1227).
 *
 * Doc: help.skio.com iframe auto-login flow — endpoint /a/account/shopify-login
 */

// Auto-login endpoint. MUST be /a/account/shopify-login, NOT /a/account/login:
// the latter is Skio's standard passwordless email login, which renders the
// "email login / Email does not exist" screen instead of signing the customer
// in via our hash (SCRUM-1227). Host stays cpv3.skio.com (Customer Portal v3,
// the version our store is provisioned on; storefront-iframe.skio.com is v2).
const SKIO_PORTAL_BASE = "https://cpv3.skio.com/a/account/shopify-login";

interface CustomerResponse {
  data?: { customer?: { id: string; emailAddress?: { emailAddress: string } } };
}

export async function GET() {
  const storeIdHash = env.skioStoreIdHash;
  if (!storeIdHash) {
    console.error("skio-portal: SKIO_STORE_ID_HASH is not configured");
    return NextResponse.json({ error: "Portal not configured" }, { status: 500 });
  }

  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
  if (!shopId) {
    console.error("skio-portal: SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID is not configured");
    return NextResponse.json({ error: "Portal not configured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value;
  const expiresAt = cookieStore.get("customer_token_expires")?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return NextResponse.json({ authenticated: false, expired: true }, { status: 401 });
  }

  // Resolve the customer id (GID) + email from the Customer Account API. A
  // transient failure here is NOT "not logged in" (502, retryable); a valid
  // response with no customer is a dead/invalid session (401).
  let gid = "";
  let email = "";
  try {
    const res = await fetch(
      `https://shopify.com/${shopId}/account/customer/api/2024-10/graphql`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: accessToken },
        body: JSON.stringify({
          query: `query { customer { id emailAddress { emailAddress } } }`,
        }),
      },
    );
    if (!res.ok) {
      console.error("skio-portal: customer API returned", res.status);
      return NextResponse.json(
        { error: "Could not reach the subscription portal. Please try again." },
        { status: 502 },
      );
    }
    const data: CustomerResponse = await res.json();
    gid = data.data?.customer?.id ?? "";
    email = data.data?.customer?.emailAddress?.emailAddress ?? "";
  } catch (error) {
    console.error("skio-portal: failed to fetch customer profile", error);
    return NextResponse.json(
      { error: "Could not reach the subscription portal. Please try again." },
      { status: 502 },
    );
  }

  if (!gid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Skio needs the NUMERIC id, not the Shopify GID (gid://shopify/Customer/123).
  const numericId = gid.split("/").pop() ?? "";
  if (!/^\d+$/.test(numericId)) {
    // Defensive: a real Shopify customer id is always numeric. DEV_MOCK_AUTH has
    // no customer_access_token, so it 401s above rather than reaching here.
    return NextResponse.json(
      { error: "A real Shopify login is required to open the subscription portal." },
      { status: 400 },
    );
  }

  const hash = createHash("md5").update(numericId + storeIdHash).digest("hex");

  // `hostname` must be the domain Skio registered for the site: its portal calls
  // get-site-by-domain-or-hostname and 400s on an unknown host (a Vercel preview
  // URL AND the myshopify domain both 400 - verified 2026-08-18), which stalls the
  // whole portal. Skio keys the site on the Shopify PRIMARY domain, `shop.conka.io`,
  // so default to that (single, non-secret store value); override via SKIO_PORTAL_HOSTNAME.
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
  const hostname = process.env.SKIO_PORTAL_HOSTNAME || "shop.conka.io";

  const params = new URLSearchParams({
    hostname,
    shop,
    email,
    id: numericId,
    totalSpent: "0",
    hash,
  });

  // no-store: the src carries a per-customer Skio login hash, so it must never be
  // cached by an intermediary/CDN and handed to another customer.
  return NextResponse.json(
    { src: `${SKIO_PORTAL_BASE}?${params.toString()}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}
