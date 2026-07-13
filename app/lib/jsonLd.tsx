/**
 * JSON-LD structured data helpers (SCRUM-1133).
 *
 * Renders schema.org markup as an `application/ld+json` script for the PDPs.
 * Builders take primitives, so they stay decoupled from the product-data layer;
 * each page supplies its own data from funnelData / formulaContent / faqContent.
 */

/** Site origin. Mirrors `metadataBase` in app/layout.tsx; JSON-LD needs absolute URLs. */
export const SITE_ORIGIN = "https://www.conka.io";

/** Resolve a root-relative path (e.g. "/formulas/x.jpg") to an absolute URL. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
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
