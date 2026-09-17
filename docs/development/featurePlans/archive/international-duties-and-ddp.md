> **ARCHIVED (2026-09-17).** Delivered. Ticket: SCRUM-1204. DDP and duty collection at checkout
> are live for France, the `Europe` zone and the USA. Canonical doc: `docs/shipping/DUTIES_AND_DDP.md`.
> Kept for the reasoning, costs, margins and rejected options, not for current behaviour. Its
> unfinished items now live in SCRUM-1204 (open follow-ups), SCRUM-1340, SCRUM-1364 and
> `docs/TODO.md` (International shipping).

# International Duties, DDP and the Move to DHL

**Status:** DECIDED, Europe in build. Synergy confirmed 10 Sept 2026 and were given the
go-ahead on 11 Sept. Europe moves to DHL road on DDP; the rest of the world is untouched
until the USA rate is resolved. Tracked as **SCRUM-1204**.
**Created:** 2026-09-07 · **Updated:** 2026-09-11
**Owner:** Rudh (Shopify config + Synergy liaison), Humphrey (commercial call, Synergy
relationship)
**Trigger:** French customers billed a surprise import charge at the door, Sept 2026.
Georgina Anderson-Marshall (Synergy) confirmed the orders shipped DAP because terms of sale
were never mapped at onboarding.
**Tracked as:** **SCRUM-1204** (rewritten 11 Sept 2026; it previously scoped a DAP DHL
upgrade sitting alongside Evri).
**Relates to:** `docs/shipping/` (canonical: live methods, zones, the duties rules and the
Synergy mapping all live there now; this plan holds the reasoning, costs, margins and phases),
`order-size-shipping-tiers.md`,
`archive/synergy-3pl-integration.md`, **SCRUM-1340** (shipping methods on the international
subscription contracts, blocked by this work)
**Retirement:** the rates, mapping sheet and incoterm model are already in `docs/shipping/`.
When the last phase closes, check nothing new needs folding in, then retire this plan per
`/track done`. Do not restate a rule here that `docs/shipping/` holds.

---

## The decision

**Europe moves to DHL road on DDP terms, at unchanged prices, with a 3-box minimum. The rest
of the world is untouched for now.**

| | |
|---|---|
| Europe (incl. France) | DHL **Economy Select** (road), **DDP**, new rate name `European Delivery` |
| USA | **Added 14 Sept 2026.** `Express International DHL` (DHL air, DDP), 3-box minimum, £59 / £112 |
| Rest of world (Canada, AU, NZ, ZA, UAE, Caribbean) | **Unchanged.** Stays `Express International` (Evri, DAP) |
| European prices | **Unchanged.** They already cover the DDP cost (§ Margins) |
| Minimum European order | **3 boxes**, by deleting the 1-box and 2-box weight bands |
| Duty and VAT | Collected from the customer at checkout as a separate line, not absorbed |
| Evri international | **Not retired** |
| UK (Evri `Express`, DPD `24 Hour Delivery`) | Unchanged |

The customer pays the full landed cost at checkout and nothing on delivery.

**Why Europe alone.** Europe is profitable at today's prices even absorbing the full DDP
freight cost. The USA is not: its flat £22 rate has been obsolete since the US de minimis
ended on 24 Jul 2026, and a US order on DHL DDP would lose £77-120. The USA separately needs
FDA Prior Notice resolved before it can ship properly at all. Splitting the two lets Europe
ship now rather than waiting on a problem that has nothing to do with it.

**Why `Express International` survives.** It is still the live method on every non-European
zone outside Europe and the USA, and on the Channel Islands rate. Retiring it before
those move would leave orders carrying a method Synergy cannot match, and Synergy holds them
as "Invalid Dispatch Method".

**Why 3 boxes.** DHL road is flat to 10kg, so a European parcel costs £36.04 whether it holds
one box or four. A 1-box European order loses money outright. Three boxes is the first tier
that uses the flat rate properly (§ Margins).

---

## Synergy's answers, 10 September 2026

