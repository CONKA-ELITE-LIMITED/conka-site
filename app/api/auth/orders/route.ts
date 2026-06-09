import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

interface Fulfillment {
  status: string;
}

interface OrderLineItem {
  name: string;
  quantity: number;
  image?: {
    url: string;
    altText?: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
}

interface ShippingAddress {
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
}

interface Order {
  id: string;
  number: number;
  name: string;
  processedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
  fulfillments: {
    nodes: Fulfillment[];
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotal: {
    amount: string;
    currencyCode: string;
  };
  totalShipping: {
    amount: string;
    currencyCode: string;
  };
  totalTax?: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    nodes: OrderLineItem[];
  };
  financialStatus: string;
  shippingAddress?: ShippingAddress;
}

interface CustomerOrdersResponse {
  data?: {
    customer?: {
      orders?: {
        nodes: Order[];
      };
    };
  };
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
}

// Customer Account API uses different field names than Storefront API
const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders {
    customer {
      orders(first: 50, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          number
          name
          processedAt
          cancelledAt
          cancelReason
          totalPrice {
            amount
            currencyCode
          }
          subtotal {
            amount
            currencyCode
          }
          totalShipping {
            amount
            currencyCode
          }
          totalTax {
            amount
            currencyCode
          }
          financialStatus
          shippingAddress {
            address1
            address2
            city
            province
            country
            zip
          }
          fulfillments(first: 1) {
            nodes {
              status
            }
          }
          lineItems(first: 10) {
            nodes {
              name
              quantity
              totalPrice {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch customer orders using the Customer Account API
 */
export async function GET(_request: NextRequest) {
  const shopId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;

  if (!shopId) {
    console.error(
      "Orders API: SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID not configured",
    );
    return NextResponse.json(
      { error: "Customer Account API not configured", orders: [] },
      { status: 200 },
    );
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value;
  const mockCookie = cookieStore.get("dev_mock_auth")?.value;
  const isDev = process.env.NODE_ENV === "development";
  const mockAuthEnabled = process.env.DEV_MOCK_AUTH === "true";

  if (isDev && mockAuthEnabled && mockCookie === "1") {
    return NextResponse.json({ orders: [] });
  }

  if (!accessToken) {
    console.error("Orders API: No access token in cookies");
    return NextResponse.json(
      { error: "Not authenticated", orders: [] },
      { status: 401 },
    );
  }

  try {
    // Customer Account API endpoint
    const apiUrl = `https://shopify.com/${shopId}/account/customer/api/2024-10/graphql`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({
        query: CUSTOMER_ORDERS_QUERY,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Orders API: HTTP error",
        response.status,
        responseText.substring(0, 500),
      );
      return NextResponse.json(
        { error: `API error: ${response.status}`, orders: [] },
        { status: response.status },
      );
    }

    let data: CustomerOrdersResponse;
    try {
      data = JSON.parse(responseText);
    } catch (_e) {
      console.error("Orders API: Failed to parse JSON");
      return NextResponse.json(
        { error: "Invalid response from Shopify", orders: [] },
        { status: 500 },
      );
    }

    if (data.errors && data.errors.length > 0) {
      console.error(
        "Orders API: GraphQL errors:",
        JSON.stringify(data.errors, null, 2),
      );
      return NextResponse.json(
        {
          error: data.errors[0].message,
          orders: [],
          graphqlErrors: data.errors,
        },
        { status: 400 },
      );
    }

    const orders = data.data?.customer?.orders?.nodes || [];

    // Transform orders to match frontend expectations
    const transformedOrders = orders.map((order) => {
      // Get fulfillment status from first fulfillment
      const fulfillments = order.fulfillments?.nodes || [];
      const fulfillmentStatus = fulfillments[0]?.status || "UNFULFILLED";

      return {
        id: order.id,
        orderNumber: String(order.number),
        orderName: order.name,
        processedAt: order.processedAt,
        cancelledAt: order.cancelledAt,
        cancelReason: order.cancelReason,
        fulfillmentStatus: fulfillmentStatus,
        financialStatus: order.financialStatus || "PENDING",
        totalPrice: order.totalPrice,
        subtotal: order.subtotal,
        totalShipping: order.totalShipping,
        totalTax: order.totalTax,
        shippingAddress: order.shippingAddress
          ? {
              address1: order.shippingAddress.address1,
              address2: order.shippingAddress.address2,
              city: order.shippingAddress.city,
              province: order.shippingAddress.province,
              country: order.shippingAddress.country,
              zip: order.shippingAddress.zip,
            }
          : null,
        lineItems:
          order.lineItems?.nodes?.map((item) => ({
            title: item.name,
            quantity: item.quantity,
            image: item.image,
            price: item.totalPrice,
          })) || [],
      };
    });

    return NextResponse.json({ orders: transformedOrders });
  } catch (error) {
    console.error("Orders API: Caught error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", orders: [] },
      { status: 500 },
    );
  }
}
