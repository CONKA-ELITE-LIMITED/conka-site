# B2B Teams Ordering Portal (`/professionals`) — Build Plan & Outstanding Work

One-time bulk purchase portal for UK sports clubs and performance organisations. Public enquiry form, unlisted tiered-pricing page, two payment paths (card now / pay by invoice), both shipping only after confirmed payment. Reuses Shopify for order, payment, and fulfilment, and an off-the-shelf Shopify-to-Xero connector (Parex) for invoicing. No custom checkout, no payment processor, no bespoke Xero build.

> **The portal is live.** What actually shipped — file map, API contracts, pricing tiers, VAT model, external config, edge cases — is the current-state reference: **`docs/features/b2b/B2B_PORTAL.md`**. Read that for how the portal works today.
>
> **This doc is the shaping context** (the problem, the appetite, the deliberate scope decisions) **plus the tracker for what is still outstanding**, and a condensed build history. The Xero/VAT mechanism has its own plan docs: `docs/development/featurePlans/b2b-xero-invoicing.md` and `b2b-vat-decision.md`.

## Problem

UK sports clubs and performance orgs want to buy CONKA in bulk, but there is no friction-free route. Today they would be stuck at consumer prices with no bulk tiers, no PO, and no proper VAT invoice. This is a new, high-AOV B2B channel.

- **Who it serves:** Procurement and performance staff at clubs. Warm, sales-led traffic, not cold paid.
- **Business impact:** New revenue channel with high order values (a 50+ box order is roughly GBP 2,250 ex VAT). Removes manual order-taking by self-serving both the order and the invoice.

## Appetite

Roughly 1 to 1.5 weeks. Lean in the sense that we build almost no commerce plumbing: Shopify and Xero handle everything that touches money, fulfilment, and invoicing.

## Design system

brand-base, scoped under `.brand-clinical` (zero-radius tokens plus the navy `#1B2757` interactive accent). Net-new pages built in the clinical aesthetic, deliberately low on micro-typography noise (larger, plainly readable type) per the consumability lessons from the /startv2 build.

## Shape of the build — deliberate scope decisions

These are the decisions that defined the build. Full rationale for each lives in the feature doc's "Decisions and trade-offs"; kept here as the shaping record.

- **Shopify hosted checkout, no custom checkout, no Stripe.** DTC already uses Shopify checkout; a second payment stack adds nothing.
- **Unlisted, noindex URL, no tokenised access.** The only reason to hide pricing is channel conflict; a shared noindex link solves that without per-user token build/run cost.
- **Quantity-break pricing** via Shopify automatic discounts (card path) and a draft-order FIXED_AMOUNT discount (invoice path). Tiers are based on the **combined** Flow + Clear box total, not per product.
- **Pay-by-invoice via Shopify draft orders.** One Admin API call produces a payable, emailable invoice; "mark as paid" converts it to a real order.
- **Invoicing via the off-the-shelf Shopify-to-Xero connector (Parex)**, not a bespoke Xero API.
- **Ship only after confirmed payment, both paths.** Zero credit risk; no Net-30.
- **Reuse archived legacy B2B products to start**, clean product setup later.

**Rabbit holes avoided:** custom checkout / payment processing, bespoke Xero API, tokenised gating, admin dashboard, custom shipping (EVRi API), token-expiry re-engagement emails.

**No-gos (this build):** no Stripe or new processor; no automatic Net-30 credit terms; no admin dashboard (Harry works from Shopify admin + Klaviyo); no bespoke Xero API.

## Phases — status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Public landing + enquiry form (incl. Klaviyo email automation) | **Done** (SCRUM-1055, merged PR #279; emails verified 8 Jun) |
| 2a | Shopify B2B products + combined-total automatic discounts | **Done** (SCRUM-1056, 8 Jun) |
| 2b | Unlisted order page + card checkout (Buy now) | **In review** (SCRUM-1057) |
| 3 | Pay-by-invoice path (draft order + Xero) | **In review** (SCRUM-1058) |

## Outstanding / still to figure out

The portal is functionally live. What remains:

1. **Vercel env for prod emails.** Set `NEXT_PUBLIC_SITE_URL` in Vercel so the Klaviyo welcome-email order link points at prod, not the `https://conka.io` code fallback.
2. **Xero booking verification (SCRUM-1058 tail → SCRUM-1059/1060).** Confirm Parex books a marked-paid B2B order into a compliant Xero VAT invoice end to end. VAT mechanism, pilot steps, and the Road A→B switch are tracked in `b2b-xero-invoicing.md` / `b2b-vat-decision.md`. **Pilot not yet passed — keep Parex on manual sync until it does.**
3. **Shipping for large orders (next workstream, not started).** Pallet/courier shipping tiers, supplier enforcement, large-order shipping cost, and capping free shipping for big orders. Mostly Shopify Admin config, not code. Needs scoping; blockers are ops facts (box weight, who ships pallets, cost). See `project_b2b_shipping`.
4. **B2B fulfilment routing unconfirmed.** The plan assumed B2B routes to Synergy "like any order," but B2B products are currently tagged `SYNERGYIGNORE` (only the 3 funnel products go to Synergy). Who actually ships a B2B order is open, and ties into the shipping workstream.

