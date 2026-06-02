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

The 6 funnel variants:

| Product | Variant | SKU | Role |
|---------|---------|-----|------|
| CONKA Flow AM | Flow - 28 Shots | `FLOW-FUNNEL-28` | Standalone |
| CONKA Flow AM | Flow - 84 Shots | `FLOW-FUNNEL-84` | Standalone |
| CONKA Clear PM | Clear - 28 Shots | `CLEAR-FUNNEL-28` | Standalone |
| CONKA Clear PM | Clear - 84 Shots | `CLEAR-FUNNEL-84` | Standalone |
| CONKA Flow + Clear | Both - 56 Shots | `BOTH-FUNNEL-56` | Virtual bundle |
| CONKA Flow + Clear | Both - 168 Shots | `BOTH-FUNNEL-168` | Virtual bundle |

Base URL for Synergy: `https://conka-6770.myshopify.com`

## Already done (SCRUM-1051)

- 3 variant metafield definitions: `custom.batchexpiry`, `custom.bundlecomposition`, `custom.disableinvsync`
- `BATCHEXPIRY` on the 4 standalone variants (bottles carry printed batch + expiry)
- `BundleComposition` on the 2 bundles: `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28` and `1xFLOW-FUNNEL-84+1xCLEAR-FUNNEL-84`
- `SYNERGYIGNORE` tag on all legacy / non-funnel products (Active + Archived)

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

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Connect: Dev Dashboard app + credentials + base URL + Synergy Location | Active |
| 2 | SKU readiness: EAN, HS code, COO, weight, plain-English description on 6 variants; inventory tracked by Shopify | Active |
| 3 | Couriers: UK Evri/DPD (free), USA Evri/DHL (priced), visible to Synergy | Active |
| 4 | Testing: test SKUs + multi-line test orders against Synergy TEST WMS; end-to-end checklist | Future |
| 5 | Go-live: agree date, live SKU-name sync, single live sanity order | Future |

### Phase 1: Connect (deadline-critical, by 4 June)

1. **Create the Dev Dashboard app** - follow Synergy's linked doc (shopify.dev/docs/apps/build/dev-dashboard/create-apps-using-dev-dashboard), configure the scope set above, install into `conka-6770`. Output: App Client ID + App Client Secret. Complexity: Medium.
2. **Hand over credentials** - Client ID, Client Secret, base URL via a secure channel (never the email thread, never plain email). Complexity: Small.
3. **Create the Synergy warehouse Location** - Settings > Locations > add Synergy; confirm Burnside remains the location for all legacy SKUs. This is where Synergy updates inventory. Complexity: Small.

### Phase 2: SKU readiness (gated on Humphrey's data)

4. **Request SKU attributes from Humphrey** - per variant: unique EAN/barcode (must be unique across ALL SKUs), HS code, country of origin, item weight, plain-English description. Complexity: Small (request); gated on reply.
5. **Enter attributes on the 6 variants** and set inventory tracking to "Shopify" (only Shopify-managed SKUs are extracted by the Connector). Complexity: Medium; depends on task 4.

### Phase 3: Couriers (uses Humphrey's courier data)

6. **Configure courier services** - Settings > Shipping: UK Evri or DPD (free), USA Evri or DHL (with corresponding prices). Must be visible to Synergy via `read_shipping`. Complexity: Medium.

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

- Which Shopify field does Synergy map to "item description in plain English"?
- Do the 6 funnel variants already have unique EANs assigned, or does Humphrey need to issue them?

## References

- Synergy "Shopify Integration" PDF (Connector overview, scopes, SKU attributes, order processing, testing, go-live)
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
