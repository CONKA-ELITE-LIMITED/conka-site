/**
 * B2B Teams Portal - shared data and constants.
 *
 * Used by both the client application form and the server-side apply route,
 * so the sport list and squad-size options stay in a single source of truth.
 * See docs/development/featurePlans/b2b-professionals-portal.md
 */

/** Sport / sector options. Signals that CONKA is built for sport, not general wellness. */
export const B2B_SPORTS = [
  "Rugby Union",
  "Rugby League",
  "Football",
  "Cycling",
  "American Football",
  "Boxing",
  "Athletics",
  "Swimming",
  "Cricket",
  "Other",
] as const;

export type B2BSport = (typeof B2B_SPORTS)[number];

/** Squad / team size bands. Ranges give Harry qualification context without a fiddly number entry. */
export const B2B_SQUAD_SIZES = [
  "Under 10",
  "10-25",
  "26-50",
  "51-100",
  "Over 100",
] as const;

export type B2BSquadSize = (typeof B2B_SQUAD_SIZES)[number];

/**
 * Klaviyo integration contract.
 *
 * The applicant welcome email (with the order-page link) and Harry's
 * notification are both Klaviyo flows triggered off this single event.
 * The list collects B2B leads for follow-up and marketing. Both the list
 * and the flows are configured in the Klaviyo dashboard, not in code.
 */
export const B2B_KLAVIYO = {
  /** Metric name the welcome + notification flows trigger on. */
  eventName: "B2B Application Submitted",
  /** List the applicant is added to. Override via env for non-prod. */
  listId: process.env.KLAVIYO_B2B_LIST_ID ?? "",
} as const;

/** Relative path to the gated order page the applicant is sent to (built in Phase 2). */
export const B2B_ORDER_PATH = "/professionals/order";
