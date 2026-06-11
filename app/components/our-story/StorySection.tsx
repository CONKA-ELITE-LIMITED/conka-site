"use client";

import { useRef } from "react";
import Image from "next/image";
import { StoryChapter, testedEnvironments } from "@/app/lib/storyData";
import { gsap, useGSAP, withMotion, revealUp } from "@/app/lib/motion";
import { countUpStat } from "./storyMotion";

/* ============================================================================
 * StorySection — one chapter beat of /our-story.
 *
 * Each beat: mono chapter label with a drawn hairline, punchy headline,
 * 1-2 sentences of prose, full-bleed image (mobile), and either a founder
 * pull quote or a count-up stat block. Chapter 5 adds a scrolling marquee of
 * the environments that tested CONKA.
 *
 * Motion: the image wipes in via clip-path (direction alternates with the
 * chapter side) and drifts on a subtle parallax; copy rises in with the
 * house revealUp; numeric stats count up. All gated behind
 * prefers-reduced-motion; SSR carries the final state.
 *
 * Mobile-first single component: image leads on mobile, alternates
 * left/right on desktop.
 * ========================================================================== */

interface StorySectionProps {
  chapter: StoryChapter;
  totalChapters: number;
}

/* Scrolling navy team strip — same marquee grammar as the athlete carousel's
   sport strip. Renders the list twice and translates -50% for a seamless loop. */
function TeamMarquee() {
  return (
    <div className="relative overflow-hidden bg-[#1B2757] py-3 mt-8 -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full">
      <span className="sr-only">
        CONKA has been tested across: {testedEnvironments.join(", ")}.
      </span>
      <div
        className="inline-flex whitespace-nowrap [will-change:transform] motion-safe:animate-[marquee_60s_linear_infinite]"
        aria-hidden="true"
      >
        {[...testedEnvironments, ...testedEnvironments].map((team, i) => (
          <span
            key={`${team}-${i}`}
            className="inline-flex items-center text-[12px] uppercase tracking-[0.18em] font-semibold text-white"
          >
            <span>{team}</span>
            <span className="mx-5 text-white" aria-hidden="true">
              ★
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function StorySection({ chapter, totalChapters }: StorySectionProps) {
  const root = useRef<HTMLDivElement>(null);
  const formattedId = chapter.id.toString().padStart(2, "0");
  const formattedTotal = totalChapters.toString().padStart(2, "0");
  const isEven = chapter.id % 2 === 0;

  useGSAP(
    () => {
      withMotion(() => {
        // Image wipes in from the side it sits on (desktop), top on mobile
        gsap.from("[data-chapter-frame]", {
          clipPath: isEven
            ? "inset(0% 0% 0% 100%)"
            : "inset(0% 100% 0% 0%)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: "[data-chapter-frame]", start: "top 75%" },
        });

        // Subtle parallax drift inside the frame
        gsap.set("[data-chapter-parallax]", { scale: 1.08 });
        gsap.fromTo(
          "[data-chapter-parallax]",
          { yPercent: -3.5 },
          {
            yPercent: 3.5,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-chapter-frame]",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // Hairline next to the chapter label draws in
        gsap.from("[data-chapter-rule]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        revealUp("[data-chapter-reveal]", root.current);

        const statEl =
          root.current?.querySelector<HTMLElement>("[data-chapter-stat]");
        if (statEl && chapter.stat) {
          countUpStat(statEl, chapter.stat.value);
        }
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-section-id={chapter.id}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-20">
        {/* Image — full-bleed on mobile, alternating side on desktop */}
        <div
          className={`w-full lg:flex-1 order-1 ${
            isEven ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <div
            data-chapter-frame
            className="relative aspect-[4/3] lg:aspect-auto lg:h-[480px] overflow-hidden -mx-5 w-[calc(100%+2.5rem)] md:mx-0 md:w-full border-y md:border border-black/12 bg-white"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
          >
            <div
              data-chapter-parallax
              className={`absolute inset-0 ${
                chapter.imageFit === "contain" ? "p-6" : ""
              }`}
            >
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={
                  chapter.imageFit === "contain"
                    ? "object-contain"
                    : "object-cover"
                }
                style={{
                  objectPosition: chapter.imagePosition ?? "center center",
                }}
              />
            </div>
            <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums z-10">
              Ch. {formattedId} / {formattedTotal}
            </span>
            <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums z-10">
              {chapter.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          className={`flex-1 flex flex-col justify-center order-2 ${
            isEven ? "lg:order-1" : "lg:order-2"
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 tabular-nums whitespace-nowrap">
              {`// Chapter ${formattedId} · ${chapter.label}`}
            </p>
            <span
              data-chapter-rule
              aria-hidden
              className="hidden md:block flex-1 h-px bg-black/15"
            />
          </div>

          <h2
            data-chapter-reveal
            className="brand-h2 text-black mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            {chapter.headline}
          </h2>

          <p
            data-chapter-reveal
            className="text-base lg:text-lg text-black/75 leading-relaxed"
            style={{ maxWidth: "var(--brand-body-max-width)" }}
          >
            {chapter.prose}
          </p>

          {/* Pull quote — founder voice */}
          {chapter.quote && (
            <blockquote
              data-chapter-reveal
              className="mt-6 lg:mt-8 border-l-2 border-[#1B2757] pl-5 lg:pl-6"
            >
              <p className="text-lg lg:text-xl font-medium text-black leading-snug mb-3">
                &ldquo;{chapter.quote.text}&rdquo;
              </p>
              <footer className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/55">
                <span className="text-[#1B2757]">{chapter.quote.author}</span>
                <span className="text-black/30">·</span>
                <span>{chapter.quote.role}</span>
              </footer>
            </blockquote>
          )}

          {/* Stat block — clinical proof, counts up on entry */}
          {chapter.stat && (
            <div
              data-chapter-reveal
              className="mt-6 lg:mt-8 flex items-baseline gap-4 border-t border-black/10 pt-5"
            >
              <p
                data-chapter-stat
                className="font-mono text-4xl lg:text-5xl font-bold tabular-nums text-[#1B2757] leading-none shrink-0"
              >
                {chapter.stat.value}
              </p>
              <p className="text-sm text-black/65 leading-snug max-w-[36ch]">
                {chapter.stat.caption}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chapter 5: team marquee under the full beat */}
      {chapter.teamMarquee && <TeamMarquee />}
    </div>
  );
}

export default StorySection;
