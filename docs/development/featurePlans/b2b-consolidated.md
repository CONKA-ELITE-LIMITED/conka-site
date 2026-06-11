# B2B Channel — Consolidated Status & Plan

**Updated:** 11 June 2026 · **Owner:** Rudh (build), Harry (sales/ops), Humphrey (Xero/logistics)

Single entry point for the whole B2B workstream: what shipped and why, what's next, and what we deliberately are not doing. This consolidates the trackers previously spread across five featurePlans docs (mapped at the bottom); those docs remain as detail archives (pilot records, band tables, phase task breakdowns). **How the live portal works today** (files, API contracts, external config) is `docs/features/b2b/B2B_PORTAL.md` — this doc does not duplicate it.

## TL;DR

The B2B channel is **live and proven end to end**: public enquiry at `/professionals` → unlisted tiered order page → card or invoice payment → compliant Xero VAT invoice, automatically. Both payment paths passed real-order pilots (8 June). What remains: a few small close-out checks, the **order-size shipping fix** (scoped, ready to build — currently the biggest margin leak), the **B2B → Synergy fulfilment consolidation**, and the tail of the conversion-upgrade wave.

## Workstream map

| Workstream | Status | Detail doc |
|---|---|---|
| Portal build (landing, order page, card + invoice paths) | **Live** | `b2b-professionals-portal.md` |
| VAT mechanism (Road B) | **Live, pilot-proven** | `b2b-vat-decision.md` |
| Xero invoicing via Parex | **Live, both paths pilot-proven** | `b2b-xero-invoicing.md` |
| Conversion/credibility upgrade wave | **Partial** (P1–3 built, P5 active, P4/6 future) | `b2b-portal-conversion-upgrade.md` |
| Order-size shipping tiers | **Scoped, not started** | `order-size-shipping-tiers.md` |
| B2B → Synergy fulfilment consolidation | **Committed, next track** | `order-size-shipping-tiers.md` (Phase 3) |
| Net-30 / pay-on-terms | **Discovery only, not green-lit** | (no doc — see Not Doing) |

## 1. What is done, and why

### The portal (SCRUM-1055–1058)

- **Public `/professionals` landing + enquiry form.** Klaviyo-only lead capture (no database): apply route fires a welcome flow to the applicant (with the order-page link) and a lead alert to Harry via a second event on Harry's own profile. *Why Klaviyo flows, not code-sent email:* email already lives there; zero new infra.
- **Unlisted `/professionals/order` page** (noindex, not in nav). Flow/Clear steppers, live combined-total tier pricing, PO + finance email, two equal CTAs. *Why unlisted rather than tokenised:* the only reason to hide trade pricing is channel conflict; a shared noindex link solves that with none of the per-user token build/run cost.
- **Card path:** dedicated `POST /api/b2b/cart` builds a Shopify cart → hosted checkout. Tier pricing comes from Shopify automatic discounts on the `B2B Products` collection (−£8.40/box at 25+, −£16.80/box at 50+, combined Flow+Clear total, no stacking). *Why combined-total tiers:* a club buying 30 mixed boxes deserves the 25+ rate; per-variant tiers would punish mixing.
- **Invoice path:** `POST /api/b2b/invoice-order` creates a Shopify draft order (lines at the gross base + order-level FIXED_AMOUNT discount to the gross tier total) and emails the hosted invoice. First Admin API usage in the repo (`app/lib/shopifyAdmin.ts`). PO required on this path; finance email gated client+server (SCRUM-1061 hardening). *Why draft orders:* one API call yields a payable, emailable invoice and "mark as paid" converts it to a normal order — no custom billing.
- **Bank Deposit** manual payment method for no-card clubs, scoped to B2B carts only via the free ETP "Hide & Sort Payments" app so DTC checkout never sees it.
- **Both ship only after confirmed payment.** Zero credit risk.

### Pricing + VAT (Road B) — SCRUM-1059/1060

- **B2B is priced ex-VAT** (£59 / £52 / £45 per box at 1–24 / 25–49 / 50+), club pays gross (£70.80 / £62.40 / £54.00), reclaims the VAT. *Why:* trade buyers read ex-VAT prices; inclusive pricing would look expensive against competitors quoting ex-VAT.
- **Variants priced at the gross Entry rate (£70.80)** because Shopify discounts can only reduce a price.
- **Road B: Shopify collects UK VAT at 20% inclusive** (VAT no. GB430507628; "include tax in prices" ON so no consumer price moved) and Parex **mirrors** that tax onto the Xero invoice (£59 net + £11.80 VAT). *Why the original Road A died:* Parex confirmed in writing it mirrors Shopify's tax and cannot derive a VAT split — with Shopify at 0% every invoice would have booked NO VAT (non-compliant). Full reversal record: `b2b-vat-decision.md`.

### Xero invoicing (Parex)

