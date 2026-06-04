/**
 * Shopify Admin API GraphQL helper (server-only).
 *
 * Distinct from app/lib/shopify.ts, which is Storefront-only (public token,
 * shopper-facing: products + carts). The Admin API is the merchant/back-office
 * surface and is the ONLY place draft orders and invoices live, so the B2B
 * pay-by-invoice path (SCRUM-1058) has to go through here.
 *
 * Auth is a static offline access token in SHOPIFY_ADMIN_API_TOKEN, sent as the
 * X-Shopify-Access-Token header. The token is a secret: it has write access to
 * draft orders and customers on the live store, so it is read only server-side
 * and never exposed to the client (no NEXT_PUBLIC_ prefix).
 *
 * Callers must guard with isAdminApiConfigured() and return a 503 when the token
 * is unset, mirroring the variant-GID guard in app/api/b2b/cart/route.ts. That
 * keeps the build green and the order page usable before the token exists.
 *
 * See docs/development/featurePlans/b2b-professionals-portal.md
 */

const ADMIN_API_VERSION = "2025-10";

/** True when the Admin API token is configured. Guard before calling adminGraphql. */
export function isAdminApiConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_ADMIN_API_TOKEN);
}

export interface AdminGraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * POST a GraphQL operation to the Admin API. Throws if the token or store domain
 * is unset (callers should guard with isAdminApiConfigured first) or if the HTTP
 * request fails. GraphQL-level errors come back in the `errors` field for the
 * caller to inspect alongside per-mutation userErrors.
 */
export async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<AdminGraphqlResponse<T>> {
  const token = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  if (!token) throw new Error("SHOPIFY_ADMIN_API_TOKEN is not configured");
  if (!domain) throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not configured");

  const res = await fetch(
    `https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );

  if (!res.ok) {
    throw new Error(`Admin API HTTP ${res.status}`);
  }

  return (await res.json()) as AdminGraphqlResponse<T>;
}
