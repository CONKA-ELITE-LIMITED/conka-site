import Image from "next/image";

/* Compact credibility-led opening — no prose. The H1 sets the premise, the
   stats and laurel badge establish the scale, and the chapters tell the
   story. The founders photo lives in Chapter 1, not here. */
export function OurStoryHero() {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// Our story · STORY-01"}
      </p>
      <h1
        className="brand-h1 text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        A concussion changed everything
      </h1>

      {/* Readable stats — replaces the mono subtitle line */}
      <div className="grid grid-cols-2 gap-4 mt-8 border-t border-black/10 pt-5 max-w-xl">
        <div>
          <span
            className="block text-black font-bold text-[28px] leading-tight tabular-nums"
            style={{ letterSpacing: "-0.02em" }}
          >
            £500K+
          </span>
          <span className="block text-[12px] text-[#1B2757] mt-1 leading-tight font-medium">
            invested into research
          </span>
        </div>
        <div>
          <span
            className="block text-black font-bold text-[28px] leading-tight tabular-nums"
            style={{ letterSpacing: "-0.02em" }}
          >
            150,000+
          </span>
          <span className="block text-[12px] text-[#1B2757] mt-1 leading-tight font-medium">
            shots sold to date
          </span>
        </div>
      </div>

      {/* Brain-research credibility badge — laurel-flanked award style. The
          same /LaurelWreath.png renders on each side; each container clips to
          half so the left shows the left branch, right shows the right. */}
      <div className="mt-5 flex items-center gap-3 p-4 bg-black/[0.04] max-w-xl">
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: "30px", height: "64px" }}
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="80px"
            style={{
              objectFit: "cover",
              objectPosition: "left center",
            }}
          />
        </div>

        <div className="flex-1 text-center leading-snug">
          <div className="text-[10px] uppercase tracking-[0.12em] text-[#1B2757] font-bold mb-1">
            One of the World&apos;s Largest
          </div>
          <div className="text-[13px] text-black font-semibold">
            Consumer brain research project. 1,000+ brains tested regularly
            through our app, unlocking a new level of cognitive performance.
          </div>
        </div>

        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: "30px", height: "64px" }}
          aria-hidden="true"
        >
          <Image
            src="/LaurelWreath.png"
            alt=""
            fill
            sizes="80px"
            style={{
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default OurStoryHero;
