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
 * server-side. `totalSpent` is not in our session and is not part of the hash, so
 * we send `0` (verify in the Phase 3 preview spike).
 *
 * Doc: help.skio.com/docs/how-do-i-render-the-skio-logincustomer-portal-in-an-iframe
 */

const SKIO_PORTAL_BASE = "https://cpv3.skio.com/a/account/login";

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

  // `hostname` must be a domain Skio has registered for the site: its portal calls
  // get-site-by-domain-or-hostname and 400s on an unknown host (e.g. a Vercel
  // preview URL), which stalls the whole portal. Default to the myshopify identity
  // (always registered); override with SKIO_PORTAL_HOSTNAME (e.g. shop.conka.io).
  const shop = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
  const hostname = process.env.SKIO_PORTAL_HOSTNAME || shop;

  const params = new URLSearchParams({
    hostname,
    shop,
    email,
    id: numericId,
    totalSpent: "0",
    hash,
  });

  return NextResponse.json({ src: `${SKIO_PORTAL_BASE}?${params.toString()}` });
}
