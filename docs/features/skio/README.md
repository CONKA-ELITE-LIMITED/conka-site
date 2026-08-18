# Skio Subscriptions — Canonical Reference

Skio is CONKA's subscription platform, replacing Loop. It runs on **Shopify Subscription Contracts** natively (checkout stays Shopify-hosted), creates its own selling plans, and provides a hosted customer portal we embed as a **server-signed iframe**.

This folder is the canonical "how it works" reference. Live status, scope, and decisions live in the feature plans (linked below); this documents the built system.

## Status (2026-08-18)

Built behind the build-time flag **`NEXT_PUBLIC_SKIO_ENABLED`** (default `false` = Loop stays live). Flip to `true` + redeploy at the Phase 4 cutover.

| Phase | What | State |
|-------|------|-------|
| 1 | Skio setup + selling-plan mapping | Done |
| 2 | Re-point subscribe surfaces to Skio | Done (behind flag) |
| 3 | Embedded customer portal (`/account/manage`) | Built + verified end-to-end (behind flag) |
| 4 | Cutover + Loop decommission | Not started |
| 5 | Legacy protocol retirement | Future (ops-gated) |

## Index

| Doc | Topic |
|-----|-------|
| [`setup.md`](./setup.md) | Skio app, selling plans, variants, env vars, GraphQL API, the flag |
| [`migration.md`](./migration.md) | Loop -> Skio model, cutover runbook, decisions (Skio's team runs the contract migration) |
| [`customer-portal.md`](./customer-portal.md) | The iframe portal: signed-src route, auth/auto-login, `/account/manage`, theming, gotchas |

## Related docs (live status + scope, not reference)

- Plan + phase breakdown: `docs/development/featurePlans/skio-subscription-migration.md`
- Living status tracker: `docs/development/featurePlans/skio-migration-status.md`
- Attribution + fulfilment parity (SCRUM-1223): `docs/development/featurePlans/skio-attribution-fulfilment-parity.md`
- Portal iframe restyle history: `docs/features/CUSTOMER_PORTAL.md` (the self-built Loop portal Skio replaces)

## Key facts

- **GraphQL API:** `https://graphql.skio.com/v1/graphql`, header `authorization: API {token}`. Limits: depth 4, 100 nodes/request, 2,000 req/min. Shopify GIDs exposed as `platformId`.
- **Portal:** Customer Portal v3 (cpv3), embedded per Skio's headless iframe guide.
- **Env vars:** `SKIO_API_TOKEN`, `SKIO_STORE_ID_HASH`, `NEXT_PUBLIC_SKIO_ENABLED`, optional `SKIO_PORTAL_HOSTNAME`. See [`setup.md`](./setup.md).
- **Code:** `app/lib/skio.ts` (API config + Loop->Skio plan map), `app/lib/subscriptionsFlag.ts` (the flag), `app/lib/funnelData.ts` (`SKIO_SUBSCRIPTION_VARIANTS`), `app/api/auth/skio-portal/route.ts` (portal signer), `app/account/manage/*` (portal UI).
