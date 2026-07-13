# Vercel Git Connection (and the July 2026 repo transfer)

How `conka.io` gets deployed, what broke when the repo moved to the CONKA org, and how to fix it if deployments ever go quiet again.

> **Status (13 Jul 2026): production deployments are BROKEN.** The last successful production deploy was 9 July. Every merge to `main` since then has produced no build. Diagnosis and fix below.

---

## How deployment works

| Thing | Value |
|-------|-------|
| Vercel team | `CONKA` (`team_RYAm8UuAbSGDfZz1cn0M4tgr`) |
| Vercel project | **`conka-shopify`** (`prj_ngcTTAV2aYQsza3lhOV0TrcMTVzJ`) |
| Domains it serves | `conka.io`, `www.conka.io`, `hooks.conka.io` |
| GitHub repo | **`CONKA-ELITE-LIMITED/conka-site`** (repo id `1111953626`) |
| Production branch | `main` |

Merge a PR into `main` -> GitHub fires a webhook at Vercel -> Vercel builds -> when the build goes green, the domain alias swaps to it atomically.

`conka-lab` is a **separate** Vercel project in the same team. It is not the storefront. Do not reconfigure it by mistake.

## The July 2026 repo transfer

The repository was **transferred**, not recreated. It used to live at `youcodecowboy/conka` (Kristian's personal account) and now lives at `CONKA-ELITE-LIMITED/conka-site` (the company org).

The GitHub **repo id is unchanged** (`1111953626`), which is the key fact:

- Vercel tracks the connection by repo id, so the Git connection in project settings still resolves and displays correctly as `CONKA-ELITE-LIMITED/conka-site`. **Nothing looks wrong in the UI.**
- Old deployments still show `youcodecowboy/conka` in their metadata, because that is the name the repo had *at the time those builds ran*. This is cosmetic and misleading, not a sign of misconfiguration.
- `youcodecowboy/conka` now 404s. There is no second repo, no fork, and nothing to reconcile or carry across.

## What broke, and why

**Symptom.** Production froze on the 9 July build. Merges kept landing on `main` and no deployment was ever created. Nobody noticed for four days, because a stale site serves 200s perfectly happily.

**Cause.** A GitHub App's permission to a repo belongs to the *installation* on the account that owns the repo. When the repo moved from a personal account to the org, the Vercel app's old installation stopped covering it. The project's connection is still bound to that old installation, so **GitHub stopped delivering push events to Vercel**.

The connection therefore looks healthy in Settings -> Git while silently receiving nothing. Granting the org's Vercel app "All repositories" access is *necessary but not sufficient*: the project's existing binding still has to be re-registered.

**What it cost.** Five merged tickets sat unshipped for four days (SCRUM-1131 canonical fix, 1132 per-page metadata, 1133 JSON-LD, 1136 sitemap/robots, 1137 the B2B honeypot bug). The B2B one matters most: it was silently binning bulk-order enquiries worth roughly GBP 2,250 each, and the fix could not reach production.

## The fix: rebind the connection

Zero downtime. The current build keeps serving every request until the new one is green.

1. **Check the GitHub App covers the org.** GitHub -> `CONKA-ELITE-LIMITED` -> Settings -> GitHub Apps -> Vercel -> Configure. Repository access should be **All repositories** (or explicitly include `conka-site`). Confirmed in place on 13 Jul.
2. **Rebind.** Vercel -> CONKA -> `conka-shopify` -> Settings -> Git -> **Disconnect**, then **Connect** -> GitHub -> `CONKA-ELITE-LIMITED/conka-site`. This re-registers the webhook against the org's installation. Disconnecting does **not** unpublish the site; it only stops future builds being triggered.
3. **Confirm** Production Branch is `main`.
4. **Deploy.** Deployments -> Redeploy, or push any commit to `main`.

CLI equivalent, run from a clone of the repo (it reads the remote from local git config, so it cannot pick the wrong repo):

```bash
vercel link          # link the working copy to the conka-shopify project
vercel git disconnect
vercel git connect
```

### If the repo does not reappear in the dropdown

The Vercel GitHub App is installed on a personal account rather than the org. Install it on `CONKA-ELITE-LIMITED` first, then reconnect.

### Rollback

Vercel -> Deployments -> pick the last known-good deployment -> **Instant Rollback** (CLI: `vercel rollback <deployment-url>`). Near-instant.

## Verifying a deploy actually landed

A stale site looks completely healthy, so check for something the new build contains that the old one does not. After the first successful deploy post-transfer, all four of these must flip:

| Check | Broken (stale) | Fixed |
|-------|----------------|-------|
| `curl -s -o /dev/null -w "%{http_code}" https://www.conka.io/sitemap.xml` | `404` | `200` |
| `curl -s https://www.conka.io/conka-flow \| grep -o "<title>[^<]*</title>"` | old default title | per-page SEO title |
| `curl -s https://www.conka.io/conka-flow \| grep -c "FL0W"` | `1` | `0` |
| `curl -s https://www.conka.io/professionals \| grep -c 'id="company"'` | `1` | `0` |

Also useful: the `age` response header on a page. A value in the hundreds of thousands of seconds means you are looking at a CDN cache entry that is days old.

```bash
curl -s -D - -o /dev/null https://www.conka.io/professionals | grep -i "^age"
```

## Lessons

- **A frozen site is invisible.** Nothing alerts on "no deployments in N days". Prod served 200s throughout. It surfaced only because someone tested a specific fix on the live site and found the old behaviour. Consider an alert on deployment recency.
- **Green settings pages can lie.** The Git connection displayed the correct repo the entire time it was receiving nothing. Verify with a real artefact from the new build, not with a settings screen.
- **Transfers break webhooks, not connections.** The repo id survives a transfer, so everything keyed on it keeps resolving. The installation-scoped webhook does not.

## Related

- Convex deployment: `docs/deployment/CONVEX_DEPLOYMENT.md`
- The B2B fix that was blocked by this: `docs/development/featurePlans/b2b-enquiry-honeypot-silent-drop.md`
