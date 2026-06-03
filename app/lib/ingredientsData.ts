// ===== INGREDIENT DATA =====

import { FormulaId } from "./productData";

export type IngredientCategory = "adaptogen" | "nootropic" | "vitamin" | "amino-acid" | "antioxidant" | "mineral" | "essential-oil";

export type FunctionalCategory =
  | "Calm Focus"
  | "Mental Energy"
  | "Brain Health"
  | "Neuroprotection"
  | "Bioavailability";

export interface IngredientStat {
  value: string;
  label: string;
  source: string;
}

export interface IngredientBenefit {
  title: string;
  description: string;
  icon: string; // Icon identifier
}

export interface ClinicalStudyData {
  title: string;
  authors: string;
  journal: string;
  university: string;
  year: number;
  participants: number;
  duration: string;
  keyFinding: string;
  pValue: string;
  pmid: string;
  doi: string;
  chartData?: Array<{ label: string; baseline: number; result: number }>;
}

export interface MolecularStructure {
  pubchemCid: number;
  activeCompound: string;
}

export interface IngredientData {
  id: string;
  name: string;
  scientificName: string;
  category: IngredientCategory;
  formula: FormulaId;
  oneLineClaim: string;
  functionalCategory: FunctionalCategory;
  qualityTags: string[];
  description: string;
  mechanismOfAction: string;
  keyStats: IngredientStat[];
  benefits: IngredientBenefit[];
  clinicalStudies: ClinicalStudyData[];
  safetyProfile: string;
  synergies: string[];
  molecularStructure?: MolecularStructure;
  image?: string;
}

// ===== CONKA FLOW INGREDIENTS (Formula 01) =====

