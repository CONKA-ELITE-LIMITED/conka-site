"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import BlankScreen from "./BlankScreen";
import DynamicMask from "./DynamicMask";
import ProgressRing from "./ProgressRing";
import TestImage from "./TestImage";
import type { TestSettings } from "./settings";
import { now, reactionTimeMs } from "./timing";
import type { Interaction, Side } from "./types";

/**
 * One image, start to finish. Ported from the app's TestStep:
 *
 *   image (110ms) -> preMaskBlank (20ms) -> dynamicMask (230ms)
 *     -> postMaskBlank (750ms) -> blank "Be Quick" (2000ms)
 *     -> progress (40ms) -> postProgressBlank (750ms) -> next step
 *
 * Taps are locked until the image hides. The first tap after that locks again,
 * records the side and time, and jumps straight to progress. No tap by the end
 * of the blank screen records "none" with a reaction time of 0.
 *
 * The app also has a fixation phase, but its image shows as soon as it has
 * loaded, which pre-empts the fixation timer, so there is no fixation delay in
 * practice. This port reproduces that behaviour and leaves the dead timer out.
 * Remounted per step by the parent (key), so every step starts locked.
 */

type Phase =
  | "image"
  | "preMaskBlank"
  | "dynamicMask"
  | "postMaskBlank"
  | "blank"
  | "progress"
  | "postProgressBlank";

const ANSWERABLE: ReadonlySet<Phase> = new Set(["preMaskBlank", "dynamicMask", "postMaskBlank", "blank"]);

export interface TestStepHandle {
  /** Returns true when the tap was accepted (the caller flashes the side). */
  tap: (side: Exclude<Side, "none">, time: number) => boolean;
}

interface TestStepProps {
  stepOrder: number;
  totalSteps: number;
  imageId: string;
  imageSrc: string;
  maskUrls: string[];
  settings: TestSettings;
  onStepComplete: (interaction: Interaction) => void;
}

const TestStep = forwardRef<TestStepHandle, TestStepProps>(function TestStep(
  { stepOrder, totalSteps, imageId, imageSrc, maskUrls, settings, onStepComplete },
  ref,
) {
  const [phase, setPhaseState] = useState<Phase>("image");
  const phaseRef = useRef<Phase>("image");
  const lockedRef = useRef(true);
  const timing = useRef({
    displayStart: null as number | null,
    displayEnd: null as number | null,
    tapTime: null as number | null,
    side: "none" as Side,
  });
  const interactionRef = useRef<Interaction | null>(null);
  const onCompleteRef = useRef(onStepComplete);

  useEffect(() => {
    onCompleteRef.current = onStepComplete;
  }, [onStepComplete]);

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const handleDisplayStart = useCallback((time: number) => {
    timing.current.displayStart = time;
  }, []);

  const handleDisplayEnd = useCallback(
    (time: number) => {
      timing.current.displayEnd = time;
      lockedRef.current = false;
      setPhase("preMaskBlank");
    },
    [setPhase],
  );

  useImperativeHandle(
    ref,
    () => ({
      tap(side, time) {
        if (lockedRef.current || !ANSWERABLE.has(phaseRef.current)) return false;
        lockedRef.current = true;
        timing.current.tapTime = time;
        timing.current.side = side;
        setPhase("progress");
        return true;
      },
    }),
    [setPhase],
  );

  useEffect(() => {
    let timer = 0;
    let frame = 0;
    switch (phase) {
      case "preMaskBlank":
        timer = window.setTimeout(() => setPhase("dynamicMask"), settings.preDynamicMaskBlankTiming);
        break;
      case "dynamicMask":
        timer = window.setTimeout(() => setPhase("postMaskBlank"), settings.dynamicMaskTiming);
        break;
      case "postMaskBlank":
        timer = window.setTimeout(() => setPhase("blank"), settings.postDynamicMaskBlankTiming);
        break;
      case "blank":
        // As the app: when the blink ends, the next frame records no answer.
        timer = window.setTimeout(() => {
          frame = requestAnimationFrame(() => {
            if (phaseRef.current !== "blank") return;
            lockedRef.current = true;
            timing.current.tapTime = now();
            timing.current.side = "none";
            setPhase("progress");
          });
        }, settings.blankScreenTiming);
        break;
      case "progress": {
        if (!interactionRef.current) {
          const t = timing.current;
          interactionRef.current = {
            stepOrder,
            imageId,
            sideSelected: t.side,
            reactionTimeMs: t.side === "none" ? 0 : reactionTimeMs(t.tapTime, t.displayEnd),
          };
        }
        timer = window.setTimeout(() => setPhase("postProgressBlank"), settings.progressBarTiming);
        break;
      }
      case "postProgressBlank":
        timer = window.setTimeout(() => {
          if (interactionRef.current) onCompleteRef.current(interactionRef.current);
        }, settings.postDynamicMaskBlankTiming);
        break;
    }
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [phase, settings, setPhase, stepOrder, imageId]);

  const showImage = phase !== "progress" && phase !== "postProgressBlank";

  return (
    <>
      {showImage && (
        <TestImage
          src={imageSrc}
          displayDuration={settings.imageDisplayTiming}
          onDisplayStart={handleDisplayStart}
          onDisplayEnd={handleDisplayEnd}
        />
      )}
      {phase === "dynamicMask" && (
        <DynamicMask
          maskUrls={maskUrls}
          sequenceTiming={settings.dynamicMaskTiming}
          maskCount={settings.maskImagesCount}
        />
      )}
      {phase === "blank" && <BlankScreen duration={settings.blankScreenTiming} />}
      {phase === "progress" && <ProgressRing progress={stepOrder / totalSteps} />}
    </>
  );
});

export default TestStep;
