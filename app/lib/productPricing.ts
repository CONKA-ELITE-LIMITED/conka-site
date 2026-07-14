/**
 * All pricing data and VAT/B2B constants.
 */

// ===== PRICING =====
// Base prices match Shopify. Subscription = 20% off base price.

// Individual Formula Pricing (matches Shopify)
export const formulaPricing = {
  // One-time = base price (no discount)
  "one-time": {
    "4": { price: 14.99, perShot: 3.75 },
    "8": { price: 28.99, perShot: 3.62 },
    "12": { price: 39.99, perShot: 3.33 },
    "28": { price: 79.99, perShot: 2.86 },
  },
  // Subscription = 20% off base price
  subscription: {
    "4": { price: 11.99, billing: "weekly", perShot: 3.0, basePrice: 14.99 },
    "8": { price: 23.19, billing: "bi-weekly", perShot: 2.9, basePrice: 28.99 },
    "12": {
      price: 31.99,
      billing: "bi-weekly",
      perShot: 2.67,
      basePrice: 39.99,
    },
    "28": { price: 63.99, billing: "monthly", perShot: 2.29, basePrice: 79.99 },
  },
} as const;

