# Generating Image Assets

> The process for any rendered image the site serves: gallery slides, explainers, listicle
> cards, selector tiles. **Read only the Quick path for a routine job.** Open the steps for a
> new asset, and [`IMAGE_ASSET_PIPELINE.md`](../development/IMAGE_ASSET_PIPELINE.md) only at
> the section a step names. It is the technique reference, not required reading.

## Quick path (re-render or small change)

```bash
cd design/pdp-slides
# 1. edit slides/<id>.html (the top comment says what it burns in and when to re-render)
PROOF=1 ./render.sh <id>       # 2. proofs/<name>.jpg + <name>@390.jpg; public/ untouched
# 3. Claude reads both proofs, then Rudh reviews: open CANVAS.html (auto-reloads on focus)
# 4. once signed off, bump the V suffix in render.sh's slide_name, then:
./render.sh <id>               #    writes public/formulas/mmPdpAssetsV2/<name>.jpg
# 5. point the config at the new filename; update the set README's slide table
```

Listicle cards (`design/listicle-assets/`) follow the same loop; their render command is in
that folder's README.

## Where things live

| Thing | Location |
|---|---|
| Slides (2400x1715) | `design/pdp-slides/`: `slides/`, `render.sh`, `CANVAS.html`, `README.md` (slide table) |
| Listicle cards (1600x2000) | `design/listicle-assets/` |
| Source photos (not committed) | `design/pdp-slides/assets/`, a symlink; raw drops in `~/Desktop/ClaudeAssetDrop/Ai Assets/` |
| Photo prep scripts | beside their set, e.g. `design/pdp-slides/build-white-box.py` |
| Proofs (not committed) | `design/pdp-slides/proofs/` |

## New asset: the steps

1. **Brief.** One idea per asset. Work out the minimum type size: artboard width / display
   width x the target on-screen px (gallery slides about 90px, listicle cards 70px; pipeline
   doc, *The legibility floor*). If the copy does not fit at that size, cut copy. List every
   number it burns in and its source (`offerData.ts`, offer config). Check it shows **what
   ships** (`custom.bundlecomposition` in `SKU_AND_SHOT_REFERENCE.md`), not whatever photo
   exists. No em dashes; use the `conka-messaging` skill for headlines.
2. **Photo prep.** Measure the ground and the subject before choosing a technique (pipeline
   doc, *Gotchas* and *Cutting a product out*). Anything more than a one-liner becomes a script
   beside the set, so the asset can be rebuilt when the photo changes.
3. **HTML.** Copy the nearest slide and share `_base.css`. Use the real fonts from
   `app/fonts/`. Write a top comment covering the argument, the burned-in numbers, their
   source, and when to re-render. Register the slide in `render.sh`.
4. **Review.** Add the slide to `CANVAS.html`'s `SECTIONS` and run `PROOF=1 ./render.sh`.
   Claude checks the `@390` proof for legible type, no clipping, no visible image edge, and
   correct numbers, and does not open Chrome. Rudh signs off in the canvas.
5. **Ship.** Every changed image gets a new filename, because Next caches images by URL for a
   year. Slides export at 2000px, quality 82, about 300 to 350KB. Size tiles to 3x their
   display size (a selector tile is 800px, about 55KB). Update the config and the set README.
   Delete a superseded file only if nothing references it and nobody wants it back.
6. **Record.** A new technique or gotcha goes in `IMAGE_ASSET_PIPELINE.md`. A burned-in price
   change is listed in that change's `PRICING_HISTORY.md` block.
