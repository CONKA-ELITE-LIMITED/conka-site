import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/app/lib/faqContent";
import { formatPrice } from "@/app/lib/productData";
import {
  FUNNEL_PRODUCTS,
  FUNNEL_HERO_IMAGES,
  getFunnelPriceRange,
  getFunnelMinPerShot,
} from "@/app/lib/funnelData";
import { JsonLd, buildProductSchema, buildFaqSchema } from "@/app/lib/jsonLd";

// conka-both/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1132).
export const metadata: Metadata = {
  title: "Buy CONKA Brain Shot | Best Nootropic Supplement UK",
  description: `Buy CONKA Flow + Clear, the UK's most clinically validated brain shot. Informed Sport certified. 16 active ingredients. 100-day guarantee. From ${formatPrice(
    getFunnelMinPerShot("both"),
  )}/shot.`,
  openGraph: {
    title: "Buy CONKA Brain Shot | Best Nootropic Supplement UK",
    description:
      "CONKA Flow + Clear, the UK's most clinically validated brain shot. Informed Sport certified. 16 active ingredients. 100-day guarantee.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "Buy CONKA Brain Shot | Best Nootropic Supplement UK",
    description:
      "CONKA Flow + Clear, the UK's most clinically validated brain shot. Informed Sport certified. 16 active ingredients. 100-day guarantee.",
    images: ["/opengraph-image.png"],
  },
};

export default function ConkaBothLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bothPrices = getFunnelPriceRange("both");
  const productSchema = buildProductSchema({
    name: "CONKA Flow + Clear",
    description: FUNNEL_PRODUCTS.both.description,
    imagePath: FUNNEL_HERO_IMAGES.both.src,
    urlPath: "/conka-both",
    lowPrice: bothPrices.low,
    highPrice: bothPrices.high,
    offerCount: bothPrices.count,
  });
  const faqSchema = buildFaqSchema(FAQ_ITEMS);

  return (
    <>
      <JsonLd schema={productSchema} />
      <JsonLd schema={faqSchema} />
      {children}
    </>
  );
}
