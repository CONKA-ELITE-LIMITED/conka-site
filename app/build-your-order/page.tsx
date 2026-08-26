/**
 * DORMANT TRIAL PAGE. Live but not a current primary ad target.
 *
 * The approved trial funnel, reached from start-b's CTAs (/start -> /start-b ->
 * /funnel-c). Kept for reference / possible reuse, not deleted. funnel-b (the
 * unapproved sibling) was deleted 2026-08-18. Trial status map:
 * docs/development/TRIAL_PAGES_PERFORMANCE_PLAYBOOK.md
 */
import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MetaViewContent from "@/app/components/MetaViewContent";
import { getOfferVariant, getOfferPricing } from "@/app/lib/byoData";
import {
  BYO_DEFAULT_CADENCE,
  BYO_DEFAULT_PRODUCT,
} from "./defaults";
import { BYO_PRODUCTS } from "@/app/lib/byoData";
import BuildYourOrderClient from "./BuildYourOrderClient";

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

export default function BuildYourOrderPage() {
  return (
    <>
      {/* Warm the checkout origin so the terminal redirect to cart.checkoutUrl
          skips a cold DNS+TLS handshake. No crossOrigin: it's a navigation, not
          a CORS fetch. React 19 hoists these <link>s into <head>. */}
      <link rel="preconnect" href="https://conka-6770.myshopify.com" />
      <link rel="dns-prefetch" href="https://conka-6770.myshopify.com" />
      {/* Meta ViewContent for paid traffic — this flow previously fired only
          PageView until the late AddToCart, leaving Meta blind mid-flow.

          The offer MUST be the one the flow actually lands on. This hardcoded
          "both" while the UI opens on Flow, so every ViewContent reported the
          wrong content_id and a Both-sized value, feeding Meta's optimiser a
          product the visitor never saw. Both are now derived from the shared
          defaults the client uses. */}
      <MetaViewContent
        variantIds={[
          getOfferVariant(BYO_DEFAULT_PRODUCT, BYO_DEFAULT_CADENCE)
            ?.variantId ?? "",
        ]}
        value={
          getOfferPricing(BYO_DEFAULT_PRODUCT, BYO_DEFAULT_CADENCE)
            .price
        }
        contentName={BYO_PRODUCTS[BYO_DEFAULT_PRODUCT].label}
      />
      <BuildYourOrderClient />
      {/* Real-user Core Web Vitals — lets us compare this flow
          against other surfaces on field data, not just lab scores. */}
      <SpeedInsights />
    </>
  );
}
