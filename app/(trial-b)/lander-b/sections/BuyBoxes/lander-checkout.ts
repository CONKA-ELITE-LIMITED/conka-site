/**
 * CONKA lander — straight-to-checkout helper.
 *
 * The lander is a standalone funnel: clicking a buy button creates a fresh
 * Shopify cart and redirects to checkout (it does NOT touch the site cart drawer).
 *
 * Checkout uses the exact variant the card displayed (live.variantId), via our
 * POST /api/cart route, so the price shown always matches the price charged.
 * We deliberately do NOT route through funnelCheckout(): that helper ignores a
 * passed variant and re-resolves its own from funnelData, which would risk a
 * display/charge mismatch on this live-priced page. Instead we reuse the same
 * analytics helpers funnelCheckout fires, plus the shared Meta cart attributes
 * (_fbp/_fbc) so the server-side Purchase webhook can attribute the order.
 */

import {trackMetaAddToCart, toContentId, buildMetaCartAttributes} from '@/app/lib/metaPixel';
import {trackAddToCart as trackTripleWhaleAddToCart} from '@/app/lib/tripleWhale';
import {trackPurchaseAddToCart} from '@/app/lib/analytics';

export interface CheckoutArgs {
  variantId: string;
  sellingPlanId?: string;
  quantity?: number;
  /** Analytics context. */
  product?: 'flow' | 'clear' | 'both';
  purchaseType?: 'subscription' | 'one-time';
  price?: number;
  /** Analytics/source tag — distinguishes lander vs start traffic. */
  source?: string;
}

export async function landerCheckout({
  variantId,
  sellingPlanId,
  quantity = 1,
  product,
  purchaseType,
  price,
  source = 'lander_page_b',
}: CheckoutArgs) {
  const cartAttributes = buildMetaCartAttributes();

  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      action: 'create',
      variantId,
      quantity,
      ...(sellingPlanId ? {sellingPlanId} : {}),
      attributes: [
        {key: '_source', value: source},
        ...(product ? [{key: '_selected_product', value: product}] : []),
      ],
      ...(cartAttributes.length > 0 && {cartAttributes}),
    }),
  });
  const data = await res.json();
  const url = data?.cart?.checkoutUrl;
  if (!url) throw new Error('No checkout URL returned from /api/cart');

  fireAnalytics({variantId, product, purchaseType, price, source});

  window.location.href = url;
}

/** Fire all analytics events. Non-blocking, fails silently — never blocks checkout. */
function fireAnalytics({
  variantId,
  product,
  purchaseType,
  price,
  source = 'lander_page_b',
}: Pick<CheckoutArgs, 'variantId' | 'product' | 'purchaseType' | 'price' | 'source'>): void {
  try {
    trackMetaAddToCart({
      content_ids: [toContentId(variantId)],
      value: price ?? 0,
      currency: 'GBP',
      num_items: 1,
    });

    trackTripleWhaleAddToCart({productId: variantId, variantId, quantity: 1});

    trackPurchaseAddToCart({
      productType: 'formula',
      productId: product ?? 'lander',
      variantId,
      purchaseType: purchaseType ?? 'subscription',
      location: `${source}_buybox`,
      source,
      price,
    });
  } catch {
    // Analytics should never block checkout.
  }
}
