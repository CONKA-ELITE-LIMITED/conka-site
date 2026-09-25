"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CognitiveTestEngine, type EngineResult } from "@/app/components/cognitive-test/engine";

/**
 * Test harness for the engine. ?env=prod scores against production, anything
 * else against staging; ?full=1 runs the 48-image test. Results and errors are
 * printed below the test so a run can be checked on a phone without devtools.
 */
const API_BASE_URLS = {
  staging: "https://conka-staging-api-qk3ezdiy3a-nw.a.run.app",
  prod: "https://conka.app",
} as const;

export default function DemoClient() {
  const params = useSearchParams();
  const env = params.get("env") === "prod" ? "prod" : "staging";
  const shortVersion = params.get("full") !== "1";
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="brand-h3">Cognition test engine</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">
          {env} · {shortVersion ? "short" : "full"}
        </p>
      </div>

      <div className="h-[75svh] min-h-[520px] overflow-hidden rounded-md">
        {result ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-[var(--brand-navy)] p-6 text-white">
            <p className="brand-h3">Score {Math.round(result.score)}</p>
            <p className="brand-body">
              Accuracy {Math.round(result.accuracy)} · Speed {Math.round(result.speed)}
            </p>
            <button
              type="button"
              className="min-h-11 rounded-full bg-white px-6 font-semibold text-[var(--brand-navy)]"
              onClick={() => {
                setResult(null);
                setRun((n) => n + 1);
              }}
            >
              Run again
            </button>
          </div>
        ) : (
          <CognitiveTestEngine
            key={run}
            apiBaseUrl={API_BASE_URLS[env]}
            shortVersion={shortVersion}
            onComplete={setResult}
            onError={(err) => setErrors((prev) => [...prev, err.message])}
          />
        )}
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-black/5 p-4 font-mono text-xs text-black/70">
        {result ? JSON.stringify(result, null, 2) : "No result yet"}
        {errors.length > 0 && `\n\nErrors:\n${errors.join("\n")}`}
      </pre>
    </div>
  );
}
