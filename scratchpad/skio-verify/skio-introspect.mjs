import fs from "node:fs";
const env = Object.fromEntries(
  fs.readFileSync(".env.local", "utf8").split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const type = process.argv[2];
const q = `query { __type(name: "${type}") { fields { name type { name kind ofType { name } } } } }`;
const r = await fetch("https://graphql.skio.com/v1/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json", authorization: `API ${env.SKIO_API_TOKEN}` },
  body: JSON.stringify({ query: q }),
});
const j = await r.json();
console.log((j.data?.__type?.fields || []).map(f => f.name).join(", ") || JSON.stringify(j).slice(0,400));
