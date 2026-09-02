import fs from "node:fs";
const o = JSON.parse(fs.readFileSync("scratchpad/skio-verify/orders.json", "utf8"));
const kv = (a) => Object.fromEntries((a || []).map((x) => [x.key, x.value]));
for (const x of o) {
  const ca = kv(x.customAttributes);
  const li = x.lineItems.nodes.map((l) => {
    const p = kv(l.customAttributes);
    return `${l.sku || l.name}${l.sellingPlan ? ` [PLAN ${l.sellingPlan.sellingPlanId.split("/").pop()} ${l.sellingPlan.name}]` : " [OTP]"} props=${JSON.stringify(p)}`;
  });
  const fv = x.customerJourneySummary?.firstVisit;
  const lv = x.customerJourneySummary?.lastVisit;
  const utm = (v) => v?.utmParameters ? `${v.utmParameters.source}/${v.utmParameters.medium}/${v.utmParameters.campaign}` : "-";
  console.log([
    `${x.name}  ${x.createdAt}  ${x.currentTotalPriceSet.shopMoney.amount} ${x.currentTotalPriceSet.shopMoney.currencyCode}  app=${x.app?.name}  ${x.test ? "TEST" : ""}`,
    `  tags: ${JSON.stringify(x.tags)}`,
    `  cartAttrs: ${JSON.stringify(Object.fromEntries(Object.entries(ca).map(([k, v]) => [k, k === "_fbp" || k === "_fbc" ? (v ? "present" : "empty") : v])))}`,
    `  lines: ${li.join(" | ")}`,
    `  journey: moments=${x.customerJourneySummary?.momentsCount?.count ?? "-"} first=${fv?.sourceType}:${fv?.source} utm=${utm(fv)} last=${lv?.sourceType}:${lv?.source} utm=${utm(lv)} landing=${(lv?.landingPage||"").slice(0,80)}`,
  ].join("\n"));
}
