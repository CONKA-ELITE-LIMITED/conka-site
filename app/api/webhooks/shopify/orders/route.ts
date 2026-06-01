/**
 * Shopify orders/paid webhook -> Meta CAPI Purchase.
 *
 * First-party, server-side Purchase event we control. Uses the Shopify order id
 * as the Meta event_id so it deduplicates against the Shopify Facebook channel's
 * Purchase on the same pixel (1138202151698404). Includes hashed email/phone +
 * the _fbp/_fbc carried on the order's note attributes (see SCRUM-1047) for
 * attribution. Subscription rebills are filtered so they are not counted as new
 * acquisitions.
 *
 * Setup required to go live:
 *  - env SHOPIFY_WEBHOOK_SECRET (the webhook's signing secret)
 *  - register an orders/paid webhook in Shopify admin pointing here
 */
import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { sendPurchaseToCapi } from "@/app/lib/metaCapi";

export const runtime = "nodejs";

/** Verify Shopify webhook HMAC: base64(HMAC-SHA256(rawBody, secret)) === X-Shopify-Hmac-Sha256. */
function verifyShopifyHmac(rawBody: string, hmacHeader: string, secret: string): boolean {
  if (!hmacHeader) return false;
  const generated = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    const a = Buffer.from(generated);
    const b = Buffer.from(hmacHeader);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

interface NoteAttribute {
  name: string;
  value: string;
}

interface ShopifyAddress {
  city?: string | null;
  province_code?: string | null;
  zip?: string | null;
  country_code?: string | null;
  phone?: string | null;
}

interface ShopifyOrder {
  id?: number;
  email?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  total_price?: string | null;
  currency?: string | null;
  created_at?: string | null;
  note_attributes?: NoteAttribute[];
  line_items?: Array<{ variant_id?: number | null; quantity?: number | null }>;
  customer?: {
    id?: number | null;
    email?: string | null;
    phone?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  shipping_address?: ShopifyAddress | null;
  billing_address?: ShopifyAddress | null;
  client_details?: { browser_ip?: string | null; user_agent?: string | null } | null;
}

/**
 * Only orders that came through the web checkout are sent as Purchase events.
 *
 * Real storefront checkouts carry browser context (`client_details`). Subscription
 * rebills (Loop/Skio/native), POS, and API/manual orders are created server-side
 * and have no `client_details`, so they are excluded automatically without
 * hardcoding any app-specific tag/source markers. This mirrors the Shopify
 * Facebook channel, which also only fires Purchase on web checkouts — so our
 * server events stay in scope with the channel's, deduped by order id.
 *
 * The first/initial subscription order IS a real checkout, so it is correctly kept.
 *
 * Verify once live: confirm a real rebill is skipped and a first subscription
 * order is kept (check the Shopify order's `client_details` if unsure).
 */
function isWebCheckoutOrder(order: ShopifyOrder): boolean {
  const cd = order.client_details;
  return Boolean(cd && (cd.browser_ip || cd.user_agent));
}

function noteAttr(order: ShopifyOrder, name: string): string | undefined {
  return order.note_attributes?.find((a) => a.name === name)?.value || undefined;
}

export async function POST(request: NextRequest) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Shopify webhook] SHOPIFY_WEBHOOK_SECRET is not configured");
    // 200 so Shopify does not retry against an unconfigured endpoint.
    return NextResponse.json({ ok: true, skipped: "no_config" }, { status: 200 });
  }

  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256") ?? "";
  if (!verifyShopifyHmac(rawBody, hmacHeader, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Defense-in-depth: only process orders/paid, even though that is the only
  // topic registered for this endpoint.
  const topic = request.headers.get("x-shopify-topic");
  if (topic && topic !== "orders/paid") {
    return NextResponse.json({ ok: true, skipped: "wrong_topic" }, { status: 200 });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    // Only web-checkout orders are acquisitions. Rebills, POS, and API/manual
    // orders have no browser context and are skipped (the channel ignores them too).
    if (!isWebCheckoutOrder(order)) {
      console.log("[Shopify webhook] Skipping non-checkout order (rebill/POS/manual)", {
        orderId: order.id,
      });
      return NextResponse.json({ ok: true, skipped: "non_checkout" }, { status: 200 });
    }

    const value = parseFloat(order.total_price ?? "");
    if (!order.id || isNaN(value)) {
      // Malformed/incomplete order — acknowledge to avoid retries, send nothing.
      return NextResponse.json({ ok: true, skipped: "invalid_order" }, { status: 200 });
    }

    const addr = order.shipping_address ?? order.billing_address ?? null;
    const parsedTime = order.created_at ? Math.floor(Date.parse(order.created_at) / 1000) : NaN;
    const eventTime = isNaN(parsedTime) ? Math.floor(Date.now() / 1000) : parsedTime;

    await sendPurchaseToCapi({
      eventId: String(order.id), // dedupes against the Shopify FB channel Purchase
      eventTime,
      value,
      currency: order.currency ?? "GBP",
      contentIds: order.line_items
        ?.map((li) => (li.variant_id != null ? String(li.variant_id) : ""))
        .filter(Boolean),
      numItems: order.line_items?.reduce((n, li) => n + (li.quantity ?? 0), 0),
      eventSourceUrl: "https://www.conka.io",
      user: {
        email: order.email ?? order.contact_email ?? order.customer?.email,
        phone: order.phone ?? order.customer?.phone ?? addr?.phone,
        firstName: order.customer?.first_name,
        lastName: order.customer?.last_name,
        city: addr?.city,
        state: addr?.province_code,
        zip: addr?.zip,
        country: addr?.country_code,
        externalId: order.customer?.id != null ? String(order.customer.id) : undefined,
        fbp: noteAttr(order, "_fbp"),
        fbc: noteAttr(order, "_fbc"),
        clientIpAddress: order.client_details?.browser_ip,
        clientUserAgent: order.client_details?.user_agent,
      },
    });
  } catch (err) {
    // Acknowledge so Shopify does not retry our own bug; Meta event_id dedup
    // makes a future re-send safe if the issue is fixed.
    console.error("[Shopify webhook] Failed to process order", order?.id, err);
  }

  // Always 200. Idempotency is Meta-side via the shared event_id (order id), so a
  // Shopify retry that re-sends the same event is deduplicated by Meta.
  return NextResponse.json({ ok: true }, { status: 200 });
}
