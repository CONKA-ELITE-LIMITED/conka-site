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
  size = "desktop",
}: {
  activeId: string;
  size?: "desktop" | "mobile";
}) {
  const width =
    size === "mobile"
      ? "clamp(220px, 72vw, 320px)"
      : "clamp(300px, 32vw, 460px)";

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width, aspectRatio: "4/5" }}
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
}: {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 border font-mono text-[11px] uppercase tracking-[0.14em] leading-none transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 min-h-[44px] ${
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
  align = "center",
}: {
  feature: Feature;
  visible: boolean;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`max-w-[36ch] ${align === "center" ? "text-center mx-auto" : "text-left"}`}
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
      <p className="text-sm text-white/55 leading-relaxed">{feature.body}</p>
    </div>
  );
}

// ─── Desktop layout ───────────────────────────────────────────────────────────

function AppFeaturePanelDesktop() {
  const { activeId, contentVisible, handleSelect, activeFeature } =
    useFeatureState();

  return (
    <div className="w-full pt-10 lg:pt-16">
      <div
        className="mx-auto flex flex-col items-center"
        style={{ maxWidth: "1280px" }}
      >
        <h1
          className="brand-h1 text-white text-center mb-10"
          style={{ letterSpacing: "-0.02em" }}
        >
          The Gold Standard of Cognitive Testing
        </h1>

        <div
          className="flex flex-col items-center"
          style={{ width: "clamp(320px, 34vw, 500px)" }}
        >
          <PhoneDisplay activeId={activeId} size="desktop" />

          <div className="flex flex-wrap gap-2 justify-center mt-6 w-full">
            {FEATURES.map((f) => (
              <FeatureTab
                key={f.id}
                feature={f}
                isActive={activeId === f.id}
                onClick={() => handleSelect(f.id)}
              />
            ))}
          </div>

          <div className="mt-6 w-full">
            <ContentReveal
              feature={activeFeature}
              visible={contentVisible}
              align="center"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <AppInstallButtons variant="clinical-dark" className="justify-center" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 tabular-nums">
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
        className="brand-h1 text-white mb-8"
        style={{ letterSpacing: "-0.02em" }}
      >
        The Gold Standard of Cognitive Testing
      </h1>

      <div className="flex justify-center mb-8">
        <PhoneDisplay activeId={activeId} size="mobile" />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {FEATURES.map((f) => (
          <FeatureTab
            key={f.id}
            feature={f}
            isActive={activeId === f.id}
            onClick={() => handleSelect(f.id)}
          />
        ))}
      </div>

      <ContentReveal
        feature={activeFeature}
        visible={contentVisible}
        align="left"
      />

      <div className="mt-8">
        <AppInstallButtons variant="clinical-dark" />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 tabular-nums mt-3">
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
