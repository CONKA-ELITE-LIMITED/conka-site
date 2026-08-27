# Archive

Superseded docs that are **not deleted** because they hold rationale with no
other home: why an option was rejected, how to revert something, the evidence
behind a decision, or a teardown that shaped a live pattern.

Nothing here describes current behaviour. If a doc in here contradicts a
canonical doc under `docs/`, the canonical doc wins. Read these for *why*, never
for *what is true now*.

Retired as part of SCRUM-1268 (docs hygiene audit, Aug 2026): phases 1-4 for the
first ten, phase 5 (de-duplication) for the last three.

| Doc | What it holds |
|---|---|
| `account-portal-simple-dtc.md` | The read-vs-scan mono rule; what was deliberately kept clinical in the portal |
| `blog-informational-content-surface.md` | Content-model options table (why not Sanity / Contentful / Convex / MDX); the SSG-over-ISR rationale |
| `magic-mind-video-hero.md` | The revert path: which components and `/videos/both` assets to restore |
| `seo-aeo-metadata-foundation.md` | Self-labelled archive already. Per-phase build record for the SEO/AEO foundation |
| `synergy-3pl-integration.md` | Test-path evidence (orders #3522/#3523/#3524), EAN/customs data, metafield schema |
| `CONKA-LANDER-HANDOVER.md` | Vendor drop-in contract: CSS-Modules `.conka-lander` scoping, the straight-to-checkout decision |
| `adhd-listicle-copy-upgrade.md` | AnswerSocrates keyword research and the full drafted copy |
| `listicle-format.md` | usecloud.co section-by-section teardown and the conversion principles drawn from it |
| `GO_LIVE_PRICING_AUDIT.md` | Pre-launch price/variant reconciliation. Built entirely on `app/lib/funnelData.ts`, which no longer exists |
| `CROSS_SELL.md` | The cross-sell section for protocol/formula PDPs. `app/components/crossSell/` is deleted with zero consumers |
| `LTV_TAGGING_PLAN.md` | The quiz/protocol-era predecessor to `development/CART_ATTRIBUTES.md`. Holds the original attribute-design reasoning |
| `LANDING_PAGE_CLAIMS_LOG.md` | Apr 2026 per-claim audit of `/start`. **Its mg figures are wrong** by its own admission; kept for the anchor-symbol table and the claim-by-claim reasoning |
| `changelog-jan-feb-2026.md` | One-off PR digest for Jan-Feb 2026, superseded by `docs/CHANGELOG.md` |

**Where the live answers are now:** blog → `docs/features/BLOG_SYSTEM.md` · SEO/AEO
→ `docs/seo-aeo/README.md` · shipping and 3PL → `docs/shipping/SHIPPING_AND_COURIERS.md`
and `docs/features/b2b/B2B_PORTAL.md` · listicles → `docs/features/LISTICLE_SYSTEM.md`
· pricing and SKUs → `docs/product/SKU_AND_SHOT_REFERENCE.md` · account portal →
`docs/features/CUSTOMER_PORTAL.md`.
