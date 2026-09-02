# Cart / checkout attributes and order tags

Single source of truth for **what metadata lands on a CONKA order**: the attributes we send at add-to-cart (passed as **cart line attributes** to Shopify, appearing as **line item properties** on the order), and the **order tags** written by third-party apps.

This supersedes the quiz/protocol-era `LTV_TAGGING_PLAN.md`, now in [`featurePlans/archive/`](./featurePlans/archive/LTV_TAGGING_PLAN.md).

---

## Attributes (v1)

| Key | Values | When set | Notes |
|-----|--------|----------|--------|
| **source** | `product_page` \| `product_showcase` \| `product_split` \| `formula_split` \| `whats_inside` \| `cart_upsell` \| `listicle` \| `win_free_month` | Every add-to-cart | Which surface the add came from. Set by the call site via `metadata.source`; the list grows as surfaces are added, so grep `source:` in `app/` for the current set. |

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

## `plan_frequency` was removed (SCRUM-1300, 2026-09-02)

There used to be a second attribute, `plan_frequency`, derived from the line's selling plan id via a lookup table in `app/lib/shopifyProductMapping.ts`. **It never worked.** The table only ever held the three retired `FORMULA_SELLING_PLANS` ids, so the live Loop plans and all four Skio plans missed it, the lookup returned `undefined`, and the attribute was never sent. Verified across 205 live orders (10 Aug to 2 Sept 2026): zero carried it. It survived two subscription platform migrations undetected.

It was deleted rather than repaired, because nothing consumed it and cadence is readable from the line's selling plan on the order anyway.

**If cadence is ever wanted back as an attribute, derive it from the cadence the call site already knows**, the way `byoCheckout.ts` does for its `_plan_frequency`. That path never broke, precisely because it does not depend on a hardcoded plan-id map. A map keyed on vendor plan ids will break again at the next migration.

---

## Where attributes are sent

- **Cart create** – When creating a new cart with an initial line, attributes are sent on that line (`CartInput.lines[].attributes`).
- **Cart add** – When adding a line to an existing cart, attributes are sent on the new line (`CartLineInput.attributes`).
- **Order** – Shopify stores these as line item properties on the order. No changes to CartDrawer, update, or remove.

---

## Optional attributes (future)

May be added later for richer LTV segmentation:

- `formula` – `flow` \| `clarity` \| `both` for the product added.

---

## Order tags (who writes them, who reads them)

Order tags are a **separate surface** from the attributes above. Our application code **writes** one set of tags and **never reads** any. Everything else on an order is written by a third-party app.

| Tag | Written by | Read by | Keep? |
|-----|-----------|---------|-------|
| `IMPORTSYNERGY` | Synergy's connector, on successful pull | **Synergy.** Removing it causes a failed resend; Synergy will not accept the same order twice | **Load-bearing. Never remove or touch** |
| `listicle`, `persona:<slug>` | **us**, `app/api/webhooks/shopify/orders/route.ts` on `orders/paid` (SCRUM-1180) | Our own listicle reporting | Yes, but see the scope bug below |
| `Alia` | the Alia popup app | Alia's own reporting | Ignore |
| `subscription_order`, `first_subscription_order`, `Subscription Recurring Order`, `Billing cycle #N`, `Deliver every 1 MONTH`, `Pay every 1 MONTH`, `Subscription #<id>`, `<Plan name> - Funnel` | **Loop** | Nothing automated. Humans reading an order in Shopify admin, and (until corrected) one analysis query | Historical only. Loop is decommissioned |
| `Subscription First Order` | **Skio** | Nothing automated | Fine as-is |

### Skio writes far fewer tags than Loop, and that is not a loss

Loop mirrored its own internal state onto every order because it had nowhere else to put it. Skio keeps that state in Skio and stamps one tag. Verified 2026-09-02 against the first nine Skio-native orders.

Nothing automated depended on the Loop tags:

- **Our code** never reads order tags (`app/lib/shopifyAdmin.ts` only writes).
- **Klaviyo**: all three segments key on the `userType` profile property. Every live retention flow is "Added to List" triggered, fed by conka-lab, which reads the subscription platform directly rather than order tags. (Checked segment definitions and all flow trigger types; individual flow trigger filters were not opened one by one.)
- **Synergy** uses only its own tag, which neither platform ever touched.

**So do not ask Skio to replicate Loop's tag set for correctness reasons.** The one arguable case for asking is human convenience: a billing-cycle number or plan name visible on the order in Shopify admin saves opening Skio. Skio can be configured to stamp similarly if that is wanted. Treat it as an ops-comfort decision, not a dependency.

### Never key logic on subscription tags

The renewal-vs-acquisition distinction is the one thing the Loop tags were genuinely used for, in `docs/analytics/LISTICLE_PERFORMANCE.md`. Tags are the wrong signal for it, because they are vendor-specific and change under you at every migration. Two platform-independent signals already exist on every order:

1. **`checkout_token`** is present on a real checkout and absent on a rebill. This is what the Meta CAPI webhook already gates on, and it is the signal a subscription app cannot fake.
2. **`app`** on the order names the platform on a rebill (`Loop Subscriptions` historically; expected to be Skio from the first Skio renewal on 1 Oct 2026, unverified until then).

### Known bug: our own tag write is denied

`addOrderTags()` authenticates with `SHOPIFY_ADMIN_API_TOKEN`, which is the **B2B Invoicing** app (`read/write_draft_orders` + `customers` only). It has no `write_orders`, so every call fails:

```
[Shopify webhook] Failed to tag order 13430014214518
Error: tagsAdd failed: Access denied for tagsAdd field.
```

**79 orders between 10 Aug and 2 Sept carry `_listicle_origin`; none was ever tagged.** The persona attribution has produced nothing since it shipped. This predates the Skio cutover and is unrelated to it. Tracked in `docs/TODO.md`.

The attribution itself is fine: `_listicle_origin` lands on every order as a note attribute, so the data is recoverable without the tag. The tag was only ever a convenience for filtering in Shopify admin.
