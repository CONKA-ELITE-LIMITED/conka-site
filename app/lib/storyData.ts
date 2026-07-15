// Our Story — six chapter beats.
//
// Source of truth for the narrative: docs/branding/BRAND_STORY_FOUNDATION.pdf
// (founder facts, arc) merged with the strongest specifics from the previous
// 10-section version (Durham professors, extraction method, trial results,
// team list). Each chapter carries at most 2 sentences of prose; a pull
// quote or a stat block does the rest of the work.

export interface StoryQuote {
  text: string;
  author: string;
  role: string;
}

export interface StoryStat {
  value: string;
  caption: string;
}

export interface StoryChapter {
  id: number;
  /** Short chapter name for the mono label, e.g. "The Injury". */
  label: string;
  headline: string;
  /** 1-2 sentences max. The quote/stat carries the rest of the beat. */
  prose: string;
  image: string;
  imageAlt: string;
  /**
   * CSS object-position for the image crop. Defaults to "center center".
   */
  imagePosition?: string;
  /**
   * "contain" shows the whole asset instead of cropping to fill. Used for
   * the Chapter 5 phone mockup, which has no background so it can float
   * inside the frame without filling it.
   */
  imageFit?: "cover" | "contain";
  /** Each chapter carries either a quote or a stat (or both, sparingly). */
  quote?: StoryQuote;
  stat?: StoryStat;
  /** Chapter 5: render the scrolling team-name marquee under the content. */
  teamMarquee?: boolean;
}

export const storyChapters: StoryChapter[] = [
  {
    id: 1,
    label: "The Injury",
    headline: "Two athletes. One career cut short.",
    prose:
      "Harry Glover and Humphrey Bodington met as university teammates. Harry went on to play England Sevens; Humphrey's career was ended by repeated concussions.",
    image: "/TwoFounders.jpg",
    imageAlt: "CONKA founders Harry Glover and Humphrey Bodington",
    quote: {
      text: "Lingering concussion symptoms pushed us to explore what the brain is truly capable of.",
      author: "Humphrey Bodington",
      role: "Co-Founder",
    },
  },
  {
    id: 2,
    label: "The Search",
    headline: "Sport had an answer for every injury except this one.",
    prose:
      "Months of headaches, light sensitivity, and cognitive fog with no clear solution. Elite sport had invested everything in the body and almost nothing in the brain.",
    image: "/story/GettyImages-1330621508.webp",
    imageAlt: "Rugby players in a contact tackle",
    stat: {
      value: "0",
      caption: "proven options offered to a professional athlete with post-concussion syndrome",
    },
  },
  {
    id: 3,
    label: "The Research",
    headline: "So they built the research themselves.",
    prose:
      "At Durham University, Harry and Humphrey worked with neuroscientists on nootropics, botanical compounds that cross the blood-brain barrier. Their key discovery was synergy: the compounds worked better together than alone.",
    image: "/story/Screenshot_2025-11-10_143714.webp",
    imageAlt: "Neuroscience research at Durham University",
    stat: {
      value: "£500K+",
      caption: "of their own capital invested into clinical development and research",
    },
  },
  {
    id: 4,
    label: "The Formula",
    headline: "From 14 capsules a day to one shot.",
    prose:
      "Early versions required up to 14 capsules a day. A new alcohol-free extraction method, invented by Dr. Shankar Katekhaye, collapsed the system into a single daily liquid shot.",
    image: "/formulas/conkaFlow/FlowNew.jpg",
    imageAlt: "The CONKA Flow daily shot bottle",
    quote: {
      text: "When any single component was removed, the benefits significantly decreased. The formula is the system.",
      author: "Dr. Shankar Katekhaye",
      role: "Head of Formulation",
    },
  },
  {
    id: 5,
    label: "The Proof",
    headline: "Tested where performance can't be faked.",
    prose:
      "Cognitive testing technology built with Cambridge University made the results measurable. Over 25 trials with professional teams followed.",
    image: "/app/AppConkaRing.png",
    imageAlt: "The CONKA app cognition test showing a score of 92",
    imageFit: "contain",
    stat: {
      value: "+16%",
      caption: "brain performance vs placebo in the first professional sport trial",
    },
    teamMarquee: true,
  },
  {
    id: 6,
    label: "Beyond Sport",
    headline: "Everyone has a brain. Everyone can choose to perform.",
    prose:
      "What started as one athlete's recovery is now a daily system used in professional sport, military settings, and offices. Not limited to athletes. Not limited to recovery.",
    image: "/lifestyle/GirlsLaughing.jpg",
    imageAlt: "Friends sharing CONKA shots and laughing",
    stat: {
      value: "150,000+",
      caption: "shots taken by 5,000+ daily users",
    },
  },
];

// Environments where CONKA has been tested — rendered as a scrolling marquee
// in Chapter 5. Deliberately generic categories, not named clubs: we do not
// have standing permission to name partner organisations publicly.
export const testedEnvironments = [
  "Premiership Rugby Clubs",
  "Championship Football Clubs",
  "Professional Boxing Camps",
  "Olympic Training Programmes",
  "International Rugby Squads",
  "Military Units",
  "Corporate Performance Teams",
  "University Research Labs",
  "Professional Motorsport",
];

