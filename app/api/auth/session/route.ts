import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface CustomerResponse {
  data?: {
    customer?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      displayName: string;
      emailAddress?: {
        emailAddress: string;
      };
      phoneNumber?: {
        phoneNumber: string;
      };
      defaultAddress?: {
        address1: string | null;
        address2: string | null;
        city: string | null;
        province: string | null;
        zoneCode: string | null;
        zip: string | null;
        country: string | null;
        territoryCode: string | null;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

const CUSTOMER_QUERY = `
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
      defaultAddress {
        address1
        address2
        city
        province
        zoneCode
        zip
        country
        territoryCode
      }
    }
  }
`;

/**
 * Session Endpoint
 * 
 * Returns the current customer session info from the Customer Account API.
 * Used by the client to check authentication status and get customer details.
 * In development, when DEV_MOCK_AUTH=true and dev_mock_auth cookie is set, returns a mock customer.
 */
export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const isDev = process.env.NODE_ENV === 'development';
  const mockAuthEnabled = process.env.DEV_MOCK_AUTH === 'true';
  const mockCookie = cookieStore.get('dev_mock_auth')?.value;

  if (isDev && mockAuthEnabled && mockCookie === '1') {
    return NextResponse.json({
      authenticated: true,
      customer: {
        id: 'dev-mock',
        email: 'dev@localhost',
        firstName: 'Dev',
        lastName: 'User',
        displayName: 'Dev User',
        phone: '',
        defaultAddress: null,
      },
      expiresAt: null,
    });
  }

  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
  const accessToken = cookieStore.get('customer_access_token')?.value;
  const idToken = cookieStore.get('customer_id_token')?.value;
  const expiresAt = cookieStore.get('customer_token_expires')?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false, customer: null });
  }

  // Check if token is expired
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return NextResponse.json({ authenticated: false, customer: null, expired: true });
  }

  // Get basic email from ID token as fallback
  let email = '';
  if (idToken) {
    try {
      const payload = JSON.parse(
        Buffer.from(idToken.split('.')[1], 'base64').toString()
      );
      email = payload.email || '';
    } catch (_e) {
      // Ignore decode errors
    }
  }

  // Fetch full customer profile from Customer Account API
  if (shopId && accessToken) {
    try {
      const apiUrl = `https://shopify.com/${shopId}/account/customer/api/2024-10/graphql`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        body: JSON.stringify({ query: CUSTOMER_QUERY }),
      });

      if (response.ok) {
        const data: CustomerResponse = await response.json();
        const customer = data.data?.customer;

        if (customer) {
          return NextResponse.json({
            authenticated: true,
            customer: {
              id: customer.id,
              email: customer.emailAddress?.emailAddress || email,
              firstName: customer.firstName || '',
              lastName: customer.lastName || '',
              displayName: customer.displayName || '',
              phone: customer.phoneNumber?.phoneNumber || '',
              defaultAddress: customer.defaultAddress || null,
            },
            expiresAt,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch customer profile:', error);
    }
  }

  // Fallback to basic info from ID token if API call fails
  return NextResponse.json({
    authenticated: true,
    customer: {
      id: '',
      email,
      firstName: '',
      lastName: '',
      displayName: '',
    },
    expiresAt,
  });
}
