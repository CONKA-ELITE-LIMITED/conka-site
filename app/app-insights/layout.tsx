import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real cognitive data from real users | CONKA",
  description:
    "What 712 CONKA app users and 7,593 cognitive tests show, measured daily with an FDA-cleared assessment. The honest patterns and the data limits.",
  openGraph: {
    title: "Real cognitive data from real users | CONKA",
    description:
      "What 7,593 brain tests tell us: 712 CONKA app users, 30 months, every finding with its sample size.",
  },
};

export default function AppInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
