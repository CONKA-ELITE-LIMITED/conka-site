# B2B Teams Ordering Portal (`/professionals`)

One-time bulk purchase portal for UK sports clubs and performance organisations. Public enquiry form, unlisted tiered-pricing page, two payment paths (card now / pay by invoice), both shipping only after confirmed payment. Reuses Shopify for order, payment, and fulfilment, and the Shopify-to-Xero connector for invoicing. No custom checkout, no payment processor, no bespoke Xero build.

## Problem

UK sports clubs and performance orgs want to buy CONKA in bulk, but there is no friction-free route. Today they would be stuck at consumer prices with no bulk tiers, no PO, and no proper VAT invoice. This is a new, high-AOV B2B channel.

- **Who it serves:** Procurement and performance staff at clubs. Warm, sales-led traffic, not cold paid.
- **Business impact:** New revenue channel with high order values (a 50+ box order is roughly GBP 2,250 ex VAT). Removes manual order-taking by self-serving both the order and the invoice.

## Appetite

Roughly 1 to 1.5 weeks. Lean in the sense that we build almost no commerce plumbing: Shopify and Xero handle everything that touches money, fulfilment, and invoicing.

## Design system

brand-base (new tokens). These are net-new pages.

## Confirmed flow

1. Public `/professionals` page (sport positioning, social proof, no pricing). One CTA: apply for team pricing.
2. Enquiry form. On submit: applicant is emailed the link to the order page, Harry is notified, applicant is added to a Klaviyo B2B list. No database.
3. Unlisted `/professionals/order` page (noindex, not in nav, permanent shared link). Two equal Flow and Clear cards, quantity steppers, per-box price auto-tiers across GBP 59 / 52 / 45 ex VAT.
4. Two payment paths, both available, both ship only after payment:
   - **Buy now:** Shopify checkout (card). PO captured as an order note. Compliant VAT invoice produced automatically via Shopify plus the Xero connector.
   - **Pay by invoice:** capture billing address, accounts-payable email, VAT number, PO. Auto-create a Shopify draft order. Shopify emails the invoice. Buyer's finance pays by bank transfer. Harry clicks "mark as paid", which converts it to a real order, ships via Synergy, and books into Xero.

## Technical decisions and rationale

| Decision | Rationale |
|----------|-----------|
| Shopify hosted checkout, no custom checkout | CONKA already uses Shopify checkout for DTC. It handles card, VAT, shipping, refunds, and receipts. No reason to build or add a processor. |
| No Stripe | The original brief assumed Stripe was already in use for DTC. It is not. Adding it would mean a second payment stack for no benefit. |
| Unlisted URL, no tokenised access | The only real reason to hide pricing is channel conflict. An unlisted, noindex link solves that. Per-applicant expiring tokens added build and run cost for no gain. Link is permanent and shared. |
| Quantity-break pricing via Shopify automatic discounts | Base variant priced at the GBP 59 entry rate, tax-exclusive. Two automatic quantity-break discounts apply 25+ and 50+ tiers at checkout. Works without Shopify Plus. The order page mirrors the maths for display only. |
| Pay-by-invoice via Shopify draft orders | A draft order produces a payable invoice and emails it natively. On payment, "mark as paid" converts it to a normal order, which fulfils and books like any other. One Admin API call to create it. |
| Invoicing via off-the-shelf Shopify-to-Xero connector | The connector turns every Shopify order into a compliant Xero invoice automatically. A bespoke Xero API integration would be a more fragile hand-rolled version with no added value at this volume. |
| Ship only after confirmed payment, both paths | Zero credit risk. Card pays instantly; terms ships once the bank transfer clears. |
| Reuse archived legacy B2B products to start | CONKA has archived legacy B2B products that can be renamed and reused to get flowing quickly, rather than creating new products up front. Clean product setup can follow later. |
| Synergy fulfilment unchanged | Synergy routing lives on the Shopify side (tags/metafields), not in website code. A paid B2B order routes to Synergy exactly like any order, provided the products carry the same tags. No code, no per-order action. |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Public landing + enquiry form | Not Started |
| 2a | Shopify B2B product + discount setup (reuse legacy products) | Not Started |
| 2b | Unlisted order page + card checkout (Buy now) | Not Started |
| 3 | Pay-by-invoice path | Not Started |

All phases are active. Phase 3 (pay by invoice) is the business priority but builds on the Phase 2b order page, so it sequences after it.

## Task breakdown

### Phase 1: Public landing + enquiry form

1. **Email + lead infra (Klaviyo).** Server-side: subscribe applicant to a Klaviyo B2B Leads list, trigger a flow emailing them the order-page link, send Harry a notification. Reuses the existing Klaviyo API pattern. First server-side transactional email for CONKA. Files: `app/api/b2b/apply/route.ts`, `app/lib/b2bEmail.ts`.
2. **Application API + spam guard.** `POST /api/b2b/apply`: zod validation, honeypot, calls the above. Files: `app/api/b2b/apply/route.ts`.
3. **Landing page + form UI.** `/professionals` page (sport positioning, social proof, no pricing) + enquiry form. Required: first name, last name, work email, phone, organisation name, sport, squad size, job title. Optional: website, VAT number, postcode, how-heard. Mobile-first. Files: `app/professionals/page.tsx`, `app/components/b2b/ApplicationForm.tsx`.
4. **Subscription-enquiry CTA.** "Need a regular supply? Get in touch" link to Harry. Trivial. Folded into the landing page.
5. **Analytics.** Vercel event `b2b_application_submitted` (sport, squad size). Files: `app/lib/analytics.ts`.

