# Cart / checkout attributes (LTV tagging)

Single source of truth for attributes we send at add-to-cart. These are passed as **cart line attributes** to Shopify and appear as **line item properties** on the order.

This supersedes the quiz/protocol-era `LTV_TAGGING_PLAN.md`, now in [`featurePlans/archive/`](./featurePlans/archive/LTV_TAGGING_PLAN.md).

---

## Attributes (v1)

| Key | Values | When set | Notes |
|-----|--------|----------|--------|
| **source** | `product_page` \| `product_showcase` \| `product_split` \| `formula_split` \| `whats_inside` \| `cart_upsell` \| `listicle` \| `win_free_month` | Every add-to-cart | Which surface the add came from. Set by the call site via `metadata.source`; the list grows as surfaces are added, so grep `source:` in `app/` for the current set. |
| **plan_frequency** | `weekly` \| `biweekly` \| `monthly` | Only when the line has a selling plan (subscription) | Derived from `sellingPlanId` via Loop plan IDs. Omitted for one-time purchases. |

---

## Source semantics

| Value | Meaning |
|-------|---------|
| `product_page` | Add from a PDP (`/conka-flow`, `/conka-clarity`, `/conka-both`). |
| `product_showcase` | Add from the home page product showcase. |
| `product_split` / `formula_split` | Add from a split product/formula section. |
| `whats_inside` | Add from a "what's inside" ingredients section. |
| `cart_upsell` | Add from an upsell offer inside the cart drawer. |
| `listicle` | Add from a `/go/[slug]` listicle landing page. |
| `win_free_month` | Add from the win-a-free-month promo surface. |

> **Removed sources.** `quiz` and `protocol_page` were retired with the `/quiz`
> and `/protocol/[id]` routes. `product_grid` went with the `/shop` grid. Orders
> placed before those routes were retired still carry these values, so keep
> reading them in analysis; just do not write them.

### `home_*` origin tokens (SCRUM-1266)

The home page's mid-page CTAs each append their own `?src=` token to the PDP
link: `home_expect`, `home_comparison`, `home_athletes`, `home_app`. They ride the same
mechanism the `/go` listicles use (`captureListicleSrc`, persisted to
sessionStorage, read back at add-to-cart), because `isValidListicleSrc` is a
format check (`/^[a-z0-9_-]{1,96}$/i`) rather than a whitelist.

Two things follow. First, these values appear in `source` alongside the
listicle tokens, so **any listicle report that reads `source` should exclude
the `home_` prefix** rather than assume every token came from `/go`. Second,
that is the point of them: home had no per-CTA attribution, so there was no way
to tell which argument (the timeline, the comparison table, the athletes) drove
a click. Add a `home_<section>` token for any new home CTA.

---

## How `source` is determined

We do **not** infer the page from the URL at add-to-cart time. We use two pieces together:

1. **Page awareness (call site)**  
   Each place that calls `addToCart` knows which surface it is, so it passes the
   right value directly: a PDP passes `"product_page"`, the cart upsell passes
   `"cart_upsell"`, a listicle passes `"listicle"`, and so on.
2. **`getAddToCartSource()` (`app/lib/analytics.ts`)**  
   Still present, but effectively inert. It returns `"quiz"` when
   `sessionStorage.quizSessionId` is set or `document.referrer` contains
   `"/quiz"`, else `"direct"`. Since `/quiz` was retired and now 308s to
   `/build-your-order`, neither condition can be met by a new visitor, so it
   always returns `"direct"` in practice. Do not build new logic on it.

So: the source comes from which component is calling, and the call site always
provides it. We never “detect the page” from the URL inside a shared helper.

`quizSessionId` was set when a user started the old `/quiz` and persisted for the tab, so a quiz → results → protocol page → add-to-cart journey still tagged `source: "quiz"`. Both routes are retired, so nothing writes this key any more. Historical orders still carry the tag.

---

Mapped from Shopify selling plan GID (Loop subscription plans):

| sellingPlanId (numeric) | plan_frequency |
|-------------------------|----------------|
| 711429882230 | weekly |
| 711429947766 | biweekly |
| 711429980534 | monthly |

GIDs are in the form `gid://shopify/SellingPlan/711429882230`; we match on the numeric part. One-time purchases do not send `plan_frequency`.

---

## Where attributes are sent

- **Cart create** – When creating a new cart with an initial line, attributes are sent on that line (`CartInput.lines[].attributes`).
- **Cart add** – When adding a line to an existing cart, attributes are sent on the new line (`CartLineInput.attributes`).
- **Order** – Shopify stores these as line item properties on the order. No changes to CartDrawer, update, or remove.

---

## Optional attributes (future)

May be added later for richer LTV segmentation:

- `formula` – `flow` \| `clarity` \| `both` for the product added.
