import type { Metadata } from "next";
import { formatPrice } from "@/app/lib/productData";
import {
  OFFER_PRODUCTS,
  OFFER_HERO_IMAGES,
  getOfferPriceRange,
  getOfferMinPerShot,
} from "@/app/lib/offerData";
import { JsonLd, buildProductSchema, buildFaqSchema } from "@/app/lib/jsonLd";
import { getFormulaPdpFaqItems } from "@/app/lib/formulaFaq";

// conka-clarity/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1132).
export const metadata: Metadata = {
  title: "CONKA Clear | Afternoon Brain Shot for Focus Under Pressure",
  description: `CONKA Clear is a 30ml afternoon brain shot with Alpha GPC and Ginkgo Biloba. Cuts brain fog and sharpens thinking. Informed Sport certified. From ${formatPrice(
    getOfferMinPerShot("clear"),
  )}/shot.`,
  openGraph: {
    title: "CONKA Clear | Afternoon Brain Shot for Focus Under Pressure",
    description:
      "A 30ml afternoon brain shot with Alpha GPC and Ginkgo Biloba. Cuts brain fog and sharpens thinking under pressure. Informed Sport certified.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "CONKA Clear | Afternoon Brain Shot for Focus Under Pressure",
    description:
      "A 30ml afternoon brain shot with Alpha GPC and Ginkgo Biloba. Cuts brain fog and sharpens thinking under pressure. Informed Sport certified.",
    images: ["/opengraph-image.png"],
  },
};

export default function ConkaClarityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clearPrices = getOfferPriceRange("clear");
  const productSchema = buildProductSchema({
    name: "CONKA Clear",
    description: OFFER_PRODUCTS.clear.description,
    imagePath: OFFER_HERO_IMAGES.clear.src,
    urlPath: "/conka-clarity",
    lowPrice: clearPrices.low,
    highPrice: clearPrices.high,
    offerCount: clearPrices.count,
  });
  // Same list the LabFAQ accordion renders, so schema == visible.
  const faqSchema = buildFaqSchema(getFormulaPdpFaqItems("02"));

  return (
    <>
      <JsonLd schema={productSchema} />
      <JsonLd schema={faqSchema} />
      {children}
    </>
  );
}
