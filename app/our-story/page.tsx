import type { Metadata } from "next";
import { Fragment } from "react";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import {
  OurStoryHero,
  StorySection,
  StoryManifesto,
  StoryRail,
  OurStoryCTA,
} from "@/app/components/our-story";
import { storyChapters } from "@/app/lib/storyData";

export const metadata: Metadata = {
  title: "Our Story | CONKA",
  description:
    "From a concussion injury to a patented nootropic formula. How two founders invested £500K+ into brain performance research with Durham and Cambridge universities.",
  openGraph: {
    title: "Our Story | CONKA",
    description:
      "From a concussion injury to a patented nootropic formula. How two founders invested £500K+ into brain performance research with Durham and Cambridge universities.",
  },
};

/* Story spine: hero -> chapters 1-5 -> the manifesto turn (dark) ->
   chapter 6 (Beyond Sport) -> CTA. data-story-beat drives the fixed
   chapter rail; backgrounds alternate tint/white with one dark break. */
export default function OurStoryPage() {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black">
      <Navigation />
      <StoryRail />

      {/* paddingTop: .brand-clinical zeros brand-hero-first padding on
          mobile, leaving the hero flush against the nav. Explicit padding
          restores the breathing room (see /app-insights for the same fix). */}
      <section
        className="brand-section brand-hero-first brand-bg-white"
        style={{ paddingTop: "5rem" }}
        aria-label="Our Story hero"
      >
        <div className="brand-track">
          <OurStoryHero />
        </div>
      </section>

      {storyChapters.map((chapter, index) => (
        <Fragment key={chapter.id}>
          {/* The turn sits between The Proof (5) and Beyond Sport (6) */}
          {chapter.id === 6 && (
            <section
              className="brand-section brand-bg-black"
              aria-label="The turn: from protecting the brain to optimising it"
            >
              <div className="brand-track">
                <StoryManifesto />
              </div>
            </section>
          )}
          <section
            data-story-beat={chapter.id}
            className={`brand-section ${index % 2 === 0 ? "brand-bg-tint" : "brand-bg-white"}`}
            aria-label={`Chapter ${chapter.id}: ${chapter.label}`}
          >
            <div className="brand-track">
              <StorySection
                chapter={chapter}
                totalChapters={storyChapters.length}
              />
            </div>
          </section>
        </Fragment>
      ))}

      <section
        data-story-beat={storyChapters.length + 1}
        className={`brand-section ${storyChapters.length % 2 === 0 ? "brand-bg-tint" : "brand-bg-white"}`}
        aria-label="The next chapter is yours"
      >
        <div className="brand-track">
          <OurStoryCTA />
        </div>
      </section>

      <Footer />
    </div>
  );
}
