# Post-migration tasks

**Migration completed:** Wednesday 2 September 2026, ~16:00 BST (Josiah Brown, Skio).
**Owner:** Rudh.
**Source data:** Skio's final export, `subscriptions-raw.json` + `prepaid-raw.json`, at `~/Desktop/DownloadsForClaude/Active/`. Deliberately not committed: customer emails and payment-method ids.

Everything in this file is an action outside the codebase. The migration plan itself is `../skio-migration.md`.

---

## 1. What landed

| | Count |
|---|---|
| Regular subscriptions | 277 (224 ACTIVE, 53 PAUSED) |
| Prepaid | 19 (11 ACTIVE, 8 PAUSED) |
| **Total migrated** | **296** (235 ACTIVE, 61 PAUSED) |

Reconciles cleanly. The Skio dashboard's 244 active is 235 migrated plus the Skio-native sales taken since go-live on 1 Sept. The 61 paused against the preview's 51 is the 9 dead-membership contracts plus customer changes between the 27 Aug preview and the 2 Sept migration.

`reChargeId` (the Loop subscription id) is present on **298 of 298** subscription lines, zero nulls, so the Loop-to-Skio join key survived the final migration. That is what conka-lab's matcher should key on.

Loop was uninstalled by Skio as part of their final steps, deliberately, to stop future billing.

---

## 2. Fix before 11 September: aaron.rts@gmail.com

**The one thing on this page with a deadline.**

The 9 deleted-variant membership contracts were mapped to `BOTH-40` (`58457859686774`) and migrated PAUSED, so nobody is billed while we call each customer. Eight landed PAUSED as agreed. This one did not.

His **C68 Monthly Membership** line sits on the *same subscription* as a live **CONKA Flow AM** line (44 cycles completed, both due **2026-09-11**). The subscription as a whole is ACTIVE, so the dead line came across with it.

**If nothing changes, on 11 September he is charged £54.40 for Flow AM plus £54 for a `BOTH-40` he never ordered, and Synergy ships 40 shots of Flow + Clear on top of his normal order.**

**Fix:** in Skio, remove or pause the C68 line on that contract and leave the Flow AM line untouched. Worth telling Josiah, since the migration mapper produced it.

---

## 3. Customers to call

All nine held a retired membership product whose variant no longer exists. The agreement with Skio was to map them to `BOTH-40` and migrate PAUSED rather than lapse them, so nobody is billed and **we speak to each person before anything resumes**. Prices below are the migrated line price.

| # | Email | Legacy product | Price | Cycles | Status | Next billing |
|---|-------|----------------|-------|--------|--------|--------------|
| 1 | `aaron.rts@gmail.com` | C68 Monthly Membership | £54.00 | 44 | **ACTIVE — see section 2** | 2026-09-11 |
| 2 | `adidbz@yahoo.co.uk` | C2 Monthly Membership | £468.00 | 12 | PAUSED | 2026-09-03 |
| 3 | `bdraycott@googlemail.com` | C68 Monthly Membership | £43.20 | 4 | PAUSED | 2026-09-03 |
| 4 | `celia_boddy@hotmail.com` | C68 Monthly Membership | £54.00 | 1 | PAUSED | 2026-09-03 |
| 5 | `danielnorton2@hotmail.co.uk` | C68 Monthly Membership | £69.00 | 1 | PAUSED | 2026-09-03 |
| 6 | `rosafizzyo@live.co.uk` | C68 Monthly Membership | £54.00 | 1 | PAUSED | 2026-09-03 |
| 7 | `ryrobbins@icloud.com` | Capsules 24 Month Upfront | £44.00 | 4 | PAUSED | 2026-09-03 |
| 8 | `jamiescarrott@outlook.com` | V23 CONKA OURFC Package | £33.00 | 9 | PAUSED | 2027-01-15 |
| 9 | `humphreybodington@conka.uk` | C68 Monthly Membership | £54.00 | 1 | PAUSED | **Internal, not a customer call** |

**What the call is.** Their old membership product no longer exists, so their subscription is parked and not billing. The choice is theirs: move onto a current plan, or close it. Several sit on grandfathered pricing, so decide the offer before dialling rather than during.

`ryrobbins@icloud.com` was already paused in Loop ahead of a charge against the deleted capsules variant, and their previous payment had failed. Handle that one as a payment conversation as much as a product one.

### Separately: two contracts with no working payment method

Both migrated PAUSED and sit in Skio's Payment Recovery. Both were already failing in Loop's dunning before the migration, so this is not a migration fault.

- `alexlundberg@hotmail.co.uk` — no payment method at all.
- `sienna.charles55@hotmail.com` — payment method present but previously failing.

Let Skio's recovery flow run before doing anything manual.

---

## 4. The 51 legacy subscribers

19% of the base sits on retired plans at grandfathered prices (£48.30, £49, £33 and similar). Under the behaviour agreed with Skio, **the first time any of them edits their subscription in the portal they are forced onto a current plan at current pricing.**

That decision was taken when Skio estimated 5-10 people. The real number is 51. Nobody has revisited it since the correct figure came out, and it is now live: the portal is the only place these customers can manage anything.

**Decide the policy before the first one gets repriced by accident, not after.**

---

## 5. Housekeeping

- **Remove collaborator access.** Skio's ask. Shopify → Settings → Users and Permissions → Collaborators. Remove `aidan@skio.com` and the Loop dummy staff account `johnhodgkinson213@gmail.com`.
- **Archive the Loop-era Shopify variants** now that nothing sells or renews against them. Never touch `FLOW-FUNNEL-28` / `CLEAR-FUNNEL-28`: every Skio bundle composition points at them.
- **Spot-check the first normally-paid Skio order through Synergy** — that it pulls, explodes into 28-boxes, and routes to the Synergy location. The 1 Sept test order was £0 and auto-fulfilled, so it never pulled.
- **Confirm rebill attribution on the first real renewal** (late September). `_fbp`, `_fbc` and `conka_uid` should persist because they live on the contract, but it is unverified.
- **Skio analytics lag 12-24 hours on migrated data**, or until the next billing round. Do not read anything into an empty dashboard before then.

---

## 6. Still open elsewhere

- **conka-lab Check 13** fails with 9 violations, because the coalesce matcher pairs Loop and Skio contracts by email plus billing frequency and leaves ambiguous ones unmatched by design. The fix is to key on `reChargeId` instead. Kristian is on it. **`KLAVIYO_ENABLED` stays false until Check 13 is green.**
- **The Loop-removal PR does not exist yet.** Decommission list is in `../skio-migration.md` section 12.
- **`NEW Cancellation Flow`** in Klaviyo still triggers off a Loop metric and needs re-pointing at Skio's cancellation event. It is the only Loop-keyed flow in the account.
- **Skio's native Triple Whale integration** is not yet enabled.
