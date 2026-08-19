# Skio → Synergy: new SKU handoff (Phase 2, task 2)

**What:** 6 new subscription SKUs (Skio migration) need onboarding on Synergy's side. Each is a virtual bundle of our existing 28-shot Flow/Clear boxes, defined by a `custom.bundlecomposition` metafield already set in Shopify (audited 2026-08-18, SCRUM-1223). No new physical products.

**How to send:** email the message below to Synergy's help address. It asks them what's needed to get the SKUs into their system. Then place one normally-paid Skio test order and confirm it pulls, explodes into 28-boxes, and routes to the Synergy location (not test order #3879 — it was £0/auto-fulfilled and won't pull).

---

## Email to Synergy (copy below the line)

Subject: New subscription SKUs to onboard (CONKA)

Hi,

As part of migrating our subscription service to a new platform, we've created 6 new SKUs in Shopify. Importantly, these are not new core products for you to handle, they're new SKUs that map onto the exact same 28-shot Flow and Clear boxes you already stock and ship. They exist to make the subscription migration clean and to simplify our tracking going forward.

Each new SKU has a BundleComposition field set in Shopify that tells the system which existing boxes it's made of, so it should explode into those boxes automatically on pull (the same way our current quarterly SKUs do). For example, CLEAR-20 has BundleComposition = 1xCLEAR-FUNNEL-28, meaning it ships as one existing 28-shot Clear box.

Here's the full mapping:

  SKU        BundleComposition (Shopify)              Ships as                          Weight
  FLOW-20    1xFLOW-FUNNEL-28                          1 x 28-shot Flow box              2.1 kg
  FLOW-60    3xFLOW-FUNNEL-28                          3 x 28-shot Flow box              6.3 kg
  CLEAR-20   1xCLEAR-FUNNEL-28                         1 x 28-shot Clear box             2.1 kg
  CLEAR-60   3xCLEAR-FUNNEL-28                         3 x 28-shot Clear box             6.3 kg
  BOTH-40    1xFLOW-FUNNEL-28 + 1xCLEAR-FUNNEL-28      1 Flow + 1 Clear box              4.2 kg
  BOTH-120   3xFLOW-FUNNEL-28 + 2xCLEAR-FUNNEL-28      3 Flow + 2 Clear box              10.5 kg

Could you let us know what you need from us to get these 6 SKUs into the Synergy system so orders against them pull and pick correctly? None of them should be set to ignore.

One note on direction, nothing needed from you yet: for now everything ships as these existing 28-shot boxes. Once our smaller 20-shot boxes are produced we'll let you know, update these SKUs in Shopify to point at the 20-boxes, and retire some of the older SKUs. Just flagging so the mappings changing later isn't a surprise.

Once they're set up we'll place a live test order to confirm it pulls and picks correctly before we switch everything over.

Thanks,
Rudh
