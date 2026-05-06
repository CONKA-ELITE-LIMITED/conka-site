"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface FoundingMemberCounterProps {
  /** Show full text or just number */
  variant?: "full" | "number-only";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Background context for color selection */
  background?: "light" | "dark";
}

export default function FoundingMemberCounter({
  variant = "full",
  size = "md",
  background = "light",
}: FoundingMemberCounterProps) {
  // Fetch from Convex instead of hardcoded
  const counter = useQuery(api.foundingMemberCounter.getCounter);
  const spotsRemaining = counter?.spotsRemaining ?? 492; // Fallback to 492
  const isUrgent = spotsRemaining <= 50;

  // Size classes
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl lg:text-5xl",
  };

  // Color based on background and urgency
  const urgencyColor = isUrgent
    ? "text-amber-500"
    : background === "dark"
      ? "text-white"
      : "text-black";

  if (variant === "number-only") {
    return (
      <span
        className={`font-mono font-bold ${sizeClasses[size]} ${urgencyColor}`}
      >
        {spotsRemaining.toLocaleString()}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-center md:items-start">
      <span
        className={`font-mono font-bold ${sizeClasses[size]} ${urgencyColor}`}
      >
        {spotsRemaining.toLocaleString()}
      </span>
      <span className="font-mono text-xs md:text-sm opacity-70 mt-0.5">
        spots remaining
      </span>
    </div>
  );
}