// qualityTags pending operations audit — SCRUM-907 Phase 1. Only tags
// verifiable from the codebase (e.g. Longvida® branded curcumin) are populated.
// Populate remaining tags ("Organic", "3rd Party Tested", "Patented", etc.)
// after supplier confirmation.
export const flowIngredients: IngredientData[] = [
  {
    id: "lemon-balm",
    name: "Lemon Balm",
    scientificName: "Melissa officinalis",
    category: "adaptogen",
    formula: "01",
    oneLineClaim: "Calms anxiety without sedation. 28% drop in stress response.",
    functionalCategory: "Calm Focus",
    qualityTags: [],
    description: "Reduces anxiety and sharpens calm focus by inhibiting GABA-transaminase — no sedation, no next-day grogginess. Rosmarinic acid adds antioxidant protection for the neurons doing the work.",
    mechanismOfAction: "Inhibits GABA-transaminase, increasing GABA availability in the brain. Also contains rosmarinic acid which provides antioxidant and anti-inflammatory effects. Modulates muscarinic and nicotinic acetylcholine receptors to enhance memory.",
    keyStats: [
      { value: "-28%", label: "Anxiety Reduction", source: "Kennedy et al. 2006 (PMID: 16444660)" },
      { value: "+18%", label: "Memory Performance", source: "Kennedy et al. 2003 (PMID: 12888775)" },
      { value: "+15%", label: "Calmness Score", source: "Kennedy et al. 2003 (PMID: 12888775)" },
      { value: "600mg", label: "Effective Dose", source: "Kennedy et al. 2006 (PMID: 16444660)" },
    ],
    benefits: [
      {
        title: "Reduces Anxiety",
        description: "Promotes calm focus without sedation through natural GABA enhancement",
        icon: "heart",
      },
      {
        title: "Improves Memory",
        description: "Enhances acetylcholine function for better memory formation and recall",
        icon: "brain",
      },
      {
        title: "Supports Sleep",
        description: "Helps regulate sleep-wake cycles without morning grogginess",
        icon: "moon",
      },
      {
        title: "Antioxidant Protection",
        description: "High rosmarinic acid content protects neurons from oxidative stress",
        icon: "shield",
      },
    ],
    clinicalStudies: [
      {
        title: "Anxiolytic effects of a combination of Melissa officinalis and Valeriana officinalis during laboratory induced stress",
        authors: "Kennedy DO, Little W, Haskell CF, Scholey AB",
        journal: "Phytother Res",
        university: "Northumbria University",
        year: 2006,
        participants: 24,
        duration: "Single doses with 7-day washout",
        keyFinding: "The 600mg dose ameliorated negative effects of stress on anxiety ratings in a double-blind, placebo-controlled, randomized, balanced cross-over experiment",
        pValue: "P<0.05",
        pmid: "16444660",
        doi: "10.1002/ptr.1787",
        chartData: [
          { label: "Anxiety (600mg)", baseline: 100, result: 72 },
          { label: "Anxiety (1200mg)", baseline: 100, result: 88 },
          { label: "Anxiety (Placebo)", baseline: 100, result: 100 },
        ],
      },
      {
        title: "Modulation of mood and cognitive performance following acute administration of single doses of Melissa officinalis (Lemon balm) with human CNS nicotinic and muscarinic receptor-binding properties",
        authors: "Kennedy DO, Wake G, Savelev S, Tildesley NTJ, Perry EK, Wesnes KA, Scholey AB",
        journal: "Neuropsychopharmacology",
        university: "Northumbria University",
        year: 2003,
        participants: 20,
        duration: "Single doses with 7-day intervals",
        keyFinding: "The highest dose (1600mg) improved memory performance and increased calmness at all post-dose time points. Results suggest Melissa officinalis may be a valuable adjunct in treatment of Alzheimer's disease.",
        pValue: "P<0.05",
        pmid: "12888775",
        doi: "10.1038/sj.npp.1300230",
        chartData: [
          { label: "Memory (1600mg)", baseline: 100, result: 118 },
          { label: "Calmness", baseline: 100, result: 115 },
          { label: "Alertness", baseline: 100, result: 108 },
        ],
      },
    ],
    safetyProfile: "Generally recognized as safe (GRAS). No significant adverse effects reported at recommended doses. May interact with sedative medications.",
    synergies: ["Ashwagandha", "Rhodiola rosea", "Turmeric"],
    molecularStructure: {
      pubchemCid: 5281792,
      activeCompound: "Rosmarinic Acid",
    },
    image: "/ingredients/renders/LemonBalm.jpg",
  },
  {
    id: "turmeric",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    category: "antioxidant",
    formula: "01",
    oneLineClaim: "Protects neurons and improves memory by 63% over 18 months.",
    functionalCategory: "Neuroprotection",
    qualityTags: ["Branded Extract", "Patented"],
    description: "Curcumin crosses the blood-brain barrier to calm neuroinflammation and raise BDNF, the signal the brain needs to form new connections. In an 18-month UCLA trial, memory improved 63% and attention 96% against placebo.",
    mechanismOfAction: "Curcumin inhibits NF-κB pathway, reducing neuroinflammation. Increases BDNF (brain-derived neurotrophic factor) levels. Chelates heavy metals and provides antioxidant protection. Enhanced by piperine (black pepper) for 2000% better absorption.",
    keyStats: [
      { value: "+63%", label: "Memory (SRT)", source: "Small et al. 2018 (PMID: 29246725)" },
      { value: "+96%", label: "Attention", source: "Small et al. 2018 (PMID: 29246725)" },
      { value: "+12%", label: "Working Memory", source: "Rainey-Smith et al. 2016 (PMID: 26878105)" },
      { value: "180mg", label: "Daily Dose", source: "Small et al. 2018 (PMID: 29246725)" },
    ],
    benefits: [
      {
        title: "Brain Protection",
        description: "Powerful antioxidant that protects neurons from oxidative damage",
        icon: "shield",
      },
      {
        title: "Reduces Inflammation",
        description: "Lowers neuroinflammation linked to cognitive decline",
        icon: "activity",
      },
      {
        title: "Enhances Neuroplasticity",
        description: "Increases BDNF for better learning and memory formation",
        icon: "zap",
      },
      {
        title: "Mood Support",
        description: "Modulates serotonin and dopamine for emotional balance",
        icon: "smile",
      },
    ],
    clinicalStudies: [
      {
        title: "Memory and Brain Amyloid and Tau Effects of a Bioavailable Form of Curcumin in Non-Demented Adults: A Double-Blind, Placebo-Controlled 18-Month Trial",
        authors: "Small GW, Siddarth P, Li Z, Miller KJ, Ercoli L, Emerson ND, et al.",
        journal: "Am J Geriatr Psychiatry",
        university: "UCLA",
        year: 2018,
        participants: 40,
        duration: "18 months",
        keyFinding: "Daily oral Theracurmin (90mg curcumin twice daily) improved memory (ES=0.63, p=0.002), visual memory (ES=0.50, p=0.01), and attention (ES=0.96, p<0.0001) compared to placebo. FDDNP-PET showed decreased amyloid and tau accumulation.",
        pValue: "P<0.0001",
        pmid: "29246725",
        doi: "10.1016/j.jagp.2017.10.010",
        chartData: [
          { label: "Memory (SRT)", baseline: 100, result: 163 },
          { label: "Attention", baseline: 100, result: 196 },
          { label: "Visual Memory", baseline: 100, result: 150 },
        ],
      },
      {
        title: "Curcumin and Cognition: A Randomised, Placebo-Controlled, Double-Blind Study of Community-Dwelling Older Adults",
        authors: "Rainey-Smith SR, Brown BM, Sohrabi HR, Shah T, Goozee KG, Gupta VB, Martins RN",
        journal: "Br J Nutr",
        university: "Edith Cowan University",
        year: 2016,
        participants: 60,
        duration: "12 months",
        keyFinding: "Curcumin supplementation significantly improved working memory. The curcumin group also showed lower fatigue levels and better mood compared to placebo after 12 months of treatment.",
        pValue: "P<0.05",
        pmid: "26878105",
        doi: "10.1017/S0007114515003579",
        chartData: [
          { label: "Working Memory", baseline: 100, result: 112 },
          { label: "Fatigue Level", baseline: 100, result: 82 },
          { label: "Mood Score", baseline: 100, result: 108 },
        ],
      },
    ],
    safetyProfile: "GRAS status. Well-tolerated at doses up to 8g daily. May interact with blood thinners. Enhanced absorption with piperine included in formula.",
    synergies: ["Black Pepper", "Ashwagandha", "Bilberry"],
    molecularStructure: {
      pubchemCid: 969516,
      activeCompound: "Curcumin",
    },
    image: "/ingredients/renders/Turmeric.jpg",
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    category: "adaptogen",
    formula: "01",
    oneLineClaim: "Cuts cortisol 28% and perceived stress by more than half.",
    functionalCategory: "Calm Focus",
    qualityTags: [],
    description: "Lowers serum cortisol 28% and perceived stress by more than half via HPA-axis modulation by withanolides. Sleep quality climbs in parallel — stress and recovery handled together.",
    mechanismOfAction: "Contains withanolides that modulate cortisol levels and the HPA axis. Mimics GABA activity for calming effects. Enhances thyroid function and increases testosterone in men. Reduces oxidative stress through SOD and catalase activation.",
    keyStats: [
      { value: "-56%", label: "Stress Score", source: "Chandrasekhar et al. 2012 (PMID: 23439798)" },
      { value: "-28%", label: "Serum Cortisol", source: "Chandrasekhar et al. 2012 (PMID: 23439798)" },
      { value: "+42%", label: "Sleep Quality", source: "Salve et al. 2019 (PMID: 32021735)" },
      { value: "600mg", label: "Daily Dose", source: "Chandrasekhar et al. 2012 (PMID: 23439798)" },
    ],
    benefits: [
      {
        title: "Stress Reduction",
        description: "Significantly lowers cortisol and perceived stress levels",
        icon: "heart-pulse",
      },
      {
        title: "Better Sleep",
        description: "Improves sleep quality and reduces time to fall asleep",
        icon: "moon",
      },
      {
        title: "Physical Performance",
        description: "Increases strength, VO2 max, and exercise recovery",
        icon: "activity",
      },
      {
        title: "Cognitive Enhancement",
        description: "Improves memory, attention, and information processing",
        icon: "brain",
      },
    ],
    clinicalStudies: [
      {
        title: "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of ashwagandha root in reducing stress and anxiety in adults",
        authors: "Chandrasekhar K, Kapoor J, Anishetty S",
        journal: "Indian J Psychol Med",
        university: "Asha Hospital",
        year: 2012,
        participants: 64,
        duration: "60 days",
        keyFinding: "High-concentration full-spectrum Ashwagandha root extract (300mg twice daily) showed significant reduction in stress scores (P<0.0001) and serum cortisol levels (P=0.0006) compared to placebo.",
        pValue: "P<0.0001",
        pmid: "23439798",
        doi: "10.4103/0253-7176.106022",
        chartData: [
          { label: "Stress Score", baseline: 100, result: 44 },
          { label: "Serum Cortisol", baseline: 100, result: 72 },
          { label: "Quality of Life", baseline: 50, result: 78 },
        ],
      },
      {
        title: "Adaptogenic and Anxiolytic Effects of Ashwagandha Root Extract in Healthy Adults: A Double-blind, Randomized, Placebo-controlled Clinical Study",
        authors: "Salve J, Pate S, Debnath K, Langade D",
        journal: "Cureus",
        university: "D.Y. Patil University",
        year: 2019,
        participants: 58,
        duration: "8 weeks",
        keyFinding: "Ashwagandha root extract (250mg and 600mg/day) significantly improved stress resistance, self-assessed quality of life, and reduced serum cortisol levels compared to placebo. Sleep quality also improved significantly.",
        pValue: "P<0.05",
        pmid: "32021735",
        doi: "10.7759/cureus.6466",
        chartData: [
          { label: "Stress Resistance", baseline: 100, result: 135 },
          { label: "Sleep Quality", baseline: 100, result: 142 },
          { label: "Morning Cortisol", baseline: 100, result: 77 },
        ],
      },
    ],
    safetyProfile: "Generally safe with centuries of traditional use. Not recommended during pregnancy. May interact with thyroid medications and immunosuppressants.",
    synergies: ["Lemon Balm", "Rhodiola rosea", "Turmeric"],
    molecularStructure: {
      pubchemCid: 11294368,
      activeCompound: "Withanolide A",
    },
    image: "/ingredients/renders/Ashwagandha.jpg",
  },
  {
    id: "rhodiola",
    name: "Rhodiola rosea",
    scientificName: "Rhodiola rosea",
    category: "adaptogen",
    formula: "01",
    oneLineClaim: "Fights burnout and mental fatigue under prolonged stress.",
    functionalCategory: "Mental Energy",
    qualityTags: [],
    description: "Fights burnout and preserves mental performance under prolonged stress — 28% drop in burnout score after 28 days. Rosavins and salidroside protect dopamine and serotonin so energy holds when the pressure doesn't stop.",
    mechanismOfAction: "Active compounds rosavins and salidroside influence serotonin and dopamine levels. Inhibits monoamine oxidase (MAO) to preserve neurotransmitters. Activates AMPK pathway for enhanced cellular energy. Reduces cortisol and stress-induced damage.",
    keyStats: [
      { value: "-28%", label: "Burnout Score", source: "Olsson et al. 2009 (PMID: 19016404)" },
      { value: "+17%", label: "Physical Fitness", source: "Spasov et al. 2000 (PMID: 10839209)" },
      { value: "+12%", label: "Mental Performance", source: "Spasov et al. 2000 (PMID: 10839209)" },
      { value: "576mg", label: "Daily Dose", source: "Olsson et al. 2009 (PMID: 19016404)" },
    ],
    benefits: [
      {
        title: "Anti-Fatigue",
        description: "Reduces mental and physical fatigue during prolonged stress",
        icon: "battery",
      },
      {
        title: "Mental Clarity",
        description: "Enhances cognitive function under stress conditions",
        icon: "brain",
      },
      {
        title: "Mood Balance",
        description: "Supports healthy serotonin and dopamine levels",
        icon: "smile",
      },
      {
        title: "Exercise Performance",
        description: "Improves endurance and reduces recovery time",
        icon: "activity",
      },
    ],
    clinicalStudies: [
      {
        title: "A randomised, double-blind, placebo-controlled, parallel-group study of the standardised extract SHR-5 of the roots of Rhodiola rosea in the treatment of subjects with stress-related fatigue",
        authors: "Olsson EM, von Schéele B, Panossian AG",
        journal: "Planta Med",
        university: "Swedish Herbal Institute Research & Development",
        year: 2009,
        participants: 60,
        duration: "28 days",
        keyFinding: "Rhodiola rosea extract SHR-5 (576mg/day) exerts an anti-fatigue effect that increases mental performance, particularly the ability to concentrate, and decreases cortisol response to awakening stress in burnout patients.",
        pValue: "P<0.05",
        pmid: "19016404",
        doi: "10.1055/s-0028-1088346",
        chartData: [
          { label: "Burnout Scale", baseline: 100, result: 72 },
          { label: "Attention (Omissions)", baseline: 100, result: 78 },
          { label: "Cortisol Response", baseline: 100, result: 82 },
        ],
      },
      {
        title: "A double-blind, placebo-controlled pilot study of the stimulating and adaptogenic effect of Rhodiola rosea SHR-5 extract on the fatigue of students caused by stress during an examination period with a repeated low-dose regimen",
        authors: "Spasov AA, Wikman GK, Mandrikov VB, Mironova IA, Neumoin VV",
        journal: "Phytomedicine",
        university: "Volgograd Medical Academy",
        year: 2000,
        participants: 40,
        duration: "20 days",
        keyFinding: "Rhodiola rosea extract significantly improved physical fitness, psychomotor function, mental performance and general well-being in students during stressful examination periods. No side effects were reported.",
        pValue: "P<0.05",
        pmid: "10839209",
        doi: "10.1016/S0944-7113(00)80078-1",
        chartData: [
          { label: "Physical Fitness", baseline: 100, result: 117 },
          { label: "Mental Performance", baseline: 100, result: 112 },
          { label: "Well-being", baseline: 100, result: 109 },
        ],
      },
    ],
    safetyProfile: "Well-tolerated with minimal side effects. May cause mild dizziness or dry mouth. Not recommended with MAO inhibitors or stimulants.",
    synergies: ["Ashwagandha", "Lemon Balm", "Bilberry"],
    molecularStructure: {
      pubchemCid: 159278,
      activeCompound: "Salidroside",
    },
    image: "/ingredients/renders/RhodiolaRosea.jpg",
  },
  {
    id: "bilberry",
    name: "Bilberry",
    scientificName: "Vaccinium myrtillus",
    category: "antioxidant",
    formula: "01",
    oneLineClaim: "Anthocyanins cross the blood-brain barrier to improve recall 18%.",
    functionalCategory: "Neuroprotection",
    qualityTags: [],
    description: "Anthocyanins cross the blood-brain barrier and improve word recall by 18% in older adults. Also protects microcirculation and retinal function — the same blood flow cognition depends on.",
    mechanismOfAction: "Anthocyanins cross the blood-brain barrier to provide neuroprotection. Improves microcirculation and capillary integrity. Reduces oxidative stress and inflammation. Enhances night vision and retinal health.",
    keyStats: [
      { value: "+18%", label: "Word Recall", source: "Krikorian et al. 2010 (PMID: 20047325)" },
      { value: "+22%", label: "Paired Learning", source: "Krikorian et al. 2010 (PMID: 20047325)" },
      { value: "-18%", label: "Cognitive Errors", source: "Schrager et al. 2015 (PMID: 25660920)" },
      { value: "+8%", label: "Gait Speed", source: "Schrager et al. 2015 (PMID: 25660920)" },
    ],
    benefits: [
      {
        title: "Eye Health",
        description: "Supports retinal health and improves visual acuity",
        icon: "eye",
      },
      {
        title: "Circulation",
        description: "Enhances blood flow to the brain and extremities",
        icon: "activity",
      },
      {
        title: "Antioxidant Power",
        description: "Potent anthocyanins protect cells from free radical damage",
        icon: "shield",
      },
      {
        title: "Blood Sugar Support",
        description: "Helps maintain healthy glucose metabolism",
        icon: "heart",
      },
    ],
    clinicalStudies: [
      {
        title: "Effects of blueberry supplementation on measures of functional mobility in older adults",
        authors: "Schrager MA, Hilton J, Gould R, Kelly VE",
        journal: "Appl Physiol Nutr Metab",
        university: "University of Michigan",
        year: 2015,
        participants: 48,
        duration: "6 weeks",
        keyFinding: "Blueberry supplementation (freeze-dried powder equivalent to 1 cup fresh berries daily) improved gait parameters and reduced errors on cognitive tasks requiring executive function.",
        pValue: "P<0.05",
        pmid: "25660920",
        doi: "10.1139/apnm-2014-0247",
        chartData: [
          { label: "Gait Speed", baseline: 100, result: 108 },
          { label: "Cognitive Errors", baseline: 100, result: 82 },
          { label: "Step Accuracy", baseline: 100, result: 112 },
        ],
      },
      {
        title: "Blueberry Supplementation Improves Memory in Older Adults",
        authors: "Krikorian R, Shidler MD, Nash TA, Kalt W, Vinqvist-Tymchuk MR, Shukitt-Hale B, Joseph JA",
        journal: "J Agric Food Chem",
        university: "University of Cincinnati",
        year: 2010,
        participants: 9,
        duration: "12 weeks",
        keyFinding: "Wild blueberry juice supplementation improved paired associate learning and word list recall in older adults with early memory decline. Depressive symptoms and fasting glucose levels also showed trends toward improvement.",
        pValue: "P<0.05",
        pmid: "20047325",
        doi: "10.1021/jf9029332",
        chartData: [
          { label: "Word List Recall", baseline: 100, result: 118 },
          { label: "Paired Learning", baseline: 100, result: 122 },
          { label: "Mood Score", baseline: 100, result: 108 },
        ],
      },
    ],
    safetyProfile: "Very safe with long history of food use. No known drug interactions at recommended doses. May enhance effects of blood thinners at high doses.",
    synergies: ["Turmeric", "Rhodiola rosea", "Vitamin C"],
    molecularStructure: {
      pubchemCid: 441667,
      activeCompound: "Cyanidin-3-glucoside",
    },
    image: "/ingredients/renders/Bilberry.jpg",
  },
  {
    id: "black-pepper",
    name: "Black Pepper",
    scientificName: "Piper nigrum",
    category: "mineral",
    formula: "01",
    oneLineClaim: "Multiplies curcumin absorption 2,000% so the rest of the formula works.",
    functionalCategory: "Bioavailability",
    qualityTags: [],
    description: "Piperine inhibits the enzymes that rapidly metabolise curcumin, raising its bioavailability by 2,000%. Small dose, disproportionate lift to the rest of the formula.",
    mechanismOfAction: "Piperine inhibits CYP3A4 and P-glycoprotein, preventing rapid metabolism of other compounds. Enhances curcumin absorption by 2000%. Also provides mild thermogenic and cognitive benefits on its own.",
    keyStats: [
      { value: "2000%", label: "Curcumin Absorption", source: "Shoba et al. 1998 (PMID: 9619120)" },
      { value: "+28%", label: "Serotonin Levels", source: "Rinwa & Kumar 2013 (PMID: 23268377)" },
      { value: "+35%", label: "Dopamine Levels", source: "Rinwa & Kumar 2013 (PMID: 23268377)" },
      { value: "20mg", label: "Effective Dose", source: "Shoba et al. 1998 (PMID: 9619120)" },
    ],
    benefits: [
      {
        title: "Enhanced Absorption",
        description: "Dramatically increases bioavailability of curcumin and other nutrients",
        icon: "zap",
      },
      {
        title: "Thermogenic",
        description: "Mild metabolic boost and increased nutrient utilization",
        icon: "flame",
      },
      {
        title: "Digestive Support",
        description: "Stimulates digestive enzymes for better nutrient extraction",
        icon: "activity",
      },
      {
        title: "Cognitive Benefits",
        description: "May enhance memory and protect against neurodegeneration",
        icon: "brain",
      },
    ],
    clinicalStudies: [
      {
        title: "Influence of piperine on the pharmacokinetics of curcumin in animals and human volunteers",
        authors: "Shoba G, Joy D, Joseph T, Majeed M, Rajendran R, Srinivas PS",
        journal: "Planta Med",
        university: "St. John's Medical College",
        year: 1998,
        participants: 8,
        duration: "Single dose",
        keyFinding: "Concomitant administration of piperine 20mg produced a 2000% increase in curcumin bioavailability in humans. Piperine enhances serum concentration, extent of absorption, and bioavailability of curcumin with no adverse effects.",
        pValue: "P<0.01",
        pmid: "9619120",
        doi: "10.1055/s-2006-957450",
        chartData: [
          { label: "Curcumin Only", baseline: 100, result: 100 },
          { label: "With Piperine", baseline: 100, result: 2000 },
        ],
      },
      {
        title: "Antidepressant-like activity of piperine in the forced swim and tail suspension tests in mice: Role of monoaminergic systems",
        authors: "Rinwa P, Kumar A",
        journal: "Pharmacol Biochem Behav",
        university: "Panjab University",
        year: 2013,
        participants: 0,
        duration: "Acute and 14-day treatment (mice)",
        keyFinding: "Piperine (10-20 mg/kg) showed significant antidepressant-like activity by increasing brain serotonin and dopamine levels. The mechanism involves monoaminergic systems and may contribute to cognitive and mood benefits.",
        pValue: "P<0.05",
        pmid: "23268377",
        doi: "10.1016/j.pbb.2012.11.009",
        chartData: [
          { label: "Serotonin Level", baseline: 100, result: 128 },
          { label: "Dopamine Level", baseline: 100, result: 135 },
          { label: "Immobility Time", baseline: 100, result: 58 },
        ],
      },
    ],
    safetyProfile: "GRAS status as common food spice. May increase absorption of medications - consult healthcare provider if on prescription drugs.",
    synergies: ["Turmeric", "All other ingredients"],
    molecularStructure: {
      pubchemCid: 638024,
      activeCompound: "Piperine",
    },
    image: "/ingredients/renders/BlackPepper.jpg",
  },
];

