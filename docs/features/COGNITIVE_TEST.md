# Cognitive Test (website)

> **Purpose:** Canonical reference for the website's cognition test: where it runs, how a test is scored, what reaches Klaviyo, and why it is built the way it is. Read before touching `app/components/cognitive-test/` or the test on `/app`.
>
> **Component usage, props and step timings live in the engine's own [`README`](../../app/components/cognitive-test/engine/README.md)**, which travels with the engine if it is ever lifted into a package. This doc covers the system around it.

## Overview

A visitor sees images flashed for a split second and taps left (non-animal) or right (animal) as fast as they can. They get a score with speed and accuracy, a product recommendation and the app promo, and their result goes to Klaviyo. It is the "measure it yourself" proof on `/app` ("See CONKA working") and the entry point to a CONKA baseline.

Two implementations exist while the Cognetivity AWS stack is retired (plan: `docs/development/featurePlans/cognetivity-aws-exit.md` in conkaApp):

| | Cognetivity iframe | Native engine |
|---|---|---|
| Component | `CognicaSDK.tsx` | `engine/` (SCRUM-1456) |
| Where it runs | `/app` today | `/conka-app-demo` (internal); replaces the iframe on `/app` in SCRUM-1457 |
| Scored by | WASM in the browser | Our Flask server (`test_stats`) |
| Stored in | Cognetivity's AWS RDS | Our Cloud SQL Postgres |
| Styleable | No | Yes (`theme` prop) |

When SCRUM-1457 lands, `CognicaSDK.tsx` is deleted and this doc drops the iframe column.

## How it works

### On `/app`

`CognitiveTestSection` (desktop) and `CognitiveTestSectionMobile` run one state machine: `idle -> email -> testing -> processing -> results` (`TestState` in `types.ts`).

1. **Idle.** `CognitiveTestIdleCard` invites the visitor in.
2. **Email gate.** `EmailCaptureForm`. On submit, `subscribeAppTestSignup` adds the email to the Klaviyo master list with consent, tagged `source: app_test` (SCRUM-1360). This runs before the test so a visitor who drops out is still captured.
3. **Testing.** The test component renders and calls `onComplete(TestResult)` with rounded `score`, `accuracy`, `speed` and a `testInstanceId`.
4. **Processing.** `CognitiveTestLoader` plays a short animation.
5. **Results.** `CognitiveTestScores`, `CognitiveTestRecommendation`, `CognitiveTestAppPromo`, and the result is sent to Klaviyo (see Klaviyo below).

`TestResult` is the contract between the test and the page. Swapping the test component must keep it, so results, recommendation and promo need no change.

### Inside the native engine

```
mount ──> build a balanced image sequence
      ──> POST /springboot/open {userId: "web:<uuid>"}  ┐ in parallel,
      ──> preload + decode this test's images and masks ┘ instructions showing
Start ──> one step per image (image, mask, "Be Quick", progress)
      ──> POST /springboot/steps (all answers at once)
      ──> POST /springboot/complete ──> onComplete({score, accuracy, speed, testInstanceId})
```

Every answer is held in the browser until the end; the server sees nothing between open and steps. Step timings, the tap rules and the timing maths are in the engine README.

## Key files

| File | Purpose |
|------|---------|
| `app/components/cognitive-test/engine/` | The native engine. Self-contained: imports only `react` and its own files |
| `app/components/cognitive-test/engine/README.md` | Engine usage, props, step timings, timing precision |
| `app/components/cognitive-test/engine/testService.ts` | Client for `/springboot/open`, `/steps`, `/complete` and the wire format |
| `app/components/cognitive-test/engine/images.ts` | Image set, balanced sequence builder, preloader |
| `public/cognica/` | Test images (`test/<id>.jpg`) and masks (`masks/<id>.png`), copied from the app |
| `app/conka-app-demo/` | Internal noindex harness for the engine |
| `app/components/cognitive-test/CognitiveTestSection.tsx` / `...Mobile.tsx` | The `/app` test section and its state machine |
| `app/components/cognitive-test/CognicaSDK.tsx` | The Cognetivity iframe (being replaced) |
| `app/components/cognitive-test/types.ts` | `TestState`, `TestResult` and the section's prop types |
| `app/lib/klaviyo.ts` | `subscribeAppTestSignup`, `trackCognitiveTest` |
| `app/api/klaviyo/track-test/route.ts` | Sends the iframe's result to Klaviyo (browser-supplied scores) |
| `app/api/klaviyo/app-test-signup/route.ts` | Master-list signup at the email gate |

## API endpoints

