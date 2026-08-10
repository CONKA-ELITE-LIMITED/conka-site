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
const CLIENT_ID = env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = env.SHOPIFY_CLIENT_SECRET;
const SINCE = process.argv[2] || "2026-07-24";

// client-credentials grant -> 24h token
const tokenRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  }),
});
const { access_token } = await tokenRes.json();
if (!access_token) {
  console.error("No token", await tokenRes.text());
  process.exit(1);
}

async function gql(query) {
  const r = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": access_token,
    },
    body: JSON.stringify({ query }),
  });
  return r.json();
}

const orders = [];
let cursor = null;
let has = true;
while (has) {
  const after = cursor ? `, after: "${cursor}"` : "";
  const data = await gql(`{
    orders(first: 100, query: "created_at:>=${SINCE}", sortKey: CREATED_AT${after}) {
      pageInfo { hasNextPage endCursor }
      edges { node {
        name createdAt
        totalPriceSet { shopMoney { amount } }
        customAttributes { key value }
        tags
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

const listicle = orders.filter((o) =>
  o.customAttributes.some((a) => a.key === "_listicle_origin" && a.value)
);

function personaSection(origin) {
  // token = <slug>-<section>; slug may include "-listicle"
  const clean = origin.replace(/-listicle/, "");
  const idx = clean.lastIndexOf("-");
  return { persona: clean.slice(0, idx), section: clean.slice(idx + 1) };
}

const rows = listicle.map((o) => {
  const origin = o.customAttributes.find((a) => a.key === "_listicle_origin").value;
  const { persona, section } = personaSection(origin);
  return {
    name: o.name,
    createdAt: o.createdAt,
    value: Number(o.totalPriceSet.shopMoney.amount),
    persona,
    section,
    origin,
    tags: o.tags,
  };
});

console.log(`Total store orders since ${SINCE}: ${orders.length}`);
console.log(`Listicle-tagged orders: ${rows.length}\n`);
for (const r of rows) {
  console.log(`${r.name}\t${r.createdAt}\t£${r.value.toFixed(2)}\t${r.persona}\t${r.section}`);
}

const byPersona = {};
for (const r of rows) {
  byPersona[r.persona] ??= { orders: 0, rev: 0 };
  byPersona[r.persona].orders++;
  byPersona[r.persona].rev += r.value;
}
console.log("\nBy persona:");
for (const [p, v] of Object.entries(byPersona)) {
  console.log(`${p}\t${v.orders} orders\t£${v.rev.toFixed(2)}`);
}
const bySection = {};
for (const r of rows) bySection[r.section] = (bySection[r.section] || 0) + 1;
console.log("\nBy section:", JSON.stringify(bySection));

// cadence from tags
function cadence(o) {
  const t = o.tags.map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("quarterly"))) return "quarterly";
  if (t.some((x) => x.includes("monthly"))) return "monthly";
  if (t.some((x) => x.includes("subscription") && !x.includes("#"))) return "monthly";
  return "onetime";
}
const cad = { monthly: { n: 0, rev: 0 }, quarterly: { n: 0, rev: 0 }, onetime: { n: 0, rev: 0 } };
for (const o of listicle) {
  const c = cadence(o);
  cad[c].n++;
  cad[c].rev += Number(o.totalPriceSet.shopMoney.amount);
}
console.log("\nCadence:");
for (const [k, v] of Object.entries(cad)) console.log(`${k}\t${v.n}\t£${v.rev.toFixed(2)}`);
console.log(`\nTotal tagged revenue: £${rows.reduce((s, r) => s + r.value, 0).toFixed(2)}`);
const withTag = rows.filter((r) => r.tags.some((t) => t.startsWith("persona:") || t === "listicle"));
console.log(`Orders carrying persona:/listicle tag: ${withTag.length}`);
