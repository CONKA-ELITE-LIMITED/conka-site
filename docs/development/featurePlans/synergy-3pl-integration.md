# Synergy 3PL Shopify Integration

**Status:** In progress
**Created:** 2026-06-02
**Hard deadline:** 4 June 2026 (Synergy kickoff call, ahead of next production run)
**Jira:** SCRUM-1051 (metafields + tags, done) plus the phase tickets listed below
**Owner:** Rudh (Shopify config) with Humphrey (ops data: EANs, customs, couriers)

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

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Connect: Dev Dashboard app + credentials + base URL + Synergy Location | DONE (connection confirmed working) |
| 2 | SKU readiness: HS code, weight, country on the 2 physical boxes; inventory tracked by Shopify; barcode blank | In progress (unblocked, ready to enter) |
| 3 | Couriers: UK free, USA scaled USD price inclusive of tax/tariffs | Active (principles set; numbers pending) |
| 4 | Testing: test SKUs + multi-line test orders against Synergy TEST WMS; end-to-end checklist | Future |
| 5 | Go-live (9 June): live SKU-name sync, single live sanity order | Future |

### Phase 1: Connect - DONE

1. Dev Dashboard app `Synergy WMS` created with the 18 scopes, installed on `conka-6770`. Client ID + Secret + base URL sent to Synergy (secret via one-time secret link).
2. Synergy Warehouse location created; Burnside retained as Default location for legacy SKUs.
3. Synergy confirmed the connection works.

### Phase 2: SKU readiness - UNBLOCKED, ready to enter

Enter on the **2 physical boxes only** (`FLOW-FUNNEL-28`, `CLEAR-FUNNEL-28`):
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

### Phase 4: Testing (Future, needs 1 to 3)

7. Create test SKUs and a couple of multi-line test orders (qty > 1 per line) at status open + unshipped + paid, against Synergy's TEST WMS. Walk the PDF's end-to-end checklist: SKU sync, order pull, `IMPORTSYNERGY` tagging, shipment write-back, inventory updates both directions. Default to limited live test SKUs/orders unless Synergy requires a separate TEST Shopify instance.

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
