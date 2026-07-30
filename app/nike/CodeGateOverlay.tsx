"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, withMotion } from "@/app/lib/motion";

/* -------------------------------------------------------------------------- */
/*  Ceremonial entry gate for the Nike trial page.                            */
/*                                                                            */
/*  Not real auth: the code is a hardcoded, case-insensitive client check     */
/*  (the page is noindex and forwarded person-to-person, nothing precious).   */
/*  The point is the moment of arrival: logo, "Nike Trial", a live            */
/*  countdown to kickoff, a code, then a short processing beat before the     */
/*  page is revealed underneath.                                              */
/* -------------------------------------------------------------------------- */

// The access code. Not a secret; update here if the shared code changes.
const ACCESS_CODE = "CONKA2026";

// Kickoff datetime the countdown targets: Thursday 6 August 2026, 11:30am UK.
// Pinned to +01:00 (BST) so the countdown ends at 11:30 UK time for every
// viewer, regardless of their device timezone.
const KICKOFF = new Date("2026-08-06T11:30:00+01:00");

// Radial progress ring geometry (drawn in the processing beat).
const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia(REDUCED_MOTION).matches;

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function getRemaining(target: Date): Remaining {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const seconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: false,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/* -------------------------------------------------------------------------- */
/*  Countdown                                                                 */
/* -------------------------------------------------------------------------- */

function Countdown() {
  // Server render and first paint show a stable placeholder; the live values
  // only appear after mount, so server and client markup never disagree.
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(KICKOFF));
    const id = setInterval(() => setRemaining(getRemaining(KICKOFF)), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: { value: string; label: string }[] = [
    { value: remaining ? pad(remaining.days) : "--", label: "Days" },
    { value: remaining ? pad(remaining.hours) : "--", label: "Hrs" },
    { value: remaining ? pad(remaining.minutes) : "--", label: "Min" },
    { value: remaining ? pad(remaining.seconds) : "--", label: "Sec" },
  ];

  if (remaining?.done) {
    return (
      <p className="text-[15px] font-medium text-[#6E7CB0]">
        The trial is underway.
      </p>
    );
  }

  return (
    <div
      className="flex items-stretch justify-center gap-2 sm:gap-3"
      role="timer"
      aria-label="Time until kickoff"
    >
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex min-w-[62px] flex-col items-center rounded-lg border border-white/20 bg-black/50 px-3 py-3 sm:min-w-[74px] sm:py-4"
        >
          <span className="text-[26px] font-bold leading-none tabular-nums sm:text-[32px]">
            {cell.value}
          </span>
          <span className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white sm:text-[11px]">
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Processing beat (fake, adapted from CognitiveTestLoader)                   */
/* -------------------------------------------------------------------------- */

const PROCESSING_STAGES = [
  "Verifying access",
  "Preparing your trial",
  "Welcome to the team",
];

function Processing({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reduced motion: skip the bar, hold briefly on the final label, reveal.
    if (prefersReducedMotion()) {
      setProgress(100);
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const id = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(id);
          setTimeout(onDone, 450);
          return 100;
        }
        return next;
      });
    }, 2200 / 50);
    return () => clearInterval(id);
  }, [onDone]);

  const stage = progress < 40 ? 0 : progress < 80 ? 1 : 2;
  const isComplete = progress >= 100;
  // Radial progress ring (echoes the CONKA app's cognition ring). The stroke
  // is drawn as the fake check advances, then snaps to a tick on completion.
  const dashoffset = RING_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white">
        Cognition check
      </p>

      <div className="relative mt-6 h-[152px] w-[152px]">
        <svg viewBox="0 0 152 152" className="h-full w-full -rotate-90">
          <circle
            cx="76"
            cy="76"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth="4"
          />
          <circle
            cx="76"
            cy="76"
            r={RING_RADIUS}
            fill="none"
            stroke="#6E7CB0"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            className="transition-[stroke-dashoffset] duration-100 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6E7CB0"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span className="text-[30px] font-bold tabular-nums">
              {progress}
              <span className="text-[16px] text-white/80">%</span>
            </span>
          )}
        </div>
      </div>

      <p className="mt-7 text-[20px] font-semibold sm:text-[22px]">
        {PROCESSING_STAGES[stage]}.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Overlay                                                                    */
/* -------------------------------------------------------------------------- */

