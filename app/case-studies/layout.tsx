import type { Metadata } from "next";

// case-studies/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1140).
export const metadata: Metadata = {
  title: "CONKA Case Studies | Cognitive Test Results from Real Users",
  description:
    "High performers ran a daily FDA-cleared cognitive test on and off CONKA, then published the results. See the scores, the protocols and the formulas they used.",
  openGraph: {
    title: "CONKA Case Studies | Cognitive Test Results from Real Users",
    description:
      "High performers tested themselves daily on and off CONKA with an FDA-cleared cognitive test. See the scores and the formulas they used.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "CONKA Case Studies | Cognitive Test Results from Real Users",
    description:
      "High performers tested themselves daily on and off CONKA with an FDA-cleared cognitive test. See the scores and the formulas they used.",
    images: ["/opengraph-image.png"],
  },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
