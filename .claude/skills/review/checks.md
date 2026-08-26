The 5-check review for /review (Step 2). For `--light`, run only Checks 1, 4, and 5. Security items are always full depth.

---

## Check 1: Does It Actually Work?

- [ ] Code addresses the original request / acceptance criteria
- [ ] Happy path correct end-to-end
- [ ] Works with realistic data (not just placeholder content)
- [ ] All states work (loading, success, empty, error)
- [ ] IF cart-related: add/remove/update works, checkout URL redirects correctly
- [ ] IF Shopify data: products, prices, images, availability load correctly

**If any fail: Critical.**

---

## Check 2: Code Quality

**Readability:**
- [ ] Another developer would understand this without explanation
- [ ] Variable/function names descriptive and match codebase conventions
- [ ] No unnecessarily clever code
- [ ] Complex sections commented with "why" (not "what")

**Structure:**
- [ ] Files in correct directories per project conventions
- [ ] Server Components by default; `'use client'` only where genuinely needed
- [ ] Data fetching in lib/services layer, not scattered in components
- [ ] Components are content-only (no `<section>`, no root `max-w-*` or `px-*`)
- [ ] Page owns section wrappers with track structure
- [ ] No functions longer than ~50 lines that should be split
- [ ] No duplicated logic that should be a shared utility

**Consistency:**
- [ ] Follows the same patterns as surrounding code
- [ ] Naming conventions and import organisation match the rest of the project

---

## Check 3: Robustness

**Error handling:**
- [ ] All data fetches have error handling
- [ ] `error.tsx` boundaries exist for new route segments
- [ ] Errors surface meaningful messages + retry option
- [ ] Edge cases handled (null metafields, empty arrays, missing products, sold-out variants)

**Security (always full depth):**
- [ ] No Shopify Admin API tokens exposed to client
- [ ] API routes validate input before processing
- [ ] Webhook endpoints verify signatures
- [ ] No hardcoded secrets, API keys, or tokens

**Cart and checkout (always critical depth):**
- [ ] Cart operations go through `CartContext`, not direct API calls
- [ ] Product availability checked before showing add-to-cart
- [ ] Prices formatted using shared formatter, never hardcoded
- [ ] Variant selection handles sold-out variants
- [ ] Checkout URL redirect works correctly

---

## Check 4: Cleanliness and Dead Code

**Debug artifacts:**
- [ ] No `console.log` statements
- [ ] No commented-out code blocks
- [ ] No TODO comments without context
- [ ] No placeholder text or hardcoded test data

**Dead code:**
- [ ] No unused imports, variables, constants, functions, or components
- [ ] No orphaned Tailwind classes or CSS
- [ ] No stale comments referencing removed features
- [ ] No backwards-compatibility shims for removed features
- [ ] No leftover prop definitions for props no longer passed

**Hygiene:**
- [ ] Linter passes (changed files only): `npm run lint:changed`
- [ ] Build succeeds: `npm run build`

---

## Check 5: Completeness

- [ ] Implementation covers everything in scope / acceptance criteria
- [ ] Any intentionally deferred items are flagged (not silently skipped)
- [ ] Any new technical debt is documented
- [ ] Would you be comfortable maintaining this code 6 months from now?
