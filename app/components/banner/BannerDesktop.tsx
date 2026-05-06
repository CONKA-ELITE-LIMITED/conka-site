"use client";

import { useState } from "react";
import { copyToClipboard } from "@/app/lib/clipboard";
import type { BannerConfig } from "./types";

interface BannerDesktopProps {
  /** Banner configuration */
  config: BannerConfig;
}

function renderTextSegments(
  segments: {
    text: string;
    bold?: boolean;
    isCode?: boolean;
    urgent?: boolean;
  }[],
  className: string,
) {
  return (
    <span className={`${className} flex items-center leading-none`}>
      {segments.map((segment, i) => (
        <span
          key={i}
          className={`${segment.bold ? "font-bold" : ""} ${
            segment.isCode
              ? "mx-1 px-2 py-0.5 bg-white/20 rounded font-mono tracking-wider"
              : ""
          } ${segment.urgent ? "text-red-500" : ""}`}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}

export default function BannerDesktop({ config }: BannerDesktopProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    if (!config.content.button?.copyText) return;

    const success = await copyToClipboard(config.content.button.copyText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleButtonClick = () => {
    if (config.content.button?.copyText) {
      handleCopyClick();
    } else if (config.content.button?.onClick) {
      config.content.button.onClick();
    }
  };

  return (
    <div
      className={`w-full ${config.styling.bgColor} ${config.styling.textColor} border-b-2 ${config.styling.borderColor || config.styling.bgColor}`}
    >
      <div className="px-6 md:px-16 py-3 md:py-3 flex items-center min-h-[48px]">
        {config.variant === "marquee" ? (
          <>
            <div className="flex-1 overflow-hidden relative min-w-0">
              <div className="marquee flex items-center gap-4">
                {/* Duplicate content for seamless loop */}
                {renderTextSegments(
                  [
                    ...config.content.text,
                    ...(config.content.secondaryText || []).map((seg) => ({
                      ...seg,
                      text: ` ${seg.text}`,
                    })),
                  ],
                  "font-mono text-xs md:text-sm whitespace-nowrap text-white",
                )}
                {renderTextSegments(
                  [
                    ...config.content.text,
                    ...(config.content.secondaryText || []).map((seg) => ({
                      ...seg,
                      text: ` ${seg.text}`,
                    })),
                  ],
                  "font-mono text-xs md:text-sm whitespace-nowrap text-white",
                )}
              </div>
            </div>
            {config.content.button &&
              (config.content.button.copyText ? (
                <button
                  onClick={handleButtonClick}
                  className="ml-6 px-3 py-1.5 md:px-4 md:py-2 font-semibold text-xs md:text-sm whitespace-nowrap text-white border-2 border-transparent hover:opacity-90 transition-all rounded-full flex-shrink-0 flex items-center justify-center gap-2"
                  style={{ background: "var(--color-neuro-blue-end)" }}
                >
                  {copied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {config.content.button.text}
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={config.content.button.href}
                  onClick={config.content.button.onClick}
                  className="ml-6 px-3 py-1.5 md:px-4 md:py-2 font-semibold text-xs md:text-sm whitespace-nowrap border-2 border-white text-white hover:bg-white hover:text-black transition-all rounded-full flex-shrink-0 flex items-center justify-center"
                >
                  {config.content.button.text}
                </a>
              ))}
          </>
        ) : (
          <>
            <div className="flex-1">
              {renderTextSegments(
                [
                  ...config.content.text,
                  ...(config.content.secondaryText || []).map((seg) => ({
                    ...seg,
                    text: ` ${seg.text}`,
                  })),
                ],
                "font-mono text-xs md:text-sm leading-none",
              )}
            </div>
            {config.content.button &&
              (config.content.button.copyText ? (
                <button
                  onClick={handleButtonClick}
                  className="ml-6 px-3 py-1.5 md:px-4 md:py-2 font-semibold text-xs md:text-sm whitespace-nowrap text-white border-2 border-transparent hover:opacity-90 transition-all rounded-full flex-shrink-0 flex items-center justify-center gap-2"
                  style={{ background: "var(--color-neuro-blue-end)" }}
                >
                  {copied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      {config.content.button.text}
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={config.content.button.href}
                  onClick={config.content.button.onClick}
                  className="ml-6 px-3 py-1.5 md:px-4 md:py-2 font-semibold text-xs md:text-sm whitespace-nowrap border-2 border-white text-white hover:bg-white hover:text-black transition-all rounded-full flex-shrink-0 flex items-center justify-center"
                >
                  {config.content.button.text}
                </a>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
