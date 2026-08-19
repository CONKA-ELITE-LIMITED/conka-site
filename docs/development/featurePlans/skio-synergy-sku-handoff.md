# Skio → Synergy: new SKU handoff (Phase 2, task 2)

**What:** the 6 net-new Skio base variants need registering on Synergy's side so orders explode into physical 28-boxes at pick time. All 6 already carry the correct `custom.bundlecomposition` metafield + weight in Shopify (audited + verified 2026-08-18, SCRUM-1223) — Synergy explodes via that metafield automatically, so this is a "know these SKUs exist and how they map" note, not manual portal config.

**Context for Synergy:** the only physical unit is the 28-shot box (`FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`). Every SKU below is a virtual bundle of those boxes. Weight = boxes × 2.1 kg. Do not treat any of these as `SYNERGYIGNORE`.

**Then:** a live routing test (task 3) — a normally-paid Skio order should pull (open+paid+unfulfilled), get `IMPORTSYNERGY`, explode into 28-box component lines, and inventory-route to the Synergy location. Do **not** use test order `#3879` for this — it was a £0 100%-off order, already auto-fulfilled, so it will not pull.

---

## Forward-to-Synergy message (plain text — copy below the line)

Hi Bethany,

We're moving our subscriptions from Loop to Skio and have created 6 new product SKUs for it. They're all virtual bundles that map onto the existing 28-shot Flow and Clear boxes we already ship — no new physical stock, no new labels. Each one carries a bundle-composition field in Shopify so it should explode into the component 28-boxes automatically on pull, the same way the current quarterly SKUs do.

Please add these to your side so orders pull and pick correctly. None of them should be set to ignore.

SKU        Ships as                          Boxes   Weight
FLOW-20    1x FLOW-FUNNEL-28                  1       2.1 kg
FLOW-60    3x FLOW-FUNNEL-28                  3       6.3 kg
CLEAR-20   1x CLEAR-FUNNEL-28                 1       2.1 kg
CLEAR-60   3x CLEAR-FUNNEL-28                 3       6.3 kg
BOTH-40    1x FLOW-FUNNEL-28 + 1x CLEAR-FUNNEL-28    2   4.2 kg
BOTH-120   3x FLOW-FUNNEL-28 + 2x CLEAR-FUNNEL-28    5   10.5 kg

Once you've added them, we'll place a live test subscription order so we can confirm it pulls, explodes into the 28-boxes, and routes to your location before we switch everything over.

Thanks,
Rudh
