import type { Subject } from "../engine/_types.js";

// `plural` drives It/Them and Is/Are. `activity` unlocks "Vibe-{activity}". `inline` overrides the lowercased mid-sentence form (proper nouns, mostly).

const hobbies: Subject[] = [
  { name: "Barbershop Quartets", plural: true, activity: "Harmonizing" },
  { name: "Competitive Yodeling", activity: "Yodeling" },
  { name: "Ham Radio" },
  { name: "Quilting Bees", plural: true, activity: "Quilting" },
  { name: "Ventriloquism", activity: "Ventriloquism" },
  { name: "Bowling Leagues", plural: true, activity: "Bowling" },
  { name: "Pen Pals", plural: true },
  { name: "Whittling", activity: "Whittling" },
  { name: "Taxidermy", activity: "Taxidermy" },
  { name: "the Polka", activity: "Polka" },
  { name: "Cribbage", activity: "Cribbage" },
  { name: "Mime", activity: "Miming" },
  { name: "Renaissance Faires", plural: true, inline: "Renaissance Faires" },
  { name: "Model Trains", plural: true, activity: "Model Railroading" },
  { name: "the Accordion", activity: "Accordion" },
  { name: "Birdwatching", activity: "Birdwatching" },
  { name: "Synchronized Swimming", activity: "Synchronized Swimming" },
  { name: "Scrapbooking", activity: "Scrapbooking" },
];

const food: Subject[] = [
  { name: "Gingerbread Cookies", plural: true, activity: "Baking" },
  { name: "the Casserole" },
  { name: "the Jell-O Salad", inline: "the Jell-O salad" },
  { name: "Sourdough Starters", plural: true },
  { name: "the Potluck" },
  { name: "Grandma's Lasagna", inline: "Grandma's lasagna" },
  { name: "Napkins", plural: true },
  { name: "the Deviled Egg" },
  { name: "Fruitcake" },
  { name: "Latte Art", activity: "Latte Art" },
];

const rituals: Subject[] = [
  { name: "Small Talk" },
  { name: "the Handshake" },
  { name: "Thank-You Notes", plural: true },
  { name: "the Office Birthday Card" },
  { name: "Leaving a Voicemail" },
  { name: "Eye Contact" },
  { name: "Monogamous Relationships", plural: true },
  { name: "the Group Chat" },
  { name: "the Wedding Toast" },
  { name: "Brunch" },
];

const abstractNouns: Subject[] = [
  { name: "Boredom" },
  { name: "the Awkward Silence" },
  { name: "Sincerity" },
  { name: "the Sunday Scaries", plural: true, inline: "the Sunday scaries" },
  { name: "Dignity" },
  { name: "the Inside Joke" },
  { name: "Nostalgia" },
  { name: "Patience" },
  { name: "the Guilty Pleasure" },
];

// Rare on purpose, so it reads as an occasional bit for Midwesterners.
const hometown: Subject[] = [
  { name: "Hot Dish", weight: 0.3 },
  { name: "Ice Fishing", activity: "Ice Fishing", weight: 0.3 },
  {
    name: "the Minnesota Goodbye",
    inline: "the Minnesota goodbye",
    weight: 0.3,
  },
  { name: "Lutefisk", weight: 0.3 },
  { name: "Meat Raffles", plural: true, weight: 0.3 },
  { name: "Duck Duck Gray Duck", inline: "Duck Duck Gray Duck", weight: 0.3 },
  { name: "the Juicy Lucy", inline: "the Juicy Lucy", weight: 0.3 },
  { name: "the State Fair", inline: "the State Fair", weight: 0.3 },
];

export const subjects: Subject[] = [
  ...hobbies,
  ...food,
  ...rituals,
  ...abstractNouns,
  ...hometown,
];
