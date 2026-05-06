"use client";

import { PurchaseType } from "@/app/lib/productData";

interface PurchaseToggleProps {
  purchaseType: PurchaseType;
  onToggle: (type: PurchaseType) => void;
  highlightColor?: string;
  className?: string;
  allowStack?: boolean; // Allow buttons to stack vertically on smaller screens
  compact?: boolean; // Use smaller buttons when stacked
}

export default function PurchaseToggle({
  purchaseType,
  onToggle,
  highlightColor = "#AAB9BC",
  className = "",
  allowStack = false,
  compact = false,
}: PurchaseToggleProps) {
  // When in header, buttons need to adapt to header background
  const isInvert = highlightColor === "invert";
  const isWhiteHeader = isInvert && purchaseType === "one-time";
  
  // Button sizing - compact uses smaller buttons when stacked, normal when side-by-side
  const buttonSize = compact 
    ? "px-3 py-1 h-7 2xl:px-4 2xl:py-1.5 2xl:h-9" 
    : "px-4 py-1.5 h-9";
  const textSize = compact 
    ? "text-[10px] 2xl:text-xs" 
    : "text-xs";
  const badgeSize = compact
    ? "px-1 py-0.5 text-[9px] 2xl:px-1.5 2xl:text-xs"
    : "px-1.5 py-0.5 text-xs";
  
  return (
    <div className={`flex gap-1.5 2xl:gap-2 ${allowStack ? "flex-col items-end 2xl:flex-row 2xl:items-center" : "items-center"} ${className}`}>
      <button
        onClick={() => onToggle("subscription")}
        className={`${buttonSize} rounded-full border-2 transition-all flex items-center justify-center gap-1.5 ${
          purchaseType === "subscription"
            ? isWhiteHeader
              ? "bg-black text-white border-black"
              : "bg-white text-black border-white"
            : isWhiteHeader
            ? "bg-transparent border-black/50 text-black hover:bg-black/10"
            : "bg-transparent border-white/50 text-white hover:bg-white/20"
        }`}
      >
        <span className={`font-mono ${textSize} font-medium whitespace-nowrap`}>Subscribe</span>
        <span
          className={`${badgeSize} text-white font-mono rounded-full whitespace-nowrap flex-shrink-0`}
          style={{
            backgroundColor:
              purchaseType === "one-time"
                ? "black"
                : highlightColor === "invert"
                ? "#f59e0b"
                : highlightColor,
          }}
        >
          SAVE
        </span>
      </button>
      <button
        onClick={() => onToggle("one-time")}
        className={`${buttonSize} rounded-full border-2 transition-all flex items-center justify-center ${
          purchaseType === "one-time"
            ? isWhiteHeader
              ? "bg-black text-white border-black"
              : "bg-white text-black border-white"
            : isWhiteHeader
            ? "bg-transparent border-black/50 text-black hover:bg-black/10"
            : "bg-transparent border-white/50 text-white hover:bg-white/20"
        }`}
      >
        <span className={`font-mono ${textSize} font-medium whitespace-nowrap`}>One-Time</span>
      </button>
    </div>
  );
}

