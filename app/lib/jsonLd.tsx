/**
 * JSON-LD structured data helpers (SCRUM-1133).
 *
 * Renders schema.org markup as an `application/ld+json` script for the PDPs.
 * Builders take primitives, so they stay decoupled from the product-data layer;
 * each page supplies its own data from funnelData / formulaContent / faqContent.
 */

import { COMPANY, SAME_AS, SITE_ORIGIN } from "./site";

/** Resolve a root-relative path (e.g. "/formulas/x.jpg") to an absolute URL. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

/**
 * Stable identifier for the CONKA Organization node. Other schema nodes reference
 * this instead of restating the brand, so there is exactly one entity on the site.
 */
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;

/**
 * Build the schema.org Organization node (SCRUM-1141). This is what binds the
 * string "CONKA" to a verifiable entity for answer engines: `sameAs` points at
 * profiles we control, and the Companies House entry, VAT ID and registered
 * address let a machine corroborate the claim against public record.
 *
 * No `aggregateRating`: no queryable per-entity rating source, and a sitewide
 * figure risks a Google manual action. The Trustpilot `sameAs` link gives answer
 * engines a path to the reviews without us asserting a number we cannot back.
 * No `telephone`: there is no public support line, and inventing one is worse
 * than omitting the field.
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: COMPANY.name,
    legalName: COMPANY.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.png"),
    description:
      "CONKA makes daily nootropic brain shots: clinically dosed, caffeine-free formulas for focus, mental clarity and calm. Informed Sport certified.",
    email: COMPANY.email,
    vatID: COMPANY.vatId,
    foundingDate: COMPANY.foundingDate,
    founder: COMPANY.founders.map((name) => ({ "@type": "Person", name })),
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street,
      addressLocality: COMPANY.address.locality,
      postalCode: COMPANY.address.postalCode,
      addressCountry: COMPANY.address.country,
    },
    sameAs: SAME_AS,
  };
}

/** Build the schema.org WebSite node, published by the Organization above. */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: COMPANY.name,
    alternateName: COMPANY.legalName,
    url: absoluteUrl("/"),
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Strip HTML tags and claims-anchor symbols (†) so answer copy is clean plain text. */
function toPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/†/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface ProductSchemaInput {
  /** Indexable product name, e.g. "CONKA Flow". */
  name: string;
  description: string;
  /** Root-relative image path; absolutised here. */
  imagePath: string;
  /** Root-relative canonical path for the product, e.g. "/conka-flow". */
  urlPath: string;
  /** Cheapest and dearest purchasable price across cadences, in GBP. */
  lowPrice: number;
  highPrice: number;
  /** Number of purchasable offers (cadences). */
  offerCount: number;
}

/**
 * Build a schema.org Product node with an AggregateOffer spanning the product's
 * cadences. No aggregateRating: there is no per-product rating source, and a
 * sitewide figure on a single product would breach Google's policy (SCRUM-1133).
 */
export function buildProductSchema(input: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: toPlainText(input.description),
    image: absoluteUrl(input.imagePath),
    url: absoluteUrl(input.urlPath),
    brand: { "@type": "Brand", name: "CONKA" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice: input.lowPrice,
      highPrice: input.highPrice,
      offerCount: input.offerCount,
      availability: "https://schema.org/InStock",
    },
  };
}

/** Build a schema.org FAQPage node from question/answer pairs. Answers are plain text. */
export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: toPlainText(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: toPlainText(item.answer),
      },
    })),
  };
}

/**
 * Renders a JSON-LD script. Escapes every "<" as a unicode sequence so editable
 * copy (FAQ answers, descriptions) can never break out of the script tag.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  const json = JSON.stringify(schema).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
