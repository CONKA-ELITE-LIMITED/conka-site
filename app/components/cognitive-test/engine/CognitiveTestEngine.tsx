"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Instructions from "./Instructions";
import TestFlow from "./TestFlow";
import styles from "./engine.module.css";
import { MASK_IDS, buildImageSequence, imageUrl, maskUrl, preloadImages } from "./images";
import { DEFAULT_TEST_SETTINGS, FULL_IMAGE_COUNT, SHORT_IMAGE_COUNT } from "./settings";
import { completeTest, newWebUserId, openTest, submitSteps } from "./testService";
import type { CognitiveTestEngineProps, EngineTheme, Interaction } from "./types";

/**
 * The web cognition test, a React DOM port of the app's native engine
 * (conkaApp cognicaOffline), scored by the Flask test flow.
 *
 *   preparing: open a test instance (userId web:<uuid>) and preload this
 *              test's images and masks; instructions show meanwhile
 *   ready:     Start enabled
 *   test:      the image sequence
 *   submitting: /steps then /complete; onComplete gets the server's scores
 *   error:     onError has been called; Try again reopens (preparing) or
 *              resubmits (submitting, which the server treats as idempotent)
 *
 * Self-contained: nothing here imports from outside engine/.
 */

type Stage = "preparing" | "ready" | "test" | "submitting" | "done" | "error";

const DEFAULT_THEME: Required<EngineTheme> = {
  leftBackground: "rgb(70, 70, 70)",
  rightBackground: "#000",
  text: "#fff",
  mutedText: "rgba(255, 255, 255, 0.6)",
  accent: "#fff",
  accentText: "#000",
  fontFamily: "system-ui, -apple-system, sans-serif",
  radius: "999px",
};

const toError = (err: unknown) => (err instanceof Error ? err : new Error(String(err)));

export default function CognitiveTestEngine({
  apiBaseUrl,
  shortVersion = true,
  theme,
  assetBaseUrl = "/cognica",
  onComplete,
  onError,
}: CognitiveTestEngineProps) {
  const imageCount = shortVersion ? SHORT_IMAGE_COUNT : FULL_IMAGE_COUNT;
  const [stage, setStage] = useState<Stage>("preparing");
  const [sequence, setSequence] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [failedAt, setFailedAt] = useState<"prepare" | "submit">("prepare");
  const testInstanceId = useRef<number | null>(null);
  const interactions = useRef<Interaction[]>([]);
  // Holds the decoded images for the life of the test so the browser keeps them.
  const decoded = useRef<HTMLImageElement[]>([]);
  const callbacks = useRef({ onComplete, onError });

  useEffect(() => {
    callbacks.current = { onComplete, onError };
  }, [onComplete, onError]);

  const fail = useCallback((err: unknown, at: "prepare" | "submit") => {
    setFailedAt(at);
    setStage("error");
    callbacks.current.onError?.(toError(err));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const ids = buildImageSequence(imageCount);
    setSequence(ids);
    setStage("preparing");
    testInstanceId.current = null;

    Promise.all([
      openTest(apiBaseUrl, newWebUserId()),
      preloadImages([...ids.map((id) => imageUrl(assetBaseUrl, id)), ...MASK_IDS.map((id) => maskUrl(assetBaseUrl, id))]),
    ])
      .then(([id, images]) => {
        if (cancelled) return;
        testInstanceId.current = id;
        decoded.current = images;
        setStage("ready");
      })
      .catch((err) => {
        if (!cancelled) fail(err, "prepare");
      });

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, assetBaseUrl, imageCount, attempt, fail]);

  const submit = useCallback(async () => {
    const id = testInstanceId.current;
    if (id === null) return;
    setStage("submitting");
    try {
      await submitSteps(apiBaseUrl, id, interactions.current);
      const stats = await completeTest(apiBaseUrl, id);
      setStage("done");
      callbacks.current.onComplete({
        score: Number(stats.score1 || stats.score2 || 0),
        accuracy: Number(stats.accuracy || 0),
        speed: Number(stats.speed || 0),
        testInstanceId: id,
      });
    } catch (err) {
      fail(err, "submit");
    }
  }, [apiBaseUrl, fail]);

  const handleFinished = useCallback(
    (result: Interaction[]) => {
      interactions.current = result;
      void submit();
    },
    [submit],
  );

  const retry = () => {
    if (failedAt === "submit") void submit();
    else setAttempt((n) => n + 1);
  };

  const t = { ...DEFAULT_THEME, ...theme };
  const vars = {
    "--cte-left": t.leftBackground,
    "--cte-right": t.rightBackground,
    "--cte-text": t.text,
    "--cte-muted": t.mutedText,
    "--cte-accent": t.accent,
    "--cte-accent-text": t.accentText,
    "--cte-font": t.fontFamily,
    "--cte-radius": t.radius,
  } as CSSProperties;

  return (
    <div className={styles.root} style={vars}>
      {(stage === "preparing" || stage === "ready") && (
        <Instructions imageCount={imageCount} ready={stage === "ready"} onStart={() => setStage("test")} />
      )}

      {stage === "test" && (
        <TestFlow
          imageIds={sequence}
          assetBaseUrl={assetBaseUrl}
          settings={DEFAULT_TEST_SETTINGS}
          onFinished={handleFinished}
        />
      )}

      {(stage === "submitting" || stage === "done") && (
        <div className={styles.status} role="status">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.statusTitle}>Calculating your score</p>
        </div>
      )}

      {stage === "error" && (
        <div className={styles.status} role="alert">
          <p className={styles.statusTitle}>Something went wrong</p>
          <p className={styles.statusText}>
            {failedAt === "submit"
              ? "Your answers are saved on this page. Check your connection and try again."
              : "The test could not load. Check your connection and try again."}
          </p>
          <button type="button" className={styles.button} onClick={retry}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
