import { readFile } from "node:fs/promises";

import { Resvg } from "@resvg/resvg-js";
import satori, { type Font, type SatoriNode } from "satori";

import {
  CARD_FONTS,
  CARD_HEIGHT,
  CARD_WIDTH,
  fontPath,
  headlineCard,
  type HeadlineCardInput,
} from "../src/ts/card/_headlineCard.js";

/** Bluesky's per-image blob limit, in bytes. */
export const IMAGE_LIMIT = 1_000_000;

const FONT_FILES = Object.values(CARD_FONTS).map((font) => ({
  ...font,
  url: new URL(`../node_modules/${fontPath(font)}`, import.meta.url),
}));

let fonts: Promise<Font[]> | null = null;

/** Loads each font once per process. */
function loadFonts(): Promise<Font[]> {
  fonts ??= Promise.all(
    FONT_FILES.map(async ({ name, weight, url }) => ({
      name,
      weight,
      style: "normal" as const,
      data: await readFile(url),
    })),
  );
  return fonts;
}

/** Lays the card out as SVG. `onNodeDetected` reports each element's box, which the tests use to check the headline fits. */
export async function cardSvg(
  input: HeadlineCardInput,
  onNodeDetected?: (node: SatoriNode) => void,
): Promise<string> {
  return satori(headlineCard(input), {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: await loadFonts(),
    onNodeDetected,
  });
}

/** Renders the headline card to a PNG, and throws if it's too big for Bluesky. */
export async function renderCard(input: HeadlineCardInput): Promise<Buffer> {
  const svg = await cardSvg(input);
  const png = new Resvg(svg, { fitTo: { mode: "width", value: CARD_WIDTH } })
    .render()
    .asPng();

  if (png.byteLength > IMAGE_LIMIT)
    throw new Error(
      `Card is ${png.byteLength} bytes, over Bluesky's ${IMAGE_LIMIT}-byte image limit`,
    );
  return png;
}
