/* ============================================================================
 * Athlete roster (SCRUM-1273)
 *
 * The single source of truth for the athlete proof beat. Lived as two
 * byte-identical copies until now, one in AthleteCredibilityCarousel and one
 * in the /start fork, which meant every carousel change had to be made twice
 * and in practice was not.
 *
 * Two fields were dropped when the copies merged. `achievementMono` (a mono
 * "RUGBY 7s - OLYMPIC" pill) went with the pill itself in SCRUM-1267, a
 * Clinical device on a Simple DTC surface. `bio`, a full credential sentence
 * that only /start rendered, lost to the short `sport - role` line: it read
 * well but cost two to three lines of exactly the height the refactor was
 * reclaiming, and the reference pattern (AG1, IM8) uses the short line.
 *
 * Portraits are white-background cutouts (`*NB.jpg`), which the consuming
 * components rely on: they render with mix-blend-multiply so the white
 * dissolves into the tinted tile. A portrait with a real background would
 * render as a grey box.
 * ========================================================================== */

export type Athlete = {
  name: string;
  sport: string;
  role: string;
  quote: string;
  image: string;
};

export const ATHLETES: Athlete[] = [
  {
    name: "Jack Willis",
    sport: "Rugby Union",
    role: "England International, Stade Toulousain",
    quote:
      "For me it was about trying to find the small margins and trying to maximise my brain as well as my body was so important.",
    image: "/testimonials/athlete/JackWillisNB.jpg",
  },
  {
    name: "Dan Norton",
    sport: "Rugby Sevens",
    role: "Olympic Silver Medallist",
    quote:
      "I am finding myself being able to speak clearer and in conversations my words just flow better. I have more calmness.",
    image: "/testimonials/athlete/DanNortonNB.jpg",
  },
  {
    name: "Josh Stanton",
    sport: "Motorsport",
    role: "Professional Racing Driver",
    quote:
      "When you are sat in a car you need to be in a calm state, but also you need to be aggressive. Really important to have this clarity of thought. The benefits CONKA gives me and knowing I have this edge is fantastic.",
    image: "/testimonials/athlete/JoshStantonNB.jpg",
  },
  {
    name: "Chris Billam-Smith",
    sport: "Boxing",
    role: "WBO Cruiserweight World Champion",
    quote:
      "Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.",
    image: "/testimonials/athlete/ChrisBillamSmithNB.jpg",
  },
  {
    name: "Sienna Charles",
    sport: "Showjumping",
    role: "GB Senior Team, European Medallist",
    quote:
      "Within a few weeks of taking it I saw huge improvements in energy, my ability to focus and my memory which got me back to competitions.",
    image: "/testimonials/athlete/SiennaCharlesNB.jpg",
  },
  {
    name: "Fraser Dingwall",
    sport: "Rugby Union",
    role: "England International",
    quote:
      "I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.",
    image: "/testimonials/athlete/FraserDingwallNB.jpg",
  },
  {
    name: "Adam Azim",
    sport: "Boxing",
    role: "IBO Super Lightweight World Champion",
    quote:
      "My reflexes were on point for my fights. CONKA is a daily thing I take especially in camp before fights.",
    image: "/testimonials/athlete/AdamAzimNB.jpg",
  },
];
