// CONKA — "15 Science-Backed Ingredients" section data.
// Pure content. No commerce dependency — safe to keep in the repo as-is.
// `img` paths assume assets live under /public/lander/... (see ASSETS.md).

export type IngredientTag =
  | 'Adaptogen'
  | 'Antioxidant'
  | 'Bioavailability'
  | 'Nootropic'
  | 'Vitamin'
  | 'Amino Acid';

export interface Ingredient {
  img: string;
  tag: IngredientTag;
  name: string;
  /** One-line benefit shown on the rail card. */
  benefit: string;
  /** Headline figure, e.g. "-56%". */
  stat: string;
  /** What the figure measures, e.g. "Stress Score". */
  metric: string;
  /** Study citation. */
  cite: string;
  /** Long-form copy shown in the full-list modal. May contain HTML entities. */
  detail: string;
}

export interface Formula {
  key: 'flow' | 'clear';
  img: string;
  name: string;
  sub: string;
  /** Total active nootropics, e.g. "3,700mg". */
  mg: string;
  /** e.g. "6 of 15 ingredients". */
  count: string;
  /** Modal subtitle, e.g. "6 active ingredients · tap any to learn more". */
  ingCount: string;
  items: Ingredient[];
}

const R = '/lander/ingredients/';

export const FORMULAS: Record<'flow' | 'clear', Formula> = {
  flow: {
    key: 'flow',
    img: '/lander/FlowNew.jpg',
    name: 'CONKA Flow',
    sub: 'Calm focus for your mornings.',
    mg: '3,700mg',
    count: '6 of 15 ingredients',
    ingCount: '6 active ingredients · tap any to learn more',
    items: [
      {
        img: R + 'Ashwagandha.jpg',
        tag: 'Adaptogen',
        name: 'Ashwagandha',
        benefit: 'Cuts cortisol 28% and perceived stress by more than half.',
        stat: '-56%',
        metric: 'Stress Score',
        cite: 'Chandrasekhar et al. 2012',
        detail:
          'Ashwagandha (Withania somnifera) has been the central rejuvenating herb of Ayurvedic medicine in India for more than 3,000 years, prized as a &ldquo;rasayana&rdquo; said to restore vitality. Its active withanolides calm the HPA axis &mdash; the body&rsquo;s stress-response system &mdash; lowering circulating cortisol. Because chronically high cortisol erodes memory and clouds decision-making, bringing it down protects the brain&rsquo;s ability to think clearly under pressure. Sleep quality improves in parallel, so recovery and focus are handled together.',
      },
      {
        img: R + 'RhodiolaRosea.jpg',
        tag: 'Adaptogen',
        name: 'Rhodiola Rosea',
        benefit: 'Fights burnout and mental fatigue under prolonged stress.',
        stat: '-28%',
        metric: 'Burnout Score',
        cite: 'Olsson et al. 2009',
        detail:
          'A hardy flowering plant from the Arctic and mountainous regions of Europe and Asia, Rhodiola was used by Viking warriors for endurance and by Soviet scientists to keep cosmonauts and athletes sharp under extreme strain. Its rosavins and salidroside protect dopamine and serotonin, the neurotransmitters that govern motivation and mood. This is why Rhodiola fights mental fatigue and burnout specifically when stress is prolonged &mdash; it keeps cognitive energy from collapsing when the pressure doesn&rsquo;t let up.',
      },
      {
        img: R + 'Turmeric.jpg',
        tag: 'Antioxidant',
        name: 'Turmeric',
        benefit: 'Protects neurons and improves memory in an 18-month UCLA trial.',
        stat: '+63%',
        metric: 'Memory (SRT)',
        cite: 'Small et al. 2018',
        detail:
          'Turmeric has been used as both food and medicine across India and Southeast Asia for over 4,000 years, and populations with turmeric-rich diets show notably lower rates of age-related cognitive decline. Its active compound curcumin crosses the blood-brain barrier, where it calms neuroinflammation and raises BDNF &mdash; the protein the brain relies on to build new connections and form memories. In an 18-month UCLA trial, participants taking it saw memory improve 63% and attention 96% against placebo.',
      },
      {
        img: R + 'LemonBalm.jpg',
        tag: 'Adaptogen',
        name: 'Lemon Balm',
        benefit: 'Calms anxiety and sharpens focus without sedation or next-day grogginess.',
        stat: '-28%',
        metric: 'Anxiety Reduction',
        cite: 'Kennedy et al. 2006',
        detail:
          'Lemon balm (Melissa officinalis) is a Mediterranean herb in the mint family, used since ancient Greece and championed by the 16th-century physician Paracelsus as an &ldquo;elixir of life&rdquo; for the mind. It works by inhibiting GABA-transaminase, raising levels of the brain&rsquo;s primary calming neurotransmitter. The result is reduced anxiety and sharper, calmer focus &mdash; without the sedation or next-day grogginess of conventional relaxants. Its rosmarinic acid also adds antioxidant protection for the neurons doing the work.',
      },
      {
        img: R + 'BlackPepper.jpg',
        tag: 'Bioavailability',
        name: 'Black Pepper',
        benefit: 'Multiplies curcumin absorption so the rest of the formula works.',
        stat: '2000%',
        metric: 'Curcumin Absorption',
        cite: 'Shoba et al. 1998',
        detail:
          'Black pepper was so valuable along the ancient spice routes it was once used as currency and called &ldquo;black gold.&rdquo; Its active compound piperine isn&rsquo;t a nootropic itself &mdash; its job is to make the others work. Piperine inhibits the liver enzymes that would otherwise rapidly break down curcumin, raising its bioavailability by up to 2,000%. A small dose delivers a disproportionate lift to the absorption of the entire formula.',
      },
      {
        img: R + 'Bilberry.jpg',
        tag: 'Antioxidant',
        name: 'Bilberry',
        benefit: 'Anthocyanins cross the blood-brain barrier to improve recall.',
        stat: '+18%',
        metric: 'Word Recall',
        cite: 'Krikorian et al. 2010',
        detail:
          'Bilberry is the wild European cousin of the blueberry, famous in folklore after WWII RAF pilots credited bilberry jam for their sharp night vision. Its deep colour comes from anthocyanins, antioxidants that cross the blood-brain barrier and improved word recall by 18% in older adults in clinical testing. It also protects the microcirculation and retinal function &mdash; the same healthy blood flow that cognition depends on.',
      },
    ],
  },
  clear: {
    key: 'clear',
    img: '/lander/ClearNew.jpg',
    name: 'CONKA Clear',
    sub: 'Afternoon clarity & reset',
    mg: '3,142mg',
    count: '9 of 15 ingredients',
    ingCount: '9 active ingredients · tap any to learn more',
    items: [
      {
        img: R + 'GinkgoBiloba.jpg',
        tag: 'Nootropic',
        name: 'Ginkgo Biloba',
        benefit: 'Improves cerebral circulation across 2,372 trial participants.',
        stat: '+16%',
        metric: 'Cognition Score',
        cite: 'Laws et al. 2012',
        detail:
          'Ginkgo biloba is a living fossil &mdash; the sole survivor of a tree lineage over 200 million years old, and a cornerstone of traditional Chinese medicine for centuries. It works by improving cerebral microcirculation, so oxygen and glucose reach neurons more efficiently. Meta-analyses across 2,372 participants show a 16% gain in cognition and 14% in attention, making it one of the most studied botanicals for keeping the brain supplied through a demanding afternoon.',
      },
      {
        img: R + 'AlphaLipoicAcid.jpg',
        tag: 'Antioxidant',
        name: 'Alpha Lipoic Acid',
        benefit: 'Universal antioxidant that regenerates vitamin C, E, and glutathione.',
        stat: '+15%',
        metric: 'Memory Score',
        cite: 'Kim et al. 2020',
        detail:
          'Discovered in the 1950s, alpha lipoic acid is unusual in being a &ldquo;universal&rdquo; antioxidant: it works in both the watery and fatty environments of the body, so it can protect every part of a neuron. It also regenerates other spent antioxidants &mdash; vitamin C, vitamin E and glutathione &mdash; effectively recycling the brain&rsquo;s defences. By supporting mitochondrial energy production and chelating heavy metals, it helps neurons stay both fuelled and protected.',
      },
      {
        img: R + 'VitaminC.jpg',
        tag: 'Vitamin',
        name: 'Vitamin C',
        benefit: 'Neuroprotective antioxidant concentrated 15x in the brain vs plasma.',
        stat: '+14%',
        metric: 'Attention Score',
        cite: 'Travica et al. 2017',
        detail:
          'Vitamin C&rsquo;s link to health was proven in 1747 when James Lind ran one of history&rsquo;s first clinical trials to cure scurvy. The brain prizes it so highly that it concentrates ascorbic acid up to 15 times higher in neurons than in the bloodstream. There it acts as a cofactor for making dopamine and norepinephrine and as the brain&rsquo;s primary water-soluble antioxidant &mdash; attention scores track closely with how much is circulating.',
      },
      {
        img: R + 'VitaminB12.jpg',
        tag: 'Vitamin',
        name: 'Vitamin B12',
        benefit: 'Methylcobalamin slows brain atrophy in Oxford trials.',
        stat: '-86%',
        metric: 'Brain Atrophy Rate',
        cite: 'Douaud et al. 2013',
        detail:
          'Vitamin B12 was isolated in 1948 after decades of work on what made pernicious anaemia fatal. CONKA uses methylcobalamin, the bioactive form neurons use directly &mdash; essential for building the myelin that insulates nerve fibres and for producing neurotransmitters. In Oxford trials, adequate B12 slowed brain atrophy by up to 86% in at-risk older adults, protecting the physical structure of the brain itself.',
      },
      {
        img: R + 'AlphaGPC.jpg',
        tag: 'Nootropic',
        name: 'Alpha GPC',
        benefit: 'The most bioavailable choline form. Raises acetylcholine for sharper recall.',
        stat: '+14%',
        metric: 'Isometric Force',
        cite: 'Parker et al. 2015',
        detail:
          'Alpha GPC is the most bioavailable form of choline available in supplementation, delivering it straight past the blood-brain barrier. Once there it raises acetylcholine &mdash; the neurotransmitter that recall, learning and reaction speed all run on. Originally studied for memory in clinical settings, it has become a favourite of focused professionals and athletes for the clean, sharp cognition it supports.',
      },
      {
        img: R + '11.jpg',
        tag: 'Antioxidant',
        name: 'Glutathione',
        benefit: 'The body&rsquo;s master antioxidant. Raises blood stores in four weeks.',
        stat: '+40%',
        metric: 'Blood GSH Levels',
        cite: 'Sinha et al. 2018',
        detail:
          'Glutathione, first identified in 1888, is often called the body&rsquo;s &ldquo;master antioxidant&rdquo; because it is the principal molecule cells use to neutralise reactive oxygen species. In the brain &mdash; an organ that burns enormous amounts of oxygen and is highly vulnerable to oxidative damage &mdash; this protection is critical. It also regenerates vitamins C and E, and oral supplementation has been shown to raise blood stores by 40% in four weeks.',
      },
      {
        img: R + 'NAcetylCysteine.jpg',
        tag: 'Amino Acid',
        name: 'N-Acetyl Cysteine',
        benefit: 'Rebuilds glutathione and calms brain glutamate.',
        stat: '+22%',
        metric: 'Cognitive Function',
        cite: 'Berk et al. 2008',
        detail:
          'N-acetyl cysteine (NAC) began life as a hospital medicine in the 1960s and is on the WHO list of essential medicines. It supplies cysteine, the rate-limiting building block the body needs to manufacture its own glutathione, so it keeps the brain&rsquo;s antioxidant defences stocked. It also modulates glutamate, the brain&rsquo;s main excitatory neurotransmitter &mdash; calming overstimulation, with cognitive improvements measured at 22% in randomised trials.',
      },
      {
        img: R + '11.jpg',
        tag: 'Amino Acid',
        name: 'Acetyl-L-Carnitine',
        benefit: 'Fuels neurons with fatty-acid energy. Less mental fatigue.',
        stat: '-35%',
        metric: 'Mental Fatigue',
        cite: 'Malaguarnera et al. 2008',
        detail:
          'Acetyl-L-carnitine is the brain-permeable form of an amino acid the body uses to turn fat into usable energy. It shuttles fatty acids into the mitochondria &mdash; the cell&rsquo;s power plants &mdash; and donates acetyl groups for acetylcholine synthesis, fuelling neurons on two fronts. In controlled trials, mental fatigue dropped 35% and cognitive function rose 24%, which is why it features in the afternoon formula designed to beat the daily slump.',
      },
      {
        img: R + 'Lecithin.jpg',
        tag: 'Nootropic',
        name: 'Lecithin',
        benefit: 'Phosphatidylcholine rebuilds neuronal membranes.',
        stat: '+12%',
        metric: 'Verbal Memory',
        cite: 'Poly et al. 2011',
        detail:
          'Lecithin was first isolated from egg yolk by French chemist Maurice Gobley in 1846, who named it after the Greek word for yolk, &ldquo;lekithos.&rdquo; It supplies phosphatidylcholine, the phospholipid that keeps neuronal membranes fluid and flexible while feeding acetylcholine synthesis. Higher dietary choline intake tracks with measurably better verbal and visual memory &mdash; it is, quite literally, a building material for the brain.',
      },
    ],
  },
};

export const FORMULA_ORDER: Array<'flow' | 'clear'> = ['flow', 'clear'];
