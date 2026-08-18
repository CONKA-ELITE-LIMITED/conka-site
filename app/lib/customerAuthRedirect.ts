/**
 * The OAuth redirect_uri for the Shopify Customer Account API login flow.
 *
 * Must be IDENTICAL in the authorize request and the token exchange, and must
 * exactly match a Callback URI registered in the Headless channel's Customer
 * Account API application setup.
 *
 * Prefers the `SHOPIFY_REDIRECT_URI` env var (the full callback URL) when set,
 * so environments whose request host is not stable can pin it: Vercel PREVIEW
 * (the function sees the per-deploy hash host, not the branch alias) and local
 * dev via ngrok. Leave it UNSET in production so it falls back to the request
 * origin (www.conka.io, which is registered).
 */
export function customerAuthRedirectUri(requestOrigin: string): string {
  return process.env.SHOPIFY_REDIRECT_URI || `${requestOrigin}/api/auth/callback`;
}
