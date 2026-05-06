"use client";

const BULLETS = [
  "Full validated test",
  "Sleep & exercise tracking",
  "Personalized insights",
];

export default function CognitiveTestAppPromo() {
  return (
    <div className="bg-white/10 border border-white/12 p-5 lg:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 tabular-nums">
        Get the full experience · CONKA App · iOS & Android
      </p>
      <h4
        className="brand-h4 text-white mb-3 max-w-[24ch]"
        style={{ letterSpacing: "-0.02em" }}
      >
        The full speed-of-processing game in the CONKA app.
      </h4>
      <p className="text-sm text-white/70 leading-relaxed mb-5 max-w-xl">
        This was a 30-second snapshot. The full game gives you detailed insights
        and tracks how your performance changes with lifestyle factors.
      </p>

      {/* Bullet strip */}
      <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
        {BULLETS.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-white/50" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 tabular-nums">
              {b}
            </span>
          </li>
        ))}
      </ul>

      {/* App store buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://apps.apple.com/gb/app/conka-app/id6450399391"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-white text-black font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-opacity hover:opacity-85 active:opacity-70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span>App Store</span>
          <span aria-hidden>↗</span>
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.conka.conkaApp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 bg-transparent border border-white/30 text-white font-mono text-[11px] uppercase tracking-[0.2em] tabular-nums px-5 py-3.5 lab-clip-tr transition-colors hover:bg-white/10 hover:border-white/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
          </svg>
          <span>Google Play</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </div>
  );
}
