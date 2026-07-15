# Video Optimisation

How raw video exports are turned into the small, web-ready assets the site plays. Follow this whenever a new or replacement product video is added to `public/videos/`.

Everything here is done locally with `ffmpeg` / `ffprobe` (both already installed at `/usr/local/bin`). No paid tools, no cloud step.

---

## The asset convention

Each video is a **trio of files sharing one basename**, in `public/videos/<product>/`:

| File | Codec | Purpose |
|------|-------|---------|
| `<Name>.webm` | VP9 | Primary source (smaller for Chrome, Firefox, Edge) |
| `<Name>.mp4` | H.264 (yuv420p, faststart) | Fallback source (Safari, iOS) |
| `<Name>-poster.jpg` | JPEG | Shown before playback / while loading |

Example (Flow liquid swirl): `FlowLiquid.webm`, `FlowLiquid.mp4`, `FlowLiquid-poster.jpg`.

**Naming: keep it version-less.** When replacing a video, write the optimised output over the existing basename (e.g. keep `FlowLiquid.*`) rather than introducing `FlowLiquidV2.*`. That keeps every code reference stable and avoids a version suffix leaking into the codebase permanently. Delete the raw upload once optimised.

---

## How the site consumes the trio

Reference component: `app/components/landing/BottleVideo.tsx`. The `<video>` element:

- Lists **WebM first, MP4 second** (`<source>` order is the fallback order; the browser picks the first it supports).
- Uses `muted` + `playsInline` so iOS Safari permits autoplay, plus `loop` and `preload="metadata"` (keeps the initial fetch tiny).
- Sets `poster` to the `-poster.jpg`.
- Plays / pauses via `IntersectionObserver` so off-screen videos are not decoded.

Other consumers: `app/(trial-b)/funnel-c/components/FunnelMedia.tsx`, and `mp4`-only references in `app/lib/landings/*.ts`. All reference the basename paths, so overwriting the files updates every surface at once.

---

## The recipe

Source is a single raw `.mp4` export (often 2-3 Mbps with an audio track). Produce the three optimised files. These are **decorative, muted, autoplaying loops**, so audio is stripped.

Run from the repo root. Replace `SRC` and the output basename.

```bash
SRC="public/videos/flow/FlowLiquidRaw.mp4"     # the raw upload
OUT="public/videos/flow/FlowLiquid"            # target basename (no extension)

# 1. H.264 MP4 — Safari/iOS fallback. yuv420p for universal decode, faststart
#    moves the moov atom to the front so playback can start before full download.
ffmpeg -y -i "$SRC" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p \
  -movflags +faststart -an -profile:v high -level 4.0 "$OUT.mp4"

# 2. VP9 WebM — primary source for Chrome/Firefox/Edge. -b:v 0 makes -crf the
#    sole quality target (constant-quality mode). row-mt speeds up the encode.
ffmpeg -y -i "$SRC" -c:v libvpx-vp9 -crf 34 -b:v 0 -pix_fmt yuv420p \
  -an -row-mt 1 -deadline good -cpu-used 1 "$OUT.webm"

# 3. Poster — a single representative frame (see "Choosing the poster frame").
ffmpeg -y -ss 3.0 -i "$SRC" -frames:v 1 -q:v 4 "$OUT-poster.jpg"
```

### Why these settings

- **`-an` (strip audio).** The videos autoplay muted and are decorative. Audio is pure dead weight; the raw export's AAC track can be a large share of the file.
- **`-crf 27` (H.264) / `-crf 34 -b:v 0` (VP9).** Constant-quality encoding. These land near the established size budget (see Benchmarks) with no visible banding on the smooth white backgrounds these bottle videos use. Lower the CRF a couple of points if you ever see banding; raise it if a video is unusually large.
- **`-pix_fmt yuv420p`.** Required for broad browser/hardware decode. Some raw exports are yuv444p/yuv422p, which Safari and many devices refuse.
- **`-movflags +faststart`.** MP4 only. Lets playback begin before the whole file downloads.
- **`-preset slow` / `-cpu-used 1`.** Slower encode, smaller/better file. Fine for a one-off asset step.
- **WebM listed first in the markup** because VP9 is typically smaller than H.264 at equal quality, so supporting browsers fetch the lighter file.

### Choosing the poster frame

The poster is the still users see before autoplay kicks in, so pick a frame where the **product reads clearly**. For the CONKA bottle videos that means the wordmark is legible and the liquid element is not covering it.

Extract several candidates, look at them, then encode the poster from the chosen timestamp:

```bash
for t in 0.1 1.5 3.0 4.8; do
  ffmpeg -y -ss $t -i "$SRC" -frames:v 1 -q:v 3 "/tmp/frame_$t.jpg"
done
# open the frames, choose the best t, use it as the -ss value in recipe step 3
```

(For `FlowLiquid` the hero frame was `t=3.0s`: wordmark fully legible, amber ribbon swirling at the base.)

---

## Verify before committing

1. **Specs** — confirm codec, no audio, and duration preserved:
   ```bash
   ffprobe -v error -show_entries stream=codec_type,codec_name \
     -show_entries format=size,duration -of default=noprint_wrappers=1 \
     public/videos/flow/FlowLiquid.mp4
   ```
   Expect a single `codec_type=video` (no audio stream) and the same duration as the source.
2. **Quality** — extract a frame from the *encoded* output (not the source) and look at it, especially any large flat/gradient areas, for banding or blocking.
3. **Loop** — if the video is meant to loop seamlessly, play it in context and watch the wrap point. Seamless looping is a property of the **source export** (e.g. a forward+reverse concatenation), not something optimisation adds. If it jumps, the source needs fixing, not the encode.
4. **In-app** — `npm run dev`, view the page, confirm it autoplays on mobile width (390px).

---

## Benchmarks (size budget)

Typical 720x1280, ~5s decorative loop, per file:

| File | Target | Example (`FlowLiquid`) |
|------|--------|------------------------|
| `.mp4` | under ~500 KB | 319 KB (from a 1.4 MB raw export) |
| `.webm` | under ~500 KB | 381 KB |
| `-poster.jpg` | ~25-40 KB | 36 KB |

If an encode lands well above these, check the source resolution/duration first, then nudge the CRF up a point or two.

---

## References

- Playback component (reference implementation): `app/components/landing/BottleVideo.tsx`
- Other consumers: `app/(trial-b)/funnel-c/components/FunnelMedia.tsx`, `app/lib/landings/*.ts`
- Asset location: `public/videos/<product>/`
- Performance rules: `docs/development/PERFORMANCE_OPTIMISATION.md`
