import type {Metadata} from 'next';
import dynamic from 'next/dynamic';
import {SpeedInsights} from '@vercel/speed-insights/next';
import './lander.css';

import Nav from './sections/Nav/Nav';
import Hero from './sections/Hero/Hero';
import LogoMarquee from './sections/LogoMarquee/LogoMarquee';
import IngredientsSection from './sections/IngredientsSection/IngredientsSection';
import BrainFuelBand from './sections/BrainFuelBand/BrainFuelBand';
import Testimonials from './sections/Testimonials/Testimonials';
import ResearchPartners from './sections/ResearchPartners/ResearchPartners';
import Reviews from './sections/Reviews/Reviews';
import FAQ from './sections/FAQ/FAQ';
import Footer from './sections/Footer/Footer';

// Below-the-fold client islands — code-split so their hydration JS drops out of
// the initial TBT window. SSR is preserved (no ssr:false in a server component),
// so the HTML still renders; only the JS chunk is deferred. Loading fallbacks
// reserve height to avoid layout shift.
const BuyBoxes = dynamic(() => import('./sections/BuyBoxes/BuyBoxes'), {
  loading: () => <div style={{minHeight: 900}} />,
});
const CrashChart = dynamic(() => import('./sections/CrashChart/CrashChart'), {
  loading: () => <div style={{minHeight: 600}} />,
});
const Measure = dynamic(() => import('./sections/Measure/Measure'), {
  loading: () => <div style={{minHeight: 500}} />,
});

import {getOfferVariant, getOfferPricing, type FunnelProduct} from '../lib/funnelData';

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

  // Sub and OTP use DIFFERENT Shopify variants now (OTP is its own 20-shot SKU).
  // Each cadence carries its own variantId below; this is a fallback only.
  const variantId = subVariant?.variantId ?? otpVariant?.variantId ?? '';

  return {
    title: CARD_TITLE[product],
    variantId,
    available: Boolean(variantId),
    // `amount` (numeric) feeds checkout analytics; `price` (string) is for display.
    oneTime: {
      variantId: otpVariant?.variantId ?? variantId,
      price: money(otpPricing.price),
      perShot: perShot(otpPricing.perShot),
      amount: otpPricing.price,
      // Offer trial (B): one-time orders carry compulsory postage, shown as a note.
      postage: otpPricing.postage ?? null,
    },
    subscription: subVariant
      ? {
          variantId: subVariant.variantId,
          sellingPlanId: subVariant.sellingPlanId,
          price: money(subPricing.price),
          perShot: perShot(subPricing.perShot),
          strike: subPricing.compareAtPrice ? money(subPricing.compareAtPrice) : null,
          amount: subPricing.price,
          // Offer trial (B): free bonus shots on the first subscription order.
          freeShots: subPricing.freeShots ?? null,
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
      {/* Warm the checkout origin — lander-b sells straight to Shopify (no
          funnel hop), so the BuyBox redirect to cart.checkoutUrl skips a cold
          DNS+TLS handshake. No crossOrigin: it's a navigation, not a CORS fetch. */}
      <link rel="preconnect" href="https://conka-6770.myshopify.com" />
      <link rel="dns-prefetch" href="https://conka-6770.myshopify.com" />
      <Nav />
      <Hero />
      <LogoMarquee />
      <IngredientsSection />
      <BrainFuelBand />
      <BuyBoxes data={buy} />
      <CrashChart />
      <Testimonials />
      <div id="partners">
        <ResearchPartners />
      </div>
      <div id="reviews">
        <Reviews />
      </div>
      <Measure />
      <FAQ />
      <Footer />
      {/* Real-user Core Web Vitals for this variant (L8). */}
      <SpeedInsights />
    </div>
  );
}
