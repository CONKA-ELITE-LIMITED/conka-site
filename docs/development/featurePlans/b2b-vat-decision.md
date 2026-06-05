# B2B VAT — Decision Record

**Decision owner:** Rudh (feature owner)
**Date:** 5 June 2026
**Status:** Decided. Implementation in progress; final numbers proven by a pilot order.
**Related:** `b2b-xero-invoicing.md` (implementation detail), SCRUM-1059.

This document records what we decided about VAT on B2B (sports club / trade) orders and why. It is the rationale; the step-by-step build lives in the implementation plan above.

## The decision, in one line

B2B products are sold **ex-VAT**. The club pays the listed price **plus 20% VAT**, Shopify collects that full (gross) amount, and the compliant VAT invoice is produced in **Xero** (via the Parex connector), which splits the gross into net + 20% VAT.

Example (Entry tier): list £59 ex-VAT, club pays **£70.80**, Xero invoice shows **£59.00 net + £11.80 VAT = £70.80**. Same logic on every tier (£52 → £62.40, £45 → £54.00).

## Why ex-VAT pricing

Trade and club buyers expect to see prices without VAT and have it added on top. They reclaim the VAT, so it is neutral to them. Showing £59 + VAT is the convention they understand; showing a VAT-inclusive £70.80 would read as expensive against competitors quoting ex-VAT. This was a deliberate commercial call.

## The problem this had to solve

This store does **not** compute VAT in Shopify on **any** product, DTC or B2B. Prices are treated as VAT-inclusive and VAT is handled at the accounting layer, not by Shopify (in Shopify the UK shows "Collecting -" and the tax rate is assumed 0% because there is no Shopify-side VAT registration). So Shopify cannot, on its own, add 20% to a B2B order or show a VAT breakdown. We needed compliant per-order VAT invoices for B2B without changing how DTC is handled.

## How it works (the mechanism)

1. **Shopify collects the gross.** The B2B product variants are priced at the full amount the club pays (e.g. £70.80), because Shopify will not add VAT itself. The website still displays it to the buyer as "£59 + 20% VAT = £70.80" so they see the split before paying.
2. **Xero produces the VAT invoice.** The Parex connector takes each paid B2B order and creates a Xero invoice under a dedicated "B2B Sales" account, applying a 20% VAT code and treating the amount as VAT-inclusive, so the invoice reads net + VAT that sum to what the club paid.
3. **Both purchase routes are covered.** Pay-by-invoice orders and instant card ("Buy now") orders both produce a Xero VAT invoice. The Xero invoice is the customer's VAT document and is emailed to the club.
4. **Reconciliation.** The gross the club pays (bank transfer into Revolut, or card settlement) equals the Xero invoice total, so the books reconcile and the VAT we declare is VAT we actually collected.

## What we rejected, and why

**Turning on VAT collection inside Shopify** (so Shopify itself itemises VAT at checkout). Rejected because it changes the tax treatment of **every** DTC order, not just B2B, and would require re-verifying the whole store's tax setup with the accountant. It is slower and riskier for no benefit: the Xero invoice is the compliant VAT document either way. We deliberately kept the change isolated to B2B.

## What it means for the books (for whoever owns Xero)

- B2B sales arrive in Xero as **per-order invoices** under the **"B2B Sales"** account, each carrying 20% output VAT and the club's PO number in the invoice Reference.
- DTC accounting is **unchanged** (it continues to reach Xero via bank-feed reconciliation as today).
- The VAT invoice the customer receives is the **Xero** one. Shopify shows them the gross they pay but no VAT line; the website shows the net + VAT split before they buy. For UK VAT this is acceptable: the Xero invoice is a valid VAT invoice.

## Open / to confirm

- The pilot (one real B2B order) must confirm the Xero invoice splits the gross inclusively (net + 20% VAT summing to the amount paid), not adding VAT on top. This is a Parex configuration confirmation, not a change to this decision.
- Sign-off that the Xero-issued invoice is the compliant VAT document for these sales sits with the feature owner / accountant; this document is the record of that choice.