Georgina Anderson-Marshall replied to the 8 Sept email. **Nothing in it blocks the switch.**
Road is available, Royal Mail is out, and the one item that genuinely needs a decision from
us is how the incoterm reaches their system.

Synergy already ship DDP for other clients on this DHL account. Most of what we asked is
their domain and theirs to run. The notes below record what we assume for pricing, not a
list of things to press them on.

### Available and agreed

- **DHL Economy Select (road) — yes.** Needs a unique dispatch method name, which
  `European Delivery` provides. They will map that name to the Road service.
- **Royal Mail International — not available.** Labels have failed since the July 2026
  data-format change and Royal Mail have not resolved it. Closed, do not revisit.
- **Evri DDP — offered unprompted as a cheaper alternative to DHL.** Worth a price, below.

### Importer of record — proceed

Synergy do not set it, DHL do. She checked a live DDP shipment for another client: the
**receiver is the customer's address on both the label and the commercial invoice**, with no
importer of record named anywhere. DHL's own product description says the same thing, that
Duty Tax Paid arranges for the shipper to be *billed* "rather than the receiver of the
shipment being billed". A billing arrangement, not a change of declarant.

That is how express DDP normally works. If it were otherwise, every UK merchant shipping DDP
into the EU would need a French VAT registration. **Treat it as settled and proceed.** This
was written up as a go/no-go; it is really a watch item. Volume is four to five French
customers, so if the first shipment says otherwise we revert to DAP having lost nothing. The
§ Why not French VAT registration position stands: we will not register.

### What we assume for pricing

Exact figures are not needed to set a checkout price. A conservative all-in cost now, then
two or three real Synergy invoices replace it.

| | Assumption | Basis |
|---|---|---|
| **DTP fee** | **£16 per international parcel** | DHL UK Service & Rate Guide 2026: Duty Tax Paid is 2% of fiscal charges, minimum £16.00, and at our order values 2% never clears the floor. Georgina has not seen it on recent invoices, which may mean Synergy's contract absorbs it. Budget for it; if it never appears we are £16 a parcel better off |
| **Fuel surcharge** | **~20%, on freight and on the DTP fee** | DHL set it monthly on two indices, jet fuel for Express Air and diesel for Economy Select road, applied to transportation charges *and* to services and surcharges. Whether our card's freight figures are already fuel-inclusive is unclear, so assume they are not |

Neither changes the decision. On a ~£100 landed cost, being five points out on fuel is £2.

### The one decision that is ours — incoterm mapping

Synergy raised something we had not: how terms of sale reach their system. Two mutually
exclusive routes, and they will not mix them.

| | How it works | Cost |
|---|---|---|
| **A. Hard-code per dispatch method** | `European Delivery` → DDP, `Express International DHL` → DDP, fixed in their mapping. A Shopify-supplied incoterm would be overridden | Free, same mechanism as the existing name-based routing |
| **B. Read the incoterm off each Shopify order** | We tell them which Shopify field holds it, they map it to a JDA field and run a test order | **Chargeable at the bespoke project rate** |

**Take A**, and this one is genuinely ours to answer because only we know the Shopify side.
Shopify carries no per-order incoterm unless duties are collected at checkout, which needs
either Managed Markets (rejected, § Options considered G) or Shopify's collect-duties feature
(deliberately off, § HS codes). Under route B there would be nothing in the payload to read.
Our map is also 1:1 and static: four methods, one terms of sale each.

### Still outstanding

**The declared customs value.** Not addressed, for the second time. Georgina confirmed the
figure comes from our system but has not said which field, and it is over-declaring live
orders (£199.95 on an order sold at £140). Their integration reading our data, so they can
answer it. Blocks Phase 0 step 1.

**An Evri DDP price for Europe.** The money is real: Europe at 6 boxes is ~£46 on DHL Road
against ~£15 to £26 on Evri. The likely catch is that Evri's EU DDP is their **IOSS**
service, VAT only and under €150, which would leave the €3 duty and France's €2 at the door
(option D, already rejected). Ask for the price and whether it covers duty. Do not wait for
it, and note Evri failed to produce the label for the France order that started this.

---

## The problem

