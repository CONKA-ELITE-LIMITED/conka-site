import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;

/**
 * Revolut webhook signature verification.
 *
 * Payload to sign: "v1.{timestamp}.{rawBody}"
 * Header format:   "v1={hex}" — may be comma-separated if multiple keys are active
 *
 * https://developer.revolut.com/docs/guides/accept-payments/tutorials/work-with-webhooks/verify-the-payload-signature
 */
function verifyRevolutSignature(
  rawBody: string,
  timestamp: string,
  signatureHeader: string,
  secret: string
): boolean {
  const payloadToSign = `v1.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secret).update(payloadToSign).digest("hex");

  const sigs = signatureHeader.split(",").map((s) => s.trim());
  for (const sig of sigs) {
    if (!sig.startsWith("v1=")) continue;
    const hex = sig.slice(3);
    try {
      if (timingSafeEqual(Buffer.from(hex, "hex"), Buffer.from(expected, "hex"))) {
        return true;
      }
    } catch {
      // Buffer.from throws on invalid hex — skip this entry
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.REVOLUT_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Revolut webhook] REVOLUT_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  const timestamp = request.headers.get("revolut-request-timestamp") ?? "";
  const signatureHeader = request.headers.get("revolut-signature") ?? "";

  // Reject replayed requests — timestamp must be within 5 minutes
  const timestampMs = parseInt(timestamp, 10);
  if (isNaN(timestampMs) || Math.abs(Date.now() - timestampMs) > TIMESTAMP_TOLERANCE_MS) {
    console.warn("[Revolut webhook] Timestamp missing or outside 5-minute tolerance");
    return NextResponse.json({ error: "Invalid timestamp" }, { status: 401 });
  }

  if (!verifyRevolutSignature(rawBody, timestamp, signatureHeader, webhookSecret)) {
    console.warn("[Revolut webhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ORDER_COMPLETED payload is flat — order_id and merchant_order_ext_ref are top-level fields
  const eventType = event.event as string;

  switch (eventType) {
    case "ORDER_COMPLETED": {
      const orderId = event.order_id as string;
      const extRef = event.merchant_order_ext_ref as string;
      console.log("[Revolut webhook] ORDER_COMPLETED", { orderId, extRef });

      // TODO: Award Conka points to the customer identified by extRef.
      // extRef format: "{customerId}|{timestamp}" for authenticated users,
      // or "guest|{timestamp}" for unauthenticated purchases.
      // Extract customerId: const customerId = extRef.split("|")[0]
      //
      // IMPORTANT: implement idempotency via Convex before awarding points —
      // check whether orderId has already been processed to prevent double-awarding
      // if Revolut retries the webhook.
      break;
    }

    case "ORDER_CANCELLED":
      console.log("[Revolut webhook] ORDER_CANCELLED", { orderId: event.order_id });
      break;

    case "ORDER_PAYMENT_DECLINED":
      console.log("[Revolut webhook] ORDER_PAYMENT_DECLINED", {
        orderId: event.order_id,
        reason: event.decline_reason,
      });
      break;

    case "ORDER_PAYMENT_FAILED":
      console.log("[Revolut webhook] ORDER_PAYMENT_FAILED", { orderId: event.order_id });
      break;

    default:
      // Unknown event — log and ignore. Always return 200 so Revolut doesn't retry.
      console.log("[Revolut webhook] Unhandled event type:", eventType);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
