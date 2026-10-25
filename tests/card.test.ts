import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";

import { cardSvg } from "../scripts/_renderCard";
import {
  CARD_FONTS,
  CARD_HEIGHT,
  CARD_PADDING,
  CARD_WIDTH,
  fontPath,
  headlineSize,
  SECTIONS,
} from "../src/ts/card/_headlineCard";
import { corpus } from "../src/ts/corpus/_corpus";
import { generate } from "../src/ts/engine/_generate";
import { graphemeLength } from "../src/ts/lib/graphemes";

const SEEDS_PER_STRUCTURE = 1_000;

interface CardText {
  headline: string;
  structureId: string;
}

/** The longest headline at each font size across a sweep of every structure, since those are the likeliest to spill out of the card. */
function longestPerSize(): CardText[] {
  const longest = new Map<number, CardText>();
  for (const structure of corpus.structures) {
    for (let seed = 1; seed <= SEEDS_PER_STRUCTURE; seed++) {
      const { headline } = generate(corpus, {
        seed,
        structureId: structure.id,
      });
      const size = headlineSize(headline);
      const current = longest.get(size);
      if (
        !current ||
        graphemeLength(headline) > graphemeLength(current.headline)
      )
        longest.set(size, { headline, structureId: structure.id });
    }
  }
  return [...longest.values()];
}

describe("headline card", () => {
  test("every structure has a section, and every section has a structure", () => {
    expect(Object.keys(SECTIONS).sort()).toEqual(
      corpus.structures.map((s) => s.id).sort(),
    );
  });

  test("every card font has a Fontsource file installed", () => {
    const missing = Object.values(CARD_FONTS)
      .map(fontPath)
      .filter(
        (file) =>
          !existsSync(new URL(`../node_modules/${file}`, import.meta.url)),
      );
    expect(missing).toEqual([]);
  });

  test("the longest headline at each font size stays inside the card's padding", async () => {
    const spills: string[] = [];
    for (const { headline, structureId } of longestPerSize()) {
      // The widest month, so the date is at its longest too.
      await cardSvg(
        { headline, structureId, date: "September 30, 2026" },
        (node) => {
          if (!node.textContent) return;
          const right = node.left + node.width;
          const bottom = node.top + node.height;
          if (
            right > CARD_WIDTH - CARD_PADDING.right ||
            bottom > CARD_HEIGHT - CARD_PADDING.bottom
          )
            spills.push(
              `${headline} (${headlineSize(headline)}px): "${node.textContent}" reaches ${Math.round(right)}×${Math.round(bottom)}`,
            );
        },
      );
    }
    expect(spills).toEqual([]);
  });
});
