import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Debug endpoint to test subscription operations
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customer_access_token')?.value;
    const idToken = cookieStore.get('customer_id_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        hasAccessToken: false,
        hasIdToken: !!idToken
      }, { status: 401 });
    }

    const body = await request.json();
    const { operation, subscriptionId, variables } = body;

    const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
    const apiUrl = `https://shopify.com/${shopId}/account/customer/api/2024-07/graphql`;

    const results: Record<string, any> = {
      config: {
        shopId: shopId?.substring(0, 5) + '...',
        apiUrl,
        subscriptionId,
        operation,
        variables
      },
      accessTokenPreview: accessToken.substring(0, 20) + '...',
    };

    // First, let's fetch the subscription to see its current state
    const FETCH_SUBSCRIPTION_QUERY = `
      query GetSubscription($id: ID!) {
        customer {
          subscriptionContract(id: $id) {
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
            lines(first: 5) {
              nodes {
                id
                name
                title
                quantity
                currentPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    // Fetch current subscription state
    const fetchResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        query: FETCH_SUBSCRIPTION_QUERY,
        variables: { id: subscriptionId }
      }),
    });

    const fetchData = await fetchResponse.json();
    results.currentSubscription = {
      status: fetchResponse.status,
      data: fetchData
    };

    // Now test the specific operation
    let mutationQuery = '';
    let mutationVariables: Record<string, any> = {};

    if (operation === 'pause') {
      mutationQuery = `
        mutation subscriptionContractPause($subscriptionContractId: ID!) {
          subscriptionContractPause(subscriptionContractId: $subscriptionContractId) {
            contract {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      mutationVariables = { subscriptionContractId: subscriptionId };
    } else if (operation === 'resume') {
      mutationQuery = `
        mutation subscriptionContractActivate($subscriptionContractId: ID!) {
          subscriptionContractActivate(subscriptionContractId: $subscriptionContractId) {
            contract {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      mutationVariables = { subscriptionContractId: subscriptionId };
    } else if (operation === 'skip') {
      mutationQuery = `
        mutation subscriptionBillingCycleSkip($subscriptionContractId: ID!, $cycleIndex: Int!) {
          subscriptionBillingCycleSkip(
            billingCycleInput: {
              subscriptionContractId: $subscriptionContractId,
              selector: { cycleIndex: $cycleIndex }
            }
          ) {
            billingCycle {
              cycleIndex
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      mutationVariables = { 
        subscriptionContractId: subscriptionId,
        cycleIndex: variables?.cycleIndex || 1
      };
    } else if (operation === 'cancel') {
      mutationQuery = `
        mutation subscriptionContractCancel($subscriptionContractId: ID!) {
          subscriptionContractCancel(subscriptionContractId: $subscriptionContractId) {
            contract {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      mutationVariables = { subscriptionContractId: subscriptionId };
    } else if (operation === 'introspect-mutations') {
      // Introspect available mutations
      mutationQuery = `
        query IntrospectionQuery {
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
      mutationVariables = {};
    } else if (operation === 'introspect-subscription-contract') {
      // Introspect SubscriptionContract type
      mutationQuery = `
        query IntrospectionQuery {
          __type(name: "SubscriptionContract") {
            name
            fields {
              name
              type {
                name
                kind
              }
            }
          }
        }
      `;
      mutationVariables = {};
    }

    if (mutationQuery) {
      const mutationResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        body: JSON.stringify({
          query: mutationQuery,
          variables: mutationVariables
        }),
      });

      const mutationData = await mutationResponse.json();
      results.mutationResult = {
        status: mutationResponse.status,
        query: mutationQuery.trim().substring(0, 200) + '...',
        variables: mutationVariables,
        response: mutationData
      };

      // If introspecting mutations, filter to subscription-related ones
      if (operation === 'introspect-mutations' && mutationData.data?.__schema?.mutationType?.fields) {
        const subscriptionMutations = mutationData.data.__schema.mutationType.fields
          .filter((f: any) => f.name.toLowerCase().includes('subscription'))
          .map((f: any) => ({
            name: f.name,
            description: f.description,
            args: f.args.map((a: any) => ({
              name: a.name,
              type: a.type.name || a.type.ofType?.name || a.type.kind
            }))
          }));
        results.subscriptionMutations = subscriptionMutations;
      }
    }

    // Fetch subscription again after mutation to see if it changed
    if (operation !== 'introspect-mutations' && operation !== 'introspect-subscription-contract') {
      const postMutationResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        body: JSON.stringify({
          query: FETCH_SUBSCRIPTION_QUERY,
          variables: { id: subscriptionId }
        }),
      });

      const postMutationData = await postMutationResponse.json();
      results.subscriptionAfterMutation = {
        status: postMutationResponse.status,
        data: postMutationData
      };
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Debug operations error:', error);
    return NextResponse.json({ 
      error: 'Debug operations failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to list available operations and fetch subscription info
export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('customer_access_token')?.value;
  
  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
  const apiUrl = `https://shopify.com/${shopId}/account/customer/api/2024-07/graphql`;

  const results: Record<string, any> = {
    availableOperations: ['pause', 'resume', 'skip', 'cancel', 'introspect-mutations', 'introspect-subscription-contract'],
    usage: 'POST with body: { "operation": "<op>", "subscriptionId": "gid://...", "variables": {} }'
  };

  // Fetch all subscriptions
  const FETCH_ALL_SUBSCRIPTIONS = `
    query CustomerSubscriptions {
      customer {
        subscriptionContracts(first: 10) {
          nodes {
            id
            status
            nextBillingDate
            billingPolicy {
              interval
              intervalCount {
                count
              }
            }
            lines(first: 3) {
              nodes {
                id
                title
                quantity
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken,
    },
    body: JSON.stringify({
      query: FETCH_ALL_SUBSCRIPTIONS
    }),
  });

  const data = await response.json();
  results.subscriptions = data;

  return NextResponse.json(results);
}

