import { describe, expect, test } from "bun:test";

import { ELLIPSIS, fitExcerpt, POST_LIMIT } from "../src/ts/engine/_truncate";
import { graphemeLength } from "../src/ts/lib/graphemes";

/** The limit that leaves exactly `budget` graphemes for the excerpt (before the ellipsis). */
const limitFor = (budget: number): number => budget + 1;

describe("fitExcerpt", () => {
  test("never exceeds the limit and ends with an ellipsis", () => {
    const excerpt = fitExcerpt("word ".repeat(200));
    expect(graphemeLength(excerpt)).toBeLessThanOrEqual(POST_LIMIT);
    expect(excerpt.endsWith(ELLIPSIS)).toBe(true);
  });

  test("backs up to the last whole word instead of cutting one in half", () => {
    expect(fitExcerpt("alpha beta gamma delta", limitFor(13))).toBe(
      "alpha beta…",
    );
  });

  test("keeps a word that ends exactly at the budget", () => {
    expect(fitExcerpt("alpha beta gamma delta", limitFor(10))).toBe(
      "alpha beta…",
    );
  });

  test("strips trailing punctuation before the ellipsis", () => {
    expect(
      fitExcerpt("It's coming anyway. More words here", limitFor(20)),
    ).toBe("It's coming anyway…");
    expect(fitExcerpt("says Brock Mulch, “and then", limitFor(18))).toBe(
      "says Brock Mulch…",
    );
  });

  test("keeps closing quotes", () => {
    expect(fitExcerpt("“It's inevitable.” Later words", limitFor(18))).toBe(
      "“It's inevitable.”…",
    );
  });

  test("adds an ellipsis even when the whole excerpt fits", () => {
    expect(fitExcerpt("Experts are divided.")).toBe("Experts are divided…");
  });

  test("counts emoji as single graphemes", () => {
    const excerpt = fitExcerpt("👨‍👩‍👧‍👦 ".repeat(300));
    expect(graphemeLength(excerpt)).toBeLessThanOrEqual(POST_LIMIT);
  });
});
