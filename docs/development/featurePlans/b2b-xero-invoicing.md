# B2B Xero Invoicing (Shopify-to-Xero connector)

Get paid B2B orders into Xero automatically as compliant UK VAT invoices, carrying the club's PO as the invoice reference. Closes SCRUM-1058 AC6. Uses an off-the-shelf Shopify-to-Xero connector, no bespoke Xero API build. Sits downstream of the pay-by-invoice path shipped in SCRUM-1058.

See also: `docs/development/featurePlans/b2b-professionals-portal.md` (the portal this completes). VAT decision rationale: `b2b-vat-decision.md`.

## Resume here — next steps (Monday 8 June 2026)

**Where we left off (Fri 5 June):** Invoice-route gross-pricing code DONE (commit 027374c5). Shopify B2B variant base price reset to £70.80 DONE. Parex tax settings + Shopify tax-inclusive flag VERIFIED. VAT approach DECIDED and recorded (`b2b-vat-decision.md`). A fresh Parex support request (tag filter + draft-order handling + VAT-inclusive behaviour) was submitted via the contact form. Nothing is live (whole portal sits on `B2B-PORTAL-FEATURE`).

**Do Monday — no dependency, can run in parallel (all dashboard config, no code):**
1. **Shopify: finish the discounts.** Set the SCRUM-1056 automatic quantity-break discounts to land on **£62.40** (25–49 boxes) and **£54.00** (50+). The £70.80 base is done; these are the missing half, and the card "Buy now" path is mispriced for tiers 2–3 until they are set.
2. **Shopify Flow: build the card-path tagging rule.** Trigger `Order created`; condition custom attribute `Order Type` = `B2B Professionals`; action add tag `B2B Professionals`; action add a PO tag from the `PO Number` attribute via Liquid (`{% assign po = order.customAttributes | where: "key", "PO Number" | first %}{% if po %}PO {{ po.value | replace: ",", " " }}{% endif %}`). Full spec in "Go-live checklist" step 4 below.
3. **Xero/Parex: email the invoice.** Set Xero (or Parex) to email the B2B Sales invoice to the order contact, so the club gets its VAT document. Check the invoice branding/template.
4. **Parex: re-confirm "Always Manual Sync" is still ticked.** Parex auto-enables Auto Sync 7 days after install; do not let it flip on before the tag filter is confirmed.
5. **(Optional) Local price-check.** Run `POST /api/b2b/invoice-order` locally (needs the Admin API token + B2B variant IDs in env) to create a test draft order at each tier, confirm totals are £70.80 / £62.40 / £54.00, then delete the test drafts. Proves the gross pricing on real Shopify before the Parex pilot.

**Blocked on Parex support's reply (the only true blocker):**
6. **When Parex confirms the `B2B Professionals` tag filter is active**, run the **pilot** (one pay-by-invoice order AND one card order) per the Phase 3 checklist: exactly one Xero invoice each, **net £59 + VAT £11.80 = £70.80** (inclusive split, not added on top, not £0 VAT), PO in the invoice Reference, no DTC order touched, invoice emailed to the club. Keep Always Manual Sync ON until the pilot passes. If Parex has not replied by Monday, chase the contact request.

**After the pilot passes:**
7. Enable auto-sync (untick Always Manual Sync / turn Auto Sync on). The feature is then launch-ready and ships when `B2B-PORTAL-FEATURE` merges. Brief Humphrey from `b2b-vat-decision.md` (non-blocking).

## Problem

The pay-by-invoice path (SCRUM-1058) creates a Shopify draft order, emails the buyer a hosted invoice, and converts to a normal paid order when Harry marks it paid. Nothing currently syncs Shopify into Xero, so without this, every B2B sale has to be re-keyed into Xero by hand to produce a compliant VAT invoice. That is slow, error-prone, and does not scale on a high-AOV channel.

