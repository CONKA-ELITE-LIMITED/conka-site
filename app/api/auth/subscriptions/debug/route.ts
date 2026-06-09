/**
 * Debug endpoint to check what Loop API returns for a subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/app/lib/env';

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('customer_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const loopToken = env.loopApiKey;
  if (!loopToken) {
    return NextResponse.json({ error: 'Loop API key not configured' }, { status: 500 });
  }

  // First get the subscription ID from Shopify
  const shopifyQuery = `
    query {
      customer {
        subscriptionContracts(first: 10) {
          nodes {
            id
            status
            lines(first: 5) {
              nodes {
                id
                title
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    // Step 1: Get subscription IDs from Shopify
    const shopifyResponse = await fetch(env.customerAccountApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ query: shopifyQuery }),
    });

    const shopifyResult = await shopifyResponse.json();
    const shopifySubscriptions = shopifyResult.data?.customer?.subscriptionContracts?.nodes || [];

    // Step 2: For each subscription, fetch from Loop and compare
    const comparisons = await Promise.all(
      shopifySubscriptions.map(async (sub: any) => {
        const shopifyNumericId = sub.id.split('/').pop();
        const loopId = `shopify-${shopifyNumericId}`;
        
        // Fetch from Loop
        let loopData = null;
        let loopError = null;
        
        try {
          const loopResponse = await fetch(
            `https://api.loopsubscriptions.com/admin/2023-10/subscription/${loopId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Loop-Token': loopToken,
              },
            }
          );
          
          const loopResponseText = await loopResponse.text();
          
          if (!loopResponse.ok) {
            loopError = {
              status: loopResponse.status,
              body: loopResponseText.substring(0, 500),
            };
          } else {
            try {
              loopData = JSON.parse(loopResponseText);
            } catch {
              loopError = { parseError: true, body: loopResponseText.substring(0, 500) };
            }
          }
        } catch (e) {
          loopError = { fetchError: String(e) };
        }

        // Extract key fields for comparison
        const loopProduct = loopData?.data?.lines?.[0] || {};
        
        return {
          subscriptionId: shopifyNumericId,
          shopify: {
            id: sub.id,
            status: sub.status,
            firstLineTitle: sub.lines?.nodes?.[0]?.title || sub.lines?.nodes?.[0]?.name,
          },
          loop: loopError ? { error: loopError } : {
            id: loopData?.data?.id,
            status: loopData?.data?.status,
            productTitle: loopProduct.productTitle,
            variantTitle: loopProduct.variantTitle,
            price: loopProduct.price,
            // Include raw line data for debugging
            rawLine: loopProduct,
          },
          loopRawResponse: loopData ? JSON.stringify(loopData).substring(0, 1000) : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      subscriptionCount: shopifySubscriptions.length,
      comparisons,
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      details: String(error),
    }, { status: 500 });
  }
}
