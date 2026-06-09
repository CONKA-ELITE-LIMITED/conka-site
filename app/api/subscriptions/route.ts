import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomerSubscriptions } from '@/app/lib/loop';
import type { Subscription, SubscriptionStatus } from '@/app/types/subscription';

// Helper to get customer email from ID token cookie
async function getCustomerEmailFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('customer_id_token')?.value;
  
  if (!idToken) return null;
  
  try {
    // Decode the ID token to get customer email
    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString()
    );
    return payload.email || null;
  } catch {
    return null;
  }
}

// Transform Loop API response to our Subscription type
function transformLoopSubscription(loopSub: any, customerEmail: string): Subscription {
  // Map Loop's uppercase status to our lowercase status
  const statusMap: Record<string, SubscriptionStatus> = {
    'ACTIVE': 'active',
    'PAUSED': 'paused',
    'CANCELLED': 'cancelled',
    'CANCELED': 'cancelled', // Handle both spellings
    'EXPIRED': 'expired',
  };
  
  const status = statusMap[loopSub.status?.toUpperCase()] || 'active';
  
  // Extract product info from line items if available
  const lines = loopSub.lines || loopSub.lineItems || [];
  const firstLine = lines[0] || {};
  
  // Get interval info
  const intervalUnit = (loopSub.billingInterval || loopSub.deliveryInterval || 'month').toLowerCase();
  const intervalValue = loopSub.billingIntervalCount || loopSub.deliveryIntervalCount || 1;
  
  return {
    id: String(loopSub.id),
    customerId: String(loopSub.customerId || loopSub.shopifyCustomerId || ''),
    email: customerEmail,
    status,
    nextBillingDate: loopSub.nextBillingDate || loopSub.nextOrderDate || '',
    createdAt: loopSub.createdAt || '',
    updatedAt: loopSub.updatedAt || '',
    product: {
      id: String(firstLine.productId || firstLine.shopifyProductId || ''),
      title: firstLine.productTitle || firstLine.title || 'Subscription Product',
      variantTitle: firstLine.variantTitle || undefined,
      image: firstLine.imageSrc || firstLine.image || undefined,
    },
    price: {
      amount: String(loopSub.totalLineItemPrice || firstLine.price || '0'),
      currencyCode: loopSub.currencyCode || 'GBP',
    },
    quantity: firstLine.quantity || 1,
    interval: {
      value: intervalValue,
      unit: intervalUnit as 'day' | 'week' | 'month' | 'year',
    },
  };
}

// Shopify Shop ID - used to filter subscriptions to only this store
const SHOPIFY_SHOP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;

// GET - Fetch customer subscriptions (requires authentication)
export async function GET(_request: NextRequest) {
  try {
    // Get customer email from session cookie
    const customerEmail = await getCustomerEmailFromSession();

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Use the authenticated customer's email
    const result = await getCustomerSubscriptions(customerEmail);

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    // Filter subscriptions to only those belonging to THIS store
    // Loop returns subscriptions across ALL stores that use Loop for the same email
    const rawSubscriptions = (result.data || []).filter((sub: any) => {
      // Check if subscription has a shopId/storeId field that matches our store
      const subShopId = sub.shopId || sub.storeId || sub.shop?.id;
      if (subShopId && SHOPIFY_SHOP_ID) {
        return String(subShopId) === String(SHOPIFY_SHOP_ID);
      }
      
      // If no shop identifier, filter by a date range specific to when this store started
      // This is a fallback - subscriptions from other stores are typically older
      // You can adjust this cutoff date as needed
      const STORE_START_DATE = new Date('2024-06-01'); // Adjust to when your store started using Loop
      const subCreatedAt = new Date(sub.createdAt);
      return subCreatedAt >= STORE_START_DATE;
    });
    
    // Transform Loop's response format to our Subscription type
    const subscriptions = rawSubscriptions.map((sub: any) => 
      transformLoopSubscription(sub, customerEmail)
    );

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    
    // Check if it's a credentials error
    if (error instanceof Error && error.message.includes('not configured')) {
      return NextResponse.json(
        { error: 'Subscription service not configured', subscriptions: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

