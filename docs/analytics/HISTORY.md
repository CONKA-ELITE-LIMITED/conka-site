# Analytics & Attribution: History and Evolution

A high-level timeline of how CONKA's analytics and Meta attribution got to where they are, so anyone can see **what was done, when, why, and why it changed**. This is the story, not the spec. For current implementation see [README.md](README.md); for the detailed diagnosis log see [HEADLESS_ATTRIBUTION_FIX.md](HEADLESS_ATTRIBUTION_FIX.md).

> Kept deliberately short. Ticket numbers and dates are the index; git history holds the code, the deep docs hold the detail.

---

## Timeline

### Early 2026 (Feb) — Vercel-first analytics, Triple Whale reconnection
The first analytics build after the headless rebuild leaned heavily on Vercel Analytics with a large per-event property spec, and spent effort reconnecting Triple Whale (drain vs pixel options).

**Why we moved on:** the event taxonomy was over-specified for how the data was actually used. It was simplified to a small, budgeted set (see [FUNNEL_EVENTS.md](FUNNEL_EVENTS.md)), Triple Whale settled as the client `TriplePixel` only, and verification moved to the `/review-analytics` skill.
**Removed 2026-07-20:** `IMPLEMENTATION_GUIDE.md`, `SIMPLIFIED_GUIDE.md`, `TRIPLE_WHALE_INTEGRATION.md`, `VERIFICATION_GUIDE.md` (all Feb-2026, superseded; recoverable from git). This history entry replaces their record.

### May-June 2026 — The headless attribution fix (the turning point)
**Problem:** the storefront is headless but checkout was Shopify-hosted on `*.myshopify.com`, a different registrable domain. The `_fbp` / `_fbc` cookies did not carry across the site to checkout boundary, so Purchases reached Meta without the ad-click id. Spend was being optimised against conversions Meta could not attribute.

**What was done:**
- Moved checkout to `shop.conka.io` so it shares the `.conka.io` registrable domain and the identity cookies carry across (2026-05-29).
- Added server-side Purchase via a Shopify `orders/paid` webhook (SCRUM-1046/1047), sending hashed identity from the order.
- Excluded Loop subscription rebills from Purchase via `checkout_token` (after a June miss where the first attempt keyed on `client_details`, which Loop copies onto every renewal).

Detail: [HEADLESS_ATTRIBUTION_FIX.md](HEADLESS_ATTRIBUTION_FIX.md).

### July 2026 — Match quality, coverage, and honesty
With the transport fixed, the focus shifted to the quality and truthfulness of the signal.

- **CAPI resilience (SCRUM-1153).** The server CAPI now fires independently of the browser pixel, so PageView / ViewContent / AddToCart survive ad-blockers and in-app browsers.
- **Single pixel confirmed.** Dataset `1138202151698404` verified aligned across ads, site, and CAPI.
- **Upper-funnel identity (SCRUM-1158).** A first-party `conka_uid` (`external_id`) and a self-minted `_fbp` ride every event and bridge to the Purchase, giving logged-out cold traffic a stable match key.
- **Rebill leak fixed (SCRUM-1159).** The Shopify Facebook channel was independently firing every Loop rebill into the pixel as a Purchase (Meta reported roughly 110/month against roughly 28 real). Data-sharing was switched Maximum to Conservative, removing the channel's server route. This made the Purchase number honest, not larger.
- **On-site email capture (SCRUM-1169).** The Alia popup's `alia:signup` email/phone is attached to CAPI events, raising match quality for the signed-up subset. This overturned the earlier premise that we could not send email for cold traffic. See [EMAIL_CAPTURE_ENRICHMENT.md](EMAIL_CAPTURE_ENRICHMENT.md).
- **Stape sGTM evaluated and parked (SCRUM-1168).** Server-side GTM was assessed and shelved: it largely duplicates our existing first-party CAPI and does not address the identity gap. Two genuine but secondary benefits were noted (longer cookie lifetime, multi-destination fan-out). Decision and the questions to Stape are on the ticket.

### Smaller changes worth remembering
- **InitiateCheckout** was briefly removed from the frontend (2026-06-01, SCRUM-1043) to avoid double-counting with the Shopify channel, then reinstated on our own domain (fired before the checkout redirect) once the headless timing was understood.
- **Klaviyo onsite JS** (signup popup) was disabled (2026-05-26); on-site email capture is now handled by Alia, which syncs to Klaviyo server-side.

---

## Where the deep detail lives now

| Topic | Doc |
|-------|-----|
| Current implementation + fact-box + data-flow diagram | [README.md](README.md) |
| Meta pixel + CAPI reference | [META_PIXEL_AND_CAPI.md](META_PIXEL_AND_CAPI.md) |
| Alia email/phone enrichment | [EMAIL_CAPTURE_ENRICHMENT.md](EMAIL_CAPTURE_ENRICHMENT.md) |
| Vercel funnel taxonomy | [FUNNEL_EVENTS.md](FUNNEL_EVENTS.md) |
| Dated diagnosis + fix log | [HEADLESS_ATTRIBUTION_FIX.md](HEADLESS_ATTRIBUTION_FIX.md) |
| Fuller problem narrative | [ATTRIBUTION_STATE_AND_PLAN.md](ATTRIBUTION_STATE_AND_PLAN.md) |
