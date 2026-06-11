/**
 * POST /api/b2b/invoice-order
 *
 * Pay-by-invoice path for the B2B teams order page (SCRUM-1058). Creates a
 * Shopify draft order via the Admin API and emails the invoice to the club's
 * finance team. The buyer pays the hosted invoice (card or bank transfer) and
 * enters their delivery address there, so we never re-ask for it. Harry marks
 * the order paid in Shopify once payment clears; the Shopify-to-Xero connector
 * books the invoice. Code stops at "draft created + invoice sent".
 *
 * Pricing: B2B is sold ex-VAT (tier price + 20%). The B2B variants are priced at
 * the GROSS entry rate (the amount the club actually pays). Line items carry the
 * variant at that gross base, and an order-level FIXED_AMOUNT discount brings the
 * subtotal down to the exact gross combined-total tier price (GBP 70.80/62.40/54.00
 * per box, from getB2BGrossPerBox). Shopify is configured to collect UK VAT
 * inclusively (20%) (Road B), so it extracts the VAT from that gross at checkout
 * and the Shopify-to-Xero connector mirrors it onto the Xero invoice (net + 20%
 * VAT). The connector does NOT derive VAT itself: it passes through whatever
 * Shopify charged, so this depends on UK VAT collection being enabled in Shopify
 * (SCRUM-1060) - until then Shopify charges 0% and the invoice books at no VAT.
 * Setting the price on the draft order this way means the path needs NO Shopify
 * discount config of its own (unlike the card path, which relies on automatic
 * discounts).
 *
 * Depends on the B2B variants being priced at the GROSS entry rate (GBP 70.80) in
 * Shopify, the same assumption the order-page display makes (net GBP 59 + 20% VAT).
 * This must stay in lockstep with the Shopify variant price: do not deploy a
 * mismatched base. See docs/development/featurePlans/b2b-xero-invoicing.md.
 *
 * See docs/development/featurePlans/b2b-professionals-portal.md
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminGraphql, isAdminApiConfigured } from "@/app/lib/shopifyAdmin";
import { B2B_TIERS, getB2BTier, getB2BGrossPerBox } from "@/app/lib/b2bPricing";
import { B2B_SHIPPING_TITLE, getB2BShippingPrice } from "@/app/lib/b2bShipping";
import { createRateLimiter, getClientIp } from "@/app/lib/rateLimit";
import { B2B_VARIANTS } from "@/app/lib/b2bVariants";

export const runtime = "nodejs";

// This route creates persistent draft orders and emails an invoice to a
// caller-supplied address, so it is a heavier abuse target than the cart route.
// Light per-IP limit as a speed-bump against draft-order spam / email misuse.
const isRateLimited = createRateLimiter({ max: 5, windowMs: 10 * 60 * 1000 });

// Gross (VAT-inclusive) base rate the B2B variants are priced at in Shopify
// (entry tier, GBP 70.80). The order-level discount is the gap between this and
// the gross tier rate, so the draft order total is what the club actually pays.
const B2B_ENTRY_PRICE = getB2BGrossPerBox(B2B_TIERS[0]);

const NOT_AVAILABLE =
  "Pay by invoice is not available yet. Please use the enquiry form or contact harryglover@conka.io.";

const schema = z.object({
  lines: z
    .array(
      z.object({
        product: z.enum(["flow", "clear"]),
        quantity: z.number().int().positive().max(100000),
      }),
    )
    .min(1, "Select at least one product"),
  financeEmail: z.string().trim().email("Enter a valid finance email"),
  // PO is required on the pay-by-invoice path (procurement mandates it; it maps
  // to the Xero invoice Reference). The card path keeps it optional (see cart route).
  poNumber: z.string().trim().min(1, "PO number is required").max(100),
});

interface DraftOrderCreateResponse {
  draftOrderCreate: {
    draftOrder: { id: string; name: string; invoiceUrl: string | null } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

interface DraftOrderInvoiceSendResponse {
  draftOrderInvoiceSend: {
    draftOrder: { id: string; invoiceUrl: string | null } | null;
    userErrors: Array<{ field: string[] | null; message: string }>;
  };
}

const DRAFT_ORDER_CREATE = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DRAFT_ORDER_INVOICE_SEND = `
  mutation draftOrderInvoiceSend($id: ID!) {
    draftOrderInvoiceSend(id: $id) {
      draftOrder {
        id
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

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

  // Fail clearly if the Admin API token is not configured (it is a secret, so it
  // lives in env), rather than creating a broken draft order. The variant GIDs
  // are constants, so they are always present.
  if (!isAdminApiConfigured()) {
    return NextResponse.json({ error: NOT_AVAILABLE }, { status: 503 });
  }

  const lineItems = parsed.lines.map((line) => ({
    variantId: B2B_VARIANTS[line.product],
    quantity: line.quantity,
  }));
  const totalBoxes = parsed.lines.reduce((sum, line) => sum + line.quantity, 0);

  const tier = getB2BTier(totalBoxes);
  const discountAmount =
    Math.round((B2B_ENTRY_PRICE - getB2BGrossPerBox(tier)) * totalBoxes * 100) / 100;

  const customAttributes: Array<{ key: string; value: string }> = [
    { key: "Order Type", value: "B2B Professionals" },
    { key: "Payment Method", value: "Pay by invoice" },
  ];
  const tags = ["B2B Professionals", "Pay by Invoice"];

  const input: Record<string, unknown> = {
    email: parsed.financeEmail,
    lineItems,
    customAttributes,
    tags,
    // Draft orders never pull the Shopify rate table, so freight is applied
    // here from the shared UK band table (see b2bShipping.ts; SCRUM-1079
    // Phase 2). Always attached, even at GBP 0: a blank shipping method can
    // never be routed by Synergy, and the name doubles as the carrier
    // instruction. Orders above ~60 boxes may warrant a manual pallet line
    // instead (playbook: SHIPPING_AND_COURIERS.md section 7).
    shippingLine: {
      title: B2B_SHIPPING_TITLE,
      price: getB2BShippingPrice(totalBoxes).toFixed(2),
    },
  };

  // Surface the PO where the Shopify-to-Xero connector can read it into the Xero
  // invoice Reference field (SCRUM-1059). Connectors map the order `note` or an
  // order `tag`, not custom attributes, so the PO rides in all three: the note
  // (clean single value, the primary Reference carrier), a sanitized tag (commas
  // stripped, since Shopify splits tags on them) as a fallback carrier, and the
  // existing custom attribute (kept, human-readable in admin). Which field the
  // connector actually uses is finalised by the pilot. See b2b-xero-invoicing.md.
  if (parsed.poNumber) {
    customAttributes.push({ key: "PO Number", value: parsed.poNumber });
    // Note carries the PO verbatim, so it maps cleanly to the Xero invoice
    // Reference. The tag is sanitized (commas removed, since Shopify splits tags
    // on them; whitespace collapsed) and labelled for admin filtering.
    input.note = parsed.poNumber;
    tags.push(`PO ${parsed.poNumber.replace(/,/g, " ").replace(/\s+/g, " ").trim()}`);
  }

  // Only attach a discount when the tier actually reduces the price (entry tier
  // is the base rate, so no discount there). A zero FIXED_AMOUNT is rejected.
  if (discountAmount > 0) {
    input.appliedDiscount = {
      valueType: "FIXED_AMOUNT",
      value: discountAmount,
      title: `Team volume pricing (${tier.label})`,
      description: `${totalBoxes} boxes at the ${tier.label} tier rate of GBP ${tier.pricePerBox}/box ex VAT (GBP ${getB2BGrossPerBox(tier)}/box inc VAT).`,
    };
  }

  try {
    const created = await adminGraphql<DraftOrderCreateResponse>(
      DRAFT_ORDER_CREATE,
      { input },
    );

    if (created.errors?.length) {
      console.error("[B2B invoice] draftOrderCreate errors:", created.errors);
      return NextResponse.json(
        { error: "Could not create the invoice. Please try again." },
        { status: 502 },
      );
    }

    const createUserErrors = created.data?.draftOrderCreate?.userErrors;
    if (createUserErrors && createUserErrors.length > 0) {
      console.error("[B2B invoice] draftOrderCreate userErrors:", createUserErrors);
      return NextResponse.json({ error: createUserErrors[0].message }, { status: 400 });
    }

    const draftOrder = created.data?.draftOrderCreate?.draftOrder;
    if (!draftOrder?.id) {
      console.error("[B2B invoice] no draft order returned");
      return NextResponse.json(
        { error: "Could not create the invoice. Please try again." },
        { status: 502 },
      );
    }

    // Email the invoice to the finance address set as the draft order email.
    const sent = await adminGraphql<DraftOrderInvoiceSendResponse>(
      DRAFT_ORDER_INVOICE_SEND,
      { id: draftOrder.id },
    );

    const sendUserErrors = sent.data?.draftOrderInvoiceSend?.userErrors;
    if (sent.errors?.length || (sendUserErrors && sendUserErrors.length > 0)) {
      // The draft order exists; only the email failed. Surface a partial success
      // so the buyer knows their order is captured and Harry can resend.
      console.error(
        "[B2B invoice] draftOrderInvoiceSend errors:",
        sent.errors ?? sendUserErrors,
      );
      return NextResponse.json(
        {
          error:
            "Your order was created but we could not email the invoice automatically. We'll follow up shortly.",
          draftOrderName: draftOrder.name,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      draftOrderName: draftOrder.name,
    });
  } catch (error) {
    console.error("[B2B invoice] create error:", error);
    return NextResponse.json(
      { error: "Could not create the invoice. Please try again." },
      { status: 500 },
    );
  }
}
