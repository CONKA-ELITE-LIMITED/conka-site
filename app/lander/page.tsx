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

import {getOfferVariant, getOfferPricing, type FunnelProduct} from '@/app/lib/funnelData';

export const metadata: Metadata = {
  title: 'CONKA — Brain Performance in a Shot',
  description:
    'A patented nootropic shot, formulated to support focus, memory, and mental endurance every single day.',
  // Paid-traffic landing page; keep it out of the organic index (matches /go/[slug]).
  robots: {index: false, follow: false},
};

const money = (n: number) => '£' + n.toFixed(2);
const perShot = (n: number) => '£' + n.toFixed(2) + '/shot';

const CARD_TITLE: Record<FunnelProduct, string> = {
  flow: 'CONKA Flow',
  clear: 'CONKA Clear',
  both: 'CONKA – Flow & Clear',
};

// Build one buy card from the canonical funnel catalogue (app/lib/funnelData.ts) —
// the same variants, selling plans and prices the /funnel page sells. The lander
// only offers monthly subscription + one-time for each product (no quarterly).
function buildCard(product: FunnelProduct) {
  const subVariant = getOfferVariant(product, 'monthly-sub');
  const otpVariant = getOfferVariant(product, 'monthly-otp');
  const subPricing = getOfferPricing(product, 'monthly-sub');
  const otpPricing = getOfferPricing(product, 'monthly-otp');

  // Monthly-sub and monthly-otp share the same Shopify variant; only the
  // selling plan differs. Check out that variant directly so display == charge.
  const variantId = subVariant?.variantId ?? otpVariant?.variantId ?? '';

  return {
    title: CARD_TITLE[product],
    variantId,
    available: Boolean(variantId),
    // `amount` (numeric) feeds checkout analytics; `price` (string) is for display.
    oneTime: {
      price: money(otpPricing.price),
      perShot: perShot(otpPricing.perShot),
      amount: otpPricing.price,
    },
    subscription: subVariant
      ? {
          sellingPlanId: subVariant.sellingPlanId,
          price: money(subPricing.price),
          perShot: perShot(subPricing.perShot),
          strike: subPricing.compareAtPrice ? money(subPricing.compareAtPrice) : null,
          amount: subPricing.price,
        }
      : null,
  };
}

export default function LanderPage() {
  const buy = {
    bundle: buildCard('both'),
    flow: buildCard('flow'),
    clear: buildCard('clear'),
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