- **Parex (Xero Bridge), Silver $15/mo**, scoped to the `B2B Professionals` order tag so DTC accounting (bank-feed reconciliation) is untouched. PO syncs from the Shopify order note/tag into the Xero invoice Reference; books to the dedicated **B2B Sales** account.
- **Card orders enter Parex scope via a Shopify Flow rule** (Storefront carts can't set tags/notes — only attributes — so Flow tags the order and carries the PO on creation).
- **Both paths pilot-passed with real orders (8 June):** invoice order #3514 and card order #3517 each produced exactly one Xero invoice, £59 net + £11.80 VAT, B2B Sales, PO in Reference, zero DTC orders synced. Road B proven end to end. Pilot protocol + results: `b2b-xero-invoicing.md`.

### Conversion/credibility upgrade wave (SCRUM-1063–1066)

Research-grounded reshaping of the landing into sales collateral (the traffic is warm, Harry-shared — sales enablement, not top-of-funnel CRO). Built so far: credibility backbone + hero dual-path (P1, for review), pilot-programme USP section with Starter/In-depth formats and mailto CTA (P2), order-page tier table + next-tier nudge (P3). Active: P5 per-athlete-per-day value band (ex-VAT, `pricePerBox / 28`). Key reframes: Informed Sport certification promoted as the strongest B2B trust signal; athletes demoted to supporting context; pilot framed as "prove it on your own squad first", not a credited SaaS pilot.

## 2. What is next

In priority order:

1. **Close-out checks (small).**
   - Set `NEXT_PUBLIC_SITE_URL` in Vercel so the Klaviyo welcome email links to prod, not the code fallback.
   - Confirm Parex Auto Sync is ON (post-pilot step; `B2B_PORTAL.md` records it as ON) and the pilot test data is cleaned (void/delete Xero invoices for #3513/3514/3516/3517, cancel the Shopify test orders) so B2B Sales starts clean.
   - ~~Close SCRUM-1059/1060/1061 in Jira.~~ Done 11 Jun — all portal + Xero tickets (1055–1061) and conversion P2/P3 (1064/1065) moved to Done.
   - Confirm card-settled orders (Shopify Payments, not the Revolut transfer Parex's deposit setting assumes) reconcile cleanly — flagged to Harry at pilot.
2. **Order-size shipping tiers (scoped, ready — `order-size-shipping-tiers.md`).** The flat rates were priced for 1–3 box consumer orders and leak on any bulk order, DTC or B2B alike (worst: 50 boxes next-day ≈ £111 of DPD charged at £6.54). Fix is global weight-banded UK Shopify rates (free to 6 boxes/12.6 kg protecting the subscription free-shipping promise, then Express £12/£25/£50 and next-day £26/£52, no card rate above the top band) plus a `shippingLine` on the B2B invoice draft order (currently sets none). Costs are known (Evri £2.92/parcel, DPD £6.54/parcel; cost ≈ ceil(boxes/3) parcels). Three pre-build decisions: round-number tuning, hard-block vs catch-all above the top band, and **verify variant weights in Shopify** (the only real dependency — bundles must roll up correctly).
3. **B2B → Synergy consolidation (committed, next track).** Re-point the portal off the archived legacy variants onto the funnel SKUs (`FLOW/CLEAR-FUNNEL-28`) so B2B fulfils from Synergy on the confirmed courier economics instead of Burnside. A consolidation, not a re-onboarding (same physical box). Touches `b2bVariants.ts`, both B2B API routes, and the discount targeting; needs Synergy stock planning. Do on aligned timing — it rewires a just-shipped live portal.
4. **Conversion wave tail.** Finish P5 (value band); then P4 social proof (gated on sign-off-ready figures — placeholders must not ship) and P6 nav reachability + section analytics when the page should go cold-traffic-ready.
5. **Pallet playbook (doc-only, with shipping Phase 2).** Manual `Pallet` line on draft orders for >60-box orders; pallets only beat parcels above ~60 boxes (Bethany, 10 June).

## 3. What we are NOT doing, and why

**Permanent no-gos (decided, don't reopen without new facts):**

| Not doing | Why |
|---|---|
| Custom checkout / Stripe / any second payment stack | Shopify checkout already handles money, VAT, refunds for DTC; a parallel stack adds run-cost and zero capability |
| Bespoke Xero API integration | Owning OAuth, idempotent webhooks, and account mapping forever, to reproduce what a $15/mo connector does reliably at this volume |
| Tokenised / per-user access to trade pricing | Channel conflict is solved by an unlisted noindex link at zero run cost |
| Admin dashboard | Harry works from Shopify admin + Klaviyo; nothing to build |
| B2B-specific shipping profile | Impossible while B2B and DTC share variants (Shopify profiles are per-product) — and unnecessary once rates are weight-banded |
| Road A VAT (Shopify at 0%, connector splits the gross) | Vendor-confirmed the connector mirrors Shopify's tax; Road A books every invoice at 0% VAT — non-compliant |
| Club crests, kit, stadium imagery, "trusted by [team]" | Implied-endorsement line; anonymised outcomes and named individual athletes only |
| Price on the public landing page | Trade pricing stays behind the unlisted order page |
| Charging shipping on normal DTC orders (1–6 boxes) | The free-shipping promise is a conversion lever; the entire band table is designed around protecting it |

**Deferred (real candidates, parked deliberately):**

| Deferred | Why / until |
|---|---|
| Net-30 / pay-on-terms (Harry raised) | Discovery only, not green-lit. The lift is financial/operational risk, not technical (Shopify does Payment Terms natively). If pursued: manual, trusted clubs only — and it sits on top of the fulfilment-routing question, so sequence after Synergy consolidation |
| International weight-banding | Intl bulk is rare and tends toward customer-arranged freight forwarders; we hold the Evri intl rate sheet, so it's deferred by choice, not blocked |
| Pallet automation | Parcels beat a pallet until ~60 boxes; manual draft-order line until real pallet volume appears |
| Interactive/bookable pilot flow | Mailto to Harry converts fine at this volume; a configurator is a mini-app rabbit hole |
| B2B social proof section (P4) | Gated on real, sign-off-ready figures; placeholders must not ship |
| Section analytics + nav reachability (P6) | Page is warm-traffic sales collateral today; matters when it goes nav-reachable/cold |

## 4. Decision log (condensed)

| Decision | Date | Why | Detail |
|---|---|---|---|
| Combined-total tiers (Flow+Clear), not per-product | May 2026 | Mixed orders deserve the bulk rate | portal doc |
| Draft orders for pay-by-invoice | May 2026 | One API call = payable hosted invoice; mark-as-paid converts | portal doc |
| Parex over Amaka/Synder/A2X | 5 Jun | Only per-order option documented on our needs; tag-scoping confirmed by support; draft-order caveat cleared by pilot | xero doc |
| Ex-VAT B2B pricing, club pays gross | 5 Jun (Harry) | Trade convention; VAT is noise to a reclaiming club | vat doc |
| Road A → Road B (enable Shopify UK VAT) | 8 Jun | Connector mirrors Shopify tax, cannot derive it; inclusive flag ON means no consumer price moved | vat doc |
| PO required on invoice path only; card stays frictionless | 8 Jun | Invoice orders need the PO for the Xero Reference; card friction costs conversions | xero doc (SCRUM-1061) |
| Shipping fix is global weight-bands, not a B2B carve-out | 10 Jun | The leak is order-size-driven (a DTC 8-box order leaks like a 50-box club) and shared SKUs make a B2B profile impossible anyway | shipping doc |
| B2B fulfils from Synergy via funnel-SKU consolidation | 10 Jun | Same physical box as funnel SKUs — consolidation beats a second onboarding; inherits confirmed courier economics | shipping doc (P3) |

## 5. Jira roll-up

| Ticket | What | Status |
|---|---|---|
| SCRUM-1055 | Landing + enquiry form | Done (merged, PR #279) |
| SCRUM-1056 | Shopify B2B products + quantity-break discounts | Done (verified live 8 Jun) |
| SCRUM-1057 | Unlisted order page + card checkout | Done |
| SCRUM-1058 | Pay-by-invoice path | Done |
| SCRUM-1059 | Xero connector + PO-to-Reference | Done (pilot passed 8 Jun) |
| SCRUM-1060 | VAT Road B switch | Done (pilot passed 8 Jun) |
| SCRUM-1061 | Invoice-path hardening + both-path pilot | Done (pilot passed 8 Jun) |
| SCRUM-1063 | Upgrade P1: credibility backbone + hero | For review |
| SCRUM-1064 | Upgrade P2: pilot programme USP | Done |
| SCRUM-1065 | Upgrade P3: order-page pricing clarity | Done |
| SCRUM-1066 | Upgrade P5: per-athlete-per-day value band | To Do (active) |
| — | Order-size shipping tiers | Scoped, not ticketed |
| — | Synergy consolidation (shipping P3) | Committed, not ticketed |

## 6. Doc map — and the path to one canonical doc

| Doc | Keep for | Absorb into canonical doc? |
|---|---|---|
| `docs/features/b2b/B2B_PORTAL.md` | **Current-state mechanics** (journey, files, APIs, external config, edge cases) | This *is* the base of the canonical doc |
| `b2b-professionals-portal.md` | Original shaping, build chronology, deviations from brief | History only — archive once canonical |
| `b2b-xero-invoicing.md` | Connector comparison, go-live checklist, pilot protocol + results, Parex config detail | Fold the *operational* bits (Parex config, fail diagnostics, reconciliation notes) into canonical; rest is history |
| `b2b-vat-decision.md` | Plain-English VAT rationale for owner/accountant | Keep standalone (audience is non-technical) or append to canonical as an appendix |
| `b2b-portal-conversion-upgrade.md` | Active phase tracker for the upgrade wave | Stays a live plan until P4–6 resolve |
| `order-size-shipping-tiers.md` | Active plan: band tables, pre-build decisions, Synergy P3 | Stays a live plan; band numbers land in `docs/shipping/SHIPPING_AND_COURIERS.md` |
| This doc | Programme-level status, decisions, no-gos | Becomes the canonical doc's "decisions and history" section |

**Suggested end-state:** one canonical `docs/features/b2b/B2B_PORTAL.md` (mechanics + ops runbook + decision log from here), the two still-active plans (`b2b-portal-conversion-upgrade.md`, `order-size-shipping-tiers.md`) until they complete, and everything else archived.
