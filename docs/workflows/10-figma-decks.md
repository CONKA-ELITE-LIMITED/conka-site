# 10 · Figma Deck Building

> **What this is:** How we build CONKA slide decks in Figma via the Figma MCP (pitch, partnership, onboarding, brand-overview decks). Covers the shared visual system, the deck family + file keys, the build + asset-porting workflow, and the gotchas. Read this before starting or editing any CONKA deck.

Decks are **design** work, not code. They live in Figma, not the repo — but every deck gets a **plan/copy doc in `docs/features/`** so the narrative, decisions, and open items are versioned and hand-off-able. The Figma frames are canonical for visuals; the doc is canonical for copy + rationale.

---

## The CONKA deck family

All share one visual system (below). Reuse copy, renders, logos, and layouts across them.

| Deck | Figma fileKey | Plan / copy doc |
|------|---------------|-----------------|
| Nike × CONKA collab / vision | `wiKYs5By0D5Fsux6A08wlS` | `docs/features/nike-mind-deck-copy.md` |
| Nike × CONKA trial (onboarding) | `a6SzuvMKvSWVBFqeM7N9Cw` | (frames canonical) |
| CONKA · Brand Overview | `QMhVlt4PcinAkZlYheisYP` | `docs/features/conka-brand-overview-deck.md` |

The **trial deck (`a6Sz…`) is the reference implementation** of the visual system — read tokens and lift layouts/renders from it first.

---

## Shared visual system

1280×720 frames. Tokens (verified from the trial deck):

- **Type:** Inter Semi Bold (headlines), Inter Regular (body), JetBrains Mono Regular (eyebrows/labels, wide tracking 6–12%).
- **Colour:** accent blue `#4058bb`; headline ink `#0a0a0a`; body-on-dark `#c7c9d6`; eyebrow grey `#6b6b73`; dark-slide periwinkle eyebrow `#a9b8f2`; rules `#e4e4e9` (light) / `#2a2a2f` (dark).
- **Header (light slides):** mono eyebrow top-left · `CONKA` (or `CONKA × NIKE`) mono top-right · 1px hairline rule beneath.
- **Cover:** white + blue radial glow top-left (`#4058bb`@0.5 → `#a9b8f2`@0.25 → transparent, `LAYER_BLUR` 55) · transparent CONKA wordmark · headline bottom-left · footer rule + two mono captions.
- **Rhythm:** light default canvas; a few near-black "impact" slides for emotional/concept beats (typically Problem and Close). One idea + one supporting block per slide. Low text.
- **Copy:** confident-clinical, short parallel sentences, **no em dashes** (see `docs/branding/BRAND_VOICE.md`).

---

## Tooling & setup

Figma MCP (`mcp__plugin_figma_figma__*`). Load the skills before the matching tool call:

- **`figma-use`** before any `use_figma` (write) call — encodes the Plugin API rules (font-load recipe, page rules, atomic-error handling, `return` node IDs).
- **`figma-create-new-file`** before `create_new_file`. Needs a `planKey` from `whoami`. Rudh's plan: `team::1428422002792244429` (Full seat).
- `get_metadata` (structure) and `get_screenshot` (visual verify) are read-only; `get_design_context` needs `figma-design-to-code` loaded.

---

## Build workflow

1. **Plan first.** Agree the arc, depth, and asset list with Rudh; write the plan doc in `docs/features/`. Don't batch-build from your own interpretation — build slide by slide, Rudh steers each (see `feedback_section_by_section_ui`).
2. **Read exact tokens** from the trial deck rather than eyeballing: a read-only `use_figma` that walks a frame and returns each node's `fontName`, `fontSize`, `fills` (as hex), `letterSpacing`, `lineHeight`, `x/y/w/h`, effects. Reuse those literals.
3. **Create the file** (`create_new_file`, editorType `design`), then build the **cover first** to lock the system.
4. **One slide per `use_figma` call**, ≤10 logical ops. Load all three fonts up front. Position frames in a horizontal row (x += ~1400). Always `return` created node IDs.
5. **Verify each slide** with `get_screenshot` (or inline `node.screenshot()`), download the PNG, and Read it. Fix before moving on.

---

## Asset porting (source deck → new deck)

Renders, athlete photos, logos, app screens live in the trial deck. To reuse:

1. `download_assets` on the source node → gives `export` (rendered PNG of the node) + `rawImages` (original source fills).
2. **Wordmark / logo transparency gotcha:** Figma's node `export` PNG comes back with an **opaque white background**, which boxes the logo against the glow. Fix it locally (Pillow: set near-white pixels to alpha 0, derive edge alpha from luminance) before re-uploading. The `rawImages` source fills are usually already transparent but may be the wrong aspect/crop.
3. `upload_assets` on the target file — pass `nodeId` to set the image as a fill on an existing rectangle (`scaleMode` `FIT` for logos), or omit `nodeId` to drop new frames. `POST` the bytes to the returned `submitUrl` (multipart `file` field preferred; single-use, 10-min expiry).

---

## Gotchas

- **Fonts:** build in **Inter**. Licensed display faces (e.g. Neue Haas) render but are **not editable via MCP**, and local installs don't reach the cloud. Inter style strings are `"Semi Bold"` / `"Extra Bold"` (with the space).
- **Seat/limits:** editing needs a **Full** seat; Starter tier hits an MCP rate limit — upgrade the file's team to fix. (See `reference_figma_mcp_constraints` in memory.)
- **`use_figma` is atomic:** a failed script makes no changes — read the error, fix, retry; don't blind-retry.
- **Screenshots are not user-facing:** Rudh reviews in Figma directly. Screenshot only to self-verify (respect `feedback_no_browser_screenshots` — don't drive Chrome for this).
- **Canva sources are login-gated:** WebFetch can't read Canva edit URLs. Ask Rudh to export to PDF (readable in-repo) or screenshot.

---

## Related

- `docs/branding/BRAND_VOICE.md` — copy rules, proof assets, no-em-dash rule.
- `docs/branding/DESIGN_SYSTEM.md` — the website design system (separate from the deck system, but shares the confident-clinical direction).
- Plan docs per deck (table above).
