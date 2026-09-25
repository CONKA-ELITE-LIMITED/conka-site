/**
 * The CONKA app server (Flask on Cloud Run, conkaApp repo). The website
 * cognition test is scored there (`/springboot/*`) and its result is sent to
 * Klaviyo from there (`/api/klaviyo/web-test-complete`).
 *
 * The production load balancer strips `/api`, so the Klaviyo route carries the
 * prefix and `/springboot` does not. See docs/features/COGNITIVE_TEST.md.
 */
export const CONKA_APP_API_ORIGIN = "https://conka.app";
