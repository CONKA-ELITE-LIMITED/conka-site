# Skio Setup

How Skio is installed, configured, and wired into the headless storefront. See [`README.md`](./README.md) for the index.

## 1. Skio app + account

- Skio is installed as a Shopify app on the prod store (`conka-6770.myshopify.com`, primary domain `shop.conka.io`).
- Run **Shopify Sync** in the Skio dashboard (Products page) once, so Skio has the catalog. Required.
- We are headless, so we do **not** use Skio's Liquid app-block plan picker (we render our own selector in Next.js) and we do **not** use the theme link-swap portal instructions. The customer portal is embedded via iframe (see [`customer-portal.md`](./customer-portal.md)).

## 2. Selling plans (4 Subscribe & Save)

Created in the Skio dashboard. Pricing rule = **Percentage off** (never Set price - Skio ignores it under Shopify market prices, risking international overcharge). Attached to the **base variant only**.

| Group | Variants | Base £ | Bill every | % off | Sub price | Skio plan GID |
|-------|----------|--------|-----------|-------|-----------|---------------|
| 20 Shots - Monthly | `FLOW-20` + `CLEAR-20` | 69.98 | 1 month | 42.86% | 39.99 | `712928887158` |
| 60 Shots - Quarterly | `FLOW-60` + `CLEAR-60` | 189.99 | 3 months | 42.11% | 109.99 | `712928919926` |
| 40 Shots - Monthly | `BOTH-40` | 99.98 | 1 month | 25.00% | 74.99 | `712928952694` |
| 120 Shots - Quarterly | `BOTH-120` | 279.99 | 3 months | 46.43% | 149.99 | `712928985462` |

Base price = the product's full one-time price (postage baked in); the plan takes the discount off, so subscriptions ship free.

## 3. Variants (6 base, net-new)

Net-new SKUs, nothing existing touched. Each is a **Synergy virtual bundle** via `custom.bundlecomposition` (`NxSKU`), exploded into physical 28-boxes at pick time; `custom.batchexpiry` blank; weight = boxes x 2.1 kg.

| SKU | Variant GID | Shots | bundlecomposition |
|-----|-------------|-------|-------------------|
| `FLOW-20` | `58457787040118` | 20 | `1xFLOW-FUNNEL-28` |
| `CLEAR-20` | `58457822069110` | 20 | `1xCLEAR-FUNNEL-28` |
| `FLOW-60` | `58457811550582` | 60 | `3xFLOW-FUNNEL-28` |
| `CLEAR-60` | `58457854411126` | 60 | `3xCLEAR-FUNNEL-28` |
| `BOTH-40` | `58457859686774` | 40 | `1xFLOW-FUNNEL-28+1xCLEAR-FUNNEL-28` |
| `BOTH-120` | `58457864077686` | 120 | `3xFLOW-FUNNEL-28+2xCLEAR-FUNNEL-28` |

The `-28`/`-80`/`-56`/`-140` first-order bonus variants + the swap Journey are a later fulfilment stage; see the migration status doc. Never delete the physical `FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`.

## 4. Environment variables

| Var | Scope | Purpose |
|-----|-------|---------|
| `SKIO_API_TOKEN` | server, all envs | Skio GraphQL API (dashboard -> Settings -> API Keys). Header `authorization: API {token}`. |
| `SKIO_STORE_ID_HASH` | server (secret), all envs | Signs the portal login hash `md5(customerId + STORE_ID_HASH)`. From `dashboard.skio.com/theme`. **Never `NEXT_PUBLIC_`** (would let anyone forge a login). Value: `4e562fa9fab57abd4bc73be4c900221d`. |
| `NEXT_PUBLIC_SKIO_ENABLED` | build-time, per env | `true` attaches Skio + points `/account` at the portal; `false`/unset = Loop. Locally testable: set in `.env.local` + restart dev. |
| `SKIO_PORTAL_HOSTNAME` | server, optional | Overrides the portal `hostname` param. Defaults in code to `shop.conka.io` (the domain Skio keys the site on). |

`app/lib/env.ts` exposes `skioApiToken` / `skioStoreIdHash` getters (in `optionalEnvVars`).

## 5. GraphQL API + pulling GIDs

`app/lib/skio.ts` holds the endpoint + auth header + the Loop->Skio plan map (`LOOP_TO_SKIO_SELLING_PLAN`). To pull plan/variant GIDs after creating plans:

```
POST https://graphql.skio.com/v1/graphql   (header: authorization: API {SKIO_API_TOKEN})
query { SellingPlans { platformId name } }
query { PricingPolicies { percentageOff SellingPlan { platformId } } }
query { SellingPlanGroupResources { SellingPlanGroup { platformId } ProductVariant { platformId sku } } }
```

Match plans to products by `percentageOff` and by the attached variant SKUs.

## 6. The flag

`subscriptionsUseSkio()` (`app/lib/subscriptionsFlag.ts`) reads `NEXT_PUBLIC_SKIO_ENABLED`. It gates the storefront variant/plan selection (`funnelData.ts`) and the `/account` -> portal routing. Off by default so Loop stays live; the cutover is flipping it on + redeploy, with Vercel Instant Rollback as the emergency revert.
