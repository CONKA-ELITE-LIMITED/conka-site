import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Sandbox: https://sandbox-merchant.revolut.com/api
// Production: https://merchant.revolut.com/api
const REVOLUT_API_BASE = "https://merchant.revolut.com/api";
const REVOLUT_API_VERSION = "2025-12-04";

const createOrderSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().length(3).default("GBP"),
  customerId: z.string().optional(),
});

interface RevolutOrderResponse {
  id: string;
  checkout_url: string;
  state: string;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.REVOLUT_SECRET_KEY;
  if (!secretKey) {
    console.error("[Revolut] REVOLUT_SECRET_KEY is not configured");
    return NextResponse.json({ error: "Payment service not configured" }, { status: 500 });
  }

  let parsed: z.infer<typeof createOrderSchema>;
  try {
    const body = await request.json();
    const result = createOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }
    parsed = result.data;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, currency, customerId } = parsed;

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    null;

  if (!origin) {
    console.error("[Revolut] Cannot determine site origin for redirect URLs");
    return NextResponse.json({ error: "Payment service misconfigured" }, { status: 500 });
  }

  // "|" separator is safe to split on even when customerId is a Shopify GID
  // (e.g. "gid://shopify/Customer/123") since GIDs never contain "|"
  const extRef = customerId ? `${customerId}|${Date.now()}` : `guest|${Date.now()}`;

  try {
    const res = await fetch(`${REVOLUT_API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
        "Revolut-Api-Version": REVOLUT_API_VERSION,
      },
      body: JSON.stringify({
        amount,
        currency,
        merchant_order_ext_ref: extRef,
        success_redirect_url: `${origin}/payment/success`,
        cancel_redirect_url: `${origin}/payment/cancel`,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[Revolut] Order creation failed", res.status, data);
      return NextResponse.json({ error: "Failed to create payment order" }, { status: 502 });
    }

    const order = data as RevolutOrderResponse;
    if (!order.checkout_url) {
      console.error("[Revolut] No checkout_url in response", data);
      return NextResponse.json({ error: "Failed to create payment order" }, { status: 502 });
    }

    return NextResponse.json({ checkout_url: order.checkout_url, order_id: order.id });
  } catch (err) {
    console.error("[Revolut] Network error creating order", err);
    return NextResponse.json({ error: "Failed to reach payment service" }, { status: 502 });
  }
}
