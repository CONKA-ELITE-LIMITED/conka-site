"use client";

import { useState, useCallback } from "react";
import useIsMobile from "@/app/hooks/useIsMobile";
import { AppInstallButtons } from "@/app/components/AppInstallButtons";

type Feature = {
  id: string;
  label: string;
  screen: string;
  heading: string;
  body: string;
};

const FEATURES: Feature[] = [
  {
    id: "score",
    label: "Your Score",
    screen: "/app/AppConkaRing.png",
    heading: "Your cognitive score. Live.",
    body: "This isn't an IQ test. It measures how efficiently your brain processes information, tracked over time. We hand you the instrument to see CONKA working for yourself.",
  },
  {
    id: "test",
    label: "The Test",
    screen: "/app/AppTestAnimal.png",
    heading: "A test your brain cannot game.",
    body: "Built on Cambridge-derived visual recognition. Because it uses natural images, your brain can't learn or memorise the answers. Your score only improves if your brain actually improves.",
  },
  {
    id: "compete",
    label: "Compete",
    screen: "/app/AppLeaderboard.png",
    heading: "Rank against professional athletes. Globally.",
    body: "Football, F1, rugby, ultra running: one leaderboard. Challenge anyone, track trends, prove it.",
  },
  {
    id: "rewards",
    label: "Rewards",
    screen: "/app/AppRewards.png",
    heading: "Earn tokens. Unlock exclusive merch.",
    body: "Subscribers earn +10 tokens every time they complete a cognitive test. Tier up at 30 tests in 30 days.",
  },
];

function useFeatureState() {
  const [activeId, setActiveId] = useState(FEATURES[0].id);
  const [contentVisible, setContentVisible] = useState(true);

  const handleSelect = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setContentVisible(false);
      setTimeout(() => {
        setActiveId(id);
        setContentVisible(true);
      }, 160);
    },
    [activeId]
  );

  const activeFeature = FEATURES.find((f) => f.id === activeId)!;
  return { activeId, contentVisible, handleSelect, activeFeature };
}

// ─── Phone display ────────────────────────────────────────────────────────────

function PhoneDisplay({
  activeId,
  className = "",
}: {
  activeId: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: "4/5" }}
    >
      {FEATURES.map((f) => (
        <img
          key={f.id}
          src={f.screen}
          alt={f.label}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: activeId === f.id ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Tab button ───────────────────────────────────────────────────────────────

function FeatureTab({
  feature,
  isActive,
  onClick,
  size = "default",
}: {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
  size?: "default" | "compact";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border font-mono uppercase leading-none transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 min-h-[44px] ${
        size === "compact"
          ? "px-2 py-3 text-[9px] tracking-[0.1em]"
          : "px-5 py-3 text-[11px] tracking-[0.14em]"
      } ${
        isActive
          ? "bg-white text-black border-white"
          : "bg-white/[0.07] border-white/30 text-white/70 hover:bg-white/[0.12] hover:border-white/50 hover:text-white/90"
      }`}
    >
      {feature.label}
    </button>
  );
}

// ─── Content reveal ───────────────────────────────────────────────────────────

function ContentReveal({
  feature,
  visible,
}: {
  feature: Feature;
  visible: boolean;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
      }}
    >
      <h3
        className="text-lg font-medium text-white mb-2 leading-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        {feature.heading}
      </h3>
      <p className="text-sm text-white/85 leading-relaxed">{feature.body}</p>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────────────────────────

function AppFeaturePanelDesktop() {
  const { activeId, contentVisible, handleSelect, activeFeature } =
    useFeatureState();

  return (
    <div className="w-full pt-10 lg:pt-16">
      <div className="mx-auto flex flex-col items-center" style={{ maxWidth: "1280px" }}>
        <h1
          className="brand-h2 text-white text-center mb-10"
          style={{ letterSpacing: "-0.02em" }}
        >
          The Gold Standard of Cognitive Testing
        </h1>

        <div className="flex items-start gap-12 lg:gap-20">
          {/* Left column — button stack */}
          <div className="flex flex-col gap-2 w-44 lg:w-56 flex-shrink-0 pt-4">
            {FEATURES.map((f) => (
              <FeatureTab
                key={f.id}
                feature={f}
                isActive={activeId === f.id}
                onClick={() => handleSelect(f.id)}
                size="default"
              />
            ))}
          </div>

          {/* Right column — phone + description */}
          <div className="flex-shrink-0" style={{ width: "clamp(280px, 28vw, 420px)" }}>
            <PhoneDisplay activeId={activeId} />
            <div className="mt-6 max-w-[38ch]">
              <ContentReveal feature={activeFeature} visible={contentVisible} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <AppInstallButtons variant="clinical-dark" className="justify-center" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums">
            Free to use
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile layout ────────────────────────────────────────────────────────────

function AppFeaturePanelMobile() {
  const { activeId, contentVisible, handleSelect, activeFeature } =
    useFeatureState();

  return (
    <div className="pt-8">
      <h1
        className="brand-h2 text-white mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        The Gold Standard of Cognitive Testing
      </h1>

      {/* Two-column: compact buttons left, phone right */}
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-2 w-28 flex-shrink-0">
          {FEATURES.map((f) => (
            <FeatureTab
              key={f.id}
              feature={f}
              isActive={activeId === f.id}
              onClick={() => handleSelect(f.id)}
              size="compact"
            />
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <PhoneDisplay activeId={activeId} />
        </div>
      </div>

      {/* Description below the two-column block */}
      <div className="mt-6">
        <ContentReveal feature={activeFeature} visible={contentVisible} />
      </div>

      <div className="mt-8">
        <AppInstallButtons variant="clinical-dark" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65 tabular-nums mt-3">
          Free to use
        </p>
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function AppFeaturePanel() {
  const isMobile = useIsMobile(1024);

  return isMobile === true ? <AppFeaturePanelMobile /> : <AppFeaturePanelDesktop />;
}

export default AppFeaturePanel;