## Build history

Condensed record of what shipped and where it diverged from the original brief. Current-state mechanics (files, routes, config) live in the feature doc; this is the chronology.

**Phase 1 (SCRUM-1055) — done, merged (PR #279).** Public `/professionals` landing + `ApplicationForm` + `POST /api/b2b/apply`; Klaviyo lead capture, no database. Deviations from brief: squad size became a band select (not free text); emails are Klaviyo flows, not sent from code; removed a stale `/professionals/* → /` redirect in `next.config.ts`.

- **Email automation — done + verified end to end (8 Jun 2026).** B2B Leads list (`Xhqyt8`) + two live flows (`B2B Applicant Welcome` to the applicant, `B2B Lead Alert` to Harry). The Harry-notification trick: the apply route fires a **second** event on Harry's own profile so the flow emails Harry, not the applicant. List id + alert recipient are in-code constants (`B2B_KLAVIYO`), not env. Klaviyo build gotchas (a flow can only trigger on a metric that already exists; flow content must be explicitly saved; Smart Sending OFF on service emails) are captured in the feature doc.

**Phase 2a (SCRUM-1056) — done (8 Jun 2026).** `B2B Products` collection + two combined-total automatic discounts (£62.40 at 25+, £54.00 at 50+), cart-verified inclusive on the headless checkout. Variant GIDs are in-code constants (`app/lib/b2bVariants.ts`), so nothing to set in Vercel for the card path.

**Phase 2b (SCRUM-1057) — in review.** Unlisted `/professionals/order` (noindex), `B2BOrderBuilder`, `app/lib/b2bPricing.ts` (display tiers), dedicated `POST /api/b2b/cart`. Key deviation: **tiers are the combined Flow + Clear total, not per product** — so the Shopify automatic discounts trigger on total cart quantity across the collection, not per variant. Variant GIDs moved from env to in-code constants (8 Jun). PO carried as a cart attribute. Interim "pay by invoice → email Harry" mailto sat under Buy now until Phase 3 landed.

**Phase 3 (SCRUM-1058) — in review.** Pay-by-invoice on `/professionals/order` (two equal CTAs). New Admin API helper `app/lib/shopifyAdmin.ts` (first for CONKA; existing `shopify.ts` is Storefront-only). `POST /api/b2b/invoice-order` does `draftOrderCreate` (line items at the gross base + an order-level FIXED_AMOUNT discount to the gross tier total) then `draftOrderInvoiceSend` — so this path needs **no** Shopify discount config. Live-verified: a 50-box draft (30 Flow + 20 Clear) totalled £2,250.00 ex VAT. Admin token minted via a Dev Dashboard custom app ("CONKA B2B Invoicing"), offline token, scopes `write_draft_orders` + `write_customers`; held in env (`SHOPIFY_ADMIN_API_TOKEN`). Form collects only PO + finance email; the buyer enters their delivery address in Shopify's hosted pay-link.

**VAT model shift (SCRUM-1059 / 1060).** The original plan assumed a tax-exclusive £59 base. Superseded: variants are now priced at the **gross VAT-inclusive** amount (£70.80 / 62.40 / 54.00 per box), and we run **Road B** — Shopify collects UK VAT at 20% inclusive (VAT no. GB430507628) and Parex mirrors that tax onto the Xero invoice. Card-path orders also need a Shopify Flow to tag them `B2B Professionals` or they will not sync. Canonical: `b2b-xero-invoicing.md`, `b2b-vat-decision.md`, and the pricing/VAT section of the feature doc. Where older notes say "tax-exclusive" or "£59 base", read them against this.

## Jira tickets

Created in Sprint 26, assigned to Rudh.

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1055 | Public `/professionals` landing + enquiry form | 1 | Done (merged) |
| SCRUM-1056 | Shopify B2B products + quantity-break discounts | 2a | Done |
| SCRUM-1057 | Unlisted `/professionals/order` page + card checkout | 2b | For review |
| SCRUM-1058 | Pay-by-invoice path (Shopify draft order + Xero) | 3 | For review |

## References

- **Current-state reference (read first):** `docs/features/b2b/B2B_PORTAL.md`
- Xero + VAT mechanism and pilot records: `docs/development/featurePlans/b2b-xero-invoicing.md`, `b2b-vat-decision.md`
- Cart and checkout: `docs/features/CART_LOGIC.md`
- Synergy 3PL: `docs/development/featurePlans/synergy-3pl-integration.md`
- Klaviyo patterns: `docs/features/KLAVIYO_FLOWS_AND_INTEGRATION.md`
- Original brief: Harry's B2B page email (captured in the scope conversation).
