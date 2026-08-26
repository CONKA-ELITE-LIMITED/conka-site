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

/**
 * Transition window: Skio is live on the storefront but Skio has not yet
 * migrated the Loop contracts, so customers exist on BOTH platforms.
 *
 * Skio requires us to go live 24-48h BEFORE they migrate, so Loop goes static
 * before they pull the data. During that window `/account` must keep serving
 * the Loop list (where the overwhelming majority of customers still are) with a
 * route through to the Skio portal, instead of redirecting everyone to a Skio
 * portal that holds no contract for them.
 *
 * Only meaningful while Skio is live, so the Skio check is folded in here
 * rather than left to each call site to remember. Turn the flag OFF (redeploy)
 * once migration completes, at which point the plain Skio redirect resumes.
 *
 * See docs/development/featurePlans/skio-phase4-pre-cutover.md (SCRUM-1256).
 */
export function subscriptionsInTransition(): boolean {
  return subscriptionsUseSkio() && process.env.NEXT_PUBLIC_SKIO_TRANSITION === "true";
}

/**
 * True only once the migration is done: Skio owns every contract, so `/account`
 * is purely the Skio portal. This is the condition every "send them to Skio"
 * branch should read, not `subscriptionsUseSkio()` alone.
 */
export function subscriptionsSkioOnly(): boolean {
  return subscriptionsUseSkio() && !subscriptionsInTransition();
}
