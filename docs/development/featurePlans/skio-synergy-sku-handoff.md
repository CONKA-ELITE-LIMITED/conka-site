# Skio → Synergy: new SKU handoff (Phase 2, task 2)

**What:** 6 new subscription SKUs (Skio migration) need registering on Synergy's side. Each is a virtual bundle of the existing 28-shot Flow/Clear boxes and already carries the correct `bundlecomposition` metafield + weight in Shopify (audited 2026-08-18, SCRUM-1223), so Synergy explodes them automatically on pull. No new physical stock.

**How to send:** email the mapping table below to Synergy's help address. Then place one normally-paid Skio test order and confirm it pulls, explodes into 28-boxes, and routes to the Synergy location (do not use test order #3879 — it was £0/auto-fulfilled and won't pull).

---

## Email to Synergy (copy below the line)

Subject: New subscription SKUs to add (CONKA)

Hi,

We're moving our subscriptions to a new platform and have created 6 new product SKUs. They're all virtual bundles built from our existing 28-shot Flow and Clear boxes, so no new physical stock or labels. Each one already has a bundle-composition field set in Shopify, so it should explode into the component boxes automatically on pull, the same as our current quarterly SKUs. Please add them your side, and don't set any of them to ignore.

SKU        Ships as                                    Boxes   Weight
FLOW-20    1x FLOW-FUNNEL-28                            1       2.1 kg
FLOW-60    3x FLOW-FUNNEL-28                            3       6.3 kg
CLEAR-20   1x CLEAR-FUNNEL-28                           1       2.1 kg
CLEAR-60   3x CLEAR-FUNNEL-28                           3       6.3 kg
BOTH-40    1x FLOW-FUNNEL-28 + 1x CLEAR-FUNNEL-28       2       4.2 kg
BOTH-120   3x FLOW-FUNNEL-28 + 2x CLEAR-FUNNEL-28       5       10.5 kg

Heads-up on direction: for now everything ships as the existing 28-shot boxes. Once our smaller 20-shot boxes are produced we'll let you know, update these SKUs in Shopify to point at the new 20-boxes, and retire some of the older SKUs. Nothing needed from you on that yet, just flagging so the bundle mappings changing later isn't a surprise.

Once these are added we'll place a live test order to confirm it pulls and picks correctly before we switch everything over.

Thanks,
Rudh