International orders shipped **DAP**, so the customer was the importer of record and got
billed VAT, duty and a carrier handling fee on the doorstep. Three things stacked:

**1. DAP was never mapped at onboarding.** Synergy's sheet had
`Express International | Evri | International | ROW | DAP`. Working as configured, and
Georgina confirmed terms of sale were missed at onboarding.

**2. The declared value was wrong, and wrong upwards.** The customs value pulled the
product's list price × quantity, not the discounted total actually paid. An order sold at
£140 was declared at 5 × £39.99 = £199.95. Customs value is legally the **transaction
value**. Georgina has confirmed the figure is pulled from our system, so the fix may be ours;
the field being read is an open question.

> Humphrey's proposal was to declare our **cost** rather than the selling price. That is
> undervaluation and a customs offence. The correct fix is list price → price paid, which
> moves in the same direction anyway.

Note this does not rescue that order: £140 is about €161, over the €150 line either way.

**3. The rules changed under us and our config predates them.** See below.

France is worst-hit because it has an additional national parcel tax the rest of the EU does
not.

### What a French customer was actually billed

On a £39.99 box, roughly:

| Charge | ~£ | What it is |
|---|---|---|
| French VAT | 7 | Destination sales tax on goods + shipping |
| EU flat duty (€3) | 2.60 | Replaced the €150 exemption |
| France parcel tax (€2) | 1.70 | National charge on H7 parcels |
| Carrier handling fee | 10-15 | **Not tax.** The courier's admin charge |
| **Total** | **21-26** | |

Over half is the courier's admin fee. That is why the bills read as disproportionate.

---

## The rules

The EU, France and USA customs rules that drove this decision live in
`docs/shipping/DUTIES_AND_DDP.md`. Verification of each claim and the sources are at the end of
this plan.

---

## Options considered

EU volume is roughly 4-5 customers in France. That number drives the decision.

