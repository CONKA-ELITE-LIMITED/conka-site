/**
 * Shopify orders/paid webhook -> Meta CAPI Purchase.
 *
 * First-party, server-side Purchase event we control. Uses the Shopify order id
 * as the Meta event_id so it deduplicates against the Shopify Facebook channel's
 * Purchase on the same pixel (1138202151698404). Includes hashed email/phone +
 * the _fbp/_fbc carried on the order's note attributes (see SCRUM-1047) for
 * attribution. Only web-checkout orders are sent (see isWebCheckoutOrder), which
 * keeps us in scope with the channel and excludes subscription rebills.
 *
 * Setup required to go live:
 *  - env SHOPIFY_WEBHOOK_SECRET (the webhook's signing secret)
 *  - register an orders/paid webhook in Shopify admin pointing here
 *
 * DEDUP — VERIFY AT GO-LIVE (highest risk): Meta merges our event with the
 * channel's Purchase only if event_name + event_id match. The numeric Shopify
 * order id is the de-facto standard the channel uses, so this is most likely
 * already correct — but the channel's event_id is not publicly documented and
 * its checkout pixel is sandboxed (Pixel Helper / Test Events cannot read it).
 * So verify by EFFECT, not by reading the id: after deploy, place one test order
 * and watch the Purchase in Events Manager. If the Purchase count roughly doubles
 * (browser/server events not deduplicating), the event_id does not match the
 * channel's — change the `eventId` value below and redeploy. One-line fix.
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
  checkout_token?: string | null;
  source_name?: string | null;
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
 * A genuine storefront checkout has a `checkout_token` — the customer went through
 * Shopify's hosted checkout. This holds for our HEADLESS setup too: the checkout is
 * the same Shopify-hosted web checkout regardless of which domain the storefront
 * lives on, so the token is present and domain-independent. Subscription rebills
 * (Loop/Skio/native), POS, and API/manual orders are created from a subscription
 * contract or the Admin API — they never pass through checkout, so they have NO
 * `checkout_token` and are excluded here.
 *
 * The first/initial subscription order IS a real checkout (it has a checkout_token),
 * so it is correctly kept.
 *
 * WHY ONLY checkout_token (not source_name): `source_name` describes the sales
 * surface ("web", "pos", an app handle…) and is NOT tied to our domain. We do NOT
 * gate on `source_name === "web"` because headless Storefront-API flows can report
 * a non-"web" source, which would wrongly drop real orders. `checkout_token` alone
 * is the reliable acquisition signal. (We still LOG source_name below so we can see
 * the real value and tighten later if ever needed.)
 *
 * WHY NOT client_details: the previous check used `client_details` (browser IP /
 * user-agent), assuming rebills have none. That was WRONG — Loop copies the
 * original order's `client_details` onto every renewal, so paid rebills passed the
 * check and were sent to Meta as brand-new Purchases. Result: Meta over-counted
 * purchases (~10 events vs ~2 real orders in a week) and ingested £0.00 rebill
 * values. `checkout_token` is the signal Loop cannot fake. See
 * docs/analytics/HEADLESS_ATTRIBUTION_FIX.md.
 *
 * Verify once live: watch the verification logs below — a real rebill should log
 * "Skipping" and a genuine web order should log "Sending Purchase".
 */
function isWebCheckoutOrder(order: ShopifyOrder): boolean {
  return Boolean(order.checkout_token);
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
    // orders have no checkout_token and are skipped (the channel ignores them too).
    if (!isWebCheckoutOrder(order)) {
      // TEMP verification logging (remove once the fix is confirmed in Events Manager):
      // expect rebills/POS/manual orders to land here with no checkout_token.
      console.log("[Shopify webhook] Skipping non-checkout order (rebill/POS/manual)", {
        orderId: order.id,
        sourceName: order.source_name,
        hasCheckoutToken: Boolean(order.checkout_token),
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

    // TEMP verification logging (remove once the fix is confirmed in Events Manager):
    // expect only genuine web checkouts to reach here.
    console.log("[Shopify webhook] Sending Purchase to Meta CAPI", {
      orderId: order.id,
      sourceName: order.source_name,
      value,
    });

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
        // conka_uid first: the browser carried it on every event this buyer fired
        // before checkout, so it is what lets Meta join those anonymous events to
        // this Purchase. The Shopify customer id follows as a second match key.
        externalId: [
          noteAttr(order, "conka_uid"),
          order.customer?.id != null ? String(order.customer.id) : undefined,
        ].filter((v): v is string => Boolean(v)),
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
