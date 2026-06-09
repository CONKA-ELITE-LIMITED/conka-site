/**
 * Subscriptions API Route
 * 
 * HYBRID APPROACH:
 * 1. Use Shopify's Customer Account API to identify which subscriptions belong to the customer
 * 2. Fetch detailed/current data from Loop API for each subscription
 * 
 * This ensures:
 * - Correct customer-subscription association (from Shopify)
 * - Accurate current state (from Loop - the source of truth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/app/lib/env';

// Loop API helper
async function fetchFromLoop(subscriptionId: string): Promise<any> {
  const loopToken = env.loopApiKey;
  if (!loopToken) {
    console.error('[Subscriptions] Loop API key not configured');
    return null;
  }

  try {
    // Use shopify-{id} format for Loop API
    const loopId = `shopify-${subscriptionId}`;
    const response = await fetch(
      `https://api.loopsubscriptions.com/admin/2023-10/subscription/${loopId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Loop-Token': loopToken,
        },
      }
    );

    if (!response.ok) {
      console.error(`[Subscriptions] Loop API error for ${loopId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(`[Subscriptions] Loop fetch error for ${subscriptionId}:`, error);
    return null;
  }
}

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('customer_access_token')?.value;
  const mockCookie = cookieStore.get('dev_mock_auth')?.value;
  const isDev = process.env.NODE_ENV === 'development';
  const mockAuthEnabled = process.env.DEV_MOCK_AUTH === 'true';

  if (isDev && mockAuthEnabled && mockCookie === '1') {
    const in7days = new Date(); in7days.setDate(in7days.getDate() + 7);
    const in14days = new Date(); in14days.setDate(in14days.getDate() + 14);
    const in30days = new Date(); in30days.setDate(in30days.getDate() + 30);
    const ago60days = new Date(); ago60days.setDate(ago60days.getDate() - 60);
    const ago30days = new Date(); ago30days.setDate(ago30days.getDate() - 30);

    return NextResponse.json({
      subscriptions: [
        // 1. Active single-formula (Flow) — weekly cadence, unfulfilled first order
        {
          id: 'gid://shopify/SubscriptionContract/dev-mock-flow',
          status: 'active',
          nextBillingDate: in7days.toISOString().slice(0, 10),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          product: {
            id: 'dev-mock-flow-product',
            title: 'Conka Flow - Starter - 4',
            variantTitle: 'Starter · 4 shots',
            quantity: 4,
            image: '/formulas/ConkaFlowColour.jpg',
          },
          price: { amount: '11.99', currencyCode: 'GBP' },
          interval: { value: 1, unit: 'week' },
          lines: [],
          isMultiLine: false,
          hasUnfulfilledOrder: true,
          unfulfilledOrdersCount: 1,
          completedOrdersCount: 0,
          totalOrdersPlaced: 1,
          paymentMethod: { id: 1, brand: 'Visa', lastDigits: '4242', expiryMonth: 1, expiryYear: 28, status: 'safe' },
        },
        // 2. Active protocol (Resilience) — bi-weekly cadence
        {
          id: 'gid://shopify/SubscriptionContract/dev-mock-resilience',
          status: 'active',
          nextBillingDate: in14days.toISOString().slice(0, 10),
          createdAt: ago30days.toISOString(),
          updatedAt: ago30days.toISOString(),
          product: {
            id: 'dev-mock-resilience-product',
            title: 'Conka Resilience - Pro - 12',
            variantTitle: 'Pro · 12 shots',
            quantity: 12,
            image: '/protocols/ResilienceRed.jpg',
          },
          price: { amount: '31.99', currencyCode: 'GBP' },
          interval: { value: 14, unit: 'day' },
          lines: [],
          isMultiLine: false,
          hasUnfulfilledOrder: false,
          completedOrdersCount: 2,
          totalOrdersPlaced: 2,
          paymentMethod: { id: 1, brand: 'Visa', lastDigits: '4242', expiryMonth: 1, expiryYear: 28, status: 'safe' },
        },
        // 3. Multi-line contract — Flow + Clarity in one subscription (the problematic case)
        {
          id: 'gid://shopify/SubscriptionContract/dev-mock-multiline',
          status: 'active',
          nextBillingDate: in14days.toISOString().slice(0, 10),
          createdAt: ago30days.toISOString(),
          updatedAt: ago30days.toISOString(),
          product: {
            id: 'dev-mock-multiline-product',
            title: 'Conka Flow - Pro - 12',
            variantTitle: 'Pro · 12 shots',
            quantity: 12,
            image: '/formulas/ConkaFlowColour.jpg',
          },
          price: { amount: '63.98', currencyCode: 'GBP' },
          interval: { value: 14, unit: 'day' },
          lines: [
            { id: 'line-1', productTitle: 'Conka Flow', variantTitle: 'Pro · 12 shots', price: '31.99', quantity: 12, variantShopifyId: 56999967752566 },
            { id: 'line-2', productTitle: 'Conka Clarity', variantTitle: 'Pro · 12 shots', price: '31.99', quantity: 12, variantShopifyId: 57000418673014 },
          ],
          isMultiLine: true,
          hasUnfulfilledOrder: false,
          completedOrdersCount: 1,
          totalOrdersPlaced: 1,
          paymentMethod: { id: 1, brand: 'Visa', lastDigits: '4242', expiryMonth: 1, expiryYear: 28, status: 'expiring_soon' },
        },
        // 4. Paused protocol (Precision) — monthly cadence
        {
          id: 'gid://shopify/SubscriptionContract/dev-mock-precision',
          status: 'paused',
          nextBillingDate: in30days.toISOString().slice(0, 10),
          createdAt: ago60days.toISOString(),
          updatedAt: ago30days.toISOString(),
          product: {
            id: 'dev-mock-precision-product',
            title: 'Conka Precision - Max - 28',
            variantTitle: 'Max · 28 shots',
            quantity: 28,
            image: '/protocols/PrecisionPurple.jpg',
          },
          price: { amount: '63.99', currencyCode: 'GBP' },
          interval: { value: 1, unit: 'month' },
          lines: [],
          isMultiLine: false,
          hasUnfulfilledOrder: false,
          completedOrdersCount: 2,
          totalOrdersPlaced: 2,
          paymentMethod: { id: 2, brand: 'Mastercard', lastDigits: '9876', expiryMonth: 3, expiryYear: 24, status: 'expired' },
        },
        // 5. Cancelled (past subscription)
        {
          id: 'gid://shopify/SubscriptionContract/dev-mock-cancelled',
          status: 'cancelled',
          nextBillingDate: '',
          createdAt: ago60days.toISOString(),
          updatedAt: ago30days.toISOString(),
          product: {
            id: 'dev-mock-cancelled-product',
            title: 'Conka Balance - Starter - 4',
            variantTitle: 'Starter · 4 shots',
            quantity: 4,
            image: '/protocols/BalanceGreen.jpg',
          },
          price: { amount: '11.99', currencyCode: 'GBP' },
          interval: { value: 1, unit: 'week' },
          lines: [],
          isMultiLine: false,
          hasUnfulfilledOrder: false,
          completedOrdersCount: 3,
          totalOrdersPlaced: 3,
          paymentMethod: null,
        },
      ],
    });
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Step 1: Query Shopify Customer Account API for subscription IDs
  // This correctly returns ONLY the logged-in customer's subscriptions
  const query = `
    query {
      customer {
        subscriptionContracts(first: 50) {
          nodes {
            id
            status
            createdAt
            updatedAt
            nextBillingDate
            currencyCode
            lastPaymentStatus
            billingPolicy {
              interval
              intervalCount {
                count
              }
            }
            deliveryPolicy {
              interval
              intervalCount {
                count
              }
            }
            lines(first: 10) {
              nodes {
                id
                name
                title
                quantity
                currentPrice {
                  amount
                  currencyCode
                }
                variantImage {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(env.customerAccountApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('[Subscriptions] Shopify API errors:', result.errors);
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions', details: result.errors },
        { status: 500 }
      );
    }

    const shopifySubscriptions = result.data?.customer?.subscriptionContracts?.nodes || [];
    
    console.log(`[Subscriptions] Found ${shopifySubscriptions.length} subscriptions from Shopify`);

    // Step 2: For each subscription contract, fetch current state from Loop (all contracts, not just active/paused)
    const rawSubscriptions = await Promise.all(
      shopifySubscriptions.map(async (sub: any) => {
          // Extract the numeric Shopify ID from the GID
          // Format: gid://shopify/SubscriptionContract/126077600118 -> 126077600118
          const shopifyNumericId = sub.id.split('/').pop();
          
          // Fetch current state from Loop
          const loopData = await fetchFromLoop(shopifyNumericId);
          
          // Use Shopify data as base, but prefer Loop data for product info
          const shopifyFirstLine = sub.lines?.nodes?.[0] || {};
          const shopifyBillingPolicy = sub.billingPolicy || {};
          const shopifyDeliveryPolicy = sub.deliveryPolicy || {};
          
          // Get interval info from Shopify (fallback)
          const shopifyInterval = shopifyDeliveryPolicy.interval || shopifyBillingPolicy.interval || 'MONTH';
          const shopifyIntervalCount = shopifyDeliveryPolicy.intervalCount?.count || shopifyBillingPolicy.intervalCount?.count || 1;

          // If Loop data is available, use it for accurate product/variant info
          if (loopData) {
            const loopLine = loopData.lines?.[0] || {};
            const loopBillingPolicy = loopData.billingPolicy || {};
            const loopDeliveryPolicy = loopData.deliveryPolicy || {};
            
            // Determine interval from Loop data
            // Loop uses 'interval' not 'intervalUnit'
            const loopInterval = loopDeliveryPolicy.interval || loopBillingPolicy.interval || shopifyInterval;
            const loopIntervalCount = loopDeliveryPolicy.intervalCount || loopBillingPolicy.intervalCount || shopifyIntervalCount;
            
            // Log all Loop order-related fields for debugging
            console.log(`[Subscriptions] Loop data for ${shopifyNumericId}:`, {
              status: loopData.status,
              productTitle: loopLine.productTitle,
              variantTitle: loopLine.variantTitle,
              interval: loopInterval,
              intervalCount: loopIntervalCount,
              // Order tracking fields
              completedOrdersCount: loopData.completedOrdersCount,
              allOrdersCount: loopData.allOrdersCount,
              ordersCount: loopData.ordersCount,
              billingAttemptCount: loopData.billingAttemptCount,
              pendingOrdersCount: loopData.pendingOrdersCount,
              originOrderShopifyId: loopData.originOrderShopifyId,
              lastOrderId: loopData.lastOrderId,
              lastBillingDate: loopData.lastBillingDate,
            });

            // Robust check for unfulfilled orders
            // Strategy: Compare total orders placed vs completed orders
            const completedOrdersCount = loopData.completedOrdersCount ?? 0;
            const totalOrdersPlaced = loopData.allOrdersCount ?? loopData.ordersCount ?? loopData.billingAttemptCount ?? null;
            const pendingOrdersCount = loopData.pendingOrdersCount ?? null;
            const hasOriginOrder = !!loopData.originOrderShopifyId;
            
            // Multiple ways to detect unfulfilled orders:
            // 1. If we have totalOrders and it's greater than completed
            // 2. If pendingOrdersCount is available and > 0
            // 3. Fallback: If it's a new subscription with origin order but 0 completions
            let hasUnfulfilledOrder = false;
            let unfulfilledOrdersCount = 0;
            
            if (totalOrdersPlaced !== null && totalOrdersPlaced > completedOrdersCount) {
              hasUnfulfilledOrder = true;
              unfulfilledOrdersCount = totalOrdersPlaced - completedOrdersCount;
            } else if (pendingOrdersCount !== null && pendingOrdersCount > 0) {
              hasUnfulfilledOrder = true;
              unfulfilledOrdersCount = pendingOrdersCount;
            } else if (hasOriginOrder && completedOrdersCount === 0) {
              // Fallback for first order scenario
              hasUnfulfilledOrder = true;
              unfulfilledOrdersCount = 1;
            }
            
            console.log(`[Subscriptions] Unfulfilled order check for ${shopifyNumericId}:`, {
              totalOrdersPlaced,
              completedOrdersCount,
              pendingOrdersCount,
              hasOriginOrder,
              hasUnfulfilledOrder,
              unfulfilledOrdersCount,
            });

            return {
              id: sub.id,
              shopifyId: sub.id,
              shopifyNumericId,
              loopId: loopData.id,
              status: (loopData.status || sub.status)?.toLowerCase() || 'unknown',
              createdAt: loopData.createdAt || sub.createdAt,
              updatedAt: loopData.updatedAt || sub.updatedAt,
              nextBillingDate: loopData.nextBillingDate || sub.nextBillingDate,
              currencyCode: loopData.currencyCode || sub.currencyCode || 'GBP',
              lastPaymentStatus: sub.lastPaymentStatus,
              
              // Fulfillment info for warning display
              completedOrdersCount,
              totalOrdersPlaced,
              pendingOrdersCount,
              hasUnfulfilledOrder,
              unfulfilledOrdersCount,
              originOrderId: loopData.originOrderShopifyId,
              
              // Product info from Loop (more accurate after edits)
              product: {
                id: loopLine.id || shopifyFirstLine.id || '',
                // Use Loop's full product name (includes variant) or fall back to product title
                // Loop provides 'name' which is "Product - Variant" format
                title: loopLine.name || loopLine.productTitle || shopifyFirstLine.title || shopifyFirstLine.name || 'Subscription',
                variantTitle: loopLine.variantTitle || '',
                quantity: loopLine.quantity ?? shopifyFirstLine.quantity ?? 1,
                image: loopLine.variantImage || loopLine.image || shopifyFirstLine.variantImage?.url,
              },
              
              // Price info from Loop
              price: {
                amount: loopLine.price || loopLine.currentPrice || shopifyFirstLine.currentPrice?.amount || '0',
                currencyCode: loopData.currencyCode || shopifyFirstLine.currentPrice?.currencyCode || sub.currencyCode || 'GBP',
              },
              
              // Delivery/billing interval from Loop
              interval: {
                value: loopIntervalCount,
                unit: (loopInterval || 'month').toLowerCase(),
              },
              
              // All line items from Loop (for display and multi-line detection)
              lines: (loopData.lines || []).map((line: any) => ({
                id: line.id,
                productTitle: line.productTitle ?? line.name ?? '',
                variantTitle: line.variantTitle ?? '',
                price: line.price ?? line.currentPrice ?? 0,
                quantity: line.quantity ?? 1,
                variantShopifyId: line.variantShopifyId ?? line.variant?.shopifyId,
              })),
              isMultiLine: (loopData.lines?.length ?? 0) > 1,

              // Discount codes applied to this subscription (exclude shipping-only discounts)
              discounts: (loopData.discounts || [])
                .filter((d: any) => d.isActive && d.type !== 'SHIPPING_LINE')
                .map((d: any) => ({
                  title: d.title,
                  value: d.value,
                  isActive: d.isActive,
                  type: d.type,
                })),
              totalLineItemPrice: loopData.totalLineItemPrice ?? null,
              totalLineItemDiscountedPrice: loopData.totalLineItemDiscountedPrice ?? null,

              // Payment method from Loop (for display and update-email trigger)
              paymentMethodId: loopData?.paymentMethodId ?? null,
              paymentMethod: loopData?.paymentMethod
                ? {
                    id: loopData.paymentMethod.id,
                    brand: loopData.paymentMethod.card?.brand ?? null,
                    lastDigits: loopData.paymentMethod.card?.lastDigits != null ? String(loopData.paymentMethod.card.lastDigits) : null,
                    expiryMonth: loopData.paymentMethod.card?.expiryMonth ?? null,
                    expiryYear: loopData.paymentMethod.card?.expiryYear ?? null,
                    type: loopData.paymentMethod.type ?? null,
                    status: loopData.paymentMethod.status ?? null,
                  }
                : null,
              
              // Legacy lineItems shape (kept for compatibility)
              lineItems: (loopData.lines || []).map((line: any) => ({
                id: line.id,
                title: line.productTitle || line.variantTitle,
                variantTitle: line.variantTitle,
                quantity: line.quantity,
                price: line.price || line.currentPrice,
                image: line.image,
              })),
              
              // Flag indicating data source
              dataSource: 'loop',
            };
          }
          
          // Fallback to Shopify data if Loop fetch failed
          console.log(`[Subscriptions] Using Shopify fallback for ${shopifyNumericId}`);
          
          return {
            id: sub.id,
            shopifyId: sub.id,
            shopifyNumericId,
            status: sub.status?.toLowerCase() || 'unknown',
            createdAt: sub.createdAt,
            updatedAt: sub.updatedAt,
            nextBillingDate: sub.nextBillingDate,
            currencyCode: sub.currencyCode || 'GBP',
            lastPaymentStatus: sub.lastPaymentStatus,
            
          // Without Loop data, we can't determine fulfillment status
          // Default to false (don't show warning) when falling back
          completedOrdersCount: null,
          totalOrdersPlaced: null,
          pendingOrdersCount: null,
          hasUnfulfilledOrder: false,
          unfulfilledOrdersCount: 0,
          originOrderId: null,
          
          // Product info from Shopify
          product: {
            id: shopifyFirstLine.id || '',
            title: shopifyFirstLine.title || shopifyFirstLine.name || 'Subscription',
            variantTitle: shopifyFirstLine.title || '',
            quantity: shopifyFirstLine.quantity ?? 1,
            image: shopifyFirstLine.variantImage?.url,
          },
            
            // Price info
            price: {
              amount: shopifyFirstLine.currentPrice?.amount || '0',
              currencyCode: shopifyFirstLine.currentPrice?.currencyCode || sub.currencyCode || 'GBP',
            },
            
            // Delivery/billing interval
            interval: {
              value: shopifyIntervalCount,
              unit: shopifyInterval.toLowerCase(),
            },
            
            // All line items from Shopify (for display and multi-line detection)
            lines: (sub.lines?.nodes || []).map((line: any) => ({
              id: line.id,
              productTitle: line.title ?? line.name ?? '',
              variantTitle: line.title ?? line.name ?? '',
              price: line.currentPrice?.amount ?? 0,
              quantity: line.quantity ?? 1,
              variantShopifyId: undefined,
            })),
            isMultiLine: (sub.lines?.nodes?.length ?? 0) > 1,
            
            paymentMethodId: null,
            paymentMethod: null,
            
            // Legacy lineItems shape
            lineItems: (sub.lines?.nodes || []).map((line: any) => ({
              id: line.id,
              title: line.title || line.name,
              quantity: line.quantity,
              price: line.currentPrice?.amount,
              image: line.variantImage?.url,
            })),
            
            // Flag indicating data source
            dataSource: 'shopify-fallback',
          };
        })
    );

    // Order: ACTIVE first, then PAUSED, then cancelled/expired; within each group by createdAt descending
    const statusOrder: Record<string, number> = { active: 0, paused: 1, cancelled: 2, expired: 3 };
    const subscriptions = (rawSubscriptions as any[]).sort((a, b) => {
      const aStatus = (a.status || '').toLowerCase();
      const bStatus = (b.status || '').toLowerCase();
      const aOrder = statusOrder[aStatus] ?? 4;
      const bOrder = statusOrder[bStatus] ?? 4;
      if (aOrder !== bOrder) return aOrder - bOrder;
      const aCreated = new Date(a.createdAt || 0).getTime();
      const bCreated = new Date(b.createdAt || 0).getTime();
      return bCreated - aCreated; // newest first
    });

    return NextResponse.json({ 
      subscriptions,
      debug: {
        source: 'hybrid-shopify-loop',
        totalFromShopify: shopifySubscriptions.length,
        returned: subscriptions.length,
        loopDataCount: subscriptions.filter((s: any) => s.dataSource === 'loop').length,
        shopifyFallbackCount: subscriptions.filter((s: any) => s.dataSource === 'shopify-fallback').length,
      }
    });

  } catch (error) {
    console.error('[Subscriptions] Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions', details: String(error) },
      { status: 500 }
    );
  }
}
