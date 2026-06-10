# Synergy 3PL Shopify Integration

**Status:** In progress
**Created:** 2026-06-02
**Hard deadline:** 4 June 2026 (Synergy kickoff call, ahead of next production run)
**Jira:** SCRUM-1051 (metafields + tags, done) plus the phase tickets listed below
**Owner:** Rudh (Shopify config) with Humphrey (ops data: EANs, customs, couriers)

---

## CURRENT STATUS (2026-06-10)

**DONE:**
- Phase 1 Connect — Dev Dashboard app, credentials, base URL, Synergy location; connection confirmed.
- Phase 2 SKU readiness — weight/HS/country on the 2 physical boxes; **EANs set** (`FLOWFUNNEL28` / `CLEARFUNNEL28` in the Barcode field).
- SKU file **approved by Bethany**.
- **Shipping config in Shopify** — UK (Express/Evri free + 24 Hour Delivery/DPD £6.54); international zones kept and re-priced to Evri cost (Africa £42, Australia £28, NZ £38, Canada split out £36, USA £22, Europe £14.40, etc.); all intl rates named `Express International`. Detail: `docs/shipping/SHIPPING_AND_COURIERS.md`.
- **Synergy shipping-methods sheet returned** (Express→Evri, 24 Hour Delivery→DPD, Express International→Evri/DAP).
- **3 test orders created** (#3522, #3523, #3524) — open + paid + unfulfilled, moved to the Synergy location, IDs sent to Bethany.
- Pallet economics analysed (EFM rates) → parcels cheaper until ~60 boxes; email sent to Bethany sense-checking the logic.

**WAITING ON (external):**
- **Richard** — transfer SKUs to Synergy's live system (gate for the 3 test orders to pull through).
- **Synergy** — map the carriers from the returned sheet (service codes); then run the test orders end-to-end and write back carrier + tracking.
- **Bethany** — replies on: per-parcel handling fee, international freight/pallet option, and confirmation of the carton/parcel logic.

**LEFT TO DO (CONKA side):**
- Once test orders pass: **go-live cutover** — stock the 3 funnel SKUs at Synergy + switch them to fulfil from Synergy (Phase 5).
- Post-test cleanup: set the Synergy stock on the 3 SKUs back to 0 (added only to route the test orders).
- Confirm where B2B / large orders fulfil (Synergy vs Burnside) — decides whose carriers handle bulk.
- Fast-follow (not blocking): DHL `International Priority` upgrade; pallet `Pallet`→EFM row when bulk volume appears; US USD/DDP rate.

**DO NOT:** fulfil, label, or cancel the 3 test orders until Synergy confirms the writeback.

---

## Problem

CONKA is onboarding Synergy ("Fulfil with Synergy") as a fulfilment 3PL. Synergy runs a middleware "Connector" that syncs SKUs, inventory, orders and shipments between Shopify and their WMS over the Shopify Admin API. The Connector cannot pull data or fulfil until Shopify exposes the right API credentials, a warehouse location, the required SKU attributes, and visible courier services. Burnside remains the current 3PL for all legacy SKUs during and after the switch.

This serves operations and fulfilment reliability, and indirectly retention (accurate stock, FEFO so no near-expiry bottles ship).

## Scope context

Only the 3 funnel products go to Synergy: CONKA Flow AM, CONKA Clear PM, CONKA Flow + Clear (6 variants total). Everything else is legacy and stays with Burnside, already excluded via the `SYNERGYIGNORE` tag.

**Key physical fact:** there is only ONE physical unit, a box of 28 shots, either Flow or Clear. Everything else is a count of those boxes. So only 2 variants are real physical SKUs; the other 4 are virtual bundles built from them.

| Variant | SKU | Role | Physical contents |
|---------|-----|------|-------------------|
| Flow - 28 Shots | `FLOW-FUNNEL-28` | **Physical** | 1 Flow box |
| Clear - 28 Shots | `CLEAR-FUNNEL-28` | **Physical** | 1 Clear box |
| Flow - 84 Shots | `FLOW-FUNNEL-84` | Virtual bundle | 3 Flow boxes |
| Clear - 84 Shots | `CLEAR-FUNNEL-84` | Virtual bundle | 3 Clear boxes |
| Both - 56 Shots | `BOTH-FUNNEL-56` | Virtual bundle | 1 Flow + 1 Clear box |
| Both - 168 Shots | `BOTH-FUNNEL-168` | Virtual bundle | 3 Flow + 3 Clear boxes |

Base URL for Synergy: `https://conka-6770.myshopify.com`

## Already done (SCRUM-1051)

- 3 variant metafield definitions: `custom.batchexpiry`, `custom.bundlecomposition`, `custom.disableinvsync`
- `BATCHEXPIRY` on the 2 physical box variants (`FLOW-FUNNEL-28`, `CLEAR-FUNNEL-28`); blank on the 4 bundles
- `BundleComposition` on the 4 virtual bundles:
  - `FLOW-FUNNEL-84` -> `3xFLOW-FUNNEL-28`
  - `CLEAR-FUNNEL-84` -> `3xCLEAR-FUNNEL-28`
  - `BOTH-FUNNEL-56` -> `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28`
  - `BOTH-FUNNEL-168` -> `3xFLOW-FUNNEL-28+3xCLEAR-FUNNEL-28`
- `SYNERGYIGNORE` tag on all legacy / non-funnel products (Active + Archived)

> Correction (2026-06-02): the 84-shot variants were initially set as standalone with `BATCHEXPIRY`. They are actually 3 boxes of 28, so they were switched to virtual bundles of `3x` the 28-box, and `Both 168` was repointed from the (non-physical) 84-boxes to `3x` the 28-boxes. Only the two 28-boxes are physical.

## Approach

Sequenced Shopify-admin configuration plus ops-data gathering from Humphrey. No website code change required: the customer portal was audited and is safe (orders are read-only post-checkout, and our code never reads or writes Shopify order tags, so the `IMPORTSYNERGY` tag is never at risk).

**Correction captured:** the app is created via the Shopify **Dev Dashboard** (produces App Client ID + Client Secret and an install step), not the in-admin Develop-apps Admin API access-token flow. Confirmed by Synergy's PDF, which links the Dev Dashboard create-apps doc and asks for Client ID + Secret.

## Required API scopes (definitive, from Synergy PDF)

```
read_orders, write_orders, read_all_orders
read_products, write_products
read_customers, write_customers
read_inventory, write_inventory
read_locations
read_fulfillments, write_fulfillments
read_merchant_managed_fulfillment_orders, write_merchant_managed_fulfillment_orders
read_assigned_fulfillment_orders, write_assigned_fulfillment_orders
read_shipping, write_shipping
```

## Key confirmed facts (2026-06-03)

- **Go-live date: 9 June 2026** (per signed contract; conditional on testing passing). The 4 June was the kickoff call only.
- **Connection is live** - Synergy confirmed the Shopify API connection works (initial connection established; not all parameters checked yet).
- **Box weight = 2.1 kg** per 28-shot box (Humphrey confirmed; 2.5kg was the DHL rounding band).
- **HS code = `21069099`** (food preparations; same for both Flow and Clear; CONKA already uses this).
- **Country of origin = UK.**
- **No printed barcode** on the boxes. Synergy has agreed to receive the next ~20,000 boxes WITHOUT barcodes and will identify products by the **unique SKU** instead. So the Shopify Barcode field stays **blank**; the SKU (`FLOW-FUNNEL-28`, `CLEAR-FUNNEL-28`) is the identifier. (Contract clause 6.1(d) requires a per-SKU barcode, so printing barcodes on a future production run remains an outstanding obligation, but it is waived for now.)
- **US shipping decisions (Humphrey):** customers pay in **USD** (per Shopify), price **scaled by box count** and ideally **inclusive of tax/tariffs**, **all products** offered to the US to start. Actual price numbers still to be set (need DHL cost by US zone + tariff estimate).

## Update (2026-06-08, Bethany email exchange)

- **EANs now REQUIRED (reverses the "barcode blank" decision above).** Synergy's SKU file came back fine except the 2 physical boxes were missing EANs (bundles correctly need none). Bethany confirmed they do NOT need official GS1 EANs: the value can be **any arbitrary unique string** as long as (a) it is unique per physical SKU and (b) the printed barcode label matches the value exactly, in **EAN or Code 128** format. Chosen values: **`FLOWFUNNEL28`** and **`CLEARFUNNEL28`** (no hyphens), printed as **Code 128** (alphanumeric, so not a real EAN-13). To enter in the Shopify **Barcode** field on both physical boxes (the connector reads it from there). Caveat from Bethany: changing the EAN later while stock is in their building means relabelling existing stock.
- **Barcode labelling effort:** Synergy estimate 3 hours to label the initial inbound of **156 cartons WC 15 June** (they open each carton to verify contents before labelling). Humphrey to confirm whether the co-packer can apply labels instead. (Humphrey to reply directly.)
- **Bundle breakdown CONFIRMED by Synergy** (matches our `BundleComposition`): 168 = 3×Flow28 + 3×Clear28; 56 = 1+1; Flow84 = 3×Flow28; Clear84 = 3×Clear28.
- **Shipping mapping — outstanding question sent to Bethany.** Audited the live Shopify shipping config (Settings > Shipping, single "General profile", fulfilled from Burnside, 10 zones, all manual flat rates, NO carrier accounts). Rate names: UK has **"Express"** (Free, 1-3 days) and **"24 Hour Delivery"** (£4.33); every international zone uses the **identical title "Express International"** at a flat GBP price (USA & Canada £20.27, Australia £24.97, Africa £35.43, etc.). CONKA ships worldwide so all 10 zones must be mapped. **Open question to Bethany:** does Synergy map orders on shipping-method-name alone or name + destination country? If name-only, the duplicate "Express International" titles collide and each zone's rate must be renamed uniquely (e.g. "Express International USA") before the sheet works.

## Update (2026-06-09, Bethany reply — shipping mapping RESOLVED)

- **Synergy maps carrier/service on shipping-method NAME ONLY.** Bethany confirmed: "whenever you have a unique carrier/service, we need a unique shipping method. We map it purely on the shipping method for assigning the carrier and service." Destination country is NOT used for routing — it is only used for **invoicing** (they bill on carrier + service + country + weight). The price shown to the customer is irrelevant to Synergy.
- **Consequence: the shared "Express International" title is FINE, no mass rename needed.** Because all international zones using the one name "Express International" simply means they ALL map to the same one carrier/service. That is the intended behaviour as long as CONKA is happy to use a single carrier for all international destinations (USA £20.27 and South Africa £35.43 both going as "Express International" is the exact example Bethany approved). The earlier worry about "collision" was backwards: name-only mapping makes the shared name a feature, not a bug.
- **A unique name is only needed where a unique carrier is wanted.** Decision is now an ops one, not a Shopify-config one: *one carrier for all international, or a distinct carrier for the US?*
- **Plan of record:**
  1. Keep **"Express International"** as-is for all non-US international zones → one international carrier (Synergy picks per clause 4.1 unless CONKA names a preferred). Sheet can be filled essentially as-is.
  2. Give the **US its own unique method name** (e.g. "Express International USA" / "USA SHIPPING") when the USD / scaled / DDP rate is built, so Synergy routes it to a distinct US carrier/service. No collision since the name is unique.
  3. **UK** keeps "Express" and "24 Hour Delivery" — already distinct names → maps to a UK carrier fine.
- **Net:** shipping mapping question is resolved. Remaining shipping work is (a) fill Synergy's dispatch-method sheet with the names above, (b) build the real US USD/DDP rate under a unique name (separate, unstarted), (c) B2B/pallet shipping (separate workstream).

## Update (2026-06-09, carrier choices from Humphrey + sheet still open)

Humphrey's carrier answer (partial — used to draft the Synergy dispatch sheet):
- **UK standard ("Express"):** Evri default; DPD as a non-default alternative.
- **UK next-day ("24 Hour Delivery"):** paid upgrade, charge the full actual cost (so the current £4.33 needs raising). Carrier NOT explicitly named — assumed DPD Next Day, **to confirm**.
- **International ("Express International"):** Evri as default (Royal Mail can't carry >2kg and our box is 2.1kg), with a DHL paid premium option. If Evri underperforms, switch default to DHL and absorb some/all cost.

Decisions now locked (Humphrey, 9 Jun):
- **UK:** Evri default + DPD as a customer-selectable option (= two UK rates, each uniquely named so Synergy maps Evri vs DPD).
- **International:** Evri default + DHL as a customer-selectable paid upgrade (= two international rates, each uniquely named, identical name across all zones, price varies per zone).
- **Incoterms = DAP on ALL international** (customer clears/pays duties on arrival; the "consumer pays" model). Applies to both the Evri and DHL international rows. Does NOT affect the separate future US-only USD duties-inclusive (DDP) rate, which is a later build under its own name.

**DECISIONS LOCKED 9 Jun (Humphrey unresponsive, so Rudh+Claude called them to unblock; none need his input to be safe):**
- Evri UK service = **Standard** (Synergy completes the exact service code).
- "24 Hour Delivery" = **DPD Next Day**. Price stays **£4.33 for now** (Synergy ignores price; the "charge full cost" bump is a separate non-blocking Shopify edit once the true DPD cost is known).
- International launch = **Evri only** (DAP). DHL "International Priority" = **fast-follow** (add rates to ~9 zones later, once Evri performance is seen). Not used by any test order.
- Pallet / large B2B = **separate scoped workstream**; interim = Harry adds a manual `Pallet` shipping line to the draft order. Not in this sheet, not blocking go-live.

**FINAL sheet to send Synergy now (3 rows — covers all 3 test orders):**
```
Express              | Evri | Standard      | UK  | n/a
24 Hour Delivery     | DPD  | Next Day      | UK  | n/a
Express International | Evri | International  | ROW | DAP
```
(DHL `International Priority` row added later when that option is built.)

Clarification reinforced to Humphrey: price already varies by zone under one method name (Synergy ignores price), so per-zone carrier splitting is NOT needed; separate method names are only needed where the carrier itself changes (Evri vs DPD, Evri vs DHL).

Provisional sheet (column 1 = exact Shopify names; names must be identical across all zones they cover):
```
Shipping Method       | Carrier | Service      | Market | INCOTERMS
Express               | Evri    | (service?)   | UK     | n/a
24 Hour Delivery      | DPD     | Next Day     | UK     | n/a
Express International  | Evri    | International | ROW    | DAP
International Priority | DHL     | Express      | ROW    | DAP
```
(`International Priority` = placeholder name for the DHL upgrade; final name TBC. The two UK rates and two international rates are each customer-selectable options at checkout, default = the cheaper Evri one.)

**Website config implied (no code, Shopify Settings > Shipping):** add the DPD option to the UK zone (likely already exists as "24 Hour Delivery") and add a second DHL-named rate to each of the ~9 international zones with the DHL price. Decide launch vs fast-follow for the DHL international option.

## Update (2026-06-09, Bethany — SKUs approved + 3 test orders specified)

- **SKU sync APPROVED.** Bethany confirmed the SKU file is OK; Richard to transfer them to Synergy's **LIVE** system when free (flagged maybe not Tue 9 Jun, his busiest day). Gate to Synergy holding/seeing stock.
- **3 test orders requested** (ideally created AFTER shipping methods are mapped, so the carrier/tracking writeback can be tested):
  - Order 1: `FLOW-FUNNEL-28` × 1, method **"Express"** (UK) — single SKU/unit
  - Order 2: `FLOW-FUNNEL-28` × 2 + `CLEAR-FUNNEL-28` × 2, method **"24 Hour Delivery"** (UK) — multi-SKU/multi-unit
  - Order 3: `BOTH-FUNNEL-56` × 1, method **"Express International"** (non-UK address) — bundle
- **Order requirements:** assigned to the **Synergy location**, status **open + paid + unfulfilled**, and **LEFT in Shopify — do NOT cancel** until Synergy confirms systemic shipment + carrier/tracking writeback (cancelling kills the writeback test). Send the 3 order IDs to Bethany → she passes to Richard.
- **Critical path / blockers for the test orders:**
  1. Richard transfers SKUs to Synergy live (in progress).
  2. Humphrey's shipping answers (incoterms + 24hr carrier) → fill & return the mapping sheet → Synergy assigns service codes. Required for the carrier/tracking-writeback half of the test.
  3. **NEW dependency — routing to the Synergy location.** Funnel SKUs are stocked at Burnside and these products are live and selling; the 3 test orders' fulfillment must land at the Synergy location WITHOUT routing real customer orders there pre-go-live. Confirm the mechanism with Richard (token stock at Synergy + manual fulfillment move vs temporary location priority).
  4. **Order-creation mechanism:** draft order in Admin (type the shipping line name manually to match exactly, set a test email + correct address, mark as paid → open/paid/unfulfilled). Order 3 needs an international address to surface "Express International".
- **Recommended sequence:** Humphrey answers → sheet to Synergy → Richard confirms SKUs live + routing settled → create the 3 orders → send IDs. Do NOT create them before the carrier mapping exists.

## Update (2026-06-10, test orders CREATED + shipping config DONE)

- **Shopify shipping config DONE.** UK: Express (Evri, free) + 24 Hour Delivery (DPD, £6.54). International: kept the existing ~10 zones, all rates named `Express International` (Evri), prices tuned to Evri cost — Africa £42, Australia £28, NZ £38, Canada split into its own zone £36 (USA stays £22), Channel Islands rate renamed to `Express International`, Europe/france/Caribbean/Middle East left as-is. Full detail in `docs/shipping/SHIPPING_AND_COURIERS.md`.
- **Synergy shipping sheet sent** (3 live rows + a pre-listed DHL `International Priority` row for later): Express|Evri|Standard|UK|n/a · 24 Hour Delivery|DPD|Next Day|UK|n/a · Express International|Evri|International|ROW|DAP.
- **3 test orders CREATED 2026-06-10** — all open + paid (via draft order → Mark as paid, £0 actually charged) + unfulfilled, fulfillment location manually moved to **Synergy Warehouse**:
  - **#3522** — FLOW-FUNNEL-28 ×1 — Express
  - **#3523** — FLOW-FUNNEL-28 ×2 + CLEAR-FUNNEL-28 ×2 — 24 Hour Delivery
  - **#3524** — BOTH-FUNNEL-56 ×1 — Express International (USA address)
  - Order IDs sent to Bethany. **Leave untouched — no fulfil, no label, no cancel** until Synergy confirms carrier + tracking writeback.
- **Routing mechanism used:** stocked FLOW-FUNNEL-28, CLEAR-FUNNEL-28 and BOTH-FUNNEL-56 with 10 units each at the Synergy location; orders auto-assigned to Burnside (the default) on creation, then manually moved to Synergy via the fulfillment card. Confirms real orders default to Burnside (low leakage risk).
- **Cleanup for later (post-test):** set the Synergy quantities on the 3 SKUs back to 0 so no real orders route there pre-go-live.
- **Still pending:** Richard's SKU transfer to Synergy's live system (gate for the orders to pull through); Synergy carrier-mapping of the sheet; pallet answers from Bethany.
- **US shipping reality check:** the planned USD / scaled-by-box / tax-inclusive (DDP) US rate does NOT exist yet. Current US rate is a flat **£20.27 GBP "Express International"**. Building the real US rate is unstarted (separate from the mapping sheet).
- **B2B / pallet shipping = separate workstream (confirmed with Rudh).** No size/weight-based pallet rate exists in any zone, and B2B draft orders set no shipping line in code (`app/api/b2b/invoice-order/route.ts`), so a B2B order reaches Synergy with a blank shipping method. Bethany's "force 6+ boxes onto a pallet service" ask is a build, not a mapping. To be scoped separately.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Connect: Dev Dashboard app + credentials + base URL + Synergy Location | DONE (connection confirmed working) |
| 2 | SKU readiness: HS code, weight, country on the 2 physical boxes; inventory tracked by Shopify; barcode blank | DONE (data entered; pending Synergy SKU file sync) |
| 3 | Couriers: UK free, USA scaled USD price inclusive of tax/tariffs | Active (carriers chosen; incoterms + sheet pending Humphrey) |
| 4 | Testing: 3 specified test orders against Synergy LIVE system; carrier/tracking writeback | Active (spec received from Bethany; blocked on shipping sheet + SKU live transfer + Synergy-location routing) |
| 5 | Go-live (9 June): live SKU-name sync, single live sanity order | Future |

### Phase 1: Connect - DONE

1. Dev Dashboard app `Synergy WMS` created with the 18 scopes, installed on `conka-6770`. Client ID + Secret + base URL sent to Synergy (secret via one-time secret link).
2. Synergy Warehouse location created; Burnside retained as Default location for legacy SKUs.
3. Synergy confirmed the connection works.

### Phase 2: SKU readiness - DONE (data entered 2026-06-03)

Entered on both physical boxes (`FLOW-FUNNEL-28`, `CLEAR-FUNNEL-28`): weight 2.1kg, HS code base `2106.90` + UK-specific `2106.90.99`, country of origin United Kingdom, barcode left blank, inventory tracked by Shopify (currently stocked at the Burnside location). The 4 bundles were left untouched. Remaining: notify Bethany so Synergy syncs the SKU file (the gate to them receiving stock).

Original spec - enter on the **2 physical boxes only** (`FLOW-FUNNEL-28`, `CLEAR-FUNNEL-28`):
- **Barcode:** leave BLANK (Synergy identifies by SKU; no barcode for the next ~20,000 boxes).
- **Weight:** 2.1 kg (Shipping section).
- **HS code:** `21069099` (Shipping > Customs information).
- **Country of origin:** United Kingdom (same place).
- **Inventory tracking = Shopify** on the funnel variants so the Connector extracts them (verify it is not managed by a Burnside fulfilment app; if it is, coordinate the switch as part of cutover).

The 4 virtual bundles (`FLOW-FUNNEL-84`, `CLEAR-FUNNEL-84`, `BOTH-FUNNEL-56`, `BOTH-FUNNEL-168`) need none of these attributes; they are built from the 2 boxes via `BundleComposition`.

Then notify Bethany the SKU attributes are done so Synergy can sync the SKU file (the gate to them receiving stock).

### Phase 3: Couriers / US shipping

- **UK:** free to customer; Synergy picks the carrier (clause 4.1) unless CONKA names a preferred one. Likely just a "Free UK shipping" rate (probably already exists).
- **US:** customers pay USD, price scaled by box count, inclusive of tax/tariffs, all products available. Still need: the DHL cost for the US (which DHL zone is the USA, Air vs Road) plus a tariff estimate, then set the scaled USD rates in Settings > Shipping. Visible to Synergy via `read_shipping`.

### Phase 4: Testing (Active — needs sheet returned + SKUs live + routing)

Bethany specified the test matrix against Synergy's LIVE system (not a separate TEST WMS):
- Order 1: `FLOW-FUNNEL-28` × 1, "Express" (UK)
- Order 2: `FLOW-FUNNEL-28` × 2 + `CLEAR-FUNNEL-28` × 2, "24 Hour Delivery" (UK)
- Order 3: `BOTH-FUNNEL-56` × 1, "Express International" (intl address)

All three: assigned to the Synergy location, status open + paid + unfulfilled, left in Shopify (never cancelled) until Synergy confirms systemic shipment + carrier/tracking writeback. Send the order IDs to Bethany. Walk the PDF's end-to-end checklist alongside: SKU sync, order pull, `IMPORTSYNERGY` tagging, shipment write-back, inventory updates both directions. See the 2026-06-09 update above for the blocker list and recommended sequence.

### Phase 5: Go-live (Future, needs 4)

8. Agree a go-live date with Synergy, confirm live SKU-name sync, put one end-to-end live sanity order through the store.

## Operational rules to honour (no build, just know)

- Connector pulls only orders at status open + unshipped + paid.
- Synergy auto-tags sent orders `IMPORTSYNERGY`. This tag must NEVER be removed (causes a failed resend; Synergy will not accept the same order twice).
- Orders cannot be edited after creation (Synergy processes immediately). Any change is handled offline or via the Synergy portal.

## Rabbit holes

- **EAN uniqueness** - Synergy rejects duplicate EANs across all SKUs. If the funnel variants share or lack barcodes, SKU sync stalls. Surface in task 4.
- **Dev Dashboard unfamiliarity** - new flow vs the in-admin custom app; pull the live Shopify doc steps before starting task 1.
- **"Plain-English description" field mapping** - confirm with Synergy which Shopify field they read for it.

## No-gos

- No website / code changes (portal verified safe, order tags untouched).
- Not migrating legacy SKUs to Synergy (Burnside keeps them; already tagged).
- Not building a TEST Shopify instance unless Synergy insists.

## Risks

- **Loop subscription address sync** - a customer changing their default address re-syncs to future renewals (new orders), which is expected behaviour, not an edit of a sent order. Flag to Synergy as expected.
- **Deadline** - Phase 1 is achievable in 2 days; Phases 2 to 3 depend on Humphrey, so the SKU/courier data request must go out today.

## Open questions

- **US shipping numbers:** which DHL zone is the USA, Air vs Road for US, and the tariff/tax estimate to bake into the scaled USD price. (Resolved: currency USD, scaled by box count, tax-inclusive, all products available.)
- **Barcode obligation:** printing a per-SKU barcode on the boxes is still required by contract clause 6.1(d) for the long term; waived by Synergy for the next ~20,000 boxes. Pick up on a future production run.
- Resolved: HS code `21069099`, weight 2.1kg, country UK, no barcode now (SKU is the identifier).

## References

- **Shipping & courier services (carriers, zones, rates, pallets):** `docs/shipping/SHIPPING_AND_COURIERS.md` — consolidated working doc; to be formalised into a standalone feature doc once the Shopify shipping config is live.
- Signed contract: `Fulfil_with_Synergy_x_Conka_Elite_Limited.pdf` (commencement 6 May 2026, go-live 9 June 2026, fee schedule, carrier rate cards, SLA, logistic profile)
- Synergy "Shopify Integration" PDF (Connector overview, scopes, SKU attributes, order processing, testing, go-live)
- DHL WPX (Air) rate sheet: zone x weight; 28 box ~2.5kg band, 56 box ~5kg, quarterly ~13kg+
- SCRUM-1051 (metafields + tags, done; full progress log in comments)
- Customer portal audit: `app/account/`, `app/api/webhooks/shopify/orders/route.ts`, `docs/features/CUSTOMER_PORTAL.md`
- Funnel product data: `app/lib/funnelData.ts`

## Jira tickets

| Ticket | Title | Phase | Status |
|--------|-------|-------|--------|
| SCRUM-1051 | Synergy onboarding: metafields + tags | Pre-work | Done (metafields + tags) |
| SCRUM-1052 | Phase 1: Dev Dashboard app + credentials + Synergy location | 1 | To Do |
| SCRUM-1053 | Phase 2: SKU attributes on 6 funnel variants | 2 | To Do |
| SCRUM-1054 | Phase 3: courier services visible to Synergy | 3 | To Do |

Phases 4 (Testing) and 5 (Go-live) are not ticketed yet; they become active once Phases 1 to 3 are complete.
