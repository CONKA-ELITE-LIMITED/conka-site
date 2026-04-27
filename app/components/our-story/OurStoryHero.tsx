import Image from "next/image";

export function OurStoryHero() {
  return (
    <div className="flex flex-col gap-8 lg:gap-16 lg:grid lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="relative w-full aspect-[4/5] border border-black/12 overflow-hidden bg-[#f5f5f5]">
        <Image
          src="/lifestyle/flow/FlowShadow.jpg"
          alt="CONKA Flow bottle resting on its side casting a long shadow"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover object-center"
        />
        <span className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
          Fig. 00
        </span>
        <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white bg-black/65 px-2 py-1 tabular-nums">
          Origin
        </span>
      </div>

      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
          {"// Our story · STORY-01"}
        </p>
        <h1
          className="brand-h1 text-black mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          A concussion changed everything
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/50 tabular-nums mb-6">
          £500,000 Research · Durham & Cambridge · Patented formula
        </p>
        <p
          className="brand-body text-lg lg:text-xl text-black mb-4"
          style={{ maxWidth: "var(--brand-body-max-width)" }}
        >
          Humphrey and Harry met as university teammates. One played professional
          rugby for his country. The other had his career cut short by a brain
          injury. What started as a personal recovery became a five-year research
          mission with Durham and Cambridge universities.
        </p>
        <p
          className="brand-body text-base lg:text-lg text-black/75"
          style={{ maxWidth: "var(--brand-body-max-width)" }}
        >
          This is how two athletes built a patented nootropic formula, invested
          over £500,000 in clinical research, and created something that actually
          works.
        </p>
      </header>
    </div>
  );
}

export default OurStoryHero;
