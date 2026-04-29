// ===== CASE STUDIES DATA =====
// All athlete data from real CONKA case study CSV - NO FABRICATED QUOTES

// Sport categories for filtering
export type SportCategory =
  | "rugby"
  | "rugby7s"
  | "football"
  | "motorsport"
  | "business"
  | "other";

// Performance metrics structure (from CSV)
export interface PerformanceMetrics {
  totalScore?: number;
  accuracy?: number;
  speed?: number;
}

// Individual improvement stat for display
export interface ImprovementStat {
  metric: string;
  value: string;
  percentage: number;
  description?: string;
}

// Main athlete data structure
export interface AthleteData {
  id: string;
  name: string;
  photo?: string;
  focalPoint?: { x: number; y: number }; // Focal point for image centering (0-100)
  sport: SportCategory;
  profession: string;
  organization: string;
  position?: string;
  achievement?: string;
  description: string; // Real bio from CSV

  // Product Info
  productVersion?: "01" | "02" | "both";
  protocolUsed?: string;

  // Performance Data (from CSV)
  testsCompleted: number;
  baselineTests: number;
  postBaselineTests: number;
  testingPeriod: string;
  baseline: PerformanceMetrics;
  results: PerformanceMetrics;
  improvements: ImprovementStat[];

  // Categorization
  featured: boolean;
  tier: 1 | 2 | 3;
  userType: "athlete" | "professional";
}

// Sport category display info
export const SPORT_INFO: Record<
  SportCategory,
  { name: string; emoji: string }
> = {
  rugby: { name: "Rugby Union", emoji: "🏉" },
  rugby7s: { name: "Rugby 7s", emoji: "🏉" },
  football: { name: "Football", emoji: "⚽" },
  motorsport: { name: "Motorsport", emoji: "🏎️" },
  business: { name: "Business", emoji: "💼" },
  other: { name: "Other", emoji: "🏆" },
};

/**
 * Mapping: athlete id (kebab-case) → asset path in /public/caseStudies/.
 * All assets are JPG, camelCase filenames (e.g. JoshStanton.jpg).
 * Exception: Charlotte Simpson → DrCharlotteSimpson.jpg (title: Dr).
 */
export const CASE_STUDY_PHOTO_PATHS: Record<string, string> = {
  "jade-shekells": "/caseStudies/JadeShekells.jpg",
  "finn-russell": "/caseStudies/FinnRussell.jpg",
  "jack-willis": "/caseStudies/JackWillis.jpg",
  "pierre-louis-barassi": "/caseStudies/PierreLouisBarassi.jpg",
  "patrick-bamford": "/caseStudies/PatrickBamford.jpg",
  "nimisha-kurup": "/caseStudies/NimishaKurup.jpg",
  "callum-sheedy": "/caseStudies/CallumSheedy.jpg",
  "will-stuart": "/caseStudies/WillStuart.jpg",
  "daniel-james": "/caseStudies/DanielJames.jpg",
  "josh-stanton": "/caseStudies/JoshStanton.jpg",
  "shane-corstorphine": "/caseStudies/ShaneCorstorphine.jpg",
  "aaron-hope": "/caseStudies/AaronHope.jpg",
  "matt-davidson": "/caseStudies/MattDavidson.jpg",
  "juan-cruz-mallia": "/caseStudies/JuanCruzMallia.jpg",
  "francois-cros": "/caseStudies/FrancoisCros.jpg",
  "tom-williams": "/caseStudies/TomWilliams.jpg",
  "will-homer": "/caseStudies/WillHomer.jpg",
  "max-lahiff": "/caseStudies/MaxLahiff.jpg",
  "ollie-lawrence": "/caseStudies/OllieLawrence.jpg",
  "telusa-veainu": "/caseStudies/TelusaVeainu.jpg",
  "alex-dombrandt": "/caseStudies/AlexDombrandt.jpg",
  "pita-ahki": "/caseStudies/PitaAhki.jpg",
  "michael-olise": "/caseStudies/MichaelOlise.jpg",
  "ao-tanaka": "/caseStudies/AoTanaka.jpg",
  "fin-baxter": "/caseStudies/FinBaxter.jpg",
  "george-pratt": "/caseStudies/GeorgePratt.jpg",
  "louis-lynagh": "/caseStudies/LouisLynagh.jpg",
  "blair-kinghorn": "/caseStudies/BlairKinghorn.jpg",
  "emma-uren": "/caseStudies/EmmaUren.jpg",
  "luke-northmore": "/caseStudies/LukeNorthmore.jpg",
  "millie-hammond": "/caseStudies/MillieHammond.jpg",
  "lennox-anyanwu": "/caseStudies/LennoxAnyanwu.jpg",
  "charlotte-simpson": "/caseStudies/DrCharlotteSimpson.jpg",
  "will-muir": "/caseStudies/WillMuir.jpg",
  "alex-lowe": "/caseStudies/AlexLowe.jpg",
  "ben-cox": "/caseStudies/BenCox.jpg",
  "liz-glover": "/caseStudies/LizGlover.jpg",
  "doris-regazi": "/caseStudies/DorisRegazi.jpg",
};

/** New square assets in /public/caseStudies/ (2000×2000). Returns "" for unknown IDs so callers use athlete.photo. */
export function getCaseStudyPhotoPath(athleteId: string): string {
  return CASE_STUDY_PHOTO_PATHS[athleteId] ?? "";
}

// ===== ALL ATHLETE DATA FROM CSV =====

