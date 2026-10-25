import { graphemeLength, splitGraphemes } from "../lib/graphemes.js";

export const POST_LIMIT = 300;
export const ELLIPSIS = "…";

/** Punctuation that looks wrong right before an ellipsis. Closing quotes stay. */
const TRAILING_JUNK = /[\s.,;:!?\-–—“‘(]+$/u;

/** Cuts text to at most `budget` graphemes, backing up to the last whole word. */
function cutToWord(text: string, budget: number): string {
  const chars = splitGraphemes(text);
  if (chars.length <= budget) return text;

  const sliced = chars.slice(0, budget).join("");
  if (/\s/.test(chars[budget])) return sliced;

  const lastSpace = sliced.search(/\s\S*$/);
  return lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced;
}

/**
 * Cuts the excerpt to fit the post on its own, since the headline goes in the image. The excerpt runs until it hits the limit, then ends with an ellipsis, even when it would have fit, so every post reads like a news summary.
 */
export function fitExcerpt(excerpt: string, limit: number = POST_LIMIT): string {
  const budget = limit - graphemeLength(ELLIPSIS);
  const cut = cutToWord(excerpt.trim(), budget).replace(TRAILING_JUNK, "");
  return cut + ELLIPSIS;
}
