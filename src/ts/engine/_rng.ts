/** A random number source in [0, 1), same shape as Math.random. */
export type Rng = () => number;

/** mulberry32: tiny, fast, and good enough to make a seed reproduce the same post. */
export function seededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A fresh 32-bit seed, so unseeded runs can still be reproduced from their logged seed. */
export function randomSeed(): number {
  return Math.floor(Math.random() * 4294967296);
}

/** Picks one item, where heavier items are proportionally more likely. Weights default to 1. */
export function pickWeighted<T>(items: readonly T[], weightOf: (item: T) => number, rng: Rng): T {
  if (items.length === 0) throw new Error("pickWeighted called with an empty list");

  const total = items.reduce((sum, item) => sum + weightOf(item), 0);
  let roll = rng() * total;
  for (const item of items) {
    roll -= weightOf(item);
    if (roll < 0) return item;
  }
  return items[items.length - 1];
}

/** A whole number from min to max, inclusive. */
export function randomInt(min: number, max: number, rng: Rng): number {
  return min + Math.floor(rng() * (max - min + 1));
}
