/**
 * Canonical site origin. Single source of truth for the production URL, used by
 * `metadataBase` (app/layout.tsx), JSON-LD absolute URLs (app/lib/jsonLd.tsx),
 * the sitemap and robots. Non-secret and identical across environments, so it
 * lives in code rather than an env var.
 */
export const SITE_ORIGIN = "https://www.conka.io";

/**
 * One-line description of what CONKA is. Shared by the Organization JSON-LD and
 * the web manifest so the two cannot drift apart. Keep it factual: an answer
 * engine may quote it verbatim.
 */
export const BRAND_DESCRIPTION =
  "CONKA makes daily nootropic brain shots: clinically dosed, caffeine-free formulas for focus, mental clarity and calm. Informed Sport certified.";

/**
 * Registered company details, verified against Companies House 2026-07-14.
 * Feed the Organization JSON-LD (SCRUM-1141). Public record, not secrets.
 */
export const COMPANY = {
  name: "CONKA",
  legalName: "CONKA ELITE LIMITED",
  companyNumber: "13235415",
  /** Incorporation date, ISO 8601. Becomes schema.org `foundingDate`. */
  foundingDate: "2021-03-01",
  vatId: "GB430507628",
  email: "info@conka.io",
  founders: ["Harry Glover", "Humphrey Bodington"],
  address: {
    street: "The Light Bulb, 1 Filament Walk, Unit 107",
    locality: "London",
    postalCode: "SW18 4GQ",
    country: "GB",
  },
} as const;

/**
 * Public profiles CONKA controls. Every entry is asserted as the same entity via
 * schema.org `sameAs`, so it is an identity claim: only add a profile we own and
 * actively maintain, and never one that 404s. `inFooter` entries also render as
 * links in the footer, because outbound links are what corroborate the claim.
 *
 * Schema-only entries (`inFooter: false`) are still true identity claims, they are
 * just not somewhere we want to send a customer: Companies House is a registry
 * signal, and Facebook is real but the least actively posted channel.
 */
export const SOCIAL_PROFILES = [
  { label: "LinkedIn", url: "https://www.linkedin.com/company/conka-io/", inFooter: true },
  { label: "Instagram", url: "https://www.instagram.com/conka.io/", inFooter: true },
  { label: "TikTok", url: "https://www.tiktok.com/@conka.io", inFooter: true },
  { label: "Trustpilot", url: "https://uk.trustpilot.com/review/conka.uk", inFooter: true },
  {
    label: "Facebook",
    url: "https://www.facebook.com/p/CONKA-100071338810920/",
    inFooter: false,
  },
  {
    label: "Companies House",
    url: "https://find-and-update.company-information.service.gov.uk/company/13235415",
    inFooter: false,
  },
] as const;

/** Every profile URL, for schema.org `sameAs`. */
export const SAME_AS = SOCIAL_PROFILES.map((p) => p.url);

/** The subset rendered as footer links. */
export const FOOTER_SOCIALS = SOCIAL_PROFILES.filter((p) => p.inFooter);
