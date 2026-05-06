"use client";

export default function WinHero() {
  return (
    <section className="px-4 md:px-16 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal-500 flex-shrink-0 hidden md:block"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Win a free month of CONKA
            </h1>
          </div>
          <p className="font-commentary text-xl md:text-2xl mt-2">
            a clinically designed nootropic protocol — on us
          </p>
          <p className="font-mono text-sm opacity-70 mt-4">
            backed by 250+ clinical studies • tailored to your goals
          </p>
          <p className="font-mono text-xs opacity-50 mt-1">
            worth £79.99 • delivered free • no subscription required
          </p>
        </div>
      </div>
    </section>
  );
}
