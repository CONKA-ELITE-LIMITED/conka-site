"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsapClient";

const HEADLINE_WORDS = "You cannot improve what you cannot measure.".split(" ");

const PARAGRAPHS = [
  "Repeated concussions cut Humphrey Bodington's playing path short. Headaches, light sensitivity, recovery that never quite held, and no clear answer.",
  "During recovery he had fMRI and EEG scans in a Neuro Lab. For the first time he could see his brain measured, not guessed at. That became CONKA: an app that gives everyone the same ability to see it. A number you can watch move.",
];

/**
 * Why / origin section for /appv2. Same copy and asset as AppOrigin, with a
 * scroll-scrubbed word reveal on the headline (each word brightens as you
 * scroll) and a clip-path reveal on the founders photo. Content-only; the
 * page owns the section wrapper.
 */
export default function AppV2Origin() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-origin-word]",
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-origin-heading]",
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            },
          },
        );

        gsap.from("[data-origin-para]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-origin-copy]", start: "top 75%" },
        });

        gsap.from("[data-origin-image]", {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.1,
          ease: "power4.inOut",
          scrollTrigger: { trigger: "[data-origin-image]", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="flex flex-col lg:flex-row lg:items-center lg:gap-16"
    >
      {/* Asset — leads on desktop, sits below the copy on mobile */}
      <div className="relative order-2 lg:order-1 w-full mt-10 lg:mt-0 lg:flex-1">
        <div
          data-origin-image
          className="relative aspect-square w-full max-w-[500px] mx-auto lg:mx-0 border border-white/12 bg-white/[0.03] overflow-hidden"
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
          <Image
            src="/TwoFounders.jpg"
            alt="CONKA founders Harry Glover and Humphrey Bodington"
            fill
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover object-center"
          />
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/90 bg-black/55 px-2 py-1 tabular-nums">
            Fig. 02 · Where it started
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="order-1 lg:order-2 lg:flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4">
          {"// Why we built it · APP-02"}
        </p>
        <h2
          data-origin-heading
          className="brand-h2 text-white mb-6 max-w-[18ch]"
          style={{ letterSpacing: "-0.02em" }}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span key={i}>
              <span data-origin-word className="inline-block">
                {word}
              </span>{" "}
            </span>
          ))}
        </h2>
        <div
          data-origin-copy
          className="space-y-4 text-base md:text-lg text-white/85 leading-relaxed max-w-xl"
        >
          {PARAGRAPHS.map((para, i) => (
            <p key={i} data-origin-para>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
