/**
 * B2B Teams Portal - shared data and constants.
 *
 * Used by both the client application form and the server-side apply route,
 * so the sport list and squad-size options stay in a single source of truth.
 * See docs/development/featurePlans/b2b-professionals-portal.md
 */

/**
 * The B2B contact address, and the one sanctioned exception to `SUPPORT_EMAIL`
 * in `app/lib/supportEmail.ts`: team and club enquiries deliberately reach a
 * named account owner rather than the shared inbox.
 *
 * It lives here once. Do not hard-code it in a component, the same rule the
 * shared inbox follows. Import `B2B_CONTACT_EMAIL` for display text and
 * `b2bMailtoHref()` for links.
 */
export const B2B_CONTACT_EMAIL = "harryglover@conka.io";

export function b2bMailtoHref(options?: {
  subject?: string;
  body?: string;
}): string {
  const { subject, body } = options ?? {};
  // Hand-encoded rather than via URLSearchParams, which renders a space as "+".
  // RFC 6068 does not treat that as a space in mailto headers, so clients such
  // as Apple Mail show a literal "CONKA+team+order". Same rule as supportEmail.
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length ? `?${params.join("&")}` : "";
  return `mailto:${B2B_CONTACT_EMAIL}${query}`;
}

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
  /** Metric the applicant welcome flow triggers on (fired on the applicant's profile). */
  eventName: "B2B Application Submitted",
  /**
   * Metric the internal new-lead alert flow triggers on. Fired on the notify
   * recipient's own profile (not the applicant's) because a Klaviyo flow email
   * always sends to the triggering profile, so this is how the alert reaches Harry.
   */
  alertEventName: "B2B Lead Alert",
  /** Internal recipient of the new-lead alert. Plain config, not a secret. */
  notifyEmail: B2B_CONTACT_EMAIL,
  /** Klaviyo "B2B Leads" list. One Klaviyo account, so a constant, not env. */
  listId: "Xhqyt8",
} as const;

/** Relative path to the gated order page the applicant is sent to (built in Phase 2). */
export const B2B_ORDER_PATH = "/professionals/order";

/**
 * Shared client-side email check for the B2B forms (enquiry + order builder), so
 * both gate their submit button on the same rule. The server still validates
 * independently with zod `.email()`; this is only for instant in-form feedback.
 */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
