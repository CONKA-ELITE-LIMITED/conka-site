/**
 * GET /api/auth/subscriptions/payment-methods
 *
 * 1. Read customer ID from Shopify session (Customer Account API with access token)
 * 2. Extract numeric Shopify customer ID from GID: gid://shopify/Customer/7302843334829 -> 7302843334829
 * 3. Call Loop: GET https://api.loopsubscriptions.com/admin/2023-10/customer/{customerShopifyId}
 * 4. Return paymentMethods array from response, sorted safe first / expired last.
 *
 * All calls use LOOP_API_KEY with X-Loop-Token. Log prefix: [PAYMENT-METHODS]
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/app/lib/env';
import type { PaymentMethod } from '@/app/types/paymentMethod';

const LOOP_ADMIN_BASE = 'https://api.loopsubscriptions.com/admin/2023-10';

/** Expiring within 60 days → expiring_soon. expiryYear can be 2-digit (28) or 4-digit (2028). */
export function getCardStatus(method: {
  status?: string | null;
  expiryMonth?: number | null;
  expiryYear?: number | null;
}): 'safe' | 'expiring_soon' | 'expired' {
  const s = (method.status || '').toLowerCase();
  if (s === 'expired') return 'expired';
  if (!method.expiryMonth || method.expiryYear == null) return 'safe';
  const year = method.expiryYear < 100 ? 2000 + method.expiryYear : method.expiryYear;
  const endOfMonth = new Date(year, method.expiryMonth, 0); // last day of expiry month
  const daysUntilExpiry = (endOfMonth.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry < 60) return 'expiring_soon';
  return 'safe';
}

function extractNumericCustomerId(gid: string): string | null {
  if (!gid) return null;
  if (gid.startsWith('gid://shopify/Customer/')) {
    return gid.replace('gid://shopify/Customer/', '').trim() || null;
  }
  if (/^\d+$/.test(gid)) return gid;
  return null;
}

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('customer_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const loopToken = env.loopApiKey;
  if (!loopToken) {
    console.error('[PAYMENT-METHODS] LOOP_API_KEY not configured');
    return NextResponse.json(
      { error: 'Payment methods not configured' },
      { status: 503 }
    );
  }

  try {
    // 1. Get Shopify customer GID from Customer Account API
    const customerQuery = 'query { customer { id } }';
    const customerRes = await fetch(env.customerAccountApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: accessToken,
      },
      body: JSON.stringify({ query: customerQuery }),
    });

    if (!customerRes.ok) {
      console.error('[PAYMENT-METHODS] Shopify customer fetch failed', customerRes.status);
      return NextResponse.json(
        { error: 'Could not resolve customer' },
        { status: 502 }
      );
    }

    const customerData = await customerRes.json();
    const customerGid = customerData?.data?.customer?.id;
    const customerShopifyId = customerGid ? extractNumericCustomerId(customerGid) : null;

    if (!customerShopifyId) {
      console.log('[PAYMENT-METHODS] No customer id from Shopify');
      return NextResponse.json({ paymentMethods: [] });
    }

    // 2. Loop: GET customer by Shopify ID (returns customer with payment methods)
    const loopRes = await fetch(
      `${LOOP_ADMIN_BASE}/customer/${customerShopifyId}`,
      { headers: { 'X-Loop-Token': loopToken } }
    );

    if (!loopRes.ok) {
      const text = await loopRes.text();
      console.error('[PAYMENT-METHODS] Loop customer fetch failed', loopRes.status, text);
      return NextResponse.json(
        { error: 'Failed to fetch payment methods' },
        { status: 502 }
      );
    }

    const loopData = await loopRes.json();
    const rawList = loopData?.data?.paymentMethods ?? loopData?.paymentMethods ?? [];
    const rawArray = Array.isArray(rawList) ? rawList : [];

    const mapped: PaymentMethod[] = rawArray.map((pm: any) => {
      const card = pm.card ?? pm;
      const expiryMonth = card.expiryMonth ?? pm.expiryMonth;
      const expiryYear = card.expiryYear ?? pm.expiryYear;
      const base = {
        id: Number(pm.id),
        brand: card.brand ?? pm.brand ?? null,
        lastDigits: card.lastDigits != null ? String(card.lastDigits) : (pm.lastDigits != null ? String(pm.lastDigits) : null),
        expiryMonth: expiryMonth != null ? Number(expiryMonth) : null,
        expiryYear: expiryYear != null ? Number(expiryYear) : null,
        type: pm.type ?? 'CustomerCreditCard',
      };
      const status = getCardStatus({
        status: pm.status,
        expiryMonth: base.expiryMonth,
        expiryYear: base.expiryYear,
      });
      return { ...base, status };
    });

    // Sort: safe first, then expiring_soon, expired last
    const order: Record<string, number> = { safe: 0, expiring_soon: 1, expired: 2 };
    const sorted = [...mapped].sort(
      (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3)
    );

    console.log('[PAYMENT-METHODS] OK', { customerShopifyId, count: sorted.length });
    return NextResponse.json({ paymentMethods: sorted });
  } catch (err) {
    console.error('[PAYMENT-METHODS] Error', err);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
