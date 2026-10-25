import type { Ref } from "vue";

import type { Font } from "satori";

import {
  CARD_FONTS,
  CARD_HEIGHT,
  CARD_WIDTH,
  fontPath,
  headlineCard,
  printDate,
} from "../card/_headlineCard.js";
import type { GeneratedPost } from "../engine/_generate.js";

// Vue is loaded from a CDN <script> in _javascripts.pug, not bundled.
declare const Vue: typeof import("vue");

/** Where cards show: the single preview, or the batch of 20. */
export type CardSlot = "preview" | "batch";

export interface Cards {
  /** Rendered cards as image URLs, by `cardKey`. */
  cards: Ref<Record<string, string>>;
  cardError: Ref<string>;
  cardKey: (post: GeneratedPost) => string;
  /** Renders a slot's cards, replacing whatever that slot showed before. */
  renderCards: (slot: CardSlot, posts: GeneratedPost[]) => Promise<void>;
}

/** The structure and headline are the only parts of a post that change its card. */
const cardKey = (post: GeneratedPost): string =>
  `${post.debug.structureId}|${post.headline}`;

let fonts: Promise<Font[]> | null = null;

/** Fetches each font once, through the import map. A failed fetch is forgotten so the next render retries. */
function loadFonts(): Promise<Font[]> {
  fonts ??= Promise.all(
    Object.values(CARD_FONTS).map(async (font) => {
      const response = await fetch(import.meta.resolve(fontPath(font)));
      if (!response.ok)
        throw new Error(
          `${font.name} ${font.weight} returned ${response.status}`,
        );
      return {
        ...font,
        style: "normal" as const,
        data: await response.arrayBuffer(),
      };
    }),
  ).catch((err) => {
    fonts = null;
    throw err;
  });
  return fonts;
}

async function renderSvg(post: GeneratedPost, date: string): Promise<string> {
  // Imported on demand, so a CDN hiccup costs the cards instead of the whole workbench.
  const { default: satori } = await import("satori");
  return satori(
    headlineCard({
      headline: post.headline,
      structureId: post.debug.structureId,
      date,
    }),
    { width: CARD_WIDTH, height: CARD_HEIGHT, fonts: await loadFonts() },
  );
}

/** Renders the same headline card the post script does, as SVG, which is what the PNG is rasterized from. */
export function useCards(): Cards {
  const { ref } = Vue;
  const cards = ref<Record<string, string>>({});
  const cardError = ref("");
  const date = printDate(new Date());
  const runs: Record<CardSlot, number> = { preview: 0, batch: 0 };
  const shown: Record<CardSlot, Set<string>> = {
    preview: new Set(),
    batch: new Set(),
  };

  async function renderCards(
    slot: CardSlot,
    posts: GeneratedPost[],
  ): Promise<void> {
    const run = ++runs[slot];
    // A newer call for the same slot takes over, so a stale batch stops tying up the main thread.
    const superseded = (): boolean => run !== runs[slot];

    shown[slot] = new Set(posts.map(cardKey));
    for (const key of Object.keys(cards.value))
      if (!shown.preview.has(key) && !shown.batch.has(key))
        delete cards.value[key];

    for (const post of posts) {
      if (superseded()) return;
      const key = cardKey(post);
      if (cards.value[key]) continue;
      try {
        const svg = await renderSvg(post, date);
        if (superseded()) return;
        cards.value[key] =
          `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        cardError.value = "";
      } catch (err) {
        console.warn("Headline card failed:", err);
        cardError.value = `Couldn't render the headline image: ${err instanceof Error ? err.message : err}`;
        return;
      }
    }
  }

  return { cards, cardError, cardKey, renderCards };
}
