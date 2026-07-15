import type { Metadata } from "next";

// conkaapp-privacy-policy/page.tsx is a Client Component and cannot export metadata
// itself. This sibling server layout supplies the per-page SEO metadata (SCRUM-1140).
export const metadata: Metadata = {
  title: "App Privacy Policy | CONKA",
  description:
    "How the CONKA app collects, uses and protects your data, including cognitive test results, account details and your rights over the data we hold.",
  openGraph: {
    title: "CONKA App Privacy Policy",
    description:
      "How the CONKA app collects, uses and protects your data, and your rights over the data we hold.",
    images: ["/opengraph-image.png"],
  },
  // A page-level twitter object replaces the root layout's entirely (metadata is
  // shallow-merged), so restate card + image alongside the page-specific copy.
  twitter: {
    card: "summary_large_image",
    title: "CONKA App Privacy Policy",
    description:
      "How the CONKA app collects, uses and protects your data, and your rights over the data we hold.",
    images: ["/opengraph-image.png"],
  },
};

export default function ConkaAppPrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
