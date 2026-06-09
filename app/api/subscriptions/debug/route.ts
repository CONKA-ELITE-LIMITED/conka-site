import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/app/lib/env';
import { getCustomerSubscriptions } from '@/app/lib/loop';

// Helper to get customer email from ID token cookie
async function getCustomerEmailFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('customer_id_token')?.value;
  
  if (!idToken) return null;
  
  try {
    const payload = JSON.parse(
      Buffer.from(idToken.split('.')[1], 'base64').toString()
    );
    return payload.email || null;
  } catch {
    return null;
  }
}

/**
 * Debug endpoint for Loop API connection
 */
export async function GET(_request: NextRequest) {
  const customerEmail = await getCustomerEmailFromSession();
  
  // Check if Loop API key is configured
  let loopApiConfigured = false;
  let loopApiKeyPreview = null;
  try {
    const apiKey = env.loopApiKey;
    loopApiConfigured = !!apiKey;
    loopApiKeyPreview = apiKey ? `${apiKey.substring(0, 10)}...` : null;
  } catch (_e) {
    loopApiConfigured = false;
  }

  // Test Loop API connection
  let loopApiTest: Record<string, unknown> | null = null;
  if (loopApiConfigured && customerEmail) {
    try {
      const apiKey = env.loopApiKey;
      
      // First test: Get customer by email
      const customerResponse = await fetch(
        `https://api.loopsubscriptions.com/admin/2023-10/customer?email=${encodeURIComponent(customerEmail)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Loop-Token': apiKey!,
          },
        }
      );
      
      const customerText = await customerResponse.text();
      
      loopApiTest = {
        customerLookup: {
          status: customerResponse.status,
          body: customerText.substring(0, 500),
        },
      };

      // If customer found, try to get their subscriptions
      if (customerResponse.ok) {
        try {
          const customerData = JSON.parse(customerText);
          // data is an ARRAY of customers, not a single object!
          const customers = Array.isArray(customerData.data) ? customerData.data : [];
          const customerId = customers[0]?.id;
          
          loopApiTest.customerIdExtracted = customerId;
          
          if (customerId) {
            const subsUrl = `https://api.loopsubscriptions.com/admin/2023-10/subscription?customerId=${customerId}`;
            loopApiTest.subscriptionUrl = subsUrl;
            
            const subsResponse = await fetch(
              subsUrl,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'X-Loop-Token': apiKey!,
                },
              }
            );
            
            const subsText = await subsResponse.text();
            
            loopApiTest.subscriptionLookup = {
              customerId,
              status: subsResponse.status,
              body: subsText.substring(0, 1000),
            };
          }
        } catch (e) {
          loopApiTest.parseError = String(e);
        }
      }
    } catch (e) {
      loopApiTest = { error: String(e) };
    }
  }

  // Also test getting all subscriptions (to see if API works at all)
  let allSubsTest = null;
  if (loopApiConfigured) {
    try {
      const apiKey = env.loopApiKey;
      const response = await fetch(
        `https://api.loopsubscriptions.com/admin/2023-10/subscription?limit=5`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Loop-Token': apiKey!,
          },
        }
      );
      
      const text = await response.text();
      allSubsTest = {
        status: response.status,
        body: text.substring(0, 500),
      };
    } catch (e) {
      allSubsTest = { error: String(e) };
    }
  }

  // Test the actual getCustomerSubscriptions function (same as main route)
  let mainFunctionTest: Record<string, unknown> | null = null;
  if (loopApiConfigured && customerEmail) {
    try {
      const result = await getCustomerSubscriptions(customerEmail);
      
      // Check if subscriptions belong to different customers (security check)
      const customerIds = new Set<string>();
      const customerShopifyIds = new Set<string>();
      (result.data || []).forEach((sub: any) => {
        if (sub.customerId) customerIds.add(String(sub.customerId));
        if (sub.shopifyCustomerId) customerShopifyIds.add(String(sub.shopifyCustomerId));
        if (sub.customer?.id) customerIds.add(String(sub.customer.id));
        if (sub.customer?.shopifyId) customerShopifyIds.add(String(sub.customer.shopifyId));
      });
      
      mainFunctionTest = {
        error: result.error || null,
        subscriptionCount: result.data?.length || 0,
        uniqueCustomerIds: Array.from(customerIds),
        uniqueShopifyCustomerIds: Array.from(customerShopifyIds),
        firstSubRaw: result.data?.[0] ? JSON.stringify(result.data[0]).substring(0, 800) : null,
        securityWarning: customerIds.size > 1 || customerShopifyIds.size > 1 
          ? 'MULTIPLE CUSTOMERS DETECTED - DATA LEAK!' 
          : null,
      };
    } catch (e) {
      mainFunctionTest = { error: String(e) };
    }
  }

  return NextResponse.json({
    config: {
      loopApiConfigured,
      loopApiKeyPreview,
    },
    session: {
      customerEmail,
      isAuthenticated: !!customerEmail,
    },
    loopApiTest,
    allSubscriptionsTest: allSubsTest,
    mainFunctionTest,
  });
}

