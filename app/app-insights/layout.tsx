import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Cognitive Data | CONKA",
  description:
    "What 712 CONKA app users and 7,593 cognitive tests across 30 months actually show: the daily curve, mental fatigue, stress, and hangover effects.",
  openGraph: {
    title: "Real Cognitive Data | CONKA",
    description:
      "What 712 CONKA app users and 7,593 cognitive tests actually show. Honest patterns from real users -- including where the data is too thin to draw conclusions.",
  },
};

export default function AppInsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
