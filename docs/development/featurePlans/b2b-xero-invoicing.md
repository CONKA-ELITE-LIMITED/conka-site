# B2B Xero Invoicing (Shopify-to-Xero connector)

Get paid B2B orders into Xero automatically as compliant UK VAT invoices, carrying the club's PO as the invoice reference. Closes SCRUM-1058 AC6. Uses an off-the-shelf Shopify-to-Xero connector, no bespoke Xero API build. Sits downstream of the pay-by-invoice path shipped in SCRUM-1058.

See also: `docs/development/featurePlans/b2b-professionals-portal.md` (the portal this completes). VAT decision rationale: `b2b-vat-decision.md`.

> **Consolidated B2B status / next / not-doing: `b2b-consolidated.md`** (start there). This doc holds the detail: connector comparison, go-live checklist, pilot protocol + results, Parex config.

## Resume here — next steps (8 June 2026)

> **RESOLVED — both-path pilot PASSED 8 June 2026** (see "Pilot result + setup done" below): one Xero invoice each, £59 net + £11.80 VAT, B2B Sales, PO in Reference, no DTC synced. Auto Sync enabled. The steps in this section are complete and kept as the working record; programme status lives in `b2b-consolidated.md`.

**MECHANISM CORRECTED 8 June 2026: Road A -> Road B.** Parex support confirmed in writing that the connector **mirrors whatever tax Shopify charged** and does not derive a VAT split: "if no tax has been charged on the order in Shopify... our app will pass the tax code NO VAT." Road A (Shopify at 0%, connector splits the gross) would therefore book every B2B invoice at 0% / NO VAT - non-compliant. So we now go **Road B: enable UK VAT collection in Shopify** (VAT no. GB430507628), inclusive pricing, so Shopify charges the 20% and the connector mirrors it. CONKA is VAT-registered and already accounts for DTC VAT inclusively, so this changes no consumer price. Tracked in **SCRUM-1060**. Rationale + reversal in `b2b-vat-decision.md`. Also confirmed by Parex: the `B2B Professionals` tag filter is now configured (sync gate lifted), no duplicate orders, Silver plan ($15/mo, 100 synced orders, $0.10 over).

**Where we left off (Fri 5 June):** Invoice-route gross-pricing code DONE (commit 027374c5). Shopify B2B variant base price reset to £70.80 DONE. VAT approach decided. **What changed since:** the connector email reversed the mechanism (above); code comments corrected to Road B (SCRUM-1060), no logic change. Nothing is live (whole portal sits on `B2B-PORTAL-FEATURE`).

**DONE Mon 8 June 2026 (Shopify admin, live store):**
- **UK VAT collection ENABLED (Road B switch done).** Settings > Taxes and duties > United Kingdom now "Collecting", VAT no. GB430507628, updated 8 June. Safety gate verified live first: "Include sales tax in product price and shipping rate" is ON, so no consumer price changed (the 20% was always inside the inclusive gross; Shopify now records it as 20% instead of assuming 0%).
- **B2B Flow + Clear variants confirmed taxable** ("Charge tax" ticked on both). The only non-taxable variants are 5 app-reward t-shirts + 3 legacy products (CONKA One Time Purchase, CONKA SHOTS BLACK FRIDAY OFFERS, Liquid 6 Month Plan) — left as-is; they don't sync to Xero (Parex is B2B-tag-scoped) and any legacy-active reprice is an accountant call.
- **Accountant / Humphrey heads-up SENT.** Switchover date 8 June given; they rely on Shopify/Xero VAT figures from that date instead of backing VAT out of gross manually (avoids double-counting). Now applies to all DTC, not just B2B.
- **DTC verified:** add-to-cart through Shopify checkout showed price unchanged and VAT surfaced inclusively. Road B proven on the consumer side.
- **B2B quantity-break discounts CREATED + VERIFIED LIVE (SCRUM-1056).** New `B2B Products` collection (manual, 2 products, unpublished from Online Store / headless-only). Two automatic "Amount off products" discounts targeting that collection, fixed amount **per item** ("only apply once per order" UNCHECKED), min quantity across the collection (combined Flow+Clear), no combinations (no stacking): **B2B Squad 25+** = £8.40/box → £62.40; **B2B Institutional 50+** = £16.80/box → £54.00. Cart-tested on the headless `/professionals/order` checkout: 30 boxes (15+15) → £1,872 inclusive (£312 VAT); 50 boxes (49+1) → £2,700 inclusive (£450 VAT), only the 50+ discount applied (Shopify picks best value, no stacking). Confirms: discount applies to the Storefront-API/headless cart, combined-total triggering works, and inclusive 20% VAT is correct on both tiers — Road B proven end-to-end on the B2B card path.
- **Shopify Flow card-path tagging rule BUILT + TURNED ON.** Trigger Order created → condition "at least one of order custom attributes" value = `B2B Professionals` (True) → Add order tags: `B2B Professionals` + Liquid PO tag (`{% assign po = order.customAttributes | where: "key", "PO Number" | first %}{% if po %}PO {{ po.value | replace: ",", " " }}{% endif %}`). This brings card "Buy now" orders (which only carry cart attributes) into Parex's tag scope with the PO attached, matching the invoice path.
- **Parex re-verified.** Account Details: connected to Conka Elite Limited, Auto Sync OFF / manual sync, 0 orders synced. Tax Settings: Sales Tax Code = "20% (VAT on Income)", Zero Tax Code = "No VAT", Tax Exempt unchecked — so it mirrors the now-live Shopify 20% inclusive onto the Xero invoice (£59 net + £11.80 VAT = £70.80). No "Always Manual Sync" checkbox in this version; keep Auto Sync OFF, re-glance before the pilot.
- **REMAINING: the pilot only.** All config done. One card + one invoice order, manual sync, verify in Xero (one invoice each, net £59 + £11.80 VAT, PO in Reference, B2B Sales, no DTC). Best run with Harry (real card charge). Then enable Auto Sync.

