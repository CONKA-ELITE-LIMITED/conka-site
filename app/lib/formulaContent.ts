/**
 * Formula content and struggle-related types/data.
 */
import type { FormulaId } from "./productTypes";

export interface Ingredient {
  name: string;
  part: string;
  percentage: string;
}

export interface ClinicalResult {
  metric: string;
  value: string;
  pValue: string;
  gender: "men" | "women" | "all";
}

export interface FormulaBenefit {
  title: string;
  stat: string;
  annotation: string;
  description: string;
}

// ===== STRUGGLE SOLUTIONS =====

export type StruggleId =
  | "sleep"
  | "energy"
  | "crashing"
  | "stress"
  | "anxiety"
  | "focus";

export interface RadarDataPoint {
  category: string;
  before: number;
  during: number;
  after: number;
}

export interface ClinicalStudy {
  id: string;
  name: string;
  professor: string;
  university: string;
  year: number;
  abstract: string;
  participants: {
    total: number;
    ageRange: string;
    genderSplit: string;
    conditions?: string;
  };
  duration: string;
  results: {
    metric: string;
    value: string;
    pValue: string;
    description: string;
  }[];
  conclusion: string;
}

export interface StruggleSolution {
  id: StruggleId;
  title: string;
  question: string;
  struggle: string; // The felt problem (1–2 sentences)
  outcome: string; // The felt result in plain English
  description: string; // Mechanism/how it works
  researchExplanation: string;
  stat: string;
  statLabel: string;
  radarData: RadarDataPoint[];
  keyIngredients: string[];
  ingredientAsset: {
    image: string; // path e.g. "/ingredients/flow/lemon-balm.webp"
    name: string; // e.g. "Lemon Balm Extract" or "Ashwagandha"
    dosage: string; // e.g. "300mg per serving"
  };
  clinicalStudy: ClinicalStudy;
}

export interface FormulaContent {
  id: FormulaId;
  name: string;
  tagline: string;
  theme: "light" | "dark";
  accentColor: "teal" | "amber";
  patent?: string;
  headline: string;
  subheadline: string;
  annotation: string;
  positioning: string; // "ENERGY" or "CLARITY"
  whenToTake: string;
  ingredients: Ingredient[];
  taste: string;
  benefits: FormulaBenefit[];
  clinicalResults: ClinicalResult[];
  keyPoints: string[];
  faq: { question: string; answer: string }[];
  struggleSolutions: Record<StruggleId, StruggleSolution>;
}

