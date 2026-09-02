# Skio go-live verification scripts

Read-only diagnostics written for the 2026-09-02 tag + attribution audit
(see `docs/development/CART_ATTRIBUTES.md`). All read creds from `.env.local`.

| Script | What it does |
|--------|--------------|
| `audit.mjs` | Mints a 24h token from the **attribution-audit** app (`SHOPIFY_CLIENT_ID`/`SECRET`, scopes `read_orders`/`read_all_orders`) and pulls orders with tags, cart attributes, line-item properties, selling plan, discount codes and customer journey. `node audit.mjs <since-ISO> <out.json>` |
| `report.mjs` | Per-order attribution table from that JSON (fbp/fbc shown as present/empty, never printed) |
| `tagcheck.mjs` | Tag coverage: how many orders carry `_listicle_origin` vs an actual `listicle`/`persona:` tag |
| `skio.mjs` | Skio GraphQL: contracts created since a date, status, next billing date, post-Journey-swap variant, discounts |
| `skio-introspect.mjs` | `node skio-introspect.mjs <TypeName>` lists that type's fields. Skio's schema is undocumented and field names are non-obvious |

**Output JSON is gitignored.** It carries `_fbp`, `_fbc` and `conka_uid` for real
customers. Regenerate rather than commit.

Gotchas already paid for: `momentsCount` needs `{ count }`; Skio's `Subscription`
has no `StoreCustomer`, and its `ProductVariant` has no `shopifyId`.
