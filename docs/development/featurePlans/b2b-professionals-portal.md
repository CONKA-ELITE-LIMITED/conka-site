# B2B Teams Ordering Portal (`/professionals`)

One-time bulk purchase portal for UK sports clubs and performance organisations. Public enquiry form, unlisted tiered-pricing page, two payment paths (card now / pay by invoice), both shipping only after confirmed payment. Reuses Shopify for order, payment, and fulfilment, and the Shopify-to-Xero connector for invoicing. No custom checkout, no payment processor, no bespoke Xero build.

## Problem

UK sports clubs and performance orgs want to buy CONKA in bulk, but there is no friction-free route. Today they would be stuck at consumer prices with no bulk tiers, no PO, and no proper VAT invoice. This is a new, high-AOV B2B channel.

- **Who it serves:** Procurement and performance staff at clubs. Warm, sales-led traffic, not cold paid.
- **Business impact:** New revenue channel with high order values (a 50+ box order is roughly GBP 2,250 ex VAT). Removes manual order-taking by self-serving both the order and the invoice.

## Appetite

Roughly 1 to 1.5 weeks. Lean in the sense that we build almost no commerce plumbing: Shopify and Xero handle everything that touches money, fulfilment, and invoicing.

## Design system

brand-base, scoped under `.brand-clinical` (zero-radius tokens plus the navy `#1B2757` interactive accent). Net-new pages built in the clinical aesthetic, deliberately low on micro-typography noise (larger, plainly readable type) per the lessons in `landing-page-v2.1.md`.

## Confirmed flow

1. Public `/professionals` page (sport positioning, social proof, no pricing). One CTA: apply for team pricing.
2. Enquiry form. On submit: applicant is emailed the link to the order page, Harry is notified, applicant is added to a Klaviyo B2B list. No database.
3. Unlisted `/professionals/order` page (noindex, not in nav, permanent shared link). Two equal Flow and Clear cards, quantity steppers, per-box price auto-tiers across GBP 59 / 52 / 45 ex VAT based on the COMBINED Flow + Clear box total (see Implementation log).
4. Two payment paths, both available, both ship only after payment:
   - **Buy now:** Shopify checkout (card). PO captured as an order note. Compliant VAT invoice produced automatically via Shopify plus the Xero connector.
   - **Pay by invoice:** capture billing address, accounts-payable email, VAT number, PO. Auto-create a Shopify draft order. Shopify emails the invoice. Buyer's finance pays by bank transfer. Harry clicks "mark as paid", which converts it to a real order, ships via Synergy, and books into Xero.

## Technical decisions and rationale

