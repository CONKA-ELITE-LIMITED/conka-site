"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "./gsapClient";

/**
 * Retention features for /app: Compete and Rewards. Sits directly after the
 * test journey so the app's features cluster before the try-it moment.
 * Side-by-side cards on all breakpoints. Content-only; the page owns the
 * section wrapper.
 */

const PERKS = [
  {
    label: "Compete",
    screen: "/app/AppLeaderboard.png",
    heading: "Rank against professional athletes. Globally.",
    body: "Football, F1, rugby, ultra running: one leaderboard. Challenge anyone, track trends, prove it.",
    fig: "Fig. 06 · Leaderboard",
    alt: "CONKA app leaderboard screen ranking users globally",
  },
  {
    label: "Rewards",
    screen: "/app/AppRewards.png",
    heading: "Earn tokens. Unlock exclusive merch.",
    body: "Subscribers earn +10 tokens every time they complete a cognitive test. Tier up at 30 tests in 30 days.",
    fig: "Fig. 07 · Rewards",
    alt: "CONKA app rewards screen showing tokens and merch tiers",
  },
];

export default function AppV2BeyondTest() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-beyond-reveal]", {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <p
        data-beyond-reveal
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55 tabular-nums mb-4"
      >
        {"// Beyond the test · APP-05"}
      </p>
      <h2
        data-beyond-reveal
        className="brand-h2 text-white mb-10"
        style={{ letterSpacing: "-0.02em" }}
      >
        A test you&apos;ll actually keep taking.
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:gap-8">
        {PERKS.map((perk) => (
          <div
            key={perk.label}
            data-beyond-reveal
            className="border border-white/20 bg-white/[0.08] flex flex-col"
          >
            <div className="relative aspect-[4/5] w-full bg-[#f5f5f5] overflow-hidden">
              <div className="absolute top-2 left-2 lg:top-3 lg:left-3 font-mono text-[8px] lg:text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums z-10">
                {perk.fig}
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-[10%] w-[62%] aspect-[1/2]">
                <Image
                  src={perk.screen}
                  alt={perk.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 45vw, 400px"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="p-4 lg:p-6">
              <h3
                className="text-base lg:text-xl font-medium text-white leading-tight mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                {perk.heading}
              </h3>
              <p className="text-sm lg:text-base text-white/85 leading-relaxed">
                {perk.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
