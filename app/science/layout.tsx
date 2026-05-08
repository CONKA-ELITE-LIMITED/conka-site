import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Science | CONKA",
  description:
    "How CONKA actually works: every active ingredient clinically dosed from 32 peer-reviewed studies across 6,000+ participants. Developed with Durham and Cambridge universities, patented.",
  openGraph: {
    title: "The Science | CONKA",
    description:
      "How CONKA actually works: every active ingredient clinically dosed from 32 peer-reviewed studies across 6,000+ participants. Developed with Durham and Cambridge universities, patented.",
  },
};

export default function ScienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
