/* Minimal opening — eyebrow and headline only. The proof cards directly
   below carry all the substance, so the hero's only job is the promise. */
export function WhyConkaHero() {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/40 mb-3">
        {"// The CONKA framework · CONKA-00"}
      </p>
      <h1
        id="why-conka-hero-heading"
        className="brand-h1 text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        Seven Reasons You Should Try CONKA in 60 Seconds.
      </h1>
    </header>
  );
}

export default WhyConkaHero;
