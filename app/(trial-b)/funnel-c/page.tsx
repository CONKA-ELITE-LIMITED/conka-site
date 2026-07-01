import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MetaViewContent from "@/app/components/MetaViewContent";
import { getOfferVariant, getOfferPricing } from "../lib/funnelData";
import FunnelClient from "./FunnelClient";

export const metadata: Metadata = {
  title: "Get Started | CONKA",
  description:
    "Choose your CONKA plan. Flow for morning focus, Clear for afternoon clarity, or Both for the complete daily system. Subscribe and save 25%.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Get Started with CONKA",
    description:
      "Choose your daily brain performance system. Flow + Clear, delivered monthly.",
  },
};

export default function FunnelPage() {
  return (
    <>
      {/* Warm the checkout origin so the terminal redirect to cart.checkoutUrl
          skips a cold DNS+TLS handshake. No crossOrigin: it's a navigation, not
          a CORS fetch. React 19 hoists these <link>s into <head>. */}
      <link rel="preconnect" href="https://conka-6770.myshopify.com" />
      <link rel="dns-prefetch" href="https://conka-6770.myshopify.com" />
      {/* Meta ViewContent for paid traffic — the funnel previously fired only
          PageView until the late AddToCart, leaving Meta blind mid-funnel. */}
      <MetaViewContent
        variantIds={[getOfferVariant("both", "monthly-sub")?.variantId ?? ""]}
        value={getOfferPricing("both", "monthly-sub").price}
        contentName="CONKA – Flow & Clear"
      />
      <FunnelClient />
      {/* Real-user Core Web Vitals for this variant — lets us A/B funnel-c
          against /funnel on field data, not just lab scores. */}
      <SpeedInsights />
    </>
  );
}
