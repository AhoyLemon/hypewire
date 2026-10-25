import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

import { cardSvg } from "../scripts/_renderCard";
import {
  CARD_FONTS,
  CARD_HEIGHT,
  CARD_PADDING,
  CARD_WIDTH,
  fontPath,
  headlineSize,
  MAX_HEADLINE,
  missingGlyphs,
  SECTIONS,
} from "../src/ts/card/_headlineCard";
import { WORDMARK_SIZE, WORDMARK_SVG } from "../src/ts/card/_wordmark";
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

/** Text boxes that land outside the card's padding. Empty means the card fits. */
async function spills({ headline, structureId }: CardText): Promise<string[]> {
  const found: string[] = [];
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
        found.push(
          `${headline} (${headlineSize(headline)}px): "${node.textContent}" reaches ${Math.round(right)}×${Math.round(bottom)}`,
        );
    },
  );
  return found;
}

/** A title-case headline of real words, as close to `length` graphemes as whole words allow. */
function headlineOfLength(length: number): string {
  const words =
    "Divorced Dad of AI Garth Blatherwick on the Future of Meat Raffles".split(
      " ",
    );
  let headline = words[0];
  for (let i = 1; ; i++) {
    const next = `${headline} ${words[i % words.length]}`;
    if (graphemeLength(next) > length) return headline;
    headline = next;
  }
}

describe("headline card", () => {
  test("every structure has a section, and every section has a structure", () => {
    expect(Object.keys(SECTIONS).sort()).toEqual(
      corpus.structures.map((s) => s.id).sort(),
    );
  });

  test("the masthead wordmark matches the brand file, minus its title", () => {
    const brand = readFileSync(
      new URL("../src/img/brand/wordmark.svg", import.meta.url),
      "utf8",
    );
    expect(WORDMARK_SVG).toBe(
      brand.trim().replace(/<title[^>]*>[\s\S]*?<\/title>/, ""),
    );
    expect(WORDMARK_SVG).toContain(
      `viewBox="0 0 ${WORDMARK_SIZE.width} ${WORDMARK_SIZE.height}"`,
    );
  });

  test("the card draws the wordmark", async () => {
    const svg = await cardSvg({
      headline: "Study: 77% of Pigeons Are Actually AI",
      structureId: "study",
      date: "October 25, 2026",
    });
    expect(svg).toContain('href="data:image/svg+xml;base64,');
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
    const found: string[] = [];
    for (const card of longestPerSize()) found.push(...(await spills(card)));
    expect(found).toEqual([]);
  });

  test("a headline at the length cap still fits", async () => {
    const headline = headlineOfLength(MAX_HEADLINE);
    expect(graphemeLength(headline)).toBeGreaterThan(MAX_HEADLINE - 15);
    expect(await spills({ headline, structureId: "pullQuote" })).toEqual([]);
  });

  test("the spill check catches a headline that's too long", async () => {
    const headline = headlineOfLength(MAX_HEADLINE * 3);
    expect(
      (await spills({ headline, structureId: "pullQuote" })).length,
    ).toBeGreaterThan(0);
  });

  test("missingGlyphs flags what the latin subset can't draw, and nothing else", () => {
    expect(missingGlyphs("“Café” in Łódź 🤖")).toEqual(["Ł", "ź", "🤖"]);
  });
});
