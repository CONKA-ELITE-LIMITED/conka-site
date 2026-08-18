/**
 * Loop -> Skio cutover flag (single source of truth).
 *
 * Build-time flag, read from `NEXT_PUBLIC_SKIO_ENABLED` so the client-bundled
 * subscribe surfaces and the `/account` entry point can read it. When true the
 * storefront attaches Skio selling plans and `/account` links to the Skio portal
 * (`/account/manage`); when false/unset everything stays on Loop (the live
 * default). Flip to "true" + redeploy at the Phase 4 cutover; emergency rollback
 * is Vercel Instant Rollback to the pre-cutover deploy.
 *
 * See docs/development/featurePlans/skio-subscription-migration.md.
 */
export function subscriptionsUseSkio(): boolean {
  return process.env.NEXT_PUBLIC_SKIO_ENABLED === "true";
}
