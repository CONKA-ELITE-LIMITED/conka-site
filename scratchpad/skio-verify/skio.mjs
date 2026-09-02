// Read-only Skio GraphQL probe: subscriptions created since cutover.
import fs from "node:fs";
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const q = `
query Recent {
  Subscriptions(where: {createdAt: {_gte: "2026-09-01"}}, order_by: {createdAt: asc}) {
    id
    createdAt
    status
    nextBillingDate
    deliveryPrice
    Discounts { title type percentage fixedValue redeemCode timesUsed maxTimesUsed }
    SubscriptionLines {
      priceWithoutDiscount
      quantity
      sellingPlanId
      customAttributes
      Discounts { title type percentage fixedValue redeemCode timesUsed maxTimesUsed }
      ProductVariant { title sku }
    }
  }
}`;
const r = await fetch("https://graphql.skio.com/v1/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json", authorization: `API ${env.SKIO_API_TOKEN}` },
  body: JSON.stringify({ query: q }),
});
const j = await r.json();
fs.writeFileSync("scratchpad/skio-verify/skio.json", JSON.stringify(j, null, 2));
console.log(JSON.stringify(j.errors ?? j.data?.Subscriptions?.length, null, 2));
