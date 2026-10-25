import { readFile } from "node:fs/promises";

import { Resvg } from "@resvg/resvg-js";
import satori, { type Font } from "satori";

import {
  CARD_FONTS,
  CARD_HEIGHT,
  CARD_WIDTH,
  headlineCard,
  type HeadlineCardInput,
} from "../src/ts/card/_headlineCard.js";

/** Bluesky's per-image blob limit, in bytes. */
export const IMAGE_LIMIT = 1_000_000;

/** The Fontsource file for a card font, named from its family and weight so the two can't drift apart. */
const fontFile = ({ name, weight }: { name: string; weight: number }): URL => {
  const pkg = name.toLowerCase();
  return new URL(
    `../node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff`,
    import.meta.url,
  );
};

const FONT_FILES = Object.values(CARD_FONTS).map((font) => ({
  ...font,
  url: fontFile(font),
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

/** Renders the headline card to a PNG, and throws if it's too big for Bluesky. */
export async function renderCard(input: HeadlineCardInput): Promise<Buffer> {
  const svg = await satori(headlineCard(input), {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: await loadFonts(),
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: CARD_WIDTH } })
    .render()
    .asPng();

  if (png.byteLength > IMAGE_LIMIT)
    throw new Error(
      `Card is ${png.byteLength} bytes, over Bluesky's ${IMAGE_LIMIT}-byte image limit`,
    );
  return png;
}
