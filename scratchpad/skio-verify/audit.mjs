// Local, read-only diagnostic: verify tags + attribution on post-Skio-cutover orders.
// Reads creds from .env.local (attribution-audit app: read_orders/read_all_orders/read_customers).
import fs from "node:fs";

const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const DOMAIN = env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const SINCE = process.argv[2] || "2026-09-01T11:00:00Z";

async function mint() {
  const r = await fetch(`https://${DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("mint failed: " + JSON.stringify(j));
  return j.access_token;
}

const QUERY = `
query Orders($q: String!, $cursor: String) {
  orders(first: 50, query: $q, sortKey: CREATED_AT, after: $cursor) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id name createdAt tags test
      displayFinancialStatus
      app { name }
      channelInformation { channelDefinition { channelName } }
      currentTotalPriceSet { shopMoney { amount currencyCode } }
      customAttributes { key value }
      discountCodes
      customerJourneySummary {
        momentsCount { count }
        firstVisit { source sourceType referrerUrl landingPage utmParameters { source medium campaign content term } }
        lastVisit  { source sourceType referrerUrl landingPage utmParameters { source medium campaign content term } }
      }
      lineItems(first: 10) {
        nodes {
          name sku quantity
          customAttributes { key value }
          sellingPlan { name sellingPlanId }
        }
      }
    }
  }
}`;

async function gql(token, variables) {
  const r = await fetch(`https://${DOMAIN}/admin/api/2025-10/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query: QUERY, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors, null, 2));
  return j.data.orders;
}

const token = await mint();
const q = `created_at:>=${SINCE}`;
let cursor = null, nodes = [];
do {
  const page = await gql(token, { q, cursor });
  nodes.push(...page.nodes);
  cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
} while (cursor);

fs.writeFileSync(process.argv[3] || "scratchpad/skio-verify/orders.json", JSON.stringify(nodes, null, 2));
console.log(`orders since ${SINCE}: ${nodes.length}`);
