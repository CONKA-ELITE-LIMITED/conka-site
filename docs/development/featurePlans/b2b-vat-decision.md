# B2B VAT — Decision Record

**Decision owner:** Rudh (feature owner)
**Date:** 5 June 2026 (mechanism corrected 8 June 2026, see Correction below)
**Status:** Decided. Mechanism switched from Road A to Road B on 8 June 2026, and the Shopify side implemented the same day: UK VAT collection enabled (GB430507628, inclusive, no price change), B2B variants confirmed taxable, both quantity-break discounts created and cart-verified inclusive. Remaining before live: Shopify Flow card-tagging rule, Xero/Parex invoice email, then the pilot order. Final numbers to be proven by that pilot.
**Related:** `b2b-xero-invoicing.md` (implementation detail), SCRUM-1059, SCRUM-1060 (the Road B switch).

This document records what we decided about VAT on B2B (sports club / trade) orders and why. It is the rationale; the step-by-step build lives in the implementation plan above.

## Correction (8 June 2026): mechanism switched to Road B

The mechanism originally recorded below was **Road A**: leave Shopify VAT off, price the variants at the gross amount, and let the Parex / Xero Bridge connector "split" the 20% out of the gross on the Xero side. **That does not work and has been replaced.**

The connector vendor confirmed in writing that the connector **mirrors whatever tax Shopify charged on the order** and does not derive any VAT itself: "If no tax has been charged on the order in Shopify... our app will pass the tax code NO VAT." Under Road A Shopify charges 0%, so the connector would book every B2B invoice at **NO VAT / 0%** - non-compliant, and useless to a club trying to reclaim VAT.

**New mechanism = Road B: enable UK VAT collection in Shopify** (VAT number GB430507628), with prices VAT-inclusive (the store's "include tax in prices" flag is already ON). Shopify then extracts the 20% from the gross at checkout, and the connector mirrors that VAT onto the Xero invoice.

**What did NOT change:** the pricing decision (B2B ex-VAT, club pays gross), the gross variant prices (GBP 70.80 / 62.40 / 54.00 per box), and the website code (the invoice route already prices in gross and discounts to the gross tier total, which is correct under inclusive 20% - only code comments were corrected).

**Why Road B is safe** (it was previously rejected, see "What we rejected" below): CONKA is VAT-registered and already accounts for DTC VAT on the inclusive gross. With inclusive pricing ON, enabling UK VAT does not change any consumer price - it only surfaces the VAT line that was always deemed inside it. The accountant is given the switchover date so they move from manually backing VAT out of gross to relying on the Shopify/Xero figures (avoiding double-counting). Tracked in SCRUM-1060.

The sections below are kept as the original rationale; where they describe the Road A mechanism ("the store does not compute VAT", connector "splits" the gross), read them against this correction.

## The decision, in one line

B2B products are sold **ex-VAT**. The club pays the listed price **plus 20% VAT**, Shopify collects that full (gross) amount, and the compliant VAT invoice is produced in **Xero** (via the Parex connector), which splits the gross into net + 20% VAT.

Example (Entry tier): list £59 ex-VAT, club pays **£70.80**, Xero invoice shows **£59.00 net + £11.80 VAT = £70.80**. Same logic on every tier (£52 → £62.40, £45 → £54.00).

## Why ex-VAT pricing

Trade and club buyers expect to see prices without VAT and have it added on top. They reclaim the VAT, so it is neutral to them. Showing £59 + VAT is the convention they understand; showing a VAT-inclusive £70.80 would read as expensive against competitors quoting ex-VAT. This was a deliberate commercial call.

## The problem this had to solve

At the time of writing (true under Road A; Road B reverses this - see Correction at the top), this store did **not** compute VAT in Shopify on **any** product, DTC or B2B. Prices are treated as VAT-inclusive and VAT is handled at the accounting layer, not by Shopify (in Shopify the UK showed "Collecting -" and the tax rate was assumed 0% because UK VAT collection was not switched on). So Shopify could not, on its own, add 20% to a B2B order or show a VAT breakdown. We needed compliant per-order VAT invoices for B2B; Road B solves it by switching on Shopify UK VAT collection (inclusive), which surfaces the VAT without changing consumer prices.

## How it works (the mechanism)

1. **Shopify collects the gross and the VAT.** (Road B, corrected 8 June.) The B2B variants are priced at the full VAT-inclusive amount the club pays (e.g. £70.80). With UK VAT collection enabled and inclusive pricing on, Shopify extracts the 20% from that gross at checkout (£59 net + £11.80 VAT). The website also shows the buyer the split before they pay.
2. **Xero mirrors the VAT.** The connector takes each paid B2B order and creates a Xero invoice under a dedicated "B2B Sales" account, passing through the 20% VAT Shopify charged (inclusive), so the invoice reads net + VAT summing to what the club paid. The connector does **not** invent the VAT - it mirrors what Shopify charged, which is exactly why Shopify must charge it (Road B). Under the old Road A, with Shopify at 0%, this step would have produced a 0% / NO VAT invoice.
3. **Both purchase routes are covered.** Pay-by-invoice orders and instant card ("Buy now") orders both produce a Xero VAT invoice. The Xero invoice is the customer's VAT document and is emailed to the club.
4. **Reconciliation.** The gross the club pays (bank transfer into Revolut, or card settlement) equals the Xero invoice total, so the books reconcile and the VAT we declare is VAT we actually collected.

## What we rejected, and why

**Turning on VAT collection inside Shopify - rejected 5 June, REVERSED to ADOPTED 8 June 2026.** Originally rejected on the grounds that it changes the tax treatment of every DTC order and would need a full-store accountant re-verify. The connector vendor email forced the reversal: enabling Shopify VAT is the **only** way to get a compliant 20% VAT invoice, because the connector mirrors Shopify and cannot invent VAT (Road A would have produced 0% / NO VAT invoices). The original fear proved overstated - with inclusive pricing on and CONKA already accounting for DTC VAT on the inclusive gross, enabling UK VAT changes no consumer price and needs only a switchover-date heads-up to the accountant, not a re-audit. See the Correction at the top. Tracked in SCRUM-1060.

**Still rejected: a bespoke Xero API integration.** The off-the-shelf Shopify-to-Xero connector covers the need at this volume.

## What it means for the books (for whoever owns Xero)

- B2B sales arrive in Xero as **per-order invoices** under the **"B2B Sales"** account, each carrying 20% output VAT and the club's PO number in the invoice Reference.
- DTC accounting still reaches Xero via bank-feed reconciliation as today (not per-order invoices). Under Road B, DTC orders now carry an inclusive VAT line in Shopify - no price change, the VAT is simply surfaced - so the accountant should rely on those figures from the switchover date rather than backing VAT out manually.
- The VAT invoice the customer receives is the **Xero** one. Under Road B, Shopify now also shows a VAT line on the order/receipt (gross unchanged, VAT surfaced inclusively); the website shows the net + VAT split before they buy. The Xero invoice remains the customer's compliant VAT document, carrying the PO in the Reference.

## Open / to confirm

- The pilot (one real B2B order on each path) must confirm the Xero invoice carries 20% VAT inclusively (net £59 + £11.80 VAT = £70.80), now that Shopify charges the VAT under Road B. The connector mirrors Shopify, so this verifies the Shopify VAT config end to end, not a connector split. Tracked in SCRUM-1060.
- Sign-off that the Xero-issued invoice is the compliant VAT document for these sales sits with the feature owner / accountant; this document is the record of that choice.
