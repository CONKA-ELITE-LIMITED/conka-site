import type { Metadata } from "next";

// conka-flow/page.tsx is a Client Component and cannot export metadata itself.
// This sibling server layout supplies the per-page SEO metadata (SCRUM-1132).
export const metadata: Metadata = {
  title: "CONKA Flow | Daily Morning Brain Shot for Focus and Calm",
  description:
    "CONKA Flow is a 30ml morning brain shot with 6 clinically-dosed adaptogens. Zero caffeine, Informed Sport certified. Sharper focus, no jitters. From £1.83/shot.",
  openGraph: {
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
  return children;
}