- **Who it serves:** finance / ops (Harry plus whoever owns the Xero books). Not customer-facing.
- **Business impact:** removes manual invoicing on the B2B channel and keeps VAT returns and the ledger clean. Retention / operational efficiency, not acquisition.

## Appetite

Website code: a few hours (one small, additive change). Whole thing: a few days elapsed, gated on the connector decision, a one-time Xero-side setup, and a single pilot order. No custom integration to build or maintain.

## Approach

Install an off-the-shelf per-order Shopify-to-Xero connector, scope it to only B2B-tagged orders so it never touches DTC accounting, and map the PO into the Xero invoice Reference field. The only website change is to write the PO into a connector-readable field (order `note`, plus optionally a sanitized tag) on the draft order, additively. Nothing is treated as final until one real paid B2B order has been verified end to end in Xero.

DTC consumer orders are assumed to reach Xero today via bank-feed reconciliation (lump-sum payouts), not per-order invoices, and must stay that way. The connector is therefore scoped to B2B orders only.

**Design system:** N/A (no UI).

## Connector decision (gated on one support question)

Research (June 2026) compared the per-order-capable options. A2X and the legacy Xero-built native integration are summary-only (one journal per payout, not one invoice per order) and cannot satisfy the requirement; the legacy native integration also retires 8 July 2026.

| Connector | Per-order invoice | PO into Reference | Paid-only trigger | Draft-order-converted orders | Notes |
|-----------|-------------------|-------------------|-------------------|------------------------------|-------|
| **Parex (Xero Bridge)** | Yes (documented) | Yes, from Note or Order tag (documented) | Yes (Awaiting Payment auto-updates to Paid) | **Explicitly unsupported** per Parex FAQ: confirming a draft creates a renumbered order and "duplicate entries get created in Xero" | Best-documented on our needs, but the draft-order flaw is gating. Tag scoping is arranged via support, not self-serve. ~GBP 10-15/mo (unverified). |
| **Amaka (official Xero successor)** | Yes (selectable, runs as daily batch) | Undocumented | Undocumented | Undocumented | Free, Xero's official partner (best longevity). All B2B-specific behaviour needs vendor confirmation. |
| **Synder** | Unconfirmed | Undocumented | Documented payment-recorded trigger | Undocumented | Priciest; least documented for our case. |

**The gating issue:** our flow is draft-order based, and Parex explicitly disclaims draft orders. Once a draft is marked paid it becomes a normal completed order with its own number, which connectors do sync, so the warning may not bite our specific one-shot flow. But because Parex disclaims it, we cannot assume it works. This must be confirmed with the vendor before committing.

**The deciding action (no code):** send this to Parex support, and the same to Amaka:

> "We create orders via the Shopify Admin API `draftOrderCreate`, email the invoice, then 'mark as paid', which converts the draft into a normal completed order with its own order number. Does your per-order Xero sync handle these converted orders correctly, creating exactly one invoice with no duplicates? And can you scope syncing to only orders carrying the tag `B2B Professionals`, leaving all other orders untouched?"

That answer picks the connector: Parex if confirmed (best documented fit), Amaka if not (official, free, per-order; then confirm Reference mapping). The website code below is identical either way.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Make order data connector-ready (PO into note/tag) | Done (code on `xero-connection` branch, live-verified) |
| 2 | Connector setup + Xero mapping (config, not code) | Future (gated on connector decision + Humphrey go-ahead) |
| 3 | Pilot + verify with one real order (de-risk gate) | Future (gated on Phase 2) |

Only Phase 1 is built in code. Phases 2 and 3 are configuration and verification owned by Harry / the Xero owner; this doc carries the checklist for them.

## Phase 1 task breakdown (active)

1. **API - write the PO into a connector-readable field**
   - What: in `draftOrderCreate`, when a PO is supplied, set the draft order `note` to the PO value (so the connector can map note to the Xero invoice Reference). Keep the existing `PO Number` custom attribute (additive, nothing removed). Optionally also add a sanitized `PO: <value>` tag if the chosen connector maps Reference from tags rather than note; the pilot confirms which field the connector actually uses, so the exact carrier is finalised in Phase 3.
   - Dependencies: none.
   - Complexity: Small.
   - Files: `app/api/b2b/invoice-order/route.ts`.
