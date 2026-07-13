import type { Metadata } from "next";

// conka-clarity/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1132).
export const metadata: Metadata = {
  title: "CONKA Clear | Afternoon Brain Shot for Focus Under Pressure",
  description:
    "CONKA Clear is a 30ml afternoon brain shot with Alpha GPC and Ginkgo Biloba. Cuts brain fog and sharpens thinking. Informed Sport certified. From £1.83/shot.",
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
  return children;
}
