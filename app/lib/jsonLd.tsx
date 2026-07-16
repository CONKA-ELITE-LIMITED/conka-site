/**
 * JSON-LD structured data helpers (SCRUM-1133).
 *
 * Renders schema.org markup as an `application/ld+json` script for the PDPs.
 * Builders take primitives, so they stay decoupled from the product-data layer;
 * each page supplies its own data from funnelData / formulaContent / faqContent.
 */

import { BRAND_DESCRIPTION, COMPANY, SAME_AS, SITE_ORIGIN } from "./site";
import { stripClaimAnchors } from "./faqContent";

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
    description: BRAND_DESCRIPTION,
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

/** Strip HTML tags and claim anchors so answer copy is clean plain text. */
function toPlainText(value: string): string {
  return stripClaimAnchors(value.replace(/<[^>]*>/g, ""))
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
    // Reference the Organization @id rather than restating a standalone Brand, so
    // the knowledge graph resolves this product's brand to our single verifiable
    // CONKA entity. The Organization node (injected site-wide from the root layout)
    // defines the @id, name and type; a bare @id reference avoids asserting the
    // node is both a Brand and an Organization (SCRUM-1148).
    brand: { "@id": ORGANIZATION_ID },
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

interface BlogPostingSchemaInput {
  /** The post headline, which is also the page H1. */
  title: string;
  description: string;
  /** Root-relative canonical path, e.g. "/blog/some-slug". */
  urlPath: string;
  /** Root-relative hero path, or null when the post has no hero. */
  imagePath: string | null;
  /** ISO date, or null when the post carries no publish date. */
  datePublished: string | null;
  /** ISO datetime from Notion `last_edited_time`. */
  dateModified: string;
}

/**
 * Build a schema.org BlogPosting node (SCRUM-1157).
 *
 * Author and publisher both reference the Organization `@id` rather than naming
 * a person: posts are published under the CONKA masthead, and the legacy archive
 * carries a Shopify `authorV2` we deliberately do not import (there is no Author
 * column). Referencing the one verifiable entity beats inventing a byline.
 *
 * `image` and `datePublished` are omitted rather than faked when absent: an
 * absent field is honest, a wrong one poisons the entity.
 */
export function buildBlogPostingSchema(input: BlogPostingSchemaInput) {
  const url = absoluteUrl(input.urlPath);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: toPlainText(input.title),
    description: toPlainText(input.description),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(input.imagePath ? { image: absoluteUrl(input.imagePath) } : {}),
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
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
