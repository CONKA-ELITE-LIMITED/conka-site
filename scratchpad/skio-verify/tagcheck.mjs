import fs from "node:fs";
const o = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const kv = (a) => Object.fromEntries((a || []).map((x) => [x.key, x.value]));
let withOrigin = 0, tagged = 0, personaTags = new Set();
const rows = [];
for (const x of o) {
  const ca = kv(x.customAttributes);
  const origin = ca._listicle_origin;
  const hasTag = x.tags.some((t) => t === "listicle" || t.startsWith("persona:"));
  if (origin) withOrigin++;
  if (hasTag) { tagged++; x.tags.filter(t=>t.startsWith("persona:")).forEach(t=>personaTags.add(t)); }
  if (origin || hasTag) rows.push(`${x.name} ${x.createdAt.slice(0,10)} origin=${origin||"-"} tagged=${hasTag}`);
}
console.log(`total=${o.length} with _listicle_origin=${withOrigin} with listicle/persona tag=${tagged}`);
console.log("persona tags seen:", [...personaTags].join(", ") || "none");
console.log(rows.slice(-40).join("\n"));
