import { readFileSync } from "node:fs";

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

async function gql(query) {
  const r = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
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
        name createdAt
        totalPriceSet { shopMoney { amount } }
        tags
        customAttributes { key value }
        customer { numberOfOrders }
      } }
    }
  }`);
  if (data.errors) { console.error(JSON.stringify(data.errors)); process.exit(1); }
  const conn = data.data.orders;
  for (const e of conn.edges) orders.push(e.node);
  has = conn.pageInfo.hasNextPage;
  cursor = conn.pageInfo.endCursor;
}

// week buckets Thu 24 Jul-based (match doc: 3-10, 10-17, 17-24, 24-31, 31-7, 7-10...)
const weeks = [
  ["2026-07-03", "2026-07-10"],
  ["2026-07-10", "2026-07-17"],
  ["2026-07-17", "2026-07-24"],
  ["2026-07-24", "2026-07-31"],
  ["2026-07-31", "2026-08-07"],
  ["2026-08-07", "2026-08-11"],
];

function isRenewal(o) {
  const tags = o.tags.map((t) => t.toLowerCase());
  const cycle = tags.find((t) => t.includes("billing cycle"));
  if (!cycle) return false; // no billing cycle = one-time / new order
  const cycleNum = parseInt(cycle.replace(/\D/g, ""), 10);
  return cycleNum >= 2; // cycle #2+ = recurring renewal
}
function isListicle(o) {
  return o.customAttributes.some((a) => a.key === "_listicle_origin" && a.value);
}

console.log(`Total orders since ${SINCE}: ${orders.length}\n`);
console.log("Week\tTotal\tNewDemand\tNewCust\tRenewals\tTagged\tNewDemandRev");
for (const [start, end] of weeks) {
  const inWeek = orders.filter((o) => o.createdAt >= start && o.createdAt < end + "T23:59:59Z");
  const renewals = inWeek.filter(isRenewal);
  const newDemand = inWeek.filter((o) => !isRenewal(o));
  const newCust = newDemand.filter((o) => o.customer?.numberOfOrders === 1);
  const tagged = inWeek.filter(isListicle);
  const rev = newDemand.reduce((s, o) => s + Number(o.totalPriceSet.shopMoney.amount), 0);
  console.log(
    `${start}→${end}\t${inWeek.length}\t${newDemand.length}\t${newCust.length}\t${renewals.length}\t${tagged.length}\t£${rev.toFixed(0)}`
  );
}

// dump tag vocabulary to verify classifier
const allTags = new Set();
for (const o of orders) for (const t of o.tags) allTags.add(t);
console.log("\nAll tags seen:", [...allTags].sort().join(" | "));
