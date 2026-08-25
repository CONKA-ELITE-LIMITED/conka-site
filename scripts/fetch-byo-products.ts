/**
 * Fetch Build Your Order (Shopify tag: funnel) product variant IDs and selling plan IDs from Shopify Storefront API.
 *
 * Usage: npx tsx scripts/fetch-byo-products.ts
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
 *   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
  process.env[key] = value;
}

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const STOREFRONT_URL = `https://${STORE_DOMAIN}/api/2025-10/graphql.json`;

async function query(graphql: string) {
  const res = await fetch(STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN!,
    },
    body: JSON.stringify({ query: graphql }),
  });
  return res.json();
}

async function main() {
  // Search for products tagged "funnel"
  const result = await query(`
    {
      products(first: 10, query: "tag:funnel") {
        edges {
          node {
            id
            title
            handle
            tags
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  sku
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            sellingPlanGroups(first: 10) {
              edges {
                node {
                  name
                  sellingPlans(first: 10) {
                    edges {
                      node {
                        id
                        name
                        options {
                          name
                          value
                        }
                        priceAdjustments {
                          adjustmentValue {
                            ... on SellingPlanFixedAmountPriceAdjustment {
                              adjustmentAmount {
                                amount
                                currencyCode
                              }
                            }
                            ... on SellingPlanPercentagePriceAdjustment {
                              adjustmentPercentage
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error("GraphQL errors:", JSON.stringify(result.errors, null, 2));
    return;
  }

  const products = result.data.products.edges;

  if (products.length === 0) {
    console.log("No products found with tag 'funnel'. Are they Active and on the Online Store channel?");
    return;
  }

  console.log(`\n=== Found ${products.length} funnel products ===\n`);

  for (const { node: product } of products) {
    console.log(`📦 ${product.title} (${product.id})`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Tags: ${product.tags.join(", ")}`);
    console.log(`   Variants:`);
    for (const { node: variant } of product.variants.edges) {
      console.log(`     - ${variant.title}: ${variant.id}`);
      console.log(`       Price: £${variant.price.amount} | SKU: ${variant.sku || "(none)"}`);
    }
    console.log(`   Selling Plans:`);
    for (const { node: group } of product.sellingPlanGroups.edges) {
      console.log(`     Group: ${group.name}`);
      for (const { node: plan } of group.sellingPlans.edges) {
        const adj = plan.priceAdjustments?.[0]?.adjustmentValue;
        const discount = adj?.adjustmentAmount
          ? `£${adj.adjustmentAmount.amount} off`
          : adj?.adjustmentPercentage
          ? `${adj.adjustmentPercentage}% off`
          : "no adjustment";
        console.log(`       - ${plan.name}: ${plan.id} (${discount})`);
      }
    }
    console.log("");
  }

  // Summary for copy-paste into byoData.ts
  console.log("=== COPY-PASTE SUMMARY ===\n");
  for (const { node: product } of products) {
    const title = product.title.toLowerCase();
    for (const { node: variant } of product.variants.edges) {
      console.log(`${title} / ${variant.title}: variantId: "${variant.id}"`);
    }
    for (const { node: group } of product.sellingPlanGroups.edges) {
      for (const { node: plan } of group.sellingPlans.edges) {
        console.log(`${title} / ${plan.name}: sellingPlanId: "${plan.id}"`);
      }
    }
  }
}

main().catch(console.error);
