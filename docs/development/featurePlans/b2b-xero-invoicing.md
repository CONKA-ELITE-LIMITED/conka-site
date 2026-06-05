# B2B Xero Invoicing (Shopify-to-Xero connector)

Get paid B2B orders into Xero automatically as compliant UK VAT invoices, carrying the club's PO as the invoice reference. Closes SCRUM-1058 AC6. Uses an off-the-shelf Shopify-to-Xero connector, no bespoke Xero API build. Sits downstream of the pay-by-invoice path shipped in SCRUM-1058.

See also: `docs/development/featurePlans/b2b-professionals-portal.md` (the portal this completes).

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

Run one real paid B2B order end to end and confirm:
- Exactly one Xero invoice is created (no duplicate from the draft-order conversion).
- The invoice carries the correct line items, GBP amounts, and 20% VAT.
- The PO appears in the Xero invoice Reference.
- No DTC orders were touched.
- The marked-paid order also routed to Synergy (SCRUM-1058 AC5, adjacent check).

Only after this passes is Phase 1's field choice (note vs tag) locked. If the connector wants the PO formatted or carried differently, adjust the small Phase 1 change then.

## Technical decisions and rationale

| Decision | Rationale |
|----------|-----------|
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

## Open questions

- Connector choice, pending the Parex / Amaka support answers. Does not block Phase 1.
- Who owns the Xero chart of accounts / VAT settings (Harry vs accountant), for Phase 2.

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
