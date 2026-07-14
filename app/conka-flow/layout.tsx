import type { Metadata } from "next";
import { formulaContent, formatPrice } from "@/app/lib/productData";
import {
  FUNNEL_PRODUCTS,
  FUNNEL_HERO_IMAGES,
  getFunnelPriceRange,
  getFunnelMinPerShot,
} from "@/app/lib/funnelData";
import { JsonLd, buildProductSchema, buildFaqSchema } from "@/app/lib/jsonLd";

// conka-flow/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1132).
export const metadata: Metadata = {
  title: "CONKA Flow | Daily Morning Brain Shot for Focus and Calm",
  description: `CONKA Flow is a 30ml morning brain shot with 6 clinically-dosed adaptogens. Zero caffeine, Informed Sport certified. Sharper focus, no jitters. From ${formatPrice(
    getFunnelMinPerShot("flow"),
  )}/shot.`,
  openGraph: {
    title: "CONKA Flow | Daily Morning Brain Shot for Focus and Calm",
    description:
      "A 30ml morning brain shot with 6 clinically-dosed adaptogens. Zero caffeine, Informed Sport certified. Sharper focus, no jitters.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "CONKA Flow | Daily Morning Brain Shot for Focus and Calm",
    description:
      "A 30ml morning brain shot with 6 clinically-dosed adaptogens. Zero caffeine, Informed Sport certified. Sharper focus, no jitters.",
    images: ["/opengraph-image.png"],
  },
};

export default function ConkaFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flowPrices = getFunnelPriceRange("flow");
  const productSchema = buildProductSchema({
    name: "CONKA Flow",
    description: FUNNEL_PRODUCTS.flow.description,
    imagePath: FUNNEL_HERO_IMAGES.flow.src,
    urlPath: "/conka-flow",
    lowPrice: flowPrices.low,
    highPrice: flowPrices.high,
    offerCount: flowPrices.count,
  });
  const faqSchema = buildFaqSchema(formulaContent["01"].faq);

  return (
    <>
      <JsonLd schema={productSchema} />
      <JsonLd schema={faqSchema} />
      {children}
    </>
  );
}
