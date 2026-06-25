// CONKA — "Trusted by the Best in the World." athlete testimonials.
// Pure content. `variant: 'navy'` renders the dark card (Josh Stanton in the prototype).

export interface Testimonial {
  image: string;
  name: string;
  role: string;
  quote: string;
  variant?: 'base' | 'navy';
}

export const TESTIMONIALS: Testimonial[] = [
  {
    image: '/lander/athletes/FraserDingwallNB.jpg',
    name: 'Fraser Dingwall',
    role: 'England Rugby Player',
    quote:
      '“I have loved using CONKA in my daily routine, especially tailoring which shot I take dependent on my training load, and being able to track progress using the app. Brain health is extremely important in rugby and I am enjoying feeling more focused and energised.”',
    variant: 'base',
  },
  {
    image: '/lander/athletes/JoshStantonNB.jpg',
    name: 'Josh Stanton',
    role: 'Professional Racing Driver',
    quote:
      '“When you are sat in a car you need to be in a calm state, but also you need to be aggressive. Really important to have this clarity of thought. The benefits CONKA gives me and knowing I have this edge is fantastic.”',
    variant: 'navy',
  },
  {
    image: '/lander/athletes/ChrisBillamSmithNB.jpg',
    name: 'Chris Billam-Smith',
    role: 'WBO Cruiserweight World Champion',
    quote:
      '“Helps with concentration and mental focus. It was a massive benefit for my last fight which needed a lot of focus against a big puncher.”',
    variant: 'base',
  },
];
