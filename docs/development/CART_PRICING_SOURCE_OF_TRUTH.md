# Cart & pricing: what happened and how to prevent it

This doc explains the subscription double-discount bug, why it happened, and how to avoid similar mistakes. **It was not caused by the B2B portal work.**

---

## Two different price sources

There are **two** places prices come from. They must not be mixed or re-applied.

| Where | Source | Purpose |
|-------|--------|--------|
| **Pre-add UI** (product cards, PDP, landing) | `app/lib/offerData.ts` (via the `cadenceData.ts` adapter on the PDPs) | Show “Subscribe & Save” / one-time prices **before** the user adds to cart. Display only; not used for cart maths. |
| **Cart & checkout** | **Shopify Cart API** (`cart.lines`, `item.merchandise.price`, `cart.cost.subtotalAmount`) | **Single source of truth** for what the customer actually pays. All cart totals and line prices must come from here. |

- **ProductCard**, PDP hero, sticky footer, etc. use `offerData.ts` so we can show the subscription and one-time prices without calling Shopify. The former main-site `productPricing.ts` was deleted in SCRUM-1280: it had lost every consumer, and `offerData.ts` is now the only source a pre-add price can come from.
- **CartDrawer** and any “cart total” or “line price” must use **only** Shopify’s response. Do not apply discounts or recalculate from app constants.

---

## What the bug was

**Symptom:** Add CONKA Flow subscription (4-pack) → product card correctly shows £11.99 → in the cart drawer the line showed **£9.60** and the experience felt wrong.

**Cause:** In `CartDrawer.tsx`, subscription line items were displayed with a **wrong assumption**:

1. **Wrong assumption:** “`item.merchandise.price.amount` is the **full** price (before subscription discount).”
2. **Reality:** For lines with a selling plan, **Shopify already returns the discounted price** in `merchandise.price.amount` (e.g. £11.99).
3. **What the code did:** It showed that value as “original” (strikethrough) and then applied **another** 20% off for the “subscription price”: `price * (1 - 0.2)` → **£9.60**.

So the same Shopify value (£11.99) was treated as “full price” and then discounted again in the UI. The **subtotal** at the bottom came from `cart.cost.subtotalAmount` (Shopify), so it could still be correct; the **per-line** display was wrong.

**Fix:** For subscription lines, the **line item** must show the same discounted price the customer pays, so it matches the cart subtotal. Use in order of preference: (1) `item.sellingPlanAllocation.priceAdjustments[0].price.amount` (Shopify’s discounted unit price), or (2) `item.cost.totalAmount.amount / item.quantity` (actual charge per unit). Do **not** use `item.merchandise.price.amount` for subscription lines—that is often the variant’s full price, which would make the line show full price while the subtotal shows discounted. Use `getCompareAtPrice(item)` only for the strikethrough “original”; never multiply the line price by 0.8 for display.

---

## Was this because of B2B?

**No.** The B2B portal (`docs/features/b2b/B2B_PORTAL.md`) is about:

- Separate B2B products and tiered volume pricing (Starter / Squad / Elite).
- Ex-VAT display in the portal and inc-VAT in Shopify; cart drawer showing VAT breakdown when the cart has B2B lines.
- Normalizing B2B lines to one tier after cart changes.

The double-discount bug was in the **retail** subscription display logic in `CartDrawer.tsx`: a wrong assumption about what `merchandise.price.amount` means for subscription lines. B2B code does not overwrite or recalculate retail line prices for display; it only adjusts which **variant** (and selling plan) a B2B line uses. So B2B work did not introduce this bug.

---

## How to prevent this elsewhere

1. **Cart and checkout = Shopify only**  
   Anywhere you display a **line price** or **cart total** (drawer, mini-cart, checkout summary), use **only**:
   - `item.merchandise.price.amount` (and `.currencyCode`) for line price.
   - `cart.cost.subtotalAmount` (and similar) for totals.  
   Do **not** multiply or recalculate these from app constants (e.g. do not do `price * 0.8` for “subscription price”).

2. **App constants are for pre-add UI only**  
   `offerData.ts` (and the `cadenceData.ts` adapter) are for:
   - Product cards, PDP, “Subscribe & Save” toggles, pack selectors.  
   They are **not** for:
   - Cart line display, subtotal, or any “what they pay” after add-to-cart.

3. **Subscription display in cart**  
   - **Current price (discounted):** use `item.sellingPlanAllocation.priceAdjustments[0].price.amount`, or if missing `item.cost.totalAmount.amount / item.quantity`, so the **line** shows the same price the customer pays and matches the **subtotal**. Do not use `item.merchandise.price.amount` for subscription lines (that is often the full variant price).  
   - **Strikethrough “original”:** only from compare-at (Shopify’s compare-at, selling plan adjustment, or a **derived** original like `current / 0.8` for display only). Never apply 20% again to the line price.

4. **When adding new cart or pricing UI**  
   - If it shows “what’s in the cart” or “what they’ll pay” → use Cart API only.  
   - If it shows “what they’ll pay if they add this” (before add) → use `offerData` (which carries the variant and selling plan too).

5. **B2B**  
   B2B line prices also come from Shopify after normalization. The portal shows ex-VAT from app constants for **pre-add** tier pricing; the cart drawer shows inc-VAT from the cart for line items and uses `b2bCartTier` / VAT helpers only for the **breakdown** message, not for replacing `merchandise.price.amount`.

---

## Summary

| Do | Don’t |
|----|--------|
| Use Shopify cart API for all line prices and totals in cart/checkout UI. | Apply a second discount (e.g. × 0.8) to `merchandise.price.amount` for display. |
| Use `offerData` only for pre-add UI (cards, PDP). | Assume `merchandise.price.amount` is “full price” for subscription lines. |
| Use compare-at (or derived original) only for strikethrough, not for the “current” price. | Mix B2B tier logic with retail subscription display; they are separate. |

The bug was a **retail cart display** mistake (wrong assumption about Shopify’s subscription price), not caused by B2B. Keeping “cart = Shopify only” and “pre-add = app constants only” prevents this from happening elsewhere.
