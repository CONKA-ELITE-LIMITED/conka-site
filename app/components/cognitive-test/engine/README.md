# Web cognition test engine

A React DOM port of the app's native test (conkaApp `conka_mobile_app/src/screens/games/cognicaOffline/`), scored by the Flask test flow. Built in SCRUM-1456 so the website no longer depends on the Cognetivity SDK.

Portable by rule: nothing in this folder imports from outside it (only `react`). Lifting it into a package means copying this folder plus `public/cognica/`.

## Use

```tsx
import { CognitiveTestEngine } from "@/app/components/cognitive-test/engine";

<div style={{ height: 600 }}>
  <CognitiveTestEngine
    apiBaseUrl="https://conka.app"
    onComplete={({ score, accuracy, speed, testInstanceId }) => {}}
    onError={(error) => {}}
  />
</div>;
```

| Prop | Default | |
|---|---|---|
| `apiBaseUrl` | required | Origin of the Flask API. `/springboot/open`, `/steps`, `/complete` are appended. Production `https://conka.app`; staging URL in conkaApp `docs/app/deployment/gcp-staging.md` |
| `shortVersion` | `true` | 20 images (the website test). `false` runs 48 |
| `theme` | app colours | `EngineTheme` in `types.ts`: half backgrounds, text, accent, font, radius |
| `assetBaseUrl` | `/cognica` | Serves `test/<id>.jpg` and `masks/<id>.png` |
| `onComplete` | required | Server scores: `score` (test_stats `score1`, unrounded), `accuracy`, `speed`, `testInstanceId` |
| `onError` | | Any failure: open, image preload, steps, complete, or a 15s timeout. The engine then shows Try again |

The engine fills its parent (min height 480px); the parent sets the size.

## How it runs

1. **Preparing.** Builds a balanced sequence (25% per difficulty, half animal), opens a test instance with `userId` `web:<uuid>` (one per test, never an email), and preloads and decodes only this test's images and the 8 masks. Instructions show meanwhile; Start enables when both finish.
2. **Test.** Per image, as the app does: image 110ms, blank 20ms, 7-frame mask 230ms, blank 750ms, "Be Quick" 2000ms, progress 40ms, gap 750ms. Taps unlock when the image hides; the first tap ends the step. Left half = non-animal, right half = animal; arrow keys on desktop.
3. **Submitting.** `/steps` (reaction time in seconds, side as 0/1/2) then `/complete`. A retry replays both; `/steps` is idempotent server-side.

## Timing

Ported from the app's `docs/TIMING-PRECISION.md`, with the browser's better clock: every timestamp is `performance.now()`, and stimulus onset is committed inside `requestAnimationFrame` with the opacity written straight to the DOM. Reaction time is tap time minus the moment the image hid, clamped at 0; a step with no tap sends `none` and 0.

The app's step has a fixation timer that its own image-on-load pre-empts, so it never delays anything. This port keeps that behaviour and leaves the dead timer out.

## Demo

`/conka-app-demo` (noindex). Staging by default, `?env=prod` for production, `?full=1` for 48 images. The result JSON prints under the test, so a phone run needs no devtools.
