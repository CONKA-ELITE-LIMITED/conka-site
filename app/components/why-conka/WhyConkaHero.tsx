/* Editorial article header, matching the MM listicle hero
   (app/components/go/listicle/SimpleListicleRenderer.tsx SimpleHero):
   big headline, byline, intro, divider. The byline carries the review date
   that used to sit at the foot of the page as a ReviewedDate stamp.

   The classes are duplicated rather than shared with SimpleListicleRenderer
   deliberately: that file renders the live paid /go listicle and is not
   touched by this page. Keep the two in step by eye if the MM look changes. */
export function WhyConkaHero() {
  return (
    <header>
      <h1
        id="why-conka-hero-heading"
        className="text-[2rem] font-bold leading-[1.1] text-black md:text-[2.75rem] md:leading-[1.08]"
      >
        Seven Reasons You Should Try CONKA in 60 Seconds.
      </h1>

      <div className="mt-7 text-[15px] leading-snug">
        <div className="font-bold text-black">By The CONKA Team</div>
        <div className="text-black/55">
          Last updated{" "}
          <time dateTime="2026-07">July 2026</time>
        </div>
      </div>

      <p className="mt-7 max-w-3xl text-[16px] font-semibold leading-relaxed text-black md:text-[17px]">
        Over £500,000 of our own capital into clinical research, 25+ trials with
        leading UK universities, and a cognitive test built with Cambridge so
        you can measure the difference yourself. Here is the whole case, in
        seven reasons.
      </p>

      <hr className="mt-9 border-0 border-t border-black/10" />
    </header>
  );
}

export default WhyConkaHero;
