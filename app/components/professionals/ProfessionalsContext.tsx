"use client";

export default function ProfessionalsContext() {
  return (
    <section className="px-6 md:px-16 pt-4 md:pt-5 pb-6 md:pb-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
          CONKA Elite Portal
        </h1>

        {/* Distilled copy - clinical only */}
        <div className="space-y-2 max-w-2xl mx-auto">
          <p className="font-primary text-base md:text-lg opacity-80">
            Trusted by elite sports teams and high performing institutions
          </p>
          <p className="font-primary text-sm md:text-base opacity-70">
            Purchase for athletes, clients, and corporations
          </p>
        </div>

        {/* Scroll hint – subtle, smaller, greyer */}
        <p className="mt-4 md:mt-5 font-mono text-sm opacity-60">
          Scroll to learn more about CONKA
        </p>
        <div className="flex justify-center mt-2" aria-hidden>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50 animate-bounce"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