export default function CodeGateOverlay({ onUnlock }: { onUnlock: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [phase, setPhase] = useState<"entry" | "processing">("entry");

  // Staggered entrance for the lockup. Under reduced motion the from-tween
  // never runs, so the final state (already in the DOM) is what shows.
  useGSAP(
    () => {
      withMotion(() => {
        gsap.from("[data-gate-reveal]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.05,
        });
      });
    },
    { scope: root },
  );

  // Autofocus the code field on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Pin the overlay to the visual viewport. On iOS the software keyboard does
  // not resize the layout viewport, so a plain `fixed inset-0` overlay keeps
  // its `bottom: 0` below the keyboard and the page underneath peeks through.
  // Sizing to `visualViewport` (which shrinks with the keyboard) keeps the
  // overlay covering exactly what is on screen, with no gap to scroll into.
  useEffect(() => {
    const vv = window.visualViewport;
    const el = root.current;
    if (!vv || !el) return;
    const sync = () => {
      el.style.top = `${vv.offsetTop}px`;
      el.style.height = `${vv.height}px`;
      el.style.bottom = "auto";
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      el.style.top = "";
      el.style.height = "";
      el.style.bottom = "";
    };
  }, []);

  // Play the background scan only when motion is allowed; otherwise the poster
  // frame stands in (the video is rendered without an autoplay attribute).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    videoRef.current?.play().catch(() => {
      // Autoplay can be refused; the poster frame remains, which is fine.
    });
  }, []);

  const reveal = useCallback(() => {
    if (prefersReducedMotion() || !root.current) {
      onUnlock();
      return;
    }
    gsap.to(root.current, {
      autoAlpha: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: onUnlock,
    });
  }, [onUnlock]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (phase !== "entry") return;
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      setError(false);
      setPhase("processing");
      return;
    }
    // Wrong code: subtle shake + inline error, unlimited retries.
    setError(true);
    if (!prefersReducedMotion() && inputRef.current) {
      gsap.fromTo(
        inputRef.current,
        { x: -8 },
        {
          x: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.35)",
        },
      );
    }
    inputRef.current?.focus();
  };

  // Lightweight focus trap: keep Tab within the overlay while it is open.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !root.current) return;
    const focusables = root.current.querySelectorAll<HTMLElement>(
      'button, input, a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Nike Trial entry"
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[60] flex flex-col items-center overflow-y-auto bg-[#0a0a0a] px-6 py-10 text-white"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Crect x='11' y='11' width='2' height='2' fill='rgba(255%2C255%2C255%2C0.14)'/%3E%3C/svg%3E\")",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Full-bleed background scan (seamless boomerang). The poster shows
          first and under reduced motion; the scrim keeps the text legible. */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/nike/BothShotsScan-poster.jpg"
        aria-hidden
        className="fixed inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/nike/BothShotsScan.webm" type="video/webm" />
        <source src="/videos/nike/BothShotsScan.mp4" type="video/mp4" />
      </video>
      <div aria-hidden className="fixed inset-0 z-0 bg-black/55" />

      {phase === "processing" ? (
        <div className="relative z-10 my-auto flex w-full flex-col items-center">
          <Processing onDone={reveal} />
        </div>
      ) : (
        <div className="relative z-10 my-auto flex w-full max-w-[440px] flex-col items-center text-center">
          {/* Lockup: logo, then "Nike Trial" beneath it */}
          <Image
            src="/conka-logo.webp"
            alt="CONKA"
            width={440}
            height={112}
            priority
            data-gate-reveal
            className="h-7 w-auto brightness-0 invert sm:h-8"
          />
          <p
            data-gate-reveal
            className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white"
          >
            A mind-altering shot
          </p>
          <h1
            data-gate-reveal
            className="mt-4 text-[38px] font-bold leading-[1.05] sm:text-[52px]"
          >
            Nike Trial
          </h1>
          <p
            data-gate-reveal
            className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-white sm:text-[16px]"
          >
            A two-week performance hack. It begins Thursday 6 August.
          </p>

          {/* Countdown */}
          <div data-gate-reveal className="mt-9">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              Kickoff in
            </p>
            <Countdown />
          </div>

          {/* Code entry */}
          <form
            data-gate-reveal
            onSubmit={submit}
            className="mt-10 w-full max-w-[340px]"
          >
            <label
              htmlFor="access-code"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-white"
            >
              Enter your access code
            </label>
            <input
              ref={inputRef}
              id="access-code"
              name="access-code"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(false);
              }}
              aria-invalid={error}
              aria-describedby={error ? "access-error" : undefined}
              placeholder="ACCESS CODE"
              className={`min-h-[52px] w-full rounded-lg border bg-white/[0.04] px-4 text-center text-[16px] font-semibold uppercase tracking-[0.18em] text-white placeholder:tracking-[0.18em] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
                error
                  ? "border-[#fca5a5]/60 focus:ring-[#fca5a5]/60"
                  : "border-white/15 focus:ring-[#6E7CB0]"
              }`}
            />
            {error && (
              <p
                id="access-error"
                role="alert"
                className="mt-2 text-[13px] text-[#fca5a5]"
              >
                That code isn&rsquo;t right. Check it and try again.
              </p>
            )}
            <button
              type="submit"
              className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#1B2757] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#26356F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E7CB0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
            >
              Enter
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
