"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import useIsMobile from "@/app/hooks/useIsMobile";
import {
  SECTIONS_DATA,
  PHONE_SOURCES,
  SECTION_TAB_LABELS,
  PHONE_ALT_LABELS,
} from "@/app/components/app/appStickyPhoneBlockData";
import { gsap, ScrollTrigger, useGSAP } from "./gsapClient";

/**
 * "How it works" journey for /appv2. Merges the AppStickyPhoneBlock mechanism
 * story with the AppFeaturePanel "Gold Standard" credibility beat into one
 * section (PAGE_NARRATIVES backlog #1). Desktop: a GSAP-pinned viewport where
 * scroll scrubs through the three beats, swapping phone screens and copy.
 * Mobile and reduced-motion: a stacked layout with simple entrance reveals.
 *
 * Structural exception: owns its own <section> because ScrollTrigger pinning
 * needs control of the wrapper (same pattern as AppStickyPhoneBlock).
 */

const KICKER = "// How it works · APP-03";
const HEADING = "The Gold Standard of Cognitive Testing";
const SUPPORT = "Cambridge-derived. NHS-validated. FDA-cleared.";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// ─── Shared heading row ────────────────────────────────────────────────────────

function JourneyHeading() {
  return (
    <div className="mb-10 lg:mb-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4">
        {KICKER}
      </p>
      <h2
        className="brand-h2 text-white mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        {HEADING}
      </h2>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70 tabular-nums">
        {SUPPORT}
      </p>
    </div>
  );
}

// ─── Phone frame (shared) ──────────────────────────────────────────────────────

function PhoneFrame({
  activeIndex,
  fade = true,
}: {
  activeIndex: number;
  fade?: boolean;
}) {
  return (
    <div className="relative aspect-[4/5] w-full max-w-[440px] mx-auto border border-black/12 bg-[#f5f5f5] overflow-hidden">
      {PHONE_SOURCES.map((src, i) => (
        <div
          key={src}
          className="absolute left-1/2 -translate-x-1/2 top-[8%] w-[58%] aspect-[1/2]"
          style={
            fade
              ? {
                  opacity: activeIndex === i ? 1 : 0,
                  transform: `translate(-50%, ${activeIndex === i ? 0 : 12}px)`,
                  transition: "opacity 0.45s ease, transform 0.45s ease",
                }
              : { opacity: activeIndex === i ? 1 : 0 }
          }
        >
          <Image
            src={src}
            alt={PHONE_ALT_LABELS[i]}
            fill
            sizes="(max-width: 1024px) 60vw, 280px"
            className="object-contain"
          />
        </div>
      ))}
      <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
        {String(activeIndex + 1).padStart(2, "0")} / 03
      </div>
    </div>
  );
}

// ─── Desktop: pinned scrub journey ────────────────────────────────────────────

function JourneyDesktop() {
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      stRef.current = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=250%",
        pin: true,
        onUpdate: (self) => {
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${self.progress})`;
          }
          const idx = Math.min(
            SECTIONS_DATA.length - 1,
            Math.floor(self.progress * SECTIONS_DATA.length),
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
      return () => {
        stRef.current = null;
      };
    },
    { scope: root },
  );

  const goTo = (i: number) => {
    const st = stRef.current;
    if (st) {
      const target =
        st.start + ((st.end - st.start) * (i + 0.5)) / SECTIONS_DATA.length;
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      activeRef.current = i;
      setActive(i);
    }
  };

  return (
    <div ref={root}>
      <div
        ref={pinRef}
        className="h-screen flex flex-col justify-center"
      >
        <div className="brand-track w-full">
          <JourneyHeading />

          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Copy — slides stacked in one grid cell, active one visible */}
            <div>
              <div className="grid">
                {SECTIONS_DATA.map((section, i) => (
                  <div
                    key={section.heading}
                    className="col-start-1 row-start-1"
                    style={{
                      opacity: active === i ? 1 : 0,
                      transform:
                        active === i ? "translateY(0)" : "translateY(14px)",
                      transition: "opacity 0.45s ease, transform 0.45s ease",
                      pointerEvents: active === i ? "auto" : "none",
                    }}
                    aria-hidden={active !== i}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4">
                      {SECTION_TAB_LABELS[i]}
                    </p>
                    <h3
                      className="text-2xl lg:text-3xl font-medium text-white leading-tight mb-4"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {section.heading}
                    </h3>
                    <p className="text-base lg:text-lg text-white/85 leading-relaxed max-w-[48ch]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Beat tabs — click to scrub there */}
              <div className="flex gap-2 mt-10">
                {SECTION_TAB_LABELS.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-pressed={active === i}
                    className={`border font-mono uppercase leading-none px-4 py-3 text-[10px] tracking-[0.12em] min-h-[44px] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                      active === i
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.07] border-white/30 text-white/70 hover:bg-white/[0.12] hover:border-white/50 hover:text-white/90"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Scrub progress bar */}
              <div className="mt-6 h-px w-full max-w-[320px] bg-white/15">
                <div
                  ref={barRef}
                  className="h-full w-full origin-left bg-white"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            </div>

            {/* Phone */}
            <PhoneFrame activeIndex={active} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile / reduced-motion: stacked beats ───────────────────────────────────

function JourneyStacked() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-journey-card]").forEach((el) => {
          gsap.from(el, {
            y: 32,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="brand-track">
      <JourneyHeading />

      <div className="space-y-12">
        {SECTIONS_DATA.map((section, i) => (
          <article key={section.heading} data-journey-card>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-3">
              {SECTION_TAB_LABELS[i]}
            </p>
            <h3
              className="text-xl font-medium text-white leading-tight mb-3"
              style={{ letterSpacing: "-0.02em" }}
            >
              {section.heading}
            </h3>
            <p className="text-base text-white/85 leading-relaxed mb-6">
              {section.body}
            </p>
            <div className="relative aspect-[4/5] w-full max-w-[360px] border border-black/12 bg-[#f5f5f5] overflow-hidden">
              <div className="absolute left-1/2 -translate-x-1/2 top-[8%] w-[58%] aspect-[1/2]">
                <Image
                  src={PHONE_SOURCES[i]}
                  alt={PHONE_ALT_LABELS[i]}
                  fill
                  sizes="60vw"
                  className="object-contain"
                />
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
                {String(i + 1).padStart(2, "0")} / 03
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function AppV2TestJourney() {
  const isMobile = useIsMobile(1024);
  const reduced = usePrefersReducedMotion();

  return (
    <section className="brand-section" aria-label="How the test works">
      {isMobile === undefined ? null : isMobile || reduced ? (
        <JourneyStacked />
      ) : (
        <JourneyDesktop />
      )}
    </section>
  );
}