All on the conkaApp Flask server (Cloud Run). Unauthenticated, CORS open to all origins. The server code is `conka_server/conkaApi/controllers/test_flow_controller.py` and `klaviyo_controller.py` in conkaApp; do not change the contract from here.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/springboot/open` | `{userId, startRecordedDate}` -> `{testInstanceId}` (201) |
| POST | `/springboot/steps` | `{test_instance_id, steps: [{image_id, order, reaction_time, side_selected, trial_status}]}`. Snake case; `reaction_time` in **seconds**; `side_selected` 0 left, 1 right, 2 none. Idempotent once steps exist |
| POST | `/springboot/complete` | `{testInstanceId}` -> `{stats: {score1, score2, accuracy, speed, ...}}` |
| POST | `/klaviyo/web-test-complete` | `{email, testInstanceId, sourcePage?}`. Reads the scores from `test_stats` and sends the Klaviyo event. Accepts only a completed `web:` test (400 otherwise, 404 unknown). Idempotent per email and test |

**Base URLs, and the one that trips people up:** production is `https://conka.app`. Its load balancer strips `/api`, so `/springboot/*` is called as is (`https://conka.app/springboot/open`), but the Klaviyo route must be called as `https://conka.app/api/klaviyo/web-test-complete`. Staging is direct Cloud Run with no prefix; its URL is in conkaApp `docs/app/deployment/gcp-staging.md` and in `app/conka-app-demo/DemoClient.tsx`. Staging has no Klaviyo key, so `web-test-complete` answers 503 there but still records the submission.

## Database

Cloud SQL Postgres, owned by conkaApp. The website never touches it directly.

- `test_instances`, `test_steps`, `test_stats`: the same tables the mobile app writes. A website test's `user_id` is `web:<uuid>`, a fresh uuid per test. Never an email, so test tables hold no PII, and web tests separate from app users with a `LIKE 'web:%'` filter.
- `web_test_submissions`: written by `/klaviyo/web-test-complete`. Links an email to a `test_instance_id` and records when Klaviyo was synced. This is the only place a website test meets an email.

## Klaviyo

One event, `Website Short Test Submitted`, feeds the website test flows. Two paths send it, and they are not identical:

| | Today (iframe) | Native engine (from SCRUM-1457) |
|---|---|---|
| Sent by | This site: `/api/klaviyo/track-test` | Flask: `/klaviyo/web-test-complete` |
| Scores from | The browser's POST (trusted) | `test_stats` on our server |
| Score properties | `latest_website_score`, `accuracy`, `speed` | `latest_website_score`, `latest_website_accuracy`, `latest_website_speed` |
| Extra properties | none | `latest_website_test_date`, `source: "website"`, `source_page` |

**Gotcha:** the accuracy and speed property names change between the two paths. Before the swap goes live, check every Klaviyo flow, segment and template that reads `accuracy` or `speed` on this event. `latest_website_score` keeps its name; on the Flask path it is `score1`, rounded half up.

The master-list signup at the email gate (`/api/klaviyo/app-test-signup`) is separate and unaffected. See `KLAVIYO_FLOWS_AND_INTEGRATION.md` for the list and flow definitions.

## Decisions and trade-offs

- **A native port, not the Cognetivity SDK.** Re-hosting the Stencil SDK would keep an unstyleable iframe, browser-side scoring and a second data store. The port runs the app's own engine against the server the app already uses: one scoring engine, one store, and Klaviyo fed scores the server computed.
- **In this repo, not its own repo or Vercel project.** A separately hosted test could only be embedded as an iframe, the thing being removed, and a separate npm package means versioning and a publish step for a single consumer. Instead the engine folder imports nothing from the site, so extraction later is a copy of `engine/` plus `public/cognica/`. Split it out when a second real consumer exists (a partner embed, or the app wanting the web version).
- **Scoring is the Flask port of the Cognetivity engine**, already established for the app. There was no score-parity check against the old SDK: the website test is a light benchmark, not a clinical measure.
- **`score` is `score1` only.** The app falls back to `score2` when `score1` is 0; the web engine does not, so the page always shows the number Klaviyo receives.
- **Timing is ported, not invented.** Same step durations as the app, with the browser's better clock (`performance.now()`, onset in `requestAnimationFrame`). The app has a fixation timer its own image-on-load pre-empts; the port reproduces the actual behaviour and drops the dead timer. Details in the engine README.
- **Preload only what one test uses** (its images and the masks), never the whole set. The full set is several MB and mostly mobile traffic.
- **Unauthenticated `/springboot/open`.** Public traffic can create junk test rows. The `web:` prefix keeps them separable; a rate limit gets added only if abuse shows.

## Edge cases and error handling

- **Any API failure** (open, steps, complete, or no answer within 15s) or a failed image preload calls `onError` and shows a Try again screen. Retry after a failed open or preload starts again with a new instance; retry after a failed submit resends the same answers (safe, `/steps` is idempotent).
- **Abandoned tests** stay `pending` in `test_instances`: opened on page load, never completed. Expected; filter on status.
- **Switching tabs mid-test** lets the browser throttle timers, which distorts that run's timings. Known limitation, shared with the app when backgrounded. Not handled.
- **React StrictMode (dev only)** mounts twice; the open is deferred a tick so the discarded mount never creates an instance.
- **Arrow keys** answer on desktop only while the test is running, and never while focus is in a form field, so the page scrolls normally otherwise.
- **After `onComplete`** the engine shows "Test complete" and waits for the host page to swap it out; it never calls back after it unmounts.

## Demo page

`/conka-app-demo`: noindex, not in the sitemap, linked from nowhere. It scores against staging by default, `?env=prod` against production, `?full=1` runs the 48-image test. The result JSON prints under the test, so a phone run needs no devtools. Demo runs create real `web:` rows in whichever environment they hit.