2. **Docs - Xero setup + pilot checklist for the Xero owner**
   - What: plain-English steps to install/connect the chosen connector, map UK VAT 20% to the Xero VAT rate and the right account codes, set per-order invoicing with Reference = the PO field, scope to the `B2B Professionals` tag, set a start date after go-live, then run the one-order pilot and what "correct" looks like.
   - Dependencies: none (can be written now; executed in Phase 2).
   - Complexity: Small.
   - Files: this doc (Phase 2 checklist section, added when Phase 1 lands).

## Phase 2 (config, owned by the Xero owner)

Not code. Whoever owns the Xero books (Harry has access; the chart of accounts / VAT rates may need the accountant) does, in the connector and Xero dashboards:

1. Confirm the connector choice from the gating support question above.
2. Disconnect any legacy / native Shopify-to-Xero connector first, to avoid duplicate invoices.
3. Connect the connector to the Xero org (OAuth).
4. Map UK VAT 20% to the Xero VAT rate and sales to the correct account code.
5. Set per-order invoicing, Reference = the PO field (note or tag), and scope to the `B2B Professionals` tag only.
6. Set a historical start date after go-live so legacy orders are not back-imported.

## Phase 3 (pilot + verify, the de-risk gate)

Run one real order through **each path** (one pay-by-invoice, one card "Buy now") end to end and confirm:
- Exactly one Xero invoice per order (no duplicate from the draft-order conversion).
- The invoice carries the correct line items, GBP amounts, and 20% VAT (gross GBP 70.80 split to 59 net + 11.80 VAT via Parex inclusive).
- The PO appears in the Xero invoice Reference (for the card order, confirm the Shopify Flow rule tagged it and carried the PO into the note — go-live checklist step 4).
- The Xero VAT invoice is emailed to the club (go-live checklist step 5).
- The payment reconciles for each route: invoice order = bank transfer into Revolut; card order = card / Shopify Payments settlement (confirm Parex reconciles this, since the Payment Deposit setting assumes the Revolut transfer).
- No DTC orders were touched.
- The marked-paid order also routed to Synergy (SCRUM-1058 AC5, adjacent check).

Only after this passes is Phase 1's field choice (note vs tag) locked. If the connector wants the PO formatted or carried differently, adjust the small Phase 1 change then.

## Technical decisions and rationale

| Decision | Rationale |
|----------|-----------|
| Use a connector, not manual reconciliation | B2B paid by bank transfer already lands in Xero via the bank feed (the company bank account is linked to Xero; Shopify is not), so at low volume the bookkeeper could just code each receipt by hand. But the channel is scaling to more clubs and corporate entities, where manual coding of every transfer does not scale and invites error. A connector gives frictionless, auditable per-order invoices + debtor records. Confirmed necessary (Rudh, June 2026). |
| Off-the-shelf connector, no bespoke Xero API build | A hand-rolled Shopify-to-Xero sync means owning OAuth + token refresh, a reliable paid-order webhook with idempotency, org-specific account/tax mapping in code, and monitoring, forever, for output a ~GBP 12/mo app already produces reliably. No payoff at this volume. |
| PO into order `note` (plus optional tag), kept additive | Connectors map the Xero invoice Reference from the order note or a tag, not from custom `note_attributes`. The existing custom attribute alone would not carry the PO to Xero. Additive and reversible, so a wrong guess costs nothing. |
| Scope connector to the `B2B Professionals` tag | DTC orders are reconciled via the bank feed today. Syncing all orders per-order would clash with that and clutter the ledger. The tag already exists on B2B orders from SCRUM-1058. |
| Verify with a pilot before locking the design | Several connector behaviours (PO mapping exactness, draft-order-converted handling) are vendor-documented as absent or unsupported. The pilot proves reality before we rely on it. |

