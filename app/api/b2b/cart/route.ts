/**
 * POST /api/b2b/cart
 *
 * Builds a fresh Shopify cart for a B2B teams order and returns its
 * checkoutUrl. Kept separate from the DTC cart (/api/cart + CartContext) so a
 * B2B order never mixes with a shopper's persisted cart, supports multiple
 * lines (Flow + Clear) in one order, and keeps the B2B variant GIDs server-side.
 *
 * Tier pricing is applied by Shopify's automatic quantity-break discounts on the
 * B2B products (SCRUM-1056), so we only send variant + quantity here. The PO
 * number rides as a cart attribute and carries through to the order + invoice.
 *
 * See docs/development/featurePlans/b2b-professionals-portal.md
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { shopifyFetch, type Cart } from "@/app/lib/shopify";
import { CREATE_CART } from "@/app/lib/shopifyQueries";
import { createRateLimiter, getClientIp } from "@/app/lib/rateLimit";

export const runtime = "nodejs";

// Lighter touch than the invoice route (this only creates a cart, no email or
// persistent draft order), but throttled to match its siblings and blunt
// cartCreate spam. A legit buyer rebuilds their cart only a handful of times.
const isRateLimited = createRateLimiter({ max: 10, windowMs: 10 * 60 * 1000 });

// Server-side B2B variant GIDs. Populated once the B2B products exist
// (SCRUM-1056). Not exposed to the client.
const B2B_VARIANTS: Record<"flow" | "clear", string | undefined> = {
  flow: process.env.B2B_FLOW_VARIANT_ID,
  clear: process.env.B2B_CLEAR_VARIANT_ID,
};

const schema = z.object({
  lines: z
    .array(
      z.object({
        product: z.enum(["flow", "clear"]),
        quantity: z.number().int().positive().max(100000),
      }),
    )
    .min(1, "Select at least one product"),
  poNumber: z.string().trim().max(100).optional().or(z.literal("")),
});

interface CartCreateResponse {
  cartCreate: {
    cart: Cart | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

export async function POST(request: NextRequest) {
  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let parsed: z.infer<typeof schema>;
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }
    parsed = result.data;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Resolve variant GIDs. If the B2B products are not configured yet, fail
  // clearly rather than creating a broken cart.
  const lines: Array<{ merchandiseId: string; quantity: number }> = [];
  for (const line of parsed.lines) {
    const variantId = B2B_VARIANTS[line.product];
    if (!variantId) {
      return NextResponse.json(
        {
          error:
            "B2B checkout is not available yet. Please use the enquiry form or contact harryglover@conka.io.",
        },
        { status: 503 },
      );
    }
    lines.push({ merchandiseId: variantId, quantity: line.quantity });
  }

  const attributes: Array<{ key: string; value: string }> = [
    { key: "Order Type", value: "B2B Professionals" },
  ];
  if (parsed.poNumber) {
    attributes.push({ key: "PO Number", value: parsed.poNumber });
  }

  try {
    const res = await shopifyFetch<CartCreateResponse>(CREATE_CART, {
      input: { lines, attributes },
    });

    const userErrors = res.data?.cartCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error("[B2B cart] userErrors:", userErrors);
      return NextResponse.json({ error: userErrors[0].message }, { status: 400 });
    }

    const checkoutUrl = res.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      console.error("[B2B cart] no checkoutUrl returned");
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("[B2B cart] create error:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