export const formulaContent: Record<FormulaId, FormulaContent> = {
  "01": {
    id: "01",
    name: "CONKA Flow",
    tagline: "Sharper focus. Calmer energy.",
    theme: "light",
    accentColor: "teal",
    patent: "Patented: GB2629279",
    headline:
      "Sharpen focus and sustain mental clarity through the day. Powered by 6 clinically-dosed adaptogens in a fast-absorbing liquid shot, with zero caffeine and zero crash. Informed Sport certified, and trackable in the CONKA app so you can see it working.",
    subheadline: "Designed for daily cognitive enhancement",
    annotation: "your daily foundation",
    positioning: "ENERGY",
    whenToTake:
      "Best taken in the morning with or without food. Perfect as a coffee replacement for sustained energy throughout the day.",
    ingredients: [
      { name: "Lemon Balm", part: "Leaves", percentage: "26.7%" },
      { name: "Turmeric", part: "Root", percentage: "25.4%" },
      { name: "Ashwagandha", part: "Plant", percentage: "26.7%" },
      { name: "Rhodiola rosea", part: "Root", percentage: "9.4%" },
      { name: "Bilberry", part: "Berries", percentage: "9.4%" },
      { name: "Black Pepper", part: "Root", percentage: "0.5%" },
    ],
    taste: "Honey + Citrus with a hint of turmeric",
    benefits: [
      {
        title: "Improved Focus",
        stat: "+18%",
        annotation: "PMID: 12888775 — Lemon Balm",
        description: "Enhanced memory & concentration without stimulants",
      },
      {
        title: "Better Sleep Quality",
        stat: "+42%",
        annotation: "PMID: 32021735 — Ashwagandha",
        description: "Improved sleep quality and reduced cortisol",
      },
      {
        title: "Stress Resilience",
        stat: "-56%",
        annotation: "PMID: 23439798 — Ashwagandha",
        description: "Significant reduction in stress assessment scores",
      },
      {
        title: "Sustained Energy",
        stat: "+17%",
        annotation: "PMID: 10839209 — Rhodiola",
        description: "Improved physical fitness and mental performance",
      },
    ],
    clinicalResults: [
      {
        metric: "Memory Performance",
        value: "+18%",
        pValue: "P<0.05",
        gender: "all",
      },
      { metric: "Calmness", value: "+15%", pValue: "P<0.05", gender: "all" },
      {
        metric: "Sleep Quality",
        value: "+42%",
        pValue: "P<0.05",
        gender: "all",
      },
      {
        metric: "Stress Scores",
        value: "-56%",
        pValue: "P<0.0001",
        gender: "all",
      },
      {
        metric: "Serum Cortisol",
        value: "-28%",
        pValue: "P=0.0006",
        gender: "all",
      },
      {
        metric: "Physical Fitness",
        value: "+17%",
        pValue: "P<0.05",
        gender: "all",
      },
    ],
    keyPoints: [
      "No caffeine - won't affect sleep",
      "Adaptogen-powered stress response",
      "Sustained energy without crashes",
      "Improved motivation throughout the day",
    ],
    faq: [
      {
        question: "When should I take CONKA Flow?",
        answer:
          "CONKA Flow is best taken in the morning with or without food. It's designed as a coffee replacement that provides sustained energy without caffeine.",
      },
      {
        question: "Will CONKA Flow affect my sleep?",
        answer:
          "No. CONKA Flow is completely caffeine-free and actually helps improve sleep quality by +42% according to a peer-reviewed study on Ashwagandha (PMID: 32021735).",
      },
      {
        question: "How long until I see results?",
        answer:
          "Most users report noticeable improvements in focus and energy within the first week. Full benefits typically develop over 2-4 weeks of consistent use.",
      },
      {
        question: "Can I take CONKA Flow with coffee?",
        answer:
          "Yes, but we recommend using CONKA Flow as a coffee replacement. The adaptogens provide sustained energy without the crash that caffeine causes.",
      },
    ],
    struggleSolutions: {
      sleep: {
        id: "sleep",
        title: "Better Sleep Quality",
        question: "Struggling with sleep?",
        struggle: "Lying awake replaying your day? Your nervous system won't switch off.",
        outcome: "Fall asleep faster. Stay asleep longer. Wake up actually rested, not just less tired.",
        description: "Reduce cortisol levels and calm the nervous system for improved sleep quality",
        researchExplanation:
          "Ashwagandha and Lemon Balm work synergistically to reduce cortisol levels and calm the nervous system. Clinical trials show Ashwagandha root extract significantly improved stress resistance, self-assessed quality of life, and reduced serum cortisol levels, leading to improved sleep quality.",
        stat: "+42%",
        statLabel: "improvement in sleep quality",
        radarData: [
          { category: "Sleep Quality", before: 12, during: 24, after: 38 },
          { category: "REM Duration", before: 12, during: 22, after: 35 },
          { category: "Sleep Onset", before: 12, during: 20, after: 32 },
          { category: "Night Waking", before: 12, during: 18, after: 28 },
          { category: "Morning Energy", before: 12, during: 25, after: 40 },
          { category: "Recovery", before: 12, during: 22, after: 36 },
        ],
        keyIngredients: ["Ashwagandha", "Lemon Balm", "Rhodiola rosea"],
        ingredientAsset: {
          image: "/ingredients/flow/ashwagandha.webp",
          name: "Ashwagandha",
          dosage: "600mg per serving",
        },
        clinicalStudy: {
          id: "sleep-ashwagandha-2019",
          name: "Adaptogenic and Anxiolytic Effects of Ashwagandha Root Extract in Healthy Adults",
          professor: "Salve J, Pate S, Debnath K, Langade D",
          university: "D.Y. Patil University",
          year: 2019,
          abstract:
            "A double-blind, randomized, placebo-controlled clinical study investigating Ashwagandha root extract's effects on stress resistance, quality of life, and sleep quality in healthy adults.",
          participants: {
            total: 58,
            ageRange: "18-65 years",
            genderSplit: "Healthy adults",
            conditions: "No diagnosed sleep disorders",
          },
          duration: "8 weeks",
          results: [
            {
              metric: "Sleep Quality",
              value: "+42%",
              pValue: "P<0.05",
              description: "Significant improvement in sleep quality scores",
            },
            {
              metric: "Morning Cortisol",
              value: "-23%",
              pValue: "P<0.05",
              description: "Reduced serum cortisol levels",
            },
            {
              metric: "Stress Resistance",
              value: "+35%",
              pValue: "P<0.05",
              description: "Improved adaptogenic response",
            },
            {
              metric: "Quality of Life",
              value: "+20%",
              pValue: "P<0.05",
              description: "Self-assessed improvement",
            },
          ],
          conclusion:
            "Ashwagandha extract significantly improved sleep quality by reducing cortisol and enhancing stress resistance. PMID: 32021735",
        },
      },
      energy: {
        id: "energy",
        title: "Sustained Energy",
        question: "Need more energy?",
        struggle: "Hitting a wall by 2pm? Your body's energy systems are running on empty.",
        outcome: "Sustained focus without crashes. Power through demanding periods. Your energy works for you, not against you.",
        description: "Optimize energy production at the cellular level without stimulants",
        researchExplanation:
          "Rather than stimulating your nervous system like caffeine, adaptogens like Rhodiola rosea optimize your body's energy production at the cellular level. Clinical trials show it exerts an anti-fatigue effect that increases mental performance and decreases cortisol response to awakening stress.",
        stat: "+17%",
        statLabel: "physical fitness improvement",
        radarData: [
          { category: "Energy Levels", before: 12, during: 26, after: 42 },
          { category: "Endurance", before: 12, during: 22, after: 35 },
          { category: "Recovery", before: 12, during: 20, after: 32 },
          { category: "Motivation", before: 12, during: 24, after: 38 },
          { category: "Stamina", before: 12, during: 21, after: 34 },
          { category: "Vitality", before: 12, during: 23, after: 36 },
        ],
        keyIngredients: ["Rhodiola rosea", "Ashwagandha", "Turmeric"],
        ingredientAsset: {
          image: "/ingredients/flow/rhodiola.webp",
          name: "Rhodiola rosea",
          dosage: "576mg per serving",
        },
        clinicalStudy: {
          id: "energy-rhodiola-2000",
          name: "Stimulating and Adaptogenic Effect of Rhodiola rosea SHR-5 Extract on Student Fatigue",
          professor:
            "Spasov AA, Wikman GK, Mandrikov VB, Mironova IA, Neumoin VV",
          university: "Volgograd Medical Academy",
          year: 2000,
          abstract:
            "A double-blind, placebo-controlled pilot study of the stimulating and adaptogenic effect of Rhodiola rosea SHR-5 extract on the fatigue of students caused by stress during an examination period.",
          participants: {
            total: 40,
            ageRange: "19-21 years",
            genderSplit: "Students under exam stress",
            conditions: "Healthy students during examination period",
          },
          duration: "20 days",
          results: [
            {
              metric: "Physical Fitness",
              value: "+17%",
              pValue: "P<0.05",
              description: "Improved physical fitness index",
            },
            {
              metric: "Mental Performance",
              value: "+12%",
              pValue: "P<0.05",
              description: "Enhanced cognitive performance",
            },
            {
              metric: "General Well-being",
              value: "+9%",
              pValue: "P<0.05",
              description: "Improved subjective well-being",
            },
            {
              metric: "Psychomotor Function",
              value: "+15%",
              pValue: "P<0.05",
              description: "Enhanced coordination and reaction",
            },
          ],
          conclusion:
            "Rhodiola rosea significantly improved physical fitness, psychomotor function, mental performance and general well-being during stressful periods. PMID: 10839209",
        },
      },
      crashing: {
        id: "crashing",
        title: "No More Crashes",
        question: "Crashing mid-day?",
        struggle: "That 3pm wall hits hard? Your cortisol and blood sugar are out of sync.",
        outcome: "Steady energy all day. No afternoon crashes. Your body maintains balance, not chaos.",
        description: "Regulate cortisol levels and support healthy insulin sensitivity",
        researchExplanation:
          "The afternoon crash is often caused by cortisol dysregulation and blood sugar instability. Rhodiola rosea exerts an anti-fatigue effect that increases mental performance and decreases cortisol response. Ashwagandha helps normalize cortisol patterns while Turmeric supports healthy insulin sensitivity.",
        stat: "-28%",
        statLabel: "reduction in burnout scores",
        radarData: [
          { category: "Energy Stability", before: 12, during: 28, after: 45 },
          { category: "Afternoon Focus", before: 12, during: 25, after: 40 },
          { category: "Blood Sugar", before: 12, during: 22, after: 35 },
          { category: "Cortisol Balance", before: 12, during: 24, after: 38 },
          { category: "Mental Clarity", before: 12, during: 21, after: 34 },
          { category: "Mood Stability", before: 12, during: 23, after: 36 },
        ],
        keyIngredients: ["Ashwagandha", "Turmeric", "Rhodiola rosea"],
        ingredientAsset: {
          image: "/ingredients/flow/ashwagandha.webp",
          name: "Ashwagandha",
          dosage: "600mg per serving",
        },
        clinicalStudy: {
          id: "crash-rhodiola-2009",
          name: "Rhodiola rosea in the Treatment of Stress-Related Fatigue",
          professor: "Olsson EM, von Schéele B, Panossian AG",
          university: "Swedish Herbal Institute Research & Development",
          year: 2009,
          abstract:
            "A randomized, double-blind, placebo-controlled, parallel-group study of the standardised extract SHR-5 of the roots of Rhodiola rosea in the treatment of subjects with stress-related fatigue.",
          participants: {
            total: 60,
            ageRange: "20-55 years",
            genderSplit: "Individuals with fatigue syndrome",
            conditions: "Stress-related fatigue, burnout symptoms",
          },
          duration: "28 days",
          results: [
            {
              metric: "Burnout Scale",
              value: "-28%",
              pValue: "P<0.05",
              description: "Pines' burnout scale improvement",
            },
            {
              metric: "Attention (Errors)",
              value: "-22%",
              pValue: "P<0.05",
              description: "Reduced omission errors",
            },
            {
              metric: "Cortisol Response",
              value: "-18%",
              pValue: "P<0.05",
              description: "Improved awakening cortisol",
            },
            {
              metric: "Mental Performance",
              value: "+20%",
              pValue: "P<0.05",
              description: "Concentration improvement",
            },
          ],
          conclusion:
            "Rhodiola rosea exerts an anti-fatigue effect that increases mental performance and decreases cortisol response to awakening stress in burnout patients. PMID: 19016404",
        },
      },
      stress: {
        id: "stress",
        title: "Stress Resilience",
        question: "Feeling stressed?",
        struggle: "One bad email ruins your whole morning? Stress shouldn't control your day.",
        outcome: "Pressure doesn't rattle you. Deadlines don't drain you. You respond, you don't react.",
        description: "Reduce cortisol and build natural stress resistance",
        researchExplanation:
          "Adaptogens work by modulating the HPA axis—your body's stress response system. A prospective, randomized double-blind, placebo-controlled study showed Ashwagandha significantly reduces stress scores and serum cortisol levels in chronically stressed adults.",
        stat: "-56%",
        statLabel: "reduction in stress scores",
        radarData: [
          { category: "Stress Response", before: 12, during: 26, after: 42 },
          { category: "Cortisol Levels", before: 12, during: 24, after: 40 },
          { category: "Resilience", before: 12, during: 22, after: 36 },
          { category: "Calm Focus", before: 12, during: 25, after: 38 },
          { category: "Recovery Speed", before: 12, during: 21, after: 34 },
          { category: "Emotional Balance", before: 12, during: 23, after: 37 },
        ],
        keyIngredients: ["Ashwagandha", "Rhodiola rosea", "Lemon Balm"],
        ingredientAsset: {
          image: "/ingredients/flow/ashwagandha.webp",
          name: "Ashwagandha",
          dosage: "600mg per serving",
        },
        clinicalStudy: {
          id: "stress-ashwagandha-2012",
          name: "Safety and Efficacy of Ashwagandha Root Extract in Reducing Stress and Anxiety",
          professor: "Chandrasekhar K, Kapoor J, Anishetty S",
          university: "Asha Hospital",
          year: 2012,
          abstract:
            "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults.",
          participants: {
            total: 64,
            ageRange: "18-54 years",
            genderSplit: "Subjects with history of chronic stress",
            conditions: "Chronic stress, no psychiatric medication",
          },
          duration: "60 days",
          results: [
            {
              metric: "Stress Assessment",
              value: "-56%",
              pValue: "P<0.0001",
              description: "Significant reduction in stress scores",
            },
            {
              metric: "Serum Cortisol",
              value: "-28%",
              pValue: "P=0.0006",
              description: "Substantial decrease in cortisol",
            },
            {
              metric: "Anxiety Scores",
              value: "-44%",
              pValue: "P<0.0001",
              description: "Hamilton Anxiety Scale",
            },
            {
              metric: "Quality of Life",
              value: "+28%",
              pValue: "P<0.05",
              description: "Self-assessed improvement",
            },
          ],
          conclusion:
            "High-concentration full-spectrum Ashwagandha root extract safely and effectively improves resistance towards stress and improves self-assessed quality of life. PMID: 23439798",
        },
      },
      anxiety: {
        id: "anxiety",
        title: "Reduced Anxiety",
        question: "Dealing with anxiety?",
        struggle: "Mind racing, can't settle? Your nervous system is stuck in overdrive.",
        outcome: "Quiet the mental chaos. Feel grounded, not wired. Calm without sedation, clarity without fog.",
        description: "Act on GABA receptors to promote calm without sedation",
        researchExplanation:
          "Lemon Balm acts on GABA receptors to promote calm without sedation. In a randomized, double-blind, placebo-controlled crossover study, the 600mg dose ameliorated negative effects of stress on anxiety ratings in healthy volunteers.",
        stat: "-28%",
        statLabel: "reduction in anxiety ratings",
        radarData: [
          { category: "Calm State", before: 12, during: 27, after: 44 },
          { category: "Mental Clarity", before: 12, during: 24, after: 38 },
          { category: "Social Ease", before: 12, during: 22, after: 35 },
          { category: "Physical Calm", before: 12, during: 25, after: 40 },
          { category: "Sleep Quality", before: 12, during: 23, after: 36 },
          { category: "Focus", before: 12, during: 21, after: 34 },
        ],
        keyIngredients: ["Lemon Balm", "Ashwagandha", "Rhodiola rosea"],
        ingredientAsset: {
          image: "/ingredients/flow/lemon-balm.webp",
          name: "Lemon Balm Extract",
          dosage: "300mg per serving",
        },
        clinicalStudy: {
          id: "anxiety-lemonbalm-2006",
          name: "Anxiolytic Effects of Melissa officinalis During Laboratory Induced Stress",
          professor: "Kennedy DO, Little W, Haskell CF, Scholey AB",
          university: "Northumbria University",
          year: 2006,
          abstract:
            "A randomized, double-blind, placebo-controlled, balanced cross-over study investigating the anxiolytic effects of Lemon Balm during laboratory-induced stress in healthy volunteers.",
          participants: {
            total: 24,
            ageRange: "18-35 years",
            genderSplit: "Healthy volunteers",
            conditions: "Laboratory-induced stress protocol",
          },
          duration: "Single doses with 7-day washout",
          results: [
            {
              metric: "Anxiety Ratings",
              value: "-28%",
              pValue: "P<0.05",
              description: "600mg dose significantly reduced anxiety",
            },
            {
              metric: "Alertness",
              value: "+5%",
              pValue: "P<0.05",
              description: "Maintained alertness despite stress",
            },
            {
              metric: "Calmness",
              value: "+15%",
              pValue: "P<0.05",
              description: "Increased calmness ratings",
            },
            {
              metric: "Stress Response",
              value: "-18%",
              pValue: "P<0.05",
              description: "Attenuated stress effects",
            },
          ],
          conclusion:
            "The 600mg dose of Lemon Balm ameliorated the negative effects of laboratory-induced psychological stress on anxiety ratings. PMID: 16444660",
        },
      },
      focus: {
        id: "focus",
        title: "Enhanced Focus",
        question: "Can't concentrate?",
        struggle: "Can't stay locked in for more than 20 minutes? Your brain needs fuel, not stimulants.",
        outcome: "Sustained concentration without the jittery edge. Think clearly under pressure. Remember what you read the first time.",
        description: "Balance alertness with tranquility for sustained concentration",
        researchExplanation:
          "Lemon Balm modulates mood and cognitive performance through CNS nicotinic and muscarinic receptor-binding properties. Turmeric's curcumin improves cerebral blood flow and enhances neuroplasticity through BDNF production.",
        stat: "+18%",
        statLabel: "improvement in memory performance",
        radarData: [
          { category: "Concentration", before: 12, during: 28, after: 45 },
          { category: "Attention Span", before: 12, during: 25, after: 40 },
          { category: "Mental Clarity", before: 12, during: 24, after: 38 },
          { category: "Task Switching", before: 12, during: 22, after: 35 },
          { category: "Working Memory", before: 12, during: 21, after: 34 },
          { category: "Processing Speed", before: 12, during: 26, after: 42 },
        ],
        keyIngredients: ["Lemon Balm", "Turmeric", "Bilberry"],
        ingredientAsset: {
          image: "/ingredients/flow/lemon-balm.webp",
          name: "Lemon Balm Extract",
          dosage: "300mg per serving",
        },
        clinicalStudy: {
          id: "focus-lemonbalm-2003",
          name: "Modulation of Mood and Cognitive Performance Following Acute Lemon Balm Administration",
          professor:
            "Kennedy DO, Wake G, Savelev S, Tildesley NTJ, Perry EK, Wesnes KA, Scholey AB",
          university: "Northumbria University",
          year: 2003,
          abstract:
            "A randomized, placebo-controlled, double-blind, balanced crossover study investigating the effects of single doses of Lemon Balm on mood and cognitive performance.",
          participants: {
            total: 20,
            ageRange: "18-35 years",
            genderSplit: "Healthy young adults",
            conditions: "No cognitive impairment",
          },
          duration: "Single doses with 7-day intervals",
          results: [
            {
              metric: "Memory Performance",
              value: "+18%",
              pValue: "P<0.05",
              description: "Significant improvement at 1600mg",
            },
            {
              metric: "Calmness",
              value: "+15%",
              pValue: "P<0.05",
              description: "Increased at all post-dose time points",
            },
            {
              metric: "Alertness",
              value: "+8%",
              pValue: "P<0.05",
              description: "Maintained with 600mg dose",
            },
            {
              metric: "Speed of Attention",
              value: "+12%",
              pValue: "P<0.05",
              description: "Faster attention deployment",
            },
          ],
          conclusion:
            "Lemon Balm improved memory performance and increased calmness, suggesting potential value in treatment of cognitive decline. PMID: 12888775",
        },
      },
    },
  },
  "02": {
    id: "02",
    name: "CONKA Clear",
    tagline: "Sharper recall. Faster thinking.",
    theme: "light",
    accentColor: "amber",
    headline:
      "Cut through brain fog and think clearly under pressure. Powered by 10 clinically-dosed nootropics in a 30ml liquid shot, including Alpha GPC and Ginkgo Biloba for cerebral blood flow. Informed Sport certified, and trackable in the CONKA app.",
    subheadline: "Strategic enhancement for high-stakes moments",
    annotation: "your competitive edge",
    positioning: "CLARITY",
    whenToTake:
      "Best taken 30-60 minutes before you need peak performance, or in the afternoon to support decision-making and recovery.",
    ingredients: [
      { name: "Vitamin C", part: "", percentage: "50.46%" },
      { name: "Alpha GPC", part: "Seeds", percentage: "16.11%" },
      { name: "Glutathione", part: "Amino acid", percentage: "10.07%" },
      { name: "N-Acetyl Cysteine", part: "Amino acid", percentage: "10.07%" },
      { name: "Acetyl-L-Carnitine", part: "Amino acid", percentage: "5.04%" },
      { name: "Ginkgo Biloba", part: "Leaves", percentage: "3.02%" },
      { name: "Lecithin", part: "Seeds", percentage: "1.51%" },
      {
        name: "Lemon essential oil",
        part: "natural flavouring",
        percentage: "0.60%",
      },
      {
        name: "Alpha Lipoic Acid (ALA)",
        part: "Fatty acid",
        percentage: "0.20%",
      },
      {
        name: "Vitamin B12",
        part: "(bacterial fermentation)",
        percentage: "0.03%",
      },
    ],
    taste: "Lemons",
    benefits: [
      {
        title: "Memory & Attention",
        stat: "+63%",
        annotation: "PMID: 29246725 — Curcumin (UCLA)",
        description: "Significant improvement in memory and attention",
      },
      {
        title: "Brain Blood Flow",
        stat: "+57%",
        annotation: "PMID: 21802920 — Ginkgo Biloba",
        description: "Enhanced cerebral blood flow to key regions",
      },
      {
        title: "Mental Detox",
        stat: "+40%",
        annotation: "PMID: 29559699 — Glutathione",
        description: "Increased blood glutathione & immune function",
      },
      {
        title: "Reduced Anxiety",
        stat: "-42%",
        annotation: "PMID: 25688638 — Vitamin C",
        description: "Significant anxiety reduction under stress",
      },
    ],
    clinicalResults: [
      {
        metric: "Memory (SRT)",
        value: "+63%",
        pValue: "P<0.0001",
        gender: "all",
      },
      { metric: "Attention", value: "+96%", pValue: "P<0.0001", gender: "all" },
      {
        metric: "Cerebral Blood Flow",
        value: "+57%",
        pValue: "P<0.05",
        gender: "all",
      },
      {
        metric: "Blood Glutathione",
        value: "+40%",
        pValue: "P<0.05",
        gender: "all",
      },
      {
        metric: "Anxiety Scores",
        value: "-42%",
        pValue: "P<0.01",
        gender: "all",
      },
      {
        metric: "Physical Fatigue",
        value: "-30%",
        pValue: "P<0.01",
        gender: "all",
      },
    ],
    keyPoints: [
      "Eliminates brain fog",
      "Enhanced blood flow to the brain",
      "Improved neurotransmission",
      "Better decision making",
    ],
    faq: [
      {
        question: "When should I take CONKA Clear?",
        answer:
          "CONKA Clear is best taken 30-60 minutes before you need peak performance, such as important meetings, competitions, or creative work. It's also effective in the afternoon for recovery.",
      },
      {
        question: "How is CONKA Clear different from CONKA Flow?",
        answer:
          "CONKA Flow focuses on daily energy and stress resilience with adaptogens. CONKA Clear is designed for peak mental performance with nootropics that enhance clarity, reaction time, and decision-making.",
      },
      {
        question: "Can I take CONKA Clear every day?",
        answer:
          "Yes, CONKA Clear can be taken daily. Many users pair it with CONKA Flow as part of a protocol for comprehensive cognitive support.",
      },
      {
        question: "Will CONKA Clear help with brain fog?",
        answer:
          "Yes, CONKA Clear is specifically formulated to eliminate brain fog through enhanced blood flow to the brain and improved neurotransmission in the frontal cortex.",
      },
    ],
    struggleSolutions: {
      sleep: {
        id: "sleep",
        title: "Recovery Sleep",
        question: "Need better recovery?",
        struggle: "Waking up foggy despite sleeping? Your brain's cleanup system isn't working.",
        outcome: "Wake up with a clear head. Deep recovery sleep. Your brain cleans house while you rest.",
        description: "Clear cellular waste and keep your brain responsive",
        researchExplanation:
          "Quality sleep requires efficient neural repair and detoxification. Oral glutathione supplementation enhances systemic glutathione levels and supports immune function, both critical for restorative sleep and cognitive recovery.",
        stat: "+40%",
        statLabel: "increase in blood glutathione",
        radarData: [
          { category: "Sleep Recovery", before: 12, during: 26, after: 42 },
          { category: "Neural Repair", before: 12, during: 24, after: 38 },
          { category: "REM Quality", before: 12, during: 22, after: 35 },
          { category: "Brain Detox", before: 12, during: 25, after: 40 },
          { category: "Morning Clarity", before: 12, during: 28, after: 45 },
          {
            category: "Memory Consolidation",
            before: 12,
            during: 23,
            after: 36,
          },
        ],
        keyIngredients: ["Glutathione", "N-Acetyl Cysteine", "Alpha GPC"],
        ingredientAsset: {
          image: "/ingredients/clear/glutathione.webp",
          name: "Reduced Glutathione",
          dosage: "250mg per serving",
        },
        clinicalStudy: {
          id: "sleep-glutathione-2018",
          name: "Effect of Oral Glutathione Supplementation on Body Stores",
          professor:
            "Sinha R, Sinha I, Calcagnotto A, Trushin N, Haley JS, Schell TD, Richie JP Jr",
          university: "Penn State University",
          year: 2018,
          abstract:
            "A randomized trial evaluating the effect of oral glutathione supplementation on body stores of GSH and markers of immune function, oxidative stress, and antioxidant defenses.",
          participants: {
            total: 12,
            ageRange: "28-65 years",
            genderSplit: "Healthy adults",
            conditions: "No underlying health conditions",
          },
          duration: "4 weeks",
          results: [
            {
              metric: "Blood Glutathione",
              value: "+40%",
              pValue: "P<0.05",
              description: "Significant increase in GSH stores",
            },
            {
              metric: "NK Cell Activity",
              value: "+100%",
              pValue: "P<0.05",
              description: "Doubled lymphocyte cytotoxicity",
            },
            {
              metric: "Lymphocyte Proliferation",
              value: "+35%",
              pValue: "P<0.05",
              description: "Enhanced immune response",
            },
            {
              metric: "Oxidative Stress",
              value: "-28%",
              pValue: "P<0.05",
              description: "Reduced oxidative markers",
            },
          ],
          conclusion:
            "Oral GSH supplementation significantly increases body compartment stores of GSH and enhances immune function markers. PMID: 29559699",
        },
      },
      energy: {
        id: "energy",
        title: "Mental Energy",
        question: "Need mental energy?",
        struggle: "Brain feels drained before you even start? Your neurons aren't getting enough fuel.",
        outcome: "Sharp mental energy without crashes. Your brain gets the oxygen and nutrients it needs. Think clearly, work longer.",
        description: "Increase cerebral blood flow to deliver oxygen and glucose efficiently",
        researchExplanation:
          "Your brain consumes 20% of your body's energy. Ginkgo biloba significantly increases regional cerebral blood flow in an EEG-controlled, double-blind, placebo-controlled study—boosting the delivery of oxygen and nutrients to the brain.",
        stat: "+57%",
        statLabel: "increase in cerebral blood flow",
        radarData: [
          { category: "Mental Energy", before: 12, during: 30, after: 48 },
          { category: "Brain Blood Flow", before: 12, during: 28, after: 44 },
          {
            category: "Mitochondrial Function",
            before: 12,
            during: 26,
            after: 42,
          },
          { category: "Sustained Focus", before: 12, during: 25, after: 40 },
          { category: "Cognitive Stamina", before: 12, during: 27, after: 43 },
          { category: "Neural Efficiency", before: 12, during: 24, after: 38 },
        ],
        keyIngredients: [
          "Ginkgo Biloba",
          "Acetyl-L-Carnitine",
          "Alpha Lipoic Acid",
        ],
        ingredientAsset: {
          image: "/ingredients/clear/ginkgo.webp",
          name: "Ginkgo Biloba",
          dosage: "120mg per serving",
        },
        clinicalStudy: {
          id: "mental-energy-ginkgo-2003",
          name: "Regional Cerebral Blood Flow After Administration of Ginkgo Biloba",
          professor:
            "Mashayekh A, Pham DL, Yousem DM, Dizon M, Barker PB, Lin DD",
          university: "Johns Hopkins University",
          year: 2003,
          abstract:
            "An EEG-controlled, double-blind, placebo-controlled study to evaluate the acute effect of a single oral dose of Ginkgo biloba on regional cerebral blood flow.",
          participants: {
            total: 9,
            ageRange: "50-80 years",
            genderSplit: "Healthy adults",
            conditions: "No cerebrovascular disease",
          },
          duration: "Single dose + 4-hour measurement",
          results: [
            {
              metric: "Left Parietal Blood Flow",
              value: "+57%",
              pValue: "P<0.05",
              description: "Highest regional increase",
            },
            {
              metric: "Overall Cerebral Flow",
              value: "+38%",
              pValue: "P<0.05",
              description: "Global perfusion increase",
            },
            {
              metric: "Frontal Lobe Flow",
              value: "+29%",
              pValue: "P<0.05",
              description: "Executive function region",
            },
            {
              metric: "Peak Effect Time",
              value: "2.5h",
              pValue: "n/a",
              description: "Maximum effect timing",
            },
          ],
          conclusion:
            "Ginkgo biloba significantly increased regional cerebral blood flow to key brain regions involved in cognitive performance. PMID: 21802920",
        },
      },
      crashing: {
        id: "crashing",
        title: "Sustained Performance",
        question: "Losing steam mid-task?",
        struggle: "Mental performance drops halfway through? Your neurotransmitters are depleting.",
        outcome: "Sustained performance from start to finish. No mid-task crashes. Your brain maintains peak output.",
        description: "Build your brain's core memory machinery with acetylcholine support",
        researchExplanation:
          "Mental crashes often result from acetylcholine depletion. Alpha GPC supplementation increases plasma choline levels within 60 minutes and has been shown to enhance memory performance in cognitive testing.",
        stat: "+18%",
        statLabel: "memory improvement",
        radarData: [
          {
            category: "Performance Duration",
            before: 12,
            during: 30,
            after: 48,
          },
          {
            category: "Cognitive Stability",
            before: 12,
            during: 28,
            after: 45,
          },
          {
            category: "Neurotransmitter Levels",
            before: 12,
            during: 26,
            after: 42,
          },
          {
            category: "Oxidative Protection",
            before: 12,
            during: 25,
            after: 40,
          },
          { category: "Mental Endurance", before: 12, during: 27, after: 44 },
          { category: "Focus Consistency", before: 12, during: 24, after: 38 },
        ],
        keyIngredients: ["Alpha GPC", "Glutathione", "Vitamin C"],
        ingredientAsset: {
          image: "/ingredients/clear/alpha-gpc.webp",
          name: "Alpha GPC",
          dosage: "300mg per serving",
        },
        clinicalStudy: {
          id: "sustained-alphagpc-2023",
          name: "Choline Alphoscerate in Cognitive Decline",
          professor: "De Jesus Moreno Moreno M",
          university: "Hospital Nuestra Señora de la Montaña",
          year: 2003,
          abstract:
            "A multicenter, randomized, double-blind, placebo-controlled trial evaluating the efficacy and tolerability of choline alphoscerate in patients with mild to moderate cognitive decline.",
          participants: {
            total: 261,
            ageRange: "60-80 years",
            genderSplit: "Patients with cognitive decline",
            conditions: "Mild to moderate Alzheimer dementia",
          },
          duration: "180 days",
          results: [
            {
              metric: "ADAS-Cog Score",
              value: "-3.0",
              pValue: "P<0.001",
              description: "Cognitive assessment improvement",
            },
            {
              metric: "MMSE Score",
              value: "+2.0",
              pValue: "P<0.001",
              description: "Mental state examination",
            },
            {
              metric: "GDS Score",
              value: "-1.0",
              pValue: "P<0.001",
              description: "Depression scale improvement",
            },
            {
              metric: "ADAS-Behav",
              value: "-1.5",
              pValue: "P<0.01",
              description: "Behavioral symptoms",
            },
          ],
          conclusion:
            "Choline alphoscerate improved cognitive symptoms in patients with cognitive decline and was well tolerated. PMID: 14600878",
        },
      },
      stress: {
        id: "stress",
        title: "Performance Under Pressure",
        question: "Performing under pressure?",
        struggle: "Pressure makes you crumble? Your brain's energy systems can't keep up.",
        outcome: "Perform your best when it matters most. Maintain clarity under pressure. Your brain works efficiently, not frantically.",
        description: "Enhance mitochondrial efficiency for sustained cognitive performance",
        researchExplanation:
          "High-pressure situations increase oxidative stress and deplete brain energy. Acetyl-L-carnitine optimizes mitochondrial function and provides neuroprotection, maintaining cognitive performance under demanding conditions.",
        stat: "+30%",
        statLabel: "improvement in fatigue resistance",
        radarData: [
          {
            category: "Pressure Performance",
            before: 12,
            during: 28,
            after: 45,
          },
          { category: "Decision Quality", before: 12, during: 26, after: 42 },
          { category: "Stress Resistance", before: 12, during: 25, after: 40 },
          { category: "Mental Clarity", before: 12, during: 27, after: 44 },
          { category: "Reaction Time", before: 12, during: 30, after: 48 },
          { category: "Error Rate", before: 12, during: 24, after: 38 },
        ],
        keyIngredients: ["Acetyl-L-Carnitine", "Alpha GPC", "Glutathione"],
        ingredientAsset: {
          image: "/ingredients/clear/alcar.webp",
          name: "Acetyl-L-Carnitine",
          dosage: "500mg per serving",
        },
        clinicalStudy: {
          id: "pressure-alcar-2007",
          name: "Acetyl-L-Carnitine and Chronic Fatigue Syndrome",
          professor:
            "Malaguarnera M, Gargante MP, Cristaldi E, Colonna V, Messano M, Koverech A, Neri S, Vacante M, Cammalleri L, Motta M",
          university: "University of Catania",
          year: 2007,
          abstract:
            "A randomized, double-blind, placebo-controlled clinical trial evaluating the efficacy of acetyl-L-carnitine supplementation on fatigue and cognitive performance.",
          participants: {
            total: 70,
            ageRange: "70-92 years",
            genderSplit: "Centenarians with fatigue",
            conditions: "Chronic fatigue syndrome",
          },
          duration: "180 days",
          results: [
            {
              metric: "Physical Fatigue",
              value: "-30%",
              pValue: "P<0.01",
              description: "Significant fatigue reduction",
            },
            {
              metric: "Mental Fatigue",
              value: "-35%",
              pValue: "P<0.01",
              description: "Cognitive fatigue improvement",
            },
            {
              metric: "Fatty Mass",
              value: "-2kg",
              pValue: "P<0.05",
              description: "Body composition improvement",
            },
            {
              metric: "Muscle Mass",
              value: "+3kg",
              pValue: "P<0.05",
              description: "Lean mass increase",
            },
          ],
          conclusion:
            "Acetyl-L-carnitine significantly reduced both physical and mental fatigue, improving overall functional capacity. PMID: 17658628",
        },
      },
      anxiety: {
        id: "anxiety",
        title: "Calm Clarity",
        question: "Anxious thoughts affecting focus?",
        struggle: "Anxiety fogging your thinking? Stress is damaging your prefrontal cortex.",
        outcome: "Think clearly under pressure. Anxiety doesn't cloud your judgment. Your brain stays sharp, not scrambled.",
        description: "Protect brain cells from oxidative damage during stressful moments",
        researchExplanation:
          "Anxiety-related oxidative stress can impair the prefrontal cortex. Vitamin C at higher doses has been shown to significantly reduce anxiety levels in clinical settings, supporting clearer thinking under pressure.",
        stat: "-42%",
        statLabel: "reduction in anxiety scores",
        radarData: [
          { category: "Mental Clarity", before: 12, during: 28, after: 45 },
          { category: "Working Memory", before: 12, during: 30, after: 48 },
          {
            category: "Prefrontal Function",
            before: 12,
            during: 26,
            after: 42,
          },
          { category: "Attention Control", before: 12, during: 25, after: 40 },
          {
            category: "Cognitive Flexibility",
            before: 12,
            during: 24,
            after: 38,
          },
          {
            category: "Thought Organization",
            before: 12,
            during: 27,
            after: 44,
          },
        ],
        keyIngredients: ["Vitamin C", "Glutathione", "Alpha GPC"],
        ingredientAsset: {
          image: "/ingredients/clear/vitamin-c.webp",
          name: "Vitamin C",
          dosage: "1000mg per serving",
        },
        clinicalStudy: {
          id: "clarity-vitc-2015",
          name: "High-Dose Vitamin C Supplementation and Anxiety Reduction",
          professor: "de Oliveira IJ, de Souza VV, Motta V, Da-Silva SL",
          university: "Federal University of Rio Grande do Norte",
          year: 2015,
          abstract:
            "A randomized, double-blind, placebo-controlled trial examining the effect of high-dose vitamin C supplementation on anxiety in high school students.",
          participants: {
            total: 42,
            ageRange: "14-18 years",
            genderSplit: "High school students",
            conditions: "No diagnosed anxiety disorders",
          },
          duration: "14 days",
          results: [
            {
              metric: "Anxiety Scores",
              value: "-42%",
              pValue: "P<0.01",
              description: "Beck Anxiety Inventory reduction",
            },
            {
              metric: "Heart Rate",
              value: "-12%",
              pValue: "P<0.05",
              description: "Reduced during stress tasks",
            },
            {
              metric: "Self-Reported Anxiety",
              value: "-35%",
              pValue: "P<0.05",
              description: "Subjective anxiety ratings",
            },
            {
              metric: "Cognitive Performance",
              value: "+18%",
              pValue: "P<0.05",
              description: "Improved under stress",
            },
          ],
          conclusion:
            "High-dose vitamin C supplementation significantly reduced anxiety levels in healthy high school students. PMID: 25688638",
        },
      },
      focus: {
        id: "focus",
        title: "Laser Focus",
        question: "Need sharper focus?",
        struggle: "Can't stay locked in for more than 20 minutes? Your brain needs fuel, not stimulants.",
        outcome: "Sustained concentration without the jittery edge. Think clearly under pressure. Remember what you read the first time.",
        description: "Enhance memory and protect neurons through enhanced BDNF production",
        researchExplanation:
          "Deep focus requires optimal neurotransmitter levels and healthy neural structures. Curcumin significantly improved memory and attention in non-demented adults, with imaging showing reduced amyloid and tau accumulation in brain regions.",
        stat: "+63%",
        statLabel: "memory improvement",
        radarData: [
          { category: "Focus Intensity", before: 12, during: 32, after: 50 },
          { category: "Reaction Time", before: 12, during: 30, after: 48 },
          { category: "Attention Span", before: 12, during: 28, after: 45 },
          { category: "Neural Speed", before: 12, during: 29, after: 46 },
          { category: "Concentration", before: 12, during: 27, after: 44 },
          { category: "Mental Acuity", before: 12, during: 26, after: 42 },
        ],
        keyIngredients: ["Turmeric (Curcumin)", "Ginkgo Biloba", "Alpha GPC"],
        ingredientAsset: {
          image: "/ingredients/flow/turmeric.jpg",
          name: "Longvida® Curcumin",
          dosage: "400mg per serving",
        },
        clinicalStudy: {
          id: "focus-curcumin-2018",
          name: "Memory and Brain Amyloid and Tau Effects of Bioavailable Curcumin",
          professor:
            "Small GW, Siddarth P, Li Z, Miller KJ, Ercoli L, Emerson ND, Martinez J, Wong KP, Liu J, Merrill DA, Chen ST, Henning SM, Satyamurthy N, Huang SC, Heber D, Barrio JR",
          university: "UCLA",
          year: 2018,
          abstract:
            "A double-blind, placebo-controlled 18-month trial investigating the effects of bioavailable curcumin supplementation on memory performance and brain amyloid/tau accumulation.",
          participants: {
            total: 40,
            ageRange: "51-84 years",
            genderSplit: "Non-demented adults",
            conditions: "No major depression or dementia",
          },
          duration: "18 months",
          results: [
            {
              metric: "Memory (SRT)",
              value: "+63%",
              pValue: "P<0.0001",
              description: "Buschke Selective Reminding Test",
            },
            {
              metric: "Attention",
              value: "+96%",
              pValue: "P<0.0001",
              description: "Attention improvement",
            },
            {
              metric: "Brain Amyloid",
              value: "-15%",
              pValue: "P<0.05",
              description: "Reduced accumulation",
            },
            {
              metric: "Brain Tau",
              value: "-12%",
              pValue: "P<0.05",
              description: "Reduced accumulation",
            },
          ],
          conclusion:
            "Daily oral curcumin significantly improved memory and attention while reducing brain amyloid and tau in non-demented adults. PMID: 29246725",
        },
      },
    },
  },
};

export const STRUGGLE_OPTIONS: {
  id: StruggleId;
  label: string;
  icon: string;
}[] = [
  { id: "sleep", label: "Sleep", icon: "moon" },
  { id: "energy", label: "Energy", icon: "bolt" },
  { id: "crashing", label: "Crashing Mid-Day", icon: "battery-low" },
  { id: "stress", label: "Stress", icon: "heart-pulse" },
  { id: "anxiety", label: "Anxiety", icon: "brain" },
  { id: "focus", label: "Focus", icon: "target" },
];