## Rabbit holes

- **Building our own Xero API sync.** Avoided; see the table above.
- **Pointing the connector at all orders.** Would disturb DTC bank-feed accounting. Scope to the B2B tag only.
- **Assuming the draft-order path works.** Parex disclaims it. Treat as unconfirmed until the support answer and the pilot.

## No-gos

- No bespoke Xero API integration.
- No changes to the DTC accounting flow.
- No automatic Net-30 / credit terms (ship only after payment, unchanged).

## Risks

- **Draft-order-converted orders may duplicate or misbehave** depending on connector. Mitigated by the gating support question and the Phase 3 pilot.
- **The Xero-side mapping needs someone who knows the chart of accounts / VAT rates.** Harry has access; if unsure on codes, this needs the accountant. This is the most likely thing to stall.
- **Duplicate invoices** if a legacy connector is left connected. Mitigated by disconnecting it in Phase 2.

## Setup progress (5 June 2026)

- **Connector chosen: Parex (Xero Bridge), Silver plan, on the 7-day free trial.** Parex confirmed it can scope sync to a tag (the dealbreaker); its draft-order duplicate caveat is to be proven in the pilot.
- **Parex configured + connected to the live Xero org** (connected to `Conka Elite Limited`). Settings: Individual (per-order) sync; Sales account = `B2B Sales` (new revenue account, code 201, 20% VAT on Income); Unique Customer Every Order (by first/last name for now); Invoice Status = **Awaiting Payment**; Sales Tax Code = 20% VAT on Income, Zero Tax Code = No VAT, Tax Exempt unchecked; Payment Deposit bank = Revolut GBP Main; Shopify Payments Flow OFF; sync start date = 2026-06-05; contact email set.
- **Always Manual Sync: found UNCHECKED on 5 June, re-ticked.** Parex warns that if Auto Sync is not enabled within 7 days it auto-enables itself — which would have synced all DTC orders before the tag filter is confirmed. Now ticked, so nothing syncs until we say so. Re-verify this stays ticked before any pilot.
- **B2B-only filter: requested from Parex support, NOT yet confirmed active.** Do not run a sync until they confirm (else DTC orders would sync). Example order given: #3503.
- **Outstanding before the pilot:** Parex confirms the filter, then run one real B2B order through and check Xero (one invoice, B2B Sales, PO in Reference). PO-into-note is already verified to carry through.

## B2B VAT — pricing and mechanism DECIDED (5 June 2026)

> Plain-English decision record (what + why, readable by a non-technical owner / accountant): `b2b-vat-decision.md`. The below is the implementation detail.

- **Pricing decided (Harry, 5 June 2026):** B2B prices are **ex-VAT**, same logic across all three tiers. A club pays the box price + 20% at checkout (Entry GBP 59 -> 70.80, Squad 52 -> 62.40, Institutional 45 -> 54.00) and reclaims the VAT (just noise to them). The order page's net + VAT + gross display is therefore correct and needs no change. Xero must show the same ex-VAT split (net line + 20% VAT).
- **Non-negotiable:** the club must actually be **charged the gross** (e.g. 70.80) in Shopify, and Parex must treat the amount as **VAT-inclusive** (gross / 1.2 -> net + 20% VAT), never exclusive. Exclusive would invoice more in Xero than the cash collected and break the bank-rec / declare uncollected VAT.
- **The defect this exposes:** the B2B variants are currently priced at the **net** (GBP 59) and both checkout paths charge that, so the club is *shown* 70.80 but *charged* 59. A Shopify discount can only reduce a price, so the fix is to make the Shopify price the **gross**. See the "Layer" breakdown below.

**Mechanism DECIDED (Rudh, 5 June 2026): Road A — reprice the B2B products, leave Shopify VAT alone.**

