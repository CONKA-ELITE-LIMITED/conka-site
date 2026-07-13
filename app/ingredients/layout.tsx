import type { Metadata } from "next";

// ingredients/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1132).
export const metadata: Metadata = {
  title: "CONKA Ingredients | Ashwagandha, Alpha GPC, Ginkgo Biloba & More",
  description:
    "Every ingredient in CONKA Flow and Clear is clinically dosed and peer-reviewed: Ashwagandha, Rhodiola, Alpha GPC, Ginkgo Biloba, Lemon Balm. Why each is used.",
  openGraph: {
    title: "CONKA Ingredients | Ashwagandha, Alpha GPC, Ginkgo Biloba & More",
    description:
      "Every ingredient in CONKA Flow and Clear is clinically dosed and peer-reviewed. Ashwagandha, Rhodiola, Alpha GPC, Ginkgo Biloba, Lemon Balm.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "CONKA Ingredients | Ashwagandha, Alpha GPC, Ginkgo Biloba & More",
    description:
      "Every ingredient in CONKA Flow and Clear is clinically dosed and peer-reviewed. Ashwagandha, Rhodiola, Alpha GPC, Ginkgo Biloba, Lemon Balm.",
    images: ["/opengraph-image.png"],
  },
};

export default function IngredientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
