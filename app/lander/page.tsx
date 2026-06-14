import type {Metadata} from 'next';
import './lander.css';

import Nav from './sections/Nav/Nav';
import Hero from './sections/Hero/Hero';
import LogoMarquee from './sections/LogoMarquee/LogoMarquee';
import IngredientsSection from './sections/IngredientsSection/IngredientsSection';
import BrainFuelBand from './sections/BrainFuelBand/BrainFuelBand';
import BuyBoxes from './sections/BuyBoxes/BuyBoxes';
import CrashChart from './sections/CrashChart/CrashChart';
import Testimonials from './sections/Testimonials/Testimonials';
import ResearchPartners from './sections/ResearchPartners/ResearchPartners';
import Reviews from './sections/Reviews/Reviews';
import Measure from './sections/Measure/Measure';
import Footer from './sections/Footer/Footer';

import {shopifyFetchCached} from '@/app/lib/shopify';

export const metadata: Metadata = {
  title: 'CONKA — Brain Performance in a Shot',
  description:
    'A patented nootropic shot, formulated to support focus, memory, and mental endurance every single day.',
  // Paid-traffic landing page; keep it out of the organic index (matches /go/[slug]).
  robots: {index: false, follow: false},
};

// Revalidate product/price data periodically (ISR). Tune as you like.
export const revalidate = 600;

const BUY_QUERY = /* GraphQL */ `
  fragment BuyVariant on ProductVariant {
    id
    title
    availableForSale
    price { amount currencyCode }
    sellingPlanAllocations(first: 10) {
      nodes {
        sellingPlan { id name }
        priceAdjustments { price { amount currencyCode } }
      }
    }
  }
  fragment BuyProduct on Product {
    id
    title
    variants(first: 20) { nodes { ...BuyVariant } }
  }
  query ConkaLanderBuyBoxes {
    bundle: product(handle: "conka-flow-clear") { ...BuyProduct }
    flow: product(handle: "protocol-conka-balance-copy") { ...BuyProduct }
    clear: product(handle: "conka-flow-copy") { ...BuyProduct }
  }
`;

function money(m?: {amount: string} | null) {
  return m ? '£' + Number(m.amount).toFixed(2) : null;
}

// Resolve one card's pricing/IDs from a live product + a target shot count.
function shapeCard(product: any, shots: number) {
  if (!product) return null;
  const needle = `${shots} Shots`;
  const v =
    product.variants.nodes.find((x: any) => x.title.includes(needle)) ??
    product.variants.nodes.find((x: any) => x.availableForSale) ??
    product.variants.nodes[0];
  if (!v) return null;

  const allocs = v.sellingPlanAllocations?.nodes ?? [];
  const monthly = allocs.find((a: any) => /month/i.test(a.sellingPlan?.name)) ?? allocs[0];
  const subAmount = monthly?.priceAdjustments?.[0]?.price?.amount;
  const oneAmount = v.price.amount;

  return {
    title: product.title,
    variantId: v.id,
    available: v.availableForSale,
    shots,
    // `amount` (numeric) feeds checkout analytics; `price` (string) is for display.
    oneTime: {price: money(v.price), perShot: '£' + (Number(oneAmount) / shots).toFixed(2) + '/shot', amount: Number(oneAmount)},
    subscription: monthly
      ? {
          sellingPlanId: monthly.sellingPlan.id,
          price: money(monthly.priceAdjustments[0].price),
          perShot: '£' + (Number(subAmount) / shots).toFixed(2) + '/shot',
          strike: money(v.price),
          amount: Number(subAmount),
        }
      : null,
  };
}

export default async function LanderPage() {
  // shopifyFetchCached(query, variables?, ttl?) returns { data, errors }.
  const result = await shopifyFetchCached<{
    bundle: unknown;
    flow: unknown;
    clear: unknown;
  }>(BUY_QUERY);
  const gql = (result?.data ?? {}) as Record<string, unknown>;

  const buy = {
    bundle: shapeCard(gql.bundle, 56),
    flow: shapeCard(gql.flow, 28),
    clear: shapeCard(gql.clear, 28),
  };

  return (
    <div className="conka-lander">
      <Nav />
      <Hero />
      <LogoMarquee />
      <IngredientsSection />
      <BrainFuelBand />
      <BuyBoxes data={buy} />
      <CrashChart />
      <Testimonials />
      <ResearchPartners />
      <Reviews />
      <Measure />
      <Footer />
    </div>
  );
}
