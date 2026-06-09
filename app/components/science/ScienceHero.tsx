import Image from "next/image";

export default function ScienceHero() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
      {/* Copy — leads on mobile so the claim is the first thing read */}
      <div className="order-1 lg:flex-1">
        <p className="brand-eyebrow mb-3">{"// The science · SCI-01"}</p>
        <h1
          className="brand-h1 text-black mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          Your brain is a performance system. We engineer for the load it
          carries.
        </h1>
        <p className="text-base md:text-lg text-black leading-relaxed max-w-xl mb-5">
          Clinical-dose actives across two complementary systems, measured on
          real teams in the real world. That is how we prove it.
        </p>
        <p className="text-sm md:text-base text-black/75 leading-relaxed max-w-xl">
          Focus, pressure, broken sleep, and the physical cost of a full day all
          land on the same organ. Most brain supplements answer that with a
          stimulant and a marketing dose. This page is the opposite: the model
          we built CONKA around, and the evidence underneath it.
        </p>
      </div>

      {/* Hero image — clinical asset frame */}
      <div className="relative order-2 lg:order-2 lg:flex-[1.1] w-full mt-10 lg:mt-0">
        <div className="relative aspect-[5/4] lg:aspect-[4/5] border border-black/12 bg-white overflow-hidden">
          <Image
            src="/lifestyle/CreationOfConka.jpg"
            alt="Two hands passing a CONKA bottle in the research lab"
            fill
            priority
            sizes="(max-width: 1024px) 95vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-black/55 px-2 py-1 tabular-nums">
            Fig. 01 · Research context
          </div>
        </div>
      </div>
    </div>
  );
}
