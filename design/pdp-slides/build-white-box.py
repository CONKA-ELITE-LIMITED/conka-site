"""Builds the white trial box sources and the /go/trial-pack tile images (SCRUM-1467).

    python3 build-white-box.py [source.webp]   # needs Pillow + numpy (a throwaway venv is fine)

Input: the Ai Assets photo of the white mixed box (default path below, or pass
one) (2 Flow + 2 Clear, what Synergy
ships). Its studio ground runs 215 to 244 and the box face sits at ~240, so the
ground cannot go to white without losing the box. Instead it is flattened to ONE
grey, rgb(238,236,240): a 32px grid of ground medians (box area masked out and
filled by diffusion) is divided out. Every slide and tile using these sets its
ground to that same grey, so no image edge shows.

The 2-box images are two copies of the one box, multiplied relative to that grey
(a*b/G0), so ground stays ground and each box and shadow shows through. The
offsets keep the two silhouettes apart; overlapping boxes would ghost.

Writes assets/Both4BoxWhiteFlat.jpg, assets/Both8BoxMixedSide.jpg,
assets/Both8BoxMixedStagger.jpg, and the two tile JPGs into public/.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Desktop/ClaudeAssetDrop/Ai Assets/Box/Both4BoxWhite.webp"
PUBLIC = HERE / "../../public/formulas/mmPdpAssetsV2"
G0 = np.array([238.0, 236.0, 240.0])
BOX = (370, 240, 1640, 1800)  # x0, y0, x1, y1 of box + shadow in the 2048px source
CELL = 32


def flatten(path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(float)
    h, w, _ = im.shape
    yy, xx = np.mgrid[0:h, 0:w]
    x0, y0, x1, y1 = BOX
    ground = ~((xx > x0) & (xx < x1) & (yy > y0) & (yy < y1))
    gh, gw = h // CELL, w // CELL
    est = np.full((gh, gw, 3), np.nan)
    for i in range(gh):
        for j in range(gw):
            cell = (slice(i * CELL, (i + 1) * CELL), slice(j * CELL, (j + 1) * CELL))
            m = ground[cell]
            if m.mean() > 0.9:
                est[i, j] = np.median(im[cell][m], 0)
    known = ~np.isnan(est[..., 0])
    e = np.where(known[..., None], est, np.nanmean(est, (0, 1)))
    for _ in range(3000):  # fill the masked box cells from their neighbours
        p = np.pad(e, ((1, 1), (1, 1), (0, 0)), mode="edge")
        e = np.where(known[..., None], e, (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) / 4)
    for _ in range(4):
        p = np.pad(e, ((1, 1), (1, 1), (0, 0)), mode="edge")
        e = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:] + 4 * p[1:-1, 1:-1]) / 8
    gnd = np.stack(
        [np.asarray(Image.fromarray(e[..., c].astype(np.float32)).resize((w, h), Image.BICUBIC)) for c in range(3)], -1
    )
    return (im / gnd * G0).clip(0, 255)


def pair(a, dx, dy):
    """Two copies of `a`, the second offset by (dx, dy), multiplied relative to G0."""
    h, w, _ = a.shape
    ch, cw = h + abs(dy), w + dx
    first, second = np.tile(G0, (ch, cw, 1)), np.tile(G0, (ch, cw, 1))
    first[max(-dy, 0):max(-dy, 0) + h, 0:w] = a
    second[max(dy, 0):max(dy, 0) + h, dx:dx + w] = a
    return (first * second / G0).clip(0, 255)


def save(arr, path, quality):
    Image.fromarray(arr.astype(np.uint8)).save(path, quality=quality, optimize=True, progressive=True)


one = flatten(SRC)
side = pair(one, 1080, -140)  # side by side, right box a touch higher
stagger = pair(one, 780, 860)  # back box upper left, front box lower right
save(one, HERE / "assets/Both4BoxWhiteFlat.jpg", 90)
save(side, HERE / "assets/Both8BoxMixedSide.jpg", 90)
save(stagger, HERE / "assets/Both8BoxMixedStagger.jpg", 90)

# Tiles: square crops at 800px, the size OfferBuyBox needs at 3x DPR.
def save_tile(arr, box, name):
    tile = Image.fromarray(arr.astype(np.uint8)).crop(box).resize((800, 800), Image.LANCZOS)
    tile.save(PUBLIC / name, quality=82, optimize=True, progressive=True)


save_tile(one, (295, 235, 1745, 1685), "TrialTileOneBox.jpg")
save_tile(side, (380, 0, 2568, 2188), "TrialTileTwoBoxes.jpg")
print("done")