| Decision | Rationale |
|----------|-----------|
| Shopify hosted checkout, no custom checkout | CONKA already uses Shopify checkout for DTC. It handles card, VAT, shipping, refunds, and receipts. No reason to build or add a processor. |
| No Stripe | The original brief assumed Stripe was already in use for DTC. It is not. Adding it would mean a second payment stack for no benefit. |
| Unlisted URL, no tokenised access | The only real reason to hide pricing is channel conflict. An unlisted, noindex link solves that. Per-applicant expiring tokens added build and run cost for no gain. Link is permanent and shared. |
| Quantity-break pricing via Shopify automatic discounts | Base variant priced at the GBP 59 entry rate, tax-exclusive. Two automatic quantity-break discounts apply 25+ and 50+ tiers at checkout. Works without Shopify Plus. The order page mirrors the maths for display only. **Tiers are based on the COMBINED Flow + Clear box total, so the Shopify discounts must trigger on total cart quantity, not per variant.** |
| Pay-by-invoice via Shopify draft orders | A draft order produces a payable invoice and emails it natively. On payment, "mark as paid" converts it to a normal order, which fulfils and books like any other. One Admin API call to create it. |
| Invoicing via off-the-shelf Shopify-to-Xero connector | The connector turns every Shopify order into a compliant Xero invoice automatically. A bespoke Xero API integration would be a more fragile hand-rolled version with no added value at this volume. |
| Ship only after confirmed payment, both paths | Zero credit risk. Card pays instantly; terms ships once the bank transfer clears. |
| Reuse archived legacy B2B products to start | CONKA has archived legacy B2B products that can be renamed and reused to get flowing quickly, rather than creating new products up front. Clean product setup can follow later. |
| Synergy fulfilment unchanged | Synergy routing lives on the Shopify side (tags/metafields), not in website code. A paid B2B order routes to Synergy exactly like any order, provided the products carry the same tags. No code, no per-order action. |

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Public landing + enquiry form | Done (SCRUM-1055, merged PR #279) |
| 2a | Shopify B2B product + discount setup (reuse legacy products) | Not Started |
| 2b | Unlisted order page + card checkout (Buy now) | In Review (SCRUM-1057) |
| 3 | Pay-by-invoice path | In Review (SCRUM-1058) |

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
| SCRUM-1055 | B2B portal Phase 1: public /professionals landing + enquiry form | 1 | Story | Done (merged) |
| SCRUM-1056 | B2B portal Phase 2a: Shopify B2B products + quantity-break discounts | 2a | Task | To Do |
| SCRUM-1057 | B2B portal Phase 2b: unlisted /professionals/order page + card checkout | 2b | Story | For review |
| SCRUM-1058 | B2B portal Phase 3: pay-by-invoice path (Shopify draft order + Xero) | 3 | Story | For review |

Dependencies: SCRUM-1056 blocks SCRUM-1057, which blocks SCRUM-1058. SCRUM-1055 is independent and can ship first.

## Implementation log

What actually shipped, and where it diverged from the plan above. Read this before picking up SCRUM-1056 or 1058.

### Phase 1 (SCRUM-1055) - Done, merged

- **Public `/professionals` landing + `ApplicationForm`** (`app/professionals/page.tsx`, `app/components/b2b/ApplicationForm.tsx`). Sport positioning, no pricing.
- **`POST /api/b2b/apply`** - zod validation, honeypot field (named `company`), light per-IP in-memory rate limit.
- **`app/lib/b2bEmail.ts`** - fires a Klaviyo `B2B Application Submitted` event and adds the applicant to a Klaviyo B2B Leads list. No database. **`app/lib/b2bData.ts`** holds the sport list, squad-size bands, and the Klaviyo contract.
- **Analytics:** `b2b_application_submitted` (sport, squad size).
- **Deviations / notes:**
  - **Squad size is a band select** (Under 10 / 10-25 / 26-50 / 51-100 / Over 100), not free text.
  - **Emails are Klaviyo flows, not sent from code.** The route fires the event and subscribes the profile; the two emails (applicant welcome with the order link, Harry notification) are flows configured in the Klaviyo dashboard, keyed off the event. `NEXT_PUBLIC_SITE_URL` is used to build the absolute order-page link.
  - **Removed a legacy redirect:** `next.config.ts` had a permanent `/professionals/:path* -> /` redirect from when the route was deprecated. Removed so the new pages resolve.

#### Phase 1 email automation - DONE + verified end to end (8 June 2026)

The deferred email piece is built and live in Klaviyo. Both emails send and were confirmed delivering to a real inbox.

- **B2B Leads list** created in Klaviyo (id `Xhqyt8`, single opt-in). The apply route adds every applicant to it. The list id is a plain constant in `B2B_KLAVIYO` (`app/lib/b2bData.ts`), **not an env var** - there is one Klaviyo account and the id never varies by environment, so it does not belong in env. Same for the alert recipient.
- **Two live flows**, each triggered by a metric the apply route fires:
  - **`B2B Applicant Welcome`** - triggers on the **`B2B Application Submitted`** event (fired on the applicant's profile). Text-only email with the order-page link (`{{ event.order_url }}`, populated from `NEXT_PUBLIC_SITE_URL` + `/professionals/order`). Sends to the applicant.
  - **`B2B Lead Alert`** - triggers on a **`B2B Lead Alert`** event. Text-only internal notification listing the applicant's details. Sends to Harry.
- **Harry-notification mechanism (the non-obvious bit).** A Klaviyo flow email always sends to the profile that triggered it, so an alert keyed off the applicant's event would email the applicant, not Harry. Fix: the apply route fires a **second** event, `B2B Lead Alert`, **on Harry's own profile** (`$email` = `B2B_KLAVIYO.notifyEmail`, the constant `harryglover@conka.io`), carrying the applicant's details as event properties. The alert flow triggers on that, so it lands on Harry's profile and emails Harry. Implemented in `fireLeadAlertEvent` (`app/lib/b2bEmail.ts`); event name + recipient live in `B2B_KLAVIYO` (`app/lib/b2bData.ts`) as `alertEventName` / `notifyEmail`, both plain constants. Fails gracefully and independently of the applicant event and the list add.
- **Klaviyo build gotcha (for future flows):** a flow can only trigger on a metric that already exists, and a metric only exists once its event has fired at least once. Order is: set env -> fire one submit to mint the metric -> then the metric appears in the flow trigger dropdown -> build the flow. Also: flow email **content must be explicitly saved** in the editor, and the **Smart Sending** toggle must be OFF on a service email or repeat submits are suppressed.
- **Form UX fix (`ApplicationForm.tsx`):** required fields now carry a red `*` plus a legend, and the submit button is **disabled until all required fields are valid** (previously a missing required field, e.g. job title, submitted silently or confused the user). Helper text under the button reflects the gate state.
- **Deliverability note:** the welcome/alert land in Gmail's **Updates** tab (transactional-looking, plain text), not the Primary inbox or spam.

### Phase 2b (SCRUM-1057) - In review

- **Unlisted `/professionals/order`** (noindex), **`B2BOrderBuilder`**, **`app/lib/b2bPricing.ts`** (display tiers + helpers).
- **`POST /api/b2b/cart`** - creates a fresh multi-line Shopify cart and returns `checkoutUrl`.
- **Analytics:** `b2b_checkout_started` (total boxes, ex-VAT subtotal, has-PO).
- **Key deviations from the plan:**
  - **Tiers are COMBINED-total based, not per product.** The combined Flow + Clear box count selects the tier, and that per-box price applies to every box. The original brief implied per-product bands. Consequence: **the Phase 2a Shopify automatic discounts must trigger on total cart quantity (minimum quantity of items across both B2B products), not per variant.**
  - **Dedicated `/api/b2b/cart` route** rather than reusing `/api/cart` or going through `CartContext`. Reasons: needs multiple lines (Flow + Clear in one order), keeps the B2B variant GIDs server-side, and isolates the B2B order from a shopper's persisted DTC cart.
  - **Variant GIDs are server-side env vars** (`B2B_FLOW_VARIANT_ID`, `B2B_CLEAR_VARIANT_ID`), resolved in the cart route - NOT in `productPricing.ts` / `shopifyProductMapping.ts` as the plan task listed. Until they are set (after SCRUM-1056) Buy now returns a clear 503 "checkout not available yet" and the page is otherwise fully usable.
  - **PO carried as a cart attribute** `PO Number`, plus an `Order Type: B2B Professionals` attribute for identifying B2B orders downstream.
  - **UI:** box imagery (`/formulas/box/FlowBox.jpg`, `ClearBox.jpg`) on each tile; desktop **3-column layout** (two product cards + summary in one eyeline), two cards side by side with full-width summary on mobile; summary line items read `qty x Product` with shot counts and a combined boxes/shots total.
  - **Pay-by-invoice** is not on this page yet (Phase 3 / SCRUM-1058). An interim "pay by invoice or on account -> email Harry" mailto link sits under Buy now.
  - Temporary nav links were added during dev for access and then removed before review (AC1: the order page is not linked from nav).

### Phase 3 (SCRUM-1058) - In review

- **Pay-by-invoice path on `/professionals/order`**. The order page now offers two equal CTAs: **Buy now** (card, unchanged) and **Pay by invoice**. Reuses the existing PO field and adds one **Finance email** field. No second form.
- **`app/lib/shopifyAdmin.ts`** - first **Admin API** helper for CONKA (the existing `app/lib/shopify.ts` is Storefront-only). `adminGraphql()` POSTs to `/admin/api/2025-10/graphql.json` with the `X-Shopify-Access-Token` header; `isAdminApiConfigured()` guards on the token.
- **`POST /api/b2b/invoice-order`** - `draftOrderCreate` (Flow/Clear variant line items + an order-level FIXED_AMOUNT discount) then `draftOrderInvoiceSend`. Shopify emails the invoice to the finance address. Code stops there; Harry marks paid manually and the Xero connector books it. No Xero API integration built. Light per-IP rate limit (5 / 10 min) because the route creates persistent draft orders and emails a caller-supplied address (abuse guard).
- **`app/lib/rateLimit.ts`** - shared in-memory per-IP limiter (`createRateLimiter` + `getClientIp`), extracted from the Phase 1 apply route during the SCRUM-1058 code review so both routes share one implementation.
- **Analytics:** `b2b_invoice_requested` (total boxes, ex-VAT subtotal, has-PO).
- **Confirmed decisions (Rudh, this build):**
  - **Invoice available on all orders**, not gated to 25+ boxes.
  - **Card allowed on the invoice** (not bank-transfer-only), so the buyer enters their delivery address in Shopify's hosted pay-link and we do **not** collect an address in our form. Keeps the form lean (PO + finance email only).
  - **Confirmation copy:** "Invoice on its way." naming the finance email, reserved-then-ship-on-payment framing.
- **Key implementation notes / deviations:**
  - **Price is set on the draft order, not via Shopify discounts.** Line items carry the B2B variant at its base entry rate (GBP 59 ex VAT); an order-level FIXED_AMOUNT discount of `(59 - tierPrice) x totalBoxes` brings the ex-VAT subtotal to the exact combined-total tier price. So this path needs **no** Shopify automatic-discount config (unlike the card path). Depends on the B2B variants being priced at GBP 59 ex VAT.
  - **Verified live:** a 50-box draft (30 Flow + 20 Clear) created via the exact mutation totalled GBP 2,250.00 ex VAT (= 45 x 50), confirming both the discount math and the GBP 59 base-price assumption. Test draft was deleted; no invoice email sent.
  - **Token via a new Dev Dashboard custom-distribution app** ("CONKA B2B Invoicing"), legacy install flow, offline (non-expiring) token. Shopify retired one-click legacy custom-app creation on 1 Jan 2026, so the token was minted via a one-time OAuth authorization-code handshake. Scopes granted: `write_draft_orders` (includes read), `write_customers`.
  - Reuses the same server-side `B2B_FLOW_VARIANT_ID` / `B2B_CLEAR_VARIANT_ID` env vars as the card path. Returns a 503 "not available yet" if the Admin token or variant GIDs are unset, same graceful-degradation pattern as `/api/b2b/cart`.

### Environment variables introduced

| Var | Phase | Purpose |
|-----|-------|---------|
| `B2B_FLOW_VARIANT_ID` | 2b | Shopify variant GID for the Flow B2B box. Set after SCRUM-1056. |
| `B2B_CLEAR_VARIANT_ID` | 2b | Shopify variant GID for the Clear B2B box. Set after SCRUM-1056. |
| `SHOPIFY_ADMIN_API_TOKEN` | 3 | Secret. Static offline Admin API token used by `/api/b2b/invoice-order` to create draft orders + send invoices. Server-only, never `NEXT_PUBLIC_`. In `.env.local` + Vercel (Production + Preview). |

(Reuses existing `KLAVIYO_PRIVATE_KEY`, `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY`. `NEXT_PUBLIC_SITE_URL` was not actually set before Phase 1 emails - now set to `https://www.conka.io` locally; needed in Vercel for the welcome-email link to point at prod rather than the `https://conka.io` code fallback.)

### Outstanding for a fully live portal

- **SCRUM-1056:** ~~create/rename the B2B products + the total-quantity automatic discounts~~ **DONE 8 June 2026** — `B2B Products` collection + two combined-total automatic discounts (£62.40 at 25+, £54.00 at 50+) created and cart-verified inclusive on the headless checkout. Variant env vars are wired locally (Buy now produced a real checkout). Confirm `B2B_FLOW_VARIANT_ID` / `B2B_CLEAR_VARIANT_ID` are also set in Vercel before prod deploy.
- **Phase 1 emails:** ~~create the Klaviyo B2B Leads list + the two flows, set `KLAVIYO_B2B_LIST_ID`~~ **DONE 8 June 2026** - B2B Leads list (`Xhqyt8`), both flows (`B2B Applicant Welcome`, `B2B Lead Alert`) live, applicant + Harry emails verified end to end. The list id and alert recipient are in-code constants in `B2B_KLAVIYO`, not env. Remaining for prod: set `NEXT_PUBLIC_SITE_URL` in Vercel so the welcome-email link points at prod. See the Phase 1 email-automation entry in the implementation log.
- **SCRUM-1058:** pay-by-invoice path - built and live-tested (in review). Remaining external setup: confirm the Shopify-to-Xero connector books a marked-paid B2B order into a compliant Xero invoice (manual verify, no code).
- **SCRUM-1059 / SCRUM-1060 (VAT mechanism):** Xero invoicing + the VAT model superseded the original "tax-exclusive GBP 59 base" wording in this doc. **Current model:** B2B variants are priced at the GROSS VAT-inclusive amount (GBP 70.80 / 62.40 / 54.00 per box) and the invoice route discounts to the gross tier total. The Shopify-to-Xero connector MIRRORS Shopify's tax, so Shopify must charge the VAT: SCRUM-1060 switches us from Road A (Shopify VAT off) to **Road B - enable UK VAT collection in Shopify** (VAT no. GB430507628, inclusive pricing; no consumer price change). Card-path orders also need a Shopify Flow to tag them `B2B Professionals` or they will not sync. Canonical detail: `b2b-vat-decision.md` and `b2b-xero-invoicing.md`. Where this doc's older sections say "tax-exclusive" or "GBP 59 base" (e.g. the Phase 3 implementation log, the discount-pricing decision row, the Phase 2b risk), read them against this note.