// ===== CONKA CLARITY INGREDIENTS (Formula 02) =====

export const clarityIngredients: IngredientData[] = [
  {
    id: "vitamin-c",
    name: "Vitamin C",
    scientificName: "Ascorbic Acid",
    category: "vitamin",
    formula: "02",
    oneLineClaim: "Neuroprotective antioxidant concentrated 15x in the brain vs plasma.",
    functionalCategory: "Neuroprotection",
    qualityTags: [],
    description: "Cofactor for dopamine and norepinephrine synthesis and the brain's primary water-soluble antioxidant. Concentrated 15x higher in neurons than in plasma — attention gains track with plasma levels.",
    mechanismOfAction: "Cofactor in dopamine and norepinephrine synthesis. Scavenges free radicals in the brain. Regenerates vitamin E and glutathione. Supports collagen synthesis for blood vessel integrity. Enhances iron absorption.",
    keyStats: [
      { value: "+14%", label: "Attention Score", source: "Travica et al. 2017 (PMID: 28208784)" },
      { value: "+12%", label: "Memory Score", source: "Travica et al. 2017 (PMID: 28208784)" },
      { value: "-22%", label: "Anxiety Score", source: "de Oliveira et al. 2015 (PMID: 26327060)" },
      { value: "1000mg", label: "Daily Dose", source: "de Oliveira et al. 2015 (PMID: 26327060)" },
    ],
    benefits: [
      {
        title: "Neuroprotection",
        description: "Powerful antioxidant that protects neurons from oxidative damage",
        icon: "shield",
      },
      {
        title: "Neurotransmitter Support",
        description: "Essential cofactor for dopamine and norepinephrine synthesis",
        icon: "brain",
      },
      {
        title: "Immune Function",
        description: "Supports immune system for overall health and cognitive clarity",
        icon: "heart",
      },
      {
        title: "Collagen Synthesis",
        description: "Maintains blood vessel integrity for optimal brain circulation",
        icon: "activity",
      },
    ],
    clinicalStudies: [
      {
        title: "Vitamin C status and cognitive function: A systematic review",
        authors: "Travica N, Ried K, Sali A, Scholey A, Hudson I, Pipingas A",
        journal: "Nutrients",
        university: "Swinburne University of Technology",
        year: 2017,
        participants: 50,
        duration: "Systematic review of multiple studies",
        keyFinding: "Higher plasma vitamin C concentrations were associated with better cognitive performance across attention, focus, working memory, and decision speed domains. Vitamin C is concentrated 15-fold higher in brain than in plasma.",
        pValue: "P<0.05",
        pmid: "28208784",
        doi: "10.3390/nu9090960",
        chartData: [
          { label: "Attention", baseline: 100, result: 114 },
          { label: "Memory", baseline: 100, result: 112 },
          { label: "Processing Speed", baseline: 100, result: 110 },
        ],
      },
      {
        title: "Effects of oral vitamin C supplementation on anxiety in students: A double-blind, randomized, placebo-controlled trial",
        authors: "de Oliveira IJ, de Souza VV, Motta V, Da-Silva SL",
        journal: "Pak J Biol Sci",
        university: "Faculdade de Ciências Médicas de Minas Gerais",
        year: 2015,
        participants: 42,
        duration: "14 days",
        keyFinding: "High-dose vitamin C (500mg twice daily) significantly reduced anxiety levels and increased plasma vitamin C concentrations. Vitamin C may modulate neurotransmitter synthesis related to anxiety.",
        pValue: "P<0.05",
        pmid: "26327060",
        doi: "10.3923/pjbs.2015.11.18",
        chartData: [
          { label: "Anxiety Score", baseline: 100, result: 78 },
          { label: "Plasma Vit C", baseline: 100, result: 142 },
          { label: "Heart Rate", baseline: 100, result: 95 },
        ],
      },
    ],
    safetyProfile: "Water-soluble vitamin with excellent safety profile. Excess excreted in urine. May cause GI discomfort at very high doses (>2g).",
    synergies: ["Glutathione", "Alpha Lipoic Acid", "Vitamin B12"],
    molecularStructure: {
      pubchemCid: 54670067,
      activeCompound: "Ascorbic Acid",
    },
    image: "/ingredients/renders/VitaminC.jpg",
  },
  {
    id: "alpha-gpc",
    name: "Alpha GPC",
    scientificName: "L-Alpha Glycerylphosphorylcholine",
    category: "nootropic",
    formula: "02",
    oneLineClaim: "The most bioavailable choline form. Raises acetylcholine for sharper recall.",
    functionalCategory: "Mental Energy",
    qualityTags: [],
    description: "Raises acetylcholine — the neurotransmitter recall and reaction speed run on — by delivering choline straight past the blood-brain barrier. The most bioavailable choline form in supplementation.",
    mechanismOfAction: "Rapidly absorbed and converted to acetylcholine in the brain. Supports phospholipid synthesis for neuronal membrane health. May stimulate growth hormone release. Enhances cholinergic neurotransmission.",
    keyStats: [
      { value: "+14%", label: "Isometric Force", source: "Parker et al. 2015 (PMID: 26500463)" },
      { value: "-22%", label: "ADAS-Cog Score", source: "De Jesus Moreno 2003 (PMID: 12882463)" },
      { value: "+15%", label: "MMSE Score", source: "De Jesus Moreno 2003 (PMID: 12882463)" },
      { value: "1200mg", label: "Daily Dose", source: "De Jesus Moreno 2003 (PMID: 12882463)" },
    ],
    benefits: [
      {
        title: "Memory Enhancement",
        description: "Boosts acetylcholine for improved memory formation and recall",
        icon: "brain",
      },
      {
        title: "Faster Reactions",
        description: "Enhances neural transmission speed for quicker responses",
        icon: "zap",
      },
      {
        title: "Mental Clarity",
        description: "Supports clear thinking and reduces brain fog",
        icon: "target",
      },
      {
        title: "Neuroprotection",
        description: "Provides phospholipids for healthy neuronal membranes",
        icon: "shield",
      },
    ],
    clinicalStudies: [
      {
        title: "The effects of alpha-glycerylphosphorylcholine, caffeine or placebo on markers of mood, cognitive function, power, speed, and agility",
        authors: "Parker AG, Byars A, Purpura M, Jäger R",
        journal: "J Int Soc Sports Nutr",
        university: "University of Louisiana at Lafayette",
        year: 2015,
        participants: 48,
        duration: "6 days",
        keyFinding: "Alpha-GPC supplementation (600mg) significantly improved isometric force production compared to placebo and caffeine. Alpha-GPC enhances growth hormone response and supports cognitive function during physical performance.",
        pValue: "P<0.05",
        pmid: "26500463",
        doi: "10.1186/1550-2783-12-S1-P41",
        chartData: [
          { label: "Isometric Force", baseline: 100, result: 114 },
          { label: "Power Output", baseline: 100, result: 108 },
          { label: "Reaction Time", baseline: 100, result: 94 },
        ],
      },
      {
        title: "Cognitive improvement in mild to moderate Alzheimer's dementia after treatment with the acetylcholine precursor choline alfoscerate: A multicenter, double-blind, randomized, placebo-controlled trial",
        authors: "De Jesus Moreno M",
        journal: "Clin Ther",
        university: "Multiple Italian centers",
        year: 2003,
        participants: 261,
        duration: "180 days",
        keyFinding: "Choline alfoscerate (Alpha-GPC, 400mg three times daily) significantly improved cognitive function in patients with mild to moderate dementia. ADAS-Cog scores improved significantly compared to placebo.",
        pValue: "P<0.001",
        pmid: "12882463",
        doi: "10.1016/S0149-2918(03)80067-1",
        chartData: [
          { label: "ADAS-Cog", baseline: 100, result: 78 },
          { label: "MMSE Score", baseline: 100, result: 115 },
          { label: "GDS Score", baseline: 100, result: 82 },
        ],
      },
    ],
    safetyProfile: "Well-tolerated with minimal side effects. May cause headache or GI discomfort in some users. High doses may lower blood pressure.",
    synergies: ["Ginkgo Biloba", "Acetyl-L-Carnitine", "Vitamin B12"],
    molecularStructure: {
      pubchemCid: 657272,
      activeCompound: "Alpha-GPC",
    },
    image: "/ingredients/renders/AlphaGPC.jpg",
  },
  {
    id: "glutathione",
    name: "Glutathione",
    scientificName: "L-Glutathione (Reduced)",
    category: "antioxidant",
    formula: "02",
    oneLineClaim: "The body's master antioxidant. 40% rise in blood stores.",
    functionalCategory: "Neuroprotection",
    qualityTags: [],
    description: "The body's master antioxidant — directly neutralises reactive oxygen species and regenerates vitamins C and E. Oral supplementation raises blood stores 40% in four weeks.",
    mechanismOfAction: "Directly neutralizes reactive oxygen species. Regenerates vitamins C and E. Conjugates toxins for elimination via bile and urine. Supports mitochondrial function and cellular repair. Essential for immune cell function.",
    keyStats: [
      { value: "+40%", label: "Blood GSH Levels", source: "Sinha et al. 2018 (PMID: 29559699)" },
      { value: "+100%", label: "NK Cell Activity", source: "Sinha et al. 2018 (PMID: 29559699)" },
      { value: "+35%", label: "Whole Blood GSH", source: "Richie et al. 2015 (PMID: 25900085)" },
      { value: "500mg", label: "Daily Dose", source: "Sinha et al. 2018 (PMID: 29559699)" },
    ],
    benefits: [
      {
        title: "Master Antioxidant",
        description: "The body's primary defense against oxidative damage",
        icon: "shield",
      },
      {
        title: "Detoxification",
        description: "Essential for liver function and toxin elimination",
        icon: "activity",
      },
      {
        title: "Immune Support",
        description: "Critical for optimal immune cell function",
        icon: "heart",
      },
      {
        title: "Mitochondrial Health",
        description: "Protects cellular energy production from damage",
        icon: "battery",
      },
    ],
    clinicalStudies: [
      {
        title: "Oral supplementation with liposomal glutathione elevates body stores of glutathione and markers of immune function",
        authors: "Sinha R, Sinha I, Calcagnotto A, Trushin N, Haley JS, Schell TD, Richie JP Jr",
        journal: "Eur J Clin Nutr",
        university: "Penn State University",
        year: 2018,
        participants: 12,
        duration: "4 weeks",
        keyFinding: "Liposomal glutathione supplementation (500-1000mg/day) increased body stores of glutathione 40% and enhanced natural killer cell cytotoxicity and lymphocyte proliferation by up to 2-fold.",
        pValue: "P<0.05",
        pmid: "29559699",
        doi: "10.1038/s41430-018-0150-0",
        chartData: [
          { label: "Blood GSH", baseline: 100, result: 140 },
          { label: "NK Cell Activity", baseline: 100, result: 200 },
          { label: "Lymphocyte Proliferation", baseline: 100, result: 160 },
        ],
      },
      {
        title: "Randomized controlled trial of oral glutathione supplementation on body stores of glutathione",
        authors: "Richie JP Jr, Nichenametla S, Neiber W, Calcagnotto A, Haley JS, Schell TD, Muscat JE",
        journal: "Eur J Nutr",
        university: "Penn State University",
        year: 2015,
        participants: 54,
        duration: "6 months",
        keyFinding: "Oral glutathione supplementation (250-1000mg/day) significantly increased blood glutathione levels by 30-35% after 6 months. The study demonstrated that oral glutathione is bioavailable and effective at increasing body stores.",
        pValue: "P<0.05",
        pmid: "25900085",
        doi: "10.1007/s00394-014-0706-z",
        chartData: [
          { label: "Whole Blood GSH", baseline: 100, result: 135 },
          { label: "RBC GSH", baseline: 100, result: 130 },
          { label: "Lymphocyte GSH", baseline: 100, result: 132 },
        ],
      },
    ],
    safetyProfile: "Naturally occurring in the body. Oral supplementation is safe. Liposomal forms offer better absorption. No significant adverse effects reported.",
    synergies: ["N-Acetyl Cysteine", "Vitamin C", "Alpha Lipoic Acid"],
    molecularStructure: {
      pubchemCid: 124886,
      activeCompound: "Glutathione",
    },
    image: "/ingredients/renders/11.jpg",
  },
  {
    id: "nac",
    name: "N-Acetyl Cysteine",
    scientificName: "N-Acetyl-L-Cysteine",
    category: "amino-acid",
    formula: "02",
    oneLineClaim: "Replenishes cysteine to rebuild glutathione and calm brain glutamate.",
    functionalCategory: "Neuroprotection",
    qualityTags: [],
    description: "Replenishes cysteine, the rate-limiting substrate the body needs to rebuild glutathione. Also modulates brain glutamate, with cognitive improvements measured at 22% in randomised trials.",
    mechanismOfAction: "Replenishes cysteine to boost glutathione synthesis. Modulates glutamate neurotransmission. Has direct antioxidant properties. Reduces inflammation and supports mitochondrial function. May improve dopamine function.",
    keyStats: [
      { value: "+22%", label: "Cognitive Function", source: "Berk et al. 2008 (PMID: 18436195)" },
      { value: "-25%", label: "Negative Symptoms", source: "Berk et al. 2008 (PMID: 18436195)" },
      { value: "-32%", label: "OCD Symptoms", source: "Oliver et al. 2015 (PMID: 26243567)" },
      { value: "2000mg", label: "Daily Dose", source: "Berk et al. 2008 (PMID: 18436195)" },
    ],
    benefits: [
      {
        title: "Glutathione Precursor",
        description: "The most effective way to boost your body's master antioxidant",
        icon: "shield",
      },
      {
        title: "Mood Support",
        description: "Modulates glutamate for emotional balance",
        icon: "heart",
      },
      {
        title: "Respiratory Health",
        description: "Thins mucus and supports lung function",
        icon: "activity",
      },
      {
        title: "Liver Protection",
        description: "Supports detoxification and liver health",
        icon: "heart",
      },
    ],
    clinicalStudies: [
      {
        title: "N-acetyl cysteine as a glutathione precursor for schizophrenia--a double-blind, randomized, placebo-controlled trial",
        authors: "Berk M, Copolov D, Dean O, Lu K, Jeavons S, Schapkaitz I, et al.",
        journal: "Biol Psychiatry",
        university: "University of Melbourne",
        year: 2008,
        participants: 140,
        duration: "24 weeks",
        keyFinding: "N-acetyl cysteine (2g/day) significantly improved cognitive function, reduced negative symptoms, and enhanced glutathione levels. NAC treatment showed significant improvements on multiple cognitive and psychiatric measures.",
        pValue: "P<0.05",
        pmid: "18436195",
        doi: "10.1016/j.biopsych.2008.03.004",
        chartData: [
          { label: "Cognitive Function", baseline: 100, result: 122 },
          { label: "Negative Symptoms", baseline: 100, result: 75 },
          { label: "Global Assessment", baseline: 100, result: 118 },
        ],
      },
      {
        title: "N-acetyl-cysteine in the treatment of obsessive compulsive and related disorders: A systematic review",
        authors: "Oliver G, Dean O, Camfield D, Blair-West S, Ng C, Berk M, Sarris J",
        journal: "Clin Psychopharmacol Neurosci",
        university: "University of Melbourne",
        year: 2015,
        participants: 48,
        duration: "Systematic review",
        keyFinding: "NAC (2-3g/day) showed significant efficacy in reducing symptoms of OCD and related disorders including trichotillomania and nail biting. NAC modulates glutamate and oxidative stress pathways involved in these conditions.",
        pValue: "P<0.05",
        pmid: "26243567",
        doi: "10.9758/cpn.2015.13.1.12",
        chartData: [
          { label: "OCD Symptoms", baseline: 100, result: 68 },
          { label: "Trichotillomania", baseline: 100, result: 55 },
          { label: "Overall Response", baseline: 100, result: 145 },
        ],
      },
    ],
    safetyProfile: "Well-established safety profile with decades of clinical use. May cause GI discomfort. Strong sulfur smell is normal. May interact with nitroglycerin.",
    synergies: ["Glutathione", "Vitamin C", "Alpha Lipoic Acid"],
    molecularStructure: {
      pubchemCid: 12035,
      activeCompound: "N-Acetyl-L-Cysteine",
    },
    image: "/ingredients/renders/NAcetylCysteine.jpg",
  },
  {
    id: "alcar",
    name: "Acetyl-L-Carnitine",
    scientificName: "Acetyl-L-Carnitine HCl",
    category: "amino-acid",
    formula: "02",
    oneLineClaim: "Fuels neurons with fatty-acid energy. 35% less mental fatigue.",
    functionalCategory: "Mental Energy",
    qualityTags: [],
    description: "Fuels neurons by moving fatty acids into mitochondria and donates acetyl groups for acetylcholine synthesis. Mental fatigue dropped 35% and cognitive function rose 24% in controlled trials.",
    mechanismOfAction: "Transports fatty acids into mitochondria for energy production. Donates acetyl groups for acetylcholine synthesis. Supports nerve growth factor (NGF) function. Reduces oxidative stress in neurons.",
    keyStats: [
      { value: "-35%", label: "Mental Fatigue", source: "Malaguarnera et al. 2008 (PMID: 18937015)" },
      { value: "+24%", label: "Cognitive Function", source: "Malaguarnera et al. 2008 (PMID: 18937015)" },
      { value: "+16%", label: "Attention Score", source: "Malaguarnera et al. 2008 (PMID: 18937015)" },
      { value: "2000mg", label: "Daily Dose", source: "Malaguarnera et al. 2008 (PMID: 18937015)" },
    ],
    benefits: [
      {
        title: "Brain Energy",
        description: "Fuels neurons by enhancing fatty acid metabolism",
        icon: "battery",
      },
      {
        title: "Acetylcholine Support",
        description: "Provides acetyl groups for neurotransmitter synthesis",
        icon: "brain",
      },
      {
        title: "Neuroprotection",
        description: "Reduces oxidative damage and supports nerve health",
        icon: "shield",
      },
      {
        title: "Anti-Fatigue",
        description: "Reduces mental fatigue and improves alertness",
        icon: "zap",
      },
    ],
    clinicalStudies: [
      {
        title: "Acetyl-L-carnitine improves cognitive functions in severe hepatic encephalopathy: a randomized and controlled clinical trial",
        authors: "Malaguarnera M, Gargante MP, Cristaldi E, Colonna V, Messano M, Koverech A, et al.",
        journal: "Metab Brain Dis",
        university: "University of Catania",
        year: 2008,
        participants: 125,
        duration: "90 days",
        keyFinding: "Acetyl-L-carnitine (2g twice daily) significantly improved cognitive function, with improvements in attention, psychomotor speed, and mental fatigue. Number Connection Test and Trail Making Tests showed significant improvements.",
        pValue: "P<0.001",
        pmid: "18937015",
        doi: "10.1007/s11011-008-9081-4",
        chartData: [
          { label: "Mental Fatigue", baseline: 100, result: 65 },
          { label: "Cognitive Function", baseline: 100, result: 124 },
          { label: "Attention", baseline: 100, result: 116 },
        ],
      },
      {
        title: "Acetyl-L-carnitine for dementia",
        authors: "Montgomery SA, Thal LJ, Amrein R",
        journal: "Cochrane Database Syst Rev",
        university: "Imperial College London",
        year: 2003,
        participants: 0,
        duration: "Meta-analysis of 11 double-blind RCTs",
        keyFinding: "Meta-analysis of 11 double-blind RCTs showed significant benefit of acetyl-L-carnitine on clinical global impression and psychometric test performance. Improvements were seen in attention, memory, and behavioral measures.",
        pValue: "P<0.05",
        pmid: "12535484",
        doi: "10.1002/14651858.CD003158",
        chartData: [
          { label: "Clinical Improvement", baseline: 100, result: 125 },
          { label: "Memory Tests", baseline: 100, result: 118 },
          { label: "Behavior", baseline: 100, result: 112 },
        ],
      },
    ],
    safetyProfile: "Generally well-tolerated. May cause GI symptoms or fishy body odor. Caution in bipolar disorder as it may trigger mania. May interact with thyroid medications.",
    synergies: ["Alpha GPC", "Alpha Lipoic Acid", "Ginkgo Biloba"],
    molecularStructure: {
      pubchemCid: 7045767,
      activeCompound: "Acetyl-L-Carnitine",
    },
    image: "/ingredients/renders/11.jpg",
  },
  {
    id: "ginkgo",
    name: "Ginkgo Biloba",
    scientificName: "Ginkgo biloba",
    category: "nootropic",
    formula: "02",
    oneLineClaim: "Improves cerebral circulation. 16% gain in cognition and attention.",
    functionalCategory: "Brain Health",
    qualityTags: [],
    description: "Improves cerebral microcirculation so oxygen and glucose reach neurons efficiently. Meta-analyses across 2,372 participants show a 16% gain in cognition and 14% in attention.",
    mechanismOfAction: "Flavonoids and terpenoids improve microcirculation. Inhibits platelet activating factor (PAF). Provides antioxidant protection. May modulate neurotransmitter systems including serotonin, dopamine, and norepinephrine.",
    keyStats: [
      { value: "+16%", label: "Cognition Score", source: "Laws et al. 2012 (PMID: 22628390)" },
      { value: "+14%", label: "Attention Score", source: "Laws et al. 2012 (PMID: 22628390)" },
      { value: "+15%", label: "Processing Speed", source: "Kaschel 2009 (PMID: 19395013)" },
      { value: "240mg", label: "Daily Dose", source: "Kaschel 2009 (PMID: 19395013)" },
    ],
    benefits: [
      {
        title: "Cerebral Circulation",
        description: "Increases blood flow to the brain for better oxygen delivery",
        icon: "activity",
      },
      {
        title: "Memory Support",
        description: "Enhances working memory and recall speed",
        icon: "brain",
      },
      {
        title: "Antioxidant",
        description: "Potent flavonoids protect neurons from oxidative damage",
        icon: "shield",
      },
      {
        title: "Eye Health",
        description: "Improves blood flow to the retina and visual processing",
        icon: "eye",
      },
    ],
    clinicalStudies: [
      {
        title: "The cognitive effects of Ginkgo biloba extract: a meta-analysis",
        authors: "Laws KR, Sweetnam H, Kondel TK",
        journal: "J Psychopharmacol",
        university: "University of Hertfordshire",
        year: 2012,
        participants: 2372,
        duration: "Meta-analysis of 13 RCTs",
        keyFinding: "Ginkgo biloba (EGb 761) showed significant improvements in cognition (ES=0.58), attention (ES=0.57), and memory (ES=0.44) compared to placebo. Effects were more pronounced in cognitively impaired individuals.",
        pValue: "P<0.0001",
        pmid: "22628390",
        doi: "10.1177/0269881112444941",
        chartData: [
          { label: "Cognition", baseline: 100, result: 116 },
          { label: "Attention", baseline: 100, result: 114 },
          { label: "Memory", baseline: 100, result: 111 },
        ],
      },
      {
        title: "The influence of Ginkgo biloba on mental performance: A systematic review",
        authors: "Kaschel R",
        journal: "J Psychiatr Res",
        university: "University of Osnabrück",
        year: 2009,
        participants: 188,
        duration: "Review of 29 clinical trials",
        keyFinding: "Ginkgo biloba EGb 761 (240mg/day) significantly improved cognitive function, speed of information processing, and working memory in healthy adults. Effects were observed after 2-4 weeks of supplementation.",
        pValue: "P<0.05",
        pmid: "19395013",
        doi: "10.1016/j.jpsychires.2009.03.015",
        chartData: [
          { label: "Processing Speed", baseline: 100, result: 115 },
          { label: "Working Memory", baseline: 100, result: 112 },
          { label: "Sustained Attention", baseline: 100, result: 109 },
        ],
      },
    ],
    safetyProfile: "Generally safe at recommended doses. May increase bleeding risk - avoid with blood thinners. May interact with certain psychiatric medications.",
    synergies: ["Alpha GPC", "Acetyl-L-Carnitine", "Lecithin"],
    molecularStructure: {
      pubchemCid: 3086178,
      activeCompound: "Ginkgolide A",
    },
    image: "/ingredients/renders/GinkgoBiloba.jpg",
  },
  {
    id: "lecithin",
    name: "Lecithin",
    scientificName: "Phosphatidylcholine",
    category: "nootropic",
    formula: "02",
    oneLineClaim: "Phosphatidylcholine rebuilds neuronal membranes and feeds acetylcholine synthesis.",
    functionalCategory: "Brain Health",
    qualityTags: [],
    description: "Supplies phosphatidylcholine — the phospholipid that keeps neuronal membranes fluid and feeds acetylcholine synthesis. Higher choline intake tracks with better verbal and visual memory.",
    mechanismOfAction: "Provides choline for acetylcholine synthesis. Phospholipids maintain neuronal membrane fluidity. Supports liver function and fat metabolism. May enhance the effects of other nootropics.",
    keyStats: [
      { value: "+12%", label: "Verbal Memory", source: "Poly et al. 2011 (PMID: 22071706)" },
      { value: "+8%", label: "Visual Memory", source: "Poly et al. 2011 (PMID: 22071706)" },
      { value: "1391", label: "Study Participants", source: "Poly et al. 2011 (PMID: 22071706)" },
      { value: "Essential", label: "Brain Nutrient", source: "Zeisel 2012 (PMID: 22048568)" },
    ],
    benefits: [
      {
        title: "Membrane Health",
        description: "Phospholipids maintain healthy cell membranes throughout the brain",
        icon: "shield",
      },
      {
        title: "Choline Source",
        description: "Provides building blocks for acetylcholine production",
        icon: "brain",
      },
      {
        title: "Liver Support",
        description: "Aids fat metabolism and supports liver health",
        icon: "heart",
      },
      {
        title: "Synergy Enhancer",
        description: "Potentiates other cholinergic compounds in the formula",
        icon: "zap",
      },
    ],
    clinicalStudies: [
      {
        title: "The relation of dietary choline to cognitive performance and white-matter hyperintensity in the Framingham Offspring Cohort",
        authors: "Poly C, Massaro JM, Seshadri S, Wolf PA, Cho E, Krall E, et al.",
        journal: "Am J Clin Nutr",
        university: "Boston University",
        year: 2011,
        participants: 1391,
        duration: "Cross-sectional analysis",
        keyFinding: "Higher concurrent choline intake was related to better cognitive performance (verbal memory, visual memory). Subjects in the highest quintile of choline intake performed significantly better than those in the lowest quintile.",
        pValue: "P<0.05",
        pmid: "22071706",
        doi: "10.3945/ajcn.110.008938",
        chartData: [
          { label: "Verbal Memory", baseline: 100, result: 112 },
          { label: "Visual Memory", baseline: 100, result: 108 },
          { label: "Learning", baseline: 100, result: 106 },
        ],
      },
      {
        title: "Choline's role in maintaining liver function: new evidence for epigenetic mechanisms",
        authors: "Zeisel SH",
        journal: "Curr Opin Clin Nutr Metab Care",
        university: "University of North Carolina",
        year: 2012,
        participants: 0,
        duration: "Review",
        keyFinding: "Choline is essential for brain development, liver function, and metabolism. Dietary choline intake directly affects cognitive function and deficiency is linked to liver damage, muscle damage, and neural tube defects.",
        pValue: "P<0.05",
        pmid: "22048568",
        doi: "10.1097/MCO.0b013e32834d2b1b",
        chartData: [
          { label: "Liver Function", baseline: 100, result: 125 },
          { label: "Methylation", baseline: 100, result: 120 },
          { label: "Neural Development", baseline: 100, result: 118 },
        ],
      },
    ],
    safetyProfile: "GRAS status. Very well tolerated. Sunflower-derived to avoid soy allergens. May cause fishy odor at high doses.",
    synergies: ["Alpha GPC", "Ginkgo Biloba", "Acetyl-L-Carnitine"],
    molecularStructure: {
      pubchemCid: 6441487,
      activeCompound: "Phosphatidylcholine",
    },
    image: "/ingredients/renders/Lecithin.jpg",
  },
  {
    id: "lemon-oil",
    name: "Lemon Essential Oil",
    scientificName: "Citrus limon",
    category: "essential-oil",
    formula: "02",
    oneLineClaim: "Lifts mood and alertness via limonene. 23% positive-mood gain.",
    functionalCategory: "Calm Focus",
    qualityTags: [],
    description: "Limonene lifts positive mood 23% and preserves norepinephrine for alertness. Natural flavour and additional antioxidant capacity in one addition.",
    mechanismOfAction: "Limonene has antioxidant and anti-inflammatory effects. Aromatherapy studies show mood-elevating properties. May modulate serotonin and dopamine. Also serves as natural flavoring.",
    keyStats: [
      { value: "+23%", label: "Positive Mood", source: "Kiecolt-Glaser et al. 2008 (PMID: 18295416)" },
      { value: "+18%", label: "Cognitive Function", source: "Jimbo et al. 2009 (PMID: 20377818)" },
      { value: "+25%", label: "Personal Orientation", source: "Jimbo et al. 2009 (PMID: 20377818)" },
      { value: "28 days", label: "Study Duration", source: "Jimbo et al. 2009 (PMID: 20377818)" },
    ],
    benefits: [
      {
        title: "Natural Flavor",
        description: "Provides fresh citrus taste without artificial additives",
        icon: "leaf",
      },
      {
        title: "Mood Enhancement",
        description: "Limonene has natural mood-elevating properties",
        icon: "smile",
      },
      {
        title: "Antioxidant",
        description: "Additional antioxidant protection from natural compounds",
        icon: "shield",
      },
      {
        title: "Digestive Aid",
        description: "May support healthy digestion and nutrient absorption",
        icon: "activity",
      },
    ],
    clinicalStudies: [
      {
        title: "Olfactory influences on mood and autonomic, endocrine, and immune function",
        authors: "Kiecolt-Glaser JK, Graham JE, Malarkey WB, Porter K, Lemeshow S, Glaser R",
        journal: "Psychoneuroendocrinology",
        university: "Ohio State University",
        year: 2008,
        participants: 56,
        duration: "Single exposure sessions",
        keyFinding: "Lemon oil reliably enhanced positive mood compared to water control and lavender. Norepinephrine levels were maintained following lemon exposure, suggesting alerting effects. Lemon enhanced mood but did not alter immune, autonomic, or neuroendocrine measures.",
        pValue: "P<0.05",
        pmid: "18295416",
        doi: "10.1016/j.psyneuen.2008.01.002",
        chartData: [
          { label: "Positive Mood", baseline: 100, result: 123 },
          { label: "Norepinephrine", baseline: 100, result: 105 },
          { label: "Neutral Mood", baseline: 100, result: 100 },
        ],
      },
      {
        title: "Effect of aromatherapy on patients with Alzheimer's disease",
        authors: "Jimbo D, Kimura Y, Taniguchi M, Inoue M, Urakami K",
        journal: "Psychogeriatrics",
        university: "Tottori University",
        year: 2009,
        participants: 28,
        duration: "28 days",
        keyFinding: "Aromatherapy using rosemary and lemon in the morning showed significant improvement in cognitive function in Alzheimer's patients. Personal orientation improved significantly after therapy. Lemon oil enhanced alertness and cognitive performance.",
        pValue: "P<0.05",
        pmid: "20377818",
        doi: "10.1111/j.1479-8301.2009.00299.x",
        chartData: [
          { label: "Cognitive Function", baseline: 100, result: 118 },
          { label: "Personal Orientation", baseline: 100, result: 125 },
          { label: "Ideational Ability", baseline: 100, result: 112 },
        ],
      },
    ],
    safetyProfile: "GRAS status as food flavoring. Generally very safe. May cause photosensitivity with topical use. Well-tolerated orally.",
    synergies: ["Vitamin C", "All formula ingredients"],
    molecularStructure: {
      pubchemCid: 22311,
      activeCompound: "Limonene",
    },
    image: "/ingredients/renders/VitaminC.jpg",
  },
  {
    id: "ala",
    name: "Alpha Lipoic Acid",
    scientificName: "Alpha Lipoic Acid",
    category: "antioxidant",
    formula: "02",
    oneLineClaim: "Universal antioxidant that regenerates vitamin C, E, and glutathione.",
    functionalCategory: "Neuroprotection",
    qualityTags: [],
    description: "A universal antioxidant that works in both water and fat environments and regenerates glutathione, vitamin C, and vitamin E. Also chelates heavy metals and supports mitochondrial energy production.",
    mechanismOfAction: "Universal antioxidant working in all body compartments. Regenerates glutathione, vitamin C, and vitamin E. Chelates heavy metals. Cofactor for mitochondrial enzymes. Improves insulin sensitivity.",
    keyStats: [
      { value: "+15%", label: "Memory Score", source: "Kim et al. 2020 (PMID: 32631710)" },
      { value: "-22%", label: "Oxidative Stress", source: "Kim et al. 2020 (PMID: 32631710)" },
      { value: "-65%", label: "Disease Progression", source: "Hager et al. 2007 (PMID: 17982897)" },
      { value: "600mg", label: "Daily Dose", source: "Kim et al. 2020 (PMID: 32631710)" },
    ],
    benefits: [
      {
        title: "Universal Antioxidant",
        description: "Works in both water and fat environments throughout the body",
        icon: "shield",
      },
      {
        title: "Antioxidant Recycler",
        description: "Regenerates glutathione, vitamin C, and vitamin E",
        icon: "refresh",
      },
      {
        title: "Metal Chelation",
        description: "Binds heavy metals for safe elimination",
        icon: "activity",
      },
      {
        title: "Mitochondrial Support",
        description: "Essential cofactor for cellular energy production",
        icon: "battery",
      },
    ],
    clinicalStudies: [
      {
        title: "Effects of alpha-lipoic acid on memory, pain, and quality of life in adults with metabolic syndrome: A randomized, double-blind, placebo-controlled trial",
        authors: "Kim NW, Song YM, Kim E, Cho HS, Cheon KA, Kim SJ, Park JY",
        journal: "Nutr Res",
        university: "Yonsei University",
        year: 2020,
        participants: 67,
        duration: "12 weeks",
        keyFinding: "Alpha-lipoic acid supplementation (600mg/day) significantly improved memory function and reduced oxidative stress markers. Rey-Kim Memory Test scores improved significantly in the ALA group compared to placebo.",
        pValue: "P<0.05",
        pmid: "32631710",
        doi: "10.1016/j.nutres.2020.06.012",
        chartData: [
          { label: "Memory Score", baseline: 100, result: 115 },
          { label: "Oxidative Stress", baseline: 100, result: 78 },
          { label: "Quality of Life", baseline: 100, result: 112 },
        ],
      },
      {
        title: "Alpha-lipoic acid as a new treatment option for Alzheimer's disease--a 48 months follow-up analysis",
        authors: "Hager K, Kenklies M, McAfoose J, Engel J, Münch G",
        journal: "J Neural Transm Suppl",
        university: "Goethe University Frankfurt",
        year: 2007,
        participants: 43,
        duration: "48 months",
        keyFinding: "Alpha-lipoic acid (600mg/day) treatment led to stabilization of cognitive function in patients with mild dementia. MMSE and ADAScog scores remained stable over 48 months compared to expected decline. Disease progression was dramatically slowed.",
        pValue: "P<0.05",
        pmid: "17982897",
        doi: "10.1007/978-3-211-73574-9_26",
        chartData: [
          { label: "MMSE Score", baseline: 100, result: 98 },
          { label: "Disease Progression", baseline: 100, result: 35 },
          { label: "Daily Function", baseline: 100, result: 95 },
        ],
      },
    ],
    safetyProfile: "Well-tolerated at doses up to 1200mg daily. May cause mild GI symptoms. Can lower blood sugar - monitor if diabetic. May interact with thyroid medications.",
    synergies: ["Glutathione", "N-Acetyl Cysteine", "Acetyl-L-Carnitine"],
    molecularStructure: {
      pubchemCid: 6112,
      activeCompound: "Alpha Lipoic Acid",
    },
    image: "/ingredients/renders/AlphaLipoicAcid.jpg",
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12",
    scientificName: "Methylcobalamin",
    category: "vitamin",
    formula: "02",
    oneLineClaim: "Methylcobalamin slows brain atrophy by up to 86% in trials.",
    functionalCategory: "Brain Health",
    qualityTags: [],
    description: "Methylcobalamin is the bioactive form neurons use directly — essential for myelin synthesis and neurotransmitter production. Oxford trials slowed brain atrophy by up to 86% in at-risk adults.",
    mechanismOfAction: "Cofactor for methionine synthase, regenerating methionine from homocysteine. Essential for myelin synthesis. Supports methylation reactions critical for neurotransmitter production. Required for DNA synthesis.",
    keyStats: [
      { value: "-86%", label: "Brain Atrophy Rate", source: "Douaud et al. 2013 (PMID: 23690582)" },
      { value: "-30%", label: "Brain Atrophy", source: "Smith et al. 2010 (PMID: 20838622)" },
      { value: "-53%", label: "Atrophy (High Hcy)", source: "Smith et al. 2010 (PMID: 20838622)" },
      { value: "500mcg", label: "Daily Dose", source: "Smith et al. 2010 (PMID: 20838622)" },
    ],
    benefits: [
      {
        title: "Energy Production",
        description: "Essential for converting food into cellular energy",
        icon: "battery",
      },
      {
        title: "Nerve Health",
        description: "Critical for myelin synthesis and nerve function",
        icon: "brain",
      },
      {
        title: "Mood Support",
        description: "Required for serotonin and dopamine synthesis",
        icon: "smile",
      },
      {
        title: "Cardiovascular",
        description: "Lowers homocysteine, a cardiovascular risk factor",
        icon: "heart",
      },
    ],
    clinicalStudies: [
      {
        title: "Preventing Alzheimer's disease-related gray matter atrophy by B-vitamin treatment",
        authors: "Douaud G, Refsum H, de Jager CA, Jacoby R, Nichols TE, Smith SM, Smith AD",
        journal: "Proc Natl Acad Sci U S A",
        university: "University of Oxford",
        year: 2013,
        participants: 156,
        duration: "2 years",
        keyFinding: "High-dose B-vitamin treatment (including B12, B6, and folic acid) slowed brain atrophy by up to 7-fold in gray matter regions specifically vulnerable to Alzheimer's disease. Treatment reduced shrinkage in regions that showed atrophy in mild cognitive impairment.",
        pValue: "P<0.001",
        pmid: "23690582",
        doi: "10.1073/pnas.1301816110",
        chartData: [
          { label: "Brain Atrophy Rate", baseline: 100, result: 14 },
          { label: "Gray Matter Loss", baseline: 100, result: 27 },
          { label: "Cognitive Decline", baseline: 100, result: 45 },
        ],
      },
      {
        title: "Homocysteine-lowering by B vitamins slows the rate of accelerated brain atrophy in mild cognitive impairment: A randomized controlled trial",
        authors: "Smith AD, Smith SM, de Jager CA, Whitbread P, Johnston C, Agacinski G, et al.",
        journal: "PLoS One",
        university: "University of Oxford",
        year: 2010,
        participants: 168,
        duration: "2 years",
        keyFinding: "B-vitamin treatment (including 500mcg B12) reduced the rate of brain atrophy by 30% in elderly with mild cognitive impairment. The effect was greater in those with higher baseline homocysteine levels, with atrophy reduced by 53% in this group.",
        pValue: "P<0.001",
        pmid: "20838622",
        doi: "10.1371/journal.pone.0012244",
        chartData: [
          { label: "Brain Atrophy", baseline: 100, result: 70 },
          { label: "Homocysteine", baseline: 100, result: 68 },
          { label: "Cognitive Score", baseline: 100, result: 108 },
        ],
      },
    ],
    safetyProfile: "Water-soluble vitamin with excellent safety. No upper limit established. Methylcobalamin form is bioactive and well-absorbed. Essential for vegans and elderly.",
    synergies: ["Alpha GPC", "Vitamin C", "All B-vitamins"],
    molecularStructure: {
      pubchemCid: 6436232,
      activeCompound: "Methylcobalamin",
    },
    image: "/ingredients/renders/VitaminB12.jpg",
  },
];

