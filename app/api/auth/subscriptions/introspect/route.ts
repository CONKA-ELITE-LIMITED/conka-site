import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SHOPIFY_SHOP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;

// Introspect available mutations in the Customer Account API
const MUTATION_INTROSPECTION_QUERY = `
  query IntrospectMutations {
    __schema {
      mutationType {
        fields {
          name
          description
          args {
            name
            type {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  }
`;

// Introspect specific subscription-related types
const SUBSCRIPTION_TYPES_QUERY = `
  query IntrospectSubscriptionTypes {
    subscriptionContract: __type(name: "SubscriptionContract") {
      name
      fields {
        name
        type { name kind }
      }
    }
    billingCycle: __type(name: "SubscriptionBillingCycle") {
      name
      fields {
        name
        type { name kind }
      }
    }
    billingCycleInput: __type(name: "SubscriptionBillingCycleInput") {
      name
      inputFields {
        name
        type { name kind ofType { name kind } }
      }
    }
  }
`;

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('customer_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  if (!SHOPIFY_SHOP_ID) {
    return NextResponse.json(
      { error: 'Shop ID not configured' },
      { status: 500 }
    );
  }

  const apiUrl = `https://shopify.com/${SHOPIFY_SHOP_ID}/account/customer/api/2024-10/graphql`;

  try {
    // Get all available mutations
    const mutationsResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ query: MUTATION_INTROSPECTION_QUERY }),
    });
    
    const mutationsData = await mutationsResponse.json();
    
    // Filter for subscription-related mutations
    const allMutations = mutationsData.data?.__schema?.mutationType?.fields || [];
    const subscriptionMutations = allMutations.filter((m: any) => 
      m.name.toLowerCase().includes('subscription') ||
      m.name.toLowerCase().includes('billing')
    );

    // Get subscription-related types
    const typesResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({ query: SUBSCRIPTION_TYPES_QUERY }),
    });
    
    const typesData = await typesResponse.json();

    return NextResponse.json({
      subscriptionMutations: subscriptionMutations.map((m: any) => ({
        name: m.name,
        description: m.description,
        args: m.args?.map((a: any) => ({
          name: a.name,
          type: a.type?.name || a.type?.ofType?.name,
        })),
      })),
      allMutationNames: allMutations.map((m: any) => m.name),
      types: typesData.data,
    });
  } catch (error) {
    console.error('Introspection error:', error);
    return NextResponse.json(
      { error: 'Failed to introspect schema', details: String(error) },
      { status: 500 }
    );
  }
}

