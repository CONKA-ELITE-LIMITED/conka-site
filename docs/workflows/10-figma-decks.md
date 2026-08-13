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

The **trial deck (`a6Sz…`) is the reference implementation** of the visual system — read tokens and lift layouts/renders from it first. The **Brand Overview (`QMhV…`) is the fullest worked example** of asset porting, Canva-PDF extraction, and PDF export (patterns below).

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

## Asset porting (from another Figma deck, or a Canva PDF)

**From a Figma deck:** `download_assets` on the source node returns `export` (the node rendered — usually **transparent RGBA**, so it sits clean on a white slide) and `rawImages` (raw source fills, but often off-crop / wrong-aspect — prefer `export`). Batch a slide's downloads in one message.

**From a Canva PDF export** (Canva edit URLs are login-gated, so a PDF is the only way in): render the page with PyMuPDF (`page.get_pixmap(matrix=fitz.Matrix(3,3))`) and crop with Pillow. `page.get_image_info()` gives embedded-image bboxes, but they can be off-page / overlapping — **cropping by visual grid cells off a 3–4× render is more reliable**. Source photos often have baked-in captions or borders → crop the inner region.

**Placing images:** build placeholder rects in the slide, `return` their node ids, then `upload_assets(nodeId=…)` and POST the bytes to the returned `submitUrl` (single-use, 10-min expiry). `scaleMode`: **FIT** for logos/renders (show the whole thing), **FILL** for photos/portraits (crop-to-fill).
- **Batch uploads:** request N submit URLs in one message, then POST with a **`while read` heredoc loop** — an unquoted `set -- $arrayItem` loop mangled the filenames, so avoid it.
- **Keep a local copy of every ported asset** in the scratchpad. Rebuilding a frame drops its image fills (you re-upload) — that's only cheap if the files are still local.
- **Wordmark exception:** the CONKA wordmark `export` came back opaque-white (not transparent). Knock white out with Pillow (near-white → alpha 0, edge alpha from luminance) before uploading.

## Exporting the deck to PDF

- **`download_assets(nodeId=frame, defaultScale=3)` returns a per-frame VECTOR PDF** (`format:"pdf"`), not a raster — text stays crisp. Download every frame's `export.url`, then merge in slide order with PyMuPDF (`out=fitz.open(); for f: out.insert_pdf(fitz.open(f)); out.save(dest)`). This is the way to hand Rudh a send-ready deck.
- `get_screenshot`'s `maxDimension` only scales **down** (won't upscale past the 1280 native frame) — use `download_assets` `defaultScale` when you need higher res.
- Frames laid left-to-right export in slide order. For Rudh's own export: Figma → **File → Export frames to PDF** (native, one combined PDF, keeps vector text).

---

## Gotchas

- **Fonts:** build in **Inter**. Licensed display faces (e.g. Neue Haas) render but are **not editable via MCP**, and local installs don't reach the cloud. Inter style strings are `"Semi Bold"` / `"Extra Bold"` (with the space).
- **Seat/limits:** editing needs a **Full** seat; Starter tier hits an MCP rate limit — upgrade the file's team to fix. (See `reference_figma_mcp_constraints` in memory.)
- **`use_figma` is atomic:** a failed script makes no changes — read the error, fix, retry; don't blind-retry.
- **Rebuilding a frame loses its image fills** — you must re-upload. For small tweaks prefer surgical edits (resize / reposition / recolour existing nodes), which preserve fills. **Node IDs change on every rebuild** — re-query before editing, and keep the plan doc's per-slide IDs current.
- **`textAutoResize` wrap:** setting a label's `characters` to a longer string while it's `'HEIGHT'` makes it wrap (width stays fixed). Use `'WIDTH_AND_HEIGHT'` for single-line labels whose text may change length.
- **Accent a word in a headline:** `setRangeFills` — reset the whole string to the base colour first, then apply the accent range, so stale partial fills from earlier edits don't linger.
- **Recolour deck-wide by fill:** `findAll('TEXT')`, match `fills[0].color` within a tolerance, reassign — used to swap the vivid `#2e38d1` blue → navy `#1B2757` across every slide in one pass.
- **Screenshots are not user-facing:** Rudh reviews in Figma directly. Screenshot only to self-verify (respect `feedback_no_browser_screenshots` — don't drive Chrome for this).
- **Canva sources are login-gated:** WebFetch can't read Canva edit URLs. Ask Rudh to export to PDF (readable in-repo) or screenshot.
- **macOS folder access:** the terminal's **Desktop** access can vanish mid-session (TCC) even after it worked earlier; `~/Downloads` may still work. Don't depend on the user's local exports — regenerate from Figma and write to `~/Downloads`.

---

## Related

- `docs/branding/BRAND_VOICE.md` — copy rules, proof assets, no-em-dash rule.
- `docs/branding/DESIGN_SYSTEM.md` — the website design system (separate from the deck system, but shares the confident-clinical direction).
- Plan docs per deck (table above).
