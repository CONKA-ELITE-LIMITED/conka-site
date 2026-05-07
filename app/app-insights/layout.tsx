import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real cognitive data from real users | CONKA",
  description:
    "What 712 CONKA app users and 7,593 cognitive tests show, measured daily with an FDA-cleared assessment. The honest patterns and the data limits.",
  openGraph: {
    title: "Real cognitive data from real users | CONKA",
    description:
      "We don't ask if Conka works. We measure it. 712 users, 7,593 tests, 30 months of data from inside the CONKA app.",
  },
};

export default function AppInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
