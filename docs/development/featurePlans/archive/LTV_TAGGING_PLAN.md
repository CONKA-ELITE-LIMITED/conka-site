# LTV tagging: pathway & product attribution in Shopify

Plan for tagging orders (and optionally customers) in Shopify so we can measure LTV by **pathway** (e.g. quiz vs direct), **product** (Flow vs Clear, protocol, tier), and **plan** (weekly vs biweekly).

---

## Purpose

Answer business questions in Shopify (reports, exports, flows):

- Does coming through the **quiz**-suggested protocol improve LTV?
- Does **Flow** outperform **Clear** for LTV?
- Is **weekly** or **biweekly** subscription better for LTV?
- Which **deals / product types** influence LTV?

To do that we need **pathway** and **product/plan** attached to each order (and ideally visible on the customer) in Shopify, not only in our own analytics.

---

## Current state

| Data | In our analytics (Vercel, etc.) | In Shopify |
|------|---------------------------------|------------|
| Pathway / source (quiz, direct, protocol page, menu) | ✅ `source`, `location`, `sessionId` in `trackPurchaseAddToCart` | ❌ Not sent |
| Recommended by quiz | ✅ Implied by `source: "quiz"` | ❌ Not sent |
| Product (Flow vs Clear, protocol, tier) | ✅ `productType`, `productId`, `tier` | ✅ In variant (product title / SKU) |
| Plan frequency (weekly vs biweekly) | ✅ Via `purchaseType` | ✅ In selling plan |

**Gap:** Pathway and “recommended by quiz” are only in our app analytics. They are **not** on the order in Shopify, so we can’t segment or report on them there.

---

## Approach: cart line attributes → order in Shopify

Shopify’s Storefront API supports **line attributes** on cart lines (`CartLineInput.attributes`). These are stored as **line item properties** on the order when the customer checks out. No extra app required.

1. **Send attributes when adding to cart**  
   For each add-to-cart (create cart or add line), send a small set of attributes. They flow through to the order in Shopify.

2. **Optional: customer tags**  
   Use Shopify Flow (or a webhook + Admin API) to add customer tags from order/line data (e.g. “quiz_customer”, “flow_buyer”) for easier segmentation. Flow can read line item properties.

---

## Canonical attributes (source of truth)

**High-level view:** [CART_ATTRIBUTES.md](../../CART_ATTRIBUTES.md) defines every attribute we send at add-to-cart/checkout.

**v1 (implemented):** `source` and `plan_frequency`. Call sites pass canonical `source` values (`quiz`, `product_page`, `protocol_page`, `product_grid`, `professional_portal`); `plan_frequency` is derived from the selling plan (weekly/biweekly/monthly) when the line is a subscription.

**Optional later:** `recommended_by_quiz`, `protocol`, `formula`, etc. can be added for richer LTV segmentation (see CART_ATTRIBUTES.md).

---

## Attributes to send (proposed)

Keep keys short and stable; values simple for filtering.

| Key | Values | When / notes |
|-----|--------|--------------|
| `source` | `quiz` \| `direct` \| `protocol_page` \| `product_page` \| `menu` | How they got to add-to-cart. |
| `pathway` | e.g. `quiz_results` \| `quiz_then_protocol` \| `direct` | Optional; more detail than `source`. |
| `recommended_by_quiz` | `true` \| `false` | Only `true` when add-to-cart is from quiz results with the quiz-recommended protocol. |
| `protocol` | `1` \| `2` \| `3` \| `4` | For protocol products only. |
| `tier` | `starter` \| `pro` \| `max` | For protocol products; for formulas we could use pack size or omit. |
| `formula` | `flow` \| `clarity` | For formula products only. |
| `plan_frequency` | `weekly` \| `biweekly` \| (empty for one-time) | When a selling plan is attached; derive from selling plan if we have a mapping. |

**Decide together:** which of these to include in v1 (e.g. at least `source` and `recommended_by_quiz`; rest optional).

---

## What to implement

### 1. Cart API

- **File:** `app/api/cart/route.ts`
- **Change:** Accept optional `attributes` (or a single `attribution` object we flatten to attributes) on `create` and `add` actions.
- **Validation:** Zod schema for optional `attributes: z.array(z.object({ key: z.string(), value: z.string() })).optional()` (or similar).
- **Forward:** Pass attributes into the Shopify `CartLineInput` for each line (create: `input.lines[].attributes`, add: `lines[].attributes`).

### 2. Shopify mutations

- **File:** `app/lib/shopifyQueries.ts`
- **Change:** Ensure `CREATE_CART` and `ADD_TO_CART` use an input shape that includes `attributes` on each line (Storefront API: `CartLineInput.attributes` as array of `{ key, value }`). No change to fragments unless we want to read attributes back.

### 3. Cart context (frontend)

- **File:** `app/context/CartContext.tsx`
- **Change:** Build an attribution object from existing `metadata` (and product context where available). Pass it to the cart API as `attributes` on create/add. Keep sending the same metadata to Vercel/Triple Whale/Meta as today.
- **Attribution shape:** Derive from `metadata` (e.g. `source`, `location` → `pathway`) and from product metadata (e.g. `extractProductMetadata(variantId)` for protocol/tier/formula). Add `recommended_by_quiz` when `source === "quiz"` and (if we have it) the added item matches the quiz-recommended protocol.

### 4. Call sites

- **Files:** Quiz results page, protocol pages, formula pages (Flow, Clarity), ProductCard, any other `addToCart` call sites.
- **Change:** Ensure they pass the existing `metadata` (and, if we add new fields, e.g. `recommendedProtocol` from quiz) so CartContext can build the full attribution. Most already pass `location` and `source`; verify and fill gaps (e.g. `menu` when from mega menu).

### 5. (Optional) Customer tags

- **Where:** Shopify Flow (or custom app / webhook).
- **Logic:** When order is created, read line item properties; if e.g. `source` = `quiz` or `recommended_by_quiz` = `true`, add customer tag `quiz_customer`. Similarly for `formula` = `flow` → `flow_buyer`, etc. Document in this file or a short “Shopify Flow” section.

---

## Out of scope (for this plan)

- Changing checkout UI or checkout logic.
- Sending PII in attributes; keep values to enums and IDs we already use.
- Analytics changes beyond using existing metadata to build attributes.

---

## Success criteria

- Adding to cart from quiz results (with quiz-recommended protocol) produces an order in Shopify whose line items have `source` and `recommended_by_quiz` (and any other agreed attributes).
- Adding from protocol page, product page, or menu produces the right `source` (and optional `pathway`).
- Protocol/formula and plan frequency can be derived or explicitly set so LTV by product/plan is possible in Shopify.

---

## Next step

Review this plan and decide:

1. Which attributes are required for v1 vs later.
2. Exact values for `source` / `pathway` (e.g. do we need `menu` vs `shop_page`).
3. Whether to implement customer-tagging (Flow) as part of this work or later.

Then implement 1–4 above; 5 is optional and can follow.