- **Road A (CHOSEN) — leave Shopify VAT collection off; price the B2B variant at the gross; Parex "inclusive" derives the VAT.** Zero DTC impact, fast, and consistent with the store's existing model (Shopify computes no VAT on any product; the accounting layer / Xero handles it). The legal VAT document is the Xero invoice, which is correct, and the club sees the net + VAT split on the order page before paying. This is what the layers below implement.
- **Road B (REJECTED) — turn on Shopify UK VAT collection** so Shopify itemises VAT at checkout and Parex just mirrors it. Rejected: it alters DTC tax reporting (the store currently shows UK "Collecting -"), needs the accountant to re-verify the whole store, and takes longer for no extra benefit over Road A. The compliant VAT invoice is the Xero one either way.
- **Still needs Humphrey/accountant to bless the VAT-accounting treatment** (that the Xero-issued invoice is the compliant VAT document for a B2B sale where Shopify itself shows no VAT line). This is a sign-off on correctness, not a mechanism choice — the mechanism is locked.

**Implementation — three layers:**

1. **Shopify config (Harry, not code):** set both B2B variant prices (Flow + Clear) to the **gross Entry rate GBP 70.80**; reconfigure the SCRUM-1056 automatic quantity-break discounts to land on the **gross** tier prices **62.40** (25+) and **54.00** (50+), not the old net 52/45. Do **not** enable Shopify VAT on the variants (blocked by the non-collecting UK setting and would touch DTC).
2. **Code (one contained change):** `app/api/b2b/invoice-order/route.ts` discounts down from the variant base to the tier price in **net** terms (`B2B_ENTRY_PRICE = 59`, `tier.pricePerBox`). Once the variant is the gross 70.80, Entry comes out right but Squad/Institutional land GBP 1.40 / 2.80 per box too high (VAT charged on the discount). Fix: compute the base and tier targets in **gross** (`pricePerBox * (1 + B2B_VAT_RATE)`). Must land **together with** the variant reprice — shipping it against the live 59 variant would make tiers 2-3 wrong.
3. **Parex / Xero config:** Sales Tax Code = 20% VAT on Income, treatment = **inclusive**. Shopify sends 70.80 as a single gross with no VAT line; inclusive makes Parex book 59 net + 11.80 VAT = 70.80, reconciling against the Revolut deposit.
   - **Verified in Parex (5 June 2026):** Tax Settings tab has Sales Tax Code = `20% (VAT on Income)`, Zero Tax Code = `No VAT`, Tax Exempt **unchecked**. **Parex exposes NO inclusive/exclusive toggle** — the inclusive treatment is driven by Shopify's tax-inclusive flag.
   - **Verified in Shopify (5 June 2026):** Settings > Taxes and duties > Global settings > **"Include sales tax in product price and shipping rate" is ON** (tax-inclusive). UK shows "Collecting -" and Shopify assumes a 0% rate (no UK tax registration) — this is the intended Road A state (Shopify computes 0 VAT; Parex stamps the 20% on the gross). Do **not** register UK VAT in Shopify or "Edit variants" to charge tax (that is Road B, changes DTC).
   - **Definitive confirmation = the pilot:** because Shopify sends the order with 0 tax, settings alone do not guarantee Parex splits inclusively. The pilot invoice must read net 59 + VAT 11.80 = 70.80. If it shows 0 VAT or VAT added on top (70.80 + 11.80), raise it with Parex support — config fix, not a redesign.

- Resolving VAT does **not** block verifying the Parex sync mechanics (one invoice, B2B Sales account, PO in Reference) on a current zero-VAT order; but the gross reprice + code change + Parex inclusive must all be in place before B2B go-live, or the club is undercharged. Owner: Rudh + Humphrey / accountant.

## Go-live checklist (agreed 5 June 2026)

The full set of actions to get both B2B paths invoicing correctly into Xero. Card and pay-by-invoice orders both produce a Xero VAT invoice; the fast card purchase is not blocked. Pending Humphrey confirming Road A (above).