**Done this session (SCRUM-1060, code + records, no Shopify):**
- Corrected the Road A comments in `app/api/b2b/invoice-order/route.ts` and `app/lib/b2bPricing.ts` (Shopify DOES collect VAT; connector mirrors, does not derive). No pricing logic change - the gross-price + discount math is already correct under inclusive 20%.
- Corrected `b2b-vat-decision.md`, this doc, `b2b-professionals-portal.md`, and the project memory from Road A to Road B.

**Do next — Shopify-admin + accountant (manual, no code):**
1. ~~**Shopify: enable UK VAT (the Road B switch).**~~ **DONE 8 June** (UK collecting, GB430507628; inclusive flag verified ON first; no price change).
2. ~~**Accountant heads-up.**~~ **DONE 8 June** (switchover date sent to accountant + Humphrey).
3. ~~**Shopify: finish the discounts.**~~ **DONE 8 June** (B2B Squad 25+ £62.40 / B2B Institutional 50+ £54.00 created + cart-verified inclusive; see progress note above).
4. ~~**Shopify Flow: build the card-path tagging rule.**~~ **DONE 8 June.** Live workflow ("New Workflow", turned on): trigger `Order created`; condition "at least one of order custom attributes" value Equal to `B2B Professionals`; action **Add order tags** with two tags on the True branch — `B2B Professionals` (puts the order in Parex scope) and a Liquid PO tag `{% assign po = order.customAttributes | where: "key", "PO Number" | first %}{% if po %}PO {{ po.value | replace: ",", " " }}{% endif %}` (resolves to `PO <value>`). False branch empty. NB the value-match works because `B2B Professionals` is a value only the `Order Type` attribute carries. The pilot confirms whether Parex reads the PO from this tag or needs the note.
5. **Xero/Parex: email the invoice.** This is a **Xero-side** action, not a Parex toggle (Parex's Tax Settings have no email option; it just creates the Xero invoice as Awaiting Payment). Send the B2B Sales invoice from Xero, or set Xero to auto-email it to the contact. Confirm at the pilot when the first real invoice lands.
6. ~~**Parex: re-confirm "Always Manual Sync".**~~ **Confirmed 8 June** — Account Details shows Auto Sync OFF / "using Manual sync"; there is no separate "Always Manual Sync" checkbox in this Parex version, so just do not enable Auto Sync, and re-glance it stays OFF right before the pilot (~7-day auto-enable risk). Tax Settings verified: Sales Tax Code = "20% (VAT on Income)", Zero Tax Code = "No VAT", Tax Exempt unchecked.
7. **(Optional) Local price-check.** Run `POST /api/b2b/invoice-order` locally (needs the Admin API token + B2B variant IDs in env) to create a test draft order at each tier, confirm totals are £70.80 / £62.40 / £54.00, then delete the test drafts.

**The only thing left is the pilot** (Phase 3 below) — one card order + one pay-by-invoice order, end to end, then a manual sync, then verify in Xero. Best run with Harry (real card charge + mark-paid). All config (VAT, discounts, Flow, Parex) is done and verified.

**Pilot (the de-risk gate):**
8. With Always Manual Sync ON, run the **pilot** (one pay-by-invoice order AND one card order) per the Phase 3 checklist: exactly one Xero invoice each, **net £59 + VAT £11.80 = £70.80** (inclusive 20% now that Shopify charges it, not added on top, not £0 VAT), PO in the invoice Reference, no DTC order touched, invoice emailed to the club. The tag filter is already active, so the only thing the pilot now proves is that the Shopify VAT config flows through end to end.

**After the pilot passes:**
9. Enable auto-sync (untick Always Manual Sync / turn Auto Sync on). The feature is then launch-ready and ships when `B2B-PORTAL-FEATURE` merges. Brief Humphrey from `b2b-vat-decision.md` (non-blocking).

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

**Mechanism CORRECTED (Rudh, 8 June 2026): Road B — enable Shopify UK VAT collection. Road A is dead.** (See SCRUM-1060 and `b2b-vat-decision.md`.)

- **Road A (5 June, NOW DEAD) — leave Shopify VAT off; price the variant at the gross; Parex "inclusive" derives the VAT.** This rested on Parex splitting 20% out of a gross that Shopify taxed at 0%. The vendor confirmed in writing it does the opposite: the connector **mirrors** Shopify's tax and passes NO VAT when Shopify charged none. Road A would book every B2B invoice at 0% / NO VAT - non-compliant. The "definitive confirmation = the pilot" caveat that was flagged below has been answered by the vendor: it would not split.
- **Road B (NOW CHOSEN) — turn on Shopify UK VAT collection** (VAT no. GB430507628, inclusive pricing) so Shopify itemises the 20% and Parex mirrors it onto the Xero invoice. The original rejection (it alters DTC tax reporting, needs a full-store re-verify) proved overstated: CONKA is VAT-registered and already accounts for DTC VAT on the inclusive gross, and with inclusive pricing ON enabling UK VAT changes no consumer price - it only surfaces the VAT line. It needs a switchover-date heads-up to the accountant, not a re-audit.
- **What survives from Road A:** the ex-VAT pricing decision, the gross variant prices (£70.80/£62.40/£54.00), and the invoice-route code (gross-price + discount math is correct under inclusive 20%). Only the Shopify VAT toggle flips.
- **Still needs the accountant** to be told the switchover date (so DTC VAT moves from manual backing-out to the Shopify/Xero figures). Not a mechanism choice.

**Implementation — three layers:**

1. **Shopify config (Harry, not code):** set both B2B variant prices (Flow + Clear) to the **gross Entry rate GBP 70.80**; reconfigure the SCRUM-1056 automatic quantity-break discounts to land on the **gross** tier prices **62.40** (25+) and **54.00** (50+), not the old net 52/45. **Enable UK VAT collection** (Road B, VAT no. GB430507628, inclusive pricing) so Shopify charges the 20% the connector mirrors - verify "include tax in prices" is ON first so consumer prices do not move.
2. **Code (one contained change):** `app/api/b2b/invoice-order/route.ts` discounts down from the variant base to the tier price in **net** terms (`B2B_ENTRY_PRICE = 59`, `tier.pricePerBox`). Once the variant is the gross 70.80, Entry comes out right but Squad/Institutional land GBP 1.40 / 2.80 per box too high (VAT charged on the discount). Fix: compute the base and tier targets in **gross** (`pricePerBox * (1 + B2B_VAT_RATE)`). Must land **together with** the variant reprice — shipping it against the live 59 variant would make tiers 2-3 wrong.
3. **Parex / Xero config:** Sales Tax Code = 20% VAT on Income, Zero Tax Code = No VAT. Under Road B, Shopify charges 20% inclusive, so it sends 70.80 carrying an 11.80 VAT line; the connector **mirrors** that onto the Xero invoice (59 net + 11.80 VAT = 70.80), reconciling against the Revolut deposit.
   - **Verified in Parex (5 June 2026):** Tax Settings tab has Sales Tax Code = `20% (VAT on Income)`, Zero Tax Code = `No VAT`, Tax Exempt **unchecked**. **Parex exposes NO inclusive/exclusive toggle** - it mirrors whatever tax Shopify charged (vendor-confirmed in writing, 8 June). With Road B, Shopify charges 20% inclusive, so the connector books 20% VAT on Income. (Under the dead Road A, Shopify charged 0%, so the connector would have booked No VAT.)
   - **Verified in Shopify (5 June 2026):** Settings > Taxes and duties > Global settings > **"Include sales tax in product price and shipping rate" is ON** (tax-inclusive). At that time UK showed "Collecting -" / 0% rate. **Road B action (SCRUM-1060):** add United Kingdom with VAT no. GB430507628 so Shopify collects 20%. Because inclusive pricing is ON, consumer prices do not change - the VAT is simply surfaced. (This is the reversal of the old "do not register UK VAT" Road A instruction.)
   - **Confirmation = the pilot:** with Road B live, Shopify charges 20% and the connector mirrors it. The pilot invoice must read net 59 + VAT 11.80 = 70.80. If it shows 0% VAT, Shopify is not actually charging the VAT (re-check the UK tax config); if VAT is added on top (70.80 + 11.80), the inclusive flag is off. Either is a config fix, not a redesign.

- Resolving VAT does **not** block verifying the Parex sync mechanics (one invoice, B2B Sales account, PO in Reference) on a current zero-VAT order; but the gross reprice + code change + Parex inclusive must all be in place before B2B go-live, or the club is undercharged. Owner: Rudh + Humphrey / accountant.

## Go-live checklist (agreed 5 June 2026)

The full set of actions to get both B2B paths invoicing correctly into Xero. Card and pay-by-invoice orders both produce a Xero VAT invoice; the fast card purchase is not blocked. Now on **Road B** (SCRUM-1060): the remaining gate is enabling Shopify UK VAT, then the pilot.

1. **Reprice the boxes to gross + enable UK VAT (Shopify, Harry).**
   - **DONE (5 June 2026):** both B2B variants (Flow + Clear) base price set to **GBP 70.80** (gross Entry rate). Fixes the Entry tier on both paths.
   - **DONE (8 June 2026):** SCRUM-1056 automatic quantity-break discounts created on a `B2B Products` collection, fixed amount per item, min-quantity combined across the collection, no stacking — **62.40** (25+, £8.40/box off) / **54.00** (50+, £16.80/box off). Cart-verified on the headless checkout (30 boxes → £1,872 / £312 VAT incl; 50 boxes → £2,700 / £450 VAT incl; best-value selection, no stacking). Card path now correctly priced on all tiers.
   - **DONE (8 June 2026, Road B, SCRUM-1060):** UK VAT collection enabled (Settings > Taxes and duties > United Kingdom, VAT no. GB430507628, "Collecting"). "Include tax in prices" verified ON first, so consumer prices did not move. Shopify now charges the 20% inclusive that the connector mirrors. Accountant + Humphrey given the 8 June switchover date.
2. **Invoice-route code change (code) — DONE (commit 027374c5).** `app/api/b2b/invoice-order/route.ts` now computes the tier discount in **gross** terms via `getB2BGrossPerBox`, so all tiers' draft orders match the gross tier price. Nothing is live (the whole B2B portal sits on the `B2B-PORTAL-FEATURE` branch, not `main`), so this ships together with everything else; the reprice above already satisfies the gross-variant assumption.
3. **Parex tax treatment (Parex, Harry).** Sales Tax Code = 20% VAT on Income, Zero Tax Code = No VAT. The connector **mirrors** Shopify's tax (no inclusive/exclusive toggle in Parex), so once Road B has Shopify charging 20% inclusive, it books the GBP 70.80 gross as 59 net + 11.80 VAT on the Xero invoice.
4. **Card path into scope via a Shopify Flow rule (Shopify Flow, no website code).** The card path builds the order through the Storefront cart API, which **cannot set order tags or the note** — it only attaches cart *attributes* (`Order Type`, PO). So add a Flow rule: *on order created, if `Order Type = B2B Professionals`, add the `B2B Professionals` tag and copy the PO attribute into the order note*. This puts instant-card B2B orders into Parex's tag scope with the PO attached, exactly like the pay-by-invoice path. Without this, card orders either do not sync or sync without the PO.
5. **Email the Xero VAT invoice to the club (Xero/Parex config).** Neither Shopify surface (card checkout, hosted draft invoice) itemises VAT — the compliant VAT invoice is the **Xero** one. Set Xero (or Parex) to auto-email B2B Sales invoices to the order contact so the club receives their VAT document for reclaim. Without this the buyer pays but has no VAT invoice in hand.
6. **Parex B2B-only tag filter — CONFIRMED (8 June 2026).** Parex configured the sync to only orders tagged `B2B Professionals` (vendor email). The sync gate is lifted; keep Always Manual Sync ON only until the pilot passes, then enable auto-sync (step 7). Vendor also confirmed: no duplicate orders, Silver plan $15/mo for 100 synced orders ($0.10 each over).
7. **Disconnect any legacy / native Shopify-to-Xero connector** before enabling auto-sync, to avoid duplicate invoices.
8. **Sequencing:** keep **Always Manual Sync ON** until the pilot (Phase 3) passes on both an invoice order and a card order; only then enable auto-sync.

## Other open questions
- Connector pricing: confirm whether Parex's monthly order limit counts all store orders or only synced (B2B) orders. Asked Parex; awaiting reply.
- Who owns the Xero chart of accounts / VAT settings (confirmed: Humphrey owns Xero).
- **Card-path (Buy now) B2B orders and Xero — RESOLVED (5 June 2026).** Decided: instant-card B2B orders **do** get their own Xero invoice (we do not suspend the fast purchase). The card path carries the PO and `Order Type` as cart **attributes** only (the Storefront cart API cannot set tags or the note), so a **Shopify Flow rule** adds the `B2B Professionals` tag and copies the PO into the order note on order creation, bringing card orders into Parex scope with the PO attached. No website code. See go-live checklist step 4.

## SCRUM-1061: pay-by-invoice hardening + both-path pilot (8 June 2026)

Scoped on `b2b-invoice-hardening` (branched off `B2B-PORTAL-FEATURE`). Two small form fixes, then the pilot that gates go-live.

**Investigation correction:** the finance email is NOT a code hole - it is already enforced client-side (`B2BOrderBuilder.tsx` `handleInvoice()` early-returns on a failed email regex) and server-side (`invoice-order/route.ts` zod `.email()`). The only gap is UX: the "Pay by invoice" button is not disabled when the email is empty, so it errors on click instead of being greyed out. PO is optional on both paths by design.

**Decisions (Rudh, 8 June):** require PO on the **pay-by-invoice path only** (card stays optional, frictionless); **disable the "Pay by invoice" button** until a valid finance email is entered.

### Phase 1 - form hardening (code)

1. `B2BOrderBuilder.tsx`: block invoice submit + show error if PO empty; show "(optional)" PO hint only on the card path. Card `handleBuyNow()` unchanged.
2. `invoice-order/route.ts`: tighten zod so `poNumber` is required/non-empty. `cart/route.ts` (card) PO stays optional.
3. `B2BOrderBuilder.tsx`: extend the invoice button `disabled` to also require a valid finance email (reuse `EMAIL_RE`); keep the on-submit error as a backstop.

### Phase 2 - the pilot protocol (run with Harry)

The de-risk gate. Run BOTH paths end to end against the live store, then verify in Xero.

1. **Pre-check:** in Parex, confirm **Auto Sync is OFF** (Account Details). Re-glance because Parex can auto-enable it ~7 days post-install.
2. **Card path:** from `/professionals/order`, build a small order, "Buy now", pay with a real card (smallest viable order). Confirm the Shopify Flow tagged it `B2B Professionals` and the order carries the PO.
3. **Invoice path:** build a small order, enter PO + finance email, "Pay by invoice" -> a Shopify draft order is created and the invoice emailed. Mark the draft **paid** in Shopify admin.
4. **Sync:** in Parex, click **Sync Orders Manually**.
5. **Verify in Xero, per order:**
   - Exactly **one** invoice (no duplicate from the draft conversion).
   - **Net GBP 59 + VAT GBP 11.80 = GBP 70.80** per box at the relevant tier (inclusive 20%, not added on top, not 0%).
   - **PO in the invoice Reference** (this is also the test of the Flow PO tag, and which field Parex reads - note vs tag).
   - Booked to **B2B Sales**; **no DTC order** synced.
   - Marked-paid order **routed to Synergy** (adjacent SCRUM-1058 AC5 check).
6. **Invoice email:** confirm the B2B Sales invoice reaches the club's finance email (Xero-side send/auto-email, owner Humphrey).
7. **Clean up:** void/refund the test card order; delete any test draft.
8. **On pass:** enable Parex Auto Sync; close SCRUM-1060.

**Fail diagnostics:** 0% VAT on the invoice -> Shopify is not charging VAT on that variant (recheck "Charge tax" + UK collection); VAT added on top (70.80 + 11.80) -> inclusive-pricing flag is off; duplicate invoice -> draft-conversion issue (the thing the pilot exists to catch); no PO in Reference -> Parex reads the other field, swap note vs tag.

## Pilot result + setup done (8 June 2026)

**Invoice-path pilot: PASSED on the core dimensions.** Ran a 1-box pay-by-invoice order (draft -> marked paid -> Parex manual sync) and checked Xero:
- One invoice, **net GBP 59 + VAT GBP 11.80 = GBP 70.80 inclusive** (Road B proven end to end: Shopify charged 20% inclusive, Parex mirrored it).
- Booked to **B2B Sales**.
- **All DTC orders "Ignored"** in Parex (tag filter works, zero DTC synced).
- Shopify auto-emailed the invoice to the finance email.
- **PO in the Xero Reference - FIXED + VERIFIED (8 June).** Initially Parex defaulted the Reference to the prefixed order number (`SPY-3514`) with no PO. Parex support (Mahek, 8 June) configured the connector to sync the Shopify order **Note** value into the Xero invoice **Reference** for all future orders, and retro-updated order #3514. **Verified on our side: #3514's Reference now shows the PO.** Applies automatically to future orders (re-confirm on the card-path pilot order).

**Card-path pilot: PASSED (8 June).** Ran a 1-box "Buy now" **card** order (#3517, Shopify Payments, via Conka Headless). The Shopify Flow tagged it `B2B Professionals` + PO, it synced to Xero with net GBP 59 + VAT GBP 11.80 inclusive, B2B Sales, and **the PO in the Reference** - confirming the PO flows on the card path even though the card order **Note is empty** (the Storefront cart cannot set the note; Parex picks the PO up from the `PO …` tag the Flow adds). Order then **refunded** (GBP 70.80 to card, restocked). **Both paths now proven end to end.** Note for Harry: #3517 settled via Shopify Payments, not the Revolut transfer Parex's deposit setting assumes - confirm card-settled orders reconcile.

**Test-data cleanup before go-live:** the pilot/test orders (#3513 cancelled, #3514 invoice, #3516 bank deposit, #3517 card-refunded) all synced to Xero. Void/delete their Xero invoices and cancel the Shopify test orders so the B2B Sales account is clean before Auto Sync is enabled.

**Bank-transfer payment path set up (Shopify, no code).** Added a **Bank Deposit** manual payment method (Settings > Payments) with CONKA's bank details (Conka Elite Limited, sort 60-21-03, acct 48757438) and "use your PO number as the payment reference". So a no-card club selects Bank Deposit at the invoice checkout, gets the bank details on the confirmation + email, transfers quoting the PO, and Harry marks the order paid when it lands in Revolut. Verified: the confirmation page shows the bank details correctly.

**Bank Deposit scoped to B2B only (Shopify app, no code).** Bank Deposit is a store-wide method, so it would otherwise show on DTC checkout. Installed **ETP "Hide & Sort Payments"** (free, Built for Shopify, payment customizations) and added a rule: **hide Bank Deposit when the cart does NOT contain a product from the `B2B Products` collection.** So DTC checkouts never show it; both B2B paths (card + invoice, which carry the Team Box products) do. Verified working. (Payment customizations are NOT Plus-gated for UK; the credit-card restriction that needs Plus only applies to US/Canada.)

**Customer payment experience, confirmed working:** invoice email -> "Complete your purchase" -> checkout shows **Credit card / PayPal / Bank Deposit** -> Bank Deposit places a *pending* order and shows the bank details. Card auto-marks paid; bank transfer is marked paid by Harry on receipt.

## References

- Portal plan + pay-by-invoice build: `docs/development/featurePlans/b2b-professionals-portal.md`
- The route this builds on: `app/api/b2b/invoice-order/route.ts`
- Synergy routing (adjacent, AC5): `docs/development/featurePlans/synergy-3pl-integration.md`
- Parex Xero Bridge (Shopify App Store): https://apps.shopify.com/xero-bridge
- Official Xero Shopify integration (Amaka): https://apps.shopify.com/xero-accounting-integration

## Jira

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1059 | [Shopify & Subscriptions] B2B Xero invoicing: Shopify-to-Xero connector + PO-to-Reference | 1-3 | Done (pilot passed 8 Jun 2026) |
| SCRUM-1060 | [Shopify & Subscriptions] B2B VAT: enable Shopify UK VAT collection (Road B) | 1-3 | Done (pilot passed 8 Jun 2026) |
| SCRUM-1061 | [Website & CRO] B2B order page: require PO + gate finance email on pay-by-invoice, then pilot both paths to Xero | 1-2 | Done (pilot passed 8 Jun 2026) |

Relates to SCRUM-1058 (closes its AC6). Sprint 27.