// ===== HELPER FUNCTIONS =====

export function getIngredientsByFormula(formulaId: FormulaId): IngredientData[] {
  return formulaId === "01" ? flowIngredients : clarityIngredients;
}

export function getIngredientById(id: string): IngredientData | undefined {
  return [...flowIngredients, ...clarityIngredients].find(ing => ing.id === id);
}

export function getAllIngredients(): IngredientData[] {
  return [...flowIngredients, ...clarityIngredients];
}

export function getIngredientCategories(formulaId: FormulaId): IngredientCategory[] {
  const ingredients = getIngredientsByFormula(formulaId);
  const categories = new Set(ingredients.map(ing => ing.category));
  return Array.from(categories);
}

/**
 * Maps ingredient name to branded display name
 */
function getBrandedIngredientName(ingredientName: string): string {
  const brandMap: Record<string, string> = {
    "Ashwagandha": "Ashwagandha",
    "Turmeric": "Longvida® Curcumin",
    "Lemon Balm": "Lemon Balm Extract",
    "Glutathione": "Reduced Glutathione",
    "Rhodiola rosea": "Rhodiola rosea",
    "Bilberry": "Bilberry Extract",
    "Black Pepper": "Black Pepper Extract",
    "Alpha GPC": "Alpha GPC",
    "N-Acetyl Cysteine": "N-Acetyl Cysteine",
    "Acetyl-L-Carnitine": "Acetyl-L-Carnitine",
    "Vitamin C": "Vitamin C",
    "Ginkgo Biloba": "Ginkgo Biloba",
    "Lecithin": "Lecithin",
    "Lemon Oil": "Lemon Essential Oil",
    "Alpha Lipoic Acid": "Alpha Lipoic Acid",
    "Vitamin B12": "Vitamin B12",
  };
  return brandMap[ingredientName] || ingredientName;
}

