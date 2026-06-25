// CONKA — "Real people. Real results." verified-review carousel data.
// Pure content. `product` drives the pill colour (see Reviews.module.css).

export type ReviewProduct = 'CONKA FLOW' | 'FLOW + CLEAR';

export interface Review {
  product: ReviewProduct;
  rating: string; // e.g. "5.0"
  headline: string;
  body: string;
  avatar: string;
  name: string;
}

export const REVIEWS: Review[] = [
  {
    product: 'CONKA FLOW',
    rating: '5.0',
    headline: 'Breaking the caffeine cycle',
    body: 'I was getting through the day on five coffees and still hitting a wall by 4pm. Sleep was terrible, the cycle just kept repeating. Swapped my afternoon coffees for Flow and the difference was immediate.',
    avatar: '/lander/reviews/PhilB.jpg',
    name: 'Phil B.',
  },
  {
    product: 'FLOW + CLEAR',
    rating: '5.0',
    headline: "There's only one way to know",
    body: "I think it's pretty easy to be sceptical of a product that says it can boost your brain in a shot. But the only way to test that scepticism was to try it for myself. And honestly, I'm glad I did.",
    avatar: '/lander/reviews/AnkitaK.jpg',
    name: 'Ankita K.',
  },
  {
    product: 'CONKA FLOW',
    rating: '5.0',
    headline: 'Locked in on long days',
    body: "I'm on calls all day for work, and Conka has been instrumental to staying focused and locked in on long days. I also test on the app a couple of times a week — a nice way to stop for a second.",
    avatar: '/lander/reviews/AlexL.jpg',
    name: 'Alex L.',
  },
  {
    product: 'FLOW + CLEAR',
    rating: '5.0',
    headline: 'The combo is unreal',
    body: 'Started taking both Flow and Clear together and the combo is unreal. Training performance is up, sleep quality is better, and I just feel more balanced overall.',
    avatar: '/lander/reviews/JackG.jpg',
    name: 'Jack G.',
  },
  {
    product: 'FLOW + CLEAR',
    rating: '5.0',
    headline: 'I was skeptical at first',
    body: 'I was skeptical at first, but Conka has made the world of difference to me over the last month. After a Flow in the morning the feeling is subtle, but about three minutes in my brain switches on.',
    avatar: '/lander/reviews/SamT.jpg',
    name: 'Sam T.',
  },
  {
    product: 'CONKA FLOW',
    rating: '5.0',
    headline: 'More than just recovery',
    body: "I started taking Conka to help recover after rugby tournaments. My body and brain weren't used to the contact and I needed something to reduce inflammation and get back on track cognitively.",
    avatar: '/lander/reviews/MillieH.jpg',
    name: 'Millie H.',
  },
  {
    product: 'FLOW + CLEAR',
    rating: '5.0',
    headline: 'Performance without the burnout',
    body: "I work in a high-performance environment with long hours, and I try to fit a lot into life outside work too. Staying focused all day isn't a nice-to-have — it's essential.",
    avatar: '/lander/reviews/AaronH.jpg',
    name: 'Aaron H.',
  },
];

export const REVIEW_COUNT = '622+';
