/**
 * Topic hub navigation.
 *
 * A server component rendering real `<a href>` anchors, deliberately: crawlable
 * links into the hubs are the entire reason the routes exist, so this must work
 * with JavaScript disabled. No useState, no click handler, no GSAP. Vercel
 * Analytics already reports pageviews per route, so hub traffic is the "which
 * topics do people want" data without a client component.
 *
 * Geometry is ported from InsightFilteredSections' filter chips (square, mono,
 * dot indicator, 44px minimum tap target), inverted to light tones for the white
 * blog surface.
 */
import Link from "next/link";
import { slugifyTopic } from "@/app/lib/blogTopics";

export default function TopicNav({
  topics,
  activeTopic = null,
}: {
  topics: string[];
  /** The hub currently being viewed, or null on the index. */
  activeTopic?: string | null;
}) {
  if (topics.length === 0) return null;

  return (
    <nav aria-label="Blog topics">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/40 tabular-nums mb-3">
        {"// Browse by topic"}
      </p>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 list-none p-0 m-0">
        <li>
          <TopicChip href="/blog" label="All" isActive={activeTopic === null} />
        </li>
        {topics.map((topic) => (
          <li key={topic}>
            <TopicChip
              href={`/blog/topic/${slugifyTopic(topic)}`}
              label={topic}
              isActive={topic === activeTopic}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TopicChip({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      // The active chip is its own page: mark it for assistive tech rather than
      // rendering a dead non-link, which would break back-navigation.
      aria-current={isActive ? "page" : undefined}
      className={[
        "group flex flex-col justify-start px-2 sm:px-4 py-3 font-mono tracking-wide text-left transition-colors min-h-[44px] border",
        "text-[10px] sm:text-[12px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        isActive
          ? "bg-black text-white border-black"
          : "bg-transparent text-black/70 border-black/20 hover:border-black/60 hover:text-black",
      ].join(" ")}
    >
      <span
        className={[
          "mb-1.5 block w-1.5 h-1.5 rounded-full transition-colors",
          isActive ? "bg-white" : "border border-black/45 group-hover:border-black",
        ].join(" ")}
        aria-hidden="true"
      />
      <span className="block leading-snug">{label}</span>
    </Link>
  );
}