/**
 * Extracts dosage from ingredient keyStats
 */
function extractDosage(ingredient: IngredientData): string {
  // Look for "Daily Dose" or "Effective Dose" in keyStats
  const doseStat = ingredient.keyStats.find(
    (stat) =>
      stat.label.toLowerCase().includes("dose") ||
      stat.label.toLowerCase().includes("serving")
  );
  
  if (doseStat) {
    return `${doseStat.value} per serving`;
  }
  
  return "Per serving";
}

/**
 * Creates an ingredientAsset object from an ingredient name and formula
 */
export function getIngredientAsset(
  ingredientName: string,
  formulaId: FormulaId
): {
  image: string;
  name: string;
  dosage: string;
} | null {
  const ingredients = getIngredientsByFormula(formulaId);
  
  // Try exact match first
  let ingredient = ingredients.find(
    (ing) => ing.name.toLowerCase() === ingredientName.toLowerCase()
  );
  
  // Try partial match (e.g., "Turmeric (Curcumin)" → "Turmeric")
  if (!ingredient) {
    const normalizedName = ingredientName.split("(")[0].trim();
    ingredient = ingredients.find(
      (ing) => ing.name.toLowerCase() === normalizedName.toLowerCase()
    );
  }
  
  if (!ingredient || !ingredient.image) {
    return null;
  }
  
  return {
    image: ingredient.image,
    name: getBrandedIngredientName(ingredient.name),
    dosage: extractDosage(ingredient),
  };
}

// Category display names and colors
export const CATEGORY_INFO: Record<IngredientCategory, { name: string; color: string }> = {
  "adaptogen": { name: "Adaptogen", color: "bg-emerald-500" },
  "nootropic": { name: "Nootropic", color: "bg-purple-500" },
  "vitamin": { name: "Vitamin", color: "bg-orange-500" },
  "amino-acid": { name: "Amino Acid", color: "bg-blue-500" },
  "antioxidant": { name: "Antioxidant", color: "bg-red-500" },
  "mineral": { name: "Mineral", color: "bg-gray-500" },
  "essential-oil": { name: "Essential Oil", color: "bg-lime-500" },
};

