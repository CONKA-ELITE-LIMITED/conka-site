"use client";

import { useState } from "react";
import { copyToClipboard } from "@/app/lib/clipboard";
import type { BannerConfig } from "./types";

interface BannerMobileProps {
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
    <span className={`${className} leading-none`}>
      {segments.map((segment, i) => (
        <span
          key={i}
          className={`${segment.bold ? "font-bold" : ""} ${
            segment.isCode
              ? "mx-1 px-1.5 py-0.5 bg-white/20 rounded font-mono tracking-wider"
              : ""
          } ${segment.urgent ? "text-red-500" : ""}`}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}

export default function BannerMobile({ config }: BannerMobileProps) {
  const mobileContent = config.content.mobileContent || config.content;
  const mobileSecondaryText =
    mobileContent.secondaryText || config.content.secondaryText;
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
      <div className="px-4 py-3 flex items-center min-h-[48px]">
        {config.variant === "marquee" ? (
          <>
            <div className="flex-1 overflow-hidden relative min-w-0">
              <div className="marquee flex items-center gap-4">
                {/* Duplicate content for seamless loop */}
                {renderTextSegments(
                  [
                    ...mobileContent.text,
                    ...(mobileSecondaryText || []).map((seg) => ({
                      ...seg,
                      text: ` • ${seg.text}`,
                    })),
                  ],
                  "font-mono text-xs whitespace-nowrap text-white",
                )}
                {renderTextSegments(
                  [
                    ...mobileContent.text,
                    ...(mobileSecondaryText || []).map((seg) => ({
                      ...seg,
                      text: ` • ${seg.text}`,
                    })),
                  ],
                  "font-mono text-xs whitespace-nowrap text-white",
                )}
              </div>
            </div>
            {config.content.button &&
              (config.content.button.copyText ? (
                <button
                  onClick={handleButtonClick}
                  className="ml-4 px-2.5 py-1 font-semibold text-xs whitespace-nowrap text-white border-2 border-transparent hover:opacity-90 transition-all rounded-full flex-shrink-0 flex items-center justify-center gap-1.5"
                  style={{ background: "var(--color-neuro-blue-end)" }}
                >
                  {copied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
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
                        width="12"
                        height="12"
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
                  className="ml-4 px-3 py-1.5 font-semibold text-xs whitespace-nowrap border-2 border-white text-white hover:bg-white hover:text-black transition-all rounded-full flex-shrink-0 flex items-center justify-center"
                >
                  {config.content.button.text}
                </a>
              ))}
          </>
        ) : (
          <>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                {renderTextSegments(
                  mobileContent.text,
                  "font-mono text-xs text-white",
                )}
              </div>
              {mobileSecondaryText && (
                <div className="flex items-center gap-2 mt-0.5">
                  {renderTextSegments(
                    mobileSecondaryText,
                    "font-mono text-xs text-white opacity-80",
                  )}
                </div>
              )}
              {config.content.button &&
                (config.content.button.copyText ? (
                  <button
                    onClick={handleButtonClick}
                    className="inline-block mt-1 px-3 py-1 text-xs font-semibold text-white border-2 border-transparent hover:opacity-90 transition-all rounded-full"
                  style={{ background: "var(--color-neuro-blue-end)" }}
                  >
                    {copied ? "Copied!" : config.content.button.text}
                  </button>
                ) : (
                  <a
                    href={config.content.button.href}
                    onClick={config.content.button.onClick}
                    className="inline-block mt-1 text-xs underline text-white opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {config.content.button.text}
                  </a>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
