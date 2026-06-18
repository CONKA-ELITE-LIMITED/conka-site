# Magic Mind-Inspired Video Hero (Home, Mobile)

## Problem
The current home hero is a static image. A calm, premium looping video of the two
shots in still water (the Magic Mind playbook) is a stronger first impression for
paid traffic and better communicates the "system" feel. We want to try the
structure and measure.

## Who it serves
All home-page visitors, primarily mobile paid traffic.

## Business impact
The hero is the highest-leverage CRO surface. A more premium, motion-led hero
should lift engagement and click-through into `/conka-both`.

## Approach
Optimise `BothStillWater.mp4` into our standard mp4 + webm + poster set with a
seamless ping-pong loop, then build a mobile-first video hero that copies the
Magic Mind structure: a full-bleed background video with content overlaid (title
and supporting copy near the top, a single CTA near the bottom). Hard-swap it in
on mobile on this branch. Desktop keeps the existing `LandingHero` for now.

Existing hero copy is reused verbatim. This work is about replicating the Magic
Mind structure, not rewriting messaging.

## Design system
brand-base (new). Inherits `brand-section` / `brand-hero-first` / `brand-clinical`
tokens. Reuses `ConkaCTAButton`. Video playback reuses the `FlowVideo` /
`BottleVideo` IntersectionObserver pattern.

## Decisions locked
- Hard swap on this branch (no query-param A/B toggle).
- Single CTA, no micro-commitment link row.
- Primary CTA points to `/conka-both` (the video is the Both/system shot).
- Copy unchanged from the current hero.
- Layout copies Magic Mind: background video with overlaid content.
- Mobile only this pass. Desktop is a future phase.

## Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Video optimisation (mp4 + webm + poster, ping-pong loop) | Not Started |
| 2 | Mobile video hero component + mobile hard-swap | Not Started |
| 3 | Desktop layout for the video hero | Future |

### Phase 1: Video optimisation (ACTIVE)
1. **Encode the loop set**
   - ffmpeg from the 720x1280 source: MP4 (libx264 CRF 24, yuv420p, faststart),
     WebM (libvpx-vp9 ~1Mbps CRF 32), audio stripped, forward+reverse concat baked
     in via `filter_complex` for a seamless loop. Export a first-frame JPEG poster.
   - Move the raw master to `/raw-assets/` (gitignored).
   - Complexity: Small
   - Files: `public/videos/both/BothStillWater.{mp4,webm}`, `BothStillWater-poster.jpg`
   - Target: each encode under the ~1MB hero budget; verify no audio track.

### Phase 2: Mobile video hero + swap (ACTIVE)
2. **Component: `LandingHeroVideo.tsx` (mobile)**
   - Full-bleed background `<video>` (muted, playsInline, loop) with
     IntersectionObserver play/pause borrowed from `FlowVideo` / `BottleVideo`.
   - `poster` + `preload="metadata"`.
   - Overlaid content copying the Magic Mind structure: title + supporting copy
     block near the top, a single `ConkaCTAButton` to `/conka-both` near the bottom.
   - Legibility scrim/gradient over the water so text stays readable.
   - Copy reused verbatim from the current `LandingHero`.
   - Complexity: Medium
   - Files: new `app/components/landing/LandingHeroVideo.tsx`
3. **Mobile hard-swap**
   - Render `LandingHeroVideo` below `lg` and keep `LandingHero` at `lg+` so
     desktop is untouched until Phase 3.
   - Complexity: Small
   - Files: `app/page.tsx` (or wherever `LandingHero` is mounted)

## Rabbit holes
- **Text legibility over a light water clip.** Magic Mind's video is dark; ours is
  calm and light. A gradient scrim is the fix rather than re-grading the video.
- **Loop seam / file size.** Ping-pong doubles duration to ~10s; keep CRF/bitrate
  in check so encodes stay under budget. Do not chase a perfect in-clip loop.

## No-gos
- No desktop redesign this pass (Phase 3, Future).
- No A/B toggle / query param.
- No micro-commitment link row.
- No copy changes.
- No new analytics events.

## Risks
- The hero video is effectively the mobile LCP element; mitigated by poster +
  `preload="metadata"` + IntersectionObserver play/pause.
- iOS autoplay requires `muted` + `playsInline` (covered by our existing pattern).

## References
- Encoding recipe precedent: `docs/CHANGELOG.md` (Flow bottle render, ffmpeg
  pipeline with forward+reverse ping-pong).
- Video component pattern: `app/startv2/FlowVideo.tsx`, `BottleVideo`.
- Current hero: `app/components/landing/LandingHero.tsx`.
- Performance rules: `docs/development/PERFORMANCE_OPTIMISATION.md`.

## Jira tickets

| Key | Title | Phase | Status |
|-----|-------|-------|--------|
| SCRUM-1099 | [Website & CRO] Home: Magic Mind-style looped video hero (mobile) | 1 + 2 | To Do |
