import { readFile } from "node:fs/promises";

import { Resvg } from "@resvg/resvg-js";
import satori, { type Font } from "satori";

import {
  CARD_FONTS,
  CARD_FORMATS,
  headlineCard,
  type HeadlineCardInput,
} from "../src/ts/card/_headlineCard.js";

/** Bluesky's per-image blob limit, in bytes. */
export const IMAGE_LIMIT = 1_000_000;

const fontFile = (pkg: string, file: string): URL =>
  new URL(`../node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url);

const FONT_FILES = [
  {
    ...CARD_FONTS.headline,
    url: fontFile("newsreader", "newsreader-latin-700-normal.woff"),
  },
  {
    ...CARD_FONTS.label,
    url: fontFile("inter", "inter-latin-800-normal.woff"),
  },
  { ...CARD_FONTS.meta, url: fontFile("inter", "inter-latin-500-normal.woff") },
];

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
  const { width, height } = CARD_FORMATS[input.format ?? "wide"];
  const svg = await satori(headlineCard(input), {
    width,
    height,
    fonts: await loadFonts(),
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: width } })
    .render()
    .asPng();

  if (png.byteLength > IMAGE_LIMIT)
    throw new Error(
      `Card is ${png.byteLength} bytes, over Bluesky's ${IMAGE_LIMIT}-byte image limit`,
    );
  return png;
}
