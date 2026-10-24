import { describe, expect, test } from "bun:test";

import { ELLIPSIS, fitPost, POST_LIMIT } from "../src/ts/engine/_truncate";
import { graphemeLength } from "../src/ts/lib/graphemes";

const headline = "AI Could Mean The End of the Casserole";

/** The limit that leaves exactly `budget` graphemes for the excerpt (before the ellipsis). */
const limitFor = (budget: number): number => graphemeLength(headline) + 2 + 1 + budget;

describe("fitPost", () => {
  test("never exceeds the limit, keeps the headline whole, and ends with an ellipsis", () => {
    const { text } = fitPost(headline, "word ".repeat(200));
    expect(graphemeLength(text)).toBeLessThanOrEqual(POST_LIMIT);
    expect(text.startsWith(`${headline}\n\n`)).toBe(true);
    expect(text.endsWith(ELLIPSIS)).toBe(true);
  });

  test("backs up to the last whole word instead of cutting one in half", () => {
    expect(fitPost(headline, "alpha beta gamma delta", limitFor(13)).excerpt).toBe("alpha beta…");
  });

  test("keeps a word that ends exactly at the budget", () => {
    expect(fitPost(headline, "alpha beta gamma delta", limitFor(10)).excerpt).toBe("alpha beta…");
  });

  test("strips trailing punctuation before the ellipsis", () => {
    expect(fitPost(headline, "It's coming anyway. More words here", limitFor(20)).excerpt).toBe("It's coming anyway…");
    expect(fitPost(headline, "says Brock Mulch, “and then", limitFor(18)).excerpt).toBe("says Brock Mulch…");
  });

  test("keeps closing quotes", () => {
    expect(fitPost(headline, "“It's inevitable.” Later words", limitFor(18)).excerpt).toBe("“It's inevitable.”…");
  });

  test("adds an ellipsis even when the whole excerpt fits", () => {
    expect(fitPost(headline, "Experts are divided.").excerpt).toBe("Experts are divided…");
  });

  test("counts emoji as single graphemes", () => {
    const { text } = fitPost(headline, "👨‍👩‍👧‍👦 ".repeat(300));
    expect(graphemeLength(text)).toBeLessThanOrEqual(POST_LIMIT);
  });

  test("throws when the headline alone can't fit", () => {
    expect(() => fitPost("x".repeat(POST_LIMIT), "excerpt")).toThrow();
  });
});
