"use client";

interface AppInstallButtonsProps {
  className?: string;
  buttonClassName?: string;
  iconSize?: number;
  inverted?: boolean;
  /** 'gradient' (legacy premium) | 'clinical' (navy, square, mono) | 'clinical-dark' (white on black) */
  variant?: "gradient" | "clinical" | "clinical-dark";
}

const APP_STORE_URL = "https://apps.apple.com/gb/app/conka-app/id6450399391";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.conka.conkaApp&hl=en_GB";

const AppStoreIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const PlayStoreIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm-1.64-4.03L6.05 2.66l10.72 6.43-2.6 2.6zM6.05 2.66l10.72 6.43L6.05 21.34V2.66z" />
  </svg>
);

export function AppInstallButtons({
  className = "",
  buttonClassName = "",
  iconSize = 20,
  inverted = false,
  variant = "gradient",
}: AppInstallButtonsProps) {
  if (variant === "clinical-dark") {
    return (
      <div className={`flex flex-row flex-wrap gap-3 items-center ${className}`}>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CONKA app from the App Store"
          className={`group relative inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-black bg-white hover:bg-white/90 transition-colors lab-clip-tr ${buttonClassName}`}
        >
          <AppStoreIcon size={iconSize} />
          <span>App Store</span>
          <span aria-hidden className="text-black/50">
            ↗
          </span>
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CONKA app from Google Play"
          className={`group relative inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white bg-transparent border border-white/40 hover:border-white/70 hover:bg-white/5 transition-colors lab-clip-tr ${buttonClassName}`}
        >
          <PlayStoreIcon size={iconSize} />
          <span>Play Store</span>
          <span aria-hidden className="text-white/50">
            ↗
          </span>
        </a>
      </div>
    );
  }

  if (variant === "clinical") {
    return (
      <div className={`flex flex-row flex-wrap gap-3 items-center ${className}`}>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CONKA app from the App Store"
          className={`group relative inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white bg-[#1B2757] hover:bg-[#151f45] transition-colors lab-clip-tr ${buttonClassName}`}
        >
          <AppStoreIcon size={iconSize} />
          <span>App Store</span>
          <span aria-hidden className="text-white/50">
            ↗
          </span>
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CONKA app from Google Play"
          className={`group relative inline-flex items-center gap-2.5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#1B2757] bg-white border border-[#1B2757] hover:bg-[#1B2757]/5 transition-colors lab-clip-tr ${buttonClassName}`}
        >
          <PlayStoreIcon size={iconSize} />
          <span>Play Store</span>
          <span aria-hidden className="text-[#1B2757]/60">
            ↗
          </span>
        </a>
      </div>
    );
  }

  // Legacy gradient variant (unchanged — still used by /why-conka)
  void inverted;
  return (
    <div className={`flex flex-row flex-wrap gap-4 justify-center items-center ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-8 py-4 font-semibold text-base flex items-center gap-2 rounded-full transition-all text-white border-0 hover:opacity-90 ${buttonClassName}`}
        style={{
          background: "var(--gradient-neuro-blue-accent)",
          color: "white",
        }}
      >
        App Store
        <AppStoreIcon size={iconSize} />
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-8 py-4 font-semibold text-base flex items-center gap-2 rounded-full transition-all text-white border-0 hover:opacity-90 ${buttonClassName}`}
        style={{
          background: "var(--gradient-neuro-blue-accent)",
          color: "white",
        }}
      >
        Play Store
        <PlayStoreIcon size={iconSize} />
      </a>
    </div>
  );
}

export default AppInstallButtons;
