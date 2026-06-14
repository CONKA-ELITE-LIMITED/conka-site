// CONKA — Buy boxes data + commerce contract.
//
// This is the ONE section that binds to Shopify. The display copy/prices below
// are the prototype values; in production you wire the `shopify` ids to real
// products and let the live price flow in (see BUILD.md §5). Keeping the
// prototype prices here means the section renders correctly before Shopify is
// connected, then you swap them for loader data.

export interface PriceSet {
  /** Headline price, e.g. "£89.99". */
  big: string;
  /** Per-shot unit, e.g. "£1.61/shot". */
  per: string;
  /** Strikethrough compare-at price (subscription only). */
  strike?: string;
}

/** What the "Start Now / Buy Once" button needs to add a line to the cart. */
export interface PurchaseConfig {
  /** Shopify variant GID, e.g. "gid://shopify/ProductVariant/123". */
  variantId: string;
  /** Shopify selling-plan GID for the subscription option (omit for one-time). */
  sellingPlanId?: string;
}

export interface BuyOption {
  /** e.g. "flow" | "clear" — used as the toggle value. */
  key: string;
  label: string; // toggle button label, e.g. "Flow · AM"
  title: string; // card title, e.g. "CONKA Flow"
  image: string;
  imageAlt: string;
  shopify: { subscription: PurchaseConfig; oneTime: PurchaseConfig };
}

export interface BuyCardData {
  key: 'bundle' | 'single';
  /** Default image/title (used when there's no option toggle). */
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  prices: { subscription: PriceSet; oneTime: PriceSet };
  /** Single-product purchase ids (when there's no flow/clear toggle). */
  shopify?: { subscription: PurchaseConfig; oneTime: PurchaseConfig };
  /** Present on the single card: a Flow/Clear switch. */
  options?: BuyOption[];
}

// ⚠️ Placeholder Shopify GIDs — replace with real ones from your store.
const TODO = (label: string): PurchaseConfig => ({ variantId: `TODO_variant_${label}`, sellingPlanId: `TODO_plan_${label}` });

export const BUNDLE: BuyCardData = {
  key: 'bundle',
  image: '/lander/BothHero.jpg',
  imageAlt: 'CONKA Flow & Clear bundle',
  title: 'CONKA – Flow & Clear',
  description: '2 shots per day = 28 day supply',
  prices: {
    subscription: { big: '£89.99', per: '£1.61/shot', strike: '£129.99' },
    oneTime: { big: '£129.99', per: '£2.32/shot' },
  },
  shopify: {
    subscription: TODO('both'),
    oneTime: { variantId: 'TODO_variant_both' },
  },
};

export const SINGLE: BuyCardData = {
  key: 'single',
  image: '/lander/FlowNew.jpg',
  imageAlt: 'CONKA Flow',
  title: 'CONKA Flow',
  description: '28 shots = 28 day supply',
  prices: {
    subscription: { big: '£59.99', per: '£2.14/shot', strike: '£79.99' },
    oneTime: { big: '£79.99', per: '£2.86/shot' },
  },
  options: [
    {
      key: 'flow',
      label: 'Flow · AM',
      title: 'CONKA Flow',
      image: '/lander/FlowNew.jpg',
      imageAlt: 'CONKA Flow',
      shopify: { subscription: TODO('flow'), oneTime: { variantId: 'TODO_variant_flow' } },
    },
    {
      key: 'clear',
      label: 'Clear · PM',
      title: 'CONKA Clear',
      image: '/lander/ClearNew.jpg',
      imageAlt: 'CONKA Clear',
      shopify: { subscription: TODO('clear'), oneTime: { variantId: 'TODO_variant_clear' } },
    },
  ],
};

export const OFFER = {
  head: 'Subscribe & Save 31%',
  line: 'Get free shipping every single month',
  sub: 'Pause, skip or cancel anytime.',
};

export const GUARANTEE = ['100-day money back guarantee', 'Pause, skip or cancel anytime'];

export const PROMO = "You're getting 31% off & Free Shipping";