### Phase 2a: Shopify B2B product + discount setup

1. **Reuse archived legacy B2B products.** Rename and unarchive the existing legacy B2B products for Flow and Clear boxes. Price at GBP 59 ex VAT, tax-exclusive. Hidden from storefront. Tagged for Synergy like the funnel products.
2. **Quantity-break discounts.** Two automatic discounts: 25+ boxes to GBP 52, 50+ boxes to GBP 45.
3. **Document variant IDs** for the order page mapping.

### Phase 2b: Unlisted order page + card checkout

1. **B2B pricing data + variant mapping.** Tier maths (display) + variant IDs. Files: `app/lib/productPricing.ts`, `app/lib/shopifyProductMapping.ts`.
2. **Unlisted order page.** `/professionals/order`, noindex, two equal Flow and Clear cards, quantity steppers, auto-tier price, live order summary (ex-VAT lines, VAT and shipping note). Files: `app/professionals/order/page.tsx`, `app/components/b2b/B2BOrderBuilder.tsx`.
3. **Buy-now handoff.** PO field, build Shopify cart with B2B variant + PO as note, redirect to `cart.checkoutUrl`. Files: `app/api/b2b/cart/route.ts`.
4. **Verify pricing + fulfilment end-to-end.** Place a 50-box test order, confirm Shopify charges GBP 45 plus correct VAT, and confirm it routes to Synergy.

### Phase 3: Pay-by-invoice path

1. **Invoice-details form.** Shown on "Pay by invoice": billing address, accounts-payable email, VAT number, PO. Pre-fill from enquiry where known. Files: `app/components/b2b/InvoiceDetailsForm.tsx`.
2. **Draft-order creation.** `POST /api/b2b/invoice-order`: one Shopify Admin API call to create a draft order with line items, delivery address, PO, AP email. Shopify emails the invoice. Files: `app/api/b2b/invoice-order/route.ts`.
3. **Confirm Xero connector books it.** Verify the Shopify-to-Xero connector turns the paid order into a compliant Xero invoice.

## Rabbit holes (avoided)

- Custom checkout or payment processing. Use Shopify checkout.
- Bespoke Xero API integration. Use the off-the-shelf connector.
- Tokenised gating, admin dashboard, custom shipping (EVRi API), token-expiry re-engagement emails. All cut.

## No-gos (this build)

- No Stripe or any new payment processor.
- No automatic Net-30 credit terms. Ship only after payment.
- No admin dashboard. Harry works from Shopify admin and Klaviyo.
- No bespoke Xero API at launch.

## Dependencies (parallel to build, not blockers)

- **Shopify-to-Xero connector:** confirm it is set up, or set it up. Gates Phase 3 verification only. Rudh to review.
- **Shopify Admin API access** for draft-order creation (Phase 3).
- **Email mechanism:** confirm a Klaviyo flow-triggered email covers the applicant link and Harry notification (expected yes).

## Risks

- B2B variants must be tax-exclusive so Shopify adds VAT correctly: the page shows ex VAT, checkout adds 20%. Explicit verify step in Phase 2b.
- The public form is a spam and email target. Honeypot plus light rate-limit.
- First server-side transactional email for CONKA. Small new pattern, no new provider.

## References

- Original brief: Harry's B2B page email (captured in scope conversation).
- Cart and checkout: `docs/features/CART_LOGIC.md`.
- Synergy 3PL: `docs/development/featurePlans/synergy-3pl-integration.md`.
- Existing Klaviyo pattern: `app/api/klaviyo/`, `app/lib/klaviyo.ts`.
- Existing Shopify order webhook (Meta CAPI, not Synergy): `app/api/webhooks/shopify/orders/route.ts`.

## Jira tickets

Created in Sprint 26, assigned to Rudh.

| Ticket | Title | Phase | Type | Status |
|--------|-------|-------|------|--------|
| SCRUM-1055 | B2B portal Phase 1: public /professionals landing + enquiry form | 1 | Story | To Do |
| SCRUM-1056 | B2B portal Phase 2a: Shopify B2B products + quantity-break discounts | 2a | Task | To Do |
| SCRUM-1057 | B2B portal Phase 2b: unlisted /professionals/order page + card checkout | 2b | Story | To Do |
| SCRUM-1058 | B2B portal Phase 3: pay-by-invoice path (Shopify draft order + Xero) | 3 | Story | To Do |

Dependencies: SCRUM-1056 blocks SCRUM-1057, which blocks SCRUM-1058. SCRUM-1055 is independent and can ship first.