export const athletes: AthleteData[] = [
  // ===== TIER 1: HEADLINE ATHLETES =====
  {
    id: "jade-shekells",
    name: "Jade Shekells",
    photo: "/JADE SHEKELLS.jpeg",
    sport: "rugby7s",
    profession: "GB7 Womens Rugby 7s",
    organization: "GB7 Womens - Rugby 7s",
    position: "Back",
    achievement: "Paris 2024 Olympian, European Games Gold 2023",
    description:
      "Forged at Worcester Warriors, Shekells rose from local standout to an explosive force on the global SVNS circuit. A dominant physical presence, she helped secure European Games gold in 2023 and qualification for the Paris 2024 Olympics. Her rapid ascent marks her as one of the most powerful emerging backs in British rugby.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 36,
    baselineTests: 3,
    postBaselineTests: 33,
    testingPeriod: "Oct 2024 - Feb 2025",
    baseline: { totalScore: 60.33, accuracy: 62.0, speed: 97.33 },
    results: { totalScore: 82.48, accuracy: 82.76, speed: 99.64 },
    improvements: [
      { metric: "Total Score", value: "+36.72%", percentage: 36.72 },
      { metric: "Accuracy", value: "+33.48%", percentage: 33.48 },
      { metric: "Speed", value: "+2.37%", percentage: 2.37 },
    ],
    featured: false,
    tier: 1,
    userType: "athlete",
  },
  {
    id: "finn-russell",
    name: "Finn Russell",
    photo: "/FINN RUSSELL.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Bath Rugby",
    position: "Fly-Half",
    achievement: "World-class playmaker, Scotland international",
    description:
      "Russell is a world-class fly-half for Bath Rugby, celebrated for his creativity and tactical mastery. A game-changer with precise kicking and vision, he is a central figure in club and international rugby. His flair and consistency set him apart in the Premiership.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 15,
    baselineTests: 3,
    postBaselineTests: 12,
    testingPeriod: "Dec 2024 - Mar 2025",
    baseline: { totalScore: 54.67, accuracy: 61.0, speed: 89.67 },
    results: { totalScore: 70.5, accuracy: 72.33, speed: 97.08 },
    improvements: [
      { metric: "Total Score", value: "+28.96%", percentage: 28.96 },
      { metric: "Accuracy", value: "+18.58%", percentage: 18.58 },
      { metric: "Speed", value: "+8.27%", percentage: 8.27 },
    ],
    featured: false,
    tier: 1,
    userType: "athlete",
  },
  {
    id: "patrick-bamford",
    name: "Patrick Bamford",
    photo: "/PATRICK BAMFORD.jpg",
    sport: "football",
    profession: "Professional Footballer",
    organization: "Leeds United",
    position: "Forward",
    achievement: "Championship key player",
    description:
      "Patrick James Bamford is an English professional footballer who plays as a forward for EFL Championship club Sheffield United. Bamford began his career at Nottingham Forest, making his debut in December 2011, at the age of 18. A month later he joined Chelsea for a fee of £1.5 million.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 9,
    baselineTests: 3,
    postBaselineTests: 6,
    testingPeriod: "Mar 2025 - Apr 2025",
    baseline: { totalScore: 62.67, accuracy: 83.33, speed: 75.67 },
    results: { totalScore: 80.17, accuracy: 83.33, speed: 96.17 },
    improvements: [
      { metric: "Total Score", value: "+27.93%", percentage: 27.93 },
      { metric: "Accuracy", value: "0.00%", percentage: 0 },
      { metric: "Speed", value: "+27.09%", percentage: 27.09 },
    ],
    featured: false,
    tier: 1,
    userType: "athlete",
  },
  {
    id: "pierre-louis-barassi",
    name: "Pierre-Louis Barassi",
    photo: "/PIERRE-LOUIS.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Stade Toulousain",
    position: "Centre",
    achievement: "Champions Cup & Top 14 Double 2024",
    description:
      "Barassi is a French international centre for Stade Toulousain, celebrated for his powerful running and attacking prowess. He won the European Challenge Cup with Lyon OU in 2022 and went on to secure Top 14 titles with Toulouse, achieving a Champions Cup–French Championship double in 2024. His consistency and skill have established him as one of France's premier centres.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 7,
    baselineTests: 3,
    postBaselineTests: 4,
    testingPeriod: "Feb 2025 - Mar 2025",
    baseline: { totalScore: 67.0, accuracy: 82.67, speed: 80.67 },
    results: { totalScore: 85.25, accuracy: 94.5, speed: 90.75 },
    improvements: [
      { metric: "Total Score", value: "+27.24%", percentage: 27.24 },
      { metric: "Accuracy", value: "+14.31%", percentage: 14.31 },
      { metric: "Speed", value: "+12.50%", percentage: 12.5 },
    ],
    featured: false,
    tier: 1,
    userType: "athlete",
  },
  {
    id: "jack-willis",
    name: "Jack Willis",
    photo: "/Jack Willis.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Stade Toulousain",
    position: "Flanker",
    achievement:
      "Top 14 Player of the Year 2025, Premiership Player of the Season",
    description:
      "Willis is a flanker who has excelled in both the Premiership and Top 14, earning multiple awards including Premiership Player of the Season and Top 14 Player of the Year 2025. His breakout performances with Wasps and subsequent success in France highlight his impact as a dominant and versatile back-row forward. Willis is recognized for his relentless work rate, physicality, and game-changing presence on the field.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 12,
    baselineTests: 3,
    postBaselineTests: 9,
    testingPeriod: "Jun 2024 - Oct 2025",
    baseline: { totalScore: 69.33, accuracy: 72.0, speed: 96.67 },
    results: { totalScore: 83.56, accuracy: 86.11, speed: 96.89 },
    improvements: [
      { metric: "Total Score", value: "+20.51%", percentage: 20.51 },
      { metric: "Accuracy", value: "+19.60%", percentage: 19.6 },
      { metric: "Speed", value: "+0.23%", percentage: 0.23 },
    ],
    featured: true,
    tier: 1,
    userType: "athlete",
  },
  {
    id: "nimisha-kurup",
    name: "Nimisha Kurup",
    photo: "/NimishaKurup.JPG",
    sport: "business",
    profession: "Managing Director, CFO Data Management",
    organization: "Bank of America",
    achievement:
      "C-Suite Executive overseeing teams across America, Europe, and Asia",
    description:
      "Managing Director, CFO Data Management Executive. C-suite at one of the largest banks in the world, overseeing hundreds of people across America, Europe and Asia.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 73,
    baselineTests: 3,
    postBaselineTests: 70,
    testingPeriod: "Aug 2024 - Dec 2025",
    baseline: { totalScore: 65.67, accuracy: 78.33, speed: 83.67 },
    results: { totalScore: 81.87, accuracy: 84.56, speed: 96.83 },
    improvements: [
      { metric: "Total Score", value: "+24.68%", percentage: 24.68 },
      { metric: "Accuracy", value: "+7.95%", percentage: 7.95 },
      { metric: "Speed", value: "+15.73%", percentage: 15.73 },
    ],
    featured: true,
    tier: 1,
    userType: "professional",
  },

  // ===== TIER 2: SUPPORTING ATHLETES =====
  {
    id: "callum-sheedy",
    name: "Callum Sheedy",
    photo: "/Callum Sheedy.jpeg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Bristol Bears",
    position: "Fly-Half",
    achievement: "1,000+ first-team points",
    description:
      "Sheedy is one of just eight players in club history to surpass 1,000 first-team points, cementing his legacy as an elite Premiership playmaker. Renowned for his control, kicking accuracy and leadership, he has been a pivotal figure for Bristol Bears. His consistency and game-breaking ability continue to define him as one of the Premiership's most reliable fly-halves.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 16,
    baselineTests: 3,
    postBaselineTests: 13,
    testingPeriod: "Jan 2024 - Mar 2024",
    baseline: { totalScore: 19.33, accuracy: 19.33, speed: 99.67 },
    results: { totalScore: 79.23, accuracy: 79.54, speed: 99.69 },
    improvements: [
      { metric: "Total Score", value: "+309.81%", percentage: 309.81 },
      { metric: "Accuracy", value: "+311.41%", percentage: 311.41 },
      { metric: "Speed", value: "+0.03%", percentage: 0.03 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "will-stuart",
    name: "Will Stuart",
    photo: "/WILL STUART.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Bath Rugby",
    position: "Prop",
    achievement: "England international",
    description:
      "Stuart is a dominant prop for Bath Rugby, respected for his strength and scrummaging technique. A reliable cornerstone of the forward pack, he consistently impacts set-pieces and open play. His experience and power make him one of the Premiership's leading front-rowers.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 5,
    baselineTests: 3,
    postBaselineTests: 2,
    testingPeriod: "Jan 2025",
    baseline: { totalScore: 73.0, accuracy: 73.67, speed: 99.0 },
    results: { totalScore: 85.5, accuracy: 86.5, speed: 99.5 },
    improvements: [
      { metric: "Total Score", value: "+17.12%", percentage: 17.12 },
      { metric: "Accuracy", value: "+17.42%", percentage: 17.42 },
      { metric: "Speed", value: "+0.51%", percentage: 0.51 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "daniel-james",
    name: "Daniel James",
    photo: "/Daniel James.jpg",
    sport: "football",
    profession: "Professional Footballer",
    organization: "Leeds United",
    position: "Winger",
    achievement: "Wales international",
    description:
      "Daniel Owen James (born 10 November 1997) is a professional footballer who plays as a winger for Premier League club Leeds United and the Wales national team.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 11,
    baselineTests: 3,
    postBaselineTests: 8,
    testingPeriod: "Mar 2025 - Apr 2025",
    baseline: { totalScore: 71.67, accuracy: 81.67, speed: 87.33 },
    results: { totalScore: 81.88, accuracy: 85.38, speed: 95.88 },
    improvements: [
      { metric: "Total Score", value: "+14.24%", percentage: 14.24 },
      { metric: "Accuracy", value: "+4.54%", percentage: 4.54 },
      { metric: "Speed", value: "+9.78%", percentage: 9.78 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "josh-stanton",
    name: "Josh Stanton",
    photo: "/Josh Stanton.jpg",
    sport: "motorsport",
    profession: "Racing Driver",
    organization: "Porsche Motorsport",
    achievement: "Porsche Motorsport competitor",
    description:
      "Stanton is a high-performance athlete competing in Porsche Motorsport, known for his precision and focus. His technical skill and competitive mindset make him a standout in the racing world. He continues to impress on international circuits.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 15,
    baselineTests: 3,
    postBaselineTests: 12,
    testingPeriod: "Jan 2024 - Mar 2024",
    baseline: { totalScore: 75.67, accuracy: 82.67, speed: 91.33 },
    results: { totalScore: 86.5, accuracy: 87.17, speed: 99.17 },
    improvements: [
      { metric: "Total Score", value: "+14.32%", percentage: 14.32 },
      { metric: "Accuracy", value: "+5.44%", percentage: 5.44 },
      { metric: "Speed", value: "+8.58%", percentage: 8.58 },
    ],
    featured: true,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "shane-corstorphine",
    name: "Shane Corstorphine",
    photo: "/Shane Corstorphine.jpg",
    focalPoint: { x: 50, y: 35 }, // Lower focal point to show full face
    sport: "business",
    profession: "Chief Revenue Officer",
    organization: "SkyScanner",
    achievement: "C-Suite Executive at global travel tech company",
    description:
      "C-Suite executive at SkyScanner, one of the world's leading travel technology companies.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 33,
    baselineTests: 3,
    postBaselineTests: 30,
    testingPeriod: "May 2025 - Nov 2025",
    baseline: { totalScore: 69.67, accuracy: 89.67, speed: 77.33 },
    results: { totalScore: 78.93, accuracy: 85.53, speed: 92.5 },
    improvements: [
      { metric: "Total Score", value: "+13.30%", percentage: 13.3 },
      { metric: "Accuracy", value: "-4.61%", percentage: -4.61 },
      { metric: "Speed", value: "+19.61%", percentage: 19.61 },
    ],
    featured: true,
    tier: 2,
    userType: "professional",
  },
  {
    id: "aaron-hope",
    name: "Aaron Hope",
    photo: "/Aron Hope.jpg",
    sport: "business",
    profession: "Lead Machine Learning Engineer",
    organization: "Draft Kings",
    achievement: "Senior ML Engineer",
    description:
      "Lead Machine Learning Engineer. Hard job, long hours, stressful but good at what he does. Enjoys socialising and maintaining his own form of balance.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 52,
    baselineTests: 3,
    postBaselineTests: 49,
    testingPeriod: "Mar 2024 - Nov 2025",
    baseline: { totalScore: 79.33, accuracy: 91.33, speed: 87.33 },
    results: { totalScore: 89.1, accuracy: 90.2, speed: 98.69 },
    improvements: [
      { metric: "Total Score", value: "+12.31%", percentage: 12.31 },
      { metric: "Accuracy", value: "-1.24%", percentage: -1.24 },
      { metric: "Speed", value: "+13.01%", percentage: 13.01 },
    ],
    featured: true,
    tier: 2,
    userType: "professional",
  },
  {
    id: "matt-davidson",
    name: "Matt Davidson",
    photo: "/Matt Davidson.jpg",
    sport: "rugby7s",
    profession: "GB7 Rugby 7s",
    organization: "GB7s - Rugby 7s",
    achievement: "GB7s squad member",
    description:
      "Davidson is a dynamic rugby 7s athlete representing GB7s. Renowned for his agility and work rate, he is a key contributor on the pitch. His performances continue to establish him as a standout in international rugby 7s.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 51,
    baselineTests: 3,
    postBaselineTests: 48,
    testingPeriod: "Nov 2023 - Feb 2025",
    baseline: { totalScore: 80.33, accuracy: 80.67, speed: 99.33 },
    results: { totalScore: 90.17, accuracy: 90.17, speed: 100.0 },
    improvements: [
      { metric: "Total Score", value: "+12.24%", percentage: 12.24 },
      { metric: "Accuracy", value: "+11.78%", percentage: 11.78 },
      { metric: "Speed", value: "+0.67%", percentage: 0.67 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "juan-cruz-mallia",
    name: "Juan Cruz Mallía",
    photo: "/JUAN CRUZ MALLIA.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Stade Toulousain",
    position: "Utility Back",
    achievement: "Champions Cup winner 2021",
    description:
      "Mallía is a utility back capable of playing from 10 to 15, known for his versatility and high-level performances with Toulouse. He debuted in Super Rugby for the Jaguares in 2018 and has since become a key figure in European rugby, scoring Toulouse's only try in their 2021 Champions Cup final win. Mallía also secured a Top 14 title in 2021, showcasing his impact across multiple positions.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 17,
    baselineTests: 3,
    postBaselineTests: 14,
    testingPeriod: "Feb 2025 - Mar 2025",
    baseline: { totalScore: 77.0, accuracy: 80.33, speed: 95.67 },
    results: { totalScore: 84.79, accuracy: 85.07, speed: 99.71 },
    improvements: [
      { metric: "Total Score", value: "+10.11%", percentage: 10.11 },
      { metric: "Accuracy", value: "+5.90%", percentage: 5.9 },
      { metric: "Speed", value: "+4.23%", percentage: 4.23 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "francois-cros",
    name: "François Cros",
    photo: "/François Cros.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Stade Toulousain",
    position: "Back Row",
    achievement: "Multiple Top 14 & Champions Cup titles",
    description:
      "Cros is a versatile back-row forward for Stade Toulousain, standing 1.90 m and weighing 107 kg. He has spent his entire professional career with Toulouse, contributing to multiple Top 14 titles (2019, 2021, 2023–2025) and European Rugby Champions Cup victories in 2021 and 2024. His athleticism and adaptability make him a cornerstone of both club and European rugby.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 14,
    baselineTests: 3,
    postBaselineTests: 11,
    testingPeriod: "Feb 2025 - Mar 2025",
    baseline: { totalScore: 68.33, accuracy: 78.67, speed: 89.0 },
    results: { totalScore: 75.27, accuracy: 78.27, speed: 96.55 },
    improvements: [
      { metric: "Total Score", value: "+10.16%", percentage: 10.16 },
      { metric: "Accuracy", value: "-0.50%", percentage: -0.5 },
      { metric: "Speed", value: "+8.48%", percentage: 8.48 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "tom-williams",
    name: "Tom Williams",
    sport: "rugby7s",
    profession: "GB7 Rugby 7s",
    organization: "GB7s - Rugby 7s",
    achievement: "GB7s squad member",
    description:
      "Williams is a core member of GB7s rugby, bringing athleticism and sharp decision-making to every match. His dedication and performance metrics highlight him as a top-tier sevens athlete. He continues to impress at the international level.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 45,
    baselineTests: 3,
    postBaselineTests: 42,
    testingPeriod: "Sep 2024 - Feb 2025",
    baseline: { totalScore: 74.0, accuracy: 80.67, speed: 92.0 },
    results: { totalScore: 80.69, accuracy: 81.95, speed: 98.5 },
    improvements: [
      { metric: "Total Score", value: "+9.04%", percentage: 9.04 },
      { metric: "Accuracy", value: "+1.59%", percentage: 1.59 },
      { metric: "Speed", value: "+7.07%", percentage: 7.07 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "will-homer",
    name: "Will Homer",
    photo: "/Will Homer.jpg",
    sport: "rugby7s",
    profession: "GB7 Rugby 7s",
    organization: "GB7s - Rugby 7s",
    achievement: "GB7s squad member",
    description:
      "Homer plays elite rugby 7s for GB7s, combining speed, skill, and strategic awareness. He is recognized for his consistency and ability to perform in high-pressure games. His impact on the squad underscores his rising profile in the sport.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 77,
    baselineTests: 3,
    postBaselineTests: 74,
    testingPeriod: "Jan 2024 - Nov 2025",
    baseline: { totalScore: 83.67, accuracy: 90.67, speed: 92.33 },
    results: { totalScore: 90.58, accuracy: 91.38, speed: 99.07 },
    improvements: [
      { metric: "Total Score", value: "+8.26%", percentage: 8.26 },
      { metric: "Accuracy", value: "+0.78%", percentage: 0.78 },
      { metric: "Speed", value: "+7.29%", percentage: 7.29 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "max-lahiff",
    name: "Max Lahiff",
    photo: "/Max Lahiff.jpeg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Bristol Bears",
    position: "Prop",
    achievement: "100+ appearances, Maul or Nothing podcast host",
    description:
      "Centurion prop Max Lahiff has made over 100 appearances for Bristol Bears, becoming one of the club's most experienced and influential forwards. Equally effective on both sides of the scrum, he is known for his consistency, power, and character. Off the field, he hosts the popular Maul or Nothing podcast.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 30,
    baselineTests: 3,
    postBaselineTests: 27,
    testingPeriod: "Jan 2024 - Sep 2025",
    baseline: { totalScore: 75.33, accuracy: 90.0, speed: 83.67 },
    results: { totalScore: 81.15, accuracy: 89.74, speed: 90.56 },
    improvements: [
      { metric: "Total Score", value: "+7.72%", percentage: 7.72 },
      { metric: "Accuracy", value: "-0.29%", percentage: -0.29 },
      { metric: "Speed", value: "+8.23%", percentage: 8.23 },
    ],
    featured: true,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "ollie-lawrence",
    name: "Ollie Lawrence",
    photo: "/OLLIE LAWRENCE.jpeg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Bath Rugby",
    position: "Centre",
    achievement: "England international",
    description:
      "Lawrence is a dynamic centre for Bath Rugby, combining power, pace, and attacking instinct. A key performer for both club and country, he is known for breaking through defenses and creating scoring opportunities. His skill and athleticism make him a standout in modern rugby.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 40,
    baselineTests: 3,
    postBaselineTests: 37,
    testingPeriod: "Nov 2024 - Mar 2025",
    baseline: { totalScore: 76.33, accuracy: 81.33, speed: 94.67 },
    results: { totalScore: 81.84, accuracy: 82.46, speed: 99.3 },
    improvements: [
      { metric: "Total Score", value: "+7.21%", percentage: 7.21 },
      { metric: "Accuracy", value: "+1.38%", percentage: 1.38 },
      { metric: "Speed", value: "+4.89%", percentage: 4.89 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "telusa-veainu",
    name: "Telusa Veainu",
    photo: "/Telusa Veainu.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Sale Sharks",
    position: "Fullback/Wing",
    achievement: "Tonga international",
    description:
      "Koloti Telusa Pelaki Veainu is a rugby union player. He plays at fullback or on the wing for Doncaster Knights. Born and raised in New Zealand, he represents Tonga internationally. He is known for his speed, elusiveness and strength from fullback, earning him a place in Will Greenwood's Daily Telegraph team of the year for 2016/17.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 4,
    baselineTests: 3,
    postBaselineTests: 1,
    testingPeriod: "Nov 2023 - Dec 2023",
    baseline: { totalScore: 76.67, accuracy: 77.33, speed: 99.0 },
    results: { totalScore: 82.0, accuracy: 82.0, speed: 100.0 },
    improvements: [
      { metric: "Total Score", value: "+6.96%", percentage: 6.96 },
      { metric: "Accuracy", value: "+6.03%", percentage: 6.03 },
      { metric: "Speed", value: "+1.01%", percentage: 1.01 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "alex-dombrandt",
    name: "Alex Dombrandt",
    photo: "/Alex Dombrandt.jpeg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Harlequins",
    position: "No.8",
    achievement: "England international, Six Nations regular",
    description:
      "Dombrandt made his England debut in 2021 and has since become a regular feature in the Six Nations and national squad selections. A dynamic No.8 with try-scoring impact, he played key roles in the 2023 and 2024 championships. His athleticism and intelligence continue to make him one of the most exciting back-rowers in England.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 15,
    baselineTests: 3,
    postBaselineTests: 12,
    testingPeriod: "Nov 2023 - Jan 2024",
    baseline: { totalScore: 74.67, accuracy: 74.67, speed: 100.0 },
    results: { totalScore: 79.83, accuracy: 85.83, speed: 93.17 },
    improvements: [
      { metric: "Total Score", value: "+6.92%", percentage: 6.92 },
      { metric: "Accuracy", value: "+14.96%", percentage: 14.96 },
      { metric: "Speed", value: "-6.83%", percentage: -6.83 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "pita-ahki",
    name: "Pita Ahki",
    photo: "/PITA AHKI.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Stade Toulousain",
    position: "Centre",
    achievement: "Tonga international",
    description:
      "Pita Jordan Ahki is a professional rugby union player who plays as a centre for Top 14 club Toulouse. Born in New Zealand, he represents Tonga at international level after qualifying on ancestry grounds.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 15,
    baselineTests: 3,
    postBaselineTests: 12,
    testingPeriod: "Feb 2025 - Mar 2025",
    baseline: { totalScore: 82.33, accuracy: 82.67, speed: 100.0 },
    results: { totalScore: 87.83, accuracy: 87.83, speed: 100.0 },
    improvements: [
      { metric: "Total Score", value: "+6.68%", percentage: 6.68 },
      { metric: "Accuracy", value: "+6.25%", percentage: 6.25 },
      { metric: "Speed", value: "0.00%", percentage: 0 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "michael-olise",
    name: "Michael Olise",
    photo: "/MichaelOlise.jpg",
    sport: "football",
    profession: "Professional Footballer",
    organization: "Bayern Munich",
    position: "Winger",
    achievement: "Bundesliga player",
    description:
      "Michael is an emerging football talent with Bayern Munich, celebrated for his speed and tactical awareness. A promising athlete in the Bundesliga, he combines youth and skill to influence games at the highest level. His development marks him as one to watch in European football.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 6,
    baselineTests: 3,
    postBaselineTests: 3,
    testingPeriod: "Aug 2025",
    baseline: { totalScore: 73.67, accuracy: 82.0, speed: 90.67 },
    results: { totalScore: 78.33, accuracy: 78.33, speed: 100.0 },
    improvements: [
      { metric: "Total Score", value: "+6.33%", percentage: 6.33 },
      { metric: "Accuracy", value: "-4.47%", percentage: -4.47 },
      { metric: "Speed", value: "+10.29%", percentage: 10.29 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "ao-tanaka",
    name: "Ao Tanaka",
    photo: "/AO TANAKA.jpg",
    sport: "football",
    profession: "Professional Footballer",
    organization: "Leeds United",
    position: "Midfielder",
    achievement: "Japan international",
    description:
      "Tanaka is a Japanese professional footballer who plays as a midfielder for Premier League club Leeds United and the Japan national team.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 9,
    baselineTests: 3,
    postBaselineTests: 6,
    testingPeriod: "Mar 2025 - Apr 2025",
    baseline: { totalScore: 80.0, accuracy: 84.67, speed: 94.67 },
    results: { totalScore: 84.5, accuracy: 86.17, speed: 98.0 },
    improvements: [
      { metric: "Total Score", value: "+5.62%", percentage: 5.62 },
      { metric: "Accuracy", value: "+1.77%", percentage: 1.77 },
      { metric: "Speed", value: "+3.52%", percentage: 3.52 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "fin-baxter",
    name: "Fin Baxter",
    photo: "/Fin Baxter.jpeg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Harlequins",
    position: "Prop",
    achievement: "England U18 captain",
    description:
      "Baxter's rugby journey began at age five before rising through the Harlequins academy and captaining England U18s. He made his senior debut at just 18 and has remained a consistent presence in the first XV. His power, technique, and maturity mark him as one of English rugby's brightest young front-row talents.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 9,
    baselineTests: 3,
    postBaselineTests: 6,
    testingPeriod: "Nov 2023 - Dec 2023",
    baseline: { totalScore: 85.33, accuracy: 85.33, speed: 100.0 },
    results: { totalScore: 90.0, accuracy: 90.67, speed: 99.17 },
    improvements: [
      { metric: "Total Score", value: "+5.47%", percentage: 5.47 },
      { metric: "Accuracy", value: "+6.25%", percentage: 6.25 },
      { metric: "Speed", value: "-0.83%", percentage: -0.83 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "george-pratt",
    name: "George Pratt",
    photo: "/GEORGE PRATT.webp",
    sport: "football",
    profession: "Youth Footballer",
    organization: "Blackburn Rovers U21",
    position: "Youth Prospect",
    achievement: "Rising talent",
    description:
      "Pratt is a rising football talent playing for Blackburn Rovers U21. Known for his speed and tactical awareness, he has made a mark as a performance-focused athlete. His development trajectory signals a bright future in professional football.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 17,
    baselineTests: 3,
    postBaselineTests: 14,
    testingPeriod: "Oct 2024 - Nov 2024",
    baseline: { totalScore: 82.0, accuracy: 86.0, speed: 95.0 },
    results: { totalScore: 86.36, accuracy: 87.71, speed: 98.57 },
    improvements: [
      { metric: "Total Score", value: "+5.31%", percentage: 5.31 },
      { metric: "Accuracy", value: "+1.99%", percentage: 1.99 },
      { metric: "Speed", value: "+3.76%", percentage: 3.76 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "louis-lynagh",
    name: "Louis Lynagh",
    photo: "/Louis Lynagh.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Harlequins",
    position: "Wing",
    achievement: "Italy international",
    description:
      "Lynagh is a dynamic wing who plays for Benetton Rugby and represents Italy in the Six Nations. Known for his pace and finishing ability, he has become a key figure for club and country. His performances continue to elevate him as one of Europe's most exciting wide threats.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 13,
    baselineTests: 3,
    postBaselineTests: 10,
    testingPeriod: "Nov 2023 - Dec 2023",
    baseline: { totalScore: 82.67, accuracy: 82.67, speed: 100.0 },
    results: { totalScore: 86.5, accuracy: 90.0, speed: 96.2 },
    improvements: [
      { metric: "Total Score", value: "+4.64%", percentage: 4.64 },
      { metric: "Accuracy", value: "+8.87%", percentage: 8.87 },
      { metric: "Speed", value: "-3.80%", percentage: -3.8 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "blair-kinghorn",
    name: "Blair Kinghorn",
    photo: "/BLAIR KINGHORN.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Stade Toulousain",
    position: "Utility Back",
    achievement: "42 appearances, 209 points for Toulouse",
    description:
      "Since joining Toulouse in 2023, Kinghorn has featured in 42 appearances, scoring 12 tries and 209 points, with a near-perfect win rate in his starts across the Top 14 and Champions Cup, including key performances in title-winning seasons.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 10,
    baselineTests: 3,
    postBaselineTests: 7,
    testingPeriod: "Feb 2025 - Mar 2025",
    baseline: { totalScore: 82.0, accuracy: 82.33, speed: 99.33 },
    results: { totalScore: 84.86, accuracy: 84.86, speed: 100.0 },
    improvements: [
      { metric: "Total Score", value: "+3.48%", percentage: 3.48 },
      { metric: "Accuracy", value: "+3.07%", percentage: 3.07 },
      { metric: "Speed", value: "+0.67%", percentage: 0.67 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "emma-uren",
    name: "Emma Uren",
    photo: "/EMMA UREN.jpeg",
    sport: "rugby7s",
    profession: "GB7 Womens Rugby 7s",
    organization: "GB7 Womens - Rugby 7s",
    achievement: "Two-time Olympian (Tokyo 2020, Paris 2024)",
    description:
      "Uren is a two-time Olympian whose dynamic rugby career followed a promising junior swimming journey cut short by illness. A former Saracens standout in the Premier 15s, she helped secure Team GB's Tokyo 2020 qualification before finishing fourth at the Games. She returned for Paris 2024, cementing her status as one of Britain's most versatile rugby talents.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 24,
    baselineTests: 3,
    postBaselineTests: 21,
    testingPeriod: "Oct 2024 - Feb 2025",
    baseline: { totalScore: 84.67, accuracy: 84.67, speed: 100.0 },
    results: { totalScore: 87.1, accuracy: 87.57, speed: 99.48 },
    improvements: [
      { metric: "Total Score", value: "+2.87%", percentage: 2.87 },
      { metric: "Accuracy", value: "+3.43%", percentage: 3.43 },
      { metric: "Speed", value: "-0.52%", percentage: -0.52 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "luke-northmore",
    name: "Luke Northmore",
    photo: "/Luke Northmore.jpeg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Harlequins",
    position: "Centre",
    achievement: "Premiership champion 2021",
    description:
      "Northmore began playing at 15 before rising rapidly through Tavistock RFC, Cardiff Met, and into the Premiership with Harlequins. A Premiership champion in 2021, he has earned national squad recognition for his powerful running and defensive reliability. His versatility and consistency make him a major asset in the Quins midfield.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 17,
    baselineTests: 3,
    postBaselineTests: 14,
    testingPeriod: "Nov 2023 - Dec 2023",
    baseline: { totalScore: 76.67, accuracy: 76.67, speed: 100.0 },
    results: { totalScore: 78.79, accuracy: 78.86, speed: 99.93 },
    improvements: [
      { metric: "Total Score", value: "+2.76%", percentage: 2.76 },
      { metric: "Accuracy", value: "+2.86%", percentage: 2.86 },
      { metric: "Speed", value: "-0.07%", percentage: -0.07 },
    ],
    featured: false,
    tier: 2,
    userType: "athlete",
  },
  {
    id: "millie-hammond",
    name: "Millie Hammond",
    sport: "business",
    profession: "Procedural Specialist",
    organization: "Applied Medical",
    achievement: "Dubai Sevens, England Touch Rugby World Cup",
    description:
      "Procedural Specialist at Applied Medical, bachelor of medical science. Long days working in hospitals and training 3x a week having played consecutive years at the Dubai Sevens and represented England for the Touch Rugby World Cup.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 16,
    baselineTests: 3,
    postBaselineTests: 13,
    testingPeriod: "Dec 2024 - Oct 2025",
    baseline: { totalScore: 77.0, accuracy: 77.0, speed: 99.67 },
    results: { totalScore: 78.85, accuracy: 79.23, speed: 99.46 },
    improvements: [
      { metric: "Total Score", value: "+2.40%", percentage: 2.4 },
      { metric: "Accuracy", value: "+2.90%", percentage: 2.9 },
      { metric: "Speed", value: "-0.21%", percentage: -0.21 },
    ],
    featured: true,
    tier: 3,
    userType: "professional",
  },
  {
    id: "lennox-anyanwu",
    name: "Lennox Anyanwu",
    photo: "/Lennox Anyanwu.jpg",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Harlequins",
    position: "Centre",
    achievement: "Premiership regular",
    description:
      "Anyanwu progressed from Harlequins' Elite Player Development Group to a prolific midfield threat known for his decisive running and attacking instincts. After debuting in 2020, he quickly became a reliable contributor at Premiership level. His blend of physicality and creativity makes him a standout centre for Quins.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 15,
    baselineTests: 3,
    postBaselineTests: 12,
    testingPeriod: "Nov 2023 - Dec 2023",
    baseline: { totalScore: 81.33, accuracy: 81.33, speed: 100.0 },
    results: { totalScore: 82.75, accuracy: 88.0, speed: 94.25 },
    improvements: [
      { metric: "Total Score", value: "+1.74%", percentage: 1.74 },
      { metric: "Accuracy", value: "+8.20%", percentage: 8.2 },
      { metric: "Speed", value: "-5.75%", percentage: -5.75 },
    ],
    featured: false,
    tier: 3,
    userType: "athlete",
  },
  {
    id: "charlotte-simpson",
    name: "Dr Charlotte Simpson",
    photo: "/Charlotte SIMPSON.jpg",
    sport: "business",
    profession: "PhD Researcher",
    organization: "University of Cambridge",
    achievement: "Pancreatic cancer researcher",
    description:
      "Researching the role of Group 2 Innate Lymphoid cells in Pancreatic Cancer funded by the PCUK. Long hours of intense focus and cognitive performance is essential.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 11,
    baselineTests: 3,
    postBaselineTests: 8,
    testingPeriod: "Aug 2025 - Oct 2025",
    baseline: { totalScore: 81.67, accuracy: 86.67, speed: 94.67 },
    results: { totalScore: 82.62, accuracy: 82.75, speed: 99.88 },
    improvements: [
      { metric: "Total Score", value: "+1.17%", percentage: 1.17 },
      { metric: "Accuracy", value: "-4.52%", percentage: -4.52 },
      { metric: "Speed", value: "+5.50%", percentage: 5.5 },
    ],
    featured: false,
    tier: 3,
    userType: "professional",
  },
  {
    id: "will-muir",
    name: "Will Muir",
    photo: "/Will Muir.webp",
    sport: "rugby",
    profession: "Professional Rugby Player",
    organization: "Bath Rugby",
    position: "Wing",
    achievement: "Premiership regular",
    description:
      "Muir is a fast and versatile wing for Bath Rugby, known for breaking defensive lines. His blend of speed and rugby IQ makes him a dangerous attacking weapon. Muir consistently shines in Premiership competitions.",
    productVersion: "01",
    protocolUsed: "Resilience Protocol",
    testsCompleted: 41,
    baselineTests: 3,
    postBaselineTests: 38,
    testingPeriod: "Nov 2023 - Nov 2025",
    baseline: { totalScore: 89.67, accuracy: 92.67, speed: 96.67 },
    results: { totalScore: 90.03, accuracy: 91.82, speed: 98.29 },
    improvements: [
      { metric: "Total Score", value: "+0.40%", percentage: 0.4 },
      { metric: "Accuracy", value: "-0.92%", percentage: -0.92 },
      { metric: "Speed", value: "+1.68%", percentage: 1.68 },
    ],
    featured: false,
    tier: 3,
    userType: "athlete",
  },
  {
    id: "alex-lowe",
    name: "Alex Lowe",
    photo: "/Alex Lowe.jpg",
    sport: "business",
    profession: "Commercial Operations Programme Manager",
    organization: "Softcat",
    achievement: "Tech sales leader",
    description:
      "Leading Commercial Operations Programme Management at Softcat plc. University of Leeds graduate, managing a team whilst dealing with constant calls from clients. Managing a healthy social life with drinking and sport.",
    productVersion: "02",
    protocolUsed: "Precision Protocol",
    testsCompleted: 134,
    baselineTests: 3,
    postBaselineTests: 131,
    testingPeriod: "Dec 2023 - Nov 2025",
    baseline: { totalScore: 79.67, accuracy: 83.33, speed: 95.67 },
    results: { totalScore: 79.18, accuracy: 79.31, speed: 99.85 },
    improvements: [
      { metric: "Total Score", value: "-0.61%", percentage: -0.61 },
      { metric: "Accuracy", value: "-4.83%", percentage: -4.83 },
      { metric: "Speed", value: "+4.37%", percentage: 4.37 },
    ],
    featured: false,
    tier: 3,
    userType: "professional",
  },
  {
    id: "ben-cox",
    name: "Ben Cox",
    sport: "business",
    profession: "Account Executive",
    organization: "Revolut",
    description:
      "Account Executive at Revolut, one of the world's leading fintech companies.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 64,
    baselineTests: 3,
    postBaselineTests: 61,
    testingPeriod: "Mar 2026 - Mar 2026",
    baseline: { totalScore: 80.33, accuracy: 91.33, speed: 88.33 },
    results: { totalScore: 89.64, accuracy: 90.11, speed: 99.46 },
    improvements: [
      { metric: "Total Score", value: "+11.58%", percentage: 11.58 },
      { metric: "Accuracy", value: "-1.33%", percentage: -1.33 },
      { metric: "Speed", value: "+12.60%", percentage: 12.6 },
    ],
    featured: true,
    tier: 3,
    userType: "professional",
  },
  {
    id: "doris-regazi",
    name: "Doris Regazi",
    photo: "/caseStudies/DorisRegazi.jpg",
    focalPoint: { x: 50, y: 30 },
    sport: "business",
    profession: "Account Executive",
    organization: "Revolut",
    description:
      "Account Executive at Revolut, one of the world's leading fintech companies.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 17,
    baselineTests: 3,
    postBaselineTests: 14,
    testingPeriod: "Mar 2026",
    baseline: { totalScore: 61.33, accuracy: 66.0, speed: 91.67 },
    results: { totalScore: 80.21, accuracy: 80.93, speed: 99.21 },
    improvements: [
      { metric: "Total Score", value: "+30.78%", percentage: 30.78 },
      { metric: "Accuracy", value: "+22.62%", percentage: 22.62 },
      { metric: "Speed", value: "+8.23%", percentage: 8.23 },
    ],
    featured: false,
    tier: 3,
    userType: "professional",
  },
  /* Uncomment when photo assets are available:
  {
    id: "fred-windsor-lewis",
    name: "Fred Windsor-Lewis",
    sport: "business",
    profession: "Account Executive",
    organization: "Revolut",
    description:
      "Account Executive at Revolut, one of the world's leading fintech companies.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 10,
    baselineTests: 3,
    postBaselineTests: 7,
    testingPeriod: "Mar 2026",
    baseline: { totalScore: 72.33, accuracy: 75.67, speed: 96.0 },
    results: { totalScore: 77.86, accuracy: 77.86, speed: 100.0 },
    improvements: [
      { metric: "Total Score", value: "+7.64%", percentage: 7.64 },
      { metric: "Accuracy", value: "+2.89%", percentage: 2.89 },
      { metric: "Speed", value: "+4.17%", percentage: 4.17 },
    ],
    featured: false,
    tier: 3,
    userType: "professional",
  },
  {
    id: "alessandro-ventura",
    name: "Alessandro Ventura",
    sport: "business",
    profession: "Account Executive",
    organization: "Revolut",
    description:
      "Account Executive at Revolut, one of the world's leading fintech companies.",
    productVersion: "both",
    protocolUsed: "Balance Protocol",
    testsCompleted: 8,
    baselineTests: 3,
    postBaselineTests: 5,
    testingPeriod: "Mar 2026",
    baseline: { totalScore: 86.0, accuracy: 88.0, speed: 97.67 },
    results: { totalScore: 88.0, accuracy: 89.0, speed: 99.2 },
    improvements: [
      { metric: "Total Score", value: "+2.33%", percentage: 2.33 },
      { metric: "Accuracy", value: "+1.14%", percentage: 1.14 },
      { metric: "Speed", value: "+1.57%", percentage: 1.57 },
    ],
    featured: false,
    tier: 3,
    userType: "professional",
  },
  */
  {
    id: "liz-glover",
    name: "Liz Glover",
    sport: "business",
    profession: "Retired Banker",
    organization: "",
    description:
      "Retired banking professional using CONKA to maintain and improve cognitive performance.",
    productVersion: "02",
    testsCompleted: 20,
    baselineTests: 3,
    postBaselineTests: 17,
    testingPeriod: "Sep 2024 - Mar 2026",
    baseline: { totalScore: 51.0, accuracy: 73.33, speed: 69.33 },
    results: { totalScore: 73.35, accuracy: 83.59, speed: 87.82 },
    improvements: [
      { metric: "Total Score", value: "+43.83%", percentage: 43.83 },
      { metric: "Accuracy", value: "+13.98%", percentage: 13.98 },
      { metric: "Speed", value: "+26.67%", percentage: 26.67 },
    ],
    featured: true,
    tier: 3,
    userType: "professional",
  },
];

// ===== HELPER FUNCTIONS =====

export function getAthleteById(id: string): AthleteData | undefined {
  return athletes.find((athlete) => athlete.id === id);
}

export function getFeaturedAthletes(): AthleteData[] {
  return athletes.filter((athlete) => athlete.featured);
}

export function getTier1Athletes(): AthleteData[] {
  return athletes.filter((athlete) => athlete.tier === 1);
}

export function getTier2Athletes(): AthleteData[] {
  return athletes.filter((athlete) => athlete.tier === 2);
}

export function getAthletesBySport(sport: SportCategory): AthleteData[] {
  return athletes.filter((athlete) => athlete.sport === sport);
}

export function getAllSports(): SportCategory[] {
  const sports = new Set(athletes.map((athlete) => athlete.sport));
  return Array.from(sports);
}

export function getAthletesByProductVersion(
  version: "01" | "02" | "both",
): AthleteData[] {
  return athletes.filter(
    (athlete) =>
      athlete.productVersion === version || athlete.productVersion === "both",
  );
}

export function getAverageImprovement(athlete: AthleteData): number {
  const totalImprovement = athlete.improvements.find(
    (i) => i.metric === "Total Score",
  );
  return totalImprovement ? totalImprovement.percentage : 0;
}

export function getHomepageAthletes(): AthleteData[] {
  return athletes
    .filter((a) => a.tier === 1)
    .sort((a, b) => getAverageImprovement(b) - getAverageImprovement(a))
    .slice(0, 4);
}

export function getAthletesForFormula(formulaId: "01" | "02"): AthleteData[] {
  const filtered = athletes
    .filter(
      (a) => a.productVersion === formulaId || a.productVersion === "both",
    )
    .sort((a, b) => getAverageImprovement(b) - getAverageImprovement(a));

  // Fallback to default athletes if we don't have 3
  // Append defaults one by one in order: Callum Sheedy, Jade Shekells, Finn Russell
  if (filtered.length < 3) {
    const defaultIds = ["callum-sheedy", "jade-shekells", "finn-russell"];
    const combined = [...filtered];
    
    // Add defaults one by one until we have 3 total, avoiding duplicates
    for (const defaultId of defaultIds) {
      if (combined.length >= 3) break;
      const defaultAthlete = athletes.find((a) => a.id === defaultId);
      if (defaultAthlete && !combined.find((c) => c.id === defaultAthlete.id)) {
        combined.push(defaultAthlete);
      }
    }
    
    return combined.slice(0, 3);
  }

  return filtered.slice(0, 3);
}

export function getAthletesForProtocol(protocolId: string): AthleteData[] {
  const protocolToFormula: Record<string, "01" | "02" | "both"> = {
    "1": "01",
    "2": "02",
    "3": "both",
    "4": "both",
  };

  const formulaPreference = protocolToFormula[protocolId];
  const filtered = athletes
    .filter((a) => {
      if (formulaPreference === "both") {
        return a.productVersion === "both";
      }
      return (
        a.productVersion === formulaPreference || a.productVersion === "both"
      );
    })
    .sort((a, b) => {
      const aTotal =
        a.improvements.find((i) => i.metric === "Total Score")?.percentage || 0;
      const bTotal =
        b.improvements.find((i) => i.metric === "Total Score")?.percentage || 0;
      return bTotal - aTotal;
    });

  // Fallback to default athletes if we don't have 3
  // Append defaults one by one in order: Callum Sheedy, Jade Shekells, Finn Russell
  if (filtered.length < 3) {
    const defaultIds = ["callum-sheedy", "jade-shekells", "finn-russell"];
    const combined = [...filtered];
    
    // Add defaults one by one until we have 3 total, avoiding duplicates
    for (const defaultId of defaultIds) {
      if (combined.length >= 3) break;
      const defaultAthlete = athletes.find((a) => a.id === defaultId);
      if (defaultAthlete && !combined.find((c) => c.id === defaultAthlete.id)) {
        combined.push(defaultAthlete);
      }
    }
    
    return combined.slice(0, 3);
  }

  return filtered.slice(0, 3);
}

export function getTotalTestsCompleted(): number {
  return athletes.reduce((sum, a) => sum + a.testsCompleted, 0);
}

export function getAverageImprovementAcrossAll(): number {
  const improvements = athletes
    .map((a) => getAverageImprovement(a))
    .filter((i) => i > 0);
  return improvements.reduce((sum, i) => sum + i, 0) / improvements.length;
}
