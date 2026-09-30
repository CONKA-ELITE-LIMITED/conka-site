# Reviews workflow (Loox CSV → site; Trustpilot invites)

When you have **new review data** from Loox:

1. **Put the CSV in the project**  
   Either:
   - Replace `app/lib/reviews.ly_TolaWV6.csv`, or  
   - Put your file anywhere and pass it in step 2.

2. **Run the build**  
   ```bash
   npm run build:reviews
   ```  
   Or with a specific file:
   ```bash
   npm run build:reviews -- app/lib/your-export.csv
   ```

3. **Commit the output**  
   - `app/lib/testimonialsFromLoox.ts` (curated 3×30 – **do commit**)  
   - `docs/loox-product-ids.json` (optional)  
   - Do **not** commit the CSV (gitignored).

That’s it. The site uses the three curated sets from `testimonialsFromLoox.ts` via `app/lib/testimonialsFilter.ts`.

---

**If you see** `Cannot find module './testimonialsFromLoox'` **in the IDE:**  
The generated file may be missing or from an old format. Run `npm run build:reviews` (with a CSV in place) or `node scripts/migrate-loox-to-curated.mjs` (if you still have an old full-array file). Then restart the TypeScript server (Cmd+Shift+P → “TypeScript: Restart TS Server”).

---

## Trustpilot review invites

Trustpilot is separate from Loox: it collects **service reviews** (of CONKA as a company) that make up the public TrustScore on [uk.trustpilot.com/review/conka.io](https://uk.trustpilot.com/review/conka.io), the profile the footer and JSON-LD `sameAs` link to (`SOCIAL_PROFILES` in `app/lib/site.ts`).

**How invites go out.** Entirely from the **Trustpilot Shopify app** (Shopify admin > Apps > Trustpilot), triggered by Shopify orders. Skio renewals are Shopify orders, so subscribers are covered with no Skio integration. There is **no Trustpilot code on conka.io**: the domain was verified through the Shopify checkout, so the site needs no script (one was added and removed again in SCRUM-1487).

**Settings, split across two places:**
- Shopify app > Settings > Service reviews: Active, 3 weeks after an order is **Fulfilled**, template "For purchase experiences". Product reviews and widgets stay inactive (product reviews don't count toward the TrustScore and would use up the invite allowance; widgets are theme blocks and do nothing on a headless site).
- Trustpilot Business > Settings > Invitation settings > Timing and frequency: 2-week delay, **max once per customer every 90 days** (stops monthly subscribers being asked every order), reminder 1 week after.

**Constraints:**
- **Free plan: 50 invites a month.** The API, webhooks, Zapier and the **Klaviyo** integration all need a paid plan. Branded Klaviyo invites are the upgrade path, not a free option.
- Don't use the "Past orders" tab on the free plan: one bulk send uses up the month's allowance.
- Trustpilot's guidelines discourage inviting only customers likely to be happy, so invites go to every order rather than repeat customers only.
