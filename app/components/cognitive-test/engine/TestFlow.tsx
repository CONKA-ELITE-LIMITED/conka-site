"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import TestContainer from "./TestContainer";
import TestStep, { type TestStepHandle } from "./TestStep";
import { imageUrl, maskSequence, maskUrl } from "./images";
import { INITIAL_DELAY_MS, type TestSettings } from "./settings";
import type { Interaction } from "./types";

interface TestFlowProps {
  imageIds: string[];
  assetBaseUrl: string;
  settings: TestSettings;
  onFinished: (interactions: Interaction[]) => void;
}

/**
 * Runs the image sequence: a 1.5s blank, then one TestStep per image, remounted
 * per step so each starts locked, with a fresh mask order each time. Ported
 * from the app's TestFlow.
 */
export default function TestFlow({ imageIds, assetBaseUrl, settings, onFinished }: TestFlowProps) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const interactions = useRef<Interaction[]>([]);
  const stepRef = useRef<TestStepHandle>(null);
  const onFinishedRef = useRef(onFinished);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    const timer = window.setTimeout(() => setStarted(true), INITIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // A new mask order for every step.
  const drawMasks = useCallback(() => maskSequence().map((id) => maskUrl(assetBaseUrl, id)), [assetBaseUrl]);
  const [maskUrls, setMaskUrls] = useState(drawMasks);

  const handleStepComplete = useCallback(
    (interaction: Interaction) => {
      interactions.current.push(interaction);
      if (step < imageIds.length - 1) {
        setStep(step + 1);
        setMaskUrls(drawMasks());
      } else {
        onFinishedRef.current(interactions.current);
      }
    },
    [step, imageIds.length, drawMasks],
  );

  const handleTap = useCallback(
    (side: "left" | "right", time: number) => stepRef.current?.tap(side, time) ?? false,
    [],
  );

  return (
    <TestContainer onTap={handleTap}>
      {started && (
        <TestStep
          key={step}
          ref={stepRef}
          stepOrder={step + 1}
          totalSteps={imageIds.length}
          imageId={imageIds[step]}
          imageSrc={imageUrl(assetBaseUrl, imageIds[step])}
          maskUrls={maskUrls}
          settings={settings}
          onStepComplete={handleStepComplete}
        />
      )}
    </TestContainer>
  );
}