| Option | Verdict |
|---|---|
| **A. Status quo (DAP), fix data only** | **No.** Customer still gets a doorstep bill, just a smaller and correct one. The data fixes happen regardless |
| **B. DHL DDP (road EU, air ROW)** | **CHOSEN.** One mechanism at any order value, no threshold, no ongoing admin, no provider to integrate. Expensive, which the minimum order size answers |
| **C. Evri DDP** | **Not available.** Evri's DDP to the EU is an **IOSS** service, and their public guidance states DDP is USA-only with everything else DAP. Synergy's Evri card lists a `DDP Courier` line for EU countries, which contradicts that and was never resolved. Synergy volunteered it again on 10 Sept 2026 as a cheaper alternative; one precise question outstanding (§ Synergy's answers 6). Not built on |
| **D. Evri + pay-as-you-go IOSS** | **No.** Cheaper per parcel (~£2 vs a ~£14 DTP fee) but only covers orders **under €150**, so a second DDP arrangement is still needed for the larger half. Adds a provider integration, per-order admin, and destination VAT rates we would be liable for |
| **E. Full IOSS registration** | **No.** ~£1,500-4,000/yr plus per-return fees, an EU intermediary jointly liable, monthly returns forever. Break-even is roughly 250 EU orders/yr |
| **F. Offer DAP and DDP side by side at checkout** | **No.** Rejected on customer experience: price-sensitive customers pick the cheap option without understanding the consequence, and a label at checkout does not fix that. "We warned you in small text" is a bad outcome |
| **G. Shopify Managed Markets** (Shopify's own recommendation) | **Architecturally impossible.** Forces Managed Markets labels, DHL Express or FedEx only, no third-party carrier accounts. Synergy buys its own labels. It also makes Global-e merchant of record, which we should assume breaks Skio subscriptions |
| **H. Stop shipping internationally** | **No**, but recorded so keeping the markets is a decision rather than a default |

Option G is worth recording because it *is* what Shopify tells you to do, and someone will
suggest it again. It is incompatible with a 3PL that owns its carrier relationships.

### Why not French VAT registration

If DHL's DDP names **CONKA** as importer of record rather than the customer, we would need a
French VAT number, a French EORI, and a fiscal representative (jointly liable, ~£1,500-3,000
/yr, sometimes a deposit), plus monthly returns forever and per-country repetition.
**We will not do this.** If that is the answer, we stay DAP or change carrier. Normal express
e-commerce DDP keeps the receiver as importer of record, so this is a confirmation, not an
expected risk.

---

## Costs

DHL freight only, **before** fuel surcharge, DTP fee and the tax itself. Weight bands are
1 box 2.1kg, 2 box 4.2kg, 3 box 6.3kg, 6 box 12.6kg.

| Zone | | 1 box | 2 box | 3 box | 6 box |
|---|---|---|---|---|---|
| **France** | charge now | 20 | 22 | 24 | 32 |
| | DHL Road | 36.04 | 36.04 | 36.04 | 39.12 |
| **Europe (11)** | charge now | 20 | 23 | 26 | 41 |
| | DHL Road | 42.24 | 42.24 | 42.24 | 46.36 |
| **USA** | charge now | 22 | 22 | 22 | 22 |
| | DHL Air | 44.20 | 55.24 | 66.28 | 102.17 |
| **Canada** | charge now | 36 | 52 | 68 | 134 |
| | DHL Air | 50.25 | 63.01 | 74.95 | 110.14 |
| **Australia** | charge now | 25 | 40 | 56 | 116 |
| | DHL Air | 57.54 | 73.35 | 89.01 | 138.96 |
| **New Zealand** | charge now | 38 | 65 | 91 | 203 |
| | DHL Air | 57.54 | 73.35 | 89.01 | 138.96 |
| **South Africa** | charge now | 42 | 60 | 77 | 151 |
| | DHL Air | 57.54 | 73.35 | 89.01 | 138.96 |
| **UAE** | charge now | 13 | 17 | 20 | 36 |
| | DHL Air | 57.54 | 73.35 | 89.01 | 138.96 |
| **Caribbean** | charge now | 57 | 78 | 99 | 188 |
| | DHL Air | 76.52 | 101.52 | 125.94 | 201.23 |

Source: `docs/shipping/data/dhl-air-and-road-rates-2026.xlsx` (Synergy's DHL account card,
sent 3 Aug 2026). Current charges from `docs/shipping/METHODS_AND_ZONES.md`.

**Every international rate goes up.** UAE is the worst, £13 charged against a £57 cost.

Two useful shapes: DHL **Road is flat to 10kg**, so Europe's 1, 2 and 3 box cost the same,
which rewards larger baskets. And Air improves relatively at 6 boxes, where Canada, NZ and
South Africa already over-recover.

**On top of every figure above.** The **DTP fee** is now known from DHL's UK Service &
Rate Guide 2026: **2% of fiscal charges, minimum £16.00**. At our order values 2% never
clears the floor, so treat it as a flat **£16 per international parcel**. The **fuel
surcharge** is still unknown: set monthly on two separate indices (jet fuel for Express
Air, diesel for Economy Select road) and applied to the freight *and* to the DTP fee.
Whether our card's figures are already fuel-inclusive is the open question
(§ Synergy's answers 3).

**Worked example, Europe 3 boxes, with fuel as the only unknown:**

| | £ |
|---|---|
| DHL Road freight | 42.24 |
| Fuel on freight, illustrative 20% | 8.45 |
| DTP fee (the £16 floor) | 16.00 |
| Fuel on DTP, same rate | 3.20 |
| EU flat duty €3 + France parcel tax €2 (sub-€150, H7) | 4.30 |
| French VAT 20% on goods £119.97 + shipping £26 | 29.20 |
| **Landed cost to us** | **~103** |

Against **£26 charged today**. Even with fuel at zero it is ~£91. Note the feedback loop:
VAT is charged on the shipping the customer paid, so raising the shipping price raises the
VAT base with it and recovery is not linear. **This arithmetic is what forces the minimum
order size**, and it is worse than the plan assumed when it was written.

**Volumetric weight** is the higher of actual and (L×W×H cm ÷ 5000). Box dimensions have not
been checked, so every band above is optimistic if the cartons are bulky.

**French VAT paid under DDP is not reclaimable by us**, since we are not registered in France
and the tax is paid in the customer's name as importer. That is why it must be **collected
from the customer at checkout** rather than absorbed. Shopify's *collect duties and import
taxes at checkout* adds it as its own line; without that it becomes roughly £20-60 of dead
cost per European order and the economics in § Margins do not hold.

---

## Margins

The numbers that decided Europe-only. Live `offerData.ts` prices, manufacturer COGS of
£17.96 per 28 shots plus £3.20 3PL per order, fuel at an assumed 20%, DTP at the £16 floor,
Shopify fees at 2.8% + £0.30. Duty and VAT are collected from the customer at checkout and so
do not appear as our cost.

**Quarterly bundles, which is what a European customer buys under a 3-box minimum:**

| Lane | Bundle | Price | Shipping charged | COGS | Shopify fee | Shipping cost | Profit | Margin |
|---|---|---|---|---|---|---|---|---|
| France | Flow or Clear quarterly (80 shots) | £109.99 | £24 | £54.51 | £4.05 | £62.45 | **£12.98** | 10% |
| France | Both quarterly (140 shots) | £149.99 | £32 | £93.00 | £5.40 | £63.68 | **£19.91** | 11% |
| Europe far | Flow or Clear quarterly | £109.99 | £26 | £54.51 | £4.11 | £69.89 | **£7.48** | 6% |
| Europe far | Both quarterly | £149.99 | £41 | £93.00 | £5.65 | £71.54 | **£20.80** | 11% |

The same bundles in the UK make £49 at 33-45%. So DDP takes a European order from roughly 40%
down to 6-11%. Thin, positive, and acceptable while volume is a handful of customers. A Flow
quarterly to Italy clears £7.48, which is close enough to zero that one returned parcel wipes
out several orders.

**Monthly renewals are the problem, not one-off orders:**

| | Profit per renewal |
|---|---|
| Flow or Clear monthly to Europe | **−£20.47** |
| Both monthly to Europe | £0.73 |

A monthly single-formula European subscription loses about £20 every renewal, because the flat
road rate costs the same for a 1.5kg parcel as a 10kg one. A checkout minimum does not apply to
Skio renewals, so this is only fixed by moving those subscribers to quarterly. With 8 France
contracts that is roughly £160 a month. **This is the single biggest lever in the plan**, and it
is why Phase 3 is not optional.

**Rest of world, for the record.** At 3 and 6 boxes the absorbed freight gap is £77/£120 for the
USA and £106/£150 for the UAE, against £25-44 for Europe. Those two lanes cannot carry DDP at
current prices, which is why they stay on Evri DAP for now.

**Caveats.** The 20% fuel figure is unverified and the first Synergy invoice replaces it. The
COGS comes from the conka-lab margins dashboard, whose displayed prices are stale, so the
£17.96 should be confirmed against a current cost sheet before anyone leans on it.

---

## Shipping methods

This phase added one method, `European Delivery`, and flipped the dormant
`Express International DHL` to DDP. The mapping sheet and the rules around it (hard-coded terms
of sale, do not retire `Express International`) live in `docs/shipping/SYNERGY_ROUTING.md`.
Reasoning for hard-coding terms per method: § Synergy's answers.

---

## Phases

### Phase 0 — Done, or doable now with no dependencies

1. ~~Set the **default country of origin** to United Kingdom.~~ **DONE 8 Sept 2026.**
2. ~~Add **HS code `210690`** to the live variants missing it.~~ **DONE 8 Sept 2026**, see below.
3. ~~**Delete the 1-box and 2-box weight bands** on the `Europe` and `france` zones.~~
   **DONE 11 Sept 2026.** Both zones now run 5,250-13,650g only. **Practical effect: Europe is
   quarterly-only.** Every monthly variant sits under 5,250g (`FLOW-STARTER-28` 2,500g,
   `BOTH-STARTER-56` 4,550g), so a new European customer can only buy quarterly or a 3+ box
   one-off. That is the intended outcome, since a monthly European renewal loses about £20
   (§ Margins). Existing subscribers are unaffected: renewals bypass checkout.
4. Draft the shipping policy copy: 3-box minimum to Europe, duties and taxes included, nothing
   to pay on delivery.
5. Confirm **COGS per box** against a current cost sheet and finish `docs/ops/unit-economics.md`.
   Every number in § Margins rests on it.

### Phase 1 — Synergy (asked 8 Sept, replied 10 Sept, go-ahead sent 11 Sept 2026)

Road confirmed, Royal Mail closed, importer of record treated as settled, incoterms hard-coded
per method. Synergy are building `European Delivery`. Still to come back from them: the go-live
date, which field drives the declared customs value, Royal Mail timing, and an Evri DDP price
for Europe. **None of those block the build.**

### Phase 2 — Before the switch

6. **Move the France monthly subscribers to quarterly.** Each monthly single-formula renewal
   loses about £20 under DDP (§ Margins), and renewals bypass a checkout minimum, so this is the
   only fix. Humphrey owns the conversation. It does not block the switch: deleting the bands
   will not break renewals, they simply keep losing money until moved.

### Phase 3 — The switch, once Synergy confirm `European Delivery` is live

7. ~~Rename the `Europe` and `france` zone rates to exactly `European Delivery`.~~
   **DONE 11 Sept 2026**, deliberately ahead of Synergy's build. Prices unchanged: `france`
   £24/£32, `Europe` £26/£41.

   **Why early.** The two failure modes are not symmetric. Renamed before Synergy are ready, a
   European order is held as "Invalid Dispatch Method" and ships a day or two late. Left on
   `Express International`, it ships DAP on Evri and the customer gets the doorstep bill, which
   is the entire problem being fixed. The hold is a safety net: once the rename is in, nothing
   can ship under the old terms. Georgina was told the rename is already live so anything held
   gets released.
8. **Enable collect duties and import taxes at checkout** for the EU markets. **Still waiting on
   Synergy**, and unlike the rename it should not go early. If they map `European Delivery` to
   DAP by mistake, duties-on means the customer pays at checkout *and* at the door. Waiting costs
   us roughly £35 once, if an order lands in the gap and ships DDP with no duty collected. That is
   the cheaper mistake. Needs HS codes and country of origin (both done) and Shopify Payments.
   Costs 0.5% promotional, 0.85% standard.
9. Set the French subscription contracts' shipping method to `European Delivery`
   (SCRUM-1340).
10. Publish the shipping policy copy.

### Phase 4 — After it is live

11. **Read the first France invoice.** Is the freight fuel-inclusive, does the £16 DTP appear,
    was the customer billed anything on delivery. That settles all three open assumptions in
    § Margins with real data instead of email.
12. Fix the declared customs value once Synergy name the field.
13. Check `docs/shipping/` still matches reality, then retire this plan.

### Phase 5 — Rest of world, separate work

14. **USA.** Moved to `Express International DHL` (DDP) at £59 / £112 with a 3-box minimum, pulled
    forward from this phase. Still open: FDA Prior Notice, and whether Evri DDP to the US is a
    cheaper carrier.
15. **UAE** is the worst lane on the sheet: £20 charged against £126 of cost at 3 boxes.
    Worth repricing whether or not it ever moves to DHL.
16. Revisit **IOSS** only if EU volume grows enough to justify the admin.
17. Revisit **Evri DDP for Europe** if Synergy's answer shows it covers duty and not just VAT
    under €150. Freight is roughly £12.63 against DHL Road's £46.36 at 6 boxes, which would
    change European margins materially.

## Subscription contracts

Subscription renewals ship on the method name stored on each contract
(`docs/shipping/SYNERGY_ROUTING.md`). The French contracts need that name set to
`European Delivery` as part of the switch, not before, or they get corrected twice. That work
is SCRUM-1340; UK contracts are SCRUM-1311 and untouched by this plan.

---

## HS codes — DONE 8 Sept 2026

All live sellable variants now carry HS code `210690` and country of origin `GB`. Verified
via the Shopify Admin API: **38 of 39 live sellable variants complete.** A store-level
default country of origin (United Kingdom) is also set, and the value was written explicitly
onto each variant rather than relying on the default, since it is not certain a store default
reaches Synergy's variant-level data pull.

Outstanding: `CONKA-TRAVEL-PACK-28` (neither field). Low priority.

Whole catalogue reads HS on 38/128 and origin on 44/128. The remainder is dead merch and
free-gift variants that do not ship internationally.

What HS codes do and do not fix, why one code covers everything, when to enable collect
duties at checkout, and the UK VAT setting on EU orders: `docs/shipping/DUTIES_AND_DDP.md`.

---

## Open questions

**Synergy — asked 8 Sept, replied 10 Sept, go-ahead sent 11 Sept 2026.** Road confirmed, Royal
Mail closed, importer of record treated as settled, incoterms hard-coded (§ Synergy's answers).
Left to run, none of them blocking:

1. **Go-live date** for `European Delivery`, so the Shopify change can be timed against it.
2. **Which field** drives the declared customs value. Third time of asking, and it is
   over-declaring live orders.
3. An **Evri DDP price for Europe**, and whether it covers duty as well as VAT.
4. When does **Royal Mail international** come back, and is there any low-cost sub-2kg option in
   the meantime? Needed for US creator seeding, not for customer orders.
5. Does the **DTP fee pass through at cost**, like the other carrier surcharges?

Worth adding while the thread is open, neither urgent:

6. Why did the Evri label for order `13234918031734` fail, and how often does that happen?
7. Are Synergy filing **FDA Prior Notice** on US shipments, and do they hold our manufacturer's
   FDA registration number? (Phase 5. Note this may surface a problem that halts US shipping,
   which is a reason to time it deliberately rather than a reason not to ask.)

**CONKA:**

8. Confirm **COGS per box** against a current cost sheet. The £17.96 comes from the conka-lab
   margins dashboard, whose displayed prices are stale. Everything in § Margins rests on it.
9. Are EU export sales being **zero-rated** on our UK VAT return? (accountant)

**Closed since 8 Sept:**

- *Where does the minimum international order sit?* **3 boxes**, set by the flat road rate, not
  by judgement (§ Margins).
- *What is the rule for EU Skio renewals below the floor?* **Migrate to quarterly** (Phase 2).
  Monthly European renewals lose about £20 each.
- *Correct French VAT rate, 5.5% or 20%?* **Moot.** Shopify derives the rate at checkout from the
  HS code and destination, and the customer pays it, so it is no longer a margin question.

---

## Verification (8 Sept 2026)

Every regulatory claim above was checked against primary and trade sources. All held:

- EU €3 flat duty live 1 Jul 2026, **per tariff line**, separate from VAT, running to
  1 Jul 2028. Confirmed. The collection mechanism is genuinely unsettled.
- France €2 TPC live 1 Mar 2026, **H7 declarations only**, per HS code not per item.
  Confirmed.
- US de minimis: 24 Jun 2026 non-postal, 24 Jul 2026 postal, both interim final rules.
  Confirmed.
- H7 cannot carry preferential origin; H1 is the only route to a TCA 0% claim. Confirmed.
- Managed Markets forces DHL Express or FedEx labels and makes Global-e merchant of record.
  Confirmed.
- Evri's public guidance: DDP to the USA only, everything else DAP. Confirmed, and it
  contradicts the `DDP Courier` line on Synergy's Evri card.
- FDA Prior Notice required per shipment for dietary supplements, express carriers not
  exempt, facility registration number required. Confirmed.
- Transaction value is the legal customs value. Confirmed.

Added 10 Sept 2026, from DHL's **UK Service & Rate Guide 2026** and Synergy's own rate card:

- **Duty Tax Paid: 2% of fiscal charges, minimum £16.00.** Published under Duty Billing
  Services. Distinct from Duty Tax Processing (2.5%, min £12.00 / £11.00), which is the
  receiver-pays product and not what DDP uses.
- DHL describes Duty Tax Paid as arranging for the shipper to be **billed** rather than the
  receiver, with no mention of moving the declarant. Supporting evidence on importer of
  record, not proof.
- Fuel is set **monthly**, on the prior month's USGC spot average, on **two indices**: jet
  fuel for International Time Definite (Express Air), ULSD diesel for Regional Day Definite
  (Economy Select). It applies to transportation charges **and to services and surcharges**.
- **Volumetric divisor 5000**, confirmed on the `DHL Surcharges` tab of Synergy's card. That
  tab carries no fuel percentage, only the divisor and a link to DHL's public page.

**Not verified:** the importer-of-record position under DHL DDP, the current fuel surcharge
percentages, whether our card's freight figures are fuel-inclusive, the current UK-US tariff
rate, and our box dimensions for volumetric weight.

---

## Sources

Primary:

- [European Commission — €3 customs duty for low-value parcels](https://commission.europa.eu/news-and-media/news/ensuring-fairness-and-safety-eur3-customs-duty-low-value-parcels-2026-06-29_en)
- [Council of the EU — customs duty on small parcels from 1 July 2026](https://www.consilium.europa.eu/en/press/press-releases/2025/12/12/customs-council-agrees-to-levy-customs-duty-on-small-parcels-as-of-1-july-2026/)
- [EC Taxation and Customs Union — guidance and legal text on the temporary flat fee](https://taxation-customs.ec.europa.eu/news/guidance-and-legal-text-temporary-flat-fee-low-value-imports-which-will-apply-until-1-july-2028-2026-06-08_en)
- [Federal Register — indefinite suspension of US de minimis, non-postal](https://www.federalregister.gov/documents/2026/06/24/2026-12670/indefinite-suspension-of-the-de-minimis-exemption-for-merchandise-arriving-through-all-modes-other)
- [Federal Register — indefinite suspension of US de minimis, mail](https://www.federalregister.gov/documents/2026/06/24/2026-12669/indefinite-suspension-of-the-de-minimis-exemption-for-mail-shipments-and-new-postal-informal-entry)
- [FDA — importing food products into the United States](https://www.fda.gov/food/food-imports-exports/importing-food-products-united-states)
- [eCFR 21 CFR Part 1 Subpart I — Prior Notice of Imported Food](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-1/subpart-I)
- [Shopify Help — Managed Markets for the United Kingdom](https://help.shopify.com/en/manual/international/managed-markets/managed-markets-uk)
- [Shopify Help — collecting duties and import taxes at checkout](https://help.shopify.com/en/manual/international/duties-and-import-taxes/charging-duties)
- [Evri — EU customs update 2026](https://www.evri.com/news/eu-customs-update-2026)
- [Evri — international shipping FAQs](https://www.evri.com/evri-international-faqs) (DDP is USA-only)
- [DHL Express — Duty Tax Paid billing services](https://www.dhl.de/en/geschaeftskunden/express/produkte-und-services/duty-billing-services.html)
- [DHL Express Service & Rate Guide 2026: United Kingdom](https://mydhl.express.dhl/content/dam/downloads/gb/en/rate-guide/service_and_rate_guide_gb_en.pdf.coredownload.pdf) (the DTP figure, the fuel-index mechanism)
- `docs/shipping/data/dhl-air-and-road-rates-2026.xlsx`, `DHL Surcharges` tab

Secondary, flagged as such:

- [Avalara — H1, H6 and H7 declaration types](https://www.avalara.com/blog/en/europe/2026/07/eu-customs-h1-h6-h7-declarations.html) (the H7-blocks-preference mechanism)
- [KPMG — France temporary small parcel tax from 1 March 2026](https://kpmg.com/us/en/taxnewsflash/news/2026/02/tnf-france-new-temporary-small-parcel-tax-effective-march-1-2026.html)
- [House of Commons Library — US trade tariffs](https://commonslibrary.parliament.uk/research-briefings/cbp-10240/) (UK 10% baseline, legal basis in flux)
- [RM Boulanger — selling DDP in France](https://www.rmboulanger.com/services/brexit/sell-ddp-in-france) (French VAT registration for a seller acting as importer)
- DTP and IOSS intermediary pricing: vendor sources, indicative only.
