// SCRUM-1469: one pull for the listicle + trial pack review.
// Dumps every order since SINCE as compact JSON (stdout) for offline analysis.
// Renewal test is platform-independent (Skio-safe): a renewal never passes
// through checkout, so it is created by the subscription app / a
// subscription_contract source. Loop tags are NOT used (Skio does not write them).
import { readFileSync, writeFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const SHOP = "conka-6770.myshopify.com";
const SINCE = process.argv[2] || "2026-07-03";
const OUT = process.argv[3] || "listicle-review-orders.json";

const tokenRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    grant_type: "client_credentials",
    client_id: env.SHOPIFY_CLIENT_ID,
    client_secret: env.SHOPIFY_CLIENT_SECRET,
  }),
});
const { access_token } = await tokenRes.json();
if (!access_token) { console.error("No token"); process.exit(1); }

async function gql(query) {
  const r = await fetch(`https://${SHOP}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": access_token },
    body: JSON.stringify({ query }),
  });
  return r.json();
}

const orders = [];
let cursor = null, has = true;
while (has) {
  const after = cursor ? `, after: "${cursor}"` : "";
  const data = await gql(`{
    orders(first: 100, query: "created_at:>=${SINCE}", sortKey: CREATED_AT${after}) {
      pageInfo { hasNextPage endCursor }
      edges { node {
        name createdAt sourceName cancelledAt
        app { name }
        totalPriceSet { shopMoney { amount } }
        tags
        customAttributes { key value }
        customer { numberOfOrders }
        lineItems(first: 10) { nodes {
          sku quantity
          sellingPlan { name }
          customAttributes { key value }
        } }
      } }
    }
  }`);
  if (data.errors) { console.error(JSON.stringify(data.errors)); process.exit(1); }
  const conn = data.data.orders;
  for (const e of conn.edges) orders.push(e.node);
  has = conn.pageInfo.hasNextPage;
  cursor = conn.pageInfo.endCursor;
}

const slim = orders.map((o) => ({
  n: o.name,
  t: o.createdAt,
  v: Number(o.totalPriceSet.shopMoney.amount),
  src: o.sourceName,
  app: o.app?.name ?? null,
  cx: !!o.cancelledAt,
  noc: o.customer?.numberOfOrders ?? null,
  origin: o.customAttributes.find((a) => a.key === "_listicle_origin")?.value ?? null,
  seen: o.customAttributes.find((a) => a.key === "_trial_pack_seen")?.value ?? null,
  tags: o.tags,
  li: o.lineItems.nodes.map((l) => ({
    sku: l.sku,
    q: l.quantity,
    plan: l.sellingPlan?.name ?? null,
    attrs: Object.fromEntries(l.customAttributes.map((a) => [a.key, a.value])),
  })),
}));

writeFileSync(OUT, JSON.stringify(slim));
const vocab = {};
for (const o of slim) {
  const k = `${o.app} | ${o.src}`;
  vocab[k] = (vocab[k] || 0) + 1;
}
console.log(`${slim.length} orders since ${SINCE} -> ${OUT}`);
console.log("app | sourceName vocabulary:", JSON.stringify(vocab, null, 1));
