/**
 * Topic hub navigation.
 *
 * A server component rendering real `<a href>` anchors, deliberately: crawlable
 * links into the hubs are the entire reason the routes exist, so this must work
 * with JavaScript disabled. No useState, no click handler, no GSAP. Vercel
 * Analytics already reports pageviews per route, so hub traffic is the "which
 * topics do people want" data without a client component.
 *
 * Geometry follows the Simple DTC grammar (§8.5): rounded-full pills, sans, a
 * filled-navy active state, 44px minimum tap target on the white blog surface.
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
      <p className="text-[13px] font-medium text-black/45 mb-3">
        Browse by topic
      </p>

      <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
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
        "inline-flex items-center justify-center min-h-[44px] px-4 rounded-full text-[13px] font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2757] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        isActive
          ? "bg-[#1B2757] text-white"
          : "bg-black/[0.04] text-black/70 hover:bg-black/[0.07] hover:text-black",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
