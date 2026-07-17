import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "@/app/components/navigation";
import Footer from "@/app/components/footer";
import BlogListing from "@/app/components/blog/BlogListing";
import { getAllPosts } from "@/app/lib/blog";
import { getTopicSlugs, postsForTopic, resolveTopic, slugifyTopic, topicsOf } from "@/app/lib/blogTopics";

const PREVIEW = { includeUnpublished: true };

/**
 * Per-hub copy. Each hub needs its own H1 and description, both because a copy
 * of /blog's would read as duplicate content and because the H1 is the strongest
 * on-page keyword signal (the `seoHeading` rule, SCRUM-1138).
 *
 * Keyed by topic name. A topic with no entry still generates a hub from the
 * fallback: the route is driven by the data, so a new Notion option must never
 * be able to break the build for want of a copy line.
 */
const TOPIC_COPY: Record<string, { heading: string; intro: string; description: string }> = {
  Sport: {
    heading: "Sport and the athletic brain.",
    intro: "Reaction time, focus under pressure, and what the evidence says about training the brain like the body.",
    description: "Evidence-led writing on sport and the brain: reaction time, focus under pressure, recovery, and cognitive performance for athletes.",
  },
  Neuroscience: {
    heading: "Neuroscience, explained plainly.",
    intro: "How the brain actually works: memory, dopamine, emotion, creativity, and the systems underneath them.",
    description: "Neuroscience explained plainly: memory, dopamine, emotion, creativity, and how the brain's systems really work.",
  },
  Recovery: {
    heading: "Recovery and the brain.",
    intro: "Sleep, cold, heat, hydration and fasting, and what each one does to cognition.",
    description: "Evidence-led writing on recovery and the brain: sleep, cold exposure, sauna, hydration, and fasting for cognitive health.",
  },
  Focus: {
    heading: "Focus and daily performance.",
    intro: "Habits, routines and flow states, and the evidence for what actually sharpens attention.",
    description: "Evidence-led writing on focus: daily habits, routines, flow states, and what genuinely sharpens attention.",
  },
  Concussion: {
    heading: "Concussion and head impact.",
    intro: "Head impact, post-concussion syndrome, and the research on protecting and repairing the brain.",
    description: "Evidence-led writing on concussion: head impact in sport, post-concussion syndrome, and the neuroscience of recovery.",
  },
  Nootropics: {
    heading: "Nootropics and the evidence.",
    intro: "What the ingredients do, what the studies show, and where the claims outrun the data.",
    description: "Evidence-led writing on nootropics: what the ingredients do, what the research shows, and where claims outrun the data.",
  },
  "Brain Fog": {
    heading: "Brain fog and what causes it.",
    intro: "Inflammation, nutrition and the mechanisms behind the feeling of thinking through treacle.",
    description: "Evidence-led writing on brain fog: what causes it, the link to inflammation, and what the research says helps.",
  },
  "Brain Ageing": {
    heading: "The ageing brain.",
    intro: "How cognition changes with age, and what the research says about protecting it.",
    description: "Evidence-led writing on brain ageing: how cognition changes with age and what the research says about protecting it.",
  },
  Military: {
    heading: "Military brain health.",
    intro: "Blast-induced trauma and the cognitive load carried by people who serve.",
    description: "Evidence-led writing on military brain health: blast-induced trauma, cognitive load, and the research on recovery.",
  },
  Productivity: {
    heading: "Productivity and the brain.",
    intro: "Procrastination, motivation, and the science under getting things done.",
    description: "Evidence-led writing on productivity and the brain: procrastination, motivation, and the neuroscience of getting things done.",
  },
};

function copyFor(topic: string) {
  return (
    TOPIC_COPY[topic] ?? {
      heading: `${topic} and the brain.`,
      intro: `Evidence-led writing on ${topic.toLowerCase()}.`,
      description: `Evidence-led writing on ${topic.toLowerCase()} from the team behind CONKA.`,
    }
  );
}

/** Only topics carried by a published post, so a zero-post option gets no hub. */
export async function generateStaticParams() {
  return (await getTopicSlugs(PREVIEW)).map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = await resolveTopic(slug, PREVIEW);
  if (!topic) return {};

  const { description } = copyFor(topic);
  const title = `${topic} | CONKA Blog`;
  // No canonical: the root layout's relative canonical handles it.
  return { title, description, openGraph: { title, description } };
}

export default async function BlogTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;

  // One fetch, three derivations: getAllPosts re-probes every hero image per
  // call, so resolving, listing and navigating off separate calls would read
  // the whole blog three times per hub.
  const all = await getAllPosts(PREVIEW);
  const topics = topicsOf(all);
  const topic = topics.find((t) => slugifyTopic(t) === slug) ?? null;
  if (!topic) notFound();

  const posts = postsForTopic(all, topic);
  if (posts.length === 0) notFound();

  const { heading, intro } = copyFor(topic);

  return (
    <div className="brand-clinical min-h-screen bg-white text-black flex flex-col">
      <Navigation />

      <section
        className="brand-section brand-hero-first brand-bg-white grow"
        style={{ paddingTop: "5rem" }}
        aria-label={`${topic} articles`}
      >
        <div className="brand-track">
          {/* No pagination: the largest hub is 11, under the page size of 12.
              If a retag or the ingredient archive pushes one over, it needs the
              same Pagination component at /blog/topic/[topic]/page/[page]. */}
          <BlogListing
            eyebrow={`Blog / ${topic}`}
            heading={heading}
            intro={intro}
            topics={topics}
            activeTopic={topic}
            posts={posts}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