1. **Reprice the boxes to gross (Shopify, Harry).**
   - **DONE (5 June 2026):** both B2B variants (Flow + Clear) base price set to **GBP 70.80** (gross Entry rate). Fixes the Entry tier on both paths.
   - **OUTSTANDING:** reconfigure the SCRUM-1056 automatic quantity-break discounts to the gross tier prices **62.40** (25+) / **54.00** (50+). Until done, **card-path** Squad/Institutional orders are mispriced (the card path gets its tier price entirely from these automatic discounts). Not urgent (page not live), but required before launch. The pay-by-invoice path is unaffected (handled in code, step 2).
2. **Invoice-route code change (code) — DONE (commit 027374c5).** `app/api/b2b/invoice-order/route.ts` now computes the tier discount in **gross** terms via `getB2BGrossPerBox`, so all tiers' draft orders match the gross tier price. Nothing is live (the whole B2B portal sits on the `B2B-PORTAL-FEATURE` branch, not `main`), so this ships together with everything else; the reprice above already satisfies the gross-variant assumption.
3. **Parex tax treatment (Parex, Harry).** Sales Tax Code = 20% VAT on Income, treatment = **inclusive** (never exclusive). Parex splits the GBP 70.80 gross into 59 net + 11.80 VAT on the Xero invoice.
4. **Card path into scope via a Shopify Flow rule (Shopify Flow, no website code).** The card path builds the order through the Storefront cart API, which **cannot set order tags or the note** — it only attaches cart *attributes* (`Order Type`, PO). So add a Flow rule: *on order created, if `Order Type = B2B Professionals`, add the `B2B Professionals` tag and copy the PO attribute into the order note*. This puts instant-card B2B orders into Parex's tag scope with the PO attached, exactly like the pay-by-invoice path. Without this, card orders either do not sync or sync without the PO.
5. **Email the Xero VAT invoice to the club (Xero/Parex config).** Neither Shopify surface (card checkout, hosted draft invoice) itemises VAT — the compliant VAT invoice is the **Xero** one. Set Xero (or Parex) to auto-email B2B Sales invoices to the order contact so the club receives their VAT document for reclaim. Without this the buyer pays but has no VAT invoice in hand.
6. **Parex B2B-only tag filter confirmed (Parex support).** Still pending. No sync runs until confirmed (else DTC orders sync into Xero). Example order given: #3503.
7. **Disconnect any legacy / native Shopify-to-Xero connector** before enabling auto-sync, to avoid duplicate invoices.
8. **Sequencing:** keep **Always Manual Sync ON** until the pilot (Phase 3) passes on both an invoice order and a card order; only then enable auto-sync.

## Other open questions
- Connector pricing: confirm whether Parex's monthly order limit counts all store orders or only synced (B2B) orders. Asked Parex; awaiting reply.
- Who owns the Xero chart of accounts / VAT settings (confirmed: Humphrey owns Xero).
- **Card-path (Buy now) B2B orders and Xero — RESOLVED (5 June 2026).** Decided: instant-card B2B orders **do** get their own Xero invoice (we do not suspend the fast purchase). The card path carries the PO and `Order Type` as cart **attributes** only (the Storefront cart API cannot set tags or the note), so a **Shopify Flow rule** adds the `B2B Professionals` tag and copies the PO into the order note on order creation, bringing card orders into Parex scope with the PO attached. No website code. See go-live checklist step 4.

## References

- Portal plan + pay-by-invoice build: `docs/development/featurePlans/b2b-professionals-portal.md`
- The route this builds on: `app/api/b2b/invoice-order/route.ts`
- Synergy routing (adjacent, AC5): `docs/development/featurePlans/synergy-3pl-integration.md`
- Parex Xero Bridge (Shopify App Store): https://apps.shopify.com/xero-bridge
- Official Xero Shopify integration (Amaka): https://apps.shopify.com/xero-accounting-integration

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1059 | [Shopify & Subscriptions] B2B Xero invoicing: Shopify-to-Xero connector + PO-to-Reference | 1-3 | To Do |

Relates to SCRUM-1058 (closes its AC6). Sprint 27.
