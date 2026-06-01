import type { Metadata } from "next";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import { OurStoryHero } from "@/app/components/our-story/OurStoryHero";
import { StorySection } from "@/app/components/our-story/StorySection";
import { OurStoryCTA } from "@/app/components/our-story/OurStoryCTA";
import Reveal from "@/app/components/landing/Reveal";
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

export default function OurStoryPage() {
  return (
    <div className="brand-clinical min-h-screen bg-white text-black">
      <Navigation />

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
        <section
          key={chapter.id}
          className={`brand-section ${index % 2 === 0 ? "brand-bg-tint" : "brand-bg-white"}`}
          aria-label={`Chapter ${chapter.id}: ${chapter.label}`}
        >
          <div className="brand-track">
            <Reveal>
              <StorySection
                chapter={chapter}
                totalChapters={storyChapters.length}
              />
            </Reveal>
          </div>
        </section>
      ))}

      <section
        className={`brand-section ${storyChapters.length % 2 === 0 ? "brand-bg-tint" : "brand-bg-white"}`}
        aria-label="The next chapter is yours"
      >
        <div className="brand-track">
          <Reveal>
            <OurStoryCTA />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
